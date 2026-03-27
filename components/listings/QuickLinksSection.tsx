import React, { useMemo } from 'react';
import { Property } from '../../types';

interface QuickLinksSectionProps {
  type: 'Lands' | 'Houses';
  properties: Property[];
  onSelectLink: (key: string, value: string) => void;
}

export const QuickLinksSection: React.FC<QuickLinksSectionProps> = ({ type, properties, onSelectLink }) => {
  const districts = useMemo(() => {
    const vals = properties.map(p => p.district).filter(Boolean) as string[];
    const counts = vals.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [properties]);

  const cities = useMemo(() => {
    const vals = properties.map(p => p.city || p.location).filter(Boolean) as string[];
    const counts = vals.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  }, [properties]);

  const categories = useMemo(() => {
    const vals = properties.map(p => p.category).filter(Boolean) as string[];
    const counts = vals.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return Object.entries(counts).sort((a, b) => b[1] - a[1]);
  }, [properties]);

  return (
    <div className="bg-white rounded-[20px] shadow-[0px_4px_30px_rgba(0,0,0,0.04)] border border-gray-100/50 p-6 md:p-8 mt-8 lg:mt-0">
      <h3 className="text-xl font-serif font-bold text-luxury-black mb-8 border-b border-gray-100 pb-4">
        Quick Search
      </h3>

      {/* Districts */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Popular Districts</h4>
        <div className="flex flex-wrap gap-2">
          {districts.slice(0, 6).map(([district, count]) => (
            <button
              key={district}
              onClick={() => onSelectLink('district', district)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:text-luxury-gold hover:border-luxury-gold/50 hover:bg-luxury-gold/5 transition-all shadow-sm"
            >
              {district} <span className="text-gray-400 text-xs ml-1 font-normal">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cities */}
      <div className="mb-8">
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top Cities</h4>
        <div className="flex flex-wrap gap-2">
          {cities.map(([city, count]) => (
            <button
              key={city}
              onClick={() => onSelectLink('city', city)}
              className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:text-luxury-gold hover:border-luxury-gold/50 hover:bg-luxury-gold/5 transition-all shadow-sm"
            >
              {city} <span className="text-gray-400 text-xs ml-1 font-normal">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Property Types</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map(([category, count]) => (
              <button
                key={category}
                onClick={() => onSelectLink('category', category)}
                className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600 hover:text-luxury-gold hover:border-luxury-gold/50 hover:bg-luxury-gold/5 transition-all shadow-sm"
              >
                {category} <span className="text-gray-400 text-xs ml-1 font-normal">({count})</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};