import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/user/home/HeroSection'
import FeaturesSection from '@/components/user/home/FeaturesSection';
import Testimonials from '@/components/user/home/Testimonials';
import CTA from '@/components/user/home/CTA';
import RideBooking from '@/components/user/home/RideBooking';
const Index: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <RideBooking />
        <FeaturesSection />   
        
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
