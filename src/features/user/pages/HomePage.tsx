import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection';
import Testimonials from '../components/home/Testimonials';
import CTA from '../components/home/CTA';
import RideBooking from '../components/home/RideBooking';
import HowItWorks from '../components/home/HowItWorks';

const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <RideBooking />
        <FeaturesSection />   
        <Testimonials />
        <HowItWorks/>
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
