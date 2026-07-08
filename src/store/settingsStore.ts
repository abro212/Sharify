import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────
// Cache-busting helper
// Appends ?t=<timestamp> ONLY to Supabase Storage public URLs so
// the browser skips its HTTP cache and always fetches the latest asset.
// Call this once (e.g. when you store the URL in state) not on every render.
// ─────────────────────────────────────────────────────────────────
export const bustCache = (url: string | null | undefined): string => {
  if (!url) return '';
  if (url.includes('/storage/v1/object/public/')) {
    // Strip any existing ?t= param before re-adding so we don't accumulate them
    const base = url.split('?t=')[0];
    return `${base}?t=${Date.now()}`;
  }
  return url;
};

// ─────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────
export interface SystemSettings {
  logo_url: string;
  favicon_url: string;
  ai_widget_icon: string;
  chat_avatar_url: string;
  whatsapp_number: string;

  // Hero Section CMS
  hero_title: string;
  hero_subtitle: string;
  hero_cta_primary: string;
  hero_cta_secondary: string;

  // Solusi Section CMS
  solusi_title: string;
  solusi_subtitle: string;

  // Fitur Section CMS
  fitur_title: string;
  fitur_subtitle: string;

  // Harga Section CMS
  harga_title: string;
  harga_subtitle: string;

  // Footer Section CMS
  footer_desc: string;
  footer_copyright: string;

  // Legal Terms Content
  terms_content: string;
  privacy_policy_content: string;
  disclaimer_content: string;

  // Organization Structure
  organization_structure: string;

  // Third-Party Configurations
  gemini_api_key: string;
  gemini_model: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  logo_url: '',
  favicon_url: '/favicon.ico',
  ai_widget_icon: 'Sparkles',
  chat_avatar_url: '',
  whatsapp_number: '',

  hero_title: 'Navigasi Finansial Syariah Masa Depan',
  hero_subtitle:
    'Konsultan keuangan pintar berbasis AI untuk membantu Anda menghitung zakat, merancang tujuan finansial, Riba detox, dan menghitung waris faraidh secara tepat. Ketentraman finansial yang berkah adalah prioritas utama kami.',
  hero_cta_primary: 'Mulai Konsultasi Gratis',
  hero_cta_secondary: 'Pelajari Fitur',

  solusi_title: 'Solusi Finansial Syariah Era Modern',
  solusi_subtitle:
    'Sharify gabungin AI super pintar dengan hukum Fiqh Muamalah terlengkap biar financial peace of mind keluarga kamu tetap terjaga.',

  fitur_title: 'Fitur Utama untuk Kemajuan Finansial Anda',
  fitur_subtitle:
    'Akses cepat ke berbagai kalkulator Fiqh otomatis, tracker Riba Detox, hingga AI Co-Pilot yang interaktif dan responsif.',

  harga_title: 'Pilih Layanan Finansial Anda',
  harga_subtitle:
    'Mulai dari Rp 0 untuk akses dasar, atau tingkatkan ke penasihat premium Fiqh personal agar perencanaan Anda semakin lancar.',

  footer_desc: 'Asisten Keuangan Syariah Masa Depan berbasis AI untuk mendampingi kemajuan finansial Anda.',
  footer_copyright: '© 2026 Sharify Indonesia. Seluruh Hak Cipta Dilindungi.',
  
  terms_content: `# Syarat & Ketentuan Sharify\n\nSelamat datang di Sharify! Dengan mengakses platform kami, Anda menyetujui ketentuan di bawah ini. Hal ini demi kenyamanan dan keberkahan kita bersama.\n\n## 1. Akurasi Data & AI Co-Pilot\n- Sharify menyediakan saran berbasis AI (Gemini) untuk Fiqh Muamalah, zakat, dan waris.\n- Saran AI ini bersifat edukatif dan bukan merupakan fatwa mutlak. Untuk kasus hukum yang kompleks, kami sangat menyarankan Anda berkonsultasi langsung dengan Ustadz atau pakar muamalah.\n\n## 2. Riba Detox & Financial Goals\n- Kami berkomitmen mendampingi kemajuan finansial Anda agar terbebas dari riba.\n- Keberhasilan program Riba Detox bergantung pada komitmen dan kedisiplinan Anda. Mari segera lunasi kewajiban agar keuangan semakin berkah.\n\n## 3. Keamanan Akun & Privasi\n- Anda wajib menjaga kerahasiaan kata sandi Anda dengan baik.\n- Kami tidak akan menyalahgunakan data keuangan Anda. Semua data dienkripsi dengan standar keamanan industri terkini.\n\n## 4. Monetisasi & Upgrade Plan\n- Layanan premium (Plus, Pro, Family) membutuhkan pembayaran langganan aktif.\n- Pembatalan langganan dapat Anda lakukan kapan saja melalui menu profil dengan mudah dan transparan.\n\nBarakallahufiikum, mari raih tujuan finansial yang berkah dan diridhai Allah SWT bersama Sharify!`,
  privacy_policy_content: `# Kebijakan Privasi Sharify\n\nHalo! Kami di Sharify sangat menghargai privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data Anda. Keamanan data Anda adalah prioritas kami.\n\n## 1. Data Apa Saja yang Kami Kumpulkan?\n- **Informasi Akun**: Nama, email, dan foto profil saat Anda mendaftar.\n- **Data Finansial**: Informasi terkait kalkulasi zakat, target keuangan, dan perkembangan Riba Detox yang Anda masukkan.\n- **Log Interaksi AI**: Riwayat percakapan dengan AI Co-Pilot untuk meningkatkan kualitas respons kami.\n\n## 2. Bagaimana Kami Menggunakan Data Anda?\n- **Personalisasi Layanan**: Agar pengalaman dan saran dari AI Co-Pilot semakin relevan untuk Anda.\n- **Peningkatan Fitur**: Mempelajari pola penggunaan untuk pembaruan fitur yang lebih baik ke depannya.\n- **Komunikasi**: Mengirimkan notifikasi penting atau pembaruan layanan (Anda dapat menonaktifkan fitur ini).\n\n## 3. Keamanan Data Anda\n- Kami menggunakan enkripsi standar industri untuk melindungi data-data sensitif.\n- Data Anda **tidak akan pernah** kami jual kepada pihak ketiga dalam kondisi apa pun.\n\n## 4. Hak Anda Atas Data\n- Anda berhak untuk melihat, mengubah, atau meminta penghapusan akun beserta datanya kapan saja melalui menu pengaturan.\n- Jika ada pertanyaan lebih lanjut, tim dukungan kami siap membantu Anda dengan cepat!\n\nDengan menggunakan Sharify, berarti Anda telah menyetujui cara kami mengelola data ini. Mari fokus pada perbaikan finansial secara syariah dengan tenang!`,
  disclaimer_content: `# Sanggahan Hukum (Legal Disclaimer)\n\nAssalamualaikum! Sebelum Anda menggunakan layanan Sharify lebih jauh, mohon luangkan waktu untuk membaca sanggahan hukum ini. Hal ini penting agar tidak terjadi kesalahpahaman di kemudian hari.\n\n## 1. AI Bukan Ustadz atau Mufti Resmi\n- Sharify menggunakan teknologi **Artificial Intelligence (AI)** sebagai asisten Co-Pilot untuk membantu menjawab pertanyaan seputar finansial dan Fiqh Muamalah.\n- **Penting:** Jawaban AI ini murni bersifat *edukatif dan referensi awal*, bukan fatwa resmi dari Majelis Ulama atau pakar Fiqh. Jika kasus Anda kompleks atau berisiko tinggi, Anda wajib berkonsultasi langsung dengan ahli muamalah yang kompeten.\n\n## 2. Kalkulasi Zakat & Waris Faraidh\n- Alat hitung (kalkulator) zakat dan waris yang kami sediakan telah didesain semaksimal mungkin mengikuti standar syariah yang umum berlaku.\n- Namun, kondisi keuangan setiap keluarga sangat bervariasi. Oleh karena itu, hasil hitungan aplikasi ini hanya berfungsi sebagai panduan estimasi. Pastikan untuk melakukan verifikasi ulang dengan amil zakat resmi atau ahli faraidh.\n\n## 3. Risiko Finansial & Investasi\n- Segala rekomendasi saham atau aset syariah dari fitur *Halal Asset Screener* merupakan hasil analisis otomatis dan bukan jaminan keuntungan pasti.\n- **Do Your Own Research (DYOR)**. Segala risiko investasi dan perdagangan sepenuhnya menjadi tanggung jawab Anda pribadi. Sharify tidak bertanggung jawab atas kerugian materiil yang mungkin timbul dari keputusan investasi Anda.\n\n## 4. Riba Detox & Pelunasan Utang\n- Strategi bebas riba (seperti Avalanche/Snowball) yang kami susun adalah berdasarkan metode matematis teruji.\n- Kami tidak menjamin utang Anda akan lunas tanpa adanya komitmen dan kedisiplinan dari diri Anda sendiri. Konsistensi dalam mencicil sangatlah diperlukan.\n\nDengan melanjutkan penggunaan Sharify, berarti Anda memahami dan menyetujui poin-poin di atas. Mari bersama-sama berikhtiar maksimal menuju kebebasan finansial yang berkah dan diridhai Allah SWT!`,
  organization_structure: JSON.stringify([
    { id: '1', name: 'Dr. Hardiansyah, S.E., M.M', role: 'Dewan Pengawas Syariah (Sharia Advisory Board)', focus: 'Kepatuhan prinsip syariah, validasi output AI.' },
    { id: '2', name: 'Rahmat Abrori', role: 'Chief Executive Officer (CEO) / Technical Founder', focus: 'Visi bisnis, strategi manajemen, dan arsitektur infrastruktur IT.' },
    { id: '3', name: 'Agus Suyadi', role: 'Chief Financial Officer (CFO) / Financial Expert', focus: 'Model bisnis, fundamental keuangan, dan logika advisory.' },
    { id: '4', name: 'Arifa Aulia Dini', role: 'Chief Marketing Officer (CMO)', focus: 'Akuisisi pengguna, branding, dan riset UI/UX.' },
    { id: '5', name: 'Afif Assalafus Shalih', role: 'Chief Operating Officer (COO)', focus: 'Operasional harian, legalitas, dan kemitraan.' },
    { id: '6', name: 'Asep Ajaeni', role: 'Chief Technology Officer (CTO) / AI Lead', focus: 'Pengembangan model AI, integrasi API, dan basis data.' }
  ]),
  gemini_api_key: '',
  gemini_model: 'gemini-3.5-flash',
};

interface SettingsState {
  settings: SystemSettings;
  loading: boolean;
  fetchError: string | null;
  _channel: RealtimeChannel | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<{ ok: boolean; error?: string }>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

// ─────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────
export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  fetchError: null,
  _channel: null,

  // ── READ ───────────────────────────────────────────────────────
  fetchSettings: async () => {
    set({ loading: true, fetchError: null });
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');

      if (error) {
        // Surface the real Supabase error (RLS, table missing, etc.)
        console.error('[settingsStore] fetchSettings error:', error.message, error.details);
        set({ fetchError: error.message, loading: false });
        return;
      }

      if (!data || data.length === 0) {
        // Table exists but has no rows yet — keep defaults
        console.warn('[settingsStore] system_settings table is empty. Using defaults.');
        set({ loading: false });
        return;
      }

      // Merge fetched rows on top of defaults
      const loaded: SystemSettings = { ...DEFAULT_SETTINGS };
      data.forEach((row: { key: string; value: string }) => {
        if (Object.prototype.hasOwnProperty.call(loaded, row.key) && row.value != null) {
          // Apply cache-busting at fetch time so the stored URL is already "fresh"
          (loaded as unknown as Record<string, string>)[row.key] =
            row.key.endsWith('_url') ? bustCache(row.value) : row.value;
        }
      });

      set({ settings: loaded, loading: false });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[settingsStore] Unexpected error in fetchSettings:', msg);
      set({ fetchError: msg, loading: false });
    }
  },

  // ── WRITE ──────────────────────────────────────────────────────
  updateSettings: async (newSettings) => {
    // Optimistic local update for instant UI feedback
    const optimistic: SystemSettings = { ...get().settings, ...newSettings };
    set({ settings: optimistic });

    const keys = Object.keys(newSettings) as Array<keyof SystemSettings>;
    const errors: string[] = [];

    // Upsert each key individually so we catch per-row errors
    for (const key of keys) {
      const rawVal = newSettings[key];
      if (rawVal === undefined) continue;

      // Strip cache-bust param before writing to DB — store the clean base URL
      const cleanVal = typeof rawVal === 'string' ? rawVal.split('?t=')[0] : String(rawVal);

      const { error } = await supabase
        .from('system_settings')
        // onConflict targets the 'key' column (PK / UNIQUE) for true upsert behaviour
        .upsert({ key, value: cleanVal }, { onConflict: 'key' });

      if (error) {
        console.error(`[settingsStore] Failed to upsert key "${key}":`, error.message, error.details);
        errors.push(`${key}: ${error.message}`);
      }
    }

    if (errors.length > 0) {
      return { ok: false, error: errors.join(' | ') };
    }

    // Re-fetch to confirm the DB state matches and apply fresh cache-bust timestamps
    await get().fetchSettings();
    return { ok: true };
  },

  // ── REALTIME ──────────────────────────────────────────────────
  subscribeToRealtime: () => {
    if (get()._channel) return; // Already subscribed

    const channel = supabase
      .channel('system_settings_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_settings' },
        () => {
          get().fetchSettings();
        },
      )
      .subscribe((status) => {
        console.log('[settingsStore] Realtime status:', status);
      });

    set({ _channel: channel });
  },

  unsubscribeFromRealtime: () => {
    const ch = get()._channel;
    if (ch) {
      supabase.removeChannel(ch);
      set({ _channel: null });
    }
  },
}));
