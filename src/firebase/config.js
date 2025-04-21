import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyASHYGg7xRuFSOAtQX8pGt_4KjrJ8r1fbA',
  authDomain: 'recipe-app-1d72d.firebaseapp.com',
  projectId: 'recipe-app-1d72d',
  storageBucket: 'recipe-app-1d72d.firebasestorage.app',
  messagingSenderId: '120481683919',
  appId: '1:120481683919:web:4af16d2c7ac06b99999aba',
  measurementId: 'G-3FFLV8Y1GR',
};

// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);

// Отримуємо доступ до Firestore
export const db = getFirestore(app);
