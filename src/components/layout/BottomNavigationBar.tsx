import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, MessageSquare, Calculator, User } from 'lucide-react';

export const BottomNavigationBar: React.FC = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  // ── Virtual Keyboard Detection ─────────────────────────────────
  // Hides the bottom navigation bar when the virtual keyboard is open on mobile
  // to prevent it from overlapping focused text inputs and shrinking the workspace.
  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        // If visual viewport height is less than 75% of window height, keyboard is open
        setIsKeyboardOpen(window.visualViewport.height < window.innerHeight * 0.75);
      }
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
    }
    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  if (isKeyboardOpen) return null;

  const navItems = [
    { name: 'Beranda', path: '/dashboard', icon: Home },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Kalkulator', path: '/zakat', icon: Calculator },
    { name: 'Profil', path: '/profile', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 w-full bg-white/95 backdrop-blur-xl border-t border-slate-100/80 pb-safe z-50 shadow-[0_-8px_32px_rgba(0,0,0,0.04)] rounded-t-[1.5rem] transition-all duration-300">
      <div className="flex justify-around items-center h-[68px] px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full relative transition-all duration-200 ${
                isActive 
                  ? 'text-[#10B981] font-black scale-105' 
                  : 'text-slate-400 hover:text-slate-700 active:scale-95'
              }`
            }
          >
            {({ isActive }) => (
              <div className="flex flex-col items-center justify-center pb-1.5 pt-1 w-full h-full">
                <item.icon 
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'text-[#10B981] stroke-[2.5px] scale-110' : 'text-slate-400'
                  }`} 
                />
                <span className="text-[9px] font-bold mt-1 tracking-tight">{item.name}</span>
                
                {/* Active Indicator Dot under the tab */}
                {isActive && (
                  <span className="absolute bottom-2.5 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-sm shadow-emerald-500/50 animate-pulse" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};
