import React from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick?: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-luxury-border transition-all active:scale-[0.98] hover:shadow-md cursor-pointer"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-700"
        />
        <div className="absolute top-4 left-4 bg-luxury-black/60 backdrop-blur-md text-white text-[8px] uppercase tracking-widest px-3 py-1.5 font-bold rounded-lg">
          {property.type}
        </div>
        <div className="absolute top-4 right-4 bg-luxury-gold text-luxury-black text-[8px] uppercase tracking-widest px-3 py-1.5 font-bold rounded-lg shadow-gold-glow">
          {property.featured ? 'Ongoing' : 'Delivered'}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 text-luxury-gold mb-3">
          <MapPin size={12} />
          <span className="text-[9px] uppercase tracking-widest font-bold">{property.location}</span>
        </div>
        
        <h4 className={`text-xl font-serif font-bold text-luxury-black leading-snug group-hover:text-luxury-gold transition-colors duration-300 ${property.description ? 'mb-2' : 'mb-6'}`}>
          {property.title}
        </h4>

        {property.description && (
          <p className="text-sm text-luxury-gray line-clamp-3 md:line-clamp-2 mb-6">
            {property.description}
          </p>
        )}
        
        <div className="flex justify-between items-center pt-5 border-t border-luxury-border">
          <span className="text-sm font-bold text-luxury-black tracking-widest">
            {property.price.includes('per') ? property.price.split(' ')[1] : property.price}
          </span>
          <span className="text-[9px] uppercase tracking-widest font-bold text-luxury-gold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            Details <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;