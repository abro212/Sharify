import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, MessageSquare, Calculator, RefreshCcw,
  ShieldCheck, Lock, ChevronDown, 
  Globe, Sparkles, Menu, X, ShieldAlert,
  Moon, Sun, Check, HeartHandshake
} from 'lucide-react';
import { FloatingWhatsAppChat } from '../components/layout/FloatingWhatsAppChat';
import { useThemeStore } from '../store/useThemeStore';
import { useAuthStore } from '../store/authStore';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useThemeStore();
  const { session } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('beranda');

  // Quick Zakat Calculator State on Landing Page
  const [zakatType, setZakatType] = useState<'profesi' | 'maal'>('profesi');
  const [incomeAmount, setIncomeAmount] = useState<number>(12000000);
  const goldPricePerGram = 1200000; // Rp 1.2jt/gram
  const nisabThreshold = zakatType === 'profesi' ? (85 * goldPricePerGram) / 12 : (85 * goldPricePerGram);
  const isZakatWajib = incomeAmount >= nisabThreshold;
  const zakatPayable = isZakatWajib ? incomeAmount * 0.025 : 0;

  // Auto redirect to /dashboard if already logged in
  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* 1. Pristine Sticky Glass Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/app logo.png" alt="Sharify Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#064E3B] dark:text-emerald-400 tracking-tight leading-none">Sharify</span>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mt-0.5">AI-Based Islamic Financial Advisory</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {[
              { id: 'beranda', label: 'Beranda', href: '#' },
              { id: 'fitur', label: 'Fitur Unggulan', href: '#fitur' },
              { id: 'zakat-calc', label: 'Kalkulator Zakat', href: '#kalkulator' },
              { id: 'detox', label: 'Riba & Judol Detox', href: '#detox' },
              { id: 'harga', label: 'Harga', href: '#harga' },
              { id: 'tentang-kami', label: 'Tentang Kami', href: '/tentang-kami' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-bold transition-all relative py-1 ${
                  activeTab === item.id 
                    ? 'text-[#064E3B] dark:text-emerald-400 border-b-2 border-[#064E3B] dark:border-emerald-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#064E3B] dark:hover:text-emerald-400'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle Light/Dark Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>

            {/* Language Selector Pill */}
            <div className="relative flex items-center space-x-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>ID</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Login & Register CTAs */}
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-extrabold text-[#064E3B] dark:text-emerald-400 hover:underline px-3 py-2"
            >
              Masuk
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-extrabold px-6 py-2.5 rounded-full shadow-md shadow-emerald-950/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              Daftar Sekarang
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-xl"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-300 rounded-xl"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 space-y-3 shadow-xl animate-fade-in">
            {[
              { label: 'Beranda', href: '#' },
              { label: 'Fitur Unggulan', href: '#fitur' },
              { label: 'Kalkulator Zakat', href: '#kalkulator' },
              { label: 'Riba & Judol Detox', href: '#detox' },
              { label: 'Harga & Paket', href: '#harga' },
              { label: 'Tentang Kami', href: '/tentang-kami' },
            ].map((item, idx) => (
              <a 
                key={idx} 
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#064E3B] dark:hover:text-emerald-400 py-2 border-b border-slate-100 dark:border-slate-800/60"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
                className="w-full bg-[#064E3B] text-white text-xs font-extrabold py-3 rounded-xl cursor-pointer"
              >
                Masuk Akun
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/signup'); }}
                className="w-full bg-amber-500 text-slate-950 text-xs font-extrabold py-3 rounded-xl cursor-pointer"
              >
                Daftar Akun Baru
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/50 via-white to-[#F8FAFC] dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-extrabold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-600 fill-amber-600 animate-pulse" />
                <span>AI-Based Islamic Financial Advisor #1 di Indonesia</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.18] tracking-tight">
                Bimbingan Keuangan Islami Bebas Riba, Presisi Zakat & <span className="text-[#064E3B] dark:text-emerald-400 underline decoration-amber-400 decoration-4 underline-offset-4">Investasi Halal</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Sharify menggabungkan kecerdasan buatan Gemini AI dengan standar Fiqh Muamalah DSN-MUI untuk membantu Anda mengelola dana keluarga, zakat, serta bebas dari jeratan riba & judi online.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full sm:w-auto bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs sm:text-sm px-8 py-4 rounded-full shadow-lg shadow-emerald-950/20 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Coba Sharify Gratis</span>
                </button>

                <button
                  onClick={() => navigate('/chat')}
                  className="w-full sm:w-auto bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 font-bold text-xs sm:text-sm px-6 py-4 rounded-full shadow-xs transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Konsultasi AI Syariah Demo</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span className="flex items-center text-emerald-700 dark:text-emerald-400 font-bold">
                  <ShieldCheck className="w-4.5 h-4.5 mr-1.5 text-[#064E3B] dark:text-emerald-400" /> 100% Standar DSN-MUI
                </span>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <span className="flex items-center text-slate-600 dark:text-slate-300 font-bold">
                  <Lock className="w-4 h-4 mr-1.5 text-amber-500" /> Enkripsi & Privasi Aman
                </span>
              </div>
            </div>

            {/* Right Side: Dual Mobile Screenshots Showcase Frame */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-6">
              <div className="relative w-full max-w-[460px] h-[520px] sm:h-[560px]">
                
                {/* Back Phone: Screener Module Mockup */}
                <div className="absolute right-0 top-6 w-[240px] sm:w-[260px] bg-white dark:bg-slate-900 border-[6px] border-slate-900 dark:border-slate-700 rounded-[2.5rem] shadow-2xl overflow-hidden transform rotate-6 scale-95 z-10 transition-transform hover:rotate-3 duration-300">
                  <div className="bg-slate-900 text-white text-[9px] px-4 py-1.5 flex justify-between items-center font-semibold">
                    <span>09:47</span>
                    <div className="w-12 h-2.5 bg-black rounded-full"></div>
                  </div>
                  <div className="p-3 space-y-3 bg-slate-50 dark:bg-slate-950 min-h-[440px]">
                    <div className="flex items-center justify-between text-slate-800 dark:text-white text-[10px] font-bold">
                      <span>Investasi Halal JII</span>
                      <span className="text-emerald-600 font-mono text-[9px]">ISSI Passed</span>
                    </div>
                    <div className="bg-[#064E3B] text-white p-3 rounded-2xl space-y-1 relative overflow-hidden">
                      <h4 className="text-[11px] font-extrabold leading-tight">Screener Saham Syariah</h4>
                      <p className="text-[8px] text-emerald-100 opacity-80">Screening rasio utang & pendapatan non-halal</p>
                      <button className="bg-amber-500 text-slate-950 text-[8px] font-bold px-2 py-0.5 rounded-md mt-1">
                        Screen Saham
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { code: 'TLKM', name: 'Telkom Indonesia', status: 'Lolos 100%' },
                        { code: 'ICBP', name: 'Indofood CBP', status: 'Lolos 100%' },
                        { code: 'ANTM', name: 'Aneka Tambang', status: 'Lolos 100%' },
                      ].map((st, i) => (
                        <div key={i} className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 flex justify-between items-center text-[9px]">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{st.code}</span>
                            <span className="text-slate-400 text-[8px]">{st.name}</span>
                          </div>
                          <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded text-[8px]">
                            {st.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Front Phone: Main App Dashboard Screen */}
                <div className="absolute left-0 top-0 w-[250px] sm:w-[270px] bg-white dark:bg-slate-900 border-[6px] border-slate-900 dark:border-slate-700 rounded-[2.5rem] shadow-2xl overflow-hidden transform -rotate-3 z-20 transition-transform hover:rotate-0 duration-300">
                  <div className="bg-slate-900 text-white text-[9px] px-4 py-1.5 flex justify-between items-center font-semibold">
                    <span>09:47</span>
                    <div className="w-12 h-2.5 bg-black rounded-full"></div>
                  </div>
                  <div className="p-3.5 space-y-3 bg-[#F8FAFC] dark:bg-slate-900 min-h-[450px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase font-bold block">Assalamu alaikum</span>
                        <span className="text-[11px] font-extrabold text-slate-900 dark:text-white">Ahmad Fauzi</span>
                      </div>
                      <span className="bg-amber-400 text-slate-950 text-[8px] font-black px-2 py-0.5 rounded-full">PRO</span>
                    </div>

                    {/* Deep Emerald Card Mock */}
                    <div className="bg-gradient-to-r from-[#064E3B] to-emerald-800 text-white p-3.5 rounded-2xl space-y-2 shadow-md">
                      <span className="text-[8px] text-emerald-200 uppercase font-bold tracking-wider">Health Score Syariah</span>
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-black font-mono">88<span className="text-[10px] text-emerald-200">/100</span></span>
                        <span className="text-[9px] bg-emerald-500/30 px-2 py-0.5 rounded-full font-bold text-emerald-200">Excellent</span>
                      </div>
                      <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[88%] rounded-full"></div>
                      </div>
                    </div>

                    {/* Features Grid Mock */}
                    <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center space-x-1.5">
                        <Calculator className="w-3.5 h-3.5 text-amber-500" />
                        <span className="truncate">Kalkulator Zakat</span>
                      </div>
                      <div className="bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-100 dark:border-slate-700 flex items-center space-x-1.5">
                        <RefreshCcw className="w-3.5 h-3.5 text-rose-500" />
                        <span className="truncate">Riba Detox</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Features Section (Fitur Unggulan) */}
      <section id="fitur" className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Ekosistem Keuangan Syariah</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fitur Lengkap untuk Keberkahan Keuangan Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Seluruh alat perencanaan, audit, dan penataan dana disesuaikan dengan Fiqh Muamalah terkini.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MessageSquare,
                title: 'AI Chatbot Syariah 24/7',
                desc: 'Konsultasi hukum akad, nisab zakat, dan fatwa DSN-MUI kapan saja secara instan.',
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
              },
              {
                icon: Calculator,
                title: 'Kalkulator Zakat Presisi',
                desc: 'Hitung Zakat Maal & Profesi berbasis harga emas realtime plus opsi laporan pengurang pajak PKP.',
                color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/40',
              },
              {
                icon: TrendingUp,
                title: 'Asset Screener JII & ISSI',
                desc: 'Audit kepatuhan saham halal & rasio utang ribawi perusahaan secara transparan.',
                color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40',
              },
              {
                icon: RefreshCcw,
                title: 'Riba & Debt Detox',
                desc: 'Susun strategi pelunasan utang bertahap dengan metode Avalanche & Snowball.',
                color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
              },
              {
                icon: ShieldAlert,
                title: 'Judol Detox Program',
                desc: 'Program proteksi kecanduan judi online, pemulihan harta & pelacakan streak hari bebas judol.',
                color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
              },
              {
                icon: HeartHandshake,
                title: 'Baitul Mal Keluarga',
                desc: 'Kelola anggaran bersama pasangan, tabungan qurban, dan dana kebajikan keluarga.',
                color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/40',
              },
            ].map((f, i) => (
              <div 
                key={i} 
                className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 space-y-3 hover:border-emerald-500/40 transition-all group"
              >
                <div className={`p-3.5 rounded-2xl w-fit ${f.color}`}>
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Interactive Zakat Calculator Section on Landing Page */}
      <section id="kalkulator" className="py-16 sm:py-20 bg-[#F8FAFC] dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider">Simulasi Otomatis</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hitung Zakat Anda Secara Langsung
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Cobalah simulasi perhitungan zakat berbasis nishab emas 85 gram di bawah ini.
            </p>
          </div>

          {/* Interactive Calculator Box */}
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-lg border border-slate-200/80 dark:border-slate-800 space-y-6">
            
            {/* Toggle Tab */}
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl max-w-md mx-auto">
              <button
                onClick={() => setZakatType('profesi')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  zakatType === 'profesi' 
                    ? 'bg-white dark:bg-slate-900 text-[#064E3B] dark:text-emerald-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Zakat Profesi (Bulanan)
              </button>
              <button
                onClick={() => setZakatType('maal')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  zakatType === 'maal' 
                    ? 'bg-white dark:bg-slate-900 text-[#064E3B] dark:text-emerald-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                Zakat Maal (Tahunan)
              </button>
            </div>

            {/* Input & Calculation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {zakatType === 'profesi' ? 'Penghasilan Bulanan (Rp)' : 'Total Aset Tabungan & Emas (Rp)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">Rp</span>
                  <input
                    type="number"
                    value={incomeAmount || ''}
                    onChange={(e) => setIncomeAmount(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1 font-medium">
                  Harga emas acuan: Rp 1.200.000 / gram (Nisab: Rp {Math.round(nisabThreshold).toLocaleString('id-ID')})
                </p>
              </div>

              {/* Result Box */}
              <div className="p-5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-2xl border border-emerald-100 dark:border-emerald-900/40 text-center md:text-left space-y-1">
                <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block">
                  Kewajiban Zakat (2.5%)
                </span>
                {isZakatWajib ? (
                  <div>
                    <span className="text-2xl font-black text-[#064E3B] dark:text-emerald-400 font-mono">
                      Rp {Math.round(zakatPayable).toLocaleString('id-ID')}
                    </span>
                    <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                      ✓ Wajib Dikeluarkan {zakatType === 'profesi' ? 'Setiap Bulan' : 'Setiap Tahun (Haul)'}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 block">Belum Mencapai Nisab</span>
                    <span className="text-[10px] text-slate-400 block">Disarankan mengeluarkan Infaq / Sedekah sukarela.</span>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Pricing Tiers Section (#harga) */}
      <section id="harga" className="py-16 sm:py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Pilihan Paket Langganan</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Investasikan Keberkahan Keuangan Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Pilih paket yang paling sesuai dengan kebutuhan pribadi, profesional, atau keluarga Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tier 1: Free */}
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">Basic Plan</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Free</h3>
                <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">Rp 0 <span className="text-xs font-normal text-slate-400">/selamanya</span></div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Kalkulator Zakat Dasar</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Konsultasi AI 5 Pesan/bln</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Overview Health Score</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Mulai Gratis
              </button>
            </div>

            {/* Tier 2: Plus */}
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Plus Plan</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Sharify Plus</h3>
                <div className="text-2xl font-black text-[#064E3B] dark:text-emerald-400 font-mono">Rp 49.000 <span className="text-xs font-normal text-slate-400">/bln</span></div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Seluruh Fitur Free</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Screener Saham Syariah JII</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Program Riba & Judol Detox</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Qurban Auto-Saver</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-[#064E3B] hover:bg-[#043E2F] text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Pilih Plus
              </button>
            </div>

            {/* Tier 3: Pro (Popular Badge) */}
            <div className="p-6 rounded-3xl bg-gradient-to-b from-[#064E3B] to-emerald-950 text-white border-2 border-amber-400 shadow-xl flex flex-col justify-between space-y-6 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                ⭐ Paling Populer
              </span>
              <div className="space-y-4 pt-1">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block">Pro Plan</span>
                <h3 className="text-xl font-black text-white">Sharify Pro</h3>
                <div className="text-2xl font-black text-amber-300 font-mono">Rp 99.000 <span className="text-xs font-normal text-emerald-200">/bln</span></div>
                <ul className="space-y-2 text-xs text-emerald-100 font-medium">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> AI Consultation Unlimited</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> Akad Clause Analyzer AI</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> Laporan Pajak Zakat Resmi</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-amber-400 shrink-0" /> Prioritas Support Ustadz</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Langganan Pro
              </button>
            </div>

            {/* Tier 4: Family Plan */}
            <div className="p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block">Family Plan</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Baitul Mal Family</h3>
                <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono">Rp 149.000 <span className="text-xs font-normal text-slate-400">/bln</span></div>
                <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Hingga 5 Anggota Keluarga</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Faraidh & Wasiat Generator</li>
                  <li className="flex items-center"><Check className="w-3.5 h-3.5 mr-2 text-emerald-500 shrink-0" /> Baitul Mal Dompet Bersama</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-colors cursor-pointer"
              >
                Pilih Family
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Footer Banner CTA */}
      <footer className="bg-[#064E3B] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-b border-emerald-800 pb-12">
            <div className="lg:col-span-8 space-y-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Mulai Perjalanan Keuangan Islami Berkah Anda Hari Ini
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100/90 font-medium max-w-xl">
                Bergabunglah dengan ribuan keluarga Muslim Indonesia yang telah mengelola zakat, dana darurat, dan investasi halal bersama Sharify.
              </p>
            </div>
            
            <div className="lg:col-span-4 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/signup')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3.5 px-6 rounded-2xl shadow-md transition-all cursor-pointer"
              >
                Daftar Sekarang Gratis
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-3.5 px-6 rounded-2xl border border-white/20 transition-all cursor-pointer"
              >
                Masuk ke Dashboard
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/80 font-medium">
            <p>© 2026 Sharify. AI-Based Islamic Financial Advisory. All Rights Reserved.</p>
            <div className="flex space-x-4">
              <Link to="/terms" className="hover:text-white">Syarat & Ketentuan</Link>
              <Link to="/privacy-policy" className="hover:text-white">Kebijakan Privasi</Link>
              <Link to="/disclaimer" className="hover:text-white">Disclaimer Syariah</Link>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Admin Chat */}
      <FloatingWhatsAppChat />
    </div>
  );
};
