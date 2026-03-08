import React, { useState, useEffect } from 'react';
import { HousesHero } from './HousesHero';
import { FeaturedHousesSection } from './FeaturedHousesSection';
import { HouseFiltersSidebar } from './HouseFiltersSidebar';
import { HouseQuickLinks } from './HouseQuickLinks';
import { HousePagination } from './HousePagination';
import HouseCard from '../HouseCard';
import { Property } from '../../types';

interface HousesListingProps {
  properties: Property[];
  onNavigate: (page: string, id: string) => void;
}

export const HousesListing: React.FC<HousesListingProps> = ({ properties, onNavigate }) => {
  const itemsPerPage = 6;

  const [filters, setFilters] = useState({
    category: '',
    district: '',
    city: '',
    minPrice: '',
    maxPrice: '',
    keyword: ''
  });

  const [activeFilters, setActiveFilters] = useState({ ...filters });
  const [currentPage, setCurrentPage] = useState(1);

  // Derive houses only
  const houses = properties.filter(p => {
    const t = (p.type || "").trim().toLowerCase();
    return t === 'house' || t === 'houses' || t === 'apartment';
  });

  const handleSearch = () => {
    setActiveFilters({ ...filters });
    setCurrentPage(1);
  };

  const handleReset = () => {
    const emptyFilters = {
      category: '',
      district: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      keyword: ''
    };
    setFilters(emptyFilters);
    setActiveFilters(emptyFilters);
    setCurrentPage(1);
  };

  const handleQuickLinkSelect = (type: 'city' | 'district', value: string) => {
    const newFilters = { ...filters, [type]: value };
    setFilters(newFilters);
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  // Filter properties
  const filteredHouses = houses.filter(p => {
    let matches = true;

    if (activeFilters.category && p.category !== activeFilters.category) matches = false;
    if (activeFilters.district && p.district !== activeFilters.district) matches = false;
    if (activeFilters.city && p.city !== activeFilters.city) matches = false;

    if (activeFilters.minPrice) {
      const min = parseInt(activeFilters.minPrice.replace(/\D/g, ''));
      const price = parseInt((p.price || "").replace(/\D/g, ''));
      if (price < min) matches = false;
    }

    if (activeFilters.maxPrice) {
      const max = parseInt(activeFilters.maxPrice.replace(/\D/g, ''));
      const price = parseInt((p.price || "").replace(/\D/g, ''));
      if (price > max) matches = false;
    }

    if (activeFilters.keyword) {
      const kw = activeFilters.keyword.toLowerCase();
      const searchable = [p.title, p.location, p.city, p.district, p.description].join(' ').toLowerCase();
      if (!searchable.includes(kw)) matches = false;
    }

    return matches;
  }).sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0));

  const totalPages = Math.ceil(filteredHouses.length / itemsPerPage);
  const paginatedHouses = filteredHouses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      <HousesHero />
      <FeaturedHousesSection properties={houses} onNavigate={(id) => onNavigate('detail', id)} />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="max-w-7xl mx-auto">

          <div className="mb-12 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif text-luxury-black mb-4">Find your dream house</h2>
            <p className="text-gray-500 font-light text-lg">Use the filters to discover properties that match your lifestyle and budget.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 xl:gap-14">

            {/* Sidebar Left */}
            <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0">
              <HouseFiltersSidebar
                filters={filters}
                setFilters={setFilters}
                properties={houses}
                onSearch={handleSearch}
                onReset={handleReset}
                totalResults={filteredHouses.length}
              />
              <div className="hidden lg:block mt-8 sticky top-[800px]">
                 <HouseQuickLinks
                   properties={houses}
                   selectedCity={activeFilters.city}
                   selectedDistrict={activeFilters.district}
                   onSelectCity={(city) => handleQuickLinkSelect('city', city)}
                   onSelectDistrict={(district) => handleQuickLinkSelect('district', district)}
                 />
              </div>
            </div>

            {/* Results Right */}
            <div className="flex-1">
               <div className="lg:hidden mb-8">
                 <HouseQuickLinks
                   properties={houses}
                   selectedCity={activeFilters.city}
                   selectedDistrict={activeFilters.district}
                   onSelectCity={(city) => handleQuickLinkSelect('city', city)}
                   onSelectDistrict={(district) => handleQuickLinkSelect('district', district)}
                 />
               </div>

               {filteredHouses.length === 0 ? (
                 <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm animate-in fade-in">
                   <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Search size={32} className="text-gray-300" />
                   </div>
                   <h3 className="text-2xl font-serif text-luxury-black mb-2">No houses found</h3>
                   <p className="text-gray-500 mb-8 max-w-md mx-auto">We couldn't find any properties matching your current filters. Try adjusting your search criteria or explore our featured houses.</p>
                   <button
                     onClick={handleReset}
                     className="px-8 py-3 bg-luxury-gold text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
                   >
                     Clear All Filters
                   </button>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                   {paginatedHouses.map((house, index) => (
                     <div
                       key={house.id}
                       className="animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                       style={{ animationDelay: `${index * 100}ms` }}
                     >
                       <HouseCard
                         property={house}
                         onClick={() => onNavigate('detail', house.id)}
                       />
                     </div>
                   ))}
                 </div>
               )}

               {filteredHouses.length > 0 && (
                 <HousePagination
                   currentPage={currentPage}
                   totalPages={totalPages}
                   onPageChange={setCurrentPage}
                 />
               )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
