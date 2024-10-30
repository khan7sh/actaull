import { Handler } from '@netlify/functions';
import { ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';
import { getFirebaseDatabase } from './utils/firebase';

const database = getFirebaseDatabase();

interface Booking {
  id: string;
  date: string;
  [key: string]: any;
}

const handler: Handler = async (event) => {
  console.log('Function started');
  console.log('Environment variables:', {
    databaseURL: process.env.FIREBASE_DATABASE_URL ? 'Set' : 'Not set',
    apiKey: process.env.FIREBASE_API_KEY ? 'Set' : 'Not set'
  });

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  try {
    const { date } = JSON.parse(event.body || '{}');
    const selectedDate = new Date(date);
    const startOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate()));
    const endOfDay = new Date(Date.UTC(selectedDate.getUTCFullYear(), selectedDate.getUTCMonth(), selectedDate.getUTCDate(), 23, 59, 59, 999));

    console.log('Querying bookings for date range:', startOfDay.toISOString(), 'to', endOfDay.toISOString());

    const bookingsRef = ref(database, 'bookings');
    const bookingsQuery = query(
      bookingsRef,
      orderByChild('date'),
      startAt(startOfDay.toISOString()),
      endAt(endOfDay.toISOString())
    );

    const snapshot = await get(bookingsQuery);
    const bookings: Booking[] = [];

    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();
      if (booking && booking.date) {
        bookings.push({
          id: childSnapshot.key,
          ...booking,
          date: new Date(booking.date).toISOString()
        });
      }
    });

    console.log('Fetched bookings:', JSON.stringify(bookings, null, 2));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true, bookings }),
    };
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: false, error: 'Failed to fetch bookings' }),
    };
  }
};

export { handler };
