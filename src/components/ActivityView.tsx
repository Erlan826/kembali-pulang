import React, { useState } from 'react';
import { FoundItem, LostReport } from '../data/mockData';

interface ActivityViewProps {
  onNavigate: (view: string, itemId?: string) => void;
  foundItems: FoundItem[];
  lostReports: LostReport[];
  onCancelLostReport: (id: string) => void;
  onSubmitQuickClaim?: (itemId: string, secretAnswer: string) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  onNavigate,
  foundItems,
  lostReports,
  onCancelLostReport,
  onSubmitQuickClaim,
}) => {
  const [activeTab, setActiveTab] = useState<'laporan' | 'klaim' | 'riwayat'>('laporan');
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [secretAnswer, setSecretAnswer] = useState('');
  const [modalError, setModalError] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<{ title: string; desc: string } | null>(null);

  const targetItem =
    foundItems.find((i) => i.id === 'FND-1042') ||
    foundItems.find((i) => i.status === 'diverifikasi' || i.status === 'dalam_klaim') ||
    foundItems[0];

  const activeClaims = foundItems.filter(
    (i) => i.status === 'dalam_klaim' || i.status === 'siap_ambil'
  );
  const completedItems = foundItems.filter((i) => i.status === 'selesai');

  const triggerToast = (title: string, desc: string) => {
    setToastMsg({ title, desc });
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretAnswer.trim().length < 15) {
      setModalError('Minimal 15 karakter untuk deskripsi ciri khusus rahasia.');
      return;
    }
    setModalError(null);
    if (onSubmitQuickClaim && targetItem) {
      onSubmitQuickClaim(targetItem.id, secretAnswer.trim());
    }
    setIsClaimModalOpen(false);
    setSecretAnswer('');
    triggerToast(
      'Pengajuan Klaim Berhasil Dikirim!',
      `Tiket verifikasi #${targetItem.id} telah diteruskan ke Koordinator Posko.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Action / Context Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2e7ff] text-[#131b2e] text-[12px] font-bold">
            <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">shield_person</span>
            <span className="uppercase tracking-wider">Portal Hak Milik & Validasi Identitas</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#091426] tracking-tight">
            Pusat Aktivitas & Pelacakan Saya
          </h1>
          <p className="text-[14px] text-[#45474c] max-w-2xl leading-relaxed">
            Pantau status penemuan barang, kelola verifikasi kepemilikan dua arah, dan tinjau riwayat serah terima fisik resmi di posko kampus.
          </p>
        </div>

        {/* Quick KPI Counters & Actions */}
        <div className="flex items-center gap-3 self-start md:self-auto flex-wrap">
          <button
            onClick={() => onNavigate('report-lost')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#091426] text-white hover:bg-[#1e293b] rounded-xl text-[13px] font-bold transition-all shadow-md cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Buat Laporan Baru</span>
          </button>

          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#eaedff] shadow-sm text-center">
            <div className="text-[16px] font-bold text-[#091426]">
              {lostReports.filter((r) => r.status === 'menunggu').length}
            </div>
            <div className="text-[11px] text-[#45474c]">Menunggu Posko</div>
          </div>

          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#eaedff] shadow-sm text-center">
            <div className="text-[16px] font-bold text-[#1d4ed8]">{activeClaims.length}</div>
            <div className="text-[11px] text-[#45474c]">Klaim Berjalan</div>
          </div>

          <button
            onClick={() => setIsClaimModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#1d4ed8] text-white rounded-xl text-[13px] font-bold hover:bg-[#1d4ed8]/90 transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Buka Modal Klaim #{targetItem.id}</span>
          </button>
        </div>
      </div>

      {/* Segmented Navigation Tabs */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center p-1 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[13px] font-semibold">
          <button
            onClick={() => setActiveTab('laporan')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'laporan'
                ? 'bg-[#dae2fd] text-[#131b2e] font-bold shadow-sm'
                : 'text-[#45474c] hover:text-[#131b2e]'
            }`}
          >
            <span>Laporan Saya</span>
            <span className="px-1.5 py-0.5 bg-[#091426] text-white rounded-full font-mono text-[11px] leading-none">
              {lostReports.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('klaim')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'klaim'
                ? 'bg-[#dae2fd] text-[#131b2e] font-bold shadow-sm'
                : 'text-[#45474c] hover:text-[#131b2e]'
            }`}
          >
            <span>Klaim Saya</span>
            <span className="px-1.5 py-0.5 bg-[#eaedff] text-[#131b2e] rounded-full font-mono text-[11px] leading-none">
              {activeClaims.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('riwayat')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'riwayat'
                ? 'bg-[#dae2fd] text-[#131b2e] font-bold shadow-sm'
                : 'text-[#45474c] hover:text-[#131b2e]'
            }`}
          >
            <span>Riwayat Selesai</span>
            <span className="px-1.5 py-0.5 bg-[#eaedff] text-[#131b2e] rounded-full font-mono text-[11px] leading-none">
              {completedItems.length}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 text-[12px] text-[#45474c] font-semibold">
          <span className="material-symbols-outlined text-[16px] text-[#00a472]">sync</span>
          <span>Sinkronisasi Real-time SSO: Terakhir 2 menit lalu</span>
        </div>
      </div>

      {/* Active Spotlight Tracker: iPad Air 5 Starlight */}
      <section className="mb-8">
        <div className="bg-white rounded-2xl shadow-md border border-[#eaedff] overflow-hidden">
          {/* Top banner status line */}
          <div className="bg-[#091426] text-white px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1d4ed8] text-white">
                <span className="material-symbols-outlined text-[14px]">track_changes</span>
              </span>
              <div className="flex items-center gap-2 text-[12px]">
                <span className="uppercase tracking-wider font-bold">
                  Pelacakan Utama Prioritas Tinggi
                </span>
                <span className="text-[#8590a6]">•</span>
                <span className="font-mono text-[#dce1ff]">ID: #REP-2024-8891</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[#8590a6] text-[12px]">
              <span className="material-symbols-outlined text-[15px]">location_on</span>
              <span>Gedung Perpustakaan Pusat Lt. 2 - Ruang Baca Barat</span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Item Brief Header */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-[#f2f3ff] overflow-hidden flex-shrink-0 shadow-sm border border-[#eaedff]">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDE3zoCYWYrI0pg-EqhisOd6mT2I-irsEK7lMJKBds6bA1ci3OYE9hxilzSwREaY_xwmZF3RzmpldqOcUeMofmbQthZq9Ao3VEGHzi0H_KDHi93y-r8gsTh9ZMLSwB5Ksnur8EG-ALpQHOZUlarsMOddZFkz_XzYuVglX53gTUpbHyy-JkbttBaayGm50ycou8kXhQpryHK6F2RPWFgah9rculZZWk6kol5W13HYvM"
                    alt="iPad Air 5 Starlight"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold uppercase">
                      Elektronik Premium
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#45474c] text-[11px]">
                      Ditemukan 24 Okt 2024
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#091426]">
                    iPad Air 5 Starlight + Apple Pencil Gen 2
                  </h2>
                  <p className="text-[13px] text-[#45474c]">
                    Ciri umum terdaftar: Case magnetik warna navy, pelindung layar paperlike matte, terdapat stiker kecil inisial 'AZ' di sudut belakang.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto">
                <button
                  onClick={() => onNavigate('coordinator')}
                  className="flex-1 lg:flex-none px-4 py-2 bg-[#f2f3ff] text-[#131b2e] hover:bg-[#eaedff] rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 border border-[#eaedff] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  <span>Log Audit Posko</span>
                </button>
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="flex-1 lg:flex-none px-4 py-2 bg-[#091426] text-white hover:bg-[#1e293b] rounded-xl text-[13px] font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">visibility</span>
                  <span>Tinjau Detail Berkas</span>
                </button>
              </div>
            </div>

            {/* Stepper Visual Timeline Bar (5 Steps) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
              {/* Step 1: Completed */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#00a472] text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </span>
                  <span className="font-mono text-[12px] text-[#45474c]">01</span>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#091426]">Laporan Terkirim</h3>
                  <p className="text-[11px] text-[#45474c]">24 Okt 2024, 08:30 WIB</p>
                  <p className="text-[11px] text-[#45474c] mt-1">Dicatat lewat Form Temuan Mandiri.</p>
                </div>
              </div>

              {/* Step 2: Completed */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#00a472] text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">check</span>
                  </span>
                  <span className="font-mono text-[12px] text-[#45474c]">02</span>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#091426]">Diverifikasi Petugas</h3>
                  <p className="text-[11px] text-[#45474c]">24 Okt 2024, 09:15 WIB</p>
                  <p className="text-[11px] text-[#45474c] mt-1">Diamankan di Locker #B-14 Perpus.</p>
                </div>
              </div>

              {/* Step 3: Active */}
              <div className="p-4 rounded-xl bg-[#dce1ff] text-[#001551] border border-[#1d4ed8] flex flex-col justify-between space-y-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center animate-pulse">
                    <span className="material-symbols-outlined text-[18px]">hourglass_top</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#1d4ed8] text-white text-[10px] uppercase font-bold tracking-wider">
                    Aktif
                  </span>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#001551]">Validasi Klaim</h3>
                  <p className="text-[11px] text-[#001551] font-semibold">Sedang Berlangsung</p>
                  <p className="text-[11px] text-[#0039b5] mt-1">Pencocokan IMEI & Serial number rahasia.</p>
                </div>
              </div>

              {/* Step 4: Next */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between space-y-2 opacity-75">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#eaedff] text-[#45474c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                  </span>
                  <span className="font-mono text-[12px] text-[#45474c]">04</span>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#131b2e]">Siap Diambil di Posko</h3>
                  <p className="text-[11px] text-[#45474c]">Menunggu Otorisasi</p>
                  <p className="text-[11px] text-[#45474c] mt-1">Pengambilan dengan verifikasi KTM & OTP.</p>
                </div>
              </div>

              {/* Step 5: Final */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between space-y-2 opacity-50">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-full bg-[#eaedff] text-[#45474c] flex items-center justify-center">
                    <span className="material-symbols-outlined text-[18px]">verified_user</span>
                  </span>
                  <span className="font-mono text-[12px] text-[#45474c]">05</span>
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-[#131b2e]">Selesai / BAST</h3>
                  <p className="text-[11px] text-[#45474c]">Tahap Akhir</p>
                  <p className="text-[11px] text-[#45474c] mt-1">Penandatanganan Berita Acara Rekonsiliasi.</p>
                </div>
              </div>
            </div>

            {/* Alert Guidance Context Box */}
            <div className="p-4 rounded-xl bg-[#e2e7ff] border border-[#dae2fd] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-[24px] text-[#1d4ed8] mt-0.5">info</span>
                <div>
                  <h4 className="text-[14px] font-bold text-[#091426]">Pembaruan Verifikasi Masuk (Klaim Terdeteksi)</h4>
                  <p className="text-[12px] text-[#45474c] leading-relaxed">
                    Ada 1 pengajuan klaim kepemilikan masuk dari mahasiswa terdaftar. Koordinator Posko Perpustakaan sedang melakukan verifikasi silang ciri rahasia serta rekaman CCTV area kejadian.
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  triggerToast(
                    'Kontak Posko K3L Perpustakaan Pusat',
                    'Ekstensi internal 119 atau WhatsApp Sentral +62 811-2345-6789.'
                  )
                }
                className="px-4 py-2 bg-white text-[#131b2e] font-bold text-[12px] rounded-xl hover:bg-[#f2f3ff] shadow-xs border border-[#eaedff] transition-colors whitespace-nowrap cursor-pointer"
              >
                Hubungi Petugas Posko
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Item List & Verification Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Panel: Dynamic Table / Cards of User Activity (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          {activeTab === 'laporan' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-bold text-[#091426]">Daftar Laporan Kehilangan Saya</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#45474c] text-[11px] font-bold">
                    {lostReports.length} Entitas
                  </span>
                </div>
              </div>

              {lostReports.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-[#eaedff] text-center space-y-3">
                  <p className="text-[14px] font-bold text-[#091426]">Belum ada laporan kehilangan</p>
                  <p className="text-[12px] text-[#45474c]">
                    Anda dapat menambahkan laporan kehilangan barang agar sistem memantau barang temuan secara otomatis.
                  </p>
                  <button
                    onClick={() => onNavigate('report-lost')}
                    className="px-4 py-2 rounded-xl bg-[#1d4ed8] text-white text-[13px] font-bold cursor-pointer"
                  >
                    Buat Laporan Baru
                  </button>
                </div>
              ) : (
                lostReports.map((report) => {
                  const isDone = report.status === 'selesai';
                  const isMatched = report.status === 'cocok';
                  return (
                    <div
                      key={report.id}
                      className="p-5 rounded-2xl bg-white border border-[#eaedff] shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-[#f2f3ff] overflow-hidden flex-shrink-0 border border-[#eaedff] flex items-center justify-center text-[#1d4ed8]">
                            {report.imageUrl ? (
                              <img
                                className="w-full h-full object-cover"
                                src={report.imageUrl}
                                alt={report.title}
                              />
                            ) : (
                              <span className="material-symbols-outlined text-[24px]">inventory_2</span>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 text-[12px] text-[#45474c]">
                              <span className="font-mono">{report.id}</span>
                              <span>•</span>
                              <span>{report.locationLabel || report.location}</span>
                            </div>
                            <h4 className="text-[15px] font-bold text-[#091426]">{report.title}</h4>
                          </div>
                        </div>

                        {isDone ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00301e] text-[#6ffbbe] text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
                            <span>{report.statusLabel || 'Dikembalikan ke Pemilik'}</span>
                          </div>
                        ) : isMatched ? (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#1d4ed8]"></span>
                            <span>{report.statusLabel || 'Diverifikasi & Aktif di Temuan'}</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eaedff] text-[#45474c] text-[11px] font-bold">
                            <span className="w-2 h-2 rounded-full bg-[#75777d]"></span>
                            <span>{report.statusLabel || 'Menunggu Verifikasi Posko'}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-[13px] text-[#45474c] mb-3 leading-relaxed">
                        {report.publicDesc}
                      </p>

                      <div className="p-2.5 px-3.5 rounded-xl bg-[#f2f3ff] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[#45474c] text-[12px] border border-[#eaedff]">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-[16px] text-[#1d4ed8]">
                            {isDone ? 'receipt_long' : isMatched ? 'inventory_2' : 'schedule'}
                          </span>
                          <span>{report.storageOrNote || 'Pemindaian Smart Match aktif di posko kampus'}</span>
                        </div>
                        {isDone ? (
                          <div className="font-semibold text-[#091426]">{report.handlerNote}</div>
                        ) : isMatched ? (
                          <button
                            onClick={() => onNavigate('catalog')}
                            className="text-[#1d4ed8] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Periksa Daftar Publik</span>
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onCancelLostReport(report.id);
                              triggerToast('Laporan Dibatalkan', `Laporan ${report.id} telah dihapus dari daftar aktif.`);
                            }}
                            className="text-[#ba1a1a] font-bold hover:underline cursor-pointer"
                          >
                            Batalkan Laporan
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}

          {activeTab === 'klaim' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-bold text-[#091426]">Pengajuan Klaim Berjalan</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold">
                    {activeClaims.length} Aktif
                  </span>
                </div>
              </div>

              {activeClaims.length === 0 ? (
                <div className="p-8 rounded-2xl bg-white border border-[#eaedff] text-center space-y-2">
                  <p className="text-[14px] font-bold text-[#091426]">Tidak ada klaim aktif saat ini</p>
                  <p className="text-[12px] text-[#45474c]">Ajukan klaim melalui katalog barang temuan jika ada barang milik Anda.</p>
                </div>
              ) : (
                activeClaims.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl bg-white border border-[#eaedff] shadow-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-14 h-14 rounded-xl object-cover border border-[#eaedff]"
                        />
                        <div>
                          <div className="text-[12px] font-mono text-[#1d4ed8] font-bold">
                            #{item.id} {item.claimId ? `• ${item.claimId}` : ''}
                          </div>
                          <h4 className="text-[15px] font-bold text-[#091426]">{item.title}</h4>
                          <p className="text-[12px] text-[#45474c]">{item.storageLocation}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold self-start sm:self-center">
                        {item.statusLabel}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'riwayat' && (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-[18px] font-bold text-[#091426]">Riwayat Barang Dikembalikan</h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#45474c] text-[11px] font-bold">
                    {completedItems.length} Selesai
                  </span>
                </div>
              </div>

              {completedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-white border border-[#eaedff] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-xl object-cover border border-[#eaedff]"
                    />
                    <div>
                      <div className="text-[12px] font-mono text-[#45474c]">#{item.id}</div>
                      <h4 className="text-[15px] font-bold text-[#091426]">{item.title}</h4>
                      <p className="text-[12px] text-[#45474c]">{item.location}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00301e] text-[#6ffbbe] text-[11px] font-bold">
                    {item.statusLabel}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right Panel: Rules & Claim Queue Showcase (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Rules Guidelines */}
          <div className="p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-bold text-[#091426] uppercase tracking-wider">
                Prosedur Validasi Klaim
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">verified</span>
            </div>
            <p className="text-[12px] text-[#45474c] leading-relaxed">
              Untuk memastikan keabsahan kepemilikan, setiap klaim barang harus melalui 3 lapis validasi standar K3L Universitas:
            </p>
            <ul className="space-y-2 text-[12px] text-[#131b2e]">
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#1d4ed8] mt-0.5">
                  check_circle
                </span>
                <span>Pencocokan Ciri Khusus Rahasia yang tidak dipublikasikan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#1d4ed8] mt-0.5">
                  check_circle
                </span>
                <span>Bukti kepemilikan faktual (Nota, Foto pemakaian, atau No. Seri).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] text-[#1d4ed8] mt-0.5">
                  check_circle
                </span>
                <span>Tanda tangan digital via SSO saat penyerahan fisik di loket posko.</span>
              </li>
            </ul>
            <div className="pt-2 border-t border-[#dae2fd]">
              <button
                onClick={() => onNavigate('coordinator')}
                className="flex items-center justify-between w-full text-[#1d4ed8] text-[13px] font-bold hover:underline cursor-pointer"
              >
                <span>Lihat Antrean Petugas Posko</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Claim Ticket Interactive Card */}
          <div className="p-5 rounded-2xl bg-white border border-[#eaedff] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-[#091426]">Klaim Sedang Diproses</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[11px] font-bold">
                1 Pengajuan
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-[#f2f3ff] space-y-2 border border-[#eaedff]">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-mono text-[#1d4ed8] font-bold">#CLM-9032</span>
                <span className="text-[#45474c]">Target: #{targetItem.id}</span>
              </div>
              <h5 className="text-[14px] font-bold text-[#091426]">{targetItem.title}</h5>
              <p className="text-[12px] text-[#45474c]">
                Status: <span className="font-bold text-[#1d4ed8]">Menunggu Verifikasi Koordinator</span>
              </p>
              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => setIsClaimModalOpen(true)}
                  className="text-[#1d4ed8] text-[12px] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Buka Formulir Verifikasi</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          {/* Campus Location Map Quick Reference */}
          <div className="p-5 rounded-2xl bg-white border border-[#eaedff] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[15px] font-bold text-[#091426]">Posko Penyerahan Resmi</h4>
              <span className="text-[11px] font-bold text-[#00a472]">Buka s.d 16:30</span>
            </div>
            <img
              className="w-full h-36 object-cover rounded-xl shadow-inner border border-[#eaedff]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4LJCshThwwj7YmuKQfwhwRGNzD-j6j7LmfgX6Yw4ZGUN0Sp9cxHw3VCqq0lB4GLqJD_ftqlcxEc9ouKqZx-ougX1i2W7ZWq6eVylzfXWzCNQUs1JRnNoQSq71W55cVPAyt418Sor-XInlkyPqOcL1Pc0smIuTfxr0jVxMEDV8ft-N9qi0wG3uyfUzB7lr_2s6AwJTNw9LEcN4d9wrLVh7vt4y4hbXKF2oBzihRXU"
              alt="Peta Lokasi Posko Perpustakaan Pusat"
            />
            <div className="space-y-1 text-[12px]">
              <p className="font-bold text-[#091426]">Loket 1 - Perpustakaan Pusat Kampus</p>
              <p className="text-[#45474c] leading-relaxed">
                Lantai 1 Sayap Selatan, Gedung Kristal. Siapkan identitas KTP/KTM asli untuk pencocokan barcode.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog Pratinjau Pengajuan Klaim */}
      {isClaimModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-[#eaedff]">
            {/* Modal Header */}
            <div className="bg-[#091426] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1d4ed8] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-[#dce1ff]">
                    <span className="font-bold uppercase tracking-wider">
                      Formulir Rekonsiliasi Hak Milik
                    </span>
                    <span>•</span>
                    <span className="font-mono">#{targetItem.id}</span>
                  </div>
                  <h3 className="text-[16px] font-bold text-white leading-tight">
                    Ajukan Klaim: {targetItem.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsClaimModalOpen(false)}
                className="p-1 rounded-lg text-[#8590a6] hover:text-white transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[22px]">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleModalSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] flex items-center gap-3 border border-[#eaedff]">
                <img
                  src={targetItem.imageUrl}
                  alt={targetItem.title}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                />
                <div className="text-[12px] min-w-0">
                  <p className="text-[#45474c]">Ditemukan di: {targetItem.location}</p>
                  <p className="font-bold text-[#091426] text-[13px] truncate">{targetItem.title}</p>
                  <p className="text-[#45474c]">Disimpan di: {targetItem.storageLocation}</p>
                </div>
              </div>

              {/* Secret Clue input */}
              <div className="space-y-1.5">
                <label className="block text-[13px] font-bold text-[#091426]">
                  Sebutkan Ciri Rahasia Barang Anda <span className="text-[#ba1a1a]">*</span>
                </label>
                <p className="text-[12px] text-[#45474c]">
                  Tuliskan ciri khas yang belum disebutkan di deskripsi umum (contoh: stiker, lecet tertentu, nama koneksi Bluetooth, isi nomor kontak).
                </p>
                <textarea
                  className="w-full p-3.5 rounded-xl bg-[#f2f3ff] text-[13px] text-[#131b2e] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                  rows={4}
                  required
                  value={secretAnswer}
                  onChange={(e) => setSecretAnswer(e.target.value)}
                  placeholder="Tuliskan ciri khusus Anda secara mendalam di sini... Contoh: Nama koneksi Bluetooth saat disambungkan adalah 'Zaki_Sound_P2i', terdapat goresan halus di sisi engsel belakang dekat lubang USB Type-C."
                />
                {modalError && (
                  <div className="p-2.5 rounded-lg bg-[#ffdad6] text-[#ba1a1a] text-[12px] font-semibold">
                    {modalError}
                  </div>
                )}

                <div className="flex justify-between text-[11px] text-[#45474c]">
                  <span>Petugas akan mencocokkan catatan ini langsung dengan fisik barang.</span>
                  <span className="font-mono font-bold">
                    {secretAnswer.length >= 15 ? 'Memenuhi syarat' : `${secretAnswer.length}/15 karakter min`}
                  </span>
                </div>
              </div>

              {/* Evidence attachments */}
              <div className="p-4 rounded-xl bg-[#f2f3ff] border border-dashed border-[#1d4ed8] text-center space-y-2">
                <span className="material-symbols-outlined text-[28px] text-[#1d4ed8]">cloud_upload</span>
                <p className="text-[12px] font-bold text-[#091426]">
                  Bukti Tambahan (Opsional di Verifikasi Awal)
                </p>
                <p className="text-[11px] text-[#45474c]">Invoice / Nota / Foto bersama barang dapat dibawa saat verifikasi posko.</p>
              </div>

              <div className="p-3 bg-[#e2e7ff] rounded-xl flex items-start gap-2 border border-[#dae2fd] text-[12px] text-[#131b2e]">
                <input type="checkbox" required className="mt-0.5 rounded text-[#1d4ed8]" defaultChecked />
                <span>
                  Saya menyatakan dengan sesungguhnya di bawah sumpah integritas universitas bahwa barang ini adalah sah milik pribadi saya.
                </span>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#eaedff]">
                <button
                  type="button"
                  onClick={() => setIsClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-[#45474c] hover:bg-[#f2f3ff] text-[13px] font-bold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1d4ed8] text-white text-[13px] font-bold hover:bg-[#1d4ed8]/90 transition-all shadow-md cursor-pointer"
                >
                  Kirim Verifikasi Klaim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#091426] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm">
          <span className="material-symbols-outlined text-[#4edea3] text-[24px]">check_circle</span>
          <div>
            <div className="text-[13px] font-bold">{toastMsg.title}</div>
            <div className="text-[11px] text-[#8590a6]">{toastMsg.desc}</div>
          </div>
        </div>
      )}
    </div>
  );
};
