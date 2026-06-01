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
