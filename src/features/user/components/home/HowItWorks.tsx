
import React from 'react';
import { Check } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Download the App',
    description: 'Get our mobile app from the App Store or Google Play Store for free.'
  },
  {
    number: '02',
    title: 'Create an Account',
    description: 'Sign up with your details and verify your mobile number.'
  },
  {
    number: '03',
    title: 'Book Your Ride',
    description: 'Enter your destination, choose your ride type, and confirm the booking.'
  },
  {
    number: '04',
    title: 'Enjoy Your Journey',
    description: 'Relax and enjoy the comfortable ride to your destination.'
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6">
            Simple Process
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            How Retro Routes Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Booking a premium cab has never been easier. Follow these simple steps to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="bg-white rounded-2xl p-8 h-full border border-slate-100 hover:shadow-lg transition-all duration-300">
                <div className="text-emerald text-4xl font-bold mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#0EA5E9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 border border-slate-100 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-6">Why Our Customers Love Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="bg-brand-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-brand-600" />
                  </div>
                  <p>Transparent pricing with no hidden charges</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-brand-600" />
                  </div>
                  <p>Professional and courteous drivers</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-brand-600" />
                  </div>
                  <p>Clean and well-maintained fleet of vehicles</p>
                </li>
                <li className="flex items-start">
                  <div className="bg-brand-50 p-1 rounded-full mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-brand-600" />
                  </div>
                  <p>Punctual pickups and timely arrivals</p>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://m.media-amazon.com/images/I/81QVBFbg2qL.jpg" 
                  alt="Premium cab interior" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;