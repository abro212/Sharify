import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { 
  Home, MessageSquare, Calculator, User, ShieldCheck, UserCheck, HeartPulse, 
  Crown, Target, RefreshCcw, Search, FileText, Users, Heart, Coins, X,
  ChevronLeft, ChevronRight, Moon, Sun, Search as SearchIcon, LogOut, ShieldAlert
} from 'lucide-react';

import { useAuthStore } from '../../store/authStore';
import { useSettingsStore, bustCache } from '../../store/settingsStore';
import { useThemeStore } from '../../store/useThemeStore';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { profile, user, signOut } = useAuthStore();
  const { settings } = useSettingsStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const resolvedLogoUrl = settings?.logo_url ? bustCache(settings.logo_url) : '';
  const [logoError, setLogoError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    setLogoError(false);
  }, [settings?.logo_url]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const activeRole = profile?.role || 'free';
  const isAdvisor = activeRole === 'advisor';
  const isAdmin = activeRole === 'admin';

  let menuItems = [
    { name: 'Home', path: '/dashboard', icon: Home, badge: null },
    { name: 'Daily Cashflow', path: '/cashflow', icon: Coins, badge: null },
    { name: 'Health Check', path: '/health-check', icon: HeartPulse, badge: null },
    { name: 'Goal Planning', path: '/goals', icon: Target, badge: null },
    { name: 'Zakat & Faraidh', path: '/zakat', icon: Calculator, badge: null },
    { name: 'Riba Detox', path: '/riba-detox', icon: RefreshCcw, badge: 'Plus', badgeColor: 'bg-emerald-500' },
    { name: 'Judol Detox', path: '/judol-detox', icon: ShieldAlert, badge: 'Safe', badgeColor: 'bg-rose-500' },
    { name: 'Asset Screener', path: '/screener', icon: Search, badge: 'Plus', badgeColor: 'bg-emerald-500' },
    { name: 'Qurban Saver', path: '/qurban-saver', icon: Heart, badge: 'Plus', badgeColor: 'bg-emerald-500' },
    { name: 'Smart Akad', path: '/akad-analyzer', icon: FileText, badge: 'Pro', badgeColor: 'bg-amber-500' },
    { name: 'Zakat Tax', path: '/zakat-tax-report', icon: FileText, badge: 'Pro', badgeColor: 'bg-amber-500' },
  ];

  let groupItems = [
    { name: 'Baitul Mal', path: '/family-dashboard', icon: Users, badge: 'Family', badgeColor: 'bg-blue-500' },
    { name: 'Digital Wasiat', path: '/wasiat-generator', icon: FileText, badge: 'Family', badgeColor: 'bg-blue-500' },
    { name: 'AI Assistant', path: '/chat', icon: MessageSquare, badge: null },
    { name: 'Profile', path: '/profile', icon: User, badge: null },
    { name: 'Upgrade', path: '/upgrade', icon: Crown, badge: null },
  ];

  if (isAdvisor) {
    menuItems = [
      { name: 'Portal Advisor', path: '/advisor', icon: UserCheck, badge: 'Utama', badgeColor: 'bg-emerald-600' },
    ];
    groupItems = [
      { name: 'Profile', path: '/profile', icon: User, badge: null },
    ];
  } else if (isAdmin) {
    groupItems.push({ name: 'Portal Advisor', path: '/advisor', icon: UserCheck, badge: 'Advisor', badgeColor: 'bg-emerald-600' });
    groupItems.push({ name: 'Admin Portal', path: '/admin', icon: ShieldCheck, badge: 'Admin', badgeColor: 'bg-red-500' });
  }

  const filteredMenu = menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredGroup = groupItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Render logic for nav items
  const renderNavItems = (items: typeof menuItems) => (
    <div className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.name}
          to={item.path}
          onClick={onClose}
          title={isCollapsed ? item.name : undefined}
          className={({ isActive }) =>
            `group flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-3'} py-2.5 rounded-xl transition-all duration-200 relative ${
              isActive
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-700 dark:hover:text-slate-300'
            }`
          }
        >
          {({ isActive }) => (
            <>
              {/* Active Indicator Line */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-red-500 rounded-r-full" />
              )}
              
              <item.icon
                className={`flex-shrink-0 ${isCollapsed ? 'w-6 h-6' : 'w-5 h-5 mr-3'} transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-400'
                }`}
              />
              
              {!isCollapsed && (
                <>
                  <span className="flex-1 truncate tracking-wide text-sm">{item.name}</span>
                  {item.badge && (
                    <span className={`ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold text-white shadow-sm ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </>
          )}
        </NavLink>
      ))}
    </div>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-[10000] flex flex-col bg-white dark:bg-[#1C1C1E] transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-800 shadow-lg ${
      isOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
    } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
      
      {/* Collapse Toggle Button (Desktop Only) */}
      <button
        onClick={onToggleCollapse}
        className="hidden lg:flex absolute -right-3 top-8 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full items-center justify-center shadow-md transition-colors z-50"
      >
        {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header section */}
      <div className={`p-4 flex flex-col ${isCollapsed ? 'items-center' : ''}`}>
        <div className={`flex items-center justify-between mb-6`}>
          <div className="flex items-center">
            {/* Mac OS Window Controls */}
            <div className={`flex items-center space-x-1.5 ${isCollapsed ? 'mb-4' : 'mr-3'}`}>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            
            {!isCollapsed && (
              <Link to="/dashboard" onClick={onClose} className="flex items-center">
                {resolvedLogoUrl && !logoError ? (
                  <img
                    src={resolvedLogoUrl}
                    alt="Sharify Logo"
                    className="h-8 w-auto object-contain max-w-[180px]"
                    onError={() => setLogoError(true)}
                  />
                ) : (
                  <img src="/app logo.png" alt="Sharify Logo" className="h-8 w-auto object-contain max-w-[180px]" />
                )}
              </Link>
            )}
          </div>
          
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="relative mb-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            />
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 scrollbar-hide pb-4">
        {filteredMenu.length > 0 && (
          <div className="mb-6">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Menu</p>}
            {renderNavItems(filteredMenu)}
          </div>
        )}
        
        {filteredGroup.length > 0 && (
          <div className="mb-2">
            {!isCollapsed && <p className="px-3 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Group</p>}
            {renderNavItems(filteredGroup)}
          </div>
        )}
      </div>

      {/* Footer Section */}
      <div className="p-3 mt-auto">
        {/* Theme Toggle */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between bg-slate-100 dark:bg-slate-800 p-1 rounded-xl'} mb-4`}>
          {isCollapsed ? (
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          ) : (
            <>
              <button
                onClick={() => theme !== 'light' && toggleTheme()}
                className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  theme === 'light' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button
                onClick={() => theme !== 'dark' && toggleTheme()}
                className={`flex-1 flex items-center justify-center space-x-2 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-slate-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          <div className="flex items-center min-w-0">
            <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-700 flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="User avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              )}
            </div>
            {!isCollapsed && (
              <div className="ml-3 truncate">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{profile?.full_name || 'Guest User'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || 'No email'}</p>
              </div>
            )}
          </div>
          {!isCollapsed && (
            <button 
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1.5 ml-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
