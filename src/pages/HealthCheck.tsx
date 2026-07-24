import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { ChevronRight } from 'lucide-react';

export const HealthCheck: React.FC = () => {
  const navigate = useNavigate();

  const scoreBreakdown = [
    { label: 'Halal Income', score: 80, color: 'bg-emerald-500' },
    { label: 'Debt Management', score: 70, color: 'bg-amber-500' },
    { label: 'Savings & Investment', score: 75, color: 'bg-emerald-500' },
    { label: 'Zakat & Charity', score: 90, color: 'bg-emerald-500' },
    { label: 'Financial Planning', score: 65, color: 'bg-amber-500' },
  ];

  return (
    <DashboardContainer>
      <div className="p-5 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Health Score</h1>
            <p className="text-xs text-slate-500 font-medium">Evaluate your financial standing based on Islam</p>
          </div>
        </div>

        {/* Score Ring / Gauge Card matching Screen 13 */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 text-center flex flex-col items-center justify-center space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Your Score</span>
          
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-emerald-500"
                strokeDasharray="78, 100"
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">78 <span className="text-sm font-bold text-slate-400">/ 100</span></span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">Good</span>
            </div>
          </div>

          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Keep improving!
          </p>
        </div>

        {/* Score Breakdown List */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-4">
          <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Score Breakdown</h2>

          <div className="space-y-3.5">
            {scoreBreakdown.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                  <span className="text-slate-900 dark:text-white font-mono">{item.score}/100</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${item.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/chat')}
            className="w-full mt-3 bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs py-3 px-4 rounded-2xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center space-x-1"
          >
            <span>Tips to Improve</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </DashboardContainer>
  );
};
