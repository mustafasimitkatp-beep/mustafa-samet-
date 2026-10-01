import React, { useState } from 'react';
import { WeekPlan, InnovationItem, WeekStatus, InnovationCategory, DriveAttachment } from '../types/curriculum';
import {
  X,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  ExternalLink,
  Sparkles,
  FileText,
  Save,
  Clock,
  Check,
  Calendar,
} from 'lucide-react';
import { GoogleDriveIcon } from './GoogleDriveIcon';

interface WeekDetailModalProps {
  week: WeekPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateWeek: (updatedWeek: WeekPlan) => void;
}

const CATEGORIES: InnovationCategory[] = [
  'İnovasyon',
  'Kodlama & Geliştirme',
  'Araştırma',
  'Tasarım & UI',
  'Analiz & Veri',
  'Test & İyileştirme',
  'Dokümantasyon',
];

export const WeekDetailModal: React.FC<WeekDetailModalProps> = ({
  week,
  isOpen,
  onClose,
  onUpdateWeek,
}) => {
  if (!isOpen || !week) return null;

  const [title, setTitle] = useState(week.title);
  const [subtitle, setSubtitle] = useState(week.subtitle);
  const [status, setStatus] = useState<WeekStatus>(week.status);
  const [notes, setNotes] = useState(week.notes);
  const [innovations, setInnovations] = useState<InnovationItem[]>(week.innovations);
  const [driveLinks, setDriveLinks] = useState<DriveAttachment[]>(week.driveLinks);

  // New innovation inline form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<InnovationCategory>('İnovasyon');
  const [newDriveUrl, setNewDriveUrl] = useState('');

  // New Drive link form state
  const [showAddDriveLink, setShowAddDriveLink] = useState(false);
  const [driveDocTitle, setDriveDocTitle] = useState('');
  const [driveDocUrl, setDriveDocUrl] = useState('');
  const [driveDocType, setDriveDocType] = useState<DriveAttachment['type']>('document');

  // Recalculate progress helper
  const calculateProgress = (items: InnovationItem[], currentStatus: WeekStatus): number => {
    if (items.length === 0) {
      return currentStatus === 'completed' ? 100 : currentStatus === 'in_progress' ? 50 : 0;
    }
    const completed = items.filter((i) => i.isCompleted).length;
    return Math.round((completed / items.length) * 100);
  };

  const handleToggleTask = (id: string) => {
    const updated = innovations.map((item) =>
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setInnovations(updated);
    const progress = calculateProgress(updated, status);
    const newStatus: WeekStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : status;
    setStatus(newStatus);
    onUpdateWeek({
      ...week,
      innovations: updated,
      progress,
      status: newStatus,
    });
  };

  const handleDeleteTask = (id: string) => {
    const updated = innovations.filter((item) => item.id !== id);
    setInnovations(updated);
    const progress = calculateProgress(updated, status);
    onUpdateWeek({
      ...week,
      innovations: updated,
      progress,
    });
  };

  const handleAddInlineInnovation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: InnovationItem = {
      id: `inv-${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      isCompleted: false,
      driveUrl: newDriveUrl.trim() || undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };

    const updated = [...innovations, newItem];
    setInnovations(updated);
    const progress = calculateProgress(updated, status);

    onUpdateWeek({
      ...week,
      innovations: updated,
      progress,
    });

    setNewTitle('');
    setNewDesc('');
    setNewDriveUrl('');
    setShowAddForm(false);
  };

  const handleAddDriveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driveDocTitle.trim() || !driveDocUrl.trim()) return;

    const newLink: DriveAttachment = {
      id: `drive-${Date.now()}`,
      title: driveDocTitle.trim(),
      url: driveDocUrl.trim(),
      type: driveDocType,
      weekNumber: week.weekNumber,
    };

    const updatedLinks = [...driveLinks, newLink];
    setDriveLinks(updatedLinks);

    onUpdateWeek({
      ...week,
      driveLinks: updatedLinks,
    });

    setDriveDocTitle('');
    setDriveDocUrl('');
    setShowAddDriveLink(false);
  };

  const handleDeleteDriveLink = (id: string) => {
    const updatedLinks = driveLinks.filter((l) => l.id !== id);
    setDriveLinks(updatedLinks);
    onUpdateWeek({
      ...week,
      driveLinks: updatedLinks,
    });
  };

  const handleSaveAll = () => {
    const progress = calculateProgress(innovations, status);
    onUpdateWeek({
      ...week,
      title,
      subtitle,
      status,
      notes,
      innovations,
      driveLinks,
      progress,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800">
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>{week.phaseName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums font-semibold text-slate-700">
                Hafta {week.weekNumber} / 30
              </span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
              Hafta {week.weekNumber}: {week.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Progress Bar */}
        <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Durum:
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setStatus('pending')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  status === 'pending'
                    ? 'bg-slate-200 text-slate-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bekliyor
              </button>
              <button
                type="button"
                onClick={() => setStatus('in_progress')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  status === 'in_progress'
                    ? 'bg-amber-100 text-amber-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Devam Ediyor
              </button>
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  status === 'completed'
                    ? 'bg-emerald-100 text-emerald-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tamamlandı
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 min-w-[200px]">
            <div className="flex-1 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  week.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'
                }`}
                style={{ width: `${week.progress}%` }}
              />
            </div>
            <span className="text-xs font-mono tabular-nums font-bold text-slate-700">
              %{week.progress}
            </span>
          </div>
        </div>

        {/* Focus / Goal Subtitle */}
        <div className="mt-5">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Bu Haftanın Ana Odağı & Açıklaması
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Weekly Innovations and Tasks */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Bu Haftanın Yenilikleri & Görevleri ({innovations.length})</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Her hafta eklediğiniz yenilikleri işaretleyin veya yeni inovasyon ekleyin
              </p>
            </div>

            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yenilik Ekle</span>
            </button>
          </div>

          {/* Inline Add Innovation Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddInlineInnovation}
              className="mb-4 p-4 rounded-xl bg-indigo-50/50 border border-indigo-200 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-900">
                  Hafta {week.weekNumber} İçin Yeni Yenilik
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Yenilik veya Görev Başlığı"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as InnovationCategory)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="text"
                placeholder="Açıklama (opsiyonel)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  placeholder="İlgili Drive linki (https://...)"
                  value={newDriveUrl}
                  onChange={(e) => setNewDriveUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                >
                  Kaydet
                </button>
              </div>
            </form>
          )}

          {/* List of Innovations */}
          <div className="space-y-2">
            {innovations.length === 0 ? (
              <div className="p-4 text-center rounded-lg bg-slate-50 border border-dashed border-slate-200 text-xs text-slate-500">
                Bu hafta için henüz yenilik eklenmedi. Yukarıdaki "+ Yenilik Ekle" butonuna basarak ilk yeniliğinizi ekleyin!
              </div>
            ) : (
              innovations.map((item) => (
                <div
                  key={item.id}
                  className={`group p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    item.isCompleted
                      ? 'bg-emerald-50/40 border-emerald-200/80 text-slate-600'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(item.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {item.isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300 hover:text-slate-500" />
                      )}
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`text-xs font-semibold ${
                            item.isCompleted
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">
                          · {item.category}
                        </span>
                      </div>
                      {item.description && (
                        <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      {item.driveUrl && (
                        <a
                          href={item.driveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[11px] text-blue-600 hover:text-blue-800 font-medium mt-1.5 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100"
                        >
                          <GoogleDriveIcon className="w-3.5 h-3.5" />
                          <span>{item.driveFileName || 'Drive Dokümanını Aç'}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteTask(item.id)}
                    className="p-1 text-slate-300 hover:text-red-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Sil"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Google Drive Links for this Week */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GoogleDriveIcon className="w-4 h-4" />
              <span>Bu Haftanın Google Drive Bağlantıları ({driveLinks.length})</span>
            </h3>
            <button
              onClick={() => setShowAddDriveLink(!showAddDriveLink)}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Drive Linki Ekle</span>
            </button>
          </div>

          {showAddDriveLink && (
            <form
              onSubmit={handleAddDriveLink}
              className="mb-4 p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-900">
                  Drive Dosyası veya Klasör Bağlantısı
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddDriveLink(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    required
                    placeholder="Dosya Başlığı (Örn: Hafta 1 Raporu.gdoc)"
                    value={driveDocTitle}
                    onChange={(e) => setDriveDocTitle(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <select
                    value={driveDocType}
                    onChange={(e) => setDriveDocType(e.target.value as DriveAttachment['type'])}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="document">Google Docs</option>
                    <option value="spreadsheet">Google Sheets</option>
                    <option value="presentation">Google Slides</option>
                    <option value="folder">Drive Klasörü</option>
                    <option value="other">Diğer</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  required
                  placeholder="Drive Linki (https://docs.google.com/...)"
                  value={driveDocUrl}
                  onChange={(e) => setDriveDocUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  Bağla
                </button>
              </div>
            </form>
          )}

          {driveLinks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {driveLinks.map((dl) => (
                <div
                  key={dl.id}
                  className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between gap-2 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{dl.title}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={dl.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 p-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDeleteDriveLink(dl.id)}
                      className="text-slate-300 hover:text-red-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Notes & Reflection */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Haftalık Notlar, Çıkarımlar ve Hoca Geri Bildirimleri
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Bu hafta ne öğrendiniz? Karşılaştığınız engeller veya bir sonraki haftaya devreden maddeler..."
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Modal Action Footer */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Kapat
          </button>
          <button
            onClick={handleSaveAll}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Değişiklikleri Kaydet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
