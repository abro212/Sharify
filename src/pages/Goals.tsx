import React, { useState, useEffect } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Target, Save, Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type Goal = {
  id: string;
  goal_type: string;
  target_amount: number;
  target_date: string;
  monthly_savings_required: number;
  suggested_instrument: string;
};

export const Goals: React.FC = () => {
  const { session } = useAuthStore();
  const [goals, setGoals] = useState<Goal[]>([]);
  
  // Form State
  const [goalType, setGoalType] = useState('Haji');
  const [targetAmount, setTargetAmount] = useState<number>(0);
  const [targetDate, setTargetDate] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Load existing goals
  useEffect(() => {
    const fetchGoals = async () => {
      if (!session?.user?.id) return;
      const { data } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      if (data) setGoals(data);
    };
    fetchGoals();
  }, [session?.user?.id, saveStatus]);

  // Calculations
  const calculateGoal = () => {
    if (!targetAmount || !targetDate) return null;
    
    const today = new Date();
    const target = new Date(targetDate);
    const monthsDiff = (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
    
    if (monthsDiff <= 0) return null;

    const monthlyRequired = targetAmount / monthsDiff;
    
    let instrument = '';
    if (monthsDiff < 24) {
      instrument = 'Reksa Dana Pasar Uang Syariah / Deposito Syariah';
    } else if (monthsDiff <= 60) {
      instrument = 'Sukuk Ritel / Reksa Dana Pendapatan Tetap Syariah';
    } else {
      instrument = 'Reksa Dana Saham Syariah / Saham Syariah';
    }

    return { monthlyRequired, instrument, monthsDiff };
  };

  const preview = calculateGoal();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !preview) return;
    
    setIsSaving(true);
    setSaveStatus('idle');

    const { error } = await supabase
      .from('financial_goals')
      .insert({
        user_id: session.user.id,
        goal_type: goalType,
        target_amount: targetAmount,
        target_date: targetDate,
        monthly_savings_required: preview.monthlyRequired,
        suggested_instrument: preview.instrument
      });

    setIsSaving(false);
    if (!error) {
      setSaveStatus('success');
      setTargetAmount(0);
      setTargetDate('');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
    }
  };

  return (
    <DashboardContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <Target className="h-6 w-6 text-primary mr-2" />
          Goal-Based Islamic Planning
        </h1>
        <p className="text-gray-500">Set financial targets and discover the best Sharia instruments to reach them.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Add Goal Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-900 mb-6">Tentukan Target Baru</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tujuan Finansial</label>
              <select 
                value={goalType} 
                onChange={(e) => setGoalType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Haji">Biaya Haji</option>
                <option value="Umrah">Biaya Umrah</option>
                <option value="Qurban">Qurban</option>
                <option value="Education">Pendidikan Anak</option>
                <option value="Property">Beli Rumah (KPR Syariah)</option>
                <option value="Other">Lainnya</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Dana (Rp)</label>
              <input
                type="number"
                value={targetAmount || ''}
                onChange={(e) => setTargetAmount(Number(e.target.value))}
                required
                min="1000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Waktu Tercapai</label>
              <input
                type="month"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                required
                min={new Date().toISOString().slice(0, 7)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            {/* Preview Card */}
            {preview && (
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
                <p className="text-xs text-gray-500 mb-1">Estimasi Tabungan Bulanan ({preview.monthsDiff} bulan)</p>
                <p className="text-xl font-bold text-primary font-mono mb-3">
                  Rp {Math.round(preview.monthlyRequired).toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-gray-500 mb-1">Rekomendasi Instrumen Halal:</p>
                <p className="text-sm font-medium text-gray-900 leading-snug">{preview.instrument}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={!preview || isSaving}
              className={`w-full mt-4 flex items-center justify-center py-2.5 rounded-lg font-bold text-sm transition-colors ${
                !preview ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-[#0c3d2e] text-white shadow-md'
              }`}
            >
              {isSaving ? 'Menyimpan...' : <><Save className="w-4 h-4 mr-2" /> Simpan Target</>}
            </button>
            {saveStatus === 'success' && <p className="text-primary text-xs text-center mt-2 flex items-center justify-center"><CheckCircle className="w-3 h-3 mr-1"/> Disimpan!</p>}
          </form>
        </div>

        {/* Right: Saved Goals Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="font-bold text-gray-900 mb-2">Target Finansial Anda</h2>
          
          {goals.length === 0 ? (
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <Target className="h-12 w-12 text-gray-200 mb-4" />
              <p className="text-gray-500 max-w-sm">Anda belum memiliki target finansial yang tersimpan. Mulai rencanakan masa depan Anda sekarang.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <div key={goal.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-primary to-accent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-bold text-lg text-gray-900">{goal.goal_type}</h3>
                    <div className="flex items-center text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(goal.target_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-gray-500">Target Dana</p>
                    <p className="font-bold text-gray-900 font-mono">Rp {Math.round(goal.target_amount).toLocaleString('id-ID')}</p>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                     <p className="text-xs text-gray-500 mb-1">Tabungan Bulanan</p>
                     <p className="text-primary font-bold font-mono text-lg mb-2">Rp {Math.round(goal.monthly_savings_required).toLocaleString('id-ID')}</p>
                     <div className="flex items-start">
                       <TrendingUp className="w-4 h-4 text-accent mr-1.5 flex-shrink-0 mt-0.5" />
                       <p className="text-xs text-gray-600 font-medium leading-tight">{goal.suggested_instrument}</p>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardContainer>
  );
};
