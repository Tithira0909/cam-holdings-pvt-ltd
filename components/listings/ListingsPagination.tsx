import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ListingsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ListingsPagination: React.FC<ListingsPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-16 pt-8 border-t border-gray-100">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-luxury-gold hover:text-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
      >
        <ChevronLeft size={18} />
      </button>

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all shadow-sm ${
            currentPage === page
              ? 'bg-luxury-gold text-white border border-luxury-gold shadow-md transform -translate-y-0.5'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-luxury-gold hover:text-luxury-gold'
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-luxury-gold hover:text-luxury-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white shadow-sm"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
};