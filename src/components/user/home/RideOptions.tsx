
import React, { useState } from 'react';
import { Car, Users, Star, ShieldCheck, Clock } from 'lucide-react';

const rideOptions = [
  { 
    id: 'uber-x', 
    name: 'UberX', 
    icon: Car, 
    price: '$15.30', 
    time: '5 min', 
    description: 'Affordable, everyday rides',
    capacity: '4'
  },
  { 
    id: 'uber-comfort', 
    name: 'Comfort', 
    icon: ShieldCheck, 
    price: '$22.50', 
    time: '7 min', 
    description: 'Newer cars with extra legroom',
    capacity: '4'
  },
  { 
    id: 'uber-xl', 
    name: 'UberXL', 
    icon: Users, 
    price: '$28.80', 
    time: '8 min', 
    description: 'Affordable rides for groups up to 6',
    capacity: '6'
  },
  { 
    id: 'uber-black', 
    name: 'Black', 
    icon: Star, 
    price: '$45.25', 
    time: '10 min', 
    description: 'Premium rides in luxury cars',
    capacity: '4'
  }
];

const RideOptions = () => {
  const [selectedOption, setSelectedOption] = useState('uber-x');

  return (
    <div className="w-full max-w-md">
      <div className="glass-card rounded-xl p-4">
        <h3 className="text-lg font-semibold mb-4">Choose a ride</h3>
        
        <div className="space-y-3">
          {rideOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedOption === option.id;
            
            return (
              <div 
                key={option.id}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-gray-100 border border-gray-200' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedOption(option.id)}
              >
                <div className="flex-shrink-0 mr-4">
                  <Icon className={`h-8 w-8 ${isSelected ? 'text-uber-accent' : 'text-gray-600'}`} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{option.name}</h4>
                      <p className="text-xs text-gray-500">{option.description}</p>
                    </div>
                    <span className="font-medium">{option.price}</span>
                  </div>
                  
                  <div className="flex items-center mt-1.5 text-xs text-gray-500">
                    <Users className="h-3 w-3 mr-1" />
                    <span className="mr-3">{option.capacity}</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{option.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <button className="w-full bg-uber-default text-white py-3 rounded-lg font-medium mt-4 hover:bg-uber-light transition-colors">
          Request {rideOptions.find(o => o.id === selectedOption)?.name}
        </button>
      </div>
    </div>
  );
};

export default RideOptions;
