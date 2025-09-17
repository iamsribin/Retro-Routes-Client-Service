import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/components/ui/button';
import { Car } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-black to-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="bg-gray-800/50 text-gray-300 border border-gray-700 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6">
            Join Our Fleet
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white bg-gradient-to-r from-gray-400 to-white bg-clip-text text-transparent">
            Become a Retro Routes Driver Today
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join our growing team of professional drivers. Enjoy flexible hours, competitive pay, and the freedom to be your own boss.
          </p>
          <Link to="/driver/login">
            <Button variant="default" size="lg" className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-200">
              Driver Login
              <Car className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTA;