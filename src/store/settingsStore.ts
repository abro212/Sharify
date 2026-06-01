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
}

const DEFAULT_SETTINGS: SystemSettings = {
  logo_url: '',
  favicon_url: '/favicon.ico',
  ai_widget_icon: 'Sparkles',
  chat_avatar_url: '',
  whatsapp_number: '',

  hero_title: 'Navigasi Finansial Syariah yang Literally Masa Depan Banget',
  hero_subtitle:
    'Konsultan keuangan pintar berbasis AI buat bantu kamu hitung zakat, rancang financial goals, Riba detox, dan hitung waris faraidh secara berkah. Honestly, berkah itu nomor satu, no cap! 🍃✨',
  hero_cta_primary: 'Mulai Konsultasi Gratis, Bestie! ✨',
  hero_cta_secondary: 'Spill Fitur Keren',

  solusi_title: 'Solusi Finansial Syariah Era Modern',
  solusi_subtitle:
    'Sharify gabungin AI super pintar dengan hukum Fiqh Muamalah terlengkap biar financial peace of mind keluarga kamu tetap terjaga.',

  fitur_title: 'Fitur Utama buat Glow Up Finansialmu',
  fitur_subtitle:
    'Akses sat-set ke berbagai kalkulator Fiqh otomatis, tracker Riba Detox, sampai AI Co-Pilot yang slay dan interaktif!',

  harga_title: 'Pilih Era Finansial Kamu Sekarang',
  harga_subtitle:
    'Honestly, mulai dari Rp 0 buat akses dasar atau upgrade ke penasihat premium Fiqh personal biar makin lancar jaya!',

  footer_desc: 'Asisten Keuangan Syariah Masa Depan berbasis AI buat nemani era glow up kamu.',
  footer_copyright: '© 2026 Sharify Indonesia. All Rights Reserved, Bestie! 🫶',
  
  terms_content: `# Syarat & Ketentuan Sharify (Terms of Service Era Baru) ✨\n\nSelamat datang di Sharify, Bestie! Dengan mengakses platform kami, kamu literally setuju dengan rules di bawah ini. No cap, ini demi kenyamanan dan berkah bersama! 🙏\n\n## 1. Akurasi Data & AI Co-Pilot\n- Sharify menyediakan saran berbasis AI (Gemini) untuk Fiqh Muamalah, zakat, dan waris.\n- Honestly, saran AI ini bersifat edukatif dan bukan fatwa mutlak. Untuk kasus hukum yang rumit banget, kami sarankan konsultasi langsung dengan Ustadz ahli muamalah, bestie!\n\n## 2. Riba Detox & Financial Goals\n- Kami berkomitmen penuh menemani era glow up finansial kamu biar bebas riba seutuhnya.\n- Keberhasilan program Riba Detox literally tergantung dari komitmen kamu sendiri, ya! Sat-set lunasin cicilan, Insya Allah makin berkah.\n\n## 3. Keamanan Akun & Privasi\n- Kamu wajib menjaga kerahasiaan password kamu biar aman sentosa.\n- Kami literally tidak akan menyalahgunakan data keuangan kamu. Semua data dienkripsi dengan standar keamanan tertinggi, no cap!\n\n## 4. Monetisasi & Upgrade Plan\n- Layanan premium (Plus, Pro, Family) membutuhkan pembayaran langganan aktif.\n- Pembatalan langganan bisa kamu lakukan kapan saja via menu profil secara sat-set tanpa ribet.\n\nBarakallahufiikum, mari raih financial goals yang berkah dan diridhai Allah SWT bersama Sharify! 🍃`,
  privacy_policy_content: `# Kebijakan Privasi Sharify (Privacy Policy Era Baru) 🛡️✨\n\nHai Bestie! Kami di Sharify sangat menghargai privasi kamu. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi data kamu. No worries, data kamu aman bareng kita! 🔒\n\n## 1. Data Apa Saja yang Kami Kumpulkan?\n- **Informasi Akun**: Nama, email, dan profile picture saat kamu mendaftar.\n- **Data Finansial**: Informasi terkait kalkulasi zakat, target keuangan, dan progress Riba Detox yang kamu input.\n- **Log Interaksi AI**: Chat logs dengan AI Co-Pilot untuk meningkatkan kualitas respon.\n\n## 2. Bagaimana Kami Menggunakan Data Kamu?\n- **Personalisasi Layanan**: Biar pengalaman dan saran dari AI Co-Pilot makin relevan dan slay buat kamu.\n- **Peningkatan Fitur**: Mempelajari pattern penggunaan untuk update fitur yang lebih keren ke depannya.\n- **Komunikasi**: Ngirimin notifikasi penting atau update layanan (kamu bisa opt-out kok!).\n\n## 3. Keamanan Data Kamu\n- Kami menggunakan enkripsi kelas industri untuk ngelindungin data-data sensitif.\n- Data kamu **tidak akan pernah** kami jual ke pihak ketiga. Periodt! 🛑\n\n## 4. Hak Kamu Atas Data\n- Kamu berhak untuk melihat, mengubah, atau meminta penghapusan akun beserta datanya kapan aja melalui menu pengaturan.\n- Kalau ada pertanyaan lebih lanjut, tim support kita siap membantu dengan sat-set!\n\nDengan menggunakan Sharify, berarti kamu udah sepakat dengan cara kami mengelola data ini. Tetap chill dan fokus glow up finansial secara syariah! 🍃`,
  disclaimer_content: `# Sanggahan Hukum (Legal Disclaimer Era Baru) ⚖️✨\n\nAssalamualaikum, Bestie! Sebelum kamu make Sharify lebih jauh, please baca *disclaimer* ini dulu ya. Biar sama-sama enak dan nggak ada miskomunikasi ke depannya! 🙏\n\n## 1. AI Bukan Ustadz / Mufti Resmi\n- Sharify menggunakan **Artificial Intelligence (AI)** sebagai asisten Co-Pilot untuk membantu menjawab seputar finansial dan Fiqh Muamalah.\n- **Penting banget:** Jawaban AI ini sifatnya cuma buat *edukasi dan referensi awal*, bukan fatwa resmi dari Majelis Ulama atau ulama ahli fiqh. Kalau kasus kamu rumit atau *high-stakes*, *literally* wajib konsul ke ustadz pakar muamalah ya!\n\n## 2. Kalkulasi Zakat & Waris Faraidh\n- Alat hitung (kalkulator) zakat dan waris yang kami sediakan udah didesain semaksimal mungkin sesuai standar syariah umum.\n- Tapi, kondisi *real* keuangan tiap keluarga pasti beda-beda. Jadi, hasil hitungan aplikasi cuma buat panduan kasar (estimasi). Pastikan buat _double-check_ lagi dengan amil zakat resmi atau ahli faraidh, no cap!\n\n## 3. Resiko Finansial & Investasi\n- Segala rekomendasi saham atau aset syariah dari fitur *Halal Asset Screener* adalah hasil analisa otomatis, bukan jaminan pasti cuan.\n- **Do Your Own Research (DYOR)**! Risiko investasi dan *trading* ditanggung sepenuhnya oleh kamu sendiri. Sharify nggak bertanggung jawab atas kerugian materiil akibat keputusan investasi kamu.\n\n## 4. Riba Detox & Pelunasan Utang\n- Strategi bebas riba (Avalanche/Snowball) yang kami susun adalah metode matematis.\n- Kami nggak ngejamin utang kamu lunas tanpa komitmen dari diri kamu sendiri. Ingat, harus *sat-set* dan disiplin nyicilnya, ya!\n\nDengan lanjut *explore* dan make Sharify, berarti kamu paham dan *agree* sama poin-poin di atas. Yuk, kita tetep ikhtiar maksimal menuju *financial freedom* yang berkah dan diridhai Allah SWT! 🍃✨`,
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
