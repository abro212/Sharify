import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  TrendingUp, MessageSquare, Calculator, RefreshCcw, ShieldAlert, FileText, ChevronRight, Sparkles, Activity, ArrowUpRight, ShieldCheck
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
    <DashboardContainer pageTitle="Overview">
      <div className="space-y-6">
        
        {/* Main Grid Layout for Desktop & Tablet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Main Content Column (8 cols on lg) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Greeting Banner */}
            <div className="bg-gradient-to-r from-[#064E3B] via-emerald-900 to-[#043E2F] text-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-emerald-950/10 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
                <svg className="w-64 h-64" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 0 C30 20 20 40 20 70 L80 70 C80 40 70 20 50 0 Z" />
                </svg>
              </div>

              <div className="relative z-10 space-y-2 max-w-lg">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
                  <span>Assalamu'alaikum, {userName}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                  Navigasikan Keuangan Syariah Keluarga Anda Bersama AI
                </h2>
                <p className="text-xs text-emerald-100/90 font-medium">
                  Monitor zakat, investasi halal, dan program Riba Detox Anda secara mudah dan terintegrasi.
                </p>
              </div>

              <div className="relative z-10 pt-4 flex items-center space-x-3">
                <button
                  onClick={() => navigate('/chat')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center space-x-1.5"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Konsultasi AI Syariah</span>
                </button>
                <button
                  onClick={() => navigate('/screener')}
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-4 py-2.5 rounded-xl backdrop-blur-xs transition-colors"
                >
                  Cek Saham Halal
                </button>
              </div>
            </div>

            {/* Quick Access Section */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Quick Access Toolbar</h2>
                  <p className="text-xs text-slate-500 font-medium">Akses cepat modul utama Sharify</p>
                </div>
                <Link to="/explore" className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center">
                  <span>Lihat Semua</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
                {quickAccessServices.map((service, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(service.path)}
                    className="bg-slate-50/80 dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-xs hover:shadow-md hover:border-emerald-500/40 hover:scale-[1.02] transition-all cursor-pointer flex flex-col items-center text-center group"
                  >
                    <div className={`p-3 rounded-2xl ${service.color} mb-2.5 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                      {service.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended For You Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="bg-emerald-950 text-white p-5 rounded-3xl border border-emerald-800/50 shadow-md relative overflow-hidden flex flex-col justify-between space-y-3">
                <div className="space-y-1 z-10">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">Halal Investment</span>
                  <h3 className="text-sm font-extrabold leading-tight">Opportunities & Screening</h3>
                  <p className="text-xs text-emerald-200/80 font-medium">Screen saham & reksa dana syariah bebas riba.</p>
                </div>
                <button
                  onClick={() => navigate('/screener')}
                  className="w-max bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition-all inline-flex items-center space-x-1"
                >
                  <span>Mulai Screening</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">Riba Detox Plan</span>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">Bebas Utang & Financial Peace</h3>
                  <p className="text-xs text-slate-500 font-medium">Susun strategi Avalanche/Snowball pelunasan.</p>
                </div>
                <button
                  onClick={() => navigate('/riba-detox')}
                  className="w-max bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-extrabold px-4 py-2 rounded-xl shadow-md transition-all inline-flex items-center space-x-1"
                >
                  <span>Buka Tracker</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>

          {/* Right Column (4 cols on lg): Widgets & Quick Gauges */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Financial Health Score Gauge Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">Financial Health Score</span>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-md">78 Good</span>
              </div>

              <div className="flex items-center space-x-4 py-2">
                {/* Circle Ring Gauge */}
                <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100 dark:text-slate-800"
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
                    <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">78</span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Score</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                    Kesehatan keuangan Anda tergolong baik & stabil.
                  </p>
                  <button
                    onClick={() => navigate('/health-check')}
                    className="w-full bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-bold py-2 rounded-xl shadow-xs transition-colors"
                  >
                    Detail Laporan
                  </button>
                </div>
              </div>
            </div>

            {/* Quick AI Prompt Launcher Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">AI Co-Pilot Syariah</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">Tanyakan seputar hukum fiqh muamalah, zakat, atau investasi:</p>
              
              <div className="space-y-2 pt-1">
                {[
                  'Bagaimana cara menghitung Zakat Maal emas?',
                  'Apakah investasi crypto sesuai syariah?',
                  'Langkah terbaik pelunasan utang pinjol Riba',
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => navigate('/chat')}
                    className="w-full text-left p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{q}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            {/* Sharia Principles Card */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/40 p-5 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 text-xs space-y-2">
              <div className="flex items-center space-x-2 text-emerald-800 dark:text-emerald-300 font-extrabold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Prinsip Fiqh Muamalah</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Semua perhitungan dan saran otomatis Sharify mengacu pada standar DSN-MUI dan fatwa lembaga Fiqh internasional.
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
