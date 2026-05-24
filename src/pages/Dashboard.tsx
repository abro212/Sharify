import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { Wallet, TrendingUp, AlertTriangle, ShieldCheck, Calculator, ArrowRight, History } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';

export const Dashboard: React.FC = () => {
  const { profile, session } = useAuthStore();
  const [financialProfile, setFinancialProfile] = useState<any>(null);
  const [zakatHistory, setZakatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!session?.user?.id) return;
      
      // Fetch Health Check Profile
      const { data: profileData } = await supabase
        .from('financial_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();
        
      if (profileData) {
        setFinancialProfile(profileData);
      }

      // Fetch Zakat History
      const { data: zakatData } = await supabase
        .from('zakat_history')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (zakatData) {
        setZakatHistory(zakatData);
      }

      setLoading(false);
    };

    fetchDashboardData();
  }, [session?.user?.id]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-primary border-primary';
    if (score >= 50) return 'text-yellow-500 border-yellow-500';
    return 'text-red-500 border-red-500';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return { title: 'Good Standing', desc: 'Your Sharia compliance score is high. Keep it up!' };
    if (score >= 50) return { title: 'Needs Attention', desc: 'You have some exposure to Riba or high conventional debt. Consider transitioning to Halal alternatives.' };
    return { title: 'Critical', desc: 'High Riba exposure detected. We highly recommend using our Riba Detox tool immediately.' };
  };

  return (
    <DashboardContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
        <p className="text-gray-500">Here's your executive financial overview.</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Total Assets</h3>
            <Wallet className="text-primary h-5 w-5" />
          </div>
          <p className="text-3xl font-bold text-gray-900 truncate">
            Rp {financialProfile?.assets ? financialProfile.assets.toLocaleString('id-ID') : '0'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Monthly Income</h3>
            <TrendingUp className="text-accent h-5 w-5" />
          </div>
          <p className="text-3xl font-bold text-gray-900 truncate">
            Rp {financialProfile?.monthly_income ? financialProfile.monthly_income.toLocaleString('id-ID') : '0'}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 font-medium">Conventional Debts</h3>
            <AlertTriangle className="text-red-500 h-5 w-5" />
          </div>
          <p className="text-3xl font-bold text-gray-900 truncate">
            Rp {financialProfile?.conventional_debts ? financialProfile.conventional_debts.toLocaleString('id-ID') : '0'}
          </p>
          {financialProfile?.conventional_debts > 0 && (
            <p className="text-xs font-medium text-red-500 mt-2 bg-red-50 inline-block px-2 py-1 rounded">Needs attention</p>
          )}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Health Check */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              Financial Health Check
            </h2>
          </div>

          {loading ? (
            <div className="animate-pulse flex items-center space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          ) : financialProfile ? (
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left flex-1">
              <div className={`w-28 h-28 flex-shrink-0 rounded-full border-8 flex items-center justify-center mb-4 sm:mb-0 ${getScoreColor(financialProfile.health_score)}`}>
                <span className={`text-3xl font-bold ${getScoreColor(financialProfile.health_score).split(' ')[0]}`}>
                  {financialProfile.health_score}
                </span>
              </div>
              <div className="sm:ml-6 flex-1 flex flex-col justify-center">
                <h3 className="font-semibold text-gray-900 text-lg">{getScoreMessage(financialProfile.health_score).title}</h3>
                <p className="text-gray-500 mt-1">{getScoreMessage(financialProfile.health_score).desc}</p>
                <Link to="/health-check" className="inline-flex items-center mt-4 text-primary font-medium hover:text-primary-dark">
                  Retake Assessment <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 flex-1 flex flex-col justify-center items-center">
              <ShieldCheck className="h-12 w-12 text-gray-200 mb-3" />
              <h3 className="text-md font-bold text-gray-900 mb-1">No Assessment Found</h3>
              <p className="text-sm text-gray-500 mb-5 max-w-sm">
                Take your first Sharia compliance check to unlock personalized insights.
              </p>
              <Link 
                to="/health-check" 
                className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Take Assessment
              </Link>
            </div>
          )}
        </div>

        {/* Right Column: Zakat Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center">
              <Calculator className="h-5 w-5 mr-2 text-accent" />
              Recent Zakat Activity
            </h2>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="animate-pulse flex p-4 bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : zakatHistory.length > 0 ? (
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                {zakatHistory.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center mr-3 sm:mr-4">
                        <History className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm sm:text-base capitalize">Zakat {item.zakat_type}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {item.zakat_obligation > 0 ? (
                        <>
                          <p className="font-bold text-accent text-sm sm:text-base">Rp {Math.round(item.zakat_obligation).toLocaleString('id-ID')}</p>
                          <p className="text-xs text-gray-500">Obligation</p>
                        </>
                      ) : (
                        <p className="font-medium text-gray-500 text-sm">Below Nisab</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <Link to="/zakat" className="inline-flex items-center text-sm text-gray-500 hover:text-accent font-medium">
                  Calculate New Zakat <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 flex-1 flex flex-col justify-center items-center">
              <Calculator className="h-12 w-12 text-gray-200 mb-3" />
              <h3 className="text-md font-bold text-gray-900 mb-1">No Zakat Records</h3>
              <p className="text-sm text-gray-500 mb-5 max-w-sm">
                You haven't saved any Zakat calculations yet. Keep track of your obligations here.
              </p>
              <Link 
                to="/zakat" 
                className="bg-accent hover:bg-[#b08d45] text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm"
              >
                Open Calculator
              </Link>
            </div>
          )}
        </div>

      </div>
    </DashboardContainer>
  );
};
