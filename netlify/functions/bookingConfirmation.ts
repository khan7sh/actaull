import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import faunadb from 'faunadb';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB_SECRET!,
});

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ success: false, message: 'Method Not Allowed' }) };
  }

  try {
    console.log('Received booking request:', event.body);
    const { name, email, phone, date, time, guests, specialRequests } = JSON.parse(event.body || '{}');
    console.log('Parsed data:', { name, email, phone, date, time, guests, specialRequests });

    console.log('Sending customer email');
    await transporter.sendMail(customerEmail);
    console.log('Customer email sent');

    console.log('Sending manager email');
    await transporter.sendMail(managerEmail);
    console.log('Manager email sent');

    console.log('Storing booking in FaunaDB');
    const bookingData = {
      name,
      email,
      phone,
      date: new Date(date),
      time,
      guests: parseInt(guests),
      specialRequests,
    };

    await client.query(
      q.Create(
        q.Collection('bookings'),
        { data: bookingData }
      )
    );
    console.log('Booking stored in FaunaDB');

    console.log('Sending success response');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true, message: 'Booking confirmed successfully!' }),
    };
  } catch (error) {
    console.error('Error processing booking:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: false, message: 'There was an error processing your booking. Please try again.' }),
    };
  }
};

export { handler };
