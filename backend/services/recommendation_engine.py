import csv
import os
import re
from typing import Dict, List, Any, Optional
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from ..config import Config
from .skill_extractor import skill_extractor

# List of known target locations for dynamic extraction
KNOWN_LOCATIONS = [
    "Jakarta", "Singapore", "Bandung", "Yogyakarta", "Surabaya", 
    "Bali", "Tangerang", "Bekasi", "Depok", "Semarang", "Medan", 
    "Bengaluru", "Remote", "Hybrid", "Indonesia", "Malaysia"
]

class RecommendationEngine:
    def __init__(self):
        self.csv_path = Config.JOBS_CSV_PATH
        self._jobs_cache: Optional[List[Dict[str, Any]]] = None
        self._vectorizer: Optional[TfidfVectorizer] = None
        self._job_tfidf_matrix = None
        self._job_texts: List[str] = []

    def _extract_location(self, desc: str, title: str) -> str:
        """Dynamically identifies location from description and title."""
        for loc in KNOWN_LOCATIONS:
            pattern = r'\b' + re.escape(loc) + r'\b'
            if re.search(pattern, desc, re.I) or re.search(pattern, title, re.I):
                return loc
        return "Not specified"

    def _extract_job_type(self, desc: str, title: str) -> str:
        """Dynamically identifies job work type from description and title."""
        combined = f"{title} {desc}".lower()
        if re.search(r'\b(intern|internship|trainee)\b', combined):
            return "Internship"
        elif re.search(r'\b(contract|freelance|temporary)\b', combined):
            return "Contract"
        elif re.search(r'\b(remote|work from home|wfh)\b', combined):
            return "Remote"
        elif re.search(r'\b(hybrid)\b', combined):
            return "Hybrid"
        elif re.search(r'\b(part[ -]?time)\b', combined):
            return "Part-time"
        elif re.search(r'\b(permanent)\b', combined):
            return "Permanent"
        return "Full-time"

    def _extract_experience(self, desc: str) -> str:
        """Dynamically extracts required experience years."""
        exp_m = re.search(
            r'(\d+)\s*\+?\s*(?:-\s*(\d+)\s*)?(?:years?|yrs?)\s*(?:of\s*)?(?:relevant\s*)?experience',
            desc,
            re.I
        )
        if exp_m:
            min_y = int(exp_m.group(1))
            max_y = int(exp_m.group(2)) if exp_m.group(2) else None
            if max_y:
                return f"{min_y}-{max_y} Years"
            elif min_y >= 5:
                return "5+ Years"
            elif min_y >= 3:
                return "3-5 Years"
            elif min_y >= 1:
                return "1-3 Years"
            else:
                return "0-1 Years"
        return "Not specified"

    def _extract_category(self, title: str, skills: List[str]) -> str:
        """Categorizes job role based on title and extracted skills."""
        title_lower = title.lower()
        skills_lower = [s.lower() for s in skills]

        if any(w in title_lower for w in ["data scientist", "data science", "nlp", "computer vision", "deep learning"]):
            return "Data Science & AI"
        elif any(w in title_lower for w in ["machine learning", "ml engineer", "ai engineer"]):
            return "Machine Learning"
        elif any(w in title_lower for w in ["data analyst", "analytics", "bi ", "business intelligence"]):
            return "Analytics & BI"
        elif any(w in title_lower for w in ["data engineer", "etl", "big data", "database"]):
            return "Data Engineering"
        elif any(w in title_lower for w in ["software engineer", "developer", "backend", "frontend", "full stack", "web", "mobile", "ios", "android"]):
            return "Software Engineering"
        elif any(w in title_lower for w in ["devops", "cloud", "infrastructure", "sre", "sysadmin"]):
            return "DevOps & Cloud"
        elif any(w in title_lower for w in ["product manager", "project manager", "scrum", "agile"]):
            return "Product & Management"
        elif any(s in skills_lower for s in ["python", "machine learning", "tensorflow", "pytorch"]):
            return "Data Science & AI"
        elif any(s in skills_lower for s in ["react", "javascript", "java", "c++", "node.js"]):
            return "Software Engineering"
        return "Other Tech"

    def load_jobs_from_csv(self, force_reload: bool = False) -> List[Dict[str, Any]]:
        """
        Loads and safely cleans jobs from the jobs.csv dataset.
        Handles missing fields, deduplication, inconsistent formats, and extracts metadata.
        """
        if self._jobs_cache is not None and not force_reload:
            return self._jobs_cache

        if not os.path.exists(self.csv_path):
            self._jobs_cache = []
            return []

        jobs = []
        seen_keys = set()
        job_id_counter = 1

        with open(self.csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
            reader = csv.DictReader(f)
            for row in reader:
                # 1. Clean Title
                raw_title = (row.get("title") or row.get("position") or row.get("job_title") or "").strip()
                if not raw_title or raw_title.lower() in ["title", "position", "job title"]:
                    # Skip repeated CSV headers or blank titles
                    continue

                # 2. Clean Company
                raw_company = (row.get("company") or "").strip()
                company = raw_company if raw_company and raw_company.lower() not in ["none", "nan", "null"] else "Not specified"

                # 3. Clean Salary
                raw_salary = (row.get("salary") or "").strip()
                if not raw_salary or raw_salary.lower() in ["none", "nan", "null", "not specified"]:
                    salary = "Competitive / Not disclosed"
                else:
                    salary = raw_salary

                # 4. Clean Description
                raw_desc = (row.get("description") or "").strip()
                if not raw_desc or raw_desc.lower() in ["none", "nan", "null"]:
                    desc = f"Role: {raw_title} at {company}."
                else:
                    desc = raw_desc

                # Deduplication key
                dup_key = (raw_title.lower(), company.lower(), desc[:120].lower())
                if dup_key in seen_keys:
                    continue
                seen_keys.add(dup_key)

                # 5. Extract Skills
                if "skills" in row and row.get("skills"):
                    skills_list = [s.strip() for s in row.get("skills", "").split(",") if s.strip()]
                else:
                    skills_dict = skill_extractor.extract_skills(f"{raw_title} {desc}")
                    skills_list = skill_extractor.get_all_flat_skills(skills_dict)

                # Fallback if no skills extracted
                if not skills_list:
                    skills_list = ["Communication", "Problem Solving"]

                # 6. Extract Location
                location = row.get("location") or self._extract_location(desc, raw_title)

                # 7. Extract Job Type
                job_type = row.get("job_type") or self._extract_job_type(desc, raw_title)

                # 8. Extract Experience
                experience = row.get("experience") or self._extract_experience(desc)

                # 9. Extract Category
                category = row.get("category") or self._extract_category(raw_title, skills_list)

                # 10. Link
                link = (row.get("link") or "").strip()

                jobs.append({
                    "id": job_id_counter,
                    "title": raw_title,
                    "company": company,
                    "location": location,
                    "description": desc,
                    "skills": skills_list,
                    "experience": experience,
                    "salary": salary,
                    "job_type": job_type,
                    "category": category,
                    "link": link
                })
                job_id_counter += 1

        self._jobs_cache = jobs
        self._fit_vectorizer(jobs)
        return self._jobs_cache

    def _fit_vectorizer(self, jobs: List[Dict[str, Any]]):
        """Fits the global TF-IDF vectorizer matrix on the job corpus once."""
        if not jobs:
            return

        self._job_texts = [
            f"{j['title']} {j['category']} {' '.join(j['skills'])} {j['description']}"
            for j in jobs
        ]
        self._vectorizer = TfidfVectorizer(
            ngram_range=(1, 2),
            max_features=10000,
            sublinear_tf=True,
            strip_accents="unicode",
            lowercase=True,
            stop_words="english"
        )
        self._job_tfidf_matrix = self._vectorizer.fit_transform(self._job_texts)

    def get_all_jobs(
        self,
        search: Optional[str] = None,
        job_type: Optional[str] = None,
        location: Optional[str] = None,
        experience: Optional[str] = None,
        category: Optional[str] = None,
        skill: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Returns filtered jobs according to multi-criteria parameters."""
        jobs = self.load_jobs_from_csv()
        filtered = []

        search_lower = search.strip().lower() if search else None
        job_type_lower = job_type.strip().lower() if job_type and job_type.lower() != "all" else None
        location_lower = location.strip().lower() if location and location.lower() != "all" else None
        experience_lower = experience.strip().lower() if experience and experience.lower() != "all" else None
        category_lower = category.strip().lower() if category and category.lower() != "all" else None
        skill_lower = skill.strip().lower() if skill and skill.lower() != "all" else None

        for job in jobs:
            # 1. Search Query filter (matches title, company, skills, or description)
            if search_lower:
                m_title = search_lower in job["title"].lower()
                m_comp = search_lower in job["company"].lower()
                m_skills = any(search_lower in s.lower() for s in job["skills"])
                m_desc = search_lower in job["description"].lower()
                if not (m_title or m_comp or m_skills or m_desc):
                    continue

            # 2. Job Type filter
            if job_type_lower:
                if job["job_type"].lower() != job_type_lower:
                    continue

            # 3. Location filter
            if location_lower:
                if location_lower not in job["location"].lower():
                    continue

            # 4. Experience filter
            if experience_lower:
                if experience_lower not in job["experience"].lower():
                    continue

            # 5. Category filter
            if category_lower:
                if category_lower not in job["category"].lower():
                    continue

            # 6. Skill filter
            if skill_lower:
                if not any(skill_lower in s.lower() for s in job["skills"]):
                    continue

            filtered.append(job)

        return filtered

    def get_filter_options(self) -> Dict[str, Any]:
        """Dynamically collects unique filter options from the current dataset."""
        jobs = self.load_jobs_from_csv()

        locations = set()
        job_types = set()
        experiences = set()
        categories = set()
        skill_counts = {}

        for job in jobs:
            loc = job.get("location")
            if loc and loc != "Not specified":
                locations.add(loc)

            jt = job.get("job_type")
            if jt:
                job_types.add(jt)

            exp = job.get("experience")
            if exp and exp != "Not specified":
                experiences.add(exp)

            cat = job.get("category")
            if cat:
                categories.add(cat)

            for s in job.get("skills", []):
                skill_counts[s] = skill_counts.get(s, 0) + 1

        sorted_skills = [
            sk for sk, _ in sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:35]
        ]

        return {
            "total_jobs": len(jobs),
            "locations": sorted(list(locations)),
            "job_types": sorted(list(job_types)),
            "experiences": sorted(list(experiences)),
            "categories": sorted(list(categories)),
            "top_skills": sorted_skills
        }

    def recommend_jobs(
        self,
        resume_text: str,
        resume_skills: List[str],
        top_n: int = 15,
        job_type_filter: Optional[str] = None,
        location_filter: Optional[str] = None,
        experience_filter: Optional[str] = None,
        category_filter: Optional[str] = None,
        skill_filter: Optional[str] = None,
        search_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """
        High-performance vectorized job recommendation.
        Calculates cosine similarity via sparse matrix multiplication in <10ms.
        Combines semantic similarity with exact skill overlap matching.
        """
        jobs = self.load_jobs_from_csv()
        if not jobs or not self._vectorizer or self._job_tfidf_matrix is None:
            return []

        # 1. Transform resume text into TF-IDF vector
        resume_combined = f"{resume_text} {' '.join(resume_skills)}"
        try:
            resume_vec = self._vectorizer.transform([resume_combined])
            # Fast cosine similarity = job_matrix (N x V) dot resume_vec.T (V x 1)
            cosine_similarities = (self._job_tfidf_matrix @ resume_vec.T).toarray().flatten()
        except Exception:
            cosine_similarities = np.zeros(len(jobs))

        norm_resume_skills = {s.lower().strip() for s in resume_skills if s}
        scored_recommendations = []

        # Filter criteria normalization
        search_lower = search_filter.strip().lower() if search_filter else None
        jtype_lower = job_type_filter.strip().lower() if job_type_filter and job_type_filter.lower() != "all" else None
        loc_lower = location_filter.strip().lower() if location_filter and location_filter.lower() != "all" else None
        exp_lower = experience_filter.strip().lower() if experience_filter and experience_filter.lower() != "all" else None
        cat_lower = category_filter.strip().lower() if category_filter and category_filter.lower() != "all" else None
        skill_req_lower = skill_filter.strip().lower() if skill_filter and skill_filter.lower() != "all" else None

        for idx, job in enumerate(jobs):
            # Apply filters
            if search_lower:
                m_title = search_lower in job["title"].lower()
                m_comp = search_lower in job["company"].lower()
                m_skills = any(search_lower in s.lower() for s in job["skills"])
                m_desc = search_lower in job["description"].lower()
                if not (m_title or m_comp or m_skills or m_desc):
                    continue

            if jtype_lower and job["job_type"].lower() != jtype_lower:
                continue

            if loc_lower and loc_lower not in job["location"].lower():
                continue

            if exp_lower and exp_lower not in job["experience"].lower():
                continue

            if cat_lower and cat_lower not in job["category"].lower():
                continue

            if skill_req_lower and not any(skill_req_lower in s.lower() for s in job["skills"]):
                continue

            # Skill matching
            job_skills = job.get("skills", [])
            norm_job_skills = {s.lower().strip() for s in job_skills if s}

            matched = [s for s in job_skills if s.lower().strip() in norm_resume_skills]
            missing = [s for s in job_skills if s.lower().strip() not in norm_resume_skills]

            if norm_job_skills:
                skill_overlap_ratio = len(matched) / len(norm_job_skills)
            else:
                skill_overlap_ratio = float(cosine_similarities[idx])

            cos_score = float(cosine_similarities[idx])

            # Weighted Hybrid Score: 55% TF-IDF Cosine + 45% Skill Overlap
            hybrid_raw = (0.55 * cos_score) + (0.45 * skill_overlap_ratio)
            scaled_score = min(98.0, max(20.0, hybrid_raw * 100.0))

            if skill_overlap_ratio >= 0.85 and scaled_score < 90.0:
                scaled_score = min(95.0, scaled_score + 10.0)

            # Rationale generation
            rationale = self._generate_rationale(job["title"], matched, missing, scaled_score)

            scored_recommendations.append({
                "job_id": job["id"],
                "job": job,
                "match_score": round(scaled_score, 1),
                "cosine_similarity": round(cos_score * 100.0, 1),
                "skill_match_percentage": round(skill_overlap_ratio * 100.0, 1),
                "matching_skills": matched,
                "missing_skills": missing,
                "rationale": rationale
            })

        # Sort by match_score descending
        scored_recommendations.sort(key=lambda x: x["match_score"], reverse=True)
        return scored_recommendations[:top_n]

    def _generate_rationale(
        self,
        job_title: str,
        matched: List[str],
        missing: List[str],
        score: float
    ) -> str:
        if score >= 80:
            if matched:
                return f"High Match: Strong alignment in {', '.join(matched[:3])}, making you a competitive candidate for {job_title}."
            return f"Strong Match: Your technical background and keywords align closely with the requirements for {job_title}."
        elif score >= 60:
            m_str = f" in {', '.join(matched[:2])}" if matched else ""
            gap_str = f"Adding proficiency in {', '.join(missing[:2])} will elevate your candidacy." if missing else ""
            return f"Moderate Match: Good baseline overlap{m_str}. {gap_str}"
        else:
            gap_str = f"Consider building project experience with {', '.join(missing[:3])} to qualify." if missing else ""
            return f"Potential Growth Role: {gap_str}"

# Global singleton
recommendation_engine = RecommendationEngine()
