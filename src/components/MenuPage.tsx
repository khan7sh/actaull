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
        <h1 className="text-5xl font-bold text-burgundy mb-4 text-center">Our Menu</h1>
        <p className="text-xl text-gray-600 mb-8 text-center">Discover our delightful selection of coffee and treats</p>
        
        <div className="w-full aspect-[1/1.414] mb-8 rounded-lg overflow-hidden shadow-xl">
          <iframe 
            src="/menu.pdf" 
            className="w-full h-full border-none"
            title="Kenza Coffee Menu"
          >
            This browser does not support PDFs. Please download the PDF to view it.
          </iframe>
        </div>
        
        <div className="flex justify-center space-x-4 mb-12">
          <a 
            href="/menu.pdf" 
            download 
            className="inline-flex items-center bg-burgundy text-white py-3 px-6 rounded-full hover:bg-green transition-colors shadow-md"
          >
            <Download className="mr-2" size={20} />
            Download Menu
          </a>
          <a 
            href="https://noshe-orders.pharmix.co.uk/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green text-white py-3 px-6 rounded-full hover:bg-burgundy transition-colors shadow-md"
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