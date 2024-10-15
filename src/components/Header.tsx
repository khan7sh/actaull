import React, { useState, useEffect } from 'react'
import { Menu as MenuIcon, X } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  const scrollToSection = (id: string) => {
    if (id === 'booking') {
      navigate('/booking');
      setIsMenuOpen(false);
    } else if (location.pathname !== '/') {
      window.location.href = `/#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMenuOpen(false);
      }
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Menu', id: 'menu' },
    { name: 'Kenza Coffee', id: 'coffee' },
    { name: 'About', id: 'about' },
    { name: 'FAQ', id: 'faq' },
  ]

  return (
    <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-burgundy shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center">
            <span className="font-serif text-2xl md:text-3xl font-bold text-cream">Noshe Cambridge</span>
          </Link>
          <nav className="hidden lg:flex items-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-cream hover:text-beige transition-colors duration-300 font-medium text-lg"
              >
                {item.name}
              </button>
            ))}
            <Link
              to="/booking"
              className="btn btn-primary text-cream hover:bg-opacity-90 transition-colors duration-300 font-medium text-lg px-4 py-2 rounded-md"
            >
              Book a Table
            </Link>
          </nav>
          <button className="lg:hidden text-cream" onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <MenuIcon size={28} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden bg-burgundy">
          <nav className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-cream hover:text-beige transition-colors duration-300 py-2 font-medium text-lg"
              >
                {item.name}
              </button>
            ))}
            <Link
              to="/booking"
              className="btn btn-primary w-full text-left text-cream hover:bg-opacity-90 transition-colors duration-300 py-2 font-medium text-lg mt-2 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Table
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
