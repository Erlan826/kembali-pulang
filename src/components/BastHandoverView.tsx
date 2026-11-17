import React, { useState, useRef } from 'react';
import { FoundItem } from '../data/mockData';

interface BastHandoverViewProps {
  item: FoundItem;
  onNavigate: (view: string) => void;
  onCompleteHandover: (item: FoundItem) => void;
}

export const BastHandoverView: React.FC<BastHandoverViewProps> = ({
  item,
  onNavigate,
  onCompleteHandover,
}) => {
  const [ticketSearch, setTicketSearch] = useState('#TKT-CLM-9032');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [step1Checked, setStep1Checked] = useState(true);
  const [step2Checked, setStep2Checked] = useState(true);
  const [step3Checked, setStep3Checked] = useState(true);
  const [legalAgreement, setLegalAgreement] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Signatures state
  const studentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const officerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const clearCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const handleComplete = () => {
    if (!legalAgreement) {
      alert('Pernyataan Pelepasan Tanggung Jawab wajib disetujui.');
      return;
    }
    onCompleteHandover(item);
    setShowSuccessModal(true);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header Deskripsi Ringkas & Shift Metadata */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-[#dae2fd] text-[#091426] text-[11px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1d4ed8]"></span>
              Loket Fisik Aktif
            </span>
            <span className="text-[12px] text-[#45474c] font-mono">
              Posko K3L Gedung Rektorat Lt. 1
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#091426] tracking-tight">
            Verifikasi & Berita Acara Serah Terima (BAST)
          </h1>
          <p className="text-[13px] text-[#45474c] mt-0.5">
            Proses validasi fisik tatap muka, pembuktian kepemilikan riil, dan penerbitan BAST resmi.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-2xl shadow-xs border border-[#eaedff]">
          <div className="w-10 h-10 rounded-xl bg-[#dae2fd] flex items-center justify-center text-[#091426]">
            <span className="material-symbols-outlined text-[22px]">badge</span>
          </div>
          <div className="text-[12px]">
            <span className="block text-[#45474c] font-bold uppercase text-[10px]">
              Petugas Loket Jaga
            </span>
            <span className="block font-bold text-[#091426] text-[13px]">
              Bripka Sunarto (ID: K3L-8821)
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: Pencarian Cepat & Scanner Tiket Posko */}
      <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#45474c] mb-1">
              Pencarian Cepat Tiket Klaim
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45474c] text-[20px]">
                search
              </span>
              <input
                className="w-full pl-11 pr-28 py-3 bg-[#f2f3ff] rounded-xl text-[14px] text-[#091426] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                placeholder="Masukkan Kode Tiket Klaim (misal: #TKT-CLM-9032) atau Scan QR Code"
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#dce1ff] text-[#001551]">
                Status: Disetujui
              </span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => setScannerOpen(!scannerOpen)}
              type="button"
              className="w-full lg:w-auto h-[46px] px-5 rounded-xl bg-[#091426] hover:bg-[#1e293b] text-white text-[13px] font-bold flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">qr_code_scanner</span>
              <span>{scannerOpen ? 'Tutup Scanner Kamera' : 'Aktifkan Scanner QR Loket'}</span>
            </button>
          </div>
        </div>

        {/* Viewfinder Scanner */}
        {scannerOpen && (
          <div className="bg-[#091426] text-white rounded-2xl p-4 relative overflow-hidden transition-all">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00a472] animate-ping"></span>
                <span>Webcam Scanner HD v2.4 - Siap Memindai QR Tiket Fisik</span>
              </div>
              <button
                onClick={() => setScannerOpen(false)}
                className="text-[#8590a6] hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="relative w-full max-w-sm mx-auto h-40 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <div className="border-2 border-[#4069f2] rounded-xl w-36 h-36 flex flex-col justify-between p-2 shadow-[0_0_15px_rgba(64,105,242,0.4)]">
                <span className="text-[10px] font-mono text-[#dce1ff]">AUTO-FOCUS</span>
                <div className="w-full h-0.5 bg-[#4069f2] animate-pulse"></div>
                <span className="text-[10px] font-mono text-[#dce1ff] text-right">SCAN READY</span>
              </div>
            </div>
          </div>
        )}

        {/* Banner Ringkasan Tiket Terpilih */}
        <div className="bg-[#f2f3ff] rounded-2xl p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center border border-[#eaedff]">
          <div className="md:col-span-4 flex items-center gap-3">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-white border border-[#eaedff]"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px]">
                <span className="font-mono font-bold text-[#1d4ed8]">#TKT-CLM-9032</span>
                <span>•</span>
                <span className="text-[#45474c] font-semibold">Locker A-04</span>
              </div>
              <h2 className="text-[14px] font-bold text-[#091426] truncate">{item.title}</h2>
              <p className="text-[11px] text-[#45474c] truncate">{item.publicDesc}</p>
            </div>
          </div>

          <div className="md:col-span-5 flex items-center gap-3 border-t md:border-t-0 md:border-l border-[#dae2fd] pt-3 md:pt-0 md:pl-4">
            <div className="w-11 h-11 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[13px] flex-shrink-0">
              AZ
            </div>
            <div className="min-w-0 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#091426] text-[13px]">Ahmad Zaki</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#dce1ff] text-[#001551]">
                  SSO AKTIF
                </span>
              </div>
              <p className="text-[#45474c]">NIM: 13521098 • STEI-K Informatika</p>
              <p className="text-[#45474c] font-mono text-[11px]">13521098@std.stei.ac.id</p>
            </div>
          </div>

          <div className="md:col-span-3 flex md:flex-col justify-between items-end gap-1 border-t md:border-t-0 md:border-l border-[#dae2fd] pt-3 md:pt-0 md:pl-4 text-[12px]">
            <span className="text-[11px] uppercase font-bold text-[#45474c]">Tanggal Penemuan</span>
            <span className="font-bold text-[#091426]">12 Okt 2024, 14:15</span>
            <span className="text-[11px] text-[#45474c]">Lab Komputer B Lt. 3</span>
          </div>
        </div>
      </section>

      {/* GRID DUA KOLOM: Verifikasi Fisik (Kiri) & Formulir BAST Digital (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* BAGIAN 2: Verifikasi Fisik di Loket */}
        <section className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#f2f3ff]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1d4ed8]">
                Tahap Eksekusi
              </span>
              <h3 className="text-[16px] font-bold text-[#091426]">Checklist Fisik Loket</h3>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#eaedff] text-[#091426] text-[11px] font-bold">
              3 Langkah Wajib
            </span>
          </div>

          {/* Langkah 1: Kartu Identitas */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[11px]">
                  1
                </div>
                <h4 className="text-[13px] font-bold text-[#091426]">Verifikasi Kartu Identitas</h4>
              </div>
              <input
                type="checkbox"
                checked={step1Checked}
                onChange={(e) => setStep1Checked(e.target.checked)}
                className="w-4 h-4 rounded text-[#1d4ed8]"
              />
            </div>
            <p className="text-[12px] text-[#45474c]">
              Pencocokan visual wajah mahasiswa secara langsung dengan fisik KTM / KTP asli.
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBvpcHk0oEUzvroXw1O9DhrPYnL2vSR-3mVWAJ1GWSHJDkpV8dNwR6dXHJcbmTjxUFX0jYxx_dcHgI_mvczCIA7Ve9mfUJ9BY5QeQ3I0Ta2ByMCiWBT9vR1ZkvgFOAYvDTPUdhv0wkjCvQTeQC1IPou3BEfXE_9nPybEjMYCtwxOEfob7PzxooewC4NbKxh5-dpVemEwAaMrmFTzYDvdtPgJCUO1VPsV_D6GXenf9c"
                  alt="KTM"
                  className="w-full h-20 object-cover rounded mb-1"
                />
                <span className="text-[#45474c]">KTM Digital (SIAKAD)</span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCucRyW4F8B6VaqN-TmHZESNmLCNq8P3ZtZkdO8g9E4o5l7lIb8GPpaUJ96_PpwRZR_LgUIm2n9cVGVwXXTu-zJ0-rlKIlKZNxH8-lSrW_cpiE8QJQok7fB3riZCEw9MBvIM7A3pbHs2nhDkAHs_C8WbSVd0TyYzGhf0NQf2QgNlXtW0k2iokheb1qIoZTASn5c8zZzD7DXFKuyLQHw3BpOYm1cj19aD5O45NFmHHE"
                  alt="Wajah Pemohon"
                  className="w-full h-20 object-cover rounded mb-1"
                />
                <span className="text-[#45474c]">Wajah Pemohon Loket</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-[#00a472] font-bold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Pencocokan biometrik visual sesuai 100%</span>
            </div>
          </div>

          {/* Langkah 2: Uji Buka Kunci */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[11px]">
                  2
                </div>
                <h4 className="text-[13px] font-bold text-[#091426]">Uji Buka Kunci / Akses Fisik</h4>
              </div>
              <input
                type="checkbox"
                checked={step2Checked}
                onChange={(e) => setStep2Checked(e.target.checked)}
                className="w-4 h-4 rounded text-[#1d4ed8]"
              />
            </div>
            <p className="text-[12px] text-[#45474c]">
              Mahasiswa memasukkan passcode/Touch ID di hadapan petugas posko sebagai bukti absolut kepemilikan.
            </p>
            <div className="p-2.5 bg-[#eaedff] rounded-xl flex items-center justify-between text-[12px]">
              <div className="flex items-center gap-1.5 font-bold text-[#091426]">
                <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">lock_open</span>
                <span>Uji Sandi Desktop OS:</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-white text-[#1d4ed8] font-bold text-[11px]">
                TERVERIFIKASI BERHASIL
              </span>
            </div>
          </div>

          {/* Langkah 3: Segel Locker */}
          <div className="p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2.5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[11px]">
                  3
                </div>
                <h4 className="text-[13px] font-bold text-[#091426]">Kondisi & Segel Locker</h4>
              </div>
              <input
                type="checkbox"
                checked={step3Checked}
                onChange={(e) => setStep3Checked(e.target.checked)}
                className="w-4 h-4 rounded text-[#1d4ed8]"
              />
            </div>
            <p className="text-[12px] text-[#45474c]">
              Kondisi fisik barang diserahkan dalam keadaan utuh dan tersegel dari locker posko tanpa kerusakan baru.
            </p>
            <div className="p-2 bg-white rounded-xl text-[12px] flex items-center gap-2 border border-[#eaedff]">
              <span className="material-symbols-outlined text-[16px] text-[#45474c]">inventory_2</span>
              <span>
                No. Segel Kantong K3L: <strong className="font-mono">#SEAL-9921-A</strong>
              </span>
            </div>
          </div>
        </section>

        {/* BAGIAN 3: Formulir Berita Acara Serah Terima (BAST Digital) */}
        <section className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eaedff]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#45474c]">
                Dokumen Hukum & Audit Kampus
              </span>
              <h3 className="text-[18px] font-bold text-[#091426]">BAST Digital K3L</h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="block font-mono text-[12px] font-bold text-[#091426]">
                BAST/K3L-UI/2026/XI/1142
              </span>
              <span className="block text-[11px] text-[#45474c]">
                Senin, 9 Nov 2026, 16.50 WIB
              </span>
            </div>
          </div>

          {/* Foto Dokumentasi Serah Terima */}
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-[#091426]">
              Foto Dokumentasi Serah Terima Loket
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="relative rounded-xl overflow-hidden h-36 bg-[#f2f3ff] border border-[#eaedff]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQtDBtWLx2YNsVqYQ7-_QicnspQ9b9vON_-1Yduuj7VelTH02bvVM7fYWnieUxtXU-QbvMfqM2zdeqT7HYit49PK6O6MArKVzJM6-AjDrTjNC_MpuMVq6U1EfnmMUvO5Fo9sAdUgjoK1lOwIc12ADPN53wx9L5sMDld0kcRZumM15lQFOSDHMAfVM-oEPSG9p_FI8aC4vIK1-pbsBnTkrE0zif02A0KdzFiEsjYXE"
                  alt="Serah Terima"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-[#091426]/80 text-white font-mono text-[10px]">
                  SNAP_2026_LOKET1.JPG
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] flex flex-col justify-between text-[12px]">
                <div>
                  <span className="font-bold text-[#091426] block">Integritas Arsip</span>
                  <p className="text-[#45474c] mt-0.5 leading-relaxed">
                    Foto otomatis diberi cap digital hash SHA-256 dan stempel waktu server kampus.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <span className="font-mono text-[11px] text-[#45474c]">HASH: 8f9b...a12c</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pad Tanda Tangan Digital */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-bold text-[#091426]">Tanda Tangan Digital Pengesahan</h4>
              <span className="text-[11px] text-[#45474c]">Stylus / Sentuhan Jari</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pad 1: Mahasiswa */}
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#091426]">Penerima (Mahasiswa)</span>
                  <button
                    onClick={() => clearCanvas(studentCanvasRef.current)}
                    className="text-[11px] text-[#ba1a1a] font-bold hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <div className="h-24 bg-white rounded-lg border border-[#eaedff] relative flex items-center justify-center cursor-crosshair">
                  <canvas
                    ref={studentCanvasRef}
                    width={240}
                    height={90}
                    className="w-full h-full"
                  />
                  <span className="absolute text-[11px] text-[#c5c6cd] italic pointer-events-none">
                    Goreskan tanda tangan mahasiswa
                  </span>
                </div>
                <span className="text-[10px] text-[#45474c] block">Token SSO SIAKAD Terverifikasi</span>
              </div>

              {/* Pad 2: Petugas Posko */}
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#091426]">Petugas Posko K3L</span>
                  <button
                    onClick={() => clearCanvas(officerCanvasRef.current)}
                    className="text-[11px] text-[#ba1a1a] font-bold hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <div className="h-24 bg-white rounded-lg border border-[#eaedff] relative flex items-center justify-center cursor-crosshair">
                  <canvas
                    ref={officerCanvasRef}
                    width={240}
                    height={90}
                    className="w-full h-full"
                  />
                  <span className="absolute text-[11px] text-[#c5c6cd] italic pointer-events-none">
                    Goreskan tanda tangan petugas
                  </span>
                </div>
                <span className="text-[10px] text-[#45474c] block">NIP: 198204122005011003</span>
              </div>
            </div>
          </div>

          {/* Legal Agreement */}
          <label className="p-3.5 rounded-xl bg-[#eaedff] border border-[#dae2fd] flex items-start gap-2.5 cursor-pointer text-[12px]">
            <input
              type="checkbox"
              checked={legalAgreement}
              onChange={(e) => setLegalAgreement(e.target.checked)}
              className="mt-0.5 rounded text-[#1d4ed8]"
            />
            <span className="text-[#131b2e] leading-relaxed">
              <strong>Pernyataan Pelepasan Tanggung Jawab:</strong> Dengan menandatangani Berita Acara ini, kepemilikan barang telah resmi diserahterimakan dan tanggung jawab posko pengamanan kampus atas barang temuan ini dinyatakan selesai. Mahasiswa melepaskan pengelola dari tuntutan di kemudian hari.
            </span>
          </label>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={() => onNavigate('coordinator')}
              className="px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#45474c] hover:bg-[#eaedff] text-[13px] font-bold cursor-pointer transition-colors"
            >
              Simpan Draf & Kembali
            </button>
            <button
              onClick={handleComplete}
              className="px-6 py-3 rounded-xl bg-[#091426] hover:bg-[#1d4ed8] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              <span>Selesaikan & Tandai Dikembalikan (Cetak BAP)</span>
            </button>
          </div>
        </section>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-[#091426]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 md:p-8 shadow-2xl space-y-4 border border-[#eaedff]">
            <div className="w-14 h-14 rounded-full bg-[#dce1ff] text-[#1d4ed8] flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-2xl font-bold text-[#091426]">Serah Terima Berhasil Disahkan!</h3>
              <p className="text-[13px] text-[#45474c]">
                Dokumen BAST #BAST/K3L-UI/2026/XI/1142 telah diterbitkan dan tersimpan dalam pangkalan data audit universitas.
              </p>
            </div>

            <div className="p-3.5 bg-[#f2f3ff] rounded-xl space-y-1.5 text-[12px] border border-[#eaedff]">
              <div className="flex justify-between">
                <span className="text-[#45474c]">Penerima Barang:</span>
                <span className="font-bold text-[#091426]">Ahmad Zaki (13521098)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45474c]">Barang:</span>
                <span className="font-bold text-[#091426]">{item.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45474c]">Status Laporan:</span>
                <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#6ffbbe] text-[#002113]">
                  SELESAI / DIKEMBALIKAN
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl bg-[#091426] text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-[#1e293b]"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Salinan Fisik BAP</span>
              </button>
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  onNavigate('coordinator');
                }}
                className="py-3 px-4 rounded-xl bg-[#f2f3ff] text-[#091426] font-bold text-[13px] hover:bg-[#eaedff] cursor-pointer"
              >
                Kembali ke Antrean
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
