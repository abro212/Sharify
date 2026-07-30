import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Users, Heart, Gift, Award, CheckCircle2, Wallet 
} from 'lucide-react';

interface KidProfile {
  name: string;
  age: number;
  goalName: string;
  goalAmount: number;
  currentSaved: number;
  completedTasks: string[];
}

export const FamilyDashboard: React.FC = () => {
  // 1. Combined Cashflow Hub state
  const [abiIncome, setAbiIncome] = useState(12000000);
  const [ummiIncome, setUmmiIncome] = useState(6000000);
  const totalCombined = abiIncome + ummiIncome;
  const householdExpenses = 10000000;
  const savingsCombined = totalCombined - householdExpenses;

  // 2. Kids' Pocket state
  const [kids, setKids] = useState<KidProfile[]>([
    {
      name: 'Farhan',
      age: 10,
      goalName: 'Tabungan Qurban Mandiri',
      goalAmount: 3500000,
      currentSaved: 2450000,
      completedTasks: ['Shalat Subuh Masjid', 'Membantu Ummi']
    },
    {
      name: 'Aisyah',
      age: 7,
      goalName: 'Hadiah Sepeda Tilawah',
      goalAmount: 1500000,
      currentSaved: 950000,
      completedTasks: ['Hafalan Surat Pendek']
    }
  ]);

  // 3. Shared Charity Vault state
  const [charityVaults, setCharityVaults] = useState([
    { id: 'qurban', name: 'Qurban Keluarga 1447H', target: 4000000, current: 3600000, type: 'Qurban' },
    { id: 'sumur', name: 'Wakaf Sumur Air Bersih', target: 10000000, current: 6200000, type: 'Wakaf' },
    { id: 'darurat', name: 'Dana Darurat Baitul Mal', target: 20000000, current: 15000000, type: 'Emergency' }
  ]);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Trigger Toast Alert
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Add reward to kids' savings
  const handleRewardKid = (kidName: string, amount: number, taskName: string) => {
    setKids(prev => 
      prev.map(k => {
        if (k.name === kidName) {
          const alreadyDone = k.completedTasks.includes(taskName);
          const updatedTasks = alreadyDone 
            ? k.completedTasks.filter(t => t !== taskName)
            : [...k.completedTasks, taskName];
          const modifier = alreadyDone ? -amount : amount;

          return {
            ...k,
            currentSaved: k.currentSaved + modifier,
            completedTasks: updatedTasks
          };
        }
        return k;
      })
    );

    const isAdding = !kids.find(k => k.name === kidName)?.completedTasks.includes(taskName);
    triggerToast(
      isAdding 
        ? `Barakallah! Rp ${amount.toLocaleString('id-ID')} ditambahkan ke saku ${kidName} untuk tugas: "${taskName}"`
        : `Tugas "${taskName}" dibatalkan. Dana disesuaikan kembali.`
    );
  };

  // Contribute to Shared Charity Vault
  const handleContributeCharity = (vaultId: string, amount: number) => {
    setCharityVaults(prev => 
      prev.map(v => 
        v.id === vaultId 
          ? { ...v, current: Math.min(v.current + amount, v.target) } 
          : v
      )
    );
    const vaultName = charityVaults.find(v => v.id === vaultId)?.name;
    triggerToast(`Alhamdulillah! Rp ${amount.toLocaleString('id-ID')} berhasil disalurkan ke "${vaultName}"`);
  };

  return (
    <DashboardContainer pageTitle="Baitul Mal Keluarga">
      <div className="space-y-6">
        
        {/* Dynamic Toast System */}
        {showToast && (
          <div className="fixed bottom-24 right-6 left-6 z-50 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-emerald-400 flex items-center animate-slide-in">
            <Gift className="w-6 h-6 text-amber-300 animate-bounce flex-shrink-0 mr-3" />
            <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
          </div>
        )}

        {/* Title Banner */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center mb-2">
            <Users className="h-6 w-6 text-emerald-600 mr-2" />
            Baitul Mal Keluarga
          </h1>
          <p className="text-sm text-slate-500">Konsolidasi anggaran bersama, edukasi finansial syariah anak, dan tabungan filantropi terpadu dalam satu wadah rumah tangga.</p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Top Section (Combined Cashflow Hub & Shared Charity Vault) */}
          <div className="space-y-6">
            
            {/* 1. Combined Cashflow Hub Widget */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center uppercase tracking-wider">
                    <Wallet className="w-4 h-4 text-emerald-600 mr-2" />
                    Combined Cashflow Hub
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Penggabungan pendapatan & proporsi biaya operasional Abi & Ummi.</p>
                </div>
                <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50 px-3 py-1.5 rounded-xl uppercase tracking-wider self-start sm:self-auto">Shared Budget</span>
              </div>

              {/* Hub Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Combined Income</span>
                  <span className="text-lg font-black text-slate-800 dark:text-white mt-1 block font-mono">Rp {totalCombined.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-4 bg-rose-50/40 dark:bg-rose-900/10 rounded-2xl border border-rose-100 dark:border-rose-800/30">
                  <span className="text-[10px] font-bold text-rose-700/60 dark:text-rose-400/60 uppercase tracking-wider block">Target Pengeluaran</span>
                  <span className="text-lg font-black text-rose-600 dark:text-rose-500 mt-1 block font-mono">Rp {householdExpenses.toLocaleString('id-ID')}</span>
                </div>
                <div className="p-4 bg-emerald-50/40 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                  <span className="text-[10px] font-bold text-emerald-700/60 dark:text-emerald-400/60 uppercase tracking-wider block">Surplus/Tabungan</span>
                  <span className="text-lg font-black text-emerald-600 dark:text-emerald-500 mt-1 block font-mono">Rp {savingsCombined.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Adjustable sliders for husband/wife to show rich interaction */}
              <div className="space-y-6 border-t border-slate-100 dark:border-slate-800 pt-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Penyesuaian Proporsi Kontribusi</h4>
                
                <div className="space-y-5">
                  {/* Abi Income Adjustment */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      <span>Pendapatan Bulanan Abi</span>
                      <span className="font-black text-emerald-600 dark:text-emerald-400 font-mono">Rp {abiIncome.toLocaleString('id-ID')}</span>
                    </div>
                    <input 
                      type="range" 
                      min={5000000} 
                      max={25000000} 
                      step={500000}
                      value={abiIncome} 
                      onChange={e => setAbiIncome(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                  </div>

                  {/* Ummi Income Adjustment */}
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      <span>Pendapatan Bulanan Ummi</span>
                      <span className="font-black text-amber-500 font-mono">Rp {ummiIncome.toLocaleString('id-ID')}</span>
                    </div>
                    <input 
                      type="range" 
                      min={2000000} 
                      max={15000000} 
                      step={500000}
                      value={ummiIncome} 
                      onChange={e => setUmmiIncome(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />
                  </div>
                </div>

                {/* Stacked visual chart ratio bar */}
                <div className="mt-5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block mb-3">Rasio Pendanaan Keluarga</span>
                  <div className="h-8 w-full rounded-xl overflow-hidden flex text-xs font-extrabold text-white shadow-inner">
                    <div className="bg-emerald-500 flex items-center justify-center transition-all duration-300" style={{ width: `${(abiIncome/totalCombined)*100}%` }}>
                      {((abiIncome/totalCombined)*100).toFixed(0)}% Abi
                    </div>
                    <div className="bg-amber-400 flex items-center justify-center transition-all duration-300" style={{ width: `${(ummiIncome/totalCombined)*100}%` }}>
                      {((ummiIncome/totalCombined)*100).toFixed(0)}% Ummi
                    </div>
                  </div>
              </div>

                </div>

                {/* Linked Accounts Status and Cashflow Chart */}
                <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-6 space-y-5">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center bg-emerald-50/50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 gap-2">
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
                      Akun Tertaut: Abi & Ummi Aktif
                    </span>
                    <span className="text-[10px] text-emerald-600/60 dark:text-emerald-400/60 font-mono font-bold">ID: #SHY-FAM-489</span>
                  </div>

                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Household Cashflow Chart</span>
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="h-40 flex items-end justify-around pt-4 border-b border-slate-200 dark:border-slate-700 relative">
                      {/* Y-Axis guide lines */}
                      <div className="absolute left-0 right-0 border-t border-slate-200/50 dark:border-slate-700/50" style={{ bottom: '25%' }}></div>
                      <div className="absolute left-0 right-0 border-t border-slate-200/50 dark:border-slate-700/50" style={{ bottom: '50%' }}></div>
                      <div className="absolute left-0 right-0 border-t border-slate-200/50 dark:border-slate-700/50" style={{ bottom: '75%' }}></div>

                      {/* Column 1: Abi Pemasukan */}
                      <div className="flex flex-col items-center w-12 z-10">
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 mb-1 font-mono">Rp {(abiIncome / 1000000).toFixed(1)}M</span>
                        <div className="bg-emerald-500 w-full rounded-t-lg transition-all duration-300" style={{ height: `${Math.min(100, (abiIncome / 25000000) * 100)}px` }}></div>
                        <span className="text-[9px] text-slate-500 font-bold mt-2">Abi (In)</span>
                      </div>

                      {/* Column 2: Ummi Pemasukan */}
                      <div className="flex flex-col items-center w-12 z-10">
                        <span className="text-[9px] font-black text-amber-500 mb-1 font-mono">Rp {(ummiIncome / 1000000).toFixed(1)}M</span>
                        <div className="bg-amber-400 w-full rounded-t-lg transition-all duration-300" style={{ height: `${Math.min(100, (ummiIncome / 25000000) * 100)}px` }}></div>
                        <span className="text-[9px] text-slate-500 font-bold mt-2">Ummi (In)</span>
                      </div>

                      {/* Column 3: Combined Expenses */}
                      <div className="flex flex-col items-center w-12 z-10">
                        <span className="text-[9px] font-black text-rose-500 mb-1 font-mono">Rp {(householdExpenses / 1000000).toFixed(1)}M</span>
                        <div className="bg-rose-400 w-full rounded-t-lg" style={{ height: `${Math.min(100, (householdExpenses / 25000000) * 100)}px` }}></div>
                        <span className="text-[9px] text-slate-500 font-bold mt-2">Expenses</span>
                      </div>

                      {/* Column 4: Combined Savings */}
                      <div className="flex flex-col items-center w-12 z-10">
                        <span className="text-[9px] font-black text-teal-600 dark:text-teal-400 mb-1 font-mono">Rp {(savingsCombined / 1000000).toFixed(1)}M</span>
                        <div className="bg-gradient-to-t from-emerald-500 to-teal-400 w-full rounded-t-lg transition-all duration-300" style={{ height: `${Math.min(100, (savingsCombined / 25000000) * 100)}px` }}></div>
                        <span className="text-[9px] text-slate-500 font-bold mt-2">Savings</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold">
                      <span>*M = Juta Rupiah</span>
                      <span className="text-emerald-600 dark:text-emerald-500">Surplus: Rp {savingsCombined.toLocaleString('id-ID')} / bulan</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Shared Charity Vault Widget */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
              <div className="mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center uppercase tracking-wider">
                  <Heart className="w-4 h-4 text-rose-500 mr-2 animate-pulse" />
                  Shared Charity Vault
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Himpunan dana kebajikan, Qurban, dan tabungan filantropi produktif keluarga Anda.</p>
              </div>

              <div className="space-y-4">
                {charityVaults.map(vault => {
                  const percentage = (vault.current / vault.target) * 100;
                  return (
                    <div key={vault.id} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-black px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">{vault.type}</span>
                          <h4 className="text-sm font-extrabold text-slate-800 dark:text-white mt-2">{vault.name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Terkumpul</span>
                          <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            Rp {vault.current.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-bold block sm:inline">/ Rp {vault.target.toLocaleString('id-ID')}</span>
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                      </div>

                      {/* Contribution Actions */}
                      <div className="flex items-center justify-between pt-1 text-xs">
                        <span className="text-[10px] text-slate-500 font-bold">{percentage.toFixed(0)}% Tercapai</span>
                        
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleContributeCharity(vault.id, 100000)}
                            className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition-colors"
                          >
                            +Rp 100rb
                          </button>
                          <button 
                            onClick={() => handleContributeCharity(vault.id, 500000)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-xl text-[10px] transition-colors shadow-sm shadow-emerald-500/20"
                          >
                            +Rp 500rb
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

          </div>

          {/* Bottom Section (Kids' Sharia Pocket) */}
          <div className="space-y-6">
            
            {/* Kids' Savings Cards */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
              <div className="mb-6 border-b border-slate-50 dark:border-slate-800 pb-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center uppercase tracking-wider">
                  <Gift className="w-4 h-4 text-amber-500 mr-2" />
                  Tabungan Anak
                </h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Bina kebiasaan menabung syariah anak dengan insentif amal salih.</p>
              </div>

              <div className="space-y-8">
                {kids.map(kid => {
                  const percentage = (kid.currentSaved / kid.goalAmount) * 100;
                  return (
                    <div key={kid.name} className="border-b border-slate-100 dark:border-slate-800 pb-8 last:border-b-0 last:pb-0 space-y-5">
                      
                      {/* Kid Profile Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 bg-gradient-to-tr from-amber-400 to-[#D4AF37] rounded-2xl flex items-center justify-center text-white text-lg font-extrabold shadow-sm">
                            {kid.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">{kid.name} <span className="text-[10px] text-slate-400 font-bold uppercase ml-1">({kid.age} thn)</span></h4>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider block mt-0.5">{kid.goalName}</span>
                          </div>
                        </div>
                        <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">{percentage.toFixed(0)}%</span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                      </div>

                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        <span>Tersimpan</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                          Rp {kid.currentSaved.toLocaleString('id-ID')} <span className="text-slate-400 font-medium lowercase">/ Rp {kid.goalAmount.toLocaleString('id-ID')}</span>
                        </span>
                      </div>

                      {/* Task Habit Board for parents to click rewards */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 space-y-3">
                        <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider flex items-center">
                          <Award className="w-4 h-4 mr-1.5 text-amber-500 animate-pulse" /> Tugas Pengisi Saku Syariah
                        </p>

                        <div className="space-y-2">
                          
                          <button 
                            onClick={() => handleRewardKid(kid.name, 10000, 'Shalat Subuh Masjid')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-colors ${
                              kid.completedTasks.includes('Shalat Subuh Masjid')
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                                : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-white border-slate-100 dark:border-slate-600'
                            }`}
                          >
                            <span className="flex items-center">
                              <CheckCircle2 className={`w-4 h-4 mr-2 ${kid.completedTasks.includes('Shalat Subuh Masjid') ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-500'}`} />
                              Shalat Masjid 5 Waktu
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">+Rp 10rb</span>
                          </button>

                          <button 
                            onClick={() => handleRewardKid(kid.name, 20000, 'Hafalan Surat Pendek')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-colors ${
                              kid.completedTasks.includes('Hafalan Surat Pendek')
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                                : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-white border-slate-100 dark:border-slate-600'
                            }`}
                          >
                            <span className="flex items-center">
                              <CheckCircle2 className={`w-4 h-4 mr-2 ${kid.completedTasks.includes('Hafalan Surat Pendek') ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-500'}`} />
                              Setoran Hafalan Juz 30
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">+Rp 20rb</span>
                          </button>

                          <button 
                            onClick={() => handleRewardKid(kid.name, 5000, 'Membantu Pekerjaan Rumah')}
                            className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-colors ${
                              kid.completedTasks.includes('Membantu Pekerjaan Rumah')
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50'
                                : 'bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-600 dark:text-white border-slate-100 dark:border-slate-600'
                            }`}
                          >
                            <span className="flex items-center">
                              <CheckCircle2 className={`w-4 h-4 mr-2 ${kid.completedTasks.includes('Membantu Pekerjaan Rumah') ? 'text-emerald-600' : 'text-slate-300 dark:text-slate-500'}`} />
                              Membantu Bersih Rumah
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-mono">+Rp 5rb</span>
                          </button>

                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

          </div>

            {/* Education Box */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-lg shadow-emerald-500/20 relative overflow-hidden">
              <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="relative z-10">
                <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider mb-3">Urgensi Keuangan Keluarga Islami</h4>
                <p className="text-xs text-emerald-50 leading-relaxed mb-4 font-medium">
                  Baitul Mal Keluarga meniru konsep baitul mal negara untuk mengamankan ketahanan finansial rumah tangga dari riba dan memastikan penunaian hak sosial harta (zakat/sedekah) terlaksana secara teratur.
                </p>
                <div className="text-[10px] font-bold text-emerald-200 border-t border-emerald-500/50 pt-3 flex items-center justify-between uppercase tracking-wider">
                  <span>Mazhab Fiqh Muamalah</span>
                  <span>Keluarga Sakinah</span>
                </div>
              </div>
            </div>

          </div>

        </div>
    </DashboardContainer>
  );
};
