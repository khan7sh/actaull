import React from 'react'
import heroImage from '../assets/hero_image.jpg'
import { Link } from 'react-router-dom'

const Hero: React.FC = () => {
  const scrollToBooking = () => {
    const element = document.getElementById('booking')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative bg-cover bg-center min-h-screen flex items-center overflow-hidden" style={{ backgroundImage: `url(${heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" data-aos="fade-up">
          <span className="text-beige">Welcome to</span>{' '}
          <span className="text-beige">Noshe Cambridge</span>
        </h1>
        <div className="max-w-3xl mx-auto" data-aos="fade-up" data-aos-delay="200">
          <p className="text-lg md:text-xl mb-8 font-light text-cream">
            Discover the perfect blend of artisanal coffee house and Afghan restaurant
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center mb-8" data-aos="fade-up" data-aos-delay="300">
          <div className="bg-burgundy bg-opacity-80 p-4 md:p-6 rounded-lg mb-4 md:mb-0 md:mr-4">
            <table className="text-cream text-sm md:text-base">
              <tbody>
                <tr>
                  <td className="px-2 md:px-4 py-1 md:py-2 border-b border-cream">Tuesday - Sunday</td>
                  <td className="px-2 md:px-4 py-1 md:py-2 border-b border-cream">8:00 AM - 10:00 PM</td>
                </tr>
                <tr>
                  <td className="px-2 md:px-4 py-1 md:py-2">Monday</td>
                  <td className="px-2 md:px-4 py-1 md:py-2">Closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4" data-aos="fade-up" data-aos-delay="400">
          <button onClick={scrollToBooking} className="btn btn-primary" data-aos="fade-up" data-aos-delay="500">Book a Table</button>
          <Link to="/menu" className="btn btn-secondary" data-aos="fade-up" data-aos-delay="600">View Menu</Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
