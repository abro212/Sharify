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
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header (Sticky, only visible on lg:hidden) */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30 px-4 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center">
          <ShieldCheck className="w-7 h-7 text-primary mr-2" />
          <span className="text-lg font-bold text-gray-900 tracking-tight">Sharify</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          title="Buka Menu"
          className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Semi-transparent dark overlay backdrop (only visible on mobile when open) */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-gray-900/50 backdrop-blur-xs z-[9999] transition-opacity"
        ></div>
      )}

      {/* Sidebar (Responsive Overlay for Mobile, static for Desktop) */}
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      
      {/* Main Content Area - adds left margin on desktop to account for fixed sidebar */}
      <main className="flex-1 lg:ml-64 pb-16 lg:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 lg:py-8">
          {children}
        </div>
      </main>

      {/* Persistent Sharia AI Chat Co-Pilot */}
      <FloatingAIChat />

      {/* Mobile Bottom Navigation */}
      <BottomNavigationBar />
    </div>
  );
};
