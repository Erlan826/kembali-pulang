import React, { useState } from 'react';
import { FoundItem, getInitials } from '../data/mockData';

interface SideBySideViewProps {
  item: FoundItem;
  onNavigate: (view: string) => void;
  onApprove: (item: FoundItem, auditorNotes?: string) => void;
  onReject: (item: FoundItem, auditorNotes?: string) => void;
  onRequestProof: (item: FoundItem, auditorNotes?: string) => void;
}

export const SideBySideView: React.FC<SideBySideViewProps> = ({
  item,
  onNavigate,
  onApprove,
  onReject,
  onRequestProof,
}) => {
  const [checkFeature, setCheckFeature] = useState(true);
  const [checkCondition, setCheckCondition] = useState(true);
  const [checkProof, setCheckProof] = useState(true);
  const [auditorNotes, setAuditorNotes] = useState(
    item.auditorNotes ||
      'Semua poin identifikasi ciri rahasia terverifikasi valid. Mahasiswa wajib membawa KTM asli fisik saat pengambilan di loker posko.'
  );
  const [modalState, setModalState] = useState<'none' | 'approve' | 'reject' | 'need_proof'>('none');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const matchScore = item.aiMatchScore ?? 88;
  const claimantName = item.claimantName || 'Ahmad Zaki Al-Farisi';
  const claimantNim = item.claimantNim || '13521098';
  const claimantMajor = item.claimantMajor || 'Teknik Informatika';
  const evidenceFiles =
    item.claimEvidenceFiles && item.claimEvidenceFiles.length > 0
      ? item.claimEvidenceFiles
      : ['Invoice_Pembelian.pdf', 'Screenshot_Serial.png', 'Foto_Kepemilikan.jpg'];

  const handleConfirmAction = () => {
    if (modalState === 'approve') {
      onApprove(item, auditorNotes);
      setModalState('none');
      setToastMsg(
        `Tiket pengambilan posko untuk #${item.id} berhasil diterbitkan! Mengalihkan ke antrean...`
      );
      setTimeout(() => {
        setToastMsg(null);
        onNavigate('coordinator');
      }, 1500);
    } else if (modalState === 'reject') {
      onReject(item, auditorNotes);
      setModalState('none');
      setToastMsg(`Klaim #${item.claimId || item.id} ditolak & barang dibuka kembali di katalog.`);
      setTimeout(() => {
        setToastMsg(null);
        onNavigate('coordinator');
      }, 1500);
    } else {
      onRequestProof(item, auditorNotes);
      setModalState('none');
      setToastMsg(
        `Permintaan bukti tambahan telah dikirim ke ${claimantName} (${claimantNim}).`
      );
      setTimeout(() => setToastMsg(null), 3500);
    }
  };

  return (
    <div className="w-full">
      {/* Top Progress & Case Overview Bar */}
      <section className="w-full px-6 py-4 bg-white border-b border-[#eaedff] shadow-xs">
        <div className="flex flex-col gap-3 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <nav className="flex items-center gap-1.5 text-[#45474c] text-[13px] font-semibold">
              <button
                onClick={() => onNavigate('coordinator')}
                className="hover:text-[#1d4ed8] cursor-pointer"
              >
                Dashboard Koordinator
              </button>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span>Antrean Klaim</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-[#091426] font-bold">
                Validasi Kasus #{item.claimId || item.id}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#091426] font-mono text-[11px]">
                Ref: #{item.id}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#131b2e] text-[11px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]"></span>
                <span>{item.statusLabel}</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#131b2e] font-mono text-[11px] font-bold">
                <span className="material-symbols-outlined text-[15px] text-[#45474c]">schedule</span>
                <span>SLA: 03:42:10 Tersisa</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#091426] tracking-tight">{item.title}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-[#1d4ed8] text-white text-[11px] font-bold">
                  {item.categoryLabel}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#45474c] text-[13px] flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">location_on</span>
                  {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  Penyimpanan Fisik: <strong className="text-[#091426]">{item.storageLocation}</strong>
                </span>
              </div>
            </div>

            {/* AI Semantic Matching Gauge */}
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex-shrink-0">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#dae2fd]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <path
                    className="text-[#1d4ed8]"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray={`${matchScore}, 100`}
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute text-[13px] font-extrabold text-[#091426]">{matchScore}%</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[13px] font-bold text-[#091426]">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">auto_awesome</span>
                  <span>
                    Kesesuaian Ciri AI: {matchScore >= 85 ? 'Sangat Tinggi' : 'Cukup Sesuai'}
                  </span>
                </div>
                <p className="text-[12px] text-[#45474c]">
                  Pembandingan otomatis deskriptor fisik &amp; jawaban pengklaim
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Canvas */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN: Source of Truth (Field Curator Data) */}
          <section className="flex flex-col rounded-2xl bg-[#f2f3ff] border border-[#eaedff] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#eaedff] flex items-center justify-between border-b border-[#dae2fd]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#091426] text-white flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#45474c] block">
                    Source of Truth
                  </span>
                  <h2 className="text-[15px] font-bold text-[#091426]">Data Fisik Petugas &amp; Penemu</h2>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#091426] font-mono text-[11px] font-bold">
                REF #{item.id}
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white border border-[#eaedff] text-[12px]">
                <div>
                  <span className="text-[#45474c] text-[10px] uppercase font-bold block">Pelapor Penemu</span>
                  <span className="font-bold text-[#091426] block mt-0.5">{item.finderName}</span>
                  <span className="text-[#45474c] text-[11px]">{item.finderRole}</span>
                </div>
                <div>
                  <span className="text-[#45474c] text-[10px] uppercase font-bold block">Waktu Serah Fisik</span>
                  <span className="font-bold text-[#091426] block mt-0.5">{item.foundDate}</span>
                  <span className="text-[#45474c] text-[11px] truncate block">{item.storageLocation}</span>
                </div>
              </div>

              {/* Physical Photos Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#091426]">
                    Dokumentasi Fisik Petugas Posko
                  </span>
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="text-[11px] font-bold text-[#1d4ed8] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">zoom_in</span>
                    <span>Perbesar Grid</span>
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="relative rounded-xl overflow-hidden aspect-video bg-[#eaedff] cursor-pointer group text-left"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                      Foto Utama Barang
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLightboxOpen(true)}
                    className="relative rounded-xl overflow-hidden aspect-video bg-[#eaedff] cursor-pointer group text-left"
                  >
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe-PGHU3sFiddrwp7zh73EPH7G5QVZ-2oEuXsPn_nVV_oXZ1gGguNHHAdststcNTsxFORwrBbKckukcU8PWtanBaOxcayoxx36Vt0MlG95RC9oxbk-aN7lGvzN1SbUeoOkKaAbfbeSf-OjDNmqjzEd24LbNCMJvNf4Sklm3m6AASf-QI5A1oNV8E4I6avn4Yy7NOEtelvboNdI-1pn66HOrlJyBwwTND8Gp7D4BuI"
                      alt="Detail Ciri Rahasia"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                      Detail Ciri Fisik
                    </span>
                  </button>
                </div>
              </div>

              {/* Secret Features registered by Curator */}
              <div className="space-y-2">
                <span className="text-[13px] font-bold text-[#091426] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">lock</span>
                  Ciri Rahasia Fisik Tercatat (Kurator K3L)
                </span>
                <div className="space-y-2 text-[12px]">
                  <div className="p-3.5 rounded-xl bg-white border border-[#eaedff]">
                    <div className="flex justify-between font-bold text-[#091426] mb-1">
                      <span>Catatan Rahasia Internal Posko</span>
                      <span className="text-[10px] text-[#1d4ed8] font-mono">TERENKRIPSI AES-256</span>
                    </div>
                    <p className="text-[#45474c] leading-relaxed">
                      &ldquo;{item.secretClueRegistered}&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#eaedff]">
                    <div className="flex justify-between font-bold text-[#091426] mb-1">
                      <span>Deskripsi Publik Terdaftar</span>
                      <span className="text-[10px] text-[#45474c]">Katalog</span>
                    </div>
                    <p className="text-[#45474c]">{item.publicDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Claimant Submission */}
          <section className="flex flex-col rounded-2xl bg-white border border-[#eaedff] shadow-sm overflow-hidden">
            <div className="p-4 bg-[#1d4ed8] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white text-[#1d4ed8] flex items-center justify-center font-bold">
                  <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 block">
                    Pengajuan Mahasiswa
                  </span>
                  <h2 className="text-[15px] font-bold text-white">Jawaban &amp; Dokumen Pengklaim</h2>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                SSO Terverifikasi
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1">
              <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[14px]">
                    {getInitials(claimantName)}
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#091426] flex items-center gap-1.5">
                      {claimantName}
                      <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">verified</span>
                    </h3>
                    <p className="text-[12px] text-[#45474c]">
                      NIM {claimantNim} • {claimantMajor}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('profile')}
                  className="px-3 py-1.5 rounded-lg bg-[#dae2fd] text-[#091426] font-bold text-[11px] hover:bg-[#eaedff] transition-colors cursor-pointer"
                >
                  Profil SSO
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#091426]">
                    Jawaban Ciri Rahasia Pengklaim
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#45474c] text-[10px] font-bold">
                    {item.claimSubmittedAt || 'Disubmit via Portal SSO'}
                  </span>
                </div>

                <div className="space-y-2 text-[12px]">
                  <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <div className="flex justify-between font-bold mb-1">
                      <span className="text-[#091426]">Deskripsi Ciri Khusus Mahasiswa</span>
                      <span className="text-[#00a472] flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        Skor Kecocokan {matchScore}%
                      </span>
                    </div>
                    <p className="text-[#131b2e] bg-white p-3 rounded-lg border border-[#eaedff] leading-relaxed">
                      &ldquo;
                      {item.claimantSecretAnswer ||
                        'Pengklaim belum melengkapi jawaban rinci atau klaim diajukan melalui verifikasi tatap muka loket.'}
                      &rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
                    <span className="font-bold text-[#091426]">Rencana Pengambilan</span>
                    <span className="text-[#1d4ed8] font-semibold">
                      {item.pickupMethod === 'proxy'
                        ? 'Diwakilkan (Surat Kuasa Bermeterai)'
                        : 'Ambil Langsung di Loket Posko'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Uploaded Evidence Files */}
              <div className="space-y-2 pt-1">
                <span className="text-[13px] font-bold text-[#091426] block">
                  Bukti Kepemilikan Faktual Terlampir ({evidenceFiles.length} Berkas)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {evidenceFiles.map((fname, idx) => (
                    <div
                      key={`${fname}-${idx}`}
                      className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between"
                    >
                      <span className="material-symbols-outlined text-[22px] text-[#1d4ed8]">
                        {fname.toLowerCase().endsWith('.pdf') ? 'picture_as_pdf' : 'photo_library'}
                      </span>
                      <span className="text-[11px] font-bold text-[#091426] truncate mt-1">
                        {fname}
                      </span>
                      <span className="text-[10px] text-[#00a472] font-semibold">Terlampir SSO</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Evaluation Checklist & Auditor Note Section */}
        <section className="p-6 rounded-2xl bg-white border border-[#eaedff] shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[#1d4ed8] text-[24px]">fact_check</span>
                <div>
                  <h3 className="text-[15px] font-bold text-[#091426]">
                    Checklist Evaluasi Resmi Koordinator Posko
                  </h3>
                  <p className="text-[12px] text-[#45474c]">
                    Pastikan semua indikator keabsahan telah diperiksa silang secara visual dan sistematis.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkFeature}
                    onChange={(e) => setCheckFeature(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1d4ed8] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-[12px] font-bold text-[#091426] block">1. Ciri Khusus Cocok</span>
                    <span className="text-[11px] text-[#45474c]">
                      Deskripsi rahasia pengklaim identik dengan fisik di loker.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkCondition}
                    onChange={(e) => setCheckCondition(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1d4ed8] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-[12px] font-bold text-[#091426] block">2. Identitas SSO Sah</span>
                    <span className="text-[11px] text-[#45474c]">
                      NIM &amp; status akademik pengklaim aktif di SIAKAD.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkProof}
                    onChange={(e) => setCheckProof(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1d4ed8] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-[12px] font-bold text-[#091426] block">3. Bukti Pendukung Valid</span>
                    <span className="text-[11px] text-[#45474c]">
                      Lampiran atau verifikasi sekunder layak diterbitkan tiket.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            <div className="w-full lg:w-96 space-y-1.5">
              <label className="text-[12px] font-bold text-[#091426] flex items-center justify-between">
                <span>Catatan Auditor / Posko Penyerahan</span>
                <span className="text-[10px] text-[#45474c] font-mono">Otomatis Masuk BAST</span>
              </label>
              <textarea
                className="w-full p-3 rounded-xl bg-[#f2f3ff] text-[12px] text-[#131b2e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                rows={3}
                value={auditorNotes}
                onChange={(e) => setAuditorNotes(e.target.value)}
              />
            </div>
          </div>
        </section>
      </div>

      {/* Sticky Bottom Action Toolbar */}
      <aside className="sticky bottom-0 z-40 w-full px-6 py-3.5 bg-white/95 backdrop-blur-md border-t border-[#eaedff] shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#1d4ed8] animate-pulse"></div>
              <span className="text-[13px] font-bold text-[#091426]">
                Status: {checkFeature && checkCondition && checkProof ? 'Siap Eksekusi Keputusan' : 'Lengkapi Checklist'}
              </span>
            </div>
            <span className="hidden md:inline text-[12px] text-[#45474c]">
              Koordinator: <strong className="text-[#091426]">Drs. H. Sudirman, M.Si</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => setModalState('reject')}
              className="px-4 py-2.5 rounded-xl bg-[#ffdad6] text-[#ba1a1a] hover:bg-[#ba1a1a] hover:text-white font-bold text-[12px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px]">cancel</span>
              <span>Tolak Klaim</span>
            </button>

            <button
              onClick={() => setModalState('need_proof')}
              className="px-4 py-2.5 rounded-xl bg-[#eaedff] text-[#091426] hover:bg-[#dae2fd] font-bold text-[12px] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">
                mark_chat_unread
              </span>
              <span>Minta Bukti Tambahan</span>
            </button>

            <button
              onClick={() => setModalState('approve')}
              className="px-6 py-2.5 rounded-xl bg-[#091426] hover:bg-[#1d4ed8] text-white font-bold text-[13px] transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px] text-[#6ffbbe]">verified</span>
              <span>Setujui Klaim &amp; Terbitkan Tiket Posko</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Photo Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-[#091426]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-3xl w-full rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
              <h4 className="text-[16px] font-bold text-[#091426]">
                Pratinjau Dokumentasi Fisik — #{item.id}
              </h4>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-1 rounded-lg hover:bg-[#f2f3ff] text-[#45474c] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden bg-[#f2f3ff] border border-[#eaedff]">
                <img src={item.imageUrl} alt={item.title} className="w-full h-64 object-cover" />
                <p className="p-2 text-[12px] font-bold text-[#091426]">Foto Utama Katalog Posko</p>
              </div>
              <div className="rounded-xl overflow-hidden bg-[#f2f3ff] border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe-PGHU3sFiddrwp7zh73EPH7G5QVZ-2oEuXsPn_nVV_oXZ1gGguNHHAdststcNTsxFORwrBbKckukcU8PWtanBaOxcayoxx36Vt0MlG95RC9oxbk-aN7lGvzN1SbUeoOkKaAbfbeSf-OjDNmqjzEd24LbNCMJvNf4Sklm3m6AASf-QI5A1oNV8E4I6avn4Yy7NOEtelvboNdI-1pn66HOrlJyBwwTND8Gp7D4BuI"
                  alt="Detail Tambahan"
                  className="w-full h-64 object-cover"
                />
                <p className="p-2 text-[12px] font-bold text-[#091426]">Inspeksi Ciri Rahasia Internal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalState !== 'none' && (
        <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-[#eaedff] space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  modalState === 'approve'
                    ? 'bg-[#00a472]'
                    : modalState === 'reject'
                    ? 'bg-[#ba1a1a]'
                    : 'bg-[#1d4ed8]'
                }`}
              >
                <span className="material-symbols-outlined text-[24px]">
                  {modalState === 'approve'
                    ? 'verified'
                    : modalState === 'reject'
                    ? 'cancel'
                    : 'mark_chat_unread'}
                </span>
              </div>
              <div>
                <h4 className="text-[16px] font-bold text-[#091426]">
                  {modalState === 'approve'
                    ? 'Setujui Klaim & Terbitkan Tiket'
                    : modalState === 'reject'
                    ? 'Tolak Pengajuan Klaim'
                    : 'Minta Dokumen Tambahan'}
                </h4>
                <span className="text-[12px] text-[#45474c]">
                  Kasus #{item.claimId || item.id} ({item.title})
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#45474c] leading-relaxed bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
              {modalState === 'approve'
                ? `Tiket pengambilan posko akan langsung diterbitkan untuk ${claimantName}. Notifikasi QR pengambilan dikirimkan ke WhatsApp ${item.claimantPhone || '+62 812-9876-5432'}.`
                : modalState === 'reject'
                ? 'Pengajuan klaim ini akan ditolak dan barang dikembalikan ke status Siap Diklaim pada katalog publik.'
                : `Sistem akan mengirimkan permintaan unggah dokumen tambahan kepada ${claimantName} via SSO & WhatsApp.`}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalState('none')}
                className="px-4 py-2 rounded-xl text-[#45474c] hover:bg-[#f2f3ff] text-[13px] font-bold cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="px-5 py-2 rounded-xl bg-[#091426] text-white hover:bg-[#1d4ed8] text-[13px] font-bold cursor-pointer shadow-sm"
              >
                Konfirmasi &amp; Proses
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-20 right-6 z-50 max-w-md bg-[#091426] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[22px]">task_alt</span>
          <span className="text-[13px] font-semibold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
