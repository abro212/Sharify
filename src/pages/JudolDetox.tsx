import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Flame, CheckCircle2, PhoneCall, HeartHandshake, 
  TrendingDown, RefreshCcw, ArrowRight, ShieldCheck, 
  MessageSquare, Award, Clock
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNotificationStore } from '../store/notificationStore';

export const JudolDetox: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  // Financial Loss Calculator States
  const [monthlyLoss, setMonthlyLoss] = useState<number>(2500000);
  const [monthsActive, setMonthsActive] = useState<number>(6);
  const [pinjolDebt, setPinjolDebt] = useState<number>(5000000);

  // Recovery Tracker States
  const [cleanStreakDays, setCleanStreakDays] = useState<number>(14);
  const [hasBlockedApps, setHasBlockedApps] = useState<boolean>(true);
  const [hasFamilyPartner, setHasFamilyPartner] = useState<boolean>(true);
  const [isCommitmentSigned, setIsCommitmentSigned] = useState<boolean>(false);

  // Calculations
  const totalFinancialLoss = (monthlyLoss * monthsActive) + pinjolDebt;
  const daysToRebuild = Math.ceil(totalFinancialLoss / (monthlyLoss || 1) * 30);

  useEffect(() => {
    // Load stored streak days if available
    const storedStreak = localStorage.getItem(`sharify_judol_clean_streak_${user?.id || 'guest'}`);
    if (storedStreak) {
      setCleanStreakDays(parseInt(storedStreak, 10));
    }
  }, [user?.id]);

  const handleIncrementStreak = () => {
    const nextStreak = cleanStreakDays + 1;
    setCleanStreakDays(nextStreak);
    localStorage.setItem(`sharify_judol_clean_streak_${user?.id || 'guest'}`, nextStreak.toString());

    addNotification({
      user_id: user?.id || null,
      title: 'Selamat! Streak Bebas Judol Bertambah 🎉',
      message: `Anda telah bertahan ${nextStreak} Hari Bebas Judi Online. Pertahankan komitmen istiqomah Anda!`,
      type: 'success',
      link: '/judol-detox',
    });
  };

  const handleSignCommitment = () => {
    setIsCommitmentSigned(true);
    addNotification({
      user_id: user?.id || null,
      title: 'Ikrar Pemulihan Judol Diterima 📜',
      message: 'Komitmen Anda untuk berhenti dari judi online telah tercatat. Asisten AI Sharify siap mendampingi pemulihan Anda.',
      type: 'success',
      link: '/judol-detox',
    });
  };

  return (
    <DashboardContainer pageTitle="Judol Detox Program">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Judol Detox & Pemulihan Finansial</h1>
            <p className="text-xs text-slate-500 font-medium">Program pendampingan berhenti judi online, penataan utang, dan pemulihan jiwa & harta.</p>
          </div>
          <span className="inline-flex items-center text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 px-3.5 py-1.5 rounded-full w-fit">
            🛡️ Safe Haven Zone
          </span>
        </div>

        {/* Top Emergency Red/Emerald Banner */}
        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-rose-950/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="relative z-10 max-w-xl space-y-1.5">
            <div className="inline-flex items-center text-[10px] font-black uppercase tracking-wider bg-rose-500/30 text-rose-200 px-2.5 py-0.5 rounded-full border border-rose-400/30 mb-1">
              <Flame className="w-3 h-3 mr-1 text-rose-400 animate-bounce" /> Program Proteksi Harta & Keluarga
            </div>
            <h2 className="text-lg font-extrabold text-white leading-tight">
              Bebaskan Diri dari Jeratan Judi Online Sekarang
            </h2>
            <p className="text-xs text-slate-200 font-medium leading-relaxed">
              Judi online (*maisir*) adalah perusak keberkahan harta dan keharmonisan keluarga. Mari tata kembali keuangan Anda secara bertahap bersama pendampingan syariah.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0 w-full md:w-auto">
            <a 
              href="tel:159" 
              className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-1.5 border border-rose-400/40 cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Hotline Stop Judol (159)</span>
            </a>
            <button
              onClick={() => navigate('/chat')}
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-3 rounded-2xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Konseling AI Safe</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Left 2 Cols (Streak Counter & Loss Calculator), Right 1 Col (Recovery Steps & Badges) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Habit Tracker: Clean Streak Counter */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                  <Award className="w-4 h-4 text-amber-500 mr-2" /> Streak Hari Bebas Judol Saya
                </h3>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {cleanStreakDays} Hari Beruntun!
                </span>
              </div>

              <div className="bg-gradient-to-r from-emerald-50 dark:from-emerald-950/30 to-teal-50 dark:to-teal-950/30 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center space-y-3">
                <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-[#064E3B] text-amber-300 shadow-lg shadow-emerald-950/20 mx-auto font-black text-3xl">
                  {cleanStreakDays}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Hari Terbebas dari Judi Online</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">"Setiap hari tanpa judol adalah kemenangan besar bagi Anda dan keluarga."</p>
                </div>

                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleIncrementStreak}
                    className="bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Saya Berhasil Melewati Hari Ini (+1 Hari)</span>
                  </button>
                </div>
              </div>

              {/* Milestone Badges */}
              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className={`p-2.5 rounded-2xl border text-xs ${cleanStreakDays >= 7 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                  <span className="block font-black text-sm">7 Hari</span>
                  <span className="text-[9px] font-bold">Fase Awal</span>
                </div>
                <div className={`p-2.5 rounded-2xl border text-xs ${cleanStreakDays >= 30 ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                  <span className="block font-black text-sm">30 Hari</span>
                  <span className="text-[9px] font-bold">Stabil</span>
                </div>
                <div className={`p-2.5 rounded-2xl border text-xs ${cleanStreakDays >= 90 ? 'bg-amber-50 border-amber-200 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                  <span className="block font-black text-sm">90 Hari</span>
                  <span className="text-[9px] font-bold">Bebas Total</span>
                </div>
                <div className={`p-2.5 rounded-2xl border text-xs ${cleanStreakDays >= 365 ? 'bg-indigo-50 border-indigo-200 text-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300' : 'bg-slate-50 border-slate-200 text-slate-400 dark:bg-slate-800'}`}>
                  <span className="block font-black text-sm">1 Tahun</span>
                  <span className="text-[9px] font-bold">Master</span>
                </div>
              </div>
            </div>

            {/* 2. Financial Damage & Recovery Calculator */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <TrendingDown className="w-4 h-4 text-rose-500 mr-2" /> Kalkulator Kerugian & Waktu Pemulihan Harta
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Rata-rata Kerugian/Deposit Per Bulan (Rp)</label>
                  <input
                    type="number"
                    value={monthlyLoss || ''}
                    onChange={(e) => setMonthlyLoss(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Lama Terjebak Judol (Bulan)</label>
                  <input
                    type="number"
                    value={monthsActive || ''}
                    onChange={(e) => setMonthsActive(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Utang Akibat Judol / Pinjol (Rp)</label>
                  <input
                    type="number"
                    value={pinjolDebt || ''}
                    onChange={(e) => setPinjolDebt(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                  />
                </div>
              </div>

              {/* Simulation Result */}
              <div className="p-4 bg-rose-50/60 dark:bg-rose-950/30 rounded-2xl border border-rose-100 dark:border-rose-900/40 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Estimasi Akumulasi Kerugian Keuangan:</span>
                  <span className="font-mono font-black text-rose-600 dark:text-rose-400 text-sm">
                    Rp {totalFinancialLoss.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs pt-1 border-t border-rose-100 dark:border-rose-900/40">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Estimasi Waktu Pemulihan Harta (Stop Judol):</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    ~{Math.ceil(daysToRebuild / 30)} Bulan ({daysToRebuild} Hari)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium pt-1">
                  💡 Dengan menghentikan judi online 100%, Anda dapat menghemat <strong>Rp {monthlyLoss.toLocaleString('id-ID')}</strong> per bulan untuk alokasi dana darurat dan pelunasan utang.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN */}
          <div className="space-y-6">
            
            {/* 5 Pillar Recovery Plan Checklist */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <ShieldCheck className="w-4 h-4 text-emerald-600 mr-2" /> 5 Langkah Pemulihan Berkah
              </h3>

              <div className="space-y-3 text-xs">
                
                {/* Step 1 */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={hasBlockedApps}
                    onChange={() => setHasBlockedApps(!hasBlockedApps)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">1. Blokir Akses Perbankan & Aplikasi</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Uninstall seluruh aplikasi judol & batasi limit e-wallet bulanan.</p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={hasFamilyPartner}
                    onChange={() => setHasFamilyPartner(!hasFamilyPartner)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">2. Tunjuk Pendamping Keuangan</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Serahkan kendali keuangan ke pasangan/keluarga terpercaya via Baitul Mal Keluarga.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start space-x-3">
                  <input
                    type="checkbox"
                    checked={isCommitmentSigned}
                    onChange={() => setIsCommitmentSigned(!isCommitmentSigned)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">3. Tanda Tangan Ikrar Pemulihan</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Buat komitmen tertulis berhenti judol demi masa depan keluarga.</p>
                  </div>
                </div>

              </div>

              {!isCommitmentSigned ? (
                <button
                  onClick={handleSignCommitment}
                  className="w-full bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all uppercase tracking-wider flex items-center justify-center space-x-1 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-300 mr-1" />
                  <span>Tanda Tangan Komitmen Pemulihan</span>
                </button>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-3 rounded-xl flex items-center space-x-2 text-xs text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ikrar Pemulihan Aktif & Terverifikasi Sistem</span>
                </div>
              )}
            </div>

            {/* Direct Quick Nav Module Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Modul Pemulihan Terkait
              </h3>

              <button
                onClick={() => navigate('/riba-detox')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <RefreshCcw className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Riba & Debt Detox</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/family-dashboard')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Baitul Mal Keluarga</span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
