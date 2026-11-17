import React, { useMemo, useRef, useState } from 'react';
import { FoundItem, UserProfile, getInitials } from '../data/mockData';

interface BastHandoverViewProps {
  item: FoundItem;
  foundItems: FoundItem[];
  userProfile: UserProfile;
  onSelectItem: (itemId: string) => void;
  onNavigate: (view: string) => void;
  onCompleteHandover: (item: FoundItem, bastNumber?: string) => void;
}

export const BastHandoverView: React.FC<BastHandoverViewProps> = ({
  item,
  foundItems,
  userProfile,
  onSelectItem,
  onNavigate,
  onCompleteHandover,
}) => {
  const [ticketSearch, setTicketSearch] = useState(item.pickupCode || item.claimId || item.id);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [step1Checked, setStep1Checked] = useState(true);
  const [step2Checked, setStep2Checked] = useState(true);
  const [step3Checked, setStep3Checked] = useState(true);
  const [legalAgreement, setLegalAgreement] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Interactive Signature Canvas Refs & States
  const studentCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const officerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<{ student: boolean; officer: boolean }>({
    student: false,
    officer: false,
  });
  const [studentSigned, setStudentSigned] = useState(false);
  const [officerSigned, setOfficerSigned] = useState(false);

  const generatedBastNumber =
    item.bastNumber || `BAST/K3L-UI/${new Date().getFullYear()}/${item.id.slice(-4)}`;

  const searchMatches = useMemo(() => {
    const q = ticketSearch.trim().toLowerCase().replace(/^#/, '');
    if (!q) return foundItems.filter((i) => i.status !== 'selesai').slice(0, 4);
    return foundItems
      .filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          (i.claimId && i.claimId.toLowerCase().includes(q)) ||
          (i.pickupCode && i.pickupCode.toLowerCase().includes(q)) ||
          i.title.toLowerCase().includes(q) ||
          (i.claimantName && i.claimantName.toLowerCase().includes(q))
      )
      .slice(0, 4);
  }, [foundItems, ticketSearch]);

  const getPointerPos = (
    canvas: HTMLCanvasElement,
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (
    pad: 'student' | 'officer',
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    const canvas = pad === 'student' ? studentCanvasRef.current : officerCanvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPointerPos(canvas, e);
    ctx.strokeStyle = '#091426';
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawingRef.current[pad] = true;
    if (pad === 'student') setStudentSigned(true);
    else setOfficerSigned(true);
    setFormError(null);
  };

  const handlePointerMove = (
    pad: 'student' | 'officer',
    e: React.PointerEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawingRef.current[pad]) return;
    const canvas = pad === 'student' ? studentCanvasRef.current : officerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPointerPos(canvas, e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handlePointerUp = (pad: 'student' | 'officer') => {
    isDrawingRef.current[pad] = false;
  };

  const clearCanvas = (pad: 'student' | 'officer') => {
    const canvas = pad === 'student' ? studentCanvasRef.current : officerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (pad === 'student') setStudentSigned(false);
    else setOfficerSigned(false);
  };

  const handleComplete = () => {
    if (!step1Checked || !step2Checked || !step3Checked) {
      setFormError('Lengkapi seluruh 3 checklist verifikasi fisik loket terlebih dahulu.');
      return;
    }
    if (!studentSigned || !officerSigned) {
      setFormError('Tanda tangan digital penerima dan petugas posko wajib digoreskan pada kanvas.');
      return;
    }
    if (!legalAgreement) {
      setFormError('Pernyataan Pelepasan Tanggung Jawab wajib dicentang dan disetujui.');
      return;
    }
    setFormError(null);
    onCompleteHandover(item, generatedBastNumber);
    setShowSuccessModal(true);
  };

  const recipientName = item.claimantName || userProfile.name;
  const recipientNim = item.claimantNim || userProfile.nim;
  const recipientMajor = item.claimantMajor || userProfile.program;
  const recipientEmail = item.claimantEmail || userProfile.email;

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
            Verifikasi &amp; Berita Acara Serah Terima (BAST)
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
              Pencarian Cepat Tiket Klaim / Kode Inventaris
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#45474c] text-[20px]">
                search
              </span>
              <input
                className="w-full pl-11 pr-36 py-3 bg-[#f2f3ff] rounded-xl text-[14px] text-[#091426] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                placeholder="Cari kode tiket (#CLM / #INV) atau nama pengklaim..."
                type="text"
                value={ticketSearch}
                onChange={(e) => setTicketSearch(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold px-2.5 py-1 rounded-md bg-[#dce1ff] text-[#001551]">
                {item.statusLabel}
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

        {/* Quick item selector pills from search matches */}
        {searchMatches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#45474c] uppercase">Pilih Item BAST:</span>
            {searchMatches.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelectItem(m.id);
                  setTicketSearch(m.pickupCode || m.claimId || m.id);
                }}
                className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer border ${
                  m.id === item.id
                    ? 'bg-[#091426] text-white border-[#091426]'
                    : 'bg-[#f2f3ff] text-[#131b2e] border-[#eaedff] hover:bg-[#e2e7ff]'
                }`}
              >
                #{m.id} • {m.title.slice(0, 26)}
                {m.title.length > 26 ? '…' : ''}
              </button>
            ))}
          </div>
        )}

        {/* Viewfinder Scanner */}
        {scannerOpen && (
          <div className="bg-[#091426] text-white rounded-2xl p-4 relative overflow-hidden transition-all space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00a472] animate-ping"></span>
                <span>Webcam Scanner HD v2.4 - Pilih Tiket Simulasi Scan QR</span>
              </div>
              <button
                onClick={() => setScannerOpen(false)}
                className="text-[#8590a6] hover:text-white cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="relative w-full max-w-sm mx-auto h-36 bg-white/5 rounded-xl flex items-center justify-center border border-white/10">
              <div className="border-2 border-[#4069f2] rounded-xl w-32 h-32 flex flex-col justify-between p-2">
                <span className="text-[10px] font-mono text-[#dce1ff]">AUTO-FOCUS</span>
                <div className="w-full h-0.5 bg-[#4069f2] animate-pulse"></div>
                <span className="text-[10px] font-mono text-[#dce1ff] text-right">SCAN READY</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {foundItems
                .filter((i) => i.status !== 'selesai')
                .slice(0, 3)
                .map((qrTarget) => (
                  <button
                    key={qrTarget.id}
                    type="button"
                    onClick={() => {
                      onSelectItem(qrTarget.id);
                      setTicketSearch(qrTarget.pickupCode || qrTarget.claimId || qrTarget.id);
                      setScannerOpen(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1d4ed8] hover:bg-[#1d4ed8]/90 text-white text-[11px] font-bold cursor-pointer"
                  >
                    Simulasi Scan QR #{qrTarget.id}
                  </button>
                ))}
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
                <span className="font-mono font-bold text-[#1d4ed8]">
                  #{item.pickupCode || item.claimId || item.id}
                </span>
                <span>•</span>
                <span className="text-[#45474c] font-semibold truncate">{item.storageLocation}</span>
              </div>
              <h2 className="text-[14px] font-bold text-[#091426] truncate">{item.title}</h2>
              <p className="text-[11px] text-[#45474c] truncate">{item.publicDesc}</p>
            </div>
          </div>

          <div className="md:col-span-5 flex items-center gap-3 border-t md:border-t-0 md:border-l border-[#dae2fd] pt-3 md:pt-0 md:pl-4">
            <div className="w-11 h-11 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[13px] flex-shrink-0">
              {getInitials(recipientName)}
            </div>
            <div className="min-w-0 text-[12px]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#091426] text-[13px] truncate">{recipientName}</span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#dce1ff] text-[#001551] shrink-0">
                  SSO AKTIF
                </span>
              </div>
              <p className="text-[#45474c] truncate">
                NIM: {recipientNim} • {recipientMajor}
              </p>
              <p className="text-[#45474c] font-mono text-[11px] truncate">{recipientEmail}</p>
            </div>
          </div>

          <div className="md:col-span-3 flex md:flex-col justify-between items-end gap-1 border-t md:border-t-0 md:border-l border-[#dae2fd] pt-3 md:pt-0 md:pl-4 text-[12px]">
            <span className="text-[11px] uppercase font-bold text-[#45474c]">Tanggal Penemuan</span>
            <span className="font-bold text-[#091426]">{item.foundDate}</span>
            <span className="text-[11px] text-[#45474c] text-right">{item.location}</span>
          </div>
        </div>
      </section>

      {formError && (
        <div className="p-4 rounded-xl bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#ba1a1a] flex items-center gap-2.5 text-[13px] font-semibold">
          <span className="material-symbols-outlined text-[20px]">error</span>
          <span>{formError}</span>
        </div>
      )}

      {/* GRID DUA KOLOM */}
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

          <label className="block p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2.5 cursor-pointer">
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
              Pencocokan visual wajah mahasiswa secara langsung dengan fisik KTM / KTP asli atas nama{' '}
              <strong>{recipientName}</strong>.
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-[#00a472] font-bold">
              <span className="material-symbols-outlined text-[15px]">verified</span>
              <span>Identitas SSO tervalidasi ({recipientNim})</span>
            </div>
          </label>

          <label className="block p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2.5 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[11px]">
                  2
                </div>
                <h4 className="text-[13px] font-bold text-[#091426]">Uji Buka Kunci / Ciri Rahasia</h4>
              </div>
              <input
                type="checkbox"
                checked={step2Checked}
                onChange={(e) => setStep2Checked(e.target.checked)}
                className="w-4 h-4 rounded text-[#1d4ed8]"
              />
            </div>
            <p className="text-[12px] text-[#45474c]">
              Mahasiswa membuktikan kecocokan ciri tersembunyi di hadapan petugas posko.
            </p>
            <div className="p-2.5 bg-[#eaedff] rounded-xl text-[11px] text-[#091426]">
              <strong>Ciri Terdaftar:</strong> {item.secretClueRegistered}
            </div>
          </label>

          <label className="block p-4 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2.5 cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[11px]">
                  3
                </div>
                <h4 className="text-[13px] font-bold text-[#091426]">Kondisi &amp; Segel Locker</h4>
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
            {item.auditorNotes && (
              <div className="p-2 bg-white rounded-xl text-[11px] text-[#45474c] border border-[#eaedff]">
                <strong>Catatan Auditor:</strong> {item.auditorNotes}
              </div>
            )}
          </label>
        </section>

        {/* BAGIAN 3: Formulir Berita Acara Serah Terima (BAST Digital) */}
        <section className="lg:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-[#eaedff] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#eaedff]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#45474c]">
                Dokumen Hukum &amp; Audit Kampus
              </span>
              <h3 className="text-[18px] font-bold text-[#091426]">BAST Digital K3L</h3>
            </div>
            <div className="text-left sm:text-right">
              <span className="block font-mono text-[12px] font-bold text-[#091426]">
                {generatedBastNumber}
              </span>
              <span className="block text-[11px] text-[#45474c]">
                {new Date().toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Pad Tanda Tangan Digital Interaktif */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-[14px] font-bold text-[#091426]">Tanda Tangan Digital Pengesahan</h4>
              <span className="text-[11px] text-[#1d4ed8] font-semibold">
                Goreskan dengan Mouse / Sentuhan Layar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pad 1: Mahasiswa */}
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#091426]">Penerima ({recipientName})</span>
                  <button
                    type="button"
                    onClick={() => clearCanvas('student')}
                    className="text-[11px] text-[#ba1a1a] font-bold hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <div className="h-28 bg-white rounded-lg border border-[#eaedff] relative flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={studentCanvasRef}
                    width={320}
                    height={112}
                    onPointerDown={(e) => handlePointerDown('student', e)}
                    onPointerMove={(e) => handlePointerMove('student', e)}
                    onPointerUp={() => handlePointerUp('student')}
                    onPointerLeave={() => handlePointerUp('student')}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                  {!studentSigned && (
                    <span className="absolute text-[11px] text-[#94a3b8] italic pointer-events-none">
                      Goreskan tanda tangan di sini
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold flex items-center gap-1 text-[#45474c]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      studentSigned ? 'bg-[#00a472]' : 'bg-[#c5c6cd]'
                    }`}
                  ></span>
                  {studentSigned ? 'Tanda tangan tercatat' : 'Menunggu tanda tangan penerima'}
                </span>
              </div>

              {/* Pad 2: Petugas Posko */}
              <div className="p-3.5 rounded-xl bg-[#f2f3ff] border border-[#eaedff] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-bold text-[#091426]">Petugas Posko K3L</span>
                  <button
                    type="button"
                    onClick={() => clearCanvas('officer')}
                    className="text-[11px] text-[#ba1a1a] font-bold hover:underline cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <div className="h-28 bg-white rounded-lg border border-[#eaedff] relative flex items-center justify-center overflow-hidden">
                  <canvas
                    ref={officerCanvasRef}
                    width={320}
                    height={112}
                    onPointerDown={(e) => handlePointerDown('officer', e)}
                    onPointerMove={(e) => handlePointerMove('officer', e)}
                    onPointerUp={() => handlePointerUp('officer')}
                    onPointerLeave={() => handlePointerUp('officer')}
                    className="w-full h-full cursor-crosshair touch-none"
                  />
                  {!officerSigned && (
                    <span className="absolute text-[11px] text-[#94a3b8] italic pointer-events-none">
                      Goreskan tanda tangan petugas
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold flex items-center gap-1 text-[#45474c]">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      officerSigned ? 'bg-[#00a472]' : 'bg-[#c5c6cd]'
                    }`}
                  ></span>
                  {officerSigned ? 'Tanda tangan petugas tercatat' : 'NIP: 198204122005011003'}
                </span>
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
              <strong>Pernyataan Pelepasan Tanggung Jawab:</strong> Dengan menandatangani Berita Acara ini, kepemilikan barang telah resmi diserahterimakan dan tanggung jawab posko pengamanan kampus atas barang temuan ini dinyatakan selesai.
            </span>
          </label>

          {/* Submit Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => onNavigate('coordinator')}
              className="px-4 py-2.5 rounded-xl bg-[#f2f3ff] text-[#45474c] hover:bg-[#eaedff] text-[13px] font-bold cursor-pointer transition-colors"
            >
              Simpan Draf &amp; Kembali
            </button>
            <button
              type="button"
              onClick={handleComplete}
              className="px-6 py-3 rounded-xl bg-[#091426] hover:bg-[#1d4ed8] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
              <span>Selesaikan &amp; Tandai Dikembalikan (Cetak BAP)</span>
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
                Dokumen BAST <strong className="font-mono">{generatedBastNumber}</strong> telah diterbitkan dan tersimpan dalam pangkalan data audit universitas.
              </p>
            </div>

            <div className="p-3.5 bg-[#f2f3ff] rounded-xl space-y-1.5 text-[12px] border border-[#eaedff]">
              <div className="flex justify-between">
                <span className="text-[#45474c]">Penerima Barang:</span>
                <span className="font-bold text-[#091426]">
                  {recipientName} ({recipientNim})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#45474c]">Barang:</span>
                <span className="font-bold text-[#091426] truncate max-w-[240px]">{item.title}</span>
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
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 rounded-xl bg-[#091426] text-white font-bold text-[13px] flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:bg-[#1e293b]"
              >
                <span className="material-symbols-outlined text-[18px]">print</span>
                <span>Cetak Salinan Fisik BAP</span>
              </button>
              <button
                type="button"
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
