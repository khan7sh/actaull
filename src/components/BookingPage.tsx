import React from 'react';
import { Link } from 'react-router-dom';
import BookingForm from './BookingForm';
import Footer from './Footer';
import { Phone } from 'lucide-react';

const BookingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <Link to="/" className="inline-block mb-8 text-burgundy hover:text-opacity-80 transition-colors">
            <span className="flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Go Back
            </span>
          </Link>
          <h1 className="text-5xl font-bold text-center mb-12 text-burgundy">Book Your Table</h1>
          <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/3 bg-burgundy p-6 text-white">
                <h2 className="text-2xl font-semibold mb-4">Reservation Details</h2>
                <p className="mb-4 text-base">Experience the flavors of Afghanistan at Noshe Cambridge. Reserve your table now and embark on a culinary journey.</p>
                <ul className="list-none mb-4 space-y-2 text-base">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Authentic Afghan cuisine
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Cozy and welcoming atmosphere
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Perfect for special occasions
                  </li>
                </ul>
                <div className="mt-4 p-4 bg-cream bg-opacity-20 rounded-lg border-2 border-cream border-opacity-30 text-sm">
                  <h3 className="text-xl font-semibold mb-2">Opening Hours</h3>
                  <p className="mb-1">Tuesday - Sunday: 8:00 AM - 10:00 PM</p>
                  <p className="font-bold">Closed on Mondays</p>
                </div>
                <div className="mt-4 p-4 bg-cream bg-opacity-20 rounded-lg border-2 border-cream border-opacity-30 text-sm">
                  <h3 className="text-xl font-semibold mb-2">Prefer to book by phone?</h3>
                  <p className="flex items-center">
                    <Phone className="mr-2" size={18} />
                    <span>Call us at: </span>
                    <a href="tel:0764624055" className="ml-1 font-bold hover:underline transition-colors duration-300">
                      0764 624 055
                    </a>
                  </p>
                </div>
              </div>
              <div className="md:w-2/3 p-6">
                <BookingForm />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;