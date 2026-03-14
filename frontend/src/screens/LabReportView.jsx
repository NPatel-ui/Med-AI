// src/screens/LabReportView.jsx
import { Icons } from "../components/Icons";
import { motion } from "framer-motion";

export default function LabReportView({ parsedReport, exportReport, navigateTo }) {
  if (!parsedReport) return null;

  return (
    <div className="min-h-screen pb-20 bg-slate-50 dark:bg-slate-950">
      
      {/* Immersive Header */}
      <div data-html2canvas-ignore="true" className="relative px-6 pt-10 pb-32 overflow-hidden bg-slate-900 dark:bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.15),transparent_70%)]" />
        <div className="relative flex items-center justify-between max-w-3xl mx-auto">
          <button onClick={() => navigateTo("history")} className="p-3 text-white transition-colors border rounded-full bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20">
            <Icons.ArrowLeft size={20} />
          </button>
          <h2 className="text-lg font-extrabold tracking-widest text-white uppercase opacity-80">Lab Extraction</h2>
          <div className="w-12" />
        </div>
      </div>

      {/* Physical Premium Document */}
      <div className="px-4 -mt-24 printable-report-capture">
        <motion.div 
          initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 25 }}
          className="relative max-w-3xl p-1 mx-auto overflow-hidden shadow-2xl rounded-3xl bg-gradient-to-br from-amber-200 to-amber-500 dark:from-amber-800 dark:to-slate-900"
        >
          <div className="relative p-8 bg-white h-full w-full rounded-[22px] dark:bg-slate-950/90 backdrop-blur-3xl border border-white/50 dark:border-slate-800/50">
            
            <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">AI Summary</h1>
            <p className="text-lg font-medium leading-relaxed text-slate-700 dark:text-slate-300 mb-10">{parsedReport.summary}</p>

            <h3 className="mb-4 text-xs font-bold tracking-widest uppercase text-slate-400">Key Findings</h3>
            <div className="space-y-4">
              {parsedReport.abnormal_results?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-5 border rounded-2xl bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800">
                  <div>
                    <h4 className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white mb-1">{item.test_name}</h4>
                    <p className="text-sm font-medium text-slate-500">{item.simple_meaning}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-extrabold tracking-tight ${item.status === 'high' ? 'text-rose-500' : item.status === 'low' ? 'text-amber-500' : 'text-emerald-500'}`}>{item.value}</p>
                    <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mt-1">{item.status}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </motion.div>
      </div>

      <div data-html2canvas-ignore="true" className="flex justify-center max-w-3xl gap-4 px-6 mx-auto mt-10">
        <button onClick={exportReport} className="flex items-center justify-center flex-1 py-4 font-bold tracking-wide transition-all border rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800 gap-2">
          <Icons.Download size={18} /> Export
        </button>
      </div>
    </div>
  );
}