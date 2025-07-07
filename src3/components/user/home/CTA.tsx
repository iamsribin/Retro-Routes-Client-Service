
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-khaki/10">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto">
          <span className="bg-emerald/10 text-emerald px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6">
            Join Our Fleet
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gradient">
            Become a Retro Routes Driver Today
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join our growing team of professional drivers. Enjoy flexible hours, competitive pay, and the freedom to be your own boss.
          </p>
          <Link to="/driver/login">
            <Button variant="emerald" size="lg" className="rounded-full px-8 py-6">
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
