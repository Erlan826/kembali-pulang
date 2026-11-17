import React, { useState } from 'react';

interface AdminAnalyticsViewProps {
  onNavigate: (view: string) => void;
}

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'petugas' | 'kategori' | 'audit'>('petugas');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      alert('Arsip Laporan Audit K3L & Rekonsiliasi Aset (PDF & Spreadsheet) berhasil diunduh!');
    }, 1500);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section: Filter & Admin Control Center */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold uppercase tracking-wider">
                Biro Kemahasiswaan & K3L
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a472]"></span>
              <span className="text-[12px] text-[#45474c] font-semibold">
                Sistem Monitoring Terpusat v3.8
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#091426] tracking-tight">
              Pusat Analitik & Tata Kelola Barang Hilang Kampus
            </h1>
            <p className="text-[13px] text-[#45474c]">
              Evaluasi efisiensi pengembalian aset, audit kepatuhan posko, dan integritas pencocokan identitas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Periode Selector */}
            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-2 rounded-xl border border-[#eaedff]">
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">calendar_month</span>
              <select className="bg-transparent text-[13px] font-bold text-[#091426] focus:outline-none cursor-pointer">
                <option value="ganjil-2026">Semester Ganjil 2026/2027</option>
                <option value="genap-2025">Semester Genap 2025/2026</option>
                <option value="tahunan">Tahun Akademik Penuh 2026</option>
              </select>
            </div>

            {/* Filter Gedung */}
            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-2 rounded-xl border border-[#eaedff]">
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">corporate_fare</span>
              <select className="bg-transparent text-[13px] font-bold text-[#091426] focus:outline-none cursor-pointer">
                <option value="all">Semua Gedung Kampus</option>
                <option value="perpus">Perpustakaan Pusat</option>
                <option value="gku">Gedung Kuliah Bersama (GKU)</option>
                <option value="kantin">Kantin & Boulevard</option>
              </select>
            </div>

            {/* Tombol Export */}
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-[#091426] hover:bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExporting ? 'progress_activity' : 'download_for_offline'}
              </span>
              <span>{isExporting ? 'Membuat Arsip...' : 'Ekspor Laporan Audit'}</span>
            </button>
          </div>
        </div>

        {/* Baris Metrik KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* KPI 1 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Total Laporan Temuan
                </span>
                <span className="p-1.5 rounded-lg bg-[#f2f3ff] text-[#1d4ed8]">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#091426]">482</span>
                <span className="text-[13px] font-bold text-[#45474c]">Barang</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#00a472] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +18%
              </span>
              <span className="text-[#45474c]">vs Semester Lalu</span>
            </div>
          </div>

          {/* KPI 2 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Recovery Rate
                </span>
                <span className="p-1.5 rounded-lg bg-[#6ffbbe]/40 text-[#002113]">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#091426]">89.2%</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] uppercase">
                  Sangat Baik
                </span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45474c]">Target K3L: 85.0%</span>
              <span className="text-[#00a472] font-bold">+4.2% Melampaui</span>
            </div>
          </div>

          {/* KPI 3 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Rata-rata Siklus Pengembalian
                </span>
                <span className="p-1.5 rounded-lg bg-[#eaedff] text-[#1d4ed8]">
                  <span className="material-symbols-outlined text-[20px]">pace</span>
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#091426]">3.4</span>
                <span className="text-[13px] font-bold text-[#45474c]">Hari</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#00a472] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">south</span> -8.6 Hari
              </span>
              <span className="text-[#45474c]">Turun dr 12 hari (2023)</span>
            </div>
          </div>

          {/* KPI 4 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Aset Terselamatkan
                </span>
                <span className="p-1.5 rounded-lg bg-[#dae2fd] text-[#091426]">
                  <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                </span>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-extrabold text-[#091426]">Rp 412.5M</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45474c]">Estimasi Valuasi</span>
              <span className="text-[#1d4ed8] font-bold">430 Barang Kembali</span>
            </div>
          </div>
        </div>

        {/* Bento Grid: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Trend Bar Chart - 8 cols */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-bold text-[#091426]">
                  Tren Laporan Temuan vs Pengembalian
                </h2>
                <p className="text-[12px] text-[#45474c]">
                  Komparasi fluktuasi barang masuk posko berbanding klaim sah terverifikasi (Juli - Desember)
                </p>
              </div>
              <div className="flex items-center gap-4 text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#091426]"></span>
                  <span className="text-[#45474c]">Temuan Masuk</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-[#1d4ed8]"></span>
                  <span className="text-[#45474c]">Sukses Dikembalikan</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="w-full h-64 flex flex-col justify-end pt-4">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 700 240">
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="20" y2="20"></line>
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="75" y2="75"></line>
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="130" y2="130"></line>
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="185" y2="185"></line>
                <line stroke="#CBD5E1" strokeWidth="1.5" x1="0" x2="700" y1="210" y2="210"></line>

                {/* Bars */}
                {[
                  { month: 'Juli', found: 130, ret: 105, x: 35 },
                  { month: 'Agust', found: 155, ret: 138, x: 150 },
                  { month: 'Sept', found: 185, ret: 168, x: 265 },
                  { month: 'Okt', found: 172, ret: 156, x: 380 },
                  { month: 'Nov', found: 142, ret: 128, x: 495 },
                  { month: 'Des', found: 166, ret: 152, x: 610 },
                ].map((d) => (
                  <g key={d.month} className="transition-all hover:opacity-85">
                    <rect fill="#091426" height={d.found} rx="4" width="28" x={d.x} y={210 - d.found}></rect>
                    <rect fill="#1d4ed8" height={d.ret} rx="4" width="28" x={d.x + 32} y={210 - d.ret}></rect>
                    <text fill="#45474c" fontSize="12" textAnchor="middle" x={d.x + 30} y="228">
                      {d.month}
                    </text>
                  </g>
                ))}

                {/* Recovery curve */}
                <path d="M 81 105 Q 180 70, 295 42 T 410 54 T 525 82 T 640 58" fill="none" stroke="#00a472" strokeWidth="3"></path>
                <circle cx="295" cy="42" r="5" fill="#6ffbbe" stroke="#00301e" strokeWidth="2"></circle>
                <circle cx="640" cy="58" r="5" fill="#6ffbbe" stroke="#00301e" strokeWidth="2"></circle>
              </svg>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] text-[#45474c] text-[12px] border border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#00a472]">insights</span>
                <span>Lonjakan kehilangan tertinggi terdeteksi saat awal semester (September - 95 laporan) dan masa UAS.</span>
              </div>
              <button
                onClick={() => alert('Mengunduh rincian bulanan ke format CSV...')}
                className="text-[#1d4ed8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Unduh Breakdown</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Donut Chart - 4 cols */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[16px] font-bold text-[#091426]">Komposisi Kategori Barang</h2>
                <span className="text-[11px] font-mono font-bold text-[#45474c]">482 UNIT</span>
              </div>
              <p className="text-[12px] text-[#45474c]">Rincian klasifikasi objek yang diserahterimakan</p>
            </div>

            {/* Donut Visualization */}
            <div className="relative flex items-center justify-center py-2">
              <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#F2F3FF" strokeWidth="14"></circle>
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#091426" strokeDasharray="100.3 238.8" strokeDashoffset="0" strokeWidth="14"></circle>
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#1D4ED8" strokeDasharray="74 238.8" strokeDashoffset="-100.3" strokeWidth="14"></circle>
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#4EDEA3" strokeDasharray="35.8 238.8" strokeDashoffset="-174.3" strokeWidth="14"></circle>
                <circle cx="50" cy="50" fill="transparent" r="38" stroke="#BCC7DE" strokeDasharray="28.7 238.8" strokeDashoffset="-210.1" strokeWidth="14"></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extrabold text-[#091426]">42%</span>
                <span className="text-[10px] font-bold text-[#45474c] uppercase">Elektronik</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-[12px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#091426]"></span>
                  <span className="text-[#131b2e]">Elektronik & Gadget</span>
                </div>
                <span className="font-bold">202 unit (42%)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1d4ed8]"></span>
                  <span className="text-[#131b2e]">KTM & Dompet/Kartu</span>
                </div>
                <span className="font-bold">149 unit (31%)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#4edea3]"></span>
                  <span className="text-[#131b2e]">Jaket & Pakaian</span>
                </div>
                <span className="font-bold">73 unit (15%)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#bcc7de]"></span>
                  <span className="text-[#131b2e]">Kunci & Lain-lain</span>
                </div>
                <span className="font-bold">58 unit (12%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Peta Distribusi Titik Rawan Kehilangan */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#091426] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#1d4ed8]">location_on</span>
                Peta Distribusi Titik Rawan Kehilangan per Lokasi Kampus
              </h2>
              <p className="text-[12px] text-[#45474c]">
                Fokus pengawasan K3L & penempatan loker posko serah-terima di zona berdensitas tinggi
              </p>
            </div>
            <span className="px-3 py-1 bg-[#eaedff] text-[#091426] rounded-xl text-[11px] font-bold">
              Total 5 Zona Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual Heatmap Node */}
            <div className="lg:col-span-6 bg-[#f2f3ff] rounded-2xl p-5 border border-[#eaedff] space-y-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase text-[#45474c] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
                  Denah Heatmap Kampus Utama
                </span>
                <span className="font-mono text-[#45474c]">Lat: -6.3621, Long: 106.8249</span>
              </div>

              <div className="grid grid-cols-3 gap-3 py-2">
                <div className="p-3 rounded-xl bg-white shadow-xs border-l-4 border-[#ba1a1a] text-center">
                  <span className="material-symbols-outlined text-[#ba1a1a]">local_library</span>
                  <span className="text-[12px] font-bold text-[#091426] block mt-1">Perpustakaan</span>
                  <span className="text-xl font-extrabold text-[#ba1a1a]">34%</span>
                  <span className="text-[10px] text-[#45474c] block">164 Insiden</span>
                </div>

                <div className="p-3 rounded-xl bg-white shadow-xs border-l-4 border-[#1d4ed8] text-center">
                  <span className="material-symbols-outlined text-[#1d4ed8]">school</span>
                  <span className="text-[12px] font-bold text-[#091426] block mt-1">GKU Kuliah</span>
                  <span className="text-xl font-extrabold text-[#1d4ed8]">28%</span>
                  <span className="text-[10px] text-[#45474c] block">135 Insiden</span>
                </div>

                <div className="p-3 rounded-xl bg-white shadow-xs border-l-4 border-[#00a472] text-center">
                  <span className="material-symbols-outlined text-[#00a472]">storefront</span>
                  <span className="text-[12px] font-bold text-[#091426] block mt-1">Kantin Pusat</span>
                  <span className="text-xl font-extrabold text-[#091426]">19%</span>
                  <span className="text-[10px] text-[#45474c] block">92 Insiden</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#45474c] pt-1">
                <span>Zona Patroli Posko K3L Aktif</span>
                <span className="text-[#1d4ed8] font-bold">Sinkronisasi CCTV Realtime</span>
              </div>
            </div>

            {/* Ranking Breakdown */}
            <div className="lg:col-span-6 space-y-3 text-[12px]">
              <div>
                <div className="flex justify-between font-bold text-[#091426]">
                  <span>#1 Gedung Perpustakaan Pusat (Lt. 1-4)</span>
                  <span>164 Barang (34%)</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#091426] h-full rounded-full" style={{ width: '34%' }}></div>
                </div>
                <span className="text-[10px] text-[#ba1a1a] font-bold">Tingkat Risiko: Tinggi</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[#091426]">
                  <span>#2 Gedung Kuliah Bersama (GKU)</span>
                  <span>135 Barang (28%)</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#1d4ed8] h-full rounded-full" style={{ width: '28%' }}></div>
                </div>
                <span className="text-[10px] text-[#1d4ed8] font-bold">Tingkat Risiko: Sedang-Tinggi</span>
              </div>

              <div>
                <div className="flex justify-between font-bold text-[#091426]">
                  <span>#3 Kantin Pusat & Boulevard</span>
                  <span>92 Barang (19%)</span>
                </div>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden mt-1">
                  <div className="bg-[#00a472] h-full rounded-full" style={{ width: '19%' }}></div>
                </div>
                <span className="text-[10px] text-[#00a472] font-bold">Tingkat Risiko: Sedang</span>
              </div>
            </div>
          </div>
        </div>

        {/* Master Data & Sub-tabs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f2f3ff] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#091426]">
                Tata Kelola Master Data & Pengawasan Posko
              </h2>
              <p className="text-[12px] text-[#45474c]">
                Akses operasional petugas, registrasi loker baru, dan audit keamanan privasi ciri rahasia
              </p>
            </div>

            <div className="flex items-center p-1 bg-[#f2f3ff] rounded-xl text-[12px] font-bold text-[#45474c]">
              <button
                onClick={() => setActiveTab('petugas')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'petugas' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                }`}
              >
                Petugas & Posko (14 Aktif)
              </button>
              <button
                onClick={() => setActiveTab('kategori')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'kategori' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                }`}
              >
                Master Gedung & Loker
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'audit' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                }`}
              >
                Audit Security Log
              </button>
            </div>
          </div>

          {/* Sub-tab 1: Petugas Table */}
          {activeTab === 'petugas' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#f2f3ff] text-[#45474c] text-[11px] uppercase font-bold tracking-wider">
                    <th className="py-2.5 px-3 rounded-l-lg">Petugas / ID NIP</th>
                    <th className="py-2.5 px-3">Lokasi Posko Jaga</th>
                    <th className="py-2.5 px-3">Peran</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Kinerja</th>
                    <th className="py-2.5 px-3 text-right rounded-r-lg">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2f3ff]">
                  <tr className="hover:bg-[#f2f3ff]/60">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[12px]">
                          BW
                        </div>
                        <div>
                          <span className="font-bold text-[#091426] block">Bambang Wijaya, S.AP</span>
                          <span className="font-mono text-[11px] text-[#45474c]">NIP. 198204122008011003</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">Posko 1 - Rektorat & K3L Pusat</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[10px] font-bold">
                        Koordinator Senior
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[#00a472] font-bold flex items-center gap-1 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a472]"></span> Aktif Jaga
                      </span>
                    </td>
                    <td className="py-3 px-3">142 Klaim (99.1% Akurat)</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert('Mengatur hak akses NIP 198204122008011003...')}
                        className="text-[#1d4ed8] font-bold hover:underline cursor-pointer"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#f2f3ff]/60">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-bold text-[12px]">
                          SR
                        </div>
                        <div>
                          <span className="font-bold text-[#091426] block">Siti Rahmawati</span>
                          <span className="font-mono text-[11px] text-[#45474c]">ID. PK3L-2023-089</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">Posko 2 - Perpustakaan Pusat</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#091426] text-[10px] font-bold">
                        Petugas Loket Fisik
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-[#00a472] font-bold flex items-center gap-1 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a472]"></span> Aktif Jaga
                      </span>
                    </td>
                    <td className="py-3 px-3">118 Klaim (97.4% Akurat)</td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => alert('Mengatur hak akses ID. PK3L-2023-089...')}
                        className="text-[#1d4ed8] font-bold hover:underline cursor-pointer"
                      >
                        Kelola
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Sub-tab 2: Loker */}
          {activeTab === 'kategori' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#1d4ed8]">Posko A - Perpus</span>
                <h4 className="font-bold text-[#091426] text-[14px]">Loker Elektronik Khusus</h4>
                <p className="text-[12px] text-[#45474c]">Kapasitas: 18/24 Terisi (Sisa 6 Slot RFID)</p>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#1d4ed8] h-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#1d4ed8]">Posko B - GKU</span>
                <h4 className="font-bold text-[#091426] text-[14px]">Loker Non-Elektronik</h4>
                <p className="text-[12px] text-[#45474c]">Kapasitas: 12/30 Terisi (Sisa 18 Slot)</p>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#091426] h-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <span className="text-[10px] font-bold uppercase text-[#ba1a1a]">Posko C - Rektorat</span>
                <h4 className="font-bold text-[#091426] text-[14px]">Brankas Dokumen Berharga</h4>
                <p className="text-[12px] text-[#45474c]">Kapasitas: 28/30 Terisi (Hampir Penuh)</p>
                <div className="w-full bg-[#eaedff] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#ba1a1a] h-full" style={{ width: '93%' }}></div>
                </div>
              </div>
            </div>
          )}

          {/* Sub-tab 3: Audit Log */}
          {activeTab === 'audit' && (
            <div className="space-y-2 text-[12px]">
              <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#091426]">
                    Bambang Wijaya (Koordinator) membuka ciri rahasia: #INV-2024-0891
                  </span>
                  <p className="text-[11px] text-[#45474c]">
                    Alasan: Pencocokan Serial Number laser dengan pengklaim Ahmad Zaki
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#00a472] font-bold">
                  VERIFIED SSO • HARI INI
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex items-center justify-between">
                <div>
                  <span className="font-bold text-[#091426]">
                    Siti Rahmawati membuka ciri rahasia: #INV-2024-0892 (Dompet Cokelat)
                  </span>
                  <p className="text-[11px] text-[#45474c]">
                    Alasan: Pemeriksaan kartu identitas SIM/KTP sebelum serah terima fisik
                  </p>
                </div>
                <span className="text-[10px] font-mono text-[#00a472] font-bold">
                  VERIFIED SSO • HARI INI
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
