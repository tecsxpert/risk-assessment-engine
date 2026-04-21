from flask import Flask, jsonify
from routes.test_routes import test_bp
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)

# 🔐 SINGLE global limiter (correct approach)
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["5 per minute"]  # 🔥 keep low for testing
)

# ✅ Register routes
app.register_blueprint(test_bp)

# ✅ Health endpoint
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "AI service is running"
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)