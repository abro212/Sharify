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
    <DashboardContainer>
      
      {/* Toast System */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-gradient-to-tr from-[#0F4C3A] to-[#10B981] text-white p-4 rounded-xl shadow-lg border border-emerald-500 flex items-center justify-between animate-slide-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-amber-300 animate-bounce flex-shrink-0" />
            <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Sparkles className="h-8 w-8 text-[#0F4C3A] mr-3 animate-pulse" />
          Qurban & Aqiqah Auto-Saver
        </h1>
        <p className="text-gray-500 mt-1">Sinking fund cerdas untuk merencanakan ibadah Qurban Idul Adha atau Aqiqah buah hati dengan target harian/bulanan terukur.</p>
      </div>

      {/* 1. Livestock Live Mock Prices Ticker */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {livestockPrices.map(livestock => (
          <button
            key={livestock.id}
            onClick={() => handleLivestockChange(livestock.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              selectedLivestockId === livestock.id 
                ? 'bg-[#0F4C3A] text-white border-transparent shadow-md transform -translate-y-0.5' 
                : 'bg-white text-gray-800 border-gray-100 hover:bg-gray-50/50'
            }`}
          >
            <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
              selectedLivestockId === livestock.id 
                ? 'bg-white/20 text-amber-300' 
                : 'bg-gray-100 text-gray-600'
            }`}>{livestock.category}</span>
            <h4 className="text-xs font-extrabold mt-2 truncate">{livestock.name}</h4>
            <p className={`text-md font-black mt-1 font-mono ${
              selectedLivestockId === livestock.id ? 'text-amber-400' : 'text-[#0F4C3A]'
            }`}>
              Rp {livestock.price.toLocaleString('id-ID')}
            </p>
            <span className="block text-[8px] text-gray-400 mt-2">Harga Pasar Acuan 2026</span>
          </button>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Calculator (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-50 pb-3">Konfigurasi Tabungan</h3>
            
            <div className="space-y-4">
              
              {/* Goal Type Selector */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Jenis Ibadah</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setGoalType('Qurban')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      goalType === 'Qurban' 
                        ? 'bg-[#0F4C3A] text-white border-transparent' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    Qurban (Idul Adha)
                  </button>
                  <button 
                    onClick={() => setGoalType('Aqiqah')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      goalType === 'Aqiqah' 
                        ? 'bg-[#0F4C3A] text-white border-transparent' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    Aqiqah Anak
                  </button>
                </div>
              </div>

              {/* Livestock Selection Dropdown */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Pilihan Hewan Qurban / Aqiqah</label>
                <select 
                  value={selectedLivestockId}
                  onChange={e => handleLivestockChange(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold text-gray-800"
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
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Target Tanggal Penyembelihan</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input 
                    type="date" 
                    value={targetDateString}
                    onChange={e => setTargetDateString(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold text-gray-800"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1.5 block">Default diset ke prakiraan hari raya Idul Adha terdekat (Mei 2027)</span>
              </div>

              {/* Initial deposit selection */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Setoran Awal (Modal Tabungan)</label>
                <div className="relative">
                  <Coins className="w-4 h-4 text-[#D4AF37] absolute left-3 top-3.5" />
                  <input 
                    type="number" 
                    min={0}
                    value={startingDeposit}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setStartingDeposit(val);
                      setSimulatedSaved(val);
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-extrabold font-mono text-gray-800"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Calculations & Animated Sinking Progress (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Target breakdown cards */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">Hasil Perhitungan Tabungan Syariah</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-[#0F4C3A] uppercase tracking-wider block">Tabungan Bulanan</span>
                <span className="text-2xl font-black text-emerald-800 mt-1.5 block font-mono">
                  Rp {calculations.monthlySavingsNeeded.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-gray-400 mt-1 block">selama {calculations.monthsRemaining} bulan</span>
              </div>

              <div className="p-4 bg-amber-50/40 border border-amber-100 rounded-2xl">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Tabungan Harian</span>
                <span className="text-2xl font-black text-amber-800 mt-1.5 block font-mono">
                  Rp {calculations.dailySavingsNeeded.toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-gray-400 mt-1 block">selama {calculations.daysRemaining} hari</span>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 flex items-start space-x-2 mt-4 text-[10px] text-gray-500">
              <AlertCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p>Tabungan Sinking Fund ini bebas biaya administrasi dan bunga (Riba). Dana Anda tersimpan aman, suci, dan siap diserahkan kepada penyedia hewan qurban tepercaya.</p>
            </div>
          </div>

          {/* Sinking Progress & Interactive simulator */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <div>
              <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2">Progress Sinking Fund Tabungan</h4>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-600">Simulasi Dana Terkumpul</span>
                <span className="text-md font-black text-[#0F4C3A] font-mono">
                  Rp {simulatedSaved.toLocaleString('id-ID')} <span className="text-xs font-normal text-gray-400">/ Rp {calculations.targetPrice.toLocaleString('id-ID')}</span>
                </span>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-100 h-5 rounded-full overflow-hidden p-1 shadow-inner border border-gray-200/50">
                <div 
                  className="bg-gradient-to-r from-[#0F4C3A] via-[#10B981] to-[#D4AF37] h-full rounded-full transition-all duration-300 relative shadow-sm"
                  style={{ width: `${progressPercentage}%` }}
                >
                  <span className="absolute right-2 top-0.5 text-[9px] font-black text-white">{progressPercentage.toFixed(0)}%</span>
                </div>
              </div>
              
              <div className="flex justify-between text-[10px] text-gray-400 font-bold">
                <span>Setoran Awal</span>
                <span>Terpenuhi</span>
              </div>
            </div>

            {/* Sinking deposit simulator controls */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-3">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Simulasi Tabungan Mandiri Bulanan</span>
              <p className="text-[11px] text-gray-500 leading-relaxed">Gunakan tombol di bawah ini untuk mensimulasikan penambahan setoran tabungan Anda dan amati bagaimana nominal setoran harian/bulanan Anda berkurang secara otomatis!</p>
              
              <div className="flex flex-wrap gap-2 pt-1.5">
                <button 
                  onClick={() => handleSimulateDeposit(100000)}
                  disabled={simulatedSaved >= calculations.targetPrice}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-[#0F4C3A] font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center space-x-1"
                >
                  <span>+ Rp 100 Ribu</span>
                </button>
                <button 
                  onClick={() => handleSimulateDeposit(500000)}
                  disabled={simulatedSaved >= calculations.targetPrice}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-[#0F4C3A] font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center space-x-1"
                >
                  <span>+ Rp 500 Ribu</span>
                </button>
                <button 
                  onClick={handleResetSimulation}
                  className="bg-white hover:bg-red-50 border border-gray-200 text-red-600 font-bold py-2 px-3 rounded-lg text-xs transition-colors flex items-center space-x-1 ml-auto"
                >
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* Motivational Rotating Islamic Card */}
          <div className="bg-gradient-to-br from-[#0F4C3A] to-[#0A3427] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden transition-all duration-500">
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="space-y-4">
              <h5 className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center">
                <Heart className="w-3.5 h-3.5 mr-1.5 animate-pulse" /> Inspirasi Qurban & Aqiqah
              </h5>
              
              <div className="min-h-[4rem] flex flex-col justify-between">
                <p className="text-xs leading-relaxed italic text-emerald-100 font-medium transition-opacity duration-300">
                  "{islamicQuotes[quoteIndex].text}"
                </p>
                <p className="text-[10px] text-emerald-300 font-mono mt-3 text-right">
                  — {islamicQuotes[quoteIndex].source}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
