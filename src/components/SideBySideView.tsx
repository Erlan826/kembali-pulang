import React, { useState } from 'react';
import { FoundItem } from '../data/mockData';

interface SideBySideViewProps {
  item: FoundItem;
  onNavigate: (view: string) => void;
  onApprove: (item: FoundItem) => void;
}

export const SideBySideView: React.FC<SideBySideViewProps> = ({
  item,
  onNavigate,
  onApprove,
}) => {
  const [checkSticker, setCheckSticker] = useState(true);
  const [checkWallpaper, setCheckWallpaper] = useState(true);
  const [checkProof, setCheckProof] = useState(true);
  const [auditorNotes, setAuditorNotes] = useState(
    'Semua 3 poin identifikasi ciri rahasia terverifikasi valid tanpa sanggahan. Mahasiswa diwajibkan membawa KTM asli fisik saat pengambilan di Locker 12.'
  );
  const [modalState, setModalState] = useState<'none' | 'approve' | 'reject' | 'need_proof'>('none');

  const handleConfirmAction = () => {
    if (modalState === 'approve') {
      onApprove(item);
      alert('Sukses! Tiket Pengambilan #TKT-8819 berhasil diterbitkan. Data telah tersinkronisasi ke Posko Rektorat.');
      onNavigate('coordinator');
    } else if (modalState === 'reject') {
      alert(`Klaim #${item.claimId || 'CLM-9032'} telah ditolak.`);
      onNavigate('coordinator');
    } else {
      alert('Permintaan bukti telah dikirimkan ke Mahasiswa (Ahmad Zaki). SLA ditangguhkan sementara.');
      setModalState('none');
    }
  };

  return (
    <div className="w-full">
      {/* Top Progress & Case Overview Bar */}
      <section className="w-full px-6 py-4 bg-white border-b border-[#eaedff] shadow-xs">
        <div className="flex flex-col gap-3 max-w-7xl mx-auto">
          {/* Breadcrumb & Badges */}
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
              <span className="text-[#091426] font-bold">Validasi Kasus #{item.claimId || 'CLM-9032'}</span>
              <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#091426] font-mono text-[11px]">
                Ref: #{item.id}
              </span>
            </nav>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#131b2e] text-[11px] font-bold uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]"></span>
                <span>Antrean Validasi Manual</span>
              </div>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#f2f3ff] text-[#131b2e] font-mono text-[11px] font-bold">
                <span className="material-symbols-outlined text-[15px] text-[#45474c]">schedule</span>
                <span>SLA: 03:42:10 Tersisa</span>
              </div>
            </div>
          </div>

          {/* Title & AI Gauge */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-[#091426] tracking-tight">{item.title}</h1>
                <span className="px-2.5 py-0.5 rounded-md bg-[#1d4ed8] text-white text-[11px] font-bold">
                  Elektronik Berharga
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#45474c] text-[13px] flex-wrap">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">location_on</span>
                  {item.location}
                </span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  Locker Penyimpanan Fisik: <strong className="text-[#091426]">L-12 (Gedung Rektorat Lt. 1)</strong>
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
                    strokeDasharray="88, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <span className="absolute text-[13px] font-extrabold text-[#091426]">88%</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1 text-[13px] font-bold text-[#091426]">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">auto_awesome</span>
                  <span>Kesesuaian Ciri AI: Sangat Tinggi</span>
                </div>
                <p className="text-[12px] text-[#45474c]">3 dari 3 kunci deskriptor semantik cocok identik</p>
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
                  <h2 className="text-[15px] font-bold text-[#091426]">Data Fisik Petugas & Penemu</h2>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dae2fd] text-[#091426] font-mono text-[11px] font-bold">
                TERKUNCI #L-12
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1">
              {/* Intake metadata */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white border border-[#eaedff] text-[12px]">
                <div>
                  <span className="text-[#45474c] text-[10px] uppercase font-bold block">Pelapor Penemu</span>
                  <span className="font-bold text-[#091426] block mt-0.5">{item.finderName}</span>
                  <span className="text-[#45474c] text-[11px]">{item.finderRole}</span>
                </div>
                <div>
                  <span className="text-[#45474c] text-[10px] uppercase font-bold block">Waktu Serah Fisik</span>
                  <span className="font-bold text-[#091426] block mt-0.5">{item.foundDate}</span>
                  <span className="text-[#45474c] text-[11px]">Di Posko Rektorat</span>
                </div>
              </div>

              {/* Physical Photos Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#091426]">
                    Dokumentasi Fisik Petugas Posko (4 Foto)
                  </span>
                  <span className="text-[11px] font-bold text-[#1d4ed8]">Perbesar Grid</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="relative rounded-xl overflow-hidden aspect-video bg-[#eaedff]">
                    <img
                      src={item.imageUrl}
                      alt="Fisik Depan"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                      Fisik Depan
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden aspect-video bg-[#eaedff]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBe-PGHU3sFiddrwp7zh73EPH7G5QVZ-2oEuXsPn_nVV_oXZ1gGguNHHAdststcNTsxFORwrBbKckukcU8PWtanBaOxcayoxx36Vt0MlG95RC9oxbk-aN7lGvzN1SbUeoOkKaAbfbeSf-OjDNmqjzEd24LbNCMJvNf4Sklm3m6AASf-QI5A1oNV8E4I6avn4Yy7NOEtelvboNdI-1pn66HOrlJyBwwTND8Gp7D4BuI"
                      alt="Stiker Rahasia"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                      Ciri Rahasia #1 (Stiker)
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden aspect-video bg-[#eaedff]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBNRkb0YGUW9uGbZv9fsvQWcMXsx17tt1dYdp-rmCThHcjQQi2ILjDHCZzqxTwjqKYaqEz92bkBheXeivjvYIgdLNyWwsfwSvyzk6pLR4mVdmHO2TNjqncsH3lcWV1T9ui2OpyqBm5TkXmNYLpjf78n3rJBiv5NQ1GlGOvg5b94405_hNWM6ayHI01ENPrlO0GwDkyGInVMe260HLCDjFd7oLHTD2cihrCagSbzxL8"
                      alt="Layar Kunci"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                      Layar Kunci Menyala
                    </span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden aspect-video bg-[#eaedff]">
                    <img
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBU9Nl6ktbWTaXvNRBoHZ8_dSTRb_ybnkQaOtoAJEujCAX79Kw7V9Mge8gF6cD7nwUlm8FssdNje-2KJzi41cJy9BQc8kVmfAZWtHqKnJwvoLnernqQZ4i4Kl0ctLfEoQmJV8vh4AlIH2ZBwiVsvCTDI_D17fD5ZiqKnsVs7oGw4HVuNT8ksDBShyn_jJxxzhSptJhhSPo7OQrQUrCH2qFe6nGIHf4gc13iMtVFkw"
                      alt="Engsel mikro"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                      Engsel Bumper Mikro
                    </span>
                  </div>
                </div>
              </div>

              {/* Secret Features registered by Curator */}
              <div className="space-y-2">
                <span className="text-[13px] font-bold text-[#091426] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">lock</span>
                  Ciri Rahasia Fisik Tercatat (Kurator K3L)
                </span>
                <div className="space-y-2 text-[12px]">
                  <div className="p-3 rounded-xl bg-white border border-[#eaedff]">
                    <div className="flex justify-between font-bold text-[#091426]">
                      <span>1. Stiker GitHub di Casing Belakang</span>
                      <span className="text-[10px] text-[#45474c]">Sudut Kiri Bawah</span>
                    </div>
                    <p className="text-[#45474c] mt-0.5">
                      "Ada stiker GitHub Octocat kecil warna monokrom di sudut kiri bawah casing belakang perangkat."
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#eaedff]">
                    <div className="flex justify-between font-bold text-[#091426]">
                      <span>2. Digit Serial Number Laser</span>
                      <span className="text-[10px] text-[#45474c]">Laser Engraving</span>
                    </div>
                    <p className="text-[#45474c] mt-0.5">
                      "Serial number chasis belakang berakhiran ...782X (Daftar lengkap: C02GN0...782X)."
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#eaedff]">
                    <div className="flex justify-between font-bold text-[#091426]">
                      <span>3. Wallpaper Layar Kunci</span>
                      <span className="text-[10px] text-[#45474c]">Tampilan Visual</span>
                    </div>
                    <p className="text-[#45474c] mt-0.5">
                      "Wallpaper layar menampilkan foto kucing bulu oranye mengenakan topi toga sarjana."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT COLUMN: Claimant Submission (Student Inputs & Evidence) */}
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
                  <h2 className="text-[15px] font-bold text-white">Jawaban & Dokumen Pengklaim</h2>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold">
                SSO ITB Terverifikasi
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1">
              {/* Claimant Profile */}
              <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[14px]">
                    AZ
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#091426] flex items-center gap-1.5">
                      {item.claimantName || 'Ahmad Zaki Al-Farisi'}
                      <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">verified</span>
                    </h3>
                    <p className="text-[12px] text-[#45474c]">
                      NIM {item.claimantNim || '13521098'} • {item.claimantMajor || 'Teknik Informatika'}
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

              {/* Answers submitted */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-[#091426]">
                    Jawaban Ciri Rahasia Mandiri
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#f2f3ff] text-[#45474c] text-[10px] font-bold">
                    Disubmit 24 Okt, 11:15 WIB
                  </span>
                </div>

                <div className="space-y-2 text-[12px]">
                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#091426]">Pernyataan Ciri Stiker</span>
                      <span className="text-[#00a472] flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        Cocok Identik
                      </span>
                    </div>
                    <p className="text-[#45474c] mt-1 bg-white p-2 rounded-lg border border-[#eaedff]">
                      “Di balik laptop ada stiker octocat GitHub warna hitam putih kecil di bagian pojok kiri bawah, agak sedikit terkelupas ujungnya.”
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#091426]">Pernyataan Wallpaper Layar</span>
                      <span className="text-[#00a472] flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[15px]">check_circle</span>
                        Cocok Identik
                      </span>
                    </div>
                    <p className="text-[#45474c] mt-1 bg-white p-2 rounded-lg border border-[#eaedff]">
                      “Wallpaper saya pakai foto kucing oren peliharaan saya (namanya Milo) pakai toga wisuda mini.”
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff]">
                    <div className="flex justify-between font-bold">
                      <span className="text-[#091426]">Keterangan Aksesori & Kondisi</span>
                      <span className="text-[#1d4ed8] flex items-center gap-1 font-bold">
                        <span className="material-symbols-outlined text-[15px]">info</span>
                        Informasi Tambahan
                      </span>
                    </div>
                    <p className="text-[#45474c] mt-1 bg-white p-2 rounded-lg border border-[#eaedff]">
                      “Kabel charger kepala adapter 30W sedikit lecet di dekat colokan type-C, dan karet engsel ada bekas baret halus.”
                    </p>
                  </div>
                </div>
              </div>

              {/* Uploaded Evidence Files */}
              <div className="space-y-2 pt-1">
                <span className="text-[13px] font-bold text-[#091426] block">
                  Bukti Kepemilikan Faktual Terlampir
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                    <span className="material-symbols-outlined text-[24px] text-[#ba1a1a]">picture_as_pdf</span>
                    <span className="text-[11px] font-bold text-[#091426] truncate mt-1">
                      Invoice_iBox.pdf
                    </span>
                    <span className="text-[10px] text-[#45474c]">C02GN0...782X</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                    <span className="material-symbols-outlined text-[24px] text-[#1d4ed8]">phonelink_lock</span>
                    <span className="text-[11px] font-bold text-[#091426] truncate mt-1">
                      FindMy_Lock.png
                    </span>
                    <span className="text-[10px] text-[#00a472] font-semibold">Lost Mode Aktif</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                    <span className="material-symbols-outlined text-[24px] text-[#00a472]">photo_library</span>
                    <span className="text-[11px] font-bold text-[#091426] truncate mt-1">
                      Foto_Lama_2023.jpg
                    </span>
                    <span className="text-[10px] text-[#45474c]">Unggahan IG 2023</span>
                  </div>
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
                    checked={checkSticker}
                    onChange={(e) => setCheckSticker(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1d4ed8] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-[12px] font-bold text-[#091426] block">1. Stiker Fisik Cocok</span>
                    <span className="text-[11px] text-[#45474c]">
                      Stiker GitHub di sudut kiri bawah terkonfirmasi identik posisi dan wujud.
                    </span>
                  </div>
                </label>

                <label className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={checkWallpaper}
                    onChange={(e) => setCheckWallpaper(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1d4ed8] mt-0.5 cursor-pointer"
                  />
                  <div>
                    <span className="text-[12px] font-bold text-[#091426] block">2. Wallpaper Identik</span>
                    <span className="text-[11px] text-[#45474c]">
                      Layar kunci kucing toga wisuda sesuai deskripsi tanpa keraguan.
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
                    <span className="text-[12px] font-bold text-[#091426] block">3. Bukti Invoice Valid</span>
                    <span className="text-[11px] text-[#45474c]">
                      Serial number cocok 100% dengan serial laser chasis posko.
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
                Status: Siap Eksekusi Keputusan
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
              <span>Setujui Klaim & Terbitkan Tiket Posko</span>
            </button>
          </div>
        </div>
      </aside>

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
                  Kasus #{item.claimId || 'CLM-9032'} ({item.title})
                </span>
              </div>
            </div>

            <p className="text-[13px] text-[#45474c] leading-relaxed bg-[#f2f3ff] p-3 rounded-xl border border-[#eaedff]">
              {modalState === 'approve'
                ? 'Tiket pengambilan posko #TKT-8819 akan langsung diterbitkan secara resmi. Notifikasi kode QR pengambilan akan otomatis dikirimkan ke WhatsApp mahasiswa (+62 812-9876-5432) dan email kampus.'
                : modalState === 'reject'
                ? 'Pengajuan klaim ini akan ditandai TIDAK VALID. Catatan penolakan akan dikirimkan ke mahasiswa dan barang tetap tersimpan di Locker 12.'
                : 'Sistem akan mengirimkan permintaan unggah dokumen tambahan via notifikasi SSO & WhatsApp (batas waktu respons: 24 jam).'}
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
                Konfirmasi & Proses
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
