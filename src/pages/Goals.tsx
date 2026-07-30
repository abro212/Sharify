import React, { useState, useEffect } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Target, Plus, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

interface GoalItem {
  id: string;
  title: string;
  saved: number;
  target: number;
  category?: string;
}

const DEFAULT_GOALS: GoalItem[] = [
  { id: '1', title: 'Umrah & Harta Harapan 2025', saved: 25000000, target: 35000000, category: 'Ibadah' },
  { id: '2', title: 'DP Rumah Syariah (Tanpa Riba)', saved: 175000000, target: 500000000, category: 'Properti' },
  { id: '3', title: 'Dana Pensiun & Tabungan Hari Tua', saved: 200000000, target: 1000000000, category: 'Investasi' },
];

export const Goals: React.FC = () => {
  const { session } = useAuthStore();
  const [goals, setGoals] = useState<GoalItem[]>(DEFAULT_GOALS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Goal Form States
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newSaved, setNewSaved] = useState('');

  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchGoals = async () => {
      try {
        const { data, error } = await supabase
          .from('financial_goals')
          .select('*')
          .eq('user_id', session.user.id);

        if (!error && data && data.length > 0) {
          const mapped = data.map(g => ({
            id: g.id,
            title: g.title || g.goal_name,
            saved: g.current_amount || g.saved || 0,
            target: g.target_amount || g.target || 1000000,
            category: g.category || 'Umum',
          }));
          setGoals(mapped);
        }
      } catch (err) {
        console.error('[Goals] Error fetching goals:', err);
      }
    };
    fetchGoals();
  }, [session?.user?.id]);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newTarget) return;

    const targetVal = Math.max(1, Number(newTarget) || 0);
    const savedVal = Math.max(0, Number(newSaved) || 0);

    const newGoal: GoalItem = {
      id: `goal-${Date.now()}`,
      title: newTitle.trim(),
      saved: savedVal,
      target: targetVal,
      category: 'Finansial',
    };

    setGoals(prev => [newGoal, ...prev]);
    setIsModalOpen(false);

    // Save to Supabase if logged in
    if (session?.user?.id) {
      try {
        await supabase.from('financial_goals').insert([{
          user_id: session.user.id,
          title: newGoal.title,
          goal_name: newGoal.title,
          target_amount: targetVal,
          current_amount: savedVal,
        }]);
      } catch (err) {
        console.error('[Goals] Error inserting goal:', err);
      }
    }

    // Reset Form
    setNewTitle('');
    setNewTarget('');
    setNewSaved('');
  };

  return (
    <DashboardContainer pageTitle="Goal Planning">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Goal-Based Planning</h1>
            <p className="text-xs text-slate-500 font-medium">Plan and track your financial goals with barakah</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Target Baru</span>
          </button>
        </div>

        {/* Deep Emerald Header Card */}
        <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
          <div className="relative z-10 max-w-[70%] space-y-1">
            <h2 className="text-base font-extrabold text-white leading-tight">
              Rencanakan Target Keuangan Berkah
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              Pantau kemajuan dana Umrah, rumah syariah, dan tabungan masa depan Anda secara disiplin.
            </p>
          </div>
          
          <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
            <Target className="w-7 h-7" />
          </div>
        </div>

        {/* Goals Progress List Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Daftar Target Saya</h2>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {goals.length} Target Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {goals.map((item) => {
              const percent = item.target > 0 ? Math.min(100, Math.round((item.saved / item.target) * 100)) : 0;
              return (
                <div key={item.id} className="p-5 bg-slate-50/80 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-3 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-[#064E3B] dark:text-emerald-400 flex items-center justify-center font-black text-xs shrink-0">
                        {percent}%
                      </div>
                      <div className="truncate">
                        <h3 className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.title}</h3>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold uppercase tracking-wider">
                          {item.category || 'Finansial'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Terkumpul:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        Rp {item.saved.toLocaleString('id-ID')} / Rp {item.target.toLocaleString('id-ID')}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#064E3B] dark:bg-emerald-500 h-full transition-all duration-500 rounded-full" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Goal Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                  <Target className="w-4 h-4 mr-2 text-emerald-600" />
                  Tambah Target Finansial Baru
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddGoal} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Nama Target</label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Tabungan Haji 2026"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Target Dana (Rp)</label>
                  <input
                    type="number"
                    required
                    placeholder="Misal: 50000000"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Dana Terkumpul Saat Ini (Rp)</label>
                  <input
                    type="number"
                    placeholder="Misal: 5000000"
                    value={newSaved}
                    onChange={(e) => setNewSaved(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-extrabold text-slate-950 bg-amber-500 hover:bg-amber-600 shadow-md transition-colors"
                  >
                    Simpan Target
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardContainer>
  );
};
