import React from 'react';
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react';
import { PageHero } from './PageHero';

interface ContactProps {
  onNavigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-24 font-sans animate-in fade-in duration-500">
      <PageHero
        title="Contact Us"
        description="We are here to assist you with your premium real estate needs."
        bgImage="https://images.unsplash.com/photo-1577412647305-991150c7d163?auto=format&fit=crop&q=80&w=1920"
        breadcrumbs={[
          { label: 'Home', onClick: () => onNavigate('home') },
          { label: 'Contact Us' }
        ]}
      />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col group hover:shadow-[0px_8px_20px_rgba(212,175,55,0.2)] transition-shadow duration-300">
              <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-300">
                <MapPin size={28} />
              </div>
              <h3 className="text-xl font-serif font-bold text-luxury-black mb-3">Visit Us</h3>
              <p className="text-luxury-gray text-base leading-relaxed">
                123 Premium Way,<br />
                Colombo 03,<br />
                Sri Lanka
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col group hover:shadow-[0px_8px_20px_rgba(212,175,55,0.2)] transition-shadow duration-300">
              <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-300">
                <Phone size={28} />
              </div>
              <h3 className="text-xl font-serif font-bold text-luxury-black mb-3">Call Us</h3>
              <div className="space-y-2 text-luxury-gray text-base">
                <p className="flex justify-between"><span>Phone:</span> <a href="tel:+94771234567" className="hover:text-luxury-gold transition-colors">+94 77 123 4567</a></p>
                <p className="flex justify-between"><span>WhatsApp:</span> <a href="https://wa.me/94771234567" className="hover:text-luxury-gold transition-colors">+94 77 123 4567</a></p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col group hover:shadow-[0px_8px_20px_rgba(212,175,55,0.2)] transition-shadow duration-300">
              <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-300">
                <Mail size={28} />
              </div>
              <h3 className="text-xl font-serif font-bold text-luxury-black mb-3">Email Us</h3>
              <p className="text-luxury-gray text-base">
                <a href="mailto:info@camholdings.com" className="hover:text-luxury-gold transition-colors">info@camholdings.com</a>
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col group hover:shadow-[0px_8px_20px_rgba(212,175,55,0.2)] transition-shadow duration-300">
              <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 text-luxury-gold group-hover:bg-luxury-gold group-hover:text-white transition-colors duration-300">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-serif font-bold text-luxury-black mb-3">Working Hours</h3>
              <div className="space-y-2 text-luxury-gray text-base">
                <p className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span></p>
                <p className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 2:00 PM</span></p>
                <p className="flex justify-between"><span>Sunday:</span> <span>Closed</span></p>
              </div>
            </div>
          </div>

          {/* Contact Form & Map */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-gray-100">
              <h2 className="text-3xl font-serif font-bold text-luxury-black mb-2 uppercase tracking-tight">Get in Touch</h2>
              <p className="text-luxury-gray mb-8 text-lg font-light">Have a question or want to learn more? Send us a message.</p>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black/70 mb-2">Full Name</label>
                    <input type="text" required className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-4 py-3 text-luxury-black focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black/70 mb-2">Phone Number</label>
                    <input type="tel" required className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-4 py-3 text-luxury-black focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" placeholder="+94 77 XXX XXXX" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black/70 mb-2">Email Address</label>
                    <input type="email" required className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-4 py-3 text-luxury-black focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black/70 mb-2">Subject</label>
                    <input type="text" required className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-4 py-3 text-luxury-black focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all" placeholder="How can we help?" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black/70 mb-2">Message</label>
                  <textarea rows={5} required className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-4 py-3 text-luxury-black focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all resize-none" placeholder="Your message here..."></textarea>
                </div>

                <button type="submit" className="w-full md:w-auto bg-luxury-gold text-white font-bold uppercase tracking-widest px-10 py-4 rounded-lg hover:bg-luxury-golddark transition-colors shadow-md flex items-center justify-center gap-3">
                  <Send size={18} />
                  <span>Send Message</span>
                </button>
              </form>
            </div>

            {/* Map Placeholder Section */}
            <div className="bg-white p-4 rounded-xl shadow-[0px_4px_10px_rgba(0,0,0,0.1)] border border-gray-100">
              <div className="w-full h-80 bg-gray-200 rounded-lg overflow-hidden relative group">
                {/* Simulated Map Placeholder Image */}
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1200"
                  alt="Location Map"
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-md p-4 rounded-full shadow-lg text-luxury-gold animate-bounce">
                    <MapPin size={32} />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
