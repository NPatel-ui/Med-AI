// src/screens/AuthScreen.jsx
import { useState } from "react";
import { Icons } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthScreen({
  isNewUser, setIsNewUser, userProfile, handleProfileChange, handlePhotoUpload,
  loginData, handleLoginChange, confirmPassword, setConfirmPassword,
  handleLogin, handleRegister, handleForgotPassword,
}) {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Background floating orb animation
  const orbVariants = {
    animate: {
      x: [0, 50, -50, 0],
      y: [0, -50, 50, 0],
      transition: { duration: 15, ease: "linear", repeat: Infinity }
    }
  };

  const inputStyles = "w-full px-5 py-4 font-semibold transition-all bg-white/50 border outline-none rounded-2xl dark:bg-slate-950/50 border-slate-200/60 dark:border-slate-700/50 focus:bg-white focus:ring-4 focus:border-emerald-500 focus:ring-emerald-500/10 text-slate-900 dark:text-white backdrop-blur-sm";

  return (
    <div className="relative flex items-center justify-center min-h-screen p-6 overflow-hidden bg-slate-50 dark:bg-slate-950">
      
      {/* Immersive Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div variants={orbVariants} animate="animate" className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-emerald-400/20 dark:bg-emerald-600/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
        <motion.div variants={orbVariants} animate="animate" style={{ animationDelay: '-5s' }} className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-teal-300/30 dark:bg-teal-800/30 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative z-10 w-full max-w-[460px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-[2.5rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl border border-white/80 dark:border-slate-700/50"
      >
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.div 
            whileHover={{ rotate: 180, scale: 1.1 }} transition={{ duration: 0.4 }}
            className="flex items-center justify-center w-16 h-16 mb-5 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-[0_10px_30px_rgba(16,185,129,0.4)]"
          >
            <Icons.MedLogo size={32} className="text-white" />
          </motion.div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {isNewUser ? "Create Profile" : "Welcome Back"}
          </h2>
          <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
            {isNewUser ? "Join the next generation of health tracking." : "Enter your credentials to access your dashboard."}
          </p>
        </div>

        <form onSubmit={isNewUser ? handleRegister : handleLogin} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isNewUser && (
              <motion.div initial={{ opacity: 0, height: 0, scale: 0.95 }} animate={{ opacity: 1, height: "auto", scale: 1 }} exit={{ opacity: 0, height: 0, scale: 0.95 }} className="space-y-4 overflow-hidden">
                
                {/* Photo Upload */}
                <div className="flex justify-center mb-4">
                  <label className="relative cursor-pointer group">
                    <div className="flex items-center justify-center w-20 h-20 overflow-hidden transition-all duration-300 border-4 rounded-full bg-slate-100 dark:bg-slate-800 border-white dark:border-slate-700 group-hover:border-emerald-500 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                      {userProfile.photo ? (
                        <img src={userProfile.photo} alt="Preview" className="object-cover w-full h-full" />
                      ) : (
                        <Icons.User size={28} className="text-slate-400 transition-colors group-hover:text-emerald-500" />
                      )}
                    </div>
                    <div className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 text-white transition-transform border-2 border-white rounded-full bg-emerald-500 dark:border-slate-900 group-hover:scale-110">
                      <Icons.Clipboard size={12} />
                    </div>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>

                <input required name="name" value={userProfile.name || ""} onChange={handleProfileChange} placeholder="Full Name" className={inputStyles} />
                
                {/* Patient Fields */}
                <div className="grid grid-cols-2 gap-3">
                  <input required type="number" name="age" value={userProfile.age || ""} onChange={handleProfileChange} placeholder="Age" className={`${inputStyles} text-center !px-3`} />
                  <select required name="gender" value={userProfile.gender || ""} onChange={handleProfileChange} className={`${inputStyles} text-center !px-3`} style={{ appearance: "auto", color: userProfile.gender ? "inherit" : "#94A3B8" }}>
                    <option value="" disabled>Gender</option>
                    <option value="Male" style={{ color: "initial" }}>Male</option>
                    <option value="Female" style={{ color: "initial" }}>Female</option>
                    <option value="Prefer not to say" style={{ color: "initial" }}>Prefer not to say</option>
                  </select>
                  <input required type="number" name="height" value={userProfile.height || ""} onChange={handleProfileChange} placeholder="Ht (cm)" className={`${inputStyles} text-center !px-3`} />
                  <input required type="number" name="weight" value={userProfile.weight || ""} onChange={handleProfileChange} placeholder="Wt (kg)" className={`${inputStyles} text-center !px-3`} />
                </div>

                {/* Location Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <input required name="state" value={userProfile.state || ""} onChange={handleProfileChange} placeholder="State" className={inputStyles} />
                  <input required name="city" value={userProfile.city || ""} onChange={handleProfileChange} placeholder="City" className={inputStyles} />
                </div>

                {/* Mobile Number */}
                <div className="flex">
                  <div className="flex items-center justify-center px-4 font-extrabold border border-r-0 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-l-2xl border-slate-200/60 dark:border-slate-700/50">
                    +91
                  </div>
                  <input required type="tel" name="phone" maxLength="10" value={userProfile.phone || ""} onChange={handleProfileChange} placeholder="Mobile No." className={`${inputStyles} !rounded-l-none`} />
                </div>
                
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <input 
            required type="email" name="email" 
            value={isNewUser ? userProfile.email : loginData.email} 
            onChange={isNewUser ? handleProfileChange : handleLoginChange} 
            placeholder="Email Address" 
            className={inputStyles} 
          />
          
          {/* Password */}
          <div className="relative">
            <input required type={showPw ? "text" : "password"} name="password" value={isNewUser ? userProfile.password : loginData.password} onChange={isNewUser ? handleProfileChange : handleLoginChange} placeholder="Password" className={inputStyles} />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute text-slate-400 transition-colors right-4 top-4 hover:text-emerald-500">
              {showPw ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
            </button>
          </div>

          {/* Confirm Password (Registration only) */}
          <AnimatePresence>
            {isNewUser && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="relative overflow-hidden">
                <input required type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" className={inputStyles} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute text-slate-400 transition-colors right-4 top-4 hover:text-emerald-500">
                  {showConfirm ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!isNewUser && (
            <div className="text-right">
              <button type="button" onClick={handleForgotPassword} className="text-sm font-bold transition-colors text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">Forgot Password?</button>
            </div>
          )}

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="relative w-full py-4 mt-4 overflow-hidden font-extrabold tracking-wide text-white transition-all shadow-xl rounded-2xl group bg-gradient-to-r from-emerald-600 to-teal-500 hover:shadow-emerald-500/40">
            <span className="relative z-10">{isNewUser ? "Create Account" : "Sign In"}</span>
            <div className="absolute inset-0 transition-opacity opacity-0 group-hover:opacity-100 bg-gradient-to-r from-teal-500 to-emerald-600" />
          </motion.button>
        </form>

        <p className="mt-8 text-sm font-medium text-center text-slate-500 dark:text-slate-400">
          {isNewUser ? "Already have an account? " : "Don't have an account? "}
          <button type="button" onClick={() => setIsNewUser(!isNewUser)} className="font-bold transition-colors text-emerald-600 dark:text-emerald-400 hover:text-emerald-500">
            {isNewUser ? "Sign In" : "Create Profile"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}