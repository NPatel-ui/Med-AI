// src/screens/SymptomAssessment.jsx
import { Icons } from "../components/Icons";
import { motion, AnimatePresence } from "framer-motion";

export default function SymptomAssessment({
  symptoms,
  selectedSymptoms,
  toggleSymptom,
  searchQuery,
  setSearchQuery,
  analyzeSymptoms,
  setSelectedSymptoms,
  isListening,
  handleVoiceInput,
  navigateTo,
}) {
  const filteredSymptoms = symptoms.filter((s) =>
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const selectedCount = Object.values(selectedSymptoms).filter(Boolean).length;

  return (
    <div className="screen" style={{ paddingBottom: 260, position: "relative" }}>
      
      {/* ── 100% RESPONSIVE & TRUE DARK MODE CSS ── */}
      <style>{`
        /* ── FIXED BACKGROUND (Solves the white screen bug) ── */
        .sym-ambient-bg {
          position: fixed; inset: 0; z-index: -1; pointer-events: none;
          background-color: #F8FAFC; 
          background-image: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.05), transparent 60%);
          transition: background-color 0.3s ease;
        }
        .dark .sym-ambient-bg {
          background-color: #0F172A;
          background-image: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.1), transparent 60%);
        }

        /* Matrix Grid System */
        .symptoms-matrix {
          display: grid; grid-template-columns: 1fr; gap: 12px;
        }
        @media (min-width: 768px) {
          .symptoms-matrix { grid-template-columns: repeat(3, 1fr); }
        }

        /* ── LIGHT THEME (DEFAULT) ── */
        .sym-header-text { color: #0F172A; }
        .sym-back-btn { background: #ffffff; border: 1px solid #E2E8F0; color: #0F172A; }
        .sym-search-bar { background: #ffffff; border: 1.5px solid #E2E8F0; }
        .sym-search-input { color: #0F172A; }
        .sym-search-input::placeholder { color: #94A3B8; }
        .sym-icon-muted { color: #94A3B8; }

        /* Card - Unselected */
        .symptom-card {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 20px; border-radius: 16px;
          border: 1.5px solid #E2E8F0; background: #ffffff;
          cursor: pointer; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          color: #334155; font-weight: 700; font-size: 0.95rem; text-transform: capitalize;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .symptom-card:hover { border-color: #10B981; transform: translateY(-2px); box-shadow: 0 6px 12px rgba(0,0,0,0.05); }
        
        .sym-check-bg {
          width: 24px; height: 24px; border-radius: 8px; border: 2px solid #CBD5E1;
          display: flex; align-items: center; justify-content: center; background: transparent;
          transition: all 0.2s ease; color: transparent;
        }

        /* Card - Selected (Light) */
        .symptom-card.selected {
          background: #F0FDF4; border-color: #10B981; color: #065F46;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.15);
        }
        .symptom-card.selected .sym-check-bg {
          background: #10B981; border-color: #10B981; color: #ffffff;
        }

        /* Bottom Bar (Light) */
        .sym-bottom-bar { background: rgba(255, 255, 255, 0.95); border: 1px solid transparent; }
        .sym-selected-label { color: #64748B; }
        .sym-selected-count { color: #065F46; }
        .sym-clear-btn { background: #F1F5F9; color: #475569; }
        .sym-analyze-btn { background: #004D40; color: #ffffff; box-shadow: 0 8px 20px rgba(0,77,64,0.25); }
        .sym-mic-btn { background: #004D40; color: #ffffff; box-shadow: 0 8px 20px rgba(0,77,64,0.3); }


        /* ── DARK THEME OVERRIDES ── */
        .dark .sym-header-text { color: #F8FAFC; }
        .dark .sym-back-btn { background: #1E293B; border-color: #334155; color: #F8FAFC; }
        .dark .sym-search-bar { background: #1E293B; border-color: #334155; }
        .dark .sym-search-input { color: #F8FAFC; }
        
        /* Card - Unselected (Dark) */
        .dark .symptom-card { background: #1E293B; border-color: #334155; color: #CBD5E1; }
        .dark .symptom-card:hover { border-color: #10B981; background: #172033; }
        .dark .sym-check-bg { border-color: #475569; }

        /* Card - Selected (Dark) - Sleek Neon Glow */
        .dark .symptom-card.selected {
          background: rgba(16, 185, 129, 0.12); border-color: #10B981; color: #34D399;
          box-shadow: 0 4px 16px rgba(16, 185, 129, 0.2);
        }
        .dark .symptom-card.selected .sym-check-bg {
          background: #10B981; border-color: #10B981; color: #0F172A;
        }

        /* Bottom Bar & Mic (Dark) */
        .dark .sym-bottom-bar { background: rgba(15, 23, 42, 0.95); border: 1px solid #334155; }
        .dark .sym-selected-label { color: #94A3B8; }
        .dark .sym-selected-count { color: #34D399; }
        .dark .sym-clear-btn { background: #334155; color: #E2E8F0; }
        .dark .sym-analyze-btn { background: #10B981; color: #0F172A; box-shadow: 0 8px 20px rgba(16,185,129,0.25); }
        .dark .sym-mic-btn { background: #10B981; color: #0F172A; box-shadow: 0 8px 20px rgba(16,185,129,0.25); }

        /* Global Mic Pulse */
        .sym-mic-btn.listening { background: #EF4444 !important; color: #ffffff !important; box-shadow: 0 0 0 8px rgba(239,68,68,0.2) !important; }

        /* Floating Layout Positioning */
        .assessment-bottom-bar { bottom: 86px; }
        @media (min-width: 1024px) { .assessment-bottom-bar { bottom: 30px; left: calc(50% + 130px); } }
      `}</style>

      {/* Force Background Fix */}
      <div className="sym-ambient-bg" />

      {/* ── Header ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 36 }}>
        <button
          className="sym-back-btn"
          onClick={() => navigateTo("home")}
          aria-label="Back"
          style={{
            width: 48, height: 48, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.3s ease", padding: 0
          }}
        >
          <Icons.ArrowLeft size={20} />
        </button>
        <h2 className="sym-header-text" style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, fontFamily: "var(--font-head, inherit)" }}>
          Symptom Assessment
        </h2>
      </div>

      {/* ── Search & Voice Input Row ── */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <div className="sym-search-bar" style={{ 
          flex: 1, display: "flex", alignItems: "center", 
          borderRadius: 18, padding: "0 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", transition: "all 0.3s ease"
        }}>
          <Icons.Search size={22} className="sym-icon-muted" />
          <input
            className="sym-search-input"
            placeholder="Search symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              flex: 1, border: "none", background: "transparent", 
              padding: "16px 12px", outline: "none", 
              fontSize: "1rem", fontWeight: 600
            }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
              <Icons.X size={20} className="sym-icon-muted" />
            </button>
          )}
        </div>

        {/* Voice Mic Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleVoiceInput}
          className={`sym-mic-btn ${isListening ? "listening animate-pulse" : ""}`}
          style={{
            width: 56, height: 56, borderRadius: 18, flexShrink: 0, border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s"
          }}
        >
          <Icons.Mic size={24} />
        </motion.button>
      </div>

      {/* ── Symptom Matrix Grid ── */}
      <div className="symptoms-matrix">
        <AnimatePresence>
          {filteredSymptoms.length > 0 ? (
            filteredSymptoms.map((s) => {
              const isSelected = !!selectedSymptoms[s];
              return (
                <motion.div
                  key={s} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className={`symptom-card ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleSymptom(s)}
                >
                  <span>{s.replace(/_/g, " ")}</span>
                  <div className="sym-check-bg">
                    {isSelected && <Icons.Check size={14} strokeWidth={3} />}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 0" }}>
              <p className="sym-icon-muted" style={{ fontWeight: 600 }}>No symptoms found for "{searchQuery}"</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating Analyze Bar ── */}
      <div
        className="assessment-bottom-bar sym-bottom-bar"
        style={{
          position: "fixed", left: "50%", transform: "translateX(-50%)",
          width: "calc(100% - 32px)", maxWidth: 600,
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          borderRadius: 24, padding: "16px 20px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          zIndex: 100, transition: "all 0.3s ease"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div>
            <p className="sym-selected-label" style={{ fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, margin: "0 0 2px" }}>
              Selected
            </p>
            <p className="sym-selected-count" style={{ fontSize: "1.6rem", fontWeight: 800, lineHeight: 1, fontFamily: "var(--font-head)", margin: 0 }}>
              {selectedCount}
            </p>
          </div>
          {selectedCount > 0 && (
            <button
              onClick={() => setSelectedSymptoms({})}
              className="sym-clear-btn"
              style={{ border: "none", padding: "8px 12px", borderRadius: 10, fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", transition: "all 0.2s" }}
            >
              Clear
            </button>
          )}
        </div>

        <motion.button
          whileHover={selectedCount > 0 ? { scale: 1.03 } : {}}
          whileTap={selectedCount > 0 ? { scale: 0.97 } : {}}
          onClick={analyzeSymptoms}
          disabled={selectedCount === 0}
          className="sym-analyze-btn"
          style={{
            border: "none", padding: "14px 24px", borderRadius: 16,
            fontWeight: 800, fontSize: "1.05rem", fontFamily: "var(--font-head)",
            cursor: selectedCount > 0 ? "pointer" : "not-allowed",
            opacity: selectedCount > 0 ? 1 : 0.5,
            display: "flex", alignItems: "center", gap: 8, transition: "opacity 0.2s"
          }}
        >
          Analyze Data <Icons.ArrowRight size={18} />
        </motion.button>
      </div>

    </div>
  );
}