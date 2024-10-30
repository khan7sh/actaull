import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import HomePage from './components/HomePage'
import BookingPage from './components/BookingPage'
import KenzaCoffeePage from './components/KenzaCoffeePage'
import AboutUsPage from './components/AboutUsPage'
import PrivacyPolicy from './components/PrivacyPolicy'
import TermsOfService from './components/TermsOfService'
import MenuPage from './components/MenuPage'
import AdminLogin from './components/admin/AdminLogin'
import AdminPanel from './components/admin/AdminPanel'
import { ErrorBoundary } from 'react-error-boundary'
import BuildInfo from './components/BuildInfo'

function ErrorFallback({error}) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg">
        <h1 className="text-2xl text-burgundy mb-4">Something went wrong</h1>
        <pre className="text-red-600 text-sm overflow-auto">{error.message}</pre>
      </div>
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/kenza-coffee" element={<KenzaCoffeePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/notin" element={<AdminLogin />} />
          <Route path="/notsiyar" element={<AdminPanel />} />
        </Routes>
        <BuildInfo />
      </Router>
    </ErrorBoundary>
  )
}

export default App
