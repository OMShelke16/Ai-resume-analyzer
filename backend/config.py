import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "academic-resume-ai-Analyzer-secret-2025")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'resume_system.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload parameters
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    ALLOWED_EXTENSIONS = {"pdf", "docx"}
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB maximum
    
    # Data paths
    JOBS_CSV_PATH = os.path.join(BASE_DIR, "data", "jobs.csv")
    SKILLS_JSON_PATH = os.path.join(BASE_DIR, "data", "skills_taxonomy.json")
    SAMPLE_DIR = os.path.join(BASE_DIR, "sample_resumes")
    
    # Academic Resume Scoring Weights (Configurable)
    # Total sum must equal 1.0 (100%)
    SCORING_WEIGHTS = {
        "skills_match": 0.35,          # 35% Skills relevance & count
        "experience": 0.20,            # 20% Experience duration & relevance
        "projects": 0.15,              # 15% Project depth & technology diversity
        "education": 0.10,             # 10% Educational degree qualification
        "resume_completeness": 0.10,   # 10% Contact info, sections integrity
        "keyword_relevance": 0.10      # 10% ATS keyword density & action verbs
    }
    
    # Recommendation engine weights
    # Hybrid matching: 55% TF-IDF Cosine Similarity + 45% Direct Skill Overlap Jaccard
    RECOMMENDATION_WEIGHTS = {
        "tfidf_cosine": 0.55,
        "skill_overlap": 0.45
    }

# Ensure necessary directories exist
os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
os.makedirs(Config.SAMPLE_DIR, exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "data"), exist_ok=True)
