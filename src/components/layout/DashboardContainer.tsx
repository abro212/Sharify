import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, ShieldCheck } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { FloatingAIChat } from './FloatingAIChat';
import { useSettingsStore, bustCache } from '../../store/settingsStore';

interface DashboardContainerProps {
  children: React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const { settings } = useSettingsStore();
  const resolvedLogoUrl = settings?.logo_url ? bustCache(settings.logo_url) : '';
  const [logoError, setLogoError] = useState(false);

  React.useEffect(() => {
    setLogoError(false);
  }, [settings?.logo_url]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#111827] flex flex-col lg:flex-row relative transition-colors duration-300">
      {/* Ambient floating futuristic energy fields */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-amber-500/5 dark:bg-blue-500/10 blur-[100px] pointer-events-none z-0"></div>
      
      {/* Mobile Top Header (Sticky, only visible on lg:hidden) */}
      <header className="lg:hidden bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 px-4 h-16 flex items-center justify-between shadow-xs">
        <Link to="/dashboard" className="flex items-center">
          {resolvedLogoUrl && !logoError ? (
            <img
              src={resolvedLogoUrl}
              alt="Sharify Logo"
              className="h-8 object-contain"
              onError={() => setLogoError(true)}
            />
          ) : (
            <>
              <ShieldCheck className="w-7 h-7 text-[#10B981] mr-2" />
              <span className="text-base font-black tracking-widest text-slate-900 dark:text-white uppercase">Sharify</span>
            </>
          )}
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          title="Buka Menu"
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Semi-transparent dark overlay backdrop (only visible on mobile when open) */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9999] transition-opacity"
        ></div>
      )}

      {/* Sidebar (Responsive Overlay for Mobile, static for Desktop) */}
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        isCollapsed={isDesktopCollapsed}
        onToggleCollapse={() => setIsDesktopCollapsed(!isDesktopCollapsed)}
      />
      
      {/* Main Content Area - adds left margin on desktop to account for fixed sidebar */}
      <main className={`flex-1 transition-all duration-300 ease-in-out ${isDesktopCollapsed ? 'lg:ml-[88px]' : 'lg:ml-72'} pb-16 lg:pb-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-16 lg:py-6 animate-fade-in">
          {children}
        </div>
      </main>

      <FloatingAIChat />
    </div>
  );
};
