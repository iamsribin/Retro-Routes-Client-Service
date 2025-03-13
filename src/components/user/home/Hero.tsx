
import React from 'react';
import BookingForm from './BookingForm';
import MapView from './MapView';

const Home = () => {
  return (
    <div className="relative min-h-screen pt-20">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="h-full w-full bg-uber-muted">
          {/* City silhouette background */}
          <svg
            className="absolute bottom-0 left-0 right-0 text-gray-200 w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
          >
            <path
              fill="currentColor"
              fillOpacity="1"
              d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,229.3C1248,235,1344,277,1392,298.7L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>

          {/* Abstract shape */}
          <div className="absolute top-20 -right-36 w-96 h-96 bg-uber-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-36 w-96 h-96 bg-gray-200 rounded-full blur-3xl"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-start pt-10 md:pt-16 lg:pt-20 max-w-7xl mx-auto">
          <div className="lg:w-2/5 lg:pr-8 mb-10 lg:mb-0">
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-up" style={{ animationDelay: '0.1s' }}>
                Go anywhere, get anything
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
                Request a ride, hop in, and relax. Available worldwide, Retro Routes is the smart way to get around. Just tap and go.
              </p>
              
              <div className="animate-fade-up" style={{ animationDelay: '0.5s' }}>
                <BookingForm />
              </div>
            </div>
          </div>
          
          <div className="lg:w-3/5 animate-fade-up" style={{ animationDelay: '0.7s' }}>
            <div className="glass-card rounded-xl overflow-hidden uber-shadow h-[500px] md:h-[600px]">
              <MapView />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
