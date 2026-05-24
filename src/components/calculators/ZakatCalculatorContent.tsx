import React, { useState, useEffect } from 'react';
import { Calculator, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

type ZakatType = 'maal' | 'profesi';

export const ZakatCalculatorContent: React.FC = () => {
  const { session } = useAuthStore();
  const [activeTab, setActiveTab] = useState<ZakatType>('profesi');
  
  // Inputs
  const [goldPrice, setGoldPrice] = useState<number>(1200000); // Default placeholder 1.2jt/gram
  const [wealthAmount, setWealthAmount] = useState<number>(0);
  
  // States
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Calculations
  const NISAB_GOLD_GRAMS = 85;
  const yearlyNisab = goldPrice * NISAB_GOLD_GRAMS;
  const currentNisab = activeTab === 'maal' ? yearlyNisab : yearlyNisab / 12;
  
  const isEligible = wealthAmount >= currentNisab;
  const zakatObligation = isEligible ? wealthAmount * 0.025 : 0;

  // Reset inputs when switching tabs
  useEffect(() => {
    setWealthAmount(0);
    setSaveStatus('idle');
  }, [activeTab]);

  const handleSave = async () => {
    if (!session?.user?.id) return;
    setIsSaving(true);
    setSaveStatus('idle');

    const { error } = await supabase
      .from('zakat_history')
      .insert({
        user_id: session.user.id,
        zakat_type: activeTab,
        gold_price_per_gram: goldPrice,
        calculated_wealth: wealthAmount,
        zakat_obligation: zakatObligation
      });

    setIsSaving(false);
    if (!error) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      console.error("Error saving zakat history:", error);
      setSaveStatus('error');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Form */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {/* Tab Toggles */}
        <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('profesi')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'profesi' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Zakat Profesi (Income)
          </button>
          <button
            onClick={() => setActiveTab('maal')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'maal' ? 'bg-white text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Zakat Maal (Wealth)
          </button>
        </div>

        <form className="space-y-6">
          {/* Global Setting: Gold Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Gold Price (Rp/gram)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="number"
                value={goldPrice || ''}
                onChange={(e) => setGoldPrice(Number(e.target.value))}
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">Used to determine the 85g gold Nisab threshold.</p>
          </div>

          {/* Dynamic Wealth Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {activeTab === 'profesi' ? 'Total Monthly Income (Rp)' : 'Total Assets (Savings, Gold, etc) (Rp)'}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">Rp</span>
              </div>
              <input
                type="number"
                value={wealthAmount || ''}
                onChange={(e) => setWealthAmount(Number(e.target.value))}
                placeholder="e.g. 15000000"
                className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>
        </form>
      </div>

      {/* Right Column: Result Card */}
      <div>
        <div className="bg-gradient-to-br from-[#0F4C3A] to-[#1a6650] rounded-xl shadow-lg p-8 text-white h-full flex flex-col justify-between relative overflow-hidden">
          {/* Decorative element */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-accent/20 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-accent">Calculation Result</h2>
              <Calculator className="text-accent opacity-80" />
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-300 mb-1">
                  {activeTab === 'profesi' ? 'Monthly Nisab Threshold' : 'Yearly Nisab Threshold'}
                </p>
                <p className="text-2xl font-semibold font-mono">
                  Rp {Math.round(currentNisab).toLocaleString('id-ID')}
                </p>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-sm text-gray-300 mb-2">Your Zakat Obligation (2.5%)</p>
                
                {wealthAmount === 0 ? (
                  <p className="text-lg text-gray-400 italic">Please enter your {activeTab === 'profesi' ? 'income' : 'assets'}.</p>
                ) : !isEligible ? (
                  <div className="flex items-center text-accent bg-accent/10 px-4 py-3 rounded-lg">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    <p className="font-medium">Alhamdulillah, you are below the Nisab. Zakat is not obligatory yet.</p>
                  </div>
                ) : (
                  <div>
                    <p className="text-4xl font-bold text-accent font-mono mb-2">
                      Rp {Math.round(zakatObligation).toLocaleString('id-ID')}
                    </p>
                    <p className="text-sm text-gray-300">
                      {activeTab === 'profesi' ? 'To be paid every month.' : 'To be paid once a year (Haul).'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button Action */}
          <div className="mt-10 pt-6 border-t border-white/10">
            <button
              onClick={handleSave}
              disabled={wealthAmount === 0 || isSaving}
              className={`w-full flex items-center justify-center py-3 rounded-lg font-medium transition-colors ${
                wealthAmount === 0 
                  ? 'bg-white/10 text-white/50 cursor-not-allowed' 
                  : 'bg-accent hover:bg-[#b08d45] text-[#0F4C3A]'
              }`}
            >
              {isSaving ? (
                <span className="animate-pulse">Saving...</span>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Save to History
                </>
              )}
            </button>

            {/* Status Messages */}
            {saveStatus === 'success' && (
              <p className="text-accent text-sm text-center mt-3 flex items-center justify-center">
                <CheckCircle className="mr-1 h-4 w-4" /> Successfully saved!
              </p>
            )}
            {saveStatus === 'error' && (
              <p className="text-red-400 text-sm text-center mt-3 flex items-center justify-center">
                <AlertCircle className="mr-1 h-4 w-4" /> Failed to save. Try again.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
