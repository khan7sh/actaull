import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, ShoppingBag } from 'lucide-react';

const MenuPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-burgundy hover:text-green transition-colors mb-8">
          <ArrowLeft className="mr-2" size={20} />
          Back to Home
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold text-burgundy mb-4 text-center">Our Menu</h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">Discover our delightful selection of coffee and treats</p>
        
        <div className="w-full aspect-[1/1.414] mb-8 rounded-lg overflow-hidden shadow-xl">
          <img 
            src="/src/assets/menu-thumbnail.jpg" 
            alt="Menu Thumbnail" 
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => window.open('/src/assets/menu.pdf', '_blank')}
          />
        </div>
        
        <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4 mb-12">
          <a 
            href="/menu.pdf" 
            download 
            className="btn btn-primary w-full md:w-auto"
          >
            <Download className="mr-2" size={20} />
            Download Menu
          </a>
          <a 
            href="https://noshe-orders.pharmix.co.uk/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-secondary w-full md:w-auto"
          >
            <ShoppingBag className="mr-2" size={20} />
            Order Online
          </a>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-burgundy mb-4 text-center">Additional Information</h2>
          <p className="text-lg text-gray-700 mb-4 text-center">
            Please note: A 10% service charge is automatically added to your bill.
          </p>
          <p className="text-lg text-gray-700 text-center">
            <span className="font-semibold">(Vg)</span> - Vegan | <span className="font-semibold">(V)</span> - Vegetarian | <span className="font-semibold">*</span> - Gluten Free
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;