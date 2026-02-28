🏥 Med-AI: AI-Powered Disease Prediction & Health Assessment
Med-AI is a modern, responsive, and intelligent healthcare web application designed to help users identify potential illnesses based on their symptoms. By leveraging a custom Machine Learning backend and a highly intuitive interface, Med-AI provides users with real-time health insights, BMI tracking, and structured medical reports.

✨ Key Features
🚀 Core Functionality
🔐 Authentication System: Secure email & password login via Firebase Auth. Features include new account creation, mandatory email verification before login, secure session persistence, and seamless logout.

👤 Comprehensive Profile Management: Users build a dedicated health profile storing their Full Name, Age, Height, Weight, City, State, Mobile Number, and an optional Profile Photo—all safely secured in Firebase Firestore.

🧮 Dynamic BMI Calculator: Instantly calculates the user's Body Mass Index (BMI = weight / (height in m)²) and displays their clinical health category (e.g., Underweight, Healthy, Overweight) directly on the dashboard.

🩺 Interactive Symptoms Checklist: A powerful multi-select grid allowing users to filter symptoms by category (All, Fever, Body, Mind) or search via text. Features a smart "Action Capsule" keeping track of selected symptoms.

🤖 AI Disease Prediction Engine: Connects to a robust ML backend hosted on Render via a POST /predict endpoint. It processes the user's symptoms and returns the Top 3 predicted diseases along with their calculated probability percentages.

🕒 Clinical History Tracking: Every assessment is archived in Firestore. Users can browse their past health checks (Date, Time, Symptoms, Predictions) in the dedicated History tab.

🎨 UI & UX Innovations
🖥️ Modern Medical Theme: A clean, minimalist interface utilizing a professional Teal-based medical color palette, soft gradients, rounded card components, and a consistent typography hierarchy.

🧭 Structured Navigation: Features a fixed sidebar navigation for desktop and a sleek bottom navigation bar for mobile, ensuring rapid access to the Dashboard, Assessments, History, and Profile.

📊 Personalized Dashboard: Greets the user by name, displays their active BMI gauge, shows recent activity timelines, and provides quick-action cards to start new assessments or view history.

🏆 Advanced Results Display: Predictions are shown on beautifully ranked cards (1st, 2nd, 3rd) complete with color-coded severity indicators, percentage probabilities, and dynamic recommended next steps (e.g., Rest, Consult Doctor).

🖼️ Professional Report Generation (Upgraded!): Instead of plain text, users can now export their assessment as a High-Resolution PNG Image. This beautifully structured snapshot includes the Med-AI header, user demographics, BMI, symptoms, predictions, and recommendations—perfect for sharing with healthcare providers.

📱 Fully Responsive Architecture: Built with an adaptive grid system that fluidly transforms from a wide-screen desktop dashboard (with a persistent sidebar) to a stacked, app-like mobile experience.

🛠️ Technology Stack
Frontend: React.js, standard CSS3 (Custom responsive grid & flexbox architecture)

Backend / AI: Python, Machine Learning Model (Deployed on Render)

Database: Firebase Firestore (NoSQL)

Authentication: Firebase Authentication

Report Export: html2canvas (For rendering DOM elements to downloadable PNGs)

📸 Application Flow
Onboarding: User registers, verifies their email, and fills out their physical demographics.

Dashboard: User lands on the tailored home screen featuring their calculated BMI and recent assessment history.

Assessment: User clicks "Start Assessment", searches/filters their active symptoms, and hits "Analyze".

Processing: The frontend sends the symptom array to the Render backend, triggering the ML model.

Results & Export: The UI beautifully cascades the Top 3 predictions. The user can then click "Download Image" to save a clinical snapshot of the results.
