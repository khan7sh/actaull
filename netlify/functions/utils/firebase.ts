import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';

let app;
let database;

export function getFirebaseApp() {
  try {
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
      
      if (!firebaseConfig.databaseURL) {
        throw new Error('Firebase Database URL is not configured');
      }
      
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized successfully');
    }
    return app;
  } catch (error) {
    console.error('Error initializing Firebase app:', error);
    throw error;
  }
}

export function getFirebaseDatabase() {
  try {
    if (!database) {
      const app = getFirebaseApp();
      database = getDatabase(app);
      console.log('Firebase database initialized successfully');
    }
    return database;
  } catch (error) {
    console.error('Error getting Firebase database:', error);
    throw error;
  }
} 