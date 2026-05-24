import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, MessageSquare, Calculator, User, ShieldCheck, HeartPulse, 
  Crown, Target, RefreshCcw, Search, FileText, Users, Sparkles, Star, Heart, Coins, X 
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

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

  return (
    <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-300 transform lg:translate-x-0 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      <div className="flex items-center justify-between lg:justify-center h-16 border-b border-gray-200 px-4">
        <div className="flex items-center">
          <ShieldCheck className="w-8 h-8 text-primary" />
          <span className="ml-2 text-xl font-bold text-gray-900">Sharify</span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-primary-light/10 text-primary-dark'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-primary-dark' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1 truncate">{item.name}</span>
                  {item.tier && (
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wide shadow-sm border ${
                      item.tier === 'plus' 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                        : item.tier === 'pro' 
                        ? 'bg-amber-50 text-amber-800 border-amber-200 animate-pulse' 
                        : 'bg-indigo-50 text-indigo-800 border-indigo-100'
                    }`}>
                      {item.tier === 'plus' ? (
                        <Sparkles className="w-2.5 h-2.5 mr-0.5" />
                      ) : item.tier === 'pro' ? (
                        <Crown className="w-2.5 h-2.5 mr-0.5" />
                      ) : (
                        <Star className="w-2.5 h-2.5 mr-0.5" />
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

      <div className="p-4 border-t border-gray-200">
        <div className="bg-primary/10 rounded-lg p-4">
          <p className="text-sm font-medium text-primary-dark mb-1 capitalize">
            {profile?.role || 'Free'} Plan
          </p>
          <button 
            onClick={() => {
              if (userRole === 'family' || userRole === 'admin') {
                navigate('/profile');
              } else {
                navigate('/upgrade');
              }
            }}
            className="w-full bg-accent hover:bg-accent-dark text-white text-sm font-medium py-2 px-4 rounded-md transition-colors"
          >
            {userRole === 'free' && 'Upgrade Plan'}
            {userRole === 'plus' && 'Upgrade to Pro'}
            {userRole === 'pro' && 'Upgrade to Family'}
            {(userRole === 'family' || userRole === 'admin') && 'Manage Plan'}
          </button>
        </div>
      </div>
    </aside>
  );
};
