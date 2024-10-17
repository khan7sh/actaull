import React, { useState, useEffect } from 'react';
import { Calendar, BarChart2, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { startOfWeek, endOfWeek, addDays, format } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reportdata'>('bookings');
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 2 }));
  const [weeklyBookings, setWeeklyBookings] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const fetchWeeklyBookings = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const start = startOfWeek(date, { weekStartsOn: 2 });
      const end = endOfWeek(date, { weekStartsOn: 2 });
      const response = await fetch('/.netlify/functions/getWeeklyBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch weekly bookings');
      }
      const data = await response.json();
      setWeeklyBookings(data.bookings);
    } catch (err) {
      console.error('Error fetching weekly bookings:', err);
      setError(`Error fetching weekly bookings: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'reportdata') {
      fetchWeeklyBookings(selectedWeek);
    }
  }, [activeTab, selectedWeek]);

  const handleWeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, week] = e.target.value.split('-W');
    const date = new Date(parseInt(year), 0, 1 + (parseInt(week) - 1) * 7);
    const weekStart = startOfWeek(date, { weekStartsOn: 2 });
    setSelectedWeek(weekStart);
  };

  const formatWeekRange = (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 2 });
    const end = endOfWeek(date, { weekStartsOn: 2 });
    return `${format(start, 'MMM d, yyyy')} - ${format(end, 'MMM d, yyyy')}`;
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-cream">
      {/* Mobile Header */}
      <div className="md:hidden bg-burgundy text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-64 bg-burgundy text-white h-auto md:h-screen transition-all duration-300 ease-in-out ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8 hidden md:block">Admin Panel</h1>
          <nav>
            <button
              onClick={() => {
                setActiveTab('bookings');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center w-full py-3 px-4 rounded-lg transition-colors ${
                activeTab === 'bookings' ? 'bg-white text-burgundy' : 'hover:bg-burgundy-dark'
              }`}
            >
              <Calendar className="mr-3" size={20} />
              Bookings
            </button>
            <button
              onClick={() => {
                setActiveTab('reportdata');
                setIsSidebarOpen(false);
              }}
              className={`flex items-center w-full py-3 px-4 rounded-lg mt-2 transition-colors ${
                activeTab === 'reportdata' ? 'bg-white text-burgundy' : 'hover:bg-burgundy-dark'
              }`}
            >
              <BarChart2 className="mr-3" size={20} />
              Report Data
            </button>
          </nav>
        </div>
        <div className="p-6 md:absolute md:bottom-0 md:w-64">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full py-2 px-4 bg-white text-burgundy rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <LogOut className="mr-2" size={20} />
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-10 overflow-y-auto">
        {activeTab === 'bookings' && (
          <div>
            <h2 className="text-3xl font-bold text-burgundy mb-6">Bookings</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-4">Export All Bookings</h3>
              <button
                onClick={exportAllBookings}
                disabled={isLoading}
                className="bg-burgundy text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition-colors flex items-center disabled:opacity-50 text-lg font-semibold"
              >
                <Calendar className="mr-3" size={24} />
                {isLoading ? 'Exporting...' : 'Export All Bookings'}
              </button>
              {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
            </div>
          </div>
        )}

        {activeTab === 'reportdata' && (
          <div>
            <h2 className="text-3xl font-bold text-burgundy mb-6">Report Data</h2>
            <div className="bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-4">Weekly Booking Report</h3>
              <div className="mb-4">
                <label htmlFor="weekSelect" className="block text-sm font-medium text-gray-700 mb-2">Select Week</label>
                <input
                  type="week"
                  id="weekSelect"
                  value={format(selectedWeek, "yyyy-'W'II")}
                  onChange={handleWeekChange}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-burgundy focus:border-burgundy sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">{formatWeekRange(selectedWeek)}</p>
              </div>
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <div className="h-64 md:h-96">
                  <Bar
                    data={{
                      labels: ['Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon'],
                      datasets: [
                        {
                          label: 'Number of Bookings',
                          data: weeklyBookings,
                          backgroundColor: 'rgba(120, 20, 20, 0.6)',
                          borderColor: 'rgba(120, 20, 20, 1)',
                          borderWidth: 1,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top' as const,
                        },
                        title: {
                          display: true,
                          text: `Bookings for week of ${formatWeekRange(selectedWeek)}`,
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mt-8 bg-white shadow-md rounded-lg p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-4">Additional Reports</h3>
              <p className="text-gray-600">Coming soon, don't worry!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
