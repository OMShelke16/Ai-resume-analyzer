from flask import Blueprint, request, jsonify
from ..models.schema import Resume
from ..services.skill_extractor import skill_extractor
from ..services.recommendation_engine import recommendation_engine

recommendation_bp = Blueprint("recommendation_bp", __name__, url_prefix="/api/recommendations")

@recommendation_bp.route("", methods=["POST"])
def get_recommendations():
    """
    Ranks dataset jobs against candidate resume text or resume_id using hybrid TF-IDF + Skill overlap.
    Supports multi-criteria filtering: search, job_type, location, experience, category, skill.
    """
    data = request.get_json() or {}
    resume_text = data.get("resume_text", "")
    resume_id = data.get("resume_id")
    top_n = int(data.get("top_n", 50))
    job_type = data.get("job_type", None)
    location = data.get("location", None)
    experience = data.get("experience", None)
    category = data.get("category", None)
    skill = data.get("skill", None)
    search = data.get("search", None)

    if resume_id and not resume_text:
        res = Resume.query.get(resume_id)
        if res:
            resume_text = res.raw_text

    if not resume_text:
        return jsonify({"success": False, "error": "Resume text or resume ID is required to generate recommendations."}), 400

    extracted_skills_dict = skill_extractor.extract_skills(resume_text)
    flat_skills = skill_extractor.get_all_flat_skills(extracted_skills_dict)

    recommendations = recommendation_engine.recommend_jobs(
        resume_text=resume_text,
        resume_skills=flat_skills,
        top_n=top_n,
        job_type_filter=job_type,
        location_filter=location,
        experience_filter=experience,
        category_filter=category,
        skill_filter=skill,
        search_filter=search
    )

    return jsonify({
        "success": True,
        "count": len(recommendations),
        "candidate_skills": flat_skills,
        "recommendations": recommendations
    })
