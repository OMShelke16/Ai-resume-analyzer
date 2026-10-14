from flask import Blueprint, request, jsonify
from ..database import db
from ..models.schema import Job, Resume, ResumeAnalysis
from ..services.job_matcher import job_matcher
from ..services.skill_extractor import skill_extractor
from ..services.recommendation_engine import recommendation_engine

job_bp = Blueprint("job_bp", __name__, url_prefix="/api/jobs")

@job_bp.route("/filters", methods=["GET"])
def get_job_filters():
    """
    Returns dynamically discovered filter options from the current dataset:
    locations, job_types, experiences, categories, top_skills.
    """
    filters = recommendation_engine.get_filter_options()
    return jsonify({
        "success": True,
        "filters": filters
    })

@job_bp.route("", methods=["GET"])
def get_jobs():
    """
    Returns list of jobs with dynamic multi-criteria filtering:
    search, job_type, location, experience, category, skill.
    """
    search = request.args.get("search", "").strip()
    job_type = request.args.get("job_type", "").strip()
    location = request.args.get("location", "").strip()
    experience = request.args.get("experience", "").strip()
    category = request.args.get("category", "").strip()
    skill = request.args.get("skill", "").strip()

    filtered = recommendation_engine.get_all_jobs(
        search=search,
        job_type=job_type,
        location=location,
        experience=experience,
        category=category,
        skill=skill
    )

    return jsonify({
        "success": True,
        "total": len(filtered),
        "jobs": filtered
    })

@job_bp.route("/<int:job_id>", methods=["GET"])
def get_job_detail(job_id):
    """Returns single job details by ID."""
    all_jobs = recommendation_engine.get_all_jobs()
    job = next((j for j in all_jobs if j.get("id") == job_id), None)
    
    if not job:
        return jsonify({"success": False, "error": "Job not found"}), 404

    return jsonify({
        "success": True,
        "job": job
    })

@job_bp.route("/match", methods=["POST"])
def match_job():
    """
    Compares candidate resume (text or resume_id) with a job description.
    """
    data = request.get_json() or {}
    job_id = data.get("job_id")
    job_title = data.get("title", "")
    job_description = data.get("description", "")
    job_skills = data.get("skills", [])
    
    resume_text = data.get("resume_text", "")
    resume_id = data.get("resume_id")

    # Fetch resume text if resume_id is provided
    if resume_id and not resume_text:
        res = Resume.query.get(resume_id)
        if res:
            resume_text = res.raw_text

    if not resume_text:
        return jsonify({"success": False, "error": "Candidate resume text is required for matching."}), 400

    # If job_id is provided, populate job details
    if job_id:
        all_jobs = recommendation_engine.get_all_jobs()
        target_job = next((j for j in all_jobs if j.get("id") == job_id), None)
        if target_job:
            job_title = target_job.get("title", job_title)
            job_description = target_job.get("description", job_description)
            job_skills = target_job.get("skills", job_skills)

    if not job_description and not job_title:
        return jsonify({"success": False, "error": "Job title or description is required."}), 400

    # Extract resume skills
    extracted_resume_skills_dict = skill_extractor.extract_skills(resume_text)
    resume_flat_skills = skill_extractor.get_all_flat_skills(extracted_resume_skills_dict)

    # Perform matching
    match_result = job_matcher.match_resume_to_job(
        resume_text=resume_text,
        resume_skills=resume_flat_skills,
        job_title=job_title or "Target Job Role",
        job_description=job_description,
        job_required_skills=job_skills
    )

    return jsonify({
        "success": True,
        "match_result": match_result,
        "candidate_skills": resume_flat_skills
    })
