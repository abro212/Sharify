import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Login: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg('');
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal masuk dengan Google');
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50/40 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Decorative Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-br from-emerald-200/20 to-teal-200/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-amber-200/15 to-emerald-200/25 blur-3xl pointer-events-none" />

      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          to="/" 
          className="group flex items-center space-x-2 text-sm font-bold text-emerald-700 hover:text-emerald-900 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Kembali ke Home</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-gradient-to-br from-[#0F4C3A] to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-900/10 border border-emerald-500/10">
            <ShieldCheck className="h-9 w-9 text-[#D4AF37]" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Selamat Datang di <span className="bg-gradient-to-r from-emerald-800 to-amber-600 bg-clip-text text-transparent font-black">Sharify</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Mulailah perjalanan finansial Syariah Anda bersama kami
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/80 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl border border-white/50 rounded-3xl">
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {errorMsg && (
              <div className="bg-rose-50 text-rose-600 border border-rose-100 p-3.5 rounded-xl text-xs font-semibold text-center animate-shake">
                {errorMsg}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email address</label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  {...register('email', { required: 'Email address is required' })}
                  type="email"
                  placeholder="name@example.com"
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 bg-white/70"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email.message as string}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <a href="#forgot" className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors">
                  Lupa password?
                </a>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-gray-400" />
                </div>
                <input
                  {...register('password', { required: 'Password is required' })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 text-sm transition-all duration-200 bg-white/70"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password.message as string}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-emerald-800 to-emerald-600 hover:from-emerald-900 hover:to-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-700 disabled:opacity-50 transition-all duration-300 transform active:scale-[0.98]"
              >
                {loading ? 'Masuk...' : 'Masuk ke Akun'}
              </button>
            </div>
          </form>

          {/* Social Auth Separator */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/80 px-3.5 text-gray-400 font-bold tracking-wider text-[10px]">Atau masuk dengan</span>
              </div>
            </div>

            <div className="mt-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-200 hover:border-emerald-500/40 rounded-xl shadow-sm bg-white hover:bg-emerald-50/20 text-sm font-bold text-gray-700 transition-all duration-200 group"
              >
                <svg className="h-5 w-5 mr-3 group-hover:scale-105 transition-transform" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.56h3.29c1.92,-1.77 3.03,-4.38 3.03,-7.37C21.65,11.83 21.54,11.43 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.57c2.59,0 4.77,-0.86 6.35,-2.33l-3.29,-2.56c-0.91,0.61 -2.07,0.98 -3.06,0.98 -2.36,0 -4.36,-1.59 -5.07,-3.73H3.5v2.64C5.12,18.8 8.35,20.57 12,20.57z" fill="#34A853" />
                  <path d="M6.93,12.92a5.16,5.16 0 0 1 0,-3.24V7.04H3.5a8.59,8.59 0 0 0 0,7.32l3.43,-2.64z" fill="#FBBC05" />
                  <path d="M12,6.93c1.41,0 2.67,0.48 3.67,1.44l2.75,-2.75C16.77,4.07 14.59,3.43 12,3.43 8.35,3.43 5.12,5.2 3.5,8.76l3.43,2.64c0.71,-2.14 2.71,-3.73 5.07,-3.73z" fill="#EA4335" />
                </svg>
                <span>Masuk dengan Google</span>
              </button>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-100/60 text-center">
            <p className="text-xs text-gray-500">
              Belum punya akun?{' '}
              <Link to="/signup" className="font-extrabold text-emerald-700 hover:text-emerald-950 hover:underline transition-all">
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
