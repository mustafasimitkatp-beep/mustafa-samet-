import { WeekPlan } from '../types/curriculum';

export const TOTAL_WEEKS = 38;

export const PHASES = [
  { id: 1, name: 'Faz 1', range: 'Hafta 1 - 6', weeks: [1, 2, 3, 4, 5, 6] },
  { id: 2, name: 'Faz 2', range: 'Hafta 7 - 12', weeks: [7, 8, 9, 10, 11, 12] },
  { id: 3, name: 'Faz 3', range: 'Hafta 13 - 18', weeks: [13, 14, 15, 16, 17, 18] },
  { id: 4, name: 'Faz 4', range: 'Hafta 19 - 24', weeks: [19, 20, 21, 22, 23, 24] },
  { id: 5, name: 'Faz 5', range: 'Hafta 25 - 30', weeks: [25, 26, 27, 28, 29, 30] },
  { id: 6, name: 'Faz 6', range: 'Hafta 31 - 38', weeks: [31, 32, 33, 34, 35, 36, 37, 38] },
];

export const INITIAL_SETTINGS = {
  projectName: '38. Hafta Ödev Programı',
  studentName: 'Öğrenci',
  courseName: 'Dönem Ödevi',
  googleDriveFolderUrl: 'https://drive.google.com',
  startDate: new Date().toISOString().split('T')[0],
};

const getPhaseIdForWeek = (weekNum: number): number => {
  if (weekNum <= 6) return 1;
  if (weekNum <= 12) return 2;
  if (weekNum <= 18) return 3;
  if (weekNum <= 24) return 4;
  if (weekNum <= 30) return 5;
  return 6;
};

// Generates clean default weeks 1 to 38, with Week 3 having mustafasamet2.vercel.app
export const createDefaultWeeks = (count = TOTAL_WEEKS): WeekPlan[] => {
  return Array.from({ length: count }, (_, index) => {
    const weekNum = index + 1;
    const phaseId = getPhaseIdForWeek(weekNum);
    const isWeek3 = weekNum === 3;

    return {
      weekNumber: weekNum,
      title: `Hafta ${weekNum}`,
      subtitle: isWeek3 ? 'mustafasamet2.vercel.app' : '',
      phaseId,
      phaseName: `Faz ${phaseId}`,
      targetFocus: isWeek3 ? 'Vercel Proje Dağıtımı' : '',
      status: isWeek3 ? 'completed' : 'pending',
      progress: isWeek3 ? 100 : 0,
      notes: isWeek3 ? 'Canlı Vercel Projesi: https://mustafasamet2.vercel.app' : '',
      driveUrl: isWeek3 ? 'https://mustafasamet2.vercel.app' : '',
      driveTitle: isWeek3 ? 'mustafasamet2.vercel.app' : '',
      innovations: isWeek3
        ? [
            {
              id: 'inv-week3-vercel',
              title: 'Vercel Canlı Proje Dağıtımı',
              description: 'mustafasamet2.vercel.app canlıya alındı ve 3. hafta ödevine eklendi.',
              category: 'Kodlama & Geliştirme',
              isCompleted: true,
              createdAt: '2026-10-14',
              driveUrl: 'https://mustafasamet2.vercel.app',
              driveFileName: 'mustafasamet2.vercel.app',
            },
          ]
        : [],
      driveLinks: isWeek3
        ? [
            {
              id: 'dl-week3-vercel',
              title: 'mustafasamet2.vercel.app',
              url: 'https://mustafasamet2.vercel.app',
              type: 'other',
              weekNumber: 3,
            },
          ]
        : [],
    };
  });
};

export const INITIAL_WEEKS: WeekPlan[] = createDefaultWeeks(TOTAL_WEEKS);

// Helper to ensure any loaded schedule array is expanded to 38 weeks and includes week 3 vercel link
export const ensure38Weeks = (loadedWeeks: WeekPlan[]): WeekPlan[] => {
  if (!loadedWeeks || !Array.isArray(loadedWeeks)) {
    return INITIAL_WEEKS;
  }

  const existingMap = new Map<number, WeekPlan>();
  loadedWeeks.forEach((w) => {
    existingMap.set(w.weekNumber, w);
  });

  const fullList: WeekPlan[] = [];
  for (let i = 1; i <= TOTAL_WEEKS; i++) {
    const existing = existingMap.get(i);
    const phaseId = getPhaseIdForWeek(i);

    if (existing) {
      // Ensure Week 3 gets mustafasamet2.vercel.app if not already set
      if (i === 3 && (!existing.driveUrl || !existing.driveUrl.includes('mustafasamet2.vercel.app'))) {
        existing.driveUrl = 'https://mustafasamet2.vercel.app';
        existing.driveTitle = 'mustafasamet2.vercel.app';
        if (!existing.subtitle) existing.subtitle = 'mustafasamet2.vercel.app';
        if (existing.status === 'pending') existing.status = 'completed';
        if (existing.progress === 0) existing.progress = 100;
        if (!existing.driveLinks || existing.driveLinks.length === 0) {
          existing.driveLinks = [
            {
              id: 'dl-week3-vercel',
              title: 'mustafasamet2.vercel.app',
              url: 'https://mustafasamet2.vercel.app',
              type: 'other',
              weekNumber: 3,
            },
          ];
        }
      }

      fullList.push({
        ...existing,
        phaseId,
        phaseName: `Faz ${phaseId}`,
      });
    } else {
      const isWeek3 = i === 3;
      fullList.push({
        weekNumber: i,
        title: `Hafta ${i}`,
        subtitle: isWeek3 ? 'mustafasamet2.vercel.app' : '',
        phaseId,
        phaseName: `Faz ${phaseId}`,
        targetFocus: isWeek3 ? 'Vercel Proje Dağıtımı' : '',
        status: isWeek3 ? 'completed' : 'pending',
        progress: isWeek3 ? 100 : 0,
        notes: isWeek3 ? 'Canlı Vercel Projesi: https://mustafasamet2.vercel.app' : '',
        driveUrl: isWeek3 ? 'https://mustafasamet2.vercel.app' : '',
        driveTitle: isWeek3 ? 'mustafasamet2.vercel.app' : '',
        innovations: isWeek3
          ? [
              {
                id: 'inv-week3-vercel',
                title: 'Vercel Canlı Proje Dağıtımı',
                description: 'mustafasamet2.vercel.app canlıya alındı ve 3. hafta ödevine eklendi.',
                category: 'Kodlama & Geliştirme',
                isCompleted: true,
                createdAt: '2026-10-14',
                driveUrl: 'https://mustafasamet2.vercel.app',
                driveFileName: 'mustafasamet2.vercel.app',
              },
            ]
          : [],
        driveLinks: isWeek3
          ? [
              {
                id: 'dl-week3-vercel',
                title: 'mustafasamet2.vercel.app',
                url: 'https://mustafasamet2.vercel.app',
                type: 'other',
                weekNumber: 3,
              },
            ]
          : [],
      });
    }
  }

  return fullList;
};
