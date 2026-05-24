import React, { useState, useEffect } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { 
  FileText, Download, Sparkles, Scale, 
  Printer, X, BookOpen, CheckCircle2 
} from 'lucide-react';



export const ZakatTaxReport: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [totalZakat, setTotalZakat] = useState(0);
  const [isLoadingZakat, setIsLoadingZakat] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Simulation inputs
  const [grossIncome, setGrossIncome] = useState(150000000); // Default Rp 150.000.000 / year
  const [customZakat, setCustomZakat] = useState('');
  const [npwp, setNpwp] = useState('31.234.567.8-012.000');

  // PTKP threshold (Standard Single TK/0 is Rp 54.000.000)
  const ptkp = 54000000;

  // Fetch Zakat Obligation sum from zakat_history table in Supabase
  useEffect(() => {
    const fetchZakatHistory = async () => {
      if (!user) return;
      setIsLoadingZakat(true);
      try {
        const { data, error } = await supabase
          .from('zakat_history')
          .select('zakat_obligation');

        if (!error && data) {
          const sum = data.reduce((total, record) => total + Number(record.zakat_obligation), 0);
          setTotalZakat(sum);
        } else if (error) {
          console.error('Error fetching zakat history:', error.message);
        }
      } catch (err) {
        console.error('Unexpected error fetching zakat history:', err);
      } finally {
        setIsLoadingZakat(false);
      }
    };

    fetchZakatHistory();
  }, [user]);

  // Determine actual zakat to use in simulation (user can override with custom amount)
  const activeZakat = customZakat !== '' ? Number(customZakat) : totalZakat || 3750000; // Default fallback to Rp 3.75M if 0

  // Progressive PPh pasal 21 (HPP Law 2022 onwards)
  const calculatePPh21 = (pkp: number) => {
    if (pkp <= 0) return 0;
    
    let tax = 0;
    
    // Bracket 1: 5% (up to 60m)
    if (pkp <= 60000000) {
      tax += pkp * 0.05;
      return tax;
    } else {
      tax += 60000000 * 0.05;
    }

    // Bracket 2: 15% (60m s.d 250m)
    if (pkp <= 250000000) {
      tax += (pkp - 60000000) * 0.15;
      return tax;
    } else {
      tax += (250000000 - 60000000) * 0.15;
    }

    // Bracket 3: 25% (250m s.d 500m)
    if (pkp <= 500000000) {
      tax += (pkp - 250000000) * 0.25;
      return tax;
    } else {
      tax += (500000000 - 250000000) * 0.25;
    }

    // Bracket 4: 30% (500m s.d 5miliar)
    if (pkp <= 5000000000) {
      tax += (pkp - 500000000) * 0.30;
      return tax;
    } else {
      tax += (5000000000 - 500000000) * 0.30;
    }

    // Bracket 5: 35% (Above 5miliar)
    tax += (pkp - 5000000000) * 0.35;
    return tax;
  };

  // Tax Engine Calculations
  const pkpBeforeZakat = Math.max(0, grossIncome - ptkp);
  const pkpAfterZakat = Math.max(0, pkpBeforeZakat - activeZakat);

  const initialTax = calculatePPh21(pkpBeforeZakat);
  const reducedTax = calculatePPh21(pkpAfterZakat);
  const taxSavings = initialTax - reducedTax;
  
  // Calculate average tax rate for user reference
  const averageTaxRate = pkpBeforeZakat > 0 ? (initialTax / pkpBeforeZakat) * 100 : 0;

  // Handle generating document preview
  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // Simulate 1.2 second loading spinner
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreviewModal(true);
    }, 1200);
  };

  const handleDownloadPDF = () => {
    alert('Simulasi PDF berhasil di-download! File rekap resmi siap dilampirkan pada e-Filing SPT Tahunan Direktorat Jenderal Pajak RI.');
    setShowPreviewModal(false);
  };

  return (
    <DashboardContainer>
      
      {/* 1. Legal Basis Banner */}
      <div className="bg-gradient-to-r from-[#0F4C3A] via-[#0D5C45] to-[#D4AF37]/80 text-white rounded-2xl p-5 mb-8 shadow-sm border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        <div className="flex items-start space-x-3.5 relative z-10">
          <BookOpen className="w-6 h-6 text-amber-300 mt-0.5 flex-shrink-0 animate-pulse" />
          <div>
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">Payung Hukum Kebijakan Zakat Pengurang SPT</h3>
            <p className="text-xs text-emerald-100 leading-relaxed mt-1">
              Berdasarkan <strong>Undang-Undang Republik Indonesia No. 23 Tahun 2011 Pasal 22</strong> & <strong>PP No. 60 Tahun 2010</strong>, Zakat yang dibayarkan oleh wajib pajak dalam negeri melalui badan/lembaga amil zakat resmi (seperti BAZNAS atau LAZ terakreditasi) dapat diakui secara sah sebagai **Pengurang Penghasilan Kena Pajak (PKP)** dalam pelaporan SPT Tahunan.
            </p>
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <FileText className="h-8 w-8 text-[#0F4C3A] mr-3" />
          Zakat-to-Tax Report Generator
        </h1>
        <p className="text-gray-500 mt-1">Simulasikan insentif pajak atas Zakat Anda dan buat lembar lampiran rekapitulasi pengurang PKP untuk pelaporan SPT Pajak resmi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Tax Optimizer Input Form (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Zakat Accumulated Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-50 pb-3">Zakat History Terkumpul</h3>
            
            {isLoadingZakat ? (
              <div className="py-4 text-center">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <span className="text-xs text-gray-400 mt-2 block">Memanggil data Zakat...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs text-gray-400 font-bold block">Tahun Pajak</span>
                    <span className="text-sm font-extrabold text-gray-700">2026 / 1447H</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400 font-bold block">Total Zakat Terdaftar</span>
                    <span className="text-xl font-black text-[#0F4C3A] font-mono">
                      Rp {totalZakat.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {totalZakat === 0 ? (
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-[10px] text-amber-700 leading-relaxed">
                    <strong>Catatan:</strong> Anda belum memiliki zakat terhitung di Zakat History. Kami menerapkan nilai acuan simulasi **Rp 3.750.000**. Anda dapat memasukkan nilai kustom Anda sendiri di bawah.
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 text-[10px] text-emerald-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>Data tersinkronisasi otomatis dari riwayat kalkulator Zakat.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Configuration Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 border-b border-gray-50 pb-3">Parameter SPT Pajak</h3>
            
            <form onSubmit={handleGenerateReport} className="space-y-4">
              
              {/* Gross Income Input */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Estimasi Penghasilan Bruto Setahun</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-gray-400">Rp</span>
                  <input 
                    required
                    type="number"
                    min={0}
                    value={grossIncome}
                    onChange={e => setGrossIncome(Number(e.target.value))}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-extrabold font-mono text-gray-800"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Total pendapatan kotor dari gaji, bonus, dan usaha sampingan setahun.</span>
              </div>

              {/* Customizable Zakat Override */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Nilai Zakat Kustom (Pengurang PKP)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3.5 text-xs font-bold text-gray-400">Rp</span>
                  <input 
                    type="number"
                    min={0}
                    value={customZakat}
                    onChange={e => setCustomZakat(e.target.value)}
                    placeholder={activeZakat.toString()}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-extrabold font-mono text-gray-800"
                  />
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">Biarkan kosong untuk menggunakan total dari Zakat History.</span>
              </div>

              {/* Mock NPWP Field */}
              <div>
                <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Nomor Pokok Wajib Pajak (NPWP)</label>
                <input 
                  type="text"
                  value={npwp}
                  onChange={e => setNpwp(e.target.value)}
                  className="w-full p-3 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-bold font-mono text-gray-800"
                />
              </div>

              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold py-3.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Memformulasikan PDF Lampiran...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span>Generate Laporan Lampiran SPT</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Tax Optimization Summary & Results (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tax Saving Outcome Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-3">Hasil Simulasi Pajak & Zakat</h3>
            
            {/* Visual Indicator of Tax Savings */}
            <div className="bg-gradient-to-br from-emerald-600 to-[#10B981] text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <span className="text-xs text-emerald-100 uppercase tracking-wider font-bold">Estimasi Penghematan Pajak</span>
                <h3 className="text-3xl font-black mt-2 font-mono text-amber-300">
                  Rp {taxSavings.toLocaleString('id-ID')}
                </h3>
                <p className="text-[10px] text-emerald-100 leading-relaxed mt-1">Keuntungan pemotongan pajak PPh Pasal 21 atas zakat yang Anda tunaikan.</p>
              </div>

              <div className="bg-white/10 border border-white/20 p-4 rounded-xl text-center flex-shrink-0">
                <span className="text-[10px] text-emerald-200 block uppercase font-bold">Rasio Tarif Pajak</span>
                <span className="text-2xl font-black font-mono">{averageTaxRate.toFixed(1)}%</span>
              </div>
            </div>

            {/* Calculations Breakdown Grid */}
            <div className="space-y-4">
              <span className="block text-xs font-extrabold text-gray-400 uppercase tracking-wider">Perbandingan Detil Penghitungan</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Before Zakat */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Skema Konvensional (Tanpa Zakat)</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Penghasilan Bruto:</span>
                    <span className="font-bold">Rp {grossIncome.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">PTKP (TK/0):</span>
                    <span className="font-bold text-rose-600">-Rp {ptkp.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-gray-200/50 pt-1">
                    <span className="text-gray-500">Penghasilan Kena Pajak (PKP):</span>
                    <span className="font-extrabold">Rp {pkpBeforeZakat.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-gray-200/50 pt-2 font-semibold">
                    <span className="text-[#0F4C3A]">PPh 21 Terutang:</span>
                    <span className="font-black text-[#0F4C3A]">Rp {initialTax.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* After Zakat */}
                <div className="p-4 bg-emerald-50/20 rounded-xl border border-emerald-100/40 space-y-2">
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Skema Kepatuhan Zakat (Sharify)</span>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Penghasilan Bruto:</span>
                    <span className="font-bold">Rp {grossIncome.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">PTKP + Zakat LAZ:</span>
                    <span className="font-bold text-emerald-600">-Rp {(ptkp + activeZakat).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-gray-200/50 pt-1">
                    <span className="text-gray-500">Penghasilan Kena Pajak (PKP):</span>
                    <span className="font-extrabold text-emerald-800">Rp {pkpAfterZakat.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-xs border-t border-gray-200/50 pt-2 font-semibold">
                    <span className="text-[#0F4C3A]">PPh 21 Terutang Baru:</span>
                    <span className="font-black text-emerald-800">Rp {reducedTax.toLocaleString('id-ID')}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* Sharia Pro Perks Info Card */}
          <div className="bg-amber-50/20 border border-amber-200/40 rounded-2xl p-6">
            <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider mb-2 flex items-center">
              <Scale className="w-4 h-4 mr-1.5" /> Cara Klaim Zakat di DJP
            </h4>
            <ul className="space-y-2 text-xs text-amber-900/80 leading-relaxed">
              <li>1. Zakat wajib ditunaikan melalui BAZNAS atau Lembaga Amil Zakat (LAZ) resmi tingkat nasional/provinsi/kabupaten.</li>
              <li>2. Simpan tanda bukti pembayaran zakat (BSMZ / Bukti Setor Zakat) resmi yang diterbitkan lembaga amil.</li>
              <li>3. Lampirkan lembar **Laporan Rekapitulasi Zakat** dari Sharify sebagai pendukung pada Lampiran khusus saat e-Filing SPT Tahunan di situs DJP Online.</li>
            </ul>
          </div>

        </div>

      </div>

      {/* 3. Formal Document PDF Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-zoom-in my-8">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0F4C3A] text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Printer className="w-5 h-5 text-amber-300 animate-pulse" />
                <h3 className="font-bold text-sm">Preview Dokumen Lampiran SPT Tahunan</h3>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-white hover:text-emerald-100 bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Body container */}
            <div className="p-8 bg-gray-100/50 max-h-[70vh] overflow-y-auto">
              
              {/* Actual Formal Document Paper */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-2xl mx-auto space-y-6 font-sans text-xs text-gray-800 relative">
                
                {/* Official Looking Stamp Overlay */}
                <div className="absolute top-8 right-8 border-4 border-emerald-600/30 rounded-lg p-2 text-emerald-600/30 font-black text-center rotate-12 select-none uppercase tracking-wider">
                  SHARIFY DIGITAL<br />AUDITED SECURE
                </div>

                {/* Doc Header */}
                <div className="text-center border-b-2 border-gray-900 pb-4 space-y-1">
                  <h2 className="text-sm font-black uppercase text-gray-900">REKAPITULASI PEMBAYARAN ZAKAT / SUMBANGAN KEAGAMAAN</h2>
                  <h3 className="text-xs font-bold uppercase text-gray-700">SEBAGAI PENGURANG PENGHASILAN KENA PAJAK (PKP)</h3>
                  <p className="text-[10px] text-gray-400 font-mono">Lampiran SPT Tahunan Pajak Penghasilan Orang Pribadi - Tahun Pajak 2026</p>
                </div>

                {/* Meta details grid */}
                <div className="grid grid-cols-2 gap-4 border-b border-gray-200 pb-4 font-mono text-[10px]">
                  <div className="space-y-1">
                    <div>
                      <span className="text-gray-400">No. Referensi:</span>
                      <p className="font-bold text-gray-800">SHY-2026-TX/ZK-08342</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Nama Wajib Pajak:</span>
                      <p className="font-bold text-gray-800">{profile?.full_name || 'Member Pro'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email Terdaftar:</span>
                      <p className="font-bold text-gray-800">{user?.email}</p>
                    </div>
                  </div>

                  <div className="space-y-1 text-right sm:text-left">
                    <div>
                      <span className="text-gray-400">NPWP Pajak:</span>
                      <p className="font-bold text-gray-800">{npwp}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tanggal Generate:</span>
                      <p className="font-bold text-gray-800">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Dasar Hukum:</span>
                      <p className="font-bold text-gray-800">UU 23/2011 Pasal 22</p>
                    </div>
                  </div>
                </div>

                {/* Audit breakdown table */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900 border-l-2 border-[#0F4C3A] pl-2 uppercase tracking-wide">Rincian Pembayaran Zakat</h4>
                  
                  <table className="w-full text-left border-collapse border border-gray-200 text-[10px]">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 font-bold">
                        <th className="p-2 border-r border-gray-200">Keterangan Penyaluran</th>
                        <th className="p-2 border-r border-gray-200">Badan Amil Penerima</th>
                        <th className="p-2 border-r border-gray-200">Legalitas DJP</th>
                        <th className="p-2 text-right">Jumlah (Rupiah)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      <tr>
                        <td className="p-2 border-r border-gray-200 font-semibold">Zakat Profesi & Maal Terhitung 2026</td>
                        <td className="p-2 border-r border-gray-200">BAZNAS / LAZ Resmi Mitra Sharify</td>
                        <td className="p-2 border-r border-gray-200">PP No. 60 Tahun 2010</td>
                        <td className="p-2 text-right font-bold font-mono">Rp {activeZakat.toLocaleString('id-ID')}</td>
                      </tr>
                      <tr className="bg-gray-50 font-bold border-t border-gray-300">
                        <td colSpan={3} className="p-2 text-right border-r border-gray-200 uppercase">Jumlah Pengurang PKP (Zakat):</td>
                        <td className="p-2 text-right font-black font-mono text-[#0F4C3A]">Rp {activeZakat.toLocaleString('id-ID')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Math optimization details */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 font-mono text-[9px] space-y-1.5">
                  <span className="font-extrabold uppercase text-gray-500 block mb-1">Pernyataan Audit Dampak Pajak</span>
                  <div className="flex justify-between">
                    <span>Estimasi Pendapatan Bruto Setahun:</span>
                    <span>Rp {grossIncome.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Penghasilan Kena Pajak Awal (PKP):</span>
                    <span>Rp {pkpBeforeZakat.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200/50 pt-1">
                    <span>Penghasilan Kena Pajak Akhir (Setelah Zakat):</span>
                    <span>Rp {pkpAfterZakat.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-[#0F4C3A] border-t border-gray-200/50 pt-1.5 text-[10px]">
                    <span>Nilai Penghematan Pajak Wajib Pajak:</span>
                    <span>Rp {taxSavings.toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Legal signature placeholder */}
                <div className="flex justify-between items-end pt-4 font-mono text-[9px]">
                  <div className="space-y-1">
                    <p className="text-gray-400">Verifikator Keabsahan:</p>
                    <div className="h-10 w-10 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-black text-gray-300 text-[10px]">QR</div>
                    <p className="font-bold">Sharify Syariah Auditor</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-gray-400">Wajib Pajak Yang Bersangkutan:</p>
                    <div className="h-10"></div>
                    <p className="font-bold border-t border-gray-400 pt-1">{profile?.full_name || 'Member Pro'}</p>
                  </div>
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Resmi</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardContainer>
  );
};
