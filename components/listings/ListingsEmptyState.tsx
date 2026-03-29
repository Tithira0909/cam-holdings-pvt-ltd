import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface ListingsEmptyStateProps {
  onReset: () => void;
}

export const ListingsEmptyState: React.FC<ListingsEmptyStateProps> = ({ onReset }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)]">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-6">
        <SearchX size={32} />
      </div>
      <h3 className="text-2xl font-serif text-luxury-black mb-3">No Properties Found</h3>
      <p className="text-gray-500 font-light mb-8 max-w-md">
        We couldn't find any properties matching your exact criteria. Try adjusting your filters or search terms.
      </p>
      <button
        onClick={onReset}
        className="flex items-center gap-2 px-8 py-3 bg-luxury-black text-white rounded-xl font-bold uppercase tracking-wider text-sm hover:bg-red-600 transition-colors shadow-md"
      >
        <RotateCcw size={16} />
        Clear Filters
      </button>
    </div>
  );
};