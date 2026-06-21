import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function Layout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      {/* Sidebar */}
      <div className="hidden lg:block"><Sidebar /></div>
      {mobileMenuOpen && <><button aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} className="fixed inset-0 z-40 bg-slate-950/70 lg:hidden"/><Sidebar className="fixed inset-y-0 left-0 z-50 shadow-2xl lg:hidden" /></>}

      {/* Main Area */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="relative"><button aria-label="Open navigation" onClick={() => setMobileMenuOpen(true)} className="absolute left-3 top-7 z-20 rounded-xl p-2 text-slate-300 hover:bg-white/10 lg:hidden"><Menu size={20}/></button><Navbar /></div>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
