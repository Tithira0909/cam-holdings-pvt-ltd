import React from 'react';
import { ChevronRight } from 'lucide-react';

export const HousesHero: React.FC = () => {
  return (
    <div className="relative w-full h-[300px] md:h-[400px] bg-luxury-black overflow-hidden flex flex-col justify-end pb-12">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80")' }}
      ></div>
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-300 mb-6 uppercase tracking-wider font-medium font-sans">
          <a href="/" className="hover:text-red-600 transition-colors">Home</a>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-white">Houses</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-serif text-white mb-4">Houses</h1>
        <p className="text-gray-300 text-lg max-w-2xl font-light">
          Find your dream home with our selection of premium houses across prime locations. Experience luxury living with modern amenities.
        </p>
      </div>
    </div>
  );
};
