# SCANR — Backend Service

Lightweight, stateless Flask backend API for SCANR.

## Running Locally

1. Create and activate a Python virtual environment:
```bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

2. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

3. Run Flask server:
```bash
python backend/app.py
```

## API Endpoints

- `GET /api/health` — System status and telemetry state
- `GET /api/formats` — Catalog of supported barcode symbologies
- `POST /api/validate` — Symbology payload validation
- `GET /*` — Serves frontend SPA `dist/` bundle if built
