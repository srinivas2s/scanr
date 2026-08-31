"""
SCANR — Flask API Subsystem
Minimal, stateless, zero-database backend service.
"""

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import re

app = Flask(__name__, static_folder="../dist", static_url_path="/")
CORS(app)

FORMAT_CATALOG = [
    {
        "id": "CODE128",
        "name": "Code 128",
        "category": "1D",
        "standard": "ISO/IEC 15417",
        "minLen": 1,
        "maxLen": 80,
    },
    {
        "id": "CODE39",
        "name": "Code 39",
        "category": "1D",
        "standard": "ISO/IEC 16388",
        "minLen": 1,
        "maxLen": 43,
    },
    {
        "id": "EAN13",
        "name": "EAN-13",
        "category": "1D",
        "standard": "ISO/IEC 15420 / GS1",
        "minLen": 12,
        "maxLen": 13,
    },
    {
        "id": "EAN8",
        "name": "EAN-8",
        "category": "1D",
        "standard": "GS1 Standard",
        "minLen": 7,
        "maxLen": 8,
    },
    {
        "id": "UPCA",
        "name": "UPC-A",
        "category": "1D",
        "standard": "ANSI MH10.8M / GS1",
        "minLen": 11,
        "maxLen": 12,
    },
    {
        "id": "UPCE",
        "name": "UPC-E",
        "category": "1D",
        "standard": "GS1 Zero-Suppressed",
        "minLen": 6,
        "maxLen": 8,
    },
    {
        "id": "ITF14",
        "name": "ITF-14",
        "category": "1D",
        "standard": "GS1 Shipping Container",
        "minLen": 13,
        "maxLen": 14,
    },
    {
        "id": "QR",
        "name": "QR Code",
        "category": "2D",
        "standard": "ISO/IEC 18004",
        "minLen": 1,
        "maxLen": 2048,
    },
    {
        "id": "DATAMATRIX",
        "name": "Data Matrix",
        "category": "2D",
        "standard": "ISO/IEC 16022",
        "minLen": 1,
        "maxLen": 1000,
    },
    {
        "id": "AZTEC",
        "name": "Aztec Code",
        "category": "2D",
        "standard": "ISO/IEC 24778",
        "minLen": 1,
        "maxLen": 1500,
    },
    {
        "id": "PDF417",
        "name": "PDF417",
        "category": "2D",
        "standard": "ISO/IEC 15438",
        "minLen": 1,
        "maxLen": 1100,
    },
]

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ONLINE",
        "engine": "SCANR-FLASK-CORE",
        "version": "1.0.0",
        "mode": "STATELESS_LOCAL_READY",
        "storage": "ZERO_DATABASE",
        "telemetry": "DISABLED"
    })

@app.route("/api/formats", methods=["GET"])
def get_formats():
    return jsonify({
        "count": len(FORMAT_CATALOG),
        "formats": FORMAT_CATALOG
    })

@app.route("/api/validate", methods=["POST"])
def validate_specimen():
    data = request.get_json() or {}
    fmt = data.get("format", "").upper()
    val = data.get("value", "")

    if not val:
        return jsonify({"valid": False, "error": "Value cannot be empty"}), 400

    format_entry = next((f for f in FORMAT_CATALOG if f["id"] == fmt), None)
    if not format_entry:
        return jsonify({"valid": False, "error": f"Unknown format: {fmt}"}), 400

    min_len = format_entry.get("minLen", 1)
    max_len = format_entry.get("maxLen", 2048)

    if len(val) < min_len:
        return jsonify({"valid": False, "error": f"Minimum length is {min_len}"}), 400
    if len(val) > max_len:
        return jsonify({"valid": False, "error": f"Maximum length is {max_len}"}), 400

    if fmt in ["EAN13", "EAN8", "UPCA", "UPCE", "ITF14"] and not val.isdigit():
        return jsonify({"valid": False, "error": "Numeric digits required for this symbology"}), 400

    return jsonify({
        "valid": True,
        "format": fmt,
        "value": val,
        "length": len(val)
    })

# Unified Static Serving (SPA Fallback)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_spa(path):
    dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../dist"))
    if path and os.path.exists(os.path.join(dist_dir, path)):
        return send_from_directory(dist_dir, path)
    if os.path.exists(os.path.join(dist_dir, "index.html")):
        return send_from_directory(dist_dir, "index.html")
    return jsonify({
        "message": "SCANR Backend API online. Run frontend via Vite (npm run dev) or build dist (npm run build)."
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
