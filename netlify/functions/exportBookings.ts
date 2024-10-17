import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';
import { stringify } from 'csv-stringify/sync';

// Initialize Firebase
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
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  try {
    const { date } = JSON.parse(event.body || '{}');
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    console.log('Querying bookings for date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

    const bookingsRef = ref(database, 'bookings');
    const bookingsQuery = query(
      bookingsRef,
      orderByChild('date'),
      startAt(startOfDay.toISOString()),
      endAt(endOfDay.toISOString())
    );

    const snapshot = await get(bookingsQuery);
    const bookings = [];

    snapshot.forEach((childSnapshot) => {
      bookings.push(childSnapshot.val());
    });

    console.log('Fetched bookings:', JSON.stringify(bookings, null, 2));

    const csv = stringify(bookings, {
      header: true,
      columns: ['name', 'email', 'phone', 'date', 'time', 'guests', 'specialRequests'],
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="bookings_${date}.csv"`,
      },
      body: csv,
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: false, error: 'Failed to fetch bookings', details: error.message }),
    };
  }
};
export { handler };
