import React, { useState, useEffect, useMemo } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type Debt = {
  id: string;
  debt_name: string;
  debt_type: string;
  current_balance: number;
  interest_rate: number;
  minimum_payment: number;
};

export const RibaDetox: React.FC = () => {
  const { session } = useAuthStore();
  const [debts, setDebts] = useState<Debt[]>([]);

  useEffect(() => {
    const fetchDebts = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from('riba_detox_debts')
        .select('*')
        .eq('user_id', session.user.id);
      if (data) setDebts(data);
    };
    fetchDebts();
  }, [session?.user?.id]);

  const totalDebt = useMemo(() => debts.reduce((sum, d) => sum + Number(d.current_balance), 0), [debts]);

  const islamicQuotes = [
    "Barangsiapa yang rohnya terpisah dari jasadnya dan ia terbebas dari tiga hal: sombong, ghulul (khianat), dan hutang, maka ia masuk surga. (HR. Ibnu Majah)",
  ];

  return (
    <DashboardContainer>
      <div className="p-5 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Riba Detox</h1>
            <p className="text-xs text-slate-500 font-medium">Identify & cleanse non-halal elements</p>
          </div>
        </div>

        {/* Deep Emerald Header Card matching Screen 8 */}
        <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
          <div className="relative z-10 max-w-[70%] space-y-1">
            <h2 className="text-base font-extrabold text-white leading-tight">
              Cleanse Your Wealth from Riba
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              Identify and eliminate riba from your income
            </p>
          </div>
          
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300 font-black text-xl">
            %
          </div>
        </div>

        {/* Analysis Summary Card */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700/50">
            <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Analysis Summary</span>
            <span className="text-[10px] font-extrabold text-amber-700 bg-amber-100 dark:bg-amber-950 dark:text-amber-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Action Required
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-medium block">Total Riba Paparan</span>
              <span className="text-sm font-black text-rose-600 dark:text-rose-400 font-mono mt-0.5 block">
                Rp {Math.round(totalDebt).toLocaleString('id-ID')}
              </span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
              <span className="text-[10px] text-slate-400 font-medium block">Purification Needed</span>
              <span className="text-sm font-black text-[#064E3B] dark:text-emerald-400 font-mono mt-0.5 block">
                Rp {(totalDebt * 0.05).toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Steps to Detox */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Steps to Detox</h3>

          <div className="space-y-3">
            {[
              { step: '1', title: 'Identify riba sources', desc: 'List all riba-based income and debts' },
              { step: '2', title: 'Stop acquiring riba', desc: 'Commit to halal income and sharia contracts only' },
              { step: '3', title: 'Purify existing riba', desc: 'Donate non-halal proceeds to public social causes' },
            ].map((item) => (
              <div key={item.step} className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                <div className="h-6 w-6 rounded-full bg-[#064E3B] text-amber-300 font-black text-xs flex items-center justify-center shrink-0">
                  {item.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('Detox roadmap initiated! Tetap berjuang secara istiqomah.')}
            className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md shadow-amber-500/20 transition-all uppercase tracking-wider"
          >
            Start Detox Process
          </button>
        </div>

        {/* Motivational Quote */}
        <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/30 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
          <p className="text-[11px] text-slate-600 dark:text-slate-300 italic font-medium leading-relaxed">
            "{islamicQuotes[0]}"
          </p>
        </div>

      </div>
    </DashboardContainer>
  );
};
