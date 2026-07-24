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
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] px-3 w-full max-w-[440px]">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_8px_32px_rgba(6,78,59,0.12)] rounded-2xl px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-[#064E3B] dark:text-emerald-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-emerald-100/80 dark:bg-emerald-950/60 text-[#064E3B] dark:text-emerald-400' : ''}`}>
                  <item.icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className="w-5 h-5"
                  />
                </div>
                <span className="text-[10px] font-semibold mt-0.5 tracking-tight">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
