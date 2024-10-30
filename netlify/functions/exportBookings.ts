import { Handler } from '@netlify/functions';
import { ref, query, orderByChild, startAt, endAt, get } from 'firebase/database';
import { stringify } from 'csv-stringify/sync';
import { format, startOfDay, endOfDay } from 'date-fns';
import { getFirebaseDatabase } from './utils/firebase';

const database = getFirebaseDatabase();

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  try {
    const { date, exportAll, exportType, sort } = JSON.parse(event.body || '{}');
    let bookingsQuery;

    if (exportAll) {
      console.log('Exporting all bookings');
      bookingsQuery = ref(database, 'bookings');
    } else if (date && exportType === 'daily') {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error('Invalid date format');
      }
      const dayStart = startOfDay(parsedDate);
      const dayEnd = endOfDay(parsedDate);

      console.log('Querying bookings for date:', dayStart.toISOString(), 'to', dayEnd.toISOString());

      bookingsQuery = query(
        ref(database, 'bookings'),
        orderByChild('date'),
        startAt(dayStart.toISOString()),
        endAt(dayEnd.toISOString())
      );
    } else {
      throw new Error('Invalid export parameters');
    }

    const snapshot = await get(bookingsQuery);
    const bookings = [];

    snapshot.forEach((childSnapshot) => {
      const booking = childSnapshot.val();
      booking.date = format(new Date(booking.date), 'yyyy-MM-dd');
      bookings.push(booking);
    });

    console.log('Fetched bookings:', JSON.stringify(bookings, null, 2));

    // Sort bookings by time if it's a daily export
    if (exportType === 'daily' && sort === 'asc') {
      bookings.sort((a, b) => {
        const timeA = a.time.split(':').map(Number);
        const timeB = b.time.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
    }

    const csv = stringify(bookings, {
      header: true,
      columns: ['name', 'email', 'phone', 'date', 'time', 'guests', 'specialRequests'],
    });

    const filename = exportAll ? 'all_bookings.csv' : `bookings_${format(new Date(date), 'yyyy-MM-dd')}.csv`;

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
