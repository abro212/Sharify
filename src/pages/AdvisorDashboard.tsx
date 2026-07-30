import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { 
  UserCheck, MessageSquare, Calendar, BookOpen, Star, 
  Clock, CheckCircle2, ShieldCheck, X, Search, 
  Send, Filter, ChevronRight, Video, User
} from 'lucide-react';
import { DSN_MUI_FATWA_DATABASE } from '../lib/dsnMuiFatwas';

export interface AdvisorTicket {
  id: string;
  user_name: string;
  user_email: string;
  user_role: 'pro' | 'plus' | 'family';
  category: 'KPR & Properti' | 'Zakat & Faraidh' | 'Riba Detox' | 'Investasi Saham' | 'Asuransi Syariah';
  subject: string;
  message: string;
  created_at: string;
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  status: 'Menunggu' | 'Dibalas';
  reply_content?: string;
  reply_at?: string;
  user_financial_snapshot?: {
    monthly_income: number;
    monthly_expenses: number;
    zakat_due: number;
    debt_amount: number;
  };
}

export interface LiveSession {
  id: string;
  user_name: string;
  user_role: string;
  topic: string;
  date_time: string;
  status: 'Mendatang' | 'Berlangsung' | 'Selesai';
  meeting_url: string;
}

export const AdvisorDashboard: React.FC = () => {
  const { profile } = useAuthStore();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'tickets' | 'sessions' | 'fatwas' | 'profile'>('tickets');

  // Notification Toast
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Tickets state
  const [tickets, setTickets] = useState<AdvisorTicket[]>([
    {
      id: 't-101',
      user_name: 'Ahmad Fauzi',
      user_email: 'ahmad.fauzi@example.com',
      user_role: 'pro',
      category: 'KPR & Properti',
      subject: 'Review Akad KPR Murabahah vs Musyarakah Mutanaqisah (MMQ)',
      message: 'Assalamu alaikum Ustadz Advisor, saya sedang mengajukan KPR Syariah senilai Rp 650 juta. Di draf akad pasal 8 tertulis klausul denda keterlambatan 0.1% per hari yang diklaim sebagai dana sosial (ta\'zir). Apakah pasal ini sudah 100% sesuai dengan Fatwa DSN-MUI No. 17?',
      created_at: 'Hari ini, 09:15',
      priority: 'Tinggi',
      status: 'Menunggu',
      user_financial_snapshot: {
        monthly_income: 18500000,
        monthly_expenses: 9200000,
        zakat_due: 462500,
        debt_amount: 0
      }
    },
    {
      id: 't-102',
      user_name: 'Siti Rahma',
      user_email: 'siti.rahma@example.com',
      user_role: 'pro',
      category: 'Zakat & Faraidh',
      subject: 'Penghitungan Zakat Perdagangan Usaha Ritel Online',
      message: 'Halo Ustadz, usaha ritel busana muslim saya memiliki modal kerja Rp 200jt, stok barang Rp 150jt, piutang lancar Rp 30jt, dan utang dagang jatuh tempo Rp 40jt. Mohon bimbingan cara akad pengeluaran zakat perusahaannya sesuai standar MUI.',
      created_at: 'Hari ini, 08:30',
      priority: 'Tinggi',
      status: 'Menunggu',
      user_financial_snapshot: {
        monthly_income: 35000000,
        monthly_expenses: 15000000,
        zakat_due: 850000,
        debt_amount: 0
      }
    },
    {
      id: 't-103',
      user_name: 'Budi Santoso',
      user_email: 'budi.s@example.com',
      user_role: 'plus',
      category: 'Riba Detox',
      subject: 'Strategi Pelunasan Utang Pinjol & Kartu Kredit Konvensional',
      message: 'Saya punya utang kartu kredit Rp 25jt dan pinjol terdaftar Rp 15jt. Saya sangat ingin hijrah bebas riba. Apakah metode Avalanche di roadmap Riba Detox Sharify sudah aman dari riba nasi\'ah jika saya mendahulukan yang bunganya paling mencekik?',
      created_at: 'Kemarin, 14:22',
      priority: 'Sedang',
      status: 'Menunggu',
      user_financial_snapshot: {
        monthly_income: 12000000,
        monthly_expenses: 9500000,
        zakat_due: 0,
        debt_amount: 40000000
      }
    },
    {
      id: 't-104',
      user_name: 'Dewi Lestari',
      user_email: 'dewi.l@example.com',
      user_role: 'pro',
      category: 'Investasi Saham',
      subject: 'Penapisan Rasio Utang Berbasis Riba pada Saham Telekomunikasi',
      message: 'Ustadz, apakah saham TLKM masih masuk Daftar Efek Syariah (DES) OJK & DSN-MUI kuartal ini? Mohon konfirmasi batas maksimal rasio utang berbasis bunga 45%.',
      created_at: '2 hari lalu',
      priority: 'Rendah',
      status: 'Dibalas',
      reply_content: 'Wa alaikumsalam Wr Wb. Berdasarkan Fatwa DSN-MUI No. 80/DSN-MUI/III/2011 dan rilis DES OJK terbaru, saham TLKM memenuhi kriteria penapisan syariah dengan rasio utang berbasis riba jauh di bawah ambang batas 45% (sekitar 28%). Saham ini HALAL dikoleksi.',
      reply_at: '2 hari lalu, 16:45',
      user_financial_snapshot: {
        monthly_income: 22000000,
        monthly_expenses: 11000000,
        zakat_due: 550000,
        debt_amount: 0
      }
    }
  ]);

  const [ticketFilter, setTicketFilter] = useState<'semua' | 'menunggu' | 'dibalas'>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<AdvisorTicket | null>(null);
  const [replyText, setReplyText] = useState('');

  // Live Sessions state
  const [liveSessions] = useState<LiveSession[]>([
    {
      id: 's-1',
      user_name: 'Ahmad Fauzi',
      user_role: 'Pro Member',
      topic: 'Konsultasi Bedah Akad KPR MMQ 1-on-1',
      date_time: 'Hari ini, 15:30 WIB (45 Menit)',
      status: 'Mendatang',
      meeting_url: 'https://meet.google.com/abc-defg-hij'
    },
    {
      id: 's-2',
      user_name: 'Siti Rahma',
      user_role: 'Pro Member',
      topic: 'Perencanaan Zakat Holding Usaha & Restrukturisasi Aset',
      date_time: 'Besok, 10:00 WIB (60 Menit)',
      status: 'Mendatang',
      meeting_url: 'https://meet.google.com/xyz-uvwx-rst'
    }
  ]);

  // Search Fatwa library state
  const [fatwaSearchTerm, setFatwaSearchTerm] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Pre-built Fatwa Template snippet quick inserter
  const fatwaTemplates = [
    {
      label: 'Fatwa No. 17 (Ta\'zir/Denda)',
      text: '\n\n📜 *Rujukan Fatwa DSN-MUI No. 17/DSN-MUI/IX/2000*:\nDenda keterlambatan (ta\'zir) hanya dibolehkan jika nasabah sengaja menunda pembayaran, dan seluruh dana denda WAJIB disalurkan 100% sebagai dana sosial (hibah/infaq), tidak boleh diakui sebagai pendapatan bank.'
    },
    {
      label: 'Fatwa No. 77 (Murabahah)',
      text: '\n\n📜 *Rujukan Fatwa DSN-MUI No. 77/DSN-MUI/V/2010*:\nDalam akad Murabahah, margin keuntungan bersifat tetap setelah akad ditandatangani dan tidak boleh berubah mengikuti fluktuasi suku bunga konvensional.'
    },
    {
      label: 'Fatwa No. 117 (Paylater)',
      text: '\n\n📜 *Rujukan Fatwa DSN-MUI No. 117/DSN-MUI/II/2018*:\nLayanan Paylater syariah wajib menggunakan akad Ijarah, Qardh, atau Murabahah tanpa ada unsur tambahan bunga (riba nasi\'ah) atas penundaan bayar.'
    },
    {
      label: 'Fatwa No. 03 (Zakat Profesi)',
      text: '\n\n📜 *Rujukan Fatwa DSN-MUI No. 03/DSN-MUI/2000*:\nZakat penghasilan dikeluarkan sebesar 2.5% saat menerima pendapatan jika telah mencapai nisab setara 85 gram emas per tahun.'
    }
  ];

  const handleInsertTemplate = (text: string) => {
    setReplyText((prev) => prev + text);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !replyText.trim()) return;

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: 'Dibalas' as const,
          reply_content: replyText,
          reply_at: 'Baru saja'
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    triggerToast(`Jawaban syariah resmi berhasil dikirim ke ${selectedTicket.user_name} (${selectedTicket.user_email})!`);
    setSelectedTicket(null);
    setReplyText('');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = 
      ticketFilter === 'semua' ? true :
      ticketFilter === 'menunggu' ? t.status === 'Menunggu' :
      t.status === 'Dibalas';

    const matchesSearch = 
      t.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const filteredFatwas = DSN_MUI_FATWA_DATABASE.filter((f) => 
    f.title.toLowerCase().includes(fatwaSearchTerm.toLowerCase()) ||
    f.number.toLowerCase().includes(fatwaSearchTerm.toLowerCase()) ||
    f.summary.toLowerCase().includes(fatwaSearchTerm.toLowerCase())
  );

  return (
    <DashboardContainer pageTitle="Portal Konsultan Syariah">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-emerald-600 dark:bg-emerald-700 text-white p-4 rounded-2xl shadow-2xl border border-emerald-500 flex items-center justify-between animate-slide-in">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-200 flex-shrink-0 animate-bounce" />
            <p className="text-xs font-bold leading-relaxed">{toastMessage}</p>
          </div>
          <button onClick={() => setShowToast(false)} className="text-white hover:text-emerald-200 ml-4 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner Human Advisor Portal */}
      <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-xl shadow-emerald-950/20 mb-6">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-300 shrink-0">
              <UserCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/40 text-[10px] font-extrabold text-emerald-200 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Certified Sharia Financial Advisor (DSN-MUI Approved)</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Portal Konsultan Syariah Senior
              </h1>
              <p className="text-xs text-emerald-100/90 font-medium">
                Selamat bertugas, <span className="font-bold text-amber-300">{profile?.full_name || 'Ustadz Advisor'}</span>. Anda memiliki otoritas menjawab tiket jamaah & memandu Fatwa DSN-MUI.
              </p>
            </div>
          </div>

          {/* Performance Metrics Stats Badges */}
          <div className="grid grid-cols-3 gap-2 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center shrink-0">
            <div>
              <span className="text-[10px] text-emerald-200 block font-bold">Rating Jamaah</span>
              <span className="text-sm font-black text-amber-300 flex items-center justify-center mt-0.5">
                4.98 <Star className="w-3 h-3 fill-amber-300 text-amber-300 ml-1" />
              </span>
            </div>
            <div className="border-x border-white/10 px-2">
              <span className="text-[10px] text-emerald-200 block font-bold">Tiket Selesai</span>
              <span className="text-sm font-black text-white mt-0.5 block">128 Tiket</span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-200 block font-bold">Respon Avg</span>
              <span className="text-sm font-black text-emerald-300 mt-0.5 block">&lt; 15 Mnt</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="flex border border-slate-200/80 dark:border-slate-800 mb-6 overflow-x-auto whitespace-nowrap bg-slate-100/80 dark:bg-slate-900/90 p-1.5 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`flex-1 py-3 px-4 text-xs font-black rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            activeTab === 'tickets'
              ? 'bg-[#064E3B] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4 mr-2" />
          Tiket Konsultasi Masuk ({tickets.filter(t => t.status === 'Menunggu').length})
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`flex-1 py-3 px-4 text-xs font-black rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            activeTab === 'sessions'
              ? 'bg-[#064E3B] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Jadwal Sesi Live 1-on-1 ({liveSessions.length})
        </button>

        <button
          onClick={() => setActiveTab('fatwas')}
          className={`flex-1 py-3 px-4 text-xs font-black rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            activeTab === 'fatwas'
              ? 'bg-[#064E3B] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 mr-2" />
          Perpustakaan Matan Fatwa ({DSN_MUI_FATWA_DATABASE.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 px-4 text-xs font-black rounded-xl flex items-center justify-center transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[#064E3B] text-white shadow-md'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
          }`}
        >
          <User className="w-4 h-4 mr-2" />
          Profil & Gelar Advisor
        </button>
      </div>

      {/* ── TAB 1: TIKET KONSULTASI MASUK ────────────────────────────── */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          
          {/* Filter Bar */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTicketFilter('semua')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${ticketFilter === 'semua' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Semua ({tickets.length})
                </button>
                <button
                  onClick={() => setTicketFilter('menunggu')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${ticketFilter === 'menunggu' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Menunggu ({tickets.filter(t => t.status === 'Menunggu').length})
                </button>
                <button
                  onClick={() => setTicketFilter('dibalas')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${ticketFilter === 'dibalas' ? 'bg-[#064E3B] text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'}`}
                >
                  Selesai ({tickets.filter(t => t.status === 'Dibalas').length})
                </button>
              </div>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nama, topik, atau kata kunci..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Ticket Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`bg-white dark:bg-slate-900 rounded-3xl p-5 border transition-all flex flex-col justify-between space-y-4 shadow-xs ${
                  ticket.status === 'Menunggu'
                    ? 'border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-400/20'
                    : 'border-slate-200/80 dark:border-slate-800'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-[#064E3B] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {ticket.category}
                    </span>

                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                        ticket.priority === 'Tinggi' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                      }`}>
                        {ticket.priority}
                      </span>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        ticket.status === 'Menunggu' 
                          ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-black text-slate-900 dark:text-white leading-tight">
                    {ticket.subject}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    "{ticket.message}"
                  </p>
                </div>

                {/* Member Info & Snapshot */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-7 w-7 rounded-full bg-[#064E3B]/10 text-[#064E3B] dark:text-emerald-400 font-extrabold flex items-center justify-center text-xs">
                        {ticket.user_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{ticket.user_name}</p>
                        <p className="text-[10px] text-slate-400">{ticket.user_email} • {ticket.created_at}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedTicket(ticket)}
                      className="bg-[#064E3B] hover:bg-[#043E2F] text-white text-xs font-black px-4 py-2 rounded-xl shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{ticket.status === 'Menunggu' ? 'Tanggapi Tiket' : 'Lihat Tanggapan'}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {ticket.user_financial_snapshot && (
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 grid grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-300 font-medium">
                      <div>
                        <span className="text-slate-400 block">Gaji Bulanan:</span>
                        <span className="font-bold text-slate-900 dark:text-white">Rp {(ticket.user_financial_snapshot.monthly_income / 1000000).toFixed(1)}Jt</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Zakat Terutang:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Rp {ticket.user_financial_snapshot.zakat_due.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Utang Riba:</span>
                        <span className="font-bold text-rose-600 dark:text-rose-400">Rp {(ticket.user_financial_snapshot.debt_amount / 1000000).toFixed(1)}Jt</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 2: JADWAL SESI LIVE 1-ON-1 ────────────────────────────── */}
      {activeTab === 'sessions' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
              <Video className="w-5 h-5 text-[#064E3B] dark:text-emerald-400 mr-2" />
              Jadwal Sesi Konsultasi Live 1-on-1 (Google Meet/Zoom)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Sesi tatap muka virtual eksklusif khusus member Pro & Family Plan.
            </p>
          </div>

          <div className="space-y-4">
            {liveSessions.map((session) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
                      {session.user_role}
                    </span>
                    <span className="text-xs font-black text-slate-900 dark:text-white">{session.user_name}</span>
                  </div>
                  <h3 className="text-sm font-black text-[#064E3B] dark:text-emerald-400">{session.topic}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />
                    {session.date_time}
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <a
                    href={session.meeting_url}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[#064E3B] hover:bg-[#043E2F] text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all flex items-center space-x-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Masuk Ruang Temu</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 3: MATAN FATWA DSN-MUI LIBRARY ────────────────────────── */}
      {activeTab === 'fatwas' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center">
                <BookOpen className="w-5 h-5 text-[#064E3B] dark:text-emerald-400 mr-2" />
                Database Rujukan Fatwa DSN-MUI Resmi
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                Pencarian cepat matan dan dalil fatwa Dewan Syariah Nasional Majelis Ulama Indonesia.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Cari nomor atau topik fatwa..."
                value={fatwaSearchTerm}
                onChange={(e) => setFatwaSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFatwas.map((fatwa, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-[#064E3B] dark:text-emerald-300">
                    {fatwa.number}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">{fatwa.category}</span>
                </div>
                <h3 className="text-xs font-black text-slate-900 dark:text-white">{fatwa.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{fatwa.summary}</p>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                  {fatwa.keyPoints[0]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB 4: PROFIL & GELAR ADVISOR ────────────────────────────── */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="h-20 w-20 rounded-full bg-[#064E3B] text-amber-300 mx-auto flex items-center justify-center font-black text-2xl shadow-lg border-2 border-amber-300">
              {profile?.full_name?.charAt(0) || 'U'}
            </div>
            <h2 className="text-lg font-black text-slate-900 dark:text-white">{profile?.full_name || 'Ustadz Advisor Senior'}</h2>
            <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Dewan Pengawas & Financial Advisor Syariah (Sertifikasi DSN-MUI)</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-400 font-bold">Lisensi Otoritas:</span>
              <span className="font-bold text-slate-900 dark:text-white">Dewan Syariah Nasional MUI No. DSN/MUI/2024/098</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
              <span className="text-slate-400 font-bold">Spesialisasi Fiqh:</span>
              <span className="font-bold text-slate-900 dark:text-white">Akad KPR, Zakat Perdagangan, Riba Detox</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-bold">Jam Konsultasi Live:</span>
              <span className="font-bold text-slate-900 dark:text-white">Senin - Jumat (09.00 - 17.00 WIB)</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal Response Ticket Form */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#064E3B] dark:text-emerald-400" />
                <h3 className="font-black text-slate-900 dark:text-white text-sm">Respon Konsultasi Syariah Resmi</h3>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Ticket Inquiry Details */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-black text-slate-900 dark:text-white">{selectedTicket.user_name} ({selectedTicket.user_role.toUpperCase()})</span>
                <span className="text-[10px] text-slate-400">{selectedTicket.created_at}</span>
              </div>
              <p className="text-xs font-black text-[#064E3B] dark:text-emerald-400">{selectedTicket.subject}</p>
              <p className="text-xs text-slate-700 dark:text-slate-200 italic leading-relaxed">"{selectedTicket.message}"</p>
            </div>

            {/* Quick Fatwa Template Inserter */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Sisipkan Matan Fatwa DSN-MUI Instan:</span>
              <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
                {fatwaTemplates.map((tmpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleInsertTemplate(tmpl.text)}
                    className="text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-[#064E3B] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 px-2.5 py-1 rounded-lg shrink-0 hover:bg-emerald-100 transition-all cursor-pointer"
                  >
                    + {tmpl.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form Reply */}
            <form onSubmit={handleSendReply} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 dark:text-white mb-1">Naskah Jawaban Advisor Syariah:</label>
                <textarea
                  rows={6}
                  required
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tuliskan analisis Fiqh Muamalah & rekomendasi Fatwa DSN-MUI secara terstruktur..."
                  className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[10px] text-slate-400 font-medium">🔒 Jawaban akan terverifikasi cap stempel DSN-MUI & dikirim via email.</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#064E3B] hover:bg-[#043E2F] text-white font-black text-xs rounded-xl shadow-md flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Kirim Fatwa Jawaban</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardContainer>
  );
};
