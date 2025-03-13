
import React, { useState } from 'react';
import { MapPin, Search, Circle, ArrowDown } from 'lucide-react';

const LocationSearch = () => {
  const [pickupValue, setPickupValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeInput, setActiveInput] = useState<'pickup' | 'destination' | null>(null);

  // Mock location suggestions
  const locationSuggestions = [
    { id: 1, name: 'Current Location', address: 'Using GPS' },
    { id: 2, name: 'San Francisco Airport (SFO)', address: 'San Francisco, CA 94128' },
    { id: 3, name: 'Union Square', address: '333 Post St, San Francisco, CA' },
    { id: 4, name: 'Golden Gate Park', address: 'San Francisco, CA' },
    { id: 5, name: 'Fisherman\'s Wharf', address: 'Beach Street & The Embarcadero' },
  ];

  const handleInputFocus = (inputType: 'pickup' | 'destination') => {
    setActiveInput(inputType);
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicking on them
    setTimeout(() => {
      setShowSuggestions(false);
      setActiveInput(null);
    }, 200);
  };

  const handleSuggestionClick = (suggestion: { name: string, address: string }) => {
    if (activeInput === 'pickup') {
      setPickupValue(suggestion.name);
    } else {
      setDestinationValue(suggestion.name);
    }
    setShowSuggestions(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="p-3">
          <div className="flex items-start">
            {/* Left icons */}
            <div className="flex flex-col items-center mr-3 pt-3">
              <Circle className="h-3 w-3 text-uber-accent" fill="currentColor" />
              <div className="h-14 w-0.5 bg-gray-300 mx-auto my-1"></div>
              <MapPin className="h-4 w-4 text-uber-default" />
            </div>
            
            {/* Inputs */}
            <div className="flex-1">
              <div className="relative mb-2">
                <input
                  type="text"
                  className="w-full px-3 py-3 text-sm border-b border-gray-200 focus:outline-none transition-all duration-200"
                  placeholder="Enter pickup location"
                  value={pickupValue}
                  onChange={(e) => setPickupValue(e.target.value)}
                  onFocus={() => handleInputFocus('pickup')}
                  onBlur={handleInputBlur}
                />
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-3 py-3 text-sm focus:outline-none transition-all duration-200"
                  placeholder="Enter destination"
                  value={destinationValue}
                  onChange={(e) => setDestinationValue(e.target.value)}
                  onFocus={() => handleInputFocus('destination')}
                  onBlur={handleInputBlur}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Location suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-xl p-2 z-10 uber-shadow animate-fade-in">
          <div className="mb-2 px-3 pt-2 pb-1">
            <p className="text-xs font-medium text-gray-500">SUGGESTED LOCATIONS</p>
          </div>
          <ul>
            {locationSuggestions.map((suggestion) => (
              <li 
                key={suggestion.id} 
                className="px-3 py-2 hover:bg-gray-100 rounded-lg cursor-pointer flex items-start transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <div className="bg-gray-100 rounded-full p-2 mr-3">
                  <MapPin className="h-4 w-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-sm">{suggestion.name}</p>
                  <p className="text-xs text-gray-500">{suggestion.address}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LocationSearch;
