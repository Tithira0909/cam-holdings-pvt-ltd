import React from 'react';
import { MapPin } from 'lucide-react';
import { Property } from '../types';

interface LandCardProps {
  property: Property;
  onClick: () => void;
}

const formatPrice = (price?: string) => {
  if (!price) return '';
  const num = Number(price);
  if (!isNaN(num)) {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(num);
  }
  return price;
};

const LandCard: React.FC<LandCardProps> = ({ property, onClick }) => {
  return (
    <div
      className="bg-white rounded-[12px] overflow-hidden shadow-[0px_4px_15px_rgba(0,0,0,0.05)] group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_25px_rgba(212,175,55,0.15)] h-full"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {property.isFeatured && (
            <div className="bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
              Featured
            </div>
          )}
          {property.projectStatusLabel && (
             <div className="bg-luxury-black/80 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
               {property.projectStatusLabel}
             </div>
          )}
          {property.isSoldOut && (
            <div className="bg-red-600/90 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
              Sold Out
            </div>
          )}
        </div>
      </div>

      <div className="p-6 text-left flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-4 mb-2">
           <h3 className="text-[20px] font-serif font-bold text-luxury-black line-clamp-2 leading-tight">
             {property.title}
           </h3>
        </div>

        <div className="flex items-center gap-1.5 text-luxury-gray mb-4">
          <MapPin size={16} className="text-luxury-gold shrink-0" />
          <p className="text-[14px] line-clamp-1">{property.city || property.location.split(',')[0]}</p>
        </div>

        <div className="mt-auto pt-4 border-t border-luxury-border flex items-end justify-between">
           <div>
              <p className="text-[11px] text-luxury-gray font-bold uppercase tracking-widest mb-1">
                 {property.priceLabel || 'Starting Price'}
              </p>
              <p className="text-[20px] font-serif font-bold text-luxury-black">
                 {formatPrice(property.price)}
              </p>
           </div>

           <button
              className="bg-luxury-offwhite text-luxury-black border border-luxury-border px-4 py-2 text-[13px] font-bold uppercase tracking-wider rounded-lg transition-all duration-300 group-hover:bg-luxury-gold group-hover:text-white group-hover:border-luxury-gold"
              onClick={(e) => {
                 e.stopPropagation();
                 onClick();
              }}
           >
             Explore
           </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;