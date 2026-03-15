import { useState, useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import html2canvas from "html2canvas";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";


// ── CSS & Screen imports ──────────────────────────────────────────────────────
import "./index.css";
import Sidebar    from "./components/Sidebar";
import BottomNav  from "./components/BottomNav";
import AuthScreen         from "./screens/AuthScreen";
import Dashboard          from "./screens/Dashboard";
import SymptomAssessment  from "./screens/SymptomAssessment";
import ResultsView        from "./screens/ResultsView";
import LabReportView      from "./screens/LabReportView";
import ProfileSettings    from "./screens/ProfileSettings";
import HistoryScreen      from "./screens/HistoryScreen";
import { Icons }          from "./components/Icons";

// ─────────────────────────────────────────────────────────────────────────────
// Firebase Initialization
// ─────────────────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "https://med-ai-1-is35.onrender.com";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

let app, auth, db;
try {
  app  = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db   = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Failed:", error);
}

const appId = "med-ai-local";

// ─────────────────────────────────────────────────────────────────────────────
// App Component
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {

  // ── Navigation / UI State ─────────────────────────────────────────────────
  const [screen,          setScreen]          = useState("login");
  const [isSidebarOpen,   setIsSidebarOpen]   = useState(false);
  const [theme,           setTheme]           = useState(localStorage.getItem("theme") || "light");

  // ── Auth State ────────────────────────────────────────────────────────────
  const [isLoggedIn,      setIsLoggedIn]      = useState(false);
  const [currentUser,     setCurrentUser]     = useState(null);
  const [isNewUser,       setIsNewUser]       = useState(false);
  const [loginData,       setLoginData]       = useState({ email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");

  // ── Profile / User Data ───────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState({
    name: "", age: "", weight: "", height: "", gender: "",
    email: "", phone: "", city: "", state: "", country: "",
    photo: "", password: "",
  });
  const [isEditingProfile,  setIsEditingProfile]  = useState(false);
  const [isChangingPassword,setIsChangingPassword] = useState(false);
  const [passwordData,      setPasswordData]       = useState({ current: "", new: "", confirm: "" });
  const [showProfilePasswords, setShowProfilePasswords] = useState({ current: false, new: false, confirm: false });
  // ── Loading States ────────────────────────────────────────────────────────
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  // ── Symptom / Assessment State ────────────────────────────────────────────
  const [symptoms,         setSymptoms]         = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [searchQuery,      setSearchQuery]      = useState("");
  const [isListening,      setIsListening]      = useState(false);
  const [spokenText,       setSpokenText]       = useState(""); // eslint-disable-line no-unused-vars

  // ── Results / History State ───────────────────────────────────────────────
  const [results,            setResults]            = useState([]);
  const [precautions,        setPrecautions]        = useState("");
  const [history,            setHistory]            = useState([]);
  const [labHistory,         setLabHistory]         = useState([]);
  const [viewingHistoryItem, setViewingHistoryItem] = useState(null); // eslint-disable-line no-unused-vars

  // ── Lab Report State ──────────────────────────────────────────────────────
  const [reportFile,   setReportFile]   = useState(null);  // eslint-disable-line no-unused-vars
  const [parsedReport, setParsedReport] = useState(null);
  const [isParsing,    setIsParsing]    = useState(false);  // eslint-disable-line no-unused-vars

  // ── Toast Notifications ───────────────────────────────────────────────────
  const [error,        setError]        = useState(null);
  const [notification, setNotification] = useState(null);

  const fallbackSymptoms = [
    "itching", "skin_rash", "shivering", "joint_pain",
    "stomach_pain", "fatigue", "cough", "high_fever",
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // Effects
  // ─────────────────────────────────────────────────────────────────────────

  // Persist theme
  useEffect(() => { localStorage.setItem("theme", theme); }, [theme]);

  // ── BULLETPROOF SYMPTOM FETCHER ──
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;

    const loadSymptoms = async () => {
      try {
        // CHANGED THIS LINE: Now it dynamically uses your live Render backend!
        const response = await fetch(`${API_BASE}/symptoms`);
        
        if (!response.ok) throw new Error("Backend not ready");
        
        const data = await response.json();
        setSymptoms(data.symptoms);
        console.log("✅ Symptoms loaded successfully!");

      } catch (error) {
        console.warn(`⚠️ Symptom fetch failed. Retrying... (${retryCount}/${maxRetries})`);
        
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(loadSymptoms, 2000); 
        } else {
          console.error("❌ Could not load symptoms after multiple attempts.");
        }
      }
    };

    loadSymptoms();
  }, []);

  // Auth state listener + symptoms fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // STRICT EMAIL VERIFICATION CHECK
        if (!user.emailVerified) {
          await signOut(auth);
          setIsLoggedIn(false);
          setScreen("login");
          return;
        }
        setCurrentUser(user);
        setIsLoggedIn(true);
        await fetchUserData(user.uid, user.email);
        if (screen === "login") setScreen("home");
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setScreen("login");
      }
    });

    fetch(`${API_BASE}/health`)
      .then((res) => res.json())
      .then((data) => console.log("Backend status:", data))
      .catch(() => console.warn("Backend not reachable"));

    fetch(`${API_BASE}/symptoms`)
      .then((res) => res.json())
      .then((data) => {
        const validData = data.symptoms || data;
        setSymptoms(Array.isArray(validData) ? validData : fallbackSymptoms);
      })
      .catch(() => setSymptoms(fallbackSymptoms));

    return () => unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-clear notifications
  useEffect(() => {
    if (notification) { const t = setTimeout(() => setNotification(null), 3500); return () => clearTimeout(t); }
  }, [notification]);

  useEffect(() => {
    if (error) { const t = setTimeout(() => setError(null), 3500); return () => clearTimeout(t); }
  }, [error]);

  // ─────────────────────────────────────────────────────────────────────────
  // Firebase Data Functions
  // ─────────────────────────────────────────────────────────────────────────

  const fetchUserData = async (uid, email) => {
    if (!uid || (auth.currentUser && !auth.currentUser.emailVerified)) return;
    try {
      const profileRef  = doc(db, "artifacts", appId, "users", uid, "profile", "main");
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) setUserProfile((prev) => ({ ...prev, ...profileSnap.data() }));
      else console.log("New user profile initializing...");

      const historyRef  = doc(db, "artifacts", appId, "users", uid, "data", "history");
      const historySnap = await getDoc(historyRef);
      if (historySnap.exists()) setHistory(historySnap.data().records || []);

      const labRef  = doc(db, "artifacts", appId, "users", uid, "data", "labHistory");
      const labSnap = await getDoc(labRef);
      if (labSnap.exists()) setLabHistory(labSnap.data().records || []);
    } catch (err) {
      setError("Connection interrupted.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // BMI Calculations
  // ─────────────────────────────────────────────────────────────────────────

  const calculateBMI = () => {
    const w = parseFloat(userProfile.weight);
    const h = parseFloat(userProfile.height) / 100;
    if (w > 0 && h > 0) return (w / (h * h)).toFixed(1);
    return null;
  };

  const getBMIInfo = (bmi) => {
    if (!bmi) return { label: "N/A", color: "#94A3B8" };
    const val = parseFloat(bmi);
    if (val < 18.5)              return { label: "Underweight", class: "bmi-yellow" };
    if (val >= 18.5 && val <= 24.9) return { label: "Healthy",     class: "bmi-green"  };
    return                              { label: "Overweight",  class: "bmi-red"   };
  };

  const calculateNeedleAngle = (bmi) => {
    if (!bmi) return -90;
    const minBmi = 15, maxBmi = 40;
    const clamped = Math.max(minBmi, Math.min(maxBmi, parseFloat(bmi)));
    return ((clamped - minBmi) / (maxBmi - minBmi)) * 180 - 90;
  };

  const bmiValue = calculateBMI();
  const bmiInfo  = getBMIInfo(bmiValue);

  // ─────────────────────────────────────────────────────────────────────────
  // Input Handlers
  // ─────────────────────────────────────────────────────────────────────────

const handleProfileChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // 1. STRICT TEXT-ONLY: Applies to Name, City, and State
    if (name === "name" || name === "city" || name === "state") {
      // This regex removes anything that isn't a letter (a-z) or a space
      val = val.replace(/[^a-zA-Z\s]/g, ""); 
    }

    // 2. STRICT PHONE: Only numbers, max 10 digits
    if (name === "phone") {
      val = val.replace(/\D/g, "").slice(0, 10);
    }

    // 3. Email: Auto-cap at .com (Existing logic)
    if (name === "email") {
      const comIndex = val.toLowerCase().indexOf(".com");
      if (comIndex !== -1) val = val.slice(0, comIndex + 4);
    }

    // 4. Numerical Vitals: Prevent unrealistic numbers
    if (name === "age" && val !== "" && Number(val) > 120) return;
    if (name === "height" && val !== "" && Number(val) > 250) return;
    if (name === "weight" && val !== "" && Number(val) > 250) return;

    setUserProfile((prev) => ({ ...prev, [name]: val }));
  };
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "email") {
      const comIndex = val.toLowerCase().indexOf(".com");
      if (comIndex !== -1) val = val.slice(0, comIndex + 4);
    }
    setLoginData((prev) => ({ ...prev, [name]: val }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 1000000) { setError("Photo is too large."); return; }
    const reader = new FileReader();
    reader.onloadend = () => setUserProfile((prev) => ({ ...prev, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Auth Handlers
  // ─────────────────────────────────────────────────────────────────────────

  
  
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setError("Please enter your email and password.");
      return;
    }
    
    setIsAuthLoading(true);
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        // Send a fresh link
        await sendEmailVerification(user);
        setError("Email not verified. A new verification link has been sent to your inbox.");
        await signOut(auth); // Log them out immediately
        setIsAuthLoading(false);
        return; 
      }

      setNotification("Login successful! Welcome back.");
      setScreen("home"); // Navigate to dashboard
    } catch (err) {
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Incorrect email or password. Please try again.");
      } else {
        setError("Login Error: " + err.message);
      }
    } finally {
      setIsAuthLoading(false);
    }
  };
  

const handleRegister = async (e) => {
  e.preventDefault();

  if (!userProfile.name || !userProfile.email || !userProfile.password) {
    setError("Please fill all required fields.");
    return;
  }

  if (userProfile.password !== confirmPassword) {
    setError("Passwords do not match!");
    return;
  }

  try {

    // STEP 1 — Create Firebase user
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      userProfile.email,
      userProfile.password
    );

    const user = userCredential.user;

    // STEP 2 — Send verification email
    await sendEmailVerification(user);

    // STEP 3 — Send profile data to backend
    const payload = {
      ...userProfile,
      role: "user"
    };

    await fetch(`${API_BASE}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    setNotification(
      "Account created! Verification email sent. Please check your inbox."
    );

    setIsNewUser(false);

  } catch (err) {
    console.error("Registration Error:", err);
    setError(err.message);
  }
};
  
 const handleLogout = async () => {
    try {
      await signOut(auth);
      // Reset profile to empty strings
      setUserProfile({
        name: "", age: "", weight: "", height: "", gender: "",
        email: "", phone: "", city: "", state: "", country: "",
        photo: "", password: "",
      });
      setLoginData({ email: "", password: "" });
      setScreen("login");
    } catch (err) { console.error(err); }
  };
  const handleForgotPassword = async () => {
    setError(null);
    if (!loginData.email) { setError("Please enter your email first."); return; }
    try {
      await sendPasswordResetEmail(auth, loginData.email);
      setNotification("Reset link sent! Check your email.");
    } catch (err) { setError(err.message); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Profile Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleUpdateProfile = async () => {
    try {
      if (currentUser) {
        const profileRef = doc(db, "artifacts", appId, "users", currentUser.uid, "profile", "main");
        await setDoc(profileRef, userProfile, { merge: true });
        setNotification("Profile updated successfully!");
        setIsEditingProfile(false);
      }
    } catch (err) { setError("Failed to update profile."); }
  };

  const handleChangePassword = async () => {
    setError(null);
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setError("Please fill in all password fields."); return;
    }
    if (passwordData.new !== passwordData.confirm) { setError("New passwords do not match!"); return; }
    if (passwordData.new.length < 6) { setError("New password must be at least 6 characters."); return; }
    try {
      const credential = EmailAuthProvider.credential(currentUser.email, passwordData.current);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, passwordData.new);
      setNotification("Password updated successfully!");
      setIsChangingPassword(false);
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch (err) {
      setError(
        err.message === "Firebase: Error (auth/invalid-credential)."
          ? "Incorrect current password."
          : err.message
      );
    }
  };

  const handleProfileForgotPassword = async () => {
    setError(null);
    try {
      if (currentUser && currentUser.email) {
        await sendPasswordResetEmail(auth, currentUser.email);
        setNotification("Reset link sent! Check your email.");
        setIsChangingPassword(false);
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (err) { setError(err.message); }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Navigation
  // ─────────────────────────────────────────────────────────────────────────

  const navigateTo = (scr) => {
    setScreen(scr);
    setViewingHistoryItem(null);
    setIsSidebarOpen(false);
    setIsEditingProfile(false);
  };

  const startNewAssessment = () => {
    setSelectedSymptoms({});
    setResults([]);
    setSearchQuery("");
    setScreen("symptoms");
    setIsSidebarOpen(false);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Symptom / Voice Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const toggleSymptom = (s) => setSelectedSymptoms((prev) => ({ ...prev, [s]: !prev[s] }));

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Your browser doesn't support voice recognition. Try Chrome!"); return; }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => { setIsListening(true); setSearchQuery("Listening..."); };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setSearchQuery(transcript);
      const spokenWords = transcript.toLowerCase();
      setSelectedSymptoms((prev) => {
        const updated = { ...prev };
        symptoms.forEach((symptom) => {
          const clean = symptom.replace(/_/g, " ").toLowerCase();
          if (spokenWords.includes(clean)) updated[symptom] = true;
        });
        return updated;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setSearchQuery("");
      setError("Could not hear you properly. Please try again.");
    };

    recognition.onend = () => { setIsListening(false); };
    recognition.start();
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Analysis API Call
  // ─────────────────────────────────────────────────────────────────────────

  async function analyzeSymptoms() {
    setError(null);
    const selected = Object.keys(selectedSymptoms).filter((s) => selectedSymptoms[s]);
    if (selected.length === 0) { setError("Please select at least one symptom."); return; }
    setScreen("loading");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: selected, user_email: currentUser?.email || null }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);

      const data = await res.json();
      console.log("🟢 BACKEND DATA RECEIVED:", data);

      // Bulletproof sanitization
      let safePredictions = [];
      if (Array.isArray(data.predictions))         safePredictions = data.predictions.map(String);
      else if (typeof data.predictions === "string") safePredictions = [data.predictions];
      else                                            safePredictions = ["Analysis complete (No specific disease identified)"];

      const safePrecautions =
        typeof data.precaution === "string"
          ? data.precaution
          : "Consult a healthcare professional.";

      const newEntry = {
        date:           new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time:           new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        topMatch:       safePredictions[0] || "Unknown",
        symptoms:       selected,
        allPredictions: safePredictions,
        precautions:    safePrecautions,
      };

      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);

      if (currentUser) {
        await setDoc(
          doc(db, "artifacts", appId, "users", currentUser.uid, "data", "history"),
          { records: updatedHistory },
          { merge: true }
        );
      }

      setResults(safePredictions);
      setPrecautions(safePrecautions);
      setScreen("results");

    } catch (err) {
      console.error("🔴 API ERROR:", err);
      setError(
        err.name === "AbortError"
          ? "Request timed out. Backend is waking up."
          : "Connection failed. Check console."
      );
      setScreen("symptoms");
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Lab Report Upload
  // ─────────────────────────────────────────────────────────────────────────

  const handleReportUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") { setError("Please upload a PDF file."); return; }
    setReportFile(file);
    setIsParsing(true);
    setScreen("parsing_loading");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/parse-report`, { method: "POST", body: formData });
      if (!res.ok) throw new Error("Failed to analyze report");
      const data = await res.json();
      setParsedReport(data);

      const newLabEntry = {
        type:       "lab_report",
        date:       new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
        time:       new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        reportData: data,
      };

      const updatedLabHistory = [newLabEntry, ...labHistory].slice(0, 10);
      setLabHistory(updatedLabHistory);

      if (currentUser) {
        await setDoc(
          doc(db, "artifacts", appId, "users", currentUser.uid, "data", "labHistory"),
          { records: updatedLabHistory },
          { merge: true }
        );
      }

      setScreen("report_results");
      setNotification("Report analyzed successfully!");
    } catch (err) {
      console.error(err);
      setError("Error analyzing report. Please try again.");
      setScreen("home");
    } finally {
      setIsParsing(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Export Report (html2canvas)
  // ─────────────────────────────────────────────────────────────────────────

  const exportReport = async () => {
    const captureElement = document.querySelector(".printable-report-capture");
    if (!captureElement) { setError("Could not find the report to download."); return; }
    try {
      setNotification("Generating high-res report...");
      await new Promise((resolve) => setTimeout(resolve, 300));
      const canvas = await html2canvas(captureElement, {
        scale:           4,
        backgroundColor: "#F4F7F9",
        useCORS:         true,
        allowTaint:      true,
      });
      const image = canvas.toDataURL("image/png", 1.0);
      const link  = document.createElement("a");
      link.href   = image;
      link.download = `MedAI_Report_${userProfile.name ? userProfile.name.replace(/\s+/g, "_") : "User"}_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      setError("Failed to generate high-res image.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // History Viewer
  // ─────────────────────────────────────────────────────────────────────────

  const handleViewActivity = (item) => {
    try {
      if (item.type === "lab_report") {
        setParsedReport(item.reportData || { summary: "No data found.", abnormal_results: [] });
        setScreen("report_results");
      } else {
        const safeResults  = Array.isArray(item.allPredictions)
          ? item.allPredictions
          : (item.topMatch ? [item.topMatch] : ["Analysis Complete"]);
        setResults(safeResults);
        setPrecautions(item.precautions || "Please consult a healthcare professional.");
        const restored = {};
        if (Array.isArray(item.symptoms)) item.symptoms.forEach((s) => (restored[s] = true));
        setSelectedSymptoms(restored);
        setScreen("results");
      }
    } catch (err) {
      console.error("Error opening history item:", err);
      setError("Could not open this record.");
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Combined activity feed (dashboard)
  // ─────────────────────────────────────────────────────────────────────────
  const allActivity = [...history, ...labHistory].sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA;
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Helpers for showing/hiding navigation
  // ─────────────────────────────────────────────────────────────────────────
  const isAuthScreen = screen === "login";
  const showNav = isLoggedIn && !isAuthScreen && screen !== "loading" && screen !== "parsing_loading";

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className={`med-ai-root ${theme}`}>

      {/* ── Animated Toast Notifications ───────────────────────────────── */}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 px-5 py-4 font-bold text-white shadow-2xl pointer-events-auto bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl"
            >
              <Icons.MedLogo size={20} className="text-white drop-shadow-md" />
              {notification}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 px-5 py-4 font-bold text-white shadow-2xl pointer-events-auto bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="app-layout">

        {/* ── Sidebar (desktop persistent / mobile slide-over) ──────────── */}
        {showNav && (
          <Sidebar
            screen={screen}
            navigateTo={navigateTo}
            startNewAssessment={startNewAssessment}
            handleLogout={handleLogout}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
        )}

        {/* ── Main Content Panel ────────────────────────────────────────── */}
        <div className="main-panel">

          {/* ── AUTH ─────────────────────────────────────────────────────── */}
              {screen === "login" && !isAuthLoading && (
                <AuthScreen
                  isNewUser={isNewUser}
                  setIsNewUser={setIsNewUser}
                  userProfile={userProfile}
                  handleProfileChange={handleProfileChange}
                  handlePhotoUpload={handlePhotoUpload}
                  loginData={loginData}
                  handleLoginChange={handleLoginChange}
                  confirmPassword={confirmPassword}
                  setConfirmPassword={setConfirmPassword}
                  handleLogin={handleLogin}
                  handleRegister={handleRegister}
                  handleForgotPassword={handleForgotPassword}
                />
              )}

              {/* ── AUTH LOADING (Full Screen Transition) ────────────────────── */}
              {screen === "login" && isAuthLoading && (
                <motion.div
                  key="auth-loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="flex flex-col items-center justify-center flex-1 min-h-screen p-6 text-center bg-slate-50 dark:bg-slate-950"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.15, 1],
                      boxShadow: [
                        "0px 0px 0px 0px rgba(16, 185, 129, 0)",
                        "0px 0px 40px 10px rgba(16, 185, 129, 0.4)",
                        "0px 0px 0px 0px rgba(16, 185, 129, 0)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="flex items-center justify-center w-28 h-28 mb-8 rounded-3xl bg-gradient-to-br from-emerald-400 to-teal-600"
                  >
                    <Icons.MedLogo size={48} className="text-white" />
                  </motion.div>
                  
                  <motion.h3
                    animate={{ opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                  >
                    {isNewUser ? "Creating Profile..." : "Authenticating..."}
                  </motion.h3>
                  <p className="max-w-sm mt-3 font-medium text-slate-500 dark:text-slate-400">
                    Establishing a secure connection to your health dashboard.
                  </p>
                </motion.div>
              )}

          {/* ── DASHBOARD ───────────────────────────────────────────────── */}
          {screen === "home" && (
            <Dashboard
              userProfile={userProfile}
              theme={theme}
              toggleTheme={toggleTheme}
              bmiValue={bmiValue}
              bmiInfo={bmiInfo}
              handleProfileChange={handleProfileChange} /* ADD THIS LINE */
              calculateNeedleAngle={calculateNeedleAngle}
              allActivity={allActivity}
              handleViewActivity={handleViewActivity}
              setScreen={setScreen}
              setIsSidebarOpen={setIsSidebarOpen}
              startNewAssessment={startNewAssessment}
              handleReportUpload={handleReportUpload}
            />
          )}

          {/* ── SYMPTOMS ─────────────────────────────────────────────────── */}
          {screen === "symptoms" && (
            <SymptomAssessment
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              toggleSymptom={toggleSymptom}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              analyzeSymptoms={analyzeSymptoms}
              setSelectedSymptoms={setSelectedSymptoms}
              isListening={isListening}
              handleVoiceInput={handleVoiceInput}
              navigateTo={navigateTo}
            />
          )}

          {/* ── HISTORY ──────────────────────────────────────────────────── */}
          {screen === "history" && (
            <HistoryScreen
              history={history}
              labHistory={labHistory}
              handleViewActivity={handleViewActivity}
              navigateTo={navigateTo}
            />
          )}

          {/* ── RESULTS ──────────────────────────────────────────────────── */}
          {screen === "results" && (
            <ResultsView
              results={results}
              precautions={precautions}
              selectedSymptoms={selectedSymptoms}
              userProfile={userProfile}
              exportReport={exportReport}
              setSelectedSymptoms={setSelectedSymptoms}
              navigateTo={navigateTo}
            />
          )}

          {/* ── LAB REPORT ───────────────────────────────────────────────── */}
          {screen === "report_results" && parsedReport && (
            <LabReportView
              parsedReport={parsedReport}
              exportReport={exportReport}
              navigateTo={navigateTo}
            />
          )}

          {/* ── PROFILE ──────────────────────────────────────────────────── */}
          {screen === "profile" && (
            <ProfileSettings
              userProfile={userProfile}
              handleProfileChange={handleProfileChange}
              handlePhotoUpload={handlePhotoUpload}
              isEditingProfile={isEditingProfile}
              setIsEditingProfile={setIsEditingProfile}
              handleUpdateProfile={handleUpdateProfile}
              isChangingPassword={isChangingPassword}
              setIsChangingPassword={setIsChangingPassword}
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              showProfilePasswords={showProfilePasswords}
              setShowProfilePasswords={setShowProfilePasswords}
              handleChangePassword={handleChangePassword}
              handleProfileForgotPassword={handleProfileForgotPassword}
              handleLogout={handleLogout}
              navigateTo={navigateTo}
            />
          )}

          {/* ── LOADING: Symptom Analysis (Sonar Pulse) ───────────────────── */}
          {screen === "loading" && (
            <div className="flex flex-col items-center justify-center flex-1 min-h-screen p-6 text-center bg-slate-50 dark:bg-slate-950">
              <div className="relative flex items-center justify-center w-28 h-28 mb-8">
                {/* Expanding Sonar Rings */}
                <motion.div
                  animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                  className="absolute inset-0 rounded-full bg-emerald-500 dark:bg-emerald-400"
                />
                <motion.div
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                  className="absolute inset-0 rounded-full bg-teal-500 dark:bg-teal-400"
                />
                
                {/* Solid Center Orb */}
                <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.5)]">
                  <Icons.MedLogo size={48} color="#ffffff" />
                </div>
              </div>
              
              <motion.h3 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
              >
                Analyzing Symptoms...
              </motion.h3>
              <p className="max-w-sm mt-3 font-medium text-slate-500 dark:text-slate-400">
                Cross-referencing your inputs with millions of medical data points.
              </p>
            </div>
          )}

          {/* ── LOADING: PDF Parsing (Laser Scan) ─────────────────────────── */}
          {screen === "parsing_loading" && (
            <div className="flex flex-col items-center justify-center flex-1 min-h-screen p-6 text-center bg-slate-50 dark:bg-slate-950">
              
              <div className="relative flex items-center justify-center w-32 h-40 mb-10 overflow-hidden bg-white border-2 shadow-2xl rounded-2xl dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-emerald-500/10 dark:shadow-emerald-500/20">
                <Icons.Clipboard size={56} className="text-slate-300 dark:text-slate-600" />
                
                {/* Holographic Laser Line */}
                <motion.div
                  animate={{ top: ["-10%", "110%", "-10%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 w-full h-[3px] bg-emerald-500 shadow-[0_0_20px_5px_rgba(16,185,129,0.6)] z-20"
                />
                
                {/* Glowing Scanner Field */}
                <motion.div
                   animate={{ top: ["-100%", "100%", "-100%"] }}
                   transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                   className="absolute left-0 w-full h-full bg-gradient-to-b from-transparent via-emerald-500/20 dark:via-emerald-500/30 to-transparent z-10"
                />
              </div>

              <motion.h3 
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white"
              >
                Reading Lab Report...
              </motion.h3>
              <p className="max-w-sm mt-3 font-medium text-slate-500 dark:text-slate-400">
                Our AI is running optical character extraction to map your biomarkers.
              </p>
            </div>
          )}
        </div>{/* end .main-panel */}

        {/* ── Bottom Nav (mobile) ───────────────────────────────────────── */}
        {showNav && screen !== "results" && screen !== "report_results" && (
          <BottomNav
            screen={screen}
            navigateTo={navigateTo}
            startNewAssessment={startNewAssessment}
            handleLogout={handleLogout}
          />
        )}

      </div>{/* end .app-layout */}
    </div>
  );
}
