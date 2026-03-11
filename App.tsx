import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Newsletter from './components/Newsletter';
import PropertyCard from './components/PropertyCard';
import HouseCard from './components/HouseCard';
import { HousesListing } from './components/houses/HousesListing';
import { LandsListing } from './components/listings/LandsListing';

import LandCard from './components/LandCard';
import LandDetail from './components/LandDetail';
import HouseDetail from './components/HouseDetail';

import Contact from './components/Contact';
import ConsultationModal from './components/ConsultationModal';
import Footer from './components/Footer';
import Login from './components/admin/Login';
import Dashboard from './components/admin/Dashboard';
import { Property, PropertyType, Project } from './types';
import {
  Search,
  ArrowRight,
  ChevronDown,
  MapPin,
  Phone,
  Mail,
  Send,
  MessageSquare,
  Globe,
  Calendar,
  CheckCircle,
  FileText,
  ShieldCheck,
  UserCheck,
  Building,
  Settings,
  Users,
  Play,
  Download,
  BookOpen,
  Award,
  Target,
  History,
  Loader2
} from 'lucide-react';

type Page = 'home' | 'projects' | 'lands' | 'houses' | 'properties' | 'detail' | 'portfolio-detail' | 'services' | 'service-detail' | 'about' | 'contact' | 'portfolio' | 'testimonials' | 'kyc' | 'privacy' | 'terms' | 'virtual-tour' | 'news' | 'publications' | 'blogs' | 'admin';

interface Service {
  id: string;
  title: string;
  slug: string;
  short_desc: string;
  description: string;
  cover_image: string;
  icon: string;
  sort_order: number;
}


// Helper to format price nicely if it's purely numerical, otherwise return as is
const formatPrice = (price?: string) => {
  if (!price) return '';
  const num = Number(price);
  if (!isNaN(num)) {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(num);
  }
  return price;
};

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>(() => {
    const path = window.location.pathname;
    if (path.startsWith('/admin')) return 'admin';
    if (path.startsWith('/properties/lands')) return 'lands';
    if (path.startsWith('/properties/houses')) return 'houses';
    if (path.startsWith('/properties')) return 'properties';
    if (path.startsWith('/houses')) return 'houses';
    return 'home';
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedPortfolioId, setSelectedPortfolioId] = useState<string | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAdmin') === 'true');

  // Data State
  const [lands, setLands] = useState<Property[]>([]);
  const [houses, setHouses] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [currentPortfolio, setCurrentPortfolio] = useState<Project | null>(null);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Land Listing Filters
  const [landSearchQuery, setLandSearchQuery] = useState('');
  const [landDistrict, setLandDistrict] = useState('');
  const [landCategory, setLandCategory] = useState('');
  const [landCity, setLandCity] = useState('');
  const [landPriceMin, setLandPriceMin] = useState('');
  const [landPriceMax, setLandPriceMax] = useState('');
  const [landSortOrder, setLandSortOrder] = useState('latest');
  const [landPage, setLandPage] = useState(1);
  const landsPerPage = 9;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, selectedProjectId, selectedPortfolioId, selectedServiceSlug]);

  // Handle browser back/forward buttons for popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/properties')) {
        setActivePage('properties');
      } else if (path.startsWith('/houses')) {
        setActivePage('houses');
      } else if (path.startsWith('/portfolio/')) {
        const id = path.split('/portfolio/')[1];
        if (id) {
          setSelectedPortfolioId(id);
          setActivePage('portfolio-detail');
        } else {
          setActivePage('portfolio');
        }
      } else {
        setActivePage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    fetchData();
  }, [activePage]);

  const fetchData = async () => {
    try {
      const queryParam = '';
      const [landsRes, housesRes, projsRes, svcsRes] = await Promise.all([
        fetch(`/api/lands${queryParam}`),
        fetch(`/api/houses${queryParam}`),
        fetch('/api/projects'),
        fetch('/api/services')
      ]);

      if (landsRes.ok) {
        const landsData = await landsRes.json();
        setLands(landsData.map((p: any) => ({ ...p, id: String(p.id) })));
      }

      if (housesRes.ok) {
        const housesData = await housesRes.json();
        setHouses(housesData.map((p: any) => ({ ...p, id: String(p.id) })));
      }

      if (projsRes.ok) {
        const projsData = await projsRes.json();
        setProjects(projsData.map((p: any) => ({ ...p, id: String(p.id) })));
      }

      if (svcsRes.ok) {
        const svcsData = await svcsRes.json();
        setServices(svcsData.map((s: any) => ({ ...s, id: String(s.id) })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === 'service-detail' && selectedServiceSlug) {
      const fetchServiceDetail = async () => {
        try {
          const res = await fetch(`/api/services/${selectedServiceSlug}`);
          if (res.ok) {
            const data = await res.json();
            setCurrentService(data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchServiceDetail();
    }

    if (activePage === 'portfolio-detail' && selectedPortfolioId) {
      const fetchPortfolioDetail = async () => {
        try {
          const res = await fetch(`/api/projects/${selectedPortfolioId}`);
          if (res.ok) {
            const data = await res.json();
            setCurrentPortfolio(data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchPortfolioDetail();
    }

    if (activePage === 'detail' && selectedProjectId) {
      const fetchPropertyDetail = async () => {
        try {
          let res = await fetch(`/api/lands/${selectedProjectId}`);
          if (!res.ok) {
            res = await fetch(`/api/houses/${selectedProjectId}`);
          }
          if (res.ok) {
            const data = await res.json();
            setCurrentProperty(data);
          } else {
            setPropertyError('Failed to load property details.');
          }
        } catch (err) {
          console.error(err);
          setPropertyError('An error occurred while fetching property details.');
        }
      };
      fetchPropertyDetail();
    }
  }, [activePage, selectedServiceSlug, selectedPortfolioId, selectedProjectId]);

  const navigate = (page: Page, id?: string) => {
    setActivePage(page);
    if (page === 'detail' && id) {
      setSelectedProjectId(id);
      setCurrentProperty(null); // Reset while loading
      setPropertyError(null);
    }
    if (page === 'portfolio-detail' && id) {
      setSelectedPortfolioId(id);
      setCurrentPortfolio(null); // Reset while loading
    }
    if (page === 'service-detail' && id) {
      setSelectedServiceSlug(id);
      setCurrentService(null); // Reset while loading
    }
    if (page === 'properties' || page === 'lands' || page === 'houses' || page === 'projects') {
      const displayPage = page === 'projects' ? 'properties' : page;
      window.history.pushState({}, '', displayPage === 'properties' ? '/properties' : `/properties/${displayPage}`);
    } else if (page === 'portfolio-detail' && id) {
      window.history.pushState({}, '', `/portfolio/${id}`);
    } else if (page === 'home') {
      window.history.pushState({}, '', '/');
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAdmin');
    setActivePage('home');
    setSelectedProjectId(null);
  };

  // Helper to render dynamic icon
  const renderIcon = (iconName: string, size = 40, className = '') => {
    const icons: any = { Building, Settings, Users, CheckCircle, Award, Target, History };
    const IconComponent = icons[iconName] || Building; // Default
    return <IconComponent size={size} className={className} />;
  };

  if (activePage === 'admin') {
    if (isAuthenticated) {
      return <Dashboard onLogout={handleLogout} />;
    }
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
     return (
       <div className="min-h-screen bg-white flex items-center justify-center text-luxury-gold">
         <Loader2 size={48} className="animate-spin" />
       </div>
     );
  }

  return (
    <div className={`min-h-screen bg-white selection:bg-luxury-gold selection:text-white font-sans page-${activePage}`}>
      <Navbar
        onOpenConsultation={() => setIsModalOpen(true)}
        onNavigate={navigate}
        activePage={activePage}
      />

      {/* Floating Speak to Us Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-5 left-5 z-[95] bg-luxury-gold text-white px-8 py-4 rounded-[50px] shadow-gold-glow flex items-center gap-3 font-bold uppercase text-[16px] tracking-widest hover:bg-luxury-golddark transition-all active:scale-95 border-none outline-none"
      >
        <MessageSquare size={20} />
        <span>Speak to Us!</span>
      </button>

      <main className="flex-grow pt-0">
        {activePage === 'home' && (
          <div className="animate-in fade-in duration-500">
            <Hero onNavigate={navigate} />
            <Stats onNavigate={navigate} />
            <Newsletter />
          </div>
        )}


        {/* 1. About Us Page */}
        {activePage === 'about' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] py-16 md:py-24 px-mobile">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">About Us</h2>
                <p className="text-[18px] text-luxury-gray font-normal max-w-3xl mx-auto">
                  At CAM Holdings, we are committed to transforming real estate development through innovation, creativity, and excellence. Learn more about our journey and the values that drive us.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start bg-white p-8 md:p-16 rounded-xl shadow-sm">
                <div className="space-y-8">
                  <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-2xl relative group">
                    <img
                      src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=1200"
                      alt="About CAM Holdings"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-luxury-black/20" />
                    <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/90 backdrop-blur-md border-l-4 border-luxury-gold">
                      <p className="text-luxury-black font-serif italic text-lg">"Excellence is not an act, but a habit in every blueprint we create."</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-12">
                  <section>
                    <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4 flex items-center gap-3">
                      <History className="text-luxury-gold" /> Our Story
                    </h3>
                    <p className="text-[#777] leading-relaxed text-[16px]">
                      CAM Holdings was founded with the vision of creating premium properties that stand the test of time. With decades of experience in the industry, our team brings unmatched expertise and a commitment to quality. We believe in delivering not just properties, but lifestyles that define elegance and comfort in the heart of Sri Lanka.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4 flex items-center gap-3">
                      <Target className="text-luxury-gold" /> Our Mission
                    </h3>
                    <p className="text-[#777] leading-relaxed text-[16px]">
                      Our mission is to build premium spaces that meet the highest standards of quality and sustainability. We are dedicated to providing our clients with the best real estate solutions, guided by transparency, integrity, and innovation. We strive to be the standard-bearer for architectural luxury across South Asia.
                    </p>
                  </section>

                  <section>
                    <h3 className="text-2xl font-serif font-bold text-luxury-black mb-4 flex items-center gap-3">
                      <Award className="text-luxury-gold" /> Our Values
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        'Uncompromising Innovation',
                        'Architectural Excellence',
                        'Unwavering Integrity',
                        'Environmental Sustainability',
                        'Customer Satisfaction Above All'
                      ].map((value, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-luxury-offwhite border-l-2 border-luxury-gold">
                          <CheckCircle size={16} className="text-luxury-gold shrink-0" />
                          <span className="text-sm font-bold text-luxury-black uppercase tracking-wider">{value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Services Page */}
        {activePage === 'services' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] py-16 md:py-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">Our Services</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto">At CAM Holdings, we provide a range of real estate services tailored to meet your needs.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, idx) => (
                <div key={idx}
                  onClick={() => navigate('service-detail', service.slug)}
                  className="bg-white rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] p-10 text-center flex flex-col items-center group hover:shadow-xl transition-all border-b-4 border-transparent hover:border-luxury-gold cursor-pointer"
                >
                  <div className="w-20 h-20 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold/10 transition-colors overflow-hidden">
                    {service.cover_image ? (
                        <img src={service.cover_image} alt={service.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-luxury-gold">{renderIcon(service.icon)}</div>
                    )}
                  </div>
                  <h3 className="text-[22px] font-serif font-bold text-luxury-black mb-4">{service.title}</h3>
                  <p className="text-[16px] text-[#777] leading-relaxed font-light line-clamp-3">{service.short_desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2a. Service Detail Page */}
        {activePage === 'service-detail' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-white">
             {currentService ? (
               <>
                 <div className="relative h-[50vh] w-full overflow-hidden">
                    {currentService.cover_image ? (
                        <img src={currentService.cover_image} alt={currentService.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-luxury-black flex items-center justify-center">
                            <span className="text-white/20 text-6xl font-serif">CAM</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-center px-4">
                            <h1 className="text-4xl md:text-6xl font-serif text-white uppercase tracking-tight mb-4">{currentService.title}</h1>
                            <p className="text-xl text-white/80 max-w-2xl mx-auto">{currentService.short_desc}</p>
                        </div>
                    </div>
                 </div>
                 <div className="max-w-4xl mx-auto py-24 px-mobile">
                    <div className="prose prose-lg max-w-none text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                        {currentService.description}
                    </div>
                    <div className="mt-16 text-center">
                        <button onClick={() => navigate('contact')} className="bg-luxury-gold text-white px-10 py-4 rounded-lg font-bold uppercase tracking-brand hover:bg-luxury-golddark transition-all">
                            Enquire About This Service
                        </button>
                    </div>
                 </div>
               </>
             ) : (
               <div className="h-screen flex items-center justify-center text-luxury-gold">
                   <Loader2 size={48} className="animate-spin" />
               </div>
             )}
          </div>
        )}


        {/* 3a. Portfolio Detail Page */}
        {activePage === 'portfolio-detail' && (
          <div className="animate-in fade-in duration-500 bg-[#f4f4f4] pb-32">
             {currentPortfolio ? (
               <>
                {/* Image Gallery Hero */}
                <div className="w-full bg-luxury-black">
                  <div className="max-w-[1920px] mx-auto relative h-[50vh] md:h-[70vh] overflow-hidden group">
                    <img
                      src={currentPortfolio.image}
                      className="w-full h-full object-cover"
                      alt={currentPortfolio.title}
                      onClick={() => setSelectedImage(currentPortfolio.image)}
                    />
                    <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                  </div>

                  {/* Thumbnails Strip */}
                  {currentPortfolio.images && currentPortfolio.images.length > 0 && (
                    <div className="max-w-7xl mx-auto px-mobile py-4 flex gap-4 overflow-x-auto container-overflow-fix snap-x">
                      <div
                        className="flex-shrink-0 w-24 h-16 md:w-32 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 border-luxury-gold shadow-md snap-start"
                        onClick={() => setSelectedImage(currentPortfolio.image)}
                      >
                         <img src={currentPortfolio.image} className="w-full h-full object-cover" alt="Cover" />
                      </div>
                      {currentPortfolio.images.map((img: any) => (
                        <div
                          key={img.id}
                          className="flex-shrink-0 w-24 h-16 md:w-32 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-luxury-gold/50 transition-colors shadow-md snap-start"
                          onClick={() => setSelectedImage(img.image_url)}
                        >
                          <img src={img.image_url} className="w-full h-full object-cover" alt="Gallery" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="max-w-7xl mx-auto px-mobile pt-12">
                  <div className="flex flex-col lg:flex-row gap-12 items-start">

                    {/* Main Content Column */}
                    <div className="flex-1 w-full">
                      {/* Title & Badge Row */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <h1 className="text-3xl md:text-5xl font-serif text-luxury-black font-bold uppercase tracking-tight">{currentPortfolio.title}</h1>
                        {currentPortfolio.category && (
                          <span className="px-4 py-1.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded-full">
                            {currentPortfolio.category}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-luxury-gray mb-10">
                        <MapPin size={20} className="text-luxury-gold" />
                        <span className="text-lg uppercase tracking-wider">{currentPortfolio.location || 'Location Not Specified'}</span>
                      </div>

                      {/* Key Info Blocks */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                        {currentPortfolio.category && (
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Project Category</span>
                            <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentPortfolio.category}</span>
                          </div>
                        )}
                        {currentPortfolio.year && (
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Completion Year</span>
                            <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentPortfolio.year}</span>
                          </div>
                        )}
                      </div>

                      {/* About the Project Section */}
                      <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 mb-12">
                        <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight border-b border-luxury-border pb-4">
                          About the Project
                        </h2>
                        <div className="prose prose-lg max-w-none text-luxury-gray font-light leading-relaxed whitespace-pre-line">
                          {currentPortfolio.description || 'No description available for this project.'}
                        </div>
                      </div>
                    </div>

                    {/* Right Sidebar Inquiry Form (Desktop Sticky) */}
                    <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
                      <div className="bg-luxury-black text-white p-8 rounded-xl shadow-xl shadow-black/10">
                        <h3 className="text-2xl font-serif font-bold mb-2">Interested?</h3>
                        <p className="text-white/70 text-sm mb-6">Contact our team to learn more about this project or similar opportunities.</p>

                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); }}>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Your Name</label>
                            <input type="text" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="John Doe" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Email Address</label>
                            <input type="email" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="john@example.com" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Phone Number</label>
                            <input type="tel" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="+94 77 XXX XXXX" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Message</label>
                            <textarea rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors resize-none" placeholder={`I'm interested in ${currentPortfolio.title}...`}></textarea>
                          </div>
                          <button type="submit" className="w-full bg-luxury-gold text-white font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white hover:text-luxury-black transition-colors mt-4">
                            Send Inquiry
                          </button>
                        </form>
                      </div>
                    </div>

                  </div>
                </div>
               </>
             ) : (
               <div className="h-[60vh] flex items-center justify-center text-luxury-gold">
                   <Loader2 size={48} className="animate-spin" />
               </div>
             )}
          </div>
        )}

        {/* 3. Portfolio Page */}
        {activePage === 'portfolio' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] py-16 md:py-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-12">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">Our Portfolio</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto">Take a look at some of our completed projects.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {projects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-white rounded-[10px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)] group flex flex-col cursor-pointer transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0px_8px_20px_rgba(212,175,55,0.2)]"
                  onClick={() => navigate('portfolio-detail', proj.id)}
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover border-b-2 border-luxury-gold transition-transform duration-500 group-hover:scale-105" />
                    {proj.category && (
                      <div className="absolute top-4 left-4 bg-luxury-black/60 backdrop-blur-md text-white text-[8px] uppercase tracking-widest px-3 py-1.5 font-bold rounded-lg">
                        {proj.category}
                      </div>
                    )}
                  </div>
                  <div className="p-[20px] text-left flex flex-col flex-grow">
                    <h3 className={`text-[22px] font-serif font-bold text-[#333] ${proj.description ? 'mb-2' : 'mb-2'}`}>{proj.title}</h3>

                    {proj.description && (
                      <p className="text-sm text-luxury-gray line-clamp-3 md:line-clamp-2 mb-4">
                        {proj.description}
                      </p>
                    )}

                    <p className="text-[16px] text-[#777] mb-1">Location: {proj.location}</p>
                    <p className="text-[16px] text-[#777] mb-6">Year: {proj.year}</p>
                    <div className="mt-auto">
                      <button
                        className="bg-luxury-gold text-white px-[20px] py-[10px] text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('portfolio-detail', proj.id);
                        }}
                      >
                        View Project
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Properties Page */}
        {activePage === 'houses' && (
          <HousesListing properties={houses} onNavigate={navigate} />
        )}

        {activePage === 'lands' && (
          <LandsListing properties={lands} onNavigate={navigate} />
        )}

        {(activePage === 'properties' || activePage === 'projects') && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pb-24">
             <div className="bg-luxury-black py-24 px-mobile text-center relative overflow-hidden mb-16">
                <div className="absolute inset-0 z-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/90 z-10"></div>
                  <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover opacity-50" alt="Properties Hero" />
                </div>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 relative z-10">
                  Our Portfolio
                </h1>
                <p className="text-white/80 max-w-2xl mx-auto font-light text-lg relative z-10">
                  Explore our complete portfolio of premium properties, including exclusive lands and luxurious homes.
                </p>
              </div>

            <div className="max-w-7xl mx-auto px-mobile">
              <div className="flex items-center gap-4 mb-8">
                 <h2 className="text-2xl font-serif font-bold text-luxury-black">
                   All Properties
                 </h2>
                 <div className="flex-1 h-px bg-gray-200"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {[...lands.map(l => ({...l, _originalId: l.id, id: "land-"+l.id})), ...houses.map(h => ({...h, _originalId: h.id, id: "house-"+h.id}))].sort((a, b) => (b.sortOrder || 0) - (a.sortOrder || 0)).map(prop => (
                   <div key={prop.id} className="bg-white rounded-[10px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)] group flex flex-col">
                     <div className="relative aspect-[16/10] overflow-hidden">
                       <img src={prop.image} alt={prop.title} className="w-full h-full object-cover border-b-2 border-luxury-gold transition-transform duration-500 group-hover:scale-105" />
                     </div>
                     <div className="p-[20px] text-left flex flex-col flex-grow">
                       <h3 className="text-[22px] font-serif font-bold text-[#333] mb-2">{prop.title}</h3>
                       <p className="text-[16px] text-[#777] mb-1">Location: {prop.location.split(',')[0]}</p>
                       <p className="text-[16px] text-[#777] mb-6 font-bold">Price: {prop.price}</p>
                       <div className="mt-auto">
                         <button onClick={() => navigate('detail', prop._originalId || prop.id)} className="bg-luxury-gold text-white px-[20px] py-[10px] text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark">View Details</button>
                       </div>
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Virtual Tour */}
        {activePage === 'virtual-tour' && (
          <div className="animate-in fade-in duration-500 bg-[#f4f4f4] min-h-screen py-24 pb-32">
            <div className="max-w-7xl mx-auto px-mobile">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight">Virtual Experience</h1>
                <p className="text-luxury-gray text-lg font-light leading-relaxed">Step inside our premium properties from anywhere in the world. Experience the luxury, space, and finishes firsthand.</p>
              </div>
              <div className="aspect-[16/9] w-full bg-black rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative group border border-gray-800">
                <div className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer">
                  <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-luxury-gold group-hover:border-luxury-gold transition-all duration-500 hover:scale-110 shadow-lg">
                    <Play size={40} className="text-white ml-2" />
                  </div>
                </div>
                <div className="absolute inset-0 opacity-60 group-hover:opacity-80 transition-opacity duration-700">
                  <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover rounded-lg" alt="VR View" />
                </div>
              </div>
              <div className="text-center pt-8">
                <p className="text-xl text-luxury-black mb-8 font-serif">Ready to visit in person? Join us for an exclusive site preview.</p>
                <button onClick={() => navigate('contact')} className="bg-luxury-gold text-white px-12 py-5 rounded-lg font-bold uppercase tracking-brand shadow-gold-glow hover:bg-luxury-golddark transition-all">Schedule a Visit</button>
              </div>
            </div>
          </div>
        )}

        {/* 7. Contact Us Page */}
        {activePage === 'contact' && (
          <Contact onNavigate={navigate} />
        )}

        {/* 8. Other Pages (Blogs, News etc.) */}
        {['news', 'publications', 'blogs', 'testimonials', 'kyc', 'privacy', 'terms'].includes(activePage) && (
           <div className="py-24 px-mobile min-h-screen text-center bg-[#f4f4f4]">
             <h2 className="text-4xl font-serif font-bold text-luxury-black uppercase">{activePage.replace(/-/g, ' ')}</h2>
             <p className="text-luxury-gray mt-6 max-w-xl mx-auto">This specialized section is being curated to provide the most accurate information regarding our premium services and policies.</p>
           </div>
        )}


        {/* 9. Detail Page View */}
        {activePage === 'detail' && (
          <div className="animate-in fade-in duration-500 bg-[#f4f4f4] pb-32">
            {propertyError ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <p className="text-xl text-luxury-gold font-serif mb-4">{propertyError}</p>
                <button onClick={() => navigate('properties')} className="px-6 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-90 transition shadow-md">Back to Properties</button>
              </div>
            ) : !currentProperty ? (
              <div className="h-[60vh] flex items-center justify-center text-luxury-gold">
                <Loader2 size={48} className="animate-spin" />
              </div>
            ) : (
              (currentProperty.type?.toLowerCase() === 'land' || currentProperty.type?.toLowerCase() === 'lands') ? (
                 <LandDetail
                    property={currentProperty}
                    onNavigate={navigate}
                    recommendedLands={lands.filter(p => p.id !== currentProperty.id).slice(0, 3)}
                    onOpenConsultation={() => setIsModalOpen(true)}
                    setSelectedImage={setSelectedImage}
                 />
              ) : (currentProperty.type?.toLowerCase() === 'house' || currentProperty.type?.toLowerCase() === 'apartment' || currentProperty.type?.toLowerCase() === 'houses') ? (
                 <HouseDetail
                    property={currentProperty}
                    onNavigate={navigate}
                    recommendedHouses={houses.filter(p => p.id !== currentProperty.id).slice(0, 3)}
                    onOpenConsultation={() => setIsModalOpen(true)}
                    setSelectedImage={setSelectedImage}
                 />
              ) : (
                <>
                  {/* Image Gallery Hero */}
                  <div className="w-full bg-luxury-black">
                    <div className="max-w-[1920px] mx-auto relative h-[50vh] md:h-[70vh] overflow-hidden group">
                      <img
                        src={currentProperty.image}
                        className="w-full h-full object-cover"
                        alt={currentProperty.title}
                        onClick={() => setSelectedImage(currentProperty.image)}
                      />
                      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                    </div>

                    {/* Thumbnails Strip */}
                    {currentProperty.images && currentProperty.images.length > 0 && (
                      <div className="max-w-7xl mx-auto px-mobile py-4 flex gap-4 overflow-x-auto container-overflow-fix snap-x">
                        <div
                          className="flex-shrink-0 w-24 h-16 md:w-32 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 border-luxury-gold shadow-md snap-start"
                          onClick={() => setSelectedImage(currentProperty.image)}
                        >
                           <img src={currentProperty.image} className="w-full h-full object-cover" alt="Cover" />
                        </div>
                        {currentProperty.images.map((img) => (
                          <div
                            key={img.id}
                            className="flex-shrink-0 w-24 h-16 md:w-32 md:h-24 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-luxury-gold/50 transition-colors shadow-md snap-start"
                            onClick={() => setSelectedImage(img.image_url)}
                          >
                            <img src={img.image_url} className="w-full h-full object-cover" alt="Gallery" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="max-w-7xl mx-auto px-mobile pt-12">
                    <div className="flex flex-col lg:flex-row gap-12 items-start">

                      {/* Main Content Column */}
                      <div className="flex-1 w-full">
                        {/* Title & Badge Row */}
                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <h1 className="text-3xl md:text-5xl font-serif text-luxury-black font-bold uppercase tracking-tight">{currentProperty.title}</h1>
                          {currentProperty.status && (
                            <span className="px-4 py-1.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-md">
                              {currentProperty.status}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-luxury-gray mb-8">
                          <MapPin size={20} className="text-luxury-gold" />
                          <span className="text-lg uppercase tracking-wider">{currentProperty.location}</span>
                        </div>

                        {/* Prominent Price */}
                        {currentProperty.price && (
                          <div className="mb-10 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-luxury-gold">
                            <p className="text-sm text-luxury-gray uppercase tracking-widest font-bold mb-2">Asking Price</p>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-luxury-black">{formatPrice(currentProperty.price)}</p>
                          </div>
                        )}

                        {/* Key Info Blocks */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                          {currentProperty.type && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                              <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Property Type</span>
                              <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentProperty.type}</span>
                            </div>
                          )}
                          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                            <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Location</span>
                            <span className="text-luxury-black font-serif text-lg md:text-xl font-bold line-clamp-1">{currentProperty.location}</span>
                          </div>
                          {currentProperty.beds !== undefined && currentProperty.beds !== null && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                              <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Bedrooms</span>
                              <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentProperty.beds}</span>
                            </div>
                          )}
                          {currentProperty.sqft !== undefined && currentProperty.sqft !== null && (
                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                              <span className="text-luxury-gray text-xs uppercase tracking-wider font-bold mb-2">Area</span>
                              <span className="text-luxury-black font-serif text-lg md:text-xl font-bold">{currentProperty.sqft} sqft</span>
                            </div>
                          )}
                        </div>

                        {/* About the Property Section */}
                        {currentProperty.description && (
                          <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-100 mb-12">
                            <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight border-b border-luxury-border pb-4">
                              About the Property
                            </h2>
                            <div className="prose prose-lg max-w-none text-luxury-gray font-light leading-relaxed whitespace-pre-line">
                              {currentProperty.description}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right Sidebar Inquiry Form (Desktop Sticky) */}
                      <div className="w-full lg:w-[400px] lg:sticky lg:top-32">
                        <div className="bg-luxury-black text-white p-8 rounded-xl shadow-xl shadow-black/10">
                          <h3 className="text-2xl font-serif font-bold mb-2">Interested?</h3>
                          <p className="text-white/70 text-sm mb-6">Contact our sales team to schedule a viewing or request more information.</p>

                          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); }}>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Your Name</label>
                              <input type="text" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="John Doe" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Email Address</label>
                              <input type="email" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="john@example.com" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Phone Number</label>
                              <input type="tel" required className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors" placeholder="+94 77 XXX XXXX" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold uppercase tracking-wider text-white/60 mb-2">Message</label>
                              <textarea rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-luxury-gold transition-colors resize-none" placeholder={`I'm interested in ${currentProperty.title}...`}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-luxury-gold text-white font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white hover:text-luxury-black transition-colors mt-4 shadow-md">
                              Send Inquiry
                            </button>
                          </form>
                        </div>
                      </div>

                    </div>
                  </div>
                </>
              )
            )}
          </div>
        )}
      </main>

      <Footer onNavigate={navigate} />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <img
            src={selectedImage}
            alt="Full size preview"
            className="max-w-[100vw] max-h-[90vh] object-contain rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default App;
