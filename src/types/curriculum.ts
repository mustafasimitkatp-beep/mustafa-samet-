export type WeekStatus = 'pending' | 'in_progress' | 'completed';

export type InnovationCategory =
  | 'İnovasyon'
  | 'Araştırma'
  | 'Kodlama & Geliştirme'
  | 'Tasarım & UI'
  | 'Analiz & Veri'
  | 'Test & İyileştirme'
  | 'Dokümantasyon';

export interface InnovationItem {
  id: string;
  title: string;
  description: string;
  category: InnovationCategory;
  isCompleted: boolean;
  driveUrl?: string;
  driveFileName?: string;
  createdAt: string;
}

export interface DriveAttachment {
  id: string;
  title: string;
  url: string;
  type: 'folder' | 'document' | 'spreadsheet' | 'presentation' | 'other';
  weekNumber: number;
}

export interface WeekPlan {
  weekNumber: number;
  title: string;
  subtitle: string;
  phaseId: number;
  phaseName: string;
  targetFocus: string;
  status: WeekStatus;
  progress: number; // 0 to 100
  notes: string;
  driveUrl?: string;
  driveTitle?: string;
  innovations: InnovationItem[];
  driveLinks: DriveAttachment[];
}

export interface ProjectSettings {
  projectName: string;
  studentName: string;
  courseName: string;
  googleDriveFolderUrl: string;
  startDate: string;
}
