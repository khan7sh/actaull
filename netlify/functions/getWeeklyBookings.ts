import { Handler } from '@netlify/functions';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';

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
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const { start, end } = JSON.parse(event.body || '{}');
    console.log('Fetching bookings for date range:', start, 'to', end);

    const bookingsRef = ref(database, 'bookings');
    const bookingsQuery = query(
      bookingsRef,
      orderByChild('date'),
      startAt(start),
      endAt(end)
    );

    const snapshot = await get(bookingsQuery);
    const bookings = [];

    snapshot.forEach((childSnapshot) => {
      bookings.push(childSnapshot.val());
    });

    console.log('Fetched bookings:', bookings);

    const weeklyBookings = [0, 0, 0, 0, 0, 0, 0];
    bookings.forEach((booking) => {
      const bookingDate = new Date(booking.date);
      const dayIndex = (bookingDate.getDay() + 6) % 7; // Adjust to start from Tuesday
      weeklyBookings[dayIndex]++;
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: weeklyBookings }),
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch bookings' }),
    };
  }
};

export { handler };

