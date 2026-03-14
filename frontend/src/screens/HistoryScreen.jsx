// src/screens/HistoryScreen.jsx
import { useState } from "react";
import { Icons } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";

export default function HistoryScreen({ history, labHistory, handleViewActivity, navigateTo }) {
  const [tab, setTab] = useState("assessment");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssessments = history.filter(item => !searchQuery || (item.topMatch || "").toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredLab = labHistory.filter(item => !searchQuery || (item.reportData?.summary || "").toLowerCase().includes(searchQuery.toLowerCase()));

  // ── NEW: Safe Symptom Extractor ──
  const getSymptomsArray = (symps) => {
    if (!symps) return [];
    if (Array.isArray(symps)) return symps;
    if (typeof symps === 'object') return Object.keys(symps).filter(k => symps[k]);
    return [];
  };

  return (
    <div className="min-h-screen px-6 pt-6 pb-32 bg-slate-50 dark:bg-slate-950">
      
      <div className="flex items-center max-w-4xl gap-4 mx-auto mb-8">
        <button onClick={() => navigateTo("home")} className="p-3 transition-colors rounded-full bg-white/60 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800 backdrop-blur-md text-slate-900 dark:text-white">
          <Icons.ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Activity History</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Search */}
        <div className="relative flex items-center w-full px-5 py-4 mb-6 transition-all border shadow-sm rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-slate-200 dark:border-slate-800 focus-within:border-emerald-500">
          <Icons.Search size={20} className="text-slate-400" />
          <input placeholder="Search records..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 w-full ml-4 font-medium bg-transparent outline-none text-slate-900 dark:text-white placeholder:text-slate-400" />
        </div>

        {/* iOS Segmented Control */}
        <div className="flex p-1 mb-8 rounded-xl bg-slate-200/50 dark:bg-slate-800/50 backdrop-blur-md">
          {[
            { id: "assessment", label: `Assessments (${history.length})` },
            { id: "lab", label: `Lab Reports (${labHistory.length})` },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`relative flex-1 py-2.5 text-sm font-bold tracking-wide rounded-lg transition-all z-10 ${tab === id ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              {tab === id && (
                <motion.div layoutId="activeTab" className="absolute inset-0 z-[-1] rounded-lg shadow-sm bg-white dark:bg-slate-700" />
              )}
              {label}
            </button>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {(tab === "assessment" ? filteredAssessments : filteredLab).map((item, idx) => {
              const isLab = tab === "lab";
              const safeSymptoms = getSymptomsArray(item.symptoms); // Safe extraction

              return (
                <motion.div
                  key={idx} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleViewActivity(item)}
                  className={`p-6 cursor-pointer border rounded-3xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all group ${isLab ? 'hover:border-amber-500' : 'hover:border-emerald-500'}`}
                >
                  <p className="mb-2 text-xs font-bold tracking-widest uppercase text-slate-400">{item.date}, {item.time}</p>
                  <h4 className="mb-4 text-lg font-extrabold tracking-tight transition-colors text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {isLab ? "Lab Report Analysis" : (item.topMatch || "Assessment Record")}
                  </h4>
                  
                  {/* ── UPDATED: SYMPTOMS RENDERING ── */}
                  {!isLab && safeSymptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {safeSymptoms.slice(0, 3).map((s, i) => (
                        <span key={i} className="px-3 py-1 text-xs font-bold capitalize rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {s.replace(/_/g, " ")}
                        </span>
                      ))}
                      {safeSymptoms.length > 3 && (
                        <span className="px-3 py-1 text-xs font-bold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          +{safeSymptoms.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}