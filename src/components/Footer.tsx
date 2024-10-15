import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <footer className="bg-brown text-cream py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4 text-cream">Contact Us</h3>
          <ul className="space-y-2 text-base">
            <li className="flex items-center">
              <MapPin className="mr-2 flex-shrink-0" size={18} />
              <span>123 Mill Road, Cambridge, CB1 2AZ</span>
            </li>
            <li className="flex items-center">
              <Phone className="mr-2 flex-shrink-0" size={18} />
              <span>+44 (0)1223 123456</span>
            </li>
            <li className="flex items-center">
              <Mail className="mr-2 flex-shrink-0" size={18} />
              <span>info@noshecambridge.co.uk</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-cream">Opening Hours</h3>
          <ul className="space-y-2 text-base">
            <li className="flex items-center">
              <Clock className="mr-2 flex-shrink-0" size={18} />
              <span>Tue-Sun: 8:00 AM - 10:00 PM</span>
            </li>
            <li className="flex items-center">
              <Clock className="mr-2 flex-shrink-0" size={18} />
              <span>Mon: Closed</span>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold mb-4 text-cream">Follow Us</h3>
          <a href="https://www.instagram.com/noshecambridge" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-green transition-colors text-base">
            <Instagram className="mr-2" size={18} />
            @noshecambridge
          </a>
          <div className="mt-8">
            <h4 className="font-semibold mb-2 text-cream">Legal</h4>
            <ul className="space-y-1 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-green transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-green transition-colors">Terms of Service</Link></li>
              <li><a href="#" className="hover:text-green transition-colors">Allergen Information</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="container mx-auto mt-8 pt-8 border-t border-cream border-opacity-20 text-center text-sm">
        © 2023 Noshe Cambridge. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer