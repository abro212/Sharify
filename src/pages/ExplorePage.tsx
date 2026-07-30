import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import {
  Search,
  TrendingUp,
  MessageSquare,
  Calculator,
  RefreshCcw,
  FileText,
  Target,
  BookOpen,
  Activity,
  ChevronRight,
  Sparkles,
  Heart,
  Calendar,
  PieChart,
  BadgePercent
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Semua Fitur' },
    { id: 'investasi', label: 'Investasi & Pasar' },
    { id: 'zakat', label: 'Zakat & Wasiat' },
    { id: 'detox', label: 'Detox & Pelunasan' },
    { id: 'keluarga', label: 'Keluarga & Rencana' },
    { id: 'ai', label: 'AI & Konsultasi' },
  ];

  const exploreItems = [
    {
      id: 'investasi',
      title: 'Screener Saham Syariah',
      description: 'Filter saham halal JII & ISSI berdasarkan kriteria DSN-MUI.',
      icon: TrendingUp,
      path: '/screener',
      category: 'investasi',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'ai-chat',
      title: 'AI Chatbot Syariah',
      description: 'Konsultasi hukum muamalah & akad syariah 24/7 dengan Gemini AI.',
      icon: MessageSquare,
      path: '/chat',
      category: 'ai',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'zakat',
      title: 'Kalkulator Zakat & Nisab',
      description: 'Hitung Zakat Maal & Profesi presisi berbasis harga emas terkini.',
      icon: Calculator,
      path: '/zakat',
      category: 'zakat',
      color: 'bg-amber-500/10 text-[#064E3B] dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      id: 'zakat-tax',
      title: 'Laporan Pengurang Pajak Zakat',
      description: 'Unduh laporan Zakat resmi sebagai pengurang Penghasilan Kena Pajak (PKP).',
      icon: BadgePercent,
      path: '/zakat-tax-report',
      category: 'zakat',
      color: 'bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      id: 'cashflow',
      title: 'Manajemen Cashflow Harian',
      description: 'Pencatatan pemasukan, pengeluaran, dan alokasi infak harian.',
      icon: PieChart,
      path: '/cashflow',
      category: 'keluarga',
      color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    },
    {
      id: 'riba-detox',
      title: 'Riba Detox Manager',
      description: 'Identifikasi pinjaman dan susun strategi pelunasan utang bertahap.',
      icon: RefreshCcw,
      path: '/riba-detox',
      category: 'detox',
      color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    },
    {
      id: 'faraidh',
      title: 'Faraidh & Wasiat Generator',
      description: 'Simulasi pembagian waris Faraidh dan pembuat draf surat wasiat otomatis.',
      icon: FileText,
      path: '/wasiat-generator',
      category: 'zakat',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'goals',
      title: 'Goal-Based Planning',
      description: 'Rencanakan target dana Umrah, DP Rumah Syariah, dan tabungan berkah.',
      icon: Target,
      path: '/goals',
      category: 'keluarga',
      color: 'bg-[#064E3B]/10 text-[#064E3B] dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'qurban',
      title: 'Qurban & Tabungan Qurban',
      description: 'Kalkulator serta rencana cicilan tabungan hewan qurban tahunan.',
      icon: Calendar,
      path: '/qurban-saver',
      category: 'keluarga',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'health-check',
      title: 'Financial Health Score',
      description: 'Evaluasi skor kesehatan keuangan syariah dan tingkat dana darurat.',
      icon: Activity,
      path: '/health-check',
      category: 'investasi',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'family',
      title: 'Baitul Mal Keluarga',
      description: 'Kelola anggaran bersama keluarga dan dana kebajikan dompet syariah.',
      icon: Heart,
      path: '/family-dashboard',
      category: 'keluarga',
      color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    },
    {
      id: 'akad',
      title: 'Akad Clause Analyzer AI',
      description: 'Audit pasal-pasal perjanjian pinjaman/investasi dengan AI Syariah.',
      icon: Sparkles,
      path: '/akad-analyzer',
      category: 'ai',
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      id: 'edukasi',
      title: 'Edukasi & Visi Sharify',
      description: 'Pelajari dasar hukum Fiqh Muamalah dan visi keuangan syariah.',
      icon: BookOpen,
      path: '/tentang-kami',
      category: 'investasi',
      color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    },
  ];

  const filteredItems = exploreItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <DashboardContainer pageTitle="Explore Services">
      <div className="space-y-6">
        
        {/* Top Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore Services</h1>
            <p className="text-xs text-slate-500 font-medium">Jelajahi seluruh layanan, kalkulator, dan modul AI Sharify Syariah</p>
          </div>
          <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1.5 rounded-full w-fit">
            ✨ {exploreItems.length} Modul Aktif
          </span>
        </div>

        {/* Search Bar & Category Pills */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-3.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari modul, fitur zakat, saham syariah..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#064E3B] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Feature Cards Grid (3 Columns on Desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer flex items-start justify-between space-x-3"
            >
              <div className="flex items-start space-x-3.5 min-w-0">
                <div className={`p-3 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 space-y-1">
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
              
              <div className="h-7 w-7 rounded-full bg-slate-50 dark:bg-slate-800 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950 flex items-center justify-center shrink-0 transition-colors">
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-2 text-slate-400">
              <Search className="w-8 h-8 mx-auto opacity-40 text-emerald-600" />
              <p className="text-xs font-bold">Tidak ada modul yang sesuai</p>
              <p className="text-[11px]">Coba cari dengan kata kunci lain atau pilih kategori "Semua Fitur".</p>
            </div>
          )}
        </div>

      </div>
    </DashboardContainer>
  );
};
