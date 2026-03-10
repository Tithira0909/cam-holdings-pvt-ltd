import React, { useState } from 'react';
import { Search, MapPin, Building, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { Property } from '../../types';

interface Filters {
  category: string;
  district: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  keyword: string;
}

interface HouseFiltersSidebarProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  properties: Property[]; // used to derive dynamic options
  onSearch: () => void;
  onReset: () => void;
  totalResults: number;
}

export const HouseFiltersSidebar: React.FC<HouseFiltersSidebarProps> = ({
  filters,
  setFilters,
  properties,
  onSearch,
  onReset,
  totalResults
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Derive dynamic options
  const categories = Array.from(new Set(properties.map(p => p.category).filter(Boolean))) as string[];
  const districts = Array.from(new Set(properties.map(p => p.district).filter(Boolean))) as string[];
  const cities = Array.from(new Set(properties.map(p => p.city).filter(Boolean))) as string[];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const MobileToggle = () => (
    <div className="lg:hidden mb-4">
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="w-full flex items-center justify-between p-4 bg-luxury-black text-white rounded-lg shadow-md hover:bg-opacity-90 transition-colors"
      >
        <div className="flex items-center gap-2 font-medium tracking-wider text-sm uppercase">
          <Search size={18} />
          {isMobileOpen ? 'Hide Filters' : 'Filter Houses'}
        </div>
        <div className="flex items-center gap-4">
          <span className="bg-red-600/20 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold border border-red-600/30">
            {totalResults}
          </span>
          {isMobileOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
    </div>
  );

  return (
    <>
      <MobileToggle />
      <div className={`lg:block ${isMobileOpen ? 'block animate-in fade-in slide-in-from-top-4' : 'hidden'} lg:sticky lg:top-24 w-full`}>
        <div className="bg-white p-6 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 font-sans relative">

          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
             <h3 className="font-serif text-2xl text-luxury-black">Refine Search</h3>
             <span className="hidden lg:inline-flex bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                {totalResults} {totalResults === 1 ? 'House' : 'Houses'}
             </span>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="space-y-5">

            {/* Keyword Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Keyword</label>
              <div className="relative group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                <input
                  type="text"
                  name="keyword"
                  value={filters.keyword}
                  onChange={handleChange}
                  placeholder="e.g. Kottawa, Villa"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Category Dropdown */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Property Category</label>
                <div className="relative group">
                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Categories</option>
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            )}

            {/* District Dropdown */}
            {districts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">District</label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                  <select
                    name="district"
                    value={filters.district}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Districts</option>
                    {districts.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            )}

            {/* City Dropdown */}
            {cities.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">City</label>
                <div className="relative group">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-red-600 transition-colors" size={18} />
                  <select
                    name="city"
                    value={filters.city}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5 ml-1">Price Range (LKR)</label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  name="minPrice"
                  value={filters.minPrice}
                  onChange={handleChange}
                  placeholder="Min"
                  className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all placeholder:text-gray-400"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  placeholder="Max"
                  className="w-1/2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { onReset(); if(window.innerWidth < 1024) setIsMobileOpen(false); }}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 hover:bg-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 group"
              >
                <RefreshCw size={18} className="group-hover:-rotate-180 transition-transform duration-500" />
                Reset
              </button>
              <button
                type="submit"
                onClick={() => { if(window.innerWidth < 1024) setIsMobileOpen(false); }}
                className="flex-[2] px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Search size={18} />
                Search
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
