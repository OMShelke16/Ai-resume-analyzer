from typing import List, Set, Tuple
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from .tfidf_model import tfidf_engine
from ..config import Config

class SimilarityCalculator:
    def __init__(self):
        self.weights = Config.RECOMMENDATION_WEIGHTS

    def compute_cosine_similarity(self, text_a: str, text_b: str) -> float:
        """
        Computes cosine similarity between two text strings using TF-IDF representation.
        Returns a score between 0.0 and 1.0.
        """
        if not text_a or not text_b:
            return 0.0

        try:
            tfidf_matrix = tfidf_engine.fit_transform([text_a, text_b])
            sim_matrix = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])
            score = float(sim_matrix[0][0])
            return max(0.0, min(1.0, score))
        except Exception as e:
            print(f"Error computing cosine similarity: {e}")
            return 0.0

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
        job_skills: List[str]
    ) -> Tuple[float, float, float]:
        """
        Computes hybrid similarity combining:
        1. TF-IDF Text Cosine Similarity (semantic & contextual match)
        2. Direct Skill Overlap / Jaccard score (exact skill requirements)

        Returns: (overall_match_percentage, cosine_sim_pct, skill_overlap_pct)
        """
        # 1. Cosine similarity
        cosine_sim = self.compute_cosine_similarity(resume_text, job_text)

        # 2. Skill overlap calculation
        norm_resume_skills = {s.lower().strip() for s in resume_skills if s}
        norm_job_skills = {s.lower().strip() for s in job_skills if s}

        if len(norm_job_skills) > 0:
            matched_count = len(norm_resume_skills.intersection(norm_job_skills))
            # Ratio of job requirements satisfied
            skill_ratio = matched_count / len(norm_job_skills)
        else:
            skill_ratio = cosine_sim

        # 3. Weighted hybrid combination
        alpha = self.weights.get("tfidf_cosine", 0.55)
        beta = self.weights.get("skill_overlap", 0.45)

        hybrid_score = (alpha * cosine_sim) + (beta * skill_ratio)

        # Non-linear scaling for better candidate calibration (prevents 0% for partial overlaps)
        scaled_score = min(98.0, max(15.0, hybrid_score * 100.0))
        
        # If skills overlap is 100%, grant a high score boost
        if skill_ratio >= 0.9 and scaled_score < 90.0:
            scaled_score = min(96.0, scaled_score + 10.0)

        return (
            round(scaled_score, 1),
            round(cosine_sim * 100.0, 1),
            round(skill_ratio * 100.0, 1)
        )

# Global singleton
similarity_calculator = SimilarityCalculator()
