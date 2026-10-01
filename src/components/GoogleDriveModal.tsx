import React, { useState } from 'react';
import { GoogleDriveIcon } from './GoogleDriveIcon';
import { WeekPlan } from '../types/curriculum';
import { ExternalLink, Folder, FileText, Check, Copy, Download, X, Plus, Sparkles } from 'lucide-react';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  driveFolderUrl: string;
  onUpdateDriveFolderUrl: (url: string) => void;
  weeks: WeekPlan[];
}

export const GoogleDriveModal: React.FC<GoogleDriveModalProps> = ({
  isOpen,
  onClose,
  driveFolderUrl,
  onUpdateDriveFolderUrl,
  weeks,
}) => {
  const [folderInput, setFolderInput] = useState(driveFolderUrl);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSaveUrl = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDriveFolderUrl(folderInput);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  // Collect all Drive attachments across all 30 weeks
  const allDriveLinks: { title: string; url: string; weekNumber: number; type: string }[] = [];
  weeks.forEach((w) => {
    if (w.driveUrl) {
      allDriveLinks.push({
        title: w.driveTitle || `Hafta ${w.weekNumber} Drive Dosyası`,
        url: w.driveUrl,
        weekNumber: w.weekNumber,
        type: 'document',
      });
    }
    w.driveLinks.forEach((dl) => {
      allDriveLinks.push({
        title: dl.title,
        url: dl.url,
        weekNumber: w.weekNumber,
        type: dl.type,
      });
    });
    w.innovations.forEach((inv) => {
      if (inv.driveUrl) {
        allDriveLinks.push({
          title: inv.driveFileName || inv.title,
          url: inv.driveUrl,
          weekNumber: w.weekNumber,
          type: 'document',
        });
      }
    });
  });

  // Generate markdown summary for Drive export
  const generateMarkdownSummary = () => {
    let md = `# 30 Haftalık Ödev ve İnovasyon Programı Raporu\n`;
    md += `Oluşturulma Tarihi: ${new Date().toLocaleDateString('tr-TR')}\n`;
    md += `Google Drive Klasörü: ${driveFolderUrl || 'Belirtilmedi'}\n\n`;
    md += `## 30 Haftalık İlerleme Özeti\n\n`;

    weeks.forEach((w) => {
      md += `### Hafta ${w.weekNumber}: ${w.title}\n`;
      md += `- Faz: ${w.phaseName}\n`;
      md += `- Durum: ${w.status === 'completed' ? 'Tamamlandı' : w.status === 'in_progress' ? 'Devam Ediyor' : 'Bekliyor'} (%${w.progress})\n`;
      if (w.notes) md += `- Haftalık Not: ${w.notes}\n`;
      if (w.innovations.length > 0) {
        md += `- Eklenen Yenilikler & Görevler:\n`;
        w.innovations.forEach((inv) => {
          md += `  * [${inv.isCompleted ? 'x' : ' '}] [${inv.category}] ${inv.title}: ${inv.description}`;
          if (inv.driveUrl) md += ` (Drive: ${inv.driveUrl})`;
          md += `\n`;
        });
      }
      md += `\n`;
    });

    return md;
  };

  const handleCopyMarkdown = () => {
    const text = generateMarkdownSummary();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const text = generateMarkdownSummary();
    const blob = new Blob([text], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `30_Haftalik_Odev_Plani_${new Date().toISOString().split('T')[0]}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const targetDriveUrl = driveFolderUrl?.trim() || 'https://drive.google.com';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white border border-slate-200 shadow-2xl p-6 sm:p-8 text-slate-800">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-lg">
              <GoogleDriveIcon className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Google Drive Ödev Merkezi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                30 haftalık ödev dökümanlarınızı, raporlarınızı ve dosyalarınızı Drive ile yönetin
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/50 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>Google Drive'a Doğrudan Git</span>
              <span className="text-[11px] font-normal px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                1-Tık Erişim
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-md">
              Ödev dosyalarınızı, teslim sunumlarınızı ve haftalık notlarınızı Drive üzerinde açın.
            </p>
          </div>
          <a
            href={targetDriveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors whitespace-nowrap"
          >
            <GoogleDriveIcon className="w-4 h-4 brightness-150" />
            <span>Drive'ı Aç</span>
            <ExternalLink className="w-4 h-4 ml-1 opacity-80" />
          </a>
        </div>

        {/* Custom Folder Link Section */}
        <div className="mt-6">
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Özel Ödev Klasörünüz (Drive Klasör Linki)
          </label>
          <form onSubmit={handleSaveUrl} className="flex gap-2">
            <input
              type="url"
              placeholder="Örn: https://drive.google.com/drive/folders/1a2b3c..."
              value={folderInput}
              onChange={(e) => setFolderInput(e.target.value)}
              className="flex-1 px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400 font-mono text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
            >
              {isSaved ? <Check className="w-4 h-4 text-emerald-600" /> : null}
              <span>{isSaved ? 'Kaydedildi' : 'Kaydet'}</span>
            </button>
          </form>
          <p className="text-[11px] text-slate-500 mt-1.5">
            Buraya Google Drive klasör linkinizi yapıştırdığınızda "Drive'ı Aç" butonu doğrudan sizin ödev klasörünüzü açar.
          </p>
        </div>

        {/* Quick Google Workspace Starters */}
        <div className="mt-6">
          <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2.5">
            Hızlı Ödev Dokümanı Başlatıcılar
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <a
              href="https://docs.new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-slate-200 hover:border-blue-300 hover:bg-blue-50/40 rounded-lg transition-all flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                Doc
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-semibold text-slate-900 group-hover:text-blue-700 truncate">
                  Yeni Rapor / Metin
                </div>
                <div className="text-[11px] text-slate-500">Google Docs</div>
              </div>
            </a>

            <a
              href="https://sheets.new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 rounded-lg transition-all flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                Tablo
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 truncate">
                  Yeni Veri & Tablo
                </div>
                <div className="text-[11px] text-slate-500">Google Sheets</div>
              </div>
            </a>

            <a
              href="https://slides.new"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 rounded-lg transition-all flex items-center gap-2.5 group"
            >
              <div className="w-8 h-8 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                Slayt
              </div>
              <div className="text-left overflow-hidden">
                <div className="text-xs font-semibold text-slate-900 group-hover:text-amber-700 truncate">
                  Yeni Sunum Slaytı
                </div>
                <div className="text-[11px] text-slate-500">Google Slides</div>
              </div>
            </a>
          </div>
        </div>

        {/* Attached Drive Files in Curriculum */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
              Haftalara Bağlı Drive Belgeleri ({allDriveLinks.length})
            </h3>
          </div>
          {allDriveLinks.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
              Henüz haftalara eklenmiş Drive linki yok. Herhangi bir haftaya tıklayarak Drive bağlantısı ekleyebilirsiniz.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
              {allDriveLinks.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between px-3 py-2 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-lg text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="font-medium text-slate-800 truncate">{item.title}</span>
                    <span className="text-[10px] text-slate-500 shrink-0">
                      Hafta {item.weekNumber}
                    </span>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium shrink-0 ml-2"
                  >
                    <span>Aç</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drive Backup / Export Tools */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-slate-900">
              30 Haftalık Takvimi Drive İçin Dışa Aktar
            </div>
            <div className="text-[11px] text-slate-500">
              Tüm haftalık ödev ve inovasyon planınızı Markdown olarak indirip Drive'a yükleyin.
            </div>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleCopyMarkdown}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Raporu Kopyala'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir (.md)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
