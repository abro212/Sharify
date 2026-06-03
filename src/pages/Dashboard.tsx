import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Wallet, TrendingUp, AlertTriangle, ShieldCheck, Calculator, ArrowRight, History, RefreshCcw, Search, FileText, Users, Cpu, CircleDot } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { profile, session } = useAuthStore();
  const [financialProfile, setFinancialProfile] = useState<any>(null);
  const [zakatHistory, setZakatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return;
      
      // Fetch Health Check Profile
      const { data: profileData } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (profileData) {
        setFinancialProfile(profileData);
      }

      // Fetch Zakat History
      const { data: zakatData } = await supabase
        .from('zakat_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (zakatData) {
        setZakatHistory(zakatData);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [session?.user?.id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400 border-emerald-500/40 shadow-neon-emerald';
    if (score >= 50) return 'text-amber-400 border-amber-500/40 shadow-neon-gold';
    return 'text-rose-400 border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.35)]';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { title: 'Era Riba-Free! 😎', desc: 'Skor kepatuhan Syariah Anda literally mantap banget. Aset dan cicilan Anda bersih total dari unsur riba. Slay, no cap! 🍃' };
    if (score >= 50) return { title: 'Butuh Perhatian', desc: 'Terdeteksi paparan riba konvensional minor. Mari perlahan bertransisi ke alternatif Syariah agar hati semakin tenang.' };
    return { title: 'Paparan Riba Kritis! 🚨', desc: 'Wah, terdeteksi paparan riba konvensional yang tinggi nih. Kami sangat menyarankan segera ambil program Riba Detox sekarang juga.' };
  };

  return (
    <DashboardContainer>
      {/* High-Tech System Control Console (Greeting Banner - Light Glass background with Bold Dark Text) */}
      <div className="glass-hud-emerald rounded-2xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden mb-8 hologram-scanner shadow-xs">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-emerald-500/5 to-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#E6F4ED] text-[#064E3B] text-[10px] font-mono font-semibold border border-emerald-500/30 uppercase tracking-wider">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 mr-1.5 animate-ping"></span>
                SYSTEM_STATUS: NOMINAL
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#E6F4ED] text-amber-800 text-[10px] font-mono font-semibold border border-amber-500/20 uppercase tracking-wider">
                SHARIA_BOARD: ONLINE
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-[#E6F4ED] text-emerald-800 text-[10px] font-mono font-semibold border border-emerald-500/20 uppercase tracking-wider hidden sm:inline-flex">
                NODE: JAKARTA_WEST
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
              Assalamu alaikum, <span className="shimmer-gold-text font-black">{profile?.full_name?.split(' ')[0] || 'Sobat'}</span>! 🌟
            </h1>
            <p className="text-slate-500 mt-2 font-medium max-w-xl text-sm leading-relaxed">
              Selamat datang kembali di pusat kendali keuangan Anda! Mari senantiasa disiplin menjaga kesucian harta dengan prinsip Syariah & Fiqh Muamalah modern agar senantiasa berkah dan berkembang.
            </p>
          </div>
          
          <div className="shrink-0 lg:text-right font-mono bg-white p-4 rounded-xl border border-emerald-500/20 glass-hud-dark min-w-[200px] shadow-sm">
            <div className="flex justify-between lg:justify-end items-center gap-2 mb-1">
              <span className="text-[9px] text-amber-800 font-mono tracking-widest uppercase">CORE METRIC SYSTEM</span>
              <Cpu className="h-3 w-3 text-amber-600 animate-pulse" />
            </div>
            <span className="text-sm font-black text-slate-950 tracking-tight block">ACTIVE & MONITORING</span>
            <div className="flex justify-between lg:justify-end items-center gap-1.5 mt-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <p className="text-[8px] text-[#047857] italic font-mono uppercase">SUPABASE DATABASE SYNCED</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cyber Metrics Energy Cells (Light Panels - High Contrast Text) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Cell 1: Asset Core */}
        <div className="glass-hud-emerald p-5 rounded-2xl border border-emerald-500/20 transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-emerald-400/50 flex items-center group relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="h-11 w-11 bg-emerald-500/10 text-[#064E3B] rounded-xl flex items-center justify-center border border-emerald-500/25 group-hover:bg-[#064E3B] group-hover:text-white group-hover:shadow-neon-emerald transition-all duration-300 mr-4 shrink-0">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 relative z-10">
            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-[#047857] block mb-0.5">TOTAL_ACTIVE_ASSETS</span>
            <p className="text-xl sm:text-2xl font-black text-slate-950 truncate font-sans">
              Rp {financialProfile?.assets ? financialProfile.assets.toLocaleString('id-ID') : '0'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
              <span className="text-[8px] font-mono text-emerald-800/60">LIQUIDITY LEVEL: MAX</span>
            </div>
          </div>
        </div>

        {/* Cell 2: Income Matrix */}
        <div className="glass-hud-emerald p-5 rounded-2xl border border-emerald-500/20 transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-amber-400/50 flex items-center group relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className="h-11 w-11 bg-amber-500/10 text-amber-800 rounded-xl flex items-center justify-center border border-amber-500/20 group-hover:bg-amber-655 group-hover:bg-amber-600 group-hover:text-white group-hover:shadow-neon-gold transition-all duration-300 mr-4 shrink-0">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 relative z-10">
            <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-amber-800 block mb-0.5">MONTHLY_INFLOW_RATE</span>
            <p className="text-xl sm:text-2xl font-black text-slate-950 truncate font-sans">
              Rp {financialProfile?.monthly_income ? financialProfile.monthly_income.toLocaleString('id-ID') : '0'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-600"></span>
              <span className="text-[8px] font-mono text-amber-800/60">FLOW STATE: STABLE</span>
            </div>
          </div>
        </div>

        {/* Cell 3: Riba/Conventional Debts Exposure */}
        <div className="glass-hud-emerald p-5 rounded-2xl border border-emerald-500/20 transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-rose-400/50 flex items-center group relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-xl pointer-events-none"></div>
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center border mr-4 shrink-0 transition-all duration-300 ${
            financialProfile?.conventional_debts > 0 
              ? 'bg-rose-500/10 text-rose-800 border-rose-500/35 group-hover:bg-rose-700 group-hover:text-white group-hover:shadow-[0_0_15px_rgba(244,63,94,0.6)]' 
              : 'bg-emerald-500/10 text-[#064E3B] border-emerald-500/20 group-hover:bg-[#064E3B] group-hover:text-white'
          }`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 relative z-10">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[9px] uppercase tracking-widest font-mono font-bold text-rose-800 block">RIBA_DEBT_EXPOSURE</span>
              {financialProfile?.conventional_debts > 0 && (
                <span className="text-[7px] font-mono font-black uppercase bg-rose-100 text-rose-800 border border-rose-400/40 px-1.5 py-0.5 rounded leading-none animate-pulse">EXPOSED</span>
              )}
            </div>
            <p className={`text-xl sm:text-2xl font-black truncate font-sans ${financialProfile?.conventional_debts > 0 ? 'text-rose-800 font-bold' : 'text-slate-950'}`}>
              Rp {financialProfile?.conventional_debts ? financialProfile.conventional_debts.toLocaleString('id-ID') : '0'}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <span className={`h-1.5 w-1.5 rounded-full ${financialProfile?.conventional_debts > 0 ? 'bg-rose-600' : 'bg-emerald-600'}`}></span>
              <span className={`text-[8px] font-mono ${financialProfile?.conventional_debts > 0 ? 'text-rose-800/60' : 'text-emerald-800/60'}`}>
                {financialProfile?.conventional_debts > 0 ? 'CRITICAL ACTION REQUIRED' : 'EXPOSURE STATE: CLEAN'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Sharia Compliance Compass HUD */}
        <div className="glass-hud-emerald p-5 sm:p-6 rounded-2xl border border-emerald-500/20 h-full flex flex-col relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-5 border-b border-emerald-500/20 pb-3">
            <h2 className="text-xs font-mono font-black text-[#064E3B] uppercase tracking-widest flex items-center">
              <ShieldCheck className="h-4.5 w-4.5 mr-2 text-emerald-600" />
              SHARIA_DIAGNOSTIC_COMPASS
            </h2>
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-ping"></div>
          </div>

          {loading ? (
            <div className="animate-pulse flex items-center space-x-6 flex-1 justify-center py-8">
              <div className="w-24 h-24 bg-emerald-100 rounded-full border border-emerald-300"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-emerald-100 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-emerald-50 rounded"></div>
                  <div className="h-3 bg-emerald-50 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : financialProfile ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left flex-1 py-4 gap-6">
              {/* Astronomical Concentric Compass Rings */}
              <div className="relative w-36 h-36 flex-shrink-0 flex items-center justify-center">
                {/* Outer Rotating Dotted Ring */}
                <div className="absolute w-32 h-32 rounded-full border border-dashed border-emerald-500/40 animate-orbit-slow"></div>
                {/* Middle Rotating Star-Ring */}
                <div className="absolute w-28 h-28 rounded-full border border-dotted border-amber-500/50 animate-orbit-medium" style={{ animationDirection: 'reverse' }}></div>
                {/* Inner Rotating Tech Ring */}
                <div className="absolute w-24 h-24 rounded-full border border-emerald-400/30 animate-orbit-fast"></div>
                
                {/* Core Sphere (Dark background - Light Text conforms to standard) */}
                <div className={`w-20 h-20 rounded-full border flex flex-col items-center justify-center bg-emerald-950/90 z-10 ${getScoreColor(financialProfile.health_score)}`}>
                  <span className="text-2xl font-black tracking-tight text-white">{financialProfile.health_score}</span>
                  <span className="text-[7px] font-mono font-bold text-emerald-300 uppercase tracking-widest leading-none mt-0.5">COMPLIANCE</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[9px] font-mono font-black tracking-widest text-amber-700 uppercase">SHARIA COMPLIANCE RADAR</span>
                <h3 className="font-extrabold text-slate-950 text-base mt-1 font-bold">{getScoreMessage(financialProfile.health_score).title}</h3>
                <p className="text-[#047857] text-[11px] mt-1.5 leading-relaxed font-sans font-medium">{getScoreMessage(financialProfile.health_score).desc}</p>
                <Link to="/health-check" className="inline-flex items-center mt-3 text-xs text-emerald-700 font-bold hover:text-[#064E3B] transition-colors font-sans">
                  Ulangi Diagnosis <ArrowRight className="ml-1 h-3.5 w-3.5 animate-pulse" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 flex-1 flex flex-col justify-center items-center">
              <ShieldCheck className="h-11 w-11 text-emerald-500/30 mb-3" />
              <h3 className="text-xs font-mono font-black text-emerald-800 uppercase tracking-wider mb-1">NO_DIAGNOSTIC_HISTORY_FOUND</h3>
              <p className="text-xs text-emerald-700/60 mb-4 max-w-xs leading-normal">
                Mari periksa portofolio aset Anda untuk memastikannya bebas dari unsur riba demi mencapai tujuan finansial yang berkah.
              </p>
              <Link 
                to="/health-check" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-lg font-bold text-xs shadow-neon-emerald cursor-pointer transition-all duration-300"
              >
                Mulai Diagnosis
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Zakat Telemetry Monitor */}
        <div className="glass-hud-emerald p-5 sm:p-6 rounded-2xl border border-emerald-500/20 h-full flex flex-col relative overflow-hidden shadow-xs">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <div className="flex justify-between items-center mb-5 border-b border-emerald-500/20 pb-3">
            <h2 className="text-xs font-mono font-black text-[#064E3B] uppercase tracking-widest flex items-center">
              <Calculator className="h-4.5 w-4.5 mr-2 text-amber-600" />
              ZAKAT_OBLIGATION_TELEMETRY
            </h2>
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping"></div>
          </div>

          {loading ? (
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse flex p-3 bg-emerald-100/20 rounded-xl border border-emerald-500/5">
                  <div className="h-9 w-9 bg-emerald-100 rounded-lg mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-emerald-100 rounded w-1/3"></div>
                    <div className="h-2.5 bg-emerald-100 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : zakatHistory.length > 0 ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                {zakatHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-emerald-500/10 hover:bg-[#E6F4ED]/50 hover:border-amber-500/30 transition-all duration-300">
                    <div className="flex items-center min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3 shrink-0 border border-amber-500/20">
                        <History className="h-4.5 w-4.5 text-amber-700" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-emerald-950 text-xs truncate capitalize">Zakat {item.zakat_type}</p>
                        <p className="text-[10px] text-emerald-700/65 mt-0.5 font-mono">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.zakat_obligation > 0 ? (
                        <>
                          <p className="font-extrabold text-amber-800 text-xs sm:text-sm font-mono font-bold">Rp {Math.round(item.zakat_obligation).toLocaleString('id-ID')}</p>
                          <p className="text-[8px] text-emerald-700/60 font-mono">OBLIGATION</p>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-[#E6F4ED] text-emerald-800 border border-emerald-500/20">
                          BELOW_NISAB
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/zakat" className="inline-flex items-center text-xs text-emerald-700 hover:text-[#064E3B] font-bold transition-colors">
                  Hitung Zakat Baru <ArrowRight className="ml-1 h-3.5 w-3.5 animate-pulse" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 flex-1 flex flex-col justify-center items-center">
              <Calculator className="h-11 w-11 text-emerald-500/30 mb-3" />
              <h3 className="text-xs font-mono font-black text-emerald-800 uppercase tracking-wider mb-1">NO_ZAKAT_RECORDS_SAVED</h3>
              <p className="text-xs text-emerald-700/60 mb-4 max-w-xs leading-normal">
                Belum ada kalkulasi zakat yang disimpan. Mari hitung nisab dinamis Anda sekarang.
              </p>
              <Link 
                to="/zakat" 
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-lg font-bold text-xs shadow-neon-gold cursor-pointer transition-all duration-300"
              >
                Kalkulator Zakat
              </Link>
            </div>
          )}
        </div>

      </div>

      {/* Cybernetic Sharia Quick Actions Suite */}
      <div className="mt-8">
        <h2 className="text-xs font-mono font-black text-[#064E3B] uppercase tracking-widest mb-4 flex items-center">
          <CircleDot className="h-3 w-3 text-amber-500 mr-2.5 animate-pulse" />
          INTEGRATED_SHARIA_SERVICES_SUITE
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Daily Cashflow', path: '/cashflow', icon: Wallet, color: 'text-[#064E3B] bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500' },
            { name: 'Riba Detox', path: '/riba-detox', icon: RefreshCcw, color: 'text-rose-800 bg-rose-500/10 border-rose-500/20 hover:border-rose-400 font-sans' },
            { name: 'Asset Screener', path: '/screener', icon: Search, color: 'text-amber-800 bg-amber-500/10 border-emerald-500/20 hover:border-amber-500' },
            { name: 'Smart Akad', path: '/akad-analyzer', icon: FileText, color: 'text-teal-850 bg-teal-500/10 border-emerald-500/20 hover:border-teal-500' },
            { name: 'Baitul Mal', path: '/family-dashboard', icon: Users, color: 'text-sky-850 bg-sky-500/10 border-emerald-500/20 hover:border-sky-500' },
            { name: 'Digital Wasiat', path: '/wasiat-generator', icon: FileText, color: 'text-indigo-850 bg-indigo-500/10 border-emerald-500/20 hover:border-indigo-500' }
          ].map((action, i) => (
            <Link 
              key={i} 
              to={action.path}
              className="interactive-teleport glass-hud-emerald p-4 rounded-2xl text-center flex flex-col items-center justify-center group cursor-pointer border border-emerald-500/25 relative overflow-hidden shadow-xs"
            >
              {/* Telemetry border corners */}
              <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-emerald-500/40"></div>
              <div className="absolute top-0 right-0 w-1.5 h-1.5 border-t border-r border-emerald-500/40"></div>
              <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l border-emerald-500/40"></div>
              <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-emerald-500/40"></div>
              
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-300 mb-2.5 group-hover:bg-[#064E3B] group-hover:text-white group-hover:shadow-neon-emerald ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-950 group-hover:text-[#064E3B] block leading-tight tracking-wider uppercase">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardContainer>
  );
};
