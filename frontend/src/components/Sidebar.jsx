// src/components/Sidebar.jsx
import { Icons } from "./Icons";

export default function Sidebar({
  screen, navigateTo, startNewAssessment, handleLogout, isSidebarOpen, setIsSidebarOpen
}) {
  const links = [
    { id: "home",     label: "Dashboard",  icon: Icons.Home },
    { id: "symptoms", label: "Assessment", icon: Icons.Clipboard },
    { id: "history",  label: "History",    icon: Icons.History },
    { id: "profile",  label: "Profile",    icon: Icons.User },
  ];

  const handleLink = (id) => {
    if (id === "symptoms") startNewAssessment();
    else navigateTo(id);
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 transition-transform duration-300 bg-white border-r border-slate-200 dark:bg-slate-950 dark:border-slate-800 lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Brand Logo */}
        <div className="flex items-center gap-4 px-6 py-8">
          <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-emerald-600 shadow-emerald-500/30">
            <Icons.MedLogo size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Med-AI</h2>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col flex-1 gap-2 px-4 mt-2">
          {links.map(({ id, label, icon: Icon }) => {
            const isActive = screen === id;
            return (
              <button
                key={id}
                onClick={() => handleLink(id)}
                className={`flex items-center gap-3 px-4 py-3 font-bold transition-all rounded-xl w-full text-left ${
                  isActive 
                    ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900/50 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Icon size={20} className={isActive ? "text-emerald-600 dark:text-emerald-400" : ""} />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Logout Area */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/50">
          <button
            onClick={() => { handleLogout(); setIsSidebarOpen(false); }}
            className="flex items-center w-full gap-3 px-4 py-3 font-bold text-rose-600 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30"
          >
            <Icons.LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}