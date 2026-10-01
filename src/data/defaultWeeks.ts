import { WeekPlan } from '../types/curriculum';

export const PHASES = [
  { id: 1, name: 'Faz 1', range: 'Hafta 1 - 6', weeks: [1, 2, 3, 4, 5, 6] },
  { id: 2, name: 'Faz 2', range: 'Hafta 7 - 12', weeks: [7, 8, 9, 10, 11, 12] },
  { id: 3, name: 'Faz 3', range: 'Hafta 13 - 18', weeks: [13, 14, 15, 16, 17, 18] },
  { id: 4, name: 'Faz 4', range: 'Hafta 19 - 24', weeks: [19, 20, 21, 22, 23, 24] },
  { id: 5, name: 'Faz 5', range: 'Hafta 25 - 30', weeks: [25, 26, 27, 28, 29, 30] },
];

export const INITIAL_SETTINGS = {
  projectName: '30 Haftalık Ödev Programı',
  studentName: 'Öğrenci',
  courseName: 'Dönem Ödevi',
  googleDriveFolderUrl: 'https://drive.google.com',
  startDate: new Date().toISOString().split('T')[0],
};

// Clean 1 to 30 weeks with everything inside cleared out as requested
export const INITIAL_WEEKS: WeekPlan[] = Array.from({ length: 30 }, (_, index) => {
  const weekNum = index + 1;
  const phaseId = Math.ceil(weekNum / 6);

  return {
    weekNumber: weekNum,
    title: `Hafta ${weekNum}`,
    subtitle: '',
    phaseId,
    phaseName: `Faz ${phaseId}`,
    targetFocus: '',
    status: 'pending',
    progress: 0,
    notes: '',
    driveUrl: '',
    driveTitle: '',
    innovations: [],
    driveLinks: [],
  };
});
