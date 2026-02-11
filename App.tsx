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

type Page = 'home' | 'projects' | 'lands' | 'houses' | 'detail' | 'services' | 'about' | 'contact' | 'portfolio' | 'testimonials' | 'kyc' | 'privacy' | 'terms' | 'virtual-tour' | 'news' | 'publications' | 'blogs' | 'admin';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<Page>('home');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAdmin') === 'true');

  // Data State
  const [properties, setProperties] = useState<Property[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, selectedProjectId]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propsRes, projsRes] = await Promise.all([
        fetch('/api/properties'),
        fetch('/api/projects')
      ]);

      if (propsRes.ok) {
        const propsData = await propsRes.json();
        // Ensure id is string
        setProperties(propsData.map((p: any) => ({ ...p, id: String(p.id) })));
      }

      if (projsRes.ok) {
        const projsData = await projsRes.json();
        setProjects(projsData.map((p: any) => ({ ...p, id: String(p.id) })));
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const navigate = (page: Page, id?: string) => {
    setActivePage(page);
    if (id) setSelectedProjectId(id);
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

  // If activePage is admin, we render the admin flow exclusively
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

  const selectedProperty = properties.find(p => p.id === selectedProjectId);

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

        {/* Lands Page */}
        {activePage === 'lands' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">Lands</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto">Explore our exclusive land projects in prime locations that offer immense potential for investment and development.</p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
              {properties.filter(p => p.type === PropertyType.LAND).map(prop => (
                <PropertyCard key={prop.id} property={prop} onClick={() => navigate('detail', prop.id)} />
              ))}
            </div>
          </div>
        )}

        {/* Houses Page */}
        {activePage === 'houses' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-16">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">Houses</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto">Discover luxurious homes that combine comfort and design, ideal for families seeking premium living.</p>
            </div>
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[30px]">
              {properties.filter(p => p.type === PropertyType.HOUSE).map(prop => (
                <PropertyCard key={prop.id} property={prop} onClick={() => navigate('detail', prop.id)} />
              ))}
            </div>
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
              {[
                { 
                  icon: Building, 
                  title: 'Property Development', 
                  desc: 'We specialize in the development of premium residential and commercial properties, setting new standards in Sri Lankan architecture.' 
                },
                { 
                  icon: Settings, 
                  title: 'Property Management',
                  desc: 'Our team ensures that your project is completed on time, within budget, and to the highest quality through single-point accountability.' 
                },
                { 
                  icon: Users, 
                  title: 'Consultancy Services', 
                  desc: 'We offer professional advice to guide you through the real estate process from start to finish, ensuring investment growth.' 
                }
              ].map((service, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] p-10 text-center flex flex-col items-center group hover:shadow-xl transition-all border-b-4 border-transparent hover:border-luxury-gold">
                  <div className="w-20 h-20 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold/10 transition-colors">
                    <service.icon size={40} className="text-luxury-gold" />
                  </div>
                  <h3 className="text-[22px] font-serif font-bold text-luxury-black mb-4">{service.title}</h3>
                  <p className="text-[16px] text-[#777] leading-relaxed font-light">{service.desc}</p>
                </div>
              ))}
            </div>
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
                <div key={proj.id} className="bg-white rounded-[10px] overflow-hidden shadow-[0px_4px_10px_rgba(0,0,0,0.1)] group flex flex-col">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={proj.image} alt={proj.title} className="w-full h-full object-cover border-b-2 border-luxury-gold transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-[20px] text-left flex flex-col flex-grow">
                    <h3 className="text-[22px] font-serif font-bold text-[#333] mb-2">{proj.title}</h3>
                    <p className="text-[16px] text-[#777] mb-1">Location: {proj.location}</p>
                    <p className="text-[16px] text-[#777] mb-6">Year: {proj.year}</p>
                    <div className="mt-auto">
                      <button className="bg-luxury-gold text-white px-[20px] py-[10px] text-[14px] font-bold rounded-[8px] cursor-pointer transition-all duration-300 hover:bg-luxury-golddark">View Project</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Properties Page */}
        {activePage === 'projects' && (
          <div className="animate-in fade-in duration-500 min-h-screen bg-[#f4f4f4] pt-32 pb-24 px-mobile">
            <div className="max-w-7xl mx-auto text-center mb-12">
              <h2 className="text-[36px] font-serif font-bold text-luxury-black mb-5 uppercase tracking-tight">Our Properties</h2>
              <p className="text-[18px] text-luxury-gray font-normal max-w-2xl mx-auto">Explore the best properties for sale that fit your needs.</p>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[20px]">
              {properties.map(prop => (
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
            <div className="relative h-[60vh] w-full overflow-hidden">
              <img src={selectedProperty?.image || properties[0]?.image} className="w-full h-full object-cover" alt="Detail" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-12 px-mobile w-full flex justify-center">
                <div className="max-w-7xl w-full">
                  <div className="flex items-center gap-3 text-luxury-gold mb-4">
                    <MapPin size={20} />
                    <span className="text-sm uppercase font-bold tracking-brand">{selectedProperty?.location || 'Location'}</span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-4 uppercase">{selectedProperty?.title || 'Property Detail'}</h1>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={navigate} />
      <ConsultationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default App;
