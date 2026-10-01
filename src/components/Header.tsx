import React from 'react';
import { GoogleDriveIcon } from './GoogleDriveIcon';
import { Plus, LayoutGrid, List, LogIn, LogOut, Cloud, Check } from 'lucide-react';
import { User } from 'firebase/auth';

interface HeaderProps {
  onOpenDriveModal: () => void;
  onOpenAddInnovation: () => void;
  activeView: 'grid' | 'timeline';
  onToggleView: (view: 'grid' | 'timeline') => void;
  currentPhaseFilter: number | 'all';
  onSelectPhase: (phaseId: number | 'all') => void;
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  isSyncing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDriveModal,
  onOpenAddInnovation,
  activeView,
  onToggleView,
  currentPhaseFilter,
  onSelectPhase,
  currentUser,
  onLogin,
  onLogout,
  isSyncing,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            30
          </div>
          <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
            30 Haftalık Ödev & Drive
          </span>
        </div>

        {/* Zone 2: Navigation / Phase Switcher */}
        <nav className="hidden xl:flex items-center gap-1 p-1 bg-slate-100 rounded-lg text-xs font-medium">
          <button
            onClick={() => onSelectPhase('all')}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPhaseFilter === 'all'
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm 30 Hafta
          </button>
          <button
            onClick={() => onSelectPhase(1)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPhaseFilter === 1
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faz 1
          </button>
          <button
            onClick={() => onSelectPhase(2)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPhaseFilter === 2
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faz 2
          </button>
          <button
            onClick={() => onSelectPhase(3)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPhaseFilter === 3
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faz 3
          </button>
          <button
            onClick={() => onSelectPhase(4)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPhaseFilter === 4
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faz 4
          </button>
          <button
            onClick={() => onSelectPhase(5)}
            className={`px-3 py-1.5 rounded-md transition-colors ${
              currentPhaseFilter === 5
                ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Faz 5
          </button>
        </nav>

        {/* Zone 3: Actions (Google Account + Google Drive Button + View Toggle) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Cloud Sync State */}
          {currentUser && (
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200/80 text-[11px] text-emerald-800 font-medium"
              title="Drive linkleriniz hesabınıza kaydedildi"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isSyncing ? 'Kaydediliyor...' : 'Hesaba Kayıtlı'}</span>
            </div>
          )}

          {/* User Account Button: Google Login / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
              {currentUser.photoURL ? (
                <img
                  src={currentUser.photoURL}
                  alt={currentUser.displayName || 'Kullanıcı'}
                  className="w-6 h-6 rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  {(currentUser.displayName || currentUser.email || 'U')[0].toUpperCase()}
                </div>
              )}
              <span className="text-xs font-semibold text-slate-800 max-w-[100px] truncate hidden sm:inline pl-1">
                {currentUser.displayName || currentUser.email?.split('@')[0]}
              </span>
              <button
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs transition-all whitespace-nowrap"
              title="Linklerinizin kaybolmaması için Google hesabınızla giriş yapın"
            >
              {/* Google G icon */}
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Hesabı Kaydet</span>
            </button>
          )}

          {/* Google Drive Hub Button */}
          <button
            onClick={onOpenDriveModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-2xs hover:shadow-xs transition-all whitespace-nowrap"
          >
            <GoogleDriveIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Google Drive</span>
          </button>

          {/* View toggle */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => onToggleView('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                activeView === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Kart Görünümü"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleView('timeline')}
              className={`p-1.5 rounded-md transition-colors ${
                activeView === 'timeline'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Zaman Çizelgesi Listesi"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
