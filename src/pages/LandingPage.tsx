import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Calculator, RefreshCcw, CheckCircle2, 
  Lock, AlertTriangle, BookOpen, MessageSquare, Briefcase, BrainCircuit,
  TrendingUp, Users, Star, Quote, Menu, X, Search, Coins,
  Shield, Zap, Crown, Check
} from 'lucide-react';
import { useSettingsStore, bustCache } from '../store/settingsStore';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { FloatingAIChat } from '../components/layout/FloatingAIChat';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettingsStore();
  const { session, profile } = useAuthStore();
  const currentRole = profile?.role || 'free';
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);
  const handlePlanClick = () => {
    if (!session) {
      navigate('/signup');
    } else {
      navigate('/upgrade');
    }
  };

  const tiers = [
    {
      name: 'Free',
      role: 'free',
      price: 'Rp 0',
      description: 'Essential tools for personal Sharia compliance.',
      icon: <Shield className="w-5 h-5 text-slate-400" />,
      iconClass: 'bg-slate-50 border-slate-100 text-slate-400',
      features: [
        'Zakat Calculator',
        'Basic Financial Health Check',
        'Limited AI Assistant Queries',
      ],
      buttonText: !session ? 'Daftar Gratis' : currentRole === 'free' ? 'Plan Aktif' : 'Downgrade',
      buttonStyle: 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    },
    {
      name: 'Sharify Plus',
      role: 'plus',
      price: 'Rp 49.000',
      period: '/mo',
      description: 'Advanced tools for active financial management.',
      icon: <Zap className="w-5 h-5 text-[#10B981]" />,
      iconClass: 'bg-emerald-50 border-emerald-100/50 text-[#10B981]',
      features: [
        'Everything in Free',
        'Unlimited AI Assistant Queries',
        'Full Riba Detox Action Plan',
        'Detailed Analytics'
      ],
      buttonText: !session ? 'Upgrade ke Plus' : currentRole === 'plus' ? 'Plan Aktif' : 'Upgrade to Plus',
      buttonStyle: 'bg-[#10B981] text-white hover:bg-emerald-600',
      popular: false
    },
    {
      name: 'Sharify Pro',
      role: 'pro',
      price: 'Rp 149.000',
      period: '/mo',
      description: 'Expert guidance and complex portfolio management.',
      icon: <Crown className="w-5 h-5 text-amber-500" />,
      iconClass: 'bg-amber-50 border-amber-100/50 text-amber-500',
      features: [
        'Everything in Plus',
        '1-on-1 Human Scholar Consultations',
        'Direct Chat with Ustadz',
        'Priority Support'
      ],
      buttonText: !session ? 'Upgrade ke Pro' : currentRole === 'pro' ? 'Plan Aktif' : 'Upgrade to Pro',
      buttonStyle: 'bg-[#F59E0B] text-white hover:bg-[#d97706]',
      popular: true
    },
    {
      name: 'Family Plan',
      role: 'family',
      price: 'Rp 199.000',
      period: '/mo',
      description: 'Comprehensive Sharia planning for the whole household.',
      icon: <Users className="w-5 h-5 text-[#0F4C3A]" />,
      iconClass: 'bg-[#E6F4ED] border-[#10B981]/25 text-[#0F4C3A]',
      features: [
        'Up to 4 Pro Accounts',
        'Faraidh (Inheritance) Simulator',
        'Wakaf Planning Tools',
        'Shared Family Dashboards'
      ],
      buttonText: !session ? 'Mulai Family' : currentRole === 'family' ? 'Plan Aktif' : 'Upgrade to Family',
      buttonStyle: 'bg-[#0F4C3A] text-white hover:bg-[#0c3d2e]',
      popular: false
    }
  ];

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
            <Link to="/tentang-kami" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Tentang Kami</Link>
            <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Fitur</a>
            <a href="#solusi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Solusi</a>
            <a href="#teknologi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Teknologi</a>
            <a href="#harga" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Harga</a>
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
              <Link 
                to="/tentang-kami" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Tentang Kami
              </Link>
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
              <a 
                href="#harga" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Harga
              </a>
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
              
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.15]">
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

                  <h3 className="text-lg font-black text-slate-900 text-center tracking-tight leading-none">Mulai Perjalanan Anda ✨</h3>
                  <p className="text-[10px] text-slate-400 text-center mt-2 leading-relaxed px-2 font-medium">
                    Daftar sekarang agar perencanaan finansial Anda semakin terarah dan berkah.
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
                    Daftar Sekarang
                  </Link>
                  <Link to="/login" className="block w-full border border-[#10B981] text-[#10B981] text-[11px] font-extrabold py-3.5 rounded-full text-center hover:bg-emerald-50/50 transition-colors bg-white">
                    Masuk
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
                      <p className="text-[8px] opacity-75 font-bold uppercase tracking-wider">Sedekah Harian Era Baru</p>
                      <h4 className="text-[11px] font-bold leading-tight mt-0.5">Aura Berkah: Cashback Sedekah 10% ✨</h4>
                    </div>
                    <button className="bg-white text-[#10B981] text-[8px] font-extrabold px-3 py-1 rounded-full w-max shadow-sm">
                      Klaim Sekarang
                    </button>
                  </div>

                  {/* Feature Grid */}
                  <div>
                    <h5 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">Fitur Andalan</h5>
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
                    <h5 className="text-[10px] font-extrabold text-slate-800 uppercase tracking-wider mb-2">Transaksi Terkini</h5>
                    <div className="space-y-2">
                      {[
                        { name: 'Abi Dan Ummi', desc: 'Sedekah Harian', val: 'Rp 100k', time: 'Baru Saja' },
                        { name: 'Zulkifli Sharia', desc: 'Zakat Maal', val: 'Rp 2.5jt', time: '1 Jam Lalu' }
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

      {/* 4. The Problem / Sharia Challenges */}
      <section id="solusi" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Tantangan Finansial Muslim Modern
            </h2>
            <p className="text-base lg:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Masalah nyata yang dihadapi umat dalam mengelola keuangan harian, menuntut solusi cerdas yang sesuai syariat.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: AlertTriangle, title: 'Jebakan Riba Konvensional 🚨', desc: 'Penggunaan pinjaman konvensional tanpa skema pelunasan yang jelas dapat mengganggu stabilitas keuangan Anda.', color: 'red' },
              { icon: BrainCircuit, title: 'Keterbatasan Literasi Syariah', desc: 'Seringkali kesulitan dalam membedakan produk keuangan yang halal dan haram di era modern.', color: 'amber' },
              { icon: Briefcase, title: 'Biaya Konsultasi Tinggi', desc: 'Biaya jasa konsultasi perencana keuangan profesional seringkali tidak terjangkau bagi sebagian besar kalangan.', color: 'emerald' },
              { icon: RefreshCcw, title: 'Sistem Tidak Terintegrasi', desc: 'Aplikasi yang terpisah menyulitkan pengelolaan zakat, investasi, dan warisan secara efisien.', color: 'blue' }
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
      <section id="features" className="py-24 bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {settings.fitur_title}
            </h2>
            <p className="text-base lg:text-lg text-slate-500 font-medium">
              {settings.fitur_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: HeartPulse, title: 'Health Check Syariah 🩺', desc: 'Periksa skor kepatuhan syariah agar tabungan Anda aman, bersih, dan senantiasa berkah!' },
              { icon: MessageSquare, title: 'AI Co-Pilot (Gemini) 🤖', desc: 'Tanya jawab seputar Fiqh Muamalah secara instan 24/7 agar keputusan transaksi Anda semakin mantap.' },
              { icon: ShieldCheck, title: 'Rencana Riba Detox 🍃', desc: 'Roadmap pelunasan cicilan konvensional berbantuan AI agar bebas riba seutuhnya.' },
              { icon: TrendingUp, title: 'Investasi Halal Era Baru 📈', desc: 'Rekomendasi Sukuk dan Reksa Dana Syariah yang sesuai dengan profil risiko Anda.' },
              { icon: Calculator, title: 'Zakat & Wakaf Hub 💰', desc: 'Kalkulasi Nisab otomatis terhubung dengan harga emas real-time agar perhitungan Anda lebih akurat.' },
              { icon: Users, title: 'Faraidh Simulator 👨‍👩‍👧‍👦', desc: 'Simulasi pembagian warisan syariah agar perencanaan masa depan keluarga lebih terjamin.' }
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
            <h2 className="text-2xl sm:text-3.5xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">Didukung Teknologi AI Terdepan</h2>
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
      <section id="harga" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              {settings.harga_title}
            </h2>
            <p className="text-base lg:text-lg text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed">
              {settings.harga_subtitle}
            </p>
          </div>

          {/* Pricing Tiers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 pt-8 mb-20 max-w-7xl mx-auto">
            {tiers.map((tier) => (
              <div 
                key={tier.name} 
                className={`relative bg-white rounded-[2rem] border p-6 flex flex-col transition-all duration-500 group ${
                  tier.popular 
                    ? 'border-[#F59E0B] shadow-xl scale-102 lg:scale-105 z-10 hover:-translate-y-3.5 hover:shadow-2xl hover:shadow-[#F59E0B]/25 hover:border-amber-400' 
                    : 'border-slate-100 shadow-sm hover:-translate-y-2.5 hover:shadow-2xl hover:shadow-[#10B981]/15 hover:border-[#10B981]/30'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 group-hover:scale-105 z-20">
                    <span className="bg-[#F59E0B] text-slate-950 text-[10px] font-black uppercase tracking-widest py-1.5 px-4.5 rounded-full shadow-md border border-amber-300">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                
                <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 leading-tight transition-colors duration-300 group-hover:text-[#10B981]">{tier.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 h-10 leading-relaxed font-semibold">{tier.description}</p>
                  </div>
                  <div className={`w-9 h-9 rounded-full border flex items-center justify-center shrink-0 ml-2 shadow-xs transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${tier.iconClass}`}>
                    {tier.icon}
                  </div>
                </div>

                <div className="my-5 flex items-baseline">
                  <span className="text-3xl font-black text-slate-900 tracking-tight leading-none transition-transform duration-300 group-hover:scale-102">{tier.price}</span>
                  {tier.period && <span className="text-xs text-slate-400 font-bold lowercase ml-1.5 leading-none">{tier.period}</span>}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start transform transition-transform duration-300 group-hover:translate-x-0.5">
                      <Check className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5 text-[#10B981]" />
                      <span className="text-xs text-slate-600 font-semibold leading-normal">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick()}
                  disabled={session !== null && currentRole === tier.role}
                  className={`w-full py-3.5 px-4 rounded-full font-black text-xs tracking-wider uppercase transition-all duration-300 flex justify-center items-center shadow-xs cursor-pointer hover:scale-[1.03] hover:shadow-lg active:scale-[0.97] ${
                    (session !== null && currentRole === tier.role) 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none' 
                      : tier.buttonStyle
                  }`}
                >
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* Comparison Table Section Header (Subtle) */}
          <div className="text-center mb-10">
            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">Perbandingan Fitur Selengkapnya</h3>
            <p className="text-xs text-slate-400 mt-1 font-semibold">Bandingkan kapabilitas teknis di setiap paket secara rinci</p>
          </div>
          
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden max-w-5xl mx-auto">
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
          <h2 className="text-2xl sm:text-3.5xl lg:text-5xl font-black mb-6 leading-tight tracking-tight relative z-10">
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
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
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
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Fitur Dasar (Free)</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Health Check Syariah</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Kalkulator Zakat</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Cashflow & Sedekah</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">AI Co-Pilot Assistant</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Fitur Premium (Pro/Family)</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Rencana Riba Detox</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Halal Asset Screener</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Smart Akad Analyzer</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Qurban Auto-Saver</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Zakat-to-Tax Report</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Baitul Mal Keluarga</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Digital Wasiat Generator</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Kebijakan</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/terms" className="hover:text-[#10B981] transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#10B981] transition-colors">Kebijakan Privasi</Link></li>
                <li><Link to="/disclaimer" className="hover:text-[#10B981] transition-colors">Sanggahan Hukum</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Perusahaan</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/tentang-kami" className="hover:text-[#10B981] transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-xs font-semibold text-slate-400 pt-8 border-t border-slate-100">
            {settings.footer_copyright}
          </div>
        </footer>
      </section>

      {/* Floating AI Chat Button */}
      <FloatingAIChat unlimited />
    </div>
  );
};
