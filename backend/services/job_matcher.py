from typing import Dict, List, Any
from .skill_extractor import skill_extractor
from ..ml.similarity import similarity_calculator
from ..ml.tfidf_model import tfidf_engine

class JobMatcher:
    def match_resume_to_job(
        self,
        resume_text: str,
        resume_skills: List[str],
        job_title: str,
        job_description: str,
        job_required_skills: List[str] = None
    ) -> Dict[str, Any]:
        """
        Performs AI matching between a candidate's resume and a specific job posting.
        """
        # If job skills aren't explicitly provided, extract them from job description
        if not job_required_skills or len(job_required_skills) == 0:
            extracted_job_skills_cat = skill_extractor.extract_skills(f"{job_title} {job_description}")
            job_required_skills = skill_extractor.get_all_flat_skills(extracted_job_skills_cat)

        # In case job skills are still empty, extract top nouns/tech keywords
        if not job_required_skills:
            kw_tuples = tfidf_engine.extract_top_keywords(job_description, top_n=6)
            job_required_skills = [kw[0].title() for kw in kw_tuples]

        # Skill comparison
        skill_comparison = skill_extractor.compare_skills(resume_skills, job_required_skills)
        matched_skills = skill_comparison["matched_skills"]
        missing_skills = skill_comparison["missing_skills"]

        # Compute hybrid similarity & cosine similarity
        full_job_text = f"{job_title}\n{job_description}\n{' '.join(job_required_skills)}"
        overall_score, cosine_pct, skill_pct = similarity_calculator.compute_hybrid_match(
            resume_text=resume_text,
            job_text=full_job_text,
            resume_skills=resume_skills,
            job_skills=job_required_skills
        )

        # Extract top keywords from job description
        keywords_tuples = tfidf_engine.extract_top_keywords(job_description, top_n=8)
        keywords = [k[0] for k in keywords_tuples]

        # Generate contextual rationale
        rationale = self._generate_rationale(
            job_title=job_title,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            overall_score=overall_score
        )

        return {
            "job_title": job_title,
            "overall_match_score": overall_score,
            "cosine_similarity": cosine_pct,
            "skill_match_percentage": skill_pct,
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
            "total_job_skills": job_required_skills,
            "relevant_keywords": keywords,
            "rationale": rationale
        }

    def _generate_rationale(
        self,
        job_title: str,
        matched_skills: List[str],
        missing_skills: List[str],
        overall_score: float
    ) -> str:
        if overall_score >= 80:
            if matched_skills:
                skills_str = ", ".join(matched_skills[:4])
                return f"High Match: Your profile demonstrates strong proficiency in {skills_str}, aligning closely with the core demands for {job_title}."
            return f"Strong Match: Your overall background and technical keywords closely match the specifications for {job_title}."
        elif overall_score >= 60:
            matched_str = ", ".join(matched_skills[:3]) if matched_skills else "general competencies"
            missing_str = ", ".join(missing_skills[:2]) if missing_skills else "advanced tools"
            return f"Moderate Match: Good overlap in {matched_str}. Acquiring proficiency in {missing_str} will substantially strengthen your fit for {job_title}."
        else:
            missing_str = ", ".join(missing_skills[:3]) if missing_skills else "key prerequisites"
            return f"Skill Gap: To qualify for {job_title}, consider gaining project experience with {missing_str}."

# Global singleton
job_matcher = JobMatcher()
