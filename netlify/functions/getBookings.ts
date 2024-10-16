import { Handler } from '@netlify/functions';
import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET!,
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { date } = JSON.parse(event.body || '{}');
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

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

    const bookings = result.data.map((booking: any) => booking.data);

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings }),
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
