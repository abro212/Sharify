import React, { useState, useEffect } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Heart, Calendar, Coins, Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';

interface LivestockOption {
  id: string;
  name: string;
  price: number;
  category: 'Kambing' | 'Sapi';
}

export const QurbanSaver: React.FC = () => {
  // Mock Livestock Prices
  const livestockPrices: LivestockOption[] = [
    { id: 'kambing-std', name: 'Kambing Standar', price: 2500000, category: 'Kambing' },
    { id: 'kambing-prem', name: 'Kambing Premium', price: 3500000, category: 'Kambing' },
    { id: 'sapi-share', name: 'Sapi Standar (1/7 Share)', price: 3000000, category: 'Sapi' },
    { id: 'sapi-std', name: 'Sapi Standar Utuh', price: 21000000, category: 'Sapi' },
    { id: 'sapi-prem', name: 'Sapi Premium Jumbo', price: 33000000, category: 'Sapi' }
  ];

  // Islamic Motivational Quotes list
  const islamicQuotes = [
    {
      text: "Tidak ada suatu amal saleh yang lebih dicintai oleh Allah dari anak Adam pada hari raya selain menyembelih hewan qurban.",
      source: "HR. Tirmidzi & Ibnu Majah"
    },
    {
      text: "Maka laksanakanlah shalat karena Tuhanmu, dan berqurbanlah (sebagai ibadah dan mendekatkan diri kepada Allah).",
      source: "QS. Al-Kautsar: 2"
    },
    {
      text: "Setiap anak tergadai dengan aqiqahnya, disembelihkan untuknya pada hari ketujuh, digundul rambutnya, dan diberi nama.",
      source: "HR. An-Nasa'i & Tirmidzi"
    }
  ];

  // State values
  const [goalType, setGoalType] = useState<'Qurban' | 'Aqiqah'>('Qurban');
  const [selectedLivestockId, setSelectedLivestockId] = useState('kambing-prem');
  const [targetDateString, setTargetDateString] = useState('2027-05-16'); // Default next Eid al-Adha approx (May 2027)
  const [startingDeposit, setStartingDeposit] = useState(500000);
  const [simulatedSaved, setSimulatedSaved] = useState(500000);
  
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [calculations, setCalculations] = useState({
    monthsRemaining: 0,
    daysRemaining: 0,
    monthlySavingsNeeded: 0,
    dailySavingsNeeded: 0,
    targetPrice: 3500000
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Trigger Toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // Find selected livestock
  const currentLivestock = livestockPrices.find(l => l.id === selectedLivestockId) || livestockPrices[1];

  // Rotate quotes every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % islamicQuotes.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Update calculations based on targetDate, startingDeposit, and livestockPrice
  useEffect(() => {
    const targetPrice = currentLivestock.price;
    const today = new Date();
    const target = new Date(targetDateString);
    
    // Time difference
    const diffTime = target.getTime() - today.getTime();
    const daysRemaining = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    
    // Month difference (approximate)
    const monthsRemaining = Math.max(1, Math.ceil(daysRemaining / 30.4));
    
    // Savings required
    const remainingToSave = Math.max(0, targetPrice - simulatedSaved);
    const monthlySavingsNeeded = Math.round(remainingToSave / monthsRemaining);
    const dailySavingsNeeded = Math.round(remainingToSave / daysRemaining);

    setCalculations({
      monthsRemaining,
      daysRemaining,
      monthlySavingsNeeded,
      dailySavingsNeeded,
      targetPrice
    });
  }, [selectedLivestockId, targetDateString, simulatedSaved, currentLivestock]);

  // Adjust simulated savings on form target resets
  const handleLivestockChange = (id: string) => {
    setSelectedLivestockId(id);
  };

  const handleSimulateDeposit = (amount: number) => {
    setSimulatedSaved(prev => {
      const nextSaved = prev + amount;
      if (nextSaved >= currentLivestock.price) {
        triggerToast(`Alhamdulillah! Tabungan Anda telah mencapai target Rp ${currentLivestock.price.toLocaleString('id-ID')} untuk ${currentLivestock.name}!`);
        return currentLivestock.price;
      } else {
        triggerToast(`Rp ${amount.toLocaleString('id-ID')} disimulasikan masuk ke Tabungan ${goalType}!`);
        return nextSaved;
      }
    });
  };

  const handleResetSimulation = () => {
    setSimulatedSaved(startingDeposit);
    triggerToast('Simulasi tabungan dikembalikan ke setoran awal.');
  };

  const progressPercentage = Math.min(100, (simulatedSaved / calculations.targetPrice) * 100);

  return (
    <DashboardContainer pageTitle="Qurban & Aqiqah Auto-Saver">
      <div className="space-y-6">
      
      {/* Toast System */}
      {showToast && (
        <div className="fixed bottom-24 right-6 left-6 z-50 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white p-4 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.1)] border border-emerald-400 flex items-center animate-slide-in">
          <CheckCircle2 className="w-6 h-6 text-amber-300 animate-bounce flex-shrink-0 mr-3" />
          <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 flex items-center mb-2">
          <Sparkles className="h-6 w-6 text-emerald-600 mr-2 animate-pulse" />
          Qurban & Aqiqah
        </h1>
        <p className="text-sm text-slate-500">Sinking fund cerdas merencanakan ibadah Qurban atau Aqiqah dengan target harian/bulanan terukur.</p>
      </div>

      {/* 1. Livestock Live Mock Prices Ticker */}
      <div className="flex overflow-x-auto gap-4 snap-x pb-4 -mx-6 px-6 no-scrollbar mb-4">
        {livestockPrices.map(livestock => (
          <button
            key={livestock.id}
            onClick={() => handleLivestockChange(livestock.id)}
            className={`flex-shrink-0 w-64 p-5 rounded-3xl border text-left transition-all snap-center ${
              selectedLivestockId === livestock.id 
                ? 'bg-emerald-600 dark:bg-emerald-500 text-white border-transparent shadow-[0_4px_20px_rgba(16,185,129,0.3)] transform -translate-y-1' 
                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
              selectedLivestockId === livestock.id 
                ? 'bg-white/20 text-amber-300' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
            }`}>{livestock.category}</span>
            <h4 className="text-sm font-extrabold mt-3 truncate">{livestock.name}</h4>
            <p className={`text-lg font-black mt-1 font-mono ${
              selectedLivestockId === livestock.id ? 'text-amber-300' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              Rp {livestock.price.toLocaleString('id-ID')}
            </p>
            <span className={`block text-[10px] font-medium mt-2 ${selectedLivestockId === livestock.id ? 'text-emerald-100' : 'text-slate-400'}`}>Harga Pasar Acuan 2026</span>
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col gap-6">
        
        {/* Top: Form & Calculator */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6 border-b border-slate-50 dark:border-slate-800 pb-3">Konfigurasi Tabungan</h3>
            
            <div className="space-y-4">
              
              {/* Goal Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Jenis Ibadah</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setGoalType('Qurban')}
                    className={`py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                      goalType === 'Qurban' 
                        ? 'bg-emerald-600 text-white border-transparent shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Qurban
                  </button>
                  <button 
                    onClick={() => setGoalType('Aqiqah')}
                    className={`py-3.5 rounded-2xl text-xs font-bold transition-all border ${
                      goalType === 'Aqiqah' 
                        ? 'bg-emerald-600 text-white border-transparent shadow-sm' 
                        : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    Aqiqah
                  </button>
                </div>
              </div>

              {/* Livestock Selection Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Pilihan Hewan</label>
                <select 
                  value={selectedLivestockId}
                  onChange={e => handleLivestockChange(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold text-slate-900 dark:text-white"
                >
                  {livestockPrices.map(livestock => (
                    <option key={livestock.id} value={livestock.id}>
                      {livestock.name} - Rp {livestock.price.toLocaleString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Date Input */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Waktu</label>
                <div className="relative">
                  <Calendar className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
                  <input 
                    type="date" 
                    value={targetDateString}
                    onChange={e => setTargetDateString(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-medium mt-2 block">Default: Idul Adha terdekat (Mei 2027)</span>
              </div>

              {/* Initial deposit selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Setoran Awal (Modal)</label>
                <div className="relative">
                  <Coins className="w-5 h-5 text-amber-500 absolute left-4 top-4" />
                  <input 
                    type="number" 
                    min={0}
                    value={startingDeposit}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setStartingDeposit(val);
                      setSimulatedSaved(val);
                    }}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-extrabold font-mono text-slate-900 dark:text-white"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Column: Calculations & Animated Sinking Progress */}
        <div className="space-y-6">
          
          {/* Target breakdown cards */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Hasil Perhitungan Tabungan Syariah</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-emerald-50/40 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider block">Tabungan Bulanan</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-500 mt-2 block font-mono">
                  Rp {calculations.monthlySavingsNeeded.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-medium text-emerald-700/60 dark:text-emerald-400/60 mt-1 block">selama {calculations.monthsRemaining} bulan</span>
              </div>

              <div className="p-5 bg-amber-50/40 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-2xl">
                <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider block">Tabungan Harian</span>
                <span className="text-2xl font-black text-amber-600 dark:text-amber-500 mt-2 block font-mono">
                  Rp {calculations.dailySavingsNeeded.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] font-medium text-amber-700/60 dark:text-amber-400/60 mt-1 block">selama {calculations.daysRemaining} hari</span>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex items-start space-x-3 mt-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
              <AlertCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p>Tabungan Sinking Fund ini bebas biaya administrasi dan bunga (Riba). Dana Anda tersimpan aman, suci, dan siap diserahkan kepada penyedia hewan qurban tepercaya.</p>
            </div>
          </div>

          {/* Sinking Progress & Interactive simulator */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-6 space-y-6">
            <div>
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Progress Tabungan</h4>
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Simulasi Dana Terkumpul</span>
                <span className="text-lg font-black text-emerald-600 dark:text-emerald-500 font-mono">
                  Rp {simulatedSaved.toLocaleString('id-ID')} <span className="text-xs font-bold text-slate-400">/ Rp {calculations.targetPrice.toLocaleString('id-ID')}</span>
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-3">
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-6 rounded-full overflow-hidden p-1 shadow-inner border border-slate-200/50 flex">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300 shadow-sm flex items-center justify-center min-w-[2.5rem]"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <span className="text-[10px] font-bold text-white leading-none">{progressPercentage.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>Setoran Awal</span>
                <span>Terpenuhi</span>
              </div>
            </div>

            {/* Sinking deposit simulator controls */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Simulasi Tabungan Mandiri Bulanan</span>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed">Gunakan tombol di bawah ini untuk mensimulasikan penambahan setoran tabungan Anda dan amati bagaimana nominal setoran harian/bulanan Anda berkurang secara otomatis!</p>
              
              <div className="flex flex-wrap gap-2 pt-2">
                <button 
                  onClick={() => handleSimulateDeposit(100000)}
                  disabled={simulatedSaved >= calculations.targetPrice}
                  className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>+ Rp 100 Ribu</span>
                </button>
                <button 
                  onClick={() => handleSimulateDeposit(500000)}
                  disabled={simulatedSaved >= calculations.targetPrice}
                  className="bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-emerald-600 dark:text-emerald-400 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>+ Rp 500 Ribu</span>
                </button>
                <button 
                  onClick={handleResetSimulation}
                  className="bg-white dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 border border-slate-200 dark:border-slate-600 text-rose-600 dark:text-rose-400 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center shadow-sm ml-auto"
                >
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Motivational Rotating Islamic Card */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-lg shadow-emerald-500/20 relative overflow-hidden transition-all duration-500">
            <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="relative z-10 space-y-6">
              <h5 className="text-[11px] font-extrabold text-amber-300 uppercase tracking-widest flex items-center">
                <Heart className="w-4 h-4 mr-2 animate-pulse text-rose-400" /> Inspirasi Qurban & Aqiqah
              </h5>
              
              <div className="min-h-[5rem] flex flex-col justify-between">
                <p className="text-sm leading-relaxed font-medium transition-opacity duration-300">
                  "{islamicQuotes[quoteIndex].text}"
                </p>
                <p className="text-xs text-emerald-200 font-bold font-mono mt-4 text-right">
                  — {islamicQuotes[quoteIndex].source}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </DashboardContainer>
  );
};
