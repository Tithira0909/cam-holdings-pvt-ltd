import React, { useState } from 'react';
import { Property, FloorPlan } from '../types';
import { MapPin, PhoneCall, MessageSquare, Download, Share2, BedDouble, Bath, Square, Play, Image as ImageIcon } from 'lucide-react';
import PropertyCard from './PropertyCard';

interface HouseDetailProps {
  property: Property;
  onNavigate: (page: any, id?: string) => void;
  recommendedHouses: Property[];
  onOpenConsultation: () => void;
  setSelectedImage: (img: string) => void;
}

const formatPrice = (price?: string) => {
  if (!price) return '';
  const num = Number(price.replace(/[^0-9.-]+/g,""));
  if (!isNaN(num) && num > 0) {
    return new Intl.NumberFormat('en-LK').format(num) + ' LKR';
  }
  return price;
};

const HouseDetail: React.FC<HouseDetailProps> = ({ property, onNavigate, recommendedHouses, onOpenConsultation, setSelectedImage }) => {
  const [activeTab, setActiveTab] = useState<'block' | 'road' | 'location'>('block');
  const [activeFloorPlanIndex, setActiveFloorPlanIndex] = useState(0);

  const allImages = property.image ? [property.image] : [];
  if (property.images && property.images.length > 0) {
     property.images.forEach(img => {
        if (!allImages.includes(img.image_url)) {
           allImages.push(img.image_url);
        }
     });
  }

  const [mainImage, setMainImage] = useState<string>(allImages[0] || '/assets/cam_logo.png');

  const highlights = property.locationHighlights || [];
  const floorPlans = property.floorPlans || [];

  return (
    <div className="bg-[#f8f9fa] pb-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 uppercase tracking-widest font-bold">
          <span className="hover:text-luxury-black cursor-pointer" onClick={() => onNavigate('home')}>Home</span>
          <span>&gt;</span>
          <span className="hover:text-luxury-black cursor-pointer" onClick={() => onNavigate('houses')}>Houses</span>
          <span>&gt;</span>
          <span className="text-black">{property.title}</span>
        </div>

        {/* Title Section */}
        <div className="mb-8">
           {property.logoImage && (
             <img src={property.logoImage} alt="Project Logo" className="h-16 mb-4 object-contain" />
           )}
           <h1 className="text-3xl md:text-5xl font-serif text-luxury-black font-bold uppercase tracking-tight mb-2">
             {property.title}
           </h1>
           <div className="flex items-center gap-2 text-luxury-black uppercase font-bold tracking-widest text-sm">
             <MapPin size={16} />
             {property.locationLabel || property.location}
           </div>
        </div>

        {/* Image Gallery - Right Vertical Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-4 mb-8">
           {/* Main Image */}
           <div
             className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden cursor-pointer bg-gray-200"
             onClick={() => setSelectedImage(mainImage)}
           >
             <img src={mainImage} className="w-full h-full object-cover" alt="Main Property" />
             <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors" />
           </div>

           {/* Vertical Thumbnails */}
           <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar pb-4 md:pb-0 h-[100px] md:h-[600px]">
             {allImages.map((img, idx) => (
               <div
                 key={idx}
                 className={`flex-shrink-0 w-24 h-24 md:w-full md:h-[135px] rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${mainImage === img ? 'border-luxury-gold opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                 onClick={() => setMainImage(img)}
               >
                 <img src={img} className="w-full h-full object-cover" alt={`Thumbnail ${idx}`} />
               </div>
             ))}
           </div>
        </div>

        {/* Price & Info Cards Section */}
        <div className="mb-12">
           <div className="mb-8">
             <h2 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black">
               {formatPrice(property.price)}
             </h2>
             <p className="text-gray-500 uppercase tracking-widest font-bold text-sm mt-2">
               {property.priceLabel || 'PER UNIT UPWARDS'}
             </p>
           </div>

           <div className="flex flex-wrap gap-4">
             <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm min-w-[200px]">
               <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Location</p>
               <p className="font-bold text-luxury-black">{property.locationLabel || property.location}</p>
             </div>
             {property.hotlineNumber && (
               <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm min-w-[200px]">
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Hotline</p>
                 <p className="font-bold text-luxury-black">{property.hotlineNumber}</p>
               </div>
             )}
             {(property.bedrooms !== undefined || property.beds !== undefined) && (
               <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Bedrooms</p>
                 <p className="font-bold text-luxury-black flex items-center gap-2">
                   <BedDouble size={16} className="text-luxury-black" /> {property.bedrooms ?? property.beds}
                 </p>
               </div>
             )}
               {(property.bathrooms !== undefined || property.baths !== undefined) && (
               <div className="bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm">
                 <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Bathrooms</p>
                 <p className="font-bold text-luxury-black flex items-center gap-2">
                   <Bath size={16} className="text-luxury-black" /> {property.bathrooms ?? property.baths}
                 </p>
               </div>
             )}
           </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[70%_30%] gap-12">

          {/* Left Column - Content */}
          <div className="space-y-16">

            {/* Project Philosophy */}
            {property.shortDescription && (
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-serif font-bold text-luxury-black uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">Project Philosophy</h2>
                 <div className="prose prose-lg text-gray-600">
                    <p>{property.shortDescription}</p>
                 </div>
              </div>
            )}

            {/* About the Project */}
            {property.fullDescription && (
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-serif font-bold text-luxury-black uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">About the Project</h2>
                 <div className="prose prose-lg text-gray-600 whitespace-pre-line">
                    {property.fullDescription}
                 </div>
              </div>
            )}

            {/* Location Highlights */}
            {highlights && highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-serif font-bold text-luxury-black uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">Location Highlights</h2>
                 <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {highlights.map((item, idx) => (
                     <li key={idx} className="flex items-start gap-3 text-gray-700 font-medium">
                       <span className="text-luxury-black text-lg mt-0.5">•</span>
                       {item.label}
                     </li>
                   ))}
                 </ul>
              </div>
            )}

            {/* Tabs Section: Block Plan, Road Map, Location */}
            {(property.blockPlanImage || property.roadMapImage || property.locationMapImage) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex border-b border-gray-100">
                  {property.blockPlanImage && (
                    <button
                      onClick={() => setActiveTab('block')}
                      className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'block' ? 'bg-luxury-gold text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      Block Plan
                    </button>
                  )}
                  {property.roadMapImage && (
                    <button
                      onClick={() => setActiveTab('road')}
                      className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'road' ? 'bg-luxury-gold text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      Road Map
                    </button>
                  )}
                  {property.locationMapImage && (
                    <button
                      onClick={() => setActiveTab('location')}
                      className={`flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors ${activeTab === 'location' ? 'bg-luxury-gold text-white' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      Location
                    </button>
                  )}
                </div>
                <div className="p-8">
                  {activeTab === 'block' && property.blockPlanImage && (
                    <img src={property.blockPlanImage} alt="Block Plan" className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(property.blockPlanImage!)} />
                  )}
                  {activeTab === 'road' && property.roadMapImage && (
                    <img src={property.roadMapImage} alt="Road Map" className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(property.roadMapImage!)} />
                  )}
                  {activeTab === 'location' && property.locationMapImage && (
                    <img src={property.locationMapImage} alt="Location Map" className="w-full h-auto rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setSelectedImage(property.locationMapImage!)} />
                  )}
                </div>
              </div>
            )}

            {/* Floor Plans Section */}
            {floorPlans && floorPlans.length > 0 && (
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-serif font-bold text-luxury-black uppercase tracking-wider mb-6 pb-4 border-b border-gray-100">Floor Plans</h2>

                 <div className="flex flex-wrap gap-2 mb-8">
                   {floorPlans.map((fp, idx) => (
                     <button
                       key={idx}
                       onClick={() => setActiveFloorPlanIndex(idx)}
                       className={`px-6 py-3 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${activeFloorPlanIndex === idx ? 'bg-luxury-gold text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                     >
                       {fp.title || `Type ${idx + 1}`}
                     </button>
                   ))}
                 </div>

                 {floorPlans[activeFloorPlanIndex] && (
                   <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 text-center">
                     <img
                       src={floorPlans[activeFloorPlanIndex].image}
                       alt={floorPlans[activeFloorPlanIndex].title}
                       className="max-w-full h-auto mx-auto rounded-lg shadow-sm cursor-pointer hover:scale-[1.02] transition-transform"
                       onClick={() => setSelectedImage(floorPlans[activeFloorPlanIndex].image)}
                     />
                     {floorPlans[activeFloorPlanIndex].description && (
                       <p className="mt-4 text-gray-600 font-medium">{floorPlans[activeFloorPlanIndex].description}</p>
                     )}
                   </div>
                 )}
              </div>
            )}

            {/* Video Section */}
            {property.videoUrl && (
              <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100">
                 <h2 className="text-2xl font-serif font-bold text-luxury-black uppercase tracking-wider mb-6 pb-4 border-b border-gray-100 flex items-center gap-3">
                   <Play className="text-luxury-black" /> Video
                 </h2>
                 <div className="aspect-video w-full rounded-xl overflow-hidden shadow-md">
                   {/* Handle youtube links */}
                   {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                     <iframe
                       src={property.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                       title="Property Video"
                       className="w-full h-full border-0"
                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                       allowFullScreen
                     ></iframe>
                   ) : (
                     <video src={property.videoUrl} controls className="w-full h-full object-cover"></video>
                   )}
                 </div>
              </div>
            )}

          </div>

          {/* Right Column - Inquiry Sidebar */}
          <div>
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 sticky top-32">
              <h3 className="text-xl font-serif font-bold text-luxury-black uppercase tracking-wider mb-6 text-center">Inquire Now</h3>

              <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent!"); }}>
                <div>
                  <input type="text" placeholder="Name" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:bg-white transition-colors" />
                </div>
                <div>
                  <input type="tel" placeholder="Phone Number" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:bg-white transition-colors" />
                </div>
                <div>
                  <input type="email" placeholder="Email Address" required className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:bg-white transition-colors" />
                </div>
                <div>
                  <textarea rows={4} placeholder="Message" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:bg-white transition-colors resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#111] text-white font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-luxury-gold transition-colors mt-2 shadow-md">
                  Submit
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Recommended Houses */}
        {recommendedHouses && recommendedHouses.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-serif font-bold text-luxury-black uppercase tracking-tight mb-10 text-center">
              Recommended Houses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recommendedHouses.slice(0, 3).map((recHouse) => (
                <PropertyCard
                  key={recHouse.id}
                  property={recHouse}
                  onClick={() => onNavigate('detail', recHouse.id)}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default HouseDetail;
