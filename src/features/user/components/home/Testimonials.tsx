import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    content: "The service is fantastic! The app is intuitive and the drivers are always on time. Retro Routes has made my daily commute so much more comfortable.",
    author: "Sarah Johnson",
    position: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5
  },
  {
    id: 2,
    content: "I've been using Retro Routes for my business trips for the past year. The professionalism and reliability of their service is unmatched. Highly recommended!",
    author: "Michael Chang",
    position: "Tech Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/54.jpg",
    rating: 5
  },
  {
    id: 3,
    content: "As someone who values comfort and style, Retro Routes exceeds my expectations every time. Their attention to detail and customer service is exemplary.",
    author: "Emily Parker",
    position: "Interior Designer",
    avatar: "https://randomuser.me/api/portraits/women/42.jpg",
    rating: 4
  }
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-black to-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="bg-gray-800 text-gray-300 px-4 py-1.5 rounded-full text-sm font-medium inline-block mb-6">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            What Our Customers Say
          </h2>
          <p className="text-gray-400 text-lg">
            Don't just take our word for it. Hear from our satisfied customers about their experience with Retro Routes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-gray-900 rounded-2xl p-8 border border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} 
                  />
                ))}
              </div>
              <p className="text-gray-300 mb-6">"{testimonial.content}"</p>
              <div className="flex items-center">
                <div className="mr-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.author} 
                    className="w-12 h-12 rounded-full object-cover border border-gray-600"
                  />
                </div>
                <div>
                  <h4 className="font-medium text-white">{testimonial.author}</h4>
                  <p className="text-sm text-gray-400">{testimonial.position}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;