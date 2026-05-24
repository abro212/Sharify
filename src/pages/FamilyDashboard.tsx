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
    <DashboardContainer>
      
      {/* Dynamic Toast System */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-gradient-to-tr from-[#0F4C3A] to-[#10B981] text-white p-4 rounded-xl shadow-lg border border-emerald-500 flex items-center justify-between animate-slide-in">
          <div className="flex items-center space-x-3">
            <Gift className="w-6 h-6 text-amber-300 animate-bounce flex-shrink-0" />
            <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Title Banner */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Users className="h-8 w-8 text-[#0F4C3A] mr-3" />
          Baitul Mal Keluarga
        </h1>
        <p className="text-gray-500 mt-1">Konsolidasi anggaran bersama, edukasi finansial syariah anak, dan tabungan filantropi terpadu dalam satu wadah rumah tangga.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Combined Cashflow Hub & Shared Charity Vault) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. Combined Cashflow Hub Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                  <Wallet className="w-5 h-5 text-[#0F4C3A] mr-2" />
                  Combined Cashflow Hub
                </h3>
                <p className="text-xs text-gray-400 mt-0.5 font-medium">Penggabungan pendapatan & proporsi biaya operasional Abi & Ummi.</p>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">Shared Budget</span>
            </div>

            {/* Hub Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Combined Income</span>
                <span className="text-lg font-extrabold text-gray-800 mt-1 block">Rp {totalCombined.toLocaleString('id-ID')}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Target Pengeluaran</span>
                <span className="text-lg font-extrabold text-gray-800 mt-1 block text-rose-600">Rp {householdExpenses.toLocaleString('id-ID')}</span>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Surplus/Tabungan</span>
                <span className="text-lg font-extrabold text-emerald-600 mt-1 block">Rp {savingsCombined.toLocaleString('id-ID')}</span>
              </div>
            </div>

            {/* Adjustable sliders for husband/wife to show rich interaction */}
            <div className="space-y-5 border-t border-gray-100 pt-5">
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Penyesuaian Proporsi Kontribusi</h4>
              
              <div className="space-y-4">
                {/* Abi Income Adjustment */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                    <span>Pendapatan Bulanan Abi</span>
                    <span className="font-bold text-[#0F4C3A]">Rp {abiIncome.toLocaleString('id-ID')}</span>
                  </div>
                  <input 
                    type="range" 
                    min={5000000} 
                    max={25000000} 
                    step={500000}
                    value={abiIncome} 
                    onChange={e => setAbiIncome(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#0F4C3A]"
                  />
                </div>

                {/* Ummi Income Adjustment */}
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1.5">
                    <span>Pendapatan Bulanan Ummi</span>
                    <span className="font-bold text-amber-600">Rp {ummiIncome.toLocaleString('id-ID')}</span>
                  </div>
                  <input 
                    type="range" 
                    min={2000000} 
                    max={15000000} 
                    step={500000}
                    value={ummiIncome} 
                    onChange={e => setUmmiIncome(Number(e.target.value))}
                    className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>
              </div>

              {/* Stacked visual chart ratio bar */}
              <div className="mt-4">
                <span className="text-[10px] font-bold text-gray-400 uppercase block mb-2">Rasio Pendanaan Keluarga</span>
                <div className="h-6 w-full rounded-lg overflow-hidden flex text-xs font-extrabold text-white shadow-inner">
                  <div className="bg-[#0F4C3A] flex items-center justify-center transition-all duration-300" style={{ width: `${(abiIncome/totalCombined)*100}%` }}>
                    {((abiIncome/totalCombined)*100).toFixed(0)}% Abi
                  </div>
                  <div className="bg-amber-500 flex items-center justify-center transition-all duration-300" style={{ width: `${(ummiIncome/totalCombined)*100}%` }}>
                    {((ummiIncome/totalCombined)*100).toFixed(0)}% Ummi
                  </div>
                </div>
              </div>

              {/* Linked Accounts Status and Cashflow Chart */}
              <div className="mt-6 border-t border-gray-100 pt-5 space-y-4">
                <div className="flex justify-between items-center bg-emerald-50/30 p-3 rounded-xl border border-emerald-100/50">
                  <span className="text-xs font-bold text-[#0F4C3A] flex items-center">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
                    Akun Tertaut: Abi & Ummi Aktif
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">ID Rumah Tangga: #SHY-FAM-489</span>
                </div>

                <span className="text-[10px] font-bold text-gray-400 uppercase block">Total Household Cashflow Chart</span>
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4">
                  <div className="h-40 flex items-end justify-around pt-4 border-b border-gray-200 relative">
                    {/* Y-Axis guide lines */}
                    <div className="absolute left-0 right-0 border-t border-gray-200/50" style={{ bottom: '25%' }}></div>
                    <div className="absolute left-0 right-0 border-t border-gray-200/50" style={{ bottom: '50%' }}></div>
                    <div className="absolute left-0 right-0 border-t border-gray-200/50" style={{ bottom: '75%' }}></div>

                    {/* Column 1: Abi Pemasukan */}
                    <div className="flex flex-col items-center w-12 z-10">
                      <span className="text-[9px] font-bold text-[#0F4C3A] mb-1 font-mono">Rp {(abiIncome / 1000000).toFixed(1)}M</span>
                      <div className="bg-[#0F4C3A] w-full rounded-t-md transition-all duration-300" style={{ height: `${Math.min(100, (abiIncome / 25000000) * 100)}px` }}></div>
                      <span className="text-[9px] text-gray-400 font-bold mt-1.5">Abi (In)</span>
                    </div>

                    {/* Column 2: Ummi Pemasukan */}
                    <div className="flex flex-col items-center w-12 z-10">
                      <span className="text-[9px] font-bold text-amber-500 mb-1 font-mono">Rp {(ummiIncome / 1000000).toFixed(1)}M</span>
                      <div className="bg-amber-400 w-full rounded-t-md transition-all duration-300" style={{ height: `${Math.min(100, (ummiIncome / 25000000) * 100)}px` }}></div>
                      <span className="text-[9px] text-gray-400 font-bold mt-1.5">Ummi (In)</span>
                    </div>

                    {/* Column 3: Combined Expenses */}
                    <div className="flex flex-col items-center w-12 z-10">
                      <span className="text-[9px] font-bold text-rose-500 mb-1 font-mono">Rp {(householdExpenses / 1000000).toFixed(1)}M</span>
                      <div className="bg-rose-400 w-full rounded-t-md" style={{ height: `${Math.min(100, (householdExpenses / 25000000) * 100)}px` }}></div>
                      <span className="text-[9px] text-gray-400 font-bold mt-1.5">Expenses</span>
                    </div>

                    {/* Column 4: Combined Savings */}
                    <div className="flex flex-col items-center w-12 z-10">
                      <span className="text-[9px] font-bold text-emerald-600 mb-1 font-mono">Rp {(savingsCombined / 1000000).toFixed(1)}M</span>
                      <div className="bg-emerald-500 w-full rounded-t-md transition-all duration-300 animate-pulse" style={{ height: `${Math.min(100, (savingsCombined / 25000000) * 100)}px` }}></div>
                      <span className="text-[9px] text-gray-400 font-bold mt-1.5">Savings</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center text-[9px] text-gray-400">
                    <span>*M = Juta Rupiah</span>
                    <span className="font-semibold text-emerald-800">Surplus: Rp {savingsCombined.toLocaleString('id-ID')} / bulan</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* 3. Shared Charity Vault Widget */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 text-rose-500 mr-2 animate-pulse" />
                Shared Charity Vault
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Himpunan dana kebajikan, Qurban, dan tabungan filantropi produktif keluarga Anda.</p>
            </div>

            <div className="space-y-6">
              {charityVaults.map(vault => {
                const percentage = (vault.current / vault.target) * 100;
                return (
                  <div key={vault.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wider">{vault.type}</span>
                        <h4 className="text-sm font-bold text-gray-800 mt-1">{vault.name}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block font-semibold">Terkumpul</span>
                        <span className="text-sm font-black text-[#0F4C3A]">
                          Rp {vault.current.toLocaleString('id-ID')} <span className="text-[10px] text-gray-400 font-normal">/ Rp {vault.target.toLocaleString('id-ID')}</span>
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-[#0F4C3A] to-[#D4AF37] h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                    </div>

                    {/* Contribution Actions */}
                    <div className="flex items-center justify-between pt-1 text-xs">
                      <span className="text-[10px] text-gray-400 font-bold">{percentage.toFixed(0)}% Tercapai</span>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleContributeCharity(vault.id, 100000)}
                          className="bg-white hover:bg-gray-100 border border-gray-200 text-[#0F4C3A] font-bold py-1 px-3 rounded-lg text-[10px] transition-colors"
                        >
                          +Rp 100rb
                        </button>
                        <button 
                          onClick={() => handleContributeCharity(vault.id, 500000)}
                          className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-bold py-1 px-3 rounded-lg text-[10px] transition-colors shadow-sm"
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

        {/* Right Column (Kids' Sharia Pocket - 1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Kids' Savings Cards */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center">
                <Gift className="w-5 h-5 text-amber-500 mr-2" />
                Tabungan Anak
              </h3>
              <p className="text-xs text-gray-400 mt-0.5 font-medium">Bina kebiasaan menabung syariah anak dengan insentif amal salih.</p>
            </div>

            <div className="space-y-6">
              {kids.map(kid => {
                const percentage = (kid.currentSaved / kid.goalAmount) * 100;
                return (
                  <div key={kid.name} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 space-y-4">
                    
                    {/* Kid Profile Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-amber-400 to-[#D4AF37] rounded-full flex items-center justify-center text-white text-md font-extrabold uppercase shadow-sm">
                          {kid.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-800">{kid.name} <span className="text-xs text-gray-400 font-normal">({kid.age} thn)</span></h4>
                          <span className="text-[10px] text-gray-400 font-semibold">{kid.goalName}</span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-[#0F4C3A]">{percentage.toFixed(0)}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-400 h-full transition-all duration-300" style={{ width: `${percentage}%` }}></div>
                    </div>

                    <div className="flex justify-between text-xs">
                      <span className="text-gray-400 font-semibold">Tersimpan</span>
                      <span className="font-extrabold text-[#0F4C3A]">
                        Rp {kid.currentSaved.toLocaleString('id-ID')} <span className="text-[10px] text-gray-400 font-normal">/ Rp {kid.goalAmount.toLocaleString('id-ID')}</span>
                      </span>
                    </div>

                    {/* Task Habit Board for parents to click rewards */}
                    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 space-y-2">
                      <p className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider flex items-center">
                        <Award className="w-3.5 h-3.5 mr-1 text-[#D4AF37] animate-pulse" /> Tugas Pengisi Saku Syariah
                      </p>

                      <div className="space-y-1.5">
                        
                        <button 
                          onClick={() => handleRewardKid(kid.name, 10000, 'Shalat Subuh Masjid')}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-[10px] font-bold border transition-colors ${
                            kid.completedTasks.includes('Shalat Subuh Masjid')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-100'
                          }`}
                        >
                          <span className="flex items-center">
                            <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${kid.completedTasks.includes('Shalat Subuh Masjid') ? 'text-emerald-600' : 'text-gray-300'}`} />
                            Shalat Masjid 5 Waktu
                          </span>
                          <span className="text-emerald-600">+Rp 10rb</span>
                        </button>

                        <button 
                          onClick={() => handleRewardKid(kid.name, 20000, 'Hafalan Surat Pendek')}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-[10px] font-bold border transition-colors ${
                            kid.completedTasks.includes('Hafalan Surat Pendek')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-100'
                          }`}
                        >
                          <span className="flex items-center">
                            <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${kid.completedTasks.includes('Hafalan Surat Pendek') ? 'text-emerald-600' : 'text-gray-300'}`} />
                            Setoran Hafalan Juz 30
                          </span>
                          <span className="text-emerald-600">+Rp 20rb</span>
                        </button>

                        <button 
                          onClick={() => handleRewardKid(kid.name, 5000, 'Membantu Pekerjaan Rumah')}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-[10px] font-bold border transition-colors ${
                            kid.completedTasks.includes('Membantu Pekerjaan Rumah')
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-white hover:bg-gray-100 text-gray-600 border-gray-100'
                          }`}
                        >
                          <span className="flex items-center">
                            <CheckCircle2 className={`w-3.5 h-3.5 mr-1.5 ${kid.completedTasks.includes('Membantu Pekerjaan Rumah') ? 'text-emerald-600' : 'text-gray-300'}`} />
                            Membantu Bersih Rumah
                          </span>
                          <span className="text-emerald-600">+Rp 5rb</span>
                        </button>

                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

          {/* Education Box */}
          <div className="bg-gradient-to-br from-[#0F4C3A] to-[#0A3427] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <h4 className="text-xs font-extrabold text-[#D4AF37] uppercase tracking-wider mb-2">Urgensi Keuangan Keluarga Islami</h4>
            <p className="text-xs text-emerald-100 leading-relaxed mb-2">
              Baitul Mal Keluarga meniru konsep baitul mal negara untuk mengamankan ketahanan finansial rumah tangga dari riba dan memastikan penunaian hak sosial harta (zakat/sedekah) terlaksana secara teratur.
            </p>
            <div className="text-[10px] text-emerald-200 border-t border-white/10 pt-2 flex items-center justify-between">
              <span>Mazhab Fiqh Muamalah</span>
              <span>Keluarga Sakinah</span>
            </div>
          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
