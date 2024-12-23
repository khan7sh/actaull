import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { ref, push } from 'firebase/database';
import { getFirebaseDatabase } from './utils/firebase';

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

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const bookingData = JSON.parse(event.body || '{}');
    
    // Store booking in Firebase first
    const bookingsRef = ref(getFirebaseDatabase(), 'bookings');
    const newBookingRef = await push(bookingsRef, bookingData);
    
    // Create email objects
    const customerEmail = createCustomerEmail(bookingData);
    const managerEmail = createManagerEmail(bookingData);
    
    // Send emails
    try {
      await Promise.all([
        transporter.sendMail(customerEmail),
        transporter.sendMail(managerEmail)
      ]);
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Continue execution even if emails fail
    }

    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Booking confirmed successfully!',
        bookingId: newBookingRef.key 
      }),
    };
  } catch (error) {
    console.error('Error processing booking:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: false, 
        message: 'There was an error processing your booking. Please try again.' 
      }),
    };
  }
};

// Helper functions to create email objects
const createCustomerEmail = (bookingData: any) => {
  const formattedDate = new Date(bookingData.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return {
    from: '"Noshe Cambridge" <noshecambridge@gmail.com>',
    to: bookingData.email,
    subject: 'Booking Confirmation - Noshe Cambridge',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EBE0; color: #333;">
        <h1 style="color: #8B2635; text-align: center;">Booking Confirmation</h1>
        <p>Dear <strong>${bookingData.name}</strong>,</p>
        <p>Thank you for booking a table at Noshe Cambridge. We're excited to welcome you!</p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4A5D23; margin-top: 0;">Your Reservation Details:</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Time:</strong> ${bookingData.time}</p>
          <p><strong>Number of guests:</strong> ${bookingData.guests}</p>
          ${bookingData.specialRequests ? `<p><strong>Special Requests:</strong> ${bookingData.specialRequests}</p>` : ''}
        </div>
        <p>If you need to make any changes to your reservation, please call us at <strong>07964 624055</strong>.</p>
        <p>We look forward to serving you with our delicious Afghan cuisine and Kenza coffee!</p>
        <p>Best regards,<br><strong>Noshe Cambridge Team</strong></p>
      </div>
    `
  };
};

const createManagerEmail = (bookingData: any) => {
  // Your existing manager email template
  return {
    from: '"Noshe Cambridge Bookings" <noshecambridge@gmail.com>',
    to: 'noshecambridge@gmail.com',
    subject: 'New Booking - Noshe Cambridge',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EBE0; color: #333;">
        <h1 style="color: #8B2635; text-align: center;">New Booking Alert</h1>
        <p>A new booking has been made at Noshe Cambridge:</p>
        <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h2 style="color: #4A5D23; margin-top: 0;">Booking Details:</h2>
          <p><strong>Name:</strong> ${bookingData.name}</p>
          <p><strong>Email:</strong> ${bookingData.email}</p>
          <p><strong>Phone:</strong> ${bookingData.phone}</p>
          <p><strong>Date:</strong> ${bookingData.date}</p>
          <p><strong>Time:</strong> ${bookingData.time}</p>
          <p><strong>Number of guests:</strong> ${bookingData.guests}</p>
          ${bookingData.specialRequests ? `<p><strong>Special Requests:</strong> ${bookingData.specialRequests}</p>` : ''}
        </div>
        <p>Please ensure the table is prepared accordingly.</p>
      </div>
    `,
  };
};

export { handler };
