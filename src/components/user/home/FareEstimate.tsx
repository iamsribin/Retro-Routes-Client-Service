
import React from 'react';
import { DollarSign, Clock, MapPin, ArrowRight } from 'lucide-react';

const FareEstimate = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Fare Estimator</h2>
      <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
        Get an estimate for your fare before you ride. Enter your pickup location and destination to see how much your trip will cost.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Fare Card 1 */}
        <div className="glass-card rounded-xl p-6 uber-shadow hover:translate-y-[-4px] transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="p-3 bg-gray-100 rounded-full">
              <DollarSign className="h-6 w-6 text-uber-accent" />
            </div>
            <span className="text-2xl font-bold">$15.30</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3">UberX</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div className="p-1 rounded-full bg-uber-accent">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div className="h-12 w-0.5 bg-gray-300 mx-auto my-1"></div>
                <MapPin className="h-4 w-4 text-uber-default" />
              </div>
              
              <div className="flex-1">
                <p className="font-medium">Downtown San Francisco</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">Market Street</p>
                
                <p className="font-medium">San Francisco Airport (SFO)</p>
                <p className="text-xs text-gray-500 mt-0.5">International Terminal</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 pt-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>24 min • 13.2 miles</span>
            </div>
          </div>
        </div>
        
        {/* Fare Card 2 */}
        <div className="glass-card rounded-xl p-6 uber-shadow hover:translate-y-[-4px] transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="p-3 bg-gray-100 rounded-full">
              <DollarSign className="h-6 w-6 text-uber-accent" />
            </div>
            <span className="text-2xl font-bold">$22.50</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3">Comfort</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div className="p-1 rounded-full bg-uber-accent">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div className="h-12 w-0.5 bg-gray-300 mx-auto my-1"></div>
                <MapPin className="h-4 w-4 text-uber-default" />
              </div>
              
              <div className="flex-1">
                <p className="font-medium">Union Square</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">Powell Street</p>
                
                <p className="font-medium">Golden Gate Park</p>
                <p className="text-xs text-gray-500 mt-0.5">Main Entrance</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 pt-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>18 min • 5.8 miles</span>
            </div>
          </div>
        </div>
        
        {/* Fare Card 3 */}
        <div className="glass-card rounded-xl p-6 uber-shadow hover:translate-y-[-4px] transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="p-3 bg-gray-100 rounded-full">
              <DollarSign className="h-6 w-6 text-uber-accent" />
            </div>
            <span className="text-2xl font-bold">$45.25</span>
          </div>
          
          <h3 className="text-xl font-semibold mb-3">Black</h3>
          
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div className="p-1 rounded-full bg-uber-accent">
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                </div>
                <div className="h-12 w-0.5 bg-gray-300 mx-auto my-1"></div>
                <MapPin className="h-4 w-4 text-uber-default" />
              </div>
              
              <div className="flex-1">
                <p className="font-medium">SFO Airport</p>
                <p className="text-xs text-gray-500 mt-0.5 mb-3">Terminal 2</p>
                
                <p className="font-medium">Palo Alto</p>
                <p className="text-xs text-gray-500 mt-0.5">University Avenue</p>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 pt-2">
              <Clock className="h-4 w-4 mr-2" />
              <span>32 min • 21.5 miles</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <a 
          href="#" 
          className="inline-flex items-center space-x-2 text-uber-accent hover:underline transition-colors"
        >
          <span className="font-medium">Calculate your ride fare now</span>
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </div>
  );
};

export default FareEstimate;
