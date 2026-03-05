import React from "react";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

interface FooterProps {
  onNavigate: (page: any) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-luxury-black text-white pt-20 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-mobile">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: About Us & Contact */}
          <div>
            <h4 className="text-white font-bold text-sm mb-8 tracking-wider">
              About Us & Contact
            </h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("contact")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Contact us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("about")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("testimonials")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Testimonials
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("kyc")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  KYC
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("privacy")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("terms")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Terms and Conditions
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Property & Services */}
          <div>
            <h4 className="text-white font-bold text-sm mb-8 tracking-wider">
              Property & Services
            </h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li>
                <button
                  onClick={() => onNavigate("projects")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Lands
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("projects")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Houses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("portfolio")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Projects Properties
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("services")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("virtual-tour")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Virtual Tour
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: News & Publications */}
          <div>
            <h4 className="text-white font-bold text-sm mb-8 tracking-wider">
              News & Publications
            </h4>
            <ul className="space-y-4 text-white/60 text-sm font-light">
              <li>
                <button
                  onClick={() => onNavigate("news")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  News
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("publications")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Online Publications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate("blogs")}
                  className="hover:text-luxury-gold transition-colors text-left"
                >
                  Blogs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm mb-8 tracking-wider">
              Contact Details
            </h4>
            <div className="space-y-6 text-white/60 text-sm font-light leading-relaxed">
              <div>
                <span className="block text-white font-medium mb-1">
                  Head Office
                </span>
                <p>
                  No.75, D.S. Senanayake Mawatha,
                  <br />
                  Borella, Colombo-08, Sri Lanka,
                </p>
              </div>
              <div className="space-y-2">
                <p className="flex items-center gap-2">+94 112 699 822</p>
                <p className="flex items-center gap-2">+94 112 030 890</p>
              </div>
              <p className="text-luxury-gold font-medium">info@camholdings.lk</p>
            </div>
          </div>
        </div>

        {/* Brand Bottom Section */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <img
              src="/assets/cam_logo.png"
              alt="Crown Asia Majestic Holdings (Pvt) Ltd"
              className="h-10 md:h-12 w-auto object-contain"
            />
            <span className="font-serif text-lg tracking-[0.2em] font-bold text-white/80">
              CROWN ASIA MAJESTIC
            </span>
          </div>

          <div className="flex gap-6">
            {[Instagram, Linkedin, Twitter, Facebook].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-10 h-10 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-luxury-gold hover:border-luxury-gold transition-all duration-300"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="text-[8px] uppercase tracking-[0.3em] font-bold text-white/10 leading-relaxed">
            © 2024 CROWN ASIA MAJESTIC HOLDINGS (PVT) LTD. ALL RIGHTS RESERVED.
            <br />
            Design and Developed by Zeatralabs.com
            <button onClick={() => onNavigate('admin')} className="text-[10px] text-white/20 hover:text-luxury-gold transition-colors ml-4">ADMIN</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
