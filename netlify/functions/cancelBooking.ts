import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { bookingId } = JSON.parse(event.body || '{}');

    if (!bookingId) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Booking ID is required' }) };
    }

    const bookingRef = ref(database, `bookings/${bookingId}`);
    await remove(bookingRef);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Booking cancelled successfully' }),
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to cancel booking' }),
    };
  }
};

export { handler };
