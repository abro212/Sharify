import React from 'react';
import { FloatingAIChat } from './FloatingAIChat';
import { BottomNavigation } from './BottomNavigation';

interface DashboardContainerProps {
  children: React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-slate-950 flex flex-col justify-start items-center relative transition-colors duration-300">
      {/* Ambient background */}
      <div className="fixed inset-0 bg-gradient-to-b from-emerald-900/5 via-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pointer-events-none z-0"></div>
      
      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto relative z-10 pb-28 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="animate-fade-in h-full">
          {children}
        </div>
      </main>

      <BottomNavigation />
      <FloatingAIChat />
    </div>
  );
};
