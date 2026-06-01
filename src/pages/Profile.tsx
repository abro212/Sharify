import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { 
  User, Mail, Calendar, Shield, LogOut, Bell, Key, 
  Download, CheckCircle2, CreditCard, ChevronRight, Sparkles,
  Camera, Loader2
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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const fileExt = file.name.split('.').pop() || 'png';
      const filePath = `avatars/${user.id}.${fileExt}`;

      // Try uploading to Supabase Storage first
      let finalUrl = '';
      try {
        const { error: uploadErr } = await supabase.storage
          .from('assets')
          .upload(filePath, file, { cacheControl: '0', upsert: true });

        if (uploadErr) {
          console.warn("Storage upload failed, falling back to base64 canvas compression:", uploadErr.message);
          throw uploadErr;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('assets')
          .getPublicUrl(filePath);

        // Append bustCache param to prevent caching issues
        finalUrl = `${publicUrl}?t=${Date.now()}`;
      } catch (storageErr) {
        // Fallback: Base64 canvas compression
        finalUrl = await compressAndResizeImage(file);
      }

      // Update Supabase Auth User Metadata
      const { data: { user: updatedUser }, error: authErr } = await supabase.auth.updateUser({
        data: { avatar_url: finalUrl }
      });

      if (authErr) throw authErr;

      if (updatedUser) {
        // Force-update Zustand authStore state so UI updates everywhere instantly
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

  // Format creation date
  const formatJoinedDate = (dateString?: string) => {
    if (!dateString) return 'Baru Saja';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Render role badge with appropriate styling
  const renderRoleBadge = (role?: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm border border-red-500/20">
            <Shield className="w-3.5 h-3.5 mr-1" /> System Admin
          </span>
        );
      case 'pro':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 via-amber-400 to-[#D4AF37] text-white shadow-sm border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 mr-1 animate-pulse" /> Sharify Pro
          </span>
        );
      case 'plus':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-[#059669] to-[#10B981] text-white shadow-sm border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5 mr-1" /> Sharify Plus
          </span>
        );
      case 'family':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-500 text-white shadow-sm border border-indigo-500/20">
            <User className="w-3.5 h-3.5 mr-1" /> Family Plan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
            Free Member
          </span>
        );
    }
  };

  const initialLetter = profile?.full_name 
    ? profile.full_name.charAt(0) 
    : user?.email?.charAt(0) || 'U';

  return (
    <DashboardContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Akun Saya</h1>
        <p className="text-gray-500 mt-1">Kelola detail profil, preferensi notifikasi, dan status langganan Syariah Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Elegant Account Card */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Profile Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Mesh-like Emerald and Gold gradient header banner */}
            <div className="h-32 bg-gradient-to-r from-[#0F4C3A] via-[#0D5C45] to-[#D4AF37]/80 relative">
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
            </div>
            
            {/* Avatar & Core Meta */}
            <div className="px-6 pb-6 relative">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between -mt-16 mb-6">
                <div className="relative group h-28 w-28 bg-white p-1 rounded-full shadow-lg border border-emerald-500/10 flex items-center justify-center transition-all duration-300 hover:shadow-xl hover:border-emerald-500/30">
                  {/* Profile Picture */}
                  <div className="h-full w-full rounded-full overflow-hidden flex items-center justify-center bg-gray-50 relative">
                    {isUploading ? (
                      <div className="absolute inset-0 bg-[#0F4C3A]/70 flex flex-col items-center justify-center text-white z-10">
                        <Loader2 className="w-6 h-6 animate-spin text-amber-300" />
                        <span className="text-[9px] mt-1 font-bold tracking-wider uppercase text-white">Uploading</span>
                      </div>
                    ) : null}
                    
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile Avatar" 
                        className="h-full w-full object-cover shadow-inner"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-tr from-[#0F4C3A] to-[#10B981] rounded-full flex items-center justify-center text-white text-3xl font-black uppercase shadow-inner">
                        {initialLetter}
                      </div>
                    )}
                  </div>

                  {/* Camera Upload Button Overlay */}
                  <label 
                    htmlFor="avatar-file-input" 
                    title="Ubah Foto Profil"
                    className="absolute inset-0 rounded-full bg-slate-900/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-all duration-300 z-10 backdrop-blur-[1px] hover:scale-102"
                  >
                    <Camera className="w-5 h-5 text-amber-300 mb-1 drop-shadow-sm transform group-hover:scale-105 transition-transform" />
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-100">Ubah Foto</span>
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
                <div className="mt-4 sm:mt-0 text-center sm:text-right">
                  {renderRoleBadge(profile?.role)}
                </div>
              </div>

              <div className="border-b border-gray-100 pb-6">
                <h3 className="text-2xl font-bold text-gray-900 text-center sm:text-left">
                  {profile?.full_name || 'Memuat Nama...'}
                </h3>
                <p className="text-gray-500 text-center sm:text-left flex items-center justify-center sm:justify-start mt-1">
                  <Mail className="w-4 h-4 mr-2 text-gray-400" />
                  {user?.email}
                </p>

                {/* Upload Status Indicators */}
                {uploadError && (
                  <p className="text-xs text-rose-500 font-bold mt-2 text-center sm:text-left bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-lg inline-block">
                    ⚠️ {uploadError}
                  </p>
                )}
                {uploadSuccess && (
                  <p className="text-xs text-emerald-600 font-bold mt-2 text-center sm:text-left bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg inline-block">
                    ✓ Foto profil berhasil diperbarui!
                  </p>
                )}
              </div>

              {/* Account Details Form */}
              <div className="mt-6 space-y-4">
                <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Informasi Personal</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Nama Lengkap</span>
                    <span className="block text-sm font-bold text-gray-800 mt-1">{profile?.full_name || 'Tidak ada'}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-semibold text-gray-400 uppercase">Email Terdaftar</span>
                    <span className="block text-sm font-bold text-gray-800 mt-1">{user?.email || 'Tidak ada'}</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-semibold text-gray-400 uppercase flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1 text-gray-400" /> Tanggal Bergabung
                    </span>
                    <span className="block text-sm font-bold text-gray-800 mt-1">
                      {formatJoinedDate(user?.created_at)}
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                    <span className="block text-xs font-semibold text-gray-400 uppercase flex items-center">
                      <Shield className="w-3.5 h-3.5 mr-1 text-gray-400" /> ID Pengguna
                    </span>
                    <span className="block text-xs font-mono text-gray-600 mt-1 select-all truncate">
                      {user?.id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Bell className="w-5 h-5 text-[#0F4C3A] mr-2" /> Preferensi Notifikasi & AI
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Weekly Sharia Finance Digest</h4>
                  <p className="text-xs text-gray-500">Menerima ringkasan kesehatan finansial mingguan dan tips bebas Riba.</p>
                </div>
                <button 
                  onClick={() => handleToggle('weeklyDigest')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    notificationSettings.weeklyDigest ? 'bg-emerald-600 justify-end' : 'bg-gray-200 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-50">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Zakat Due Reminders</h4>
                  <p className="text-xs text-gray-500">Notifikasi otomatis saat nisab Zakat Anda terlampaui atau jatuh tempo haul.</p>
                </div>
                <button 
                  onClick={() => handleToggle('zakatReminder')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    notificationSettings.zakatReminder ? 'bg-emerald-600 justify-end' : 'bg-gray-200 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="text-sm font-bold text-gray-800">AI Portfolio Alerts</h4>
                  <p className="text-xs text-gray-500">Rekomendasi otomatis dari Sharify AI jika terdapat instrumen investasi non-halal baru terdeteksi.</p>
                </div>
                <button 
                  onClick={() => handleToggle('aiInsights')}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                    notificationSettings.aiInsights ? 'bg-emerald-600 justify-end' : 'bg-gray-200 justify-start'
                  }`}
                >
                  <span className="w-4 h-4 bg-white rounded-full shadow-md"></span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-xs text-gray-400">Pembaruan preferensi tidak mempengaruhi data transaksi utama.</span>
              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors flex items-center shadow-sm disabled:opacity-50"
              >
                {isSaving ? 'Menyimpan...' : saveSuccess ? '✓ Tersimpan' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Subscription & Quick Actions */}
        <div className="space-y-8">
          
          {/* Subscription Tier Overview */}
          <div className="bg-gradient-to-br from-[#0F4C3A] to-[#0A3427] text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            {/* Geometric Gold Accent */}
            <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/20 rounded-full blur-2xl pointer-events-none"></div>
            
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 text-[#D4AF37] mr-2" /> Detail Keanggotaan
            </h3>

            <div className="mb-6">
              <span className="text-xs text-emerald-200 uppercase tracking-wider block">Status Langganan</span>
              <div className="flex items-baseline mt-1 space-x-2">
                <span className="text-2xl font-extrabold capitalize">{profile?.role || 'free'}</span>
                <span className="text-xs text-emerald-300">
                  {profile?.subscription_status ? '• Active' : '• Trial/Free Tier'}
                </span>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-4 mb-6 border border-white/5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80">Metode Pembayaran</span>
                <span className="font-semibold text-[#D4AF37]">Transfer Bank / E-Wallet</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80">Haul/Tagihan Berikutnya</span>
                <span className="font-semibold">25 Juni 2026</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="opacity-80">Biaya Langganan</span>
                <span className="font-semibold">
                  {profile?.role === 'pro' ? 'Rp 99.000 / bln' : profile?.role === 'plus' ? 'Rp 49.000 / bln' : 'Rp 0 (Gratis)'}
                </span>
              </div>
            </div>

            {profile?.role !== 'pro' && profile?.role !== 'admin' ? (
              <button 
                onClick={() => navigate('/upgrade')}
                className="w-full bg-gradient-to-r from-amber-500 to-[#D4AF37] hover:from-amber-600 hover:to-[#bfa032] text-[#0F4C3A] font-extrabold py-3 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 text-sm"
              >
                <Sparkles className="w-4 h-4 animate-bounce" />
                <span>Upgrade ke Sharify Pro</span>
              </button>
            ) : (
              <div className="bg-amber-400/20 border border-amber-400/30 rounded-xl p-3 flex items-center space-x-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>Anda menikmati seluruh fitur Premium Sharify!</span>
              </div>
            )}
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Aksi Cepat</h3>
            
            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group">
              <span className="flex items-center text-sm font-bold text-gray-700">
                <Key className="w-4 h-4 text-gray-400 mr-3" /> Ganti Kata Sandi
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>

            <button className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-gray-100 transition-colors group">
              <span className="flex items-center text-sm font-bold text-gray-700">
                <Download className="w-4 h-4 text-gray-400 mr-3" /> Unduh Laporan Keuangan
              </span>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>

            <div className="pt-4 border-t border-gray-100">
              <button 
                onClick={handleSignOut}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center border border-red-100"
              >
                <LogOut className="w-4 h-4 mr-2" /> Keluar dari Aplikasi
              </button>
            </div>
          </div>

        </div>

      </div>
    </DashboardContainer>
  );
};

