import React, { useState, useEffect } from 'react';
import { Calculator, Save, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

type ZakatType = 'maal' | 'profesi';

export const ZakatCalculatorContent: React.FC = () => {
  const { session } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ZakatType>('profesi');
  
  // Inputs
  const [goldPrice, setGoldPrice] = useState<number>(1200000); // Default placeholder 1.2jt/gram
  const [wealthAmount, setWealthAmount] = useState<number>(0);
  
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calculations
  const NISAB_GOLD_GRAMS = 85;
  const yearlyNisab = goldPrice * NISAB_GOLD_GRAMS;
  const currentNisab = activeTab === 'maal' ? yearlyNisab : yearlyNisab / 12;
  
  const isEligible = wealthAmount >= currentNisab;
  const zakatObligation = isEligible ? wealthAmount * 0.025 : 0;

  // Reset inputs when switching tabs
  useEffect(() => {
    setWealthAmount(0);
    setSaveStatus('idle');
  }, [activeTab]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    setSaveStatus('idle');

    const { error } = await supabase
      .from('zakat_history')
      .insert({
        user_id: session.user.id,
        zakat_type: activeTab,
        gold_price_per_gram: goldPrice,
        calculated_wealth: wealthAmount,
        zakat_obligation: zakatObligation
      });

    setIsSaving(false);
    if (!error) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      console.error("Error saving zakat history:", error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Top Deep Emerald Banner Card matching Screen 7 */}
      <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
        <div className="relative z-10 max-w-[70%] space-y-1">
          <h2 className="text-base font-extrabold text-white leading-tight">
            Calculate Your Zakat
          </h2>
          <p className="text-xs text-emerald-100/90 font-medium">
            Ensure your wealth is blessed and purified
          </p>
        </div>
        
        <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
          <Calculator className="w-7 h-7" />
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60">
        {/* Tab Toggles */}
        <div className="flex p-1 bg-slate-100 dark:bg-slate-700/50 rounded-2xl mb-5">
          <button
            onClick={() => setActiveTab('profesi')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'profesi' ? 'bg-white dark:bg-slate-800 text-[#064E3B] dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Zakat Profesi
          </button>
          <button
            onClick={() => setActiveTab('maal')}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'maal' ? 'bg-white dark:bg-slate-800 text-[#064E3B] dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            Zakat Maal
          </button>
        </div>

        <form className="space-y-4">
          {/* Global Setting: Gold Price */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">Harga Emas Saat Ini (Rp/gram)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-slate-400 font-medium text-xs">Rp</span>
              </div>
              <input
                type="number"
                value={goldPrice || ''}
                onChange={(e) => setGoldPrice(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 font-medium">Basis nisab: 85 gram emas.</p>
          </div>

          {/* Dynamic Wealth Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              {activeTab === 'profesi' ? 'Total Penghasilan Bulanan (Rp)' : 'Total Aset (Tabungan, Emas, dll) (Rp)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-slate-400 font-medium text-xs">Rp</span>
              </div>
              <input
                type="number"
                value={wealthAmount || ''}
                onChange={(e) => setWealthAmount(Number(e.target.value))}
                placeholder="Misal: 15000000"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Result Card */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-700/50">
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Hasil Kalkulasi Zakat</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">2.5% Rate</span>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Batas Nisab:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              Rp {Math.round(currentNisab).toLocaleString('id-ID')}
            </span>
          </div>

          <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">Zakat Payable</span>
            {wealthAmount === 0 ? (
              <p className="text-xs text-slate-400 italic">Masukkan nilai aset Anda di atas.</p>
            ) : !isEligible ? (
              <div className="flex items-center text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                <CheckCircle className="mr-2 h-4 w-4 text-emerald-600 flex-shrink-0" />
                <span>Belum mencapai nisab (Belum wajib zakat).</span>
              </div>
            ) : (
              <div>
                <p className="text-2xl font-black text-[#064E3B] dark:text-emerald-400 font-mono">
                  Rp {Math.round(zakatObligation).toLocaleString('id-ID')}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  {activeTab === 'profesi' ? 'Wajib dibayarkan setiap bulan.' : 'Wajib dibayarkan sekali setahun.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Save CTA Button */}
        <button
          onClick={handleSave}
          disabled={wealthAmount === 0 || isSaving}
          className={`w-full mt-4 flex items-center justify-center py-3 rounded-2xl text-xs font-extrabold transition-all shadow-md ${
            wealthAmount === 0 
              ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {isSaving ? (
            <span className="animate-pulse">Menyimpan...</span>
          ) : (
            <>
              <Save className="mr-1.5 h-4 w-4" /> Simpan ke Catatan Zakat
            </>
          )}
        </button>

        {saveStatus === 'success' && (
          <p className="text-emerald-600 text-xs text-center mt-2 flex items-center justify-center font-bold">
            <CheckCircle className="mr-1 h-3.5 w-3.5" /> Berhasil disimpan!
          </p>
        )}
      </div>
    </div>
  );
};
