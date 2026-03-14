// src/screens/ProfileSettings.jsx
import { useState } from "react";
import { Icons } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSettings({
  userProfile,
  handleProfileChange,
  handlePhotoUpload,
  isEditingProfile,
  setIsEditingProfile,
  handleUpdateProfile,
  isChangingPassword,
  setIsChangingPassword,
  passwordData,
  setPasswordData,
  showProfilePasswords,
  setShowProfilePasswords,
  handleChangePassword,
  handleProfileForgotPassword,
  handleLogout,
  navigateTo,
}) {
  return (
    <div className="premium-profile-root">
      
      {/* ── 100% BULLETPROOF INTERNAL CSS FOR BENTO UI & DARK MODE ── */}
      <style>{`
        .premium-profile-root {
          position: relative;
          padding: 24px 24px 120px;
          max-width: 1100px;
          margin: 0 auto;
          min-height: 100vh;
          z-index: 1;
        }

        /* ── FIXED AMBIENT BACKGROUND (Solves the white screen bug) ── */
        .ambient-bg {
          position: fixed; inset: 0; z-index: -1; pointer-events: none;
          background-color: #F8FAFC; /* Forces light mode background */
          background-image: radial-gradient(circle at 10% 20%, rgba(20, 184, 166, 0.05), transparent 40%),
                            radial-gradient(circle at 90% 50%, rgba(16, 185, 129, 0.05), transparent 40%);
          transition: background-color 0.3s ease;
        }
        .dark .ambient-bg {
          background-color: #0F172A; /* Forces OLED dark mode background */
          background-image: radial-gradient(circle at 10% 20%, rgba(20, 184, 166, 0.12), transparent 40%),
                            radial-gradient(circle at 90% 50%, rgba(16, 185, 129, 0.12), transparent 40%);
        }

        /* Layout Grid */
        .premium-grid {
          display: grid; grid-template-columns: 1fr; gap: 24px;
        }
        @media (min-width: 900px) {
          .premium-grid { grid-template-columns: 340px 1fr; align-items: start; }
        }

        /* Frosted Glass Panels */
        .glass-panel {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-radius: 32px; padding: 32px;
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
          border: 1px solid rgba(255, 255, 255, 0.6);
          position: relative; overflow: hidden; transition: all 0.3s ease;
        }
        .dark .glass-panel {
          background: rgba(30, 41, 59, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.3);
        }

        /* Bento Boxes (For Vitals) */
        .bento-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 24px;
        }
        .bento-box {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 20px; padding: 20px 16px;
          display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;
        }
        .dark .bento-box {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(51, 65, 85, 0.6);
        }
        @media (max-width: 500px) {
          .bento-grid { grid-template-columns: 1fr; }
          .bento-box { flex-direction: row; text-align: left; padding: 16px 20px; }
        }

        /* Typography & Components */
        .p-title { font-size: 1.3rem; font-weight: 800; color: #0F172A; margin: 0 0 20px; font-family: var(--font-head); }
        .p-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #64748B; margin-bottom: 6px; display: block; }
        .p-value { font-size: 1.1rem; font-weight: 800; color: #0F172A; text-transform: capitalize; }
        
        .p-back-btn { background: #ffffff; border: 1px solid #E2E8F0; color: #0F172A; }
        
        .dark .p-title, .dark .p-value { color: #F8FAFC; }
        .dark .p-label { color: #94A3B8; }
        .dark .p-back-btn { background: #1E293B; border-color: #334155; color: #F8FAFC; }

        /* Inputs */
        .p-input {
          width: 100%; background: #F8FAFC; border: 1.5px solid #E2E8F0;
          border-radius: 16px; padding: 16px 20px; font-size: 1rem; font-weight: 600; color: #0F172A;
          outline: none; transition: all 0.25s ease;
        }
        .p-input:focus { border-color: #004D40; background: #ffffff; box-shadow: 0 0 0 4px rgba(0, 77, 64, 0.1); }
        
        .dark .p-input { background: #0F172A; border-color: #334155; color: #F8FAFC; }
        .dark .p-input:focus { border-color: #10B981; background: #1E293B; box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15); }

        /* Detail List */
        .detail-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 16px 0; border-bottom: 1px solid #F1F5F9;
        }
        .dark .detail-row { border-bottom-color: #1E293B; }
        .detail-row:last-child { border-bottom: none; padding-bottom: 0; }

        /* Buttons */
        .p-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; padding: 16px; border-radius: 16px; border: none;
          font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s ease;
          font-family: var(--font-head);
        }
        .p-btn-primary { background: #004D40; color: #ffffff; box-shadow: 0 8px 20px rgba(0, 77, 64, 0.2); }
        .p-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(0, 77, 64, 0.3); }
        
        .p-btn-outline { background: transparent; border: 2px solid #E2E8F0; color: #0F172A; }
        .p-btn-outline:hover { border-color: #004D40; color: #004D40; background: #F0FDFB; }
        
        .dark .p-btn-primary { background: #10B981; color: #0F172A; }
        .dark .p-btn-outline { border-color: #334155; color: #F8FAFC; }
        .dark .p-btn-outline:hover { border-color: #10B981; color: #10B981; background: rgba(16, 185, 129, 0.1); }
      `}</style>

      {/* Force Background Fix */}
      <div className="ambient-bg" />

      {/* ── HEADER ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <button 
          onClick={() => navigateTo("home")}
          className="p-back-btn"
          style={{ width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", transition: "all 0.3s ease" }}
        >
          <Icons.ArrowLeft size={20} />
        </button>
        <h2 className="p-title" style={{ margin: 0, fontSize: "1.6rem" }}>My Profile</h2>
      </div>

      <div className="premium-grid">
        
        {/* ── LEFT COLUMN: IDENTITY & STATUS ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: 0 }}>
            {/* Rich Banner */}
            <div style={{ height: 120, background: "linear-gradient(135deg, #004D40 0%, #00897B 100%)", position: "relative" }}>
              <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at right top, rgba(255,255,255,0.2) 0%, transparent 50%)" }} />
            </div>
            
            <div style={{ padding: "0 32px 32px", textAlign: "center", marginTop: -50 }}>
              {/* Avatar */}
              <label style={{ cursor: isEditingProfile ? "pointer" : "default", display: "inline-block", position: "relative", marginBottom: 20 }}>
                <div style={{
                  width: 100, height: 100, borderRadius: "50%", background: "var(--white, #ffffff)",
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                  border: "4px solid var(--white, #ffffff)", boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                  color: "#004D40"
                }}>
                  {userProfile.photo 
                    ? <img src={userProfile.photo} alt="User" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> 
                    : <Icons.User size={44} />}
                </div>
                {isEditingProfile && (
                  <div style={{ position: "absolute", bottom: 0, right: 0, background: "#10B981", color: "#ffffff", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid var(--white, #ffffff)", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                    ✏️
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} disabled={!isEditingProfile} />
              </label>

              {isEditingProfile ? (
                <input name="name" value={userProfile.name} onChange={handleProfileChange} className="p-input" style={{ textAlign: "center", marginBottom: 12 }} placeholder="Full Name" />
              ) : (
                <>
                  <h3 className="p-title" style={{ fontSize: "1.5rem", marginBottom: 4 }}>{userProfile.name || "User Name"}</h3>
                  <p className="p-label" style={{ textTransform: "none", letterSpacing: 0 }}>{userProfile.email}</p>
                </>
              )}

              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                {isEditingProfile ? (
                  <button className="p-btn p-btn-primary" onClick={handleUpdateProfile}>Save Changes</button>
                ) : (
                  <button className="p-btn p-btn-outline" onClick={() => setIsEditingProfile(true)}>Edit Profile</button>
                )}
                <button 
                  className="p-btn" 
                  onClick={handleLogout}
                  style={{ background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}
                >
                  <Icons.LogOut size={20} /> Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Account Status */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: 24, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ width: 48, height: 48, borderRadius: 16, background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", flexShrink: 0 }}>
              <Icons.Shield size={24} />
            </div>
            <div>
              <p className="p-value" style={{ fontSize: "1rem", marginBottom: 2 }}>Account Secure</p>
              <p className="p-label" style={{ margin: 0, textTransform: "none", letterSpacing: 0 }}>Active Protection</p>
            </div>
          </motion.div>

        </div>

        {/* ── RIGHT COLUMN: BENTO VITALS & DATA ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h4 className="p-title" style={{ margin: 0 }}>Clinical Vitals</h4>
              {isEditingProfile && <span style={{ background: "rgba(16, 185, 129, 0.15)", color: "#10B981", padding: "6px 12px", borderRadius: 50, fontSize: "0.75rem", fontWeight: 800 }}>EDITING</span>}
            </div>

            {isEditingProfile ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
                <div><span className="p-label">Age</span><input type="number" name="age" value={userProfile.age} onChange={handleProfileChange} className="p-input" /></div>
                <div>
                  <span className="p-label">Gender</span>
                  <select name="gender" value={userProfile.gender || ""} onChange={handleProfileChange} className="p-input" style={{ appearance: "auto" }}>
                    <option value="" disabled>Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div><span className="p-label">Height (cm)</span><input type="number" name="height" value={userProfile.height} onChange={handleProfileChange} className="p-input" /></div>
                <div><span className="p-label">Weight (kg)</span><input type="number" name="weight" value={userProfile.weight} onChange={handleProfileChange} className="p-input" /></div>
              </div>
            ) : (
              <div className="bento-grid">
                
                {/* CUSTOM INLINE SVG ICONS (Crash-Proof) */}
                <div className="bento-box">
                  <div style={{ color: "#10B981", marginBottom: 4 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                  </div>
                  <div>
                    <div className="p-value" style={{ fontSize: "1.4rem" }}>{userProfile.age ? `${userProfile.age}y` : "—"}</div>
                    <div className="p-label" style={{ margin: 0 }}>Age</div>
                  </div>
                </div>

                <div className="bento-box">
                  <div style={{ color: "#F59E0B", marginBottom: 4 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v18"/><path d="M16 3v18"/><path d="M8 12h8"/><path d="M8 7h8"/><path d="M8 17h8"/></svg>
                  </div>
                  <div>
                    <div className="p-value" style={{ fontSize: "1.4rem" }}>{userProfile.height ? `${userProfile.height}` : "—"}</div>
                    <div className="p-label" style={{ margin: 0 }}>Height (cm)</div>
                  </div>
                </div>

                <div className="bento-box">
                  <div style={{ color: "#3B82F6", marginBottom: 4 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
                  </div>
                  <div>
                    <div className="p-value" style={{ fontSize: "1.4rem" }}>{userProfile.weight ? `${userProfile.weight}` : "—"}</div>
                    <div className="p-label" style={{ margin: 0 }}>Weight (kg)</div>
                  </div>
                </div>

              </div>
            )}

            <h4 className="p-title" style={{ margin: "32px 0 16px", fontSize: "1.1rem" }}>Contact & Location</h4>
            
            {isEditingProfile ? (
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                 <div><span className="p-label">State</span><input type="text" name="state" value={userProfile.state} onChange={handleProfileChange} className="p-input" /></div>
                 <div><span className="p-label">City</span><input type="text" name="city" value={userProfile.city} onChange={handleProfileChange} className="p-input" /></div>
                 <div style={{ gridColumn: "1 / -1" }}>
                   <span className="p-label">Mobile Number</span>
                   <div style={{ display: "flex" }}>
                     <span className="p-input" style={{ width: "auto", borderRight: "none", borderRadius: "16px 0 0 16px", fontWeight: 800, color: "#64748B", background: "rgba(0,0,0,0.02)" }}>+91</span>
                     <input type="tel" name="phone" maxLength="10" value={userProfile.phone} onChange={handleProfileChange} className="p-input" style={{ borderRadius: "0 16px 16px 0" }} />
                   </div>
                 </div>
               </div>
            ) : (
              <div>
                <div className="detail-row">
                  <span className="p-label" style={{ margin: 0 }}>Location</span>
                  <span className="p-value">{userProfile.city && userProfile.state ? `${userProfile.city}, ${userProfile.state}` : "Not provided"}</span>
                </div>
                <div className="detail-row">
                  <span className="p-label" style={{ margin: 0 }}>Phone</span>
                  <span className="p-value">{userProfile.phone ? `+91 ${userProfile.phone}` : "Not provided"}</span>
                </div>
                <div className="detail-row">
                  <span className="p-label" style={{ margin: 0 }}>Gender</span>
                  <span className="p-value">{userProfile.gender || "Not specified"}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Security Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: isChangingPassword ? 24 : 0 }}>
              <h4 className="p-title" style={{ margin: 0 }}>Security</h4>
              {!isChangingPassword && (
                <button onClick={() => setIsChangingPassword(true)} style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10B981", border: "none", padding: "10px 16px", borderRadius: 12, fontWeight: 800, cursor: "pointer" }}>
                  Change Password
                </button>
              )}
            </div>

            <AnimatePresence>
              {isChangingPassword && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ display: "flex", flexDirection: "column", gap: 20, overflow: "hidden" }}>
                  
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span className="p-label">Current Password</span>
                      <button type="button" onClick={handleProfileForgotPassword} style={{ background: "none", border: "none", color: "#10B981", fontWeight: 800, fontSize: "0.75rem", cursor: "pointer", padding: 0 }}>Forgot?</button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <input type={showProfilePasswords.current ? "text" : "password"} value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} className="p-input" placeholder="••••••••" style={{ paddingRight: 50 }} />
                      <button type="button" onClick={() => setShowProfilePasswords(p => ({ ...p, current: !p.current }))} style={{ position: "absolute", right: 16, top: 18, background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                        {showProfilePasswords.current ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="p-label">New Password</span>
                    <div style={{ position: "relative" }}>
                      <input type={showProfilePasswords.new ? "text" : "password"} value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} className="p-input" placeholder="••••••••" style={{ paddingRight: 50 }} />
                      <button type="button" onClick={() => setShowProfilePasswords(p => ({ ...p, new: !p.new }))} style={{ position: "absolute", right: 16, top: 18, background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                        {showProfilePasswords.new ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="p-label">Confirm New Password</span>
                    <div style={{ position: "relative" }}>
                      <input type={showProfilePasswords.confirm ? "text" : "password"} value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} className="p-input" placeholder="••••••••" style={{ paddingRight: 50 }} />
                      <button type="button" onClick={() => setShowProfilePasswords(p => ({ ...p, confirm: !p.confirm }))} style={{ position: "absolute", right: 16, top: 18, background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}>
                        {showProfilePasswords.confirm ? <Icons.Eye size={20} /> : <Icons.EyeOff size={20} />}
                      </button>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                    <button className="p-btn p-btn-primary" onClick={handleChangePassword}>Update Password</button>
                    <button className="p-btn p-btn-outline" onClick={() => { setIsChangingPassword(false); setPasswordData({ current: "", new: "", confirm: "" }); }}>Cancel</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </div>
  );
}