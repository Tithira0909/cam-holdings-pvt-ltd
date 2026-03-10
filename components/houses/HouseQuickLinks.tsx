import React from 'react';
import { Property } from '../../types';

interface HouseQuickLinksProps {
  properties: Property[];
  onSelectCity: (city: string) => void;
  onSelectDistrict: (district: string) => void;
  selectedCity: string;
  selectedDistrict: string;
}

export const HouseQuickLinks: React.FC<HouseQuickLinksProps> = ({
  properties,
  onSelectCity,
  onSelectDistrict,
  selectedCity,
  selectedDistrict
}) => {
  const [showAllCities, setShowAllCities] = React.useState(false);

  // Derive districts and counts
  const districtCounts = properties.reduce((acc, p) => {
    if (p.district) acc[p.district] = (acc[p.district] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const districts = Object.keys(districtCounts).sort((a,b) => districtCounts[b] - districtCounts[a]);

  // Derive cities and counts
  const cityCounts = properties.reduce((acc, p) => {
    if (p.city) acc[p.city] = (acc[p.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const cities = Object.keys(cityCounts).sort((a,b) => cityCounts[b] - cityCounts[a]);
  const displayedCities = showAllCities ? cities : cities.slice(0, 10);

  if (districts.length === 0 && cities.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8 font-sans">
      <h3 className="font-serif text-lg text-luxury-black mb-4 pb-2 border-b border-gray-100">Quick Filters</h3>

      {districts.length > 0 && (
        <div className="mb-6">
          <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Districts</h4>
          <div className="flex flex-wrap gap-2">
            {districts.map(d => (
              <button
                key={d}
                onClick={() => onSelectDistrict(selectedDistrict === d ? '' : d)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${
                  selectedDistrict === d
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {d} <span className="text-xs opacity-70 ml-1">({districtCounts[d]})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {cities.length > 0 && (
        <div>
          <h4 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-3">Popular Cities</h4>
          <div className="flex flex-wrap gap-2">
            {displayedCities.map(c => (
              <button
                key={c}
                onClick={() => onSelectCity(selectedCity === c ? '' : c)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors border ${
                  selectedCity === c
                    ? 'bg-red-600 text-white border-red-600 shadow-md'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {c} <span className="text-xs opacity-70 ml-1">({cityCounts[c]})</span>
              </button>
            ))}

            {cities.length > 10 && (
              <button
                onClick={() => setShowAllCities(!showAllCities)}
                className="px-3 py-1.5 text-sm rounded-full text-red-600 hover:underline font-medium"
              >
                {showAllCities ? 'Show Less' : `+${cities.length - 10} More`}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
