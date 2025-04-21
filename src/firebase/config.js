import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { enableIndexedDbPersistence, getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Ініціалізація Firebase
export const app = initializeApp(firebaseConfig);

// Отримуємо доступ до сервісів
export const db = getFirestore(app);

// Включаємо офлайн персистентність
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log(
      'Multiple tabs open, persistence can only be enabled in one tab at a a time.'
    );
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence');
  }
});

export const storage = getStorage(app);
export const auth = getAuth(app);
