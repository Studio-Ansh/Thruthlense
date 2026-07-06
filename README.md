# Truthlens Verify 🔍

An advanced, multi-modal neural verification platform engineered to analyze visual authenticity, detect deepfakes, trace cryptographic lineage logs, and verify factual claims in real-time. Powered by custom PyTorch forensics pipelines, Google Firestore, and state-of-the-art GenAI models (Gemini 3.5 Flash).

---

## 🌟 Core System Capabilities

### 1. Multi-Modal Forensics Pipelines
- **Visual Authentication (Images)**: High-resolution texture and frequency-domain check utilizing a hybrid **EfficientNetB4** & **ViT (Vision Transformer)** neural architecture. Detects generative infills, diffusion boundary anomalies, lighting mismatches, and edge-refraction artifacts.
- **Spatio-Temporal Analysis (Videos)**: Frame-by-frame analysis with a **ResNeXt50-Bi-LSTM** sequence model. Tracks micro-expressions, lip-sync alignment, and temporal jitter to detect modern face-swaps.
- **Acoustic Fingerprinting (Audio)**: Analyzes voice pitch contours, spectral integrity, and phase coherence to flag voice-cloning networks or neural vocoder synthesis.
- **Cognitive Fallback Engine**: Standardized heuristic evaluation filters and rule-based verification when remote API networks or pipeline scripts are disconnected.

### 2. Real-Time Fact & News Verification
- **Aggregated Dataset Scanning**: Cross-references user queries instantly against high-precision curated rumor datasets (`TheNewsAPI`, `Currents`, `Mediastack`, `GNews`, `NewsData`).
- **Semantic Search Grounding**: Leverages Google Search Grounding through Gemini to dynamically parse context integrity and assign reliability ratings.
- **Domain Monitoring**: Dynamically updates risk profiles for newly flagged sources in a centralized host database.

### 3. Verification Log & User Telemetry
- **Cloud-Synced History**: Secure, lightweight user session tracking with persistent verification histories.
- **Durable Storage**: Utilizes Google Cloud Firestore for tracking scanning histories, confidence percentages, threat categories, and generated report links.
- **Authenticity Audit Logs**: Renders full JSON metadata tracing backbones used, confidence tiers, and red flag lists.

### 4. Interactive Immersive User Interface
- **Modern Spatial Design**: A dark, high-contrast visual theme designed for heavy forensics monitoring.
- **AI Pipeline Visualizer**: Renders interactive canvas nodes showing computational layers (Inference Engine, Cognitive Grounding, Neural Decoders).
- **Physics-Informed Aesthetics**: Subtle, high-performance web animations, interactive canvas graphics, and responsive particle effects driven by modern physics math.

---

## 🛠️ Architecture & Tech Stack

### Frontend Layer
- **Framework**: React 19 + TypeScript (strictly typed)
- **Styling**: Tailwind CSS v4 (offering rapid fluid layout engines and deep system styling variables)
- **Motion**: Framer Motion v12 (`motion/react`) for smooth page transitions and responsive user feedback loops
- **Icons**: Lucide React for consistent display indicators

### Backend Layer
- **Runtime**: Node.js + Express + `tsx` for TypeScript execution
- **File Ingress**: Multer (configured with 100MB buffer memory limit)
- **Deep Learning Pipelines**: Local Python3 scripts running PyTorch inference engines to evaluate visual artifacts
- **AI Orchestration**: Official `@google/genai` TypeScript SDK (utilizing Gemini 3.5 Flash for advanced visual forensics and real-time grounding)

### Persistent Services
- **Database**: Cloud Firestore (NoSQL Document database representing user records, monitored domains, and telemetry details)
- **Authentication**: Firebase Auth integration (custom username lookup mappings for smooth onboarding)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Python 3.10+** (if executing native PyTorch verification scripts locally)

### Installation

1. Install project dependencies:
   ```bash
   npm install
   ```

2. (Optional) Install local PyTorch and requirements for physical script analysis:
   ```bash
   pip install -r video_model/requirements.txt
   ```

### Environment Configuration

Configure your environment variables by copying `.env.example` to `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

Ensure a compliant `/firebase-applet-config.json` is configured in the root directory:
```json
{
  "projectId": "studio-2293577197-e9247",
  "appId": "1:1086136839374:web:db599e1f8e80564d42b49f",
  "apiKey": "AIzaSyA1dumsHTENLPgnOkyyI6_YSMqM0Z2EC08",
  "authDomain": "studio-2293577197-e9247.firebaseapp.com",
  "firestoreDatabaseId": "(default)",
  "storageBucket": "studio-2293577197-e9247.firebasestorage.app",
  "messagingSenderId": "1086136839374"
}
```

---

## 💻 Development & Deployment Commands

- **Start Development Server**: Runs the Express backend server on Port `3000` with hot-reloaded dev assets served through Vite:
  ```bash
  npm run dev
  ```

- **Build Production Bundle**: Compiles TypeScript backend files using `esbuild` into a unified CommonJS target `dist/server.cjs` and processes frontend static assets into `dist/`:
  ```bash
  npm run build
  ```

- **Run Production App**: Launches the standalone, compiled server with production environment bindings:
  ```bash
  npm run start
  ```

- **Verify Type Safety & Integrity**: Run the linter to ensure syntax compliance:
  ```bash
  npm run lint
  ```

---

## 🔒 Security & Data Isolation

- **Server-Side API Proxies**: All API credentials and model keys remain isolated on the Express server (`server.ts`). Browser clients communicate solely via clean backend routes (`/api/*`), completely safeguarding system keys from devtools inspector exposure.
- **Firestore Security Rules**: Security guidelines restrict and secure read/write paths, maintaining robust data isolation for individual operators.

---

*Engineered with precision for the Truthlens Open Media Initiative.*
