import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Activity, ChevronRight, Sparkles, RefreshCcw, Calculator, Lightbulb 
} from 'lucide-react';

export const HealthCheck: React.FC = () => {
  const navigate = useNavigate();

  // Diagnostic Input States
  const [monthlyIncome, setMonthlyIncome] = useState<number>(15000000);
  const [monthlyDebtPay, setMonthlyDebtPay] = useState<number>(3000000);
  const [emergencyMonths, setEmergencyMonths] = useState<number>(4);
  const [zakatCompliant, setZakatCompliant] = useState<boolean>(true);
  const [halalInvestPercent, setHalalInvestPercent] = useState<number>(85);

  // Dynamic Score Logic
  const debtRatio = monthlyIncome > 0 ? (monthlyDebtPay / monthlyIncome) * 100 : 0;
  
  // Score Component Calculation (Total 100)
  const incomeScore = halalInvestPercent >= 80 ? 25 : Math.round((halalInvestPercent / 100) * 25);
  const debtScore = debtRatio <= 30 ? 25 : debtRatio <= 50 ? 15 : 5;
  const emergencyScore = emergencyMonths >= 6 ? 25 : Math.round((emergencyMonths / 6) * 25);
  const zakatScore = zakatCompliant ? 25 : 0;

  const totalScore = incomeScore + debtScore + emergencyScore + zakatScore;

  const getScoreBadge = (score: number) => {
    if (score >= 85) return { label: 'Excellent', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' };
    if (score >= 70) return { label: 'Good', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200' };
    if (score >= 50) return { label: 'Fair', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200' };
    return { label: 'Perlu Perbaikan', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200' };
  };

  const scoreInfo = getScoreBadge(totalScore);

  const scoreBreakdown = [
    { label: 'Portofolio & Penghasilan Halal', score: incomeScore, max: 25, color: 'bg-emerald-500' },
    { label: 'Rasio Beban Utang (<30%)', score: debtScore, max: 25, color: debtScore >= 20 ? 'bg-emerald-500' : 'bg-amber-500' },
    { label: 'Dana Darurat Syariah (6 Bln)', score: emergencyScore, max: 25, color: emergencyScore >= 20 ? 'bg-emerald-500' : 'bg-amber-500' },
    { label: 'Kepatuhan Zakat & Infaq', score: zakatScore, max: 25, color: zakatScore === 25 ? 'bg-emerald-500' : 'bg-rose-500' },
  ];

  return (
    <DashboardContainer pageTitle="Financial Health Check">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Financial Health Score</h1>
            <p className="text-xs text-slate-500 font-medium">Evaluasi kesehatan finansial berdasarkan prinsip syariah & manajemen risiko.</p>
          </div>
          <span className={`inline-flex items-center text-xs font-bold px-3.5 py-1.5 rounded-full border ${scoreInfo.bg} ${scoreInfo.color} w-fit`}>
            ✨ Status: {scoreInfo.label} ({totalScore}/100)
          </span>
        </div>

        {/* Top Banner Card */}
        <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
          <div className="relative z-10 max-w-[70%] space-y-1">
            <h2 className="text-base font-extrabold text-white leading-tight">
              Audit Kesehatan Finansial Syariah
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              Uji rasio utang, kecukupan dana darurat, dan kepatuhan zakat Anda secara akurat.
            </p>
          </div>
          
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        {/* Responsive Grid Layout: Left 2 Cols (Gauge & Diagnostic Form), Right 1 Col (Breakdown & Tips) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT 2 COLUMNS: Gauge & Interactive Diagnostic Form */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Score Ring Gauge Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
              <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Financial Wellbeing Score</span>
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-100 dark:text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-emerald-500 transition-all duration-700"
                    strokeDasharray={`${totalScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-slate-900 dark:text-white leading-none">
                    {totalScore} <span className="text-xs font-bold text-slate-400">/ 100</span>
                  </span>
                  <span className={`text-xs font-bold ${scoreInfo.color} mt-1`}>
                    {scoreInfo.label}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm font-medium">
                {totalScore >= 80 
                  ? 'Keuangan Anda dalam kondisi prima dan sesuai dengan standar syariah.'
                  : 'Terdapat beberapa aspek alokasi dana dan dana darurat yang perlu diselaraskan.'}
              </p>
            </div>

            {/* Diagnostic Input Form */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Simulasi Parameter Keuangan Anda
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Penghasilan Bersih Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={monthlyIncome || ''}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cicilan Utang Bulanan (Rp)</label>
                  <input
                    type="number"
                    value={monthlyDebtPay || ''}
                    onChange={(e) => setMonthlyDebtPay(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Cakupan Dana Darurat (Bulan)</label>
                  <select
                    value={emergencyMonths}
                    onChange={(e) => setEmergencyMonths(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30 cursor-pointer"
                  >
                    <option value={1}>1 Bulan</option>
                    <option value={3}>3 Bulan</option>
                    <option value={6}>6 Bulan (Ideal)</option>
                    <option value={12}>12 Bulan (Sangat Aman)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Persentase Aset Halal (%)</label>
                  <input
                    type="number"
                    max={100}
                    value={halalInvestPercent}
                    onChange={(e) => setHalalInvestPercent(Math.min(100, Number(e.target.value)))}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
              </div>

              {/* Zakat Switch */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white">Rutin Membayar Zakat & Infaq</h4>
                  <p className="text-[11px] text-slate-500">Kewajiban zakat dipenuhi jika harta telah mencapai nisab & haul.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setZakatCompliant(!zakatCompliant)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 cursor-pointer ${
                    zakatCompliant ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Breakdown & Dynamic Action Cards */}
          <div className="space-y-6">
            
            {/* Score Breakdown Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                Rincian Evaluasi Modul
              </h3>

              <div className="space-y-3.5">
                {scoreBreakdown.map((item, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-700 dark:text-slate-300 text-[11px] truncate pr-2">{item.label}</span>
                      <span className="text-slate-900 dark:text-white font-mono shrink-0">{item.score}/{item.max}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full transition-all duration-500`} style={{ width: `${(item.score / item.max) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Recommendation Actions */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <Lightbulb className="w-4 h-4 text-amber-500 mr-1.5" /> Rekomendasi Peningkatan
              </h3>

              <button
                onClick={() => navigate('/chat')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 hover:bg-emerald-100/60 transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Konsultasi AI Syariah</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/zakat')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <Calculator className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Hitung Zakat Maal & Profesi</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                onClick={() => navigate('/riba-detox')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:bg-slate-100 transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5">
                  <RefreshCcw className="w-4 h-4 text-rose-500 shrink-0" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Program Riba Detox</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
