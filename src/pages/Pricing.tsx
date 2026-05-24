import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Check, Crown, Zap, Shield, Users, ShieldCheck } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-accent selection:text-white">
      {/* Landing Navbar */}
      <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <ShieldCheck className="h-8 w-8 text-[#0F4C3A]" />
            <span className="ml-2 text-2xl font-bold text-gray-900 tracking-tight">Sharify</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Masuk</Link>
            <Link to="/signup" className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm">
              Daftar Gratis
            </Link>
          </div>
        </div>
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
