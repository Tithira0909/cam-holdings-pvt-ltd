import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, ArrowRight, Instagram, Facebook, Linkedin, Youtube, ExternalLink } from 'lucide-react';
import { NavItem } from '../types';

interface FooterProps {
  onNavigate: (page: string) => void;
  navigation: NavItem[];
}

const Footer: React.FC<FooterProps> = ({ onNavigate, navigation }) => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(err => console.error("Error loading settings in footer", err));
  }, []);

  const contactPhone = siteSettings?.contact_phone || '+94 77 123 4567';
  const contactEmail = siteSettings?.contact_email || 'info@camholdings.com';
  const contactAddress = siteSettings?.contact_address || '123 Premium Way, Colombo 03, Sri Lanka';
  const siteName = siteSettings?.site_name || 'CAM Holdings';

  return (
    <footer className="bg-luxury-black text-white pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">

          {/* Brand & About */}
          <div className="lg:pr-8">
            <h3 className="font-serif text-2xl text-luxury-gold mb-6">{siteName}</h3>
            <p className="text-gray-400 font-light leading-relaxed mb-8 text-sm">
              Sri Lanka's premier real estate developer. We build luxury homes, curate prime lands, and deliver exceptional property services that exceed expectations and elevate lifestyles.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-white transition-all">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-luxury-gold hover:text-white transition-all">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide text-white">Explore Properties</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('houses')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  Luxury Houses
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('lands')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  Prime Lands
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('projects')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  Featured Projects
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  Completed Portfolio
                </button>
              </li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide text-white">Corporate Info</h4>
            <ul className="space-y-4">
              <li>
                <button onClick={() => onNavigate('about')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('news')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  News & Media
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="text-gray-400 hover:text-luxury-gold transition-colors flex items-center group text-sm font-light">
                  <ArrowRight size={14} className="mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-luxury-gold" />
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-6 tracking-wide text-white">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex items-start">
                <MapPin className="text-luxury-gold mt-1 mr-4 shrink-0" size={18} />
                <span className="text-gray-400 text-sm font-light leading-relaxed">{contactAddress}</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-luxury-gold mr-4 shrink-0" size={18} />
                <a href={`tel:${contactPhone.replace(/\\s/g, '')}`} className="text-gray-400 hover:text-white transition-colors text-sm font-light">{contactPhone}</a>
              </li>
              <li className="flex items-center">
                <Mail className="text-luxury-gold mr-4 shrink-0" size={18} />
                <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-white transition-colors text-sm font-light">{contactEmail}</a>
              </li>
            </ul>
            <button
              onClick={() => onNavigate('contact')}
              className="mt-8 px-6 py-3 border border-luxury-gold/50 text-luxury-gold hover:bg-luxury-gold hover:text-white rounded-lg transition-all text-sm font-medium w-full flex items-center justify-center gap-2 group"
            >
              Request a Call Back
              <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-light text-gray-500">
          <p>&copy; {new Date().getFullYear()} {siteName}. All Rights Reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-luxury-gold transition-colors">Privacy Policy</button>
            <button onClick={() => onNavigate('terms')} className="hover:text-luxury-gold transition-colors">Terms of Service</button>
            <button onClick={() => onNavigate('kyc')} className="hover:text-luxury-gold transition-colors">KYC Documentation</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
