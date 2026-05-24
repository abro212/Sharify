import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { RefreshCcw, ShieldCheck } from 'lucide-react';

export const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // 1. Check if session exists immediately (parsed from hash parameters)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setSession(session);
        navigate('/dashboard');
      } else {
        // 2. Listen for session setup callback state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setSession(session);
            subscription.unsubscribe();
            navigate('/dashboard');
          } else {
            // 3. Graceful fallback timeout: redirect to login if no auth is retrieved in 3 seconds
            const timer = setTimeout(() => {
              subscription.unsubscribe();
              navigate('/login');
            }, 3000);
            return () => clearTimeout(timer);
          }
        });
      }
    };

    handleAuthCallback();
  }, [navigate, setSession]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 flex flex-col items-center justify-center p-4 font-sans">
      <div className="bg-white/80 backdrop-blur-md p-8 sm:p-10 border border-white/50 shadow-2xl rounded-3xl text-center max-w-sm w-full">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-gradient-to-br from-[#0F4C3A] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-950/10">
            <ShieldCheck className="h-9 w-9 text-amber-400" />
          </div>
        </div>
        <RefreshCcw className="w-8 h-8 text-emerald-700 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Memproses Autentikasi...</h3>
        <p className="text-xs text-gray-500">Menghubungkan akun Google Anda dengan Sharify secara aman.</p>
      </div>
    </div>
  );
};
