# SCANR — Universal Barcode Scanner & Generator

> **READ IT. MAKE IT.**  
> *One tool for everything encoded.*

SCANR is a fast, browser-based barcode utility engineered as an experimental industrial optical device.

---

## ⚡ Key Features

### 01 — SCAN (`/scan`)
- **Live Optical Stream**: Instant barcode detection from mobile and desktop webcams with rear-camera auto-preference.
- **Viewfinder Telemetry**: Targeting reticle, animated laser line, corner registration marks, resolution & FPS telemetry counters.
- **Hardware Controls**: Flashlight / torch toggle, multi-camera switching, and synthesized audio / haptic lock-on feedback.
- **Still Specimen Analysis**: Drag & drop image files, file browsing, or direct clipboard pasting (`Ctrl + V`).
- **Smart Specimen Classification**: Automatic detection of URLs, GS1 GTIN product codes, email addresses, phone numbers, and Wi-Fi networks.
- **Fast Action Toolbar**: One-click clipboard copy, Google / UPC search, derivative barcode creation, and buffer history.

### 02 — CREATE (`/create`)
- **Multi-Symbology Support**:
  - **1D Linear**: Code 128, Code 39, EAN-13, EAN-8, UPC-A, UPC-E, ITF-14, Interleaved 2 of 5, Codabar, Pharmacode.
  - **2D Matrix**: QR Code, Data Matrix, Aztec Code, PDF417.
- **Live Specimen Sheet**: Real-time rendering as you type with Modulo-10 check digit computation.
- **Export Capabilities**: Lossless vector SVG for precision printing and high-DPI PNG raster exports.
- **Optical Customization**: Selectable color palettes (Standard Mono, Dark Invert, Safety Hazard Red, Optic Acid Yellow, Cyan Blueprint), scale multipliers, and human-readable text toggles.

### 03 — PRIVACY & ZERO TELEMETRY (`/about`)
- **100% Local Processing**: All camera frames and encoding algorithms execute locally inside your browser via Canvas & WebRTC. No data or camera images are sent to any external server.
- **Zero Database & Zero Accounts**: Immediate access without sign-up or tracking.

---

## 🛠️ Technology Stack

- **Frontend**: Vue 3 (Composition API), Vite, TypeScript, Tailwind CSS
- **Symbology Engines**: Native `BarcodeDetector` API, `@zxing/library`, `bwip-js`
- **Backend (Optional)**: Python Flask (`backend/app.py`)
- **Deployment**: Vercel ready (`vercel.json`)

---

## 🚀 Quick Start

### 1. Frontend Development Server
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### 2. Build for Production
```bash
npm run build
```

### 3. Optional Flask Backend
```bash
pip install -r backend/requirements.txt
python backend/app.py
```
