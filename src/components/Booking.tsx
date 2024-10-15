import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'

const Booking: React.FC = () => {
  const navigate = useNavigate();

  const handleBookTableClick = () => {
    navigate('/booking');
  };

  return (
    <div id="booking" className="bg-beige text-burgundy py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4" data-aos="fade-up">Reserve Your Table</h2>
        <p className="text-xl mb-8 text-brown" data-aos="fade-up" data-aos-delay="200">Experience the flavors of Afghanistan at Noshe Cambridge</p>
        <div className="flex flex-col items-center space-y-4" data-aos="fade-up" data-aos-delay="300">
          <button onClick={handleBookTableClick} className="book-table-button">Book a Table</button>
          <div className="flex items-center text-xl">
            <Phone className="mr-2" size={24} />
            <span>or call: </span>
            <a href="tel:0764624055" className="ml-1 font-bold hover:underline transition-colors duration-300">0764 624 055</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Booking
