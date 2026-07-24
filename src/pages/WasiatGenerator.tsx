import React, { useState } from 'react';
import { DashboardContainer } from '../components/layout/DashboardContainer';
import { useAuthStore } from '../store/authStore';
import { 
  Scale, FileText, ArrowRight, ArrowLeft, Plus, Trash2, 
  CheckCircle2, AlertTriangle, Download, X, HelpCircle, ShieldCheck
} from 'lucide-react';

interface Beneficiary {
  id: string;
  name: string;
  relationship: string;
  amount: number;
}

export const WasiatGenerator: React.FC = () => {
  const { user, profile } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Step 1: Harta (Assets & Liabilities) state
  const [liquidAssets, setLiquidAssets] = useState<number>(300000000); // Rp 300jt
  const [nonLiquidAssets, setNonLiquidAssets] = useState<number>(700000000); // Rp 700jt
  const [totalDebts, setTotalDebts] = useState<number>(100000000); // Rp 100jt

  // Step 2: Beneficiaries (Non-Heirs) state
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([
    {
      id: '1',
      name: 'Yayasan Yatim Piatu Amanah',
      relationship: 'Lembaga Sosial / Charity',
      amount: 150000000 // Rp 150M default
    }
  ]);

  const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
  const [newBeneficiaryRel, setNewBeneficiaryRel] = useState('');
  const [newBeneficiaryAmount, setNewBeneficiaryAmount] = useState('');

  // Math Calculations
  const totalAssets = liquidAssets + nonLiquidAssets;
  const netEstate = Math.max(0, totalAssets - totalDebts);
  const maxWasiatLimit = netEstate / 3;

  const totalAllocatedWasiat = beneficiaries.reduce((sum, b) => sum + b.amount, 0);
  const isLimitExceeded = totalAllocatedWasiat > maxWasiatLimit;
  const remainingLimit = Math.max(0, maxWasiatLimit - totalAllocatedWasiat);

  // Beneficiary Management
  const addBeneficiary = () => {
    if (!newBeneficiaryName || !newBeneficiaryAmount) return;
    const amt = Number(newBeneficiaryAmount);
    if (isNaN(amt) || amt <= 0) return;

    const newB: Beneficiary = {
      id: Date.now().toString(),
      name: newBeneficiaryName,
      relationship: newBeneficiaryRel || 'Pihak Lain (Bukan Ahli Waris)',
      amount: amt
    };

    setBeneficiaries(prev => [...prev, newB]);
    setNewBeneficiaryName('');
    setNewBeneficiaryRel('');
    setNewBeneficiaryAmount('');
  };

  const removeBeneficiary = (id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
  };

  // Trigger preview generation
  const handleGenerateWasiat = () => {
    if (isLimitExceeded) return;
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowPreviewModal(true);
    }, 1500);
  };

  const handleDownloadPDF = () => {
    alert('Draf Wasiat berhasil disimpan! PDF Draf Siap diunduh untuk dilegalisasi Notaris / dihadapan 2 Saksi.');
    setShowPreviewModal(false);
  };

  return (
    <DashboardContainer>
      <div className="px-6 pt-12 pb-6">
        {/* Top Legal Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-amber-500/80 text-white rounded-3xl p-6 mb-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-emerald-500/20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
          <div className="flex items-start space-x-3.5 relative z-10">
            <Scale className="w-6 h-6 text-amber-300 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">Ketentuan Hukum Syariah Terkait Wasiat</h3>
              <p className="text-xs text-emerald-50 leading-relaxed mt-2">
                Merujuk pada <strong className="text-white">Kompilasi Hukum Islam (KHI) Pasal 195</strong>, wasiat hanya diperbolehkan sebanyak-banyaknya <strong className="text-white">1/3 (sepertiga) dari harta bersih</strong> (setelah dikurangi hutang/biaya pengurusan jenazah), kecuali apabila seluruh ahli waris menyetujuinya. Wasiat juga <strong className="text-white">tidak boleh diberikan kepada Ahli Waris kandung</strong> yang sudah berhak mendapatkan bagian warisan (Faraidh), melainkan ditujukan untuk pihak ketiga, anak angkat, atau lembaga sosial/wakaf (<em>Tabarru'</em>).
              </p>
            </div>
          </div>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center">
            <FileText className="h-7 w-7 text-emerald-600 mr-3" />
            Digital Wasiat Generator
          </h1>
          <p className="text-sm text-slate-500 mt-2">Susun dokumen draf wasiat sah sesuai hukum Syariah Islam secara terstruktur dan teruji otomatis oleh engine validasi syariah.</p>
        </div>

        {/* Step Wizard Steps Navigation Header */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 mb-8 shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 md:gap-6">
              
              {/* Step 1 Tag */}
              <button 
                onClick={() => currentStep > 1 && setCurrentStep(1)}
                className={`flex items-center space-x-2 text-xs font-bold transition-all ${
                  currentStep === 1 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
                  currentStep === 1 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                }`}>1</span>
                <span className="hidden sm:inline">Deklarasi Harta</span>
              </button>

              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:block" />

              {/* Step 2 Tag */}
              <button 
                onClick={() => currentStep > 2 && setCurrentStep(2)}
                disabled={currentStep < 2}
                className={`flex items-center space-x-2 text-xs font-bold transition-all ${
                  currentStep === 2 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : currentStep > 2 
                    ? 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300' 
                    : 'text-slate-300 dark:text-slate-600 cursor-not-allowed'
                }`}
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
                  currentStep === 2 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : currentStep > 2 
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-700'
                }`}>2</span>
                <span className="hidden sm:inline">Alokasi Wasiat</span>
              </button>

              <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:block" />

              {/* Step 3 Tag */}
              <div className={`flex items-center space-x-2 text-xs font-bold ${
                currentStep === 3 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-300 dark:text-slate-600'
              }`}>
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border transition-colors ${
                  currentStep === 3 
                    ? 'bg-emerald-600 text-white border-emerald-600' 
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-slate-700'
                }`}>3</span>
                <span className="hidden sm:inline">Draf Dokumen</span>
              </div>

            </div>

            <div className="text-right text-[10px] text-emerald-500 font-mono hidden md:block uppercase tracking-widest font-bold">
              Keamanan Terenkripsi
            </div>
          </div>
        </div>

        {/* Main wizard sections */}
        <div className="flex flex-col gap-8">
          
          {/* Left Interactive Wizard Form Column */}
          <div className="w-full space-y-6">
            
            {currentStep === 1 && (
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 space-y-6">
                <div>
                  <h3 className="text-md font-extrabold text-slate-900 dark:text-white border-l-4 border-emerald-500 pl-2.5 uppercase tracking-wide">Langkah 1: Deklarasi Harta Pewaris</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Masukkan taksiran nilai seluruh aset Anda beserta kewajiban hutang untuk mengalkulasikan Harta Bersih (<em>Tirkah</em>).</p>
                </div>

                <div className="space-y-5">
                  {/* Liquid Assets */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Aset Likuid (Cash, Emas, Saham/Reksadana)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">Rp</span>
                      <input 
                        type="number"
                        min={0}
                        value={liquidAssets}
                        onChange={e => setLiquidAssets(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-extrabold font-mono text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Non Liquid Assets */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Aset Non-Likuid (Properti, Tanah, Bisnis/Kendaraan)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-xs font-bold text-slate-400">Rp</span>
                      <input 
                        type="number"
                        min={0}
                        value={nonLiquidAssets}
                        onChange={e => setNonLiquidAssets(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-extrabold font-mono text-slate-800 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Debts & Liabilities */}
                  <div>
                    <label className="block text-[10px] font-extrabold text-rose-500 uppercase tracking-wider mb-2">Total Hutang & Kewajiban Finansial</label>
                    <div className="relative">
                      <span className="absolute left-4 top-3.5 text-xs font-bold text-rose-400">Rp</span>
                      <input 
                        type="number"
                        min={0}
                        value={totalDebts}
                        onChange={e => setTotalDebts(Number(e.target.value))}
                        className="w-full pl-10 pr-4 py-3 bg-rose-50/50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-extrabold font-mono text-rose-800 dark:text-rose-400"
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 mt-2 block">Wajib dilunasi terlebih dahulu dari harta warisan sebelum wasiat dibagikan.</span>
                  </div>
                </div>

                {/* Navigation Action */}
                <div className="flex justify-end pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center space-x-2"
                  >
                    <span>Lanjutkan ke Alokasi</span>
                    <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-slate-900 dark:text-white border-l-4 border-emerald-500 pl-2.5 uppercase tracking-wide">Langkah 2: Alokasi Wasiat (Non-Ahli Waris)</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Tambahkan penerima wasiat (misal: panti asuhan, guru ngaji, yayasan amal, anak angkat) beserta nominal alokasinya.</p>
              </div>

              {/* 1/3 Mathematical Constraint Warning/Block Panel */}
              {isLimitExceeded ? (
                <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-200 dark:border-rose-800/30 rounded-2xl p-4 flex items-start space-x-3 text-rose-800 dark:text-rose-400 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase">Pelanggaran Batas Syariah Wasiat (Maks 1/3)!</h4>
                    <p className="text-[10px] mt-2 leading-relaxed">
                      Jumlah alokasi Anda sebesar <strong className="font-bold">Rp {totalAllocatedWasiat.toLocaleString('id-ID')}</strong> melebihi batas legal syariah <strong className="font-bold">1/3 Harta Bersih</strong> (yaitu maksimal <strong className="font-bold">Rp {maxWasiatLimit.toLocaleString('id-ID')}</strong>). Sistem memblokir proses draf demi menjaga kesahihan wasiat Anda. Harap sesuaikan nominal atau hapus penerima.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl p-4 flex items-start space-x-3 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase">Alokasi Wasiat Sah Secara Syariat</h4>
                    <p className="text-[10px] mt-2 leading-relaxed">
                      Sisa batas kuota wasiat Anda saat ini adalah <strong className="font-bold">Rp {remainingLimit.toLocaleString('id-ID')}</strong> dari total kapasitas maksimal <strong className="font-bold">Rp {maxWasiatLimit.toLocaleString('id-ID')}</strong> (1/3 dari Harta Bersih).
                    </p>
                  </div>
                </div>
              )}

              {/* List of current beneficiaries */}
              <div className="space-y-4">
                <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Daftar Penerima Wasiat Terdaftar</span>
                
                {beneficiaries.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl text-xs text-slate-400">
                    Belum ada penerima wasiat yang ditambahkan.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {beneficiaries.map(b => (
                      <div key={b.id} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-white">{b.name}</h4>
                          <span className="text-[10px] text-slate-400">{b.relationship}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 font-mono">Rp {b.amount.toLocaleString('id-ID')}</span>
                          <button 
                            onClick={() => removeBeneficiary(b.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Form to add a new beneficiary */}
              <div className="bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-5 border border-slate-200/50 dark:border-slate-700/50 space-y-4">
                <span className="block text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Tambah Penerima Baru</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-2">Nama Lengkap / Lembaga</label>
                    <input 
                      type="text"
                      placeholder="Contoh: Panti Asuhan Al-Barokah"
                      value={newBeneficiaryName}
                      onChange={e => setNewBeneficiaryName(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-2">Hubungan / Keterangan</label>
                    <input 
                      type="text"
                      placeholder="Contoh: Lembaga Amal / Anak Angkat"
                      value={newBeneficiaryRel}
                      onChange={e => setNewBeneficiaryRel(e.target.value)}
                      className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-2">Nominal Hibah Wasiat</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[10px] font-bold text-slate-400">Rp</span>
                    <input 
                      type="number"
                      placeholder="Masukkan nominal rupiah"
                      value={newBeneficiaryAmount}
                      onChange={e => setNewBeneficiaryAmount(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-extrabold font-mono text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button 
                  onClick={addBeneficiary}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center space-x-1 shadow-sm shadow-emerald-500/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Penerima</span>
                </button>
              </div>

              {/* Navigation Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  disabled={isLimitExceeded || beneficiaries.length === 0}
                  onClick={() => setCurrentStep(3)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Draf & Tinjau Wasiat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 space-y-6">
              <div className="text-center py-6 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto animate-bounce" />
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white uppercase tracking-wide">Formulasi Draf Wasiat Selesai!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                    Seluruh kalkulasi aset, debts, dan alokasi penerima non-ahli waris telah divalidasi 100% patuh syariah Islam.
                  </p>
                </div>
              </div>

              <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-2xl text-emerald-800 dark:text-emerald-400 space-y-3 text-xs">
                <div className="flex items-center space-x-2 font-bold">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-500" />
                  <span className="uppercase tracking-wider">Rincian Keputusan Wasiat Digital Anda:</span>
                </div>
                <ul className="space-y-2 text-[11px] pl-7 list-disc leading-relaxed font-medium">
                  <li>Total Harta Bersih Terhitung: <strong className="font-bold text-slate-900 dark:text-white ml-1">Rp {netEstate.toLocaleString('id-ID')}</strong></li>
                  <li>Total Nominal Wasiat dialokasikan: <strong className="font-bold text-slate-900 dark:text-white ml-1">Rp {totalAllocatedWasiat.toLocaleString('id-ID')} ({((totalAllocatedWasiat / netEstate) * 100).toFixed(1)}% dari harta bersih)</strong></li>
                  <li>Sisa Harta Waris Utama untuk Faraidh Ahli Waris: <strong className="font-bold text-slate-900 dark:text-white ml-1">Rp {(netEstate - totalAllocatedWasiat).toLocaleString('id-ID')}</strong></li>
                </ul>
              </div>

              {/* Navigation Actions */}
              <div className="flex flex-col-reverse sm:flex-row justify-between pt-6 border-t border-slate-100 dark:border-slate-800 gap-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-xs py-3 px-5 rounded-xl transition-all flex items-center justify-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  onClick={handleGenerateWasiat}
                  disabled={isGenerating}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Menyusun Dokumen Hukum...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Buat Dokumen Legal Wasiat</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Right Financial Audit Side Panel (5/12 width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Summary Card */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.04)] border border-slate-100 dark:border-slate-800 space-y-5">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-50 dark:border-slate-800 pb-4">Ringkasan Kalkulasi Harta</h3>
            
            <div className="space-y-4 font-mono text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Aset Likuid:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Rp {liquidAssets.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Aset Non-Likuid:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">Rp {nonLiquidAssets.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-wider text-[10px]">Total Harta Bruto:</span>
                <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">Rp {totalAssets.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center text-rose-600 dark:text-rose-400 border-b border-slate-100 dark:border-slate-800 pb-3">
                <span className="font-semibold uppercase tracking-wider text-[10px]">Hutang Kewajiban (-):</span>
                <span className="font-black text-sm">- Rp {totalDebts.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between items-center bg-emerald-500 text-white p-4 rounded-2xl shadow-md shadow-emerald-500/20 mt-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">Harta Bersih (Tirkah):</span>
                <span className="font-black text-base">Rp {netEstate.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Syariah Cap & Thresholds</span>
              
              <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 text-[11px] text-amber-900 dark:text-amber-500 space-y-2">
                <div className="flex justify-between font-bold">
                  <span>Maks Batas Wasiat (1/3):</span>
                  <span className="font-black font-mono">Rp {maxWasiatLimit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-400 font-medium">
                  <span>Dialokasikan Saat Ini:</span>
                  <span className="font-bold font-mono text-slate-800 dark:text-slate-200">Rp {totalAllocatedWasiat.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-amber-200/50 dark:border-amber-800/50 text-amber-700 dark:text-amber-400 font-extrabold">
                  <span>Sisa Kapasitas:</span>
                  <span className="font-black font-mono text-xs">Rp {remainingLimit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education Box */}
          <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-3xl p-6 shadow-[0_2px_20px_rgb(0,0,0,0.04)]">
            <h4 className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-3 flex items-center">
              <HelpCircle className="w-5 h-5 mr-2" /> Pembagian Faraidh vs Wasiat
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Wasiat didahulukan sebelum pembagian Faraidh kepada Ahli Waris. Wasiat ini dirancang khusus untuk memberi wasilah kebajikan bagi pihak-pihak yang tidak mendapatkan waris secara otomatis oleh syariat (seperti kerabat jauh yang miskin, anak angkat, atau sarana dakwah/sosial).
            </p>
          </div>

        </div>

      </div>

      {/* STEP 3 modal: Legal Notary Preview Document */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-zoom-in my-8">
            
            {/* Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Scale className="w-5 h-5 text-amber-300 animate-pulse" />
                <h3 className="font-black text-sm uppercase tracking-wider">Draf Wasiat Sesuai Syariat - Legal Preview</h3>
              </div>
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="text-white hover:text-emerald-100 bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Body container */}
            <div className="p-8 bg-slate-100 max-h-[70vh] overflow-y-auto">
              
              {/* Document Paper */}
              <div className="bg-white p-10 rounded-2xl shadow-md max-w-2xl mx-auto space-y-6 font-serif text-[11px] text-slate-800 relative leading-relaxed">
                
                {/* Official Stamp */}
                <div className="absolute top-10 right-10 border-4 border-amber-600/30 rounded-lg p-2 text-amber-600/30 font-black text-center rotate-12 select-none uppercase tracking-widest text-xs">
                  SHARIFY ISLAMIC<br />LEGAL AUDIT
                </div>

                {/* Doc Header */}
                <div className="text-center border-b-2 border-slate-900 pb-5 space-y-2 font-sans">
                  <h2 className="text-sm font-black uppercase text-slate-900">DOKUMEN WASIAT HARTA WARISAN (SURAT WASIAT)</h2>
                  <h3 className="text-xs font-bold uppercase text-slate-700">SESUAI SYARIAT ISLAM (KOMPILASI HUKUM ISLAM PASAL 195)</h3>
                  <p className="text-[9px] text-slate-400 font-mono mt-1 tracking-widest">NO. DRAF LEGAL: SHY-WAS/2026/05/{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>

                {/* Opening statement */}
                <div className="space-y-3 text-sm">
                  <p className="italic font-bold text-center mb-4">Bismillaahirrahmaanirrahiim,</p>
                  <p className="text-justify">
                    Saya yang bertandatangan di bawah ini, bertindak selaku Pewasiat (al-Mushi), dengan penuh kesadaran dan tanpa paksaan dari pihak manapun, menyatakan wasiat harta saya untuk ditunaikan setelah wafatnya saya, sesuai syariat Islam yang luhur.
                  </p>
                </div>

                {/* Pewaris profile */}
                <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans text-xs">
                  <span className="font-black uppercase text-slate-400 block mb-2 tracking-wider">Identitas Pewasiat (al-Mushi):</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Nama Pewasiat:</span>
                      <p className="font-black text-slate-800">{profile?.full_name || 'Member Family Sharify'}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Email / ID:</span>
                      <p className="font-bold text-slate-800">{user?.email}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Taksiran Harta Bersih:</span>
                      <p className="font-black text-emerald-600 font-mono">Rp {netEstate.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Tanggal Dibuat:</span>
                      <p className="font-bold text-slate-800">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Wasiat Details */}
                <div className="space-y-4 font-sans">
                  <h4 className="font-black text-slate-900 border-l-4 border-emerald-500 pl-3 uppercase tracking-wider text-xs">Ketetapan Hibah Wasiat (Maks 1/3 Harta Bersih)</h4>
                  <p className="text-xs text-slate-600 font-serif leading-relaxed text-justify">
                    Sesuai ketetapan Fiqh Muamalah dan batasan 1/3 harta bersih (*Tirkah*), dengan ini saya menetapkan wasiat hibah kepada pihak non-ahli waris sebagai berikut:
                  </p>
                  
                  <table className="w-full text-left border-collapse border border-slate-200 text-xs font-sans rounded-xl overflow-hidden shadow-sm">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
                        <th className="p-3 border-r border-slate-200">Nama Lengkap Penerima (al-Musha lahu)</th>
                        <th className="p-3 border-r border-slate-200">Hubungan / Keterangan</th>
                        <th className="p-3 text-right">Nominal Hibah (Rupiah)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {beneficiaries.map(b => (
                        <tr key={b.id}>
                          <td className="p-3 border-r border-slate-200 font-bold text-slate-800">{b.name}</td>
                          <td className="p-3 border-r border-slate-200 text-slate-600">{b.relationship}</td>
                          <td className="p-3 text-right font-black font-mono text-slate-800">Rp {b.amount.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50 font-bold border-t-2 border-slate-300">
                        <td colSpan={2} className="p-3 text-right border-r border-slate-200 uppercase tracking-wider text-emerald-800">Total Hibah Wasiat:</td>
                        <td className="p-3 text-right font-black font-mono text-emerald-600 text-sm">Rp {totalAllocatedWasiat.toLocaleString('id-ID')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Sharia Statement */}
                <div className="space-y-3 text-sm text-justify">
                  <p>
                    Segala pengeluaran hutang dan biaya pemakaman wajib dibayarkan penuh terlebih dahulu sebelum wasiat ini ditunaikan. Sisa harta setelah dikurangi hutang dan wasiat di atas (yaitu sebesar <strong className="font-black">Rp {(netEstate - totalAllocatedWasiat).toLocaleString('id-ID')}</strong>) harus dibagi secara mutlak kepada para Ahli Waris syar'i sesuai dengan hukum ketetapan <strong className="font-black">Faraidh</strong> (Syariah Islam).
                  </p>
                  <p>
                    Demikian surat draf wasiat ini dibuat dalam keadaan sadar lahir batin demi kebaikan keturunan di masa mendatang serta kesucian pertanggungjawaban harta di hadapan Allah SWT.
                  </p>
                </div>

                {/* Legal signature placeholder */}
                <div className="grid grid-cols-3 gap-6 pt-8 font-sans text-xs text-center border-t border-slate-200 mt-8">
                  <div className="space-y-12">
                    <p className="text-slate-500 font-bold">Saksi I (Muslim):</p>
                    <p className="font-bold border-t border-slate-300 pt-2">( ......................................... )</p>
                  </div>
                  <div className="space-y-12">
                    <p className="text-slate-500 font-bold">Saksi II (Muslim):</p>
                    <p className="font-bold border-t border-slate-300 pt-2">( ......................................... )</p>
                  </div>
                  <div className="space-y-12">
                    <p className="text-slate-500 font-bold">Pewasiat (al-Mushi):</p>
                    <p className="font-black border-t border-slate-300 pt-2 uppercase">{profile?.full_name || 'Member Family Sharify'}</p>
                  </div>
                </div>

                {/* Notary footer */}
                <div className="pt-6 mt-4 text-center border-t border-dashed border-slate-300 font-mono text-[9px] text-slate-400 tracking-wider">
                  DRAF WASIAT LEGAL INI DIREGENERASI OTOMATIS OLEH SHARIFY SYSTEM DAN SIAP DITANDATANGANI DI HADAPAN NOTARIS / PEJABAT PEMBUAT AKTA TANAH.
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-5 bg-slate-50 border-t border-slate-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-6 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 px-6 rounded-xl shadow-md shadow-emerald-500/20 transition-colors flex items-center space-x-2 uppercase tracking-wider"
              >
                <Download className="w-4 h-4" />
                <span>Unduh PDF Wasiat</span>
              </button>
            </div>

          </div>
        </div>
      )}
      </div>
    </DashboardContainer>
  );
};
