import { initializeApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

let app;
let database;

export function getFirebaseApp() {
  if (!app && getApps().length === 0) {
    const firebaseConfig = {
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    };
    app = initializeApp(firebaseConfig);
  }
  return app;
}

export function getFirebaseDatabase() {
  if (!database) {
    const app = getFirebaseApp();
    database = getDatabase(app);
  }
  return database;
} 