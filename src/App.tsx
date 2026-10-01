import React, { useState, useEffect, useRef, useCallback } from 'react';
import { WeekPlan, InnovationItem, ProjectSettings } from './types/curriculum';
import { INITIAL_WEEKS, INITIAL_SETTINGS, PHASES } from './data/defaultWeeks';
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { WeekCard } from './components/WeekCard';
import { TimelineView } from './components/TimelineView';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { WeekDriveModal } from './components/WeekDriveModal';
import { AddInnovationModal } from './components/AddInnovationModal';
import { WeekDetailModal } from './components/WeekDetailModal';
import { GoogleDriveIcon } from './components/GoogleDriveIcon';
import {
  auth,
  loginWithGoogle,
  logoutUser,
  subscribeToAuth,
  saveCentralScheduleToCloud,
  subscribeToCentralSchedule,
  testFirestoreConnection,
} from './lib/firebase';
import { User } from 'firebase/auth';
import {
  Sparkles,
  Plus,
  RefreshCw,
  Download,
  Calendar,
  Layers,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  Smartphone,
  Cloud,
  Check,
} from 'lucide-react';

const STORAGE_KEY_WEEKS = 'curriculum_30_weeks_v2';
const STORAGE_KEY_SETTINGS = 'curriculum_30_settings_v2';

export default function App() {
  // Authentication & Cloud Sync States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState<'connecting' | 'synced' | 'offline'>('connecting');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Flag to ensure we NEVER overwrite cloud data before first snapshot load
  const hasLoadedFromCloud = useRef(false);

  // Load initial fallback from localStorage or clean defaults
  const [weeks, setWeeks] = useState<WeekPlan[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WEEKS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load weeks from localStorage', e);
    }
    return INITIAL_WEEKS;
  });

  const [settings, setSettings] = useState<ProjectSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load settings from localStorage', e);
    }
    return INITIAL_SETTINGS;
  });

  // UI state
  const [activeView, setActiveView] = useState<'grid' | 'timeline'>('grid');
  const [currentPhaseFilter, setCurrentPhaseFilter] = useState<number | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isDriveHubOpen, setIsDriveHubOpen] = useState(false);
  const [selectedWeekForDrive, setSelectedWeekForDrive] = useState<WeekPlan | null>(null);
  const [isAddInnovationOpen, setIsAddInnovationOpen] = useState(false);
  const [targetWeekForAdd, setTargetWeekForAdd] = useState<number>(1);
  const [selectedWeekDetail, setSelectedWeekDetail] = useState<WeekPlan | null>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Connection check & Auth listener
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = subscribeToAuth((user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // 2. CENTRAL REAL-TIME FIRESTORE SYNC:
  // Every phone, tablet, and browser listens to the live Firestore document
  useEffect(() => {
    setCloudStatus('connecting');

    const unsubscribe = subscribeToCentralSchedule(
      (cloudData) => {
        if (cloudData && cloudData.weeks && cloudData.weeks.length > 0) {
          // Received latest live data from Cloud Firestore!
          setWeeks(cloudData.weeks);
          try {
            localStorage.setItem(STORAGE_KEY_WEEKS, JSON.stringify(cloudData.weeks));
          } catch {
            // ignore
          }

          if (cloudData.settings?.googleDriveFolderUrl) {
            setSettings((prev) => ({
              ...prev,
              googleDriveFolderUrl: cloudData.settings?.googleDriveFolderUrl || prev.googleDriveFolderUrl,
            }));
          }
          setCloudStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } else {
          // If no document exists in Firestore yet, seed it with current local state
          saveCentralScheduleToCloud(weeks, settings, currentUser)
            .then(() => {
              setCloudStatus('synced');
            })
            .catch(() => {
              setCloudStatus('offline');
            });
        }
        hasLoadedFromCloud.current = true;
      },
      (err) => {
        console.warn('Real-time sync subscription error, using local data:', err);
        setCloudStatus('offline');
        hasLoadedFromCloud.current = true;
      }
    );

    return () => unsubscribe();
  }, []);

  // Helper to persist updates to BOTH local state and Cloud Firestore
  const persistChanges = useCallback(
    async (updatedWeeks: WeekPlan[], updatedSettings = settings) => {
      setWeeks(updatedWeeks);
      try {
        localStorage.setItem(STORAGE_KEY_WEEKS, JSON.stringify(updatedWeeks));
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(updatedSettings));
      } catch (e) {
        console.error('Local storage save error', e);
      }

      // Immediately write to Firestore so all phones and browsers update instantly!
      setIsSyncing(true);
      try {
        await saveCentralScheduleToCloud(updatedWeeks, updatedSettings, currentUser);
        setCloudStatus('synced');
        setLastSyncTime(new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      } catch (err) {
        console.error('Failed to save to cloud Firestore:', err);
        setCloudStatus('offline');
      } finally {
        setTimeout(() => setIsSyncing(false), 300);
      }
    },
    [settings, currentUser]
  );

  // Login handler
  const handleLogin = async () => {
    try {
      const user = await loginWithGoogle();
      if (user) {
        showToast('Google hesabınız bağlandı! Linkleriniz tüm cihazlarınızda eşzamanlı.');
        // Push current data under user ownership as well
        await saveCentralScheduleToCloud(weeks, settings, user);
      }
    } catch (error) {
      console.error('Login error:', error);
      showToast('Giriş penceresi kapatıldı veya izin verilmedi.');
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('Çıkış yapıldı.');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Handler to save Google Drive link on a specific week
  const handleSaveDriveLink = (weekNumber: number, url: string, title?: string) => {
    const updated = weeks.map((w) => {
      if (w.weekNumber !== weekNumber) return w;
      return {
        ...w,
        driveUrl: url,
        driveTitle: title || `Hafta ${weekNumber} Dosyası`,
        status: w.status === 'pending' ? 'in_progress' : w.status,
      };
    });

    persistChanges(updated);
    showToast(`Hafta ${weekNumber} Drive linki kaydedildi ve tüm cihazlara eşitlendi!`);
  };

  // Handler to remove Google Drive link from a specific week
  const handleRemoveDriveLink = (weekNumber: number) => {
    const updated = weeks.map((w) => {
      if (w.weekNumber !== weekNumber) return w;
      return {
        ...w,
        driveUrl: '',
        driveTitle: '',
      };
    });

    persistChanges(updated);
    showToast(`Hafta ${weekNumber} Drive linki kaldırıldı.`);
  };

  // Handler to update a single week
  const handleUpdateWeek = (updatedWeek: WeekPlan) => {
    const updated = weeks.map((w) => (w.weekNumber === updatedWeek.weekNumber ? updatedWeek : w));
    persistChanges(updated);
    if (selectedWeekDetail?.weekNumber === updatedWeek.weekNumber) {
      setSelectedWeekDetail(updatedWeek);
    }
    showToast(`Hafta ${updatedWeek.weekNumber} güncellendi.`);
  };

  // Handler to toggle an innovation task
  const handleToggleTask = (weekNumber: number, taskId: string) => {
    const updated = weeks.map((w) => {
      if (w.weekNumber !== weekNumber) return w;
      const updatedInnovations = w.innovations.map((inv) =>
        inv.id === taskId ? { ...inv, isCompleted: !inv.isCompleted } : inv
      );
      const completed = updatedInnovations.filter((i) => i.isCompleted).length;
      const progress = Math.round((completed / (updatedInnovations.length || 1)) * 100);
      const status =
        progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : w.status;

      return {
        ...w,
        innovations: updatedInnovations,
        progress,
        status,
      };
    });

    persistChanges(updated);
  };

  // Handler to add a new innovation
  const handleAddInnovation = (
    weekNumber: number,
    innovationData: Omit<InnovationItem, 'id' | 'createdAt'>
  ) => {
    const newItem: InnovationItem = {
      ...innovationData,
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = weeks.map((w) => {
      if (w.weekNumber !== weekNumber) return w;
      const updatedInnovations = [...w.innovations, newItem];
      const completed = updatedInnovations.filter((i) => i.isCompleted).length;
      const progress = Math.round((completed / updatedInnovations.length) * 100);
      return {
        ...w,
        innovations: updatedInnovations,
        progress,
        status: w.status === 'pending' ? 'in_progress' : w.status,
      };
    });

    persistChanges(updated);
    showToast(`Hafta ${weekNumber} için yeni yenilik eklendi ve buluta kaydedildi!`);
  };

  // Quick open add modal for specific week
  const handleQuickAddInnovation = (weekNumber: number) => {
    setTargetWeekForAdd(weekNumber);
    setIsAddInnovationOpen(true);
  };

  // Reset to clean 30 weeks
  const handleResetData = () => {
    if (
      window.confirm(
        'Tüm 30 haftalık programı sıfırlamak istediğinize emin misiniz? Yapılan tüm eklemeler silinecektir.'
      )
    ) {
      persistChanges(INITIAL_WEEKS, INITIAL_SETTINGS);
      showToast('Program temizlendi.');
    }
  };

  // Export full JSON backup
  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ settings, weeks }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `30_Haftalik_Odev_Programi_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Ödev yedeği JSON formatında indirildi.');
  };

  // Filtered weeks
  const filteredWeeks = weeks.filter((w) => {
    if (currentPhaseFilter !== 'all' && w.phaseId !== currentPhaseFilter) {
      return false;
    }
    if (statusFilter !== 'all' && w.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchDrive =
        w.driveTitle?.toLowerCase().includes(q) || w.driveUrl?.toLowerCase().includes(q);
      const matchInnovations = w.innovations.some(
        (i) => i.title.toLowerCase().includes(q) || i.description?.toLowerCase().includes(q)
      );
      if (!matchTitle && !matchDrive && !matchInnovations) {
        return false;
      }
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50/75 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Bar Header with Google Account Login */}
      <Header
        onOpenDriveModal={() => setIsDriveHubOpen(true)}
        onOpenAddInnovation={() => {
          setTargetWeekForAdd(1);
          setIsAddInnovationOpen(true);
        }}
        activeView={activeView}
        onToggleView={setActiveView}
        currentPhaseFilter={currentPhaseFilter}
        onSelectPhase={setCurrentPhaseFilter}
        currentUser={currentUser}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isSyncing={isSyncing}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Real-time Multi-Device Sync Notification Bar */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <span>Cihazlar Arası Canlı Bulut Senkronizasyonu Aktif</span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Canlı Bağlı
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Telefonunuzdan, tabletinizden veya başka bir tarayıcıdan bu adrese girdiğinizde tüm Google Drive linkleriniz anında otomatik görünür.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {lastSyncTime && (
              <span className="text-[11px] text-slate-400 font-mono tabular-nums hidden md:inline">
                Son eşitleme: {lastSyncTime}
              </span>
            )}
            {!currentUser && (
              <button
                onClick={handleLogin}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Hesapla Eşle</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Banner with Google Drive and Account Status */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/10 text-blue-200 text-xs font-medium backdrop-blur-xs mb-2.5 border border-white/10">
              <Calendar className="w-3.5 h-3.5" />
              <span>30 Haftalık Ödev & İnovasyon Takvimi</span>
              {currentUser && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {currentUser.email}
                  </span>
                </>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Her Hafta İçin Google Drive Linkleri ve Yenilikler
            </h1>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Her haftanın kutucuğundaki butona basarak Google Drive ödev linklerinizi kaydedebilirsiniz. Eklediğiniz linkler buluta anında kaydedilir ve başka bir telefondan veya tarayıcıdan girdiğinizde otomatik olarak karşınızda olur.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              onClick={() => setIsDriveHubOpen(true)}
              className="px-4 py-2.5 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-xl shadow-xs transition-all flex items-center gap-2"
            >
              <GoogleDriveIcon className="w-4 h-4" />
              <span>Drive Klasör Merkezi</span>
            </button>
          </div>
        </div>

        {/* Stats & Filters Banner */}
        <StatsBanner
          weeks={weeks}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          onOpenDriveModal={() => setIsDriveHubOpen(true)}
          currentPhaseFilter={currentPhaseFilter}
          onSelectPhase={setCurrentPhaseFilter}
        />

        {/* Phase Title and Quick Actions */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">
              {currentPhaseFilter === 'all'
                ? 'Tüm 30 Hafta'
                : PHASES.find((p) => p.id === currentPhaseFilter)?.name || `Faz ${currentPhaseFilter}`}
            </h2>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({filteredWeeks.length} hafta listeleniyor)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="p-1.5 text-xs text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              title="JSON Yedek İndir"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yedekle</span>
            </button>
            <button
              onClick={handleResetData}
              className="p-1.5 text-xs text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Kutuları Temizle / Sıfırla"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 30 Week Cards Display */}
        {filteredWeeks.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Eşleşen hafta bulunamadı</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Arama kriterini temizleyerek tüm 30 haftayı görüntüleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
                setCurrentPhaseFilter('all');
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : activeView === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredWeeks.map((week) => (
              <WeekCard
                key={week.weekNumber}
                week={week}
                onOpenDriveModal={(w) => setSelectedWeekForDrive(w)}
                onOpenDetail={(w) => setSelectedWeekDetail(w)}
                onQuickAddInnovation={handleQuickAddInnovation}
                onToggleTask={handleToggleTask}
              />
            ))}
          </div>
        ) : (
          <TimelineView
            weeks={filteredWeeks}
            onOpenDriveModal={(w) => setSelectedWeekForDrive(w)}
            onOpenDetail={(w) => setSelectedWeekDetail(w)}
            onQuickAddInnovation={handleQuickAddInnovation}
            onToggleTask={handleToggleTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">30 Haftalık Ödev Programı</span>
            <span aria-hidden="true">·</span>
            <span>Google Drive & Firebase Bulut Senkronizasyonu</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDriveHubOpen(true)}
              className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
            >
              <GoogleDriveIcon className="w-3.5 h-3.5" />
              <span>Drive Klasör Merkezi</span>
            </button>
            <button onClick={handleExportJSON} className="hover:text-slate-800 transition-colors">
              Yedekleme (.json)
            </button>
          </div>
        </div>
      </footer>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Week-specific Google Drive Link Modal (Pops up when clicking any week's Drive button) */}
      <WeekDriveModal
        week={selectedWeekForDrive}
        isOpen={Boolean(selectedWeekForDrive)}
        onClose={() => setSelectedWeekForDrive(null)}
        onSaveDriveLink={handleSaveDriveLink}
        onRemoveDriveLink={handleRemoveDriveLink}
      />

      {/* Global Google Drive Hub Modal */}
      <GoogleDriveModal
        isOpen={isDriveHubOpen}
        onClose={() => setIsDriveHubOpen(false)}
        driveFolderUrl={settings.googleDriveFolderUrl}
        onUpdateDriveFolderUrl={(url) => {
          const updated = { ...settings, googleDriveFolderUrl: url };
          setSettings(updated);
          persistChanges(weeks, updated);
        }}
        weeks={weeks}
      />

      {/* Add Innovation Modal */}
      <AddInnovationModal
        isOpen={isAddInnovationOpen}
        onClose={() => setIsAddInnovationOpen(false)}
        defaultWeek={targetWeekForAdd}
        onAddInnovation={handleAddInnovation}
      />

      {/* Week Detail Modal */}
      <WeekDetailModal
        week={selectedWeekDetail}
        isOpen={Boolean(selectedWeekDetail)}
        onClose={() => setSelectedWeekDetail(null)}
        onUpdateWeek={handleUpdateWeek}
      />
    </div>
  );
}
