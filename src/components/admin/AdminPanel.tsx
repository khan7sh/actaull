import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const AdminPanel: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedAuth = localStorage.getItem('adminAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate]);

  const fetchBookings = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const formattedDate = date.toISOString().split('T')[0]; // Format date as YYYY-MM-DD
      const response = await fetch('/.netlify/functions/getBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: formattedDate }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      const data = await response.json();
      console.log('Fetched bookings:', data.bookings);
      setBookings(data.bookings);
    } catch (err) {
      setError('Error fetching bookings. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'restcafe') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuthenticated', 'true');
    } else {
      alert('Incorrect username or password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuthenticated');
    navigate('/');
  };

  const exportBookings = async () => {
    try {
      const response = await fetch('/.netlify/functions/exportBookings', {
        method: 'POST',
        body: JSON.stringify({ date: selectedDate.toISOString() }),
      });
      if (!response.ok) {
        throw new Error('Failed to export bookings');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `bookings_${selectedDate.toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Error exporting bookings. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {!isAuthenticated ? (
        <div className="flex items-center justify-center h-screen">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-burgundy">Admin Login</h2>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mb-4 border rounded"
              placeholder="Password"
            />
            <button type="submit" className="w-full bg-burgundy text-white p-2 rounded">
              Login
            </button>
          </form>
        </div>
      ) : (
        <>
          <header className="bg-burgundy text-cream p-4">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Noshe Cambridge Admin</h1>
              <button
                onClick={handleLogout}
                className="flex items-center text-cream hover:text-beige transition-colors"
              >
                <LogOut className="mr-2" size={20} />
                Logout
              </button>
            </div>
          </header>
          <main className="container mx-auto py-8 px-4">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-burgundy">Bookings</h2>
              <div className="flex items-center">
                <Calendar className="mr-2" size={24} />
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="MMMM d, yyyy"
                  className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-burgundy"
                />
              </div>
            </div>
            <button
              onClick={exportBookings}
              className="mb-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Export Bookings
            </button>
            {isLoading ? (
              <p className="text-center text-gray-600">Loading bookings...</p>
            ) : error ? (
              <p className="text-center text-red-600">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-600">No bookings for this date.</p>
            ) : (
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-burgundy text-cream">
                    <tr>
                      <th className="px-4 py-2 text-left">Time</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Guests</th>
                      <th className="px-4 py-2 text-left">Contact</th>
                      <th className="px-4 py-2 text-left">Special Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2">{booking.time}</td>
                        <td className="px-4 py-2">{booking.name}</td>
                        <td className="px-4 py-2">{booking.guests}</td>
                        <td className="px-4 py-2">
                          <a href={`mailto:${booking.email}`} className="text-burgundy hover:underline">{booking.email}</a>
                          <br />
                          <a href={`tel:${booking.phone}`} className="text-burgundy hover:underline">{booking.phone}</a>
                        </td>
                        <td className="px-4 py-2">{booking.specialRequests || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
