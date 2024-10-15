import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee, Utensils, Globe, Users, Star, Heart } from 'lucide-react';

const AboutUsPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <h2 className="text-3xl font-bold text-burgundy mb-6 flex items-center">
      {icon}
      <span className="ml-3">{title}</span>
    </h2>
  );

  const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <section className={`mb-16 ${className}`} data-aos="fade-up">
      {children}
    </section>
  );

  const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-lg shadow-lg p-8 space-y-6 ${className}`}>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-cream py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-burgundy hover:text-green transition-colors mb-8">
          <ArrowLeft className="mr-2" size={24} />
          Back to Home
        </Link>
        <h1 className="text-5xl font-bold text-burgundy mb-12 text-center" data-aos="fade-up">About Noshe Cambridge</h1>
        
        <Section>
          <SectionTitle icon={<Users size={32} />} title="Our Story" />
          <Card className="bg-white">
            <p className="text-gray-700 leading-relaxed">
              Noshe Cambridge was born from a deep-rooted passion for sharing authentic Afghan flavors and hospitality. Founded in 2024 by a team of food enthusiasts with Afghan heritage, we set out to create a unique space where traditional recipes meet modern culinary techniques.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Our name, "Noshe" (نوش), means "sweet" or "delicious" in Dari, reflecting our commitment to providing a delightful dining experience that captures the essence of Afghan cuisine.
            </p>
          </Card>
        </Section>
        
        <Section>
          <SectionTitle icon={<Coffee size={32} />} title="Kenza Coffee: Our Pride" />
          <Card className="bg-burgundy text-cream">
            <p className="leading-relaxed">
              At the heart of Noshe Cambridge is our house-roasted Kenza Coffee. We carefully source beans from Afghanistan and neighboring regions, working directly with farmers to ensure fair practices and exceptional quality.
            </p>
            <p className="leading-relaxed">
              Kenza Coffee embodies our dedication to craftsmanship and our desire to share a piece of Afghan culture through every cup.
            </p>
          </Card>
        </Section>
        
        <Section>
          <SectionTitle icon={<Utensils size={32} />} title="Noshe Cuisine" />
          <Card className="bg-white">
            <p className="text-gray-700 leading-relaxed">
              Our menu is a celebration of Afghan flavors, featuring both time-honored traditional dishes and innovative creations. We use locally sourced ingredients whenever possible, blending them with authentic Afghan spices and cooking techniques passed down through generations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              From our aromatic rice dishes to our freshly baked naan, every item on our menu is crafted with care and respect for Afghan culinary traditions.
            </p>
          </Card>
        </Section>
        
        <Section>
          <SectionTitle icon={<Globe size={32} />} title="Afghan Culinary Heritage" />
          <Card className="bg-beige">
            <p className="text-gray-800 leading-relaxed">
              Afghanistan's cuisine is as diverse as its landscape, influenced by its position at the crossroads of ancient trade routes. The country's culinary traditions reflect a rich tapestry of flavors, combining elements from Central Asian, Middle Eastern, and South Asian cuisines.
            </p>
            <p className="text-gray-800 leading-relaxed">
              At Noshe Cambridge, we're proud to share this vibrant culinary heritage with our community, introducing you to the depth and diversity of Afghan flavors.
            </p>
          </Card>
        </Section>

        <Section>
          <SectionTitle icon={<Star size={32} />} title="Our Commitment" />
          <Card className="bg-green text-white">
            <ul className="list-disc list-inside space-y-3 pl-4">
              <li>Providing an authentic Afghan dining experience</li>
              <li>Supporting local farmers and suppliers</li>
              <li>Maintaining the highest standards of quality</li>
              <li>Creating a welcoming space for cultural exchange</li>
              <li>Continuously innovating while respecting traditions</li>
            </ul>
          </Card>
        </Section>

        <Section>
          <SectionTitle icon={<Heart size={32} />} title="Community Involvement" />
          <Card className="bg-white">
            <p className="text-gray-700 leading-relaxed">
              At Noshe Cambridge, we believe in giving back to our community. We regularly participate in local events, support charitable causes, and collaborate with other businesses to foster a vibrant, inclusive neighborhood.
            </p>
            <p className="text-gray-700 leading-relaxed">
              We're committed to creating a warm, welcoming space where people from all walks of life can come together to enjoy great food, excellent coffee, and meaningful connections.
            </p>
          </Card>
        </Section>
      </div>
    </div>
  );
}

export default AboutUsPage;
