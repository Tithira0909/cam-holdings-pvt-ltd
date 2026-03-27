import React, { useMemo } from 'react';
import { Property } from '../../types';
import { Search, MapPin, Building, RotateCcw } from 'lucide-react';

interface FiltersState {
  category: string;
  district: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  keyword: string;
}

interface PropertyFilterSidebarProps {
  type: 'Lands' | 'Houses';
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  properties: Property[];
  onSearch: () => void;
}

export const PropertyFilterSidebar: React.FC<PropertyFilterSidebarProps> = ({
  type, filters, setFilters, properties, onSearch
}) => {
  // Extract unique values
  const districts = useMemo(() => {
    const vals = new Set(properties.map(p => p.district).filter(Boolean));
    return Array.from(vals).sort() as string[];
  }, [properties]);

  const cities = useMemo(() => {
    let filtered = properties;
    if (filters.district) {
      filtered = filtered.filter(p => p.district === filters.district);
    }
    const vals = new Set(filtered.map(p => p.city || p.location).filter(Boolean));
    return Array.from(vals).sort() as string[];
  }, [properties, filters.district]);

  const categories = useMemo(() => {
    const vals = new Set(properties.map(p => p.category).filter(Boolean));
    return Array.from(vals).sort() as string[];
  }, [properties]);

  const priceLabel = type === 'Lands' ? 'Perch Price' : 'Unit Price';

  const resetFilters = () => {
    setFilters({
      category: '',
      district: '',
      city: '',
      minPrice: '',
      maxPrice: '',
      keyword: ''
    });
    // Immediately trigger search refresh if needed by parent logic
    // Usually a subsequent onSearch() call or useEffect is used,
    // but here we let the component rerender or trigger it manually.
  };

  return (
    <div className="bg-white rounded-[20px] shadow-[0px_4px_30px_rgba(0,0,0,0.04)] border border-gray-100/50 p-6 md:p-8 lg:sticky lg:top-32 xl:top-36">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
         <h3 className="text-xl font-serif font-bold text-luxury-black flex items-center gap-3">
           Filters
         </h3>
         <button
           onClick={resetFilters}
           className="text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-luxury-gold transition-colors flex items-center gap-1.5"
         >
           <RotateCcw size={14} />
           Reset
         </button>
      </div>

      <div className="space-y-6">
        {/* Category */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">{type} Category</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-luxury-gold/60">
               <Building size={16} />
            </div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* District */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">District</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-luxury-gold/60">
               <MapPin size={16} />
            </div>
            <select
              value={filters.district}
              onChange={(e) => setFilters(prev => ({ ...prev, district: e.target.value, city: '' }))} // Reset city on district change
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Any District</option>
              {districts.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* City */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Popular City</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-luxury-gold/60">
               <MapPin size={16} />
            </div>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="w-full pl-11 pr-10 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white transition-all cursor-pointer"
            >
              <option value="">Any City</option>
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">{priceLabel} Range</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white transition-all"
            />
            <span className="text-gray-300">-</span>
            <input
              type="text"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Keyword Search */}
        <div className="space-y-2.5 pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-widest block">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-luxury-gold/60">
              <Search size={16} />
            </div>
            <input
              type="text"
              placeholder="e.g. Colombo, Luxury"
              value={filters.keyword}
              onChange={(e) => setFilters(prev => ({ ...prev, keyword: e.target.value }))}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-luxury-gold/30 focus:bg-white transition-all"
            />
          </div>
        </div>

        <button
          onClick={onSearch}
          className="w-full bg-luxury-gold text-white font-bold uppercase tracking-wider text-sm py-4 rounded-xl mt-8 hover:bg-luxury-golddark transition-all shadow-[0_4px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.4)] transform hover:-translate-y-0.5"
        >
          Search Properties
        </button>
      </div>
    </div>
  );
};