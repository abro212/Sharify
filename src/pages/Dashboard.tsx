import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Bell, Search, SlidersHorizontal,
  Coins, Target, Calculator, Search as SearchIcon, Heart, FileText, Users, LayoutGrid, CheckCircle
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export const Dashboard: React.FC = () => {
  const { profile, user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const services = [
    { name: 'Cashflow', icon: Coins, path: '/cashflow', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { name: 'Goals', icon: Target, path: '/goals', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    { name: 'Zakat', icon: Calculator, path: '/zakat', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { name: 'Screener', icon: SearchIcon, path: '/screener', iconColor: 'text-indigo-500', bgColor: 'bg-indigo-50' },
    { name: 'Qurban', icon: Heart, path: '/qurban-saver', iconColor: 'text-amber-700', bgColor: 'bg-amber-50' },
    { name: 'Smart Akad', icon: FileText, path: '/akad-analyzer', iconColor: 'text-slate-800', bgColor: 'bg-slate-100' },
    { name: 'Family', icon: Users, path: '/family-dashboard', iconColor: 'text-rose-500', bgColor: 'bg-rose-50' },
    { name: 'More', icon: LayoutGrid, path: '#', iconColor: 'text-blue-600', bgColor: 'bg-blue-100' },
  ];

  return (
    <DashboardContainer>
      <div className="px-6 pt-12 pb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-sm">
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" className="w-full h-full object-cover" />
              )}
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Hello 👋</p>
              <h1 className="text-lg font-bold text-slate-900">{profile?.full_name || 'Guest User'}</h1>
            </div>
          </div>
          <button className="relative p-3 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.05)] text-slate-700 hover:bg-slate-50 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              2
            </span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search for any service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl py-4 pl-4 pr-12 text-sm text-slate-900 placeholder-slate-400 shadow-[0_2px_15px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
          <button className="p-4 bg-white rounded-2xl shadow-[0_2px_15px_rgb(0,0,0,0.04)] text-slate-700 hover:bg-slate-50 transition-colors">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Promo Banner */}
        <div className="relative bg-gradient-to-br from-cyan-300 to-blue-400 rounded-3xl p-6 mb-10 overflow-hidden shadow-lg shadow-blue-500/20">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 right-10 w-24 h-24 bg-blue-500/20 rounded-full blur-xl translate-y-1/2"></div>
          
          <div className="relative z-10 w-2/3">
            <p className="text-orange-600 font-bold text-sm mb-1 drop-shadow-sm">Save 25% Today!</p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight mb-4">
              Exclusive discounts<br/>on premium service
            </h2>
            <Link to="/upgrade" className="inline-block bg-orange-400 hover:bg-orange-500 text-white text-sm font-bold py-2.5 px-5 rounded-xl shadow-md transition-colors">
              <span className="flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Book Now
              </span>
            </Link>
          </div>
          {/* Placeholder for 3D illustration (the handy-man in the image) */}
          <div className="absolute -bottom-4 -right-4 w-44 h-44 object-contain opacity-90 drop-shadow-2xl">
            <img src="https://illustrations.popsy.co/amber/freelancer.svg" alt="Illustration" className="w-full h-full object-contain" />
          </div>
        </div>

        {/* Most Booked Services */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Most Booked Services</h3>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-800">View all</button>
          </div>
          
          <div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {services.map((service, index) => (
              <Link key={index} to={service.path} className="flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.06)] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform duration-300`}>
                  <div className={`w-10 h-10 rounded-full ${service.bgColor} flex items-center justify-center`}>
                    <service.icon className={`w-5 h-5 ${service.iconColor}`} />
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-slate-700">{service.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Near You */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-900">Popular Near You</h3>
            <button className="text-sm font-medium text-slate-500 hover:text-slate-800">View all</button>
          </div>
          
          <div className="bg-white rounded-3xl p-4 shadow-[0_4px_25px_rgb(0,0,0,0.05)] border border-slate-100 flex items-center">
            <div className="relative">
              <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver" alt="Expert" className="w-14 h-14 bg-slate-100 rounded-full object-cover" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center">
                <CheckCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <div className="ml-4 flex-1">
              <h4 className="text-base font-bold text-slate-900">Expert Consultant</h4>
              <p className="text-sm font-bold text-slate-500 mt-0.5">$45 <span className="font-normal text-slate-400">/ session</span></p>
            </div>
            
            <div className="px-3 py-1 bg-orange-400 text-white text-[10px] font-bold rounded-lg self-start mt-1">
              Premium
            </div>
          </div>
        </div>
        
        {/* Extra spacing for bottom nav */}
        <div className="h-8"></div>
      </div>
    </DashboardContainer>
  );
};
