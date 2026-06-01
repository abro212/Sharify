import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Check, Crown, Zap, Shield, Users, ShieldCheck, Menu, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { bustCache } from '../store/settingsStore';
import { supabase } from '../lib/supabase';

export const Pricing: React.FC = () => {
  const { profile, session, fetchProfile } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);

  React.useEffect(() => {
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
            console.error('[Pricing] Logo fetch error:', error.message);
            setLogoUrl(null);
          } else {
            const rawUrl = data?.value;
            setLogoUrl(rawUrl && rawUrl.trim() !== '' ? rawUrl.trim() : null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Pricing] Unexpected logo fetch error:', err);
          setLogoUrl(null);
        }
      } finally {
        if (!cancelled) setLogoLoading(false);
      }
    };

    fetchLogo();
    return () => { cancelled = true; };
  }, []);

  const resolvedLogoUrl = React.useMemo(() => bustCache(logoUrl), [logoUrl]);

  const currentRole = profile?.role || 'free';

  const handleUpgrade = async (newRole: string) => {
    if (!session?.user?.id) {
      navigate('/signup');
      return;
    }
    
    // Prevent downgrading or upgrading to same tier
    if (newRole === currentRole) return;

    setIsProcessing(newRole);

    try {
      // Mock Payment Processing Delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Direct Supabase Role Update (Mock)
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', session.user.id);

      if (error) throw error;

      // Fetch fresh profile data to update UI instantly
      await fetchProfile(session.user.id);
      
      // Redirect to Dashboard on success
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Upgrade failed:", error);
      alert("Upgrade failed. Please ensure your user table policies allow updates.");
    } finally {
      setIsProcessing(null);
    }
  };

  const tiers = [
    {
      name: 'Free',
      role: 'free',
      price: 'Rp 0',
      description: 'Essential tools for personal Sharia compliance.',
      icon: <Shield className="w-6 h-6 text-gray-400" />,
      features: [
        'Zakat Calculator',
        'Basic Financial Health Check',
        'Limited AI Assistant Queries',
      ],
      buttonText: currentRole === 'free' ? 'Current Plan' : 'Downgrade',
      buttonStyle: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    },
    {
      name: 'Sharify Plus',
      role: 'plus',
      price: 'Rp 49.000',
      period: '/mo',
      description: 'Advanced tools for active financial management.',
      icon: <Zap className="w-6 h-6 text-primary" />,
      features: [
        'Everything in Free',
        'Unlimited AI Assistant Queries',
        'Full Riba Detox Action Plan',
        'Detailed Analytics'
      ],
      buttonText: currentRole === 'plus' ? 'Current Plan' : 'Upgrade to Plus',
      buttonStyle: 'bg-primary text-white hover:bg-primary-dark',
      popular: false
    },
    {
      name: 'Sharify Pro',
      role: 'pro',
      price: 'Rp 149.000',
      period: '/mo',
      description: 'Expert guidance and complex portfolio management.',
      icon: <Crown className="w-6 h-6 text-accent" />,
      features: [
        'Everything in Plus',
        '1-on-1 Human Scholar Consultations',
        'Direct Chat with Ustadz',
        'Priority Support'
      ],
      buttonText: currentRole === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      buttonStyle: 'bg-accent text-white hover:bg-[#b08d45]',
      popular: true
    },
    {
      name: 'Family Plan',
      role: 'family',
      price: 'Rp 199.000',
      period: '/mo',
      description: 'Comprehensive Sharia planning for the whole household.',
      icon: <Users className="w-6 h-6 text-[#0F4C3A]" />,
      features: [
        'Up to 4 Pro Accounts',
        'Faraidh (Inheritance) Simulator',
        'Wakaf Planning Tools',
        'Shared Family Dashboards'
      ],
      buttonText: currentRole === 'family' ? 'Current Plan' : 'Upgrade to Family',
      buttonStyle: 'bg-[#0F4C3A] text-white hover:bg-[#0a3628]',
      popular: false
    }
  ];

  const pricingContent = (
    <>
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight">Choose Your Sharia Financial Journey</h1>
        <p className="text-gray-500 text-lg">
          Upgrade your plan to unlock powerful AI features, inheritance simulators, and direct access to certified Islamic Scholars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-7xl mx-auto">
        {tiers.map((tier) => (
          <div 
            key={tier.name} 
            className={`relative bg-white rounded-2xl border ${
              tier.popular ? 'border-accent shadow-xl scale-105 z-10' : 'border-gray-200 shadow-sm'
            } p-6 flex flex-col transition-transform`}
          >
            {tier.popular && (
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-accent text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                <p className="text-sm text-gray-500 mt-1 h-10">{tier.description}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg">
                {tier.icon}
              </div>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900">{tier.price}</span>
              {tier.period && <span className="text-gray-500">{tier.period}</span>}
            </div>

            <ul className="space-y-3 mb-8 flex-1">
              {tier.features.map((feature, idx) => (
                <li key={idx} className="flex items-start">
                  <Check className={`w-5 h-5 mr-2 flex-shrink-0 ${tier.popular ? 'text-accent' : 'text-primary'}`} />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(tier.role)}
              disabled={(session !== null && currentRole === tier.role) || isProcessing !== null}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-colors flex justify-center items-center ${
                (session !== null && currentRole === tier.role) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : tier.buttonStyle
              } ${isProcessing === tier.role ? 'opacity-75 cursor-wait' : ''}`}
            >
              {isProcessing === tier.role ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                session === null ? (
                  tier.role === 'free' 
                    ? 'Daftar Gratis' 
                    : tier.role === 'plus' 
                    ? 'Upgrade ke Plus' 
                    : tier.role === 'pro' 
                    ? 'Upgrade ke Pro' 
                    : 'Mulai Family'
                ) : tier.buttonText
              )}
            </button>
          </div>
        ))}
      </div>
    </>
  );

  // If logged in, wrap in authenticated dashboard layout container
  if (session) {
    return (
      <DashboardContainer>
        {pricingContent}
      </DashboardContainer>
    );
  }

  // If anonymous public guest, wrap in landing page navbar and footer layouts
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-accent selection:text-white relative overflow-x-hidden">
      {/* Landing Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            {logoLoading ? (
              <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
            ) : resolvedLogoUrl ? (
              <img
                src={resolvedLogoUrl}
                alt="Sharify Logo"
                className="h-8 object-contain"
                onError={() => setLogoUrl(null)}
              />
            ) : (
              <div className="flex items-center group">
                <div className="h-9 w-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/10">
                  <ShieldCheck className="h-5.5 w-5.5 text-white" />
                </div>
                <span className="ml-2.5 text-xl font-bold text-gray-900 tracking-tight">Sharify</span>
              </div>
            )}
          </Link>
          
          {/* Navigation Links for Public Pricing page */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Fitur</a>
            <a href="/#solusi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Solusi</a>
            <a href="/#teknologi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Teknologi</a>
            <Link to="/upgrade" className="text-sm font-semibold text-[#10B981] transition-colors">Harga</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Masuk</Link>
            <Link to="/signup" className="bg-[#10B981] hover:bg-[#0d9488] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]">
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
                href="/#features" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Fitur
              </a>
              <a 
                href="/#solusi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Solusi
              </a>
              <a 
                href="/#teknologi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Teknologi
              </a>
              <Link 
                to="/upgrade" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-[#10B981] py-3 transition-colors border-b border-slate-50"
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

      {/* Main Pricing Content Area */}
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {pricingContent}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gray-200 py-12 text-center text-sm text-gray-400">
        &copy; {new Date().getFullYear()} Sharify App. Hak Cipta Dilindungi.
      </footer>
    </div>
  );
};
