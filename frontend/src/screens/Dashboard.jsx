// src/screens/Dashboard.jsx
import { Icons } from "../components/Icons";
import { motion } from "framer-motion";

function BmiRing({ bmiValue, bmiInfo }) {
  const radius = 38; // Slightly smaller to accommodate a thicker, bolder stroke
  const circumference = 2 * Math.PI * radius;
  
  // Safely handle missing values and calculate how much the ring should fill
  const safeBmi = bmiValue ? parseFloat(bmiValue) : 0;
  const percent = safeBmi > 0 ? Math.min(Math.max((safeBmi - 15) / 25, 0), 1) : 0;
  const offset = circumference - percent * circumference;
  
  const isHealthy = bmiInfo?.label === "Healthy";
  const isUnder = bmiInfo?.label === "Underweight";
  const isOver = bmiInfo?.label === "Overweight";

  // Dynamic colors and deep shadows based on health status
  const colorClass = isHealthy ? "text-emerald-500" : isUnder ? "text-amber-500" : isOver ? "text-rose-500" : "text-slate-300 dark:text-slate-700";
  const glowClass = isHealthy ? "drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]" : isUnder ? "drop-shadow-[0_0_12px_rgba(245,158,11,0.5)]" : isOver ? "drop-shadow-[0_0_12px_rgba(244,63,94,0.5)]" : "";
  const bgPulseClass = isHealthy ? "bg-emerald-500" : isUnder ? "bg-amber-500" : isOver ? "bg-rose-500" : "bg-transparent";

  return (
    <div className="flex items-center gap-6 p-6 transition-all duration-300 border shadow-sm rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-white dark:border-slate-800 hover:shadow-xl col-span-1 md:col-span-2 lg:col-span-1 group">
      
      {/* Animated Circular Meter */}
      <div className="relative flex items-center justify-center w-24 h-24 shrink-0">
        
        {/* Subtle background pulse animation matching the status color */}
        {safeBmi > 0 && (
          <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${bgPulseClass}`} style={{ animationDuration: '3s' }} />
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {/* Background Ring */}
          <circle cx="50" cy="50" r={radius} className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="10" fill="transparent" />
          
          {/* Animated Foreground Ring */}
          <motion.circle 
            initial={{ strokeDashoffset: circumference }} 
            animate={{ strokeDashoffset: offset }} 
            transition={{ type: "spring", stiffness: 45, damping: 12, delay: 0.2 }}
            cx="50" cy="50" r={radius} 
            className={`${colorClass} ${glowClass} transition-colors duration-500`} 
            stroke="currentColor" /* <--- THIS MAKES THE COLOR WORK */
            strokeWidth="10" 
            strokeDasharray={circumference} 
            strokeLinecap="round" 
            fill="transparent" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-2xl font-extrabold tracking-tight ${safeBmi > 0 ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
            {safeBmi > 0 ? safeBmi : "--"}
          </span>
        </div>
      </div>

      {/* Clean Text Info */}
      <div className="flex flex-col justify-center flex-1">
        <p className="text-[10px] font-extrabold tracking-widest uppercase text-slate-400 group-hover:text-slate-500 transition-colors">Body Mass Index</p>
        <p className={`mt-1 text-xl font-extrabold tracking-tight transition-colors ${colorClass}`}>
          {safeBmi > 0 ? bmiInfo.label : "Update Profile"}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard({
  userProfile, theme, toggleTheme, bmiValue, bmiInfo, allActivity,
  handleViewActivity, setScreen, setIsSidebarOpen, startNewAssessment, handleReportUpload
}) {
  const firstName = userProfile.name ? userProfile.name.split(" ")[0] : "User";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } };

  return (
    <div className="min-h-screen p-6 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50">
      
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-10">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 transition-colors rounded-full lg:hidden text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-800">
          <Icons.Menu size={24} />
        </button>
        <div className="flex items-center gap-4 ml-auto">
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleTheme} className="p-3 transition-colors rounded-full shadow-sm bg-white/80 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 backdrop-blur-md">
            {theme === "light" ? <Icons.Moon size={20} /> : <Icons.Sun size={20} />}
          </motion.button>
          <motion.div whileHover={{ scale: 1.05 }} onClick={() => setScreen("profile")} className="w-12 h-12 overflow-hidden transition-all border-2 cursor-pointer rounded-2xl border-white dark:border-slate-800 shadow-lg hover:border-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            {userProfile.photo ? <img src={userProfile.photo} alt="Profile" className="object-cover w-full h-full" /> : <div className="flex items-center justify-center w-full h-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300"><Icons.User size={24} /></div>}
          </motion.div>
        </div>
      </div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <motion.div variants={itemVariants}>
          <p className="text-sm font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-500">{greeting},</p>
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900 dark:text-white mt-1">
            {firstName}.
          </h1>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          {/* Main CTA Assessment */}
          <motion.div variants={itemVariants} onClick={startNewAssessment} className="relative overflow-hidden cursor-pointer col-span-1 md:col-span-2 group rounded-3xl bg-emerald-600 shadow-[0_15px_40px_rgba(16,185,129,0.25)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.4)] transition-all duration-500 transform hover:-translate-y-1">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 opacity-90 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute top-[-50%] right-[-20%] w-[150%] h-[150%] bg-[radial-gradient(circle,rgba(255,255,255,0.2)_0%,transparent_60%)] animate-[spin_20s_linear_infinite]" />
            
            <div className="relative z-10 flex flex-col justify-between h-full p-8 text-white">
              <div className="flex items-center justify-center transition-transform duration-300 w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl group-hover:scale-110">
                <Icons.Clipboard size={28} className="text-white drop-shadow-md" />
              </div>
              <div className="mt-16">
                <h3 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">Run Assessment</h3>
                <p className="mt-2 font-medium text-emerald-50 text-md opacity-90">AI-powered symptom analysis &rarr;</p>
              </div>
            </div>
          </motion.div>

          {/* Clean Animated BMI Ring */}
          <BmiRing bmiValue={bmiValue} bmiInfo={bmiInfo} />

          {/* Upload Card */}
          <motion.label variants={itemVariants} className="flex flex-col justify-center p-8 transition-all duration-300 border-2 border-dashed cursor-pointer rounded-3xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl border-slate-300 dark:border-slate-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 hover:border-emerald-500 dark:hover:border-emerald-500 group">
            <div className="flex items-center justify-center w-14 h-14 transition-all duration-300 rounded-2xl bg-slate-100 dark:bg-slate-800 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/50 text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:-translate-y-1">
              <Icons.Clipboard size={26} />
            </div>
            <h4 className="mt-6 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Upload Lab Report</h4>
            <p className="mt-2 text-sm font-medium text-slate-500">Smart PDF data extraction</p>
            <input type="file" accept="application/pdf" onChange={handleReportUpload} className="hidden" />
          </motion.label>
          
          {/* Timeline */}
          <motion.div variants={itemVariants} className="col-span-1 p-8 shadow-sm md:col-span-2 lg:col-span-3 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-white dark:border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">Recent Activity</h3>
              <button onClick={() => setScreen("history")} className="text-sm font-bold transition-colors text-emerald-600 dark:text-emerald-400 hover:text-emerald-700">View All</button>
            </div>
            
            <div className="space-y-4">
              {allActivity.length > 0 ? allActivity.slice(0, 3).map((activity, idx) => {
                const isLab = activity.type === "lab_report";
                return (
                  <motion.div whileHover={{ scale: 1.01 }} key={idx} onClick={() => handleViewActivity(activity)} className="relative flex items-center gap-6 p-5 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-md bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl group">
                    <div className={`flex items-center justify-center w-12 h-12 rounded-xl shadow-inner ${isLab ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400'}`}>
                      <Icons.Clipboard size={20} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{isLab ? "Lab Report Analysis" : activity.topMatch}</h4>
                      <p className="text-xs font-bold tracking-widest uppercase text-slate-400 mt-1">{activity.date}</p>
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 transition-colors rounded-full bg-white dark:bg-slate-800 text-slate-400 group-hover:text-emerald-500 group-hover:shadow-sm">
                      <Icons.ArrowRight size={18} />
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="p-8 text-center border-2 border-dashed rounded-2xl border-slate-200 dark:border-slate-800">
                  <p className="font-medium text-slate-500">No recent activity. Start an assessment!</p>
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}