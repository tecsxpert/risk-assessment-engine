from __future__ import annotations

import logging

from flask import Blueprint, current_app, jsonify, request

from schemas.report import ReportRequest
from services.report_generator import ReportGenerator, ReportGeneratorError

log = logging.getLogger(__name__)

bp = Blueprint("generate_report", __name__)


@bp.post("/generate-report")
def generate_report():
    try:
        body = request.get_json(force=True, silent=False)
    except Exception:
        return jsonify({"error": "invalid json body"}), 400

    try:
        req = ReportRequest.from_json(body)
    except ValueError as exc:
        return jsonify({"error": str(exc)}), 400

    gen: ReportGenerator = current_app.extensions["report_generator"]
    try:
        result = gen.generate(req)
    except ReportGeneratorError as exc:
        log.exception("report generation failed")
        return jsonify({"error": "report generation failed", "detail": str(exc)}), 502

    return jsonify(result.to_dict()), 200
