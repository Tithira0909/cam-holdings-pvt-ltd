import React from 'react';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface PageHeroProps {
  title: string;
  description: string;
  bgImage: string;
  breadcrumbs: BreadcrumbItem[];
}

export const PageHero: React.FC<PageHeroProps> = ({ title, description, bgImage, breadcrumbs }) => {
  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden mb-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={bgImage}
          alt={`${title} Hero`}
          className="w-full h-full object-cover scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center mt-16">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-6 bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && <ChevronRight size={14} className="text-luxury-gold" />}
                <span
                  className={`${crumb.onClick ? 'cursor-pointer hover:text-luxury-gold transition-colors' : 'text-luxury-gold'}`}
                  onClick={crumb.onClick}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase tracking-tight drop-shadow-lg">
          {title}
        </h1>
        <div className="w-24 h-1 bg-luxury-gold mt-6 mb-4 mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
        <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl text-shadow-sm">
          {description}
        </p>
      </div>
    </div>
  );
};
