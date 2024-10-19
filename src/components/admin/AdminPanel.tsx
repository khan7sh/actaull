import React, { useState, useEffect } from 'react';
import { Calendar, BarChart2, LogOut, Menu, Download, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import ReactCalendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import EditBookingModal from './EditBookingModal';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'bookings' | 'reportdata'>('bookings');
  const navigate = useNavigate();
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date(), { weekStartsOn: 2 }));
  const [weeklyBookings, setWeeklyBookings] = useState<number[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dailyBookings, setDailyBookings] = useState<any[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);

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
      console.log('Fetching bookings for date range:', start.toISOString(), 'to', end.toISOString());
      
      const response = await fetch('/.netlify/functions/getWeeklyBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ start: start.toISOString(), end: end.toISOString() }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          console.log('No data found for the selected week');
          setWeeklyBookings([0, 0, 0, 0, 0, 0, 0]);
        } else {
          const errorText = await response.text();
          console.error('Error response:', response.status, errorText);
          throw new Error(`Failed to fetch weekly bookings: ${response.status} ${response.statusText}`);
        }
      } else {
        const data = await response.json();
        console.log('Received data:', data);
        setWeeklyBookings(data.bookings.length > 0 ? data.bookings : [0, 0, 0, 0, 0, 0, 0]);
      }
    } catch (err) {
      console.error('Error fetching weekly bookings:', err);
      setError(`Error fetching weekly bookings: ${err instanceof Error ? err.message : String(err)}`);
      setWeeklyBookings([0, 0, 0, 0, 0, 0, 0]);
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

  const exportBookingsForDate = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/.netlify/functions/exportBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: date.toISOString(), exportType: 'daily' }),
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
      a.download = `bookings_${format(date, 'yyyy-MM-dd')}.csv`;
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
  const fetchDailyBookings = async (date: Date) => {
    setIsLoading(true);
    setError(null);
    try {
      const localDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
      const response = await fetch('/.netlify/functions/getBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date: localDate.toISOString() }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch daily bookings: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDailyBookings(data.bookings.map(booking => ({
        ...booking,
        date: new Date(booking.date)
      })));
    } catch (err) {
      console.error('Error fetching daily bookings:', err);
      setError(`Error fetching daily bookings: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      fetchDailyBookings(selectedDate);
    } else if (activeTab === 'reportdata') {
      fetchWeeklyBookings(selectedWeek);
    }
  }, [activeTab, selectedDate, selectedWeek]);
  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      setCancellingBookingId(bookingId);
      setError(null);
      try {
        const response = await fetch('/.netlify/functions/cancelBooking', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId }),
        });

        if (!response.ok) {
          throw new Error('Failed to cancel booking');
        }

        setSuccessMessage('Booking cancelled successfully');
        setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds

        // Refresh the bookings list
        fetchDailyBookings(selectedDate);
      } catch (err) {
        console.error('Error cancelling booking:', err);
        setError(`Error cancelling booking: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setCancellingBookingId(null);
      }
    }
  };

  const handleEditBooking = (booking: any) => {
    setEditingBooking(booking);
  };

  const handleSaveEditedBooking = async (updatedBooking: any) => {
    try {
      const response = await fetch('/.netlify/functions/editBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedBooking),
      });

      if (!response.ok) {
        throw new Error('Failed to edit booking');
      }

      setSuccessMessage('Booking updated successfully');
      setEditingBooking(null);
      fetchDailyBookings(selectedDate);
    } catch (error) {
      console.error('Error editing booking:', error);
      setError(`Error editing booking: ${error instanceof Error ? error.message : String(error)}`);
    }
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white shadow-md rounded-lg p-4 lg:p-6">
                <h3 className="text-xl font-semibold text-burgundy mb-4">Select Date</h3>
                <ReactCalendar
                  onChange={(date) => {
                    setSelectedDate(date as Date);
                    fetchDailyBookings(date as Date);
                  }}
                  value={selectedDate}
                  className="w-full max-w-full"
                />
                <div className="mt-4 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={exportAllBookings}
                    disabled={isLoading}
                    className="bg-burgundy text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center disabled:opacity-50 text-sm font-semibold w-full sm:w-auto"
                  >
                    <Download className="mr-2" size={18} />
                    Export All
                  </button>
                  <button
                    onClick={() => exportBookingsForDate(selectedDate)}
                    disabled={isLoading}
                    className="bg-burgundy text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex items-center justify-center disabled:opacity-50 text-sm font-semibold w-full sm:w-auto"
                  >
                    <Download className="mr-2" size={18} />
                    Export Selected Date
                  </button>
                </div>
              </div>
              <div className="bg-white shadow-md rounded-lg p-4 lg:p-6">
                <h3 className="text-xl font-semibold text-burgundy mb-4">
                  Bookings for {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                {isLoading ? (
                  <p>Loading...</p>
                ) : error ? (
                  <p className="text-red-600">{error}</p>
                ) : dailyBookings.length === 0 ? (
                  <p>No bookings for this date.</p>
                ) : (
                  <ul className="space-y-4">
                    {dailyBookings.map((booking, index) => (
                      <li key={index} className="border-b pb-2 flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <User className="mr-2" size={18} />
                            <span className="font-semibold">{booking.name}</span>
                          </div>
                          <p>Date: {format(new Date(booking.date), 'yyyy-MM-dd', { timeZone: 'UTC' })}</p>
                          <p>Time: {booking.time}</p>
                          <p>Guests: {booking.guests}</p>
                          {booking.specialRequests && (
                            <p className="text-sm text-gray-600">
                              Special Requests: {booking.specialRequests}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingBookingId === booking.id}
                          className={`px-3 py-1 rounded-md transition-colors ${
                            cancellingBookingId === booking.id
                              ? 'bg-gray-400 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600'
                          } text-white`}
                        >
                          {cancellingBookingId === booking.id ? 'Cancelling...' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="px-3 py-1 rounded-md transition-colors bg-blue-500 hover:bg-blue-600 text-white ml-2"
                        >
                          Edit
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            {error && <p className="text-red-600 mt-4 text-sm">{error}</p>}
            {successMessage && (
              <p className="mt-4 text-green-600 text-center">{successMessage}</p>
            )}
          </div>
        )}

        {activeTab === 'reportdata' && (
          <div>
            <h2 className="text-3xl font-bold text-burgundy mb-6">Report Data</h2>
            <div className="bg-white shadow-md rounded-lg p-4 lg:p-6">
              <h3 className="text-xl font-semibold text-burgundy mb-4">Weekly Booking Report</h3>
              <div className="mb-4">
                <label htmlFor="weekSelect" className="block text-sm font-medium text-gray-700 mb-2">Select Week</label>
                <input
                  type="date"
                  id="weekSelect"
                  value={format(selectedWeek, "yyyy-MM-dd")}
                  onChange={(e) => {
                    const date = new Date(e.target.value);
                    setSelectedWeek(startOfWeek(date, { weekStartsOn: 2 }));
                  }}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-burgundy focus:border-burgundy sm:text-sm"
                />
                <p className="mt-1 text-sm text-gray-500">{formatWeekRange(selectedWeek)}</p>
              </div>
              {isLoading ? (
                <p>Loading...</p>
              ) : error ? (
                <p className="text-red-600">{error}</p>
              ) : (
                <div className="h-64 sm:h-96">
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
                          labels: {
                            boxWidth: 10,
                            font: {
                              size: 10,
                            },
                          },
                        },
                        title: {
                          display: true,
                          text: `Bookings for week of ${formatWeekRange(selectedWeek)}`,
                          font: {
                            size: 12,
                          },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                            font: {
                              size: 10,
                            },
                          },
                        },
                        x: {
                          ticks: {
                            font: {
                              size: 10,
                            },
                          },
                        },
                      },
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSave={handleSaveEditedBooking}
        />
      )}
    </div>
  );
};

export default AdminPanel;
