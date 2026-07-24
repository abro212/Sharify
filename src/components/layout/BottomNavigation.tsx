import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Calendar, User } from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navItems = [
    { path: '/dashboard', icon: Home },
    { path: '/chat', icon: MessageSquare },
    { path: '/goals', icon: Calendar },
    { path: '/profile', icon: User },
  ];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 w-full max-w-[360px]">
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/40 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-full px-6 py-3 flex items-center justify-between">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center justify-center w-[50px] h-[50px] rounded-full transition-all duration-300 ${
                isActive
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40'
                  : 'text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800'
              }`
            }
          >
            {({ isActive }) => (
              <item.icon
                strokeWidth={isActive ? 2.5 : 2}
                className={`w-6 h-6 transition-transform duration-300 ${
                  isActive ? 'scale-105' : 'scale-100'
                }`}
              />
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
