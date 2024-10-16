import { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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
    console.log('Received booking request:', event.body);
    const { name, email, phone, date, time, guests, specialRequests } = JSON.parse(event.body || '{}');
    console.log('Parsed data:', { name, email, phone, date, time, guests, specialRequests });

    console.log('Creating transporter with:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: '********' // Don't log the actual password
      }
    });

    const customerEmail = {
      from: '"Noshe Cambridge" <bookings@noshecambridge.co.uk>',
      to: email,
      subject: 'Booking Confirmation - Noshe Cambridge',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EBE0; color: #333;">
          <h1 style="color: #8B2635; text-align: center;">Booking Confirmation</h1>
          <p>Dear <strong>${name}</strong>,</p>
          <p>Thank you for booking a table at Noshe Cambridge. We're excited to welcome you!</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #4A5D23; margin-top: 0;">Your Reservation Details:</h2>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Number of guests:</strong> ${guests}</p>
            ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
          </div>
          <p>If you need to make any changes to your reservation, please call us at <strong>07964 624055</strong>.</p>
          <p>We look forward to serving you with our delicious Afghan cuisine and Kenza coffee!</p>
          <p>Best regards,<br><strong>Noshe Cambridge Team</strong></p>
        </div>
      `,
    };

    const managerEmail = {
      from: '"Noshe Cambridge Bookings" <bookings@noshecambridge.co.uk>',
      to: 'noshecambridge@gmail.com',
      subject: 'New Booking - Noshe Cambridge',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #F5EBE0; color: #333;">
          <h1 style="color: #8B2635; text-align: center;">New Booking Alert</h1>
          <p>A new booking has been made at Noshe Cambridge:</p>
          <div style="background-color: #fff; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="color: #4A5D23; margin-top: 0;">Booking Details:</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Date:</strong> ${date}</p>
            <p><strong>Time:</strong> ${time}</p>
            <p><strong>Number of guests:</strong> ${guests}</p>
            ${specialRequests ? `<p><strong>Special Requests:</strong> ${specialRequests}</p>` : ''}
          </div>
          <p>Please ensure the table is prepared accordingly.</p>
        </div>
      `,
    };

    console.log('Sending customer email');
    await transporter.sendMail(customerEmail);
    console.log('Customer email sent');

    console.log('Sending manager email');
    await transporter.sendMail(managerEmail);
    console.log('Manager email sent');

    return {
      statusCode: 200,
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
      body: JSON.stringify({ success: false, message: 'There was an error processing your booking. Please try again.' }),
    };
  }
};

export { handler };
