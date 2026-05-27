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
    <div className="min-h-screen bg-slate-50/50 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header (Sticky, only visible on lg:hidden) */}
      <header className="lg:hidden bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-30 px-4 h-16 flex items-center justify-between shadow-xs">
        <div className="flex items-center">
          <ShieldCheck className="w-7 h-7 text-emerald-950 mr-2" />
          <span className="text-lg font-bold text-slate-900 tracking-tight font-sans">Sharify</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          title="Buka Menu"
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
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
