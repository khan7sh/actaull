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
  databaseURL: "https://bookings-f964e-default-rtdb.europe-west1.firebasedatabase.app",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  try {
    const { date, exportAll } = JSON.parse(event.body || '{}');
    let bookingsQuery;

    if (exportAll) {
      console.log('Exporting all bookings');
      bookingsQuery = ref(database, 'bookings');
    } else if (date) {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      const startOfDay = new Date(parsedDate);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(parsedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      console.log('Querying bookings for date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

      bookingsQuery = query(
        ref(database, 'bookings'),
        orderByChild('date'),
        startAt(startOfDay.toISOString()),
        endAt(endOfDay.toISOString())
      );
    } else {
      throw new Error('Either date or exportAll parameter is required');
    }

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

    const filename = exportAll ? 'all_bookings.csv' : `bookings_${date}.csv`;

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
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
      body: JSON.stringify({ 
        success: false, 
        error: 'Failed to fetch bookings', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }),
    };
  }
};
export { handler };
