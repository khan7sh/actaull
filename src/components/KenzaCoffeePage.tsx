import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coffee } from 'lucide-react';

const CoffeeOption: React.FC<{ name: string; description: string; price: string }> = ({ name, description, price }) => (
  <div className="bg-white bg-opacity-50 rounded-lg p-6 shadow-sm" data-aos="fade-up">
    <h3 className="text-xl font-semibold mb-2 text-burgundy">{name}</h3>
    <p className="text-gray-700 mb-4">{description}</p>
    <span className="text-green font-bold">{price}</span>
  </div>
);

const KenzaCoffeePage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link to="/" className="inline-flex items-center text-burgundy hover:text-green transition-colors mb-8">
          <ArrowLeft className="mr-2" size={24} />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-burgundy mb-8" data-aos="fade-up">Kenza Coffee</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div data-aos="fade-right">
            <p className="text-lg mb-4">
              At Noshe Cambridge, we take immense pride in our house-roasted coffee, Kenza. Our passion for coffee is reflected in every cup we serve and every bag we sell.
            </p>
            <p className="text-lg mb-4">
              Our master roasters carefully select the finest beans from around the world, with a special focus on Afghan and neighboring regions' varieties. Each batch is roasted to perfection, bringing out the unique flavors and aromas that make Kenza Coffee a true delight for coffee enthusiasts.
            </p>
            <p className="text-lg">
              Whether you're enjoying a cup in our restaurant or taking the Kenza experience home with you, we guarantee a coffee experience that's rich, flavorful, and deeply satisfying.
            </p>
          </div>
          <div className="bg-brown p-8 rounded-lg text-cream" data-aos="fade-left">
            <Coffee className="w-16 h-16 mb-4" />
            <h2 className="text-2xl font-serif font-bold mb-4 text-beige">Our Roasting Process</h2>
            <ul className="space-y-2">
              <li>Small-batch roasting for optimal freshness</li>
              <li>Carefully crafted roast profiles for each origin</li>
              <li>Regular cupping sessions to ensure quality</li>
              <li>Sustainable and ethical sourcing practices</li>
              <li>Roasted on-site at Noshe Cambridge</li>
            </ul>
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-burgundy mb-8" data-aos="fade-up">Our Selection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <CoffeeOption 
            name="Raisins" 
            description="Sourced straight from Afghanistan. Sweet and flavorful."
            price="£4"
          />
          <CoffeeOption 
            name="Walnuts" 
            description="Sourced straight from Afghanistan. Crunchy and nutritious."
            price="£4"
          />
          <CoffeeOption 
            name="Sugared Almonds" 
            description="Sourced straight from Afghanistan. A delightful sweet treat."
            price="£5"
          />
          <CoffeeOption 
            name="Afghan Green Tea" 
            description="Sourced straight from Afghanistan. Aromatic and refreshing."
            price="£6"
          />
          <CoffeeOption 
            name="Bukhur Burner" 
            description="Traditional Afghan incense burner. Perfect for creating a cozy atmosphere."
            price="£25"
          />
          <CoffeeOption 
            name="House Roasted Coffee" 
            description="Our signature Kenza coffee, freshly roasted in-house."
            price="£9 / 250g"
          />
        </div>
        
        <div className="bg-green text-cream p-8 rounded-lg" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">Coffee Subscriptions Coming Soon!</h2>
          <p className="text-lg">
            Stay tuned for our upcoming coffee subscription service. Get fresh Kenza coffee and other Afghan delicacies delivered to your door regularly. Sign up for our newsletter to be notified when subscriptions become available.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KenzaCoffeePage;
