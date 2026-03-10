import React from 'react';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

interface ContactUsProps {
  onNavigate?: (page: string) => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onNavigate }) => {
  return (
    <div className="animate-in fade-in duration-500 bg-[#f4f4f4] min-h-screen pb-24">
      {/* Hero Section */}
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900 overflow-hidden flex flex-col justify-end pb-12 pt-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gray-900/70 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1920"
            className="w-full h-full object-cover"
            alt="Contact Us"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 lg:px-24 w-full">
          {/* Breadcrumb */}
          <div className="flex items-center text-gray-300 text-sm mb-4 font-light tracking-wider uppercase">
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className="hover:text-red-600 transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span className="text-red-600 font-medium">Contact Us</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white uppercase tracking-tight font-bold">
            Contact Us
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mt-16 md:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Contact Information */}
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-6 uppercase tracking-tight">Get In Touch</h2>
              <p className="text-gray-600 text-lg font-light leading-relaxed">
                Whether you're looking for your dream property or need expert real estate advice, our team is here to assist you. Reach out to us through any of the channels below.
              </p>
            </div>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <MapPin className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Our Office</h3>
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
                  <Phone className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Phone & WhatsApp</h3>
                  <p className="text-gray-600 font-light mb-1">
                    <span className="font-medium text-gray-900">General Inquiry:</span> +94 77 123 4567
                  </p>
                  <p className="text-gray-600 font-light">
                    <span className="font-medium text-gray-900">WhatsApp:</span> +94 77 123 4568
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <Mail className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Email Address</h3>
                  <p className="text-gray-600 font-light">
                    info@camholdings.com
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-gray-100 mr-6">
                  <Clock className="text-red-600" size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">Working Hours</h3>
                  <p className="text-gray-600 font-light mb-1">
                    <span className="font-medium text-gray-900">Monday - Friday:</span> 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-gray-600 font-light mb-1">
                    <span className="font-medium text-gray-900">Saturday:</span> 9:00 AM - 1:00 PM
                  </p>
                  <p className="text-gray-600 font-light">
                    <span className="font-medium text-gray-900">Sunday:</span> Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-2xl font-serif font-bold text-gray-900 mb-8">Send Us A Message</h3>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-900 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                    placeholder="+94 7X XXX XXXX"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-900 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all"
                  placeholder="How can we help you?"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-900 mb-2">Your Message</label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-600/20 focus:border-red-600 outline-none transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-md"
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
          <MapPin size={48} className="text-red-600/50 mb-4 group-hover:scale-110 transition-transform duration-500" />
          <p className="font-serif text-xl text-gray-600">Interactive Map View</p>
          <p className="text-sm font-light mt-2">123 Premium Way, Colombo 03</p>
        </div>
      </div>

    </div>
  );
};

export default ContactUs;
