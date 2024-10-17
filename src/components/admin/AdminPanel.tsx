import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportAllBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/exportBookings', {
        method: 'POST',
        body: JSON.stringify({ exportAll: true }),
      });
      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `all_bookings.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error exporting bookings. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-burgundy mb-8">Admin Panel</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-burgundy mb-4">Export All Bookings</h2>
          <button
            onClick={exportAllBookings}
            disabled={isLoading}
            className="bg-burgundy text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center disabled:opacity-50"
          >
            <Calendar className="mr-2" size={20} />
            {isLoading ? 'Exporting...' : 'Export All Bookings'}
          </button>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
