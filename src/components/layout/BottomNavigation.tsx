import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, MessageSquare, Target, User, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const BottomNavigation: React.FC = () => {
  const { profile } = useAuthStore();
  const simulatedRole = typeof window !== 'undefined' ? localStorage.getItem('sharify_simulated_role') : null;
  const activeRole = simulatedRole || profile?.role || 'free';

  const navItems = activeRole === 'advisor' 
    ? [
        { label: 'Advisor', path: '/advisor', icon: UserCheck },
        { label: 'Profil', path: '/profile', icon: User },
      ]
    : [
        { label: 'Home', path: '/dashboard', icon: Home },
        { label: 'Explore', path: '/explore', icon: Compass },
        { label: 'Consult', path: '/chat', icon: MessageSquare },
        { label: 'Goals', path: '/goals', icon: Target },
        { label: 'Profile', path: '/profile', icon: User },
      ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-6px_25px_rgba(0,0,0,0.06)] rounded-t-3xl pb-2 pt-0">
      <div className="max-w-md mx-auto px-2">
        
        {/* 5 Icons Navigation Row */}
        <div className="grid grid-cols-5 gap-1 items-stretch">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-between pt-0 pb-1 transition-all duration-200 relative ${
                  isActive
                    ? 'text-[#064E3B] dark:text-emerald-400 font-bold'
                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Top Active Indicator Bar (Flush with top border) */}
                  <div className={`w-full h-1 rounded-b-full mb-1.5 transition-all duration-300 ${
                    isActive ? 'bg-[#064E3B] dark:bg-emerald-400 scale-x-100' : 'bg-transparent scale-x-0'
                  }`} />
                  
                  {/* Icon */}
                  <item.icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                  />

                  {/* Label */}
                  <span className="text-[10px] font-semibold mt-0.5 tracking-tight">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom Home Bar Indicator */}
        <div className="w-28 h-1 bg-slate-300/80 dark:bg-slate-700/80 rounded-full mx-auto mt-1" />

      </div>
    </div>
  );
};
