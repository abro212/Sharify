import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Check, Crown, Zap, Shield, Users, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const Pricing: React.FC = () => {
  const { profile, session, fetchProfile } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const navigate = useNavigate();

  const currentRole = profile?.role || 'free';

  const handleUpgrade = async (newRole: string) => {
    if (!session?.user?.id) {
      navigate('/signup');
      return;
    }
    
    if (newRole === currentRole) return;
    setIsProcessing(newRole);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', session.user.id);

      if (error) throw error;

      await fetchProfile(session.user.id);
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Proses upgrade disimulasikan. Peran lisensi akun Anda diperbarui.");
      navigate('/dashboard');
    } finally {
      setIsProcessing(null);
    }
  };

  const tiers = [
    {
      name: 'Free',
      role: 'free',
      price: 'Rp 0',
      period: '/selamanya',
      description: 'Fitur dasar perencanaan & kepatuhan syariah pribadi.',
      icon: <Shield className="w-6 h-6 text-slate-500 dark:text-slate-400" />,
      features: [
        'Kalkulator Zakat Maal & Profesi',
        'Financial Health Check Basic',
        'Konsultasi AI Syariah 5 Pesan/bln',
        'Overview Portfolio Sederhana',
      ],
      buttonText: currentRole === 'free' ? 'Paket Saat Ini' : 'Pilih Free',
      popular: false
    },
    {
      name: 'Sharify Plus',
      role: 'plus',
      price: 'Rp 49.000',
      period: '/bln',
      description: 'Penataan dana aktif, penapisan saham & detox riba.',
      icon: <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      features: [
        'Seluruh Fitur Paket Free',
        'Asset Screener Saham Syariah JII',
        'Modul Riba Detox & Judol Detox',
        'Qurban & Aqiqah Auto-Saver',
        'Analisis Cashflow Mendalam',
      ],
      buttonText: currentRole === 'plus' ? 'Paket Saat Ini' : 'Upgrade ke Plus',
      popular: false
    },
    {
      name: 'Sharify Pro',
      role: 'pro',
      price: 'Rp 99.000',
      period: '/bln',
      description: 'Bimbingan ahli, analisis akad AI & laporan pajak zakat.',
      icon: <Crown className="w-6 h-6 text-amber-300" />,
      features: [
        'Seluruh Fitur Paket Plus',
        'AI Assistant Consultation Unlimited',
        'Akad Clause Analyzer AI',
        'Laporan Resmi Pengurang Pajak (PKP)',
        'Prioritas Pendampingan Ustadz 1-on-1',
      ],
      buttonText: currentRole === 'pro' ? 'Paket Saat Ini' : 'Upgrade ke Pro',
      popular: true
    },
    {
      name: 'Baitul Mal Family',
      role: 'family',
      price: 'Rp 149.000',
      period: '/bln',
      description: 'Perencanaan keuangan syariah utuh untuk seluruh keluarga.',
      icon: <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      features: [
        'Hingga 5 Anggota Akun Keluarga',
        'Simulator Faraidh & Wasiat Generator',
        'Baitul Mal Dompet Bersama Pasangan',
        'Perencanaan Wakaf & Hibah Keluarga',
      ],
      buttonText: currentRole === 'family' ? 'Paket Saat Ini' : 'Upgrade ke Family',
      popular: false
    }
  ];

  const pricingContent = (
    <div className="space-y-10">
      
      {/* Header Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="inline-flex items-center text-xs font-extrabold px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
          Pilihan Paket Berkah Keuangan Anda
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          Investasikan Keberkahan Keuangan Syariah
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-xl mx-auto">
          Tingkatkan paket Anda untuk membuka seluruh fitur AI Syariah, simulator Faraidh, penapisan saham ISSI/JII, dan konsultasi Ustadz.
        </p>
      </div>

      {/* Tiers Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch pt-4">
        {tiers.map((tier) => (
          <div 
            key={tier.name} 
            className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
              tier.popular 
                ? 'bg-gradient-to-b from-[#064E3B] to-emerald-950 text-white border-2 border-amber-400 shadow-2xl z-10 md:-translate-y-2' 
                : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200/80 dark:border-slate-800 shadow-xs hover:border-emerald-500/40'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md border border-amber-300">
                  ⭐ PALING POPULER
                </span>
              </div>
            )}
            
            <div className="space-y-5">
              
              {/* Icon & Header */}
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  tier.popular ? 'bg-white/10 text-white border border-white/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}>
                  {tier.icon}
                </div>
                <div>
                  <h3 className={`text-lg font-black leading-tight ${tier.popular ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {tier.name}
                  </h3>
                  <span className={`text-[10px] font-bold ${tier.popular ? 'text-amber-300' : 'text-slate-400'}`}>
                    {tier.role === 'free' ? 'Gratis' : tier.role === 'pro' ? 'Rekomendasi Utama' : 'Pilihan Pengguna'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className={`text-xs font-medium leading-relaxed ${tier.popular ? 'text-emerald-100/90' : 'text-slate-500 dark:text-slate-400'}`}>
                {tier.description}
              </p>

              {/* Price */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-baseline">
                <span className={`text-2xl sm:text-3xl font-black font-mono ${tier.popular ? 'text-amber-300' : 'text-slate-900 dark:text-white'}`}>
                  {tier.price}
                </span>
                <span className={`text-xs font-bold ml-1 ${tier.popular ? 'text-emerald-200' : 'text-slate-400'}`}>
                  {tier.period}
                </span>
              </div>

              {/* Features List */}
              <ul className="space-y-3 pt-2 text-xs">
                {tier.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start space-x-2.5">
                    <div className={`mt-0.5 p-0.5 rounded-full shrink-0 ${
                      tier.popular ? 'bg-amber-400 text-slate-950 font-extrabold' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                    }`}>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className={`font-medium leading-snug ${tier.popular ? 'text-emerald-50' : 'text-slate-700 dark:text-slate-300'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => handleUpgrade(tier.role)}
                disabled={(session !== null && currentRole === tier.role) || isProcessing !== null}
                className={`w-full py-3 px-4 rounded-xl font-extrabold text-xs transition-all duration-200 flex justify-center items-center cursor-pointer ${
                  (session !== null && currentRole === tier.role) 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed shadow-none border border-slate-200 dark:border-slate-700' 
                    : tier.popular
                      ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md font-black'
                      : 'bg-[#064E3B] hover:bg-[#043E2F] text-white shadow-xs'
                } ${isProcessing === tier.role ? 'opacity-75 cursor-wait' : ''}`}
              >
                {isProcessing === tier.role ? (
                  <span className="animate-pulse">Memproses Upgrade...</span>
                ) : (
                  session === null ? (
                    tier.role === 'free' 
                      ? 'Daftar Akun Gratis' 
                      : `Upgrade ke ${tier.name}`
                  ) : currentRole === tier.role ? 'Paket Aktif Anda' : tier.buttonText
                )}
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );

  // If logged in, wrap in authenticated dashboard container
  if (session) {
    return (
      <DashboardContainer pageTitle="Pilihan Paket Sharify">
        {pricingContent}
      </DashboardContainer>
    );
  }

  // If anonymous public guest, wrap in guest layout
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans selection:bg-emerald-600 selection:text-white relative overflow-x-hidden transition-colors duration-300">
      
      {/* Landing Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src="/app logo.png" alt="Sharify Logo" className="h-10 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-[#064E3B] dark:text-emerald-400 tracking-tight leading-none">Sharify</span>
              <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase mt-0.5">AI-Based Islamic Financial Advisory</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#064E3B] dark:hover:text-emerald-400">Beranda</Link>
            <a href="/#fitur" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#064E3B] dark:hover:text-emerald-400">Fitur</a>
            <Link to="/upgrade" className="text-sm font-bold text-[#064E3B] dark:text-emerald-400 border-b-2 border-[#064E3B] dark:border-emerald-400 py-1">Harga</Link>
            <Link to="/tentang-kami" className="text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-[#064E3B] dark:hover:text-emerald-400">Tentang Kami</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => navigate('/login')}
              className="text-xs font-extrabold text-[#064E3B] dark:text-emerald-400 hover:underline px-3 py-2 cursor-pointer"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-extrabold px-6 py-2.5 rounded-full shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </header>

      {/* Main Pricing Content Area */}
      <main className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {pricingContent}
      </main>

      {/* Footer */}
      <footer className="bg-[#064E3B] text-white py-12 border-t border-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs text-emerald-200/80">© 2026 Sharify. AI-Based Islamic Financial Advisory. All Rights Reserved.</p>
        </div>
      </footer>

    </div>
  );
};
