import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const BookingForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors }, reset } = useForm();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'confirming' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  useEffect(() => {
    if (bookingStatus === 'success') {
      // Scroll to the top of the booking form container
      const formContainer = document.querySelector('.booking-form-container');
      if (formContainer) {
        formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [bookingStatus]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setBookingStatus('confirming');
    setSubmitMessage('');
    
    // Format the data before sending
    const formattedData = {
      ...data,
      date: selectedDate.toISOString(),
      guests: parseInt(data.guests)
    };
    
    try {
      const response = await axios.post('/.netlify/functions/bookingConfirmation', formattedData, {
        timeout: 10000
      });
      
      if (response.data && response.data.success) {
        setBookingStatus('success');
        setSubmitMessage(response.data.message);
        reset();
        setSelectedDate(new Date());
      } else {
        throw new Error(response.data?.message || 'Booking failed');
      }
    } catch (error) {
      setBookingStatus('error');
      setSubmitMessage('There was an error processing your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (bookingStatus === 'success') {
    return (
      <div className="booking-form-container text-center py-8">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif font-semibold text-burgundy mb-4">Thank You for Your Booking!</h3>
        <p className="text-gray-600 mb-6">
          Your reservation has been confirmed. We've sent the details to your email.
        </p>
        <p className="text-gray-600 mb-8">
          We look forward to welcoming you to Noshe Cambridge!
        </p>
        <button
          onClick={() => {
            setBookingStatus('idle');
            setSubmitMessage('');
            // Scroll to top of form container when making another booking
            const formContainer = document.querySelector('.booking-form-container');
            if (formContainer) {
              formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
          className="bg-burgundy text-white py-2 px-6 rounded-md hover:bg-opacity-90 transition-colors"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  const isWeekday = (date: Date) => {
    const day = date.getDay();
    return day !== 1; // 1 represents Monday
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 14; hour <= 21; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(<option key={time} value={time}>{time}</option>);
      }
    }
    return options;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="booking-form-container space-y-6">
      <h3 className="text-2xl font-serif font-semibold text-burgundy mb-6">Reserve Your Table</h3>
      
      <div className="mb-4">
        <p className="text-red-600 font-medium">Please note: We are closed on Mondays.</p>
      </div>

      <div className="mb-8">
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
        <Controller
          control={control}
          name="date"
          rules={{ required: "Please select a date" }}
          render={({ field }) => (
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date) => {
                const utcDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
                setSelectedDate(utcDate);
                field.onChange(utcDate.toISOString());
              }}
              filterDate={isWeekday}
              inline
              className="w-full"
              calendarClassName="custom-datepicker mx-auto"
            />
          )}
        />
        {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date.message as string}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <select
            id="time"
            {...register("time", { required: "Time is required" })}
            className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            <option value="">Select time</option>
            {generateTimeOptions()}
          </select>
          {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time.message as string}</p>}
        </div>

        <div>
          <label htmlFor="guests" className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
          <select
            id="guests"
            {...register("guests", { required: "Number of guests is required" })}
            className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            <option value="">Select guests</option>
            {[...Array(14)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? 'guest' : 'guests'}</option>
            ))}
          </select>
          {errors.guests && <p className="mt-1 text-sm text-red-600">{errors.guests.message as string}</p>}
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          id="name"
          {...register("name", { required: "Name is required" })}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          id="email"
          {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } })}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input
          type="tel"
          id="phone"
          {...register("phone", { required: "Phone number is required", pattern: { value: /^[0-9+\-\s()]+$/, message: "Invalid phone number" } })}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message as string}</p>}
      </div>

      <div>
        <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
        <textarea
          id="specialRequests"
          {...register("specialRequests")}
          rows={5}
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out h-32"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-burgundy text-white py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150 disabled:opacity-50"
        disabled={isSubmitting}
      >
        {bookingStatus === 'confirming' ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Confirming Booking...
          </span>
        ) : (
          'Book Table'
        )}
      </button>

      {submitMessage && (
        <div className={`mt-4 p-4 rounded-md ${
          bookingStatus === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
        }`}>
          <p className="text-center">{submitMessage}</p>
        </div>
      )}
    </form>
  );
};

export default BookingForm;
