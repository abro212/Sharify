import React, { useState, useEffect, useMemo } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { RefreshCcw, Save, AlertTriangle, CheckCircle, TrendingDown, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type Debt = {
  id: string;
  debt_name: string;
  debt_type: string;
  current_balance: number;
  interest_rate: number;
  minimum_payment: number;
};

export const RibaDetox: React.FC = () => {
  const { session } = useAuthStore();
  const [debts, setDebts] = useState<Debt[]>([]);
  
  // Form State
  const [debtName, setDebtName] = useState('');
  const [debtType, setDebtType] = useState('Credit Card');
  const [balance, setBalance] = useState<number>(0);
  const [interest, setInterest] = useState<number>(0);
  const [minPayment, setMinPayment] = useState<number>(0);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load existing debts
  useEffect(() => {
    const fetchDebts = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from('riba_detox_debts')
        .select('*')
        .eq('user_id', session.user.id);
      if (data) setDebts(data);
    };
    fetchDebts();
  }, [session?.user?.id, saveStatus]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || balance <= 0) return;
    
    setIsSaving(true);
    setSaveStatus('idle');

    const { error } = await supabase
      .from('riba_detox_debts')
      .insert({
        user_id: session.user.id,
        debt_name: debtName,
        debt_type: debtType,
        current_balance: balance,
        interest_rate: interest,
        minimum_payment: minPayment
      });

    setIsSaving(false);
    if (!error) {
      setSaveStatus('success');
      setDebtName('');
      setBalance(0);
      setInterest(0);
      setMinPayment(0);
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  // Logic Engine: Avalanche Method (Highest Interest First)
  const sortedDebts = useMemo(() => {
    return [...debts].sort((a, b) => b.interest_rate - a.interest_rate);
  }, [debts]);

  const totalDebt = useMemo(() => debts.reduce((sum, d) => sum + Number(d.current_balance), 0), [debts]);
  const highestPriorityDebt = sortedDebts.length > 0 ? sortedDebts[0] : null;

  const islamicQuotes = [
    "Barangsiapa yang rohnya terpisah dari jasadnya dan ia terbebas dari tiga hal: sombong, ghulul (khianat), dan hutang, maka ia masuk surga. (HR. Ibnu Majah)",
    "Penundaan pembayaran utang oleh orang yang mampu adalah suatu kezaliman. (HR. Bukhari & Muslim)",
    "Ya Allah, aku berlindung kepada-Mu dari siksa kubur, dan aku berlindung kepada-Mu dari fitnah Al-Masih Ad-Dajjal, dan aku berlindung kepada-Mu dari fitnah kehidupan dan fitnah kematian. Ya Allah, aku berlindung kepada-Mu dari perbuatan dosa dan dari utang."
  ];

  return (
    <DashboardContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <RefreshCcw className="h-6 w-6 text-red-500 mr-2" />
          Program Riba Detox
        </h1>
        <p className="text-gray-500">Rencana pelunasan utang sistematis menggunakan metode Avalanche untuk meminimalisir Riba.</p>
      </div>

      {/* Motivational Quote */}
      <div className="bg-gradient-to-r from-[#0F4C3A] to-primary rounded-xl p-6 mb-8 text-white relative overflow-hidden shadow-lg border border-[#0F4C3A]/20">
        <Quote className="absolute top-4 right-4 h-12 w-12 text-white/10" />
        <div className="relative z-10 flex items-start">
          <p className="italic font-serif text-lg leading-relaxed max-w-3xl">"{islamicQuotes[0]}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Input Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="font-bold text-gray-900 mb-6">Tambah Utang Konvensional</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Utang</label>
              <input
                type="text"
                value={debtName}
                onChange={(e) => setDebtName(e.target.value)}
                placeholder="e.g. Kartu Kredit BCA"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Utang</label>
              <select 
                value={debtType} 
                onChange={(e) => setDebtType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="Credit Card">Kartu Kredit</option>
                <option value="Paylater">Paylater / Pinjol</option>
                <option value="Mortgage">KPR Konvensional</option>
                <option value="KTA">KTA (Kredit Tanpa Agunan)</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sisa Saldo (Rp)</label>
              <input
                type="number"
                value={balance || ''}
                onChange={(e) => setBalance(Number(e.target.value))}
                required
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bunga (% per thn)</label>
                <input
                  type="number"
                  value={interest || ''}
                  onChange={(e) => setInterest(Number(e.target.value))}
                  required
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cicilan Min. (Rp)</label>
                <input
                  type="number"
                  value={minPayment || ''}
                  onChange={(e) => setMinPayment(Number(e.target.value))}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className={`w-full mt-6 flex items-center justify-center py-3 rounded-lg font-bold text-sm transition-colors ${
                isSaving ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 text-white shadow-md'
              }`}
            >
              {isSaving ? 'Menyimpan...' : <><Save className="w-4 h-4 mr-2" /> Catat Utang</>}
            </button>
            {saveStatus === 'success' && <p className="text-red-500 text-xs text-center mt-2 flex items-center justify-center"><CheckCircle className="w-3 h-3 mr-1"/> Berhasil dicatat!</p>}
          </form>
        </div>

        {/* Right: Dashboard & Avalanche Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-1">Total Paparan Riba</p>
              <p className="text-2xl font-bold text-red-500 font-mono">Rp {Math.round(totalDebt).toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <p className="text-sm font-medium text-gray-500 mb-1">Jumlah Utang Tercatat</p>
              <p className="text-2xl font-bold text-gray-900">{debts.length} <span className="text-sm font-normal text-gray-400">akun</span></p>
            </div>
          </div>

          {/* Current Target (Highest Priority) */}
          {highestPriorityDebt ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                TARGET PRIORITAS (AVALANCHE)
              </div>
              <h2 className="font-bold text-red-800 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-600" /> Fokus Pelunasan Saat Ini
              </h2>
              
              <div className="bg-white p-4 rounded-lg border border-red-100 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="mb-4 sm:mb-0">
                  <h3 className="font-bold text-gray-900 text-lg">{highestPriorityDebt.debt_name}</h3>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium mr-2">{highestPriorityDebt.debt_type}</span>
                    <TrendingDown className="w-3 h-3 mr-1 text-red-500" /> Bunga: {highestPriorityDebt.interest_rate}%
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <p className="text-xs text-gray-500 mb-1">Sisa Saldo</p>
                  <p className="font-bold text-red-600 font-mono text-xl">Rp {Math.round(highestPriorityDebt.current_balance).toLocaleString('id-ID')}</p>
                </div>
              </div>
              <p className="text-sm text-red-700 mt-4 leading-relaxed">
                <strong>Instruksi Detox:</strong> Bayar cicilan minimum untuk semua utang Anda yang lain, dan alokasikan <strong>semua sisa uang ekstra Anda</strong> untuk melunasi utang ini. Utang ini memiliki bunga tertinggi dan paling merugikan secara finansial maupun syariat.
              </p>
            </div>
          ) : (
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center min-h-[250px]">
              <CheckCircle className="h-12 w-12 text-emerald-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Alhamdulillah!</h3>
              <p className="text-gray-500 max-w-sm">Anda belum mencatat utang konvensional apapun. Pertahankan status bebas Riba Anda.</p>
            </div>
          )}

          {/* All Debts List */}
          {sortedDebts.length > 1 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Antrean Pelunasan Berikutnya</h3>
              <div className="space-y-3">
                {sortedDebts.slice(1).map((debt, index) => (
                  <div key={debt.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center opacity-80">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 font-bold text-xs mr-4">
                        #{index + 2}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{debt.debt_name}</p>
                        <p className="text-xs text-gray-500">Bunga: {debt.interest_rate}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 font-mono text-sm">Rp {Math.round(debt.current_balance).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardContainer>
  );
};
