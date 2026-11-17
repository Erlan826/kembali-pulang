import React, { useRef, useState } from 'react';
import { FoundItem, UserProfile, getInitials } from '../data/mockData';

interface ReportFoundViewProps {
  onNavigate: (view: string) => void;
  onItemAdded: (newItem: FoundItem) => void;
  userProfile: UserProfile;
}

const DEFAULT_CATEGORY_IMAGES: Record<FoundItem['category'], string> = {
  elektronik:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAjQ2KkQcpnO7Moc8vXIKVDfhVnfx-HJyPtMa_ffK_yRgvrxGS8ePznyqZfDOSLKdz4TYpfqYiVquAYrZFXF8rzUAHV6Y0Vrg3o5JKEmo7vmWa4VCS6lkAavd6S_rqV3Kkddo_pXmpurTZTzHfkbgTS8dDMfuEi9qkt0Y2YNLYKGzlGUYob-VpLyOP8EGdJ-ijXRY-NOUt52Ci0RlQezIohD1Jbm6gGmuh9pQgzdcU',
  identitas:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuC5I5QbIrH3L0lhgu7m5izBssE17meuIVTPoc5RIdFWWnA9ryNruN4JjFzPz3fx6ltWfeXifOfEEvf7KQNz3TuW0uhXTo3VY9OLyit97hSU4ppJQqQYo9HRq_fDUwOKPB-JkfActnmyxdAZebhDpr0tylH81JyDxsTv5Zw95G8TuVygYR2ws9bNXw2ddaJXaEizmBu-nHr0n80wgXuoEbaALoFHU0VpdHbY2cVmqiA',
  kunci:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCaTzTAntlr74hStB6KQtj8g2Gt1nY88Fn0fimHvXdiIqGsL8TVr2akDLf77uXuTc3ANPgeXMtuy80_7M-xeflTzcud5hiTanJhoetAfxuz7757fh3SNwH14NBDfkBxvQKYCrpjQEUvyRwlV86xDxXlO0d3VZjPqTsHiaErjgkJ0J_oDjuKMlqPpjXs-SEdKOweoSjzry0xf9QJL_4XgKtNcqB0GD6hIg6l9us_QgI',
  buku:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJUEFo-lOmQmtgY19IX-bSy1XjfGAN39GwThcIVhnhbJqHln8ac0LQO96tgTVZPp5_5GAgmZPNYBENilGkd7heJXiBBeghVGBbtw6mAmHYxDf7TJBDDO_494-AVA9IIKyO6QxL5nWRspxEZiN8-bmHa3AnUNdBKdeBPVuhPW4sl4OSAoZHOGgG8zyHfoioT30-uhdAlWRwwyWvmZHb1H2qD1PFuZeJ4awYLtTPNh8',
  aksesoris:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRR4ibuaLz_5mgWD50z4nDP7r-TCo_uaFDDcb-1FM-GGQTP4nnwK3ZphbVjKkhghJGynTa9CGxXIWJxAeMRtRp9W0XT38BG_Zkbrt5GGAQQ6VfYIuBeac1RquS9MczuuVSlo_EEJ1dZanhcCxasmHzxKOG8WobJGELB7_Tv8J92acI4iJLRrBxa8jI1MKGokw-I7gfTEiBN5jak46lX9SPrkaM2nOEd1uNSXbd2WE',
  lainnya:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBRR4ibuaLz_5mgWD50z4nDP7r-TCo_uaFDDcb-1FM-GGQTP4nnwK3ZphbVjKkhghJGynTa9CGxXIWJxAeMRtRp9W0XT38BG_Zkbrt5GGAQQ6VfYIuBeac1RquS9MczuuVSlo_EEJ1dZanhcCxasmHzxKOG8WobJGELB7_Tv8J92acI4iJLRrBxa8jI1MKGokw-I7gfTEiBN5jak46lX9SPrkaM2nOEd1uNSXbd2WE',
};

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca berkas gambar.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
      img.onload = () => {
        const maxWidth = 960;
        const scale = img.width > maxWidth ? maxWidth / img.width : 1;
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const ReportFoundView: React.FC<ReportFoundViewProps> = ({
  onNavigate,
  onItemAdded,
  userProfile,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<FoundItem['category']>('elektronik');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [publicDesc, setPublicDesc] = useState('');
  const [secretClue, setSecretClue] = useState('');
  const [isMasked, setIsMasked] = useState(false);
  const [custodyOption, setCustodyOption] = useState<'posko' | 'personal'>('posko');
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdItemId, setCreatedItemId] = useState('');

  const handleFileSelected = async (file?: File | null) => {
    if (!file) return;
    setFormError(null);

    if (!file.type.startsWith('image/')) {
      setFormError('Berkas harus berupa foto (JPG, PNG, atau WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFormError('Ukuran foto maksimal 10MB.');
      return;
    }

    try {
      const compressedDataUrl = await compressImageFile(file);
      setUploadedPhotoUrl(compressedDataUrl);
      setUploadedFileName(file.name);
      const sizeKb = Math.max(1, Math.round(file.size / 1024));
      setUploadedFileSize(sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`);
    } catch {
      setFormError('Foto gagal diproses. Silakan pilih file gambar lainnya.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !publicDesc.trim() || !secretClue.trim()) {
      setFormError('Mohon lengkapi seluruh kolom wajib bertanda bintang (*).');
      return;
    }

    setFormError(null);
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `INV-${new Date().getFullYear()}-${randomNum}`;
    setCreatedItemId(newId);

    const displayFinder = userProfile.maskPublicName
      ? `Pelapor ${getInitials(userProfile.name)} (SSO Terverifikasi)`
      : `${userProfile.name} (NIM: ${userProfile.nim})`;

    const newItem: FoundItem = {
      id: newId,
      title: title.trim(),
      category,
      categoryLabel:
        category === 'elektronik'
          ? 'Elektronik & Gadget'
          : category === 'identitas'
          ? 'Dompet & Kartu'
          : category === 'kunci'
          ? 'Kunci & Kendaraan'
          : category === 'buku'
          ? 'Buku & ATK'
          : category === 'aksesoris'
          ? 'Botol & Aksesoris'
          : 'Barang Lainnya',
      location: location.trim(),
      storageLocation:
        custodyOption === 'posko'
          ? 'Posko K3L Perpustakaan Pusat (Loker Baru)'
          : 'Dibawa Penemu (Siap Hubungi Posko)',
      foundDate: `Hari ini • ${time} WIB`,
      rawDate: `${date}T${time}`,
      finderName: displayFinder,
      finderRole: 'Mahasiswa / Pelapor Jujur',
      imageUrl: uploadedPhotoUrl || DEFAULT_CATEGORY_IMAGES[category],
      imageAlt: title.trim(),
      publicDesc: publicDesc.trim(),
      secretClueSummary: 'Ciri Rahasia Disamarkan',
      secretClueRegistered: secretClue.trim(),
      status: 'diverifikasi',
      statusLabel: 'Diverifikasi (Siap Diklaim)',
    };

    onItemAdded(newItem);
    setShowSuccessModal(true);
  };

  const resetForm = () => {
    setTitle('');
    setLocation('');
    setPublicDesc('');
    setSecretClue('');
    setUploadedPhotoUrl(null);
    setUploadedFileName('');
    setUploadedFileSize('');
    setFormError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#131b2e] text-[12px] font-bold uppercase tracking-wider">
            <span className="material-symbols-outlined text-[16px] text-[#00a472]">
              volunteer_activism
            </span>
            <span>Integritas Kampus Terverifikasi</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#091426] tracking-tight">
            Formulir Lapor Penemuan Barang Kampus
          </h1>
          <p className="text-[14px] text-[#45474c] leading-relaxed">
            Terima kasih telah berpartisipasi menjaga kejujuran dan integritas lingkungan akademik. Data temuan Anda akan langsung terdaftar di katalog publik & disinkronkan ke posko.
          </p>
        </div>

        <div className="flex items-center gap-3 p-3 bg-[#f2f3ff] rounded-2xl border border-[#eaedff] flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#1d4ed8]">
            <span className="material-symbols-outlined text-2xl">shield_person</span>
          </div>
          <div className="flex flex-col text-[12px]">
            <span className="uppercase text-[#45474c] font-bold">Petugas Pelapor</span>
            <span className="font-bold text-[#091426]">
              {userProfile.name.split(' ').slice(0, 2).join(' ')} (NIM: {userProfile.nim})
            </span>
            <span className="font-mono text-[#00a472] flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3]"></span>
              SSO Terautentikasi
            </span>
          </div>
        </div>
      </div>

      {/* Stepper Indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-1.5 bg-[#f2f3ff] rounded-2xl mb-8 border border-[#eaedff]">
        <div className="flex items-center gap-2.5 p-3 bg-white rounded-xl shadow-xs">
          <div className="w-6 h-6 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-bold text-[11px]">
            1
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#091426] font-bold">Identifikasi Barang</span>
            <span className="text-[11px] text-[#45474c]">Foto & Deskripsi Umum</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3">
          <div className="w-6 h-6 rounded-full bg-[#dae2fd] text-[#091426] flex items-center justify-center font-bold text-[11px]">
            2
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#45474c] font-bold">Validasi Ciri Rahasia</span>
            <span className="text-[11px] text-[#45474c]">Enkripsi Khusus Posko</span>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-3">
          <div className="w-6 h-6 rounded-full bg-[#dae2fd] text-[#091426] flex items-center justify-center font-bold text-[11px]">
            3
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] text-[#45474c] font-bold">Fisik & Penyerahan</span>
            <span className="text-[11px] text-[#45474c]">Tiket Serah Terima</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {formError && (
          <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] flex items-center gap-2.5 text-[13px] font-semibold">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{formError}</span>
          </div>
        )}

        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-[#eaedff] space-y-6">
          {/* SECTION 1: Bukti Visual & Foto Temuan */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[16px] font-bold text-[#091426] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8]">add_a_photo</span>
                Unggah Dokumentasi Barang Temuan
              </label>
              <span className="text-[11px] font-bold text-[#45474c] uppercase">
                JPG, PNG, WEBP (Maks 10MB)
              </span>
            </div>
            <p className="text-[13px] text-[#45474c] mb-3">
              Ambil foto barang dari sudut depan dan samping secara jelas untuk memudahkan pencocokan visual oleh koordinator.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleFileSelected(e.target.files?.[0])}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Dropzone / Preview Area */}
              {uploadedPhotoUrl ? (
                <div className="md:col-span-2 p-4 rounded-2xl bg-[#f2f3ff] border border-[#dae2fd] flex flex-col sm:flex-row gap-4 items-center">
                  <div className="w-full sm:w-44 h-40 rounded-xl overflow-hidden bg-white border border-[#eaedff] flex-shrink-0">
                    <img
                      src={uploadedPhotoUrl}
                      alt="Pratinjau foto barang temuan"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 space-y-2 text-center sm:text-left">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00301e] text-[#6ffbbe] text-[11px] font-bold">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Foto Siap Dipublikasikan
                    </div>
                    <p className="text-[13px] font-bold text-[#091426] truncate">{uploadedFileName}</p>
                    <p className="text-[11px] text-[#45474c]">Ukuran asli: {uploadedFileSize} • Watermark otomatis aktif</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3 py-1.5 rounded-lg bg-[#1d4ed8] text-white text-[12px] font-semibold hover:bg-[#1d4ed8]/90 transition-colors cursor-pointer"
                      >
                        Ganti Foto
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedPhotoUrl(null);
                          setUploadedFileName('');
                          setUploadedFileSize('');
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="px-3 py-1.5 rounded-lg bg-white text-[#ba1a1a] border border-[#ba1a1a]/20 text-[12px] font-semibold hover:bg-[#ffdad6] transition-colors cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileSelected(e.dataTransfer.files?.[0]);
                  }}
                  className={`md:col-span-2 group relative p-8 rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center text-center border-2 border-dashed ${
                    isDragging
                      ? 'bg-[#dce1ff] border-[#1d4ed8]'
                      : 'bg-[#f2f3ff] hover:bg-[#e2e7ff] border-[#c5c6cd]'
                  }`}
                >
                  <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-[#1d4ed8] mb-2 group-hover:scale-110 transition-transform shadow-xs">
                    <span className="material-symbols-outlined text-3xl">cloud_upload</span>
                  </div>
                  <h3 className="text-[15px] font-bold text-[#091426]">
                    Ambil Foto / Seret Berkas ke Sini
                  </h3>
                  <p className="text-[12px] text-[#45474c] max-w-sm mt-1 mb-3">
                    Klik untuk memilih foto dari perangkat Anda (opsional, jika dikosongkan akan memakai gambar standar kategori).
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="px-4 py-1.5 rounded-lg bg-[#1d4ed8] text-white font-semibold text-[12px] shadow-sm">
                      Pilih Berkas Foto
                    </span>
                    <span className="text-[11px] text-[#45474c]">atau seret foto langsung</span>
                  </div>
                </div>
              )}

              {/* Guidance Card */}
              <div className="p-4 bg-[#eaedff] rounded-2xl flex flex-col justify-between border border-[#dae2fd]">
                <div>
                  <span className="text-[11px] uppercase text-[#1d4ed8] font-bold">
                    Panduan Pengambilan Foto
                  </span>
                  <ul className="mt-2 space-y-1.5 text-[12px] text-[#45474c]">
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#00a472] mt-0.5">
                        check_circle
                      </span>
                      <span>Pastikan pencahayaan cukup terang.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#00a472] mt-0.5">
                        check_circle
                      </span>
                      <span>Tampilkan keutuhan bentuk luar & warna.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="material-symbols-outlined text-[16px] text-[#ba1a1a] mt-0.5">
                        cancel
                      </span>
                      <span>
                        <strong>Jangan</strong> foto nomor kartu identitas atau uang tunai secara terbuka.
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="mt-3 p-2 bg-white rounded-lg flex items-center gap-2 text-[#45474c] text-[11px] font-mono shadow-xs">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">verified</span>
                  <span>Watermark: KAMPUS-HASH-VERIFIED</span>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: Metadata Barang & Lokasi */}
          <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nama Barang */}
            <div className="space-y-1 md:col-span-2">
              <label className="text-[13px] font-bold text-[#091426] flex items-center gap-1" htmlFor="found-item-title">
                Nama / Judul Barang Temuan <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#091426] text-[14px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                id="found-item-title"
                placeholder="Contoh: Kamera Mirrorless Sony A6400 + Lensa Kit"
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <span className="text-[11px] text-[#45474c]">
                Beri nama ringkas yang mendeskripsikan tipe dan merk barang utama.
              </span>
            </div>

            {/* Kategori Dropdown */}
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-[#091426]" htmlFor="found-item-category">
                Kategori Barang <span className="text-[#ba1a1a]">*</span>
              </label>
              <div className="relative">
                <select
                  className="w-full px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#091426] text-[13px] appearance-none focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] cursor-pointer transition-all border border-[#eaedff]"
                  id="found-item-category"
                  required
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FoundItem['category'])}
                >
                  <option value="elektronik">Elektronik (Laptop, Ponsel, Kamera, Audio)</option>
                  <option value="identitas">Dokumen / Kartu (KTM, KTP, STNK, Buku Tugas)</option>
                  <option value="kunci">Kunci (Motor, Mobil, Kosan, Locker)</option>
                  <option value="buku">Tas, Ransel, ATK, Binder</option>
                  <option value="aksesoris">Aksesoris, Kacamata, Jam Tangan, Tumbler</option>
                  <option value="lainnya">Lain-lain</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-3 text-[#45474c] pointer-events-none text-[18px]">
                  arrow_drop_down
                </span>
              </div>
            </div>

            {/* Lokasi Spesifik Ditemukan */}
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-[#091426]" htmlFor="found-item-location">
                Lokasi Spesifik Ditemukan <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#091426] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                id="found-item-location"
                placeholder="Ketik lokasi atau klik rekomendasi di bawah..."
                required
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  'Perpustakaan Pusat Meja 14',
                  'Gedung A Lt. 3',
                  'Mushola Lt. Dasar',
                  'Kantin Boulevard',
                ].map((quickLoc) => (
                  <button
                    key={quickLoc}
                    type="button"
                    onClick={() => setLocation(quickLoc)}
                    className="px-2.5 py-0.5 rounded-full bg-[#eaedff] hover:bg-[#dae2fd] text-[11px] font-semibold text-[#45474c] transition-colors cursor-pointer"
                  >
                    + {quickLoc}
                  </button>
                ))}
              </div>
            </div>

            {/* Tanggal & Waktu */}
            <div className="space-y-1">
              <label className="text-[13px] font-bold text-[#091426]" htmlFor="found-item-date">
                Tanggal Ditemukan <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#091426] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                id="found-item-date"
                required
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[13px] font-bold text-[#091426]" htmlFor="found-item-time">
                Waktu / Jam Estimasi <span className="text-[#ba1a1a]">*</span>
              </label>
              <input
                className="w-full px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#091426] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                id="found-item-time"
                required
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>

            {/* Deskripsi Terbuka untuk Publik */}
            <div className="space-y-1 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-[#091426]" htmlFor="found-public-desc">
                  Deskripsi Terbuka untuk Publik <span className="text-[#ba1a1a]">*</span>
                </label>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1d4ed8] bg-[#eaedff] px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[13px]">public</span>
                  Terlihat di Beranda Temuan
                </span>
              </div>
              <textarea
                className="w-full px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#091426] text-[13px] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all resize-none border border-[#eaedff]"
                id="found-public-desc"
                placeholder="Contoh: Ditemukan tergeletak di kursi tunggu lantai 2 perpustakaan tanpa tas pelindung. Kondisi lensa tertutup dan baterai masih terpasang."
                required
                rows={3}
                value={publicDesc}
                onChange={(e) => setPublicDesc(e.target.value)}
              />
              <span className="text-[11px] text-[#45474c]">
                Deskripsikan kondisi fisik umum tanpa menyebutkan nomor seri atau isi rahasia yang spesifik.
              </span>
            </div>
          </div>

          {/* SECTION 3: SECURITY CARD KHUSUS (Ciri Rahasia / Verifikasi Posko) */}
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-amber-200/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-2xl">lock</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-amber-900 uppercase">
                    Enkripsi Internal Posko
                  </span>
                  <h3 className="text-[18px] font-bold text-amber-950">
                    Ciri Rahasia — Privat untuk Verifikasi
                  </h3>
                </div>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-200/80 text-amber-900 text-[11px] font-bold w-fit">
                <span className="material-symbols-outlined text-[15px]">visibility_off</span>
                <span>Dirahasiakan dari Portal Publik</span>
              </div>
            </div>

            {/* Peringatan Keamanan Box */}
            <div className="p-4 bg-amber-100/90 rounded-xl text-amber-950 flex gap-3 items-start border border-amber-300/40">
              <span className="material-symbols-outlined text-amber-700 text-xl flex-shrink-0 mt-0.5">
                gpp_maybe
              </span>
              <div className="space-y-1">
                <h4 className="text-[12px] font-bold text-amber-900 uppercase tracking-wide">
                  Peringatan Keamanan Validasi
                </h4>
                <p className="text-[13px] text-amber-950/90 leading-relaxed">
                  Tuliskan ciri tersembunyi yang <strong>hanya diketahui oleh pemilik asli</strong> (misal: isi dompet, nomor digit tersembunyi, stiker di balik baterai, wallpaper layar, atau goresan khas). Informasi di kolom ini <strong>TIDAK AKAN DITAMPILKAN KE PUBLIK</strong> dan hanya dapat diakses oleh Koordinator Posko untuk memvalidasi pemohon klaim saat serah terima.
                </p>
              </div>
            </div>

            {/* Secret Features Textarea with Visual Masking Toggle */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-bold text-amber-950 flex items-center gap-1.5" htmlFor="found-secret-features">
                  <span className="material-symbols-outlined text-[17px] text-amber-700">key</span>
                  Detail Ciri Rahasia Tersembunyi <span className="text-[#ba1a1a]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsMasked(!isMasked)}
                  className="flex items-center gap-1 text-[12px] font-bold text-amber-900 hover:text-amber-950 bg-amber-200/70 hover:bg-amber-200 px-3 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {isMasked ? 'visibility' : 'visibility_off'}
                  </span>
                  <span>{isMasked ? 'Perlihatkan Teks' : 'Sembunyikan Teks'}</span>
                </button>
              </div>

              <textarea
                className={`w-full px-4 py-3 rounded-xl bg-white text-slate-900 text-[13px] focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm transition-all border border-amber-200 ${
                  isMasked ? 'font-mono [-webkit-text-security:disc]' : ''
                }`}
                id="found-secret-features"
                placeholder="Contoh: Di dalam kantong terdapat flashdisk SanDisk 32GB warna merah, ada stiker kecil bertuliskan 'Laboratorium Robotika' pada sudut bawah casing..."
                required
                rows={4}
                value={secretClue}
                onChange={(e) => setSecretClue(e.target.value)}
              />

              <div className="flex items-center justify-between text-amber-900 text-[11px] pt-1">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-amber-700">
                    enhanced_encryption
                  </span>
                  Tersimpan di server kampus dengan enkripsi AES-256
                </span>
                <span className="font-mono font-bold text-amber-800">
                  {secretClue.length} karakter tersimpan
                </span>
              </div>
            </div>
          </div>

          {/* SECTION 4: Opsi Penyerahan Fisik Barang */}
          <div className="pt-2 space-y-3">
            <div>
              <h3 className="text-[15px] font-bold text-[#091426] flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#1d4ed8]">warehouse</span>
                Status & Lokasi Fisik Barang Saat Ini
              </h3>
              <p className="text-[12px] text-[#45474c] mt-0.5">
                Tentukan keberadaan barang fisik agar tim keamanan dapat menjadwalkan pengambilan atau mengonfirmasi ketersediaan di posko.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  custodyOption === 'posko'
                    ? 'bg-[#dce1ff]/50 border-[#1d4ed8] text-[#001551]'
                    : 'bg-[#f2f3ff] border-[#eaedff] text-[#131b2e]'
                }`}
              >
                <input
                  type="radio"
                  name="custody"
                  checked={custodyOption === 'posko'}
                  onChange={() => setCustodyOption('posko')}
                  className="mt-1 w-4 h-4 text-[#1d4ed8]"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold">Barang sudah saya titipkan di Posko Keamanan</span>
                  <span className="text-[12px] text-[#45474c] mt-1">
                    Diserahkan langsung ke petugas Satpam di Gedung Rektorat / Pos Keamanan Gerbang Utama.
                  </span>
                </div>
              </label>

              <label
                className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  custodyOption === 'personal'
                    ? 'bg-[#dce1ff]/50 border-[#1d4ed8] text-[#001551]'
                    : 'bg-[#f2f3ff] border-[#eaedff] text-[#131b2e]'
                }`}
              >
                <input
                  type="radio"
                  name="custody"
                  checked={custodyOption === 'personal'}
                  onChange={() => setCustodyOption('personal')}
                  className="mt-1 w-4 h-4 text-[#1d4ed8]"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold">Barang masih saya bawa secara pribadi</span>
                  <span className="text-[12px] text-[#45474c] mt-1">
                    Saya bersedia menyerahkan barang ke posko terdekat atau menemui pemohon valid setelah dihubungi oleh koordinator (maksimal 1x24 jam).
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons Bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onNavigate('catalog')}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#e2e7ff] hover:bg-[#dae2fd] text-[#131b2e] font-bold text-[13px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Kembali ke Beranda
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white font-bold text-[14px] shadow-md transition-all flex items-center justify-center gap-2 group cursor-pointer active:scale-95"
          >
            <span>Simpan & Daftarkan Barang</span>
            <span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">
              send
            </span>
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 md:p-8 shadow-2xl flex flex-col items-center text-center space-y-4 border border-[#eaedff]">
            <div className="w-16 h-16 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#1d4ed8]">
              <span className="material-symbols-outlined text-4xl">task_alt</span>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] uppercase text-[#1d4ed8] font-bold tracking-wider">
                Tiket Berhasil Diterbitkan
              </span>
              <h2 className="text-2xl font-bold text-[#091426]">Laporan Penemuan Berhasil Dicatat</h2>
              <p className="text-[13px] text-[#45474c] leading-relaxed">
                Nomor Tiket Anda:{' '}
                <strong className="text-[#091426] font-mono font-bold">#{createdItemId}</strong>. Barang sudah muncul di Beranda & tersimpan otomatis.
              </p>
            </div>

            <div className="p-3 bg-[#f2f3ff] rounded-xl w-full flex items-center justify-between text-left border border-[#eaedff]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[28px]">qr_code_2</span>
                <div>
                  <p className="text-[13px] font-bold text-[#091426]">Tunjukkan QR ke Petugas</p>
                  <p className="text-[11px] text-[#45474c]">Saat serah terima fisik di posko loker</p>
                </div>
              </div>
              <span className="font-mono text-[12px] px-2.5 py-1 bg-[#dae2fd] text-[#091426] rounded-md font-bold">
                1352-8841
              </span>
            </div>

            <div className="w-full flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  resetForm();
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-[#f2f3ff] text-[#091426] font-bold text-[13px] hover:bg-[#e2e7ff] transition-colors cursor-pointer"
              >
                Tambah Barang Lagi
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowSuccessModal(false);
                  resetForm();
                  onNavigate('catalog');
                }}
                className="w-full sm:w-1/2 py-3 rounded-xl bg-[#1d4ed8] text-white font-bold text-[13px] shadow-sm hover:bg-[#1d4ed8]/90 transition-colors cursor-pointer"
              >
                Buka Beranda Temuan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
