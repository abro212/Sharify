import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, Users } from 'lucide-react';
import { useSettingsStore } from '../store/settingsStore';
import { FloatingWhatsApp } from '../components/layout/FloatingWhatsApp';

interface OrgMember {
  id?: string;
  name: string;
  role: string;
  focus: string;
}

export const AboutUsPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettingsStore();
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logo_url || null);

  const orgMembers: OrgMember[] = useMemo(() => {
    try {
      return settings.organization_structure ? JSON.parse(settings.organization_structure) : [];
    } catch {
      return [];
    }
  }, [settings.organization_structure]);

  // Hierarchy Logic
  const advisory = orgMembers.filter(m => m.role.toLowerCase().includes('dewan') || m.role.toLowerCase().includes('advisory'));
  const level2 = orgMembers.filter(m => !advisory.includes(m));

  return (
    <div className="min-h-screen font-sans bg-slate-50 selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center group">
            {logoUrl ? (
              <img src={logoUrl} alt="Sharify Logo" className="h-9 object-contain" onError={() => setLogoUrl(null)} />
            ) : (
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-2xl bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/10 group-hover:scale-105 transition-transform duration-300">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="ml-3 text-2xl font-black text-slate-900 tracking-tight">Sharify</span>
              </div>
            )}
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/tentang-kami" className="text-sm font-semibold text-[#10B981] transition-colors">Tentang Kami</Link>
            <Link to="/#features" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Fitur</Link>
            <Link to="/#solusi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Solusi</Link>
            <Link to="/#teknologi" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Teknologi</Link>
            <Link to="/#harga" className="text-sm font-semibold text-slate-600 hover:text-[#10B981] transition-colors">Harga</Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors">Masuk</Link>
            <Link to="/signup" className="bg-[#10B981] hover:bg-[#0d9488] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-md shadow-emerald-500/10 hover:scale-[1.02] active:scale-[0.98]">
              Daftar Gratis
            </Link>
          </div>

          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 focus:outline-none transition-colors border border-slate-100"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-100 px-4 pt-2 pb-6 space-y-4 shadow-lg animate-fade-in z-50">
            <div className="flex flex-col space-y-1">
              <Link to="/tentang-kami" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-[#10B981] py-3 transition-colors border-b border-slate-50">Tentang Kami</Link>
              <Link to="/#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50">Fitur</Link>
              <Link to="/#solusi" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50">Solusi</Link>
              <Link to="/#harga" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold text-slate-700 hover:text-[#10B981] py-3 transition-colors border-b border-slate-50">Harga</Link>
            </div>
            <div className="pt-4 flex flex-col space-y-3">
              <Link to="/login" className="text-center text-sm font-bold text-slate-600 bg-slate-50 py-3 rounded-xl hover:bg-slate-100 transition-colors">Masuk</Link>
              <Link to="/signup" className="text-center text-sm font-bold text-white bg-[#10B981] py-3 rounded-xl hover:bg-emerald-600 transition-colors shadow-sm">Daftar Gratis</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full mb-6 border border-emerald-100">
            <Users className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Mengenal Sharify</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Struktur Inti (C-Level & Advisory)
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Pakar syariah dan inovator teknologi di balik keamanan, kecerdasan, dan keberkahan layanan Sharify.
          </p>
        </div>

        {/* Organization Chart */}
        <div className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-sm border border-slate-100 overflow-x-auto">
          <div className="min-w-[800px] flex flex-col items-center">
            
            {/* Top Level: Advisory */}
            <div className="flex justify-center items-start gap-16 relative">
              {advisory.length > 0 && (
                <div className="flex flex-col items-center relative z-10">
                  <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl w-80 text-center shadow-sm ring-4 ring-white">
                    <h3 className="text-xl font-black text-slate-900 mb-1">{advisory[0].name}</h3>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">{advisory[0].role}</p>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{advisory[0].focus}</p>
                  </div>
                  {/* Line down to Level 2 */}
                  <div className="h-12 border-l-2 border-slate-200"></div>
                </div>
              )}
            </div>

            {/* Horizontal Line for Level 2 */}
            {level2.length > 0 && advisory.length > 0 && (
              <div className="w-full max-w-5xl relative">
                {/* The main horizontal backbone line */}
                <div className="absolute top-0 left-[10%] right-[10%] border-t-2 border-slate-200"></div>
                
                {/* Level 2 Grid */}
                <div className={`grid ${level2.length === 5 ? 'grid-cols-5' : 'grid-cols-4'} gap-6 relative pt-8`}>
                  {level2.map((member, idx) => (
                    <div key={member.id || idx} className="flex flex-col items-center relative">
                      {/* Vertical line up to the horizontal backbone */}
                      <div className="absolute -top-8 left-1/2 h-8 border-l-2 border-slate-200"></div>
                      
                      <div className={`bg-white border border-slate-100 p-5 rounded-2xl w-full text-center shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300 ${member.role.toLowerCase().includes('ceo') ? 'ring-2 ring-emerald-100' : ''}`}>
                        <h3 className="text-sm font-black text-slate-900 mb-1">{member.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">{member.role}</p>
                        <p className="text-[10px] text-slate-500 leading-relaxed font-medium">{member.focus}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {orgMembers.length === 0 && (
              <div className="text-center text-slate-400 py-12">Struktur organisasi belum dikonfigurasi.</div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 py-16 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-2xl bg-[#10B981] flex items-center justify-center shadow-md">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="ml-2.5 text-xl font-black text-slate-900 tracking-tight">Sharify</span>
              </div>
              <p className="text-xs text-slate-400 max-w-sm font-semibold leading-relaxed">{settings.footer_desc}</p>
            </div>
            
            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs uppercase text-slate-400">Fitur Dasar</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Health Check Syariah</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Kalkulator Zakat</Link></li>
                <li><Link to="/login" className="hover:text-[#10B981] transition-colors">Cashflow & Sedekah</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs uppercase text-slate-400">Kebijakan</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/terms" className="hover:text-[#10B981] transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#10B981] transition-colors">Kebijakan Privasi</Link></li>
                <li><Link to="/disclaimer" className="hover:text-[#10B981] transition-colors">Sanggahan Hukum</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-extrabold text-slate-900 mb-4 text-xs uppercase text-slate-400">Perusahaan</h4>
              <ul className="space-y-2.5 text-xs font-semibold text-slate-500">
                <li><Link to="/tentang-kami" className="hover:text-[#10B981] transition-colors">Tentang Kami</Link></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-xs font-semibold text-slate-400 pt-8 border-t border-slate-100">
            {settings.footer_copyright}
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
};
