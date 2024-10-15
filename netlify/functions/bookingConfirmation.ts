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
      text: `Dear ${name},

Thank you for booking a table at Noshe Cambridge. Your reservation details are as follows:

Date: ${date}
Time: ${time}
Number of guests: ${guests}
${specialRequests ? `Special Requests: ${specialRequests}` : ''}

We look forward to welcoming you!

Best regards,
Noshe Cambridge Team`,
    };

    const managerEmail = {
      from: '"Noshe Cambridge Bookings" <bookings@noshecambridge.co.uk>',
      to: 'khan7akh@gmail.com',
      subject: 'New Booking - Noshe Cambridge',
      text: `A new booking has been made:

Name: ${name}
Email: ${email}
Phone: ${phone}
Date: ${date}
Time: ${time}
Number of guests: ${guests}
${specialRequests ? `Special Requests: ${specialRequests}` : ''}`,
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