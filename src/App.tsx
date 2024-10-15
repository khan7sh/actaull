import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'
import BookingPage from './components/BookingPage'
import KenzaCoffeePage from './components/KenzaCoffeePage'
import AboutUsPage from './components/AboutUsPage'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import MenuPage from './components/MenuPage'
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/kenza-coffee" element={<KenzaCoffeePage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/menu" element={<MenuPage />} />
      </Routes>
    </Router>
  )
}

export default App
