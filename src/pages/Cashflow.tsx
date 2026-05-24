import React, { useState, useEffect, useRef } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { 
  Heart, Coins, Trash2, CheckCircle2, AlertCircle, 
  TrendingUp, TrendingDown, Coffee, Car, FileText, Sparkles, HelpCircle 
} from 'lucide-react';

interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  category: string;
  created_at: string;
}

export const Cashflow: React.FC = () => {
  const { user } = useAuthStore();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Makanan');

  const amountInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    'Makanan', 
    'Transportasi', 
    'Tagihan & Utilitas', 
    'Kesehatan', 
    'Pendidikan',
    'Amal/Sedekah',
    'Lain-lain'
  ];

  // Fetch transactions on load
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('cashflow_transactions')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data) {
          setTransactions(data as Transaction[]);
        } else if (error) {
          console.error('Error fetching transactions:', error.message);
        }
      } catch (err) {
        console.error('Unexpected error fetching transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

  // Handle Add Transaction
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount.trim()) return;

    setIsSaving(true);
    const numAmount = Number(amount);
    const newTransaction = {
      user_id: user.id,
      amount: numAmount,
      type,
      description: description.trim() || category,
      category
    };

    try {
      const { data, error } = await supabase
        .from('cashflow_transactions')
        .insert(newTransaction)
        .select()
        .single();

      if (!error && data) {
        setTransactions(prev => [data as Transaction, ...prev]);
        // Reset form
        setAmount('');
        setDescription('');
        setType('expense');
        setCategory('Makanan');
      } else if (error) {
        console.error('Error saving transaction:', error.message);
      }
    } catch (err) {
      console.error('Unexpected error saving transaction:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Delete Transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cashflow_transactions')
        .delete()
        .eq('id', id);

      if (!error) {
        setTransactions(prev => prev.filter(t => t.id !== id));
      } else {
        console.error('Error deleting transaction:', error.message);
      }
    } catch (err) {
      console.error('Unexpected error deleting transaction:', err);
    }
  };

  // Quick CTA to trigger Sedekah logging
  const handleQuickSedekahCTA = () => {
    setType('expense');
    setCategory('Amal/Sedekah');
    setDescription('Sedekah Pembersih Jiwa');
    if (amountInputRef.current) {
      amountInputRef.current.focus();
    }
  };

  // Calculations
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const netBalance = totalIncome - totalExpense;

  // Check if user has logged any charity (Amal/Sedekah) this current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const hasSedekahThisMonth = transactions.some(t => {
    const tDate = new Date(t.created_at);
    return (
      t.category === 'Amal/Sedekah' &&
      tDate.getMonth() === currentMonth &&
      tDate.getFullYear() === currentYear
    );
  });

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Makanan':
        return <Coffee className="w-4 h-4 text-amber-500" />;
      case 'Transportasi':
        return <Car className="w-4 h-4 text-blue-500" />;
      case 'Amal/Sedekah':
        return <Heart className="w-4 h-4 text-rose-500" />;
      case 'Tagihan & Utilitas':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      default:
        return <Coins className="w-4 h-4 text-emerald-500" />;
    }
  };

  return (
    <DashboardContainer>
      
      {/* Dynamic Spiritual Nudging Alert Banner */}
      <div className="mb-8">
        {hasSedekahThisMonth ? (
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 flex items-start space-x-3 shadow-sm animate-fade-in">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-800">Alhamdulillah! Kamu sudah bersedekah bulan ini</h3>
              <p className="text-xs text-emerald-700 mt-0.5">Semoga berkah berkali lipat dan menyucikan setiap rupiah harta yang kamu miliki.</p>
            </div>
            <Sparkles className="w-5 h-5 text-amber-500 ml-auto animate-pulse flex-shrink-0" />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-pulse">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-6 h-6 text-amber-600 mt-0.5 sm:mt-0 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-amber-800">Kamu belum mencatat sedekah bulan ini</h3>
                <p className="text-xs text-amber-700 mt-0.5">Yuk, bersihkan hartamu dengan berbagi kepada yang membutuhkan hari ini.</p>
              </div>
            </div>
            <button 
              onClick={handleQuickSedekahCTA}
              className="bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#bfa032] text-white font-extrabold py-2 px-4 rounded-xl text-xs transition-colors flex items-center shadow-sm w-full sm:w-auto justify-center"
            >
              <Heart className="w-3.5 h-3.5 mr-1 text-white animate-pulse" /> Catat Sedekah Sekarang
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Coins className="h-8 w-8 text-[#0F4C3A] mr-3" />
          Daily Cashflow & Sedekah
        </h1>
        <p className="text-gray-500 mt-1">Pantau pemasukan dan pengeluaran harian Anda, sembari menjaga istiqomah berbagi berkah melalui sedekah.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Transaction Logging Form (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-50 pb-3">Catat Transaksi Baru</h3>
            
            <form onSubmit={handleAddTransaction} className="space-y-4">
              
              {/* Type Toggle: Income vs Expense */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Tipe Aliran Dana</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    type="button"
                    onClick={() => { setType('expense'); setCategory('Makanan'); }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      type === 'expense' 
                        ? 'bg-rose-600 text-white border-transparent shadow-sm shadow-rose-200' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    <TrendingDown className="w-3.5 h-3.5 mr-1 inline" /> Pengeluaran
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setType('income'); setCategory('Gaji'); }}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all border ${
                      type === 'income' 
                        ? 'bg-emerald-600 text-white border-transparent shadow-sm shadow-emerald-200' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border-gray-200'
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 mr-1 inline" /> Pemasukan
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Nominal (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-gray-400">Rp</span>
                  <input 
                    ref={amountInputRef}
                    required
                    type="number"
                    min={1}
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    placeholder="0"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-extrabold font-mono text-gray-800"
                  />
                </div>
              </div>

              {/* Category Input */}
              {type === 'expense' ? (
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Kategori Pengeluaran</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold text-gray-800"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Sumber Pendapatan</label>
                  <select 
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold text-gray-800"
                  >
                    <option value="Gaji">Gaji / Upah</option>
                    <option value="Investasi">Hasil Investasi Halal</option>
                    <option value="Bonus">Bonus / Hadiah</option>
                    <option value="Lain-lain">Lain-lain</option>
                  </select>
                </div>
              )}

              {/* Description Input */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Deskripsi Catatan (Opsional)</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Keterangan singkat..."
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold text-gray-800"
                />
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan ke Supabase...' : 'Simpan Transaksi'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Visual Summary & Recent list (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Visual Summary counters */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">Ringkasan Bulan Ini</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Total Masuk</span>
                <span className="text-lg font-extrabold text-emerald-800 mt-1 block font-mono">
                  Rp {totalIncome.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Total Keluar</span>
                <span className="text-lg font-extrabold text-rose-800 mt-1 block font-mono">
                  Rp {totalExpense.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Saldo Bersih</span>
                <span className={`text-lg font-extrabold mt-1 block font-mono ${netBalance >= 0 ? 'text-gray-800' : 'text-rose-600'}`}>
                  Rp {netBalance.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Recent list transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Histori Transaksi</h3>
              <span className="text-[10px] text-gray-400 font-bold">{transactions.length} Transaksi</span>
            </div>

            <div className="divide-y divide-gray-100 max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-400">
                  <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-xs font-semibold">Memuat transaksi dari Supabase...</p>
                </div>
              ) : transactions.length > 0 ? (
                transactions.map(item => (
                  <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/30 transition-all group">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                        {getCategoryIcon(item.category)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-gray-800">{item.description}</h4>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase">{item.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <span className={`text-xs font-extrabold font-mono ${
                        item.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {item.type === 'income' ? '+' : '-'} Rp {Number(item.amount).toLocaleString('id-ID')}
                      </span>
                      <button 
                        onClick={() => handleDeleteTransaction(item.id)}
                        className="text-gray-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-1"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <HelpCircle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="font-bold text-xs">Belum ada pencatatan transaksi</p>
                  <p className="text-[10px] text-gray-400 mt-1">Gunakan formulir di sebelah kiri untuk mencatat transaksi keuangan pertama Anda.</p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};
