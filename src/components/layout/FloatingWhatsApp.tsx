import React from 'react';
import { useSettingsStore } from '../../store/settingsStore';

interface FloatingWhatsAppProps {
  isDashboard?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ isDashboard = false }) => {
  const { settings } = useSettingsStore();
  const whatsappNumber = settings?.whatsapp_number?.trim();

  // If there is no WhatsApp number configured, hide the button gracefully
  if (!whatsappNumber) return null;

  // Formulate the official WhatsApp click-to-chat API URL
  const waUrl = `https://wa.me/${whatsappNumber}`;

  // Dynamically position depending on whether it resides in the public views or the logged-in dashboard
  // public views: bottom-6 right-6
  // dashboard: bottom-24 right-6 (neatly stacked above the Floating AI Chat FAB)
  const positionClass = isDashboard
    ? 'fixed bottom-24 right-6 lg:bottom-28 lg:right-8 z-[9990]'
    : 'fixed bottom-6 right-6 lg:bottom-8 lg:right-8 z-[9990]';

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${positionClass} group flex items-center justify-center pointer-events-auto`}
      title="Hubungi Admin via WhatsApp"
    >
      {/* Dynamic Pulsing Green Aura Ring */}
      <div className="absolute inset-0 rounded-full bg-[#25D366]/35 animate-ping pointer-events-none" />

      {/* Main WhatsApp Brand Button Container */}
      <div className="relative h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 hover:rotate-6 border border-emerald-400/20">
        
        {/* Pixel-perfect official WhatsApp Brand SVG Logo */}
        <svg 
          className="w-6.5 h-6.5 lg:w-7.5 lg:h-7.5 fill-current" 
          viewBox="0 0 24 24"
        >
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.588 2.012 14.117.99 11.5 1.018 6.062 1.018 1.637 5.39 1.634 10.82c-.001 1.684.453 3.328 1.318 4.77l-.996 3.637 3.738-.981c1.44.863 2.99 1.317 4.568 1.318h-.007zM17.43 14.38c-.32-.16-1.89-.93-2.18-1.04-.3-.11-.51-.16-.72.16-.21.32-.82 1.04-1 1.25-.19.21-.38.24-.7.08-.32-.16-1.34-.49-2.56-1.58-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.18.21-.31.32-.51.11-.2.05-.38-.03-.54-.08-.16-.72-1.73-.99-2.38-.26-.63-.53-.54-.72-.55-.19-.01-.41-.01-.62-.01-.21 0-.55.08-.84.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.32c.16.22 2.26 3.45 5.48 4.84.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.15-1.48.27-.71.27-1.32.19-1.45-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </div>

      {/* High-End Minimalist Glass Tooltip (Fades in on group hover) */}
      <div className="absolute right-15 lg:right-18 top-1/2 -translate-y-1/2 bg-slate-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md border border-slate-800 tracking-wide font-sans">
        Tanya via WhatsApp
      </div>
    </a>
  );
};
