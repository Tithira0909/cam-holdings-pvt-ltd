import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, BedDouble, Bath, MapPin } from 'lucide-react';
import { Property } from '../../types';
import ScrollAnimation from '../ScrollAnimation';

interface FeaturedHousesSectionProps {
  properties: Property[];
  onNavigate: (id: string) => void;
}

export const FeaturedHousesSection: React.FC<FeaturedHousesSectionProps> = ({ properties, onNavigate }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const featuredHouses = properties.filter(p => p.isFeatured || p.featured);

  if (featuredHouses.length === 0) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = container.clientWidth > 768 ? container.clientWidth / 2 : container.clientWidth * 0.8;

    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    setScrollPosition(scrollContainerRef.current.scrollLeft);
  };

  return (
    <div className="bg-gray-50 py-16 md:py-24 font-sans border-b border-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12">
        <ScrollAnimation delay={0.1}>
          <div className="flex justify-between items-end mb-10 max-w-7xl mx-auto">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-luxury-black mb-3">Featured Houses</h2>
              <p className="text-gray-600 max-w-2xl text-lg font-light">Explore our handpicked selection of premium properties, offering unparalleled luxury and comfort.</p>
            </div>

            <div className="hidden md:flex gap-3">
              <button
                onClick={() => scroll('left')}
                disabled={scrollPosition <= 0}
                className={`p-3 rounded-full flex items-center justify-center transition-all ${
                  scrollPosition <= 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-luxury-black hover:bg-red-600 hover:text-white shadow-md'
                }`}
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="p-3 bg-white text-luxury-black hover:bg-red-600 hover:text-white rounded-full flex items-center justify-center transition-all shadow-md"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2}>
          <div className="relative max-w-[1920px] mx-auto">
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-6 md:gap-8 pb-8 pt-4 px-4 -mx-4 container-overflow-fix snap-x snap-mandatory hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredHouses.map((property) => (
              <div
                key={property.id}
                onClick={() => onNavigate(property.id)}
                className="flex-none w-[85vw] md:w-[45vw] lg:w-[30vw] xl:w-[25vw] max-w-[450px] bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer snap-center group border border-gray-100"
              >
                <div className="relative h-[250px] md:h-[300px] overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className="bg-white/95 backdrop-blur-sm text-luxury-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                      Featured
                    </span>
                    {property.isSoldOut && (
                       <span className="bg-red-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase shadow-sm">
                         Sold Out
                       </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin size={16} className="mr-1.5 text-red-600" />
                      {property.city || property.location}
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-serif text-luxury-black mb-2 line-clamp-1 group-hover:text-red-600 transition-colors">{property.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 pt-4 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <BedDouble size={18} className="text-red-600/70" />
                      <span>{property.bedrooms ?? property.beds ?? '-'} Beds</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath size={18} className="text-red-600/70" />
                      <span>{property.bathrooms ?? property.baths ?? '-'} Baths</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{property.priceLabel || 'Starting From'}</p>
                      <p className="text-xl font-medium text-luxury-black">{property.price}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};
