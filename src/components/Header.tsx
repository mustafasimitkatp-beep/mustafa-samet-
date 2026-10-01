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

          {/* User Account / Profile Badge */}
          <div className="flex items-center gap-2 p-1 pl-1.5 bg-slate-100 hover:bg-slate-100/90 rounded-full border border-slate-200">
            <div className="relative">
              <img
                src="/profile.jpg"
                alt={currentUser?.displayName || 'Profil'}
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white shadow-2xs"
              />
              <span
                className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  currentUser ? 'bg-emerald-500' : 'bg-blue-500'
                }`}
                title={currentUser ? 'Hesaba Bağlı' : 'Yerel Profil'}
              />
            </div>
            <span className="text-xs font-bold text-slate-800 max-w-[110px] truncate hidden sm:inline">
              {currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Kullanıcı'}
            </span>
            {currentUser ? (
              <button
                onClick={onLogout}
                className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded-full"
                title="Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-full shadow-2xs transition-all whitespace-nowrap"
                title="Google hesabı ile senkronize et"
              >
                <LogIn className="w-3 h-3 text-blue-600" />
                <span className="hidden sm:inline">Giriş</span>
              </button>
            )}
          </div>

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
