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
      <div className="p-5 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Investasi Halal</h1>
            <p className="text-xs text-slate-500 font-medium">Screen and discover halal investments</p>
          </div>
        </div>

        {/* Deep Emerald Header Card matching Screen 5 */}
        <div className="bg-[#064E3B] text-white p-6 rounded-3xl relative overflow-hidden shadow-lg shadow-emerald-950/20 flex items-center justify-between">
          <div className="relative z-10 max-w-[70%] space-y-1.5">
            <h2 className="text-base font-extrabold text-white leading-tight">
              Halal Investment Opportunities
            </h2>
            <p className="text-xs text-emerald-100/90 font-medium">
              Invest with confidence and Islamic principles
            </p>
            <button
              onClick={() => alert('Fitur pencarian instrumen halal dibuka!')}
              className="mt-1 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold px-3.5 py-1.5 rounded-xl shadow-md transition-all inline-flex items-center"
            >
              Find Opportunities
            </button>
          </div>
          
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 text-amber-300">
            <Sparkles className="w-8 h-8" />
          </div>
        </div>

        {/* Top Categories Pills */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Top Categories</span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">View All</span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto py-1 no-scrollbar">
            {['Sukuk', 'Halal Stocks', 'Reksa Dana Syariah', 'Gold'].map((cat, idx) => (
              <button
                key={idx}
                className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 shadow-xs hover:border-emerald-500 shrink-0 transition-all"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Overview Card */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Portfolio Overview</span>
              <p className="text-xs font-semibold text-slate-500">Total Value</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
              +8.45%
            </span>
          </div>

          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            Rp 125.000.000 <span className="text-xs font-normal text-slate-400">vs last month</span>
          </p>
        </div>

        {/* Ticker Search & Audit */}
        <div className="bg-white dark:bg-slate-800/90 p-5 rounded-3xl shadow-[0_2px_16px_rgba(0,0,0,0.04)] border border-slate-100 dark:border-slate-700/60 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Audit Ticker Emiten</h3>
          
          <form onSubmit={handleScreenAsset} className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search ticker (GOTO, TLKM, BTC)..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {errorMessage && (
              <p className="text-xs text-rose-500 font-bold flex items-center bg-rose-50 dark:bg-rose-900/20 p-2.5 rounded-xl">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {errorMessage}
              </p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#064E3B] hover:bg-[#043E2F] text-white font-extrabold text-xs py-3 rounded-2xl transition-all shadow-md flex items-center justify-center space-x-1.5"
            >
              {isLoading ? (
                <span>Memindai...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-300" />
                  <span>Audit Status Syariah</span>
                </>
              )}
            </button>
          </form>
        </div>

            {/* Suggested Quick Tickers */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Ticker Populer</h4>
              
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Saham Lokal & Internasional</p>
                  <div className="flex flex-wrap gap-2">
                    {['GOTO', 'TLKM', 'KLBF', 'BBCA', 'BBRI'].map(ticker => (
                      <button 
                        key={ticker}
                        onClick={() => selectSuggested(ticker)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          query.toUpperCase() === ticker 
                            ? 'bg-emerald-600 text-white border-transparent shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {ticker}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">Aset Kripto</p>
                  <div className="flex flex-wrap gap-2">
                    {['BTC', 'ETH', 'DOGE'].map(ticker => (
                      <button 
                        key={ticker}
                        onClick={() => selectSuggested(ticker)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                          query.toUpperCase() === ticker 
                            ? 'bg-emerald-600 text-white border-transparent shadow-sm' 
                            : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {ticker}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

          {/* Bottom Column: Dynamic Results Layout */}
          <div className="space-y-6">
            
            {isLoading && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <ShieldCheck className="h-8 w-8 text-emerald-500 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Melakukan Pemindaian Algoritmik...</h3>
                  <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">Kami sedang memproses laporan keuangan triwulan emiten dan mencocokkan rasio neraca utang berbasis bunga dengan standar DSN-MUI.</p>
                </div>
                <div className="max-w-md mx-auto space-y-3 pt-4">
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse w-3/4 mx-auto"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse w-5/6 mx-auto"></div>
                  <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full animate-pulse w-1/2 mx-auto"></div>
                </div>
              </div>
            )}

            {!isLoading && !screenedAsset && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-12 text-center">
                <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                  <Search className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Menunggu Input Ticker</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Silakan pilih ticker di atas atau ketik kode emiten untuk memindai kepatuhan syariah secara otomatis.
                </p>
              </div>
          )}

            {!isLoading && screenedAsset && (
              <div className="space-y-6">
                
                {/* Core compliance result card */}
                <div className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-[0_2px_20px_rgb(0,0,0,0.04)] overflow-hidden transition-all ${
                  screenedAsset.isCompliant ? 'border-emerald-500/30 dark:border-emerald-500/20' : 'border-rose-500/30 dark:border-rose-500/20'
                }`}>
                  {/* Result Header Banner */}
                  <div className={`px-6 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b ${
                    screenedAsset.isCompliant ? 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30' : 'bg-rose-50/40 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30'
                  }`}>
                    <div className="flex items-center space-x-4">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-md ${
                        screenedAsset.isCompliant ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {screenedAsset.ticker}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-900 dark:text-white text-lg leading-tight">{screenedAsset.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-medium">Jenis Aset: <span className="font-bold text-slate-600 dark:text-slate-300">{screenedAsset.type}</span></p>
                      </div>
                    </div>

                    <div>
                      {screenedAsset.isCompliant ? (
                        <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-sm shadow-emerald-500/20">
                          <CheckCircle2 className="w-4 h-4 mr-2" /> SYARIAH APPROVED
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm shadow-rose-500/20 animate-pulse">
                          <XCircle className="w-4 h-4 mr-2" /> NON-COMPLIANT
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Criteria Grid */}
                  <div className="p-6">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-5">Pemeriksaan Syariah DSN-MUI</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      
                      {/* Test 1: Business Operations */}
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <span>Aktivitas Bisnis</span>
                            <span title="Batas maksimal pendapatan non-halal adalah 5%">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Pendapatan Non-Halal</p>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-baseline space-x-1">
                            <span className={`text-3xl font-black ${screenedAsset.businessScore < 5 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{screenedAsset.businessScore}%</span>
                            <span className="text-[10px] text-slate-400 font-medium">/ total omzet</span>
                          </div>
                          <div className="mt-3 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${screenedAsset.businessScore < 5 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(screenedAsset.businessScore * 10, 100)}%` }}></div>
                          </div>
                          <span className="block text-[10px] font-medium text-slate-400 mt-2">Ambang batas DSN: ≤ 5%</span>
                        </div>
                      </div>

                      {/* Test 2: Riba Debt Leverage */}
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <span>Leverage Riba</span>
                            <span title="Rasio utang berbunga dibanding total aset maksimal 45%">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Utang Berbunga / Aset</p>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-baseline space-x-1">
                            <span className={`text-3xl font-black ${screenedAsset.debtRatio < 45 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{screenedAsset.debtRatio}%</span>
                            <span className="text-[10px] text-slate-400 font-medium">/ aset</span>
                          </div>
                          <div className="mt-3 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${screenedAsset.debtRatio < 45 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(screenedAsset.debtRatio, 100)}%` }}></div>
                          </div>
                          <span className="block text-[10px] font-medium text-slate-400 mt-2">Ambang batas DSN: ≤ 45%</span>
                        </div>
                      </div>

                      {/* Test 3: Riba Receivables */}
                      <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase mb-1">
                            <span>Aktivitas Piutang</span>
                            <span title="Piutang berbasis bunga dibanding total aset maksimal 45%">
                              <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                            </span>
                          </div>
                          <p className="text-xs font-bold text-slate-600 dark:text-slate-300">Piutang Berbunga / Aset</p>
                        </div>
                        <div className="mt-4">
                          <div className="flex items-baseline space-x-1">
                            <span className={`text-3xl font-black ${screenedAsset.cashRatio < 45 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>{screenedAsset.cashRatio}%</span>
                            <span className="text-[10px] text-slate-400 font-medium">/ aset</span>
                          </div>
                          <div className="mt-3 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-1000 ${screenedAsset.cashRatio < 45 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${Math.min(screenedAsset.cashRatio, 100)}%` }}></div>
                          </div>
                          <span className="block text-[10px] font-medium text-slate-400 mt-2">Ambang batas DSN: ≤ 45%</span>
                        </div>
                      </div>

                    </div>

                  </div>

                  {/* Audit opinion */}
                  <div className="px-6 pb-6">
                    <div className="bg-slate-50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                      <h5 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase flex items-center mb-2">
                        <Scale className="w-4 h-4 text-emerald-600 mr-2" /> Kajian Syariah & Fiqh
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                        {screenedAsset.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2 items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider border-t border-slate-200/50 dark:border-slate-700/50 pt-3">
                        <span>Sumber: {screenedAsset.source}</span>
                        <span>Penapisan: DSN-MUI 2026</span>
                      </div>
                    </div>
                  </div>

              </div>

                {/* Education section about screening rules */}
                <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-3xl p-8 shadow-lg shadow-emerald-500/20 relative overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>
                  
                  <div className="relative z-10">
                    <h4 className="text-lg font-extrabold mb-4 flex items-center">
                      <ShieldCheck className="w-6 h-6 text-amber-300 mr-2" /> Cara Kerja Penapisan
                    </h4>
                    <p className="text-xs text-emerald-50 font-medium leading-relaxed mb-6">
                      Sesuai fatwa Dewan Syariah Nasional MUI No. 80, saham dikategorikan halal jika lolos dua kriteria utama:
                    </p>
                    
                    <ul className="space-y-4 text-xs text-emerald-100">
                      <li className="flex items-start">
                        <span className="h-6 w-6 bg-white/20 rounded-lg text-amber-300 font-extrabold flex items-center justify-center mr-3 flex-shrink-0 text-[11px] mt-0.5">1</span>
                        <div>
                          <strong className="text-white text-sm">Penyaringan Bisnis</strong>
                          <p className="text-xs text-emerald-100/80 mt-1 font-medium leading-relaxed">Emiten tidak boleh memproduksi barang non-halal, jasa bunga ribawi, judi, atau hiburan maksiat.</p>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="h-6 w-6 bg-white/20 rounded-lg text-amber-300 font-extrabold flex items-center justify-center mr-3 flex-shrink-0 text-[11px] mt-0.5">2</span>
                        <div>
                          <strong className="text-white text-sm">Penyaringan Finansial</strong>
                          <p className="text-xs text-emerald-100/80 mt-1 font-medium leading-relaxed">Rasio total utang berbunga dibagi aset ≤ 45%, dan rasio pendapatan bunga (riba) dibanding total pendapatan ≤ 5%.</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>
    </DashboardContainer>
  );
};
