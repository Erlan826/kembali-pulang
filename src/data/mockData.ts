export interface FoundItem {
  id: string; // e.g. "INV-2024-0891"
  title: string;
  category: 'elektronik' | 'identitas' | 'kunci' | 'buku' | 'aksesoris' | 'lainnya';
  categoryLabel: string;
  location: string;
  storageLocation: string;
  foundDate: string; // e.g. "24 Okt 2024 • 09:30 WIB"
  rawDate: string;
  finderName: string;
  finderRole: string;
  imageUrl: string;
  imageAlt: string;
  publicDesc: string;
  secretClueSummary: string; // "Ciri Rahasia Disamarkan"
  secretClueRegistered: string; // actual internal details
  status: 'dilaporkan' | 'diverifikasi' | 'dalam_klaim' | 'siap_ambil' | 'selesai';
  statusLabel: string;
  claimId?: string;
  claimantName?: string;
  claimantNim?: string;
  claimantPhone?: string;
  claimantEmail?: string;
  claimantMajor?: string;
  claimantSecretAnswer?: string;
  aiMatchScore?: number;
  pickupCode?: string;
  bastNumber?: string;
}

export interface LostReport {
  id: string;
  title: string;
  category: string;
  location: string;
  locationLabel?: string;
  datetime: string;
  publicDesc: string;
  secretClue: string;
  contactWa: string;
  contactEmail: string;
  status: 'menunggu' | 'cocok' | 'selesai';
  statusLabel?: string;
  storageOrNote?: string;
  handlerNote?: string;
  imageUrl?: string;
  matchedItemId?: string;
}

export const INITIAL_LOST_REPORTS: LostReport[] = [
  {
    id: '#REP-2024-8102',
    title: 'KTM Mahasiswa & Kartu Flazz BCA',
    category: 'kartu',
    location: 'kantin-pusat',
    locationLabel: 'Fakultas Teknik Industri',
    datetime: '2024-10-22T11:20',
    publicDesc:
      'Ditemukan di Meja Selasar Kantin Barat. Pemilik terverifikasi via kartu identitas digital SSO dan serah terima tuntas dengan BAP resmi.',
    secretClue: 'NIM 13521098 • Kartu Flazz saldo Rp 85.000',
    contactWa: '+62 812-9876-5432',
    contactEmail: '13521098@std.stei.ac.id',
    status: 'selesai',
    statusLabel: 'Dikembalikan ke Pemilik',
    storageOrNote: 'No. Tiket Serah Terima: #TRX-4421',
    handlerNote: 'Diselesaikan oleh: Bripka Hartono (Satpam Pos Induk)',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA4RGFuNZ0oOTpQHJtJ_knLTL2mONkm42eYBhiMTFfQ8w4BID7xXgBUwWk27mDxRCCA1dbbxp8QscE6ATF1ps_55St7ujdB4l_cbls8pTC3Aq4Kmafdc9hsxySrnGo4Sj2KLHsK5Gxyr5pJ5kHn_L0OJ6wCBcUTE2esOnyKzWZjJHypDY8m1n3OmOwtQ0zWq2uf9fJeHpgkIjrMoIKvLuFMNsFgepqOwvj90L4274g',
  },
  {
    id: '#REP-2024-8740',
    title: 'Jaket Almamater Kampus Kuning (Size L)',
    category: 'botol',
    location: 'gku',
    locationLabel: 'Gedung Kuliah Umum (GKU)',
    datetime: '2024-10-23T15:10',
    publicDesc:
      'Tergantung di Kursi Kuliah 9104. Saku kiri berisi satu buah pulpen bertinta biru dan masker medis steril.',
    secretClue: 'Terdapat pin himpunan di kerah kiri dan inisial AZ di label dalam',
    contactWa: '+62 812-9876-5432',
    contactEmail: '13521098@std.stei.ac.id',
    status: 'cocok',
    statusLabel: 'Diverifikasi & Aktif di Temuan',
    storageOrNote: 'Penyimpanan: Rak Tekstil Locker 04 GKU',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBW7bJlECkXg-9voCd0T_-WKcp_3dLPHA5cIV7-pbWzYbmxJ2TUkYMcgtZaSqGPCOqGAqnxZ3G_afaFmQamJaeQEyf6DcD3E65VG5wmsqk2EV4p2wPZid_Livf9MQ9k0cnFWVcU3wvxHxd2uOx1ex2ZI5ZzMC6Z05B8-NwsTIlZ4RDXK1UNsDgbslyQbYrqo_7qUXitTwi4opyo-JvI2T7o4dZVLn6AzKkL-w7ZDyE',
  },
  {
    id: '#REP-2024-8902',
    title: 'Flashdisk Kingston DataTraveler 64GB',
    category: 'elektronik',
    location: 'lab-komputer',
    locationLabel: 'Lab Komputer Sains Lt. 3',
    datetime: '2024-10-24T13:15',
    publicDesc:
      'Tertinggal di Port PC No. 17. Terdapat gantungan tali merah kecil. Laporan masuk dan menunggu konfirmasi penerimaan fisik.',
    secretClue: 'Label volume USB bernama ZAKI_TA_2024',
    contactWa: '+62 812-9876-5432',
    contactEmail: '13521098@std.stei.ac.id',
    status: 'menunggu',
    statusLabel: 'Menunggu Verifikasi Awal',
    storageOrNote: 'Perkiraan inspeksi petugas: Hari ini pukul 14:00 WIB',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAdGy4xuj-BtykJK7Pvju2QqX5Sy6Yhm3f0LBRjU4s5lCDZ54PZYJI0OaexT-PeBWg1V1WTG4ShAajc4M4nylb8c3yraIWtWKcJliDVH2UedcZTRtpUcekiSxO3gD2mVKokSNRLdpnRiMpSmvZJzFcNGCMFanbhacwsJhXWFPniQeqrZb9sITy-85bnwov6qiNi6J0xuU1yzAiRWFpNWmnWF8pNpheoC_cEdKlKZp8',
  },
];

export const INITIAL_FOUND_ITEMS: FoundItem[] = [
  {
    id: 'INV-2024-0891',
    title: 'MacBook Air M2 13.6" Space Grey + Stiker GitHub',
    category: 'elektronik',
    categoryLabel: 'Elektronik Portabel',
    location: 'Perpustakaan Pusat Lt. 2 (Meja Belajar 14)',
    storageLocation: 'Posko K3L Perpustakaan Pusat Lt. 1 (Loker Khusus A-08)',
    foundDate: '24 Okt 2024 • 09:30 WIB',
    rawDate: '2024-10-24T09:30',
    finderName: 'Staf Sirkulasi & Satpam Gedung Barat',
    finderRole: 'CS Perpustakaan Pusat (Reg #8821)',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjQ2KkQcpnO7Moc8vXIKVDfhVnfx-HJyPtMa_ffK_yRgvrxGS8ePznyqZfDOSLKdz4TYpfqYiVquAYrZFXF8rzUAHV6Y0Vrg3o5JKEmo7vmWa4VCS6lkAavd6S_rqV3Kkddo_pXmpurTZTzHfkbgTS8dDMfuEi9qkt0Y2YNLYKGzlGUYob-VpLyOP8EGdJ-ijXRY-NOUt52Ci0RlQezIohD1Jbm6gGmuh9pQgzdcU',
    imageAlt: 'MacBook Air M2 Space Grey on library table',
    publicDesc: 'Dilengkapi stiker GitHub Developer di cover luar. Ditemukan tertinggal dalam kondisi tertutup rapi.',
    secretClueSummary: 'Ciri Rahasia Disamarkan',
    secretClueRegistered: 'Stiker GitHub Octocat di sudut kiri bawah casing belakang. Serial laser berakhiran 782X. Wallpaper foto kucing oranye (Milo) pakai toga wisuda.',
    status: 'diverifikasi',
    statusLabel: 'Diverifikasi (Siap Diklaim)',
    claimId: 'CLM-9032',
    claimantName: 'Ahmad Zaki',
    claimantNim: '13521098',
    claimantPhone: '+62 812-9876-5432',
    claimantEmail: '13521098@std.stei.ac.id',
    claimantMajor: 'STEI-K / Teknik Informatika',
    claimantSecretAnswer: 'Di balik laptop ada stiker octocat GitHub warna hitam putih kecil di pojok kiri bawah, agak terkelupas. Wallpaper foto kucing oren pakai toga wisuda mini. Serial number invoice: C02GN0...782X.',
    aiMatchScore: 88,
    pickupCode: 'TKT-8819',
    bastNumber: 'BAST/K3L-UI/2024/X/1142'
  },
  {
    id: 'INV-2024-0892',
    title: 'Dompet Kulit Cokelat & Kartu Flazz',
    category: 'identitas',
    categoryLabel: 'Dompet & Kartu',
    location: 'Kantin Timur (Meja 12 dekat Juice Bar)',
    storageLocation: 'Pos Jaga Kantin Timur (Loker B-02)',
    foundDate: '24 Okt 2024 • 11:15 WIB',
    rawDate: '2024-10-24T11:15',
    finderName: 'Petugas Kebersihan Kantin',
    finderRole: 'Cleaning Service Vendor',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxn_MmZvADKG7_ISYL_pN7CJDuh9Z4JyCekg6wtFaz6pwtpVyspDgw0mSX7oBWP1HaIX_HI3sq8G7BWNOWF99_SuXSU6OmP-VhofErhmhO0SLAI4bLK7g4CKydfiwSD0DXUw6A91xe2FPD6YLpPYEgDwujK4jwFpkxbjdqzlX6Y4M0nqpJa9VDR0lJOFMnOPwnnc2TMCYWDwkN48qQcDyonDOPRm2irG8Sj8LLxy8',
    imageAlt: 'Brown leather bi-fold wallet on table',
    publicDesc: 'Dompet kulit warna cokelat tua lipat dua, terdapat saku kartu dan resleting koin di bagian dalam.',
    secretClueSummary: 'Identitas Disamarkan',
    secretClueRegistered: 'Terdapat kartu Flazz edisi Batman, foto polaroid di balik kartu identitas, dan uang tunai pecahan Rp 50.000 sebanyak dua lembar.',
    status: 'dalam_klaim',
    statusLabel: 'Dalam Proses Klaim',
    claimId: 'CLM-8839',
    claimantName: 'Rian Pratama',
    claimantNim: '18220012',
    claimantPhone: '+62 813-8821-3940',
    claimantEmail: '18220012@std.stei.ac.id',
    claimantMajor: 'Sistem & Teknologi Informasi',
    aiMatchScore: 92
  },
  {
    id: 'INV-2024-0888',
    title: 'KTM Mahasiswa Teknik Informatika (Ahmad F.)',
    category: 'identitas',
    categoryLabel: 'Dompet & Kartu Identitas',
    location: 'GKB A (Lt. 1 Selasar)',
    storageLocation: 'Biro Kemahasiswaan Sayap Timur',
    foundDate: '23 Okt 2024 • 14:00 WIB',
    rawDate: '2024-10-23T14:00',
    finderName: 'Mahasiswa STEI',
    finderRole: 'Pelapor Mandiri',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5I5QbIrH3L0lhgu7m5izBssE17meuIVTPoc5RIdFWWnA9ryNruN4JjFzPz3fx6ltWfeXifOfEEvf7KQNz3TuW0uhXTo3VY9OLyit97hSU4ppJQqQYo9HRq_fDUwOKPB-JkfActnmyxdAZebhDpr0tylH81JyDxsTv5Zw95G8TuVygYR2ws9bNXw2ddaJXaEizmBu-nHr0n80wgXuoEbaALoFHU0VpdHbY2cVmqiA',
    imageAlt: 'University student smart card identity on counter',
    publicDesc: 'KTM Mahasiswa program sarjana, dengan lanyard biru universitas dan kartu akses RFID.',
    secretClueSummary: 'Pengambilan via KTP / Akun SSO',
    secretClueRegistered: 'Nama lengkap Ahmad Fathoni, NIM 13521045, ada stiker hologram BEM di sudut kartu.',
    status: 'diverifikasi',
    statusLabel: 'Diverifikasi (Siap Diklaim)'
  },
  {
    id: 'INV-2024-0885',
    title: 'Headphone Sony WH-1000XM4 Hitam Doff',
    category: 'elektronik',
    categoryLabel: 'Elektronik & Gadget',
    location: 'Coworking Perpustakaan Pusat Lt. 1',
    storageLocation: 'Posko K3L Perpustakaan',
    foundDate: '23 Okt 2024 • 16:30 WIB',
    rawDate: '2024-10-23T16:30',
    finderName: 'Staf Layanan Coworking',
    finderRole: 'Pustakawan',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDnPi7ijdBQxdsPuF_kwlXqT_qVjlDveWknshkSYGvN6ZrwPeBmSzQBdfmWmc8QdkAGqN7JlG9d9D9I1UoKYoG1mQ9Oz99TPcXD1LpE4GujaEVEEI7BYHWPTRQy6Tj6BgXLD_joJIO4ABgEHtQNNC7UQegPJm2_gK7Adv_huweIV00LvvICXJlpxcRTKi6IQZVpp0s6dl2r4tfMv3f12QibJz9Q2OXV75-sFb82cug',
    imageAlt: 'Matte black over ear headphones in case',
    publicDesc: 'Headphone over-ear nirkabel di dalam pouch hardcase ritsleting abu-abu. Termasuk kabel audio jack 3.5mm dan adapter pesawat.',
    secretClueSummary: 'Verifikasi Riwayat Bluetooth',
    secretClueRegistered: 'Nama perangkat bluetooth di HP adalah "Zaki-XM4". Earpad kanan ada sedikit goresan dekat tombol custom.',
    status: 'diverifikasi',
    statusLabel: 'Diverifikasi (Siap Diklaim)'
  },
  {
    id: 'INV-2024-0879',
    title: 'Kunci Motor Honda Vario + Gantungan Akrilik',
    category: 'kunci',
    categoryLabel: 'Kunci & Kendaraan',
    location: 'Parkir Barat Rektorat',
    storageLocation: 'Pos Keamanan Gerbang Utama',
    foundDate: '22 Okt 2024 • 17:00 WIB',
    rawDate: '2024-10-22T17:00',
    finderName: 'Petugas Parkir',
    finderRole: 'Satpam Gerbang Barat',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCaTzTAntlr74hStB6KQtj8g2Gt1nY88Fn0fimHvXdiIqGsL8TVr2akDLf77uXuTc3ANPgeXMtuy80_7M-xeflTzcud5hiTanJhoetAfxuz7757fh3SNwH14NBDfkBxvQKYCrpjQEUvyRwlV86xDxXlO0d3VZjPqTsHiaErjgkJ0J_oDjuKMlqPpjXs-SEdKOweoSjzry0xf9QJL_4XgKtNcqB0GD6hIg6l9us_QgI',
    imageAlt: 'Motorcycle smart key with acrylic keychain',
    publicDesc: 'Smartkey remote motor Honda warna hitam dengan gantungan akrilik anime dan anak kunci gembok cakram.',
    secretClueSummary: 'BAST No: BAST/10/24-019 Selesai',
    secretClueRegistered: 'Karakter akrilik adalah Anya Forger, remote keyless memiliki kode nomor darurat tersembunyi di label kecil.',
    status: 'selesai',
    statusLabel: 'Dikembalikan ke Pemilik'
  },
  {
    id: 'INV-2024-0876',
    title: 'Kalkulator Ilmiah Casio fx-991EX Classwiz',
    category: 'buku',
    categoryLabel: 'Alat Belajar & Lab',
    location: 'Lab Kimia Dasar Gedung C',
    storageLocation: 'Pos Jaga FMIPA',
    foundDate: '22 Okt 2024 • 13:20 WIB',
    rawDate: '2024-10-22T13:20',
    finderName: 'Asisten Laboratorium',
    finderRole: 'Asisten Lab',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBJUEFo-lOmQmtgY19IX-bSy1XjfGAN39GwThcIVhnhbJqHln8ac0LQO96tgTVZPp5_5GAgmZPNYBENilGkd7heJXiBBeghVGBbtw6mAmHYxDf7TJBDDO_494-AVA9IIKyO6QxL5nWRspxEZiN8-bmHa3AnUNdBKdeBPVuhPW4sl4OSAoZHOGgG8zyHfoioT30-uhdAlWRwwyWvmZHb1H2qD1PFuZeJ4awYLtTPNh8',
    imageAlt: 'Scientific solar calculator on desk',
    publicDesc: 'Kalkulator solar scientific warna hitam dengan cover slide hardcase putih.',
    secretClueSummary: 'Verifikasi Inisial pada Penutup',
    secretClueRegistered: 'Terdapat tulisan tip-ex inisial "NZ - 2022" di bagian dalam penutup slide kalkulator.',
    status: 'diverifikasi',
    statusLabel: 'Diverifikasi (Siap Diklaim)'
  },
  {
    id: 'FND-202410-882',
    title: 'Botol Tumbler Corkcicle Bronze 750ml',
    category: 'aksesoris',
    categoryLabel: 'Botol & Pakaian',
    location: 'Gedung Perpustakaan Pusat (Lt. 2 Meja B-14)',
    storageLocation: 'Posko K3L Perpustakaan',
    foundDate: '24 Okt 2024 • 14:00 WIB',
    rawDate: '2024-10-24T14:00',
    finderName: 'Bripka Sunarto',
    finderRole: 'Satpam Perpustakaan',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRR4ibuaLz_5mgWD50z4nDP7r-TCo_uaFDDcb-1FM-GGQTP4nnwK3ZphbVjKkhghJGynTa9CGxXIWJxAeMRtRp9W0XT38BG_Zkbrt5GGAQQ6VfYIuBeac1RquS9MczuuVSlo_EEJ1dZanhcCxasmHzxKOG8WobJGELB7_Tv8J92acI4iJLRrBxa8jI1MKGokw-I7gfTEiBN5jak46lX9SPrkaM2nOEd1uNSXbd2WE',
    imageAlt: 'Corkcicle copper tumbler on library desk',
    publicDesc: 'Tumbler metallic copper / bronze ukuran 750ml, finishing doff dengan sedikit lecet di bagian bawah.',
    secretClueSummary: 'Enkripsi Rahasia Aktif',
    secretClueRegistered: 'Bagian dalam tutup ada goresan huruf Z diukir pakai jarum, karet seal warna sedikit oranye karena teh bunga.',
    status: 'diverifikasi',
    statusLabel: 'Diverifikasi (Siap Diklaim)'
  },
  {
    id: 'FND-1042',
    title: 'Earphone TWS Anker Soundcore Life P2i Hitam',
    category: 'elektronik',
    categoryLabel: 'Elektronik Premium',
    location: 'Selasar Gedung Perkuliahan C Lt. 1',
    storageLocation: 'Posko Keamanan Sayap C (Petugas: M. Rasyid)',
    foundDate: '24 Okt 2024 • 10:00 WIB',
    rawDate: '2024-10-24T10:00',
    finderName: 'M. Rasyid',
    finderRole: 'Satpam Gedung C',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDODmADYmeKhmdM1JaA6MRX3DFBBdxjdeFmQIcMWwanhmxf9-2-042IpDkYFRCBJskuFYFy0IdoLiC_P-O9xm5KAHDnMQQnZmx0BDYUz2CSN7EGA3cm4_0xCEPUr293XBWAr52G8iMhtkj-x53OZHdH_s_EqODS_DqtbNl--vAwmYZcDBovrBQu1ZLEM7YcsbcrDjvs9KbXY6STGMEwsBN-9elMf-K2tfRToukWVas',
    imageAlt: 'Black wireless earbuds with case',
    publicDesc: 'Sepasang earphone TWS warna hitam doff lengkap dalam charging case. Masih dalam kondisi baterai aktif.',
    secretClueSummary: 'Verifikasi Perangkat Bluetooth',
    secretClueRegistered: 'Nama koneksi Bluetooth adalah "Zaki_Sound_P2i", terdapat goresan halus di sisi engsel belakang dekat port Type-C.',
    status: 'dalam_klaim',
    statusLabel: 'Dalam Proses Klaim',
    claimId: 'CLM-9032',
    claimantName: 'Ahmad Zaki',
    claimantNim: '13521098'
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Ahmad Zaki Pratama',
  nim: '13521098',
  program: 'Teknik Informatika (S1 Reguler)',
  faculty: 'Sekolah Teknik Elektro & Informatika (STEI-K)',
  email: '13521098@std.stei.ac.id',
  phone: '+62 812-9876-5432',
  status: 'Mahasiswa Reguler Aktif',
  ssoId: 'IDN-UNIV-2108561042',
  integrityScore: 98,
  preferredPosko: 'perpus-pusat',
  maskPublicName: true,
  itemsFoundReturned: 3,
  itemsPersonalRecovered: 1,
  notifications: {
    whatsappInstant: true,
    emailSummary: true,
    retentionWarning: true,
  }
};
