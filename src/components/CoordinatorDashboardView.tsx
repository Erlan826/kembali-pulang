import React, { useMemo, useState } from 'react';
import { FoundItem, LostReport } from '../data/mockData';

interface CoordinatorDashboardViewProps {
  foundItems: FoundItem[];
  lostReports: LostReport[];
  onNavigate: (view: string, itemId?: string) => void;
  onApproveClaim: (item: FoundItem) => void;
  onVerifyIntake: (itemId: string) => void;
  onUpdateLostReportStatus: (
    reportId: string,
    status: LostReport['status'],
    matchedItemId?: string
  ) => void;
}

export const CoordinatorDashboardView: React.FC<CoordinatorDashboardViewProps> = ({
  foundItems,
  lostReports,
  onNavigate,
  onVerifyIntake,
  onUpdateLostReportStatus,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'claim' | 'found' | 'lost'>('all');
  const [broadcastSent, setBroadcastSent] = useState<Record<string, boolean>>({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const activeLostReports = useMemo(
    () => lostReports.filter((r) => r.status !== 'selesai'),
    [lostReports]
  );

  const findSmartMatchForReport = (report: LostReport): FoundItem | undefined => {
    const tokens = report.title
      .toLowerCase()
      .split(/\s+/)
      .filter((t) => t.length >= 4);
    return foundItems.find((item) => {
      if (item.status === 'selesai') return false;
      const hay = `${item.title} ${item.publicDesc} ${item.location}`.toLowerCase();
      return tokens.some((t) => hay.includes(t));
    });
  };

  const foundQueueCount = foundItems.filter(
    (i) => i.status === 'dilaporkan' || i.status === 'diverifikasi'
  ).length;
  const claimQueueCount = foundItems.filter((i) => i.status === 'dalam_klaim').length;
  const readyPickupCount = foundItems.filter((i) => i.status === 'siap_ambil').length;
  const completedCount = foundItems.filter((i) => i.status === 'selesai').length;

  const filteredQueue = useMemo(() => {
    const activeItems = foundItems.filter((i) => i.status !== 'selesai');
    if (filterType === 'claim') {
      return activeItems.filter((i) => i.status === 'dalam_klaim' || i.status === 'siap_ambil');
    }
    if (filterType === 'found') {
      return activeItems.filter((i) => i.status === 'dilaporkan' || i.status === 'diverifikasi');
    }
    // Sort claims and ready pickups first in 'all' view
    const priority: Record<FoundItem['status'], number> = {
      dalam_klaim: 0,
      siap_ambil: 1,
      dilaporkan: 2,
      diverifikasi: 3,
      selesai: 4,
    };
    return [...activeItems].sort((a, b) => priority[a.status] - priority[b.status]);
  }, [foundItems, filterType]);

  const readyAppointments = foundItems.filter((i) => i.status === 'siap_ambil');

  const handleBroadcast = (id: string, label: string) => {
    setBroadcastSent((prev) => ({ ...prev, [id]: true }));
    showToast(`Broadcast Ditmawa & portal kampus untuk "${label}" berhasil disiarkan!`);
  };

  return (
    <div className="w-full">
      {/* Sub-Header Status Rail */}
      <div className="w-full bg-[#f2f3ff] px-6 py-4 border-b border-[#eaedff]">
        <div className="flex flex-wrap items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#091426] text-white shadow-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">security</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[17px] font-bold text-[#091426]">
                  Pusat Operasional Posko K3L &amp; Satpam Kampus
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1d4ed8] text-white text-[10px] font-bold uppercase tracking-wider">
                  LIVE DESK
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#45474c] text-[12px] mt-0.5 flex-wrap">
                <span className="flex items-center gap-1 font-semibold text-[#131b2e]">
                  <span className="material-symbols-outlined text-[15px] text-[#1d4ed8]">location_on</span>
                  Loket 1 - Gedung Perpustakaan Pusat
                </span>
                <span>•</span>
                <span>Zona Sentral Kampus Barat</span>
                <span>•</span>
                <span className="text-[#1d4ed8] font-mono font-semibold">
                  Shift Siang (08:00 - 16:30 WIB)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-xs border border-[#eaedff]">
            <div className="flex flex-col text-right">
              <div className="flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-[#00a472] animate-pulse"></span>
                <span className="text-[10px] font-bold text-[#45474c] uppercase tracking-wider">
                  Petugas Jaga Aktif
                </span>
              </div>
              <span className="text-[13px] font-bold text-[#091426]">Bripka Sunarto</span>
              <span className="font-mono text-[11px] text-[#45474c]">ID: POSKO-K3L-042</span>
            </div>
            <div className="w-9 h-9 rounded-lg bg-[#f2f3ff] flex items-center justify-center text-[#091426]">
              <span className="material-symbols-outlined text-[22px]">badge</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Top KPI Metric Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Temuan Aktif Posko
                </span>
                <span className="text-3xl font-extrabold text-[#091426] mt-1">
                  {foundQueueCount} <span className="text-sm font-normal text-[#45474c]">Barang</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold uppercase">
                Terdaftar Posko
              </span>
              <span className="text-[#45474c]">Siap kurasi &amp; klaim</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Validasi Ciri Rahasia
                </span>
                <span className="text-3xl font-extrabold text-[#091426] mt-1">
                  {claimQueueCount} <span className="text-sm font-normal text-[#45474c]">Klaim</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#dce1ff] text-[#001551]">
                <span className="material-symbols-outlined text-[24px]">fact_check</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#1d4ed8] font-bold uppercase">
                Antrean Audit
              </span>
              <span className="text-[#45474c]">Side-by-Side</span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Siap Ambil di Loket
                </span>
                <span className="text-3xl font-extrabold text-[#091426] mt-1">
                  {readyPickupCount} <span className="text-sm font-normal text-[#45474c]">Barang</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#f2f3ff] text-[#1d4ed8]">
                <span className="material-symbols-outlined text-[24px]">hail</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#45474c] font-bold">
                Siap Serah Terima
              </span>
              <span className="text-[#45474c]">Tiket BAST Terbit</span>
            </div>
          </div>

          <div className="bg-[#091426] text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#8590a6] uppercase tracking-wider">
                  Kasus Selesai Tuntas
                </span>
                <span className="text-3xl font-extrabold text-white mt-1">
                  {125 + completedCount} <span className="text-sm font-normal text-[#8590a6]">Kasus</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#1e293b] text-[#6ffbbe]">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[12px] font-bold text-[#4edea3]">
              <span>+{completedCount} Selesai Sesi Ini</span>
              <span className="text-[11px] text-[#8590a6]">Semester Ganjil</span>
            </div>
          </div>
        </section>

        {/* Asymmetric Workzone Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          {/* Primary Column (8 Cols): Antrean Verifikasi Cepat */}
          <section className="xl:col-span-8 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-[#f2f3ff]">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[17px] font-bold text-[#091426]">
                      Antrean Verifikasi Cepat (Quick Triage)
                    </h2>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#091426] font-mono text-[11px] font-bold">
                      {filteredQueue.length} Antrean
                    </span>
                  </div>
                  <p className="text-[12px] text-[#45474c] mt-0.5">
                    Data tersinkronisasi real-time dengan laporan penemuan &amp; pengajuan klaim mahasiswa.
                  </p>
                </div>

                <div className="flex flex-wrap items-center bg-[#f2f3ff] p-1 rounded-xl text-[12px] font-bold text-[#45474c] gap-1">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'all' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Semua ({foundQueueCount + claimQueueCount + readyPickupCount})
                  </button>
                  <button
                    onClick={() => setFilterType('claim')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'claim' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Klaim ({claimQueueCount + readyPickupCount})
                  </button>
                  <button
                    onClick={() => setFilterType('found')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'found' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Temuan ({foundQueueCount})
                  </button>
                  <button
                    onClick={() => setFilterType('lost')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'lost' ? 'bg-white text-[#ba1a1a] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Kehilangan ({activeLostReports.length})
                  </button>
                </div>
              </div>

              {filterType === 'lost' ? (
                <div className="mt-4 space-y-3">
                  {lostReports.length === 0 ? (
                    <div className="py-8 text-center text-[#45474c] text-[13px]">
                      Belum ada laporan kehilangan mahasiswa yang masuk.
                    </div>
                  ) : (
                    lostReports.map((report) => {
                      const smartMatch = findSmartMatchForReport(report);
                      return (
                        <div
                          key={report.id}
                          className="p-4 rounded-xl bg-[#f2f3ff]/80 border border-[#eaedff] flex flex-col gap-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[11px] font-bold text-[#1d4ed8]">
                                  {report.id}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                    report.status === 'selesai'
                                      ? 'bg-[#6ffbbe] text-[#002113]'
                                      : report.status === 'cocok'
                                      ? 'bg-[#dce1ff] text-[#001551]'
                                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                                  }`}
                                >
                                  {report.status === 'selesai'
                                    ? 'Ditemukan'
                                    : report.status === 'cocok'
                                    ? 'Cocok Temuan'
                                    : 'Dicari Posko'}
                                </span>
                                {smartMatch && report.status === 'menunggu' && (
                                  <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                                    Smart Match: #{smartMatch.id}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-[#091426] text-[14px] mt-1">
                                {report.title}
                              </h4>
                              <p className="text-[12px] text-[#45474c]">
                                Lokasi terakhir: {report.locationLabel || report.location} • {report.datetime.replace('T', ' ')}
                              </p>
                            </div>

                            <div className="text-right text-[11px] text-[#45474c] font-mono">
                              <div>WA: {report.contactWa}</div>
                              <div>{report.contactEmail}</div>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-white border border-[#eaedff] text-[12px] text-[#131b2e]">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d4ed8] block mb-0.5">
                              Ciri Rahasia Pelapor (Khusus Posko):
                            </span>
                            {report.secretClue}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <span className="text-[11px] text-[#45474c]">
                              {report.storageOrNote || 'Menunggu pencocokan barang masuk'}
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                              <button
                                onClick={() =>
                                  showToast(
                                    `Notifikasi status laporan ${report.id} dikirim via Bot WhatsApp ke ${report.contactWa}.`
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg bg-white border border-[#dae2fd] text-[#091426] hover:bg-[#eaedff] text-[11px] font-bold cursor-pointer"
                              >
                                Hubungi WA
                              </button>
                              {report.status === 'menunggu' && (
                                <button
                                  onClick={() => {
                                    onUpdateLostReportStatus(report.id, 'cocok', smartMatch?.id);
                                    showToast(
                                      smartMatch
                                        ? `Laporan ${report.id} dicocokkan dengan Temuan #${smartMatch.id}.`
                                        : `Laporan ${report.id} ditandai cocok dengan temuan posko.`
                                    );
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1d4ed8]/90 text-[11px] font-bold cursor-pointer"
                                >
                                  {smartMatch ? `Cocokkan (#${smartMatch.id})` : 'Tandai Cocok'}
                                </button>
                              )}
                              {report.status !== 'selesai' && (
                                <button
                                  onClick={() => {
                                    onUpdateLostReportStatus(report.id, 'selesai');
                                    showToast(`Laporan kehilangan ${report.id} ditandai selesai/ditemukan.`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-[#091426] text-white hover:bg-[#1e293b] text-[11px] font-bold cursor-pointer"
                                >
                                  Tandai Ditemukan
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="bg-[#f2f3ff] text-[#45474c] text-[11px] uppercase tracking-wider font-bold">
                      <th className="py-3 px-3 rounded-l-lg">ID &amp; Foto</th>
                      <th className="py-3 px-3">Nama &amp; Kategori</th>
                      <th className="py-3 px-3">Pihak Terlibat</th>
                      <th className="py-3 px-3">Lokasi Fisik</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right rounded-r-lg">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f3ff]">
                    {filteredQueue.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-[#45474c] text-[13px]">
                          Tidak ada antrean pada filter ini.
                        </td>
                      </tr>
                    ) : (
                      filteredQueue.map((item) => {
                        const isClaim = item.status === 'dalam_klaim';
                        const isReady = item.status === 'siap_ambil';
                        const isReported = item.status === 'dilaporkan';
                        return (
                          <tr key={item.id} className="hover:bg-[#f2f3ff]/60 transition-colors">
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-11 h-11 rounded-lg object-cover bg-[#eaedff] shrink-0"
                                />
                                <div className="flex flex-col">
                                  <span className="font-mono font-bold text-[#091426] text-[12px]">
                                    #{item.id}
                                  </span>
                                  {item.claimId && (
                                    <span className="text-[11px] text-[#1d4ed8] font-mono">
                                      {item.claimId}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col max-w-[180px]">
                                <span className="font-bold text-[#091426] truncate">{item.title}</span>
                                <span className="text-[11px] text-[#45474c] truncate">{item.categoryLabel}</span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              {item.claimantName ? (
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#091426]">{item.claimantName}</span>
                                  <span className="font-mono text-[11px] text-[#45474c]">
                                    NIM: {item.claimantNim || '-'}
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#091426]">{item.finderName}</span>
                                  <span className="text-[11px] text-[#45474c]">{item.finderRole}</span>
                                </div>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2.5 py-1 rounded-lg bg-[#eaedff] text-[#091426] font-mono text-[11px] font-semibold inline-block max-w-[160px] truncate">
                                {item.storageLocation}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              {isReady ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#6ffbbe] text-[#002113] text-[10px] font-bold uppercase whitespace-nowrap">
                                  Siap BAST
                                </span>
                              ) : isClaim ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[10px] font-bold uppercase whitespace-nowrap">
                                  Audit Klaim
                                </span>
                              ) : isReported ? (
                                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase whitespace-nowrap">
                                  Inspeksi Awal
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#1d4ed8] text-[10px] font-bold uppercase whitespace-nowrap">
                                  Aktif Katalog
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {isReported ? (
                                  <button
                                    onClick={() => {
                                      onVerifyIntake(item.id);
                                      showToast(`Barang #${item.id} (${item.title}) telah diverifikasi & aktif di katalog.`);
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-[#091426] text-white hover:bg-[#1e293b] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
                                    <span>Verifikasi</span>
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => onNavigate('side-by-side', item.id)}
                                      className="px-3 py-1.5 rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1d4ed8]/90 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">compare</span>
                                      <span>Side-by-Side</span>
                                    </button>
                                    <button
                                      onClick={() => onNavigate('bast', item.id)}
                                      className="px-2.5 py-1.5 rounded-lg bg-[#091426] text-white hover:bg-[#1e293b] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                                      title="Buka Berita Acara (BAST)"
                                    >
                                      <span className="material-symbols-outlined text-[15px]">description</span>
                                      {isReady && <span>BAST</span>}
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              )}
            </div>

            {/* Section 1B: Laporan Kehilangan Mahasiswa Masuk */}
            {filterType !== 'lost' && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff]">
                <div className="flex flex-wrap items-center justify-between pb-3 border-b border-[#f2f3ff] mb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[22px]">
                      person_search
                    </span>
                    <div>
                      <h3 className="text-[16px] font-bold text-[#091426]">
                        Laporan Kehilangan Mahasiswa (Masuk Posko)
                      </h3>
                      <p className="text-[11px] text-[#45474c]">
                        Tiket laporan kehilangan dari mahasiswa untuk pencocokan silang dengan barang masuk.
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold">
                    {activeLostReports.length} Aktif Dicari
                  </span>
                </div>

                {lostReports.length === 0 ? (
                  <p className="text-[13px] text-[#45474c] py-4 text-center">
                    Belum ada laporan kehilangan mahasiswa.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {lostReports.slice(0, 4).map((report) => {
                      const smartMatch = findSmartMatchForReport(report);
                      return (
                        <div
                          key={report.id}
                          className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col gap-2.5"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[11px] font-bold text-[#1d4ed8]">
                                  {report.id}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                    report.status === 'selesai'
                                      ? 'bg-[#6ffbbe] text-[#002113]'
                                      : report.status === 'cocok'
                                      ? 'bg-[#dce1ff] text-[#001551]'
                                      : 'bg-[#ffdad6] text-[#ba1a1a]'
                                  }`}
                                >
                                  {report.status === 'selesai'
                                    ? 'Ditemukan'
                                    : report.status === 'cocok'
                                    ? 'Cocok Temuan'
                                    : 'Menunggu Posko'}
                                </span>
                                {smartMatch && report.status === 'menunggu' && (
                                  <span className="px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-bold">
                                    Smart Match: #{smartMatch.id}
                                  </span>
                                )}
                              </div>
                              <h4 className="font-bold text-[#091426] text-[14px] mt-1">
                                {report.title}
                              </h4>
                              <p className="text-[12px] text-[#45474c]">
                                {report.locationLabel || report.location} • {report.contactWa}
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5 flex-wrap">
                              {report.status === 'menunggu' && (
                                <button
                                  onClick={() => {
                                    onUpdateLostReportStatus(report.id, 'cocok', smartMatch?.id);
                                    showToast(
                                      smartMatch
                                        ? `Laporan ${report.id} dicocokkan dengan Temuan #${smartMatch.id}.`
                                        : `Laporan ${report.id} ditandai cocok dengan temuan posko.`
                                    );
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#1d4ed8] text-white text-[11px] font-bold cursor-pointer hover:bg-[#1d4ed8]/90"
                                >
                                  {smartMatch ? `Cocokkan (#${smartMatch.id})` : 'Tandai Cocok'}
                                </button>
                              )}
                              {report.status !== 'selesai' && (
                                <button
                                  onClick={() => {
                                    onUpdateLostReportStatus(report.id, 'selesai');
                                    showToast(`Laporan ${report.id} ditandai selesai/ditemukan.`);
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-[#091426] text-white text-[11px] font-bold cursor-pointer hover:bg-[#1e293b]"
                                >
                                  Tandai Ditemukan
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-[11px] text-[#131b2e] bg-white/80 px-3 py-2 rounded-lg border border-[#eaedff]">
                            <span className="font-bold text-[#1d4ed8]">Ciri Rahasia: </span>
                            {report.secretClue}
                          </div>
                        </div>
                      );
                    })}
                    {lostReports.length > 4 && (
                      <button
                        onClick={() => setFilterType('lost')}
                        className="w-full py-2 rounded-xl bg-[#eaedff] hover:bg-[#dae2fd] text-[#091426] text-[12px] font-bold cursor-pointer"
                      >
                        Lihat Semua {lostReports.length} Laporan Kehilangan di Tab Antrean
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Section 2: Jadwal Janji Temu Hari Ini */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff]">
              <div className="flex items-center justify-between pb-3 border-b border-[#f2f3ff] mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1d4ed8] text-[24px]">calendar_clock</span>
                  <h3 className="text-[16px] font-bold text-[#091426]">
                    Janji Temu Pengambilan Barang Hari Ini
                  </h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-[#f2f3ff] text-[#1d4ed8] text-[11px] font-bold">
                  {readyAppointments.length + 1} Janji Temu Aktif
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {readyAppointments.map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-mono text-[12px] font-bold text-[#1d4ed8]">Siap Diambil</span>
                        <h4 className="font-bold text-[#091426] text-[14px] truncate">{app.title}</h4>
                        <p className="text-[12px] text-[#45474c]">
                          Pengambil: {app.claimantName || 'Mahasiswa'} ({app.claimantNim || 'SSO'})
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-extrabold uppercase shrink-0">
                        Siap Loket
                      </span>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#dae2fd] flex items-center justify-between">
                      <span className="font-mono text-[11px] font-bold">
                        TIKET: {app.pickupCode || app.claimId || app.id}
                      </span>
                      <button
                        onClick={() => onNavigate('bast', app.id)}
                        className="px-3 py-1 rounded-lg bg-[#1d4ed8] text-white text-[11px] font-bold cursor-pointer hover:bg-[#1d4ed8]/90"
                      >
                        Proses Serah Terima
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[12px] font-bold text-[#1d4ed8]">11:30 WIB</span>
                      <h4 className="font-bold text-[#091426] text-[14px]">Kalkulator Casio fx-991EX</h4>
                      <p className="text-[12px] text-[#45474c]">Pengambil: Nadia Zahra (12822014)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#eaedff] text-[#45474c] text-[10px] font-bold uppercase">
                      Dalam Perjalanan
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#dae2fd] flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold">TIKET: INV-2024-0876</span>
                    <button
                      onClick={() => onNavigate('bast', 'INV-2024-0876')}
                      className="px-3 py-1 rounded-lg bg-[#091426] text-white text-[11px] font-bold cursor-pointer hover:bg-[#1e293b]"
                    >
                      Buka BAST
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Secondary Column (4 Cols): Aksi Cepat & Hot Alert */}
          <aside className="xl:col-span-4 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
                <span className="text-[15px] font-bold text-[#091426]">Aksi Cepat Posko</span>
                <span className="material-symbols-outlined text-[#1d4ed8]">flash_on</span>
              </div>

              <button
                onClick={() => onNavigate('bast')}
                className="w-full text-left p-3.5 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] transition-all flex items-center gap-3 cursor-pointer border border-[#eaedff]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#091426]">Scan QR Tiket Pengambilan</span>
                  <span className="text-[11px] text-[#45474c]">Validasi instan kode tiket dari aplikasi</span>
                </div>
              </button>

              <button
                onClick={() => onNavigate('report-found')}
                className="w-full text-left p-3.5 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] transition-all flex items-center gap-3 cursor-pointer border border-[#eaedff]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#091426] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">add_photo_alternate</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#091426]">Input Temuan Lapangan</span>
                  <span className="text-[11px] text-[#45474c]">Pencatatan langsung serah terima satpam</span>
                </div>
              </button>

              <button
                onClick={() => onNavigate('bast')}
                className="w-full text-left p-3.5 rounded-xl bg-[#f2f3ff] hover:bg-[#e2e7ff] transition-all flex items-center gap-3 cursor-pointer border border-[#eaedff]"
              >
                <div className="w-10 h-10 rounded-xl bg-[#dae2fd] text-[#091426] flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">print</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-bold text-[#091426]">Cetak Berita Acara (BAP)</span>
                  <span className="text-[11px] text-[#45474c]">Rekonsiliasi berkala dan tanda tangan digital</span>
                </div>
              </button>
            </div>

            {/* Hot Alert Posko */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#f2f3ff]">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-lg bg-[#ffdad6] text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-[18px]">warning</span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-bold text-[#091426]">Hot Alert Posko K3L</h3>
                    <p className="text-[11px] text-[#45474c]">SOP Batas Simpan Maksimal 30 Hari</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase">
                  2 Item Kritis
                </span>
              </div>

              <p className="text-[12px] text-[#45474c]">
                Barang berharga bernilai tinggi belum terverifikasi pemiliknya &gt; 14 hari. Perlu eskalasi publikasi ke Ditmawa.
              </p>

              <div className="space-y-2">
                {[
                  { id: 'alert-seiko', icon: 'watch', name: 'Seiko Presage Automatic', info: 'Tersimpan: 21 Hari (Rak S-01)' },
                  { id: 'alert-iphone', icon: 'phone_iphone', name: 'iPhone 14 Pro Deep Purple', info: 'Tersimpan: 18 Hari (Loker #01)' },
                ].map((alertItem) => (
                  <div
                    key={alertItem.id}
                    className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between gap-2 border border-[#eaedff]"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[#1d4ed8]">{alertItem.icon}</span>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[12px] font-bold text-[#091426] truncate">
                          {alertItem.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#ba1a1a]">{alertItem.info}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBroadcast(alertItem.id, alertItem.name)}
                      disabled={broadcastSent[alertItem.id]}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer shrink-0 ${
                        broadcastSent[alertItem.id]
                          ? 'bg-[#6ffbbe] text-[#002113]'
                          : 'bg-[#eaedff] hover:bg-[#dae2fd] text-[#091426]'
                      }`}
                    >
                      {broadcastSent[alertItem.id] ? 'Terkirim' : 'Broadcast'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-[#091426] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[22px]">campaign</span>
          <span className="text-[13px] font-semibold">{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
