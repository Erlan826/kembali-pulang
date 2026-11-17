import React, { useState, useMemo } from 'react';
import { FoundItem } from '../data/mockData';

interface CatalogViewProps {
  items: FoundItem[];
  onOpenClaim: (item: FoundItem) => void;
  onNavigate: (view: string) => void;
}

export const CatalogView: React.FC<CatalogViewProps> = ({
  items,
  onOpenClaim,
  onNavigate,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredItems = useMemo(() => {
    const latestTimestamp = items.reduce((max, item) => {
      const ts = Date.parse(item.rawDate);
      return Number.isNaN(ts) ? max : Math.max(max, ts);
    }, 0);

    return items.filter((item) => {
      // Search
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.location.toLowerCase().includes(q) ||
        item.publicDesc.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q);

      // Category
      const matchCategory =
        categoryFilter === 'all' || item.category === categoryFilter;

      // Location
      const matchLocation =
        locationFilter === 'all' ||
        (locationFilter === 'perpus' && item.location.toLowerCase().includes('perpustakaan')) ||
        (locationFilter === 'gkb' && (item.location.toLowerCase().includes('gkb') || item.location.toLowerCase().includes('gku') || item.location.toLowerCase().includes('gedung'))) ||
        (locationFilter === 'kantin' && item.location.toLowerCase().includes('kantin')) ||
        (locationFilter === 'lab' && item.location.toLowerCase().includes('lab')) ||
        (locationFilter === 'parkir' && (item.location.toLowerCase().includes('parkir') || item.location.toLowerCase().includes('gerbang')));

      // Date filter
      let matchDate = true;
      if (dateFilter !== 'all' && latestTimestamp > 0) {
        const itemTs = Date.parse(item.rawDate);
        if (!Number.isNaN(itemTs)) {
          const diffDays = (latestTimestamp - itemTs) / (1000 * 60 * 60 * 24);
          if (dateFilter === 'today') matchDate = diffDays <= 1;
          else if (dateFilter === '3days') matchDate = diffDays <= 3;
          else if (dateFilter === '7days') matchDate = diffDays <= 7;
          else if (dateFilter === 'month') matchDate = diffDays <= 30;
        }
      }

      return matchSearch && matchCategory && matchLocation && matchDate;
    });
  }, [items, searchQuery, categoryFilter, locationFilter, dateFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setLocationFilter('all');
    setDateFilter('all');
  };

  const scrollToResults = () => {
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      {/* Hero Segment with Metrics */}
      <section className="relative w-full bg-gradient-to-b from-[#e2e7ff]/60 via-[#faf8ff] to-[#faf8ff] pb-8 pt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dae2fd] text-[#1d4ed8] text-[12px] font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-[#1d4ed8] animate-pulse"></span>
                Portal Terpadu Keamanan & Biro Kemahasiswaan
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#091426] tracking-tight leading-tight">
                Temukan Kembali Barang Berharga Anda di Lingkungan Kampus
              </h1>
              <p className="text-base text-[#45474c] max-w-2xl leading-relaxed">
                Layanan terpadu pelaporan, pencarian, dan pengembalian barang hilang terintegrasi di lingkungan kampus dengan proteksi enkripsi ciri rahasia dan verifikasi SSO.
              </p>
            </div>

            {/* Metric Pulse Cards */}
            <div className="flex items-center gap-3 self-start lg:self-end flex-wrap">
              <div className="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-[#eaedff]">
                <div className="w-10 h-10 rounded-full bg-[#dce1ff] flex items-center justify-center text-[#1d4ed8]">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#091426] leading-none block">
                    {items.length}
                  </span>
                  <span className="text-[12px] text-[#45474c]">Total Inventaris</span>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-[#eaedff]">
                <div className="w-10 h-10 rounded-full bg-[#dae2fd] flex items-center justify-center text-[#091426]">
                  <span className="material-symbols-outlined text-[20px]">policy</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#091426] leading-none block">
                    {items.filter((i) => i.status === 'dalam_klaim' || i.status === 'siap_ambil').length}
                  </span>
                  <span className="text-[12px] text-[#45474c]">Proses Verifikasi</span>
                </div>
              </div>

              <div className="bg-white shadow-sm rounded-xl px-4 py-3 flex items-center gap-3 border border-[#eaedff]">
                <div className="w-10 h-10 rounded-full bg-[#e2e7ff] flex items-center justify-center text-[#00a472]">
                  <span className="material-symbols-outlined text-[20px]">task_alt</span>
                </div>
                <div>
                  <span className="text-lg font-bold text-[#091426] leading-none block">
                    {items.filter((i) => i.status === 'selesai').length}
                  </span>
                  <span className="text-[12px] text-[#45474c]">Barang Dipulangkan</span>
                </div>
              </div>
            </div>
          </div>

          {/* Search & Multi-Filter Console */}
          <div className="bg-white shadow-md rounded-2xl p-5 border border-[#eaedff] space-y-4">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#45474c] text-[24px]">
                search
              </span>
              <input
                className="w-full pl-12 pr-36 py-3.5 rounded-xl bg-[#f2f3ff] text-[#131b2e] text-[15px] placeholder:text-[#45474c]/70 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] transition-all shadow-inner"
                id="searchInput"
                placeholder="Cari nama barang, nomor seri, atau lokasi penemuan..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') scrollToResults();
                }}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Hapus pencarian"
                  className="absolute right-28 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full hover:bg-[#eaedff] text-[#45474c] flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
              <button
                onClick={scrollToResults}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-[#091426] text-white font-semibold text-[13px] flex items-center gap-1.5 hover:bg-[#1e293b] transition-colors cursor-pointer"
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">manage_search</span>
                <span>Telusuri</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center pt-1">
              {/* Category */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">category</span>
                  Kategori Barang
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-[#eaedff] text-[13px] font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] cursor-pointer"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    <option value="all">Semua Kategori</option>
                    <option value="elektronik">Elektronik & Komputer</option>
                    <option value="identitas">Dompet & Kartu Identitas</option>
                    <option value="kunci">Kunci & Kendaraan</option>
                    <option value="buku">Tas, ATK & Buku</option>
                    <option value="aksesoris">Botol, Payung & Aksesoris</option>
                    <option value="lainnya">Lain-lain</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#45474c]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">apartment</span>
                  Zona / Lokasi Kampus
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-[#eaedff] text-[13px] font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] cursor-pointer"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  >
                    <option value="all">Semua Lokasi Kampus</option>
                    <option value="perpus">Perpustakaan Pusat</option>
                    <option value="gkb">Gedung Kuliah Bersama (GKU)</option>
                    <option value="kantin">Kantin Pusat & Timur</option>
                    <option value="lab">Laboratorium & Riset</option>
                    <option value="parkir">Area Parkir & Gerbang</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#45474c]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                  Rentang Penemuan
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none px-3.5 py-2.5 rounded-lg bg-[#eaedff] text-[13px] font-semibold text-[#131b2e] focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] cursor-pointer"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">Semua Periode</option>
                    <option value="today">Hari Ini (24 Jam)</option>
                    <option value="3days">3 Hari Terakhir</option>
                    <option value="7days">7 Hari Terakhir</option>
                    <option value="month">Bulan Ini</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[18px] text-[#45474c]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* Reset */}
              <div className="flex items-end pt-5 md:pt-0">
                <button
                  className="w-full px-4 py-2.5 rounded-lg bg-[#eaedff] hover:bg-[#dae2fd] text-[#45474c] font-semibold text-[13px] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  onClick={resetFilters}
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legend & Verification Protocol Strip */}
      <section className="w-full bg-[#f2f3ff]/70 py-2.5 border-y border-[#eaedff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-2 text-[12px]">
          <div className="flex items-center gap-1.5 font-bold text-[#131b2e] uppercase tracking-wider">
            <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">info</span>
            <span>Status Siklus Inventaris:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-[#45474c]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-[#d2d9f4]"></span>
              <span>Dilaporkan (Verifikasi Fisik)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-xs text-[#1d4ed8] font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1d4ed8]"></span>
              <span>Diverifikasi (Siap Diklaim)</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-xs text-[#ba1a1a]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-pulse"></span>
              <span>Sedang Ditinjau Petugas</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white shadow-xs text-[#00a472]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00a472]"></span>
              <span>Selesai / Diambil Pemilik</span>
            </div>
          </div>
        </div>
      </section>

      {/* Public Catalog Cards Grid */}
      <main id="catalog-results" className="w-full py-10 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-[#091426] tracking-tight">
                Katalog Barang Temuan Terbaru
              </h2>
              <p className="text-[13px] text-[#45474c]">
                Diperbarui secara real-time dari loket penyerahan pos keamanan kampus.
              </p>
            </div>
            <span className="text-[12px] font-semibold text-[#45474c] bg-[#eaedff] px-3 py-1 rounded-md">
              Menampilkan {filteredItems.length} dari {items.length} temuan
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-[#eaedff] shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#f2f3ff] text-[#1d4ed8] flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-[32px]">search_off</span>
              </div>
              <h3 className="text-lg font-bold text-[#091426]">Barang Tidak Ditemukan</h3>
              <p className="text-[14px] text-[#45474c] max-w-md mx-auto mt-1 mb-4">
                Tidak ada temuan yang cocok dengan kata kunci atau filter Anda. Anda dapat mereset filter atau membuat laporan kehilangan baru.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#eaedff] text-[#091426] font-semibold text-[13px] hover:bg-[#dae2fd] transition-colors cursor-pointer"
                >
                  Reset Filter
                </button>
                <button
                  onClick={() => onNavigate('report-lost')}
                  className="px-5 py-2.5 rounded-xl bg-[#091426] text-white font-semibold text-[13px] hover:bg-[#1e293b] transition-colors cursor-pointer"
                >
                  Buat Laporan Kehilangan
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const isUnderReview = item.status === 'dalam_klaim';
                const isReadyPickup = item.status === 'siap_ambil';
                const isResolved = item.status === 'selesai';
                const isReportedOnly = item.status === 'dilaporkan';

                return (
                  <article
                    key={item.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between border border-[#eaedff] ${
                      isResolved ? 'opacity-85' : ''
                    }`}
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative w-full h-52 bg-[#f2f3ff] overflow-hidden group">
                        <img
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          src={item.imageUrl}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80';
                          }}
                        />

                        {/* Top Badge */}
                        <div className="absolute top-3 left-3">
                          {isResolved ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00a472] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                              <span className="material-symbols-outlined text-[14px]">check_circle</span>
                              Dikembalikan
                            </span>
                          ) : isReadyPickup ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#091426] text-[#6ffbbe] text-[11px] font-bold uppercase tracking-wider shadow-sm">
                              <span className="material-symbols-outlined text-[14px]">qr_code_2</span>
                              Siap Diambil di Posko
                            </span>
                          ) : isUnderReview ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#ba1a1a] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                              Dalam Proses Klaim
                            </span>
                          ) : isReportedOnly ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#45474c] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#d2d9f4]"></span>
                              Verifikasi Intake
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1d4ed8] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                              <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                              Diverifikasi Posko
                            </span>
                          )}
                        </div>

                        {/* Inventory ID Pill */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-[#091426]/85 backdrop-blur-sm text-white font-mono text-[11px]">
                          ID: {item.id}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-[11px] font-semibold text-[#1d4ed8]">
                          <span className="uppercase tracking-wider">{item.categoryLabel}</span>
                          <span className="text-[#45474c]">{item.foundDate}</span>
                        </div>

                        <h3 className={`text-[16px] font-bold text-[#091426] leading-snug ${isResolved ? 'line-through opacity-75' : ''}`}>
                          {item.title}
                        </h3>

                        <p className="text-[13px] text-[#45474c] line-clamp-2 leading-relaxed">
                          {item.publicDesc}
                        </p>

                        <div className="space-y-1.5 text-[12px] text-[#45474c] pt-1">
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-[#1d4ed8] flex-shrink-0">
                              location_on
                            </span>
                            <span className="truncate">{item.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-[#45474c] flex-shrink-0">
                              inventory_2
                            </span>
                            <span className="truncate">{item.storageLocation}</span>
                          </div>
                        </div>

                        {/* Protected Characteristic Pill */}
                        <div className="mt-2 p-2 rounded-lg bg-[#f2f3ff] flex items-center gap-2 text-[#45474c] text-[11px] font-semibold">
                          <span className="material-symbols-outlined text-[15px] text-[#1d4ed8]">
                            lock
                          </span>
                          <span>{item.secretClueSummary}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="p-4 pt-0">
                      {isResolved ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-[#eaedff] text-[#45474c] font-semibold text-[13px] flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[18px]">done_all</span>
                          <span>Kasus Selesai (Diserahkan)</span>
                        </button>
                      ) : isReadyPickup ? (
                        <button
                          onClick={() => onNavigate('activity')}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#091426] text-[#6ffbbe] font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-[#1e293b] transition-colors cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                          <span>Tiket Siap Diambil ({item.pickupCode || 'Posko'})</span>
                        </button>
                      ) : isUnderReview ? (
                        <button
                          disabled
                          className="w-full py-2.5 px-4 rounded-xl bg-[#ffdad6] text-[#ba1a1a] font-semibold text-[13px] flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                          <span className="material-symbols-outlined text-[18px]">lock_clock</span>
                          <span>Sedang Ditinjau Petugas Loket</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenClaim(item)}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#1d4ed8] text-white font-semibold text-[13px] flex items-center justify-center gap-2 hover:bg-[#1d4ed8]/90 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">verified</span>
                          <span>Ini Barang Saya (Ajukan Klaim)</span>
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Quick Action Callout Section */}
      <section className="w-full bg-gradient-to-r from-[#091426] via-[#1e293b] to-[#091426] text-white py-12 my-6 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#dce1ff] text-[12px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">live_help</span>
                Bantuan Pelaporan Cepat
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Tidak menemukan barang Anda dalam daftar di atas?
              </h2>
              <p className="text-[14px] text-[#8590a6] max-w-2xl leading-relaxed">
                Buat laporan kehilangan atau daftarkan temuan baru. Sistem Smart Match AI kami akan secara otomatis mencocokkan ciri fisik dan mengirimkan notifikasi instan ke WhatsApp & email SSO Anda.
              </p>
            </div>
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => onNavigate('report-lost')}
                className="px-5 py-3 rounded-xl bg-[#1d4ed8] text-white font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#1d4ed8]/90 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">report_problem</span>
                <span>Buat Laporan Kehilangan</span>
              </button>
              <button
                onClick={() => onNavigate('report-found')}
                className="px-5 py-3 rounded-xl bg-white text-[#091426] font-semibold text-[14px] flex items-center justify-center gap-2 hover:bg-[#f2f3ff] transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">handshake</span>
                <span>Saya Menemukan Barang</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
