import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, Phone, MessageSquare, PhoneCall, Download, Share2, Map, Layout, Zap, Droplet, Trees, Navigation } from 'lucide-react';
import LandCard from './LandCard';
import LoanCalculator from './LoanCalculator';

interface LandDetailProps {
  property: Property;
  onNavigate: (page: any, id?: string) => void;
  recommendedLands: Property[];
  onOpenConsultation: () => void;
  setSelectedImage: (img: string) => void;
}

const formatPrice = (price?: string) => {
  if (!price) return '';
  const num = Number(price);
  if (!isNaN(num)) {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(num);
  }
  return price;
};

// Map icons roughly to some common facility labels
const renderFacilityIcon = (label: string) => {
  const l = label.toLowerCase();
  if (l.includes('elect')) return <Zap size={24} className="text-luxury-gold" />;
  if (l.includes('water') || l.includes('drain')) return <Droplet size={24} className="text-luxury-gold" />;
  if (l.includes('road') || l.includes('street')) return <Navigation size={24} className="text-luxury-gold" />;
  return <Trees size={24} className="text-luxury-gold" />;
};

const LandDetail: React.FC<LandDetailProps> = ({ property, onNavigate, recommendedLands, onOpenConsultation, setSelectedImage }) => {
  const [activeTab, setActiveTab] = useState<'block' | 'road' | 'location'>('block');

  const facilities = property.amenities || [];

  return (
    <div className="animate-in fade-in duration-500 bg-[#f4f4f4] pb-32">
      {/* 1. Hero / Top Section */}
      <div className="relative w-full h-[60vh] md:h-[70vh] bg-luxury-black overflow-hidden group">
         <img
            src={property.image}
            className="w-full h-full object-cover opacity-60"
            alt={property.title}
            onClick={() => setSelectedImage(property.image)}
         />
         <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-black/20 to-transparent pointer-events-none" />

         {/* Top Hero Info Overlay */}
         <div className="absolute bottom-0 left-0 right-0 z-10 px-mobile pb-12">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
               <div className="flex-1">
                  {property.logoImage && (
                     <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl mb-6 inline-block shadow-lg">
                        <img src={property.logoImage} alt="Project Logo" className="h-16 object-contain" />
                     </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3 mb-4">
                     {property.projectStatusLabel && (
                        <span className="px-4 py-1.5 bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                           {property.projectStatusLabel}
                        </span>
                     )}
                     {property.isFeatured && (
                        <span className="px-4 py-1.5 bg-white text-luxury-black text-[10px] font-bold uppercase tracking-widest rounded-full shadow-md">
                           Featured
                        </span>
                     )}
                  </div>

                  <h1 className="text-4xl md:text-6xl font-serif text-white font-bold uppercase tracking-tight mb-4 drop-shadow-md">
                     {property.title}
                  </h1>

                  <div className="flex items-center gap-2 text-white/90">
                     <MapPin size={20} className="text-luxury-gold" />
                     <span className="text-lg font-medium">{property.location}</span>
                  </div>
               </div>

               <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl md:min-w-[350px]">
                  <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">
                     {property.priceLabel || 'Starting Price'}
                  </p>
                  <p className="text-3xl md:text-4xl font-serif font-bold text-luxury-gold mb-6 drop-shadow-sm">
                     {formatPrice(property.price)}
                  </p>

                  <div className="flex flex-col gap-3">
                     <button onClick={onOpenConsultation} className="w-full bg-luxury-gold text-white py-3.5 rounded-lg font-bold uppercase tracking-widest hover:bg-luxury-golddark transition-all shadow-gold-glow flex items-center justify-center gap-2">
                        <MessageSquare size={18} /> Inquire Now
                     </button>
                     <div className="grid grid-cols-2 gap-3">
                        <a href={`tel:${property.hotlineNumber || '+94112345678'}`} className="bg-white/10 hover:bg-white/20 border border-white/10 text-white py-3 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                           <PhoneCall size={16} /> Call
                        </a>
                        <a href={`https://wa.me/${property.whatsappNumber?.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/30 text-white py-3 rounded-lg font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all">
                           <MessageSquare size={16} /> WhatsApp
                        </a>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-mobile pt-16">
         <div className="flex flex-col lg:flex-row gap-12 items-start">

            {/* Main Content */}
            <div className="flex-1 w-full space-y-12">

               {/* 2. About This Property */}
               {property.fullDescription && (
                  <section className="bg-white p-8 md:p-10 rounded-2xl shadow-sm border border-luxury-border">
                     <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight border-b border-luxury-border pb-4">
                        About This Property
                     </h2>
                     <div className="prose prose-lg max-w-none text-luxury-gray font-light leading-relaxed whitespace-pre-line">
                        {property.fullDescription}
                     </div>
                  </section>
               )}

               {/* 3. Facilities Section */}
               {facilities.length > 0 && (
                  <section>
                     <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight">
                        Project Facilities
                     </h2>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {facilities.map((fac, idx) => (
                           <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-luxury-border flex flex-col items-center justify-center text-center gap-4 hover:border-luxury-gold transition-colors group">
                              <div className="w-16 h-16 bg-luxury-offwhite rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                                 {renderFacilityIcon(fac.label)}
                              </div>
                              <span className="text-luxury-black font-bold uppercase tracking-wider text-xs">
                                 {fac.label}
                              </span>
                           </div>
                        ))}
                     </div>
                  </section>
               )}

               {/* 5. Loan Calculator */}
               <section>
                  <LoanCalculator initialAmount={Number(property.price?.replace(/[^0-9]/g, '')) || 5000000} />
               </section>

               {/* 4. Plan / Map / Location Tabs */}
               {(property.blockPlanImage || property.roadMapImage || property.locationMapImage) && (
                  <section className="bg-white p-8 rounded-2xl shadow-sm border border-luxury-border">
                     <div className="flex flex-wrap gap-2 border-b border-luxury-border mb-8 pb-4">
                        {property.blockPlanImage && (
                           <button onClick={() => setActiveTab('block')} className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${activeTab === 'block' ? 'bg-luxury-gold text-white shadow-md' : 'bg-gray-100 text-luxury-gray hover:bg-gray-200'}`}>
                              <Layout size={14} className="inline mr-2" /> Block Plan
                           </button>
                        )}
                        {property.roadMapImage && (
                           <button onClick={() => setActiveTab('road')} className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${activeTab === 'road' ? 'bg-luxury-gold text-white shadow-md' : 'bg-gray-100 text-luxury-gray hover:bg-gray-200'}`}>
                              <Navigation size={14} className="inline mr-2" /> Road Map
                           </button>
                        )}
                        {property.locationMapImage && (
                           <button onClick={() => setActiveTab('location')} className={`px-6 py-2.5 rounded-full font-bold uppercase tracking-wider text-xs transition-all ${activeTab === 'location' ? 'bg-luxury-gold text-white shadow-md' : 'bg-gray-100 text-luxury-gray hover:bg-gray-200'}`}>
                              <Map size={14} className="inline mr-2" /> Location Map
                           </button>
                        )}
                     </div>

                     <div className="aspect-[4/3] md:aspect-video bg-gray-100 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center cursor-pointer group" onClick={() => {
                        if (activeTab === 'block' && property.blockPlanImage) setSelectedImage(property.blockPlanImage);
                        if (activeTab === 'road' && property.roadMapImage) setSelectedImage(property.roadMapImage);
                        if (activeTab === 'location' && property.locationMapImage) setSelectedImage(property.locationMapImage);
                     }}>
                        {activeTab === 'block' && property.blockPlanImage && (
                           <img src={property.blockPlanImage} alt="Block Plan" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        )}
                        {activeTab === 'road' && property.roadMapImage && (
                           <img src={property.roadMapImage} alt="Road Map" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                        )}
                        {activeTab === 'location' && property.locationMapImage && (
                           <img src={property.locationMapImage} alt="Location Map" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        )}
                     </div>
                  </section>
               )}

            </div>

            {/* Sidebar Desktop Sticky */}
            <div className="w-full lg:w-[400px] lg:sticky lg:top-32 space-y-8">
               {/* Inquiry Form */}
               <div className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-luxury-gold">
                  <h3 className="text-2xl font-serif font-bold text-luxury-black mb-2">Interested?</h3>
                  <p className="text-luxury-gray text-sm mb-6">Leave your details and our property advisors will get back to you.</p>

                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); }}>
                     <div>
                        <input type="text" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Your Name" />
                     </div>
                     <div>
                        <input type="tel" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Phone Number" />
                     </div>
                     <div>
                        <input type="email" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder:text-gray-400 font-medium" placeholder="Email Address" />
                     </div>
                     <div>
                        <textarea rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-1 focus:ring-luxury-gold outline-none transition-all placeholder:text-gray-400 font-medium resize-none" placeholder={`I'm interested in ${property.title}...`}></textarea>
                     </div>
                     <button type="submit" className="w-full bg-luxury-black text-white font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-luxury-gold transition-colors mt-2 text-sm shadow-md">
                        Submit Inquiry
                     </button>
                  </form>
               </div>

               {/* Quick Actions */}
               <div className="flex gap-4">
                  <button className="flex-1 bg-white border border-gray-200 text-luxury-black py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:border-luxury-gold hover:text-luxury-gold transition-colors shadow-sm">
                     <Share2 size={16} /> Share
                  </button>
                  {property.brochureFiles && property.brochureFiles.length > 0 && (
                     <a href={property.brochureFiles[0].fileUrl} target="_blank" rel="noreferrer" className="flex-1 bg-white border border-gray-200 text-luxury-black py-3 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:border-luxury-gold hover:text-luxury-gold transition-colors shadow-sm">
                        <Download size={16} /> Brochure
                     </a>
                  )}
               </div>
            </div>
         </div>

         {/* 7. Recommended Lands Section */}
         {recommendedLands && recommendedLands.length > 0 && (
            <div className="pt-24 mt-24 border-t border-luxury-border">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-serif font-bold text-luxury-black mb-4 uppercase tracking-tight">Recommended For You</h2>
                  <p className="text-luxury-gray">Explore similar premium land projects from our portfolio.</p>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {recommendedLands.slice(0, 3).map(rec => (
                     <LandCard key={rec.id} property={rec} onClick={() => onNavigate('detail', rec.id)} />
                  ))}
               </div>
            </div>
         )}
      </div>

      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
         <a href={`tel:${property.hotlineNumber}`} className="flex-1 bg-luxury-black text-white py-3.5 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <Phone size={16} /> Call
         </a>
         <button onClick={onOpenConsultation} className="flex-1 bg-luxury-gold text-white py-3.5 rounded-lg font-bold uppercase tracking-wider text-sm shadow-gold-glow flex items-center justify-center gap-2">
            <MessageSquare size={16} /> Inquire
         </button>
      </div>

    </div>
  );
};

export default LandDetail;