import React from 'react';
import { Property } from '../../types';
import LandCard from '../LandCard';
import HouseCard from '../HouseCard';

interface FeaturedPropertiesSectionProps {
  properties: Property[];
  type: 'Lands' | 'Houses';
  onNavigate: (id: string) => void;
}

export const FeaturedPropertiesSection: React.FC<FeaturedPropertiesSectionProps> = ({ properties, type, onNavigate }) => {
  const featured = properties.filter(p => p.isFeatured).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <div className="bg-[#fcfcfc] py-16 md:py-24 border-b border-gray-100 relative">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">

        {/* Section Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center gap-2 text-luxury-gold text-xs font-bold uppercase tracking-[0.2em] mb-4">
            <span className="w-8 h-px bg-luxury-gold/50"></span>
            Exclusive Selection
            <span className="w-8 h-px bg-luxury-gold/50"></span>
          </div>
          <h2 className="text-3xl md:text-5xl font-serif text-luxury-black mb-6">
            Featured {type}
          </h2>
          <p className="text-gray-500 font-light text-lg">
            {type === 'Lands'
              ? 'Handpicked prime land parcels offering exceptional value and location.'
              : 'Our most prestigious homes designed for comfort and luxury.'}
          </p>
        </div>

        {/* Horizontal scroll or grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map(prop => (
            <div key={prop.id} className="h-full">
              {type === 'Lands' ? (
                <LandCard property={prop} onClick={() => onNavigate(prop.id)} />
              ) : (
                <HouseCard property={prop} onClick={() => onNavigate(prop.id)} />
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};