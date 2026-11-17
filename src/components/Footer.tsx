import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#f2f3ff] mt-12 border-t border-[#eaedff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img
                src="/assets/aistudio/Image_18_7b9afcbe.png"
                alt="Logo Kembali Pulang Kampus"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).classList.add('hidden');
                }}
              />
              <span className="text-[17px] font-bold text-[#091426]">Kembali Pulang</span>
            </div>
            <p className="text-[13px] text-[#45474c] leading-relaxed">
              Sistem Penataan, Pelaporan, dan Pengambilan Barang Hilang Terintegrasi Universitas berbasis SSO.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffffff] text-[#45474c] text-[11px] font-semibold shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-[#00a472]">verified</span>
              <span>Otoritas Kemahasiswaan & K3L</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-bold text-[#131b2e] uppercase tracking-wider">
              Pusat Bantuan & Hotline
            </h4>
            <ul className="space-y-1.5 text-[13px] text-[#45474c]">
              <li>Posko K3L Induk: ext. 119 / 021-789012</li>
              <li>Satpam Kampus Barat: ext. 112</li>
              <li>Email: lostfound@univ.ac.id</li>
              <li>WhatsApp Sentral: +62 811-2345-6789</li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-bold text-[#131b2e] uppercase tracking-wider">
              Posko Fisik Pengambilan
            </h4>
            <ul className="space-y-1.5 text-[13px] text-[#45474c]">
              <li>Gedung Perpustakaan Pusat Lt. 1 (Loker Khusus)</li>
              <li>Biro Kemahasiswaan Sayap Timur</li>
              <li>Pos Keamanan Gerbang Utama (24 Jam)</li>
              <li>Loket DAAK Gedung Rektorat Lt. 1</li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="text-[13px] font-bold text-[#131b2e] uppercase tracking-wider">
              Jam Layanan Verifikasi
            </h4>
            <div className="space-y-1 text-[13px] text-[#45474c]">
              <p className="text-[#131b2e] font-semibold">Senin – Jumat</p>
              <p>08.00 – 16.30 WIB</p>
              <p className="text-[#131b2e] font-semibold pt-1">Sabtu (Khusus Posko Utama)</p>
              <p>09.00 – 13.00 WIB</p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#dae2fd] flex flex-col md:flex-row items-center justify-between gap-4 text-[12px] text-[#45474c]">
          <p>© 2026 Biro Kemahasiswaan & Keamanan Kampus. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-[#1d4ed8]">Protokol Verifikasi Identitas Berbasis SSO</span>
            <span>•</span>
            <span>Enkripsi AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
