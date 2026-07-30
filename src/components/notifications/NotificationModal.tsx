import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, CheckCircle2, Info, AlertTriangle, Sparkles, X, CheckCheck, Trash2, ExternalLink
} from 'lucide-react';
import { useNotificationStore, type AppNotification } from '../../store/notificationStore';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotificationStore();
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');

  if (!isOpen) return null;

  const filteredNotifications = filterTab === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-rose-500" />;
      case 'reminder':
        return <Bell className="w-4 h-4 text-amber-500" />;
      case 'promo':
        return <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />;
      case 'info':
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBadgeColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'success':
        return 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
      case 'warning':
        return 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
      case 'reminder':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'promo':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const diffMs = Date.now() - new Date(dateStr).getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      if (diffMins < 1) return 'Baru saja';
      if (diffMins < 60) return `${diffMins}m lalu`;
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours}j lalu`;
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}h lalu`;
    } catch {
      return 'Baru saja';
    }
  };

  const handleItemClick = (notif: AppNotification) => {
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
    if (notif.link) {
      onClose();
      navigate(notif.link);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-end p-4 sm:p-6 bg-slate-950/30 backdrop-blur-xs animate-fade-in">
      {/* Backdrop overlay click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Notification Card Container */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 animate-zoom-in">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#064E3B] to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-white/10 text-amber-300 backdrop-blur-xs">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight text-white flex items-center">
                Notifikasi Sistem
                {unreadCount > 0 && (
                  <span className="ml-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black">
                    {unreadCount} Baru
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-emerald-100/90 font-medium">Pemberitahuan & pengingat transaksi syariah</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter & Actions Bar */}
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 flex items-center justify-between text-xs">
          {/* Tabs */}
          <div className="flex items-center space-x-1 bg-slate-200/60 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilterTab('unread')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                filterTab === 'unread'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {/* Mark all as read */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center"
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </div>

        {/* Notification Items List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-slate-100 dark:divide-slate-800/40">
          {filteredNotifications.map((notif) => (
            <div
              key={notif.id}
              className={`pt-2.5 first:pt-0 group p-3 rounded-2xl transition-all border ${
                notif.is_read
                  ? 'bg-white dark:bg-slate-900 border-transparent text-slate-600 dark:text-slate-400'
                  : 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40 text-slate-900 dark:text-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                
                {/* Icon Badge */}
                <div className={`p-2 rounded-xl border shrink-0 ${getBadgeColor(notif.type)}`}>
                  {getIcon(notif.type)}
                </div>

                {/* Content */}
                <div 
                  onClick={() => handleItemClick(notif)}
                  className="flex-1 min-w-0 cursor-pointer space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-bold truncate pr-2 ${!notif.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                      {formatTimeAgo(notif.created_at)}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {notif.message}
                  </p>

                  {notif.link && (
                    <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 pt-0.5">
                      <span>Buka Modul</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center justify-between space-y-2 shrink-0">
                  {!notif.is_read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    title="Hapus Notifikasi"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="py-12 text-center space-y-2 text-slate-400">
              <Bell className="w-8 h-8 mx-auto opacity-40 text-emerald-600" />
              <p className="text-xs font-bold">Tidak ada notifikasi {filterTab === 'unread' ? 'belum dibaca' : ''}</p>
              <p className="text-[11px]">Anda sudah mendapatkan update terbaru dari sistem Sharify.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
