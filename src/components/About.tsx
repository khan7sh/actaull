import React from 'react'
import { Utensils, Coffee, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'

const AboutFeature: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center text-center mb-8 md:mb-0" data-aos="fade-up">
    <div className="bg-cream rounded-full p-4 mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2 text-beige">{title}</h3>
    <p className="text-base text-cream">{description}</p>
  </div>
)

const About: React.FC = () => {
  return (
    <section id="about" className="bg-burgundy text-cream">
      <div className="container mx-auto">
        <h2 className="section-title section-title-light text-center mb-12" data-aos="fade-up">About Noshe Cambridge</h2>
        <div className="max-w-3xl mx-auto text-center mb-16" data-aos="fade-up" data-aos-delay="200">
          <p className="text-xl font-light leading-relaxed mb-8">
            Noshe (نوش) Cambridge, meaning "sweet" or "delicious" in Dari, brings the rich flavors of Afghanistan to the heart of Cambridge. Opened in early 2024, we blend traditional recipes with modern techniques, using locally sourced ingredients to create an authentic dining experience.
          </p>
          <Link to="/about-us" className="btn bg-cream text-burgundy hover:bg-opacity-90 transition-colors">
            Learn More
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <AboutFeature 
            icon={<Utensils className="w-8 h-8 text-burgundy" />}
            title="Traditional Recipes"
            description="Authentic Afghan dishes prepared with care and expertise"
          />
          <AboutFeature 
            icon={<Coffee className="w-8 h-8 text-burgundy" />}
            title="House-Roasted Coffee"
            description="Our Kenza coffee, roasted in-house for the perfect cup"
          />
          <AboutFeature 
            icon={<Heart className="w-8 h-8 text-burgundy" />}
            title="Local Ingredients"
            description="Fresh, locally sourced produce for the best quality and flavor"
          />
        </div>
      </div>
    </section>
  )
}

export default About
