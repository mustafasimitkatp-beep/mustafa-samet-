import React from 'react';
import { WeekPlan } from '../types/curriculum';
import { GoogleDriveIcon } from './GoogleDriveIcon';
import { ExternalLink, Plus, MoreHorizontal, Edit3 } from 'lucide-react';

interface TimelineViewProps {
  weeks: WeekPlan[];
  onOpenDriveModal: (week: WeekPlan) => void;
  onOpenDetail: (week: WeekPlan) => void;
  onQuickAddInnovation: (weekNumber: number) => void;
  onToggleTask: (weekNumber: number, taskId: string) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  weeks,
  onOpenDriveModal,
  onOpenDetail,
  onQuickAddInnovation,
}) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 w-20 text-center font-mono">Hafta</th>
              <th className="py-3 px-4 min-w-[200px]">Faz</th>
              <th className="py-3 px-4 min-w-[260px]">Google Drive Bağlantısı</th>
              <th className="py-3 px-4 min-w-[180px]">Yenilikler</th>
              <th className="py-3 px-4 w-28 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {weeks.map((week) => {
              const hasDrive = Boolean(week.driveUrl && week.driveUrl.trim());

              return (
                <tr
                  key={week.weekNumber}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  {/* Week Number */}
                  <td className="py-3.5 px-4 text-center font-mono tabular-nums font-bold text-slate-900">
                    Hafta {week.weekNumber}
                  </td>

                  {/* Phase */}
                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {week.phaseName}
                  </td>

                  {/* Google Drive Button on Every Row */}
                  <td className="py-3.5 px-4">
                    {hasDrive ? (
                      <div className="flex items-center gap-2">
                        <a
                          href={week.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                        >
                          <GoogleDriveIcon className="w-3.5 h-3.5" />
                          <span className="truncate max-w-[160px]">
                            {week.driveTitle || "Drive'da Aç"}
                          </span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                        <button
                          onClick={() => onOpenDriveModal(week)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Drive Linkini Değiştir"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => onOpenDriveModal(week)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors"
                      >
                        <GoogleDriveIcon className="w-3.5 h-3.5" />
                        <span>Google Drive Linki Ekle</span>
                      </button>
                    )}
                  </td>

                  {/* Innovations */}
                  <td className="py-3.5 px-4 text-slate-600">
                    {week.innovations.length > 0 ? (
                      <span className="font-medium text-slate-800">
                        {week.innovations.length} yenilik eklendi
                      </span>
                    ) : (
                      <button
                        onClick={() => onQuickAddInnovation(week.weekNumber)}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Yenilik Ekle</span>
                      </button>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onOpenDetail(week)}
                      className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                    >
                      Detay
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
