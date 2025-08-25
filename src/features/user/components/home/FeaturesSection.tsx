
import { Feature1, Feature2, Feature3 } from '@/assets';

const features = [
  {
    icon: Feature1,
    title: 'Affordable Prices',
    description: 'Enjoy premium transportation at competitive prices, with transparent fare calculations and no hidden fees.'
  },
  {
    icon: Feature2,
    title: 'Real-Time Tracking',
    description: 'Track your ride in real-time and share your journey details with loved ones for enhanced safety.'
  },
  {
    icon: Feature3,
    title: 'Professional Drivers',
    description: 'Our drivers are highly trained professionals who prioritize your comfort and safety throughout the journey.'
  }
];

const FeaturesSection: React.FC = () => {

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-brand-50 text-gradient px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Experience the Difference with Retro Routes
          </h2>
          <p className="text-muted-foreground text-lg">
            Our premium features ensure that every journey with us is comfortable, safe, and enjoyable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col items-center text-center p-8 rounded-2xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-white border border-slate-100"
            >
              <img src={feature.icon} alt={feature.title} className="w-20 h-20 mb-6" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
