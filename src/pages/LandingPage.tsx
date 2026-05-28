import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Calculator, RefreshCcw, CheckCircle2, 
  Lock, AlertTriangle, BookOpen, MessageSquare, Briefcase, BrainCircuit,
  TrendingUp, Users, User, Star, Quote, Menu, X, Search, Coins
} from 'lucide-react';
import { useSettingsStore, bustCache } from '../store/settingsStore';
import { supabase } from '../lib/supabase';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettingsStore();

  // ── Direct logo fetch ──────────────────────────────────────────
  // The logo is fetched directly from Supabase here in the component
  // (not just from the store) so it is guaranteed to be the latest
  // value from the database on every page mount.
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLogo = async () => {
      setLogoLoading(true);
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'logo_url')
          .maybeSingle();

        if (!cancelled) {
          if (error) {
            console.error('[LandingPage] Logo fetch error:', error.message);
            setLogoUrl(null);
          } else {
            // Verify the value is a non-empty string before using it
            const rawUrl = data?.value;
            setLogoUrl(rawUrl && rawUrl.trim() !== '' ? rawUrl.trim() : null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[LandingPage] Unexpected logo fetch error:', err);
          setLogoUrl(null);
        }
      } finally {
        if (!cancelled) setLogoLoading(false);
      }
    };

    fetchLogo();
    return () => { cancelled = true; };
  }, []);

  // Cache-bust the URL once at fetch time (not on every render)
  const resolvedLogoUrl = useMemo(() => bustCache(logoUrl), [logoUrl]);

  return (
    <div className="min-h-screen bg-cyber-grid text-slate-800 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* 1. Clean Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {logoLoading ? (
              // Skeleton: shown while direct DB fetch is in-flight
              <div className="h-9 w-24 bg-slate-100 rounded-full animate-pulse" />
            ) : resolvedLogoUrl ? (
              // URL verified non-null from DB — cache-busted at fetch time
              <img
                src={resolvedLogoUrl}
                alt="Sharify Logo"
                className="h-9 object-contain"
                onError={() => setLogoUrl(null)}
              />
            ) : (
              // Fallback to default brand mark when no logo is in DB
              <div className="flex items-center group">
                <div className="h-10 w-10 rounded-2xl bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black text-slate-900 tracking-tight">Sharify</span>
              </div>
            )}
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Fitur</a>
            <a href="#solusi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Solusi</a>
            <a href="#teknologi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Teknologi</a>
            <Link to="/upgrade" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Harga</Link>
          </div>
          
          {/* Desktop CTAs - Using Fully Rounded Pill Buttons (like screenshot) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">Masuk</Link>
            <Link to="/signup" className="bg-[#10B981] hover:bg-[#0d9488] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]">
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors border border-slate-100"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fade-in z-50">
            <div className="flex flex-col space-y-1">
              <a 
                href="#features" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Fitur
              </a>
              <a 
                href="#solusi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Solusi
              </a>
              <a 
                href="#teknologi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Teknologi
              </a>
              <Link 
                to="/upgrade" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Harga
              </Link>
            </div>
            
            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-slate-700 hover:text-slate-900 py-3 rounded-full border border-slate-200 bg-white"
              >
                Masuk
              </Link>
              <Link 
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-bold bg-[#10B981] hover:bg-[#0d9488] text-white py-3 rounded-full shadow-lg shadow-emerald-500/10"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <main className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden relative bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-[#10B981] text-xs font-bold tracking-wider uppercase mb-6 border border-emerald-100 shadow-sm">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#10B981] mr-2"></span>
                AI-Powered Islamic Finance
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15]">
                {settings.hero_title.split(' ').map((word, i) => (
                  <span key={i} className={i >= 3 ? "text-[#10B981] inline-block mr-2" : "inline-block mr-2"}>
                    {word}
                  </span>
                ))}
              </h1>
              
              <p className="text-base lg:text-lg text-slate-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                {settings.hero_subtitle}
              </p>
              
              {/* Fully rounded pills for hero buttons (like reference image) */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup" className="w-full sm:w-auto bg-[#10B981] hover:bg-[#0d9488] text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-emerald-500/15 transition-all duration-300 hover:-translate-y-0.5 text-center text-base">
                  {settings.hero_cta_primary}
                </Link>
                <a href="#features" className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#10B981] border-2 border-[#10B981] px-8 py-4 rounded-full font-bold shadow-sm transition-all duration-300 flex items-center justify-center text-base hover:-translate-y-0.5">
                  {settings.hero_cta_secondary}
                </a>
              </div>
            </div>
            
            {/* Visual Mockups Representing Clean Mobile Screens From Reference Image */}
            <div className="lg:w-1/2 w-full relative flex justify-center h-[540px]">
              
              {/* Phone Mockup 1: "Let's Get Started" Splash Screen */}
              <div className="w-[250px] h-[500px] bg-white border-[6px] border-slate-100 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col p-6 z-20 hover:scale-[1.02] transition-transform duration-300 select-none">
                {/* Speaker & camera dots */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-200 rounded-full" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1 mb-6">
                  <span>8:01</span>
                  <div className="flex space-x-1">
                    <span className="w-2.5 h-2 bg-slate-300 rounded-xs block" />
                    <span className="w-3 h-2 bg-slate-300 rounded-xs block" />
                  </div>
                </div>

                {/* Minimalist Flag Illustration from Screenshot */}
                <div className="flex-1 flex flex-col items-center justify-center my-2">
                  <div className="relative w-36 h-36 bg-emerald-50/70 rounded-full flex items-center justify-center border border-emerald-100/50 mb-6">
                    <div className="absolute w-24 h-16 border-2 border-[#10B981] border-dashed rounded-full opacity-35 animate-spin [animation-duration:20s]" />
                    <div className="h-14 w-14 rounded-full bg-[#10B981] flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <ShieldCheck className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 text-center tracking-tight leading-none">Let's Get Started</h3>
                  <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed px-2 font-medium">
                    Sign Up Now And Enjoy Seamless Sharia Experience.
                  </p>
                  
                  {/* Small Pagination Dots */}
                  <div className="flex justify-center space-x-1.5 mt-4">
                    <span className="w-2.5 h-1 bg-[#10B981] rounded-full" />
                    <span className="w-1.5 h-1 bg-slate-200 rounded-full" />
                    <span className="w-1.5 h-1 bg-slate-200 rounded-full" />
                  </div>
                </div>

                {/* Splash CTAs */}
                <div className="space-y-2 mt-auto">
                  <Link to="/signup" className="block w-full bg-[#10B981] text-white text-[11px] font-extrabold py-3.5 rounded-full text-center shadow-sm shadow-emerald-500/5 hover:bg-emerald-600 transition-colors">
                    Create Account
                  </Link>
                  <Link to="/login" className="block w-full border border-[#10B981] text-[#10B981] text-[11px] font-extrabold py-3.5 rounded-full text-center hover:bg-emerald-50/50 transition-colors bg-white">
                    Login
                  </Link>
                </div>
              </div>

              {/* Phone Mockup 2: Home Dashboard / Recent Transaction Screen (Layered behind) */}
              <div className="w-[250px] h-[500px] bg-white border-[6px] border-slate-100 rounded-[3rem] shadow-xl absolute -right-4 top-10 overflow-hidden flex flex-col z-10 opacity-90 hidden sm:flex hover:opacity-100 transition-opacity duration-300">
                {/* Speaker bar */}
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-slate-50 rounded-full flex items-center justify-center">
                  <div className="w-8 h-1 bg-slate-200 rounded-full" />
                </div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 p-6 pb-2 mt-1">
                  <span>8:01</span>
                </div>

                {/* Dashboard Navbar */}
                <div className="flex justify-between items-center px-4 py-2 border-b border-slate-50">
                  <Menu className="h-4 w-4 text-slate-500" />
                  <div className="flex items-center space-x-1">
                    <span className="h-1.5 w-1.5 bg-[#10B981] rounded-full animate-ping" />
                    <span className="text-[10px] font-black text-slate-900 tracking-wider">SHARIFY</span>
                  </div>
                  <Search className="h-4 w-4 text-slate-500" />
                </div>

                {/* Dashboard Content */}
                <div className="p-3 flex-1 flex flex-col space-y-3.5 overflow-y-auto">
                  {/* Clean Promo Banner */}
                  <div className="bg-[#10B981] p-3 rounded-2xl text-white relative overflow-hidden flex flex-col justify-between h-24">
                    <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-emerald-600 rounded-full opacity-50" />
                    <div>
                      <p className="text-[8px] opacity-75 font-bold uppercase tracking-wider">Daily Charity Offer</p>
                      <h4 className="text-[11px] font-bold leading-tight mt-0.5">Dapatkan 10% Berkah Cashback Sedekah</h4>
                    </div>
                    <button className="bg-white text-[#10B981] text-[8px] font-extrabold px-3 py-1 rounded-full w-max shadow-sm">
                      See Now
                    </button>
                  </div>

                  {/* Feature Grid */}
                  <div>
                    <h5 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">Sharify Features</h5>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { icon: Coins, text: 'Cashflow' },
                        { icon: RefreshCcw, text: 'Riba Detox' },
                        { icon: Calculator, text: 'Zakat' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-emerald-50/60 p-2 rounded-xl border border-emerald-100/30 flex flex-col items-center justify-center text-center">
                          <item.icon className="h-4 w-4 text-[#10B981] mb-1" />
                          <span className="text-[8px] font-bold text-[#10B981]">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Transaction List */}
                  <div>
                    <h5 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">Recent Transaction</h5>
                    <div className="space-y-2">
                      {[
                        { name: 'Mike Lyne', desc: 'Charity Deposit', val: 'Rp 100k', time: 'Just now' },
                        { name: 'John Messi', desc: 'Zakat Maal', val: 'Rp 2.5jt', time: '1 hour ago' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-50/60 p-2.5 rounded-xl flex items-center justify-between border border-slate-100/50">
                          <div className="flex items-center space-x-2">
                            <div className="h-7 w-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[9px] text-slate-600">
                              {item.name[0]}
                            </div>
                            <div>
                              <p className="text-[9px] font-bold text-slate-900 leading-none">{item.name}</p>
                              <p className="text-[7px] text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-[9px] font-bold text-[#10B981] block leading-none">{item.val}</span>
                            <span className="text-[7px] text-slate-400 block mt-0.5">{item.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Clean Bottom Navigation Bar */}
                <div className="bg-white border-t border-slate-100 h-11 flex items-center justify-around px-4 mt-auto">
                  <ShieldCheck className="h-4 w-4 text-[#10B981]" />
                  <Coins className="h-4 w-4 text-slate-400" />
                  <User className="h-4 w-4 text-slate-400" />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* 3. Trust & Syariah Compliance */}
      <section className="py-12 border-y border-slate-100 relative bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-center text-xs font-bold text-slate-400 tracking-[0.2em] uppercase mb-8">Dirancang Sesuai Standar Kepatuhan Syariah</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { icon: ShieldCheck, text: 'DSN-MUI Compliant' },
              { icon: BookOpen, text: 'Sharia Board Supervised' },
              { icon: Lock, text: 'Bank-Grade Security' }
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center bg-white px-5 py-3 rounded-2xl border border-slate-100 shadow-sm hover:scale-105 transition-all duration-300">
                <badge.icon className="h-5 w-5 mr-3 text-[#10B981]" />
                <span className="font-bold text-slate-800 text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Problem */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {settings.fitur_title}
            </h2>
            <p className="text-base lg:text-lg text-slate-500 font-medium">
              {settings.fitur_subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: AlertTriangle, title: 'Jebakan Riba', desc: 'Tingginya paparan utang konvensional (Paylater, KTA) tanpa rencana pelunasan yang jelas.', color: 'red' },
              { icon: BrainCircuit, title: 'Literasi Syariah Rendah', desc: 'Sulit membedakan produk keuangan halal dan haram di era digital.', color: 'amber' },
              { icon: Briefcase, title: 'Penasihat Mahal', desc: 'Konsultasi dengan perencana keuangan syariah profesional seringkali tidak terjangkau.', color: 'emerald' },
              { icon: RefreshCcw, title: 'Layanan Terpecah', desc: 'Zakat, investasi, dan waris dikelola secara terpisah membuat pusing.', color: 'blue' }
            ].map((problem, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center relative overflow-hidden group hover:shadow-md hover:border-emerald-500/10 transition-all duration-300">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  problem.color === 'red' ? 'bg-red-50 text-red-500' :
                  problem.color === 'amber' ? 'bg-amber-50 text-amber-500' :
                  problem.color === 'emerald' ? 'bg-emerald-50 text-[#10B981]' :
                  'bg-blue-50 text-blue-500'
                }`}>
                  <problem.icon className="h-6 w-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-3 tracking-tight">{problem.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Solution (Features Grid) */}
      <section id="solusi" className="py-24 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {settings.solusi_title}
            </h2>
            <p className="text-base lg:text-lg text-slate-500 font-medium">
              {settings.solusi_subtitle}
            </p>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: HeartPulse, title: 'Health Check Syariah', desc: 'Skoring kesehatan keuangan berbasis rasio utang dan paparan riba secara komprehensif.' },
              { icon: MessageSquare, title: 'AI Assistant (Gemini)', desc: 'Konsultasi Fiqh Muamalah instan 24/7 untuk menjawab keraguan transaksi Anda.' },
              { icon: ShieldCheck, title: 'Program Riba Detox', desc: 'Rencana aksi sistematis berbantuan AI untuk melunasi utang konvensional dengan tuntas.' },
              { icon: TrendingUp, title: 'Halal Investment', desc: 'Rekomendasi instrumen investasi (Sukuk, Reksa Dana Syariah) yang disaring sesuai profil risiko Anda.' },
              { icon: Calculator, title: 'Zakat & Wakaf Center', desc: 'Kalkulasi Nisab dinamis terhubung dengan API harga emas real-time untuk akurasi tinggi.' },
              { icon: Users, title: 'Faraidh Simulator', desc: 'Edukasi dan simulasi pembagian waris Islam untuk mencegah konflik keluarga di masa depan.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-[#10B981]/30 transition-all duration-300 group">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 group-hover:scale-105 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-[#10B981]" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed font-semibold">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Clean Solid Green AI Section (Inspired by Screen 3 solid green theme) */}
      <section id="teknologi" className="max-w-7xl mx-auto my-12 bg-[#10B981] rounded-[2.5rem] py-20 text-white relative overflow-hidden shadow-xl px-8 sm:px-16">
        <div className="absolute -right-20 -bottom-20 w-[400px] h-[400px] bg-emerald-600 rounded-full opacity-60 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <span className="text-emerald-100 font-extrabold text-xs uppercase tracking-widest block mb-4">Sharia Intelligence Hub</span>
            <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">Didukung Teknologi AI Terdepan</h2>
            <p className="text-emerald-50/80 mb-8 text-base lg:text-lg font-medium leading-relaxed">
              Sistem kami menggunakan arsitektur mutakhir untuk memastikan fatwa dan panduan yang akurat, aman, dan dapat diandalkan secara syariah.
            </p>
            
            <ul className="space-y-6">
              {[
                { title: 'Retrieval-Augmented Generation (RAG)', desc: 'AI kami tidak berhalusinasi. Seluruh respon merujuk langsung pada Knowledge Base fatwa DSN-MUI yang sah.' },
                { title: 'Open Banking Integration', desc: 'Sinkronisasi mutasi rekening secara aman untuk mendeteksi pengeluaran dan transaksi non-halal secara otomatis.' },
                { title: 'Privasi Data Berlapis', desc: 'Enkripsi End-to-End standar perbankan. Data keuangan pribadi Anda dijamin aman.' }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center mr-4 shrink-0 mt-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-base mb-1 tracking-tight">{item.title}</h4>
                    <p className="text-xs text-emerald-50/70 leading-relaxed font-semibold">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Right Clean Core HUD Panel Visual */}
          <div className="lg:w-1/2 w-full flex justify-center items-center">
            <div className="bg-white p-8 rounded-3xl text-slate-800 shadow-2xl w-full max-w-md border border-slate-100 relative group transition-transform duration-300 hover:scale-[1.01]">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-[#10B981] border border-emerald-100">
                    <BrainCircuit className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 tracking-wide uppercase font-sans">Sharify Engine</h4>
                    <span className="text-[9px] text-[#10B981] block font-mono uppercase tracking-wider">Active Sharia AI Node</span>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-[#10B981] border border-emerald-100">
                  Active
                </span>
              </div>

              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, title: 'Verified Sharia Knowledge Base', desc: 'Seluruh konsultasi diselaraskan dengan fatwa resmi DSN-MUI untuk jaminan keabsahan.' },
                  { icon: Calculator, title: 'AI-Powered Fiqh Analysis', desc: 'Mesin pemrosesan bahasa pintar yang memetakan akad, menganalisis riba, dan menghitung waris.' }
                ].map((value, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-colors duration-300">
                    <div className="h-8 w-8 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center shrink-0 border border-emerald-100">
                      <value.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-slate-900 tracking-tight">{value.title}</h5>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-semibold">
                        {value.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Clean Comparison Table */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {settings.harga_title}
            </h2>
            <p className="text-base lg:text-lg text-slate-500 font-medium">
              {settings.harga_subtitle}
            </p>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100">
                    <th className="p-6 font-extrabold text-slate-900 text-sm w-1/3">Fitur Platform</th>
                    <th className="p-6 font-bold text-slate-400 text-xs tracking-wider uppercase text-center w-1/3">Aplikasi Keuangan Biasa</th>
                    <th className="p-6 font-extrabold text-white bg-[#10B981] text-xs tracking-wider uppercase text-center w-1/3">Ekosistem Sharify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    ['Pencatatan Pemasukan/Pengeluaran', true, true],
                    ['Kalkulasi Zakat Otomatis Sesuai Emas', false, true],
                    ['Deteksi & Rekomendasi Riba (Riba Detox)', false, true],
                    ['Simulasi Hukum Waris Islam (Faraidh)', false, true],
                    ['Konsultasi AI Fiqh Muamalah 24/7', false, true],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                      <td className="p-6 text-sm font-extrabold text-slate-900">{row[0]}</td>
                      <td className="p-6 text-center text-slate-400">
                        {row[1] ? <CheckCircle2 className="h-5 w-5 mx-auto text-slate-300" /> : '-'}
                      </td>
                      <td className="p-6 text-center bg-emerald-50/30 border-l border-slate-50">
                        <CheckCircle2 className="h-5 w-5 mx-auto text-[#10B981]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#10B981] font-bold text-xs uppercase tracking-widest block mb-4">Testimoni Pengguna</span>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">Kisah Hijrah Finansial</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmad S.', role: 'Wirausaha', avatar: 'AS', text: 'Alhamdulillah, melalui fitur Riba Detox Sharify, saya berhasil memetakan utang konvensional saya dan melunasinya secara sistematis. Hidup jadi jauh lebih tenang.' },
              { name: 'Fatima R.', role: 'Ibu Rumah Tangga', avatar: 'FR', text: 'Kalkulator Zakatnya sangat menolong! Perhitungan nisab emas otomatis terupdate real-time sehingga saya tidak perlu ragu lagi dalam menghitung kewajiban maal.' },
              { name: 'Budi W.', role: 'Karyawan Swasta', avatar: 'BW', text: 'Fitur Faraidh dan AI Asistennya sangat edukatif untuk mengenalkan pembagian harta waris syariah kepada keluarga besar kami secara adil dan transparan.' }
            ].map((person, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-[#10B981]/10" />
                
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star key={starIdx} className="h-4 w-4 fill-current mr-0.5" />
                  ))}
                </div>
                
                <p className="text-slate-500 text-xs italic mb-6 leading-relaxed font-semibold">"{person.text}"</p>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-[#10B981] text-white rounded-xl mr-3 flex items-center justify-center font-extrabold text-sm shadow-md shadow-emerald-500/10">
                    {person.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-sm tracking-tight">{person.name}</h4>
                    <p className="text-[10px] text-[#10B981] font-bold uppercase tracking-wider">{person.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA & Footer */}
      <section className="bg-white border-t border-slate-100 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center mb-20 bg-[#10B981] text-white p-12 rounded-[2.5rem] shadow-xl relative overflow-hidden">
          <div className="absolute -left-10 -top-10 w-32 h-32 bg-emerald-600 rounded-full opacity-40" />
          <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-tight tracking-tight relative z-10">
            Mulai Perjalanan Finansial Syariah Anda Hari Ini.
          </h2>
          <p className="text-base lg:text-lg text-emerald-50 mb-10 max-w-2xl mx-auto font-medium relative z-10">
            Daftar gratis sekarang dan ambil langkah pertama menuju kebebasan finansial yang berkah dan diridhai Allah SWT.
          </p>
          <Link to="/signup" className="inline-block bg-white text-[#10B981] hover:bg-slate-50 px-10 py-4.5 rounded-full text-base font-extrabold shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] relative z-10">
            Daftar Sekarang - Gratis
          </Link>
        </div>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                {settings.logo_url ? (
                  <img src={bustCache(settings.logo_url)} alt="Logo" className="h-7 object-contain" />
                ) : (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/10">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-2.5 text-xl font-black text-slate-900 tracking-tight">Sharify</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-semibold leading-relaxed">{settings.footer_desc}</p>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-sm tracking-tight">Produk</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/upgrade" className="hover:text-[#10B981] transition-colors">Harga Layanan</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Health Check</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Kalkulator Zakat</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-sm tracking-tight">Kebijakan</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><a href="#" className="hover:text-[#10B981] transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-[#10B981] transition-colors">Sanggahan Hukum</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-xs font-semibold text-slate-400 pt-8 border-t border-slate-100">
            {settings.footer_copyright}
          </div>
        </footer>
      </section>

    </div>
  );
};
