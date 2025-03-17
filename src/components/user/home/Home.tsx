import React from 'react';
import { MapPin, ChevronRight, Star, Shield, Clock, Users } from 'lucide-react';
import Header from './Header';
import Hero from './Hero';
import FareEstimate from './FareEstimate';
import Footer from '../../layout/Footer';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ride with Retro Route</h2>
            <p className="text-lg text-gray-600">
              Tap a button, get a ride. Choose Uber for convenience, reliability, and safety.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="glass-card rounded-xl p-6 text-center uber-shadow hover:translate-y-[-4px] transition-all duration-300">
              <div className="bg-gray-100 w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center">
                <Clock className="h-8 w-8 text-uber-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Always on time</h3>
              <p className="text-gray-600">
                Need to be somewhere? Book an Uber and your driver will be at your location in minutes, getting you to your destination on time.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="glass-card rounded-xl p-6 text-center uber-shadow hover:translate-y-[-4px] transition-all duration-300">
              <div className="bg-gray-100 w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center">
                <Shield className="h-8 w-8 text-uber-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Safe and secure</h3>
              <p className="text-gray-600">
                Your safety is our priority. All drivers undergo background checks, and our app includes safety features like trip sharing.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="glass-card rounded-xl p-6 text-center uber-shadow hover:translate-y-[-4px] transition-all duration-300">
              <div className="bg-gray-100 w-16 h-16 mx-auto mb-5 rounded-full flex items-center justify-center">
                <Star className="h-8 w-8 text-uber-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality service</h3>
              <p className="text-gray-600">
                Enjoy a comfortable ride with top-rated drivers. Rate your trip and provide feedback to maintain our high standards.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <FareEstimate />
      
      {/* Cities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Retro routes is available in these cities</h2>
            <p className="text-lg text-gray-600">
              Across the country or around the globe, Retro routes is available in over 10,000 cities worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
            {['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville'].map((city) => (
              <div key={city} className="flex items-center group">
                <MapPin className="h-5 w-5 text-gray-400 group-hover:text-uber-accent transition-colors mr-2" />
                <a href="#" className="hover:text-uber-accent transition-colors">
                  {city}
                </a>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="#" 
              className="inline-flex items-center space-x-2 text-uber-accent hover:underline transition-colors"
            >
              <span className="font-medium">View all cities</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-uber-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to ride with Retro Routes?</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Sign up to ride or drive with Retro routes and discover new opportunities.
                </p>
                
                <div className="space-y-3 md:space-y-0 md:flex md:space-x-4">
                  <a 
                    href="#" 
                    className="block md:inline-block bg-uber-default text-white px-6 py-3 rounded-lg font-medium hover:bg-uber-light transition-colors text-center"
                  >
                    Sign up to ride
                  </a>
                  <a 
                    href="#" 
                    className="block md:inline-block border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                  >
                    Sign up to drive
                  </a>
                </div>
              </div>
              
              <div className="relative h-64 md:h-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-black/0 rounded-xl"></div>
                <img 
                  src="https://images.unsplash.com/photo-1626265774643-f1943311a86b?q=80&w=1000&auto=format&fit=crop"
                  alt="Uber driver" 
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
   <Footer/>
    </div>
  );
};

export default Home;

