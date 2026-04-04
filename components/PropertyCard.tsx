import React, { useState } from 'react';
import { MapPin, ChevronRight, Bed, Bath, ArrowRight, ChevronLeft } from 'lucide-react';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  onClick?: (imageIdx: number) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const images = [property.image, ...(property.gallery || [])].filter(Boolean);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const handleClick = () => {
    if (onClick) {
      onClick(currentImageIdx);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const getStatusColor = (status?: string) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-600 text-white';
      case 'listed': return 'bg-blue-600 text-white';
      case 'sold out': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-luxury-border transition-all active:scale-[0.98] hover:shadow-xl cursor-pointer flex flex-col h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img 
          src={images[currentImageIdx]}
          alt={property.title}
          className="w-full h-full object-cover transition-all duration-700"
        />

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-luxury-black p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white text-luxury-black p-1.5 rounded-full backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {property.status && (
          <div className={`absolute top-4 right-4 text-[10px] uppercase tracking-widest px-3 py-1.5 font-bold rounded ${getStatusColor(property.status)}`}>
            {property.status}
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <h4 className="text-[22px] font-bold text-luxury-black leading-snug mb-3 uppercase tracking-tight">
          {property.title}
        </h4>

        <div className="flex items-center gap-2 text-[#555] mb-5">
          <MapPin size={16} className="text-luxury-black" />
          <span className="text-[14px] uppercase tracking-wide font-medium">{property.location}</span>
        </div>
        
        <div className="mb-6">
          <div className="text-[24px] font-bold text-luxury-black tracking-tight flex items-center gap-2">
            {property.price}
          </div>
          {property.price.toLowerCase().includes('per') && (
            <div className="text-[12px] text-[#777] italic mt-1">Per Unit Upwards</div>
          )}
        </div>

        {property.type !== 'Land' && (
          <div className="flex items-center gap-8 py-5 border-y border-[#eee] mb-5 mt-auto">
            {(property.beds !== undefined && property.beds > 0) && (
              <div className="flex items-center gap-3">
                <Bed size={24} className="text-[#555]" />
                <div>
                  <div className="font-bold text-luxury-black text-[16px]">{property.beds}</div>
                  <div className="text-[12px] text-[#777]">Bed Rooms</div>
                </div>
              </div>
            )}
            {(property.baths !== undefined && property.baths > 0) && (
              <div className="flex items-center gap-3">
                <Bath size={24} className="text-[#555]" />
                <div>
                  <div className="font-bold text-luxury-black text-[16px]">{property.baths}</div>
                  <div className="text-[12px] text-[#777]">Bathrooms</div>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 text-[14px] font-medium text-[#555] hover:text-luxury-black transition-colors mt-2">
          Explore {property.type === 'Apartment' ? 'Apartment' : property.type} <ArrowRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;