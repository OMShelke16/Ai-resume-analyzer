import json
import os
import re
from typing import Dict, List, Set, Tuple
from ..config import Config

class SkillExtractor:
    def __init__(self, taxonomy_path: str = None):
        path = taxonomy_path or Config.SKILLS_JSON_PATH
        self.taxonomy = self._load_taxonomy(path)
        self.flat_skill_map = self._build_lookup_map()

    def _load_taxonomy(self, path: str) -> Dict[str, List[str]]:
        try:
            if os.path.exists(path):
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
        except Exception as e:
            print(f"Error loading taxonomy: {e}")
        
        # Fallback minimal taxonomy
        return {
            "programming_languages": ["Python", "Java", "C++", "C", "C#", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "Ruby", "Swift", "Kotlin", "Scala", "R"],
            "frameworks_and_libraries": ["Flask", "Django", "FastAPI", "React", "Node.js", "Pandas", "NumPy", "Scikit-learn", "HTML", "CSS"],
            "databases": ["SQL", "MySQL", "PostgreSQL", "MongoDB", "SQLite", "Redis"],
            "cloud_and_devops": ["AWS", "Docker", "Kubernetes", "Git", "GitHub", "CI/CD", "Linux"],
            "tools_and_platforms": ["Postman", "VS Code", "Power BI", "Tableau", "Excel"],
            "concepts_and_domains": ["Machine Learning", "Data Analysis", "REST API", "Deep Learning", "NLP"],
            "soft_skills": ["Problem Solving", "Communication", "Leadership", "Team Collaboration"]
        }

    def _build_lookup_map(self) -> Dict[str, Dict]:
        """
        Builds a canonical skill map for regex matching.
        Maps lowercase representations and aliases to the canonical skill name and category.
        """
        lookup = {}
        for category, skills in self.taxonomy.items():
            for skill in skills:
                canonical = skill.strip()
                lower = canonical.lower()
                lookup[lower] = {
                    "canonical": canonical,
                    "category": category
                }

        # Extra aliases
        aliases = {
            "js": ("JavaScript", "programming_languages"),
            "ts": ("TypeScript", "programming_languages"),
            "py": ("Python", "programming_languages"),
            "reactjs": ("React", "frameworks_and_libraries"),
            "react.js": ("React", "frameworks_and_libraries"),
            "nodejs": ("Node.js", "frameworks_and_libraries"),
            "node": ("Node.js", "frameworks_and_libraries"),
            "expressjs": ("Express", "frameworks_and_libraries"),
            "sklearn": ("Scikit-learn", "frameworks_and_libraries"),
            "scikit learn": ("Scikit-learn", "frameworks_and_libraries"),
            "k8s": ("Kubernetes", "cloud_and_devops"),
            "postgres": ("PostgreSQL", "databases"),
            "mongo": ("MongoDB", "databases"),
            "powerbi": ("Power BI", "tools_and_platforms"),
            "restful api": ("REST API", "concepts_and_domains"),
            "restful apis": ("REST API", "concepts_and_domains"),
            "rest apis": ("REST API", "concepts_and_domains"),
            "ml": ("Machine Learning", "concepts_and_domains"),
            "ai": ("Artificial Intelligence", "concepts_and_domains"),
            "dl": ("Deep Learning", "concepts_and_domains")
        }

        for alias, (canonical, category) in aliases.items():
            lookup[alias.lower()] = {
                "canonical": canonical,
                "category": category
            }

        return lookup

    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """
        Extracts and categorizes skills present in the given text.
        Returns a dict mapping category name -> list of unique canonical skill names.
        """
        if not text or not isinstance(text, str):
            return {cat: [] for cat in self.taxonomy.keys()}

        # Clean text for token and phrase matching
        text_lower = " " + text.lower() + " "
        # Replace punctuation except + and # and dots for tech skills
        text_normalized = re.sub(r"[^\w\s\+\#\.]", " ", text_lower)
        text_normalized = re.sub(r"\s+", " ", text_normalized)

        found_skills: Set[str] = set()
        categorized: Dict[str, List[str]] = {cat: [] for cat in self.taxonomy.keys()}

        # Sort keys by length in descending order to match multi-word phrases first (e.g. "machine learning" before "learning")
        sorted_patterns = sorted(self.flat_skill_map.keys(), key=lambda x: len(x), reverse=True)

        for pattern in sorted_patterns:
            escaped = re.escape(pattern)
            # Create regex with word boundaries
            # Handle special symbols like c++, c#, .net
            if pattern in ["c++", "c#", ".net"]:
                regex = r"(?:^|[\s,;/\(\)])" + escaped + r"(?:$|[\s,;/\(\)])"
            elif pattern == "c":
                regex = r"(?:^|[\s,;/\(\)])[cC](?:$|[\s,;/\(\)])"
            elif pattern == "r":
                regex = r"(?:^|[\s,;/\(\)])[rR](?:$|[\s,;/\(\)])"
            else:
                regex = r"\b" + escaped + r"\b"

            if re.search(regex, text_normalized, flags=re.IGNORECASE):
                info = self.flat_skill_map[pattern]
                canonical = info["canonical"]
                category = info["category"]
                
                if canonical not in found_skills:
                    found_skills.add(canonical)
                    categorized[category].append(canonical)

        # Sort each category's list for tidy display
        for cat in categorized:
            categorized[cat] = sorted(list(set(categorized[cat])))

        return categorized

    def get_all_flat_skills(self, categorized_skills: Dict[str, List[str]]) -> List[str]:
        """Flattens categorized skills dictionary into a single deduplicated list."""
        all_skills = []
        for cat_list in categorized_skills.values():
            all_skills.extend(cat_list)
        return sorted(list(set(all_skills)))

    def compare_skills(self, resume_skills: List[str], job_skills: List[str]) -> Dict:
        """
        Compares candidate skills with job requirements.
        Returns matched skills, missing skills, and match percentage.
        """
        resume_set = {s.lower().strip() for s in resume_skills if s}
        job_set = {s.lower().strip() for s in job_skills if s}

        matched = []
        missing = []

        for skill in job_skills:
            if skill.lower().strip() in resume_set:
                matched.append(skill)
            else:
                missing.append(skill)

        match_ratio = (len(matched) / len(job_skills)) if len(job_skills) > 0 else 1.0
        match_percentage = round(match_ratio * 100, 1)

        return {
            "matched_skills": sorted(matched),
            "missing_skills": sorted(missing),
            "total_job_skills_count": len(job_skills),
            "matched_count": len(matched),
            "missing_count": len(missing),
            "skill_match_percentage": match_percentage
        }

# Global singleton
skill_extractor = SkillExtractor()
