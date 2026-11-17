import React, { useState } from 'react';

interface AuthViewProps {
  onNavigate: (view: string) => void;
  onLoginSuccess: (role: 'mahasiswa' | 'koordinator' | 'admin') => void;
}

export const AuthView: React.FC<AuthViewProps> = ({
  onNavigate,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'mahasiswa' | 'koordinator' | 'admin'>('mahasiswa');
  const [identifier, setIdentifier] = useState('13521098');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [alertMsg, setAlertMsg] = useState('');

  const handleRoleChange = (newRole: 'mahasiswa' | 'koordinator' | 'admin') => {
    setRole(newRole);
    if (newRole === 'mahasiswa') {
      setIdentifier('13521098');
    } else if (newRole === 'koordinator') {
      setIdentifier('POSKO-K3L-042');
    } else {
      setIdentifier('k3l.pusat@kampus.ac.id');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg(`Memvalidasi kredensial SSO ${role.toUpperCase()}...`);
    setTimeout(() => {
      onLoginSuccess(role);
      if (role === 'mahasiswa') {
        onNavigate('catalog');
      } else if (role === 'koordinator') {
        onNavigate('coordinator');
      } else {
        onNavigate('admin');
      }
    }, 1000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg('Permohonan aktivasi akun civitas dikirim ke Biro Kemahasiswaan & K3L. Verifikasi maks 1x24 jam.');
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Institutional Credibility & Value Proposition */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full bg-[#e2e7ff] text-[#131b2e] shadow-xs text-[12px] font-bold border border-[#dae2fd]">
              <span className="w-2 h-2 rounded-full bg-[#00a472] animate-pulse"></span>
              <span>Gerbang Otentikasi Terpadu SSO Kampus v4.2</span>
              <span className="material-symbols-outlined text-[16px] text-[#00a472] ml-0.5">
                verified_user
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#091426] tracking-tight leading-tight">
                Satu Akun SSO untuk Melindungi & Menemukan Aset Berharga Kampus
              </h1>
              <p className="text-[15px] text-[#45474c] leading-relaxed">
                Akses resmi portal kehilangan dan penemuan barang terintegrasi Direktorat Kemahasiswaan & Tim Keamanan K3L Kampus. Menjamin rantai penanganan terverifikasi, perlindungan privasi ciri rahasia, serta rekonsiliasi berbasis berita acara resmi (BAST).
              </p>
            </div>

            {/* Key Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="flex flex-col p-4 rounded-2xl bg-white shadow-sm border border-[#eaedff] gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#091426] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">lock_reset</span>
                </div>
                <h2 className="text-[14px] font-bold text-[#091426]">Enkripsi Ciri Rahasia</h2>
                <p className="text-[12px] text-[#45474c] leading-relaxed">
                  Deskripsi unik, nomor seri, dan isi dompet/tas disamarkan dari publik melalui zero-knowledge claim protocol.
                </p>
              </div>

              <div className="flex flex-col p-4 rounded-2xl bg-white shadow-sm border border-[#eaedff] gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#1d4ed8] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                </div>
                <h2 className="text-[14px] font-bold text-[#091426]">Sinkronisasi SIAKAD</h2>
                <p className="text-[12px] text-[#45474c] leading-relaxed">
                  Validasi identitas real-time melalui NIP/NIM aktif untuk mencegah klaim palsu dan kepemilikan ganda.
                </p>
              </div>

              <div className="flex flex-col p-4 rounded-2xl bg-white shadow-sm border border-[#eaedff] gap-2">
                <div className="w-10 h-10 rounded-xl bg-[#e2e7ff] text-[#091426] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">inventory_2</span>
                </div>
                <h2 className="text-[14px] font-bold text-[#091426]">6 Posko Fisik & BAST</h2>
                <p className="text-[12px] text-[#45474c] leading-relaxed">
                  Serah terima aset di posko loker satpam terlindungi CCTV dengan Berita Acara Serah Terima digital ber-QR.
                </p>
              </div>
            </div>

            {/* Stats Strip */}
            <div className="p-5 rounded-2xl bg-[#f2f3ff] border border-[#eaedff] flex flex-wrap items-center justify-between gap-6 shadow-sm">
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#091426]">89.2%</span>
                  <span className="material-symbols-outlined text-[18px] text-[#00a472]">trending_up</span>
                </div>
                <span className="text-[11px] font-bold uppercase text-[#45474c]">
                  Tingkat Rekonsiliasi Sukses
                </span>
              </div>
              <div className="w-px h-8 bg-[#c5c6cd] hidden sm:block"></div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#091426]">480+</span>
                  <span className="material-symbols-outlined text-[18px] text-[#1d4ed8]">inventory</span>
                </div>
                <span className="text-[11px] font-bold uppercase text-[#45474c]">
                  Barang Terpulihkan Semester Ini
                </span>
              </div>
              <div className="w-px h-8 bg-[#c5c6cd] hidden sm:block"></div>
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-[#091426]">14 Titik</span>
                  <span className="material-symbols-outlined text-[18px] text-[#00a472]">videocam</span>
                </div>
                <span className="text-[11px] font-bold uppercase text-[#45474c]">
                  Loker Posko Siaga 24 Jam
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Authentication Card */}
          <div className="lg:col-span-5 w-full">
            <div className="w-full bg-white rounded-3xl shadow-xl border border-[#eaedff] p-6 sm:p-8 flex flex-col gap-6">
              {/* Tabs */}
              <div className="w-full p-1 bg-[#eaedff] rounded-xl flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-bold text-center transition-all cursor-pointer ${
                    authMode === 'login'
                      ? 'bg-white text-[#091426] shadow-sm'
                      : 'text-[#45474c] hover:text-[#091426]'
                  }`}
                >
                  Masuk Akun (Login)
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-bold text-center transition-all cursor-pointer ${
                    authMode === 'register'
                      ? 'bg-white text-[#091426] shadow-sm'
                      : 'text-[#45474c] hover:text-[#091426]'
                  }`}
                >
                  Aktivasi Akun Baru
                </button>
              </div>

              {/* Role Selector */}
              <div className="flex flex-col gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#45474c]">
                  Pilih Peran Pengguna
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('mahasiswa')}
                    className={`py-2 px-2.5 rounded-xl text-[12px] font-bold text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      role === 'mahasiswa'
                        ? 'bg-[#091426] text-white shadow-sm'
                        : 'bg-[#f2f3ff] text-[#45474c] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">school</span>
                    <span>Mahasiswa</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('koordinator')}
                    className={`py-2 px-2.5 rounded-xl text-[12px] font-bold text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      role === 'koordinator'
                        ? 'bg-[#091426] text-white shadow-sm'
                        : 'bg-[#f2f3ff] text-[#45474c] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">local_police</span>
                    <span>Koordinator</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRoleChange('admin')}
                    className={`py-2 px-2.5 rounded-xl text-[12px] font-bold text-center transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      role === 'admin'
                        ? 'bg-[#091426] text-white shadow-sm'
                        : 'bg-[#f2f3ff] text-[#45474c] hover:bg-[#eaedff]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                    <span>Staf / K3L</span>
                  </button>
                </div>
              </div>

              {/* LOGIN FORM */}
              {authMode === 'login' ? (
                <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-[#131b2e]">
                        {role === 'mahasiswa'
                          ? 'NIM / Akun SSO Kampus'
                          : role === 'koordinator'
                          ? 'NIP / ID Posko Satpam'
                          : 'NIP / Akun Admin K3L'}
                      </label>
                      <span className="text-[11px] text-[#45474c]">
                        {role === 'mahasiswa' ? 'Contoh: 13521098' : 'ID Resmi'}
                      </span>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[#45474c] pointer-events-none">
                        alternate_email
                      </span>
                      <input
                        className="w-full pl-11 pr-4 py-2.5 bg-[#f2f3ff] rounded-xl text-[14px] text-[#131b2e] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                        required
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[13px] font-bold text-[#131b2e]">Kata Sandi SSO</label>
                      <button
                        type="button"
                        onClick={() => alert('Permintaan reset sandi dialihkan ke DSTI kampus.')}
                        className="text-[11px] text-[#1d4ed8] hover:underline font-semibold cursor-pointer"
                      >
                        Lupa kata sandi?
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[#45474c] pointer-events-none">
                        lock
                      </span>
                      <input
                        className="w-full pl-11 pr-11 py-2.5 bg-[#f2f3ff] rounded-xl text-[14px] text-[#131b2e] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#1d4ed8] border border-[#eaedff]"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 text-[#45474c] hover:text-[#091426] cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  <label className="flex items-start gap-2.5 cursor-pointer py-0.5 select-none">
                    <input defaultChecked className="mt-0.5 rounded text-[#1d4ed8]" type="checkbox" />
                    <span className="text-[12px] text-[#45474c]">
                      Ingat perangkat ini di jaringan resmi Eduroam & Ruang Posko (30 Hari)
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-[#091426] hover:bg-[#1e293b] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md transition-all mt-1 active:scale-95 cursor-pointer"
                  >
                    <span>Masuk via SSO Kampus Terpadu</span>
                    <span className="material-symbols-outlined text-[18px]">key</span>
                  </button>

                  <div className="relative flex items-center justify-center my-1">
                    <div className="w-full border-t border-[#eaedff]"></div>
                    <span className="absolute px-3 bg-white text-[11px] font-bold text-[#45474c] uppercase">
                      Atau
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onLoginSuccess(role);
                      onNavigate('catalog');
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#f2f3ff] hover:bg-[#eaedff] text-[#131b2e] font-semibold text-[13px] flex items-center justify-center gap-2.5 transition-colors cursor-pointer border border-[#eaedff]"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                    </svg>
                    <span>Akses dengan Google Workspace Kampus (@ac.id)</span>
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => onNavigate('catalog')}
                      className="text-[13px] font-bold text-[#1d4ed8] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">search</span>
                      Lihat Katalog Publik (Akses Tamu)
                    </button>
                  </div>
                </form>
              ) : (
                /* REGISTER FORM */
                <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
                  <div className="p-3 rounded-xl bg-[#f2f3ff] border border-[#eaedff] text-[12px] text-[#131b2e] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1d4ed8]">how_to_reg</span>
                    <span>Aktivasi akun khusus civitas akademika baru dan penugasan posko K3L.</span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-bold text-[#131b2e]">
                      Nomor Induk Resmi (NIM / NIP / ID Satpam)
                    </label>
                    <input
                      className="w-full px-4 py-2.5 bg-[#f2f3ff] rounded-xl text-[13px] text-[#131b2e] border border-[#eaedff]"
                      placeholder="Misal: 198402122010121002"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-bold text-[#131b2e]">Satuan Kerja</label>
                      <select className="w-full px-3 py-2.5 bg-[#f2f3ff] rounded-xl text-[13px] text-[#131b2e] border border-[#eaedff]">
                        <option value="STEI">STEI-K</option>
                        <option value="SBM">SBM</option>
                        <option value="FSRD">FSRD</option>
                        <option value="K3L">Direktorat K3L</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[13px] font-bold text-[#131b2e]">No. WhatsApp</label>
                      <input
                        className="w-full px-3 py-2.5 bg-[#f2f3ff] rounded-xl text-[13px] text-[#131b2e] border border-[#eaedff]"
                        placeholder="0812-XXXX-XXXX"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-[#1d4ed8] text-white font-bold text-[14px] shadow-sm hover:bg-[#1d4ed8]/90 transition-all cursor-pointer"
                  >
                    Kirim Permohonan Aktivasi Akun
                  </button>
                </form>
              )}

              {alertMsg && (
                <div className="p-3 rounded-xl bg-[#e2e7ff] text-[#091426] text-[12px] font-bold flex items-center gap-2 border border-[#dae2fd]">
                  <span className="material-symbols-outlined text-[18px] text-[#00a472]">check_circle</span>
                  <span>{alertMsg}</span>
                </div>
              )}

              {/* Bottom Card Security Banner */}
              <div className="pt-3 border-t border-[#eaedff] flex items-center justify-between text-[11px] font-bold text-[#45474c] uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px] text-[#00a472]">verified</span>
                  <span>TLS 1.3 Kampus 256-bit</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>2FA SIAP</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00a472]"></span>
                  <span>LOG K3L AKTIF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
