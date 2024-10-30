import { Handler } from '@netlify/functions';
import { ref, update } from 'firebase/database';
import { getFirebaseDatabase } from './utils/firebase';

const database = getFirebaseDatabase();

const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return { 
      statusCode: 405, 
      headers,
      body: JSON.stringify({ error: 'Method Not Allowed' }) 
    };
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
      headers,
      body: JSON.stringify({ message: 'Booking updated successfully' })
    };
  } catch (error) {
    console.error('Error updating booking:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to update booking' })
    };
  }
};

export { handler };

