import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { 
  User, Mail, Calendar, Shield, LogOut, Bell, Key, 
  Download, CheckCircle2, CreditCard, ChevronRight, Sparkles,
  Camera, Loader2, X, Lock, Check
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Profile: React.FC = () => {
  const { user, profile, signOut } = useAuthStore();
  const navigate = useNavigate();
  const [notificationSettings, setNotificationSettings] = useState({
    weeklyDigest: true,
    zakatReminder: true,
    aiInsights: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Change Password Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const filePath = `avatars/${user.id}.${fileExt}`;

      let finalUrl = '';
      try {
        const { error: uploadErr } = await supabase.storage
          .from('assets')
          .upload(filePath, file, { cacheControl: '0', upsert: true });

        if (uploadErr) {
          throw uploadErr;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        finalUrl = `${publicUrl}?t=${Date.now()}`;
      } catch {
        finalUrl = await compressAndResizeImage(file);
      }

      const { data: { user: updatedUser }, error: authErr } = await supabase.auth.updateUser({
        data: { avatar_url: finalUrl }
      });

      if (authErr) throw authErr;

      if (updatedUser) {
        useAuthStore.setState({ user: updatedUser });
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err: any) {
      console.error("Avatar upload failed:", err);
      setUploadError(err.message || "Gagal mengunggah foto profil");
    } finally {
      setIsUploading(false);
    }
  };

  const compressAndResizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 150;
          const MAX_HEIGHT = 150;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context is null'));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(dataUrl);
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleToggle = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordMessage({ type: 'success', text: 'Kata sandi Anda berhasil diperbarui!' });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordMessage(null);
      }, 2000);
    } catch (err: any) {
      setPasswordMessage({ type: 'error', text: err.message || 'Gagal mengganti kata sandi.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return 'Baru Saja';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const renderRoleBadge = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xs border border-red-500/20">
            <Shield className="w-3.5 h-3.5 mr-1" /> System Admin
          </span>
        );
      case 'pro':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-[#D4AF37] text-white shadow-xs border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" /> Sharify Pro
          </span>
        );
      case 'plus':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#059669] to-[#10B981] text-white shadow-xs border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Sharify Plus
          </span>
        );
      case 'family':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-xs border border-indigo-500/20">
            <User className="w-3.5 h-3.5 mr-1" /> Family Plan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Free Member
          </span>
        );
    }
  };

  const initialLetter = profile?.full_name 
    ? profile.full_name.charAt(0) 
    : user?.email?.charAt(0) || 'U';

  return (
    <DashboardContainer pageTitle="Profil Saya">
      <div className="space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Akun Saya</h1>
            <p className="text-xs text-slate-500 font-medium">Kelola detail profil, preferensi notifikasi, dan status langganan Syariah Anda.</p>
          </div>
          {renderRoleBadge(profile?.role)}
        </div>

        {/* Responsive Grid Layout: Left 2 Cols (Main Profile & Settings), Right 1 Col (Subscription & Actions) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* LEFT 2 COLUMNS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Profile Info Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              
              {/* Mesh Emerald Gradient Banner */}
              <div className="h-28 bg-gradient-to-r from-[#064E3B] via-emerald-800 to-teal-700 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
              </div>
            
              {/* Avatar & Info */}
              <div className="px-6 pb-6 relative">
                <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-14 mb-4">
                  <div className="relative group h-24 w-24 bg-white dark:bg-slate-900 p-1 rounded-full shadow-md border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    
                    {/* Avatar Image */}
                    <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-slate-100 dark:bg-slate-800 relative">
                      {isUploading && (
                        <div className="absolute inset-0 bg-emerald-700/80 flex flex-col items-center justify-center text-white z-20">
                          <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
                          <span className="text-[8px] mt-0.5 font-bold uppercase text-white">Uploading</span>
                        </div>
                      )}
                      
                      {user?.user_metadata?.avatar_url ? (
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile Avatar" 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-gradient-to-tr from-[#064E3B] to-emerald-500 rounded-full flex items-center justify-center text-amber-300 text-2xl font-black uppercase">
                          {initialLetter}
                        </div>
                      )}
                    </div>

                    {/* Camera Upload Overlay */}
                    <label 
                      htmlFor="avatar-file-input" 
                      title="Ubah Foto Profil"
                      className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-200 z-10"
                    >
                      <Camera className="w-4 h-4 text-amber-300 mb-0.5" />
                      <span className="text-[8px] font-black uppercase text-slate-100">Ubah Foto</span>
                    </label>

                    <input 
                      id="avatar-file-input" 
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarChange}
                      className="hidden" 
                      disabled={isUploading}
                    />
                  </div>
                </div>

                <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white text-center sm:text-left">
                    {profile?.full_name || 'Pengguna Sharify'}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left flex items-center justify-center sm:justify-start mt-1 font-medium">
                    <Mail className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {user?.email}
                  </p>

                  {uploadError && (
                    <p className="text-xs text-rose-500 font-bold mt-2 text-center sm:text-left bg-rose-50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/40 px-3 py-1 rounded-lg inline-block">
                      ⚠️ {uploadError}
                    </p>
                  )}
                  {uploadSuccess && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-2 text-center sm:text-left bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 px-3 py-1 rounded-lg inline-block">
                      ✓ Foto profil berhasil diperbarui!
                    </p>
                  )}
                </div>

                {/* Account Details */}
                <div className="mt-5 space-y-3">
                  <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Informasi Personal</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</span>
                      <span className="block text-xs font-bold text-slate-800 dark:text-white mt-0.5">{profile?.full_name || 'Tidak ada'}</span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Terdaftar</span>
                      <span className="block text-xs font-bold text-slate-800 dark:text-white mt-0.5 truncate">{user?.email || 'Tidak ada'}</span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-slate-400" /> Tanggal Bergabung
                      </span>
                      <span className="block text-xs font-bold text-slate-800 dark:text-white mt-0.5">
                        {formatJoinedDate(user?.created_at)}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center">
                        <Shield className="w-3 h-3 mr-1 text-slate-400" /> User ID
                      </span>
                      <span className="block text-[11px] font-mono text-slate-600 dark:text-slate-300 mt-0.5 select-all truncate">
                        {user?.id}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Notification & AI Preferences Card */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center">
                <Bell className="w-4 h-4 text-emerald-600 mr-2" /> Preferensi Notifikasi & AI
              </h3>
              
              <div className="space-y-3.5 divide-y divide-slate-100 dark:divide-slate-800">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Weekly Sharia Finance Digest</h4>
                    <p className="text-[11px] text-slate-500">Menerima ringkasan kesehatan finansial mingguan dan tips bebas Riba.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('weeklyDigest')}
                    className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                      notificationSettings.weeklyDigest ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">Zakat Due Reminders</h4>
                    <p className="text-[11px] text-slate-500">Notifikasi otomatis saat nisab Zakat Anda terlampaui atau jatuh tempo haul.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('zakatReminder')}
                    className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                      notificationSettings.zakatReminder ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-white">AI Portfolio Alerts</h4>
                    <p className="text-[11px] text-slate-500">Rekomendasi otomatis dari Sharify AI jika terdapat instrumen non-halal terdeteksi.</p>
                  </div>
                  <button 
                    onClick={() => handleToggle('aiInsights')}
                    className={`w-10 h-5.5 flex items-center rounded-full p-0.5 transition-colors duration-300 cursor-pointer ${
                      notificationSettings.aiInsights ? 'bg-emerald-500 justify-end' : 'bg-slate-200 dark:bg-slate-700 justify-start'
                    }`}
                  >
                    <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-slate-100 dark:border-slate-800 gap-3">
                <span className="text-[10px] text-slate-400">Pembaruan preferensi tidak mempengaruhi data transaksi utama.</span>
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSaving}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors flex items-center justify-center shadow-xs cursor-pointer"
                >
                  {isSaving ? 'Menyimpan...' : saveSuccess ? '✓ Tersimpan' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN */}
          <div className="space-y-6">
            
            {/* Membership Tier Overview */}
            <div className="bg-gradient-to-br from-[#064E3B] to-emerald-900 text-white rounded-3xl p-6 shadow-lg shadow-emerald-950/20 relative overflow-hidden space-y-4">
              <div className="relative z-10 space-y-4">
                <h3 className="text-xs font-extrabold flex items-center uppercase tracking-wider text-amber-300">
                  <CreditCard className="w-4 h-4 text-amber-400 mr-2" /> Detail Keanggotaan
                </h3>

                <div>
                  <span className="text-[10px] text-emerald-100 font-bold uppercase tracking-wider block">Status Langganan</span>
                  <div className="flex items-baseline mt-0.5 space-x-2">
                    <span className="text-2xl font-black capitalize">{profile?.role || 'free'}</span>
                    <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                      {profile?.subscription_status ? '• Active' : '• Basic Tier'}
                    </span>
                  </div>
                </div>

                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 space-y-2.5 backdrop-blur-xs text-xs">
                  <div className="flex justify-between items-center">
                    <span className="opacity-80 font-medium text-[11px]">Metode Pembayaran</span>
                    <span className="font-bold text-amber-300 text-[11px]">Midtrans / QRIS</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-80 font-medium text-[11px]">Jatuh Tempo Tagihan</span>
                    <span className="font-bold text-white text-[11px]">25 Juni 2026</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="opacity-80 font-medium text-[11px]">Biaya Langganan</span>
                    <span className="font-bold text-white text-[11px]">
                      {profile?.role === 'pro' ? 'Rp 99.000 / bln' : profile?.role === 'plus' ? 'Rp 49.000 / bln' : 'Rp 0 (Gratis)'}
                    </span>
                  </div>
                </div>

                {profile?.role !== 'pro' && profile?.role !== 'admin' ? (
                  <button 
                    onClick={() => navigate('/upgrade')}
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-xs uppercase tracking-wider cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-slate-950" />
                    <span>Upgrade ke Sharify Pro</span>
                  </button>
                ) : (
                  <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl p-3 flex items-center space-x-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold text-amber-50 text-[11px]">Anda memiliki akses seluruh fitur Premium Sharify!</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xs border border-slate-200/80 dark:border-slate-800 p-6 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-1">Aksi Cepat</h3>
              
              <button 
                onClick={() => setIsPasswordModalOpen(true)}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition-colors group cursor-pointer"
              >
                <span className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Key className="w-4 h-4 text-slate-400 mr-2.5" /> Ganti Kata Sandi
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>

              <button 
                onClick={() => navigate('/zakat-tax-report')}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 border border-slate-100 dark:border-slate-800 transition-colors group cursor-pointer"
              >
                <span className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300">
                  <Download className="w-4 h-4 text-slate-400 mr-2.5" /> Laporan Zakat & Pengurang Pajak
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500" />
              </button>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button 
                  onClick={handleSignOut}
                  className="w-full bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-400 text-xs font-bold py-3.5 rounded-2xl transition-colors flex items-center justify-center border border-rose-100 dark:border-rose-900/40 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Keluar Akun
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* Change Password Modal */}
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fade-in">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl max-w-md w-full space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center">
                  <Lock className="w-4 h-4 mr-2 text-emerald-600" />
                  Ganti Kata Sandi
                </h3>
                <button 
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordMessage && (
                <div className={`p-3 rounded-xl text-xs font-bold flex items-center space-x-2 ${
                  passwordMessage.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                }`}>
                  {passwordMessage.type === 'success' ? <Check className="w-4 h-4 shrink-0" /> : <X className="w-4 h-4 shrink-0" />}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handleChangePasswordSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimal 6 karakter"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
                  <input
                    type="password"
                    required
                    placeholder="Ulangi kata sandi baru"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                  />
                </div>

                <div className="pt-2 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsPasswordModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-colors disabled:opacity-50"
                  >
                    {passwordLoading ? 'Memproses...' : 'Simpan Kata Sandi'}
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
