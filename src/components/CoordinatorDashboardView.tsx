import React, { useState } from 'react';
import { FoundItem } from '../data/mockData';

interface CoordinatorDashboardViewProps {
  foundItems: FoundItem[];
  onNavigate: (view: string, itemId?: string) => void;
  onApproveClaim: (item: FoundItem) => void;
}

export const CoordinatorDashboardView: React.FC<CoordinatorDashboardViewProps> = ({
  foundItems,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'claim' | 'found'>('all');

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
                  Pusat Operasional Posko K3L & Satpam Kampus
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#1d4ed8] text-white text-[10px] font-bold uppercase tracking-wider">
                  LIVE DESK
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#45474c] text-[12px] mt-0.5">
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
          {/* Card 1 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Temuan Masuk Baru
                </span>
                <span className="text-3xl font-extrabold text-[#091426] mt-1">
                  5 <span className="text-sm font-normal text-[#45474c]">Barang</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#ffdad6] text-[#ba1a1a]">
                <span className="material-symbols-outlined text-[24px]">inventory_2</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] font-bold uppercase">
                Perhatian Segera
              </span>
              <span className="text-[#45474c]">Perlu kurasi & seal</span>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Validasi Ciri Rahasia
                </span>
                <span className="text-3xl font-extrabold text-[#091426] mt-1">
                  8 <span className="text-sm font-normal text-[#45474c]">Klaim</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#dce1ff] text-[#001551]">
                <span className="material-symbols-outlined text-[24px]">fact_check</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-[#eaedff] text-[#1d4ed8] font-bold uppercase">
                3 Prioritas Tinggi
              </span>
              <span className="text-[#45474c]">Side-by-Side</span>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-[#eaedff] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                  Siap Ambil di Loket
                </span>
                <span className="text-3xl font-extrabold text-[#091426] mt-1">
                  14 <span className="text-sm font-normal text-[#45474c]">Barang</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#f2f3ff] text-[#1d4ed8]">
                <span className="material-symbols-outlined text-[24px]">hail</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-[#f2f3ff] flex items-center justify-between text-[11px]">
              <span className="px-2 py-0.5 rounded-full bg-[#f2f3ff] text-[#45474c] font-bold">
                Siap Verifikasi Fisik
              </span>
              <span className="text-[#45474c]">Loker Terverifikasi</span>
            </div>
          </div>

          {/* Card 4 */}
          <div className="bg-[#091426] text-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#8590a6] uppercase tracking-wider">
                  Kasus Sukses Bulan Ini
                </span>
                <span className="text-3xl font-extrabold text-white mt-1">
                  126 <span className="text-sm font-normal text-[#8590a6]">Kasus</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-[#1e293b] text-[#6ffbbe]">
                <span className="material-symbols-outlined text-[24px]">task_alt</span>
              </div>
            </div>
            <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[12px] font-bold text-[#4edea3]">
              <span>Tingkat Sukses 91.4%</span>
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
                      13 Antrean
                    </span>
                  </div>
                  <p className="text-[12px] text-[#45474c] mt-0.5">
                    Prioritaskan pengujian kesesuaian ciri tersembunyi barang bernilai tinggi.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center bg-[#f2f3ff] p-1 rounded-xl text-[12px] font-bold text-[#45474c]">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'all' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Semua Antrean (13)
                  </button>
                  <button
                    onClick={() => setFilterType('claim')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'claim' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Klaim Baru (8)
                  </button>
                  <button
                    onClick={() => setFilterType('found')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      filterType === 'found' ? 'bg-white text-[#091426] shadow-xs' : 'hover:text-[#091426]'
                    }`}
                  >
                    Temuan Masuk (5)
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="bg-[#f2f3ff] text-[#45474c] text-[11px] uppercase tracking-wider font-bold">
                      <th className="py-3 px-3 rounded-l-lg">ID & Barang</th>
                      <th className="py-3 px-3">Nama & Kategori</th>
                      <th className="py-3 px-3">Pihak Terlibat</th>
                      <th className="py-3 px-3">Lokasi Fisik</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3 text-right rounded-r-lg">Aksi Cepat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f2f3ff]">
                    {/* Row 1 */}
                    {(filterType === 'all' || filterType === 'claim') && (
                      <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjQ2KkQcpnO7Moc8vXIKVDfhVnfx-HJyPtMa_ffK_yRgvrxGS8ePznyqZfDOSLKdz4TYpfqYiVquAYrZFXF8rzUAHV6Y0Vrg3o5JKEmo7vmWa4VCS6lkAavd6S_rqV3Kkddo_pXmpurTZTzHfkbgTS8dDMfuEi9qkt0Y2YNLYKGzlGUYob-VpLyOP8EGdJ-ijXRY-NOUt52Ci0RlQezIohD1Jbm6gGmuh9pQgzdcU"
                              alt="MacBook"
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-[#091426]">#BRG-8841</span>
                              <span className="text-[11px] text-[#45474c]">INV-2024-0891</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#091426]">MacBook Air M2 13.6"</span>
                            <span className="text-[11px] text-[#45474c]">Elektronik Premium</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#091426]">Ahmad Zaki</span>
                            <span className="font-mono text-[11px] text-[#45474c]">NIM: 13521098</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-lg bg-[#dae2fd] text-[#091426] font-mono text-[11px] font-bold">
                            Locker Safe #04
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[10px] font-bold uppercase">
                            Ciri Rahasia
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onNavigate('side-by-side', 'INV-2024-0891')}
                              className="px-3 py-1.5 rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1d4ed8]/90 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                            >
                              <span className="material-symbols-outlined text-[15px]">compare</span>
                              <span>Side-by-Side</span>
                            </button>
                            <button
                              onClick={() => onNavigate('bast')}
                              className="px-2.5 py-1.5 rounded-lg bg-[#091426] text-white text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                              title="Buka Berita Acara (BAST)"
                            >
                              <span className="material-symbols-outlined text-[15px]">description</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* Row 2 */}
                    {(filterType === 'all' || filterType === 'claim') && (
                      <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxn_MmZvADKG7_ISYL_pN7CJDuh9Z4JyCekg6wtFaz6pwtpVyspDgw0mSX7oBWP1HaIX_HI3sq8G7BWNOWF99_SuXSU6OmP-VhofErhmhO0SLAI4bLK7g4CKydfiwSD0DXUw6A91xe2FPD6YLpPYEgDwujK4jwFpkxbjdqzlX6Y4M0nqpJa9VDR0lJOFMnOPwnnc2TMCYWDwkN48qQcDyonDOPRm2irG8Sj8LLxy8"
                              alt="Dompet"
                              className="w-11 h-11 rounded-lg object-cover"
                            />
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-[#091426]">#BRG-8839</span>
                              <span className="text-[11px] text-[#45474c]">Ada Kartu Identitas</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#091426]">Dompet Kulit Cokelat</span>
                            <span className="text-[11px] text-[#45474c]">Dompet & Kartu</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#091426]">Rian Pratama</span>
                            <span className="font-mono text-[11px] text-[#45474c]">NIM: 18220012</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-lg bg-[#eaedff] text-[#45474c] font-mono text-[11px]">
                            Rak A-02
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#dce1ff] text-[#001551] text-[10px] font-bold uppercase">
                            Ciri Rahasia
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => onNavigate('side-by-side', 'INV-2024-0892')}
                            className="px-3 py-1.5 rounded-lg bg-[#1d4ed8] text-white hover:bg-[#1d4ed8]/90 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer shadow-xs"
                          >
                            <span className="material-symbols-outlined text-[15px]">compare</span>
                            <span>Side-by-Side</span>
                          </button>
                        </td>
                      </tr>
                    )}

                    {/* Row 3 */}
                    {(filterType === 'all' || filterType === 'found') && (
                      <tr className="hover:bg-[#f2f3ff]/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-11 h-11 rounded-lg bg-[#eaedff] flex items-center justify-center text-[#1d4ed8]">
                              <span className="material-symbols-outlined text-[22px]">watch</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-mono font-bold text-[#091426]">#BRG-8845</span>
                              <span className="text-[11px] text-[#ba1a1a]">Butuh Tagging</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#091426]">Jam Tangan Chrono</span>
                            <span className="text-[11px] text-[#45474c]">Aksesoris Pribadi</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-bold text-[#091426]">Pak Sugio (Satpam)</span>
                            <span className="text-[11px] text-[#45474c]">Pelapor Penemu</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2.5 py-1 rounded-lg bg-[#ffdad6] text-[#ba1a1a] font-mono text-[11px]">
                            Meja Transit Intake
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-bold uppercase">
                            Inspeksi Awal
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => alert('Verifikasi fisik barcode intake telah disetujui.')}
                            className="px-3 py-1.5 rounded-lg bg-[#091426] text-white hover:bg-[#1e293b] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">qr_code_scanner</span>
                            <span>Verifikasi</span>
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

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
                  4 Janji Temu Siang Ini
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[12px] font-bold text-[#1d4ed8]">10:15 WIB</span>
                      <h4 className="font-bold text-[#091426] text-[14px]">Keys & Remote Keyless Honda</h4>
                      <p className="text-[12px] text-[#45474c]">Pengambil: Fadhil Ahmad (13219088)</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#6ffbbe] text-[#002113] text-[10px] font-extrabold uppercase">
                      Hadir di Loket
                    </span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#dae2fd] flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold">TIKET: QR-K3L-9042</span>
                    <button
                      onClick={() => onNavigate('bast')}
                      className="px-3 py-1 rounded-lg bg-[#1d4ed8] text-white text-[11px] font-bold cursor-pointer hover:bg-[#1d4ed8]/90"
                    >
                      Proses Serah Terima
                    </button>
                  </div>
                </div>

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
                    <span className="font-mono text-[11px] font-bold">TIKET: QR-K3L-9049</span>
                    <button
                      onClick={() => onNavigate('bast')}
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
            {/* Quick Actions */}
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
                  3 Item Kritis
                </span>
              </div>

              <p className="text-[12px] text-[#45474c]">
                Barang berharga bernilai tinggi belum terverifikasi pemiliknya &gt; 14 hari. Perlu eskalasi publikasi ke Ditmawa.
              </p>

              <div className="space-y-2">
                <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between gap-2 border border-[#eaedff]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#1d4ed8]">watch</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-[#091426] truncate">
                        Seiko Presage Automatic
                      </span>
                      <span className="text-[10px] font-mono text-[#ba1a1a]">
                        Tersimpan: 21 Hari (Rak S-01)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Notifikasi broadcast Ditmawa disebarkan via email & media sosial kampus!')}
                    className="px-2.5 py-1 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[11px] font-bold cursor-pointer"
                  >
                    Broadcast
                  </button>
                </div>

                <div className="p-2.5 rounded-xl bg-[#f2f3ff] flex items-center justify-between gap-2 border border-[#eaedff]">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="material-symbols-outlined text-[#1d4ed8]">phone_iphone</span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12px] font-bold text-[#091426] truncate">
                        iPhone 14 Pro Deep Purple
                      </span>
                      <span className="text-[10px] font-mono text-[#ba1a1a]">
                        Tersimpan: 18 Hari (Loker #01)
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Notifikasi broadcast Ditmawa disebarkan via email & media sosial kampus!')}
                    className="px-2.5 py-1 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[11px] font-bold cursor-pointer"
                  >
                    Broadcast
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
