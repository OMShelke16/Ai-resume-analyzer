import os
import csv
from typing import List, Tuple, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import TruncatedSVD
from ..services.text_preprocessor import preprocess_for_tfidf
from ..config import Config

class TFIDFEngine:
    """
    Production-grade, offline Machine Learning text representation engine.
    Computes both:
    1. Classical TF-IDF Vector Space representations with sublinear term-frequency scaling and L2 normalization.
    2. Dense Semantic Latent Semantic Analysis (LSA via TruncatedSVD) embeddings for synonym and semantic generalization.
    """
    def __init__(self, ngram_range: Tuple[int, int] = (1, 2), max_features: int = 8000, lsa_components: int = 60):
        self.ngram_range = ngram_range
        self.max_features = max_features
        self.lsa_components = lsa_components
        
        self.vectorizer = TfidfVectorizer(
            ngram_range=ngram_range,
            max_features=max_features,
            sublinear_tf=True,
            strip_accents="unicode",
            lowercase=True,
            stop_words="english"
        )
        self.lsa_model = TruncatedSVD(n_components=lsa_components, random_state=42)
        self.is_fitted = False
        self.is_lsa_fitted = False

    def build_default_corpus(self) -> List[str]:
        """Loads and cleans job corpus and skills taxonomy text for global fitting."""
        corpus = []
        csv_path = Config.JOBS_CSV_PATH
        if os.path.exists(csv_path):
            try:
                with open(csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        title = row.get("title", "")
                        desc = row.get("description", "")
                        skills = row.get("skills", "")
                        cat = row.get("category", "")
                        doc = f"{title} {cat} {skills} {desc}"
                        corpus.append(preprocess_for_tfidf(doc))
            except Exception as e:
                print(f"Error loading corpus for TF-IDF initialization: {e}")

        # Add domain fallback if dataset is small
        if len(corpus) < 10:
            corpus.extend([
                "python flask django fastAPI backend rest api sql postgresql docker kubernetes",
                "react javascript typescript html css frontend redux next.js ui web development",
                "machine learning data science deep learning pytorch tensorflow scikit-learn pandas numpy",
                "devops cloud aws terraform linux ci/cd kubernetes docker automated deployment",
                "data engineer spark kafka airflow sql data warehouse etl big data pipeline"
            ])
        return corpus

    def ensure_fitted(self):
        """Ensures the global TF-IDF and LSA models are trained on the corpus."""
        if not self.is_fitted:
            corpus = self.build_default_corpus()
            self.fit_corpus(corpus)

    def fit_corpus(self, documents: List[str]):
        """Fits the global vocabulary on a full document corpus."""
        cleaned_docs = [preprocess_for_tfidf(doc) for doc in documents if doc and doc.strip()]
        if not cleaned_docs:
            return

        self.vectorizer.fit(cleaned_docs)
        self.is_fitted = True

        # Fit LSA if sufficient documents
        n_comp = min(self.lsa_components, len(cleaned_docs) - 1, len(self.vectorizer.vocabulary_) - 1)
        if n_comp >= 5:
            tfidf_mat = self.vectorizer.transform(cleaned_docs)
            self.lsa_model = TruncatedSVD(n_components=n_comp, random_state=42)
            self.lsa_model.fit(tfidf_mat)
            self.is_lsa_fitted = True

    def transform(self, documents: List[str]):
        """Transforms documents into sparse TF-IDF feature matrix."""
        self.ensure_fitted()
        cleaned_docs = [preprocess_for_tfidf(doc) for doc in documents]
        return self.vectorizer.transform(cleaned_docs)

    def transform_dense(self, documents: List[str]) -> np.ndarray:
        """Transforms documents into dense LSA semantic embeddings."""
        self.ensure_fitted()
        sparse_mat = self.transform(documents)
        if self.is_lsa_fitted:
            dense_mat = self.lsa_model.transform(sparse_mat)
            # L2 normalize dense embeddings
            norms = np.linalg.norm(dense_mat, axis=1, keepdims=True)
            norms[norms == 0] = 1.0
            return dense_mat / norms
        # Fallback to dense tfidf
        arr = sparse_mat.toarray()
        norms = np.linalg.norm(arr, axis=1, keepdims=True)
        norms[norms == 0] = 1.0
        return arr / norms

    def extract_top_keywords(self, text: str, top_n: int = 10) -> List[Tuple[str, float]]:
        """
        Extracts top significant keywords and their TF-IDF weights from text.
        """
        if not text or not text.strip():
            return []

        cleaned = preprocess_for_tfidf(text)
        if not cleaned:
            return []

        vec = TfidfVectorizer(ngram_range=(1, 2), stop_words="english")
        try:
            tfidf_mat = vec.fit_transform([cleaned])
            feature_names = vec.get_feature_names_out()
            scores = tfidf_mat.toarray()[0]
            
            top_indices = np.argsort(scores)[::-1][:top_n]
            return [(feature_names[i], round(float(scores[i]), 3)) for i in top_indices if scores[i] > 0]
        except Exception:
            return []

# Global TF-IDF engine singleton
tfidf_engine = TFIDFEngine()
