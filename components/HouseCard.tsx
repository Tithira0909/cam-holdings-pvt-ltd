import React from 'react';
import { Property } from '../types';
import { MapPin, BedDouble, Bath, ChevronRight } from 'lucide-react';

interface HouseCardProps {
  property: Property;
  onClick: () => void;
}

const HouseCard: React.FC<HouseCardProps> = ({ property, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.12)] transition-all duration-500 cursor-pointer flex flex-col h-full transform hover:-translate-y-2 border border-gray-50"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {property.isFeatured && (
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md">
              Featured
            </span>
          )}
          {property.isSoldOut && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase shadow-md">
              Sold Out
            </span>
          )}
        </div>

        {/* Location Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
           <div className="flex items-center text-white/90 text-sm font-medium">
             <MapPin size={16} className="mr-1.5 text-red-600" />
             {property.city || property.location}
           </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-serif text-luxury-black mb-3 line-clamp-2 group-hover:text-red-600 transition-colors duration-300">
          {property.title}
        </h3>

        {property.shortDescription && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2 font-light">
            {property.shortDescription}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-600 mb-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 group-hover:text-luxury-black transition-colors">
            <BedDouble size={18} className="text-red-600/70" />
            <span className="font-medium">{property.bedrooms ?? property.beds ?? '-'} Beds</span>
          </div>
          <div className="flex items-center gap-2 group-hover:text-luxury-black transition-colors">
            <Bath size={18} className="text-red-600/70" />
            <span className="font-medium">{property.bathrooms ?? property.baths ?? '-'} Baths</span>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between">
           <div>
              <p className="text-[11px] text-luxury-gray font-bold uppercase tracking-widest mb-1.5">
                 {property.priceLabel || 'PER UNIT UPWARDS'}
              </p>
              <p className="text-[22px] font-serif font-bold text-luxury-black">
                 {property.price}
              </p>
           </div>

           <button
              className="bg-transparent text-luxury-black border-2 border-red-600 px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 group-hover:bg-red-600 group-hover:text-white"
              onClick={(e) => {
                 e.stopPropagation();
                 onClick();
              }}
           >
             Explore House
           </button>
        </div>
      </div>
    </div>
  );
};

export default HouseCard;
