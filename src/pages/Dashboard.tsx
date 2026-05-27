import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Wallet, TrendingUp, AlertTriangle, ShieldCheck, Calculator, ArrowRight, History, RefreshCcw, Search, FileText, Users } from 'lucide-react';
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
    if (score >= 80) return 'text-[#0F4C3A] border-[#0F4C3A] shadow-emerald-500/5';
    if (score >= 50) return 'text-amber-500 border-amber-500 shadow-amber-500/5';
    return 'text-rose-500 border-rose-500 shadow-rose-500/5';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { title: 'Kondisi Prima (Halal)', desc: 'Skor kepatuhan Syariah Anda sangat baik. Pengelolaan aset dan kewajiban sangat bersih dari unsur riba.' };
    if (score >= 50) return { title: 'Butuh Perhatian', desc: 'Terdapat paparan Riba atau utang konvensional minor. Kami sarankan bertransisi ke alternatif Syariah.' };
    return { title: 'Paparan Kritis', desc: 'Terdeteksi paparan Riba yang sangat tinggi. Kami sangat menyarankan segera menggunakan Rencana Riba Detox.' };
  };

  return (
    <DashboardContainer>
      {/* Premium Executive Greeting Banner */}
      <div className="bg-gradient-to-br from-[#0F4C3A] via-[#0D3F30] to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-amber-500/20 shadow-xl relative overflow-hidden mb-8 group">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23D4AF37\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-amber-400/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-[10px] font-semibold mb-3 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 mr-2 animate-pulse"></span>
              Pusat Kendali Syariah Aktif
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-sans">
              Assalamu alaikum, <span className="shimmer-gold-text font-black">{profile?.full_name?.split(' ')[0] || 'User'}</span>!
            </h1>
            <p className="text-slate-300 text-[11px] sm:text-xs mt-2 max-w-xl leading-relaxed">
              Selamat datang kembali di pusat kendali keuangan berkah Anda. Mari senantiasa menjaga kesucian harta dengan prinsip Syariah & Fiqh Muamalah modern.
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-[9px] text-amber-400 font-mono tracking-widest block uppercase">Status Baitul Mal</span>
            <span className="text-sm font-black tracking-tight mt-1 block">Aman & Terkendali</span>
            <p className="text-[8px] text-slate-400 italic mt-0.5 font-mono">Sync Supabase Realtime</p>
          </div>
        </div>
      </div>

      {/* Top Metrics Row - Re-designed to glassmorphic visual cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        
        {/* Metric 1 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-emerald-500/20 flex items-center group">
          <div className="h-11 w-11 bg-emerald-50 text-[#0F4C3A] rounded-xl flex items-center justify-center border border-emerald-100/50 group-hover:bg-[#0F4C3A] group-hover:text-white transition-colors mr-4 shrink-0 shadow-xs">
            <Wallet className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-0.5">Total Aset Aktif</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              Rp {financialProfile?.assets ? financialProfile.assets.toLocaleString('id-ID') : '0'}
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-amber-500/20 flex items-center group">
          <div className="h-11 w-11 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center border border-amber-100/50 group-hover:bg-amber-500 group-hover:text-white transition-colors mr-4 shrink-0 shadow-xs">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block mb-0.5">Pendapatan Bulanan</span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              Rp {financialProfile?.monthly_income ? financialProfile.monthly_income.toLocaleString('id-ID') : '0'}
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="glass-card p-5 rounded-2xl border border-slate-200/50 shadow-sm transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5 hover:border-rose-500/20 flex items-center group">
          <div className="h-11 w-11 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center border border-rose-100/50 group-hover:bg-rose-500 group-hover:text-white transition-colors mr-4 shrink-0 shadow-xs">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">Paparan Riba / Utang</span>
              {financialProfile?.conventional_debts > 0 && (
                <span className="text-[7px] font-black uppercase bg-rose-100 text-rose-700 px-1 py-0.5 rounded leading-none">Riba</span>
              )}
            </div>
            <p className="text-xl sm:text-2xl font-black text-slate-900 truncate">
              Rp {financialProfile?.conventional_debts ? financialProfile.conventional_debts.toLocaleString('id-ID') : '0'}
            </p>
          </div>
        </div>

      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Health Check */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/50 shadow-xs h-full flex flex-col">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center">
              <ShieldCheck className="h-4.5 w-4.5 mr-2 text-[#0F4C3A]" />
              Status Diagnostik Syariah
            </h2>
          </div>

          {loading ? (
            <div className="animate-pulse flex items-center space-x-6 flex-1 justify-center py-8">
              <div className="w-24 h-24 bg-slate-200 rounded-full"></div>
              <div className="flex-1 space-y-3 py-1">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : financialProfile ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left flex-1 py-2">
              {/* Radial Score Gauge Design */}
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center mb-4 sm:mb-0">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-amber-500/10 animate-spin" style={{ animationDuration: '40s' }}></div>
                <div className={`w-24 h-24 rounded-full border-[6px] flex flex-col items-center justify-center bg-white shadow-inner ${getScoreColor(financialProfile.health_score)}`}>
                  <span className="text-2xl font-black">{financialProfile.health_score}</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mt-0.5">Skor</span>
                </div>
              </div>
              <div className="sm:ml-6 flex-1 flex flex-col justify-center">
                <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase">Sharia Compliance</span>
                <h3 className="font-extrabold text-slate-900 text-base mt-1">{getScoreMessage(financialProfile.health_score).title}</h3>
                <p className="text-slate-500 text-[11px] mt-1.5 leading-relaxed">{getScoreMessage(financialProfile.health_score).desc}</p>
                <Link to="/health-check" className="inline-flex items-center mt-3 text-xs text-[#0F4C3A] font-bold hover:text-emerald-700 transition-colors">
                  Ulangi Diagnosis <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 flex-1 flex flex-col justify-center items-center">
              <ShieldCheck className="h-11 w-11 text-slate-300 mb-3" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Belum Ada Riwayat Diagnosis</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-xs leading-normal">
                Ukur kepatuhan muamalah dan paparan riba pada kekayaan Anda untuk pertama kalinya.
              </p>
              <Link 
                to="/health-check" 
                className="bg-[#0F4C3A] hover:bg-emerald-950 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:shadow-emerald-500/10 cursor-pointer"
              >
                Mulai Diagnosis
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Zakat Summary */}
        <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200/50 shadow-xs h-full flex flex-col">
          <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center">
              <Calculator className="h-4.5 w-4.5 mr-2 text-amber-500" />
              Riwayat Kewajiban Zakat
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3 flex-1 flex flex-col justify-center">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse flex p-3 bg-slate-100/50 rounded-xl">
                  <div className="h-9 w-9 bg-slate-200 rounded-lg mr-3"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-2.5 bg-slate-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : zakatHistory.length > 0 ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-2.5">
                {zakatHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-200/40 hover:bg-slate-50/50 hover:border-amber-500/10 transition-all duration-300">
                    <div className="flex items-center min-w-0">
                      <div className="h-9 w-9 rounded-lg bg-amber-500/10 flex items-center justify-center mr-3 shrink-0">
                        <History className="h-4.5 w-4.5 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-800 text-xs truncate capitalize">Zakat {item.zakat_type}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      {item.zakat_obligation > 0 ? (
                        <>
                          <p className="font-extrabold text-amber-600 text-xs sm:text-sm">Rp {Math.round(item.zakat_obligation).toLocaleString('id-ID')}</p>
                          <p className="text-[9px] text-slate-400">Kewajiban</p>
                        </>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-slate-100 text-slate-500">
                          Di Bawah Nisab
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/zakat" className="inline-flex items-center text-xs text-slate-500 hover:text-amber-500 font-bold transition-colors">
                  Hitung Zakat Baru <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 flex-1 flex flex-col justify-center items-center">
              <Calculator className="h-11 w-11 text-slate-300 mb-3" />
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-1">Belum Ada Catatan Zakat</h3>
              <p className="text-xs text-slate-500 mb-4 max-w-xs leading-normal">
                Belum ada kalkulasi zakat yang disimpan. Mari hitung nisab dinamis Anda sekarang.
              </p>
              <Link 
                to="/zakat" 
                className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-sm hover:shadow-amber-500/10 cursor-pointer"
              >
                Kalkulator Zakat
              </Link>
            </div>
          )}
        </div>

      </div>
      {/* Integrated Sharia Quick Actions Suite */}
      <div className="mt-8">
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center">
          <span className="h-2 w-2 rounded-full bg-amber-400 mr-2.5 animate-pulse"></span>
          Layanan Syariah Terpadu
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Daily Cashflow', path: '/cashflow', icon: Wallet, color: 'text-emerald-600 bg-emerald-50 border-emerald-100/50 hover:bg-[#0F4C3A]' },
            { name: 'Riba Detox', path: '/riba-detox', icon: RefreshCcw, color: 'text-rose-600 bg-rose-50 border-rose-100/50 hover:bg-rose-600' },
            { name: 'Asset Screener', path: '/screener', icon: Search, color: 'text-amber-600 bg-amber-50 border-amber-100/50 hover:bg-amber-500' },
            { name: 'Smart Akad', path: '/akad-analyzer', icon: FileText, color: 'text-indigo-600 bg-indigo-50 border-indigo-100/50 hover:bg-indigo-600' },
            { name: 'Baitul Mal', path: '/family-dashboard', icon: Users, color: 'text-sky-600 bg-sky-50 border-sky-100/50 hover:bg-sky-655 hover:bg-sky-600' },
            { name: 'Digital Wasiat', path: '/wasiat-generator', icon: FileText, color: 'text-teal-600 bg-teal-50 border-teal-100/50 hover:bg-teal-600' }
          ].map((action, i) => (
            <Link 
              key={i} 
              to={action.path}
              className="glass-card hover:border-amber-500/30 p-3.5 rounded-2xl text-center flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.03] hover:-translate-y-0.5 group cursor-pointer"
            >
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center border transition-all duration-300 mb-2 group-hover:text-white ${action.color.split(' hover:')[0]}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-extrabold text-slate-700 group-hover:text-slate-950 block leading-tight">{action.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </DashboardContainer>
  );
};
