import React, { useState, useEffect } from "react";
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
  updateEmail,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";

const API_BASE = import.meta.env.VITE_API_URL || "https://med-ai-1-is35.onrender.com";

// --- FIREBASE INIT ---
let firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

let app, auth, db;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error("Firebase Initialization Failed:", error);
}

const appId = 'med-ai-local';

// --- ICONS ---
const Icons = {
  MedLogo: ({ size = 28, className="teal-icon" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/><path d="M10 3h4v4h4v4h-4v4h-4v-4H6V7h4z"/></svg>,
  User: ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  History: ({ size = 24, className }) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>,
  Moon: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>,
  Sun: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>,
  Home: ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>,
  Clipboard: ({ size = 24, className }) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14h6"/><path d="M9 18h6"/><path d="M9 10h.01"/></svg>,
  Menu: ({ size = 24, className }) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
  Check: ({ size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Download: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Search: ({ size = 18, className }) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  ArrowRight: ({ size = 20, color="currentColor" }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ArrowLeft: ({ size = 24, className }) => <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>,
  Shield: ({ size = 40 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  LogOut: ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  EyeOff: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  
  // --- NEW: Add this Eye icon right below EyeOff ---
  Eye: ({ size = 20 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
};

export default function App() {
  const [screen, setScreen] = useState("login");
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState({});
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const [results, setResults] = useState([]);
  const [precautions, setPrecautions] = useState("");
  const [history, setHistory] = useState([]);
  const [viewingHistoryItem, setViewingHistoryItem] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
  const [showProfilePasswords, setShowProfilePasswords] = useState({ current: false, new: false, confirm: false });
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState("");
  const [reportFile, setReportFile] = useState(null);
  const [parsedReport, setParsedReport] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [labHistory, setLabHistory] = useState([]);
  const [historyTab, setHistoryTab] = useState("assessment"); 
  
  

  const [userProfile, setUserProfile] = useState({
    name: "", age: "", weight: "", height: "", gender: "",
    email: "", phone: "", city: "", state: "", country: "",
    photo: "", password: "" 
  });
  const [confirmPassword, setConfirmPassword] = useState("");

  const fallbackSymptoms = ["itching", "skin_rash", "shivering", "joint_pain", "stomach_pain", "fatigue", "cough", "high_fever"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        setIsLoggedIn(true);
        await fetchUserData(user.uid, user.email);
        if (screen === 'login') setScreen("home");
      } else {
        setCurrentUser(null);
        setIsLoggedIn(false);
        setScreen("login");
      }
    });

    fetch(`${API_BASE}/health`)
  .then(res => res.json())
  .then(data => console.log("Backend status:", data))
  .catch(() => console.warn("Backend not reachable"));

    fetch(`${API_BASE}/symptoms`)
      .then(res => res.json())
      .then(data => {
        const validData = data.symptoms || data;        
        setSymptoms(Array.isArray(validData) ? validData : fallbackSymptoms);
      })
      .catch(() => setSymptoms(fallbackSymptoms));

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchUserData = async (uid, email) => {
    if (!uid) return;
    try {
      const profileRef = doc(db, 'artifacts', appId, 'users', uid, 'profile', 'main');
      const profileSnap = await getDoc(profileRef);
      if (profileSnap.exists()) setUserProfile(prev => ({ ...prev, ...profileSnap.data() }));

      const historyRef = doc(db, 'artifacts', appId, 'users', uid, 'data', 'history');
      const historySnap = await getDoc(historyRef);
      if (historySnap.exists()) setHistory(historySnap.data().records || []);
      const labRef = doc(db, 'artifacts', appId, 'users', uid, 'data', 'labHistory');
const labSnap = await getDoc(labRef);
if (labSnap.exists()) {
  setLabHistory(labSnap.data().records || []);
}
    } catch (err) {
      setError("Connection interrupted.");
    }
  };

  const calculateBMI = () => {
    const w = parseFloat(userProfile.weight);
    const h = parseFloat(userProfile.height) / 100;
    if (w > 0 && h > 0) return (w / (h * h)).toFixed(1);
    return null;
  };

  const getBMIInfo = (bmi) => {
    if (!bmi) return { label: "N/A", color: "#94A3B8" };
    const val = parseFloat(bmi);
    if (val < 18.5) return { label: "Underweight", class: "bmi-yellow" };
    if (val >= 18.5 && val <= 24.9) return { label: "Healthy", class: "bmi-green" };
    return { label: "Overweight", class: "bmi-red" };
  };

  const bmiValue = calculateBMI();
  const bmiInfo = getBMIInfo(bmiValue);
  const calculateNeedleAngle = (bmi) => {
    if (!bmi) return -90; 
    const minBmi = 15; 
    const maxBmi = 40; 
    
    const clampedBmi = Math.max(minBmi, Math.min(maxBmi, parseFloat(bmi)));
   
    return ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 180 - 90;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // 1. FULL NAME: Actively remove any numbers (0-9)
    if (name === "name") {
      val = val.replace(/\d/g, ''); 
    }

    // 2. PHONE: Actively remove non-numbers and limit to exactly 10 digits
    if (name === "phone") {
      val = val.replace(/\D/g, '').slice(0, 10);
    }

    // 3. EMAIL: Automatically chop off anything typed after ".com"
    if (name === "email") {
      const comIndex = val.toLowerCase().indexOf('.com');
      if (comIndex !== -1) {
        val = val.slice(0, comIndex + 4); // Keeps only up to '.com'
      }
    }

    // 4. MEDICAL LIMITS: Only check the MAXIMUM limits so you can actually type!
    if (name === "age" && val !== "") {
      if (Number(val) > 120) return; // Stops at 120
    }
    if (name === "height" && val !== "") {
      if (Number(val) > 250) return; // Stops at 250
    }
    if (name === "weight" && val !== "") {
      if (Number(val) > 250) return; // Stops at 250
    }

    setUserProfile(prev => ({ ...prev, [name]: val }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    let val = value;

    // Apply the exact same email restriction for the login screen
    if (name === "email") {
      const comIndex = val.toLowerCase().indexOf('.com');
      if (comIndex !== -1) {
        val = val.slice(0, comIndex + 4);
      }
    }

    setLoginData(prev => ({ ...prev, [name]: val }));
  };
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) { setError("Photo is too large."); return; }
      const reader = new FileReader();
      reader.onloadend = () => setUserProfile(prev => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setError("Please verify your email.");
      }
    } catch (err) { setError(err.message); }
  };

  // --- NEW: SAVE PROFILE CHANGES TO DATABASE ---
  const handleUpdateProfile = async () => {
    try {
      if (currentUser) {
        const profileRef = doc(db, 'artifacts', appId, 'users', currentUser.uid, 'profile', 'main');
        await setDoc(profileRef, userProfile, { merge: true });
        setNotification("Profile updated successfully!");
        setIsEditingProfile(false);
      }
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  // --- NEW: CHANGE PASSWORD SECURELY ---
  const handleChangePassword = async () => {
    setError(null);
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      setError("Please fill in all password fields."); return;
    }
    if (passwordData.new !== passwordData.confirm) {
      setError("New passwords do not match!"); return;
    }
    if (passwordData.new.length < 6) {
      setError("New password must be at least 6 characters."); return;
    }

    try {
      // 1. Re-authenticate to prove they know the current password
      const credential = EmailAuthProvider.credential(currentUser.email, passwordData.current);
      await reauthenticateWithCredential(currentUser, credential);
      
      // 2. Update to the new password
      await updatePassword(currentUser, passwordData.new);
      
      setNotification("Password updated successfully!");
      setIsChangingPassword(false);
      setPasswordData({ current: "", new: "", confirm: "" }); // Clear the fields
    } catch (err) {
      setError(err.message === "Firebase: Error (auth/invalid-credential)." ? "Incorrect current password." : err.message);
    }
  };

  // --- NEW: FORGOT PASSWORD FROM PROFILE ---
  const handleProfileForgotPassword = async () => {
    setError(null);
    try {
      if (currentUser && currentUser.email) {
        // Automatically uses the logged-in user's email
        await sendPasswordResetEmail(auth, currentUser.email);
        setNotification("Reset link sent! Check your email.");
        setIsChangingPassword(false); // Closes the menu
        setPasswordData({ current: "", new: "", confirm: "" });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const navigateTo = (scr) => {
    setScreen(scr);
    setViewingHistoryItem(null);
    setIsSidebarOpen(false);
    setIsEditingProfile(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    const safeEmail = userProfile.email ? userProfile.email.trim() : "";
    
    if (!safeEmail || !userProfile.password || userProfile.password.length < 6) {
      setError("Valid email and 6+ char password required."); return;
    }
    if (userProfile.password !== confirmPassword) {
      setError("Passwords do not match!"); return;
    }

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, safeEmail, userProfile.password);
        await sendEmailVerification(userCredential.user);
        const { password, ...safeProfile } = userProfile;
        await setDoc(doc(db, 'artifacts', appId, 'users', userCredential.user.uid, 'profile', 'main'), { ...safeProfile, email: safeEmail });
        await signOut(auth);
        setIsNewUser(false);
        setNotification("Account created! Verify your email.");
        setUserProfile(prev => ({...prev, password: ""}));
    } catch (err) { setError(err.message); }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setHistory([]);
      setIsSidebarOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleForgotPassword = async () => {
    setError(null);
    if (!loginData.email) {
      setError("Please type your email in the box first to reset.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, loginData.email);
      setNotification("Reset link sent! Check your email.");
    } catch (err) { 
      setError(err.message); 
    }
  };

  const toggleSymptom = (s) => setSelectedSymptoms(prev => ({ ...prev, [s]: !prev[s] }));

  const startNewAssessment = () => {
    setSelectedSymptoms({}); // Wipes old symptoms
    setResults([]);          // Wipes old results
    setSearchQuery("");      // Clears search bar
    setScreen("symptoms");   // Changes screen
    setIsSidebarOpen(false); // Closes sidebar if open
  };

  // --- NEW: VOICE INPUT FUNCTION ---
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError("Your browser doesn't support voice recognition. Try Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US'; 

    recognition.onstart = () => {
      setIsListening(true);
      setSearchQuery("Listening..."); // Gives instant feedback to the user
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      setSearchQuery(transcript); 

      // --- THE NEW MAGIC: AUTO-TICK THE CHECKBOXES ---
      const spokenWords = transcript.toLowerCase();
      
      setSelectedSymptoms(prev => {
        const updatedSelections = { ...prev };
        
        symptoms.forEach(symptom => {
          // Converts backend format 'high_fever' to normal English 'high fever'
          const cleanSymptom = symptom.replace(/_/g, " ").toLowerCase();
          
          // If the spoken sentence contains the symptom word, check the box!
          if (spokenWords.includes(cleanSymptom)) {
            updatedSelections[symptom] = true;
          }
        });
        
        return updatedSelections;
      });
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      setSearchQuery(""); 
      setError("Could not hear you properly. Please try again.");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // --- NEW: UPLOAD MEDICAL REPORT ---
  const handleReportUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    setReportFile(file);
    setIsParsing(true);
    setScreen("parsing_loading"); 

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/parse-report`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to analyze report");
      
      const data = await res.json();
      setParsedReport(data);

      // --- NEW: SAVE TO LAB HISTORY ---
      const newLabEntry = {
        type: 'lab_report',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        reportData: data
      };
      
      const updatedLabHistory = [newLabEntry, ...labHistory].slice(0, 10); // Keep last 10
      setLabHistory(updatedLabHistory);
      
      if (currentUser) {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'data', 'labHistory'), { records: updatedLabHistory }, { merge: true });
      }
      // --------------------------------

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

  async function analyzeSymptoms() {
    setError(null);
    const selected = Object.keys(selectedSymptoms).filter(s => selectedSymptoms[s]);
    
    // Safety check: Don't run if no symptoms are selected
    if (selected.length === 0) {
      setError("Please select at least one symptom.");
      return; 
    }
    
    setScreen("loading");
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); 

    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  symptoms: selected.length ? selected : [],
  user_email: currentUser?.email || null
}),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`Server returned status: ${res.status}`);
      
      const data = await res.json();
      console.log("🟢 BACKEND DATA RECEIVED:", data); // For debugging in your browser console

      // --- BULLETPROOF DATA SANITIZATION ---
      // 1. Force predictions to be a safe Array of Strings
      let safePredictions = [];
      if (Array.isArray(data.predictions)) {
        safePredictions = data.predictions.map(String); 
      } else if (typeof data.predictions === 'string') {
        safePredictions = [data.predictions];
      } else {
        safePredictions = ["Analysis complete (No specific disease identified)"];
      }

      // 2. Force precautions to be safe to render (prevents Object crashes)
      const safePrecautions =
  typeof data.precaution === "string"
    ? data.precaution
    : "Consult a healthcare professional.";
      // ------------------------------------

      const newEntry = {
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        topMatch: safePredictions[0] || "Unknown",
        symptoms: selected,
        allPredictions: safePredictions, 
        precautions: safePrecautions 
      };
      
      const updatedHistory = [newEntry, ...history].slice(0, 10);
      setHistory(updatedHistory);
      
      if (currentUser) {
        await setDoc(doc(db, 'artifacts', appId, 'users', currentUser.uid, 'data', 'history'), { records: updatedHistory }, { merge: true });
      }

      setResults(safePredictions);
      setPrecautions(safePrecautions);
      setScreen("results");

    } catch (err) {
      console.error("🔴 API ERROR:", err);
      // If it fails, it safely kicks you back to the symptoms page without a white screen
      setError(err.name === 'AbortError' ? "Request timed out. Backend is waking up." : "Connection failed. Check console.");
      setScreen("symptoms");
    }
  }

  

  const exportReport = async () => {
    // Find the currently active report container
    const captureElement = document.querySelector(".printable-report-capture");

    if (!captureElement) {
      setError("Could not find the report to download.");
      return;
    }

    try {
      setNotification("Generating high-res report...");
      
      // NEW: Wait a split second to ensure all CSS fade-in animations are 100% finished
      // (Capturing mid-animation causes ghosting/blurriness)
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await html2canvas(captureElement, {
        scale: 4, // INCREASED: 4x resolution for crystal clear, retina-quality text
        backgroundColor: "#F4F7F9", 
        useCORS: true,
        allowTaint: true
        // REMOVED: windowWidth: 480 (This was squishing the canvas and causing blur)
      });

      // Convert to image and download in maximum quality
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      // Added a timestamp so multiple downloads don't overwrite each other
      link.download = `MedAI_Report_${userProfile.name ? userProfile.name.replace(/\s+/g, '_') : 'User'}_${new Date().getTime()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error(err);
      setError("Failed to generate high-res image.");
    }
  };

  const filteredSymptoms = symptoms.filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
  const handleViewActivity = (item) => {
    try {
      if (item.type === 'lab_report') {
        setParsedReport(item.reportData || { summary: "No data found.", abnormal_results: [] });
        setScreen("report_results");
      } else {
        // Fallbacks so old history entries don't crash the results page
        const safeResults = Array.isArray(item.allPredictions) ? item.allPredictions : (item.topMatch ? [item.topMatch] : ["Analysis Complete"]);
        setResults(safeResults);
        
        setPrecautions(item.precautions || "Please consult a healthcare professional.");
        
        // Re-populate symptoms safely
        const restoredSymptoms = {};
        if (Array.isArray(item.symptoms)) {
          item.symptoms.forEach(s => restoredSymptoms[s] = true);
        }
        setSelectedSymptoms(restoredSymptoms);
        
        setScreen("results");
      }
    } catch (err) {
      console.error("Error opening history item:", err);
      setError("Could not open this record.");
    }
  };

  // --- NEW: COMBINE ALL HISTORY FOR DASHBOARD ---
  const allActivity = [...history, ...labHistory].sort((a, b) => {
    // Convert '07 Mar 2026 12:19 pm' into real Date objects to compare them
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateB - dateA; // Sorts newest to oldest
  });
  const recentActivity = allActivity.length > 0 ? allActivity[0] : null;

  return (
    <div className={`med-ai-root ${theme}`}>
      <style>{css}</style>

      {notification && <div className="notification-toast">{notification}</div>}
      {error && <div className="error-toast">{error}</div>}

      <main className={`main-stage ${screen === 'login' ? 'is-auth' : ''}`}>
        
        {/* --- DESKTOP / MOBILE SIDEBAR --- */}
        {screen !== "login" && (
          <>
            <div className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
            <div className={`sidebar-menu ${isSidebarOpen ? 'open' : ''}`}>
              <div className="sidebar-header-logo">
                <Icons.MedLogo size={36} className="text-white" />
                <h2 className="text-white" style={{margin: 0, fontWeight: 800, fontSize: '1.8rem'}}>Med-AI</h2>
              </div>
              
              <div className="sidebar-links">
                <div className={`sidebar-link ${screen === 'home' ? 'active' : ''}`} onClick={() => {setScreen('home'); setIsSidebarOpen(false);}}>
                  <Icons.Home size={20} /> Dashboard
                </div>
                <div className={`sidebar-link ${screen === 'symptoms' ? 'active' : ''}`} onClick={() => { setSelectedSymptoms({}); setResults([]); setSearchQuery(""); navigateTo('symptoms'); }}>
                  <Icons.Clipboard size={20} /> Assessment
                </div>
                <div className={`sidebar-link ${screen === 'history' || viewingHistoryItem ? 'active' : ''}`} onClick={() => {setScreen('history'); setIsSidebarOpen(false);}}>
                  <Icons.History size={20} /> History
                </div>
                <div className={`sidebar-link ${screen === 'profile' ? 'active' : ''}`} onClick={() => {setScreen('profile'); setIsSidebarOpen(false);}}>
                  <Icons.User size={20} /> Profile
                </div>
              </div>

              <div className="sidebar-logout" onClick={() => { handleLogout(); setIsSidebarOpen(false); }}>
                <Icons.LogOut size={20} /> Logout
              </div>
            </div>
          </>
        )}

        {/* --- LOGIN / REGISTER SCREEN --- */}
        {screen === "login" && (
          <div className="auth-screen anim-fade-in">
            <div className="auth-header-logo">
              <Icons.MedLogo size={48} />
              <h1 className="brand-title-teal">Med-AI</h1>
            </div>
            
            <h2 className="welcome-text">{isNewUser ? "Create Profile" : "Welcome Back!"}</h2>
            <p className="subtitle-text">{isNewUser ? "Fill details to start" : "Login to your Account"}</p>

            <form className="auth-form" onSubmit={isNewUser ? handleRegister : handleLogin}>
              
              {isNewUser && (
                <div className="photo-upload-wrapper">
                  <label className="photo-label">
                    <div className="photo-preview-circle">
                      {userProfile.photo ? (
                         <img src={userProfile.photo} alt="Preview" className="photo-preview" />
                      ) : (
                         <Icons.User size={40} />
                      )}
                    </div>
                    <div className="upload-badge">Upload Photo</div>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden-input" />
                  </label>
                </div>
              )}

              {isNewUser && (
                <>
                  <label className="input-label">Full Name</label>
                  <input required name="name" value={userProfile.name} onChange={handleProfileChange} placeholder="Nitya Sharma" className="light-input mb-3" />
                  
                  <div className="form-group-3">
                    <div>
                      <label className="input-label">Age</label>
                      <input required type="number" name="age" value={userProfile.age} onChange={handleProfileChange} placeholder="23" className="light-input" />
                    </div>
                    <div>
                      <label className="input-label">Height</label>
                      <input required type="number" name="height" value={userProfile.height} onChange={handleProfileChange} placeholder="170" className="light-input" />
                    </div>
                    <div>
                      <label className="input-label">Weight</label>
                      <input required type="number" name="weight" value={userProfile.weight} onChange={handleProfileChange} placeholder="60" className="light-input" />
                    </div>
                  </div>

                  <div className="form-group-2 mt-3">
                    <div>
                      <label className="input-label">State</label>
                      <input required name="state" value={userProfile.state} onChange={handleProfileChange} placeholder="Maharastra" className="light-input" />
                    </div>
                    <div>
                      <label className="input-label">City</label>
                      <input required name="city" value={userProfile.city} onChange={handleProfileChange} placeholder="Mumbai" className="light-input" />
                    </div>
                  </div>

                  <label className="input-label mt-3">Mobile No.</label>
                  <div className="phone-input-wrapper mb-3">
                    <span className="phone-prefix">+91</span>
                    <input 
                      required 
                      type="tel" 
                      name="phone" 
                      maxLength="10" 
                      value={userProfile.phone} 
                      onChange={handleProfileChange} 
                      placeholder="9876543210" 
                      className="light-input phone-input" 
                    />
                  </div>
                </>
              )}

              <label className="input-label">Email</label>
              <input required type="email" name="email" value={isNewUser ? userProfile.email : loginData.email} onChange={isNewUser ? handleProfileChange : handleLoginChange} placeholder="user@gmail.com" className="light-input mb-3" />

              <label className="input-label">Password</label>
              <div className="password-row mb-1">
                <input required type="password" name="password" value={isNewUser ? userProfile.password : loginData.password} onChange={isNewUser ? handleProfileChange : handleLoginChange} placeholder="••••••••••••" className="light-input" />
                <span className="eye-icon"><Icons.EyeOff /></span>
              </div>
              
              {isNewUser && (
                <div className="password-row mb-3 mt-3">
                  <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className="light-input" />
                  <span className="eye-icon"><Icons.EyeOff /></span>
                </div>
              )}

              {!isNewUser && (
                <div className="forgot-password" onClick={handleForgotPassword} style={{ cursor: 'pointer' }}>
                  <span>Forgot Password?</span>
                </div>
              )}

              <button type="submit" className="btn-teal-primary mt-4">
                {isNewUser ? "Create Account" : "Login"}
              </button>

              <div className="auth-footer mt-4">
                <span className="text-muted">{isNewUser ? "Already have an account?" : "Don't have an account?"}</span>
                <button type="button" className="text-link-teal ml-2" onClick={() => setIsNewUser(!isNewUser)}>
                  {isNewUser ? "Login" : "Create Profile"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- HOME DASHBOARD --- */}{/* --- HOME DASHBOARD --- */}
        {screen === "home" && (
          <div className="dashboard-screen anim-fade-in content-container">
            
            {/* --- FIXED: DASHBOARD HEADER --- */}
            <div className="dash-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              
              {/* Left Side: Menu + Title */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div className="mobile-only" style={{position: 'relative', zIndex: 10, cursor: 'pointer', padding: '5px'}} onClick={() => setIsSidebarOpen(true)}>
                  <Icons.Menu size={28} className="text-dark" />
                </div>
                <h2 className="header-title" style={{ margin: 0 }}>Dashboard</h2>
              </div>
              
              {/* Right Side: Theme Toggle + Profile Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button 
                  onClick={toggleTheme} 
                  style={{ 
                    background: 'var(--white)', border: '1px solid var(--border-light)', 
                    borderRadius: '50%', width: '40px', height: '40px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    cursor: 'pointer', color: 'var(--text-dark)', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' 
                  }}
                >
                  {theme === 'light' ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
                </button>

                <div className="profile-mini-avatar" onClick={() => setScreen("profile")} style={{cursor: 'pointer', position: 'relative', zIndex: 10}}>
                  {userProfile.photo ? <img src={userProfile.photo} alt="User" /> : <Icons.User size={20}/>}
                </div>
              </div>
              
            </div>

            <div className="greeting-section">
              <h1>Hello, {userProfile.name ? userProfile.name.split(' ')[0].toUpperCase() : 'USER'}! </h1>
            </div>

            <div className="desktop-row">
                {bmiValue && (
                  <div className="white-card bmi-gauge-card mb-4 desktop-col">
                    <div className="bmi-info">
                      <span className="bmi-subtitle">Your BMI</span>
                      <div className="bmi-value-row">
                        <h2>{bmiValue}</h2>
                        <span className="bmi-plus">+</span>
                      </div>
                      <div className={`bmi-status-pill ${bmiInfo.class}`}>
                        <span className="dot"></span> {bmiInfo.label}
                      </div>
                    </div>
                    <div className="bmi-gauge">
                  <div className="gauge-arc"></div>
                  {/* Dynamic needle with a smooth swinging animation */}
                  <div 
                    className="gauge-needle" 
                    style={{ 
                      transform: `rotate(${calculateNeedleAngle(bmiValue)}deg)`,
                      transition: 'transform 1.2s cubic-bezier(0.22, 1, 0.36, 1)' 
                    }}
                  ></div>
                </div>
                  </div>
                )}

                <div className="action-cards-grid mb-4 desktop-col flex-grow">
                  <div className="teal-action-card full-span" onClick={() => { setSelectedSymptoms({}); setResults([]); setSearchQuery(""); setScreen("symptoms"); }}>
                    <div className="card-content">
                      <div className="icon-bubble"><Icons.Clipboard size={20} className="teal-icon" /></div>
                      <div>
                        <h3>Start Assessment</h3>
                        <p>Check Symptoms &rarr;</p>
                      </div>
                    </div>
                    <Icons.ArrowRight size={24} color="white" />
                  </div>

                  <div className="white-card mini-action" onClick={() => setScreen("history")}>
                    <div className="icon-bubble teal-bg"><Icons.History size={20} className="teal-icon" /></div>
                    <h4>View History</h4>
                  </div>

                  {/* Smart PDF Upload Button */}
                  <label className="white-card mini-action" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                      <div className="icon-bubble orange-bg"><Icons.Clipboard size={20} className="text-dark" /></div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.95rem' }}>Upload Lab Report</h4>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart PDF Analysis</p>
                      </div>
                    </div>
                    <input type="file" accept="application/pdf" onChange={handleReportUpload} style={{ display: 'none' }} />
                  </label>
                </div>
            </div>

            <div className="recent-activity-section">
              <div className="section-title-row">
                <h3>Recent Activity</h3>
              </div>
              
              {/* --- IMPROVED: SHOWING LAST 4 ACTIVITIES --- */}
<div className="activity-stack">
  {allActivity.length > 0 ? (
    allActivity.slice(0, 4).map((activity, idx) => (
      <div 
        key={idx} 
        className="white-card recent-timeline-card mb-3 anim-slide-in" 
        style={{ animationDelay: `${idx * 0.12}s`, cursor: 'pointer', position: 'relative', zIndex: 40 }}
        onClick={() => handleViewActivity(activity)}
      >
        <div className="timeline-dot" style={{
          borderColor: activity.type === 'lab_report' ? '#ffedd5' : '#e0f2f1', 
          background: activity.type === 'lab_report' ? 'var(--accent-orange)' : 'var(--primary-teal)'
        }}></div>
        
        <div className="timeline-content">
          <p className="time-text">{activity.date}, {activity.time}</p>
          <h4 className="activity-title" style={{ margin: '0 0 2px 0', fontSize: '1rem', fontWeight: 700 }}>
            {activity.type === 'lab_report' ? "Lab Report Analysis" : (activity.topMatch || "Assessment")}
          </h4>
          <p className="symptoms-preview" style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {activity.type === 'lab_report' 
              ? (activity.reportData?.summary || "Analysis complete") 
              : (activity.symptoms?.slice(0, 2).map(s => s.replace(/_/g, " ")).join(", ") + (activity.symptoms?.length > 2 ? "..." : ""))}
          </p>
        </div>
        
        <button 
          className="btn-view-light" 
          style={{ position: 'relative', zIndex: 50 }} 
          onClick={(e) => { e.stopPropagation(); handleViewActivity(activity); }}
        >
          View
        </button>
      </div>
    ))
  ) : (
    <div className="white-card text-center" style={{ padding: '40px', border: '2px dashed var(--border-light)', borderRadius: '24px' }}>
      <p className="text-muted m-0">No recent activity yet.</p>
    </div>
  )}
</div>
            </div>
          </div>
        )}

        {/* --- SYMPTOMS CHECKLIST --- */}
        {screen === "symptoms" && (
          <div className="symptoms-screen anim-fade-in content-container">
            <div className="dash-header no-border">
              <div className="header-left-group">
                <div className="action-icon-btn" onClick={() => setScreen("home")}>
                   <Icons.ArrowLeft size={28} className="text-dark" />
                </div>
                <h2 className="header-title">Symptoms Checklist</h2>
              </div>
            </div>
            <div className="search-box mb-3" style={{ display: 'flex', alignItems: 'center' }}>
              <Icons.Search size={20} className="text-muted" />
              <input 
                placeholder="Search or say symptoms..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
              />
              
              {/* --- NEW: MIC BUTTON --- */}
              <button 
                onClick={handleVoiceInput} 
                className={isListening ? 'listening-pulse' : ''}
                style={{
                  borderRadius: '50%', width: '40px', height: '40px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: isListening ? 'var(--danger-red)' : '#e0f2f1',
                  color: isListening ? 'white' : 'var(--primary-teal)',
                  border: 'none', cursor: 'pointer',
                  transition: 'all 0.3s ease', marginLeft: '8px'
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="23"></line>
                  <line x1="8" y1="23" x2="16" y2="23"></line>
                </svg>
              </button>
            </div>

           
            <div className="symptoms-list desktop-grid">
              {filteredSymptoms.map((s, idx) => (
                <div key={s} className="symptom-row-clean" onClick={() => toggleSymptom(s)}>
                  <span className="symptom-name">{s.replace(/_/g, " ")}</span>
                  <div className={`checkbox-square ${selectedSymptoms[s] ? 'checked' : ''}`}>
                    {selectedSymptoms[s] && <Icons.Check size={16} />}
                  </div>
                </div>
              ))}
              <div className="mobile-only" style={{ height: "120px" }}></div> 
            </div>

            <div className="sticky-action-bar">
              <button className="btn-cancel" onClick={() => setSelectedSymptoms({})}>Cancel</button>
              <div className="selection-count">
                <span className="count-num">{Object.values(selectedSymptoms).filter(Boolean).length}/{symptoms.length}</span>
                <span className="count-text">Selected</span>
              </div>
              <button className="btn-analyze" onClick={analyzeSymptoms}>Analyze &rarr;</button>
            </div>
          </div>
        )}

        {/* --- FULL-PAGE HISTORY MAP --- */}
        {screen === "history" && (
          <div className="history-screen anim-fade-in content-container" style={{padding: '24px 20px 100px'}}>
            <div className="dash-header no-border mb-4">
              <div style={{position: 'relative', zIndex: 10, cursor: 'pointer', padding: '5px'}} onClick={() => setScreen("home")}>
                 <Icons.ArrowLeft size={28} className="text-dark" />
              </div>
              <h2 className="header-title">Assessment History</h2>
              <div style={{width: 28}}></div>
            </div>
            
            <div className="search-box mb-4">
              <Icons.Search size={20} className="text-muted" />
              <input placeholder="Search Reports..." />
            </div>

            {/* --- TAB SWITCHER --- */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <button onClick={() => setHistoryTab('assessment')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: historyTab === 'assessment' ? 'var(--primary-teal)' : 'white', color: historyTab === 'assessment' ? 'white' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: '0.2s' }}>
                Assessments
              </button>
              <button onClick={() => setHistoryTab('lab')} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: historyTab === 'lab' ? 'var(--primary-teal)' : 'white', color: historyTab === 'lab' ? 'white' : 'var(--text-muted)', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', transition: '0.2s' }}>
                Lab Reports
              </button>
            </div>
            
            <div className="history-list-full desktop-grid-history">
              {/* TAB 1: ASSESSMENTS */}
              {historyTab === 'assessment' && (
                history.length > 0 ? history.map((item, idx) => (
                  <div key={idx} className="white-card mb-3 history-grid-item" onClick={() => handleViewActivity(item)} style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', position: 'relative', zIndex: 40}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                       <div>
                          <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600}}>{item.date}, {item.time}</p>
                          <h4 style={{margin: '4px 0 0 0', color: 'var(--text-dark)'}}>{item.topMatch || "Assessment Record"}</h4>
                       </div>
                       {/* FIXED: Now correctly routes to Results */}
                       <button className="btn-view-light" style={{ position: 'relative', zIndex: 50, padding: '8px 20px' }} onClick={(e) => { e.stopPropagation(); handleViewActivity(item); }}>View</button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px'}}>
                       {item.symptoms && item.symptoms.slice(0, 3).map((s, i) => (
                          <span key={i} style={{fontSize: '0.75rem', background: '#f0fdfa', color: 'var(--primary-teal)', padding: '4px 8px', borderRadius: '4px', fontWeight: 600}}>
                             {s.replace(/_/g, " ")}
                          </span>
                       ))}
                    </div>
                 </div>
                )) : <p className="text-center text-muted mt-4">No assessment history found.</p>
              )}

              {/* TAB 2: LAB REPORTS */}
              {historyTab === 'lab' && (
                labHistory.length > 0 ? labHistory.map((item, idx) => (
                  <div key={idx} className="white-card mb-3 history-grid-item" onClick={() => handleViewActivity(item)} style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', borderLeft: '4px solid var(--accent-orange)', position: 'relative', zIndex: 40}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                       <div>
                          <p style={{margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600}}>{item.date}, {item.time}</p>
                          <h4 style={{margin: '4px 0 0 0', color: 'var(--text-dark)'}}>Lab Report Analysis</h4>
                       </div>
                       {/* FIXED: Now correctly routes to Lab Report Results */}
                       <button className="btn-view-light" style={{ position: 'relative', zIndex: 50, padding: '8px 20px' }} onClick={(e) => { e.stopPropagation(); handleViewActivity(item); }}>View</button>
                    </div>
                    <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{item.reportData?.summary || "Analysis complete."}</p>
                 </div>
                )) : <p className="text-center text-muted mt-4">No lab report history found.</p>
              )}
            </div>
          </div>
        )}
      {/* --- PROFESSIONAL SAAS PROFILE PAGE --- */}
        {screen === "profile" && (
          <div className="profile-screen anim-fade-in content-container pb-120">
            <div className="dash-header mb-4">
              <div className="back-btn-glass" onClick={() => navigateTo("home")}>
                 <Icons.ArrowLeft size={24} className="text-dark" />
              </div>
              <h2 className="header-title">Account Settings</h2>
              <div style={{width: 44}}></div> {/* Spacer for centering */}
            </div>

            <div className="profile-dashboard-layout">
              
              {/* LEFT COLUMN: User Identity & Actions */}
              <div className="profile-identity-col">
                <div className="white-card text-center profile-identity-card">
                  <label className="photo-label profile-avatar-wrapper">
                    <div className="photo-preview-circle mx-auto">
                       {userProfile.photo ? <img src={userProfile.photo} alt="User" className="photo-preview"/> : <Icons.User size={50} />}
                    </div>
                    {isEditingProfile && (
                       <div className="upload-badge-hover">Change Photo</div>
                    )}
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden-input" disabled={!isEditingProfile} />
                  </label>
                  
                  {isEditingProfile ? (
                     <input name="name" value={userProfile.name} onChange={handleProfileChange} className="light-input text-center mt-3 mb-1 font-weight-bold" placeholder="Full Name" />
                  ) : (
                     <h3 className="profile-user-name">{userProfile.name || 'User'}</h3>
                  )}
                  <p className="profile-user-email">{userProfile.email}</p>

                  <div className="profile-action-divider"></div>

                  {/* Integrated Action Buttons */}
                  <div className="profile-action-stack">
                    {isEditingProfile ? (
                      <button className="btn-teal-primary" style={{padding: '14px', width: '100%'}} onClick={handleUpdateProfile}>
                        Save Changes
                      </button>
                    ) : (
                      <button className="btn-outline-teal" style={{padding: '14px', width: '100%'}} onClick={() => setIsEditingProfile(true)}>
                        Edit Profile
                      </button>
                    )}
                    
                    <button className="btn-view-pill logout-btn" onClick={handleLogout}>
                      <Icons.LogOut size={18} /> Sign Out
                    </button>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Data & Security Forms */}
              <div className="profile-data-col">
                
                {/* Personal Details */}
                <div className="white-card mb-4 profile-data-card">
                  <div className="card-header-row mb-4">
                    <h4 className="card-title-modern">Personal Information</h4>
                    {isEditingProfile && <span className="editing-badge">Editing Mode</span>}
                  </div>
                  
                  <div className="modern-details-grid">
                    <div className="detail-group">
                      <label className="detail-label-modern">Age</label>
                      {isEditingProfile ? (
                        <input type="number" name="age" min="0" max="120" value={userProfile.age} onChange={handleProfileChange} className="light-input" />
                      ) : (
                        <div className="detail-value-modern">{userProfile.age ? `${userProfile.age} yrs` : '--'}</div>
                      )}
                    </div>

                    {/* --- SWAPPED STATE AND CITY --- */}
                    <div className="detail-group">
                      <label className="detail-label-modern">State</label>
                      {isEditingProfile ? (
                        <input type="text" name="state" value={userProfile.state} onChange={handleProfileChange} className="light-input" />
                      ) : (
                        <div className="detail-value-modern" style={{textTransform: 'capitalize'}}>{userProfile.state || '--'}</div>
                      )}
                    </div>

                    <div className="detail-group">
                      <label className="detail-label-modern">City</label>
                      {isEditingProfile ? (
                        <input type="text" name="city" value={userProfile.city} onChange={handleProfileChange} className="light-input" />
                      ) : (
                        <div className="detail-value-modern" style={{textTransform: 'capitalize'}}>{userProfile.city || '--'}</div>
                      )}
                    </div>

                    <div className="detail-group">
                      <label className="detail-label-modern">Gender</label>
                      {isEditingProfile ? (
                        <input type="text" name="gender" value={userProfile.gender || ''} onChange={handleProfileChange} className="light-input" placeholder="Male/Female" />
                      ) : (
                        <div className="detail-value-modern" style={{textTransform: 'capitalize'}}>{userProfile.gender || '--'}</div>
                      )}
                    </div>

                    <div className="detail-group">
                      <label className="detail-label-modern">Height</label>
                      {isEditingProfile ? (
                        <input type="number" name="height" min="30" max="250" value={userProfile.height} onChange={handleProfileChange} className="light-input" placeholder="cm" />
                      ) : (
                        <div className="detail-value-modern">{userProfile.height ? `${userProfile.height} cm` : '--'}</div>
                      )}
                    </div>

                    <div className="detail-group">
                      <label className="detail-label-modern">Weight</label>
                      {isEditingProfile ? (
                        <input type="number" name="weight" min="2" max="200" value={userProfile.weight} onChange={handleProfileChange} className="light-input" placeholder="kg" />
                      ) : (
                        <div className="detail-value-modern">{userProfile.weight ? `${userProfile.weight} kg` : '--'}</div>
                      )}
                    </div>

                    <div className="detail-group">
                      <label className="detail-label-modern">City</label>
                      {isEditingProfile ? (
                        <input type="text" name="city" value={userProfile.city} onChange={handleProfileChange} className="light-input" />
                      ) : (
                        <div className="detail-value-modern" style={{textTransform: 'capitalize'}}>{userProfile.city || '--'}</div>
                      )}
                    </div>

                    <div className="detail-group">
                      <label className="detail-label-modern">State</label>
                      {isEditingProfile ? (
                        <input type="text" name="state" value={userProfile.state} onChange={handleProfileChange} className="light-input" />
                      ) : (
                        <div className="detail-value-modern" style={{textTransform: 'capitalize'}}>{userProfile.state || '--'}</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Security Data */}
                <div className="white-card mb-4 profile-data-card">
                  <div className="card-header-row mb-4">
                    <h4 className="card-title-modern">Security & Login</h4>
                    {!isChangingPassword && (
                      <button className="btn-premium-teal" onClick={() => setIsChangingPassword(true)}>
                        Change Password
                      </button>
                    )}
                  </div>

                  {isChangingPassword ? (
                    <div className="anim-fade-in password-change-section">
                      
                      <div className="mb-4">
                        <div className="flex-between mb-2">
                          <label className="detail-label-modern m-0">Current Password</label>
                          <button className="text-link-teal text-small" onClick={handleProfileForgotPassword}>
                            Forgot Password?
                          </button>
                        </div>
                        <div className="password-row">
                          <input 
                            type={showProfilePasswords.current ? "text" : "password"} 
                            value={passwordData.current} 
                            onChange={(e) => setPasswordData({...passwordData, current: e.target.value})} 
                            className="light-input" 
                            placeholder="••••••••" 
                          />
                          <span className="eye-icon" onClick={() => setShowProfilePasswords(prev => ({...prev, current: !prev.current}))}>
                            {showProfilePasswords.current ? <Icons.Eye /> : <Icons.EyeOff />}
                          </span>
                        </div>
                      </div>
                      
                      <div className="modern-details-grid mb-4">
                        <div className="detail-group">
                          <label className="detail-label-modern">New Password</label>
                          <div className="password-row">
                            <input 
                              type={showProfilePasswords.new ? "text" : "password"} 
                              value={passwordData.new} 
                              onChange={(e) => setPasswordData({...passwordData, new: e.target.value})} 
                              className="light-input" 
                              placeholder="••••••••" 
                            />
                            <span className="eye-icon" onClick={() => setShowProfilePasswords(prev => ({...prev, new: !prev.new}))}>
                              {showProfilePasswords.new ? <Icons.Eye /> : <Icons.EyeOff />}
                            </span>
                          </div>
                        </div>
                        
                        <div className="detail-group">
                          <label className="detail-label-modern">Confirm New</label>
                          <div className="password-row">
                            <input 
                              type={showProfilePasswords.confirm ? "text" : "password"} 
                              value={passwordData.confirm} 
                              onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})} 
                              className="light-input" 
                              placeholder="••••••••" 
                            />
                            <span className="eye-icon" onClick={() => setShowProfilePasswords(prev => ({...prev, confirm: !prev.confirm}))}>
                              {showProfilePasswords.confirm ? <Icons.Eye /> : <Icons.EyeOff />}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-start gap-3 mt-2">
                        <button className="btn-teal-primary" onClick={handleChangePassword} style={{width: 'auto', padding: '14px 32px'}}>
                          Update Password
                        </button>
                        <button 
                          className="btn-outline-teal" 
                          onClick={() => { 
                            setIsChangingPassword(false); 
                            setPasswordData({current: "", new: "", confirm: ""}); 
                            setShowProfilePasswords({current: false, new: false, confirm: false});
                          }} 
                          style={{width: 'auto', padding: '14px 32px'}}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="security-status-row">
                      <div className="security-icon-wrapper">
                        <Icons.Shield size={24} />
                      </div>
                      <div>
                        <p className="security-status-title">Your account is secure</p>
                        <p className="security-status-desc">Password login is active. No further action needed.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* --- LOADING SCREEN --- */}
        {screen === "loading" && (
          <div className="loading-state anim-fade-in content-container">
            <div className="pulse-loader"><Icons.MedLogo size={60} /></div>
            <h3 className="mt-3">Analyzing Symptoms...</h3>
          </div>
        )}

        {/* --- PDF PARSING LOADING SCREEN --- */}
        {screen === "parsing_loading" && (
          <div className="loading-state anim-fade-in content-container">
            <div className="pdf-scanner-animation" style={{
                position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', background: 'white', borderRadius: '20px', 
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)', overflow: 'hidden', border: '2px solid #e0f2f1'
            }}>
              <Icons.Clipboard size={48} className="teal-icon" />
              <div style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
                  background: 'var(--primary-teal)', boxShadow: '0 0 15px 2px var(--primary-teal)',
                  animation: 'scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite'
              }}></div>
            </div>
            <style>{`@keyframes scan { 0%, 100% { top: -10px; opacity: 0; } 10% { opacity: 1; } 50% { top: 100%; opacity: 1; } 90% { opacity: 0; } }`}</style>
            <h3 className="mt-4" style={{ color: 'var(--text-dark)' }}>Reading Lab Report...</h3>
            <p className="text-muted text-center" style={{ maxWidth: '80%' }}>
              Our AI is extracting and simplifying your medical data. This usually takes a few seconds.
            </p>
          </div>
        )}

        {/* --- LAB REPORT RESULTS SCREEN --- */}
        {screen === "report_results" && parsedReport && (
          <div className="results-screen anim-fade-in content-container printable-report-capture" style={{ paddingBottom: '120px', backgroundColor: '#F4F7F9' }}>
            
            <div className="dash-header mb-4" data-html2canvas-ignore="true">
              <div style={{cursor: 'pointer', padding: '5px'}} onClick={() => setScreen("home")}>
                <Icons.ArrowLeft size={28} color="#1F2937" />
              </div>
              <h2 className="header-title" style={{ color: '#1F2937' }}>Report Analysis</h2>
              <div style={{width: 28}}></div>
            </div>

            <div className="white-card mb-4" style={{ borderLeft: '4px solid #004D40', backgroundColor: '#FFFFFF' }}>
              <h4 style={{ margin: '0 0 8px 0', color: '#1F2937', fontWeight: 800 }}>AI Summary</h4>
              <p style={{ margin: 0, color: '#4B5563', lineHeight: 1.6, fontWeight: 600 }}>{parsedReport.summary}</p>
            </div>

            <div className="section-title-row">
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1F2937', fontWeight: 800 }}>Key Findings</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              {parsedReport.abnormal_results && parsedReport.abnormal_results.length > 0 ? (
                parsedReport.abnormal_results.map((item, idx) => (
                  <div key={idx} className="white-card" style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#FFFFFF',
                    borderLeft: item.status === 'high' ? '4px solid #EF4444' : (item.status === 'low' ? '4px solid #F97316' : '4px solid #10B981') 
                  }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: '#1F2937', fontWeight: 800 }}>{item.test_name}</h4>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 600 }}>{item.simple_meaning}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '1.3rem', fontWeight: 900, 
                        color: item.status === 'high' ? '#EF4444' : (item.status === 'low' ? '#F97316' : '#10B981') 
                      }}>
                        {item.value}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#9CA3AF', fontWeight: 700 }}>Normal: {item.normal_range}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="white-card text-center" style={{ color: '#6B7280', backgroundColor: '#FFFFFF', fontWeight: 600 }}>All tested levels appear to be within normal ranges.</div>
              )}
            </div>

            <div className="white-card mt-4" style={{ background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>💡</span>
                <h4 style={{ margin: 0, color: '#004D40', fontWeight: 800 }}>Next Steps</h4>
              </div>
              <p style={{ margin: 0, color: '#1F2937', lineHeight: 1.6, fontWeight: 600 }}>{parsedReport.recommendation}</p>
            </div>
            
            {/* Action Buttons */}
            <div data-html2canvas-ignore="true" style={{ display: 'flex', gap: '16px', marginTop: '24px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button className="btn-outline-teal" onClick={exportReport} style={{ flex: 1, minWidth: '150px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Icons.Download size={20} /> Export Report
              </button>
              <button className="btn-teal-primary" onClick={() => setScreen("home")} style={{ flex: 1, minWidth: '150px' }}>
                Done
              </button>
            </div>
          </div>
        )}

        {/* ==========================================================================
            PREMIUM HIGH-CONTRAST RESULTS REPORT
           ========================================================================== */}
        {screen === "results" && (
          <div className="results-screen anim-fade-in content-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: 'var(--bg-main)', paddingBottom: '120px' }}>

            {/* 1. Teal Header Box (Non-printable) */}
            <div data-html2canvas-ignore="true" style={{ background: 'var(--primary-teal)', padding: '24px 20px 80px 20px', width: '100%', boxSizing: 'border-box', margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div onClick={() => { setSelectedSymptoms({}); setScreen("home"); }} style={{ cursor: 'pointer', zIndex: 10, padding: '5px' }}>
                    <Icons.ArrowLeft size={28} color="white" />
                </div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>Analysis Result</h2>
                <div style={{ width: 28 }}></div>
              </div>
            </div>

            {/* 2. The Printable Report Card (Hardcoded HEX colors fix html2canvas washout bug) */}
            <div className="printable-report-capture" style={{ background: '#FFFFFF', borderRadius: '24px', padding: '40px 30px', marginTop: '-50px', position: 'relative', flex: 1, boxShadow: '0 10px 30px rgba(0,0,0,0.08)', boxSizing: 'border-box', width: '95%', maxWidth: '800px', alignSelf: 'center', color: '#1F2937' }}>

             {/* Report Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #E5E7EB', paddingBottom: '20px', marginBottom: '24px' }}>
                 <div>
                   <h1 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: '#1F2937', letterSpacing: '-0.5px' }}>Medical AI Report</h1>
                   <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#6B7280', fontWeight: 600 }}>Symptom Assessment Summary</p>
                 </div>
                 <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Report ID</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '1rem', color: '#1F2937', fontWeight: 700 }}>#{new Date().getTime().toString().slice(-6)}</p>
                 </div>
              </div>
              
              {/* Patient Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '20px', background: '#F8FAFC', padding: '20px', borderRadius: '16px', marginBottom: '32px', border: '1px solid #E5E7EB' }}>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Patient Name</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1F2937', fontWeight: 800 }}>{userProfile.name || 'User'}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Age / Gender</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1F2937', fontWeight: 800 }}>{userProfile.age || '--'} / {userProfile.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : '--'}</p>
                </div>
                 <div>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>Date & Time</p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '1.1rem', color: '#1F2937', fontWeight: 800 }}>{new Date().toLocaleDateString('en-GB')}, {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>

              {/* AI Predictions */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎯</span> Top Identified Diseases
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px' }}>
                {results.slice(0, 3).map((r, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', borderRadius: '12px', background: i === 0 ? '#FEF2F2' : '#F9FAFB', border: i === 0 ? '1px solid #FECACA' : '1px solid #E5E7EB', borderLeft: i === 0 ? '6px solid #EF4444' : '6px solid #9CA3AF' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i === 0 ? '#EF4444' : '#D1D5DB', color: '#FFFFFF', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem', marginRight: '16px' }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '1.15rem', color: i === 0 ? '#991B1B' : '#1F2937', fontWeight: 800 }}>{r}</h4>
                        {i === 0 && <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: '#DC2626', fontWeight: 700 }}>Highest Probability Match</p>}
                      </div>
                    </div>
                ))}
              </div>

              {/* Precautions Section */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1F2937', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>💡</span> Recommended Next Steps
              </h3>
              <div style={{ background: '#F0FDF4', borderRadius: '16px', padding: '24px', border: '1px solid #A7F3D0' }}>
                {Array.isArray(precautions) ? (
                  <ul style={{ paddingLeft: '20px', color: '#065F46', fontWeight: 600, lineHeight: 1.8, margin: 0, fontSize: '0.95rem' }}>
                    {precautions.map((p, idx) => <li key={idx} style={{ marginBottom: '8px' }}>{p}</li>)}
                  </ul>
                ) : (
                  <p style={{ margin: 0, color: '#065F46', lineHeight: 1.6, fontWeight: 600, fontSize: '0.95rem' }}>
                    {precautions || "Suggested precautions: rest, stay hydrated, and follow medical guidance. Please consult a healthcare professional."}
                  </p>
                )}
              </div>

              {/* Disclaimer Footer */}
              <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '2px dashed #E5E7EB', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#EF4444', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                   <Icons.Shield size={18} /> Confidential Medical Assessment
                </p>
                <p style={{ margin: '10px auto 0 auto', fontSize: '0.8rem', color: '#6B7280', fontWeight: 500, maxWidth: '90%', lineHeight: 1.5 }}>
                   *This AI-generated assessment is for informational purposes only. It is not a clinical diagnosis. Always consult a qualified healthcare professional for medical advice and treatment.
                </p>
              </div>
            </div>

            {/* Action Buttons (Non-printable) */}
            <div data-html2canvas-ignore="true" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', margin: '30px auto', flexWrap: 'wrap', width: '95%', maxWidth: '800px' }}>
              <button className="btn-outline-teal" onClick={exportReport} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flex: 1, padding: '16px 30px', minWidth: '200px', backgroundColor: 'white' }}>
                <Icons.Download size={20} /> Export Report
              </button>
              <button className="btn-teal-primary" onClick={() => { setSelectedSymptoms({}); setScreen("home"); }} style={{ flex: 1, padding: '16px 30px', minWidth: '200px' }}>
                Return to Dashboard
              </button>
            </div>

          </div>
        )}

        {/* --- BOTTOM NAVIGATION --- */}
        {isLoggedIn && screen !== "login" && screen !== "loading" && screen !== "symptoms" && screen !== "results" && !viewingHistoryItem && (
          <nav className="bottom-nav">
            <div className={`nav-item ${screen === "home" ? "active" : ""}`} onClick={() => setScreen("home")}>
              <Icons.Home />
              <span>Home</span>
            </div>
            <div className={`nav-item ${screen === "symptoms" ? "active" : ""}`} onClick={() => { setSelectedSymptoms({}); setResults([]); setSearchQuery(""); navigateTo("symptoms"); }}>
              <Icons.Clipboard />
              <span>Assessment</span>
            </div>
            <div className={`nav-item ${screen === "history" ? "active" : ""}`} onClick={() => setScreen("history")}>
              <Icons.History />
              <span>History</span>
            </div>
            <div className="nav-item" onClick={handleLogout}>
              <Icons.LogOut />
              <span>Logout</span>
            </div>
          </nav>
        )}

      </main>
    </div>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

:root {
  --primary-teal: #004D40;
  --primary-light: #00695C;
  --bg-main: #F4F7F9;
  --white: #FFFFFF;
  --text-dark: #1F2937;
  --text-muted: #6B7280;
  --accent-orange: #F97316;
  --border-light: #E5E7EB;
  --danger-red: #EF4444;
  --success-green: #10B981;
}

body { margin: 0; background-color: var(--bg-main); font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; color: var(--text-dark); }

.med-ai-root { display: flex; justify-content: flex-start; min-height: 100vh; width: 100vw; background: var(--bg-main); }

/* --- CORE LAYOUT STRUCTURE --- */
.main-stage {
  width: 100%; max-width: 480px; margin: 0 auto; background-color: var(--bg-main);
  min-height: 100vh; position: relative; overflow-x: hidden; display: flex; flex-direction: column;
  box-shadow: 0 0 20px rgba(0,0,0,0.05); transition: 0.3s ease;
}

/* Utilities */
.text-dark { color: var(--text-dark); }
.text-muted { color: var(--text-muted); }
.text-white { color: var(--white); }
.teal-icon { color: var(--primary-teal); }
.red-text { color: var(--danger-red) !important; font-weight: 600; }
.mt-3 { margin-top: 16px; } .mt-4 { margin-top: 24px; } .mb-1 { margin-bottom: 8px; } .mb-3 { margin-bottom: 16px; } .mb-4 { margin-bottom: 24px; } .ml-2 { margin-left: 8px; }
.full-width { width: 100%; }
.text-center { text-align: center; }
.flex-grow { flex: 1; }

/* Buttons */
.btn-teal-primary {
  background: var(--primary-teal); color: var(--white); border: none; padding: 16px;
  border-radius: 50px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: 0.2s; text-align: center; width: 100%;
}
.btn-teal-primary:hover { background: var(--primary-light); }
.btn-outline-teal {
  background: transparent; border: 1.5px solid var(--primary-teal); color: var(--primary-teal);
  padding: 14px; border-radius: 50px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
}
.text-link-teal { background: none; border: none; color: var(--primary-teal); font-weight: 700; cursor: pointer; font-size: 0.95rem; }

/* --- AUTH SCREEN --- */
.auth-screen { padding: 40px 24px; display: flex; flex-direction: column; background: var(--white); flex: 1; }
.auth-header-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 30px; }
.brand-title-teal { font-size: 2rem; font-weight: 800; color: var(--primary-teal); margin: 0; }
.welcome-text { font-size: 1.8rem; font-weight: 800; margin: 0 0 8px 0; color: var(--text-dark); text-align: center; }
.subtitle-text { color: var(--text-muted); text-align: center; margin-bottom: 30px; }

.input-label { display: block; font-size: 0.85rem; color: var(--text-dark); font-weight: 600; margin-bottom: 8px; }
.light-input {
  width: 100%; background: var(--white); border: 1.5px solid var(--border-light);
  padding: 14px 16px; border-radius: 12px; color: var(--text-dark); font-size: 1rem;
  box-sizing: border-box; outline: none; transition: 0.2s; font-family: inherit;
}
.light-input:focus { border-color: var(--primary-teal); }
.password-row { position: relative; }
.eye-icon { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); color: var(--text-muted); cursor: pointer; }
.forgot-password { text-align: right; font-size: 0.85rem; color: var(--primary-teal); font-weight: 600; cursor: pointer; margin-bottom: 24px; }
.auth-footer { display: flex; justify-content: center; align-items: center; font-size: 0.95rem; }

/* ==========================================================================
   PREMIUM SAAS PROFILE UI
   ========================================================================== */

.profile-dashboard-layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Forces the strict 2-column sidebar layout on Desktop */
@media (min-width: 850px) {
  .profile-dashboard-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    align-items: flex-start;
  }
}

/* --- Left Sidebar (Identity) --- */
.profile-identity-card { padding: 40px 24px; }
.profile-avatar-wrapper { position: relative; display: inline-block; cursor: pointer; }

.photo-preview-circle {
  width: 140px; height: 140px; border-radius: 50%;
  border: 4px solid white; box-shadow: 0 10px 30px rgba(0, 77, 64, 0.1);
  overflow: hidden; display: flex; align-items: center; justify-content: center;
  background: #F0FDF4; color: var(--primary-teal);
}

.upload-badge-hover {
  position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%);
  background: rgba(0, 77, 64, 0.85); color: white; padding: 6px 14px;
  border-radius: 20px; font-size: 0.75rem; font-weight: 700;
  white-space: nowrap; backdrop-filter: blur(4px);
}

.profile-user-name { margin: 24px 0 4px; font-size: 1.6rem; font-weight: 800; color: var(--text-dark); letter-spacing: -0.5px; }
.profile-user-email { margin: 0; color: var(--text-muted); font-size: 0.95rem; font-weight: 600; }

.profile-action-divider { height: 1px; background: var(--border-light); margin: 30px 0; width: 100%; }
.profile-action-stack { display: flex; flex-direction: column; gap: 12px; }

.logout-btn {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 14px !important; margin-top: 8px;
  background: #FEF2F2 !important; color: var(--danger-red) !important;
}
.logout-btn:hover { background: var(--danger-red) !important; color: white !important; }


/* --- Right Content (Data Forms) --- */
.profile-data-card { padding: 36px; }
.card-header-row { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid var(--border-light); padding-bottom: 20px; }
.card-title-modern { margin: 0; font-size: 1.3rem; font-weight: 800; color: var(--text-dark); }

.editing-badge { background: #FEF3C7; color: #D97706; padding: 6px 12px; border-radius: 50px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; }

.modern-details-grid { display: grid; grid-template-columns: repeat(1, 1fr); gap: 24px; }
@media (min-width: 600px) { .modern-details-grid { grid-template-columns: repeat(2, 1fr); } }

.detail-group { display: flex; flex-direction: column; gap: 8px; }
.detail-label-modern { font-size: 0.8rem; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin: 0; }

/* The Read-Only Data Cards */
.detail-value-modern {
  font-size: 1.1rem; color: var(--text-dark); font-weight: 600;
  padding: 14px 18px; background: #F8FAFC; border-radius: 16px;
  border: 1px solid var(--border-light);
}

/* Security Idle State */
.security-status-row {
  display: flex; align-items: center; gap: 20px; padding: 24px;
  background: #F0FDF4; border-radius: 20px; border: 1px dashed #A7F3D0;
}
.security-icon-wrapper {
  width: 54px; height: 54px; background: white; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--success-green); box-shadow: 0 4px 10px rgba(16, 185, 129, 0.1);
}
.security-status-title { margin: 0 0 4px 0; font-weight: 800; color: var(--text-dark); font-size: 1.1rem; }
.security-status-desc { margin: 0; color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }

/* Layout Utilities */
.flex-between { display: flex; justify-content: space-between; align-items: center; }
.flex-start { display: flex; justify-content: flex-start; align-items: center; }
.gap-3 { gap: 16px; }
.text-small { font-size: 0.85rem; }

/* Profile Upload */
.photo-upload-wrapper { display: flex; justify-content: center; margin-bottom: 24px; }
.photo-label { cursor: pointer; position: relative; display: flex; flex-direction: column; align-items: center; }
.photo-preview-circle { width: 90px; height: 90px; border-radius: 50%; border: 2px dashed var(--primary-teal); display: flex; align-items: center; justify-content: center; overflow: hidden; color: var(--primary-teal); background: #f0fdfa; }
.photo-preview { width: 100%; height: 100%; object-fit: cover; }
.upload-badge { background: var(--primary-teal); color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 600; position: absolute; bottom: -10px; border: 2px solid white; }
.hidden-input { display: none; }

/* Form Grids */
.form-group-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
.form-group-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.phone-input-wrapper { display: flex; align-items: center; border: 1.5px solid var(--border-light); border-radius: 12px; overflow: hidden; }
.phone-prefix { background: #f3f4f6; padding: 14px 16px; color: var(--text-dark); font-weight: 600; border-right: 1.5px solid var(--border-light); }
.phone-input { border: none; border-radius: 0; }

/* --- SIDEBAR MENU --- */
.sidebar-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5); z-index: 3000;
  opacity: 0; visibility: hidden; transition: 0.3s ease;
}
.sidebar-overlay.open { opacity: 1; visibility: visible; }
.sidebar-menu {
  position: fixed; top: 0; left: 0; width: 280px; height: 100%;
  background: var(--primary-teal); z-index: 3001;
  transform: translateX(-100%); transition: transform 0.3s ease;
  display: flex; flex-direction: column; padding: 40px 0;
  box-shadow: 10px 0 30px rgba(0, 0, 0, 0.15);
}
.sidebar-menu.open { transform: translateX(0); }
.sidebar-header-logo { display: flex; align-items: center; gap: 12px; padding: 0 24px; margin-bottom: 40px; }
.sidebar-links { display: flex; flex-direction: column; gap: 8px; flex: 1; }
.sidebar-link {
  display: flex; align-items: center; gap: 16px; padding: 16px 24px;
  color: rgba(255, 255, 255, 0.6); font-weight: 600; font-size: 1.05rem;
  cursor: pointer; transition: 0.2s; margin-right: 24px;
  border-top-right-radius: 50px; border-bottom-right-radius: 50px;
}
.sidebar-link:hover { color: white; background: rgba(255, 255, 255, 0.05); }
.sidebar-link.active {
  color: var(--primary-teal); background: white; font-weight: 700; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* --- TOP-LEFT BACK ARROW HEADERS --- */
.dash-header-left {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.back-arrow-btn {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  margin-left: -8px; /* Visually aligns the arrow perfectly with the left edge */
  border-radius: 50%;
  transition: background 0.2s ease;
  z-index: 10;
}

.back-arrow-btn:hover {
  background: rgba(0,0,0,0.05);
}
.sidebar-link.active svg { color: var(--primary-teal); }
.sidebar-logout {
  display: flex; align-items: center; gap: 16px; padding: 16px 24px;
  color: rgba(255, 255, 255, 0.6); font-weight: 600; font-size: 1.05rem;
  cursor: pointer; transition: 0.2s;
}
.sidebar-logout:hover { color: var(--danger-red); }

/* --- DASHBOARD --- */
.dash-header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 10px; margin-bottom: 20px;}
.header-title { font-size: 1.25rem; font-weight: 700; margin: 0; }
.profile-mini-avatar { width: 40px; height: 40px; border-radius: 50%; overflow: hidden; background: #e5e7eb; display: flex; align-items: center; justify-content: center; }
.profile-mini-avatar img { width: 100%; height: 100%; object-fit: cover; }

.greeting-section h1 { font-size: 1.8rem; font-weight: 800; margin: 0 0 20px 0; }
/* --- PREMIUM PROFILE LAYOUT --- */
.profile-grid {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
  /* --- DARK THEME OVERRIDES --- */
.dark {
  --primary-teal: #2DD4BF; /* Brighter, glowing teal for dark mode text/accents */
  --primary-light: #14B8A6;
  --bg-main: #0F172A; /* Deep Slate Background */
  --white: #1E293B; /* Slate Card Background */
  --text-dark: #F8FAFC; /* White Text */
  --text-muted: #94A3B8; /* Muted Slate Text */
  --border-light: #334155; /* Dark Borders */
}

/* Specific Dark Mode Tweaks */
.dark .sidebar-menu {
  background: #0B1120;
  border-right: 1px solid var(--border-light);
}
.dark .sidebar-header-logo h2 {
  color: #F8FAFC !important;
}
.dark .sidebar-link.active {
  background: #1E293B;
  color: var(--primary-teal);
}
.dark .btn-teal-primary {
  background: #004D40; /* Keep the button solid green in dark mode */
  color: white;
}
.dark .btn-teal-primary:hover {
  background: #00695C;
}
.dark .light-input {
  background: #0F172A;
  color: #F8FAFC;
}
.dark .checkbox-square {
  background: #0F172A;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* Beautiful "Read-Only" Data Cards */
.detail-item {
  padding: 16px 20px;
  background: #F8FAFC;
  border-radius: 18px;
  border: 1px solid var(--border-light);
  font-size: 1.05rem;
  color: var(--text-dark);
  font-weight: 700;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.01);
}

/* DESKTOP SPLIT VIEW */
@media (min-width: 768px) {
  .profile-grid {
    display: grid;
    grid-template-columns: 1fr 2.2fr;
    align-items: start;
  }
  .details-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.white-card { background: var(--white); border-radius: 20px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }

/* BMI Gauge Mock */
.bmi-gauge-card { display: flex; justify-content: space-between; align-items: center; }
.bmi-subtitle { color: var(--text-muted); font-size: 0.9rem; font-weight: 600; }
.bmi-value-row { display: flex; align-items: baseline; gap: 4px; margin: 8px 0; }
.bmi-value-row h2 { font-size: 2.5rem; font-weight: 800; margin: 0; color: var(--text-dark); }
.bmi-plus { color: var(--border-light); font-size: 1.5rem; font-weight: 500; }
.bmi-status-pill { display: inline-flex; align-items: center; gap: 6px; font-weight: 600; font-size: 0.85rem; }
.bmi-status-pill .dot { width: 8px; height: 8px; border-radius: 50%; }
.bmi-green { color: var(--success-green); } .bmi-green .dot { background: var(--success-green); }
.bmi-yellow { color: var(--accent-orange); } .bmi-yellow .dot { background: var(--accent-orange); }
.bmi-red { color: var(--danger-red); } .bmi-red .dot { background: var(--danger-red); }
.bmi-gauge { width: 80px; height: 40px; border-top-left-radius: 40px; border-top-right-radius: 40px; background: conic-gradient(from 270deg at 50% 100%, var(--danger-red) 0deg, var(--accent-orange) 45deg, var(--success-green) 90deg, var(--border-light) 90deg); position: relative; margin-top: 10px; }
.bmi-gauge::after { content: ''; position: absolute; bottom: 0; left: 10px; right: 10px; top: 10px; background: white; border-top-left-radius: 30px; border-top-right-radius: 30px; }
.gauge-needle { position: absolute; bottom: 0; left: 50%; width: 2px; height: 30px; background: var(--text-dark); transform-origin: bottom center; transform: rotate(45deg); z-index: 2; }
.gauge-needle::after { content: ''; position: absolute; bottom: -4px; left: -3px; width: 8px; height: 8px; background: var(--text-dark); border-radius: 50%; }

/* Action Cards */
.action-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.full-span { grid-column: span 2; }
.teal-action-card { background: var(--primary-teal); border-radius: 20px; padding: 24px; color: white; display: flex; justify-content: space-between; align-items: center; cursor: pointer; box-shadow: 0 10px 25px rgba(0, 77, 64, 0.2); }
.teal-action-card .card-content { display: flex; align-items: center; gap: 16px; }
.teal-action-card h3 { margin: 0 0 4px 0; font-size: 1.1rem; }
.teal-action-card p { margin: 0; font-size: 0.9rem; opacity: 0.9; }
.icon-bubble { width: 44px; height: 44px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; }
.teal-bg { background: #e0f2f1; } .orange-bg { background: #ffedd5; }
.mini-action { display: flex; align-items: center; gap: 12px; padding: 16px; cursor: pointer; }
.mini-action h4 { margin: 0; font-size: 0.95rem; font-weight: 700; }

/* Timeline */
.section-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.section-title-row h3 { margin: 0; font-size: 1.1rem; }
.dots { color: var(--primary-teal); font-weight: 800; letter-spacing: 2px; }
.recent-timeline-card { display: flex; align-items: center; gap: 16px; position: relative; }
.timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--primary-teal); border: 3px solid #e0f2f1; flex-shrink: 0; }
.timeline-content { flex: 1; }
.time-text { margin: 0 0 4px 0; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
.symptoms-preview { margin: 0; font-size: 0.95rem; font-weight: 700; color: var(--text-dark); text-transform: capitalize; }
.btn-view-light { background: var(--bg-main); border: none; padding: 8px 16px; border-radius: 20px; font-weight: 600; color: var(--text-dark); cursor: pointer; }

/* --- SYMPTOMS SCREEN --- */
.search-box { display: flex; align-items: center; gap: 12px; background: var(--white); padding: 14px 16px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
.search-box input { border: none; outline: none; background: transparent; width: 100%; font-size: 1rem; font-family: inherit; }
@keyframes pulse-mic { 
  0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 
  70% { transform: scale(1.1); box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } 
  100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); } 
}

/* --- BULLETPROOF DARK MODE FIX FOR SYMPTOMS --- */
.dark .symptom-row-clean {
  background: var(--white) !important; 
  border-color: var(--border-light) !important;
}

.dark .symptom-name {
  color: var(--text-dark) !important;
}

.dark .checkbox-square {
  background: var(--bg-main) !important;
  border-color: var(--border-light) !important;
}

.dark .checkbox-square.checked {
  background: var(--primary-teal) !important;
  border-color: var(--primary-teal) !important;
}
.listening-pulse { animation: pulse-mic 1.5s infinite; }
.category-pills { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 5px; }
.pill { padding: 8px 20px; background: var(--white); border-radius: 50px; font-size: 0.9rem; font-weight: 600; color: var(--text-muted); white-space: nowrap; cursor: pointer; border: 1px solid var(--border-light); }
.pill.active { background: var(--primary-teal); color: white; border-color: var(--primary-teal); }

.symptom-row-clean { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--border-light); cursor: pointer; }
.symptom-name { font-size: 1.05rem; font-weight: 600; color: var(--text-dark); text-transform: capitalize; }
.checkbox-square { width: 24px; height: 24px; border-radius: 6px; border: 2px solid var(--border-light); display: flex; align-items: center; justify-content: center; color: white; transition: 0.2s; background: white; }
.checkbox-square.checked { background: var(--primary-teal); border-color: var(--primary-teal); }

.sticky-action-bar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 400px; background: var(--primary-teal); border-radius: 16px; padding: 12px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 25px rgba(0,0,0,0.2); z-index: 100; transition: 0.3s ease;}
.btn-cancel { background: transparent; color: white; border: none; font-weight: 600; font-size: 0.9rem; cursor: pointer; padding: 8px; }
.selection-count { display: flex; flex-direction: column; align-items: center; color: white; }
.count-num { font-weight: 800; font-size: 1.1rem; line-height: 1; }
.count-text { font-size: 0.7rem; opacity: 0.8; text-transform: uppercase; letter-spacing: 0.5px; }
.btn-analyze { background: var(--white); color: var(--primary-teal); border: none; padding: 10px 20px; border-radius: 12px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; }

/* --- DARK MODE FIX FOR PROFILE & DATA BOXES --- */
.dark .detail-value-modern {
  background: var(--white) !important;
  color: var(--text-dark) !important;
  border-color: var(--border-light) !important;
}

.dark .security-status-row {
  background: rgba(16, 185, 129, 0.1) !important; /* Soft green tint for the security box */
  border: 1px dashed rgba(16, 185, 129, 0.3) !important;
}

.dark .security-status-title {
  color: #10B981 !important; /* Keep the success green readable */
}

.dark .security-status-desc {
  color: var(--text-muted) !important;
}

.dark .editing-badge {
  background: rgba(217, 119, 6, 0.2) !important;
  color: #FBBF24 !important;
}

/* --- DARK MODE FIX FOR BMI GAUGE --- */
.dark .gauge-needle, 
.dark .gauge-needle::after {
  background: #FFFFFF !important; /* Forces the needle to be white in dark mode */
}

.dark .bmi-gauge::after {
  background: var(--white) !important; /* Ensures the inner arc of the gauge matches the card color */
}

/* --- DARK MODE TEXT & DASHBOARD CONTRAST FIX --- */
.dark .header-title, 
.dark .greeting-section h1,
.dark .section-title-row h3,
.dark .activity-title {
  color: #FFFFFF !important; /* Forces pure white for main headings */
}

.dark .mini-action h4,
.dark .mini-action p {
  color: #FFFFFF !important; /* Fixes "View History" and "Lab Report" card text visibility */
}

.dark .time-text {
  color: #94A3B8 !important; /* Slate-400 for secondary info like timestamps */
}

/* Fixes the "Recent Activity" cards that look too dark/faded */
.dark .recent-timeline-card {
  background: var(--white) !important;
  border: 1px solid var(--border-light);
}

.dark .recent-activity-section h3 {
    color: #FFFFFF !important;
}

/* Fixes the ghosting/faded look on secondary buttons */
.dark .btn-view-light {
  background: #334155 !important; /* Darker slate button */
  color: #FFFFFF !important;
}

/* --- RESULTS SCREEN --- */
.results-teal-header { background: var(--primary-teal); padding: 24px 20px 80px; position: relative; }
.shield-icon-wrapper { display: flex; justify-content: center; color: rgba(255,255,255,0.2); margin-top: 10px; }
.results-content-card { background: var(--white); border-top-left-radius: 30px; border-top-right-radius: 30px; padding: 30px 24px; margin-top: -60px; position: relative; min-height: 60vh; }
.top-predicted-badge { background: var(--danger-red); color: white; padding: 8px 24px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; position: absolute; top: -16px; left: 50%; transform: translateX(-50%); white-space: nowrap; box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3); }

.disease-item { display: flex; align-items: center; gap: 16px; padding: 20px; border-radius: 16px; background: #fafafa; border: 1px solid var(--border-light); margin-bottom: 12px; }
.rank-circle { width: 32px; height: 32px; border-radius: 50%; background: #fee2e2; color: var(--danger-red); font-weight: 800; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.disease-info { flex: 1; }
.disease-info h4 { margin: 0 0 4px 0; font-size: 1.1rem; font-weight: 800; color: var(--text-dark); }
.disease-info p { margin: 0; font-size: 0.85rem; color: var(--text-muted); font-weight: 600; }
.disease-icon { font-size: 1.5rem; }

/* Premium Pill Button (For Change Password) */
.btn-premium-teal {
  background: var(--primary-teal);
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 77, 64, 0.2);
}

.btn-premium-teal:hover {
  background: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 77, 64, 0.25);
}

.btn-premium-teal:active {
  transform: translateY(0);
}

.recommendations-section { margin-top: 30px; }
.recommendations-section h4 { font-size: 1.1rem; margin-bottom: 16px; }
.recommendations-section ul { padding-left: 20px; color: var(--text-muted); font-weight: 600; line-height: 1.8; margin: 0; }

.action-buttons-vertical { display: flex; flex-direction: column; }
.timestamp { font-size: 0.8rem; font-weight: 600; }

/* --- BOTTOM NAV --- */
.bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 480px; background: var(--white); display: flex; justify-content: space-around; padding: 12px 0 20px; border-top: 1px solid var(--border-light); z-index: 1000; border-top-left-radius: 20px; border-top-right-radius: 20px; box-shadow: 0 -5px 20px rgba(0,0,0,0.03); }
.nav-item { display: flex; flex-direction: column; align-items: center; gap: 6px; color: var(--text-muted); cursor: pointer; font-size: 0.75rem; font-weight: 600; transition: 0.2s; }
.nav-item.active { color: var(--primary-teal); }
.nav-item:hover { color: var(--primary-teal); }

/* Toasts and loading */
.loading-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.pulse-loader { animation: pulse 1.5s infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(0.95); } }
.anim-fade-in { animation: fadeIn 0.4s ease forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.error-toast, .notification-toast { position: fixed; top: 20px; left: 50%; transform: translateX(-50%); padding: 12px 24px; border-radius: 50px; color: white; font-weight: 600; z-index: 9999; }
.error-toast { background: var(--danger-red); } .notification-toast { background: var(--success-green); }

/* ==========================================================================
   DESKTOP RESPONSIVE DESIGN (The Magic Happens Here)
   ========================================================================== */
@media (min-width: 768px) {
  .main-stage {
    max-width: 100%;
    width: calc(100% - 280px); /* Leave exactly 280px for the sidebar */
    margin-left: 280px;
    box-shadow: none;
  }
  
  /* If on Login Screen, center the app completely and hide sidebar area */
  .main-stage.is-auth {
    width: 100%;
    margin-left: 0;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #e0f2f1 0%, #f4f7f9 100%);
  }

  .auth-screen {
    max-width: 500px;
    margin: 40px auto;
    border-radius: 24px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.08);
    height: auto;
    flex: none;
    border: 1px solid var(--border-light);
  }

  /* Keep Sidebar Open Always */
  .sidebar-menu { transform: translateX(0); }
  .sidebar-overlay { display: none !important; }
  
  /* Hide Mobile UI Elements */
  .mobile-only { display: none !important; }
  .bottom-nav { display: none !important; }

  /* Desktop Grids & Spacing */
  .content-container {
    padding: 40px 60px 100px; /* Wider padding on desktop */
  }

  .desktop-row {
    display: flex;
    gap: 24px;
    align-items: stretch;
  }
  
  .desktop-col { flex: 1; }
  
  .action-cards-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .full-span { grid-column: span 2; }

  /* Symptoms Checklist Grid */
  .desktop-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .symptom-row-clean {
    border: 1px solid var(--border-light);
    border-radius: 12px;
    padding: 16px;
    background: white;
  }

  /* History Grid */
  .desktop-grid-history {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 20px;
  }
  .history-grid-item { margin-bottom: 0; }

  /* Adjust Sticky Bar for Desktop Sidebar offset */
  .sticky-action-bar {
    left: calc(50% + 140px); /* 50% + half of sidebar width */
    max-width: 600px;
  }

  /* Results Card Styling */
  .desktop-grid-results {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
  .results-content-card {
    max-width: 900px;
    margin: -60px auto 0;
    box-shadow: 0 10px 40px rgba(0,0,0,0.08);
  }
  
  .desktop-w-auto { width: auto; display: inline-flex; padding-left: 30px; padding-right: 30px;}

  /* --- WIDE RESULTS SCREEN (Matches Photo Exactly) --- */
.results-fullscreen-wrapper {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background: #f4f7f9;
  z-index: 4000;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.results-wide-card-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.results-teal-header-wide {
  width: 100%;
  background: var(--primary-teal);
  padding: 20px 20px 80px 20px;
  position: relative;
}

.results-wide-card {
  background: var(--white);
  border-radius: 24px;
  width: 90%;
  max-width: 900px; /* Expands beautifully on Desktop */
  margin-top: -60px; /* Overlaps the teal header */
  padding: 40px 40px 20px 40px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.1);
}

.disease-grid-wide {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.disease-item-wide {
  display: flex; align-items: center; gap: 12px; padding: 16px;
  background: #fafafa; border: 1px solid var(--border-light); border-radius: 16px;
}

.results-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  margin-top: 30px;
}

.recommendations-section-wide {
  flex: 1;
}

.action-buttons-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 400px;
}

/* Gracefully snap back to mobile layout on small screens */
@media (max-width: 768px) {
  .disease-grid-wide { grid-template-columns: 1fr; }
  .results-bottom-row { flex-direction: column; gap: 20px; align-items: flex-start; }
  .action-buttons-column { max-width: 100%; width: 100%; }
  .results-wide-card { padding: 40px 20px 20px; margin-top: -40px; width: 100%; border-radius: 30px 30px 0 0; min-height: 80vh;}
}
  
}
.error-toast { background: var(--danger-red); } .notification-toast { background: var(--success-green); }

/* Remove Desktop Overrides to strictly keep it as a mobile simulator */
@media (max-width: 480px) {
  .med-ai-root { background: var(--bg-main); padding: 0; }
  .main-stage { max-width: 100%; height: 100vh; border-radius: 0; border: none; box-shadow: none; }
}

/* --- MOBILE CLICKABILITY FIXES --- */
.sidebar-overlay { 
  pointer-events: none; 
}
.sidebar-overlay.open { 
  pointer-events: auto; 
}

.btn-teal-primary, 
.btn-outline-teal, 
.light-input, 
.photo-label { 
  position: relative !important; 
  z-index: 50 !important; 
}

@media (max-width: 480px) {
  .main-stage { 
    height: auto !important; 
    min-height: 100vh !important; 
    overflow-y: visible !important;
  }
}
`; 
