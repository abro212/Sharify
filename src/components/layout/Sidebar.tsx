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
  const { settings } = useSettingsStore();
  const navigate = useNavigate();
  const userRole = profile?.role?.toLowerCase() || 'free';
  const resolvedLogoUrl = settings?.logo_url;
  
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

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-[#020907]/90 backdrop-blur-xl border-r border-[#10B981]/25 flex flex-col z-[10000] transition-transform duration-300 transform lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between lg:justify-center h-16 border-b border-[#10B981]/20 px-4 bg-[#020b08]/50">
        <div className="flex items-center">
          {resolvedLogoUrl ? (
            <img
              src={resolvedLogoUrl}
              alt="Sharify Logo"
              className="h-8 object-contain"
            />
          ) : (
            <>
              <ShieldCheck className="w-7 h-7 text-[#34D399] drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]" />
              <span className="ml-2 text-base font-black tracking-widest bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent font-sans uppercase">Sharify</span>
              <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 ml-1.5 animate-pulse"></span>
            </>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-emerald-400/80 hover:bg-emerald-500/10 hover:text-white transition-colors"
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
                `group flex items-center px-3 py-1.5 text-xs font-bold rounded-lg transition-all duration-300 border-l-[3px] relative overflow-hidden ${
                  isActive
                    ? 'bg-[#031d14] text-[#34D399] border-amber-400 pl-2.5 font-black shadow-inner shadow-emerald-500/5'
                    : 'text-emerald-300/70 border-transparent hover:bg-emerald-500/5 hover:text-white hover:translate-x-1 pl-3'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-2.5 flex-shrink-0 h-4 w-4 transition-transform group-hover:scale-115 ${
                      isActive ? 'text-[#34D399] drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]' : 'text-emerald-500/60 group-hover:text-emerald-400'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate tracking-wide">{item.name}</span>
                  {item.tier && (
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-wider shadow-sm border ${
                      item.tier === 'plus' 
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' 
                        : item.tier === 'pro' 
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/20 animate-pulse' 
                        : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
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

      <div className="p-3 border-t border-[#10B981]/20 bg-[#020b08]/30">
        <div className="bg-gradient-to-br from-[#020d09] via-[#041710] to-[#020907] rounded-xl p-3 border border-[#10B981]/25 shadow-md relative overflow-hidden group hologram-scanner">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-200 opacity-[0.01] blur-md group-hover:opacity-5 transition-opacity pointer-events-none"></div>
          <div className="flex justify-between items-center mb-1.5 relative z-10">
            <p className="text-[9px] uppercase font-black tracking-widest shimmer-gold-text">
              ENERGY MATRIX
            </p>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide bg-amber-400/20 text-amber-300 border border-amber-400/40 font-mono">
              {profile?.role || 'Free'}
            </span>
          </div>
          <p className="text-[10px] text-emerald-300/80 leading-normal mb-2.5 relative z-10 font-mono">
            Sistem telemetri & instrumen finansial aktif.
          </p>
          <button 
            onClick={() => {
              if (userRole === 'family' || userRole === 'admin') {
                navigate('/profile');
              } else {
                navigate('/upgrade');
              }
            }}
            className="w-full bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#bfa032] text-white text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg hover:shadow-amber-500/20 transition-all active:scale-[0.98] flex items-center justify-center space-x-1 relative z-10 cursor-pointer border border-amber-400/30"
          >
            <Crown className="w-3 h-3 text-white mr-1" />
            <span className="tracking-wide">
              {userRole === 'free' && 'UPGRADE CORE'}
              {userRole === 'plus' && 'UPGRADE TO PRO'}
              {userRole === 'pro' && 'UPGRADE TO FAMILY'}
              {(userRole === 'family' || userRole === 'admin') && 'MANAGE CORE'}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};
