import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

const Root = () => {
  useEffect(() => {
    AOS.init({
      duration: 600, // Reduced from 800 to 600 for quicker, smoother animations
      once: true,
      easing: 'ease-out',
      offset: 50, // Reduced from 100 to 50 for earlier animation start
      delay: 50, // Reduced from 100 to 50 for quicker response
    })
  }, [])

  return (
    <StrictMode>
      <App />
    </StrictMode>
  )
}
createRoot(document.getElementById('root')!).render(<Root />)
