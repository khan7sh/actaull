import { Handler } from '@netlify/functions';
import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET!,
});

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

    const result: any = await client.query(
      q.Map(
        q.Paginate(
          q.Range(
            q.Match(q.Index('bookings_by_date')),
            q.Time(startOfDay.toISOString()),
            q.Time(endOfDay.toISOString())
          )
        ),
        q.Lambda('booking', q.Get(q.Var('booking')))
      )
    );

    console.log('Query result:', JSON.stringify(result, null, 2));

    const bookings = result.data.map((booking: any) => booking.data);
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
