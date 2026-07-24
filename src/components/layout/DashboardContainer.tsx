import React from 'react';
import { FloatingAIChat } from './FloatingAIChat';
import { BottomNavigation } from './BottomNavigation';

interface DashboardContainerProps {
  children: React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-slate-950 flex flex-col relative transition-colors duration-300">
      {/* Ambient background (light blue/white app background) */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#E0EBF5] to-transparent dark:from-slate-900 pointer-events-none z-0"></div>
      
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[600px] mx-auto relative z-10 pb-28 min-h-screen shadow-2xl shadow-slate-200/50 dark:shadow-none bg-[#F5F8FB] dark:bg-slate-950 border-x border-slate-200/50 dark:border-slate-800/50">
        <div className="animate-fade-in h-full">
          {children}
        </div>
      </main>

      <BottomNavigation />
      <FloatingAIChat />
    </div>
  );
};
