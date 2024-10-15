import React from 'react'
import Header from './Header'
import Hero from './Hero'
import Menu from './Menu'
import Booking from './Booking'
import About from './About'
import KenzaCoffee from './KenzaCoffee'
import FAQ from './FAQ'
import Footer from './Footer'

const HomePage: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Menu />
      <Booking />
      <KenzaCoffee />
      <About />
      <FAQ />
      <Footer />
    </>
  )
}

export default HomePage
