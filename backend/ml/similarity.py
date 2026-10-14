from typing import List, Set, Tuple, Optional
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .tfidf_model import tfidf_engine
from ..config import Config

class SimilarityCalculator:
    def __init__(self):
        self.weights = Config.RECOMMENDATION_WEIGHTS

    def compute_cosine_similarity(self, text_a: str, text_b: str) -> float:
        """
        Computes cosine similarity between two text strings using the global fitted TF-IDF representation.
        cos(A, B) = (A · B) / (||A|| × ||B||)
        Returns a score between 0.0 and 1.0.
        """
        if not text_a or not text_b or not text_a.strip() or not text_b.strip():
            return 0.0

        try:
            # Transform documents using global corpus vocabulary
            tfidf_matrix = tfidf_engine.transform([text_a, text_b])
            sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
            score = float(sim_matrix[0][0])
            return max(0.0, min(1.0, score))
        except Exception as e:
            print(f"Error computing cosine similarity: {e}")
            return 0.0

    def compute_dense_semantic_similarity(self, text_a: str, text_b: str) -> float:
        """
        Computes dense semantic cosine similarity using Latent Semantic Analysis (LSA).
        Overcomes surface-level vocabulary mismatch without relying on external cloud APIs.
        """
        if not text_a or not text_b or not text_a.strip() or not text_b.strip():
            return 0.0

        try:
            dense_vectors = tfidf_engine.transform_dense([text_a, text_b])
            sim_matrix = cosine_similarity(dense_vectors[0:1], dense_vectors[1:2])
            score = float(sim_matrix[0][0])
            return max(0.0, min(1.0, score))
        except Exception as e:
            print(f"Error computing dense semantic similarity: {e}")
            return 0.0

    def compute_skill_coverage(self, resume_skills: List[str], job_skills: List[str]) -> float:
        """
        Calculates skill coverage ratio:
        coverage(R, j) = |S(R) ∩ S(j)| / |S(j)|
        """
        if not job_skills:
            return 1.0

        norm_resume = {s.lower().strip() for s in resume_skills if s}
        norm_job = {s.lower().strip() for s in job_skills if s}

        if not norm_job:
            return 1.0

        matched_count = len(norm_resume.intersection(norm_job))
        return matched_count / len(norm_job)

    def compute_skill_jaccard(self, set_a: Set[str], set_b: Set[str]) -> float:
        """
        Computes Jaccard Similarity coefficient between two sets of skills.
        J(A, B) = |A ∩ B| / |A ∪ B|
        """
        if not set_a or not set_b:
            return 0.0

        intersection = set_a.intersection(set_b)
        union = set_a.union(set_b)

        if not union:
            return 0.0

        return len(intersection) / len(union)

    def compute_hybrid_match(
        self,
        resume_text: str,
        job_text: str,
        resume_skills: List[str],
        job_skills: List[str],
        w1: Optional[float] = None,
        w2: Optional[float] = None,
        use_dense_lsa: bool = False
    ) -> Tuple[float, float, float]:
        """
        Computes the hybrid match score defined in Section 7.4 of the research paper:
        match(R, j) = w1 * cos(R, j) + w2 * coverage(R, j), with w1 = 0.55, w2 = 0.45

        Returns: (overall_match_percentage, cosine_sim_pct, skill_coverage_pct)
        """
        # 1. Similarity computation (classical TF-IDF or enhanced LSA dense vectors)
        if use_dense_lsa:
            text_sim = self.compute_dense_semantic_similarity(resume_text, job_text)
        else:
            text_sim = self.compute_cosine_similarity(resume_text, job_text)

        # 2. Skill coverage calculation
        skill_coverage = self.compute_skill_coverage(resume_skills, job_skills)

        # 3. Weighted hybrid combination
        alpha = w1 if w1 is not None else self.weights.get("tfidf_cosine", 0.55)
        beta = w2 if w2 is not None else self.weights.get("skill_overlap", 0.45)

        hybrid_score = (alpha * text_sim) + (beta * skill_coverage)

        # Score calibration (scaled 0-100)
        scaled_score = min(99.0, max(15.0, hybrid_score * 100.0))
        if skill_coverage >= 0.85 and scaled_score < 90.0:
            scaled_score = min(96.0, scaled_score + 10.0)

        return (
            round(scaled_score, 1),
            round(text_sim * 100.0, 1),
            round(skill_coverage * 100.0, 1)
        )

# Global singleton
similarity_calculator = SimilarityCalculator()
