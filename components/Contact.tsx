import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Award, Building, ArrowRight } from 'lucide-react';

interface ContactProps {
  onNavigate: (page: string) => void;
}

const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSiteSettings(data))
      .catch(err => console.error("Error loading settings in contact", err));
  }, []);

  const contactPhone = siteSettings?.contact_phone || '+94 77 123 4567';
  const contactEmail = siteSettings?.contact_email || 'info@camholdings.com';
  const contactAddress = siteSettings?.contact_address || '123 Premium Way, Colombo 03, Sri Lanka';

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-[#f4f4f4] min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1920"
          alt="Contact CAM Holdings"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-20 text-center px-4 max-w-4xl"
        >
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 uppercase tracking-tight drop-shadow-lg">
            Contact CAM Holdings
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light mb-10 max-w-2xl mx-auto drop-shadow-md">
            Get in touch with our luxury real estate experts to begin your journey towards finding the perfect property or discussing your next development project.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button
                onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-luxury-gold text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all shadow-lg"
             >
               Send an Inquiry
             </button>
             <a
                href={`tel:${contactPhone.replace(/\\s/g, '')}`}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white px-8 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-white hover:text-luxury-black transition-all"
             >
               Call Us Now
             </a>
          </div>
        </motion.div>
      </div>

      {/* Contact Info Cards */}
      <div className="max-w-7xl mx-auto px-mobile -mt-24 relative z-30 mb-24">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {/* Card 1: Address */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-luxury-gold hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <MapPin size={24} className="text-luxury-gold" />
            </div>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-3 uppercase tracking-wider">Our Office</h3>
            <p className="text-luxury-gray font-light text-sm leading-relaxed">{contactAddress}</p>
          </motion.div>

          {/* Card 2: Phone */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-luxury-gold hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Phone size={24} className="text-luxury-gold" />
            </div>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-3 uppercase tracking-wider">Direct Line</h3>
            <p className="text-luxury-gray font-light text-sm mb-2">Speak directly with our team.</p>
            <a href={`tel:${contactPhone.replace(/\\s/g, '')}`} className="text-luxury-black font-bold hover:text-luxury-gold transition-colors">{contactPhone}</a>
          </motion.div>

          {/* Card 3: Email */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-luxury-gold hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Mail size={24} className="text-luxury-gold" />
            </div>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-3 uppercase tracking-wider">Email Us</h3>
            <p className="text-luxury-gray font-light text-sm mb-2">We typically reply within 24 hours.</p>
            <a href={`mailto:${contactEmail}`} className="text-luxury-black font-bold hover:text-luxury-gold transition-colors truncate block">{contactEmail}</a>
          </motion.div>

          {/* Card 4: Hours */}
          <motion.div variants={fadeInUp} className="bg-white p-8 rounded-xl shadow-xl border-t-4 border-luxury-gold hover:-translate-y-2 transition-transform duration-300 group">
            <div className="w-14 h-14 bg-luxury-offwhite rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Clock size={24} className="text-luxury-gold" />
            </div>
            <h3 className="text-lg font-serif font-bold text-luxury-black mb-3 uppercase tracking-wider">Working Hours</h3>
            <ul className="text-sm font-light text-luxury-gray space-y-2">
              <li className="flex justify-between border-b border-gray-100 pb-1"><span>Mon - Fri:</span> <span className="font-medium text-luxury-black">09:00 - 18:00</span></li>
              <li className="flex justify-between border-b border-gray-100 pb-1"><span>Saturday:</span> <span className="font-medium text-luxury-black">09:00 - 13:00</span></li>
              <li className="flex justify-between"><span>Sunday:</span> <span className="font-medium text-luxury-gold">Closed</span></li>
            </ul>
          </motion.div>
        </motion.div>
      </div>

      {/* Main Content Area: Form & Values */}
      <div className="max-w-7xl mx-auto px-mobile pb-24" id="contact-form">
        <div className="flex flex-col lg:flex-row gap-16">

          {/* Form Section */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white p-10 md:p-12 rounded-xl shadow-sm border border-gray-100"
            >
              <h2 className="text-3xl font-serif font-bold text-luxury-black mb-2 uppercase tracking-tight">Send a Message</h2>
              <p className="text-luxury-gray font-light mb-10">We would love to hear from you. Please fill out the form below and we will get back to you shortly.</p>

              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Inquiry sent successfully!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-2">Full Name <span className="text-luxury-gold">*</span></label>
                    <input
                      type="text"
                      required
                      className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-5 py-4 text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-2">Email Address <span className="text-luxury-gold">*</span></label>
                    <input
                      type="email"
                      required
                      className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-5 py-4 text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                      placeholder="e.g. john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-2">Phone Number</label>
                    <input
                      type="tel"
                      className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-5 py-4 text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                      placeholder="+94 77 XXX XXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-2">Inquiry Type <span className="text-luxury-gold">*</span></label>
                    <select
                      required
                      defaultValue=""
                      className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-5 py-4 text-luxury-black focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>Select an option</option>
                      <option value="property_sales">Property Sales</option>
                      <option value="land_inquiries">Land Inquiries</option>
                      <option value="construction_services">Construction Services</option>
                      <option value="partnerships">Partnerships</option>
                      <option value="general_inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-2">Subject</label>
                  <input
                    type="text"
                    className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-5 py-4 text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all"
                    placeholder="Brief subject of your message"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-luxury-black mb-2">Message <span className="text-luxury-gold">*</span></label>
                  <textarea
                    rows={5}
                    required
                    className="w-full bg-luxury-offwhite border border-gray-200 rounded-lg px-5 py-4 text-luxury-black placeholder:text-gray-400 focus:outline-none focus:border-luxury-gold focus:ring-1 focus:ring-luxury-gold transition-all resize-none"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-luxury-black text-white font-bold uppercase tracking-widest py-5 rounded-lg hover:bg-luxury-gold transition-colors flex items-center justify-center gap-3 group"
                >
                  <span>Submit Inquiry</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </motion.div>
          </div>

          {/* Trust/Value Blocks Section */}
          <div className="w-full lg:w-[400px]">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-luxury-black text-white p-10 md:p-12 rounded-xl shadow-2xl h-full flex flex-col justify-center"
            >
              <h2 className="text-2xl font-serif font-bold mb-8 uppercase tracking-tight text-luxury-gold">Why Contact Us?</h2>

              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Trusted Expertise</h4>
                    <p className="text-white/60 text-sm leading-relaxed">Years of experience in luxury real estate and premium land development across Sri Lanka.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Award size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Premium Quality</h4>
                    <p className="text-white/60 text-sm leading-relaxed">Uncompromising standards in every property we list and every project we build.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                    <Building size={20} className="text-luxury-gold" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-2">Exclusive Portfolio</h4>
                    <p className="text-white/60 text-sm leading-relaxed">Access to off-market luxury properties and early-bird construction investment opportunities.</p>
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-sm text-white/60 mb-4">Or connect with us on social media:</p>
                <div className="flex gap-4">
                  {['Facebook', 'Instagram', 'LinkedIn', 'YouTube'].map((social, idx) => (
                     <a key={idx} href="#" className="text-white/60 hover:text-luxury-gold transition-colors text-sm font-bold uppercase tracking-wider">
                       {social}
                     </a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      {/* Map Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full h-[500px] bg-gray-200 relative"
      >
        {/* Placeholder for actual Google Map iframe */}
        <div className="absolute inset-0 bg-luxury-black/10 flex flex-col items-center justify-center">
            <MapPin size={48} className="text-luxury-black mb-4 opacity-50" />
            <p className="font-serif text-xl text-luxury-black font-bold uppercase tracking-widest opacity-50">Map View Available</p>
        </div>
        <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1920" alt="Map View" className="w-full h-full object-cover grayscale opacity-30 mix-blend-multiply" />
      </motion.div>

      {/* Strong CTA Banner Before Footer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-luxury-gold py-20 px-mobile text-center"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 uppercase tracking-tight drop-shadow-sm">
            Ready to Elevate Your Lifestyle?
          </h2>
          <p className="text-white/90 text-lg mb-10 font-light max-w-2xl mx-auto">
            Schedule a private consultation with our real estate experts today and discover the premium properties CAM Holdings has to offer.
          </p>
          <button
            onClick={() => onNavigate('properties')}
            className="bg-white text-luxury-black px-10 py-4 rounded-lg font-bold uppercase tracking-widest hover:bg-luxury-black hover:text-white transition-all shadow-lg flex items-center gap-3 mx-auto group"
          >
            <span>Explore Properties</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

    </div>
  );
};

export default Contact;
