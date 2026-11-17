import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CatalogView } from './components/CatalogView';
import { ClaimItemView } from './components/ClaimItemView';
import { ReportLostView } from './components/ReportLostView';
import { ReportFoundView } from './components/ReportFoundView';
import { ActivityView } from './components/ActivityView';
import { ProfileView } from './components/ProfileView';
import { AuthView } from './components/AuthView';
import { CoordinatorDashboardView } from './components/CoordinatorDashboardView';
import { SideBySideView } from './components/SideBySideView';
import { BastHandoverView } from './components/BastHandoverView';
import { AdminAnalyticsView } from './components/AdminAnalyticsView';
import {
  INITIAL_FOUND_ITEMS,
  INITIAL_LOST_REPORTS,
  INITIAL_USER_PROFILE,
  FoundItem,
  LostReport,
  UserProfile,
} from './data/mockData';

const FOUND_ITEMS_STORAGE_KEY = 'kp_found_items_v1';
const LOST_REPORTS_STORAGE_KEY = 'kp_lost_reports_v1';
const USER_PROFILE_STORAGE_KEY = 'kp_user_profile_v1';

function loadArrayFromStorage<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function loadObjectFromStorage<T extends object>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return { ...fallback, ...parsed };
    }
    return fallback;
  } catch {
    return fallback;
  }
}

function computeMatchScore(registered: string, answer: string): number {
  const clean = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length >= 3);
  const regWords = new Set(clean(registered));
  const ansWords = clean(answer);
  if (regWords.size === 0 || ansWords.length === 0) return 76;
  let hits = 0;
  for (const w of ansWords) {
    if (regWords.has(w)) hits++;
  }
  const ratio = hits / Math.max(3, Math.min(regWords.size, 8));
  return Math.min(98, Math.max(72, Math.round(72 + ratio * 26)));
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('catalog');
  const [selectedItemId, setSelectedItemId] = useState<string>('INV-2024-0891');
  const [activeRole, setActiveRole] = useState<'mahasiswa' | 'koordinator' | 'admin'>('mahasiswa');
  const [foundItems, setFoundItems] = useState<FoundItem[]>(() =>
    loadArrayFromStorage<FoundItem>(FOUND_ITEMS_STORAGE_KEY, INITIAL_FOUND_ITEMS)
  );
  const [lostReports, setLostReports] = useState<LostReport[]>(() =>
    loadArrayFromStorage<LostReport>(LOST_REPORTS_STORAGE_KEY, INITIAL_LOST_REPORTS)
  );
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    loadObjectFromStorage<UserProfile>(USER_PROFILE_STORAGE_KEY, INITIAL_USER_PROFILE)
  );

  useEffect(() => {
    try {
      localStorage.setItem(FOUND_ITEMS_STORAGE_KEY, JSON.stringify(foundItems));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [foundItems]);

  useEffect(() => {
    try {
      localStorage.setItem(LOST_REPORTS_STORAGE_KEY, JSON.stringify(lostReports));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [lostReports]);

  useEffect(() => {
    try {
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }, [userProfile]);

  const currentItem =
    foundItems.find((item) => item.id === selectedItemId) || foundItems[0];

  const handleNavigate = (view: string, itemId?: string) => {
    if (itemId) {
      setSelectedItemId(itemId);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenClaim = (item: FoundItem) => {
    setSelectedItemId(item.id);
    setCurrentView('claim');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddItem = (newItem: FoundItem) => {
    setFoundItems((prev) => [newItem, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      itemsFoundReturned: prev.itemsFoundReturned + 1,
    }));
  };

  const handleAddLostReport = (report: {
    title: string;
    category: string;
    location: string;
    locationLabel: string;
    datetime: string;
    visualDesc: string;
    secretClue: string;
  }) => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const now = new Date();
    const ym = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}`;
    const newReport: LostReport = {
      id: `#LPK-${ym}-${randomNum}`,
      title: report.title,
      category: report.category,
      location: report.location,
      locationLabel: report.locationLabel,
      datetime: report.datetime,
      publicDesc: report.visualDesc,
      secretClue: report.secretClue,
      contactWa: userProfile.phone,
      contactEmail: userProfile.email,
      status: 'menunggu',
      statusLabel: 'Menunggu Verifikasi Posko',
      storageOrNote: 'Laporan aktif dipantau oleh sistem Smart Match posko',
    };
    setLostReports((prev) => [newReport, ...prev]);
  };

  const handleCancelLostReport = (id: string) => {
    setLostReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateLostReportStatus = (
    reportId: string,
    status: LostReport['status'],
    matchedItemId?: string
  ) => {
    setLostReports((prev) =>
      prev.map((r) => {
        if (r.id !== reportId) return r;
        if (status === 'cocok') {
          return {
            ...r,
            status: 'cocok',
            statusLabel: 'Cocok dengan Barang Temuan Posko',
            matchedItemId: matchedItemId ?? r.matchedItemId,
            storageOrNote: matchedItemId
              ? `Dicocokkan Koordinator dengan Temuan #${matchedItemId}`
              : 'Koordinator mengonfirmasi kecocokan barang di posko',
          };
        }
        if (status === 'selesai') {
          return {
            ...r,
            status: 'selesai',
            statusLabel: 'Ditemukan & Dikembalikan',
            storageOrNote: 'Laporan kehilangan ditutup oleh Koordinator Posko',
          };
        }
        return {
          ...r,
          status: 'menunggu',
          statusLabel: 'Menunggu Verifikasi Posko',
        };
      })
    );
  };

  const handleClaimSubmit = (claimData: {
    itemId: string;
    secretClue: string;
    pickupMethod: 'direct' | 'proxy';
    phone: string;
    isSecondHand: boolean;
    evidenceFiles: string[];
    claimId: string;
  }) => {
    const nowLabel = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === claimData.itemId
          ? {
              ...i,
              status: 'dalam_klaim',
              statusLabel: 'Dalam Proses Klaim',
              claimId: claimData.claimId,
              claimantName: userProfile.name,
              claimantNim: userProfile.nim,
              claimantMajor: userProfile.program,
              claimantEmail: userProfile.email,
              claimantPhone: claimData.phone,
              claimantSecretAnswer: claimData.secretClue,
              claimEvidenceFiles: claimData.evidenceFiles,
              pickupMethod: claimData.pickupMethod,
              isSecondHand: claimData.isSecondHand,
              claimSubmittedAt: `${nowLabel} WIB`,
              aiMatchScore: computeMatchScore(i.secretClueRegistered, claimData.secretClue),
              verificationStatusNote: undefined,
            }
          : i
      )
    );
  };

  const handleQuickClaim = (itemId: string, secretAnswer: string) => {
    const claimId = `CLM-${Math.floor(1000 + Math.random() * 9000)}`;
    const nowLabel = new Date().toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'dalam_klaim',
              statusLabel: 'Dalam Proses Klaim',
              claimId: i.claimId || claimId,
              claimantName: userProfile.name,
              claimantNim: userProfile.nim,
              claimantMajor: userProfile.program,
              claimantEmail: userProfile.email,
              claimantPhone: userProfile.phone,
              claimantSecretAnswer: secretAnswer,
              claimSubmittedAt: `${nowLabel} WIB`,
              aiMatchScore: computeMatchScore(i.secretClueRegistered, secretAnswer),
            }
          : i
      )
    );
  };

  const handleVerifyIntake = (itemId: string) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'diverifikasi',
              statusLabel: 'Diverifikasi (Siap Diklaim)',
              verificationStatusNote: 'Lolos verifikasi fisik barcode & segel posko',
            }
          : i
      )
    );
  };

  const handleApproveClaim = (item: FoundItem, auditorNotes?: string) => {
    const generatedTicket = item.pickupCode || `TKT-${Math.floor(1000 + Math.random() * 9000)}`;
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'siap_ambil',
              statusLabel: 'Siap Diambil di Posko',
              pickupCode: generatedTicket,
              auditorNotes: auditorNotes ?? i.auditorNotes,
              verificationStatusNote: 'Disetujui Koordinator • Tiket Pengambilan Diterbitkan',
            }
          : i
      )
    );
  };

  const handleRejectClaim = (item: FoundItem, auditorNotes?: string) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'diverifikasi',
              statusLabel: 'Diverifikasi (Siap Diklaim)',
              auditorNotes: auditorNotes ?? i.auditorNotes,
              verificationStatusNote: 'Klaim sebelumnya ditolak koordinator posko',
            }
          : i
      )
    );
  };

  const handleRequestProof = (item: FoundItem, auditorNotes?: string) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'dalam_klaim',
              statusLabel: 'Menunggu Bukti Tambahan',
              auditorNotes: auditorNotes ?? i.auditorNotes,
              verificationStatusNote: 'Koordinator meminta bukti kepemilikan tambahan (24 jam)',
            }
          : i
      )
    );
  };

  const handleCompleteHandover = (item: FoundItem, bastNumber?: string) => {
    const finalBast =
      bastNumber ||
      item.bastNumber ||
      `BAST/K3L-UI/${new Date().getFullYear()}/${Math.floor(1000 + Math.random() * 9000)}`;
    const todayStr = new Date().toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'selesai',
              statusLabel: 'Selesai / Dikembalikan',
              bastNumber: finalBast,
              bastDate: todayStr,
            }
          : i
      )
    );

    if (!item.claimantNim || item.claimantNim === userProfile.nim) {
      setUserProfile((prev) => ({
        ...prev,
        itemsPersonalRecovered: prev.itemsPersonalRecovered + 1,
      }));
    }
  };

  const handleRoleChange = (role: 'mahasiswa' | 'koordinator' | 'admin') => {
    setActiveRole(role);
    if (role === 'koordinator') {
      setCurrentView('coordinator');
    } else if (role === 'admin') {
      setCurrentView('admin');
    } else {
      setCurrentView('catalog');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8ff] text-[#131b2e] selection:bg-[#dce1ff] selection:text-[#001551]">
      {/* Top Global Navigation Bar */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        activeRole={activeRole}
        onChangeRole={handleRoleChange}
        claimCount={foundItems.filter((i) => i.status === 'dalam_klaim').length}
        userProfile={userProfile}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 pt-20">
        {currentView === 'catalog' && (
          <CatalogView
            items={foundItems}
            onOpenClaim={handleOpenClaim}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'claim' && (
          <ClaimItemView
            item={currentItem}
            userProfile={userProfile}
            onNavigate={handleNavigate}
            onSubmitClaim={handleClaimSubmit}
          />
        )}

        {currentView === 'report-lost' && (
          <ReportLostView
            onNavigate={handleNavigate}
            onOpenClaim={handleOpenClaim}
            foundItems={foundItems}
            userProfile={userProfile}
            onSubmitReport={handleAddLostReport}
          />
        )}

        {currentView === 'report-found' && (
          <ReportFoundView
            onNavigate={handleNavigate}
            onItemAdded={handleAddItem}
            userProfile={userProfile}
          />
        )}

        {currentView === 'activity' && (
          <ActivityView
            onNavigate={handleNavigate}
            foundItems={foundItems}
            lostReports={lostReports}
            onCancelLostReport={handleCancelLostReport}
            onSubmitQuickClaim={handleQuickClaim}
          />
        )}

        {currentView === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            foundItems={foundItems}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'auth' && (
          <AuthView
            onNavigate={handleNavigate}
            userProfile={userProfile}
            onUpdateProfile={setUserProfile}
            onLoginSuccess={(role) => {
              setActiveRole(role);
            }}
          />
        )}

        {currentView === 'coordinator' && (
          <CoordinatorDashboardView
            foundItems={foundItems}
            lostReports={lostReports}
            onNavigate={handleNavigate}
            onApproveClaim={handleApproveClaim}
            onVerifyIntake={handleVerifyIntake}
            onUpdateLostReportStatus={handleUpdateLostReportStatus}
          />
        )}

        {currentView === 'side-by-side' && (
          <SideBySideView
            item={currentItem}
            onNavigate={handleNavigate}
            onApprove={handleApproveClaim}
            onReject={handleRejectClaim}
            onRequestProof={handleRequestProof}
          />
        )}

        {currentView === 'bast' && (
          <BastHandoverView
            item={currentItem}
            foundItems={foundItems}
            userProfile={userProfile}
            onSelectItem={(itemId) => setSelectedItemId(itemId)}
            onNavigate={handleNavigate}
            onCompleteHandover={handleCompleteHandover}
          />
        )}

        {currentView === 'admin' && (
          <AdminAnalyticsView
            foundItems={foundItems}
            lostReports={lostReports}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
