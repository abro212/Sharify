import React, { useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { BottomNavigationBar } from './BottomNavigationBar';
import { FloatingAIChat } from './FloatingAIChat';

interface DashboardContainerProps {
  children: React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cyber-grid flex flex-col lg:flex-row relative">
      {/* Ambient floating futuristic energy fields */}
      <div className="absolute top-[20%] left-[20%] w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] rounded-full bg-amber-500/5 blur-[100px] pointer-events-none z-0"></div>
      
      {/* Mobile Top Header (Sticky, only visible on lg:hidden) */}
      <header className="lg:hidden bg-[#020907]/80 backdrop-blur-md border-b border-[#10B981]/20 sticky top-0 z-30 px-4 h-16 flex items-center justify-between shadow-xs relative z-30">
        <div className="flex items-center">
          <ShieldCheck className="w-7 h-7 text-[#34D399] drop-shadow-[0_0_6px_rgba(52,211,153,0.3)] mr-2" />
          <span className="text-base font-black tracking-widest bg-gradient-to-r from-emerald-400 to-amber-300 bg-clip-text text-transparent font-sans uppercase">Sharify</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          title="Buka Menu"
          className="p-2 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-colors"
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
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Main Content Area - adds left margin on desktop to account for fixed sidebar */}
      <main className="flex-1 lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-16 lg:py-6 animate-fade-in">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigationBar />

      {/* Touch-Draggable Floating AI Co-Pilot */}
      <FloatingAIChat />
    </div>
  );
};
