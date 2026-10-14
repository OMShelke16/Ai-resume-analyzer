from flask import Blueprint, jsonify
from ..database import db
from ..models.schema import AnalysisHistory, ResumeAnalysis

history_bp = Blueprint("history_bp", __name__, url_prefix="/api/history")

@history_bp.route("", methods=["GET"])
def get_history_list():
    """Returns history of all previously analyzed resumes."""
    records = AnalysisHistory.query.order_by(AnalysisHistory.created_at.desc()).all()
    return jsonify({
        "success": True,
        "total": len(records),
        "history": [r.to_dict() for r in records]
    })


@history_bp.route("/<int:history_id>", methods=["GET"])
def get_history_detail(history_id):
    """Retrieves full analysis snapshot associated with a history record."""
    history_entry = AnalysisHistory.query.get_or_404(history_id)
    analysis = None
    if history_entry.analysis_id:
        analysis_obj = ResumeAnalysis.query.get(history_entry.analysis_id)
        if analysis_obj:
            analysis = analysis_obj.to_dict()

    return jsonify({
        "success": True,
        "history": history_entry.to_dict(),
        "analysis": analysis
    })


@history_bp.route("/<int:history_id>", methods=["DELETE"])
def delete_history_item(history_id):
    """Deletes a single history entry."""
    history_entry = AnalysisHistory.query.get_or_404(history_id)
    db.session.delete(history_entry)
    db.session.commit()
    return jsonify({"success": True, "message": "History record deleted successfully."})


@history_bp.route("/clear", methods=["DELETE"])
def clear_all_history():
    """Clears all historical analysis logs."""
    AnalysisHistory.query.delete()
    db.session.commit()
    return jsonify({"success": True, "message": "All history logs have been cleared."})
