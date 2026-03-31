import React from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight, ChevronRight } from 'lucide-react';

interface ContactUsProps {
  onNavigate?: (page: string) => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-500 bg-[#fcfcfc] min-h-screen pb-24 font-sans">
      {/* Hero Section */}
      <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden mb-12">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover scale-105"
            alt="Contact Us"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80"></div>
        </div>

        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 flex flex-col items-center justify-center text-center mt-16">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-6 bg-black/20 px-6 py-2 rounded-full backdrop-blur-sm border border-white/10">
            <span
              onClick={() => onNavigate && onNavigate('home')}
              className="cursor-pointer hover:text-luxury-gold transition-colors"
            >
              Home
            </span>
            <ChevronRight size={14} className="text-luxury-gold" />
            <span className="text-luxury-gold">Contact Us</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif font-bold text-white uppercase tracking-tight drop-shadow-lg">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-luxury-gold mt-6 mb-4 mx-auto rounded-full shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-2xl text-shadow-sm">
            Get in touch with our team for expert real estate advice.
          </p>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-24 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact Information */}
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-luxury-black mb-6 uppercase tracking-tight">Get In Touch</h2>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Whether you're looking for your dream property or need expert real estate advice, our team is here to assist you. Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <MapPin className="text-luxury-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-luxury-black mb-2">Our Office</h3>
                  <p className="text-gray-600 font-light leading-relaxed">
                    123 Premium Way<br />
                    Colombo 03<br />
                    Sri Lanka
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <Phone className="text-luxury-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-luxury-black mb-2">Phone & WhatsApp</h3>
                  <p className="text-gray-600 font-light mb-1">
                    <span className="font-medium text-luxury-black">General Inquiry:</span> +94 77 123 4567
                  </p>
                  <p className="text-gray-600 font-light">
                    <span className="font-medium text-luxury-black">WhatsApp:</span> +94 77 123 4568
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <Mail className="text-luxury-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-luxury-black mb-2">Email Address</h3>
                  <p className="text-gray-600 font-light">
                    info@camholdings.com
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <Clock className="text-luxury-gold" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-luxury-black mb-2">Working Hours</h3>
                  <p className="text-gray-600 font-light mb-1">
                    <span className="font-medium text-luxury-black">Monday - Friday:</span> 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600 font-light mb-1">
                    <span className="font-medium text-luxury-black">Saturday:</span> 9:00 AM - 1:00 PM
                  </p>
                  <p className="text-gray-600 font-light">
                    <span className="font-medium text-luxury-black">Sunday:</span> Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold text-luxury-black mb-8">Send Us A Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-luxury-black mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-luxury-black mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all"
                    placeholder="+94 7X XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-luxury-black mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-luxury-black mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-luxury-black mb-2">Your Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-luxury-gold/20 focus:border-luxury-gold outline-none transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-luxury-gold hover:bg-luxury-golddark text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-md"
              >
                Send Message
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>

      {/* Map Placeholder */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-24">
        <div className="w-full h-[400px] bg-gray-200 rounded-2xl overflow-hidden shadow-inner flex flex-col items-center justify-center text-gray-500 border border-gray-300 relative group">
          {/* A simple mock map appearance using a pattern and an icon */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <MapPin size={48} className="text-luxury-gold/50 mb-4 group-hover:scale-110 transition-transform duration-500" />
          <p className="font-serif text-xl text-gray-600">Interactive Map View</p>
          <p className="text-sm font-light mt-2">123 Premium Way, Colombo 03</p>
        </div>
      </div>

    </div>
  );
};

export default ContactUs;
