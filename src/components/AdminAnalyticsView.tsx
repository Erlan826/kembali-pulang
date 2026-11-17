import React, { useMemo, useState } from 'react';
import { FoundItem, LostReport } from '../data/mockData';

interface AdminAnalyticsViewProps {
  foundItems: FoundItem[];
  lostReports: LostReport[];
  onNavigate: (view: string) => void;
}

interface OfficerRecord {
  id: string;
  initials: string;
  name: string;
  nip: string;
  posko: string;
  role: string;
  status: 'Aktif Jaga' | 'Cuti' | 'Off Duty';
  stats: string;
  badgeColor: string;
}

const INITIAL_OFFICERS: OfficerRecord[] = [
  {
    id: 'off-1',
    initials: 'BW',
    name: 'Bambang Wijaya, S.AP',
    nip: 'NIP. 198204122008011003',
    posko: 'Posko 1 - Rektorat & K3L Pusat',
    role: 'Koordinator Senior',
    status: 'Aktif Jaga',
    stats: '142 Klaim (99.1% Akurat)',
    badgeColor: 'bg-[#091426]',
  },
  {
    id: 'off-2',
    initials: 'SR',
    name: 'Siti Rahmawati',
    nip: 'ID. PK3L-2023-089',
    posko: 'Posko 2 - Perpustakaan Pusat',
    role: 'Petugas Loket Fisik',
    status: 'Aktif Jaga',
    stats: '118 Klaim (97.4% Akurat)',
    badgeColor: 'bg-[#1d4ed8]',
  },
];

export const AdminAnalyticsView: React.FC<AdminAnalyticsViewProps> = ({
  foundItems,
  lostReports,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<'petugas' | 'kategori' | 'audit'>('petugas');
  const [period, setPeriod] = useState<'ganjil-2026' | 'genap-2025' | 'tahunan'>('ganjil-2026');
  const [building, setBuilding] = useState<'all' | 'perpus' | 'gku' | 'kantin'>('all');
  const [isExporting, setIsExporting] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [officers, setOfficers] = useState<OfficerRecord[]>(INITIAL_OFFICERS);
  const [editingOfficer, setEditingOfficer] = useState<OfficerRecord | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Scale/filter dashboard metrics cleanly based on Period + Building + Live session data
  const analytics = useMemo(() => {
    const periodFactor = period === 'tahunan' ? 1.85 : period === 'genap-2025' ? 0.88 : 1;
    const buildingShare =
      building === 'perpus' ? 0.34 : building === 'gku' ? 0.28 : building === 'kantin' ? 0.19 : 1;

    const liveItemsCount = foundItems.length;
    const liveReturnedCount = foundItems.filter((i) => i.status === 'selesai').length;
    const totalFound = Math.round(474 * periodFactor * buildingShare) + liveItemsCount;
    const totalReturned =
      Math.round(422 * periodFactor * buildingShare) + liveReturnedCount;
    const recoveryRate = Math.min(97.5, Number(((totalReturned / Math.max(1, totalFound)) * 100).toFixed(1)));
    const avgDays =
      building === 'perpus' ? '2.8' : building === 'gku' ? '3.6' : period === 'genap-2025' ? '4.1' : '3.4';
    const valuationM = (totalReturned * 0.96).toFixed(1);

    const monthlyBars = [
      { month: 'Juli', found: Math.round(130 * buildingShare), ret: Math.round(105 * buildingShare), x: 35 },
      { month: 'Agust', found: Math.round(155 * buildingShare), ret: Math.round(138 * buildingShare), x: 150 },
      { month: 'Sept', found: Math.round(185 * buildingShare), ret: Math.round(168 * buildingShare), x: 265 },
      { month: 'Okt', found: Math.round(172 * buildingShare), ret: Math.round(156 * buildingShare), x: 380 },
      { month: 'Nov', found: Math.round(142 * buildingShare), ret: Math.round(128 * buildingShare), x: 495 },
      { month: 'Des', found: Math.round(166 * buildingShare), ret: Math.round(152 * buildingShare), x: 610 },
    ].map((b) => ({
      ...b,
      foundHeight: Math.max(24, Math.min(185, Math.round(b.found * (period === 'tahunan' ? 1.05 : 1)))),
      retHeight: Math.max(18, Math.min(180, Math.round(b.ret * (period === 'tahunan' ? 1.05 : 1)))),
    }));

    return {
      totalFound,
      totalReturned,
      recoveryRate,
      avgDays,
      valuationM,
      monthlyBars,
      liveItemsCount,
      liveLostCount: lostReports.length,
    };
  }, [period, building, foundItems, lostReports]);

  const downloadCsv = (filename: string, rows: string[][]) => {
    const csvContent = rows
      .map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const rows: string[][] = [
        ['ID Inventaris', 'Nama Barang', 'Kategori', 'Lokasi Temuan', 'Status', 'Pengklaim', 'No BAST'],
        ...foundItems.map((item) => [
          item.id,
          item.title,
          item.categoryLabel,
          item.location,
          item.statusLabel,
          item.claimantName || '-',
          item.bastNumber || '-',
        ]),
      ];
      downloadCsv(`laporan-audit-k3l-${period}-${building}.csv`, rows);
      setIsExporting(false);
      showToast('Arsip CSV Laporan Audit K3L & Rekonsiliasi Aset berhasil diunduh!');
    }, 500);
  };

  const handleDownloadMonthlyBreakdown = () => {
    const rows: string[][] = [
      ['Bulan', 'Temuan Masuk (Unit)', 'Dikembalikan (Unit)', 'Periode', 'Gedung'],
      ...analytics.monthlyBars.map((b) => [
        b.month,
        String(b.found),
        String(b.ret),
        period,
        building,
      ]),
    ];
    downloadCsv(`breakdown-bulanan-${period}-${building}.csv`, rows);
    showToast('Rincian bulanan berhasil diunduh dalam format CSV!');
  };

  const handleSaveOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOfficer) return;
    setOfficers((prev) =>
      prev.map((o) => (o.id === editingOfficer.id ? editingOfficer : o))
    );
    showToast(`Hak akses & shift ${editingOfficer.name} berhasil diperbarui.`);
    setEditingOfficer(null);
  };

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold uppercase tracking-wider">
                Biro Kemahasiswaan &amp; K3L
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a472]"></span>
              <span className="text-[12px] text-[#45474c] font-semibold">
                Sistem Monitoring Terpusat v3.8
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#091426] tracking-tight">
              Pusat Analitik &amp; Tata Kelola Barang Hilang Kampus
            </h1>
            <p className="text-[13px] text-[#45474c]">
              Evaluasi efisiensi pengembalian aset, audit kepatuhan posko, dan integritas pencocokan identitas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-2 rounded-xl border border-[#eaedff]">
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">calendar_month</span>
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value as typeof period)}
                className="bg-transparent text-[13px] font-bold text-[#091426] focus:outline-none cursor-pointer"
              >
                <option value="ganjil-2026">Semester Ganjil 2026/2027</option>
                <option value="genap-2025">Semester Genap 2025/2026</option>
                <option value="tahunan">Tahun Akademik Penuh 2026</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-[#f2f3ff] px-3.5 py-2 rounded-xl border border-[#eaedff]">
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">corporate_fare</span>
              <select
                value={building}
                onChange={(e) => setBuilding(e.target.value as typeof building)}
                className="bg-transparent text-[13px] font-bold text-[#091426] focus:outline-none cursor-pointer"
              >
                <option value="all">Semua Gedung Kampus</option>
                <option value="perpus">Perpustakaan Pusat</option>
                <option value="gku">Gedung Kuliah Bersama (GKU)</option>
                <option value="kantin">Kantin &amp; Boulevard</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center gap-2 bg-[#091426] hover:bg-[#1e293b] text-white px-4 py-2.5 rounded-xl text-[13px] font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isExporting ? 'progress_activity' : 'download_for_offline'}
              </span>
              <span>{isExporting ? 'Membuat CSV...' : 'Ekspor Laporan Audit'}</span>
            </button>
          </div>
        </div>

        {/* Baris Metrik KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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
                <span className="text-3xl font-extrabold text-[#091426]">{analytics.totalFound}</span>
                <span className="text-[13px] font-bold text-[#45474c]">Barang</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#00a472] font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                {analytics.liveItemsCount} Aktif Sesi Ini
              </span>
              <span className="text-[#45474c]">{analytics.liveLostCount} Lapor Hilang</span>
            </div>
          </div>

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
                <span className="text-3xl font-extrabold text-[#091426]">{analytics.recoveryRate}%</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] uppercase">
                  Sangat Baik
                </span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45474c]">Target K3L: 85.0%</span>
              <span className="text-[#00a472] font-bold">Terverifikasi Audit</span>
            </div>
          </div>

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
                <span className="text-3xl font-extrabold text-[#091426]">{analytics.avgDays}</span>
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
                <span className="text-2xl font-extrabold text-[#091426]">Rp {analytics.valuationM}M</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="text-[#45474c]">Estimasi Valuasi</span>
              <span className="text-[#1d4ed8] font-bold">{analytics.totalReturned} Barang Kembali</span>
            </div>
          </div>
        </div>

        {/* Bento Grid: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-[16px] font-bold text-[#091426]">
                  Tren Laporan Temuan vs Pengembalian
                </h2>
                <p className="text-[12px] text-[#45474c]">
                  Komparasi fluktuasi barang masuk posko berbanding klaim sah terverifikasi
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

            <div className="w-full h-64 flex flex-col justify-end pt-4">
              <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 700 240">
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="20" y2="20"></line>
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="75" y2="75"></line>
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="130" y2="130"></line>
                <line stroke="#E2E7FF" strokeDasharray="4 4" strokeWidth="1" x1="0" x2="700" y1="185" y2="185"></line>
                <line stroke="#CBD5E1" strokeWidth="1.5" x1="0" x2="700" y1="210" y2="210"></line>

                {analytics.monthlyBars.map((d) => (
                  <g key={d.month} className="transition-all hover:opacity-85">
                    <rect
                      fill="#091426"
                      height={d.foundHeight}
                      rx="4"
                      width="28"
                      x={d.x}
                      y={210 - d.foundHeight}
                    ></rect>
                    <rect
                      fill="#1d4ed8"
                      height={d.retHeight}
                      rx="4"
                      width="28"
                      x={d.x + 32}
                      y={210 - d.retHeight}
                    ></rect>
                    <text fill="#45474c" fontSize="12" textAnchor="middle" x={d.x + 30} y="228">
                      {d.month}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-[#f2f3ff] text-[#45474c] text-[12px] border border-[#eaedff]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#00a472]">insights</span>
                <span>Lonjakan kehilangan tertinggi terdeteksi saat awal semester dan masa ujian.</span>
              </div>
              <button
                onClick={handleDownloadMonthlyBreakdown}
                className="text-[#1d4ed8] font-bold hover:underline flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Unduh Breakdown CSV</span>
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-[16px] font-bold text-[#091426]">Komposisi Kategori Barang</h2>
                <span className="text-[11px] font-mono font-bold text-[#45474c]">
                  {analytics.totalFound} UNIT
                </span>
              </div>
              <p className="text-[12px] text-[#45474c]">Rincian klasifikasi objek yang diserahterimakan</p>
            </div>

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

            <div className="space-y-1.5 text-[12px]">
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#091426]"></span>
                  <span className="text-[#131b2e]">Elektronik &amp; Gadget</span>
                </div>
                <span className="font-bold">{Math.round(analytics.totalFound * 0.42)} unit (42%)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#1d4ed8]"></span>
                  <span className="text-[#131b2e]">KTM &amp; Dompet/Kartu</span>
                </div>
                <span className="font-bold">{Math.round(analytics.totalFound * 0.31)} unit (31%)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#4edea3]"></span>
                  <span className="text-[#131b2e]">Jaket &amp; Pakaian</span>
                </div>
                <span className="font-bold">{Math.round(analytics.totalFound * 0.15)} unit (15%)</span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded-lg hover:bg-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#bcc7de]"></span>
                  <span className="text-[#131b2e]">Kunci &amp; Lain-lain</span>
                </div>
                <span className="font-bold">{Math.round(analytics.totalFound * 0.12)} unit (12%)</span>
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
                Klik kartu zona di bawah untuk memfilter metrik berdasarkan gedung kampus
              </p>
            </div>
            <span className="px-3 py-1 bg-[#eaedff] text-[#091426] rounded-xl text-[11px] font-bold">
              Total 5 Zona Aktif
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-6 bg-[#f2f3ff] rounded-2xl p-5 border border-[#eaedff] space-y-4">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold uppercase text-[#45474c] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#ba1a1a] animate-ping"></span>
                  Denah Heatmap Kampus Utama
                </span>
                <button
                  type="button"
                  onClick={() => setBuilding('all')}
                  className="font-mono text-[#1d4ed8] font-bold hover:underline cursor-pointer"
                >
                  {building === 'all' ? 'Semua Zona' : 'Reset ke Semua Zona'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-3 py-2">
                <button
                  type="button"
                  onClick={() => setBuilding(building === 'perpus' ? 'all' : 'perpus')}
                  className={`p-3 rounded-xl bg-white shadow-xs border-l-4 border-[#ba1a1a] text-center cursor-pointer transition-all ${
                    building === 'perpus' ? 'ring-2 ring-[#ba1a1a]' : 'hover:shadow-md'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#ba1a1a]">local_library</span>
                  <span className="text-[12px] font-bold text-[#091426] block mt-1">Perpustakaan</span>
                  <span className="text-xl font-extrabold text-[#ba1a1a]">34%</span>
                  <span className="text-[10px] text-[#45474c] block">164 Insiden</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBuilding(building === 'gku' ? 'all' : 'gku')}
                  className={`p-3 rounded-xl bg-white shadow-xs border-l-4 border-[#1d4ed8] text-center cursor-pointer transition-all ${
                    building === 'gku' ? 'ring-2 ring-[#1d4ed8]' : 'hover:shadow-md'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#1d4ed8]">school</span>
                  <span className="text-[12px] font-bold text-[#091426] block mt-1">GKU Kuliah</span>
                  <span className="text-xl font-extrabold text-[#1d4ed8]">28%</span>
                  <span className="text-[10px] text-[#45474c] block">135 Insiden</span>
                </button>

                <button
                  type="button"
                  onClick={() => setBuilding(building === 'kantin' ? 'all' : 'kantin')}
                  className={`p-3 rounded-xl bg-white shadow-xs border-l-4 border-[#00a472] text-center cursor-pointer transition-all ${
                    building === 'kantin' ? 'ring-2 ring-[#00a472]' : 'hover:shadow-md'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#00a472]">storefront</span>
                  <span className="text-[12px] font-bold text-[#091426] block mt-1">Kantin Pusat</span>
                  <span className="text-xl font-extrabold text-[#091426]">19%</span>
                  <span className="text-[10px] text-[#45474c] block">92 Insiden</span>
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#45474c] pt-1">
                <span>Zona Patroli Posko K3L Aktif</span>
                <span className="text-[#1d4ed8] font-bold">Sinkronisasi CCTV Realtime</span>
              </div>
            </div>

            {/* Ranking Breakdown (SVG progress bars, zero inline styles) */}
            <div className="lg:col-span-6 space-y-3 text-[12px]">
              {[
                {
                  rank: '#1 Gedung Perpustakaan Pusat (Lt. 1-4)',
                  count: '164 Barang (34%)',
                  pct: 34,
                  color: '#091426',
                  risk: 'Tingkat Risiko: Tinggi',
                  riskCls: 'text-[#ba1a1a]',
                },
                {
                  rank: '#2 Gedung Kuliah Bersama (GKU)',
                  count: '135 Barang (28%)',
                  pct: 28,
                  color: '#1d4ed8',
                  risk: 'Tingkat Risiko: Sedang-Tinggi',
                  riskCls: 'text-[#1d4ed8]',
                },
                {
                  rank: '#3 Kantin Pusat & Boulevard',
                  count: '92 Barang (19%)',
                  pct: 19,
                  color: '#00a472',
                  risk: 'Tingkat Risiko: Sedang',
                  riskCls: 'text-[#00a472]',
                },
              ].map((zone) => (
                <div key={zone.rank}>
                  <div className="flex justify-between font-bold text-[#091426]">
                    <span>{zone.rank}</span>
                    <span>{zone.count}</span>
                  </div>
                  <svg className="w-full h-2 mt-1 rounded-full overflow-hidden" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <rect x="0" y="0" width="100" height="8" rx="4" fill="#eaedff" />
                    <rect x="0" y="0" width={zone.pct} height="8" rx="4" fill={zone.color} />
                  </svg>
                  <span className={`text-[10px] font-bold ${zone.riskCls}`}>{zone.risk}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Master Data & Sub-tabs */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f2f3ff] pb-3">
            <div>
              <h2 className="text-[16px] font-bold text-[#091426]">
                Tata Kelola Master Data &amp; Pengawasan Posko
              </h2>
              <p className="text-[12px] text-[#45474c]">
                Akses operasional petugas, kapasitas loker aktif, dan audit keamanan privasi ciri rahasia
              </p>
            </div>

            <div className="flex items-center p-1 bg-[#f2f3ff] rounded-xl text-[12px] font-bold text-[#45474c]">
              <button
                onClick={() => setActiveTab('petugas')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'petugas' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                }`}
              >
                Petugas &amp; Posko ({officers.filter((o) => o.status === 'Aktif Jaga').length} Aktif)
              </button>
              <button
                onClick={() => setActiveTab('kategori')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === 'kategori' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                }`}
              >
                Master Gedung &amp; Loker
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
                  {officers.map((off) => (
                    <tr key={off.id} className="hover:bg-[#f2f3ff]/60">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full ${off.badgeColor} text-white flex items-center justify-center font-bold text-[12px]`}
                          >
                            {off.initials}
                          </div>
                          <div>
                            <span className="font-bold text-[#091426] block">{off.name}</span>
                            <span className="font-mono text-[11px] text-[#45474c]">{off.nip}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">{off.posko}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[10px] font-bold">
                          {off.role}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold flex items-center gap-1 text-[11px] ${
                            off.status === 'Aktif Jaga'
                              ? 'text-[#00a472]'
                              : off.status === 'Cuti'
                              ? 'text-[#ba1a1a]'
                              : 'text-[#45474c]'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              off.status === 'Aktif Jaga'
                                ? 'bg-[#00a472]'
                                : off.status === 'Cuti'
                                ? 'bg-[#ba1a1a]'
                                : 'bg-[#75777d]'
                            }`}
                          ></span>{' '}
                          {off.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">{off.stats}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setEditingOfficer({ ...off })}
                          className="text-[#1d4ed8] font-bold hover:underline cursor-pointer"
                        >
                          Kelola
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Sub-tab 2: Loker (SVG progress bars, zero inline styles) */}
          {activeTab === 'kategori' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  posko: 'Posko A - Perpus',
                  tagCls: 'text-[#1d4ed8]',
                  title: 'Loker Elektronik Khusus',
                  cap: 'Kapasitas: 18/24 Terisi (Sisa 6 Slot RFID)',
                  pct: 75,
                  color: '#1d4ed8',
                },
                {
                  posko: 'Posko B - GKU',
                  tagCls: 'text-[#1d4ed8]',
                  title: 'Loker Non-Elektronik',
                  cap: 'Kapasitas: 12/30 Terisi (Sisa 18 Slot)',
                  pct: 40,
                  color: '#091426',
                },
                {
                  posko: 'Posko C - Rektorat',
                  tagCls: 'text-[#ba1a1a]',
                  title: 'Brankas Dokumen Berharga',
                  cap: 'Kapasitas: 28/30 Terisi (Hampir Penuh)',
                  pct: 93,
                  color: '#ba1a1a',
                },
              ].map((locker) => (
                <div key={locker.posko} className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                  <span className={`text-[10px] font-bold uppercase ${locker.tagCls}`}>
                    {locker.posko}
                  </span>
                  <h4 className="font-bold text-[#091426] text-[14px]">{locker.title}</h4>
                  <p className="text-[12px] text-[#45474c]">{locker.cap}</p>
                  <svg className="w-full h-2 rounded-full overflow-hidden" viewBox="0 0 100 8" preserveAspectRatio="none">
                    <rect x="0" y="0" width="100" height="8" rx="4" fill="#eaedff" />
                    <rect x="0" y="0" width={locker.pct} height="8" rx="4" fill={locker.color} />
                  </svg>
                </div>
              ))}
            </div>
          )}

          {/* Sub-tab 3: Audit Log */}
          {activeTab === 'audit' && (
            <div className="space-y-2 text-[12px]">
              {foundItems.slice(0, 4).map((auditItem) => (
                <div
                  key={auditItem.id}
                  className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <span className="font-bold text-[#091426]">
                      Status #{auditItem.id}: {auditItem.title}
                    </span>
                    <p className="text-[11px] text-[#45474c]">
                      {auditItem.verificationStatusNote ||
                        `Lokasi penyimpanan: ${auditItem.storageLocation}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[10px] font-mono text-[#00a472] font-bold">
                      {auditItem.statusLabel.toUpperCase()}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate('coordinator')}
                      className="text-[11px] font-bold text-[#1d4ed8] hover:underline cursor-pointer"
                    >
                      Buka Posko
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Officer Management Modal */}
      {editingOfficer && (
        <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#eaedff] space-y-4">
            <div className="flex items-center justify-between border-b border-[#f2f3ff] pb-3">
              <div>
                <h3 className="text-[16px] font-bold text-[#091426]">Kelola Hak Akses Petugas</h3>
                <p className="text-[12px] text-[#45474c]">
                  {editingOfficer.name} ({editingOfficer.nip})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingOfficer(null)}
                className="text-[#45474c] hover:text-[#091426] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSaveOfficer} className="space-y-3">
              <div>
                <label className="block text-[12px] font-bold text-[#131b2e] mb-1">
                  Penugasan Lokasi Posko
                </label>
                <select
                  value={editingOfficer.posko}
                  onChange={(e) =>
                    setEditingOfficer({ ...editingOfficer, posko: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[13px]"
                >
                  <option value="Posko 1 - Rektorat & K3L Pusat">Posko 1 - Rektorat &amp; K3L Pusat</option>
                  <option value="Posko 2 - Perpustakaan Pusat">Posko 2 - Perpustakaan Pusat</option>
                  <option value="Posko 3 - GKU & Lab Terpadu">Posko 3 - GKU &amp; Lab Terpadu</option>
                  <option value="Pos Keamanan Gerbang Utama">Pos Keamanan Gerbang Utama</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#131b2e] mb-1">Peran</label>
                <select
                  value={editingOfficer.role}
                  onChange={(e) =>
                    setEditingOfficer({ ...editingOfficer, role: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[13px]"
                >
                  <option value="Koordinator Senior">Koordinator Senior</option>
                  <option value="Petugas Loket Fisik">Petugas Loket Fisik</option>
                  <option value="Auditor K3L">Auditor K3L</option>
                </select>
              </div>

              <div>
                <label className="block text-[12px] font-bold text-[#131b2e] mb-1">Status Shift</label>
                <select
                  value={editingOfficer.status}
                  onChange={(e) =>
                    setEditingOfficer({
                      ...editingOfficer,
                      status: e.target.value as OfficerRecord['status'],
                    })
                  }
                  className="w-full px-3 py-2.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[13px]"
                >
                  <option value="Aktif Jaga">Aktif Jaga</option>
                  <option value="Cuti">Cuti</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOfficer(null)}
                  className="px-4 py-2 rounded-xl text-[13px] font-bold text-[#45474c] hover:bg-[#f2f3ff] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#091426] text-white text-[13px] font-bold hover:bg-[#1d4ed8] cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#091426] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[22px]">task_alt</span>
          <span className="text-[13px] font-semibold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
