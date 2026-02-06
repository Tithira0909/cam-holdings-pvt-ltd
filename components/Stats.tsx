import React from 'react';

interface StatsProps {
  onNavigate: (page: any) => void;
}

const Stats: React.FC<StatsProps> = ({ onNavigate }) => {
  return (
    <section className="py-24 bg-luxury-offwhite px-mobile relative overflow-hidden">
      {/* Background Decorative Shape */}
      <div className="absolute top-0 right-0 w-1/2 h-40 bg-[#96B6B2] opacity-20 -skew-y-3 translate-x-10 -translate-y-10 rounded-bl-[100px] hidden lg:block" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Side: General Trust Metrics */}
        <div className="lg:col-span-5 space-y-12">
          <div className="flex items-center gap-6 group">
            <div className="w-1.5 h-16 bg-luxury-gold rounded-full shrink-0 group-hover:scale-y-110 transition-transform duration-500" />
            <div>
              <div className="text-5xl font-serif font-black text-luxury-black mb-1">30</div>
              <div className="text-lg text-luxury-gray font-medium tracking-wide">Years of Trust</div>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="w-1.5 h-16 bg-luxury-gold rounded-full shrink-0 group-hover:scale-y-110 transition-transform duration-500" />
            <div>
              <div className="text-5xl font-serif font-black text-luxury-black mb-1">18</div>
              <div className="text-lg text-luxury-gray font-medium tracking-wide">Districts Covered</div>
            </div>
          </div>

          <div className="flex items-center gap-6 group">
            <div className="w-1.5 h-16 bg-luxury-gold rounded-full shrink-0 group-hover:scale-y-110 transition-transform duration-500" />
            <div>
              <div className="text-5xl font-serif font-black text-luxury-black mb-1">300+</div>
              <div className="text-lg text-luxury-gray font-medium tracking-wide">Satisfied Customers</div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Category Cards */}
        <div className="lg:col-span-7 flex flex-col md:flex-row gap-8 justify-end">
          {/* Houses Card */}
          <div 
            onClick={() => onNavigate('houses')}
            className="relative w-full md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer transition-all duration-300 hover:scale-[1.05] hover:shadow-gold-glow-lg"
          >
            <img 
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800" 
              alt="Houses" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 uppercase tracking-brand">Houses</h3>
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-3xl font-black text-luxury-gold block">5</span>
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">On Going Projects</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-luxury-gold block">28</span>
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Completed Projects</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lands Card */}
          <div 
            onClick={() => onNavigate('lands')}
            className="relative w-full md:w-[320px] aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl group cursor-pointer md:mt-12 transition-all duration-300 hover:scale-[1.05] hover:shadow-gold-glow-lg"
          >
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800" 
              alt="Lands" 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-8">
              <h3 className="text-2xl font-serif font-bold text-white mb-6 uppercase tracking-brand">Lands</h3>
              <div className="space-y-4 text-left">
                <div>
                  <span className="text-3xl font-black text-luxury-gold block">11</span>
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">On Going Projects</span>
                </div>
                <div>
                  <span className="text-3xl font-black text-luxury-gold block">42</span>
                  <span className="text-xs font-bold text-white/80 uppercase tracking-widest">Completed Projects</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Stats;