import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { ShieldCheck, Menu, X, FileText, ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore, bustCache } from '../store/settingsStore';
import { supabase } from '../lib/supabase';
import { FloatingAIChat } from '../components/layout/FloatingAIChat';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const DisclaimerPage: React.FC = () => {
  const { session } = useAuthStore();
  const { settings } = useSettingsStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoLoading, setLogoLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchLogo = async () => {
      setLogoLoading(true);
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('value')
          .eq('key', 'logo_url')
          .maybeSingle();

        if (!cancelled) {
          if (error) {
            console.error('[DisclaimerPage] Logo fetch error:', error.message);
            setLogoUrl(null);
          } else {
            const rawUrl = data?.value;
            setLogoUrl(rawUrl && rawUrl.trim() !== '' ? rawUrl.trim() : null);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[DisclaimerPage] Unexpected logo fetch error:', err);
          setLogoUrl(null);
        }
      } finally {
        if (!cancelled) setLogoLoading(false);
      }
    };

    fetchLogo();
    return () => { cancelled = true; };
  }, []);

  const resolvedLogoUrl = React.useMemo(() => bustCache(logoUrl), [logoUrl]);

  const disclaimerContent = (
    <div className="max-w-4xl mx-auto">
      {/* Decorative Top Accent */}
      <div className="h-2 w-full bg-gradient-to-r from-emerald-500 via-[#10B981] to-amber-400 rounded-t-3xl shadow-sm"></div>

      {/* Main Glass Card */}
      <div className="bg-white rounded-b-3xl border-x border-b border-slate-100 shadow-2xl p-6 sm:p-12 relative overflow-hidden">
        {/* Subtle Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Dynamic Inner Welcome Banner */}
        <div className="relative mb-10 pb-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
              <FileText className="h-7 w-7 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
                Sanggahan Hukum
              </h1>
              <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
                Batasan tanggung jawab dan informasi legal edukatif.
              </p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100/55 shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mr-2 animate-ping"></span>
              Aktif & Terverifikasi
            </span>
          </div>
        </div>

        {/* Dynamic Markdown Content */}
        <div className="relative z-10 selection:bg-emerald-500 selection:text-white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ node, ...props }) => (
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-8 mb-4 border-b border-slate-100 pb-3 font-display" {...props} />
              ),
              h2: ({ node, ...props }) => (
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-6 mb-3 flex items-center font-display" {...props} />
              ),
              h3: ({ node, ...props }) => (
                <h3 className="text-lg font-bold text-slate-800 mt-5 mb-2 font-display" {...props} />
              ),
              p: ({ node, ...props }) => (
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 font-medium" {...props} />
              ),
              ul: ({ node, ...props }) => (
                <ul className="list-disc pl-6 mb-4 text-slate-600 text-sm sm:text-base space-y-2 font-medium" {...props} />
              ),
              ol: ({ node, ...props }) => (
                <ol className="list-decimal pl-6 mb-4 text-slate-600 text-sm sm:text-base space-y-2 font-medium" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="pl-1" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-extrabold text-slate-900" {...props} />
              ),
              blockquote: ({ node, ...props }) => (
                <blockquote className="border-l-4 border-emerald-500 bg-emerald-50/50 p-4 rounded-r-xl italic text-slate-700 my-4" {...props} />
              ),
            }}
          >
            {settings.disclaimer_content}
          </ReactMarkdown>
        </div>

        {/* Footer Nudge inside card */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-semibold text-slate-400">
          <p>Terakhir diperbarui: Real-time via Admin CMS</p>
          <p className="flex items-center text-emerald-600">
            <ShieldCheck className="w-4 h-4 mr-1 text-[#10B981]" />
            Sharify Sharia Compliance Verified
          </p>
        </div>
      </div>
    </div>
  );

  // If logged in, wrap in authenticated dashboard layout container
  if (session) {
    return (
      <DashboardContainer>
        <div className="py-6">
          {disclaimerContent}
        </div>
      </DashboardContainer>
    );
  }

  // If anonymous public guest, wrap in landing page navbar and footer layouts
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-accent selection:text-white relative overflow-x-hidden">
      {/* Landing Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            {logoLoading ? (
              <div className="h-8 w-24 bg-slate-100 rounded-full animate-pulse" />
            ) : resolvedLogoUrl ? (
              <img
                src={resolvedLogoUrl}
                alt="Sharify Logo"
                className="h-8 object-contain"
                onError={() => setLogoUrl(null)}
              />
            ) : (
              <div className="flex items-center group">
                <div className="h-9 w-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/10">
                  <ShieldCheck className="h-5.5 w-5.5 text-white" />
                </div>
                <span className="ml-2.5 text-xl font-bold text-gray-900 tracking-tight">Sharify</span>
              </div>
            )}
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="/#features" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Fitur</a>
            <a href="/#solusi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Solusi</a>
            <a href="/#teknologi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Teknologi</a>
            <Link to="/upgrade" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Harga</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Masuk</Link>
            <Link to="/signup" className="bg-[#10B981] hover:bg-[#0d9488] text-white px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]">
              Daftar Gratis
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors border border-slate-100"
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fade-in z-50">
            <div className="flex flex-col space-y-1">
              <a 
                href="/#features" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Fitur
              </a>
              <a 
                href="/#solusi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Solusi
              </a>
              <a 
                href="/#teknologi" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Teknologi
              </a>
              <Link 
                to="/upgrade" 
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50"
              >
                Harga
              </Link>
            </div>
            
            <div className="pt-2 flex flex-col space-y-3">
              <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-bold text-slate-700 hover:text-slate-900 py-3 rounded-full border border-slate-200 bg-white"
              >
                Masuk
              </Link>
              <Link 
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center text-sm font-bold bg-[#10B981] hover:bg-[#0d9488] text-white py-3 rounded-full shadow-lg shadow-emerald-500/10"
              >
                Daftar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#10B981] transition-all hover:translate-x-[-4px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Home
          </Link>
        </div>
        {disclaimerContent}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 border-t border-slate-100">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-left">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              {logoLoading ? (
                <div className="h-7 w-24 bg-slate-100 rounded-full animate-pulse" />
              ) : resolvedLogoUrl ? (
                <img src={resolvedLogoUrl} alt="Logo" className="h-7 object-contain" />
              ) : (
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/10">
                    <ShieldCheck className="h-5 w-5 text-white" />
                  </div>
                  <span className="ml-2.5 text-xl font-black text-slate-900 tracking-tight">Sharify</span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-400 max-w-sm font-semibold leading-relaxed">{settings.footer_desc}</p>
          </div>
          
          <div>
            <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Fitur Dasar (Free)</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Health Check Syariah</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Kalkulator Zakat</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Cashflow & Sedekah</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">AI Co-Pilot Assistant</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Fitur Premium (Pro/Family)</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Rencana Riba Detox</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Halal Asset Screener</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Smart Akad Analyzer</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Qurban Auto-Saver</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Zakat-to-Tax Report</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Baitul Mal Keluarga</Link></li>
              <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Digital Wasiat Generator</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-extrabold text-slate-900 mb-4 text-xs tracking-tight uppercase text-slate-400">Kebijakan</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
              <li><Link to="/terms" className="hover:text-[#10B981] transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#10B981] transition-colors">Kebijakan Privasi</Link></li>
              <li><Link to="/disclaimer" className="hover:text-[#10B981] transition-colors">Sanggahan Hukum</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-xs font-semibold text-slate-400 pt-8 border-t border-slate-100">
          {settings.footer_copyright}
        </div>
      </footer>

      <FloatingAIChat unlimited />
    </div>
  );
};
