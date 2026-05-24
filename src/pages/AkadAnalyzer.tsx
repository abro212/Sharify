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
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <FileText className="h-8 w-8 text-[#0F4C3A] mr-3" />
          Smart Akad Analyzer
        </h1>
        <p className="text-gray-500 mt-1">Audit kontrak pembiayaan, KPR, atau pinjaman secara otomatis untuk memastikan bebas dari klausul Riba, Gharar, dan kedzaliman finansial.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Contract Input Area (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Input Dokumen Akad</h3>
              <span className="text-xs text-gray-400 font-mono">Batas: 5.000 kata</span>
            </div>

            {/* Quick Template Selector */}
            <div className="mb-4">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Pilih Templat Uji Coba Cepat:</p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => handleSelectTemplate('kprKonvensional')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-100 transition-colors flex items-center justify-between"
                >
                  <span>1. KPR Konvensional (Bunga Majemuk)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleSelectTemplate('kontrakKerja')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-100 transition-colors flex items-center justify-between"
                >
                  <span>2. Pinjaman Karyawan (Pinalti Sepihak)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleSelectTemplate('murabahahSyariah')}
                  className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-100 transition-colors flex items-center justify-between"
                >
                  <span>3. Akad Murabahah (Halal Compliant)</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Text Editor */}
            <form onSubmit={handleAnalyze} className="space-y-4">
              <textarea 
                required
                rows={12}
                value={contractText}
                onChange={e => setContractText(e.target.value)}
                placeholder="Tempel klausul kontrak pembiayaan di sini (atau klik salah satu templat uji coba di atas)..."
                className="w-full p-4 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-mono leading-relaxed"
              />

              <button 
                type="submit"
                disabled={isAnalyzing || !contractText.trim()}
                className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <span>Menganalisis Akad...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Mulai Analisis Akad</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Audit Report (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          
          {isAnalyzing && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-6">
              
              {/* Spinning progress dial */}
              <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                <RefreshCw className="h-16 w-16 text-[#0F4C3A] animate-spin" />
                <span className="absolute text-sm font-black text-gray-800">{progress}%</span>
              </div>

              <div>
                <h3 className="font-extrabold text-gray-900 text-lg">Menjalankan Audit Akad Syariah...</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1.5 animate-pulse">
                  {analysisStep || 'Menginisialisasi analisis Fiqh Muamalah...'}
                </p>
              </div>

              {/* Progress Bar */}
              <div className="max-w-md mx-auto bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#0F4C3A] to-[#D4AF37] h-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}

          {!isAnalyzing && !report && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <div className="h-16 w-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#D4AF37]">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Menunggu Analisis Kontrak</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Silakan tempel teks akad di sebelah kiri atau klik templat uji coba, lalu tekan "Mulai Analisis Akad" untuk mengaktifkan audit kepatuhan Fiqh Muamalah.
              </p>
            </div>
          )}

          {!isAnalyzing && report && (
            <div className="space-y-6">
              
              {/* Compliance Rating Card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center font-extrabold text-gray-900 shadow-inner">
                    <Scale className="w-8 h-8 text-[#0F4C3A]" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg">Skor Kepatuhan Akad Syariah</h3>
                    <p className="text-xs text-gray-400 mt-1">Diaudit secara otomatis menggunakan standar Fiqh Kontemporer.</p>
                  </div>
                </div>

                <div className="text-center sm:text-right">
                  <div className="text-4xl font-black font-mono text-[#0F4C3A]">
                    {report.score} <span className="text-sm font-normal text-gray-400">/ 100</span>
                  </div>
                  <div className="mt-1">
                    {report.status === 'Lolos Kepatuhan' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> 100% SYARIAH COMPLIANT
                      </span>
                    ) : report.status === 'Gagal Kepatuhan' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200 animate-pulse">
                        <AlertOctagon className="w-3 h-3 mr-1" /> REKOMENDASI REVISI (Tinggi Riba)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        <ShieldAlert className="w-3 h-3 mr-1" /> REKOMENDASI REVISI SEDANG
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Findings Audit Cards */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Hasil Audit Klausul</h4>

                {report.findings.map((finding, idx) => (
                  <div key={idx} className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                    finding.type === 'Riba' 
                      ? 'border-red-500/30' 
                      : finding.type === 'Gharar' 
                      ? 'border-amber-500/30' 
                      : 'border-emerald-500/30'
                  }`}>
                    {/* Finding Header */}
                    <div className={`px-5 py-4 border-b flex items-center justify-between ${
                      finding.type === 'Riba' 
                        ? 'bg-red-50/40 border-red-100' 
                        : finding.type === 'Gharar' 
                        ? 'bg-amber-50/40 border-amber-100' 
                        : 'bg-emerald-50/40 border-emerald-100'
                    }`}>
                      <div className="flex items-center space-x-2">
                        {finding.type === 'Riba' ? (
                          <ShieldAlert className="w-5 h-5 text-red-600 animate-bounce" />
                        ) : finding.type === 'Gharar' ? (
                          <AlertOctagon className="w-5 h-5 text-amber-600" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        )}
                        <h4 className="text-sm font-extrabold text-gray-800">{finding.clauseName}</h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        finding.type === 'Riba' 
                          ? 'bg-red-100 text-red-800' 
                          : finding.type === 'Gharar' 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {finding.type}
                      </span>
                    </div>

                    {/* Finding Content */}
                    <div className="p-5 space-y-4">
                      
                      {/* Highlighted text segment */}
                      <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100 text-xs font-mono text-gray-600 italic">
                        "{finding.foundText}"
                      </div>

                      {/* Explanation */}
                      <div>
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Analisis Fiqh</span>
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">{finding.explanation}</p>
                      </div>

                      {/* Alternative */}
                      <div className="bg-emerald-50/30 p-3.5 rounded-xl border border-emerald-100/40 space-y-1">
                        <span className="block text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center">
                          <BookOpen className="w-3.5 h-3.5 mr-1" /> Rekomendasi Solusi Halal
                        </span>
                        <div className="text-xs text-emerald-800 leading-relaxed flex items-start">
                          <CornerDownRight className="w-3.5 h-3.5 mr-1.5 mt-0.5 flex-shrink-0 text-emerald-600" />
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
    </DashboardContainer>
  );
};
