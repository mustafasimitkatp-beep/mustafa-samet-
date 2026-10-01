import React from 'react';
import { WeekPlan } from '../types/curriculum';
import { Sparkles, CheckCircle2, Search, Calendar, Folder } from 'lucide-react';
import { GoogleDriveIcon } from './GoogleDriveIcon';

interface StatsBannerProps {
  weeks: WeekPlan[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  onOpenDriveModal: () => void;
  currentPhaseFilter: number | 'all';
  onSelectPhase: (phaseId: number | 'all') => void;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({
  weeks,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  onOpenDriveModal,
  currentPhaseFilter,
  onSelectPhase,
}) => {
  const completedWeeks = weeks.filter((w) => w.status === 'completed').length;
  const inProgressWeeks = weeks.filter((w) => w.status === 'in_progress').length;

  const totalInnovations = weeks.reduce((sum, w) => sum + w.innovations.length, 0);
  const completedInnovations = weeks.reduce(
    (sum, w) => sum + w.innovations.filter((i) => i.isCompleted).length,
    0
  );

  const totalDriveAttachments = weeks.reduce(
    (sum, w) =>
      sum +
      (w.driveUrl ? 1 : 0) +
      w.driveLinks.length +
      w.innovations.filter((i) => i.driveUrl).length,
    0
  );

  const averageProgress = Math.round(
    weeks.reduce((sum, w) => sum + w.progress, 0) / (weeks.length || 1)
  );

  return (
    <div className="space-y-4">
      {/* Metrics Row (Anti-slop: clean structured layout, tabular numbers) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Metric 1 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            30 Haftalık Takvim
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {completedWeeks}
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">/ 30 Hafta</span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            {inProgressWeeks > 0 ? `${inProgressWeeks} hafta devam ediyor` : 'Proje başlangıç aşamasında'}
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Kayıtlı Yenilikler</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {totalInnovations}
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              ({completedInnovations} tamamlandı)
            </span>
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Her hafta yeni eklemeler yapılıyor
          </div>
        </div>

        {/* Metric 3 */}
        <div
          onClick={onOpenDriveModal}
          className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs cursor-pointer hover:border-blue-300 hover:bg-blue-50/20 transition-all group"
        >
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <GoogleDriveIcon className="w-3.5 h-3.5" />
            <span>Google Drive Bağlantıları</span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-blue-600 group-hover:text-blue-700">
              {totalDriveAttachments}
            </span>
            <span className="text-xs text-slate-400 font-mono tabular-nums">dosya & döküman</span>
          </div>
          <div className="mt-1 text-xs text-blue-600 group-hover:underline">
            Drive Merkezini Aç &rarr;
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Genel İlerleme
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              %{averageProgress}
            </span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${averageProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-white border border-slate-200/80 rounded-xl shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Hafta adı, yenilik veya anahtar kelime ara..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Phase Filter (especially on mobile / tablet) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap mr-1">
            Faz:
          </span>
          {(['all', 1, 2, 3, 4, 5] as const).map((phase) => (
            <button
              key={phase}
              onClick={() => onSelectPhase(phase)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                currentPhaseFilter === phase
                  ? 'bg-indigo-600 text-white shadow-2xs font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {phase === 'all' ? 'Tümü' : `Faz ${phase}`}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-100 pt-2 md:pt-0 md:pl-3">
          <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
            Durum:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="completed">Tamamlananlar</option>
            <option value="in_progress">Devam Edenler</option>
            <option value="pending">Planlananlar</option>
          </select>
        </div>
      </div>
    </div>
  );
};
