// src/components/BottomNav.jsx
import { Icons } from "./Icons";

export default function BottomNav({ screen, navigateTo, startNewAssessment }) {
  const navItems = [
    { id: "home", label: "Home", icon: Icons.Home, action: () => navigateTo("home") },
    { id: "symptoms", label: "Assess", icon: Icons.Clipboard, action: () => startNewAssessment() },
    { id: "history", label: "History", icon: Icons.History, action: () => navigateTo("history") },
    { id: "profile", label: "Profile", icon: Icons.User, action: () => navigateTo("profile") },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 pb-2 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 lg:hidden">
      {navItems.map(({ id, label, icon: Icon, action }) => {
        const isActive = screen === id;
        return (
          <button
            key={id}
            onClick={action}
            className={`flex flex-col items-center justify-center w-full py-3 gap-1 transition-colors ${
              isActive ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            }`}
          >
            <Icon size={22} className={isActive ? "scale-110 transition-transform" : ""} />
            <span className="text-[10px] font-extrabold tracking-widest uppercase">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}