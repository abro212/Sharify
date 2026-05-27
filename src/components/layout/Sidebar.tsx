import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, MessageSquare, Calculator, User, ShieldCheck, HeartPulse, 
  Crown, Target, RefreshCcw, Search, FileText, Users, Sparkles, Star, Heart, Coins, X 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { profile } = useAuthStore();
  const navigate = useNavigate();
  const userRole = profile?.role?.toLowerCase() || 'free';
  
  const baseItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Daily Cashflow', path: '/cashflow', icon: Coins },
    { name: 'Health Check', path: '/health-check', icon: HeartPulse },
    { name: 'Goal Planning', path: '/goals', icon: Target },
    { name: 'Zakat & Faraidh', path: '/zakat', icon: Calculator },
    { name: 'Riba Detox', path: '/riba-detox', icon: RefreshCcw, tier: 'plus' },
    { name: 'Asset Screener', path: '/screener', icon: Search, tier: 'plus' },
    { name: 'Qurban Saver', path: '/qurban-saver', icon: Heart, tier: 'plus' },
    { name: 'Smart Akad', path: '/akad-analyzer', icon: FileText, tier: 'pro' },
    { name: 'Zakat Tax Report', path: '/zakat-tax-report', icon: FileText, tier: 'pro' },
    { name: 'Baitul Mal', path: '/family-dashboard', icon: Users, tier: 'family' },
    { name: 'Digital Wasiat', path: '/wasiat-generator', icon: FileText, tier: 'family' },
    { name: 'AI Assistant', path: '/chat', icon: MessageSquare },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Upgrade', path: '/upgrade', icon: Crown },
  ];

  const navItems = profile?.role === 'admin'
    ? [
        ...baseItems.slice(0, 11),
        { name: 'Admin Portal', path: '/admin', icon: ShieldCheck },
        ...baseItems.slice(11)
      ]
    : baseItems;

  const { settings } = useSettingsStore();
  const resolvedLogoUrl = settings.logo_url;

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 glass-card border-r border-slate-200/60 flex flex-col z-[10000] transition-transform duration-300 transform lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between lg:justify-center h-16 border-b border-slate-200/50 px-4 bg-white/30">
        <div className="flex items-center">
          {resolvedLogoUrl ? (
            <img
              src={resolvedLogoUrl}
              alt="Sharify Logo"
              className="h-8 object-contain"
            />
          ) : (
            <>
              <ShieldCheck className="w-7 h-7 text-[#0F4C3A]" />
              <span className="ml-2 text-lg font-black text-slate-900 tracking-tight font-sans">Sharify</span>
            </>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        <nav className="space-y-1.5 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-300 ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-900 border-l-2 border-amber-500 pl-2.5 font-bold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-950 hover:translate-x-1 pl-3'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-2.5 flex-shrink-0 h-4 w-4 transition-transform group-hover:scale-115 ${
                      isActive ? 'text-[#0F4C3A]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.tier && (
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider shadow-sm border ${
                      item.tier === 'plus' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100/80' 
                        : item.tier === 'pro' 
                        ? 'bg-amber-50 text-amber-700 border-amber-100/80 animate-pulse' 
                        : 'bg-indigo-50 text-indigo-700 border-indigo-100/80'
                    }`}>
                      {item.tier === 'plus' ? (
                        <Sparkles className="w-2 h-2 mr-0.5" />
                      ) : item.tier === 'pro' ? (
                        <Crown className="w-2 h-2 mr-0.5" />
                      ) : (
                        <Star className="w-2 h-2 mr-0.5" />
                      )}
                      {item.tier}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-200/50 bg-slate-50/20">
        <div className="bg-gradient-to-br from-emerald-950 via-[#0B3A2C] to-slate-900 rounded-xl p-3 border border-amber-500/20 shadow-md relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-200 opacity-[0.03] blur-md group-hover:opacity-10 transition-opacity pointer-events-none"></div>
          <div className="flex justify-between items-center mb-1.5 relative z-10">
            <p className="text-[9px] uppercase font-black tracking-wider text-amber-400">
              Sharify Premium
            </p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide bg-amber-400/10 text-amber-300 border border-amber-400/25">
              {profile?.role || 'Free'}
            </span>
          </div>
          <p className="text-[10px] text-slate-300 leading-normal mb-2.5 relative z-10">
            Kalkulasi Fiqh & Asisten AI Syariah secara lengkap tanpa batas.
          </p>
          <button 
            onClick={() => {
              if (userRole === 'family' || userRole === 'admin') {
                navigate('/profile');
              } else {
                navigate('/upgrade');
              }
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#bfa032] text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-1 relative z-10 cursor-pointer"
          >
            <Crown className="w-3 h-3 text-white mr-1" />
            <span>
              {userRole === 'free' && 'Upgrade Sekarang'}
              {userRole === 'plus' && 'Upgrade ke Pro'}
              {userRole === 'pro' && 'Upgrade ke Family'}
              {(userRole === 'family' || userRole === 'admin') && 'Kelola Langganan'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
