import os
import csv
from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from .config import Config
from .database import db, init_db
from .models.schema import Job, Resume, ResumeAnalysis, AnalysisHistory
from .routes import resume_bp, job_bp, recommendation_bp, history_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for all routes
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize SQLAlchemy database
    init_db(app)

    # Register API Blueprints
    app.register_blueprint(resume_bp)
    app.register_blueprint(job_bp)
    app.register_blueprint(recommendation_bp)
    app.register_blueprint(history_bp)

    # Seed initial jobs from CSV if empty
    with app.app_context():
        seed_jobs_if_empty()

    @app.route("/api/health", methods=["GET"])
    def health_check():
        job_count = Job.query.count()
        resume_count = Resume.query.count()
        return jsonify({
            "status": "healthy",
            "service": "AI Resume Analyzer & Job Recommendation API",
            "version": "1.0.0",
            "environment": "College Academic Project / Production Demo",
            "database": {
                "total_jobs_loaded": job_count,
                "total_resumes_analyzed": resume_count
            }
        })

    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(Config.UPLOAD_FOLDER, filename)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"success": False, "error": "Internal Server Error"}), 500

    return app

def seed_jobs_if_empty():
    """Reads and populates the SQLite jobs table from cleaned jobs.csv if table is empty."""
    try:
        if Job.query.count() == 0:
            from .services.recommendation_engine import recommendation_engine
            jobs_data = recommendation_engine.load_jobs_from_csv()
            for row in jobs_data:
                job = Job(
                    id=row.get("id"),
                    title=row.get("title", ""),
                    company=row.get("company", ""),
                    location=row.get("location", ""),
                    description=row.get("description", ""),
                    skills=",".join(row.get("skills", [])),
                    experience=row.get("experience", "Not specified"),
                    salary=row.get("salary", "Competitive / Not disclosed"),
                    job_type=row.get("job_type", "Full-time"),
                    category=row.get("category", "Other Tech"),
                    link=row.get("link", "")
                )
                db.session.add(job)
            db.session.commit()
            print(f"Seeded {len(jobs_data)} jobs into database successfully.")
    except Exception as e:
        db.session.rollback()
        print(f"Error seeding jobs: {e}")

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting AI Resume Analyzer Backend on port {port}...")
    app.run(host="0.0.0.0", port=port, debug=True)
