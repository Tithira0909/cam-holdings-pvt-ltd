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
      className="bg-white rounded-[16px] overflow-hidden shadow-[0px_8px_30px_rgba(0,0,0,0.06)] group flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:shadow-[0px_16px_40px_rgba(212,175,55,0.15)] h-full border border-gray-100"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-5 left-5 flex flex-col gap-2 z-20">
          {property.isFeatured && (
            <div className="bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(212,175,55,0.4)]">
              Featured
            </div>
          )}
          {property.projectStatusLabel && (
             <div className="bg-luxury-black/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-md border border-white/10">
               {property.projectStatusLabel}
             </div>
          )}
          {property.isSoldOut && (
            <div className="bg-luxury-black text-white text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg shadow-md border border-white/10">
              Sold Out
            </div>
          )}
        </div>
      </div>

      <div className="p-7 text-left flex flex-col flex-grow bg-white">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-widest text-luxury-gold bg-luxury-gold/10 px-2 py-1 rounded">
            {property.district || 'Land'}
          </span>
          {property.category && (
             <span className="text-[11px] font-bold uppercase tracking-widest text-gray-500 bg-gray-100 px-2 py-1 rounded">
               {property.category}
             </span>
          )}
        </div>

        <h3 className="text-[22px] font-serif font-bold text-luxury-black line-clamp-2 leading-tight mb-4 group-hover:text-luxury-gold transition-colors duration-300">
          {property.title}
        </h3>

        <div className="flex items-start gap-2 text-luxury-gray mb-6">
          <MapPin size={18} className="text-luxury-gold shrink-0 mt-0.5" />
          <p className="text-[15px] leading-relaxed line-clamp-2">{property.location}</p>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between">
           <div>
              <p className="text-[11px] text-luxury-gray font-bold uppercase tracking-widest mb-1.5">
                 {property.priceLabel || 'PER PERCH UPWARDS'}
              </p>
              <p className="text-[22px] font-serif font-bold text-luxury-black">
                 {formatPrice(property.price)}
              </p>
           </div>

           <button
              className="bg-transparent text-luxury-black border-2 border-luxury-gold px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 group-hover:bg-luxury-gold group-hover:text-white"
              onClick={(e) => {
                 e.stopPropagation();
                 onClick();
              }}
           >
             Explore Land
           </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;