import React, { useContext, useState } from 'react';
import { Leaf, Menu, X, Shield, Award, BarChart3, MapPin, ClipboardList, PlusCircle, Flag, Lightbulb, Calculator, FileText, BookOpen, Sparkles, Info, UserCheck, LogOut } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Navbar({ currentPage, setCurrentPage, onOpenPledge }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, logout } = useContext(AuthContext);

  const navItems = [
    { id: 'landing', label: 'Home', icon: Leaf },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'usage-analysis', label: 'Usage Analysis', icon: BarChart3 },
    { id: 'hotspots', label: 'Campus Hotspots', icon: MapPin },
    { id: 'survey', label: 'Survey', icon: ClipboardList },
    { id: 'report-usage', label: 'Report Usage', icon: PlusCircle },
    { id: 'campaigns', label: 'Campaigns', icon: Flag },
    { id: 'recommendations', label: 'Recommendations', icon: Lightbulb },
    { id: 'impact', label: 'Impact Calculator', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'methodology', label: 'Methodology', icon: BookOpen },
    { id: 'future-scope', label: 'Future Scope', icon: Sparkles },
    { id: 'about', label: 'About Project', icon: Info },
    { id: 'admin', label: 'Admin', icon: Shield, badge: isAdmin ? 'Admin' : null }
  ];

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-emerald-500/20 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Leaf className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white">VSIT</span>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-500/30">
                  CEP Sustainability
                </span>
              </div>
              <p className="text-[11px] text-emerald-400/80 hidden sm:block font-medium">
                Vidyalankar School of Information Technology
              </p>
            </div>
          </div>

          {/* Desktop Nav Links (Top subset) */}
          <div className="hidden lg:flex items-center space-x-1 overflow-x-auto py-1">
            {[
              { id: 'landing', label: 'Home' },
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'hotspots', label: 'Hotspots' },
              { id: 'survey', label: 'Survey' },
              { id: 'report-usage', label: 'Report' },
              { id: 'campaigns', label: 'Campaigns' },
              { id: 'impact', label: 'Impact' },
              { id: 'reports', label: 'Reports' },
              { id: 'admin', label: 'Admin' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  currentPage === item.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={onOpenPledge}
              className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20 active:scale-95"
            >
              <Award className="w-4 h-4" />
              Take Eco Pledge
            </button>

            {user ? (
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/60 rounded-xl px-2.5 py-1">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-slate-200 font-medium">{user.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  title="Logout"
                  className="text-slate-400 hover:text-red-400 transition ml-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : null}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <div className="grid grid-cols-2 gap-1.5 mb-3">
            {navItems.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition ${
                    currentPage === item.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => {
              onOpenPledge();
              setMobileOpen(false);
            }}
            className="w-full bg-emerald-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Award className="w-4 h-4" /> Take Campus Eco Pledge
          </button>
        </div>
      )}
    </nav>
  );
}
