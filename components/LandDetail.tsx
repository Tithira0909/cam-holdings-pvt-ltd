import React, { useState } from 'react';
import { Property } from '../types';
import { MapPin, PhoneCall, MessageSquare, Download, Share2, Map, Layout, Navigation, CheckCircle2 } from 'lucide-react';
import LandCard from './LandCard';
import { motion, AnimatePresence } from 'framer-motion';

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
    return new Intl.NumberFormat('en-LK').format(num);
  }
  return price;
};

const renderFacilityIcon = (label: string) => {
  return <CheckCircle2 size={24} className="text-red-600 mb-2" />;
};

const LandDetail: React.FC<LandDetailProps> = ({ property, onNavigate, recommendedLands, onOpenConsultation, setSelectedImage }) => {
  const [activeTab, setActiveTab] = useState<'block' | 'road' | 'location'>('block');

  const allImages = property.image ? [property.image] : [];
  if (property.images && property.images.length > 0) {
     property.images.forEach(img => {
        if (!allImages.includes(img.image_url)) {
           allImages.push(img.image_url);
        }
     });
  }

  const [mainImage, setMainImage] = useState<string>(allImages[0] || '/assets/cam_logo.png');

  const facilities = property.amenities || [];
  const highlights = property.locationHighlights || [];

  const paymentPlanItems = property.paymentPlan
    ? property.paymentPlan.split('\n').filter(Boolean)
    : ['Reservation Fee', 'Down Payment', 'Monthly Installment Plan', 'Bank Loan Option'];

  return (
    <div className="bg-white pb-32 pt-28 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* 1. BREADCRUMB + TITLE */}
        <div className="mb-6">
          <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 tracking-wider font-semibold uppercase">
            <span className="cursor-pointer hover:text-red-600 transition-colors" onClick={() => onNavigate('home')}>Home</span>
            <span>&gt;</span>
            <span className="cursor-pointer hover:text-red-600 transition-colors" onClick={() => onNavigate('lands')}>Lands</span>
            <span>&gt;</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 uppercase tracking-tight mb-2">
            {property.title}
          </h1>
        </div>

        {/* 2. IMAGE GALLERY SECTION */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Main Large Image */}
          <div className="w-full md:w-[75%] relative aspect-video bg-gray-100 overflow-hidden cursor-pointer" onClick={() => setSelectedImage(mainImage)}>
            <img
              src={mainImage}
              alt={property.title}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
             <div className="w-full md:w-[25%] flex flex-row md:flex-col gap-4 overflow-x-auto md:overflow-y-auto max-h-[500px] scrollbar-hide pb-2 md:pb-0">
               {allImages.map((img, idx) => (
                 <div
                   key={idx}
                   className={`flex-shrink-0 w-32 md:w-full aspect-video overflow-hidden cursor-pointer transition-all border-4 ${mainImage === img ? 'border-red-600 opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                   onClick={() => setMainImage(img)}
                 >
                   <img src={img} alt={`${property.title} ${idx}`} className="w-full h-full object-cover" />
                 </div>
               ))}
             </div>
          )}
        </div>

        {/* 3. PRICE SECTION */}
        <div className="mb-12 border-b border-gray-200 pb-8">
           <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-red-600 tracking-tight mb-2">
             {formatPrice(property.price)} <span className="text-2xl md:text-3xl text-red-600/80">LKR</span>
           </h2>
           <p className="text-gray-500 text-sm md:text-base font-bold uppercase tracking-widest">{property.priceLabel || 'PER PERCH UPWARDS'}</p>
        </div>

        {/* 4. TWO COLUMN CONTENT AREA */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* LEFT COLUMN (70%) */}
          <div className="w-full lg:w-[65%] space-y-16">

             {/* About This Property */}
             <section>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
                  About This Property
                </h3>
                {property.fullDescription && (
                  <div className="text-gray-600 leading-relaxed mb-8 whitespace-pre-line text-lg">
                    {property.fullDescription}
                  </div>
                )}

                {/* Distance Highlights */}
                {highlights.length > 0 && (
                  <ul className="space-y-4 mt-6">
                    {highlights.map((hl, idx) => {
                       const label = typeof hl === 'string' ? hl : hl.label;
                       return (
                          <li key={idx} className="flex items-start gap-4 text-gray-700 font-medium text-lg">
                             <span className="text-red-600 mt-1.5 text-xl leading-none">•</span>
                             <span>{label}</span>
                          </li>
                       );
                    })}
                  </ul>
                )}
             </section>

             {/* Payment Plan */}
             <section>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
                  Payment Plan
                </h3>
                <ul className="space-y-4">
                   {paymentPlanItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-4 text-gray-700 font-medium text-lg">
                         <span className="text-red-600 mt-1.5 text-xl leading-none">•</span>
                         <span>{item}</span>
                      </li>
                   ))}
                </ul>
             </section>

             {/* Facilities */}
             {facilities.length > 0 && (
               <section>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 uppercase tracking-tight">
                    Facilities
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                     {facilities.map((fac, idx) => {
                        const label = typeof fac === 'string' ? fac : fac.label;
                        return (
                           <div key={idx} className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] p-5 flex items-center gap-4 transition-all hover:shadow-[0_4px_15px_rgba(0,0,0,0.06)] rounded-sm">
                              <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
                              <div className="flex flex-col">
                                {renderFacilityIcon(label)}
                                <span className="text-gray-900 font-bold text-sm mt-1 uppercase tracking-wide">{label}</span>
                              </div>
                           </div>
                        );
                     })}
                  </div>
               </section>
             )}

             {/* 5. TABBED PLAN SECTION */}
             {(property.blockPlanImage || property.roadMapImage || property.locationMapImage) && (
               <section>
                  <div className="flex border-b border-gray-200 mb-8">
                     {property.blockPlanImage && (
                        <button
                           onClick={() => setActiveTab('block')}
                           className={`px-8 py-4 font-bold uppercase text-sm tracking-wider transition-all relative ${activeTab === 'block' ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                           Block Plan
                           {activeTab === 'block' && (
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>
                           )}
                        </button>
                     )}
                     {property.roadMapImage && (
                        <button
                           onClick={() => setActiveTab('road')}
                           className={`px-8 py-4 font-bold uppercase text-sm tracking-wider transition-all relative ${activeTab === 'road' ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                           Road Map
                           {activeTab === 'road' && (
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>
                           )}
                        </button>
                     )}
                     {property.locationMapImage && (
                        <button
                           onClick={() => setActiveTab('location')}
                           className={`px-8 py-4 font-bold uppercase text-sm tracking-wider transition-all relative ${activeTab === 'location' ? 'text-red-600' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                           Location
                           {activeTab === 'location' && (
                             <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600"></div>
                           )}
                        </button>
                     )}
                  </div>

                  <div className="bg-gray-50/50 border border-gray-100 rounded-lg p-4 md:p-8 flex justify-center items-center cursor-pointer transition-all hover:bg-gray-50 overflow-hidden min-h-[300px]" onClick={() => {
                     if (activeTab === 'block' && property.blockPlanImage) setSelectedImage(property.blockPlanImage);
                     if (activeTab === 'road' && property.roadMapImage) setSelectedImage(property.roadMapImage);
                     if (activeTab === 'location' && property.locationMapImage) setSelectedImage(property.locationMapImage);
                  }}>
                     <AnimatePresence mode="wait">
                       {activeTab === 'block' && property.blockPlanImage && (
                          <motion.img key="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} src={property.blockPlanImage} alt="Block Plan" className="max-w-full h-auto max-h-[600px] object-contain shadow-sm rounded" />
                       )}
                       {activeTab === 'road' && property.roadMapImage && (
                          <motion.img key="road" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} src={property.roadMapImage} alt="Road Map" className="max-w-full h-auto max-h-[600px] object-contain shadow-sm rounded" />
                       )}
                       {activeTab === 'location' && property.locationMapImage && (
                          <motion.img key="location" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} src={property.locationMapImage} alt="Location Map" className="max-w-full h-auto max-h-[600px] object-contain shadow-sm rounded" />
                       )}
                     </AnimatePresence>
                  </div>
               </section>
             )}

          </div>

          {/* RIGHT COLUMN (35%) - Info Cards + Inquiry Form */}
          <div className="w-full lg:w-[35%] space-y-6">

             {/* Info Cards */}
             <div className="bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 p-6 rounded-lg flex items-center gap-5">
               <div className="bg-red-50 text-red-600 p-4 rounded-full">
                 <MapPin size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Location</p>
                 <p className="font-bold text-gray-900 text-lg leading-tight">{property.city || property.location || 'N/A'}</p>
               </div>
             </div>

             <div className="bg-white shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 p-6 rounded-lg flex items-center gap-5">
               <div className="bg-red-50 text-red-600 p-4 rounded-full">
                 <PhoneCall size={24} />
               </div>
               <div>
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Hotline Numbers</p>
                 <p className="font-bold text-gray-900 text-lg leading-tight">{property.hotlineNumber || '011 234 5678'}</p>
               </div>
             </div>

             {/* Inquiry Form */}
             <div className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-8 rounded-lg lg:sticky lg:top-24 mt-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-8 uppercase tracking-wide border-b border-gray-100 pb-4">Inquire</h3>
                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); }}>
                   <div>
                      <input type="text" required placeholder="Name" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-400" />
                   </div>
                   <div>
                      <input type="tel" required placeholder="Phone Number" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-400" />
                   </div>
                   <div>
                      <input type="email" required placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-400" />
                   </div>
                   <div>
                      <textarea rows={4} placeholder="Message" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all placeholder:text-gray-400 resize-none"></textarea>
                   </div>
                   <button type="submit" className="w-full bg-red-600 text-white font-bold uppercase tracking-wider py-4 hover:bg-red-700 transition-colors mt-4 text-sm">
                      Send
                   </button>
                </form>
             </div>
          </div>

        </div>

        {/* 6. RECOMMENDED LANDS */}
        {recommendedLands && recommendedLands.length > 0 && (
           <div className="pt-24 mt-16 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 uppercase text-center">Recommended Lands</h2>
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
         <a href={`tel:${property.hotlineNumber}`} className="flex-1 bg-gray-900 text-white py-3.5 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <PhoneCall size={16} /> Call
         </a>
         <button onClick={onOpenConsultation} className="flex-1 bg-red-600 text-white py-3.5 rounded-lg font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <MessageSquare size={16} /> Inquire
         </button>
      </div>

    </div>
  );
};

export default LandDetail;
