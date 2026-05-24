import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Append a cache-busting timestamp to any Supabase Storage public URL
 * so browsers always fetch the latest uploaded asset instead of a cached copy.
 */
export const bustCache = (url: string): string => {
  if (!url) return url;
  // Only bust Supabase Storage URLs (contains /storage/v1/object/public/)
  if (url.includes('/storage/v1/object/public/')) {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${Date.now()}`;
  }
  return url;
};

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
  logo_url: '', // Empty means fallback to default Sharify shield icon
  favicon_url: '/favicon.ico',
  ai_widget_icon: 'Sparkles',
  chat_avatar_url: '', // Empty means fallback to default advisor bot avatar
  
  hero_title: 'Navigasi Finansial Syariah Masa Depan Anda',
  hero_subtitle: 'Konsultan keuangan pintar berbasis AI untuk menghitung zakat, merancang goals, membersihkan riba, dan merencanakan waris fardh secara berkah.',
  hero_cta_primary: 'Mulai Konsultasi Gratis',
  hero_cta_secondary: 'Pelajari Fitur',
  
  solusi_title: 'Solusi Pengelolaan Finansial Islami Modern',
  solusi_subtitle: 'Sharify menghadirkan integrasi AI dengan hukum fiqh muamalah komprehensif guna menjaga ketenteraman finansial keluarga.',
  
  fitur_title: 'Fitur Utama Pilihan Pengguna',
  fitur_subtitle: 'Akses mudah ke berbagai kalkulator Fiqh, tracker bebas riba, hingga AI co-pilot interaktif.',
  
  harga_title: 'Pilihan Rencana Investasi Finansial Anda',
  harga_subtitle: 'Mulai dari Rp 0 untuk akses dasar atau nikmati layanan penasihat premium Fiqh yang personal.',
  
  footer_desc: 'Asisten Keuangan Syariah Masa Depan Anda berlandaskan AI.',
  footer_copyright: '© 2026 Sharify Indonesia. Semua Hak Dilindungi.',
};

interface SettingsState {
  settings: SystemSettings;
  loading: boolean;
  _channel: RealtimeChannel | null;
  fetchSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SystemSettings>) => Promise<boolean>;
  subscribeToRealtime: () => void;
  unsubscribeFromRealtime: () => void;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loading: false,
  _channel: null,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('key, value');
      
      if (!error && data && data.length > 0) {
        const loadedSettings = { ...DEFAULT_SETTINGS };
        data.forEach((row) => {
          if (row.key in loadedSettings) {
            (loadedSettings as any)[row.key] = row.value;
          }
        });
        set({ settings: loadedSettings });
      }
    } catch (err) {
      console.warn('Gagal memuat pengaturan sistem dari database. Menggunakan preset bawaan.', err);
    } finally {
      set({ loading: false });
    }
  },

  updateSettings: async (newSettings) => {
    try {
      const keys = Object.keys(newSettings) as Array<keyof SystemSettings>;
      
      // Update locally first to trigger re-renders instantly across the application
      const updatedLocal = { ...get().settings, ...newSettings };
      set({ settings: updatedLocal });

      // Upsert into Supabase for persistence
      const promises = keys.map((key) => {
        const val = newSettings[key];
        if (val === undefined) return Promise.resolve();
        return supabase
          .from('system_settings')
          .upsert({ key, value: String(val) });
      });

      await Promise.all(promises);
      return true;
    } catch (err) {
      console.error('Gagal menyimpan pembaruan ke database:', err);
      return false;
    }
  },

  subscribeToRealtime: () => {
    // Avoid duplicate subscriptions
    if (get()._channel) return;

    const channel = supabase
      .channel('system_settings_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'system_settings' },
        () => {
          // Re-fetch all settings whenever any row changes in the DB
          get().fetchSettings();
        }
      )
      .subscribe();

    set({ _channel: channel });
  },

  unsubscribeFromRealtime: () => {
    const channel = get()._channel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ _channel: null });
    }
  },
}));
