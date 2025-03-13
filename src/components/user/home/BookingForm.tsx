
import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, ChevronDown } from 'lucide-react';
import LocationSearch from './LocationSearch';
import RideOptions from './RideOptions';

const BookingForm = () => {
  const [bookingStep, setBookingStep] = useState<'location' | 'ride'>('location');
  const [scheduleRide, setScheduleRide] = useState(false);

  const handleContinue = () => {
    setBookingStep('ride');
  };

  const handleBack = () => {
    setBookingStep('location');
  };

  return (
    <div className="w-full max-w-md transition-all duration-300 ease-in-out">
      <div className="glass-card rounded-xl overflow-hidden uber-shadow animate-fade-up">
        <div className="p-5">
          <h2 className="text-2xl font-semibold mb-6">
            {bookingStep === 'location' ? 'Request a ride' : 'Choose your ride'}
          </h2>
          
          {bookingStep === 'location' ? (
            <>
              <LocationSearch />
              
              {/* Ride scheduling option */}
              <div className="mt-6">
                <button 
                  className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors"
                  onClick={() => setScheduleRide(!scheduleRide)}
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-3 text-gray-700" />
                    <span className="font-medium">{scheduleRide ? 'Schedule for later' : 'Ride now'}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${scheduleRide ? 'transform rotate-180' : ''}`} />
                </button>
                
                {scheduleRide && (
                  <div className="mt-4 animate-fade-in">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <div className="relative">
                          <input 
                            type="date" 
                            className="w-full border border-gray-200 rounded-lg p-3 pr-10"
                          />
                          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <div className="relative">
                          <input 
                            type="time" 
                            className="w-full border border-gray-200 rounded-lg p-3 pr-10"
                          />
                          <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Payment method */}
              <div className="mt-4">
                <button className="w-full flex items-center justify-between border border-gray-200 rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-3 text-gray-700" />
                    <span className="font-medium">Personal • Visa 1234</span>
                  </div>
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              
              <button 
                className="w-full bg-uber-default text-black py-3 rounded-lg font-medium mt-6 hover:bg-uber-light transition-colors"
                onClick={handleContinue}
              >
                Continue
              </button>
            </>
          ) : (
            <>
              <div className="mb-6 flex items-center text-sm">
                <button 
                  className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
                  onClick={handleBack}
                >
                  <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Back
                </button>
                <div className="flex-1 text-center mr-6">
                  <div className="bg-gray-100 rounded-full py-1 px-3 inline-flex items-center">
                    <Clock className="h-3 w-3 mr-1 text-gray-500" />
                    <span className="text-xs">{scheduleRide ? 'Scheduled ride' : '5 min'}</span>
                  </div>
                </div>
              </div>
              
              <RideOptions />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
