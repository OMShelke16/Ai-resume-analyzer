import re
from typing import Dict, List, Any
from ..config import Config
from .skill_extractor import skill_extractor

# High-impact resume action verbs
ACTION_VERBS = {
    "developed", "built", "implemented", "designed", "architected", "engineered",
    "optimized", "deployed", "integrated", "automated", "created", "led", "managed",
    "improved", "analyzed", "reduced", "scaled", "collaborated", "orchestrated",
    "refactored", "tested", "maintained", "configured", "launched", "spearheaded"
}

class ResumeScorer:
    def __init__(self):
        self.weights = Config.SCORING_WEIGHTS

    def calculate_score(self, parsed_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculates an academic AI resume Analyzer score based on structured parsing metrics.
        Returns overall score (0-100), weighted components, ATS compatibility scores, strengths, weaknesses, and recommendations.
        """
        raw_text = parsed_data.get("raw_text", "")
        skills_dict = parsed_data.get("skills", {})
        flat_skills = skill_extractor.get_all_flat_skills(skills_dict)
        
        education = parsed_data.get("education", [])
        experience = parsed_data.get("experience", [])
        projects = parsed_data.get("projects", [])
        
        name = parsed_data.get("candidate_name", "Not detected")
        email = parsed_data.get("email", "Not detected")
        phone = parsed_data.get("phone", "Not detected")
        
        # 1. Skills Match Score (0 - 100)
        # Higher score for diverse technical skills across multiple categories
        skill_count = len(flat_skills)
        cat_diversity = sum(1 for cat, s_list in skills_dict.items() if len(s_list) > 0 and cat != "soft_skills")
        
        skills_score = min(100.0, (min(skill_count, 15) / 15.0 * 65.0) + (min(cat_diversity, 5) / 5.0 * 35.0))
        
        # 2. Experience Score (0 - 100)
        exp_score = 0.0
        if len(experience) >= 2:
            exp_score = 90.0
        elif len(experience) == 1:
            resp_count = len(experience[0].get("responsibilities", []))
            exp_score = 75.0 if resp_count >= 2 else 60.0
        else:
            # Entry level/fresh graduate with strong projects gets partial credit
            exp_score = 45.0 if len(projects) >= 2 else 30.0
            
        # 3. Projects Score (0 - 100)
        proj_score = 0.0
        if len(projects) >= 3:
            proj_score = 95.0
        elif len(projects) == 2:
            proj_score = 82.0
        elif len(projects) == 1:
            proj_score = 65.0
        else:
            proj_score = 30.0

        # Check for quantitative impact in projects or text (e.g. %, ms, X users, numbers)
        has_metrics = bool(re.search(r"\b\d+%\b|\b\d+\s*(?:ms|sec|users|clients|requests|x|k|times)\b", raw_text, re.IGNORECASE))
        if has_metrics:
            proj_score = min(100.0, proj_score + 10.0)

        # 4. Education Score (0 - 100)
        edu_score = 0.0
        if len(education) > 0:
            top_degree = education[0].get("degree", "").lower()
            if any(deg in top_degree for deg in ["m.tech", "master", "ph.d", "m.s", "mca"]):
                edu_score = 95.0
            elif any(deg in top_degree for deg in ["b.tech", "b.e", "b.sc", "bachelor", "bca"]):
                edu_score = 88.0
            else:
                edu_score = 75.0
        else:
            edu_score = 40.0

        # 5. Resume Completeness (0 - 100)
        completeness_checks = [
            name != "Not detected",
            email != "Not detected",
            phone != "Not detected",
            len(education) > 0,
            len(projects) > 0,
            len(flat_skills) >= 4,
            len(raw_text.split()) >= 120  # Reasonable length
        ]
        completeness_score = (sum(completeness_checks) / len(completeness_checks)) * 100.0

        # 6. Keyword Relevance & Action Verbs (0 - 100)
        words_in_text = set(re.findall(r"\b[a-zA-Z]+\b", raw_text.lower()))
        verb_matches = words_in_text.intersection(ACTION_VERBS)
        verb_score = min(50.0, len(verb_matches) * 10.0)
        
        # Technical keywords density
        tech_words_ratio = min(50.0, (skill_count / max(1, len(words_in_text))) * 800.0)
        keyword_score = min(100.0, max(40.0, verb_score + tech_words_ratio))

        # Overall Weighted Score Calculation
        overall = (
            skills_score * self.weights["skills_match"] +
            exp_score * self.weights["experience"] +
            proj_score * self.weights["projects"] +
            edu_score * self.weights["education"] +
            completeness_score * self.weights["resume_completeness"] +
            keyword_score * self.weights["keyword_relevance"]
        )

        overall_score = round(overall, 1)

        # ATS Compatibility breakdown
        ats_keyword_opt = round(min(98.0, max(50.0, keyword_score * 0.95)), 1)
        ats_structure = round(min(98.0, max(55.0, (completeness_score * 0.6) + (40.0 if len(experience) > 0 or len(projects) > 0 else 20.0))), 1)
        ats_skills_cov = round(min(98.0, max(45.0, skills_score)), 1)
        ats_exp_rel = round(min(98.0, max(40.0, exp_score)), 1)
        ats_edu_qual = round(min(98.0, max(50.0, edu_score)), 1)
        ats_proj_rel = round(min(98.0, max(45.0, proj_score)), 1)

        ats_overall = round(
            (ats_keyword_opt * 0.25) +
            (ats_structure * 0.20) +
            (ats_skills_cov * 0.25) +
            (ats_exp_rel * 0.15) +
            (ats_proj_rel * 0.15),
            1
        )

        # Generate Strengths, Weaknesses, and Recommendations
        strengths = []
        weaknesses = []
        recommendations = []

        # Strengths evaluation
        if skill_count >= 8:
            strengths.append(f"Strong skill repertoire ({skill_count} technical competencies detected)")
        if len(skills_dict.get("programming_languages", [])) >= 2:
            strengths.append(f"Proficient across multiple languages: {', '.join(skills_dict['programming_languages'][:3])}")
        if len(projects) >= 2:
            strengths.append(f"Demonstrated project portfolio with {len(projects)} distinct technical implementations")
        if len(education) > 0 and education[0].get("degree") != "Not detected":
            strengths.append(f"Clear degree qualification in {education[0].get('degree')}")
        if len(verb_matches) >= 3:
            strengths.append("Effective use of strong action verbs across achievements")

        if not strengths:
            strengths.append("Foundational technical background with clear career intent")

        # Weaknesses evaluation
        if len(skills_dict.get("cloud_and_devops", [])) == 0:
            weaknesses.append("Missing cloud & DevOps technologies (e.g., Docker, AWS, CI/CD, Kubernetes)")
        if not has_metrics:
            weaknesses.append("Lack of quantifiable business metrics or performance benchmarks in project bullet points")
        if len(skills_dict.get("databases", [])) == 0:
            weaknesses.append("No relational or NoSQL database management systems explicitly listed")
        if len(experience) == 0:
            weaknesses.append("Limited formal industry/internship experience documented")
        if len(flat_skills) < 6:
            weaknesses.append("Low overall technical skill density for automated Analyzer filters")

        if not weaknesses:
            weaknesses.append("Minor opportunities to further optimize domain-specific keywords")

        # Recommendations
        if not has_metrics:
            recommendations.append("Add measurable outcomes to projects (e.g., 'Reduced response latency by 25%', 'Handled 5,000+ records')")
        if len(skills_dict.get("cloud_and_devops", [])) == 0:
            recommendations.append("Incorporate foundational cloud/containerization tools like Docker or AWS")
        if email == "Not detected" or phone == "Not detected":
            recommendations.append("Ensure header contact info (Email, Phone, LinkedIn, GitHub) is clearly formatted at the top")
        if len(skills_dict.get("databases", [])) == 0:
            recommendations.append("Specify database systems used (e.g., MySQL, PostgreSQL, MongoDB, SQLite)")
        recommendations.append("Include a concise 2-3 line Professional Summary highlighting your core technical focus")

        return {
            "overall_score": overall_score,
            "score_breakdown": {
                "skills_match": round(skills_score, 1),
                "experience": round(exp_score, 1),
                "projects": round(proj_score, 1),
                "education": round(edu_score, 1),
                "resume_completeness": round(completeness_score, 1),
                "keyword_relevance": round(keyword_score, 1)
            },
            "weights_used": self.weights,
            "ats_score": ats_overall,
            "ats_breakdown": {
                "keyword_optimization": ats_keyword_opt,
                "resume_structure": ats_structure,
                "skills_coverage": ats_skills_cov,
                "experience_relevance": ats_exp_rel,
                "education_quality": ats_edu_qual,
                "project_relevance": ats_proj_rel
            },
            "strengths": strengths,
            "weaknesses": weaknesses,
            "recommendations": recommendations,
            "total_skills_count": skill_count
        }

# Global singleton
resume_scorer = ResumeScorer()
