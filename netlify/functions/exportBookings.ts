import { Handler } from '@netlify/functions';
import faunadb from 'faunadb';
import { stringify } from 'csv-stringify/sync';

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET!,
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('FaunaDB Secret:', process.env.FAUNADB_SECRET ? 'Set' : 'Not set');
    console.log('FaunaDB client:', JSON.stringify(client, null, 2));
    
    const { exportAll } = JSON.parse(event.body || '{}');

    console.log('Querying FaunaDB for bookings...');
    try {
      const collectionExists = await client.query(
        q.Exists(q.Collection('bookings'))
      );
      console.log('Bookings collection exists:', collectionExists);

      if (!collectionExists) {
        console.log('Creating bookings collection...');
        await client.query(q.CreateCollection({ name: 'bookings' }));
        console.log('Bookings collection created successfully');
      }

      const collectionSize = await client.query(
        q.Count(q.Documents(q.Collection('bookings')))
      );
      console.log('Number of documents in bookings collection:', collectionSize);

      const result = await client.query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('bookings'))),
          q.Lambda('booking', q.Get(q.Var('booking')))
        )
      );

      console.log('Query result:', JSON.stringify(result, null, 2));
      return result;
    } catch (dbError) {
      console.error('Error querying FaunaDB:', dbError);
      if (dbError instanceof Error) {
        console.error('Error name:', dbError.name);
        console.error('Error message:', dbError.message);
        console.error('Error stack:', dbError.stack);
      }
      throw dbError;
    }

    if (!result.data || result.data.length === 0) {
      console.log('No bookings found in the database.');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No bookings found' }),
      };
    }

    const bookings = result.data.map((booking: any) => {
      const bookingData = booking.data;
      return {
        ...bookingData,
        date: new Date(bookingData.date).toLocaleDateString(),
      };
    });
    console.log(`Found ${bookings.length} bookings`);

    const csv = stringify(bookings, {
      header: true,
      columns: ['name', 'email', 'phone', 'date', 'time', 'guests', 'specialRequests'],
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="all_bookings.csv"`,
      },
      body: csv,
    };
  } catch (error) {
    console.error('Error exporting bookings:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to export bookings' }),
    };
  }
};

export { handler };
