import React, { useState } from 'react';
import { InnovationCategory, InnovationItem } from '../types/curriculum';
import { Sparkles, X, Plus, Link as LinkIcon } from 'lucide-react';
import { GoogleDriveIcon } from './GoogleDriveIcon';

interface AddInnovationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultWeek?: number;
  onAddInnovation: (weekNumber: number, innovation: Omit<InnovationItem, 'id' | 'createdAt'>) => void;
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

export const AddInnovationModal: React.FC<AddInnovationModalProps> = ({
  isOpen,
  onClose,
  defaultWeek = 1,
  onAddInnovation,
}) => {
  const [selectedWeek, setSelectedWeek] = useState<number>(defaultWeek);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<InnovationCategory>('İnovasyon');
  const [driveUrl, setDriveUrl] = useState('');
  const [driveFileName, setDriveFileName] = useState('');

  // Sync if defaultWeek changes
  React.useEffect(() => {
    if (defaultWeek) {
      setSelectedWeek(defaultWeek);
    }
  }, [defaultWeek]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddInnovation(selectedWeek, {
      title: title.trim(),
      description: description.trim(),
      category,
      isCompleted: false,
      driveUrl: driveUrl.trim() ? driveUrl.trim() : undefined,
      driveFileName: driveFileName.trim() ? driveFileName.trim() : undefined,
    });

    // Reset and close
    setTitle('');
    setDescription('');
    setDriveUrl('');
    setDriveFileName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl bg-white border border-slate-200 shadow-2xl p-6 text-slate-800">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-lg text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Yeni Yenilik & Görev Ekle
              </h2>
              <p className="text-xs text-slate-500">
                Ödev programınıza bu haftanın yeni kazanımını veya yeniliğini kaydedin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Target Week Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Hedef Hafta (1 - 30)
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Hafta {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InnovationCategory)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Innovation Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Yenilik / Görev Başlığı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Yeni Derin Öğrenme Katmanı veya Anket Çıktısı"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Açıklama & Detaylar
            </label>
            <textarea
              rows={3}
              placeholder="Bu yeniliğin amacı, haftalık ödeve katkısı ve uygulanış yöntemi..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Google Drive Link Integration */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
              <GoogleDriveIcon className="w-4 h-4" />
              <span>İlgili Google Drive Dosyası (Opsiyonel)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Dosya Adı (Örn: Rapor_v1.gdoc)"
                value={driveFileName}
                onChange={(e) => setDriveFileName(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
              <input
                type="url"
                placeholder="Drive Linki (https://...)"
                value={driveUrl}
                onChange={(e) => setDriveUrl(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Haftaya Ekle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
