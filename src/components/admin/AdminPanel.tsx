import React, { useState, useEffect } from 'react';
import { Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isAdminLoggedIn');
    if (!isLoggedIn) {
      navigate('/notin');
    }
  }, [navigate]);

  const exportAllBookings = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/exportBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ exportAll: true }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export bookings');
      }
      const blob = await response.blob();
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const text = await blob.text();
        const data = JSON.parse(text);
        throw new Error(data.error || 'Unexpected response format');
      }
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `all_bookings.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting bookings:', err);
      setError(`Error exporting bookings: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdminLoggedIn');
    navigate('/notin');
  };

  return (
    <div className="min-h-screen bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-burgundy">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-burgundy text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center"
          >
            <LogOut className="mr-2" size={20} />
            Log Out
          </button>
        </div>
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
