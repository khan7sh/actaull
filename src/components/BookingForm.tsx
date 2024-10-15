import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';

const BookingForm: React.FC = () => {
  const { register, handleSubmit, control, formState: { errors } } = useForm();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setSubmitMessage('');
    try {
      const response = await axios.post('/.netlify/functions/bookingConfirmation', data);
      console.log('Response:', response.data); // Add this line for debugging
      if (response.data.success) {
        setSubmitMessage('Booking confirmed! Check your email for details.');
      } else {
        setSubmitMessage(response.data.message || 'There was an error processing your booking. Please try again.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitMessage('There was an error processing your booking. Please try again.');
    }
    setIsSubmitting(false);
  };

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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                setSelectedDate(date);
                field.onChange(date);
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
          className="block w-full px-4 py-3 rounded-md border-gray-300 shadow-sm focus:border-burgundy focus:ring focus:ring-burgundy focus:ring-opacity-50 transition duration-150 ease-in-out"
          rows={6}
          placeholder="Any special requests, dietary requirements, or additional information?"
        ></textarea>
      </div>

      <button 
        type="submit" 
        className="w-full bg-burgundy text-white py-3 px-4 rounded-md hover:bg-opacity-90 transition-colors text-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-150"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Booking...' : 'Book Table'}
      </button>

      {submitMessage && (
        <p className={`mt-4 text-center ${submitMessage.includes('error') ? 'text-red-600' : 'text-green-600'}`}>
          {submitMessage}
        </p>
      )}
    </form>
  );
};

export default BookingForm;
