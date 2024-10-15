import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-burgundy hover:text-green transition-colors mb-8">
          <ArrowLeft className="mr-2" size={24} />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-burgundy mb-8">Privacy Policy</h1>
        <div className="prose prose-burgundy">
          <p>Last updated: [Current Date]</p>
          <p>At Noshe Cambridge, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services.</p>
          
          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you make a reservation, sign up for our newsletter, or contact us. This may include your name, email address, phone number, and any other information you choose to provide.</p>
          
          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process your reservations, to communicate with you, and to send you marketing communications (if you've opted in).</p>
          
          <h2>Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized or unlawful processing, accidental loss, destruction, or damage.</p>
          
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. You may also have the right to restrict or object to certain processing of your data.</p>
          
          <h2>Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at [contact email].</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;