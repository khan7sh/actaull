import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';

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
    const updatedBooking = JSON.parse(event.body || '{}');
    const { id, ...bookingData } = updatedBooking;

    if (!id) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Booking ID is required' }) };
    }

    const bookingRef = ref(database, `bookings/${id}`);
    await update(bookingRef, bookingData);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Booking updated successfully' }),
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update booking' }),
    };
  }
};

export { handler };

