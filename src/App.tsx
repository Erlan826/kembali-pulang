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
  FoundItem,
  LostReport,
} from './data/mockData';

const FOUND_ITEMS_STORAGE_KEY = 'kp_found_items_v1';
const LOST_REPORTS_STORAGE_KEY = 'kp_lost_reports_v1';

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<string>('catalog');
  const [selectedItemId, setSelectedItemId] = useState<string>('INV-2024-0891');
  const [activeRole, setActiveRole] = useState<'mahasiswa' | 'koordinator' | 'admin'>('mahasiswa');
  const [foundItems, setFoundItems] = useState<FoundItem[]>(() =>
    loadFromStorage<FoundItem[]>(FOUND_ITEMS_STORAGE_KEY, INITIAL_FOUND_ITEMS)
  );
  const [lostReports, setLostReports] = useState<LostReport[]>(() =>
    loadFromStorage<LostReport[]>(LOST_REPORTS_STORAGE_KEY, INITIAL_LOST_REPORTS)
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

  // Active item for detail / claim / BAST
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
      contactWa: '+62 812-9876-5432',
      contactEmail: '13521098@std.stei.ac.id',
      status: 'menunggu',
      statusLabel: 'Menunggu Verifikasi Posko',
      storageOrNote: 'Laporan aktif dipantau oleh sistem Smart Match posko',
    };
    setLostReports((prev) => [newReport, ...prev]);
  };

  const handleCancelLostReport = (id: string) => {
    setLostReports((prev) => prev.filter((r) => r.id !== id));
  };

  const handleClaimSubmit = (claimData: {
    itemId: string;
    secretClue: string;
    pickupMethod: 'direct' | 'proxy';
    phone: string;
    isSecondHand: boolean;
  }) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === claimData.itemId
          ? {
              ...i,
              status: 'dalam_klaim',
              statusLabel: 'Dalam Proses Klaim',
              claimantSecretAnswer: claimData.secretClue,
              claimantPhone: claimData.phone,
            }
          : i
      )
    );
  };

  const handleQuickClaim = (itemId: string, secretAnswer: string) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              status: 'dalam_klaim',
              statusLabel: 'Dalam Proses Klaim',
              claimantSecretAnswer: secretAnswer,
            }
          : i
      )
    );
  };

  const handleApproveClaim = (item: FoundItem) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'siap_ambil',
              statusLabel: 'Siap Diambil di Posko',
            }
          : i
      )
    );
  };

  const handleCompleteHandover = (item: FoundItem) => {
    setFoundItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? {
              ...i,
              status: 'selesai',
              statusLabel: 'Selesai / Dikembalikan',
            }
          : i
      )
    );
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
            onNavigate={handleNavigate}
            onSubmitClaim={handleClaimSubmit}
          />
        )}

        {currentView === 'report-lost' && (
          <ReportLostView
            onNavigate={handleNavigate}
            onOpenClaim={handleOpenClaim}
            foundItems={foundItems}
            onSubmitReport={handleAddLostReport}
          />
        )}

        {currentView === 'report-found' && (
          <ReportFoundView
            onNavigate={handleNavigate}
            onItemAdded={handleAddItem}
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
          <ProfileView onNavigate={handleNavigate} />
        )}

        {currentView === 'auth' && (
          <AuthView
            onNavigate={handleNavigate}
            onLoginSuccess={(role) => {
              setActiveRole(role);
            }}
          />
        )}

        {currentView === 'coordinator' && (
          <CoordinatorDashboardView
            foundItems={foundItems}
            onNavigate={handleNavigate}
            onApproveClaim={handleApproveClaim}
          />
        )}

        {currentView === 'side-by-side' && (
          <SideBySideView
            item={currentItem}
            onNavigate={handleNavigate}
            onApprove={handleApproveClaim}
          />
        )}

        {currentView === 'bast' && (
          <BastHandoverView
            item={currentItem}
            onNavigate={handleNavigate}
            onCompleteHandover={handleCompleteHandover}
          />
        )}

        {currentView === 'admin' && (
          <AdminAnalyticsView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
