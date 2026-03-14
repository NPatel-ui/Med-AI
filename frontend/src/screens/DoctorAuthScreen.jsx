// src/screens/DoctorAuthScreen.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "../components/Icons";

export default function DoctorAuthScreen({
  isNewDoctor, setIsNewDoctor, doctorProfile, handleDoctorProfileChange, 
  loginData, handleLoginChange, confirmPassword, setConfirmPassword,
  handleDoctorLogin, handleDoctorRegister, handleForgotPassword, navigateTo
}) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Background floating orb animation (Enterprise Blue/Indigo theme)
  const orbVariants = {
    animate: {
      x: [0, -40, 40, 0],
      y: [0, 40, -40, 0],
      transition: { duration: 18, ease: "linear", repeat: Infinity }
    }
  };

  const inputStyles = "w-full px-5 py-4 font-semibold transition-all bg-white/50 border outline-none rounded-2xl dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-700/50 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 text-slate-900 dark:text-white backdrop-blur-sm";

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Immersive Animated Background - Provider Theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div variants={orbVariants} animate="animate" className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <motion.div variants={orbVariants} animate="animate" style={{ animationDelay: '-7s' }} className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-blue-300/30 dark:bg-blue-800/30 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-[480px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[2.5rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl border border-white/80 dark:border-slate-700/50"
      >
        {/* Back to Patient Portal Link */}
        <button 
          onClick={() => navigateTo("auth")}
          className="absolute flex items-center gap-2 text-sm font-bold transition-colors top-6 left-6 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
        >
          <Icons.ArrowLeft size={16} /> Patient Portal
        </button>

        <div className="flex flex-col items-center mt-6 mb-8 text-center">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-[0_10px_30px_rgba(79,70,229,0.4)]"
          >
            {/* Custom Medical Cross SVG for Doctors */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M2 12h20" />
            </svg>
          </motion.div>
          <div className="px-3 py-1 mb-3 text-xs font-extrabold tracking-widest text-indigo-700 uppercase rounded-full bg-indigo-100 dark:bg-indigo-900/50 dark:text-indigo-300">
            Provider Portal
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isNewDoctor ? "Join the Network" : "Doctor Sign In"}
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            {isNewDoctor ? "Register to manage patient consultations and AI insights." : "Access your clinical dashboard and patient reports."}
          </p>
        </div>

        <form onSubmit={isNewDoctor ? handleDoctorRegister : handleDoctorLogin} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isNewDoctor && (
              <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: "auto", scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} className="space-y-4 overflow-hidden">
                
                <input required name="name" value={doctorProfile?.name || ""} onChange={handleDoctorProfileChange} placeholder="Full Name (e.g., Dr. Smith)" className={inputStyles} />
                
                {/* Doctor Specific Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <input required name="specialty" value={doctorProfile?.specialty || ""} onChange={handleDoctorProfileChange} placeholder="Specialty" className={inputStyles} />
                  <input required name="licenseId" value={doctorProfile?.licenseId || ""} onChange={handleDoctorProfileChange} placeholder="License ID" className={inputStyles} />
                </div>
                
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <input 
            required 
            type="email" 
            name="email" 
            value={isNewDoctor ? doctorProfile?.email || "" : loginData.email} 
            onChange={isNewDoctor ? handleDoctorProfileChange : handleLoginChange} 
            placeholder="Work Email Address" 
            className={inputStyles} 
          />
          
          {/* Password */}
          <div className="relative">
            <input required type={showPw ? "text" : "password"} name="password" value={isNewDoctor ? doctorProfile?.password || "" : loginData.password} onChange={isNewDoctor ? handleDoctorProfileChange : handleLoginChange} placeholder="Password" className={inputStyles} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute text-slate-400 transition-colors right-4 top-4 hover:text-indigo-500">
              {showPw ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
            </button>
          </div>

          {/* Confirm Password (Registration only) */}
          <AnimatePresence>
            {isNewDoctor && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                <input required type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className={inputStyles} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute text-slate-400 right-4 top-4 hover:text-indigo-500">
                  {showConfirm ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isNewDoctor && (
            <div className="text-right">
              <button type="button" onClick={handleForgotPassword} className="text-sm font-bold transition-colors text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Forgot Password?</button>
            </div>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="relative w-full py-4 mt-4 overflow-hidden font-extrabold tracking-wide text-white transition-all shadow-xl rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-500 hover:shadow-indigo-500/40 group">
            <span className="relative z-10">{isNewDoctor ? "Submit Application" : "Secure Sign In"}</span>
            <div className="absolute inset-0 transition-opacity opacity-0 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:opacity-100" />
          </motion.button>
        </form>

        <p className="mt-8 text-sm font-medium text-center text-slate-500 dark:text-slate-400">
          {isNewDoctor ? "Already registered? " : "Not in our network yet? "}
          <button type="button" onClick={() => setIsNewDoctor(!isNewDoctor)} className="font-bold transition-colors text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">
            {isNewDoctor ? "Sign In" : "Apply Now"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}