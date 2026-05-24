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

  hero_title: 'Navigasi Finansial Syariah Masa Depan Anda',
  hero_subtitle:
    'Konsultan keuangan pintar berbasis AI untuk menghitung zakat, merancang goals, membersihkan riba, dan merencanakan waris fardh secara berkah.',
  hero_cta_primary: 'Mulai Konsultasi Gratis',
  hero_cta_secondary: 'Pelajari Fitur',

  solusi_title: 'Solusi Pengelolaan Finansial Islami Modern',
  solusi_subtitle:
    'Sharify menghadirkan integrasi AI dengan hukum fiqh muamalah komprehensif guna menjaga ketenteraman finansial keluarga.',

  fitur_title: 'Fitur Utama Pilihan Pengguna',
  fitur_subtitle:
    'Akses mudah ke berbagai kalkulator Fiqh, tracker bebas riba, hingga AI co-pilot interaktif.',

  harga_title: 'Pilihan Rencana Investasi Finansial Anda',
  harga_subtitle:
    'Mulai dari Rp 0 untuk akses dasar atau nikmati layanan penasihat premium Fiqh yang personal.',

  footer_desc: 'Asisten Keuangan Syariah Masa Depan Anda berlandaskan AI.',
  footer_copyright: '© 2026 Sharify Indonesia. Semua Hak Dilindungi.',
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
