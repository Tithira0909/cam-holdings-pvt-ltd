import React, { useState, useEffect } from 'react';
import { Menu, X, Facebook, Youtube, Instagram, Globe } from 'lucide-react';

interface NavbarProps {
  onOpenConsultation: () => void;
  onNavigate: (page: 'home' | 'properties' | 'lands' | 'houses' | 'detail' | 'services' | 'about' | 'contact' | 'portfolio' | 'virtual-tour') => void;
  activePage: string;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenConsultation, onNavigate, activePage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

    const navLinks = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Virtual Tour', page: 'virtual-tour' },
    { label: 'Projects', page: 'portfolio' },
    {
      label: 'Properties',
      page: 'properties',
      dropdown: [
        { label: 'Lands', page: 'lands' },
        { label: 'Houses', page: 'houses' }
      ]
    },
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
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`font-serif text-3xl md:text-4xl font-bold tracking-brand transition-colors ${logoColorClass}`}>
              <span className="text-luxury-gold">C</span>AM
            </div>
          </div>

          {/* Menu */}
          <div className="hidden lg:flex items-center gap-8 ml-auto">
            {navLinks.map((link, idx) => (
              <div key={idx} className="relative group/dropdown">
                <button
                  onClick={() => onNavigate(link.page === 'dropdown' ? 'properties' : link.page as any)}
                  className={`text-[16px] uppercase tracking-luxury font-bold transition-all relative group hover:text-luxury-gold ${
                    (activePage === link.page || activePage === 'properties' || (link.dropdown && link.dropdown.some(d => d.page === activePage)))
                      ? 'text-luxury-gold'
                      : textColorClass
                  }`}
                >
                  {link.label}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-luxury-gold transition-all group-hover:w-full ${(activePage === link.page || (link.dropdown && link.dropdown.some(d => d.page === activePage))) ? 'w-full' : ''}`}></span>
                </button>
                {link.dropdown && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-300 transform origin-top border-t-2 border-luxury-gold z-[150]">
                    {link.dropdown.map((sub, subIdx) => (
                      <button
                        key={subIdx}
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(sub.page as any);
                        }}
                        className={`block w-full text-left px-6 py-4 text-[14px] uppercase tracking-widest font-bold transition-colors ${
                          activePage === sub.page ? 'text-luxury-gold bg-gray-50' : 'text-luxury-black hover:text-luxury-gold hover:bg-gray-50'
                        }`}
                      >
                        {sub.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Social & Language */}
          <div className="hidden xl:flex items-center gap-6 ml-10">
            <div className={`flex items-center gap-4 border-l ${useWhiteText ? 'border-white/20' : 'border-luxury-black/10'} pl-6`}>
              {[Facebook, Youtube, Instagram].map((Icon, i) => (
                <a key={i} href="#" className={`${textColorClass} hover:text-luxury-gold transition-all`}>
                  <Icon size={18} />
                </a>
              ))}
            </div>
            <div className={`flex items-center gap-2 ${textColorClass} hover:text-luxury-gold cursor-pointer`}>
              <Globe size={18} />
              <select className="bg-transparent text-[14px] font-bold uppercase tracking-widest outline-none border-none cursor-pointer">
                <option value="en" className="text-black">EN</option>
                <option value="si" className="text-black">SI</option>
                <option value="ta" className="text-black">TA</option>
              </select>
            </div>
          </div>

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
                <li key={idx} className="flex flex-col">
                  <button onClick={() => { setIsDrawerOpen(false); onNavigate(link.page as any); }} className="text-2xl font-bold uppercase tracking-brand text-luxury-black hover:text-luxury-gold transition-colors block w-full">
                    {link.label}
                  </button>
                  {link.dropdown && (
                    <div className="mt-4 flex flex-col space-y-4 border-t border-luxury-border/30 pt-4">
                      {link.dropdown.map((sub, subIdx) => (
                        <button
                          key={subIdx}
                          onClick={() => { setIsDrawerOpen(false); onNavigate(sub.page as any); }}
                          className="text-lg font-bold uppercase tracking-brand text-luxury-gray hover:text-luxury-gold transition-colors block w-full"
                        >
                          {sub.label}
                        </button>
                      ))}
                    </div>
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