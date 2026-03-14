// src/screens/DoctorDashboard.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Icons } from "../components/Icons";

export default function DoctorDashboard({ userProfile, handleLogout, navigateTo }) {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data to make the dashboard look alive before we connect the backend
  const pendingConsults = [
    { id: "C-8829", patient: "Rahul Verma", age: 34, issue: "High Fever & Chills", time: "10 mins ago", urgency: "High" },
    { id: "C-8830", patient: "Priya Sharma", age: 28, issue: "Lab Report Review", time: "1 hr ago", urgency: "Normal" },
    { id: "C-8831", patient: "Amit Patel", age: 45, issue: "Routine Follow-up", time: "3 hrs ago", urgency: "Low" }
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* ── SIDEBAR ── */}
      <div className="hidden w-64 p-6 border-r md:flex md:flex-col bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-12">
          <div className="flex items-center justify-center w-10 h-10 text-white rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/30 shadow-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Provider</span>
        </div>

        <nav className="flex-1 space-y-2">
          {["overview", "patients", "messages"].map((tab) => (
            <button 
              key={tab} onClick={() => setActiveTab(tab)}
              className={`flex items-center w-full gap-3 px-4 py-3 text-sm font-bold transition-all rounded-xl capitalize ${
                activeTab === tab 
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400" 
                  : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-400"
              }`}
            >
              {tab === "overview" && <Icons.Dashboard size={18} />}
              {tab === "patients" && <Icons.User size={18} />}
              {tab === "messages" && <Icons.Message size={18} />}
              {tab}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10">
          <Icons.LogOut size={18} /> Sign Out
        </button>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto relative">
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Mobile Header (Hidden on Desktop) */}
        <div className="flex items-center justify-between mb-8 md:hidden">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 text-white rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
            </div>
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">Provider</span>
          </div>
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500"><Icons.LogOut size={20} /></button>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 relative z-10">
          <div>
            <p className="text-sm font-bold tracking-widest uppercase text-indigo-600 dark:text-indigo-400 mb-1">
              {userProfile?.specialty || "Medical Provider"}
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Welcome, {userProfile?.name || "Doctor"}
            </h1>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 text-sm font-bold bg-white border rounded-lg shadow-sm dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800">
              License: <span className="text-slate-900 dark:text-white">{userProfile?.licenseId || "Pending"}</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Pending Consults</p>
            <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">3</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Active Patients</p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">124</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Reports Analyzed</p>
            <p className="text-4xl font-extrabold text-slate-900 dark:text-white">8</p>
          </motion.div>
        </div>

        {/* Patient Queue */}
        <div className="relative z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Consultation Queue</h3>
            <button className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">View All</button>
          </div>
          
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {pendingConsults.map((consult, idx) => (
              <div key={idx} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-bold text-lg">
                    {consult.patient.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white">{consult.patient} <span className="text-xs font-medium text-slate-500">({consult.age}y)</span></h4>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{consult.issue}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                    consult.urgency === 'High' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    consult.urgency === 'Normal' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                  }`}>
                    {consult.urgency}
                  </span>
                  <span className="text-sm font-bold text-slate-400">{consult.time}</span>
                  <button className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white font-bold text-sm rounded-lg hover:bg-indigo-600 transition-colors">
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}