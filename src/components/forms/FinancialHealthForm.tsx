import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { CheckCircle, AlertTriangle } from 'lucide-react';

type FormData = {
  monthlyIncome: number;
  assets: number;
  conventionalDebts: number;
  shariaDebts: number;
  ribaExposure: boolean;
};

export const FinancialHealthForm: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<FormData>({
    defaultValues: {
      monthlyIncome: 0,
      assets: 0,
      conventionalDebts: 0,
      shariaDebts: 0,
      ribaExposure: false,
    }
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { session } = useAuthStore();
  const navigate = useNavigate();

  // Watch the riba exposure checkbox for step 3
  const ribaExposure = watch('ribaExposure');

  const calculateScore = (data: FormData): number => {
    let score = 100;

    const totalDebts = Number(data.conventionalDebts) + Number(data.shariaDebts);
    const dti = data.monthlyIncome > 0 ? (totalDebts / data.monthlyIncome) : 0;

    // 1. DTI Penalty (Debt to Income Ratio)
    if (dti > 0.4) score -= 20;
    else if (dti > 0.3) score -= 10;

    // 2. Riba Exposure Flag Penalty
    if (data.ribaExposure) score -= 20;

    // 3. Conventional Debt Penalty (Heavy)
    if (totalDebts > 0 && data.conventionalDebts > 0) {
      const conventionalRatio = data.conventionalDebts / totalDebts;
      // Penalize heavily if a large chunk of debt is conventional
      if (conventionalRatio > 0.8) score -= 40;
      else if (conventionalRatio > 0.5) score -= 30;
      else if (conventionalRatio > 0.2) score -= 15;
      else score -= 5;
    }

    // Ensure score stays within 0-100
    return Math.max(0, Math.min(100, score));
  };

  const onSubmit = async (data: FormData) => {
    if (!session?.user?.id) return;
    setIsSubmitting(true);

    const score = calculateScore(data);

    const { error } = await supabase
      .from('financial_profiles')
      .upsert({
        user_id: session.user.id,
        monthly_income: data.monthlyIncome,
        assets: data.assets,
        conventional_debts: data.conventionalDebts,
        sharia_debts: data.shariaDebts,
        riba_exposure: data.ribaExposure,
        health_score: score,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' });

    setIsSubmitting(false);

    if (!error) {
      navigate('/dashboard'); // Navigate back to dashboard to see the score
    } else {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm ${
              step >= i ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {step > i ? <CheckCircle size={20} /> : i}
            </div>
            {i < 3 && (
              <div className={`h-1 w-16 sm:w-24 mx-2 ${
                step > i ? 'bg-primary' : 'bg-gray-100'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Income & Assets</h2>
            <p className="text-gray-500 mb-6">Let's start by understanding your incoming wealth.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Income (Rp)</label>
                <input
                  type="number"
                  {...register('monthlyIncome', { min: 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. 15000000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Assets (Rp)</label>
                <span className="text-xs text-gray-400 block mb-2">Include cash, gold, stocks, and property.</span>
                <input
                  type="number"
                  {...register('assets', { min: 0 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
                  placeholder="e.g. 100000000"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Liabilities & Debts</h2>
            <p className="text-gray-500 mb-6">Separate your debts to evaluate Sharia compliance accurately.</p>
            
            <div className="space-y-4">
              <div className="p-4 bg-red-50 border border-red-100 rounded-lg">
                <label className="block text-sm font-medium text-red-800 mb-1">Conventional Debts (Rp)</label>
                <span className="text-xs text-red-600 block mb-2">Credit cards, standard KPR, bank loans with interest (Riba).</span>
                <input
                  type="number"
                  {...register('conventionalDebts', { min: 0 })}
                  className="w-full px-4 py-3 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                  placeholder="e.g. 50000000"
                />
              </div>
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <label className="block text-sm font-medium text-green-800 mb-1">Sharia Debts (Rp)</label>
                <span className="text-xs text-green-600 block mb-2">KPR Syariah, Paylater Syariah, Qardh (interest-free loans).</span>
                <input
                  type="number"
                  {...register('shariaDebts', { min: 0 })}
                  className="w-full px-4 py-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="e.g. 10000000"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Riba Exposure</h2>
            <p className="text-gray-500 mb-6">Final check on your financial interactions.</p>
            
            <div className="space-y-4">
              <label className="flex items-start p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <div className="flex items-center h-5">
                  <input
                    type="checkbox"
                    {...register('ribaExposure')}
                    className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <span className="font-medium text-gray-900 block">I am exposed to Riba activities</span>
                  <span className="text-gray-500 font-normal">This includes conventional bank interests, late payment fines on non-Sharia platforms, or trading non-halal stocks.</span>
                </div>
              </label>

              {ribaExposure && (
                <div className="flex items-start p-4 bg-yellow-50 text-yellow-800 rounded-lg">
                  <AlertTriangle className="h-5 w-5 mr-3 flex-shrink-0" />
                  <p className="text-sm">Riba is strictly prohibited in Islam. Our AI Assistant and Riba Detox tools will help you find alternatives.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
            className={`px-6 py-2 rounded-lg font-medium ${
              step === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Back
          </button>
          
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent hover:bg-accent-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Calculating...' : 'See My Score'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
