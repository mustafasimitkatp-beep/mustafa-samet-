import React, { useState, useEffect } from 'react';
import { WeekPlan } from '../types/curriculum';
import { GoogleDriveIcon } from './GoogleDriveIcon';
import { ExternalLink, X, Save, Trash2, Check, Sparkles, FileText, ArrowRight } from 'lucide-react';

interface WeekDriveModalProps {
  week: WeekPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveDriveLink: (weekNumber: number, url: string, title?: string) => void;
  onRemoveDriveLink: (weekNumber: number) => void;
}

export const WeekDriveModal: React.FC<WeekDriveModalProps> = ({
  week,
  isOpen,
  onClose,
  onSaveDriveLink,
  onRemoveDriveLink,
}) => {
  if (!isOpen || !week) return null;

  const [inputUrl, setInputUrl] = useState(week.driveUrl || '');
  const [inputTitle, setInputTitle] = useState(week.driveTitle || '');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setInputUrl(week.driveUrl || '');
    setInputTitle(week.driveTitle || '');
    setIsSaved(false);
  }, [week]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    onSaveDriveLink(
      week.weekNumber,
      inputUrl.trim(),
      inputTitle.trim() || `Hafta ${week.weekNumber} Ödevi`
    );
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleRemove = () => {
    onRemoveDriveLink(week.weekNumber);
    setInputUrl('');
    setInputTitle('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-7 text-slate-800">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
              <GoogleDriveIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                Hafta {week.weekNumber}
              </div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Google Drive Linki Ekle
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Existing Link Banner if available */}
        {week.driveUrl && (
          <div className="mt-5 p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Kayıtlı Drive Linki Bulunuyor</span>
              </div>
              <div className="text-xs text-emerald-700 truncate mt-0.5">
                {week.driveTitle || 'Haftalık Ödev Dosyası'}
              </div>
            </div>
            <a
              href={week.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <span>Drive'da Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Quick Launch Google Drive */}
        <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2">
          <div className="text-xs text-slate-600">
            Link kopyalamak için önce Google Drive'ı açmak ister misiniz?
          </div>
          <a
            href="https://drive.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-700 hover:text-blue-900 bg-white border border-slate-200 hover:border-blue-300 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
          >
            <GoogleDriveIcon className="w-3.5 h-3.5" />
            <span>Drive'a Git</span>
            <ExternalLink className="w-3 h-3 ml-0.5" />
          </a>
        </div>

        {/* Form to paste/save the link */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Drive Linki (URL) *
            </label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/... veya https://docs.google.com/..."
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400 font-mono"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Google Drive klasörü, Docs raporu, Sheets tablosu veya Slides sunum linkini buraya yapıştırın.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Dosya / Ödev Adı (Opsiyonel)
            </label>
            <input
              type="text"
              placeholder={`Örn: Hafta ${week.weekNumber} Ödev Raporu`}
              value={inputTitle}
              onChange={(e) => setInputTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Quick Google Workspace Creator Links */}
          <div className="pt-2">
            <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Yeni Bir Belge Oluşturup Linkini Ekleyin:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <a
                href="https://docs.new"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-blue-50/50 border border-slate-200 hover:border-blue-200 rounded-lg text-center transition-all group"
              >
                <div className="text-[11px] font-bold text-blue-700 group-hover:underline">
                  Google Docs
                </div>
                <div className="text-[10px] text-slate-400">Yeni Metin</div>
              </a>
              <a
                href="https://sheets.new"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-200 rounded-lg text-center transition-all group"
              >
                <div className="text-[11px] font-bold text-emerald-700 group-hover:underline">
                  Google Sheets
                </div>
                <div className="text-[10px] text-slate-400">Yeni Tablo</div>
              </a>
              <a
                href="https://slides.new"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 hover:bg-amber-50/50 border border-slate-200 hover:border-amber-200 rounded-lg text-center transition-all group"
              >
                <div className="text-[11px] font-bold text-amber-700 group-hover:underline">
                  Google Slides
                </div>
                <div className="text-[10px] text-slate-400">Yeni Sunum</div>
              </a>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {week.driveUrl ? (
              <button
                type="button"
                onClick={handleRemove}
                className="px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Linki Kaldır</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                <span>{isSaved ? 'Kaydedildi!' : 'Drive Linkini Kaydet'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
