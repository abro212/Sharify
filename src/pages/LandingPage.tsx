import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, HeartPulse, Calculator, RefreshCcw, CheckCircle2, 
  Lock, AlertTriangle, BookOpen, MessageSquare, Briefcase, BrainCircuit,
  TrendingUp, Users, Star, Quote, Menu, X
} from 'lucide-react';
import { useSettingsStore, bustCache } from '../store/settingsStore';

export const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, loading } = useSettingsStore();

  return (
    <div className="min-h-screen bg-gray-50 selection:bg-accent selection:text-white font-sans">
      
      {/* 1. Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center">
            {loading ? (
              // Skeleton placeholder while settings load — prevents flash of wrong logo
              <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
            ) : settings.logo_url ? (
              <img src={bustCache(settings.logo_url)} alt="Logo" className="h-9 object-contain" />
            ) : (
              <>
                <ShieldCheck className="h-8 w-8 text-[#0F4C3A]" />
                <span className="ml-2 text-2xl font-bold text-gray-900 tracking-tight">Sharify</span>
              </>
            )}
          </div>
          
          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-[#0F4C3A] transition-colors">Fitur</a>
            <a href="#solusi" className="text-sm font-medium text-gray-600 hover:text-[#0F4C3A] transition-colors">Solusi</a>
            <a href="#teknologi" className="text-sm font-medium text-gray-600 hover:text-[#0F4C3A] transition-colors">Teknologi</a>
            <Link to="/upgrade" className="text-sm font-medium text-gray-600 hover:text-[#0F4C3A] transition-colors">Harga</Link>
          </div>
          
          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Masuk</Link>
            <Link to="/signup" className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-150 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-3">
              <a 
                href="#features" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-semibold text-gray-700 hover:text-[#0F4C3A] py-2 transition-colors border-b border-gray-50"
              >
                Fitur
              </a>
              <a 
                href="#solusi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-semibold text-gray-700 hover:text-[#0F4C3A] py-2 transition-colors border-b border-gray-50"
              >
                Solusi
              </a>
              <a 
                href="#teknologi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-semibold text-gray-700 hover:text-[#0F4C3A] py-2 transition-colors border-b border-gray-50"
              >
                Teknologi
              </a>
              <Link 
                to="/upgrade" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-semibold text-gray-700 hover:text-[#0F4C3A] py-2 transition-colors border-b border-gray-50"
              >
                Harga
              </Link>
            </div>
            
            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-gray-700 hover:text-gray-900 py-2.5 rounded-lg border border-gray-200"
              >
                Masuk
              </Link>
              <Link 
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-bold bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white py-2.5 rounded-lg shadow-sm"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* 2. Hero Section */}
      <main className="pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[400px] h-[400px] rounded-full bg-[#0F4C3A]/5 blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#0F4C3A]/5 text-[#0F4C3A] text-sm font-semibold mb-6 border border-[#0F4C3A]/10">
                <span className="flex h-2 w-2 rounded-full bg-[#D4AF37] mr-2"></span>
                AI-Powered Islamic Finance
              </div>
              <h1 className="text-4xl lg:text-5xl font-black text-gray-900 tracking-tight mb-6 leading-tight">
                {settings.hero_title}
              </h1>
              <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {settings.hero_subtitle}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/signup" className="w-full sm:w-auto bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-[#0F4C3A]/20 transition-all hover:-translate-y-0.5 text-center">
                  {settings.hero_cta_primary}
                </Link>
                <a href="#features" className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#0F4C3A] border border-gray-200 px-8 py-4 rounded-xl font-bold shadow-sm transition-colors flex items-center justify-center">
                  {settings.hero_cta_secondary}
                </a>
              </div>
            </div>
            
            {/* Mockup Placeholder */}
            <div className="lg:w-1/2 relative">
              <div className="relative mx-auto w-[300px] h-[600px] bg-white border-[8px] border-gray-900 rounded-[3rem] shadow-2xl overflow-hidden flex items-center justify-center">
                {/* Mockup Screen Content */}
                <div className="absolute top-0 w-full h-full bg-gray-50 flex flex-col">
                  {/* Geometric Islamic Pattern Header */}
                  <div className="h-40 w-full bg-[#0F4C3A] relative overflow-hidden flex-shrink-0">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23D4AF37\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
                    <div className="absolute bottom-4 left-6 text-white z-10">
                      <p className="text-xs opacity-80 mb-1">Total Aset</p>
                      <p className="text-2xl font-bold font-mono">Rp 125.000.000</p>
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col space-y-4 -mt-6 relative z-20">
                    <div className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Health Score Syariah</p>
                      <p className="text-3xl font-bold text-[#0F4C3A]">85 <span className="text-sm font-normal text-gray-400">/ 100</span></p>
                      <div className="mt-4 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#0F4C3A] to-[#D4AF37] h-full w-[85%]"></div>
                      </div>
                    </div>

                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                      <div className="h-10 w-10 bg-red-50 rounded-lg mr-4 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">Riba Detox</div>
                        <div className="text-xs text-red-500 mt-1">Sisa Utang: Rp 5jt</div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center">
                      <div className="h-10 w-10 bg-[#D4AF37]/10 rounded-lg mr-4 flex items-center justify-center">
                        <Calculator className="h-5 w-5 text-[#D4AF37]" />
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900">Zakat Maal</div>
                        <div className="text-xs text-gray-500 mt-1">Sudah mencapai Nisab</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Trust & Syariah Compliance */}
      <section className="bg-white py-12 border-y border-gray-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <p className="text-center text-sm font-semibold text-gray-400 tracking-widest uppercase mb-8">Dirancang Sesuai Standar Kepatuhan Syariah</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70">
            <div className="flex items-center"><ShieldCheck className="h-6 w-6 mr-2 text-[#0F4C3A]" /> <span className="font-bold text-gray-800">DSN-MUI Compliant</span></div>
            <div className="flex items-center"><BookOpen className="h-6 w-6 mr-2 text-[#0F4C3A]" /> <span className="font-bold text-gray-800">Sharia Board Supervised</span></div>
            <div className="flex items-center"><Lock className="h-6 w-6 mr-2 text-[#0F4C3A]" /> <span className="font-bold text-gray-800">Bank-Grade Security</span></div>
          </div>
        </div>
      </section>

      {/* 4. The Problem */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{settings.fitur_title}</h2>
            <p className="text-lg text-gray-600">{settings.fitur_subtitle}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-50 rounded-bl-full -mr-8 -mt-8"></div>
              <AlertTriangle className="h-10 w-10 text-red-500 mx-auto mb-4 relative z-10" />
              <h3 className="font-bold text-gray-900 mb-2 relative z-10">Jebakan Riba</h3>
              <p className="text-sm text-gray-500 relative z-10">Tingginya paparan utang konvensional (Paylater, KTA) tanpa rencana pelunasan yang jelas.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-50 rounded-bl-full -mr-8 -mt-8"></div>
              <BrainCircuit className="h-10 w-10 text-orange-500 mx-auto mb-4 relative z-10" />
              <h3 className="font-bold text-gray-900 mb-2 relative z-10">Literasi Syariah Rendah</h3>
              <p className="text-sm text-gray-500 relative z-10">Sulit membedakan produk keuangan halal dan haram di era digital.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-8 -mt-8"></div>
              <Briefcase className="h-10 w-10 text-blue-500 mx-auto mb-4 relative z-10" />
              <h3 className="font-bold text-gray-900 mb-2 relative z-10">Penasihat Mahal</h3>
              <p className="text-sm text-gray-500 relative z-10">Konsultasi dengan perencana keuangan syariah profesional seringkali tidak terjangkau.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-16 h-16 bg-gray-100 rounded-bl-full -mr-8 -mt-8"></div>
              <RefreshCcw className="h-10 w-10 text-gray-500 mx-auto mb-4 relative z-10" />
              <h3 className="font-bold text-gray-900 mb-2 relative z-10">Layanan Terpecah</h3>
              <p className="text-sm text-gray-500 relative z-10">Zakat, investasi, dan waris dikelola secara terpisah membuat pusing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. The Solution (Features Grid) */}
      <section id="solusi" className="bg-white py-24 relative overflow-hidden">
        <div className="absolute right-0 top-1/2 transform translate-x-1/3 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{settings.solusi_title}</h2>
            <p className="text-lg text-gray-500">{settings.solusi_subtitle}</p>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: HeartPulse, title: 'Health Check Syariah', desc: 'Skoring kesehatan keuangan berbasis rasio utang dan paparan riba.' },
              { icon: MessageSquare, title: 'AI Assistant (Gemini)', desc: 'Konsultasi Fiqh Muamalah instan 24/7 untuk menjawab keraguan transaksional Anda.' },
              { icon: ShieldCheck, title: 'Program Riba Detox', desc: 'Rencana aksi sistematis berbantuan AI untuk melunasi utang konvensional.' },
              { icon: TrendingUp, title: 'Halal Investment', desc: 'Rekomendasi instrumen investasi (Sukuk, Reksa Dana Syariah) sesuai profil risiko.' },
              { icon: Calculator, title: 'Zakat & Wakaf Center', desc: 'Kalkulasi Nisab dinamis terhubung dengan harga emas real-time.' },
              { icon: Users, title: 'Faraidh Simulator', desc: 'Edukasi dan simulasi pembagian waris Islam untuk mencegah konflik keluarga.' }
            ].map((feature, idx) => (
              <div key={idx} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-[#D4AF37]/50 transition-colors group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-[#0F4C3A]" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. AI & Tech Architecture */}
      <section id="teknologi" className="bg-[#0F4C3A] py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23D4AF37\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Didukung Teknologi AI Terdepan</h2>
              <p className="text-primary-light mb-8 text-lg">
                Sistem kami menggunakan arsitektur mutakhir untuk memastikan fatwa dan panduan yang akurat, aman, dan dapat diandalkan.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#D4AF37] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Retrieval-Augmented Generation (RAG)</h4>
                    <p className="text-sm opacity-80">AI kami tidak berhalusinasi. Seluruh jawaban merujuk pada Knowledge Base Fatwa DSN-MUI.</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#D4AF37] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Open Banking Integration</h4>
                    <p className="text-sm opacity-80">Sinkronisasi mutasi rekening secara aman untuk mendeteksi transaksi non-halal secara otomatis (Fitur Plus).</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 text-[#D4AF37] mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold">Privasi Data Berlapis</h4>
                    <p className="text-sm opacity-80">Enkripsi End-to-End standar industri. Data keuangan Anda aman di database Supabase kami.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="lg:w-1/2 w-full flex justify-center items-center">
              {/* Premium rotating gold gradient border card wrapper */}
              <div className="relative p-[1.5px] rounded-3xl overflow-hidden bg-gradient-to-r from-[#D4AF37] via-amber-400 to-[#D4AF37] shadow-2xl shadow-emerald-950/40 w-full max-w-md group transition-all duration-300 hover:scale-[1.01]">
                {/* Animated gradient pulse bg overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-yellow-200 to-[#D4AF37] opacity-20 blur-lg group-hover:opacity-35 transition-opacity duration-500 animate-pulse"></div>
                
                {/* Main Card Content */}
                <div className="relative bg-[#082f23] p-8 rounded-[22px] space-y-6 z-10">
                  <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#D4AF37] to-amber-500 flex items-center justify-center text-emerald-950 shadow-md">
                        <BrainCircuit className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <h4 className="text-sm font-extrabold text-white tracking-wide">Sharify Intelligence Core</h4>
                        <span className="text-[9px] text-[#D4AF37] block font-mono uppercase tracking-wider">Active Sharia AI Node</span>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[8px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 mr-1 animate-ping"></span>
                      Operasional
                    </span>
                  </div>

                  {/* Core Value Pillars */}
                  <div className="space-y-4">
                    
                    {/* Value 1: Verified Sharia Knowledge Base */}
                    <div className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-emerald-950/80 border border-[#D4AF37]/35 flex items-center justify-center text-amber-400 shrink-0">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white">Verified Sharia Knowledge Base</h5>
                        <p className="text-[10px] text-gray-300 mt-0.5 leading-relaxed">
                          Seluruh konsultasi diselaraskan dengan fatwa resmi DSN-MUI untuk jaminan keabsahan fiqh muamalah.
                        </p>
                      </div>
                    </div>

                    {/* Value 2: AI-Powered Fiqh Muamalah Analysis */}
                    <div className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-emerald-950/80 border border-[#D4AF37]/35 flex items-center justify-center text-amber-400 shrink-0">
                        <Calculator className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white">AI-Powered Fiqh Muamalah Analysis</h5>
                        <p className="text-[10px] text-gray-300 mt-0.5 leading-relaxed">
                          Mesin pemrosesan bahasa pintar yang memetakan akad, menganalisis riba, dan menghitung porsi waris fardh secara instan.
                        </p>
                      </div>
                    </div>

                    {/* Value 3: Real-time Compliance Monitoring */}
                    <div className="flex items-start space-x-3.5 p-3 rounded-xl hover:bg-white/5 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-emerald-950/80 border border-[#D4AF37]/35 flex items-center justify-center text-amber-400 shrink-0">
                        <RefreshCcw className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-white">Real-time Compliance Monitoring</h5>
                        <p className="text-[10px] text-gray-300 mt-0.5 leading-relaxed">
                          Audit otomatis harian terhadap pengeluaran kas, targets tabungan, dan screening kepatuhan emiten efek syariah.
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="pt-2 text-center text-[9px] text-[#D4AF37]/80 italic">
                    "Menjaga kemurnian harta dari unsur syubhat dan riba dengan cerdas & presisi."
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Comparison Table */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{settings.harga_title}</h2>
            <p className="text-lg text-gray-500 mt-2">{settings.harga_subtitle}</p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="p-6 font-bold text-gray-900 w-1/3">Fitur</th>
                  <th className="p-6 font-bold text-gray-900 w-1/3 text-center">Aplikasi Standard</th>
                  <th className="p-6 font-bold text-white bg-[#0F4C3A] w-1/3 text-center">Sharify Ecosystem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ['Pencatatan Pemasukan/Pengeluaran', true, true],
                  ['Kalkulasi Zakat Otomatis', false, true],
                  ['Deteksi Riba (Riba Detox)', false, true],
                  ['Simulasi Waris (Faraidh)', false, true],
                  ['Konsultasi AI Fiqh Muamalah', false, true],
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="p-6 text-sm font-medium text-gray-700">{row[0]}</td>
                    <td className="p-6 text-center text-gray-400">
                      {row[1] ? <CheckCircle2 className="h-5 w-5 mx-auto text-gray-400" /> : '-'}
                    </td>
                    <td className="p-6 text-center text-[#0F4C3A] bg-[#0F4C3A]/5 border-l border-gray-100">
                      <CheckCircle2 className="h-5 w-5 mx-auto text-[#0F4C3A]" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="bg-white py-24 border-t border-gray-100 relative overflow-hidden">
         <div className="absolute left-0 top-1/2 transform -translate-x-1/3 -translate-y-1/2 w-96 h-96 bg-[#0F4C3A]/5 rounded-full blur-3xl pointer-events-none"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kisah Hijrah Finansial</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Ahmad S.', role: 'Wirausaha', avatar: 'AS' },
              { name: 'Fatima R.', role: 'Ibu Rumah Tangga', avatar: 'FR' },
              { name: 'Budi W.', role: 'Karyawan Swasta', avatar: 'BW' }
            ].map((person, i) => (
              <div key={i} className="bg-gray-50 p-8 rounded-2xl border border-gray-100 relative">
                <Quote className="absolute top-6 right-6 h-8 w-8 text-[#D4AF37]/20" />
                <div className="flex text-[#D4AF37] mb-4">
                  <Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" /><Star className="h-4 w-4 fill-current" />
                </div>
                <p className="text-gray-600 text-sm italic mb-6">"Alhamdulillah, melalui fitur Riba Detox Sharify, saya berhasil memetakan utang konvensional saya dan melunasinya secara sistematis. Fitur Faraidh-nya juga sangat edukatif untuk keluarga kami."</p>
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-[#0F4C3A] text-white rounded-full mr-3 flex items-center justify-center font-bold text-sm shadow-sm">
                    {person.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{person.name}</h4>
                    <p className="text-xs text-gray-500">{person.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
         </div>
      </section>

      {/* 9. Final CTA & Footer */}
      <section className="bg-gray-50 pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center mb-20">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Mulai Perjalanan Finansial Syariah Anda Hari Ini.</h2>
          <p className="text-xl text-gray-600 mb-10">Daftar gratis sekarang dan ambil langkah pertama menuju kebebasan finansial yang diridhai Allah.</p>
          <Link to="/signup" className="inline-block bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl transition-transform hover:scale-105">
            Daftar Sekarang - Gratis
          </Link>
        </div>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 pt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                {settings.logo_url ? (
                  <img src={bustCache(settings.logo_url)} alt="Logo" className="h-6 object-contain" />
                ) : (
                  <>
                    <ShieldCheck className="h-6 w-6 text-[#0F4C3A]" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Sharify</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-500 max-w-sm">{settings.footer_desc}</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/upgrade" className="hover:text-[#0F4C3A]">Harga</Link></li>
                <li><Link to="/login" className="hover:text-[#0F4C3A]">Health Check</Link></li>
                <li><Link to="/login" className="hover:text-[#0F4C3A]">Zakat Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-[#0F4C3A]">Syarat & Ketentuan</a></li>
                <li><a href="#" className="hover:text-[#0F4C3A]">Kebijakan Privasi</a></li>
                <li><a href="#" className="hover:text-[#0F4C3A]">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-sm text-gray-400 border-t border-gray-200 pt-8">
            {settings.footer_copyright}
          </div>
        </footer>
      </section>

    </div>
  );
};
