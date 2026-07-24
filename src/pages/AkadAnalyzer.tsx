import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { 
  FileText, ShieldAlert, Sparkles, Scale, 
  RefreshCw, CheckCircle2, ChevronRight, CornerDownRight, BookOpen, AlertOctagon 
} from 'lucide-react';

interface AuditFinding {
  type: 'Riba' | 'Gharar' | 'Compliant' | 'Warning';
  clauseName: string;
  foundText: string;
  explanation: string;
  alternative: string;
}

export const AkadAnalyzer: React.FC = () => {
  const [contractText, setContractText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysisStep, setAnalysisStep] = useState('');
  const [report, setReport] = useState<{
    status: 'Gagal Kepatuhan' | 'Lolos Kepatuhan' | 'Menengah';
    score: number;
    findings: AuditFinding[];
  } | null>(null);

  // Mock Templates to fill in the contract text
  const templates = {
    kprKonvensional: `KLAUSUL PEMBIAYAAN KPR SEBANYAK 120 BULAN:
Pasal 5 (Suku Bunga & Pembiayaan):
Pihak Kedua sepakat membayar angsuran bulanan tetap untuk 2 tahun pertama dengan suku bunga 8.5% p.a. Setelah tahun kedua selesai, suku bunga akan bersifat mengambang (floating) berdasarkan pergerakan BI-Rate ditambah margin bank sebesar 4.5% yang ditentukan sepihak oleh Pihak Kesatu.

Pasal 9 (Sanksi & Keterlambatan):
Apabila Pihak Kedua lalai dalam melakukan pembayaran angsuran bulanan melewati tanggal jatuh tempo, maka dikenakan denda keterlambatan sebesar 0.1% per hari dari jumlah angsuran tertunggak, dihitung secara akumulatif harian dan berbunga (majemuk) hingga seluruh tunggakan dilunasi secara penuh.`,

    kontrakKerja: `KLAUSUL PERJANJIAN PINJAMAN KARYAWAN:
Pasal 3 (Skema Pengembalian Dana):
Perusahaan memfasilitasi pinjaman darurat karyawan sebesar Rp 15.000.000. Pengembalian dilakukan melalui potong gaji bulanan dengan bunga flat sebesar 1.5% per bulan selama 12 bulan.

Pasal 7 (Pelunasan Dipercepat & Pinalti):
Jika karyawan melakukan pengunduran diri (resign) sebelum jangka waktu pinjaman berakhir, maka karyawan diwajibkan melunasi sisa pokok pinjaman ditambah pinalti administrasi sebesar 10% dari sisa pinjaman ditambah kompensasi kehilangan bunga di masa depan yang dihitung sepihak oleh Divisi Keuangan.`,

    murabahahSyariah: `AKAD MURABAHAH (PEMBELIAN RUMAH SHARIFY):
Pasal 3 (Harga Jual & Margin Keuntungan):
Pihak Kesatu menjual rumah kepada Pihak Kedua seharga Rp 500.000.000 (Harga Perolehan Rp 400.000.000 ditambah Margin Keuntungan Keuntungan Pihak Kesatu Rp 100.000.000) yang bersifat tetap dan tidak akan berubah sepanjang masa angsuran 10 tahun.

Pasal 8 (Ta'zir & Ganti Rugi):
Jika Pihak Kedua terlambat melakukan pembayaran angsuran bulanan karena kelalaian (bukan kesulitan keuangan riil), maka dikenakan biaya administrasi (Ta'zir) tetap sebesar Rp 100.000 per bulan. Seluruh dana ta'zir ini akan disalurkan oleh Pihak Kesatu ke lembaga sosial/amal Baitul Mal dan tidak diakui sebagai pendapatan operasional bank.`
  };

  const handleSelectTemplate = (type: keyof typeof templates) => {
    setContractText(templates[type]);
    setReport(null);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractText.trim()) return;

    setIsAnalyzing(true);
    setProgress(0);
    setReport(null);

    // Dynamic scanning animation
    const steps = [
      'Memindai dokumen & mendeteksi struktur kalimat...',
      'Mencari kata kunci Riba (bunga, floating, majemuk)...',
      'Mengevaluasi klausul denda akumulatif (Gharamah vs Ta\'zir)...',
      'Memeriksa tingkat ketidakpastian (Gharar & Jahalah)...',
      'Mencocokkan klausul dengan standar fatwa DSN-MUI...',
      'Menyusun rekomendasi alternatif syariah...'
    ];

    let currentStepIndex = 0;
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsAnalyzing(false);
            generateReport();
          }, 400);
          return 100;
        }

        // Advance steps periodically
        const nextProgress = prev + 5;
        const stepTrigger = Math.floor((nextProgress / 100) * steps.length);
        if (stepTrigger < steps.length && stepTrigger > currentStepIndex) {
          currentStepIndex = stepTrigger;
          setAnalysisStep(steps[currentStepIndex]);
        }
        return nextProgress;
      });
    }, 80);
  };

  // Generate simulated Sharia Audit Report based on input text
  const generateReport = () => {
    const text = contractText.toLowerCase();

    let score = 95;
    let status: 'Gagal Kepatuhan' | 'Lolos Kepatuhan' | 'Menengah' = 'Lolos Kepatuhan';
    const findings: AuditFinding[] = [];

    // Look for Riba clauses (floating rates / compound denda)
    if (text.includes('floating') || text.includes('mengambang') || text.includes('bunga')) {
      score -= 35;
      findings.push({
        type: 'Riba',
        clauseName: 'Suku Bunga Mengambang (Floating Interest)',
        foundText: contractText.match(/suku bunga akan bersifat mengambang.*sepihak oleh Pihak Kesatu/i)?.[0] || 'Suku bunga bersifat mengambang (floating) berdasarkan pergerakan pasar.',
        explanation: 'Klausul suku bunga mengambang konvensional menetapkan harga utang secara tidak menentu (Jahalah). Ini memicu ketidakpastian ekstrem (Gharar) dan menghasilkan pembayaran bunga berlebih yang merupakan Riba Fadhl.',
        alternative: 'Gunakan Akad Murabahah (Jual Beli dengan harga jual tetap sepanjang cicilan) atau Akad IMBT dengan batas atas (cap) margin keuntungan yang disepakati bersama sejak awal.'
      });
    }

    if (text.includes('berbunga') || text.includes('majemuk') || text.includes('denda keterlambatan sebesar 0.1%')) {
      score -= 30;
      findings.push({
        type: 'Riba',
        clauseName: 'Denda Akumulatif & Bunga Berbunga (Gharamah/Usury)',
        foundText: contractText.match(/denda keterlambatan sebesar 0.1%.*dilunasi secara penuh/i)?.[0] || 'Denda keterlambatan harian secara akumulatif dan berbunga.',
        explanation: 'Denda keterlambatan yang berlipat ganda dan diakui sebagai keuntungan kreditur dikategorikan sebagai Riba Jahiliyyah. Hal ini sangat dilarang karena meraup untung dari kesulitan debitur.',
        alternative: 'Terapkan klausul Ta\'zir (denda tetap bernilai kecil) untuk memberi efek jera, dengan syarat seluruh denda tersebut WAJIB dialokasikan ke dana sosial/amal Baitul Mal, bukan keuntungan bank.'
      });
    }

    // Look for Gharar / compensation clauses
    if (text.includes('sepihak') || text.includes('pinalti') || text.includes('kehilangan bunga')) {
      score -= 20;
      findings.push({
        type: 'Gharar',
        clauseName: 'Pinalti Pelunasan & Kompensasi Bunga Sepihak',
        foundText: contractText.match(/pinalti administrasi sebesar 10%.*divisi keuangan/i)?.[0] || 'Kompensasi kehilangan bunga masa depan yang dihitung sepihak.',
        explanation: 'Adanya klausul kompensasi keuntungan bunga masa depan dan denda sepihak melanggar rukun akad yang harus transparan (tidak boleh ada penindasan sepihak). Pinalti yang tidak proporsional memicu ketidakadilan.',
        alternative: 'Dalam Syariah, pelunasan dipercepat diperbolehkan mendapatkan diskon (potongan margin) tanpa adanya pinalti yang bersifat memberatkan. Biaya administrasi pelunasan dipercepat harus mencerminkan biaya riil.'
      });
    }

    // Standard compliant check
    if (findings.length === 0) {
      status = 'Lolos Kepatuhan';
      findings.push({
        type: 'Compliant',
        clauseName: 'Akad Murabahah Bebas Riba',
        foundText: 'Harga Jual Rp 500.000.000... bersifat tetap dan tidak akan berubah sepanjang masa angsuran.',
        explanation: 'Harga jual akad murabahah telah disepakati di awal (fix margin) dan denda ta\'zir disalurkan ke Baitul Mal sosial. Struktur ini 100% compliant sesuai standar DSN-MUI.',
        alternative: 'Pertahankan format kontrak ini untuk pembiayaan aset di masa depan.'
      });
    } else if (score < 50) {
      status = 'Gagal Kepatuhan';
    } else {
      status = 'Menengah';
    }

    setReport({ status, score, findings });
  };

  return (
    <DashboardContainer>
      <div className="px-6 pt-12 pb-6">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 flex items-center mb-2">
            <FileText className="h-6 w-6 text-emerald-600 mr-2" />
            Smart Akad Analyzer
          </h1>
          <p className="text-sm text-slate-500">Audit kontrak pembiayaan, KPR, atau pinjaman secara otomatis untuk memastikan bebas dari klausul Riba, Gharar, dan kedzaliman finansial.</p>
        </div>

        <div className="flex flex-col gap-6">
          
          {/* Top: Contract Input Area */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Input Dokumen Akad</h3>
                <span className="text-[10px] text-slate-400 font-mono">Batas: 5.000 kata</span>
              </div>

              {/* Quick Template Selector */}
              <div className="mb-5">
                <p className="text-[10px] text-slate-400 font-bold uppercase mb-2.5">Pilih Templat Uji Coba Cepat:</p>
                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => handleSelectTemplate('kprKonvensional')}
                    className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold bg-rose-50 dark:bg-rose-900/20 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-800/30 transition-colors flex items-center justify-between"
                  >
                    <span>1. KPR Konvensional (Bunga Majemuk)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSelectTemplate('kontrakKerja')}
                    className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-800/30 transition-colors flex items-center justify-between"
                  >
                    <span>2. Pinjaman Karyawan (Pinalti Sepihak)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleSelectTemplate('murabahahSyariah')}
                    className="w-full text-left px-4 py-3 rounded-2xl text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/30 transition-colors flex items-center justify-between"
                  >
                    <span>3. Akad Murabahah (Halal Compliant)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Text Editor */}
              <form onSubmit={handleAnalyze} className="space-y-4">
                <textarea 
                  required
                  rows={10}
                  value={contractText}
                  onChange={e => setContractText(e.target.value)}
                  placeholder="Tempel klausul kontrak pembiayaan di sini (atau klik salah satu templat uji coba di atas)..."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 font-mono leading-relaxed resize-none"
                />

                <button 
                  type="submit"
                  disabled={isAnalyzing || !contractText.trim()}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menganalisis...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>Mulai Analisis Akad</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Column: Audit Report */}
          <div className="space-y-6">
          
            {isAnalyzing && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-8 text-center space-y-6">
                
                {/* Spinning progress dial */}
                <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                  <RefreshCw className="h-16 w-16 text-emerald-500 animate-spin" />
                  <span className="absolute text-sm font-black text-slate-800 dark:text-white">{progress}%</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Menjalankan Audit Akad Syariah...</h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2 animate-pulse leading-relaxed">
                    {analysisStep || 'Menginisialisasi analisis Fiqh Muamalah...'}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            )}

            {!isAnalyzing && !report && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-12 text-center">
                <div className="h-16 w-16 bg-amber-50 dark:bg-amber-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Menunggu Analisis Kontrak</h3>
                <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto leading-relaxed">
                  Silakan tempel teks akad di sebelah kiri atau klik templat uji coba, lalu tekan "Mulai Analisis Akad" untuk mengaktifkan audit kepatuhan Fiqh Muamalah.
                </p>
              </div>
            )}

            {!isAnalyzing && report && (
              <div className="space-y-6">
                
                {/* Compliance Rating Card */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-[0_2px_20px_rgb(0,0,0,0.04)] p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 flex items-center justify-center shadow-inner">
                      <Scale className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 dark:text-white text-lg">Skor Kepatuhan Akad</h3>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Diaudit secara otomatis dengan standar Fiqh Kontemporer.</p>
                    </div>
                  </div>

                  <div className="text-center sm:text-right">
                    <div className="text-4xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                      {report.score} <span className="text-sm font-bold text-slate-400">/ 100</span>
                    </div>
                    <div className="mt-2">
                      {report.status === 'Lolos Kepatuhan' ? (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 100% SYARIAH COMPLIANT
                        </span>
                      ) : report.status === 'Gagal Kepatuhan' ? (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50 animate-pulse">
                          <AlertOctagon className="w-3.5 h-3.5 mr-1.5" /> REKOMENDASI REVISI (Tinggi Riba)
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50">
                          <ShieldAlert className="w-3.5 h-3.5 mr-1.5" /> REKOMENDASI REVISI SEDANG
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Findings Audit Cards */}
                <div className="space-y-5">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hasil Audit Klausul</h4>

                  {report.findings.map((finding, idx) => (
                    <div key={idx} className={`bg-white dark:bg-slate-900 rounded-3xl border shadow-[0_2px_20px_rgb(0,0,0,0.04)] overflow-hidden transition-all ${
                      finding.type === 'Riba' 
                        ? 'border-rose-500/30 dark:border-rose-500/20' 
                        : finding.type === 'Gharar' 
                        ? 'border-amber-500/30 dark:border-amber-500/20' 
                        : 'border-emerald-500/30 dark:border-emerald-500/20'
                    }`}>
                      {/* Finding Header */}
                      <div className={`px-6 py-5 border-b flex items-center justify-between ${
                        finding.type === 'Riba' 
                          ? 'bg-rose-50/40 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30' 
                          : finding.type === 'Gharar' 
                          ? 'bg-amber-50/40 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30' 
                          : 'bg-emerald-50/40 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30'
                      }`}>
                        <div className="flex items-center space-x-3">
                          {finding.type === 'Riba' ? (
                            <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" />
                          ) : finding.type === 'Gharar' ? (
                            <AlertOctagon className="w-5 h-5 text-amber-500" />
                          ) : (
                            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                          )}
                          <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{finding.clauseName}</h4>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-lg tracking-wider uppercase ${
                          finding.type === 'Riba' 
                            ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-800 dark:text-rose-400' 
                            : finding.type === 'Gharar' 
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400' 
                            : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400'
                        }`}>
                          {finding.type}
                        </span>
                      </div>

                      {/* Finding Content */}
                      <div className="p-6 space-y-5">
                        
                        {/* Highlighted text segment */}
                        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 italic leading-relaxed">
                          "{finding.foundText}"
                        </div>

                        {/* Explanation */}
                        <div>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Analisis Fiqh</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{finding.explanation}</p>
                        </div>

                        {/* Alternative */}
                        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 space-y-2">
                          <span className="block text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center">
                            <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Rekomendasi Solusi Halal
                          </span>
                          <div className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed font-medium flex items-start">
                            <CornerDownRight className="w-3.5 h-3.5 mr-2 mt-0.5 flex-shrink-0 text-emerald-600 dark:text-emerald-500" />
                            <p>{finding.alternative}</p>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>

        </div>
      </div>
    </DashboardContainer>
  );
};
