import React, { useState, useEffect } from 'react';
import { MapPin, Home } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';

interface HeroProps {
  onNavigate: (page: any) => void;
}

const Hero: React.FC<HeroProps> = ({ onNavigate }) => {
  const [heroImage, setHeroImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/site');
        if (res.ok) {
          const data = await res.json();
          if (data.hero_image || data.hero_image_url) {
            setHeroImage(data.hero_image || data.hero_image_url);
          }
        }
      } catch (err) {
        console.error('Failed to fetch site settings for hero image', err);
      }
    };
    fetchSettings();
  }, []);

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-transparent">
      {/* Cinematic Background Image Layer - Full Screen */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: `url(${heroImage || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1600'})`,
          animation: 'cinematicMotion 25s linear infinite'
        }}
      />

      {/* Hero Overlay for text contrast */}
      <div className="absolute inset-0 z-[1] bg-black/40" />
      
      {/* Centered Hero Overlay Content */}
      <div className="relative z-10 w-full px-mobile text-center max-w-4xl mx-auto flex flex-col items-center justify-center h-full">
        <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 bg-transparent rounded-[15px] p-6 md:p-12">
          <h1 className="text-4xl md:text-[48px] font-serif font-bold text-white mb-5 leading-[1.2] uppercase tracking-tight nav-text-shadow">
            Find Your <br />
            <span className="text-red-600">Dream Property</span>
          </h1>
          
          <p className="text-white text-base md:text-[18px] font-sans font-normal leading-[1.6] max-w-2xl mx-auto mb-10 nav-text-shadow">
            Everyone aspires to own a great piece of property. We, at CAM Holdings, made it our aim to make this dream a reality.
          </p>
          
          {/* Property Selection Buttons */}
          <div className="flex flex-row items-center justify-center gap-5 w-full">
            <button 
              onClick={() => onNavigate('lands')}
              className="w-[120px] sm:w-[150px] bg-white border-2 border-red-600 rounded-[8px] py-6 flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:bg-red-600 shadow-lg active:scale-95"
            >
              <MapPin size={24} className="text-red-600 group-hover:text-white transition-colors" />
              <p className="text-[14px] font-sans font-bold uppercase tracking-widest text-luxury-black group-hover:text-white m-0">
                Lands
              </p>
            </button>
            <button 
              onClick={() => onNavigate('houses')}
              className="w-[120px] sm:w-[150px] bg-white border-2 border-red-600 rounded-[8px] py-6 flex flex-col items-center justify-center gap-2 group transition-all duration-300 hover:bg-red-600 shadow-lg active:scale-95"
            >
              <Home size={24} className="text-red-600 group-hover:text-white transition-colors" />
              <p className="text-[14px] font-sans font-bold uppercase tracking-widest text-luxury-black group-hover:text-white m-0">
                Houses
              </p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;