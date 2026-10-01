import React from 'react';
import { WeekPlan } from '../types/curriculum';
import { GoogleDriveIcon } from './GoogleDriveIcon';
import { ExternalLink, Plus, Sparkles, CheckCircle2, Circle, Edit3, MoreHorizontal } from 'lucide-react';

interface WeekCardProps {
  week: WeekPlan;
  onOpenDriveModal: (week: WeekPlan) => void;
  onOpenDetail: (week: WeekPlan) => void;
  onQuickAddInnovation: (weekNumber: number) => void;
  onToggleTask: (weekNumber: number, taskId: string) => void;
}

export const WeekCard: React.FC<WeekCardProps> = ({
  week,
  onOpenDriveModal,
  onOpenDetail,
  onQuickAddInnovation,
  onToggleTask,
}) => {
  const hasDriveLink = Boolean(week.driveUrl && week.driveUrl.trim());

  return (
    <div className="bg-white border border-slate-200 hover:border-slate-300 rounded-xl p-5 shadow-2xs hover:shadow-sm transition-all duration-150 flex flex-col justify-between group">
      <div>
        {/* Top Header of the Week Box */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-base font-extrabold tracking-tight text-slate-900 font-mono tabular-nums">
              Hafta {week.weekNumber}
            </span>
            <span className="text-[11px] text-slate-400 font-medium">
              · {week.phaseName}
            </span>
          </div>

          <button
            onClick={() => onOpenDetail(week)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Hafta Detayları ve Notları"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Custom Title if user set one */}
        {week.title && week.title !== `Hafta ${week.weekNumber}` && (
          <div className="text-xs font-semibold text-slate-700 mb-3 truncate">
            {week.title}
          </div>
        )}

        {/* PRIMARY GOOGLE DRIVE BUTTON (Dedicated on EVERY week box) */}
        <div className="mb-4">
          {hasDriveLink ? (
            <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <GoogleDriveIcon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold text-blue-950 truncate">
                    {week.driveTitle || 'Drive Dosyası'}
                  </span>
                </div>
                <button
                  onClick={() => onOpenDriveModal(week)}
                  className="p-1 text-slate-400 hover:text-blue-700 hover:bg-white rounded transition-colors shrink-0"
                  title="Drive Linkini Değiştir"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <a
                href={week.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors"
              >
                <span>Drive'da Aç</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <button
              onClick={() => onOpenDriveModal(week)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:text-blue-800 bg-slate-50 hover:bg-blue-50/50 border border-dashed border-slate-300 hover:border-blue-400 rounded-xl transition-all group/btn"
            >
              <GoogleDriveIcon className="w-4 h-4 group-hover/btn:scale-105 transition-transform" />
              <span>Google Drive Linki Ekle</span>
            </button>
          )}
        </div>

        {/* User Added Innovations (if any added) */}
        {week.innovations && week.innovations.length > 0 && (
          <div className="mb-3 space-y-1.5 pt-2 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Eklenen Yenilikler ({week.innovations.length}):
            </div>
            {week.innovations.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between text-xs py-1 px-1.5 rounded hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <button
                    onClick={() => onToggleTask(week.weekNumber, inv.id)}
                    className="shrink-0 text-slate-300 hover:text-emerald-600"
                  >
                    {inv.isCompleted ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Circle className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <span
                    className={`truncate text-xs ${
                      inv.isCompleted ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {inv.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions Footer */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={() => onQuickAddInnovation(week.weekNumber)}
          className="text-xs font-medium text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Yenilik Ekle</span>
        </button>

        <button
          onClick={() => onOpenDetail(week)}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Not & Detay
        </button>
      </div>
    </div>
  );
};
