// src/screens/ResultsView.jsx
import { Icons } from "../components/Icons";
import { motion } from "framer-motion";

export default function ResultsView({
  results, precautions, selectedSymptoms, userProfile, exportReport, setSelectedSymptoms, navigateTo
}) {
  const reportId = `${new Date().getTime().toString().slice(-6)}`;
  const dateStr = new Date().toLocaleDateString("en-GB", { day: '2-digit', month: 'short', year: 'numeric' });
  
  // Safely extract symptoms into an array whether it's an array or an object
  const symptomKeys = Array.isArray(selectedSymptoms) 
    ? selectedSymptoms 
    : Object.keys(selectedSymptoms || {}).filter((s) => selectedSymptoms[s]);

  const handleGoHome = () => {
    setSelectedSymptoms({});
    navigateTo("home");
  };

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950">
      
      {/* Immersive Header */}
      <div data-html2canvas-ignore="true" className="relative px-6 pt-10 pb-32 overflow-hidden bg-slate-900 dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.15),transparent_70%)]" />
        <div className="relative flex items-center justify-between max-w-3xl mx-auto">
          <button onClick={handleGoHome} className="p-3 text-white transition-colors border rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20">
            <Icons.ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-extrabold tracking-widest text-white uppercase opacity-80">Analysis Complete</h2>
          <div className="w-12" />
        </div>
      </div>

      {/* Physical Premium Card */}
      <div className="px-4 -mt-24 printable-report-capture">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 25 }}
          className="relative max-w-3xl p-1 mx-auto overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-slate-200 to-slate-400 dark:from-slate-800 dark:to-slate-900"
        >
          <div className="relative p-8 bg-white h-full w-full rounded-[22px] dark:bg-slate-950/90 backdrop-blur-3xl border border-white/50 dark:border-slate-800/50">
            
            {/* Holographic accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] rounded-full blur-3xl pointer-events-none" />

            {/* Card Header */}
            <div className="flex items-start justify-between pb-6 mb-6 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Med-AI ID</h1>
                <p className="mt-1 text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">Clinical Overview</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400">Record Number</p>
                <p className="text-xl font-mono font-bold tracking-tight text-slate-900 dark:text-white">#{reportId}</p>
              </div>
            </div>

            {/* Patient Grid */}
            <div className="grid grid-cols-2 gap-6 p-6 mb-8 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1.5">Subject</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{userProfile.name || "Anonymous User"}</p>
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mb-1.5">Date</p>
                <p className="text-lg font-extrabold text-slate-900 dark:text-white">{dateStr}</p>
              </div>
            </div>

            {/* ── NEW: SYMPTOMS REPORT ── */}
            <div className="mb-8">
              <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400">Reported Symptoms</h3>
              <div className="flex flex-wrap gap-2">
                {symptomKeys.length > 0 ? (
                  symptomKeys.map((s, i) => (
                    <span key={i} className="px-3 py-1.5 text-sm font-bold capitalize rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {s.replace(/_/g, " ")}
                    </span>
                  ))
                ) : (
                  <span className="text-sm font-medium text-slate-500">No symptoms recorded.</span>
                )}
              </div>
            </div>

            {/* AI Diagnostics */}
            <div className="mb-8">
              <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400">Identified Conditions</h3>
              <div className="space-y-3">
                {results.slice(0, 3).map((r, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border ${i === 0 ? 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50' : 'bg-transparent border-slate-100 dark:border-slate-800'}`}>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${i === 0 ? 'bg-rose-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                      {i + 1}
                    </div>
                    <h4 className={`text-lg font-extrabold tracking-tight ${i === 0 ? 'text-rose-900 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>{r}</h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Actionable Steps */}
            <div className="p-6 border rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50">
              <h4 className="flex items-center gap-2 mb-2 text-sm font-bold tracking-widest uppercase text-emerald-800 dark:text-emerald-400">
                <Icons.Check size={16} /> Recommended Protocol
              </h4>
              <p className="font-medium leading-relaxed text-emerald-900/80 dark:text-emerald-200/80">
                {Array.isArray(precautions) ? precautions[0] : precautions}
              </p>
            </div>

          </div>
        </motion.div>
      </div>

      {/* Floating Action Buttons */}
      <div data-html2canvas-ignore="true" className="flex justify-center max-w-3xl gap-4 px-6 mx-auto mt-10">
        <button onClick={exportReport} className="flex items-center justify-center flex-1 py-4 font-bold tracking-wide transition-all border rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 gap-2">
          <Icons.Download size={18} /> Export ID
        </button>
        <button onClick={handleGoHome} className="flex-1 py-4 font-extrabold tracking-wide text-white transition-all shadow-lg rounded-2xl bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30">
          Close
        </button>
      </div>
    </div>
  );
}