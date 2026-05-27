import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Calculator, RefreshCcw, CheckCircle2, 
  Lock, AlertTriangle, BookOpen, MessageSquare, Briefcase, BrainCircuit,
  TrendingUp, Users, Star, Quote, Menu, X
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
    <div className="min-h-screen bg-cyber-grid text-emerald-950 font-sans selection:bg-emerald-500 selection:text-white relative overflow-x-hidden">
      
      {/* 1. Navbar */}
      <nav className="fixed w-full z-50 bg-[#F4FAF7]/80 backdrop-blur-xl border-b border-emerald-500/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {logoLoading ? (
              // Skeleton: shown while direct DB fetch is in-flight
              <div className="h-9 w-24 bg-emerald-100 rounded animate-pulse" />
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
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0F4C3A] to-emerald-600 flex items-center justify-center shadow-md shadow-emerald-900/10 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black text-[#0F4C3A] tracking-tight bg-gradient-to-r from-[#0F4C3A] to-emerald-600 bg-clip-text text-transparent">Sharify</span>
              </div>
            )}
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-semibold text-[#0F4C3A] hover:text-emerald-600 transition-all hover:translate-y-[-1px] relative py-1">Fitur</a>
            <a href="#solusi" className="text-sm font-semibold text-[#0F4C3A] hover:text-emerald-600 transition-all hover:translate-y-[-1px] relative py-1">Solusi</a>
            <a href="#teknologi" className="text-sm font-semibold text-[#0F4C3A] hover:text-emerald-600 transition-all hover:translate-y-[-1px] relative py-1">Teknologi</a>
            <Link to="/upgrade" className="text-sm font-semibold text-[#0F4C3A] hover:text-emerald-600 transition-all hover:translate-y-[-1px] relative py-1">Harga</Link>
          </div>
          
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-[#0F4C3A] hover:text-emerald-600 px-4 py-2 rounded-lg transition-colors">Masuk</Link>
            <Link to="/signup" className="relative group overflow-hidden bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-md hover:shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98]">
              <span className="relative z-10">Daftar Gratis</span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-[#D4AF37] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-[#0F4C3A] hover:bg-emerald-500/10 focus:outline-none transition-colors border border-emerald-500/10"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-emerald-500/10 px-4 pt-2 pb-6 space-y-4 shadow-xl animate-fade-in z-50">
            <div className="flex flex-col space-y-2">
              <a 
                href="#features" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#0F4C3A] hover:text-emerald-600 py-3 transition-colors border-b border-emerald-500/5"
              >
                Fitur
              </a>
              <a 
                href="#solusi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#0F4C3A] hover:text-emerald-600 py-3 transition-colors border-b border-emerald-500/5"
              >
                Solusi
              </a>
              <a 
                href="#teknologi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#0F4C3A] hover:text-emerald-600 py-3 transition-colors border-b border-emerald-500/5"
              >
                Teknologi
              </a>
              <Link 
                to="/upgrade" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#0F4C3A] hover:text-emerald-600 py-3 transition-colors border-b border-emerald-500/5"
              >
                Harga
              </Link>
            </div>
            
            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-extrabold text-[#0F4C3A] hover:text-emerald-600 py-3 rounded-xl border border-emerald-500/15 bg-white/50"
              >
                Masuk
              </Link>
              <Link 
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-extrabold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white py-3 rounded-xl shadow-lg shadow-emerald-950/10"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <main className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden relative">
        {/* Glow ambient spots */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/10 text-[#0F4C3A] text-xs font-black tracking-wider uppercase mb-6 border border-emerald-500/20 shadow-sm shadow-emerald-500/5">
                <span className="flex h-2.5 w-2.5 rounded-full bg-[#D4AF37] mr-2 animate-pulse"></span>
                AI-Powered Islamic Finance
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-black text-[#0F4C3A] tracking-tight mb-6 leading-[1.12]">
                {settings.hero_title.split(' ').map((word, i) => (
                  <span key={i} className={i >= 3 ? "shimmer-emerald-text inline-block" : "inline-block mr-2"}>
                    {word}{' '}
                  </span>
                ))}
              </h1>
              
              <p className="text-base lg:text-lg text-emerald-800/80 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                {settings.hero_subtitle}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup" className="w-full sm:w-auto bg-[#0F4C3A] hover:bg-emerald-800 text-white px-8 py-4 rounded-xl font-extrabold shadow-xl shadow-emerald-950/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 text-center text-base">
                  {settings.hero_cta_primary}
                </Link>
                <a href="#features" className="w-full sm:w-auto bg-white/70 backdrop-blur-md hover:bg-white text-[#0F4C3A] border border-emerald-500/20 px-8 py-4 rounded-xl font-extrabold shadow-sm transition-all duration-300 flex items-center justify-center text-base hover:-translate-y-0.5">
                  {settings.hero_cta_secondary}
                </a>
              </div>
            </div>
            
            {/* Cyber-Islamic Glassmorphic Dashboard HUD Mockup */}
            <div className="lg:w-1/2 w-full relative flex justify-center">
              <div className="relative w-full max-w-md aspect-[1.1] rounded-3xl p-6 bg-white/60 backdrop-blur-xl border border-emerald-500/20 shadow-2xl shadow-emerald-900/5 hologram-scanner overflow-hidden transition-all duration-500 hover:scale-[1.02] group">
                {/* HUD Glowing Corner Lines */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-500/30 rounded-tl-2xl"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-500/30 rounded-tr-2xl"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-500/30 rounded-bl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-500/30 rounded-br-2xl"></div>

                {/* HUD Header Status */}
                <div className="flex justify-between items-center border-b border-emerald-500/10 pb-3 mb-6">
                  <div className="flex items-center space-x-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-[10px] font-mono tracking-widest text-[#0F4C3A] uppercase font-bold">SYSTEM ACTIVE: SHARIA_CORE_V1</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-[#D4AF37] px-2 py-0.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20 uppercase">
                    Secured
                  </span>
                </div>

                {/* Concentric Spheres Diagnostic Compass */}
                <div className="relative h-48 w-48 mx-auto flex items-center justify-center my-6">
                  {/* Outer Orbit Line (Dashed) */}
                  <div className="absolute w-48 h-48 rounded-full border border-dashed border-emerald-500/25 animate-orbit-slow"></div>
                  {/* Middle Orbit Line (Dotted) */}
                  <div className="absolute w-40 h-40 rounded-full border border-dotted border-emerald-500/20 animate-orbit-medium"></div>
                  {/* Inner Orbit Line (Solid) */}
                  <div className="absolute w-32 h-32 rounded-full border border-emerald-500/10 animate-orbit-fast"></div>

                  {/* Sharia Compliance Compass Nodes */}
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 bg-emerald-500 rounded-full border border-white shadow-md shadow-emerald-500/50"></div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-3 w-3 bg-[#D4AF37] rounded-full border border-white shadow-md shadow-gold-500/50"></div>
                  <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-white"></div>
                  <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 h-2.5 w-2.5 bg-[#D4AF37] rounded-full border border-white"></div>

                  {/* Core Glass Sphere */}
                  <div className="relative h-26 w-26 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-emerald-500/35 flex flex-col items-center justify-center p-4 z-10 transition-transform duration-300 group-hover:scale-105">
                    <span className="text-[10px] font-bold text-[#0F4C3A]/70 uppercase tracking-widest leading-none mb-1">Health</span>
                    <span className="text-4xl font-black text-[#0F4C3A] font-mono leading-none tracking-tight">85</span>
                    <span className="text-[8px] font-extrabold text-[#D4AF37] uppercase tracking-wider mt-1">SYARIAH SCORE</span>
                  </div>
                </div>

                {/* Floating Telemetries Overlay */}
                {/* 1. Net Estate (Top Left) */}
                <div className="absolute top-16 left-4 bg-white/90 backdrop-blur-md py-2 px-3 rounded-xl border border-emerald-500/20 shadow-md shadow-emerald-950/5 flex items-center space-x-2 animate-bounce [animation-duration:8s] hover:scale-105 transition-transform duration-300">
                  <div className="h-6 w-6 rounded-lg bg-emerald-50 flex items-center justify-center border border-emerald-500/10">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-[9px] text-emerald-600/70 block uppercase font-bold font-mono">Net Estate</span>
                    <span className="text-xs font-black text-[#0F4C3A] font-mono">Rp 125.000.000</span>
                  </div>
                </div>

                {/* 2. Riba Detox (Bottom Right) */}
                <div className="absolute bottom-14 right-4 bg-white/90 backdrop-blur-md py-2 px-3 rounded-xl border border-amber-500/20 shadow-md shadow-emerald-950/5 flex items-center space-x-2 animate-bounce [animation-duration:6s] hover:scale-105 transition-transform duration-300">
                  <div className="h-6 w-6 rounded-lg bg-amber-50 flex items-center justify-center border border-amber-500/10">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-600/70 block uppercase font-bold font-mono">Riba Detox</span>
                    <span className="text-xs font-black text-amber-700">Utang: Rp 5.000.000</span>
                  </div>
                </div>

                {/* 3. Zakat Maal (Top Right) */}
                <div className="absolute top-24 right-4 bg-white/90 backdrop-blur-md py-1.5 px-3 rounded-xl border border-emerald-500/20 shadow-md shadow-emerald-950/5 flex items-center space-x-1.5 hover:scale-105 transition-transform duration-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-[10px] font-bold text-[#0F4C3A]">Nisab Zakat Terpenuhi</span>
                </div>

                {/* HUD Footer status metrics chart visual */}
                <div className="flex items-end justify-between px-2 pt-2 border-t border-emerald-500/10 mt-2">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-6 bg-emerald-500/40 rounded-full"></div>
                    <div className="w-1.5 h-9 bg-emerald-500/60 rounded-full"></div>
                    <div className="w-1.5 h-12 bg-emerald-500 rounded-full"></div>
                    <div className="w-1.5 h-8 bg-emerald-500/50 rounded-full"></div>
                    <span className="text-[9px] font-mono text-emerald-700 font-bold ml-1">Live Cashflow Flow</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-700 font-bold">100% Syariah Checked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Trust & Syariah Compliance */}
      <section className="py-12 border-y border-emerald-500/10 relative overflow-hidden bg-white/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-center text-xs font-extrabold text-emerald-800/60 tracking-[0.2em] uppercase mb-8">Dirancang Sesuai Standar Kepatuhan Syariah</p>
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-12">
            {[
              { icon: ShieldCheck, text: 'DSN-MUI Compliant' },
              { icon: BookOpen, text: 'Sharia Board Supervised' },
              { icon: Lock, text: 'Bank-Grade Security' }
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center bg-white/70 backdrop-blur-md px-5 py-3 rounded-2xl border border-emerald-500/10 shadow-sm hover:border-emerald-500/20 hover:scale-105 transition-all duration-300">
                <badge.icon className="h-5 w-5 mr-3 text-emerald-700" />
                <span className="font-extrabold text-[#0F4C3A] text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. The Problem */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C3A] mb-4 tracking-tight">
              {settings.fitur_title}
            </h2>
            <p className="text-base lg:text-lg text-emerald-800/80 font-medium">
              {settings.fitur_subtitle}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: AlertTriangle, 
                title: 'Jebakan Riba', 
                desc: 'Tingginya paparan utang konvensional (Paylater, KTA) tanpa rencana pelunasan yang jelas.', 
                color: 'red' 
              },
              { 
                icon: BrainCircuit, 
                title: 'Literasi Syariah Rendah', 
                desc: 'Sulit membedakan produk keuangan halal dan haram di era digital.', 
                color: 'amber' 
              },
              { 
                icon: Briefcase, 
                title: 'Penasihat Mahal', 
                desc: 'Konsultasi dengan perencana keuangan syariah profesional seringkali tidak terjangkau.', 
                color: 'emerald' 
              },
              { 
                icon: RefreshCcw, 
                title: 'Layanan Terpecah', 
                desc: 'Zakat, investasi, dan waris dikelola secara terpisah membuat pusing.', 
                color: 'blue' 
              }
            ].map((problem, idx) => (
              <div key={idx} className="bg-white/60 backdrop-blur-md p-8 rounded-2xl border border-emerald-500/10 shadow-sm relative overflow-hidden interactive-teleport hover:border-emerald-500/30 group">
                {/* Color-based top accent badge line */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${
                  problem.color === 'red' ? 'bg-red-400' :
                  problem.color === 'amber' ? 'bg-amber-400' :
                  problem.color === 'emerald' ? 'bg-emerald-400' : 'bg-blue-400'
                }`} />

                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border ${
                  problem.color === 'red' ? 'bg-red-50 border-red-200 text-red-600' :
                  problem.color === 'amber' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                  problem.color === 'emerald' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                  'bg-blue-50 border-blue-200 text-blue-600'
                }`}>
                  <problem.icon className="h-6 w-6" />
                </div>
                
                <h3 className="font-black text-[#0F4C3A] text-lg mb-3 tracking-tight">{problem.title}</h3>
                <p className="text-xs text-emerald-800/80 leading-relaxed font-semibold">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The Solution (Features Grid) */}
      <section id="solusi" className="py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-black text-[#0F4C3A] mb-4 tracking-tight">
              {settings.solusi_title}
            </h2>
            <p className="text-base lg:text-lg text-emerald-800/80 font-medium">
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
              <div key={idx} className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-emerald-500/10 shadow-sm interactive-teleport hover:border-emerald-500/35 hover:shadow-neon-emerald/5 group">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/15 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="text-xl font-black text-[#0F4C3A] mb-3 tracking-tight">{feature.title}</h3>
                <p className="text-emerald-800/80 text-xs leading-relaxed font-semibold">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI & Tech Architecture */}
      <section id="teknologi" className="bg-[#0B3B2E] py-28 text-white relative overflow-hidden">
        {/* Islamic geometric SVG mesh background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23D4AF37\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <span className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.25em] block mb-4">Sharia Intelligence Hub</span>
              <h2 className="text-3xl lg:text-5xl font-black mb-6 leading-tight tracking-tight">Didukung Teknologi AI Terdepan</h2>
              <p className="text-emerald-100/70 mb-10 text-base lg:text-lg font-medium leading-relaxed">
                Sistem kami menggunakan arsitektur mutakhir untuk memastikan fatwa dan panduan yang akurat, aman, dan dapat diandalkan secara syariah.
              </p>
              
              <ul className="space-y-6">
                {[
                  {
                    title: 'Retrieval-Augmented Generation (RAG)',
                    desc: 'AI kami tidak berhalusinasi. Seluruh respon merujuk langsung pada Knowledge Base fatwa DSN-MUI yang sah.'
                  },
                  {
                    title: 'Open Banking Integration',
                    desc: 'Sinkronisasi mutasi rekening secara aman untuk mendeteksi pengeluaran dan transaksi non-halal secara otomatis.'
                  },
                  {
                    title: 'Privasi Data Berlapis',
                    desc: 'Enkripsi End-to-End standar perbankan. Data keuangan pribadi Anda dijamin aman di database terenkripsi.'
                  }
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <div className="h-6 w-6 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center mr-4 shrink-0 mt-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base mb-1 tracking-tight">{item.title}</h4>
                      <p className="text-xs text-emerald-100/60 leading-relaxed font-semibold">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="lg:w-1/2 w-full flex justify-center items-center">
              {/* Premium rotating gold gradient border card wrapper */}
              <div className="relative p-[1.5px] rounded-3xl overflow-hidden bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] shadow-2xl shadow-emerald-950/50 w-full max-w-md group transition-all duration-500 hover:scale-[1.01]">
                {/* Animated gradient pulse bg overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-200 to-[#D4AF37] opacity-20 blur-lg group-hover:opacity-30 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Main Card Content */}
                <div className="relative bg-[#05261d] p-8 rounded-[22px] space-y-6 z-10">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center text-emerald-950 shadow-md">
                        <BrainCircuit className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white tracking-wide uppercase font-mono">Intelligence Core</h4>
                        <span className="text-[9px] text-[#D4AF37] block font-mono uppercase tracking-wider">Active Sharia AI Node</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[9px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                      Active
                    </span>
                  </div>

                  {/* Core Value Pillars */}
                  <div className="space-y-4">
                    {[
                      {
                        icon: ShieldCheck,
                        title: 'Verified Sharia Knowledge Base',
                        desc: 'Seluruh konsultasi diselaraskan dengan fatwa resmi DSN-MUI untuk jaminan keabsahan fiqh muamalah.'
                      },
                      {
                        icon: Calculator,
                        title: 'AI-Powered Fiqh Analysis',
                        desc: 'Mesin pemrosesan bahasa pintar yang memetakan akad, menganalisis riba, dan menghitung porsi waris secara instan.'
                      },
                      {
                        icon: RefreshCcw,
                        title: 'Real-time Compliance Audit',
                        desc: 'Audit otomatis harian terhadap pengeluaran kas, target tabungan, dan screening kepatuhan emiten efek syariah.'
                      }
                    ].map((value, idx) => (
                      <div key={idx} className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors duration-300">
                        <div className="h-8 w-8 rounded-lg bg-emerald-950/80 border border-[#D4AF37]/35 flex items-center justify-center text-amber-400 shrink-0">
                          <value.icon className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h5 className="text-xs font-black text-white tracking-tight">{value.title}</h5>
                          <p className="text-[10px] text-emerald-100/60 mt-0.5 leading-relaxed font-semibold">
                            {value.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-center text-[10px] text-[#D4AF37]/80 italic font-medium">
                    "Menjaga kemurnian harta dari unsur syubhat dan riba dengan cerdas & presisi."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison Table */}
      <section className="py-24 bg-white/30 relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C3A] mb-4 tracking-tight">
              {settings.harga_title}
            </h2>
            <p className="text-base lg:text-lg text-emerald-800/80 font-medium">
              {settings.harga_subtitle}
            </p>
          </div>
          
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-500/10 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-emerald-50/40 border-b border-emerald-500/10">
                    <th className="p-6 font-extrabold text-[#0F4C3A] text-sm w-1/3">Fitur Platform</th>
                    <th className="p-6 font-bold text-emerald-800/60 text-xs tracking-wider uppercase text-center w-1/3">Aplikasi Keuangan Biasa</th>
                    <th className="p-6 font-extrabold text-white bg-[#0F4C3A] text-xs tracking-wider uppercase text-center w-1/3 rounded-tr-3xl">Ekosistem Sharify</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-emerald-500/5">
                  {[
                    ['Pencatatan Pemasukan/Pengeluaran', true, true],
                    ['Kalkulasi Zakat Otomatis Sesuai Emas', false, true],
                    ['Deteksi & Rekomendasi Riba (Riba Detox)', false, true],
                    ['Simulasi Hukum Waris Islam (Faraidh)', false, true],
                    ['Konsultasi AI Fiqh Muamalah 24/7', false, true],
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-emerald-50/20 transition-colors">
                      <td className="p-6 text-sm font-extrabold text-[#0F4C3A]">{row[0]}</td>
                      <td className="p-6 text-center text-emerald-600/35">
                        {row[1] ? <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600/55" /> : '-'}
                      </td>
                      <td className="p-6 text-center bg-[#0F4C3A]/5 border-l border-emerald-500/5">
                        <CheckCircle2 className="h-5 w-5 mx-auto text-[#0F4C3A] filter drop-shadow-sm" />
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
      <section className="py-24 relative overflow-hidden">
        <div className="absolute left-0 top-1/2 transform -translate-x-1/3 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#D4AF37] font-black text-xs uppercase tracking-[0.25em] block mb-4">Testimoni Pengguna</span>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0F4C3A] tracking-tight">Kisah Hijrah Finansial</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmad S.', role: 'Wirausaha', avatar: 'AS', text: 'Alhamdulillah, melalui fitur Riba Detox Sharify, saya berhasil memetakan utang konvensional saya dan melunasinya secara sistematis. Hidup jadi jauh lebih tenang.' },
              { name: 'Fatima R.', role: 'Ibu Rumah Tangga', avatar: 'FR', text: 'Kalkulator Zakatnya sangat menolong! Perhitungan nisab emas otomatis terupdate real-time sehingga saya tidak perlu ragu lagi dalam menghitung kewajiban maal.' },
              { name: 'Budi W.', role: 'Karyawan Swasta', avatar: 'BW', text: 'Fitur Faraidh dan AI Asistennya sangat edukatif untuk mengenalkan pembagian harta waris syariah kepada keluarga besar kami secara adil dan transparan.' }
            ].map((person, i) => (
              <div key={i} className="bg-white/70 backdrop-blur-md p-8 rounded-3xl border border-emerald-500/10 shadow-sm relative hover:border-emerald-500/25 transition-all duration-300">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-[#D4AF37]/15" />
                
                <div className="flex text-[#D4AF37] mb-4">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star key={starIdx} className="h-4 w-4 fill-current mr-0.5" />
                  ))}
                </div>
                
                <p className="text-emerald-800/80 text-xs italic mb-6 leading-relaxed font-semibold">"{person.text}"</p>
                
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gradient-to-br from-[#0F4C3A] to-emerald-600 text-white rounded-xl mr-3 flex items-center justify-center font-extrabold text-sm shadow-md shadow-emerald-950/10">
                    {person.avatar}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0F4C3A] text-sm tracking-tight">{person.name}</h4>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{person.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Final CTA & Footer */}
      <section className="bg-emerald-50/40 border-t border-emerald-500/10 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center mb-20">
          <h2 className="text-3xl lg:text-5xl font-black text-[#0F4C3A] mb-6 leading-tight tracking-tight">
            Mulai Perjalanan Finansial Syariah Anda Hari Ini.
          </h2>
          <p className="text-base lg:text-lg text-emerald-800/70 mb-10 max-w-2xl mx-auto font-semibold">
            Daftar gratis sekarang dan ambil langkah pertama menuju kebebasan finansial yang berkah dan diridhai Allah SWT.
          </p>
          <Link to="/signup" className="inline-block bg-[#0F4C3A] hover:bg-emerald-800 text-white px-10 py-4.5 rounded-2xl text-base font-extrabold shadow-xl shadow-emerald-950/10 hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
            Daftar Sekarang - Gratis
          </Link>
        </div>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-emerald-500/10 pt-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                {settings.logo_url ? (
                  <img src={bustCache(settings.logo_url)} alt="Logo" className="h-7 object-contain" />
                ) : (
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-lg bg-[#0F4C3A] flex items-center justify-center shadow-md">
                      <ShieldCheck className="h-5 w-5 text-white" />
                    </div>
                    <span className="ml-2.5 text-xl font-black text-[#0F4C3A] tracking-tight">Sharify</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-emerald-800/60 max-w-sm font-semibold leading-relaxed">{settings.footer_desc}</p>
            </div>
            
            <div>
              <h4 className="font-extrabold text-[#0F4C3A] mb-4 text-sm tracking-tight">Produk</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-emerald-850">
                <li><Link to="/upgrade" className="hover:text-emerald-500 transition-colors">Harga Layanan</Link></li>
                <li><Link to="/login" className="hover:text-emerald-500 transition-colors">Health Check</Link></li>
                <li><Link to="/login" className="hover:text-emerald-500 transition-colors">Kalkulator Zakat</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-extrabold text-[#0F4C3A] mb-4 text-sm tracking-tight">Kebijakan</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-emerald-850">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Sanggahan Hukum</a></li>
              </ul>
            </div>
          </div>
          
          <div className="text-center text-xs font-semibold text-emerald-700/60 border-t border-emerald-500/10 pt-8">
            {settings.footer_copyright}
          </div>
        </footer>
      </section>

    </div>
  );
};
