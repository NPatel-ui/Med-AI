🩺 Med-AI — AI Powered Symptom & Lab Report Analyzer

Med-AI is a modern AI-powered health assistant that helps users analyze symptoms and interpret lab reports using machine learning and natural language processing.

The application provides a mobile-first healthcare dashboard where users can:

Check symptoms

Get AI disease predictions

Upload lab reports for automatic analysis

Track medical history

Manage health profile data

The system combines Machine Learning, Generative AI, and a full-stack architecture to deliver a smooth and intelligent healthcare experience.

🚀 Live Demo

Frontend: https://med-ai-main.vercel.app
Backend API: https://med-ai-1-is35.onrender.com

✨ Key Features
🔐 Secure Authentication

Firebase Authentication

Email verification

Password reset

Secure password update

🧠 AI Symptom Analysis

Users can select symptoms and receive:

Top predicted diseases

AI generated precautions

Smart medical suggestions

🎤 Voice-Based Symptom Input

Users can speak symptoms and the system automatically:

Converts speech to text

Matches spoken symptoms

Auto-selects them in the checklist

📄 Lab Report AI Analysis

Upload a PDF lab report and Med-AI will:

Extract medical values

Identify abnormal parameters

Generate simplified medical explanations

Suggest next steps

📊 Health Dashboard

The dashboard displays:

BMI analysis with dynamic gauge

Recent medical activity

Quick access to symptom assessment

Lab report upload

🧾 Medical History Tracking

Stores:

Symptom assessments

AI predictions

Lab report analyses

Users can revisit previous reports anytime.

👤 Health Profile Management

Users can manage:

Name

Age

Height & Weight

Gender

Location

Profile photo

BMI is automatically calculated based on profile data.

🌙 Dark Mode Support

The application supports a fully responsive light and dark theme.

📱 Mobile-First UI

The interface is optimized for:

Smartphones

Tablets

Desktop browsers

🏗️ Tech Stack
Frontend

React

Vite

Firebase Authentication

Firestore

HTML2Canvas

Web Speech API

Backend

FastAPI

Python

Machine Learning Model (Disease Prediction)

Google Generative AI

PDF Processing

Database

Firebase Firestore

Deployment

Vercel (Frontend)

Render (Backend)

📂 Project Architecture

Frontend

React (Vite)
│
├── Authentication
├── Symptom Selection UI
├── Voice Recognition
├── Lab Report Upload
├── Medical Dashboard
└── History Tracking

Backend

FastAPI
│
├── /predict           → Disease prediction
├── /symptoms          → Symptom list API
├── /parse-report      → Lab report AI analysis
└── /health            → API health check
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/yourusername/med-ai.git
cd med-ai
2️⃣ Install Frontend Dependencies
npm install
3️⃣ Environment Variables

Create a .env file.

VITE_API_URL=your_backend_url

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
4️⃣ Start Development Server
npm run dev
🧠 AI Capabilities

Med-AI integrates AI for:

Disease prediction using machine learning

Medical report interpretation

Natural language explanations

Voice-based symptom input

This enables a fast preliminary health assessment system.

⚠️ Disclaimer

Med-AI is designed for educational and informational purposes only.

It does not replace professional medical diagnosis.
Users should always consult a qualified healthcare professional.

📈 Future Improvements

Multi-language voice support

Doctor consultation integration

WhatsApp triage assistant

Wearable device health data integration

Advanced ML disease prediction model
