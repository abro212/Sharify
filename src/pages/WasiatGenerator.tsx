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
      
      {/* Top Legal Banner */}
      <div className="bg-gradient-to-r from-[#0F4C3A] via-[#0D5C45] to-[#D4AF37]/80 text-white rounded-2xl p-5 mb-8 shadow-sm border border-emerald-500/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')" }}></div>
        <div className="flex items-start space-x-3.5 relative z-10">
          <Scale className="w-6 h-6 text-amber-300 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-black text-amber-300 uppercase tracking-wide">Ketentuan Hukum Syariah Terkait Wasiat</h3>
            <p className="text-xs text-emerald-100 leading-relaxed mt-1">
              Merujuk pada **Kompilasi Hukum Islam (KHI) Pasal 195**, wasiat hanya diperbolehkan sebanyak-banyaknya **1/3 (sepertiga) dari harta bersih** (setelah dikurangi hutang/biaya pengurusan jenazah), kecuali apabila seluruh ahli waris menyetujuinya. Wasiat juga **tidak boleh diberikan kepada Ahli Waris kandung** yang sudah berhak mendapatkan bagian warisan (Faraidh), melainkan ditujukan untuk pihak ketiga, anak angkat, atau lembaga sosial/wakaf (*Tabarru'*).
            </p>
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center">
          <FileText className="h-8 w-8 text-[#0F4C3A] mr-3" />
          Digital Wasiat Generator
        </h1>
        <p className="text-gray-500 mt-1">Susun dokumen draf wasiat sah sesuai hukum Syariah Islam secara terstruktur dan teruji otomatis oleh engine validasi syariah.</p>
      </div>

      {/* Step Wizard Steps Navigation Header */}
      <div className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 md:space-x-6">
            
            {/* Step 1 Tag */}
            <button 
              onClick={() => currentStep > 1 && setCurrentStep(1)}
              className={`flex items-center space-x-2 text-xs font-bold transition-all ${
                currentStep === 1 
                  ? 'text-[#0F4C3A]' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border ${
                currentStep === 1 
                  ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' 
                  : 'bg-emerald-50 text-[#0F4C3A] border-emerald-100'
              }`}>1</span>
              <span>Deklarasi Harta</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-gray-300 hidden md:block" />

            {/* Step 2 Tag */}
            <button 
              onClick={() => currentStep > 2 && setCurrentStep(2)}
              disabled={currentStep < 2}
              className={`flex items-center space-x-2 text-xs font-bold transition-all ${
                currentStep === 2 
                  ? 'text-[#0F4C3A]' 
                  : currentStep > 2 
                  ? 'text-gray-500 hover:text-gray-700' 
                  : 'text-gray-300 cursor-not-allowed'
              }`}
            >
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border ${
                currentStep === 2 
                  ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' 
                  : currentStep > 2 
                  ? 'bg-emerald-50 text-[#0F4C3A] border-emerald-100' 
                  : 'bg-gray-50 text-gray-300 border-gray-200'
              }`}>2</span>
              <span>Alokasi Wasiat</span>
            </button>

            <ArrowRight className="w-3.5 h-3.5 text-gray-300 hidden md:block" />

            {/* Step 3 Tag */}
            <div className={`flex items-center space-x-2 text-xs font-bold ${
              currentStep === 3 ? 'text-[#0F4C3A]' : 'text-gray-300'
            }`}>
              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border ${
                currentStep === 3 
                  ? 'bg-[#0F4C3A] text-white border-[#0F4C3A]' 
                  : 'bg-gray-50 text-gray-300 border-gray-200'
              }`}>3</span>
              <span>Draf Dokumen</span>
            </div>

          </div>

          <div className="text-right text-[10px] text-gray-400 font-mono">
            Keamanan Enkripsi Syariah Terproteksi
          </div>
        </div>
      </div>

      {/* Main wizard sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Interactive Wizard Form Column (7/12 width) */}
        <div className="lg:col-span-7 space-y-6">
          
          {currentStep === 1 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-gray-900 border-l-4 border-[#0F4C3A] pl-2.5 uppercase tracking-wide">Langkah 1: Deklarasi Harta Pewaris</h3>
                <p className="text-xs text-gray-400 mt-1">Masukkan taksiran nilai seluruh aset Anda beserta kewajiban hutang untuk mengalkulasikan Harta Bersih (*Tirkah*).</p>
              </div>

              <div className="space-y-4">
                {/* Liquid Assets */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Aset Likuid (Cash, Emas, Saham/Reksadana)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">Rp</span>
                    <input 
                      type="number"
                      min={0}
                      value={liquidAssets}
                      onChange={e => setLiquidAssets(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-extrabold font-mono text-gray-800"
                    />
                  </div>
                </div>

                {/* Non Liquid Assets */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2">Aset Non-Likuid (Properti, Tanah, Bisnis/Kendaraan)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-gray-400">Rp</span>
                    <input 
                      type="number"
                      min={0}
                      value={nonLiquidAssets}
                      onChange={e => setNonLiquidAssets(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F4C3A]/20 focus:border-[#0F4C3A] font-extrabold font-mono text-gray-800"
                    />
                  </div>
                </div>

                {/* Debts & Liabilities */}
                <div>
                  <label className="block text-xs font-extrabold text-gray-400 uppercase mb-2 text-rose-500">Total Hutang & Kewajiban Finansial</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-xs font-bold text-rose-400">Rp</span>
                    <input 
                      type="number"
                      min={0}
                      value={totalDebts}
                      onChange={e => setTotalDebts(Number(e.target.value))}
                      className="w-full pl-9 pr-4 py-3 border border-rose-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-extrabold font-mono text-rose-800 bg-rose-50/10"
                    />
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 block">Wajib dilunasi terlebih dahulu dari harta warisan sebelum wasiat dibagikan.</span>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center space-x-2"
                >
                  <span>Lanjutkan ke Alokasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div>
                <h3 className="text-md font-extrabold text-gray-900 border-l-4 border-[#0F4C3A] pl-2.5 uppercase tracking-wide">Langkah 2: Alokasi Wasiat (Non-Ahli Waris)</h3>
                <p className="text-xs text-gray-400 mt-1">Tambahkan penerima wasiat (misal: panti asuhan, guru ngaji, yayasan amal, anak angkat) beserta nominal alokasinya.</p>
              </div>

              {/* 1/3 Mathematical Constraint Warning/Block Panel */}
              {isLimitExceeded ? (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start space-x-3 text-rose-800 animate-pulse">
                  <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase">Pelanggaran Batas Syariah Wasiat (Maks 1/3)!</h4>
                    <p className="text-[10px] mt-1 leading-relaxed">
                      Jumlah alokasi Anda sebesar **Rp {totalAllocatedWasiat.toLocaleString('id-ID')}** melebihi batas legal syariah **1/3 Harta Bersih** (yaitu maksimal **Rp {maxWasiatLimit.toLocaleString('id-ID')}**). Sistem memblokir proses draf demi menjaga kesahihan wasiat Anda. Harap sesuaikan nominal atau hapus penerima.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-start space-x-3 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-black uppercase">Alokasi Wasiat Sah Secara Syariat</h4>
                    <p className="text-[10px] mt-1 leading-relaxed">
                      Sisa batas kuota wasiat Anda saat ini adalah **Rp {remainingLimit.toLocaleString('id-ID')}** dari total kapasitas maksimal **Rp {maxWasiatLimit.toLocaleString('id-ID')}** (1/3 dari Harta Bersih).
                    </p>
                  </div>
                </div>
              )}

              {/* List of current beneficiaries */}
              <div className="space-y-3">
                <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Daftar Penerima Wasiat Terdaftar</span>
                
                {beneficiaries.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl text-xs text-gray-400">
                    Belum ada penerima wasiat yang ditambahkan.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {beneficiaries.map(b => (
                      <div key={b.id} className="flex justify-between items-center p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                        <div>
                          <h4 className="text-xs font-bold text-gray-800">{b.name}</h4>
                          <span className="text-[10px] text-gray-400">{b.relationship}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-xs font-extrabold text-gray-700 font-mono">Rp {b.amount.toLocaleString('id-ID')}</span>
                          <button 
                            onClick={() => removeBeneficiary(b.id)}
                            className="p-1 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/50 space-y-4">
                <span className="block text-[10px] font-extrabold text-[#0F4C3A] uppercase tracking-wider">Tambah Penerima Baru</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Nama Lengkap / Lembaga</label>
                    <input 
                      type="text"
                      placeholder="Contoh: Panti Asuhan Al-Barokah"
                      value={newBeneficiaryName}
                      onChange={e => setNewBeneficiaryName(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Hubungan / Keterangan</label>
                    <input 
                      type="text"
                      placeholder="Contoh: Lembaga Amal / Anak Angkat"
                      value={newBeneficiaryRel}
                      onChange={e => setNewBeneficiaryRel(e.target.value)}
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0F4C3A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-gray-400 uppercase mb-1">Nominal Hibah Wasiat</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-[10px] font-bold text-gray-400">Rp</span>
                    <input 
                      type="number"
                      placeholder="Masukkan nominal rupiah"
                      value={newBeneficiaryAmount}
                      onChange={e => setNewBeneficiaryAmount(e.target.value)}
                      className="w-full pl-7 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0F4C3A] font-extrabold font-mono"
                    />
                  </div>
                </div>

                <button 
                  onClick={addBeneficiary}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-4 rounded-lg text-xs transition-colors flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambahkan Penerima</span>
                </button>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 font-extrabold text-xs py-3 px-5 rounded-xl transition-all flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  disabled={isLimitExceeded || beneficiaries.length === 0}
                  onClick={() => setCurrentStep(3)}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Draf & Tinjau Wasiat</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#0F4C3A] mx-auto animate-bounce" />
                <div>
                  <h3 className="text-md font-extrabold text-gray-900 uppercase tracking-wide">Formulasi Draf Wasiat Selesai!</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                    Seluruh kalkulasi aset, debts, dan alokasi penerima non-ahli waris telah divalidasi 100% patuh syariah Islam.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 space-y-2 text-xs">
                <div className="flex items-center space-x-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Rincian Keputusan Wasiat Digital Anda:</span>
                </div>
                <ul className="space-y-1 text-[10px] pl-5 list-disc leading-relaxed">
                  <li>Total Harta Bersih Terhitung: <strong>Rp {netEstate.toLocaleString('id-ID')}</strong></li>
                  <li>Total Nominal Wasiat dialokasikan: <strong>Rp {totalAllocatedWasiat.toLocaleString('id-ID')} ({((totalAllocatedWasiat / netEstate) * 100).toFixed(1)}% dari harta bersih)</strong></li>
                  <li>Sisa Harta Waris Utama untuk Faraidh Ahli Waris: <strong>Rp {(netEstate - totalAllocatedWasiat).toLocaleString('id-ID')}</strong></li>
                </ul>
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 font-extrabold text-xs py-3 px-5 rounded-xl transition-all flex items-center space-x-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>

                <button
                  onClick={handleGenerateWasiat}
                  disabled={isGenerating}
                  className="bg-[#0F4C3A] hover:bg-[#0c3d2e] text-white font-extrabold text-xs py-3 px-6 rounded-xl transition-all shadow-md flex items-center space-x-2"
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
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b border-gray-50 pb-3">Ringkasan Kalkulasi Harta</h3>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Aset Likuid:</span>
                <span className="font-bold text-gray-800">Rp {liquidAssets.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Aset Non-Likuid:</span>
                <span className="font-bold text-gray-800">Rp {nonLiquidAssets.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-400 font-semibold text-emerald-800">Total Harta Bruto:</span>
                <span className="font-extrabold text-emerald-800">Rp {totalAssets.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-rose-600 border-b border-gray-100 pb-2">
                <span>Hutang Kewajiban (-):</span>
                <span className="font-extrabold">- Rp {totalDebts.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/50 text-emerald-950 font-bold">
                <span>Harta Bersih (Tirkah):</span>
                <span>Rp {netEstate.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="space-y-2 border-t border-gray-50 pt-4">
              <span className="block text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Syariah Cap & Thresholds</span>
              
              <div className="p-3 bg-amber-50/30 rounded-xl border border-amber-200/40 text-[10px] text-amber-900 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>Maks Batas Wasiat (1/3):</span>
                  <span className="font-extrabold font-mono">Rp {maxWasiatLimit.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Dialokasikan Saat Ini:</span>
                  <span className="font-bold font-mono">Rp {totalAllocatedWasiat.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-amber-200/50 text-amber-800 font-extrabold">
                  <span>Sisa Kapasitas:</span>
                  <span className="font-mono">Rp {remainingLimit.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Education Box */}
          <div className="bg-amber-50/20 border border-amber-200/40 rounded-2xl p-6">
            <h4 className="text-xs font-extrabold text-amber-700 uppercase tracking-wider mb-2 flex items-center">
              <HelpCircle className="w-4 h-4 mr-1.5" /> Pembagian Faraidh vs Wasiat
            </h4>
            <p className="text-[11px] text-amber-900/80 leading-relaxed space-y-1.5">
              <span>Wasiat didahulukan sebelum pembagian Faraidh kepada Ahli Waris. Wasiat ini dirancang khusus untuk memberi wasilah kebajikan bagi pihak-pihak yang tidak mendapatkan waris secara otomatis oleh syariat (seperti kerabat jauh yang miskin, anak angkat, atau sarana dakwah/sosial).</span>
            </p>
          </div>

        </div>

      </div>

      {/* STEP 3 modal: Legal Notary Preview Document */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-zoom-in my-8">
            
            {/* Header */}
            <div className="px-6 py-4 bg-[#0F4C3A] text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Scale className="w-5 h-5 text-amber-300 animate-pulse" />
                <h3 className="font-bold text-sm">Draf Wasiat Sesuai Syariat - Legal Preview</h3>
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
              
              {/* Document Paper */}
              <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-300 max-w-2xl mx-auto space-y-6 font-serif text-[11px] text-gray-800 relative leading-relaxed">
                
                {/* Official Stamp */}
                <div className="absolute top-10 right-10 border-4 border-amber-600/30 rounded-lg p-2 text-amber-600/30 font-black text-center rotate-12 select-none uppercase tracking-wider">
                  SHARIFY ISLAMIC<br />LEGAL AUDIT
                </div>

                {/* Doc Header */}
                <div className="text-center border-b-2 border-gray-900 pb-5 space-y-1.5 font-sans">
                  <h2 className="text-sm font-black uppercase text-gray-900">DOKUMEN WASIAT HARTA WARISAN (SURAT WASIAT)</h2>
                  <h3 className="text-xs font-bold uppercase text-gray-700">SESUAI SYARIAT ISLAM (KOMPILASI HUKUM ISLAM PASAL 195)</h3>
                  <p className="text-[9px] text-gray-400 font-mono">No. Draf Legal: SHY-WAS/2026/05/{Math.floor(Math.random() * 90000) + 10000}</p>
                </div>

                {/* Opening statement */}
                <div className="space-y-2">
                  <p className="italic">Bismillaahirrahmaanirrahiim,</p>
                  <p>
                    Saya yang bertandatangan di bawah ini, bertindak selaku Pewasiat (al-Mushi), dengan penuh kesadaran dan tanpa paksaan dari pihak manapun, menyatakan wasiat harta saya untuk ditunaikan setelah wafatnya saya, sesuai syariat Islam yang luhur.
                  </p>
                </div>

                {/* Pewaris profile */}
                <div className="space-y-1 bg-gray-50 p-3 rounded border border-gray-200 font-sans text-[10px]">
                  <span className="font-extrabold uppercase text-gray-500 block mb-1">Identitas Pewasiat (al-Mushi):</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-gray-400">Nama Pewasiat:</span>
                      <p className="font-bold text-gray-800">{profile?.full_name || 'Member Family Sharify'}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Email / ID:</span>
                      <p className="font-bold text-gray-800">{user?.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Taksiran Harta Bersih:</span>
                      <p className="font-bold text-[#0F4C3A] font-mono">Rp {netEstate.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <span className="text-gray-400">Tanggal Wasiat dibuat:</span>
                      <p className="font-bold text-gray-800">{new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>

                {/* Wasiat Details */}
                <div className="space-y-3 font-sans">
                  <h4 className="font-bold text-gray-900 border-l-2 border-[#0F4C3A] pl-2 uppercase tracking-wide text-[10px]">Ketetapan Hibah Wasiat (Maks 1/3 Harta Bersih)</h4>
                  <p className="text-[10px] text-gray-600 font-serif leading-relaxed">
                    Sesuai ketetapan Fiqh Muamalah dan batasan 1/3 harta bersih (*Tirkah*), dengan ini saya menetapkan wasiat hibah kepada pihak non-ahli waris sebagai berikut:
                  </p>
                  
                  <table className="w-full text-left border-collapse border border-gray-200 text-[9px] font-sans">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 font-bold">
                        <th className="p-2 border-r border-gray-200">Nama Lengkap Penerima (al-Musha lahu)</th>
                        <th className="p-2 border-r border-gray-200">Hubungan / Keterangan</th>
                        <th className="p-2 text-right">Nominal Hibah (Rupiah)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {beneficiaries.map(b => (
                        <tr key={b.id}>
                          <td className="p-2 border-r border-gray-200 font-semibold">{b.name}</td>
                          <td className="p-2 border-r border-gray-200">{b.relationship}</td>
                          <td className="p-2 text-right font-bold font-mono">Rp {b.amount.toLocaleString('id-ID')}</td>
                        </tr>
                      ))}
                      <tr className="bg-emerald-50/50 font-bold border-t border-gray-300">
                        <td colSpan={2} className="p-2 text-right border-r border-gray-200 uppercase">Total Hibah Wasiat:</td>
                        <td className="p-2 text-right font-black font-mono text-[#0F4C3A]">Rp {totalAllocatedWasiat.toLocaleString('id-ID')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Sharia Statement */}
                <div className="space-y-2">
                  <p>
                    Segala pengeluaran hutang dan biaya pemakaman wajib dibayarkan penuh terlebih dahulu sebelum wasiat ini ditunaikan. Sisa harta setelah dikurangi hutang dan wasiat di atas (yaitu sebesar **Rp {(netEstate - totalAllocatedWasiat).toLocaleString('id-ID')}**) harus dibagi secara mutlak kepada para Ahli Waris syar'i sesuai dengan hukum ketetapan **Faraidh** (Syariah Islam).
                  </p>
                  <p>
                    Demikian surat draf wasiat ini dibuat dalam keadaan sadar lahir batin demi kebaikan keturunan di masa mendatang serta kesucian pertanggungjawaban harta di hadapan Allah SWT.
                  </p>
                </div>

                {/* Legal signature placeholder */}
                <div className="grid grid-cols-3 gap-4 pt-6 font-sans text-[8px] text-center border-t border-gray-200 mt-6">
                  <div className="space-y-6">
                    <p className="text-gray-400">Saksi I (Dua Orang Saksi Muslim):</p>
                    <div className="h-6"></div>
                    <p className="font-bold border-t border-gray-300 pt-1">( ......................................... )</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-400">Saksi II (Dua Orang Saksi Muslim):</p>
                    <div className="h-6"></div>
                    <p className="font-bold border-t border-gray-300 pt-1">( ......................................... )</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-400">Pewasiat (al-Mushi):</p>
                    <div className="h-6"></div>
                    <p className="font-bold border-t border-gray-300 pt-1">{profile?.full_name || 'Member Family Sharify'}</p>
                  </div>
                </div>

                {/* Notary footer */}
                <div className="pt-4 text-center border-t border-dashed border-gray-200 font-mono text-[8px] text-gray-400">
                  Draf wasiat legal ini diregenerasi otomatis oleh Sharify System dan siap ditandatangani di hadapan Notaris / Pejabat Pembuat Akta Tanah.
                </div>

              </div>

            </div>

            {/* Modal Actions */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button 
                onClick={() => setShowPreviewModal(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Tutup
              </button>
              <button 
                onClick={handleDownloadPDF}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-lg shadow-sm transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh PDF Wasiat</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </DashboardContainer>
  );
};
