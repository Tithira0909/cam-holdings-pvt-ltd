import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Newsletter from './components/Newsletter';
import PropertyCard from './components/PropertyCard';
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

type Page = 'home' | 'projects' | 'lands' | 'houses' | 'detail' | 'portfolio-detail' | 'services' | 'service-detail' | 'about' | 'contact' | 'portfolio' | 'testimonials' | 'kyc' | 'privacy' | 'terms' | 'virtual-tour' | 'news' | 'publications' | 'blogs' | 'admin';

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
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  const [currentPortfolio, setCurrentPortfolio] = useState<Project | null>(null);
  const [currentProperty, setCurrentProperty] = useState<Property | null>(null);
  const [propertyError, setPropertyError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      const [propsRes, projsRes, svcsRes] = await Promise.all([
        fetch(`/api/properties${queryParam}`),
        fetch('/api/projects'),
        fetch('/api/services')
      ]);

      if (propsRes.ok) {
        const propsData = await propsRes.json();
        setProperties(propsData.map((p: any) => ({ ...p, id: String(p.id) })));
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
          const res = await fetch(`/api/properties/${selectedProjectId}`);
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
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
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
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
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
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
             {currentPortfolio ? (
               <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                 <div className="relative aspect-video">
                   <img src={currentPortfolio.image} alt={currentPortfolio.title} className="w-full h-full object-cover" />
                   {currentPortfolio.category && (
                     <div className="absolute top-4 left-4 bg-luxury-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-4 py-2 font-bold rounded-lg">
                       {currentPortfolio.category}
                     </div>
                   )}
                 </div>
                 <div className="p-8 md:p-12">
                   <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-luxury-border pb-8">
                     <div>
                       <h1 className="text-3xl md:text-4xl font-serif font-bold text-luxury-black mb-4">{currentPortfolio.title}</h1>
                       <div className="flex flex-wrap items-center gap-4 text-luxury-gray text-sm md:text-base font-bold">
                         <div className="flex items-center gap-1.5"><MapPin size={18} className="text-luxury-gold" /> {currentPortfolio.location}</div>
                         <div className="flex items-center gap-1.5"><Calendar size={18} className="text-luxury-gold" /> {currentPortfolio.year}</div>
                       </div>
                     </div>
                     <button
                       onClick={() => navigate('portfolio')}
                       className="bg-luxury-gold text-white px-6 py-3 text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark whitespace-nowrap"
                     >
                       Back to Portfolio
                     </button>
                   </div>

                   <div className="prose prose-lg max-w-none text-luxury-gray">
                     <p className="whitespace-pre-line leading-relaxed text-[16px] md:text-[18px]">
                       {currentPortfolio.description || 'No description available for this project.'}
                     </p>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="h-[60vh] flex items-center justify-center text-luxury-gold">
                   <Loader2 size={48} className="animate-spin" />
               </div>
             )}
          </div>
        )}

        {/* 3. Portfolio Page */}
        {activePage === 'portfolio' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
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
        {(activePage === 'properties' || activePage === 'lands' || activePage === 'houses' || activePage === 'projects') && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">
                {activePage === 'lands' ? 'Lands' : activePage === 'houses' ? 'Houses' : 'All Properties'}
              </h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto mb-8">
                {activePage === 'lands'
                  ? 'Explore our exclusive land projects in prime locations that offer immense potential for investment and development.'
                  : activePage === 'houses'
                    ? 'Discover luxurious homes and apartments that combine comfort and design, ideal for families seeking premium living.'
                    : 'Explore our complete portfolio of premium properties, including exclusive lands and luxurious homes.'}
              </p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px] animate-in fade-in slide-in-from-bottom-4 duration-500">
              {properties.filter(p => {
                const t = (p.type || "").trim().toLowerCase();
                if (activePage === 'lands') return t === 'land' || t === 'lands';
                if (activePage === 'houses') return t === 'house' || t === 'houses' || t === 'apartment';
                return true; // 'properties' shows all
              }).map(prop => (
                <div key={prop.id} className="bg-white rounded-[10px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)] group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={prop.image} alt={prop.title} className="w-full h-full object-cover border-b-2 border-luxury-gold transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-[20px] text-left flex flex-col flex-grow">
                    <h3 className="text-[22px] font-serif font-bold text-[#333] mb-2">{prop.title}</h3>
                    <p className="text-[16px] text-[#777] mb-1">Location: {prop.location.split(',')[0]}</p>
                    <p className="text-[16px] text-[#777] mb-6 font-bold">Price: {prop.price}</p>
                    <div className="mt-auto">
                      <button onClick={() => navigate('detail', prop.id)} className="bg-luxury-gold text-white px-[20px] py-[10px] text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark">View Details</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
{/* 5. Contact Page */}
        {activePage === 'contact' && (
          <div className="animate-in fade-in duration-500">
            <section className="relative h-[50vh] w-full flex items-center justify-center overflow-hidden bg-luxury-black">
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600')` }}
              />
              <div className="absolute inset-0 bg-black/40 z-[1]" />
              <div className="relative z-10 text-center px-mobile max-w-[80%] mx-auto">
                <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 uppercase tracking-tight">Get in Touch</h1>
                <p className="text-white/80 text-lg md:text-xl font-light mb-10 max-w-2xl mx-auto">We’re here to assist you in your property journey.</p>
                <a href="#contact-form" className="inline-block bg-luxury-gold text-white px-8 py-4 rounded-lg font-bold text-[14px] uppercase tracking-brand hover:bg-luxury-golddark transition-all shadow-lg">Request a Consultation</a>
              </div>
            </section>
            
            <section id="contact-form" className="py-24 px-mobile bg-[#f4f4f4]">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-serif font-bold text-luxury-black mb-10 uppercase">Send Us a Message</h2>
                <form
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const data = {
                      full_name: formData.get('full_name'),
                      email: formData.get('email'),
                      message: formData.get('message'),
                      subject: 'Contact Form Inquiry',
                      service: 'General'
                    };

                    try {
                       const res = await fetch('/api/inquiries', {
                         method: 'POST',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(data)
                       });
                       if (res.ok) {
                         alert('Message sent successfully!');
                         form.reset();
                       } else {
                         alert('Failed to send message.');
                       }
                    } catch (err) {
                      console.error(err);
                      alert('An error occurred.');
                    }
                  }}
                >
                  <input name="full_name" type="text" placeholder="Your Name" required className="w-full p-[12px] border border-luxury-gold rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none transition-all" />
                  <input name="email" type="email" placeholder="Your Email" required className="w-full p-[12px] border border-luxury-gold rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none transition-all" />
                  <textarea name="message" placeholder="Your Message" required rows={6} className="w-full p-[12px] border border-luxury-gold rounded-lg focus:ring-1 focus:ring-luxury-gold outline-none transition-all resize-none"></textarea>
                  <button type="submit" className="bg-luxury-gold text-white px-10 py-4 rounded-lg font-bold uppercase tracking-brand hover:bg-luxury-golddark transition-all w-full md:w-auto">Send Message</button>
                </form>
              </div>
            </section>
          </div>
        )}

        {/* 6. Virtual Tour Page */}
        {activePage === 'virtual-tour' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">Explore Our Properties Virtually</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto">Take a virtual tour of our premium properties from the comfort of your home.</p>
            </div>
            <div className="max-w-7xl mx-auto space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] aspect-video overflow-hidden">
                   <div className="relative w-full h-full bg-luxury-black rounded-lg group cursor-pointer overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1600607687940-467f4b637779?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" alt="Virtual Tour" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-luxury-gold rounded-full flex items-center justify-center shadow-gold-glow animate-pulse">
                          <Play size={32} className="text-white fill-current ml-1" />
                        </div>
                     </div>
                   </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] aspect-video overflow-hidden">
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

        {/* 7. Other Pages (Blogs, News etc.) */}
        {['news', 'publications', 'blogs', 'testimonials', 'kyc', 'privacy', 'terms'].includes(activePage) && (
           <div className="pt-40 px-mobile min-h-screen text-center bg-[#f4f4f4]">
             <h2 className="text-4xl font-serif font-bold text-luxury-black uppercase">{activePage.replace(/-/g, ' ')}</h2>
             <p className="text-luxury-gray mt-6 max-w-xl mx-auto">This specialized section is being curated to provide the most accurate information regarding our premium services and policies.</p>
           </div>
        )}

        {/* 8. Detail Page View */}
        {activePage === 'detail' && (
          <div className="animate-in fade-in duration-500 bg-white pb-32">
            {propertyError ? (
              <div className="h-[60vh] flex flex-col items-center justify-center text-center">
                <p className="text-xl text-red-500 font-serif mb-4">{propertyError}</p>
                <button onClick={() => navigate('properties')} className="px-6 py-2 bg-luxury-gold text-white rounded hover:bg-opacity-90 transition">Back to Properties</button>
              </div>
            ) : !currentProperty ? (
              <div className="h-[60vh] flex items-center justify-center text-luxury-gold">
                <Loader2 size={48} className="animate-spin" />
              </div>
            ) : (
              <>
                <div className="relative h-[60vh] w-full overflow-hidden">
                  <img src={currentProperty.image} className="w-full h-full object-cover" alt={currentProperty.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-12 px-mobile w-full flex justify-center">
                    <div className="max-w-7xl w-full">
                      <div className="flex items-center gap-3 text-luxury-gold mb-4">
                        <MapPin size={20} />
                        <span className="text-sm uppercase font-bold tracking-brand">{currentProperty.location}</span>
                      </div>
                      <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-4 uppercase">{currentProperty.title}</h1>

                      {/* Key Info Row */}
                      <div className="flex flex-wrap items-center gap-6 mt-6">
                        {currentProperty.price && (
                           <div className="bg-luxury-gold/20 backdrop-blur-md border border-luxury-gold/30 rounded-lg px-6 py-3">
                             <p className="text-luxury-gold text-sm uppercase tracking-widest font-bold mb-1">Price</p>
                             <p className="text-white font-serif text-xl md:text-2xl">{formatPrice(currentProperty.price)}</p>
                           </div>
                        )}
                        {currentProperty.type && (
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-3">
                            <p className="text-gray-300 text-sm uppercase tracking-widest font-bold mb-1">Type</p>
                            <p className="text-white font-serif text-lg">{currentProperty.type}</p>
                          </div>
                        )}
                        {currentProperty.status && (
                          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg px-6 py-3">
                            <p className="text-gray-300 text-sm uppercase tracking-widest font-bold mb-1">Status</p>
                            <p className="text-white font-serif text-lg">{currentProperty.status}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="max-w-7xl mx-auto px-mobile py-16">
                  {/* Description Section */}
                  {currentProperty.description && (
                    <div className="mb-12">
                      <h2 className="text-2xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight border-b border-luxury-border pb-4">
                        Description
                      </h2>
                      <div className="prose prose-lg max-w-none text-[#555] font-light leading-relaxed whitespace-pre-line">
                        {currentProperty.description}
                      </div>
                    </div>
                  )}
                </div>
              </>
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
