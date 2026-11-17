import React, { useState } from 'react';
import { FoundItem, UserProfile } from '../data/mockData';

interface ReportLostViewProps {
  onNavigate: (view: string) => void;
  onOpenClaim: (item: FoundItem) => void;
  foundItems: FoundItem[];
  userProfile: UserProfile;
  onSubmitReport: (report: {
    title: string;
    category: string;
    location: string;
    locationLabel: string;
    datetime: string;
    visualDesc: string;
    secretClue: string;
  }) => void;
}

const LOCATION_LABELS: Record<string, string> = {
  'perpus-2': 'Gedung Perpustakaan Pusat (Lt. 1 & 2)',
  'kantin-pusat': 'Kantin Pusat / Foodcourt Barat',
  'lab-komputer': 'Gedung Riset Komputer Lt. 3',
  rektorat: 'Plaza Rektorat & Selasar Barat',
  masjid: "Masjid Al-Jami' Kampus",
  lapangan: 'Stadion Olahraga & Hall Serbaguna',
};

export const ReportLostView: React.FC<ReportLostViewProps> = ({
  onNavigate,
  onOpenClaim,
  foundItems,
  userProfile,
  onSubmitReport,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('elektronik');
  const [location, setLocation] = useState('perpus-2');
  const [datetime, setDatetime] = useState(() => {
    const now = new Date();
    const localIso = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
    return localIso;
  });
  const [visualDesc, setVisualDesc] = useState('');
  const [secretClue, setSecretClue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Dynamic smart match suggestions based on user input & category
  const activeKeywords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length >= 3);

  const suggestedMatches = foundItems
    .filter((i) => i.status !== 'selesai')
    .filter((i) => {
      if (activeKeywords.length > 0) {
        const haystack = `${i.title} ${i.publicDesc} ${i.location}`.toLowerCase();
        return activeKeywords.some((kw) => haystack.includes(kw));
      }
      const categoryMap: Record<string, FoundItem['category']> = {
        elektronik: 'elektronik',
        kartu: 'identitas',
        kunci: 'kunci',
        tas: 'buku',
        botol: 'aksesoris',
        lainnya: 'lainnya',
      };
      return i.category === categoryMap[category];
    })
    .slice(0, 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !visualDesc.trim() || !secretClue.trim()) return;

    onSubmitReport({
      title: title.trim(),
      category,
      location,
      locationLabel: LOCATION_LABELS[location] || location,
      datetime,
      visualDesc: visualDesc.trim(),
      secretClue: secretClue.trim(),
    });
    setSubmitted(true);
    setTimeout(() => {
      onNavigate('activity');
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb & Administrative Context Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-1.5 text-[13px] text-[#45474c] font-semibold">
          <button
            onClick={() => onNavigate('catalog')}
            className="hover:text-[#091426] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Portal Kampus
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#131b2e] font-bold">Lapor Kehilangan Barang</span>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e2e7ff] text-[#131b2e] text-[12px] font-semibold border border-[#dae2fd]">
          <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
          <span>Protokol Verifikasi Posko Terpadu K3L & Kemahasiswaan</span>
        </div>
      </div>

      {/* Main Asymmetric Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Primary Loss Incident Form (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Form Header Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold uppercase">
                    Dokumen Resmi
                  </span>
                  <span className="text-[#45474c] text-[12px] font-mono">
                    ID Tiket: #LPK-202410-882
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-[#091426] tracking-tight">
                  Formulir Lapor Kehilangan Barang
                </h1>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eaedff] text-[#45474c] self-start sm:self-auto text-[12px] font-bold">
                <span className="material-symbols-outlined text-[16px] text-[#00a472]">lock</span>
                <span>Enkripsi Kampus Aktif</span>
              </div>
            </div>
            <p className="text-[13px] text-[#45474c] leading-relaxed">
              Isi rincian barang Anda seakurat mungkin. Sistem <span className="font-bold text-[#091426]">Kembali Pulang</span> akan langsung memindai inventaris posko aktif dan mencocokkan laporan penemuan lapangan secara instan.
            </p>
          </div>

          {/* Interactive Form Fields */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col gap-5"
          >
            {/* Field 1: Nama Barang / Judul */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="item-title">
                  Nama / Judul Barang Hilang
                </label>
                <span className="text-[11px] font-bold text-[#ba1a1a]">*Wajib</span>
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45474c] text-[20px]">
                  search
                </span>
                <input
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[14px] text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                  id="item-title"
                  placeholder="Contoh: Botol Minum Corkcicle Cokelat Doff"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <span className="text-[12px] text-[#45474c]">
                Sebutkan merk, tipe, dan corak utama agar AI dapat memfilter lebih cepat.
              </span>
            </div>

            {/* Field 2: Kategori Barang */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#131b2e]">Kategori Spesifik Barang</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'elektronik', label: 'Elektronik', icon: 'devices' },
                  { id: 'kartu', label: 'Dompet / KTM', icon: 'badge' },
                  { id: 'kunci', label: 'Kunci & Motor', icon: 'key' },
                  { id: 'tas', label: 'Tas / Buku', icon: 'backpack' },
                  { id: 'botol', label: 'Botol / Pakaian', icon: 'water_bottle' },
                  { id: 'lainnya', label: 'Lain-lain', icon: 'category' },
                ].map((cat) => (
                  <label
                    key={cat.id}
                    className={`cursor-pointer flex items-center gap-2 p-2.5 rounded-xl border text-[13px] font-semibold transition-all ${
                      category === cat.id
                        ? 'bg-[#dce1ff] text-[#001551] border-[#1d4ed8]'
                        : 'bg-[#f2f3ff] text-[#131b2e] border-[#eaedff] hover:bg-[#e2e7ff]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="item_category"
                      value={cat.id}
                      checked={category === cat.id}
                      onChange={() => setCategory(cat.id)}
                      className="sr-only"
                    />
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Field 3 & 4: Lokasi & Waktu Terakhir */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="item-location">
                  Perkiraan Lokasi Terakhir
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45474c] text-[20px]">
                    location_on
                  </span>
                  <select
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-[#f2f3ff] text-[13px] font-medium text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] transition-all appearance-none border border-[#eaedff] cursor-pointer"
                    id="item-location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  >
                    <option value="perpus-2">Gedung Perpustakaan Pusat (Lt. 1 & 2)</option>
                    <option value="kantin-pusat">Kantin Pusat / Foodcourt Barat</option>
                    <option value="lab-komputer">Gedung Riset Komputer Lt. 3</option>
                    <option value="rektorat">Plaza Rektorat & Selasar Barat</option>
                    <option value="masjid">Masjid Al-Jami' Kampus</option>
                    <option value="lapangan">Stadion Olahraga & Hall Serbaguna</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#45474c] pointer-events-none text-[18px]">
                    expand_more
                  </span>
                </div>
                <span className="text-[11px] text-[#45474c]">
                  Pilih zona atau gedung aktivitas Anda sebelum menyadari kehilangan.
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="item-datetime">
                  Perkiraan Waktu & Tanggal
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#45474c] text-[20px]">
                    calendar_today
                  </span>
                  <input
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                    id="item-datetime"
                    type="datetime-local"
                    value={datetime}
                    onChange={(e) => setDatetime(e.target.value)}
                  />
                </div>
                <span className="text-[11px] text-[#45474c]">
                  Rentang toleransi pencocokan otomatis adalah ±24 jam.
                </span>
              </div>
            </div>

            {/* Field 5: Deskripsi Tampilan Luar */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="item-visual-desc">
                Deskripsi Tampilan Luar (Publik)
              </label>
              <textarea
                className="w-full p-3.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] transition-all border border-[#eaedff]"
                id="item-visual-desc"
                rows={3}
                value={visualDesc}
                onChange={(e) => setVisualDesc(e.target.value)}
                placeholder="Contoh: Botol warna cokelat tembaga doff ukuran 750ml, terdapat lecet ringan di bagian bawah..."
                required
              />
              <span className="text-[11px] text-[#45474c]">
                Deskripsi ini dapat dibaca oleh kurator posko dan dicocokkan dengan log visual.
              </span>
            </div>

            {/* Field 6: CIRI RAHASIA (Private Security Verification Vault) */}
            <div className="p-5 rounded-2xl bg-[#e2e7ff] border border-[#dae2fd] relative overflow-hidden">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="flex flex-col">
                  <h2 className="text-[16px] font-bold text-[#091426] flex items-center gap-1.5">
                    Ciri Rahasia untuk Autentikasi Posko
                    <span className="material-symbols-outlined text-[#00a472] text-[18px]">shield</span>
                  </h2>
                  <p className="text-[12px] text-[#45474c] mt-0.5 leading-relaxed">
                    Tuliskan ciri unik yang <strong>hanya Anda ketahui</strong> (contoh: nomor seri tersembunyi, goresan tertentu, isi bagian dalam, stiker di balik case). Informasi ini <strong className="text-[#ba1a1a]">hanya terlihat oleh petugas satpam/posko</strong> saat Anda mengambil barang fisik.
                  </p>
                </div>
              </div>

              <div className="relative">
                <textarea
                  className="w-full p-3.5 rounded-xl bg-white text-[13px] text-[#131b2e] outline-none focus:ring-2 focus:ring-[#1d4ed8] transition-all placeholder:text-[#45474c]/60 border border-[#eaedff] shadow-inner"
                  rows={3}
                  value={secretClue}
                  onChange={(e) => setSecretClue(e.target.value)}
                  placeholder="Tuliskan ciri rahasia di sini untuk membuktikan kepemilikan Anda..."
                  required
                />
                <div className="flex items-center justify-between mt-1.5 px-1 text-[11px] text-[#45474c]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#00a472]">check_circle</span>
                    Disimpan dengan hash kriptografis sesi
                  </span>
                  <span className="font-mono">{secretClue.length} karakter</span>
                </div>
              </div>
            </div>

            {/* Field 7: Kontak Terverifikasi SSO */}
            <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#131b2e]">
                  Identitas & Kontak Pemilik (SSO Kampus)
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00a472] bg-white px-2.5 py-0.5 rounded-full shadow-xs">
                  <span className="material-symbols-outlined text-[14px]">done_all</span>
                  Terautentikasi DAAK
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#1d4ed8]">
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-[#45474c]">WhatsApp Pemberitahuan</span>
                    <span className="font-mono text-[13px] font-bold text-[#131b2e] truncate">
                      {userProfile.phone}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-[#eaedff] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#f2f3ff] flex items-center justify-center text-[#1d4ed8]">
                    <span className="material-symbols-outlined text-[18px]">mail</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[11px] text-[#45474c]">Email Mahasiswa Aktif</span>
                    <span className="font-mono text-[12px] font-bold text-[#131b2e] truncate">
                      {userProfile.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Submission Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-[#45474c] text-[12px]">
                <span className="material-symbols-outlined text-[16px]">info</span>
                <span>Laporan akan ditinjau dalam ≤ 15 menit oleh Posko Terdekat.</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => onNavigate('catalog')}
                  className="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#131b2e] text-[13px] font-bold hover:bg-[#dae2fd] transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitted}
                  className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-[14px] shadow-md transition-all cursor-pointer ${
                    submitted
                      ? 'bg-[#00a472]'
                      : 'bg-[#091426] hover:bg-[#1d4ed8] active:scale-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {submitted ? 'task_alt' : 'send'}
                  </span>
                  <span>{submitted ? 'Laporan Berhasil Diterbitkan!' : 'Kirim Laporan Kehilangan'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Administrative Assurance Banner */}
          <div className="p-4 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white text-[#091426] flex-shrink-0 shadow-xs">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div>
              <h3 className="text-[13px] font-bold text-[#091426]">Prosedur Pengambilan Barang Fisik</h3>
              <p className="text-[12px] text-[#45474c] mt-0.5 leading-relaxed">
                Jika barang Anda dinyatakan cocok oleh kurator posko, bawa Kartu Tanda Mahasiswa (KTM) fisik atau scan SSO di aplikasi mobile saat mendatangi loket pengambilan. Posko buka hingga pukul 16.30 WIB.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Live Smart Suggestion AI Drawer / Widget (5 Cols - Sticky) */}
        <aside className="lg:col-span-5 flex flex-col gap-4 lg:sticky lg:top-24">
          {/* Live AI Drawer Header Card */}
          <div className="bg-white p-5 rounded-2xl shadow-md border border-[#eaedff] relative overflow-hidden">
            <div className="flex items-center justify-between mb-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">psychology</span>
                <span>Smart Match AI Kampus</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#45474c] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
                <span>Live (300ms Debounce)</span>
              </div>
            </div>

            <h2 className="text-[18px] font-bold text-[#091426] mt-2">Apakah Ini Barang Anda?</h2>
            <p className="text-[12px] text-[#45474c] mt-1">
              Sistem memfilter database temuan secara otomatis berdasarkan kata kunci{' '}
              <span className="font-bold text-[#1d4ed8]">
                &quot;{title.trim() || 'Kategori Dipilih'}&quot;
              </span>{' '}
              di sekitar{' '}
              <span className="font-bold text-[#1d4ed8]">{LOCATION_LABELS[location] || 'Kampus'}</span>.
            </p>

            {/* Match Counter Status Bar */}
            <div className="mt-4 p-3 rounded-xl bg-[#e2e7ff] flex items-center justify-between border border-[#dae2fd]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[20px]">
                  filter_center_focus
                </span>
                <span className="text-[12px] font-bold text-[#131b2e]">
                  {suggestedMatches.length > 0
                    ? `Ditemukan ${suggestedMatches.length} barang serupa di posko!`
                    : 'Belum ada kecocokan langsung di posko.'}
                </span>
              </div>
              <span className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-white text-[#1d4ed8] font-bold shadow-xs">
                {suggestedMatches.length > 0 ? 'Smart Match' : 'Pantau Aktif'}
              </span>
            </div>

            {/* Matching Suggestion Item List */}
            <div className="flex flex-col gap-3 mt-4">
              {suggestedMatches.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-center text-[12px] text-[#45474c]">
                  Kirim laporan Anda agar sistem langsung memberi notifikasi saat ada barang serupa didaftarkan ke posko.
                </div>
              ) : (
                suggestedMatches.map((item, idx) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border transition-all ${
                    idx === 0
                      ? 'bg-[#f2f3ff] border-[#1d4ed8]/30 shadow-sm'
                      : 'bg-white border-[#eaedff]'
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-18 h-18 rounded-lg object-cover flex-shrink-0 bg-[#eaedff]"
                    />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            idx === 0
                              ? 'bg-[#00301e] text-[#6ffbbe]'
                              : 'bg-[#eaedff] text-[#45474c]'
                          }`}
                        >
                          {idx === 0 ? 'Cocok Tinggi (96%)' : 'Mirip (82%)'}
                        </span>
                        <span className="text-[11px] text-[#45474c]">1 jam lalu</span>
                      </div>
                      <h3 className="text-[14px] font-bold text-[#091426] truncate leading-tight">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1 text-[12px] text-[#45474c] mt-0.5">
                        <span className="material-symbols-outlined text-[14px] text-[#1d4ed8]">place</span>
                        <span className="truncate">{item.location}</span>
                      </div>
                      <div className="text-[11px] text-[#45474c] mt-0.5">
                        Disimpan: {item.storageLocation}
                      </div>
                    </div>
                  </div>

                  {/* Direct Claim Button */}
                  <div className="mt-3 pt-2 border-t border-[#dae2fd]/60 flex flex-col gap-1">
                    <button
                      onClick={() => onOpenClaim(item)}
                      className="w-full py-2 px-3 rounded-xl bg-[#1d4ed8] text-white text-[12px] font-bold hover:bg-[#1d4ed8]/90 transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">verified</span>
                      <span>Cocok, Ajukan Klaim Sekarang</span>
                    </button>
                    <div className="text-center text-[10px] text-[#45474c]">
                      Lewati sisa formulir & langsung ajukan bukti kepemilikan
                    </div>
                  </div>
                </div>
                ))
              )}
            </div>

            {/* Bottom Efficiency Notification Callout */}
            <div className="mt-4 p-3 rounded-xl bg-[#e2e7ff] flex items-start gap-2 border border-[#dae2fd]">
              <span className="material-symbols-outlined text-[#1d4ed8] text-[18px] flex-shrink-0 mt-0.5">
                lightbulb
              </span>
              <p className="text-[12px] text-[#131b2e] leading-snug">
                <strong>Tips Efisiensi:</strong> Jika salah satu barang di atas adalah milik Anda, gunakan tombol <em>"Cocok, Ajukan Klaim"</em> agar Anda tidak perlu menunggu antrean publikasi formulir baru.
              </p>
            </div>
          </div>

          {/* Campus Return Statistics Widget */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-[#eaedff] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#1d4ed8]">
                <span className="material-symbols-outlined">restart_alt</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#131b2e]">Tingkat Kembali Kampus</span>
                <span className="text-[11px] text-[#45474c]">Rata-rata kembali dalam 4.2 jam</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-extrabold text-[#1d4ed8]">91.4%</span>
              <span className="block text-[11px] font-bold text-[#00a472]">Terverifikasi</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};
