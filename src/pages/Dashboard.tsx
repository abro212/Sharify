import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Bell, TrendingUp, MessageSquare, Calculator, RefreshCcw, ShieldAlert, FileText, ChevronRight, Sparkles, Activity
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Dashboard: React.FC = () => {
  const { profile, user } = useAuthStore();
  const navigate = useNavigate();

  const userName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'Ahmad';

  const quickAccessServices = [
    { name: 'Investasi Halal', icon: TrendingUp, path: '/screener', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' },
    { name: 'AI Chatbot Syariah', icon: MessageSquare, path: '/chat', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' },
    { name: 'Zakat Calculator', icon: Calculator, path: '/zakat', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' },
    { name: 'Riba Detox', icon: RefreshCcw, path: '/riba-detox', color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50' },
    { name: 'Judol Detox', icon: ShieldAlert, path: '/riba-detox', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50' },
    { name: 'Faraidh Calculator', icon: FileText, path: '/wasiat-generator', color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' },
  ];

  return (
    <DashboardContainer>
      <div className="p-5 space-y-6">
        
        {/* Header Greeting */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-xs text-slate-500 font-medium">Assalamu'alaikum,</p>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
              {userName}
              <Sparkles className="w-4 h-4 ml-1.5 text-amber-500" />
            </h1>
          </div>
          <button 
            onClick={() => navigate('/profile')}
            className="relative p-2.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-slate-800"></span>
          </button>
        </div>

        {/* Financial Health Score Card (Gauge widget matching Screen 3) */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Financial Health Score</span>
            <button onClick={() => navigate('/health-check')} className="text-slate-400 hover:text-slate-600">
              <Activity className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            {/* Score Ring Gauge */}
            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
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
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-white leading-none">78</span>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Good</span>
              </div>
            </div>

            {/* Score Meta */}
            <div className="ml-4 flex-1">
              <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-snug">
                Keep going! You're on the right path.
              </p>
              <button
                onClick={() => navigate('/health-check')}
                className="mt-3 inline-flex items-center px-4 py-2 bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <span>See Details</span>
                <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Access Section */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Quick Access</h2>
            <Link to="/explore" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3.5">
            {quickAccessServices.map((service, idx) => (
              <div
                key={idx}
                onClick={() => navigate(service.path)}
                className="bg-white dark:bg-slate-800/90 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center text-center"
              >
                <div className={`p-3 rounded-2xl ${service.color} mb-2.5`}>
                  <service.icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 leading-tight">
                  {service.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended For You Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 px-1">Recommended for You</h2>
          
          <div className="bg-[#064E3B] text-white p-5 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
            <div className="relative z-10 max-w-[65%] space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300">Syariah Investment Guide</span>
              <h3 className="text-sm font-extrabold leading-tight">
                Learn about halal investment basics
              </h3>
              <button
                onClick={() => navigate('/screener')}
                className="mt-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md transition-all inline-flex items-center"
              >
                Explore Now
              </button>
            </div>
            
            <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
              <TrendingUp className="w-8 h-8" />
            </div>
          </div>
        </div>

      </div>
    </DashboardContainer>
  );
};
