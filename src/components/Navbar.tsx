import React, { useEffect, useRef, useState } from 'react';
import { UserProfile, getInitials } from '../data/mockData';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, itemId?: string) => void;
  activeRole: 'mahasiswa' | 'koordinator' | 'admin';
  onChangeRole: (role: 'mahasiswa' | 'koordinator' | 'admin') => void;
  claimCount: number;
  userProfile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeRole,
  onChangeRole,
  claimCount,
  userProfile
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const navItems = [
    { id: 'catalog', label: 'Beranda', icon: 'home', matchViews: ['catalog', 'claim'] },
    { id: 'report-lost', label: 'Lapor Kehilangan', icon: 'campaign', matchViews: ['report-lost'] },
    { id: 'report-found', label: 'Lapor Penemuan', icon: 'add_a_photo', matchViews: ['report-found'] },
    {
      id: 'activity',
      label: 'Aktivitas & Klaim',
      icon: 'assignment',
      badge: claimCount,
      matchViews: ['activity']
    },
    { id: 'profile', label: 'Profil SSO', icon: 'account_circle', matchViews: ['profile'] }
  ];

  const shortStudentName = userProfile.name.split(' ').slice(0, 2).join(' ');
  const studentInitials = getInitials(userProfile.name);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#eaedff] shadow-sm">
      <div className="h-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => handleNavClick('catalog')}
            className="flex items-center gap-2.5 text-left hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
          >
            <img
              src="/assets/aistudio/Image_18_7b9afcbe.png"
              alt="Logo Kembali Pulang"
              className="w-9 h-9 object-contain rounded-xl shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLElement).classList.add('hidden');
              }}
            />
            <div className="flex flex-col">
              <span className="text-[16px] font-bold text-[#091426] leading-tight tracking-tight whitespace-nowrap">
                Kembali Pulang
              </span>
              <span className="text-[10px] font-semibold text-[#45474c] uppercase tracking-wider leading-tight hidden sm:inline-block whitespace-nowrap">
                Layanan Temuan Kampus
              </span>
            </div>
          </button>
        </div>

        {/* Navigation Links for Mahasiswa / General */}
        {activeRole === 'mahasiswa' && (
          <nav
            aria-label="Navigasi Utama"
            className="hidden lg:flex items-center gap-1 p-1 rounded-xl bg-[#f2f3ff] border border-[#e2e7ff]/70 shrink-0"
          >
            {navItems.map((item) => {
              const isActive = item.matchViews.includes(currentView);
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`h-9 px-3 xl:px-3.5 rounded-lg text-[12.5px] xl:text-[13px] whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#091426] shadow-sm font-bold ring-1 ring-[#dae2fd]'
                      : 'text-[#45474c] font-semibold hover:bg-[#e2e7ff]/70 hover:text-[#091426]'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-[#1d4ed8] text-white text-[10px] font-bold leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Navigation for Koordinator / Admin */}
        {activeRole !== 'mahasiswa' && (
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#f2f3ff] border border-[#e2e7ff]/70 rounded-xl text-[12.5px] font-semibold shrink-0 whitespace-nowrap">
            <button
              onClick={() => onChangeRole('mahasiswa')}
              className="h-9 px-3 rounded-lg text-[#45474c] hover:bg-[#e2e7ff]/70 hover:text-[#091426] transition-colors cursor-pointer whitespace-nowrap"
            >
              Mode Mahasiswa
            </button>
            <span className="h-9 px-3.5 rounded-lg bg-white text-[#091426] font-bold shadow-sm ring-1 ring-[#dae2fd] flex items-center whitespace-nowrap">
              {activeRole === 'koordinator' ? 'Panel Koordinator Posko' : 'Panel Otoritas & K3L'}
            </span>
          </div>
        )}

        {/* Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Role selector pill */}
          <div className="hidden sm:flex items-center bg-[#f2f3ff] p-1 rounded-full text-[11px] font-bold uppercase tracking-wider shrink-0 whitespace-nowrap">
            <button
              onClick={() => onChangeRole('mahasiswa')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeRole === 'mahasiswa'
                  ? 'bg-[#1d4ed8] text-white shadow-sm'
                  : 'text-[#45474c] hover:text-[#091426]'
              }`}
            >
              Mhs
            </button>
            <button
              onClick={() => onChangeRole('koordinator')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeRole === 'koordinator'
                  ? 'bg-[#091426] text-white shadow-sm'
                  : 'text-[#45474c] hover:text-[#091426]'
              }`}
            >
              Posko
            </button>
            <button
              onClick={() => onChangeRole('admin')}
              className={`px-2.5 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
                activeRole === 'admin'
                  ? 'bg-[#091426] text-white shadow-sm'
                  : 'text-[#45474c] hover:text-[#091426]'
              }`}
            >
              K3L
            </button>
          </div>

          {/* Notifications Icon with Ping */}
          <button
            onClick={() => handleNavClick('activity')}
            title="Pemberitahuan Klaim & Verifikasi"
            className="relative w-9 h-9 flex items-center justify-center rounded-full text-[#45474c] hover:bg-[#f2f3ff] hover:text-[#091426] transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[21px]">notifications</span>
            {claimCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white" />
            )}
          </button>

          {/* User Profile dropdown */}
          <div className="relative shrink-0" ref={dropdownRef}>
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-1 hover:opacity-85 transition-opacity cursor-pointer text-left"
              aria-expanded={profileDropdownOpen}
              aria-haspopup="menu"
            >
              <div className="hidden xl:flex flex-col text-right whitespace-nowrap">
                <span className="text-[13px] font-bold text-[#091426] leading-tight">
                  {activeRole === 'mahasiswa' ? shortStudentName : 'Drs. H. Sudirman, M.Si'}
                </span>
                <span className="text-[11px] text-[#45474c] leading-tight mt-0.5">
                  {activeRole === 'mahasiswa' ? `NIM: ${userProfile.nim}` : 'Koordinator K3L'}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#091426] text-white flex items-center justify-center font-bold text-[12px] shadow-sm shrink-0">
                {activeRole === 'mahasiswa' ? studentInitials : 'SD'}
              </div>
            </button>

            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#eaedff] py-2 z-50 text-[13px]">
                <div className="px-4 py-2.5 border-b border-[#eaedff]">
                  <p className="font-bold text-[#091426]">
                    {activeRole === 'mahasiswa' ? userProfile.name : 'Drs. H. Sudirman, M.Si'}
                  </p>
                  <p className="text-[12px] text-[#45474c]">
                    {activeRole === 'mahasiswa' ? userProfile.email : 'k3l.pusat@kampus.ac.id'}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#dce1ff] text-[#001551]">
                    <span className="material-symbols-outlined text-[12px] text-[#00a472]">verified_user</span>
                    {activeRole.toUpperCase()} • SSO TERVERIFIKASI
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => handleNavClick('catalog')}
                    className="w-full text-left px-4 py-2 hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#45474c]">home</span>
                    Beranda & Katalog Temuan
                  </button>
                  <button
                    onClick={() => handleNavClick('report-lost')}
                    className="w-full text-left px-4 py-2 hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#45474c]">campaign</span>
                    Lapor Kehilangan
                  </button>
                  <button
                    onClick={() => handleNavClick('report-found')}
                    className="w-full text-left px-4 py-2 hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#45474c]">add_a_photo</span>
                    Lapor Penemuan
                  </button>
                  <button
                    onClick={() => handleNavClick('activity')}
                    className="w-full text-left px-4 py-2 hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#45474c]">assignment</span>
                    Aktivitas & Klaim Saya
                  </button>
                  <button
                    onClick={() => handleNavClick('profile')}
                    className="w-full text-left px-4 py-2 hover:bg-[#f2f3ff] text-[#131b2e] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px] text-[#45474c]">account_circle</span>
                    Profil & Identitas SSO
                  </button>

                  <div className="border-t border-[#eaedff] my-1" />

                  <button
                    onClick={() => handleNavClick('auth')}
                    className="w-full text-left px-4 py-2 hover:bg-[#ffdad6] text-[#ba1a1a] flex items-center gap-2.5 font-semibold cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Ganti Akun / Gerbang SSO
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Buka menu navigasi"
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-[#f2f3ff] text-[#091426] hover:bg-[#e2e7ff] transition-colors cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#eaedff] px-4 py-3 shadow-lg space-y-2">
          {activeRole === 'mahasiswa' ? (
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = item.matchViews.includes(currentView);
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2.5 rounded-lg text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-[#dae2fd] text-[#091426] font-bold'
                        : 'bg-[#f2f3ff]/60 text-[#45474c] font-semibold hover:bg-[#e2e7ff]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      {item.label}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-[20px] px-1.5 rounded-full bg-[#1d4ed8] text-white text-[11px] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          ) : (
            <button
              onClick={() => {
                onChangeRole('mahasiswa');
                setMobileMenuOpen(false);
              }}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#f2f3ff] text-[#091426] text-[13px] font-semibold text-left flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
              Kembali ke Mode Mahasiswa
            </button>
          )}

          {/* Role Switcher on small screens */}
          <div className="sm:hidden pt-2 border-t border-[#eaedff] flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#45474c] uppercase tracking-wider">Peran Aktif</span>
            <div className="flex items-center bg-[#f2f3ff] p-1 rounded-full text-[11px] font-bold uppercase">
              <button
                onClick={() => {
                  onChangeRole('mahasiswa');
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-full cursor-pointer ${
                  activeRole === 'mahasiswa' ? 'bg-[#1d4ed8] text-white' : 'text-[#45474c]'
                }`}
              >
                Mhs
              </button>
              <button
                onClick={() => {
                  onChangeRole('koordinator');
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-full cursor-pointer ${
                  activeRole === 'koordinator' ? 'bg-[#091426] text-white' : 'text-[#45474c]'
                }`}
              >
                Posko
              </button>
              <button
                onClick={() => {
                  onChangeRole('admin');
                  setMobileMenuOpen(false);
                }}
                className={`px-2.5 py-1 rounded-full cursor-pointer ${
                  activeRole === 'admin' ? 'bg-[#091426] text-white' : 'text-[#45474c]'
                }`}
              >
                K3L
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
