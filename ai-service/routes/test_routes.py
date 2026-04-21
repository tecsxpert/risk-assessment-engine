from flask import Blueprint, request, jsonify
from services.sanitizer import sanitize_input
from services.risk_analyzer import analyze_risk

test_bp = Blueprint("test", __name__)

# 🔹 Existing route (UNCHANGED)
@test_bp.route("/test", methods=["POST"])
def test():
    data = request.json

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]

    cleaned_text, error = sanitize_input(text)

    if error:
        return jsonify({"error": error}), 400

    return jsonify({
        "message": "Safe input received",
        "cleaned_text": cleaned_text
    })


# 🚀 NEW DAY 2 ROUTE
@test_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.json

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"]

    # 🔐 Use existing sanitizer
    cleaned_text, error = sanitize_input(text)

    if error:
        return jsonify({"error": error}), 400

    # 🧠 Risk analysis
    risk_level, risks = analyze_risk(cleaned_text)

    return jsonify({
        "original_text": text,
        "cleaned_text": cleaned_text,
        "risk_level": risk_level,
        "detected_issues": risks
    })