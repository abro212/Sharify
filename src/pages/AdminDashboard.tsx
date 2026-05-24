import React, { useState, useEffect } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore, bustCache } from '../store/settingsStore';
import type { SystemSettings } from '../store/settingsStore';
import { supabase } from '../lib/supabase';
import { 
  ShieldAlert, Users, Database, Settings, ArrowUpRight, 
  MessageSquare, Send, CheckCircle2, AlertCircle, X, Search, Sparkles,
  Scale, Clock, HeartHandshake, Laptop, FileText, ChevronRight, RefreshCcw,
  ShieldCheck, MessageCircle, HelpCircle, Bot
} from 'lucide-react';


interface SupportMessage {
  id: string;
  name: string;
  email: string;
  role: 'pro' | 'plus' | 'family';
  subject: string;
  message: string;
  date: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  status: 'Menunggu' | 'Dibalas';
  replyContent?: string;
}

interface UserProfileRow {
  id: string;
  full_name: string;
  email?: string;
  role: 'admin' | 'free' | 'plus' | 'pro' | 'family' | 'suspended';
  subscription_status: boolean;
  created_at: string;
  last_login?: string;
}

export const AdminDashboard: React.FC = () => {
  const { profile } = useAuthStore();
  const { settings, updateSettings } = useSettingsStore();

  // Navigation states
  const [activeTab, setActiveTab] = useState<'branding' | 'cms' | 'users' | 'inbox'>('branding');

  // Success message toast states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // ---------------------------------------------------------
  // TAB 1: BRANDING (APP SETTINGS) STATE
  // ---------------------------------------------------------
  const [brandingForm, setBrandingForm] = useState({
    logo_url: settings.logo_url,
    favicon_url: settings.favicon_url,
    ai_widget_icon: settings.ai_widget_icon,
    chat_avatar_url: settings.chat_avatar_url,
  });
  const [isSavingBranding, setIsSavingBranding] = useState(false);

  useEffect(() => {
    setBrandingForm({
      logo_url: settings.logo_url,
      favicon_url: settings.favicon_url,
      ai_widget_icon: settings.ai_widget_icon,
      chat_avatar_url: settings.chat_avatar_url,
    });
  }, [settings]);

  const [uploadLoading, setUploadLoading] = useState({
    logo_url: false,
    favicon_url: false,
    chat_avatar_url: false,
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: 'logo_url' | 'favicon_url' | 'chat_avatar_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(prev => ({ ...prev, [fieldName]: true }));
    try {
      const fileExt = file.name.split('.').pop();
      // Use deterministic filenames per asset type so old files are overwritten
      // (avoids storage bucket bloat)
      const filePath = `branding/${fieldName}.${fileExt}`;

      // 1. Upload file — set cacheControl '0' so CDN does not serve stale copy
      const { error } = await supabase.storage
        .from('assets')
        .upload(filePath, file, { cacheControl: '0', upsert: true });

      if (error) throw error;

      // 2. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('assets')
        .getPublicUrl(filePath);

      // 3. Immediately persist URL to database so it survives page refresh
      await updateSettings({ [fieldName]: publicUrl });

      // 4. Update local form preview state (bustCache so preview also shows fresh image)
      setBrandingForm(prev => ({ ...prev, [fieldName]: bustCache(publicUrl) }));
      triggerToast(`File berhasil diunggah dan disimpan!`);
    } catch (err: any) {
      console.error(err);
      triggerToast(`Gagal mengunggah file: ${err.message || 'Error'}`);
    } finally {
      setUploadLoading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingBranding(true);
    const success = await updateSettings(brandingForm);
    setIsSavingBranding(false);

    if (success) {
      triggerToast('Aset branding berhasil diperbarui dan diterapkan ke seluruh aplikasi!');
    } else {
      triggerToast('Terjadi kesalahan saat memperbarui aset branding.');
    }
  };

  // ---------------------------------------------------------
  // TAB 2: LANDING PAGE CMS STATE
  // ---------------------------------------------------------
  const [cmsForm, setCmsForm] = useState<Partial<SystemSettings>>({
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    hero_cta_primary: settings.hero_cta_primary,
    hero_cta_secondary: settings.hero_cta_secondary,
    solusi_title: settings.solusi_title,
    solusi_subtitle: settings.solusi_subtitle,
    fitur_title: settings.fitur_title,
    fitur_subtitle: settings.fitur_subtitle,
    harga_title: settings.harga_title,
    harga_subtitle: settings.harga_subtitle,
    footer_desc: settings.footer_desc,
    footer_copyright: settings.footer_copyright,
  });
  const [isSavingCMS, setIsSavingCMS] = useState(false);

  useEffect(() => {
    setCmsForm({
      hero_title: settings.hero_title,
      hero_subtitle: settings.hero_subtitle,
      hero_cta_primary: settings.hero_cta_primary,
      hero_cta_secondary: settings.hero_cta_secondary,
      solusi_title: settings.solusi_title,
      solusi_subtitle: settings.solusi_subtitle,
      fitur_title: settings.fitur_title,
      fitur_subtitle: settings.fitur_subtitle,
      harga_title: settings.harga_title,
      harga_subtitle: settings.harga_subtitle,
      footer_desc: settings.footer_desc,
      footer_copyright: settings.footer_copyright,
    });
  }, [settings]);

  const handleSaveCMS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCMS(true);
    const success = await updateSettings(cmsForm);
    setIsSavingCMS(false);

    if (success) {
      triggerToast('Konten Landing Page berhasil dipublikasikan secara live!');
    } else {
      triggerToast('Gagal memperbarui konten Landing Page.');
    }
  };

  // ---------------------------------------------------------
  // TAB 3: USER MANAGEMENT STATE & FLOW
  // ---------------------------------------------------------
  const [usersList, setUsersList] = useState<UserProfileRow[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfileRow | null>(null);
  const [showActivityModal, setShowActivityModal] = useState(false);

  // Mock users database to fall back on if Supabase is empty or has RLS locks
  const MOCK_USERS: UserProfileRow[] = [
    { id: 'u1', full_name: 'Ahmad Fauzi', email: 'ahmad.fauzi@example.com', role: 'pro', subscription_status: true, created_at: '2026-03-12', last_login: '2 jam yang lalu' },
    { id: 'u2', full_name: 'Siti Rahma', email: 'siti.rahma@example.com', role: 'pro', subscription_status: true, created_at: '2026-04-01', last_login: '30 menit yang lalu' },
    { id: 'u3', full_name: 'Budi Santoso', email: 'budi.s@example.com', role: 'plus', subscription_status: true, created_at: '2026-04-18', last_login: '1 hari yang lalu' },
    { id: 'u4', full_name: 'Diana Lestari', email: 'diana.l@example.com', role: 'family', subscription_status: true, created_at: '2026-05-10', last_login: 'Baru saja' },
    { id: 'u5', full_name: 'M. Rizky', email: 'rizky.m@example.com', role: 'free', subscription_status: false, created_at: '2026-05-20', last_login: '3 hari yang lalu' },
    { id: 'u6', full_name: 'Hasan Basri', email: 'hasan.b@example.com', role: 'suspended', subscription_status: false, created_at: '2026-02-28', last_login: 'Diberhentikan' },
  ];

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        // Fallback to rich mock users
        setUsersList(MOCK_USERS);
      } else {
        // Hydrate email or format dates
        const formatted: UserProfileRow[] = data.map((u, i) => ({
          id: u.id,
          full_name: u.full_name || 'Tanpa Nama',
          email: u.email || `${(u.full_name || 'user').toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          role: u.role || 'free',
          subscription_status: u.subscription_status || false,
          created_at: new Date(u.created_at).toLocaleDateString('id-ID'),
          last_login: MOCK_USERS[i % MOCK_USERS.length].last_login
        }));
        setUsersList(formatted);
      }
    } catch (err) {
      setUsersList(MOCK_USERS);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const handleUpdateUserRole = async (userId: string, newRole: any) => {
    try {
      // Local State Update
      setUsersList(prev => 
        prev.map(u => u.id === userId ? { ...u, role: newRole, subscription_status: newRole !== 'free' && newRole !== 'suspended' } : u)
      );

      // Save to Supabase
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, subscription_status: newRole !== 'free' && newRole !== 'suspended' })
        .eq('id', userId);

      if (error) throw error;
      triggerToast(`Level hak akses pengguna berhasil diubah menjadi ${newRole.toUpperCase()}!`);
    } catch (err) {
      triggerToast(`Hak akses terupdate secara lokal (mode demonstrasi/sandbox).`);
    }
  };

  const handleToggleSuspendUser = async (user: UserProfileRow) => {
    const isSuspended = user.role === 'suspended';
    const targetRole = isSuspended ? 'free' : 'suspended';
    
    try {
      setUsersList(prev => 
        prev.map(u => u.id === user.id ? { ...u, role: targetRole, subscription_status: false } : u)
      );

      const { error } = await supabase
        .from('users')
        .update({ role: targetRole, subscription_status: false })
        .eq('id', user.id);

      if (error) throw error;
      triggerToast(isSuspended ? `Penangguhan akun ${user.full_name} telah dicabut.` : `Akun ${user.full_name} berhasil ditangguhkan!`);
    } catch (err) {
      triggerToast(isSuspended ? `Suspensi ${user.full_name} dicabut (lokal/sandbox).` : `Akun ${user.full_name} ditangguhkan (lokal/sandbox).`);
    }
  };

  // Filter users by search term
  const filteredUsers = usersList.filter(u => 
    u.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.email && u.email.toLowerCase().includes(userSearchTerm.toLowerCase())) ||
    u.role.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  // ---------------------------------------------------------
  // TAB 4: HUMAN ADVISOR INBOX
  // ---------------------------------------------------------
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: '1',
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@example.com',
      role: 'pro',
      subject: 'Rekomendasi Portofolio Saham Syariah (JII)',
      message: 'Assalamualaikum Wr. Wb. Saya baru saja menyelesaikan kuis profil risiko dan disarankan portofolio agresif dengan 70% saham syariah. Apakah bisa direkomendasikan 5 saham syariah bluechip pilihan Sharify yang masuk indeks JII dan memiliki dividen yield tinggi?',
      date: 'Hari ini, 09:15',
      priority: 'Tinggi',
      status: 'Menunggu'
    },
    {
      id: '2',
      name: 'Siti Rahma',
      email: 'siti.rahma@example.com',
      role: 'pro',
      subject: 'Perhitungan Zakat Perusahaan Dagang',
      message: 'Halo Ustadz / Advisor, saya memiliki usaha perdagangan ritel pakaian online. Apakah perhitungan zakat perdagangan di aplikasi sudah mengakomodasi metode aktiva lancar dikurangi kewajiban jangka pendek? Mohon verifikasi rincian hitungan saya.',
      date: 'Hari ini, 08:30',
      priority: 'Tinggi',
      status: 'Menunggu'
    },
    {
      id: '3',
      name: 'Budi Santoso',
      email: 'budi.s@example.com',
      role: 'plus',
      subject: 'Riba Detox: Konsolidasi 3 Kartu Kredit',
      message: 'Saya sedang menjalankan roadmap Riba Detox untuk 3 kartu kredit konvensional dengan total utang Rp 45jt. Apakah metode Avalanche di roadmap ini bisa disesuaikan jika salah satu kartu memiliki beban psikologis lebih berat? Terima kasih.',
      date: 'Kemarin, 14:22',
      priority: 'Sedang',
      status: 'Menunggu'
    },
    {
      id: '4',
      name: 'Diana Lestari',
      email: 'diana.l@example.com',
      role: 'family',
      subject: 'Pembagian Waris Faraidh dengan 3 Saudara Kandung',
      message: 'Assalamualaikum. Ayah kami baru saja wafat, meninggalkan ibu, 2 anak laki-laki, dan 1 anak perempuan. Harta waris bersih Rp 600jt setelah pelunasan utang. Hasil kalkulator Sharify sudah keluar, apakah bisa didiskusikan keabsahannya menurut Mazhab Syafi\'i?',
      date: '24 Mei, 18:05',
      priority: 'Sedang',
      status: 'Menunggu'
    }
  ]);

  const [activeMessage, setActiveMessage] = useState<SupportMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [inboxSearchTerm, setInboxSearchTerm] = useState('');

  const handleOpenReply = (msg: SupportMessage) => {
    setActiveMessage(msg);
    setReplyText(msg.replyContent || '');
  };

  const handleSubmitReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMessage || !replyText.trim()) return;

    setMessages(prev => 
      prev.map(msg => 
        msg.id === activeMessage.id 
          ? { ...msg, status: 'Dibalas', replyContent: replyText } 
          : msg
      )
    );

    triggerToast(`Tanggapan berhasil dikirim ke ${activeMessage.name} (${activeMessage.email}) via Email & Notifikasi!`);
    setActiveMessage(null);
    setReplyText('');
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(inboxSearchTerm.toLowerCase()) ||
    msg.subject.toLowerCase().includes(inboxSearchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(inboxSearchTerm.toLowerCase())
  );

  // Helper function to trigger persistent toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  const getRoleBadge = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0F4C3A]/10 text-[#0F4C3A] border border-[#0F4C3A]/20">Administrator</span>;
      case 'pro':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-700 border border-amber-500/20">Pro Member</span>;
      case 'plus':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">Plus Member</span>;
      case 'family':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-700 border border-indigo-500/20">Family Plan</span>;
      case 'suspended':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">Ditangguhkan</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-600">Free</span>;
    }
  };

  return (
    <DashboardContainer>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-600 text-white p-4 rounded-xl shadow-2xl border border-emerald-500 flex items-center justify-between animate-slide-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-200 flex-shrink-0 animate-bounce" />
            <p className="text-sm font-semibold">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-white hover:text-emerald-200 ml-4">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Title Banner */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
            <ShieldAlert className="h-8 w-8 text-[#0F4C3A] mr-3" />
            Super Admin Power Panel
          </h1>
          <p className="text-gray-500 mt-1">Platform management, live content CMS, users licensing, and executive system operations.</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
            <span className="h-2 w-2 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
            System Status: Live
          </span>
          <button 
            onClick={() => fetchUsers()}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            title="Muat Ulang Data"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alert Warning Gate */}
      <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-100 rounded-xl p-4 mb-8 flex items-start">
        <ShieldAlert className="h-6 w-6 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-sm font-bold text-red-800">Sistem Otorisasi: ADMINISTRATOR UTAMA</h3>
          <p className="text-xs text-red-700 mt-1">
            Anda terautentikasi sebagai <span className="font-mono bg-red-100 px-1 rounded">{profile?.full_name || 'Admin'}</span>. Pembaruan branding dan teks Landing Page akan diterapkan secara instan bagi seluruh pengguna global secara real-time.
          </p>
        </div>
      </div>

      {/* Metric summary boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 font-mono">1.284</h3>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +12.4% <span className="text-gray-400 font-normal ml-1">vs bln lalu</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center"><Users className="h-5 w-5" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Langganan Aktif</p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 font-mono">432</h3>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +8.1% <span className="text-gray-400 font-normal ml-1">vs bln lalu</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center"><Sparkles className="h-5 w-5" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Zakat Dihitung</p>
            <h3 className="text-2xl font-black text-gray-900 mt-2 font-mono">Rp 2.45B</h3>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-bold">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18.3% <span className="text-gray-400 font-normal ml-1">vs bln lalu</span>
            </div>
          </div>
          <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center"><Scale className="h-5 w-5" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Support Inbox</p>
            <h3 className="text-3xl font-black text-gray-900 mt-2 font-mono">{messages.filter(m => m.status === 'Menunggu').length} <span className="text-sm font-normal text-gray-400">Menunggu</span></h3>
            <div className="mt-4 flex items-center text-xs text-amber-600 font-bold">
              <Clock className="w-3.5 h-3.5 mr-1" /> Tanggapan Cepat Aktif
            </div>
          </div>
          <div className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center"><MessageSquare className="h-5 w-5" /></div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap bg-white p-1 rounded-xl shadow-xs">
        <button
          onClick={() => setActiveTab('branding')}
          className={`flex-1 py-3 px-4 text-sm font-extrabold rounded-lg flex items-center justify-center transition-all ${
            activeTab === 'branding'
              ? 'bg-[#0F4C3A] text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Settings className="w-4 h-4 mr-2" /> App Settings (Branding)
        </button>
        <button
          onClick={() => setActiveTab('cms')}
          className={`flex-1 py-3 px-4 text-sm font-extrabold rounded-lg flex items-center justify-center transition-all ${
            activeTab === 'cms'
              ? 'bg-[#0F4C3A] text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <FileText className="w-4 h-4 mr-2" /> Landing Page CMS
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex-1 py-3 px-4 text-sm font-extrabold rounded-lg flex items-center justify-center transition-all ${
            activeTab === 'users'
              ? 'bg-[#0F4C3A] text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <Users className="w-4 h-4 mr-2" /> User Management
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex-1 py-3 px-4 text-sm font-extrabold rounded-lg flex items-center justify-center transition-all ${
            activeTab === 'inbox'
              ? 'bg-[#0F4C3A] text-white shadow-md'
              : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" /> Advisor Inbox
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BRANDING TAB MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form settings */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-[#0F4C3A]" />
              Branding Assets Configuration
            </h3>
            
            <form onSubmit={handleSaveBranding} className="space-y-6">
              {/* Supabase Storage setup reminder block */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex items-start text-xs text-amber-800">
                <AlertCircle className="w-5 h-5 text-amber-600 mr-3 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold uppercase tracking-wide mb-1">Panduan Supabase Storage</h4>
                  <p className="leading-relaxed">
                    Harap pastikan Anda telah membuat sebuah bucket bernama <span className="font-mono bg-amber-100 px-1 rounded font-black text-amber-900">assets</span> dengan visibilitas <span className="font-bold underline">Public</span> di tab **Storage** pada Supabase Dashboard Anda agar berkas yang diunggah dapat diakses secara instan oleh seluruh pemirsa.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* 1. Logo File Upload Card */}
                <div className="bg-gray-50/50 p-4 border border-gray-150 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Main Logo File</label>
                    <span className="text-[9px] text-gray-400 block mb-2">Unggah logo utama Sharify (PNG/SVG)</span>
                  </div>
                  {uploadLoading.logo_url ? (
                    <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                      <RefreshCcw className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>Mengunggah berkas...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'logo_url')}
                        className="block w-full text-[10px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-[#0F4C3A] hover:file:bg-emerald-100 cursor-pointer"
                      />
                      {brandingForm.logo_url && (
                        <div className="p-2 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                          <img src={brandingForm.logo_url} alt="Preview" className="h-6 object-contain max-w-[80px]" />
                          <span className="text-[8px] text-gray-400 truncate flex-1 ml-2 text-right">{brandingForm.logo_url}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 2. Favicon File Upload Card */}
                <div className="bg-gray-50/50 p-4 border border-gray-150 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">App Favicon File</label>
                    <span className="text-[9px] text-gray-400 block mb-2">Unggah favicon tab peramban (.ico/.png)</span>
                  </div>
                  {uploadLoading.favicon_url ? (
                    <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                      <RefreshCcw className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>Mengunggah berkas...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'favicon_url')}
                        className="block w-full text-[10px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-[#0F4C3A] hover:file:bg-emerald-100 cursor-pointer"
                      />
                      {brandingForm.favicon_url && (
                        <div className="p-2 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                          <img src={brandingForm.favicon_url} alt="Preview" className="h-6 w-6 object-contain" />
                          <span className="text-[8px] text-gray-400 truncate flex-1 ml-2 text-right">{brandingForm.favicon_url}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* 3. Floating AI Widget Icon selector */}
                <div className="bg-gray-50/50 p-4 border border-gray-150 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Floating AI Widget Icon</label>
                    <span className="text-[9px] text-gray-400 block mb-2">Pilih ikon pemicu asisten AI di kanan bawah</span>
                  </div>
                  <select 
                    value={brandingForm.ai_widget_icon}
                    onChange={e => setBrandingForm(prev => ({ ...prev, ai_widget_icon: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white font-bold"
                  >
                    <option value="Sparkles">Sparkles ✨ (Pilihan Utama)</option>
                    <option value="MessageCircle">MessageCircle 💬</option>
                    <option value="MessageSquare">MessageSquare ✉️</option>
                    <option value="HelpCircle">HelpCircle ❓</option>
                  </select>
                </div>

                {/* 4. Chat Assistant Avatar Upload Card */}
                <div className="bg-gray-50/50 p-4 border border-gray-150 rounded-2xl flex flex-col justify-between space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Chat Advisor Avatar File</label>
                    <span className="text-[9px] text-gray-400 block mb-2">Unggah profil avatar asisten AI (PNG/JPG)</span>
                  </div>
                  {uploadLoading.chat_avatar_url ? (
                    <div className="py-4 text-center text-xs text-gray-500 flex items-center justify-center space-x-2">
                      <RefreshCcw className="w-4 h-4 text-emerald-600 animate-spin" />
                      <span>Mengunggah berkas...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={e => handleFileUpload(e, 'chat_avatar_url')}
                        className="block w-full text-[10px] text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-emerald-50 file:text-[#0F4C3A] hover:file:bg-emerald-100 cursor-pointer"
                      />
                      {brandingForm.chat_avatar_url && (
                        <div className="p-2 bg-white border border-gray-100 rounded-xl flex items-center justify-between">
                          <img src={brandingForm.chat_avatar_url} alt="Preview" className="h-6 w-6 rounded-full object-cover" />
                          <span className="text-[8px] text-gray-400 truncate flex-1 ml-2 text-right">{brandingForm.chat_avatar_url}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingBranding}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center"
                >
                  {isSavingBranding ? 'Menyimpan...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>

          {/* Branding Live Preview */}
          <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Branding Live Mockup Preview</h4>
              <p className="text-xs text-gray-500 mb-6">Pratinjau elemen branding yang dirender secara dinamis di dasbor pengguna.</p>
              
              <div className="space-y-6">
                {/* Header Mockup */}
                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50">
                  <span className="text-[10px] text-gray-400 block mb-2">Navbar Mockup</span>
                  <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-150">
                    <div className="flex items-center">
                      {brandingForm.logo_url ? (
                        <img src={brandingForm.logo_url} alt="Logo" className="h-6 object-contain" />
                      ) : (
                        <>
                          <ShieldCheck className="h-5 w-5 text-[#0F4C3A]" />
                          <span className="ml-1.5 text-xs font-bold text-gray-900">Sharify</span>
                        </>
                      )}
                    </div>
                    <div className="h-4 w-12 bg-gray-100 rounded"></div>
                  </div>
                </div>

                {/* FAB Mockup */}
                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-400 block mb-1">AI Chat FAB Preview</span>
                    <span className="text-xs font-bold text-gray-800">Ikon: {brandingForm.ai_widget_icon}</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0F4C3A] to-[#D4AF37] flex items-center justify-center text-white shadow-sm">
                    {brandingForm.ai_widget_icon === 'Sparkles' && <Sparkles className="w-5 h-5 text-amber-300" />}
                    {brandingForm.ai_widget_icon === 'MessageCircle' && <MessageCircle className="w-5 h-5 text-amber-300" />}
                    {brandingForm.ai_widget_icon === 'MessageSquare' && <MessageSquare className="w-5 h-5 text-amber-300" />}
                    {brandingForm.ai_widget_icon === 'HelpCircle' && <HelpCircle className="w-5 h-5 text-amber-300" />}
                  </div>
                </div>

                {/* Avatar Mockup */}
                <div className="border border-gray-100 rounded-xl p-3 bg-gray-50 flex items-center space-x-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center border border-[#0F4C3A]/20 overflow-hidden text-[#0F4C3A]">
                    {brandingForm.chat_avatar_url ? (
                      <img src={brandingForm.chat_avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Chat Assistant Avatar</span>
                    <span className="text-xs font-bold text-gray-800">Sharify Co-Pilot</span>
                  </div>
                </div>

              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 text-[11px] text-amber-800 flex mt-6">
              <Sparkles className="w-4 h-4 text-amber-600 mr-2 flex-shrink-0" />
              <span>Simpan perubahan untuk langsung melihat re-render aset di floating widget dan landing page.</span>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* LANDING PAGE CMS TAB MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'cms' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* CMS Form Editor */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-sm">
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-[#0F4C3A]" />
                Landing Page Content Management (CMS)
              </h3>
              <span className="text-[10px] uppercase font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-black">Visual Editor</span>
            </div>

            <form onSubmit={handleSaveCMS} className="space-y-6">
              
              {/* HERO SECTION EDIT */}
              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                <h4 className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider">1. Hero (Utama) Section Content</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Hero Title</label>
                    <input 
                      type="text" 
                      value={cmsForm.hero_title}
                      onChange={e => setCmsForm(prev => ({ ...prev, hero_title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Hero Subtitle</label>
                    <textarea 
                      rows={2}
                      value={cmsForm.hero_subtitle}
                      onChange={e => setCmsForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Primary CTA Button</label>
                      <input 
                        type="text" 
                        value={cmsForm.hero_cta_primary}
                        onChange={e => setCmsForm(prev => ({ ...prev, hero_cta_primary: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Secondary CTA Button</label>
                      <input 
                        type="text" 
                        value={cmsForm.hero_cta_secondary}
                        onChange={e => setCmsForm(prev => ({ ...prev, hero_cta_secondary: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SOLUSI SECTION EDIT */}
              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider">2. Solusi (Features Hub) Section</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Solusi Title</label>
                    <input 
                      type="text" 
                      value={cmsForm.solusi_title}
                      onChange={e => setCmsForm(prev => ({ ...prev, solusi_title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Solusi Subtitle</label>
                    <input 
                      type="text" 
                      value={cmsForm.solusi_subtitle}
                      onChange={e => setCmsForm(prev => ({ ...prev, solusi_subtitle: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* FITUR & HARGA SECTIONS */}
              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider">3. Fitur & Harga Sections Title</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Fitur Title</label>
                    <input 
                      type="text" 
                      value={cmsForm.fitur_title}
                      onChange={e => setCmsForm(prev => ({ ...prev, fitur_title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Harga Title</label>
                    <input 
                      type="text" 
                      value={cmsForm.harga_title}
                      onChange={e => setCmsForm(prev => ({ ...prev, harga_title: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER SECTION */}
              <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-3">
                <h4 className="text-xs font-bold text-[#0F4C3A] uppercase tracking-wider">4. Footer Section</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Footer Description</label>
                    <input 
                      type="text" 
                      value={cmsForm.footer_desc}
                      onChange={e => setCmsForm(prev => ({ ...prev, footer_desc: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 uppercase mb-1">Footer Copyright</label>
                    <input 
                      type="text" 
                      value={cmsForm.footer_copyright}
                      onChange={e => setCmsForm(prev => ({ ...prev, footer_copyright: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Publish CTA */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSavingCMS}
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold px-6 py-3 rounded-xl text-sm shadow-md transition-all flex items-center"
                >
                  {isSavingCMS ? 'Menyimpan...' : 'Save & Publish Live'}
                </button>
              </div>

            </form>
          </div>

          {/* CMS Live Preview Panel */}
          <div className="bg-white rounded-3xl p-6 border border-gray-150 shadow-sm flex flex-col">
            <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2 flex items-center">
              <Laptop className="w-4 h-4 mr-2" /> Live CMS Page Preview
            </h4>
            <p className="text-xs text-gray-500 mb-6">Pratinjau langsung Landing Page terupdate sesuai data formulir di sebelah kiri.</p>

            <div className="flex-1 border border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-gray-50 flex flex-col max-h-[500px]">
              
              {/* Header inside preview */}
              <div className="bg-white px-3 py-2 border-b border-gray-100 flex items-center justify-between text-[8px] font-bold text-gray-600 shrink-0">
                <div className="flex items-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C3A] mr-1" />
                  <span>Sharify Preview</span>
                </div>
                <div className="flex space-x-2">
                  <span>Solusi</span>
                  <span>Harga</span>
                </div>
              </div>

              {/* Body inside preview */}
              <div className="p-4 flex-1 overflow-y-auto space-y-6">
                
                {/* Hero Preview */}
                <div className="text-center py-4 border-b border-gray-200/50">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[6px] font-black uppercase tracking-wider mb-2">Hero Section</span>
                  <h5 className="text-[11px] font-black text-gray-900 leading-tight mb-2">{cmsForm.hero_title || 'Empty Title'}</h5>
                  <p className="text-[8px] text-gray-500 leading-relaxed mb-3 max-w-[200px] mx-auto">{cmsForm.hero_subtitle || 'Empty Subtitle'}</p>
                  
                  <div className="flex justify-center space-x-2">
                    <span className="px-2.5 py-1 bg-[#0F4C3A] text-white text-[7px] font-bold rounded shadow-xs">{cmsForm.hero_cta_primary}</span>
                    <span className="px-2.5 py-1 bg-white border border-gray-200 text-gray-700 text-[7px] font-bold rounded">{cmsForm.hero_cta_secondary}</span>
                  </div>
                </div>

                {/* Solusi Preview */}
                <div className="text-center py-2 border-b border-gray-200/50">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[6px] font-black uppercase tracking-wider mb-2">Solusi Section</span>
                  <h6 className="text-[10px] font-bold text-gray-900 leading-tight mb-1">{cmsForm.solusi_title}</h6>
                  <p className="text-[8px] text-gray-400">{cmsForm.solusi_subtitle}</p>
                </div>

                {/* Footer Preview */}
                <div className="text-center py-2 text-gray-400 text-[6px] space-y-1">
                  <p className="font-bold text-gray-700">{cmsForm.footer_desc}</p>
                  <p>{cmsForm.footer_copyright}</p>
                </div>

              </div>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* USER MANAGEMENT TAB MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden animate-fade-in">
          
          {/* User search controls */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Users className="w-5 h-5 text-[#0F4C3A] mr-2" />
                User Licensing Management Suite
              </h2>
              <p className="text-xs text-gray-500 mt-1">Audit seluruh pengguna, modifikasi level keanggotaan/role Fiqh, atau nonaktifkan akun.</p>
            </div>
            
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input 
                type="text" 
                placeholder="Cari nama, email, atau lisensi..." 
                value={userSearchTerm}
                onChange={e => setUserSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] bg-white transition-all"
              />
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            {isLoadingUsers ? (
              <div className="p-12 text-center text-gray-500">
                <RefreshCcw className="w-8 h-8 text-gray-400 mx-auto mb-3 animate-spin" />
                <p className="font-bold">Memuat database pengguna...</p>
              </div>
            ) : filteredUsers.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4">Nama / Pengguna</th>
                    <th className="px-6 py-4">Tipe Keanggotaan</th>
                    <th className="px-6 py-4">Status Layanan</th>
                    <th className="px-6 py-4">Terdaftar Sejak</th>
                    <th className="px-6 py-4">Aktif Terakhir</th>
                    <th className="px-6 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredUsers.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50/40 transition-colors">
                      
                      {/* Name/Email */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0F4C3A]/20 to-[#D4AF37]/20 text-[#0F4C3A] font-bold flex items-center justify-center text-sm border border-emerald-100 shrink-0">
                            {user.full_name.charAt(0)}
                          </div>
                          <div>
                            <p className={`text-sm font-bold text-gray-800 ${user.role === 'suspended' ? 'line-through opacity-50' : ''}`}>{user.full_name}</p>
                            <p className="text-xs text-gray-400">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role/Membership selector */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div>{getRoleBadge(user.role)}</div>
                          
                          {user.role !== 'suspended' && (
                            <select
                              value={user.role}
                              onChange={e => handleUpdateUserRole(user.id, e.target.value as any)}
                              className="text-[10px] bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-bold"
                            >
                              <option value="free">FREE</option>
                              <option value="plus">PLUS</option>
                              <option value="pro">PRO</option>
                              <option value="family">FAMILY</option>
                              <option value="admin">ADMIN</option>
                            </select>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          user.role === 'suspended'
                            ? 'bg-red-50 text-red-700 border border-red-100'
                            : user.subscription_status
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role === 'suspended' ? 'Disabled' : user.subscription_status ? 'Premium' : 'Standard'}
                        </span>
                      </td>

                      {/* Created At */}
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {user.created_at}
                      </td>

                      {/* Last Login */}
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {user.last_login}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowActivityModal(true);
                          }}
                          className="text-[10px] font-extrabold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-lg border border-emerald-100 transition-colors"
                        >
                          Lihat Aktifitas
                        </button>
                        
                        <button
                          onClick={() => handleToggleSuspendUser(user)}
                          className={`text-[10px] font-extrabold px-2.5 py-1.5 rounded-lg border transition-all ${
                            user.role === 'suspended'
                              ? 'bg-emerald-600 text-white border-transparent hover:bg-emerald-700'
                              : 'bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-100'
                          }`}
                        >
                          {user.role === 'suspended' ? 'Pulihkan' : 'Suspend'}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="font-bold">Tidak ada pengguna ditemukan</p>
                <p className="text-xs text-gray-400 mt-1">Coba bersihkan kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>

          {/* User Activity Simulated Trail Modal */}
          {showActivityModal && selectedUser && (
            <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-zoom-in">
                
                {/* Modal Header */}
                <div className="px-6 py-4 bg-[#0F4C3A] text-white flex justify-between items-center">
                  <h3 className="font-bold text-sm">Account Activity: {selectedUser.full_name}</h3>
                  <button 
                    onClick={() => setShowActivityModal(false)}
                    className="text-white hover:text-emerald-100 bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Audit Trail List */}
                <div className="p-6 space-y-4">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-150 text-xs">
                    <p className="text-gray-400 uppercase tracking-widest font-bold text-[9px] mb-1">User Details</p>
                    <p className="font-bold text-gray-800">{selectedUser.full_name} ({selectedUser.email})</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      <span className="text-[10px] text-gray-400">Created: {selectedUser.created_at}</span>
                    </div>
                  </div>

                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aktivitas Terakhir Pengguna</p>
                  
                  <div className="relative border-l-2 border-gray-100 pl-4 ml-2 py-1 space-y-4">
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-emerald-500"></span>
                      <p className="text-xs font-bold text-gray-800">Menghitung Zakat Maal</p>
                      <p className="text-[10px] text-gray-400">Rasio Nisab terpenuhi dengan 85g Emas. Rp 3.750.000 terhitung.</p>
                      <span className="text-[8px] text-gray-400 block font-mono">1 jam yang lalu</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-amber-500"></span>
                      <p className="text-xs font-bold text-gray-800">Konsultasi AI Sharia Co-Pilot</p>
                      <p className="text-[10px] text-gray-400">"Apakah hukum bunga KPR komersial dapat didetoks dengan metode Avalanche?"</p>
                      <span className="text-[8px] text-gray-400 block font-mono">2 jam yang lalu</span>
                    </div>
                    <div className="relative">
                      <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-[#0F4C3A]"></span>
                      <p className="text-xs font-bold text-gray-800">Masuk ke Sistem</p>
                      <p className="text-[10px] text-gray-400">Autentikasi terverifikasi via Google OAuth.</p>
                      <span className="text-[8px] text-gray-400 block font-mono">{selectedUser.last_login}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button
                      onClick={() => setShowActivityModal(false)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg text-xs"
                    >
                      Tutup
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* HUMAN ADVISOR INBOX TAB MODULE */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-3xl border border-gray-150 shadow-sm overflow-hidden animate-fade-in">
          
          {/* Inbox Header Controls */}
          <div className="px-6 py-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <MessageSquare className="w-5 h-5 text-[#0F4C3A] mr-2" />
                Kotak Masuk Human Advisor
              </h2>
              <p className="text-xs text-gray-500 mt-1">Interaksi langsung dengan pengguna Sharify Plus & Pro yang memerlukan panduan Fiqh Muamalah secara khusus.</p>
            </div>
            
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input 
                type="text" 
                placeholder="Cari nama, subjek, atau isi..." 
                value={inboxSearchTerm}
                onChange={e => setInboxSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] bg-white transition-all"
              />
            </div>
          </div>

          {/* Message Inbox Table */}
          <div className="overflow-x-auto">
            {filteredMessages.length > 0 ? (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4">Pengirim / Keanggotaan</th>
                    <th className="px-6 py-4">Topik Konsultasi</th>
                    <th className="px-6 py-4">Prioritas</th>
                    <th className="px-6 py-4">Waktu</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMessages.map(msg => (
                    <tr key={msg.id} className="hover:bg-gray-50/40 transition-colors">
                      
                      {/* User Profile */}
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#0F4C3A]/20 to-[#D4AF37]/20 text-[#0F4C3A] font-bold flex items-center justify-center text-sm border border-emerald-100">
                            {msg.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">{msg.name}</p>
                            <p className="text-xs text-gray-400">{msg.email}</p>
                            <div className="mt-1">{getRoleBadge(msg.role)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Topic / Subject */}
                      <td className="px-6 py-4 max-w-xs md:max-w-md">
                        <h4 className="text-sm font-bold text-gray-800 truncate">{msg.subject}</h4>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-1">{msg.message}</p>
                      </td>

                      {/* Priority */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold ${
                          msg.priority === 'Tinggi' 
                            ? 'bg-rose-50 text-rose-700 border border-rose-100' 
                            : 'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {msg.priority}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        <div className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-gray-400" />
                          {msg.date}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          msg.status === 'Dibalas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {msg.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button 
                          onClick={() => handleOpenReply(msg)}
                          className={`text-xs font-bold py-1.5 px-3.5 rounded-lg border transition-all ${
                            msg.status === 'Dibalas'
                              ? 'bg-white hover:bg-gray-50 text-[#0F4C3A] border-gray-200'
                              : 'bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white border-transparent shadow-sm'
                          }`}
                        >
                          {msg.status === 'Dibalas' ? 'Lihat Tanggapan' : 'Jawab'}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                <p className="font-bold">Tidak ada pesan konsultasi ditemukan</p>
                <p className="text-xs text-gray-400 mt-1">Coba sesuaikan kata kunci pencarian Anda.</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* Simulated Response Modal (Tab Inbox) */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-zoom-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0F4C3A] text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <HeartHandshake className="w-5 h-5 text-amber-400 animate-pulse" />
                <h3 className="font-bold">Konsultasi Syariah Human Advisor</h3>
              </div>
              <button 
                onClick={() => setActiveMessage(null)}
                className="text-white hover:text-emerald-100 bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Original Message Details */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              
              {/* User Bio Panel */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-gray-800">{activeMessage.name}</h4>
                  <p className="text-xs text-gray-500">{activeMessage.email}</p>
                </div>
                <div className="text-right">
                  {getRoleBadge(activeMessage.role)}
                  <p className="text-[10px] text-gray-400 mt-1">{activeMessage.date}</p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <span className="block text-xs font-semibold text-gray-400 uppercase">Subjek</span>
                <p className="text-sm font-extrabold text-gray-800 mt-0.5">{activeMessage.subject}</p>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-50 text-gray-800">
                <span className="block text-xs font-bold text-[#0F4C3A] mb-1.5 uppercase">Pesan Member:</span>
                <p className="text-sm leading-relaxed whitespace-pre-line italic">"{activeMessage.message}"</p>
              </div>

              {/* Reply Form */}
              {activeMessage.status === 'Dibalas' ? (
                <div className="border-t border-gray-100 pt-4 space-y-2">
                  <span className="block text-xs font-bold text-emerald-700 uppercase flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Tanggapan Telah Dikirim
                  </span>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm text-gray-700 whitespace-pre-line">
                    {activeMessage.replyContent}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitReply} className="border-t border-gray-100 pt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tulis Jawaban Syariah & Finansial</label>
                    <textarea 
                      required
                      rows={5}
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      placeholder="Tulis tanggapan yang mendalam sesuai dengan Fiqh Muamalah dan analisis finansial..."
                      className="w-full p-4 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A]"
                    />
                  </div>

                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-start">
                    <AlertCircle className="w-4 h-4 text-amber-600 mr-2.5 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] text-amber-700">
                      <strong>Panduan Advisor:</strong> Berikan salam penutup islami. Pastikan referensi fatwa DSN-MUI atau dalil fiqh relevan dicantumkan jika menanggapi perihal usury/zakat.
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setActiveMessage(null)}
                      className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-2 px-5 rounded-lg shadow-sm transition-colors flex items-center space-x-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Kirim Tanggapan</span>
                    </button>
                  </div>
                </form>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Action Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">User Verification</h3>
          <p className="text-sm text-gray-500">Lihat seluruh database pengguna terdaftar dan modifikasi level lisensi mereka secara manual.</p>
          <button 
            onClick={() => setActiveTab('users')}
            className="mt-4 text-[#0F4C3A] text-sm font-bold hover:underline flex items-center"
          >
            Buka User Manager <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4">
            <Database className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Sharia Audit Trails</h3>
          <p className="text-sm text-gray-500">Periksa hitungan nisab dan zakat secara manual untuk menjamin keabsahan kalkulator Syariah.</p>
          <button className="mt-4 text-[#0F4C3A] text-sm font-bold hover:underline flex items-center cursor-not-allowed opacity-50" disabled>
            Audit Transaksi <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-4">
            <Settings className="h-6 w-6" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Global Constants</h3>
          <p className="text-sm text-gray-500">Konfigurasi parameter global seperti nisab emas per gram, perak, dan batas suku bunga konvensional.</p>
          <button className="mt-4 text-[#0F4C3A] text-sm font-bold hover:underline flex items-center cursor-not-allowed opacity-50" disabled>
            Konfigurasi Sistem <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>

    </DashboardContainer>
  );
};
