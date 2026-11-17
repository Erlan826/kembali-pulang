import React, { useState } from 'react';
import { INITIAL_USER_PROFILE } from '../data/mockData';

interface ProfileViewProps {
  onNavigate: (view: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onNavigate }) => {
  const [profile, setProfile] = useState(INITIAL_USER_PROFILE);
  const [whatsapp, setWhatsapp] = useState(profile.phone);
  const [preferredPosko, setPreferredPosko] = useState(profile.preferredPosko);
  const [maskName, setMaskName] = useState(profile.maskPublicName);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      phone: whatsapp,
      preferredPosko,
      maskPublicName: maskName,
    }));
    setShowSavedFeedback(true);
    setTimeout(() => {
      setShowSavedFeedback(false);
    }, 4000);
  };

  const handleTestBot = () => {
    alert(`Permintaan tes notifikasi bot terkirim ke WhatsApp ${whatsapp}! Periksa pesan masuk dalam 30 detik.`);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex flex-col gap-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[13px] text-[#45474c] font-semibold">
          <button
            onClick={() => onNavigate('catalog')}
            className="hover:text-[#1d4ed8] flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Beranda
          </button>
          <span className="material-symbols-outlined text-[14px]">chevron_right</span>
          <span className="text-[#131b2e] font-bold">Profil Pengguna & Identitas SSO</span>
        </nav>

        {/* 1. Header Profil & Kartu Identitas SSO Kampus (Bento Lead) */}
        <section className="bg-white rounded-3xl shadow-sm border border-[#eaedff] p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden">
          {/* Upper Banner Ribbon */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#e2e7ff] text-[#091426] text-[12px] font-bold">
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">verified_user</span>
              <span>Mahasiswa Aktif 2026/2027 • Terverifikasi SSO SIAKAD</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[12px] text-[#45474c] bg-[#f2f3ff] px-3 py-1 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-[#1d4ed8] animate-pulse"></span>
              <span>ID SSO: {profile.ssoId}</span>
            </div>
          </div>

          {/* Core Profile Identity Row */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-24 h-24 rounded-2xl bg-[#091426] text-white flex items-center justify-center text-3xl font-bold shadow-md ring-4 ring-[#eaedff]">
                  AZ
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow">
                  <span className="material-symbols-outlined text-[20px] text-[#00a472]">
                    check_circle
                  </span>
                </div>
              </div>

              {/* Student Metadata */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#091426] tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="px-2 py-0.5 rounded bg-[#dce1ff] text-[#001551] text-[11px] font-bold">
                    S1 Reguler
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[#45474c] text-[13px]">
                  <span className="font-bold text-[#131b2e]">NIM: {profile.nim}</span>
                  <span>•</span>
                  <span>{profile.program}</span>
                  <span>•</span>
                  <span>{profile.faculty}</span>
                </div>
                <div className="flex items-center gap-1 text-[#45474c] text-[12px] mt-1">
                  <span className="material-symbols-outlined text-[16px]">domain</span>
                  <span>Kampus Utama • Gedung Sayap Barat Lt. 3</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onNavigate('activity')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] font-bold text-[13px] rounded-xl transition-all shadow-xs border border-[#eaedff] cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">history_edu</span>
                <span>Buka Aktivitas Saya</span>
              </button>
              <button
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#f2f3ff] text-[#45474c] font-bold text-[13px] rounded-xl shadow-xs border border-[#eaedff] transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">badge</span>
                <span>Kartu Posko</span>
              </button>
            </div>
          </div>

          {/* Quick Stats Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#f2f3ff]">
            {/* Stat 1: Integritas Kampus */}
            <div className="p-4 rounded-2xl bg-[#f2f3ff] flex items-center justify-between gap-4 border border-[#eaedff]">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Skor Integritas Kampus
                </span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl font-extrabold text-[#091426]">
                    {profile.integrityScore}
                  </span>
                  <span className="text-[13px] text-[#45474c]">/100</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] text-[#00a472] font-bold mt-1">
                  <span className="material-symbols-outlined text-[14px]">military_tech</span>
                  Pelindung Kampus Teladan
                </span>
              </div>
              <div className="relative w-16 h-16 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    className="text-[#dae2fd]"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke="currentColor"
                    strokeWidth="3.5"
                  />
                  <circle
                    className="text-[#1d4ed8]"
                    cx="18"
                    cy="18"
                    fill="none"
                    r="15.915"
                    stroke="currentColor"
                    strokeDasharray="98, 100"
                    strokeLinecap="round"
                    strokeWidth="3.5"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[#1d4ed8]">
                  <span className="material-symbols-outlined text-[20px]">shield</span>
                </div>
              </div>
            </div>

            {/* Stat 2: Temuan Diserahkan */}
            <div className="p-4 rounded-2xl bg-[#f2f3ff] flex items-center justify-between gap-4 border border-[#eaedff]">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Barang Ditemukan & Pulang
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-[#091426]">
                    {profile.itemsFoundReturned}
                  </span>
                  <span className="text-[13px] text-[#45474c]">Insiden Selesai</span>
                </div>
                <span className="text-[11px] text-[#1d4ed8] font-bold mt-1">
                  100% Diserahkan ke Posko Resmi
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dce1ff] flex items-center justify-center text-[#001551] flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">front_hand</span>
              </div>
            </div>

            {/* Stat 3: Milik Pribadi Terselamatkan */}
            <div className="p-4 rounded-2xl bg-[#f2f3ff] flex items-center justify-between gap-4 border border-[#eaedff]">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Barang Pribadi Terselamatkan
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-extrabold text-[#091426]">
                    {profile.itemsPersonalRecovered}
                  </span>
                  <span className="text-[13px] text-[#45474c]">Laporan Temu</span>
                </div>
                <span className="text-[11px] text-[#00a472] font-bold mt-1">
                  Diambil di Posko Utama Rektorat
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#091426] flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2 Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Kontak, Lokasi Pengambilan (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#091426] text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[20px]">contact_phone</span>
                  </div>
                  <div>
                    <h2 className="text-[16px] font-bold text-[#091426]">Kontak Validasi Serah Terima</h2>
                    <p className="text-[12px] text-[#45474c]">
                      Kanal resmi yang dihubungi oleh petugas posko saat barang siap diserahterimakan.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded bg-[#f2f3ff] text-[#45474c] text-[11px] font-bold">
                  Wajib Aktif
                </span>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                {/* Nomor WhatsApp */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="profileWa">
                      Nomor WhatsApp Utama (Aktif Notifikasi Bot)
                    </label>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#00a472] font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span>
                      Terverifikasi Bot Kampus
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#45474c] pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">chat</span>
                    </span>
                    <input
                      className="w-full pl-10 pr-28 py-2.5 rounded-xl bg-[#f2f3ff] text-[14px] text-[#131b2e] focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                      id="profileWa"
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleTestBot}
                      className="absolute right-2 px-3 py-1 rounded-lg bg-[#dae2fd] hover:bg-[#eaedff] text-[#091426] font-bold text-[11px] transition-colors cursor-pointer"
                    >
                      Tes Pesan
                    </button>
                  </div>
                </div>

                {/* Email SSO Locked */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="profileEmail">
                      Email Mahasiswa Terpadu (SSO)
                    </label>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#45474c]">
                      <span className="material-symbols-outlined text-[14px]">lock</span>
                      Terkunci Otoritas SIAKAD
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#45474c] pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">mail</span>
                    </span>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#eaedff] font-mono text-[13px] text-[#45474c] cursor-not-allowed select-none border border-[#eaedff]"
                      id="profileEmail"
                      readOnly
                      type="email"
                      value={profile.email}
                    />
                  </div>
                </div>

                {/* Posko Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-bold text-[#131b2e]" htmlFor="profilePosko">
                    Posko Pengambilan Default / Terdekat
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3 text-[#45474c] pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">location_on</span>
                    </span>
                    <select
                      className="w-full appearance-none pl-10 pr-10 py-2.5 rounded-xl bg-[#f2f3ff] text-[13px] font-medium text-[#131b2e] focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff] cursor-pointer"
                      id="profilePosko"
                      value={preferredPosko}
                      onChange={(e) => setPreferredPosko(e.target.value)}
                    >
                      <option value="perpus-pusat">
                        Posko Perpustakaan Pusat Kampus (Gedung Rektorat Lt. 1)
                      </option>
                      <option value="satpam-barat">
                        Posko Sentral Sayap Barat (Gedung Lab Riset Terpadu)
                      </option>
                      <option value="daak-utama">
                        Loket DAAK Biro Kemahasiswaan (Gedung C Lt. 1)
                      </option>
                      <option value="gerbang-utama">
                        Pos Pengamanan Gerbang Utama (Layanan 24 Jam)
                      </option>
                    </select>
                    <span className="absolute right-3 text-[#45474c] pointer-events-none">
                      <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </span>
                  </div>
                </div>

                {/* Toggle Privasi */}
                <label className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-start gap-3 cursor-pointer select-none">
                  <input
                    checked={maskName}
                    onChange={(e) => setMaskName(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#1d4ed8] rounded cursor-pointer"
                    type="checkbox"
                  />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-[#131b2e]">
                      Samarkan nama lengkap di katalog publik (hanya inisial)
                    </span>
                    <span className="text-[11px] text-[#45474c] mt-0.5">
                      Direkomendasikan untuk menjaga privasi pribadi saat melaporkan barang berharga tinggi.
                    </span>
                  </div>
                </label>

                {showSavedFeedback && (
                  <div className="p-3 rounded-xl bg-[#6ffbbe]/40 text-[#002113] text-[13px] font-bold flex items-center gap-2 border border-[#4edea3]">
                    <span className="material-symbols-outlined text-[18px]">task_alt</span>
                    <span>Preferensi kontak berhasil diperbarui ke repositori Kampus!</span>
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#091426] hover:bg-[#1e293b] text-white font-bold text-[13px] shadow-sm flex items-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    <span>Simpan Perubahan Kontak</span>
                  </button>
                </div>
              </form>
            </section>

            {/* 3. Preferensi Notifikasi Pintar */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#dce1ff] text-[#001551] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#091426]">
                    Preferensi Notifikasi Pintar (Smart Match)
                  </h2>
                  <p className="text-[12px] text-[#45474c]">
                    Kelola peringatan kecocokan dan status tiket resmi
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#131b2e]">
                        Notifikasi WhatsApp Instan (Akurasi &gt; 80%)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-extrabold uppercase">
                        Rekomendasi
                      </span>
                    </div>
                    <p className="text-[12px] text-[#45474c]">Pemberitahuan real-time untuk barang serupa.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[13px] font-bold text-[#131b2e]">
                      Ringkasan Status Tiket & Verifikasi Posko (Email)
                    </span>
                    <p className="text-[12px] text-[#45474c]">Update status pengajuan klaim dan verifikasi.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-4">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[13px] font-bold text-[#131b2e]">
                        Peringatan Masa Kedaluwarsa Penitipan (H-3)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#e2e7ff] text-[#091426] text-[10px] font-bold">
                        SOP K3L
                      </span>
                    </div>
                    <p className="text-[12px] text-[#45474c]">Peringatan H-3 sebelum batas retensi posko berakhir.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input defaultChecked className="sr-only peer" type="checkbox" />
                    <div className="w-11 h-6 bg-[#dae2fd] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1d4ed8]"></div>
                  </label>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Civic Integrity Badges & Security Audit (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <section className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#dae2fd] text-[#091426] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
                  </div>
                  <h2 className="text-[16px] font-bold text-[#091426]">Lencana Integritas Kampus</h2>
                </div>
                <span className="text-[12px] text-[#1d4ed8] font-bold">2 Terbuka</span>
              </div>

              {/* Badges */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#1d4ed8] shadow-xs">
                    <span className="material-symbols-outlined text-[26px]">volunteer_activism</span>
                  </div>
                  <div>
                    <span className="text-[13px] font-bold text-[#131b2e] block">Penyelamat Emas</span>
                    <span className="text-[11px] text-[#45474c] mt-0.5 block">
                      3x menyerahkan temuan ke posko.
                    </span>
                  </div>
                  <span className="text-[11px] text-[#00a472] font-bold mt-auto">Terverifikasi</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#091426] shadow-xs">
                    <span className="material-symbols-outlined text-[26px]">speed</span>
                  </div>
                  <div>
                    <span className="text-[13px] font-bold text-[#131b2e] block">Verifikasi Cepat</span>
                    <span className="text-[11px] text-[#45474c] mt-0.5 block">
                      Validasi kepemilikan rata-rata &lt; 24 jam.
                    </span>
                  </div>
                  <span className="text-[11px] text-[#00a472] font-bold mt-auto">Terverifikasi</span>
                </div>
              </div>

              {/* Riwayat Pengembalian Selesai (BAST) */}
              <div className="flex flex-col gap-2 pt-2 border-t border-[#f2f3ff]">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Riwayat Pengembalian Selesai (BAST)
                </span>
                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#1d4ed8] shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">laptop_mac</span>
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-[#131b2e] block">MacBook Air M1 Silver</span>
                      <span className="text-[11px] text-[#45474c]">BAST: #BAST-2024-0891 • 14 Feb 2024</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-extrabold uppercase">
                    Tuntas
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#1d4ed8] shadow-xs">
                      <span className="material-symbols-outlined text-[20px]">wallet</span>
                    </div>
                    <div>
                      <span className="text-[13px] font-bold text-[#131b2e] block">Dompet Kulit Cokelat</span>
                      <span className="text-[11px] text-[#45474c]">BAST: #BAST-2024-0342 • 28 Jan 2024</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-extrabold uppercase">
                    Tuntas
                  </span>
                </div>
              </div>
            </section>

            {/* Keamanan Sesi & Autentikasi */}
            <section className="bg-white rounded-2xl shadow-sm border border-[#eaedff] p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#e2e7ff] text-[#091426] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">security</span>
                </div>
                <h2 className="text-[16px] font-bold text-[#091426]">Keamanan Sesi & Autentikasi</h2>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span>
                    <span className="text-[13px] font-bold text-[#131b2e]">Google Chrome • macOS</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#1d4ed8]">Aktif Sekarang</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#45474c] pl-4">
                  <span className="font-mono">IP: 10.240.18.92</span>
                  <span>•</span>
                  <span>Lokasi: Gedung Lab Terpadu</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => alert('Membuka portal layanan keamanan SIAKAD terpadu...')}
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 bg-[#f2f3ff] hover:bg-[#e2e7ff] text-[#131b2e] rounded-xl text-[13px] font-bold transition-colors cursor-pointer border border-[#eaedff]"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">password</span>
                    <span>Kelola Kata Sandi SSO di Portal Terpadu</span>
                  </div>
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('auth')}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#ffdad6]/60 hover:bg-[#ffdad6] text-[#ba1a1a] rounded-xl text-[13px] font-bold transition-colors cursor-pointer border border-[#ffdad6]"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  <span>Keluar Akun dari Seluruh Perangkat</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
