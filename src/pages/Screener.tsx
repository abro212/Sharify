import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  Search, ShieldCheck, AlertTriangle, CheckCircle2, XCircle, 
  HelpCircle, Sparkles, Scale 
} from 'lucide-react';

interface AssetDetail {
  ticker: string;
  name: string;
  type: 'Saham' | 'Kripto';
  isCompliant: boolean;
  businessScore: number; // percentage of non-halal revenue
  debtRatio: number; // interest-bearing debt to total assets
  cashRatio: number; // interest-bearing liquid assets to total assets
  description: string;
  source: string;
}

export const Screener: React.FC = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [screenedAsset, setScreenedAsset] = useState<AssetDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Mock Database of Pre-Screened popular assets
  const assetDatabase: Record<string, AssetDetail> = {
    GOTO: {
      ticker: 'GOTO',
      name: 'GoTo Gojek Tokopedia Tbk.',
      type: 'Saham',
      isCompliant: true,
      businessScore: 0.8, // 0.8% non-halal revenue (mainly bank interest on idle cash)
      debtRatio: 4.2, // 4.2% interest-bearing debt (well below 45% limit)
      cashRatio: 11.5, // 11.5% interest-bearing cash (well below 45% limit)
      description: 'Layanan on-demand, e-commerce, dan financial technology GOTO telah ditinjau sesuai dengan kriteria penyaringan saham syariah DSN-MUI. Pendapatan usaha utama berasal dari penyediaan jasa platform digital halal.',
      source: 'Indeks Saham Syariah Indonesia (ISSI)'
    },
    TLKM: {
      ticker: 'TLKM',
      name: 'Telkom Indonesia (Persero) Tbk.',
      type: 'Saham',
      isCompliant: true,
      businessScore: 0.5,
      debtRatio: 18.6,
      cashRatio: 9.4,
      description: 'TLKM merupakan salah satu emiten telekomunikasi terbesar yang terdaftar di Jakarta Islamic Index (JII). Seluruh aktivitas bisnis telekomunikasi, data, dan jaringan dinilai memenuhi prinsip syariah tanpa keterlibatan sektor non-halal.',
      source: 'Jakarta Islamic Index (JII)'
    },
    KLBF: {
      ticker: 'KLBF',
      name: 'Kalbe Farma Tbk.',
      type: 'Saham',
      isCompliant: true,
      businessScore: 1.1,
      debtRatio: 8.5,
      cashRatio: 14.2,
      description: 'Industri farmasi dan suplemen kesehatan Kalbe Farma bebas dari kegiatan usaha non-halal. Rincian rasio keuangan menunjukkan tingkat utang berbunga syariah yang sangat aman di bawah batas maksimal 45%.',
      source: 'Jakarta Islamic Index (JII)'
    },
    BBCA: {
      ticker: 'BBCA',
      name: 'Bank Central Asia Tbk.',
      type: 'Saham',
      isCompliant: false,
      businessScore: 94.5, // 94.5% interest/riba based income
      debtRatio: 82.3, // High interest leverage from depositors
      cashRatio: 78.4,
      description: 'Emiten perbankan konvensional tidak memenuhi kriteria penapisan saham syariah karena bisnis utamanya menghasilkan pendapatan dari bunga (Riba) dan menyalurkan pinjaman berbasis riba.',
      source: 'DSN-MUI Penapisan Saham'
    },
    BBRI: {
      ticker: 'BBRI',
      name: 'Bank Rakyat Indonesia (Persero) Tbk.',
      type: 'Saham',
      isCompliant: false,
      businessScore: 92.8,
      debtRatio: 88.5,
      cashRatio: 81.2,
      description: 'BBRI adalah institusi perbankan konvensional dengan aliran pendapatan utama berbasis bunga. Sesuai Fatwa DSN-MUI No. 80, emiten jasa keuangan berbasis riba dikategorikan sebagai Non-Syariah.',
      source: 'DSN-MUI Penapisan Saham'
    },
    BTC: {
      ticker: 'BTC',
      name: 'Bitcoin',
      type: 'Kripto',
      isCompliant: true,
      businessScore: 0,
      debtRatio: 0,
      cashRatio: 0,
      description: 'Sebagai aset kripto utilitas dan medium transfer terdesentralisasi, BTC diizinkan oleh sebagian besar dewan syariah kontemporer (termasuk kajian beberapa Ustadz Fiqh Muamalah) sepanjang digunakan sebagai komoditas digital (Sil\'ah) dan tidak mengandung unsur judi (Maisir) atau penipuan (Gharar). Namun, dewan penasihat mengingatkan untuk berhati-hati atas volatilitas ekstrem.',
      source: 'Shariah Crypto Advisory Board (Global)'
    },
    ETH: {
      ticker: 'ETH',
      name: 'Ethereum',
      type: 'Kripto',
      isCompliant: true,
      businessScore: 0,
      debtRatio: 0,
      cashRatio: 0,
      description: 'Ethereum berfungsi sebagai platform smart contract untuk aplikasi terdesentralisasi. Penggunaannya dinilai halal karena memfasilitasi teknologi kontrak digital otomatis (Akad digital). Perlu dipastikan aplikasi DApps yang dibangun di atasnya tidak melibatkan skema DeFi berbasis bunga/usury.',
      source: 'Shariah Crypto Advisory Board (Global)'
    },
    DOGE: {
      ticker: 'DOGE',
      name: 'Dogecoin',
      type: 'Kripto',
      isCompliant: false,
      businessScore: 0,
      debtRatio: 0,
      cashRatio: 0,
      description: 'Dogecoin adalah meme-token spekulatif tanpa utilitas dasar yang jelas. Dewan Syariah mengkategorikan Dogecoin sebagai Non-Kompeten (Gharar tinggi / Maisir) karena nilai harganya digerakkan murni oleh spekulasi liar dan tidak memiliki underlying asset atau proyek kegunaan riil.',
      source: 'DSN-MUI Kajian Kripto Spekulatif'
    }
  };

  const handleScreenAsset = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setScreenedAsset(null);

    const cleanQuery = query.trim().toUpperCase();
    if (!cleanQuery) {
      setErrorMessage('Harap masukkan kode ticker emiten atau token kripto!');
      return;
    }

    setIsLoading(true);

    // Simulate 1 second screening delay
    setTimeout(() => {
      setIsLoading(false);
      if (assetDatabase[cleanQuery]) {
        setScreenedAsset(assetDatabase[cleanQuery]);
      } else {
        // Fallback for custom user inputs
        // Simulate compliant check based on random string length to make it interactive
        const isMockCompliant = cleanQuery.length % 2 === 0;
        setScreenedAsset({
          ticker: cleanQuery,
          name: `${cleanQuery} Corp. (Hasil Simulasi Real-Time)`,
          type: cleanQuery.endsWith('USD') ? 'Kripto' : 'Saham',
          isCompliant: isMockCompliant,
          businessScore: isMockCompliant ? 1.4 : 65.0,
          debtRatio: isMockCompliant ? 14.5 : 55.4,
          cashRatio: isMockCompliant ? 8.2 : 46.1,
          description: isMockCompliant 
            ? `Hasil pemindaian otomatis mendeteksi ${cleanQuery} memiliki portofolio bisnis dan neraca keuangan yang memenuhi rasio batas aman DSN-MUI (< 45% utang berbasis riba dan < 5% pendapatan non-halal).`
            : `Hasil pemindaian otomatis mendeteksi adanya rasio utang berbunga melebihi batas 45% atau persentase bisnis utama yang terafiliasi dengan lembaga finansial konvensional, usury, judi, atau sektor non-halal.`,
          source: 'Sharify AI Auto-Scanner (Simulasi)'
        });
      }
    }, 1000);
  };

  const selectSuggested = (ticker: string) => {
    setQuery(ticker);
  };

  return (
    <DashboardContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <Sparkles className="h-8 w-8 text-[#0F4C3A] mr-3 animate-pulse" />
          Halal Asset Screener
        </h1>
        <p className="text-gray-500 mt-1">Audit status syariah emiten saham internasional/lokal dan aset kripto secara instan berdasarkan kriteria DSN-MUI.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Search & Suggestions Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-md font-bold text-gray-900 mb-4">Cari Aset Keuangan</h3>
            
            <form onSubmit={handleScreenAsset} className="space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                <input 
                  type="text" 
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Contoh: GOTO, BBCA, BTC, ETH..." 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold"
                />
              </div>

              {errorMessage && (
                <p className="text-xs text-red-500 font-semibold flex items-center">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                  {errorMessage}
                </p>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memindai Neraca Aset...</span>
                  </div>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-amber-400" />
                    <span>Audit Status Syariah</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Suggested Quick Tickers */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">Ticker Populer</h4>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">Saham Lokal & Internasional</p>
                <div className="flex flex-wrap gap-2">
                  {['GOTO', 'TLKM', 'KLBF', 'BBCA', 'BBRI'].map(ticker => (
                    <button 
                      key={ticker}
                      onClick={() => selectSuggested(ticker)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        query.toUpperCase() === ticker 
                          ? 'bg-[#0F4C3A] text-white border-transparent' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {ticker}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1.5">Aset Kripto</p>
                <div className="flex flex-wrap gap-2">
                  {['BTC', 'ETH', 'DOGE'].map(ticker => (
                    <button 
                      key={ticker}
                      onClick={() => selectSuggested(ticker)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        query.toUpperCase() === ticker 
                          ? 'bg-[#0F4C3A] text-white border-transparent' 
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      {ticker}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Results Layout */}
        <div className="lg:col-span-2 space-y-6">
          
          {isLoading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-4">
              <div className="h-16 w-16 bg-[#0F4C3A]/5 text-[#0F4C3A] rounded-full flex items-center justify-center mx-auto animate-pulse">
                <ShieldCheck className="h-8 w-8 text-amber-500 animate-bounce" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-lg">Melakukan Pemindaian Algoritmik...</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Kami sedang memproses laporan keuangan triwulan emiten dan mencocokkan rasio neraca utang berbasis bunga dengan standar DSN-MUI.</p>
              </div>
              <div className="max-w-md mx-auto space-y-3 pt-4">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-5/6 mx-auto"></div>
                <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2 mx-auto"></div>
              </div>
            </div>
          )}

          {!isLoading && !screenedAsset && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0F4C3A]">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Menunggu Input Audit Ticker</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Silakan pilih ticker rekomendasi di samping atau ketik kode emiten pilihan Anda untuk melakukan audit kepatuhan syariah secara real-time.
              </p>
            </div>
          )}

          {!isLoading && screenedAsset && (
            <div className="space-y-6">
              
              {/* Core compliance result card */}
              <div className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                screenedAsset.isCompliant ? 'border-emerald-500/30' : 'border-red-500/30'
              }`}>
                {/* Result Header Banner */}
                <div className={`px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
                  screenedAsset.isCompliant ? 'bg-emerald-50/40 border-emerald-100' : 'bg-red-50/40 border-red-100'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm ${
                      screenedAsset.isCompliant ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
                    }`}>
                      {screenedAsset.ticker}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-900 text-lg leading-tight">{screenedAsset.name}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Jenis Aset: <span className="font-semibold text-gray-600">{screenedAsset.type}</span></p>
                    </div>
                  </div>

                  <div>
                    {screenedAsset.isCompliant ? (
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-600 to-[#10B981] text-white shadow-sm border border-emerald-500/20">
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> SYARIAH APPROVED
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-black bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm border border-red-500/20 animate-pulse">
                        <XCircle className="w-4 h-4 mr-1.5" /> NON-COMPLIANT
                      </span>
                    )}
                  </div>
                </div>

                {/* Criteria Grid */}
                <div className="p-6">
                  <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-4">Pemeriksaan Syariah DSN-MUI</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Test 1: Business Operations */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                          <span>Aktivitas Bisnis</span>
                          <span title="Batas maksimal pendapatan non-halal adalah 5%">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Pendapatan Non-Halal</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-baseline space-x-1">
                          <span className={`text-2xl font-black ${screenedAsset.businessScore < 5 ? 'text-emerald-600' : 'text-red-600'}`}>{screenedAsset.businessScore}%</span>
                          <span className="text-[10px] text-gray-400">dari total omzet</span>
                        </div>
                        <div className="mt-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${screenedAsset.businessScore < 5 ? 'bg-emerald-600' : 'bg-red-600'}`} style={{ width: `${Math.min(screenedAsset.businessScore * 10, 100)}%` }}></div>
                        </div>
                        <span className="block text-[9px] text-gray-400 mt-1">Ambang batas DSN: ≤ 5%</span>
                      </div>
                    </div>

                    {/* Test 2: Riba Debt Leverage */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                          <span>Leverage Riba</span>
                          <span title="Rasio utang berbunga dibanding total aset maksimal 45%">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Utang Berbunga / Aset</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-baseline space-x-1">
                          <span className={`text-2xl font-black ${screenedAsset.debtRatio < 45 ? 'text-emerald-600' : 'text-red-600'}`}>{screenedAsset.debtRatio}%</span>
                          <span className="text-[10px] text-gray-400">terhadap aset</span>
                        </div>
                        <div className="mt-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${screenedAsset.debtRatio < 45 ? 'bg-emerald-600' : 'bg-red-600'}`} style={{ width: `${Math.min(screenedAsset.debtRatio, 100)}%` }}></div>
                        </div>
                        <span className="block text-[9px] text-gray-400 mt-1">Ambang batas DSN: ≤ 45%</span>
                      </div>
                    </div>

                    {/* Test 3: Riba Receivables */}
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase">
                          <span>Aktivitas Piutang</span>
                          <span title="Piutang berbasis bunga dibanding total aset maksimal 45%">
                            <HelpCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Piutang Berbunga / Aset</p>
                      </div>
                      <div className="mt-4">
                        <div className="flex items-baseline space-x-1">
                          <span className={`text-2xl font-black ${screenedAsset.cashRatio < 45 ? 'text-emerald-600' : 'text-red-600'}`}>{screenedAsset.cashRatio}%</span>
                          <span className="text-[10px] text-gray-400">terhadap aset</span>
                        </div>
                        <div className="mt-2 bg-gray-200 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${screenedAsset.cashRatio < 45 ? 'bg-emerald-600' : 'bg-red-600'}`} style={{ width: `${Math.min(screenedAsset.cashRatio, 100)}%` }}></div>
                        </div>
                        <span className="block text-[9px] text-gray-400 mt-1">Ambang batas DSN: ≤ 45%</span>
                      </div>
                    </div>

                  </div>

                </div>

                {/* Audit opinion */}
                <div className="px-6 pb-6 pt-2">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <h5 className="text-xs font-bold text-gray-700 uppercase flex items-center mb-1">
                      <Scale className="w-3.5 h-3.5 text-[#0F4C3A] mr-1.5" /> Kajian Syariah & Fiqh
                    </h5>
                    <p className="text-xs text-gray-600 leading-relaxed italic">
                      {screenedAsset.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-[10px] text-gray-400 font-semibold border-t border-gray-200/50 pt-2.5">
                      <span>Sumber data: {screenedAsset.source}</span>
                      <span>Penapisan: DSN-MUI Kriteria 2026</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Education section about screening rules */}
              <div className="bg-gradient-to-br from-[#0F4C3A] to-[#0A3427] text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <h4 className="text-md font-bold mb-3 flex items-center">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37] mr-2" /> Cara Kerja Penapisan Saham Syariah
                </h4>
                <p className="text-xs text-emerald-100 leading-relaxed mb-4">
                  Sesuai fatwa Dewan Syariah Nasional MUI No. 80, saham dikategorikan halal jika lolos dua kriteria utama:
                </p>
                
                <ul className="space-y-2.5 text-xs text-emerald-100">
                  <li className="flex items-start">
                    <span className="h-5 w-5 bg-white/10 rounded-md text-amber-400 font-extrabold flex items-center justify-center mr-2.5 flex-shrink-0 text-[10px]">1</span>
                    <div>
                      <strong className="text-white">Penyaringan Bisnis (Core Business)</strong>
                      <p className="text-[11px] text-emerald-200 mt-0.5">Emiten tidak boleh memproduksi barang non-halal, jasa bunga ribawi, judi, atau hiburan maksiat.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="h-5 w-5 bg-white/10 rounded-md text-amber-400 font-extrabold flex items-center justify-center mr-2.5 flex-shrink-0 text-[10px]">2</span>
                    <div>
                      <strong className="text-white">Penyaringan Finansial (Financial Ratio Limit)</strong>
                      <p className="text-[11px] text-emerald-200 mt-0.5">Rasio total utang berbunga dibagi total aset harus ≤ 45%, dan rasio pendapatan bunga (riba) dibanding total pendapatan ≤ 5%.</p>
                    </div>
                  </li>
                </ul>
              </div>

            </div>
          )}

        </div>

      </div>
    </DashboardContainer>
  );
};
