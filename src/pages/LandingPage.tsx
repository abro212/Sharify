import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  TrendingUp, MessageSquare, Calculator, RefreshCcw, Target, BookOpen,
  ShieldCheck, Users, Star, Download, Play, Lock, ChevronDown, 
  Globe, Sparkles, Menu, X
} from 'lucide-react';
import { FloatingWhatsAppChat } from '../components/layout/FloatingWhatsAppChat';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('beranda');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden">
      
      {/* 1. Header / Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/app logo.png" alt="Sharify Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#064E3B] tracking-tight leading-none">Sharify</span>
              <span className="text-[9px] font-bold text-amber-600 tracking-wider uppercase mt-0.5">AI-Based Islamic Financial Advisory</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-7">
            {[
              { id: 'beranda', label: 'Beranda', href: '#' },
              { id: 'fitur', label: 'Fitur', href: '#fitur' },
              { id: 'manfaat', label: 'Manfaat', href: '#manfaat' },
              { id: 'tentang-kami', label: 'Tentang Kami', href: '#tentang-kami' },
              { id: 'faq', label: 'FAQ', href: '#faq' },
              { id: 'blog', label: 'Blog', href: '#blog' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`text-sm font-bold transition-all relative py-1 ${
                  activeTab === item.id 
                    ? 'text-[#064E3B] border-b-2 border-[#064E3B]' 
                    : 'text-slate-600 hover:text-[#064E3B]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Language Selector */}
            <div className="relative flex items-center space-x-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>ID</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>

            {/* Gold CTA Button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#D97706] hover:bg-[#B45309] text-white text-xs font-extrabold px-6 py-2.5 rounded-full shadow-md shadow-amber-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Unduh Aplikasi
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 space-y-3 shadow-xl animate-fade-in">
            {['Beranda', 'Fitur', 'Manfaat', 'Tentang Kami', 'FAQ', 'Blog'].map((label, idx) => (
              <a 
                key={idx} 
                href="#"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-sm font-bold text-slate-700 hover:text-[#064E3B] py-2 border-b border-slate-50"
              >
                {label}
              </a>
            ))}
            <div className="pt-2 flex flex-col space-y-2">
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full bg-[#064E3B] text-white text-xs font-extrabold py-3 rounded-xl"
              >
                Buka Aplikasi Web
              </button>
              <button
                onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}
                className="w-full bg-[#D97706] text-white text-xs font-extrabold py-3 rounded-xl"
              >
                Unduh Aplikasi Mobile
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-8 pb-20 lg:pt-16 lg:pb-28 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-[#F8FAFC]">
        {/* Subtle Islamic Motif Pattern Background */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#064E3B_1px,transparent_1px)] [background-size:16px_16px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] border border-amber-200/80 text-xs font-extrabold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 mr-2 text-amber-600 fill-amber-600" />
                <span>Keuangan Islami, Hidup Berkah</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.18] tracking-tight">
                Bimbingan Keuangan Islami, Kini Lebih <span className="text-[#064E3B] underline decoration-amber-400 decoration-4 underline-offset-4">Mudah & Personal</span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                Sharify adalah aplikasi Islamic financial advisory berbasis AI yang membantu kamu mengelola keuangan sesuai syariah untuk masa depan yang lebih berkah.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs sm:text-sm px-7 py-3.5 rounded-full shadow-lg shadow-emerald-900/20 transition-all hover:scale-[1.02] flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4 text-amber-300" />
                  <span>Unduh Sekarang</span>
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-full shadow-xs transition-all flex items-center justify-center space-x-2"
                >
                  <Play className="w-3.5 h-3.5 text-[#064E3B] fill-[#064E3B]" />
                  <span>Pelajari Lebih Lanjut</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs font-semibold text-slate-500">
                <span className="flex items-center text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4 mr-1 text-[#064E3B]" /> 100% Sesuai Prinsip Syariah
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center text-slate-600">
                  <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" /> Aman & Terpercaya
                </span>
              </div>
            </div>

            {/* Right Side: Dual Mobile Screenshots Frame (Exact match with reference image) */}
            <div className="lg:col-span-6 relative flex justify-center items-center py-6">
              <div className="relative w-full max-w-[460px] h-[520px] sm:h-[560px]">
                
                {/* Back Phone: Screen 5 (Investasi Halal) */}
                <div className="absolute right-0 top-6 w-[240px] sm:w-[260px] bg-white border-[6px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden transform rotate-6 scale-95 z-10 transition-transform hover:rotate-3 duration-300">
                  {/* Phone Header Notch */}
                  <div className="bg-slate-900 text-white text-[9px] px-4 py-1.5 flex justify-between items-center font-semibold">
                    <span>09:47</span>
                    <div className="w-12 h-2.5 bg-black rounded-full"></div>
                  </div>
                  {/* Screen Content */}
                  <div className="p-3 space-y-3 bg-slate-50 min-h-[440px]">
                    <div className="flex items-center space-x-1 text-slate-800 text-[10px] font-bold">
                      <span>‹</span>
                      <span>Investasi Halal</span>
                    </div>
                    {/* Deep Emerald Card */}
                    <div className="bg-[#064E3B] text-white p-3 rounded-2xl space-y-1 relative overflow-hidden">
                      <h4 className="text-[11px] font-extrabold leading-tight">Halal Investment Opportunities</h4>
                      <p className="text-[8px] text-emerald-100 opacity-80">Invest with confidence and balance principles</p>
                      <button className="bg-amber-500 text-slate-950 text-[8px] font-bold px-2 py-0.5 rounded-md mt-1">
                        Cari Peluang
                      </button>
                    </div>
                    {/* Categories */}
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-700">Top Categories</span>
                      <div className="grid grid-cols-4 gap-1 text-[8px] text-center font-semibold">
                        <div className="bg-white p-1 rounded-lg shadow-xs">Sukuk</div>
                        <div className="bg-white p-1 rounded-lg shadow-xs">Halal Stocks</div>
                        <div className="bg-white p-1 rounded-lg shadow-xs">Reksa Dana Syariah</div>
                        <div className="bg-white p-1 rounded-lg shadow-xs">Emas</div>
                      </div>
                    </div>
                    {/* Portfolio Overview */}
                    <div className="bg-white p-2.5 rounded-xl shadow-xs space-y-1">
                      <span className="text-[8px] text-slate-400 font-bold uppercase">Portfolio Overview</span>
                      <p className="text-[12px] font-black text-slate-900">Rp 125.000.000 <span className="text-[8px] text-emerald-600 font-bold">+8,45%</span></p>
                      <div className="h-6 bg-emerald-50 rounded-lg flex items-center justify-center text-[8px] text-emerald-600 font-bold">
                        📈 Mini Trend Line Chart
                      </div>
                    </div>
                  </div>
                </div>

                {/* Front Phone: Screen 3 (Dashboard Home) */}
                <div className="absolute left-2 top-0 w-[250px] sm:w-[270px] bg-white border-[7px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden z-20 transition-transform hover:scale-[1.02] duration-300">
                  {/* Phone Header Notch */}
                  <div className="bg-slate-900 text-white text-[9px] px-4 py-1.5 flex justify-between items-center font-semibold">
                    <span>09:47</span>
                    <div className="w-12 h-2.5 bg-black rounded-full"></div>
                  </div>
                  {/* Screen Content */}
                  <div className="p-3.5 space-y-3 bg-slate-50 min-h-[460px]">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[9px] text-slate-400 font-semibold">Assalamu'alaikum,</p>
                        <h4 className="text-xs font-black text-slate-900 flex items-center">Ahmad 👋</h4>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border flex items-center justify-center text-[10px]">🔔</div>
                    </div>

                    {/* Financial Health Score Circle Gauge */}
                    <div className="bg-white p-3 rounded-2xl shadow-xs border space-y-2">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="font-bold text-slate-700">Financial Health Score</span>
                        <span className="text-slate-400">✕</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-amber-400 flex items-center justify-center font-black text-xs text-slate-800 shrink-0">
                          78
                        </div>
                        <div className="text-[9px]">
                          <p className="font-bold text-emerald-700">Keep going!</p>
                          <p className="text-slate-400">You're on the right path.</p>
                        </div>
                      </div>
                      <button className="w-full bg-[#064E3B] text-white text-[8px] font-bold py-1.5 rounded-lg">
                        Lihat Detail
                      </button>
                    </div>

                    {/* Quick Access 3x2 Grid */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[9px]">
                        <span className="font-extrabold text-slate-800">Quick Access</span>
                        <span className="text-emerald-700 font-bold">Lihat Semua</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 text-[8px] font-bold text-center">
                        <div className="bg-white p-2 rounded-xl shadow-xs border flex flex-col items-center">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span>Investasi Halal</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-xs border flex flex-col items-center">
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span>AI Chatbot Syariah</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-xs border flex flex-col items-center">
                          <Calculator className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span>Zakat Calculator</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-xs border flex flex-col items-center">
                          <RefreshCcw className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span>Riba Detox</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-xs border flex flex-col items-center">
                          <RefreshCcw className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span>Judol Detox</span>
                        </div>
                        <div className="bg-white p-2 rounded-xl shadow-xs border flex flex-col items-center">
                          <Calculator className="w-3.5 h-3.5 text-emerald-600 mb-1" />
                          <span>Faraidh Calculator</span>
                        </div>
                      </div>
                    </div>

                    {/* Rekomendasi untukmu */}
                    <div className="bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-100 text-[8px] space-y-0.5">
                      <span className="font-bold text-emerald-800 block">Rekomendasi untukmu</span>
                      <p className="text-slate-500">Pelajari dasar investasi halal untuk pemula</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. 6 Features Row (White Floating Card Bar) */}
      <section id="fitur" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-30">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            
            {[
              { icon: TrendingUp, title: 'Investasi Halal', desc: 'Temukan peluang investasi sesuai prinsip syariah' },
              { icon: MessageSquare, title: 'AI Chatbot Syariah', desc: 'Tanya apa saja seputar keuangan Islami kapan pun' },
              { icon: Calculator, title: 'Zakat Calculator', desc: 'Hitung zakat dengan mudah, akurat, dan sesuai syariah' },
              { icon: RefreshCcw, title: 'Riba Detox', desc: 'Bersihkan keuangan dari riba secara bertahap' },
              { icon: Target, title: 'Goal-Based Planning', desc: 'Rencanakan tujuan keuangan untuk masa depan yang berkah' },
              { icon: BookOpen, title: 'Edukasi Fiqh Muamalah', desc: 'Belajar fiqh muamalah secara praktis dan terpercaya' },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center text-center p-3 pt-4 lg:pt-3 space-y-2.5 group hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#064E3B] flex items-center justify-center group-hover:bg-[#064E3B] group-hover:text-white transition-colors shadow-xs">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-tight">{item.title}</h3>
                <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* 4. Statistics Banner Section (Dark Emerald Band) */}
      <section id="manfaat" className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#064E3B] text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden">
          {/* Subtle Mosque Dome Outline Background */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none">
            <svg className="w-80 h-80" viewBox="0 0 100 100" fill="currentColor">
              <path d="M50 0 C30 20 20 40 20 70 L80 70 C80 40 70 20 50 0 Z" />
            </svg>
          </div>

          <div className="relative z-10 space-y-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-50">
              Keuangan Sehat, Hidup Lebih Berkah
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
              {[
                { icon: Users, stat: '10.000+', label: 'Pengguna Terpercaya' },
                { icon: ShieldCheck, stat: '100%', label: 'Sesuai Prinsip Syariah' },
                { icon: Star, stat: '50+', label: 'Ulama & Pakar Syariah' },
                { icon: TrendingUp, stat: 'Bantu Capai', label: 'Tujuan Keuangan Islami' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
                  <item.icon className="w-7 h-7 text-amber-400 mb-1" />
                  <span className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">{item.stat}</span>
                  <span className="text-xs text-emerald-100 font-bold">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Ulama & Sharia Experts Section */}
      <section id="tentang-kami" className="py-16 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Description */}
            <div className="lg:col-span-4 space-y-5 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                Didukung oleh Ulama & Pakar Keuangan Syariah
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                Sharify bekerja sama dengan ulama dan pakar keuangan syariah untuk memastikan setiap fitur dan rekomendasi sesuai syariah.
              </p>
              <button
                onClick={() => navigate('/dashboard')}
                className="bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs px-6 py-3 rounded-full shadow-md transition-all inline-flex items-center space-x-2"
              >
                <span>Pelajari Tentang Kami</span>
              </button>
            </div>

            {/* Right Expert Cards (4 circular profile cards) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              {[
                { name: 'Ust. Ahmad Yusuf, Lc., MA', role: 'Pakar Fiqh Muamalah', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
                { name: 'Dr. Erwandi Tarmidzi, MA', role: 'Pakar Ekonomi Syariah', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250' },
                { name: 'Ust. Fatimah Az-Zahra, MA', role: 'Pakar Waris & Faraidh', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' },
                { name: 'Dr. H. Syafiq Riza Basalamah, MA', role: 'Pakar Keuangan Islam', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
              ].map((expert, idx) => (
                <div key={idx} className="bg-slate-50/80 p-4 rounded-3xl border border-slate-100 text-center space-y-3 hover:shadow-md transition-all">
                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-emerald-600 p-0.5 shadow-sm">
                    <img src={expert.photo} alt={expert.name} className="w-full h-full object-cover rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 text-xs leading-tight">{expert.name}</h3>
                    <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">{expert.role}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 6. Pricing Cards Section (Paket Layanan) */}
      <section id="harga" className="py-20 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              Pilihan Paket Layanan
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Pilih Paket Sesuai Kebutuhan Finansial Anda
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Mulai dari akses gratis hingga bimbingan personal 1-on-1 bersama pakar fiqh muamalah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Tier 1: Free */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block mb-2">Free</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900">Rp 0</span>
                  <span className="text-xs text-slate-400 font-medium">/ selamanya</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Fitur dasar untuk kepatuhan syariah pribadi sehari-hari.
                </p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 font-medium">
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Kalkulator Zakat Maal & Profesi</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Basic Financial Health Check</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> 5 Query AI Chatbot / Hari</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/signup')}
                className="mt-8 w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Mulai Gratis
              </button>
            </div>

            {/* Tier 2: Plus */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-2">Sharify Plus</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900">Rp 49.000</span>
                  <span className="text-xs text-slate-400 font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Modul lengkap pengelolaan utang riba & analisis keuangan aktif.
                </p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 font-medium">
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Semua Fitur Paket Free</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Unlimited AI Chatbot Queries</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Full Riba & Judol Detox Plan</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Halal Asset Screener Ticker</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="mt-8 w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors"
              >
                Pilih Plus
              </button>
            </div>

            {/* Tier 3: Pro (Popular) */}
            <div className="bg-gradient-to-b from-[#064E3B] to-emerald-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between relative transform lg:-translate-y-2 border border-emerald-500/30">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                MOST POPULAR
              </span>
              <div>
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider block mb-2 pt-2">Sharify Pro</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-white">Rp 149.000</span>
                  <span className="text-xs text-emerald-200 font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-emerald-100/90 font-medium mt-2 leading-relaxed">
                  Bimbingan 1-on-1 langsung bersama pakar & ulama syariah.
                </p>
                <ul className="mt-6 space-y-3 text-xs text-emerald-50 font-medium">
                  <li className="flex items-center"><span className="text-amber-400 mr-2 font-bold">✓</span> Semua Fitur Paket Plus</li>
                  <li className="flex items-center"><span className="text-amber-400 mr-2 font-bold">✓</span> 1-on-1 Scholar Consultation</li>
                  <li className="flex items-center"><span className="text-amber-400 mr-2 font-bold">✓</span> Direct Chat dengan Ustadz</li>
                  <li className="flex items-center"><span className="text-amber-400 mr-2 font-bold">✓</span> Prioritas Penanganan Syariah</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="mt-8 w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs shadow-md transition-colors"
              >
                Pilih Pro
              </button>
            </div>

            {/* Tier 4: Family */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block mb-2">Family Plan</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900">Rp 199.000</span>
                  <span className="text-xs text-slate-400 font-medium">/ bulan</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
                  Perencanaan finansial syariah terpadu untuk 4 anggota keluarga.
                </p>
                <ul className="mt-6 space-y-3 text-xs text-slate-600 font-medium">
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Hingga 4 Akun Pro Keluarga</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Simulator Faraidh (Harta Waris)</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Wakaf & Digital Wasiat Generator</li>
                  <li className="flex items-center"><span className="text-emerald-600 mr-2 font-bold">✓</span> Dashboard Baitul Mal Keluarga</li>
                </ul>
              </div>
              <button
                onClick={() => navigate('/pricing')}
                className="mt-8 w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Pilih Family
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. App Download Banner (Mulai Perjalanan Keuangan Islami Anda Sekarang Juga) */}
      <section className="my-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#064E3B] text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Smartphone Graphic */}
            <div className="lg:col-span-3 flex justify-center">
              <div className="w-[180px] h-[340px] bg-slate-950 border-[5px] border-slate-800 rounded-[2.2rem] p-4 flex flex-col justify-center items-center shadow-xl text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 p-2 border border-emerald-500/30 flex items-center justify-center">
                  <img src="/app logo.png" alt="Sharify Logo" className="w-full h-full object-contain" />
                </div>
                <span className="text-lg font-black text-white">Sharify</span>
                <span className="text-[8px] text-amber-300 font-mono">AI-Based Islamic Financial Advisory</span>
              </div>
            </div>

            {/* Center Call To Action Content */}
            <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Mulai Perjalanan Keuangan Islami Anda Sekarang Juga
              </h2>
              <p className="text-xs sm:text-sm text-emerald-100 font-medium leading-relaxed max-w-lg">
                Unduh Sharify dan dapatkan bimbingan keuangan yang sesuai syariah, dipersonalisasi untuk Anda.
              </p>

              {/* Download App Store Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-black hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-white/20 flex items-center space-x-2 text-left"
                >
                  <Download className="w-5 h-5 text-amber-400" />
                  <div>
                    <span className="text-[8px] block opacity-75 font-mono">Download on the</span>
                    <span className="text-xs font-black">App Store</span>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-black hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-white/20 flex items-center space-x-2 text-left"
                >
                  <Download className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-[8px] block opacity-75 font-mono">GET IT ON</span>
                    <span className="text-xs font-black">Google Play</span>
                  </div>
                </button>

                <button 
                  onClick={() => navigate('/dashboard')}
                  className="bg-black hover:bg-slate-900 text-white px-4 py-2.5 rounded-xl border border-white/20 flex items-center space-x-2 text-left"
                >
                  <Download className="w-5 h-5 text-rose-400" />
                  <div>
                    <span className="text-[8px] block opacity-75 font-mono">EXPLORE IT ON</span>
                    <span className="text-xs font-black">AppGallery</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Right Security & Privacy Card */}
            <div className="lg:col-span-3">
              <div className="bg-amber-500/10 border border-amber-400/30 p-5 rounded-2xl space-y-2 text-center lg:text-left backdrop-blur-xs">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mx-auto lg:mx-0">
                  <Lock className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-extrabold text-amber-300">Aman & Terlindungi</h4>
                <p className="text-[11px] text-emerald-100 font-medium leading-relaxed">
                  Data Anda 100% aman dengan enkripsi tingkat tinggi dan tidak digunakan untuk kepentingan lain.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Footer Section */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
            
            {/* Logo & Description */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center space-x-3">
                <img src="/app logo.png" alt="Sharify Logo" className="h-9 w-auto object-contain" />
                <div>
                  <span className="text-xl font-extrabold text-[#064E3B] tracking-tight block leading-none">Sharify</span>
                  <span className="text-[9px] font-bold text-amber-600 tracking-wider uppercase">AI-Based Islamic Financial Advisory</span>
                </div>
              </div>
              <p className="text-xs text-slate-500 font-medium max-w-sm leading-relaxed">
                Platform penasihat keuangan berbasis kecerdasan buatan (AI) yang membantu Anda mengelola, menyucikan, dan mengembangakan keuangan keluarga secara syariah.
              </p>
            </div>

            {/* Link Column 1: Produk */}
            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Produk</h4>
              <ul className="space-y-2 font-semibold text-slate-600">
                <li><a href="#fitur" className="hover:text-[#064E3B]">Fitur</a></li>
                <li><a href="#harga" className="hover:text-[#064E3B]">Harga</a></li>
                <li><button onClick={() => navigate('/dashboard')} className="hover:text-[#064E3B]">Unduh</button></li>
              </ul>
            </div>

            {/* Link Column 2: Perusahaan */}
            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Perusahaan</h4>
              <ul className="space-y-2 font-semibold text-slate-600">
                <li><a href="#tentang-kami" className="hover:text-[#064E3B]">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-[#064E3B]">Karir</a></li>
                <li><a href="#" className="hover:text-[#064E3B]">Kontak</a></li>
              </ul>
            </div>

            {/* Link Column 3: Bantuan */}
            <div className="space-y-3 text-xs">
              <h4 className="font-extrabold text-slate-900 uppercase tracking-wider">Bantuan</h4>
              <ul className="space-y-2 font-semibold text-slate-600">
                <li><a href="#" className="hover:text-[#064E3B]">FAQ</a></li>
                <li><a href="#" className="hover:text-[#064E3B]">Pusat Bantuan</a></li>
                <li><Link to="/terms" className="hover:text-[#064E3B]">Syarat & Ketentuan</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Bar: Copyright & Socials */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-slate-500">
            <p>© 2024 Sharify. All rights reserved.</p>
            
            <div className="flex items-center space-x-4 text-slate-600">
              <span className="text-[11px] font-bold text-slate-400 mr-1">Ikuti Kami:</span>
              <a href="#" className="hover:text-[#064E3B]" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className="hover:text-[#064E3B]" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.592 9 4.415V8z"/></svg>
              </a>
              <a href="#" className="hover:text-[#064E3B]" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
              <a href="#" className="hover:text-[#064E3B]" aria-label="LinkedIn">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
            </div>
          </div>

        </div>
      </footer>

      {/* Floating WhatsApp Admin Chat Widget */}
      <FloatingWhatsAppChat />
    </div>
  );
};
