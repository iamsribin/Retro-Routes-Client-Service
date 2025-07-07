
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 retro-gradient-bg opacity-10"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-radial from-emerald/20 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl animate-slide-up">
            <span className="bg-emerald/10 text-emerald px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6">
              Premium Cab Service
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Travel in Style with{" "}
              <span className="text-gradient">Retro Routes</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 md:pr-12">
              Experience premium cab service that combines modern convenience with timeless style. Book your ride in seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/signup">
                <Button variant="emerald" size="lg" className="rounded-full px-8 py-6">
                  Book Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 border-emerald text-emerald hover:bg-emerald/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0 animate-slide-left animate-delay-300">
            <div className="relative w-full aspect-square max-w-md mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-khaki/50 via-khaki/30 to-egyptian/20 transform rotate-6 scale-95 shadow-lg"></div>
              <div className="absolute inset-0 rounded-3xl glass-emerald overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1489824904134-891ab64532f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1031&q=80" 
                  alt="Luxury Cab" 
                  className="w-full h-full object-cover animate-fade-zoom"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-noir rounded-2xl p-4 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-emerald rounded-full p-2">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 8L14 4H10L6 8M18 8V16.8C18 17.9201 18 18.4802 17.782 18.908C17.5903 19.2843 17.2843 19.5903 16.908 19.782C16.4802 20 15.9201 20 14.8 20H9.2C8.07989 20 7.51984 20 7.09202 19.782C6.71569 19.5903 6.40973 19.2843 6.21799 18.908C6 18.4802 6 17.9201 6 16.8V8M14 12H10M8 8H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-white font-medium">Premium Fleet</p>
                    <p className="text-white/80 text-sm">Maximum Comfort</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
