import { Handler } from '@netlify/functions';
import { ref, remove } from 'firebase/database';
import { getFirebaseDatabase } from './utils/firebase';

const database = getFirebaseDatabase();

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
