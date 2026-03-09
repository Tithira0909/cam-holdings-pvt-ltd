import React, { useState, useMemo } from 'react';
import { Property } from '../../types';
import { ListingHero } from './ListingHero';
import { FeaturedPropertiesSection } from './FeaturedPropertiesSection';
import { PropertyFilterSidebar } from './PropertyFilterSidebar';
import { QuickLinksSection } from './QuickLinksSection';
import { ListingsPagination } from './ListingsPagination';
import { ListingsEmptyState } from './ListingsEmptyState';
import LandCard from '../LandCard';

interface LandsListingProps {
  properties: Property[];
  onNavigate: (page: string, id: string) => void;
}

export const LandsListing: React.FC<LandsListingProps> = ({ properties, onNavigate }) => {
  const itemsPerPage = 9;

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

  // Extract lands only
  const lands = useMemo(() => {
    return properties.filter(p => {
      const t = (p.type || "").trim().toLowerCase();
      return t === 'land' || t === 'lands';
    });
  }, [properties]);

  const handleSearch = () => {
    setActiveFilters({ ...filters });
    setCurrentPage(1);
    // On mobile we might want to close the filter sidebar drawer here
  };

  const handleQuickLink = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setActiveFilters(newFilters);
    setCurrentPage(1);
  };

  const filteredLands = useMemo(() => {
    return lands.filter(p => {
      let matches = true;

      if (activeFilters.category && p.category !== activeFilters.category) matches = false;
      if (activeFilters.district && p.district !== activeFilters.district) matches = false;
      if (activeFilters.city && p.city !== activeFilters.city && p.location !== activeFilters.city) matches = false;

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
        const searchable = [p.title, p.location, p.city, p.district, p.description, p.category].join(' ').toLowerCase();
        if (!searchable.includes(kw)) matches = false;
      }

      return matches;
    }).sort((a, b) => {
       // First sort by order if available, else standard fallback
       return (b.sortOrder || 0) - (a.sortOrder || 0);
    });
  }, [lands, activeFilters]);

  const totalPages = Math.ceil(filteredLands.length / itemsPerPage);
  const paginatedLands = filteredLands.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-24 font-sans animate-in fade-in duration-500">
      <ListingHero type="Lands" />

      <FeaturedPropertiesSection
        properties={lands}
        type="Lands"
        onNavigate={(id) => onNavigate('detail', id)}
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-16 md:py-24">

        {/* Main Listing Header */}
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif text-luxury-black mb-4">
            Find Your Dream Property
          </h2>
          <p className="text-gray-500 font-light text-lg">
            Use the filters to discover premium land properties that match your exact requirements.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">

          {/* Sidebar Left */}
          <div className="w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 order-2 lg:order-1">
            <PropertyFilterSidebar
              type="Lands"
              filters={filters}
              setFilters={setFilters}
              properties={lands}
              onSearch={handleSearch}
            />
            <div className="hidden lg:block">
              <QuickLinksSection
                type="Lands"
                properties={lands}
                onSelectLink={handleQuickLink}
              />
            </div>
          </div>

          {/* Results Right */}
          <div className="flex-1 min-w-0 order-1 lg:order-2">
            {/* Mobile Quick Links - placed above results on small screens */}
            <div className="lg:hidden mb-8">
              <QuickLinksSection
                type="Lands"
                properties={lands}
                onSelectLink={handleQuickLink}
              />
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
               <h3 className="text-xl font-serif font-bold text-luxury-black">
                 {filteredLands.length} {filteredLands.length === 1 ? 'Land' : 'Lands'} Found
               </h3>
               {/* Optional sorting dropdown could go here */}
            </div>

            {/* Grid */}
            {filteredLands.length === 0 ? (
              <ListingsEmptyState onReset={() => {
                const reset = { category: '', district: '', city: '', minPrice: '', maxPrice: '', keyword: '' };
                setFilters(reset);
                setActiveFilters(reset);
              }} />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                  {paginatedLands.map(prop => (
                    <LandCard
                      key={prop.id}
                      property={prop}
                      onClick={() => onNavigate('detail', prop.id)}
                    />
                  ))}
                </div>

                <ListingsPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};