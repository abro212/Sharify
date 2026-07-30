import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export interface AppNotification {
  id: string;
  user_id?: string | null;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'reminder' | 'promo';
  link?: string;
  is_read: boolean;
  created_at: string;
}

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'default-1',
    title: 'Selamat Datang di Sharify! 🌿',
    message: 'Asisten AI Syariah Anda siap mendampingi zakat, Riba detox, dan perencanaan keuangan berkah.',
    type: 'success',
    link: '/dashboard',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
  },
  {
    id: 'default-2',
    title: 'Evaluasi Kesehatan Finansial 📊',
    message: 'Financial Health Score Anda saat ini adalah 78 (Good). Cek rincian rekomendasi di modul Health Check.',
    type: 'info',
    link: '/health-check',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(), // 3 hours ago
  },
  {
    id: 'default-3',
    title: 'Pengingat Zakat Maal & Profesi 🕌',
    message: 'Sudahkah Anda mengecek nishab dan menghitung zakat bulan ini? Hitung cepat di Kalkulator Zakat.',
    type: 'reminder',
    link: '/zakat',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: 'default-4',
    title: 'Program Riba Detox Aktif 🛡️',
    message: 'Susun strategi pelunasan utang riba bertahap dengan metode Avalanche atau Snowball.',
    type: 'warning',
    link: '/riba-detox',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
];

interface NotificationState {
  notifications: AppNotification[];
  loading: boolean;
  unreadCount: number;
  channel: RealtimeChannel | null;
  fetchNotifications: (userId?: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  addNotification: (notif: Omit<AppNotification, 'id' | 'created_at' | 'is_read'>) => Promise<void>;
  subscribeToRealtime: (userId?: string) => void;
  unsubscribeFromRealtime: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: DEFAULT_NOTIFICATIONS,
  loading: false,
  unreadCount: DEFAULT_NOTIFICATIONS.filter((n) => !n.is_read).length,
  channel: null,

  fetchNotifications: async (userId?: string) => {
    set({ loading: true });
    try {
      let query = supabase
        .from('user_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.or(`user_id.eq.${userId},user_id.is.null`);
      }

      const { data, error } = await query;

      if (error) {
        console.warn('[NotificationStore] Database fetch warning, using stored/default list:', error.message);
        const current = get().notifications;
        const unread = current.filter((n) => !n.is_read).length;
        set({ loading: false, unreadCount: unread });
        return;
      }

      if (data && data.length > 0) {
        const unread = data.filter((n: AppNotification) => !n.is_read).length;
        set({ notifications: data as AppNotification[], unreadCount: unread, loading: false });
      } else {
        // Fallback to default notifications if table is empty
        const unread = DEFAULT_NOTIFICATIONS.filter((n) => !n.is_read).length;
        set({ notifications: DEFAULT_NOTIFICATIONS, unreadCount: unread, loading: false });
      }
    } catch (err) {
      console.error('[NotificationStore] Unexpected error:', err);
      set({ loading: false });
    }
  },

  markAsRead: async (id: string) => {
    const prevNotifs = get().notifications;
    const updated = prevNotifs.map((n) => (n.id === id ? { ...n, is_read: true } : n));
    const unread = updated.filter((n) => !n.is_read).length;
    set({ notifications: updated, unreadCount: unread });

    // Sync to Supabase if it's not a default fallback item
    if (!id.startsWith('default-')) {
      try {
        await supabase
          .from('user_notifications')
          .update({ is_read: true })
          .eq('id', id);
      } catch (err) {
        console.error('[NotificationStore] Mark read DB error:', err);
      }
    }
  },

  markAllAsRead: async () => {
    const prevNotifs = get().notifications;
    const updated = prevNotifs.map((n) => ({ ...n, is_read: true }));
    set({ notifications: updated, unreadCount: 0 });

    try {
      await supabase
        .from('user_notifications')
        .update({ is_read: true })
        .eq('is_read', false);
    } catch (err) {
      console.error('[NotificationStore] Mark all read DB error:', err);
    }
  },

  deleteNotification: async (id: string) => {
    const prevNotifs = get().notifications;
    const updated = prevNotifs.filter((n) => n.id !== id);
    const unread = updated.filter((n) => !n.is_read).length;
    set({ notifications: updated, unreadCount: unread });

    if (!id.startsWith('default-')) {
      try {
        await supabase
          .from('user_notifications')
          .delete()
          .eq('id', id);
      } catch (err) {
        console.error('[NotificationStore] Delete DB error:', err);
      }
    }
  },

  addNotification: async (notif) => {
    const newNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    const prevNotifs = get().notifications;
    const updated = [newNotif, ...prevNotifs];
    const unread = updated.filter((n) => !n.is_read).length;
    set({ notifications: updated, unreadCount: unread });

    try {
      await supabase.from('user_notifications').insert([
        {
          user_id: notif.user_id || null,
          title: notif.title,
          message: notif.message,
          type: notif.type || 'info',
          link: notif.link || null,
          is_read: false,
        },
      ]);
    } catch (err) {
      console.error('[NotificationStore] Insert DB error:', err);
    }
  },

  subscribeToRealtime: (userId?: string) => {
    get().unsubscribeFromRealtime();

    const channel = supabase
      .channel('public:user_notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_notifications' },
        () => {
          get().fetchNotifications(userId);
        }
      )
      .subscribe();

    set({ channel });
  },

  unsubscribeFromRealtime: () => {
    const channel = get().channel;
    if (channel) {
      supabase.removeChannel(channel);
      set({ channel: null });
    }
  },
}));
