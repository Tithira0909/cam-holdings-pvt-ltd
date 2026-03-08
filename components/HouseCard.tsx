import React from 'react';
import { Property } from '../types';

interface HouseCardProps {
  property: Property;
  onClick: () => void;
}

const formatPrice = (price?: string) => {
  if (!price) return '';
  const num = Number(price.replace(/[^0-9.-]+/g,""));
  if (!isNaN(num) && num > 0) {
    return new Intl.NumberFormat('en-LK').format(num) + ' LKR';
  }
  return price;
};

const HouseCard: React.FC<HouseCardProps> = ({ property, onClick }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group transform hover:-translate-y-2"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-200">
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {property.isSoldOut && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-red-600 text-white font-bold uppercase tracking-widest py-2 px-6 rounded-md transform -rotate-12 border-2 border-white shadow-lg">
              Sold Out
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h3 className="font-serif text-xl font-bold text-[#111] uppercase tracking-wider mb-2 group-hover:text-[#b4904d] transition-colors line-clamp-1">
          {property.title}
        </h3>

        <p className="text-gray-500 uppercase tracking-widest text-xs font-bold mb-4 line-clamp-1">
          {property.locationLabel || property.location}
        </p>

        <div className="mb-4 pb-4 border-b border-gray-100">
          <p className="text-2xl font-serif font-bold text-[#b4904d]">
            {formatPrice(property.price)}
          </p>
          <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold mt-1">
            {property.priceLabel || 'PER UNIT UPWARDS'}
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          {property.bedrooms && (
            <div className="text-sm font-medium text-gray-700">
              <span className="font-bold text-[#111]">{property.bedrooms}</span> Bedrooms
            </div>
          )}
          {property.bathrooms && (
            <div className="text-sm font-medium text-gray-700">
              <span className="font-bold text-[#111]">{property.bathrooms}</span> Bathrooms
            </div>
          )}
        </div>

        <button className="w-full py-3 bg-gray-50 text-[#111] text-xs font-bold uppercase tracking-widest rounded-lg group-hover:bg-[#111] group-hover:text-white transition-colors">
          Explore House
        </button>
      </div>
    </div>
  );
};

export default HouseCard;
