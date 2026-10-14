from datetime import datetime
import json
from ..database import db

class Resume(db.Model):
    __tablename__ = "resumes"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    original_name = db.Column(db.String(255), nullable=False)
    file_type = db.Column(db.String(50), nullable=False)  # pdf, docx, manual
    file_size = db.Column(db.Integer, default=0)
    raw_text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    analysis = db.relationship("ResumeAnalysis", backref="resume", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "original_name": self.original_name,
            "file_type": self.file_type,
            "file_size": self.file_size,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class ResumeAnalysis(db.Model):
    __tablename__ = "resume_analyses"

    id = db.Column(db.Integer, primary_key=True)
    resume_id = db.Column(db.Integer, db.ForeignKey("resumes.id", ondelete="CASCADE"), nullable=True)
    candidate_name = db.Column(db.String(150), default="Not detected")
    email = db.Column(db.String(150), default="Not detected")
    phone = db.Column(db.String(100), default="Not detected")
    location = db.Column(db.String(150), default="Not detected")
    
    # JSON-encoded structures
    education = db.Column(db.Text, default="[]")
    experience = db.Column(db.Text, default="[]")
    projects = db.Column(db.Text, default="[]")
    skills = db.Column(db.Text, default="{}")
    certifications = db.Column(db.Text, default="[]")
    
    # Scores
    overall_score = db.Column(db.Float, default=0.0)
    score_breakdown = db.Column(db.Text, default="{}")
    ats_score = db.Column(db.Float, default=0.0)
    ats_breakdown = db.Column(db.Text, default="{}")
    
    # Insights
    strengths = db.Column(db.Text, default="[]")
    weaknesses = db.Column(db.Text, default="[]")
    recommendations = db.Column(db.Text, default="[]")
    
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Recommendations relationship
    job_recommendations = db.relationship("JobRecommendation", backref="analysis", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "resume_id": self.resume_id,
            "candidate_name": self.candidate_name,
            "email": self.email,
            "phone": self.phone,
            "location": self.location,
            "education": json.loads(self.education) if self.education else [],
            "experience": json.loads(self.experience) if self.experience else [],
            "projects": json.loads(self.projects) if self.projects else [],
            "skills": json.loads(self.skills) if self.skills else {},
            "certifications": json.loads(self.certifications) if self.certifications else [],
            "overall_score": round(self.overall_score, 1),
            "score_breakdown": json.loads(self.score_breakdown) if self.score_breakdown else {},
            "ats_score": round(self.ats_score, 1),
            "ats_breakdown": json.loads(self.ats_breakdown) if self.ats_breakdown else {},
            "strengths": json.loads(self.strengths) if self.strengths else [],
            "weaknesses": json.loads(self.weaknesses) if self.weaknesses else [],
            "recommendations": json.loads(self.recommendations) if self.recommendations else [],
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class Job(db.Model):
    __tablename__ = "jobs"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(150), nullable=False)
    description = db.Column(db.Text, nullable=False)
    skills = db.Column(db.Text, nullable=False)  # Comma separated or JSON
    experience = db.Column(db.String(100), default="Not specified")
    salary = db.Column(db.String(100), default="Competitive / Not disclosed")
    job_type = db.Column(db.String(50), default="Full-time")  # Full-time, Remote, Hybrid, Internship
    category = db.Column(db.String(100), default="Other Tech")
    link = db.Column(db.String(500), default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        skills_list = [s.strip() for s in self.skills.split(",") if s.strip()] if isinstance(self.skills, str) else []
        return {
            "id": self.id,
            "title": self.title,
            "company": self.company,
            "location": self.location,
            "description": self.description,
            "skills": skills_list,
            "skills_raw": self.skills,
            "experience": self.experience,
            "salary": self.salary,
            "job_type": self.job_type,
            "category": self.category or "Other Tech",
            "link": self.link or "",
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class JobRecommendation(db.Model):
    __tablename__ = "job_recommendations"

    id = db.Column(db.Integer, primary_key=True)
    analysis_id = db.Column(db.Integer, db.ForeignKey("resume_analyses.id", ondelete="CASCADE"), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False)
    match_score = db.Column(db.Float, default=0.0)
    matching_skills = db.Column(db.Text, default="[]")
    missing_skills = db.Column(db.Text, default="[]")
    rationale = db.Column(db.Text, default="")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    job = db.relationship("Job")

    def to_dict(self):
        return {
            "id": self.id,
            "analysis_id": self.analysis_id,
            "job_id": self.job_id,
            "job": self.job.to_dict() if self.job else None,
            "match_score": round(self.match_score, 1),
            "matching_skills": json.loads(self.matching_skills) if self.matching_skills else [],
            "missing_skills": json.loads(self.missing_skills) if self.missing_skills else [],
            "rationale": self.rationale,
            "created_at": self.created_at.isoformat() if self.created_at else None
        }


class AnalysisHistory(db.Model):
    __tablename__ = "analysis_history"

    id = db.Column(db.Integer, primary_key=True)
    analysis_id = db.Column(db.Integer, nullable=True)
    resume_name = db.Column(db.String(255), default="Resume.pdf")
    candidate_name = db.Column(db.String(150), default="Candidate")
    overall_score = db.Column(db.Float, default=0.0)
    ats_score = db.Column(db.Float, default=0.0)
    top_job_title = db.Column(db.String(200), default="Software Engineer")
    top_match_score = db.Column(db.Float, default=0.0)
    total_skills_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "analysis_id": self.analysis_id,
            "resume_name": self.resume_name,
            "candidate_name": self.candidate_name,
            "overall_score": round(self.overall_score, 1),
            "ats_score": round(self.ats_score, 1),
            "top_job_title": self.top_job_title,
            "top_match_score": round(self.top_match_score, 1),
            "total_skills_count": self.total_skills_count,
            "created_at": self.created_at.strftime("%b %d, %Y - %I:%M %p") if self.created_at else None
        }
