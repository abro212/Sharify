import React, { useEffect } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Target } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

export const Goals: React.FC = () => {
  const { session } = useAuthStore();

  useEffect(() => {
    if (session?.user?.id) {
      supabase.from('financial_goals').select('*').eq('user_id', session.user.id);
    }
  }, [session?.user?.id]);

  return (
    <DashboardContainer>
      <div className="p-5 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Goal-Based Planning</h1>
            <p className="text-xs text-slate-500 font-medium">Plan your financial goals with barakah</p>
          </div>
        </div>

        {/* Deep Emerald Header Card matching Screen 11 */}
        <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
          <div className="relative z-10 max-w-[70%] space-y-1">
            <h2 className="text-base font-extrabold text-white leading-tight">
              Plan Your Goals with Barakah
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              Set, track & achieve your financial goals
            </p>
          </div>
          
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
            <Target className="w-7 h-7" />
          </div>
        </div>

        {/* Your Goals List Card */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Your Goals</h2>
            <button 
              onClick={() => alert('Form penambahan target dibuka!')}
              className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              + Add New Goal
            </button>
          </div>

          <div className="space-y-3.5">
            {[
              { title: 'Umrah 2025', saved: '25.000.000', target: '35.000.000', percent: 71, color: 'border-emerald-500' },
              { title: 'Buy House', saved: '175.000.000', target: '500.000.000', percent: 35, color: 'border-amber-500' },
              { title: 'Retirement', saved: '200.000.000', target: '1.000.000.000', percent: 20, color: 'border-rose-500' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-xl bg-emerald-500/10 text-[#064E3B] dark:text-emerald-400 flex items-center justify-center font-black text-xs">
                      {item.percent}%
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h3>
                      <p className="text-[10px] text-slate-400 font-mono">
                        Rp {item.saved} / Rp {item.target}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-[#064E3B] dark:text-emerald-400">{item.percent}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#064E3B] dark:bg-emerald-500 h-full transition-all duration-500" 
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Goal Button */}
        <button
          onClick={() => alert('Tambahkan target finansial baru.')}
          className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md shadow-amber-500/20 transition-all uppercase tracking-wider flex items-center justify-center space-x-1.5"
        >
          <Target className="w-4 h-4" />
          <span>+ Add New Goal</span>
        </button>

      </div>
    </DashboardContainer>
  );
};
