import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import {
  Search,
  TrendingUp,
  MessageSquare,
  Calculator,
  RefreshCcw,
  ShieldAlert,
  FileText,
  Target,
  BookOpen,
  Activity,
  Users,
  ChevronRight,
  Sparkles,
  Heart
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const exploreItems = [
    {
      id: 'investasi',
      title: 'Investasi Halal',
      description: 'Halal investment options and screening',
      icon: TrendingUp,
      path: '/screener',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'ai-chat',
      title: 'AI Chatbot Syariah',
      description: 'Ask anything about Islamic Finance',
      icon: MessageSquare,
      path: '/chat',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'zakat',
      title: 'Zakat Calculator',
      description: 'Calculate your zakat easily and accurately',
      icon: Calculator,
      path: '/zakat',
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      id: 'riba-detox',
      title: 'Riba Detox',
      description: 'Identify and cleanse riba-based income',
      icon: RefreshCcw,
      path: '/riba-detox',
      color: 'bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400',
    },
    {
      id: 'judol-detox',
      title: 'Judol Detox',
      description: 'Steps to quit gambling and heal financially',
      icon: ShieldAlert,
      path: '/riba-detox',
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      id: 'faraidh',
      title: 'Faraidh & Wasiat Generator',
      description: 'Calculate inheritance according to Islam',
      icon: FileText,
      path: '/wasiat-generator',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'goals',
      title: 'Goal-Based Planning',
      description: 'Plan your financial goals with barakah',
      icon: Target,
      path: '/goals',
      color: 'bg-[#064E3B]/10 text-[#064E3B] dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'edukasi',
      title: 'Edukasi Fiqh Muamalah',
      description: 'Learn Islamic finance and transactions',
      icon: BookOpen,
      path: '/tentang-kami',
      color: 'bg-teal-500/10 text-teal-600 dark:bg-teal-500/20 dark:text-teal-400',
    },
    {
      id: 'health-check',
      title: 'Financial Health Score',
      description: 'Track and improve your financial wellbeing',
      icon: Activity,
      path: '/health-check',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
    {
      id: 'consultation',
      title: '1-on-1 Scholar Consultation',
      description: 'Book private session with trusted scholars',
      icon: Users,
      path: '/chat',
      color: 'bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400',
    },
    {
      id: 'family',
      title: 'Baitul Mal Keluarga',
      description: 'Shared family budget & charity vault',
      icon: Heart,
      path: '/family-dashboard',
      color: 'bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
    },
    {
      id: 'akad',
      title: 'Akad Clause Analyzer',
      description: 'Smart AI contract compliance audit',
      icon: Sparkles,
      path: '/akad-analyzer',
      color: 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
    },
  ];

  const filteredItems = exploreItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardContainer>
      <div className="p-5 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Explore</h1>
            <p className="text-xs text-slate-500 font-medium">Temukan seluruh fitur & modul Sharify</p>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search features, articles..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl text-xs font-medium text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all shadow-sm"
          />
        </div>

        {/* List of Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.path)}
              className="group bg-white dark:bg-slate-800/90 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-md hover:border-emerald-500/30 dark:hover:border-emerald-500/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`p-3 rounded-2xl ${item.color} flex items-center justify-center shrink-0`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              Tidak ada fitur yang cocok dengan kata kunci "{searchQuery}"
            </div>
          )}
        </div>

      </div>
    </DashboardContainer>
  );
};
