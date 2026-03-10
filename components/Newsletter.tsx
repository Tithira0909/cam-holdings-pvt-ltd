import React from 'react';
import { Mail, Send } from 'lucide-react';

const Newsletter: React.FC = () => {
  return (
    <section id="newsletter" className="py-24 bg-luxury-offwhite px-mobile relative overflow-hidden">
      {/* Subtle architectural decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-gold-glow animate-in zoom-in duration-700">
          <Mail size={30} className="text-white" />
        </div>
        
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight">
          Stay Updated <span className="text-red-600">with Our Newsletter</span>
        </h2>
        
        <p className="text-luxury-gray text-lg font-light leading-relaxed max-w-2xl mx-auto mb-10">
          Subscribe to receive the latest news, signature property offers, and architectural updates from CAM Holdings directly in your inbox.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
          <div className="flex-grow relative group">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="w-full h-14 bg-white border-2 border-red-600/20 rounded-lg px-6 text-[15px] text-luxury-black font-normal focus:border-red-600 outline-none transition-all shadow-sm group-hover:border-red-600/50"
              required
            />
          </div>
          <button 
            type="submit"
            className="h-14 px-10 bg-red-600 text-white rounded-lg font-bold uppercase text-[12px] tracking-widest hover:bg-red-600dark transition-all shadow-gold-glow flex items-center justify-center gap-3 whitespace-nowrap active:scale-95"
          >
            Subscribe <Send size={16} />
          </button>
        </form>
        
        <div className="mt-10 pt-8 border-t border-luxury-border/50 flex flex-col sm:flex-row items-center justify-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-white bg-luxury-offwhite overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/100?img=${i + 20}`} alt="Subscriber" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
          <p className="text-[10px] text-luxury-gray uppercase tracking-widest font-bold">
            Join <span className="text-luxury-black">2,500+ elite investors</span> in our exclusive circle
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;