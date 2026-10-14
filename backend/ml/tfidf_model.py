from typing import List, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from ..services.text_preprocessor import preprocess_for_tfidf

class TFIDFEngine:
    def __init__(self, ngram_range: Tuple[int, int] = (1, 2), max_features: int = 5000):
        self.vectorizer = TfidfVectorizer(
            ngram_range=ngram_range,
            max_features=max_features,
            sublinear_tf=True,
            strip_accents="unicode",
            lowercase=True,
            stop_words="english"
        )
        self.is_fitted = False

    def fit_transform(self, documents: List[str]):
        """Fits the vectorizer on document corpus and returns the TF-IDF sparse matrix."""
        cleaned_docs = [preprocess_for_tfidf(doc) for doc in documents]
        matrix = self.vectorizer.fit_transform(cleaned_docs)
        self.is_fitted = True
        return matrix

    def transform(self, documents: List[str]):
        """Transforms documents into TF-IDF vector matrix using fitted vocabulary."""
        cleaned_docs = [preprocess_for_tfidf(doc) for doc in documents]
        if not self.is_fitted:
            return self.fit_transform(cleaned_docs)
        return self.vectorizer.transform(cleaned_docs)

    def extract_top_keywords(self, text: str, top_n: int = 10) -> List[Tuple[str, float]]:
        """
        Extracts top significant keywords and their TF-IDF weights from text.
        """
        if not text or not text.strip():
            return []

        cleaned = preprocess_for_tfidf(text)
        if not cleaned:
            return []

        # Fit on this single document / query
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
