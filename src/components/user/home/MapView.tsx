
import React from 'react';
import { MapPin, Navigation, Car } from 'lucide-react';

const MapView = () => {
  return (
    <div className="w-full h-[500px] md:h-full relative rounded-xl overflow-hidden">
      {/* Map placeholder - In a real application, this would be replaced with a map library integration */}
      <div className="absolute inset-0 bg-gray-200">
        <img 
          src='/images/map.png'
          alt="Map" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* Map elements */}
      <div className="absolute inset-0 z-10">
        {/* Pickup marker */}
        <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white py-1 px-2 rounded-full text-xs shadow-md whitespace-nowrap">
              Pickup Location
            </div>
            <div className="h-4 w-4 rounded-full bg-uber-accent border-2 border-white shadow-lg"></div>
          </div>
        </div>
        
        {/* Destination marker */}
        <div className="absolute left-2/3 top-2/3 transform -translate-x-1/2 -translate-y-full">
          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white py-1 px-2 rounded-full text-xs shadow-md whitespace-nowrap">
              Destination
            </div>
            <MapPin className="h-6 w-6 text-uber-default" strokeWidth={2.5} />
          </div>
        </div>
        
        {/* Driver car */}
        <div className="absolute left-1/3 top-2/5 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-white py-1 px-2 rounded-full text-xs shadow-md whitespace-nowrap">
              Your Driver
            </div>
            <div className="bg-white p-1 rounded-full shadow-lg">
              <Car className="h-4 w-4 text-uber-default" />
            </div>
          </div>
        </div>
        
        {/* Route line - Simplified representation */}
        <svg className="absolute inset-0 h-full w-full" style={{ pointerEvents: 'none' }}>
          <path
            d="M 400,200 C 450,300 500,350 550,400"
            stroke="#2176ff"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
          />
        </svg>
      </div>
      
      {/* Map controls */}
      <div className="absolute bottom-6 right-6 flex flex-col space-y-3">
        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
          <Navigation className="h-5 w-5 text-gray-700" />
        </button>
        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
          <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <button className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors">
          <svg className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 13H5" />
          </svg>
        </button>
      </div>
      
      {/* Glass overlay at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 glass h-16 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Estimated arrival</p>
          <p className="text-xs text-gray-600">5-10 min • 3.2 mi</p>
        </div>
        <button className="bg-uber-default text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-uber-light transition-colors">
          Details
        </button>
      </div>
    </div>
  );
};

export default MapView;
