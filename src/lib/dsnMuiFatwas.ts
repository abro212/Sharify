export interface FatwaItem {
  id: string;
  number: string;
  year: string;
  title: string;
  category: 'Perbankan' | 'Investasi & Pasar Modal' | 'Asuransi & Tabarru' | 'Fintech & Digital' | 'Akad & Jual Beli' | 'Zakat & Sosial' | 'Komoditas & Kontemporer';
  status: 'Halal' | 'Haram' | 'Mubah Syarat' | 'Boleh dengan Ketentuan';
  summary: string;
  keyPoints: string[];
}

export const DSN_MUI_FATWA_DATABASE: FatwaItem[] = [
  {
    id: 'fatwa-01',
    number: 'No. 01/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Giro Syariah',
    category: 'Perbankan',
    status: 'Boleh dengan Ketentuan',
    summary: 'Giro yang dibenarkan syariah adalah giro yang berdasarkan prinsip Wadi\'ah (Titipan) dan Mudharabah (Bagi Hasil).',
    keyPoints: [
      'Giro Wadi\'ah bersifat titipan murni yang dapat diambil sewaktu-waktu.',
      'Tidak ada imbalan yang disyaratkan di awal, namun bank boleh memberikan bonus (Athaya) secara sukarela.',
      'Giro Mudharabah menggunakan nisbah bagi hasil yang disepakati bersama dari pendapatan investasi bank.'
    ]
  },
  {
    id: 'fatwa-02',
    number: 'No. 02/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Tabungan Syariah',
    category: 'Perbankan',
    status: 'Boleh dengan Ketentuan',
    summary: 'Tabungan dibagi dua jenis: Tabungan Wadi\'ah (titipan tanpa syarat bunga/bonus tetap) dan Tabungan Mudharabah (investasi bagi hasil).',
    keyPoints: [
      'Tabungan Wadi\'ah: Modal dijamin aman, tidak ada bagi hasil tetap, bonus bersifat sukarela (tidak diperjanjikan).',
      'Tabungan Mudharabah: Berdasarkan nisbah bagi hasil yang jelas (misal 60:40), bukan persentase keuntungan dari modal tetap.'
    ]
  },
  {
    id: 'fatwa-03',
    number: 'No. 03/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Deposito Syariah',
    category: 'Perbankan',
    status: 'Boleh dengan Ketentuan',
    summary: 'Deposito syariah hanya boleh menggunakan akad Mudharabah (Mudharabah Muthlaqah atau Muqayyadah).',
    keyPoints: [
      'Keuntungan dibagi berdasarkan nisbah yang disepakati (bunga tetap hukumnya Riba dan Haram).',
      'Bank bertindak sebagai Mudharib (pengelola) dan nasabah sebagai Shahibul Maal (pemilik dana).'
    ]
  },
  {
    id: 'fatwa-04',
    number: 'No. 04/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Murabahah (Jual Beli Pembiayaan)',
    category: 'Akad & Jual Beli',
    status: 'Halal',
    summary: 'Jual beli barang dengan menegaskan harga perolehan (pokok) kepada pembeli dan pembeli membayarnya dengan harga lebih sebagai keuntungan (margin) yang disepakati.',
    keyPoints: [
      'Bank/Penjual harus memberitahukan harga pokok perolehan barang.',
      'Harga jual (Pokok + Margin Keuntungan) bersifat TETAP dan TIDAK BOLEH berubah/floating sepanjang masa angsuran.',
      'Barang harus dimiliki/dikuasai oleh penjual sebelum dijual kepada pembeli.'
    ]
  },
  {
    id: 'fatwa-07',
    number: 'No. 07/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Pembiayaan Mudharabah (Qiradh)',
    category: 'Investasi & Pasar Modal',
    status: 'Boleh dengan Ketentuan',
    summary: 'Akad kerjasama usaha antara pemilik dana (Shahibul Maal) yang menyediakan seluruh modal dengan pengelola (Mudharib).',
    keyPoints: [
      'Keuntungan dibagi sesuai nisbah yang disepakati di awal (misal 50%:50%).',
      'Kerugian finansial ditanggung oleh pemilik modal selama bukan disebabkan oleh kelalaian atau pelanggaran Mudharib.'
    ]
  },
  {
    id: 'fatwa-08',
    number: 'No. 08/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Pembiayaan Musyarakah',
    category: 'Investasi & Pasar Modal',
    status: 'Boleh dengan Ketentuan',
    summary: 'Pembiayaan berdasarkan akad kerjasama antara dua pihak atau lebih untuk suatu usaha tertentu, di mana masing-masing pihak memberikan kontribusi dana.',
    keyPoints: [
      'Keuntungan dibagi sesuai kesepakatan nisbah.',
      'Kerugian ditanggung secara proporsional sesuai porsi penyertaan modal masing-masing pihak.'
    ]
  },
  {
    id: 'fatwa-09',
    number: 'No. 09/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Pembiayaan Ijarah (Sewa-Menyewa)',
    category: 'Akad & Jual Beli',
    status: 'Halal',
    summary: 'Akad pemindahan hak guna (manfaat) atas suatu barang atau jasa dalam waktu tertentu melalui pembayaran sewa (ujrah), tanpa diikuti pemindahan kepemilikan barang.',
    keyPoints: [
      'Objek ijarah harus barang/jasa yang halal dan bernilai.',
      'Besarnya ujrah (sewa) dan jangka waktu pemanfaatan harus disepakati jelas di awal.'
    ]
  },
  {
    id: 'fatwa-10',
    number: 'No. 10/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Wakalah (Perwakilan)',
    category: 'Akad & Jual Beli',
    status: 'Halal',
    summary: 'Pemberian kuasa dari satu pihak (Muwakkil) kepada pihak lain (Wakil) untuk melaksanakan suatu tugas/transaksi atas nama Muwakkil.',
    keyPoints: [
      'Boleh menggunakan imbalan (Wakalah bil Ujrah).',
      'Tugas yang diwakilkan harus jelas dan tidak bertentangan dengan syariah.'
    ]
  },
  {
    id: 'fatwa-11',
    number: 'No. 11/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Kafalah (Penjaminan)',
    category: 'Akad & Jual Beli',
    status: 'Halal',
    summary: 'Akad penjaminan yang diberikan oleh penjamin (Kafiil) kepada pihak ketiga untuk memenuhi kewajiban pihak kedua/ditanggung (Makfuul \'anhu).',
    keyPoints: [
      'Penjamin dapat menerima imbalan jasa (ujrah) atas jaminan yang diberikan sepanjang tidak memberatkan.'
    ]
  },
  {
    id: 'fatwa-12',
    number: 'No. 12/DSN-MUI/IV/2000',
    year: '2000',
    title: 'Hawalah (Pengalihan Utang)',
    category: 'Akad & Jual Beli',
    status: 'Halal',
    summary: 'Pengalihan utang dari satu pihak yang berutang (Muhil) kepada pihak lain yang wajib menanggungnya (Muhal \'alaih).',
    keyPoints: [
      'Kedudukan piutang dan utang harus jelas serta disetujui oleh para pihak.'
    ]
  },
  {
    id: 'fatwa-13',
    number: 'No. 13/DSN-MUI/IX/2000',
    year: '2000',
    title: 'Uang Muka dalam Murabahah (Urbun)',
    category: 'Akad & Jual Beli',
    status: 'Boleh dengan Ketentuan',
    summary: 'Pembayaran uang muka (Urbun) oleh pembeli kepada penjual dalam transaksi Murabahah sebagai tanda keseriusan.',
    keyPoints: [
      'Jika akad berlanjut, uang muka memotong total harga jual.',
      'Jika pembeli membatalkan akad, uang muka dapat digunakan penjual untuk menutup kerugian riil akibat pembatalan.'
    ]
  },
  {
    id: 'fatwa-17',
    number: 'No. 17/DSN-MUI/IX/2000',
    year: '2000',
    title: 'Sanksi atas Nasabah Mampu yang Menunda-nunda Pembayaran (Ta\'zir & Gharamah)',
    category: 'Perbankan',
    status: 'Boleh dengan Ketentuan',
    summary: 'Ketentuan denda sanksi keterlambatan pembayaran bagi nasabah yang sengaja menunda bayar padahal mampu.',
    keyPoints: [
      'Denda berupa sanksi uang (Ta\'zir) BOLEH dikenakan HANYA kepada nasabah mampu yang sengaja menunda pembayaran.',
      'PENTING: Dana denda Ta\'zir TIDAK BOLEH diakui sebagai pendapatan bank/lembaga keuangan, melainkan WAJIB disalurkan 100% sebagai DANA KEBAJIKAN / DANA SOSIAL (Baitul Maal).',
      'Penambahan bunga/denda komersial yang diakui sebagai keuntungan lembaga adalah RIBA dan HARAM.'
    ]
  },
  {
    id: 'fatwa-19',
    number: 'No. 19/DSN-MUI/IV/2001',
    year: '2001',
    title: 'Al-Qardh (Pinjaman Tanpa Imbalan/Bunga)',
    category: 'Akad & Jual Beli',
    status: 'Halal',
    summary: 'Pinjaman dana sosial tanpa imbalan bunga di mana peminjam wajib mengembalikan pokok pinjaman pada waktu yang disepakati.',
    keyPoints: [
      'Peminjam hanya wajib mengembalikan nilai pokok pinjaman.',
      'Lembaga pengelola boleh mengenakan biaya administrasi nyata (real administrative cost), bukan persentase dari modal pinjaman.'
    ]
  },
  {
    id: 'fatwa-20',
    number: 'No. 20/DSN-MUI/IV/2001',
    year: '2001',
    title: 'Pedoman Investasi Reksa Dana Syariah',
    category: 'Investasi & Pasar Modal',
    status: 'Halal',
    summary: 'Investasi reksa dana syariah yang dikelola oleh Manajer Investasi pada portofolio efek syariah (saham syariah, sukuk, deposito syariah).',
    keyPoints: [
      'Portofolio wajib berupa instrumen keuangan yang halal dan lolos screening syariah.',
      'Harus dilakukan proses Purifikasi (cleansing) atas pendapatan non-halal jika terdapat pendapatan tidak disengaja.'
    ]
  },
  {
    id: 'fatwa-21',
    number: 'No. 21/DSN-MUI/X/2001',
    year: '2001',
    title: 'Pedoman Umum Asuransi Syariah (Takaful)',
    category: 'Asuransi & Tabarru',
    status: 'Halal',
    summary: 'Asuransi syariah menggunakan prinsip tolong-menolong (Ta\'awuni) dan saling menanggung (Takaful) melalui dana hibah kebajikan (Tabarru\').',
    keyPoints: [
      'Beda dengan Asuransi Konvensional yang mengandung Gharar (ketidakpastian), Riba, dan Maysir (perjudian).',
      'Peserta menghibahkan sebagian dana ke dalam rekening Tabarru\' untuk menolong peserta lain yang terkena musibah.',
      'Perusahaan asuransi bertindak sebagai pengelola akad Wakalah bil Ujrah atau Mudharabah.'
    ]
  },
  {
    id: 'fatwa-24',
    number: 'No. 24/DSN-MUI/III/2002',
    year: '2002',
    title: 'Jual Beli Mata Uang (Al-Sharf / Valas)',
    category: 'Komoditas & Kontemporer',
    status: 'Boleh dengan Ketentuan',
    summary: 'Jual beli mata uang asing (Valuta Asing / Valas) diperbolehkan untuk kebutuhan transaksi nyata, bukan spekulasi.',
    keyPoints: [
      'Transaksi Spot (penyerahan tunai saat itu juga) hukumnya BOLEH.',
      'Transaksi Forward, Option, dan Swap hukumnya HARAM karena mengandung spekulasi (maysir) dan gharar.'
    ]
  },
  {
    id: 'fatwa-25',
    number: 'No. 25/DSN-MUI/III/2002',
    year: '2002',
    title: 'Rahn (Gadai Syariah)',
    category: 'Perbankan',
    status: 'Halal',
    summary: 'Pinjaman dengan menjaminkan barang (Marhun) sebagai agunan utang (Marhun bih).',
    keyPoints: [
      'Penerima gadai tidak boleh mengambil keuntungan dari pinjaman (Riba).',
      'Biaya pemeliharaan dan penyimpanan barang gadai didasarkan pada akad Ijarah dan nilainya tidak boleh dikaitkan dengan besarnya pinjaman.'
    ]
  },
  {
    id: 'fatwa-26',
    number: 'No. 26/DSN-MUI/III/2002',
    year: '2002',
    title: 'Rahn Emas (Gadai Emas Syariah)',
    category: 'Perbankan',
    status: 'Halal',
    summary: 'Gadai emas dengan akad Rahn untuk agunan pinjaman (Qardh) dan biaya sewa tempat penyimpanan emas (Ijarah).',
    keyPoints: [
      'Biaya sewa simpan emas dihitung berdasarkan ukuran/berat emas dan lama penyimpanan, bukan persentase jumlah pinjaman.'
    ]
  },
  {
    id: 'fatwa-40',
    number: 'No. 40/DSN-MUI/X/2003',
    year: '2003',
    title: 'Pasar Modal & Pedoman Penapisan Efek Syariah',
    category: 'Investasi & Pasar Modal',
    status: 'Halal',
    summary: 'Pedoman umum kegiatan pasar modal syariah, mencakup saham, sukuk, dan kriteria kualifikasi emiten.',
    keyPoints: [
      'Jenis usaha emiten tidak bertentangan dengan syariah (bebas alkohol, judi, riba, makanan haram).',
      'Rasio Utang Berbasis Bunga dibanding Total Aset tidak melebihi 45%.',
      'Rasio Pendapatan Non-Halal dibanding Total Pendapatan tidak melebihi 10% (diperbarui jadi 5% pada Fatwa 80/2011).'
    ]
  },
  {
    id: 'fatwa-73',
    number: 'No. 73/DSN-MUI/XI/2008',
    year: '2008',
    title: 'Musyarakah Mutanaqisah (MMQ / KPR Syariah)',
    category: 'Perbankan',
    status: 'Halal',
    summary: 'Akad kepemilikan aset secara berserikat (syirkah) di mana porsi kepemilikan salah satu pihak berkurang karena dibeli secara bertahap oleh pihak lain.',
    keyPoints: [
      'Sangat populer digunakan untuk KPR Syariah.',
      'Bank dan nasabah bersama-sama membeli rumah. Nasabah menyewa bagian rumah milik bank (Ijarah) dan secara bertahap membeli porsi kepemilikan bank hingga rumah menjadi 100% milik nasabah.'
    ]
  },
  {
    id: 'fatwa-77',
    number: 'No. 77/DSN-MUI/V/2010',
    year: '2010',
    title: 'Jual Beli Emas secara Tidak Tunai (Cicil Emas)',
    category: 'Komoditas & Kontemporer',
    status: 'Boleh dengan Ketentuan',
    summary: 'Jual beli emas secara angsuran/cicilan/tidak tunai hukumnya BOLEH.',
    keyPoints: [
      'Emas tidak lagi diperlakukan sebagai mata uang (tsaman) melainkan komoditas (sil\'ah).',
      'Harga emas yang disepakati saat akad bersifat TETAP dan tidak boleh naik/turun selama masa cicilan.',
      'Emas yang dicicil dijadikan jaminan (Rahn) sampai seluruh angsuran lunas.'
    ]
  },
  {
    id: 'fatwa-80',
    number: 'No. 80/DSN-MUI/III/2011',
    year: '2011',
    title: 'Penerapan Prinsip Syariah dalam Mekanisme Perdagangan Saham Syariah di Bursa Efek',
    category: 'Investasi & Pasar Modal',
    status: 'Halal',
    summary: 'Mekanisme perdagangan saham syariah di Bursa Efek Indonesia (BEI/IDX), Indeks Saham Syariah Indonesia (ISSI), dan JII.',
    keyPoints: [
      'Akad perdagangan saham menggunakan akad Jual Beli (Bai\').',
      'Dilarang melakukan transaksi Short Selling (Bai\' al-Ma\'dum), Margin Trading (pinjaman berbunga untuk beli saham), Insider Trading, dan Najsy (penawaran palsu/pom-pom).'
    ]
  },
  {
    id: 'fatwa-116',
    number: 'No. 116/DSN-MUI/IX/2017',
    year: '2017',
    title: 'Uang Elektronik Syariah (E-Money / Digital Wallet Syariah)',
    category: 'Fintech & Digital',
    status: 'Boleh dengan Ketentuan',
    summary: 'Penyelenggaraan uang elektronik (e-wallet / saldo digital seperti GoPay, OVO, ShopeePay, DANA) berdasarkan prinsip syariah.',
    keyPoints: [
      'Akad antara pemegang kartu/e-money dengan penerbit saldo adalah akad Wadi\'ah (Titipan) atau Qardh (Pinjaman).',
      'Saldo e-money TIDAK BOLEH menghasilkan imbalan bunga.',
      'Diskon/promo yang diberikan penerbit BOLEH dinikmati nasabah sepanjang tidak diperjanjikan di awal sebagai imbalan dari saldo yang diendapkan.'
    ]
  },
  {
    id: 'fatwa-117',
    number: 'No. 117/DSN-MUI/II/2018',
    year: '2018',
    title: 'Layanan Pembiayaan Berbasis Teknologi Informasi (Fintech P2P Lending Syariah)',
    category: 'Fintech & Digital',
    status: 'Boleh dengan Ketentuan',
    summary: 'Penyelenggaraan Fintech Peer-to-Peer (P2P) Lending berdasarkan prinsip syariah.',
    keyPoints: [
      'Akad yang digunakan dapat berupa Wakalah bil Ujrah, Murabahah, Mudharabah, Musyarakah, atau Qardh.',
      'Penyelenggara fintech bertindak sebagai agen perantara (Wakil) yang memperoleh biaya layanan (ujrah).',
      'Bunga pinjaman online hukumnya HARAM; imbal hasil harus berbasis proyek riil / margin jual beli.'
    ]
  },
  {
    id: 'fatwa-140',
    number: 'No. 140/DSN-MUI/VIII/2021',
    year: '2021',
    title: 'Kartu Pembiayaan Syariah / Paylater Syariah',
    category: 'Fintech & Digital',
    status: 'Boleh dengan Ketentuan',
    summary: 'Penyelenggaraan fasilitas Paylater dan Kartu Pembiayaan berbasis prinsip syariah.',
    keyPoints: [
      'Memakai gabungan akad (Hibrid/Multi-Akad): Akad Qardh (dana talangan), Akad Ijarah (sewa sistem/jasa layanan), dan Akad Kafalah (penjaminan).',
      'Biaya layanan (admin fee) bersifat TETAP (flat cost) untuk mengganti biaya operasional riil, BUKAN persentase bunga dari jumlah tagihan yang tertunggak.',
      'Paylater konvensional dengan bunga berbunga harian hukumnya RIBA dan HARAM.'
    ]
  },
  {
    id: 'fatwa-kripto',
    number: 'Keputusan Ijtima Ulama Komisi Fatwa MUI VII Tahun 2021',
    year: '2021',
    title: 'Hukum Cryptocurrency / Kripto (Bitcoin, Ethereum, Altcoin)',
    category: 'Komoditas & Kontemporer',
    status: 'Haram',
    summary: 'Penggunaan cryptocurrency sebagai mata uang dan sebagai komoditas investasi spekulatif tanpa aset riil.',
    keyPoints: [
      'Sebagai mata uang: HARAM karena undang-undang Indonesia menetapkan Rupiah sebagai satu-satunya alat pembayaran sah, dan kripto mengandung gharar (ketidakpastian tinggi).',
      'Sebagai komoditas/aset investasi: HARAM jika tidak memiliki underlying asset riil, mengandung gharar, maysir (spekulasi/perjudian), dan dharar (risiko kerugian ekstrem).',
      'Hanya BOLEH jika berbentuk token yang memiliki underlying asset fisik riil yang jelas, memenuhi syarat sil\'ah (komoditas), dan teregulasi.'
    ]
  },
  {
    id: 'zakat-profesi',
    number: 'Fatwa MUI No. 3 Tahun 2003 & Peraturan BAZNAS',
    year: '2003',
    title: 'Zakat Penghasilan / Profesi & Saham',
    category: 'Zakat & Sosial',
    status: 'Halal',
    summary: 'Ketentuan nisab dan kadar zakat atas pendapatan pekerjaan/profesi dan portofolio investasi.',
    keyPoints: [
      'Nisab zakat penghasilan sepadan dengan 85 gram emas per tahun (atau ~7.19 gram emas per bulan).',
      'Kadar zakat yang wajib dikeluarkan adalah 2.5%.',
      'Zakat Saham dihitung dari total nilai pasar saham halal yang dimiliki selama 1 tahun (haul) melebihi nisab 85 gr emas x 2.5%.'
    ]
  }
];

export const getDsnMuiSystemKnowledge = (): string => {
  return `
KNOWLEDGE BASE FATWA DSN-MUI & KEPUTUSAN FATWA MUI TERKAIT KEUANGAN SYARIAH:

${DSN_MUI_DATABASE_FORMATTED}

ATURAN STRUKTUR & KETAT DALAM MENJAWAB ("ANTI-HALUSINASI / TIDAK NGARANG"):
1. SETIAP jawaban terkait hukum keuangan, investasi, perbankan, utang, pinjol, paylater, e-money, asuransi, atau zakat WAJIB mencantumkan NOMOR FATWA & JUDUL FATWA DSN-MUI (atau Keputusan MUI) yang relevan dari Knowledge Base di atas.
2. JIKA topik yang ditanyakan belum memiliki Fatwa DSN-MUI spesifik atau kasus kontemporer yang belum ada fatwanya, kamu WAJIB menyatakan secara jujur:
   "Belum ada fatwa spesifik DSN-MUI untuk kasus ini. Namun berdasarkan prinsip Fiqh Muamalah..." 
   SANGAT DILARANG MENELURSKAN / MENGARANG NOMOR FATWA ATAU ISI FATWA YANG TIDAK ADA.
3. FORMAT JAWABAN HARUS TERSTRUKTUR DENGAN BAGIAN LENGKAP:
   - 📌 **Kesimpulan Hukum**: (Halal / Haram / Boleh dengan Syarat)
   - 📜 **Landasan Fatwa DSN-MUI**: (Sebutkan Nomor Fatwa, Judul, & Tahun secara tepat)
   - 💡 **Ketentuan & Analisis Syariah**: (Jelaskan rukun, syarat, dan perbedaan dengan versi konvensional seperti Riba/Gharar/Maysir)
   - 🛠️ **Rekomendasi / Langkah Praktis**: (Panduan konkret untuk pengguna agar transaksi sesuai syariat)
`;
};

const DSN_MUI_DATABASE_FORMATTED = DSN_MUI_FATWA_DATABASE.map(f => 
  `• FATWA DSN-MUI: ${f.number} (${f.year}) - "${f.title}" [Status: ${f.status}]
   Kategori: ${f.category}
   Ringkasan: ${f.summary}
   Ketentuan Utama:
   ${f.keyPoints.map(k => `  - ${k}`).join('\n')}`
).join('\n\n');
