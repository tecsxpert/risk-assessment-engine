from __future__ import annotations

import json
import logging

from flask import Blueprint, Response, current_app, jsonify, request, stream_with_context

from schemas.report import ReportRequest
from services.report_generator import ReportGenerator, ReportGeneratorError

log = logging.getLogger(__name__)

bp = Blueprint("generate_report", __name__)


def _parse_body() -> tuple[ReportRequest | None, tuple[Response, int] | None]:
    try:
        body = request.get_json(force=True, silent=False)
    except Exception:
        return None, (jsonify({"error": "invalid json body"}), 400)
    try:
        return ReportRequest.from_json(body), None
    except ValueError as exc:
        return None, (jsonify({"error": str(exc)}), 400)


@bp.post("/generate-report")
def generate_report():
    req, err = _parse_body()
    if err is not None:
        return err
    gen: ReportGenerator = current_app.extensions["report_generator"]
    try:
        result = gen.generate(req)
    except ReportGeneratorError as exc:
        log.exception("report generation failed")
        return jsonify({"error": "report generation failed", "detail": str(exc)}), 502
    return jsonify(result.to_dict()), 200


@bp.post("/generate-report/stream")
def generate_report_stream():
    req, err = _parse_body()
    if err is not None:
        return err
    gen: ReportGenerator = current_app.extensions["report_generator"]

    def event_stream():
        try:
            for piece in gen.generate_stream(req):
                yield f"data: {json.dumps({'delta': piece})}\n\n"
            yield "data: [DONE]\n\n"
        except ReportGeneratorError as exc:
            log.exception("report stream failed")
            err_payload = json.dumps({"error": str(exc)})
            yield f"event: error\ndata: {err_payload}\n\n"

    return Response(
        stream_with_context(event_stream()),
        mimetype="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
