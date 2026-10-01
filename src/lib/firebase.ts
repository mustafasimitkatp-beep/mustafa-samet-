import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  getDocFromServer,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { WeekPlan, ProjectSettings } from '../types/curriculum';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Must pass firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode.');
    }
  }
}

// Google Sign-In
export async function loginWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

// Google Logout
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Listen to auth changes
export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

// Central Cloud Schedule Path
const CENTRAL_DOC_PATH = 'schedules/main';

// Save entire schedule to central cloud Firestore (accessible by all browsers and phones)
export async function saveCentralScheduleToCloud(
  weeks: WeekPlan[],
  settings: ProjectSettings,
  user?: User | null
) {
  try {
    const payload = {
      weeks,
      googleDriveFolderUrl: settings.googleDriveFolderUrl || '',
      projectName: settings.projectName || '',
      lastUpdatedBy: user?.email || user?.displayName || 'Web Kullanıcısı',
      lastUpdatedUserId: user?.uid || null,
      updatedAt: new Date().toISOString(),
    };

    // 1. Save to central document so any browser/phone immediately sees it
    await setDoc(doc(db, 'schedules', 'main'), payload);

    // 2. Also save to user's private collection if signed in
    if (user?.uid) {
      await setDoc(doc(db, 'users', user.uid, 'schedule', 'current'), {
        ...payload,
        userId: user.uid,
        email: user.email || '',
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, CENTRAL_DOC_PATH);
  }
}

// Subscribe in real-time to central schedule (so phones, tablets and browsers update live!)
export function subscribeToCentralSchedule(
  onData: (data: { weeks: WeekPlan[]; settings?: Partial<ProjectSettings>; lastUpdatedBy?: string } | null) => void,
  onError?: (err: unknown) => void
) {
  const scheduleDocRef = doc(db, 'schedules', 'main');

  return onSnapshot(
    scheduleDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onData({
          weeks: data.weeks || [],
          settings: {
            googleDriveFolderUrl: data.googleDriveFolderUrl,
            projectName: data.projectName,
          },
          lastUpdatedBy: data.lastUpdatedBy,
        });
      } else {
        onData(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, CENTRAL_DOC_PATH);
      if (onError) onError(error);
    }
  );
}

// User-specific schedule subscription
export function subscribeToUserSchedule(
  userId: string,
  onData: (data: { weeks: WeekPlan[]; settings?: Partial<ProjectSettings> } | null) => void,
  onError?: (err: unknown) => void
) {
  const docPath = `users/${userId}/schedule/current`;
  const scheduleDocRef = doc(db, 'users', userId, 'schedule', 'current');

  return onSnapshot(
    scheduleDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        onData({
          weeks: data.weeks || [],
          settings: {
            googleDriveFolderUrl: data.googleDriveFolderUrl,
            projectName: data.projectName,
          },
        });
      } else {
        onData(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, docPath);
      if (onError) onError(error);
    }
  );
}
