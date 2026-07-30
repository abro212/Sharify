import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { BottomNavigation } from './BottomNavigation';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/useThemeStore';
import { useNotificationStore } from '../../store/notificationStore';
import { NotificationModal } from '../notifications/NotificationModal';
import { Bell, Sun, Moon, Search, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface DashboardContainerProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ children, pageTitle }) => {
  const { profile, user } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { unreadCount, fetchNotifications, subscribeToRealtime, unsubscribeFromRealtime } = useNotificationStore();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const userName = profile?.full_name || user?.email?.split('@')[0] || 'Ahmad';
  const role = profile?.role || 'free';

  useEffect(() => {
    fetchNotifications(user?.id);
    subscribeToRealtime(user?.id);
    return () => {
      unsubscribeFromRealtime();
    };
  }, [user?.id, fetchNotifications, subscribeToRealtime, unsubscribeFromRealtime]);

  const getPageTitle = () => {
    if (pageTitle) return pageTitle;
    const path = location.pathname;
    if (path === '/dashboard') return 'Overview';
    if (path === '/explore') return 'Explore Services';
    if (path === '/screener') return 'Investasi Halal';
    if (path === '/zakat') return 'Zakat & Faraidh';
    if (path === '/riba-detox') return 'Riba Detox';
    if (path === '/goals') return 'Goal Planning';
    if (path === '/health-check') return 'Financial Health Check';
    if (path === '/chat') return 'AI Chatbot Syariah';
    if (path === '/cashflow') return 'Daily Cashflow';
    if (path === '/profile') return 'Profil Saya';
    return 'Sharify';
  };

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex transition-colors duration-300 relative">
      
      {/* Desktop & Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)} 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-[9995] lg:hidden animate-fade-in cursor-pointer"
        />
      )}
      <Sidebar 
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Outer Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        
        {/* Top Header Navigation Bar */}
        <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/70 dark:border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
          
          {/* Left: Mobile Drawer Button + Page Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium hidden sm:flex">
                <span>Sharify</span>
                <span>/</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{getPageTitle()}</span>
              </div>
              <h1 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight leading-none mt-0.5">
                {getPageTitle()}
              </h1>
            </div>
          </div>

          {/* Right: Search, Theme Toggle, Notification & Profile */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Quick Search Input */}
            <div className="relative hidden md:block w-56 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari fitur, saham syariah..."
                onClick={() => navigate('/explore')}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/60 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all cursor-pointer"
              />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationOpen(true)}
              className="relative p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Notifikasi"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              ) : (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              )}
            </button>

            {/* User Profile Pill */}
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center space-x-2.5 p-1.5 pl-3 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 cursor-pointer hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900 dark:text-white leading-none">{userName}</p>
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  {role} Plan
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#064E3B] text-amber-300 font-extrabold text-xs flex items-center justify-center shadow-xs overflow-hidden">
                {user?.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{userName[0]?.toUpperCase()}</span>
                )}
              </div>
            </div>

          </div>
        </header>

        {/* Main Content View */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-28 lg:pb-12">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Bottom Nav for Mobile Screens */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      {/* Interactive System Notification Modal */}
      <NotificationModal 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </div>
  );
};
