import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageSquare, Target, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navItems = [
    { label: 'Home', path: '/dashboard', icon: Home },
    { label: 'Explore', path: '/explore', icon: Compass },
    { label: 'Consult', path: '/chat', icon: MessageSquare },
    { label: 'Goals', path: '/goals', icon: Target },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-[100] px-3 w-full max-w-[460px]">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_12px_40px_rgba(0,0,0,0.12)] rounded-3xl pt-0 px-2 pb-2 overflow-hidden flex flex-col justify-between">
        
        {/* 5 Icons Navigation Row */}
        <div className="grid grid-cols-5 gap-1 items-stretch">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-between pt-0 pb-1.5 transition-all duration-200 relative ${
                  isActive
                    ? 'text-[#064E3B] dark:text-emerald-400 font-bold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Top Active Indicator Bar */}
                  <div className={`w-full h-1 rounded-full mb-2 transition-all duration-300 ${
                    isActive ? 'bg-[#064E3B] dark:bg-emerald-400 scale-x-100' : 'bg-transparent scale-x-0'
                  }`} />
                  
                  {/* Icon */}
                  <item.icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                  />

                  {/* Label */}
                  <span className="text-[10px] font-semibold mt-1 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom iPhone Home Indicator Pill */}
        <div className="w-32 h-1 bg-slate-200 dark:bg-slate-700/80 rounded-full mx-auto mt-1" />

      </div>
    </div>
  );
};
