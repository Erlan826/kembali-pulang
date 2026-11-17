import React, { useState } from 'react';
import { FoundItem, UserProfile } from '../data/mockData';

interface ClaimItemViewProps {
  item: FoundItem;
  userProfile: UserProfile;
  onNavigate: (view: string) => void;
  onSubmitClaim: (claimData: {
    itemId: string;
    secretClue: string;
    pickupMethod: 'direct' | 'proxy';
    phone: string;
    isSecondHand: boolean;
    evidenceFiles: string[];
    claimId: string;
  }) => void;
}

interface AttachedFile {
  name: string;
  size: string;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export const ClaimItemView: React.FC<ClaimItemViewProps> = ({
  item,
  userProfile,
  onNavigate,
  onSubmitClaim,
}) => {
  const [secretClue, setSecretClue] = useState('');
  const [pickupMethod, setPickupMethod] = useState<'direct' | 'proxy'>('direct');
  const [phone, setPhone] = useState(userProfile.phone);
  const [isSecondHand, setIsSecondHand] = useState(false);
  const [integrityPact, setIntegrityPact] = useState(false);
  const [files, setFiles] = useState<AttachedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedClaimId, setSubmittedClaimId] = useState<string | null>(null);

  const appendFiles = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setFormError(null);
    const added: AttachedFile[] = Array.from(fileList).map((f) => ({
      name: f.name,
      size: formatBytes(f.size),
    }));
    setFiles((prev) => {
      const existingNames = new Set(prev.map((p) => p.name));
      return [...prev, ...added.filter((a) => !existingNames.has(a.name))];
    });
  };

  const removeFile = (fileName: string) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretClue.trim().length < 15) {
      setFormError(
        'Mohon deskripsikan ciri rahasia barang secara lebih rinci (minimal 15 karakter) demi validitas verifikasi K3L.'
      );
      return;
    }
    if (!isSecondHand && files.length === 0) {
      setFormError(
        'Unggah minimal 1 berkas bukti kepemilikan, atau centang opsi "Barang dibeli bekas / Tidak memiliki struk resmi" jika tidak membawa nota.'
      );
      return;
    }
    if (!integrityPact) {
      setFormError(
        'Anda harus mencentang persetujuan Pakta Integritas Mahasiswa sebelum mengirimkan pengajuan klaim.'
      );
      return;
    }

    setFormError(null);
    const generatedClaimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedClaimId(generatedClaimId);

    onSubmitClaim({
      itemId: item.id,
      secretClue: secretClue.trim(),
      pickupMethod,
      phone: phone.trim() || userProfile.phone,
      isSecondHand,
      evidenceFiles: files.map((f) => f.name),
      claimId: generatedClaimId,
    });

    setTimeout(() => {
      setSubmittedClaimId(null);
      onNavigate('activity');
    }, 2000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Breadcrumb & Ticket Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[#45474c] text-[13px] font-semibold flex-wrap"
        >
          <button
            onClick={() => onNavigate('catalog')}
            className="hover:text-[#1d4ed8] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Katalog Temuan
          </button>
          <span className="material-symbols-outlined text-[14px] text-[#c5c6cd]">
            chevron_right
          </span>
          <span className="font-mono text-[12px] text-[#45474c]">
            Detail Barang #{item.id}
          </span>
          <span className="material-symbols-outlined text-[14px] text-[#c5c6cd]">
            chevron_right
          </span>
          <span className="text-[#131b2e] font-bold">Ajukan Klaim Kepemilikan</span>
        </nav>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#1d4ed8]"></span>
            {item.statusLabel}
          </span>
          <span className="font-mono text-[12px] text-[#45474c] px-2.5 py-1 rounded bg-[#eaedff]">
            Protokol K3L V-4.2
          </span>
        </div>
      </div>

      {/* Main Grid: Summary Left (4 Cols) + 3-Tier Form Right (8 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Found Item Summary Card */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-4 flex flex-col gap-4">
            <div className="relative overflow-hidden rounded-xl group bg-[#f2f3ff]">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-56 object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 px-2.5 py-1 rounded bg-[#091426]/85 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                Katalog Resmi #{item.id}
              </div>
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded bg-[#00301e] text-[#6ffbbe] text-[11px] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                {item.secretClueSummary}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[11px] text-[#1d4ed8] uppercase font-bold tracking-wider">
                  {item.categoryLabel}
                </span>
                <span className="font-mono text-[12px] text-[#45474c]">{item.foundDate}</span>
              </div>
              <h2 className="text-[18px] font-bold text-[#091426] leading-snug">
                {item.title}
              </h2>
              <p className="text-[13px] text-[#45474c] mt-1.5 leading-relaxed">
                {item.publicDesc}
              </p>
            </div>

            <div className="bg-[#f2f3ff] rounded-xl p-3 space-y-2.5 text-[12px]">
              <div className="flex items-start gap-2 text-[#131b2e]">
                <span className="material-symbols-outlined text-[18px] text-[#1d4ed8] flex-shrink-0 mt-0.5">
                  place
                </span>
                <div>
                  <span className="font-bold block text-[#131b2e]">Lokasi Penemuan</span>
                  <span className="text-[#45474c]">{item.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[#131b2e] pt-1 border-t border-[#dae2fd]/60">
                <span className="material-symbols-outlined text-[18px] text-[#00a472] flex-shrink-0 mt-0.5">
                  inventory_2
                </span>
                <div>
                  <span className="font-bold block text-[#131b2e]">Penyimpanan Terkini</span>
                  <span className="text-[#45474c]">{item.storageLocation}</span>
                </div>
              </div>

              <div className="flex items-start gap-2 text-[#131b2e] pt-1 border-t border-[#dae2fd]/60">
                <span className="material-symbols-outlined text-[18px] text-[#45474c] flex-shrink-0 mt-0.5">
                  badge
                </span>
                <div>
                  <span className="font-bold block text-[#131b2e]">Kurator Penemu</span>
                  <span className="text-[#45474c]">{item.finderName}</span>
                </div>
              </div>
            </div>

            {/* Strict Safeguard Advisory */}
            <div className="p-3 rounded-xl bg-[#e2e7ff] text-[#131b2e] flex items-start gap-2 border border-[#dae2fd]">
              <span className="material-symbols-outlined text-[#1d4ed8] text-[20px] flex-shrink-0 mt-0.5">
                info
              </span>
              <p className="text-[12px] leading-relaxed text-[#131b2e]">
                Klaim palsu dikenakan sanksi tata tertib kampus <strong>Pasal 28</strong> &amp; pembekuan akun SSO universitas selama 1 semester.
              </p>
            </div>
          </div>

          {/* Verification Flow Micro-Tracker */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-4 space-y-3">
            <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider block">
              Alur Proses Klaim Resmi
            </span>
            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#dae2fd]">
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white text-[10px] font-bold">
                  1
                </span>
                <span className="text-[13px] text-[#131b2e] font-bold">Pengajuan 3 Lapis K3L</span>
                <span className="text-[11px] text-[#45474c]">Mengisi ciri tersembunyi &amp; berkas digital.</span>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#45474c] text-[10px] font-bold">
                  2
                </span>
                <span className="text-[13px] text-[#131b2e] font-bold">Review Tim Verifikasi Posko</span>
                <span className="text-[11px] text-[#45474c]">Pencocokan data maksimal 1x24 jam kerja.</span>
              </div>
              <div className="relative flex flex-col">
                <span className="absolute -left-6 top-0 w-4 h-4 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#45474c] text-[10px] font-bold">
                  3
                </span>
                <span className="text-[13px] text-[#131b2e] font-bold">Pengambilan Fisik di Posko</span>
                <span className="text-[11px] text-[#45474c]">Validasi KTM asli + tanda tangan BAST.</span>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT COLUMN: Multi-Tier Verification Form */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {formError && (
              <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] flex items-start gap-2.5 text-[13px] font-semibold">
                <span className="material-symbols-outlined text-[20px] mt-0.5">error</span>
                <span>{formError}</span>
              </div>
            )}

            {/* TIER 1: Secret Clue Match */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#f2f3ff] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center text-[16px] font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#091426] leading-tight">
                      Verifikasi Ciri Rahasia Wajib
                    </h3>
                    <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                      Secret Clue Match Protocol
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                  Wajib Lengkap
                </span>
              </div>

              {/* Caution Security Box */}
              <div className="bg-[#e2e7ff] rounded-xl p-4 flex items-start gap-3 border border-[#dae2fd]">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[24px] flex-shrink-0 mt-0.5">
                  enhanced_encryption
                </span>
                <div className="space-y-1">
                  <h4 className="text-[13px] text-[#131b2e] font-bold">
                    Peringatan Keamanan K3L Kampus
                  </h4>
                  <p className="text-[13px] text-[#45474c] leading-relaxed">
                    Jawab ciri spesifik yang <strong>TIDAK tampak pada foto katalog publik</strong> untuk membuktikan secara absolut bahwa Anda adalah pemilik sah barang ini.
                  </p>
                </div>
              </div>

              {/* Textarea for Secret Clue */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[13px] font-bold text-[#131b2e]"
                    htmlFor="secretClueInput"
                  >
                    Deskripsikan Ciri Spesifik / Rahasia Barang Anda <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <span className="font-mono text-[12px] text-[#45474c]">
                    {secretClue.length} / 800
                  </span>
                </div>
                <textarea
                  className="w-full bg-[#f2f3ff] rounded-xl p-4 text-[14px] text-[#131b2e] placeholder:text-[#75777d] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] transition-all resize-y shadow-inner border border-[#eaedff]"
                  id="secretClueInput"
                  maxLength={800}
                  value={secretClue}
                  onChange={(e) => setSecretClue(e.target.value)}
                  placeholder="Misal: Nomor seri barang, nama perangkat Bluetooth, wallpaper layar terkunci, goresan mikro spesifik, atau isi khusus di dalam barang..."
                  required
                  rows={5}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                  <div className="flex items-center gap-1.5 text-[#45474c] text-[12px]">
                    <span className="material-symbols-outlined text-[16px] text-[#00a472]">
                      check_circle
                    </span>
                    <span>Sebutkan minimal 2 parameter internal/rahasia</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#45474c] text-[12px]">
                    <span className="material-symbols-outlined text-[16px] text-[#00a472]">
                      check_circle
                    </span>
                    <span>Hanya dapat dibaca oleh tim validator posko</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TIER 2: Additional Photographic & Digital Ownership Proof */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#f2f3ff] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center text-[16px] font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#091426] leading-tight">
                      Unggah Bukti Kepemilikan Tambahan
                    </h3>
                    <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                      Faktual, Nota, &amp; Tangkapan Layar Digital
                    </span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#131b2e] text-[11px] font-bold">
                  {isSecondHand ? 'Opsional (Second)' : 'Min. 1 Berkas'}
                </span>
              </div>

              {/* Upload Dropzone Area */}
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('fileUploadInput')?.click();
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
                  appendFiles(e.dataTransfer.files);
                }}
                className={`relative rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer group border-2 border-dashed ${
                  isDragging
                    ? 'bg-[#dce1ff] border-[#1d4ed8]'
                    : 'bg-[#f2f3ff] hover:bg-[#e2e7ff] border-[#c5c6cd]'
                }`}
                onClick={() => document.getElementById('fileUploadInput')?.click()}
              >
                <input
                  accept="image/*,.pdf"
                  className="hidden"
                  id="fileUploadInput"
                  multiple
                  onChange={(e) => appendFiles(e.target.files)}
                  type="file"
                />
                <div className="w-14 h-14 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#1d4ed8] mb-2 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[30px]">cloud_upload</span>
                </div>
                <h4 className="text-[14px] font-bold text-[#131b2e]">
                  Tarik &amp; Letakkan Berkas Bukti di Sini, atau{' '}
                  <span className="text-[#1d4ed8] underline">Jelajahi Berkas</span>
                </h4>
                <p className="text-[12px] text-[#45474c] max-w-md mt-1 leading-relaxed">
                  Dukungan: Invoice / Struk Pembelian resmi, Foto lama bersama barang, Screenshot akun &amp; Serial Number, atau Kartu Garansi.
                </p>
                <span className="font-mono text-[11px] text-[#75777d] mt-2">
                  Format: JPG, PNG, PDF (Maks. 10MB per berkas)
                </span>
              </div>

              {/* Attached Files Preview Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {files.map((file, idx) => (
                  <div
                    key={`${file.name}-${idx}`}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] relative"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#e2e7ff] flex items-center justify-center text-[#1d4ed8] flex-shrink-0">
                      <span className="material-symbols-outlined text-[20px]">description</span>
                    </div>
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-[12px] font-bold text-[#131b2e] truncate">
                        {file.name}
                      </span>
                      <span className="font-mono text-[10px] text-[#45474c]">
                        {file.size} • Terlampir
                      </span>
                    </div>
                    <button
                      aria-label="Hapus file"
                      className="text-[#75777d] hover:text-[#ba1a1a] transition-colors p-1 cursor-pointer"
                      onClick={() => removeFile(file.name)}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => document.getElementById('fileUploadInput')?.click()}
                  className="flex items-center justify-center p-3 rounded-xl bg-white hover:bg-[#f2f3ff] border border-dashed border-[#1d4ed8] transition-colors cursor-pointer text-[#1d4ed8] text-[13px] font-bold gap-2"
                >
                  <span className="material-symbols-outlined text-[20px]">add_circle</span>
                  <span>{files.length > 0 ? 'Tambah Berkas' : 'Pilih Berkas Bukti'}</span>
                </button>
              </div>

              {/* Second hand checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-[#faf8ff] border border-[#eaedff] cursor-pointer select-none">
                <input
                  className="w-4 h-4 rounded text-[#1d4ed8] mt-1 cursor-pointer"
                  checked={isSecondHand}
                  onChange={(e) => {
                    setIsSecondHand(e.target.checked);
                    setFormError(null);
                  }}
                  type="checkbox"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#131b2e]">
                    Barang dibeli bekas (second) / Tidak memiliki struk resmi
                  </span>
                  <span className="text-[12px] text-[#45474c] mt-0.5">
                    Jika dicentang, tim verifikator akan menitikberatkan validasi pada pencocokan ciri rahasia dan verifikasi identitas langsung di posko loker.
                  </span>
                </div>
              </label>
            </div>

            {/* TIER 3: Campus SSO Integrated Identity & Handover Preferences */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between gap-2 border-b border-[#f2f3ff] pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center text-[16px] font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#091426] leading-tight">
                      Konfirmasi Identitas Pelapor &amp; Pengambilan
                    </h3>
                    <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                      Otentikasi SSO Kampus Terintegrasi
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#00301e] text-[#6ffbbe] text-[11px] font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  SSO Aktif
                </span>
              </div>

              {/* Student SSO Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#f2f3ff] p-4 rounded-xl border border-[#eaedff]">
                <div>
                  <span className="text-[11px] font-bold text-[#45474c] uppercase">Nama Mahasiswa</span>
                  <p className="text-[14px] font-bold text-[#091426] mt-0.5">{userProfile.name}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#45474c] uppercase">NIM</span>
                  <p className="font-mono text-[14px] font-bold text-[#091426] mt-0.5">{userProfile.nim}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#45474c] uppercase">Program Studi</span>
                  <p className="text-[13px] text-[#131b2e] mt-0.5">{userProfile.program}</p>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#45474c] uppercase">Email Kampus</span>
                  <p className="font-mono text-[12px] text-[#131b2e] mt-0.5 truncate">{userProfile.email}</p>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#45474c] uppercase block" htmlFor="waPhoneInput">
                    WhatsApp Aktif <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    className="w-full bg-white rounded px-2.5 py-1 text-[#131b2e] font-mono text-[13px] focus:ring-1 focus:ring-[#1d4ed8] mt-0.5 border border-[#eaedff]"
                    id="waPhoneInput"
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#45474c] uppercase">Status Akademik</span>
                  <p className="text-[12px] text-[#00a472] font-bold flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-[#00a472]"></span>
                    {userProfile.status}
                  </p>
                </div>
              </div>

              {/* Pickup Method */}
              <div className="flex flex-col gap-2">
                <span className="text-[13px] font-bold text-[#131b2e]">
                  Rencana Metode Pengambilan Fisik (Jika Klaim Disetujui) <span className="text-[#ba1a1a]">*</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <label
                    className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      pickupMethod === 'direct'
                        ? 'bg-[#dce1ff]/50 border-[#1d4ed8] text-[#001551]'
                        : 'bg-[#f2f3ff] border-[#eaedff] text-[#131b2e]'
                    }`}
                  >
                    <input
                      checked={pickupMethod === 'direct'}
                      onChange={() => setPickupMethod('direct')}
                      className="mt-1 w-4 h-4 text-[#1d4ed8]"
                      name="pickupMethod"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold">Ambil Langsung oleh Pemilik</span>
                      <span className="text-[12px] text-[#45474c] mt-0.5">
                        Datang langsung ke Loket Posko K3L dengan menunjukkan e-KTM asli dan QR Pengambilan.
                      </span>
                    </div>
                  </label>

                  <label
                    className={`relative flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      pickupMethod === 'proxy'
                        ? 'bg-[#dce1ff]/50 border-[#1d4ed8] text-[#001551]'
                        : 'bg-[#f2f3ff] border-[#eaedff] text-[#131b2e]'
                    }`}
                  >
                    <input
                      checked={pickupMethod === 'proxy'}
                      onChange={() => setPickupMethod('proxy')}
                      className="mt-1 w-4 h-4 text-[#1d4ed8]"
                      name="pickupMethod"
                      type="radio"
                    />
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold">Diwakilkan (Surat Kuasa)</span>
                      <span className="text-[12px] text-[#45474c] mt-0.5">
                        Diwakilkan rekan mahasiswa/keluarga wajib membawa Surat Kuasa bermeterai Rp10.000, fotokopi KTM kedua belah pihak, dan e-KTP perwakilan.
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Student Integrity Pact */}
              <div className="bg-[#e2e7ff]/60 rounded-xl p-4 flex flex-col gap-2 border border-[#dae2fd]">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    checked={integrityPact}
                    onChange={(e) => {
                      setIntegrityPact(e.target.checked);
                      setFormError(null);
                    }}
                    className="w-5 h-5 rounded text-[#1d4ed8] mt-0.5 flex-shrink-0 cursor-pointer"
                    id="integrityPactCheck"
                    type="checkbox"
                  />
                  <span className="text-[13px] text-[#131b2e] leading-snug">
                    Saya menyatakan dengan sungguh-sungguh bahwa <strong>barang ini adalah milik sah saya</strong>. Saya siap mempertanggungjawabkan pernyataan ini di hadapan Sidang Komisi Etik &amp; Disiplin Mahasiswa serta aparat hukum berwenang apabila ditemukan manipulasi data atau klaim palsu.
                  </span>
                </label>
              </div>
            </div>

            {/* Bottom Action Buttons Strip */}
            <div className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => onNavigate('catalog')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl text-[#45474c] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors text-[13px] font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                Batal &amp; Kembali ke Katalog
              </button>

              <button
                type="submit"
                disabled={Boolean(submittedClaimId)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#1d4ed8] text-white hover:bg-[#1d4ed8]/90 transition-all text-[14px] font-bold shadow-md active:scale-95 cursor-pointer disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-[20px]">verified</span>
                <span>{submittedClaimId ? 'Mengirimkan...' : 'Kirimkan Pengajuan Klaim'}</span>
              </button>
            </div>
          </form>
        </section>
      </div>

      {/* Floating Notification Toast */}
      {submittedClaimId && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#283044] text-[#eef0ff] p-4 rounded-2xl shadow-2xl flex items-start gap-3">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[26px]">task_alt</span>
          <div className="flex flex-col">
            <span className="text-[14px] font-bold">Klaim Berhasil Dikirimkan!</span>
            <span className="text-[12px] text-[#eef0ff]/80 mt-0.5">
              Tiket #{submittedClaimId} telah dibuat dan masuk ke antrean Koordinator Posko.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
