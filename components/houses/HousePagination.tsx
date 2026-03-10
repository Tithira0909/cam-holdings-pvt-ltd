import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HousePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const HousePagination: React.FC<HousePaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12 py-8 border-t border-gray-100">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`p-2 rounded-full transition-colors flex items-center justify-center ${
          currentPage === 1
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-luxury-black hover:bg-gray-100'
        }`}
      >
        <ChevronLeft size={24} />
      </button>

      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full font-medium transition-all flex items-center justify-center ${
              currentPage === page
                ? 'bg-red-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:bg-gray-100 hover:text-luxury-black'
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`p-2 rounded-full transition-colors flex items-center justify-center ${
          currentPage === totalPages
            ? 'text-gray-300 cursor-not-allowed'
            : 'text-luxury-black hover:bg-gray-100'
        }`}
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};
