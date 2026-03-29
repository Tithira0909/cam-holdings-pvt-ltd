import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ListingHeroProps {
  type: 'Lands' | 'Houses';
}

export const ListingHero: React.FC<ListingHeroProps> = ({ type }) => {
  const bgImage = type === 'Lands'
    ? "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1920"
    : "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920";

  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden mb-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={`${type} Hero`}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center mt-16">
        {/* Breadcrumb */}
        <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-6 bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
          <span className="cursor-pointer hover:text-red-600 transition-colors">Home</span>
          <ChevronRight size={14} className="text-red-600" />
          <span className="text-red-600">{type}</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase tracking-tight drop-shadow-lg">
          {type}
        </h1>
        <div className="w-24 h-1 bg-red-600 mt-6 mb-4 mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
        <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl text-shadow-sm">
          {type === 'Lands'
            ? 'Discover premium land parcels in Sri Lanka’s most sought-after locations.'
            : 'Explore luxurious homes and apartments designed for modern premium living.'}
        </p>
      </div>
    </div>
  );
};