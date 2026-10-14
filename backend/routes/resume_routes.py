import os
import time
import json
from flask import Blueprint, request, jsonify, send_file
from werkzeug.utils import secure_filename
from ..config import Config
from ..database import db
from ..models.schema import Resume, ResumeAnalysis, AnalysisHistory
from ..services.resume_parser import resume_parser
from ..services.resume_scorer import resume_scorer
from ..services.skill_extractor import skill_extractor
from ..services.recommendation_engine import recommendation_engine

resume_bp = Blueprint("resume_bp", __name__, url_prefix="/api/resume")

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@resume_bp.route("/upload", methods=["POST"])
def upload_resume():
    """
    Handles PDF/DOCX file upload, text extraction, entity parsing, ATS scoring, and recommendations.
    """
    if "file" not in request.files:
        return jsonify({"success": False, "error": "No file part provided"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    if not allowed_file(file.filename):
        return jsonify({
            "success": False,
            "error": f"Invalid file format. Only {', '.join(Config.ALLOWED_EXTENSIONS).upper()} files are supported."
        }), 400

    try:
        filename = secure_filename(file.filename)
        saved_filename = f"{int(time.time())}_{filename}"
        file_path = os.path.join(Config.UPLOAD_FOLDER, saved_filename)
        file.save(file_path)

        # Extract text from file
        extracted_text = resume_parser.extract_text_from_file(file_path)
        if not extracted_text or len(extracted_text.strip()) < 30:
            return jsonify({
                "success": False,
                "error": "Unable to extract readable text from document. Please ensure file contains selectable text."
            }), 400

        # Parse structured entities
        parsed_data = resume_parser.parse(extracted_text)
        
        # Calculate scoring & ATS analysis
        scoring_data = resume_scorer.calculate_score(parsed_data)

        # Persist to database
        file_size = os.path.getsize(file_path)
        new_resume = Resume(
            filename=saved_filename,
            original_name=filename,
            file_type=filename.rsplit(".", 1)[1].lower(),
            file_size=file_size,
            raw_text=extracted_text
        )
        db.session.add(new_resume)
        db.session.flush()

        new_analysis = ResumeAnalysis(
            resume_id=new_resume.id,
            candidate_name=parsed_data.get("candidate_name", "Not detected"),
            email=parsed_data.get("email", "Not detected"),
            phone=parsed_data.get("phone", "Not detected"),
            location=parsed_data.get("location", "Not detected"),
            education=json.dumps(parsed_data.get("education", [])),
            experience=json.dumps(parsed_data.get("experience", [])),
            projects=json.dumps(parsed_data.get("projects", [])),
            skills=json.dumps(parsed_data.get("skills", {})),
            certifications=json.dumps(parsed_data.get("certifications", [])),
            overall_score=scoring_data.get("overall_score", 0.0),
            score_breakdown=json.dumps(scoring_data.get("score_breakdown", {})),
            ats_score=scoring_data.get("ats_score", 0.0),
            ats_breakdown=json.dumps(scoring_data.get("ats_breakdown", {})),
            strengths=json.dumps(scoring_data.get("strengths", [])),
            weaknesses=json.dumps(scoring_data.get("weaknesses", [])),
            recommendations=json.dumps(scoring_data.get("recommendations", []))
        )
        db.session.add(new_analysis)
        db.session.flush()

        # Compute initial top recommendations for dashboard
        flat_skills = skill_extractor.get_all_flat_skills(parsed_data.get("skills", {}))
        top_recs = recommendation_engine.recommend_jobs(
            resume_text=extracted_text,
            resume_skills=flat_skills,
            top_n=10
        )

        top_title = top_recs[0]["job"]["title"] if top_recs else "Software Engineer"
        top_match = top_recs[0]["match_score"] if top_recs else 0.0

        # Save to analysis history
        history_entry = AnalysisHistory(
            analysis_id=new_analysis.id,
            resume_name=filename,
            candidate_name=parsed_data.get("candidate_name", "Candidate"),
            overall_score=scoring_data.get("overall_score", 0.0),
            ats_score=scoring_data.get("ats_score", 0.0),
            top_job_title=top_title,
            top_match_score=top_match,
            total_skills_count=len(flat_skills)
        )
        db.session.add(history_entry)
        db.session.commit()

        return jsonify({
            "success": True,
            "message": "Resume uploaded and analyzed successfully!",
            "resume": new_resume.to_dict(),
            "analysis": new_analysis.to_dict(),
            "top_recommendations": top_recs
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

@resume_bp.route("/analyze", methods=["POST"])
def analyze_raw_text():
    """
    Analyzes raw resume text directly.
    """
    data = request.get_json() or {}
    text = data.get("text", "")
    if not text or len(text.strip()) < 30:
        return jsonify({"success": False, "error": "Please provide sufficient resume text (min 30 characters)."}), 400

    try:
        parsed_data = resume_parser.parse(text)
        scoring_data = resume_scorer.calculate_score(parsed_data)
        flat_skills = skill_extractor.get_all_flat_skills(parsed_data.get("skills", {}))

        top_recs = recommendation_engine.recommend_jobs(
            resume_text=text,
            resume_skills=flat_skills,
            top_n=10
        )

        return jsonify({
            "success": True,
            "parsed_data": parsed_data,
            "scoring": scoring_data,
            "top_recommendations": top_recs
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@resume_bp.route("/<int:resume_id>", methods=["GET"])
def get_resume(resume_id):
    resume = Resume.query.get_or_404(resume_id)
    analysis = resume.analysis
    return jsonify({
        "success": True,
        "resume": resume.to_dict(),
        "analysis": analysis.to_dict() if analysis else None
    })
