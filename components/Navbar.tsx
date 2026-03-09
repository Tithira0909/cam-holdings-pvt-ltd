import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Facebook, Youtube, Instagram, Globe, ChevronDown } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigate: (page: 'home' | 'projects' | 'houses' | 'detail' | 'services' | 'about' | 'contact' | 'portfolio' | 'virtual-tour' | 'news' | 'publications' | 'blogs') => void;
  activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation, onNavigate, activePage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPropertiesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Lands', page: 'lands' },
    { label: 'Houses', page: 'houses' },
    { label: 'Portfolio Properties', page: 'portfolio' },
    { label: 'Contact Us', page: 'contact' },
  ];

  const isHome = activePage === 'home';
  // Homepage Top: White text. Scrolled or Other pages: Dark text.
  const useWhiteText = isHome && !isScrolled;
  const textColorClass = useWhiteText ? 'text-white nav-text-shadow' : 'text-luxury-black';
  const logoColorClass = useWhiteText ? 'text-white nav-text-shadow' : 'text-luxury-black';
  
  // Background logic: Transparent on home top, semi-transparent white elsewhere when scrolled or internal.
  const bgClass = useWhiteText ? 'bg-transparent h-24' : 'nav-blur h-20 shadow-sm';

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${bgClass}`}>
        <div className="max-w-7xl mx-auto w-full h-full px-mobile flex justify-between items-center">
          
          {/* Logo */}
        <div
  onClick={() => onNavigate("home")}
  className="flex items-center gap-3 cursor-pointer group"
>
  <img
    src="/assets/cam_logo.png"
    alt="Crown Asia Majestic Holdings (Pvt) Ltd"
    className="h-10 md:h-12 w-auto object-contain"
  />

  <div
    className={`font-serif text-3xl md:text-4xl font-bold tracking-brand transition-colors ${logoColorClass}`}
  >

  </div>
</div>


          {/* Menu */}
          <div className="hidden lg:flex items-center gap-6 ml-auto">
            {navLinks.map((link, idx) => (
              <div
                key={idx}
                className="relative group/dropdown"
                ref={link.page === 'dropdown' ? dropdownRef : null}
                onMouseEnter={() => link.page === 'dropdown' && setIsPropertiesDropdownOpen(true)}
                onMouseLeave={() => link.page === 'dropdown' && setIsPropertiesDropdownOpen(false)}
              >
                {link.page === 'dropdown' ? (
                  <div
                    className={`text-[14px] uppercase tracking-luxury font-bold transition-all relative flex items-center gap-1 cursor-pointer group hover:text-luxury-gold py-4 ${
                      activePage === 'properties' || activePage === 'lands' || activePage === 'houses'
                        ? 'text-luxury-gold'
                        : textColorClass
                    }`}
                    onClick={() => onNavigate('properties' as any)}
                  >
                    {link.label}
                    <ChevronDown size={14} className={`transition-transform duration-300 group-hover/dropdown:rotate-180`} />
                  </div>
                ) : (
                  <button
                    onClick={() => onNavigate(link.page as any)}
                    className={`text-[14px] uppercase tracking-luxury font-bold transition-all relative group hover:text-luxury-gold py-4 ${
                      activePage === link.page
                        ? 'text-luxury-gold'
                        : textColorClass
                    }`}
                  >
                    {link.label}
                    <span className={`absolute bottom-3 left-0 w-0 h-0.5 bg-luxury-gold transition-all group-hover:w-full ${activePage === link.page ? 'w-full' : ''}`}></span>
                  </button>
                )}

                {/* Dropdown Menu */}
                {link.page === 'dropdown' && (
                  <div className="absolute top-full left-0 w-48 bg-white shadow-xl rounded-lg py-2 border border-luxury-border z-[110] opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-200 translate-y-2 group-hover/dropdown:translate-y-0">
                    {link.dropdownItems?.map((item, itemIdx) => (
                      <button
                        key={itemIdx}
                        onClick={() => {
                          onNavigate(item.page as any);
                          setIsPropertiesDropdownOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
                          activePage === item.page ? 'text-luxury-gold bg-luxury-offwhite' : 'text-luxury-black hover:text-luxury-gold hover:bg-luxury-offwhite'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Spacer to push menu items slightly to left if needed, or remove completely */}

          {/* Mobile Toggle */}
          <div className="flex lg:hidden items-center gap-4">
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2"
            >
              <Menu size={32} className={textColorClass} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[200] ${isDrawerOpen ? 'visible' : 'invisible'} transition-all duration-300`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 ${isDrawerOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsDrawerOpen(false)} />
        <div className={`absolute top-0 right-0 h-full bg-white shadow-2xl transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'} w-[80%] flex flex-col`}>
          <div className="h-24 flex items-center justify-between px-10 border-b border-luxury-border">
            <div className="font-serif text-2xl font-bold text-luxury-black tracking-widest uppercase"><span className="text-luxury-gold">C</span>AM</div>
            <button onClick={() => setIsDrawerOpen(false)} className="text-luxury-gold"><X size={36} /></button>
          </div>
          <div className="flex-grow overflow-y-auto py-12 text-center">
            <ul className="space-y-8 px-10">
              {navLinks.map((link, idx) => (
                <li key={idx} className="flex flex-col items-center">
                  {link.page === 'dropdown' ? (
                     <>
                        <button onClick={() => setIsPropertiesDropdownOpen(!isPropertiesDropdownOpen)} className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors flex items-center gap-2">
                           {link.label} <ChevronDown size={24} className={`transition-transform duration-300 ${isPropertiesDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isPropertiesDropdownOpen && (
                          <ul className="mt-4 space-y-4">
                             {link.dropdownItems?.map((item, itemIdx) => (
                               <li key={itemIdx}>
                                 <button onClick={() => { setIsDrawerOpen(false); onNavigate(item.page as any); setIsPropertiesDropdownOpen(false); }} className="text-lg font-bold uppercase tracking-wider text-luxury-gray hover:text-luxury-gold transition-colors">
                                   - {item.label}
                                 </button>
                               </li>
                             ))}
                          </ul>
                        )}
                     </>
                  ) : (
                    <button onClick={() => { setIsDrawerOpen(false); onNavigate(link.page as any); }} className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors block w-full">
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;