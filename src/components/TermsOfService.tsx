import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center text-burgundy hover:text-green transition-colors mb-8">
          <ArrowLeft className="mr-2" size={24} />
          Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-burgundy mb-8">Terms of Service</h1>
        <div className="prose prose-burgundy">
          <p>Last updated: [Current Date]</p>
          <p>Please read these Terms of Service carefully before using the Noshe Cambridge website or services.</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          
          <h2>2. Use of Website</h2>
          <p>You may use our website for lawful purposes only. You must not use our website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website.</p>
          
          <h2>3. Reservations and Cancellations</h2>
          <p>Reservations made through our website are subject to availability. We reserve the right to cancel or modify reservations in certain circumstances. Please refer to our reservation policy for more details.</p>
          
          <h2>4. Intellectual Property</h2>
          <p>The content on our website, including text, graphics, logos, and images, is the property of Noshe Cambridge and is protected by copyright and other intellectual property laws.</p>
          
          <h2>5. Limitation of Liability</h2>
          <p>Noshe Cambridge shall not be liable for any indirect, incidental, special, consequential or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.</p>
          
          <h2>6. Changes to Terms</h2>
          <p>We reserve the right to modify or replace these Terms of Service at any time. It is your responsibility to check these Terms periodically for changes.</p>
          
          <h2>7. Contact Us</h2>
          <p>If you have any questions about these Terms of Service, please contact us at [contact email].</p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;