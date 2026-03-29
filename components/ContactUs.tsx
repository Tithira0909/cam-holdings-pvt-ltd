import React, { useState } from 'react';
import { MapPin, PhoneCall, Mail, Clock, Send, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
           full_name: formData.name,
           email: formData.email,
           phone: formData.phone,
           subject: formData.subject || 'General Inquiry',
           service: 'General',
           message: formData.message
        }),
      });
      if (!response.ok) throw new Error('Failed to submit inquiry');
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20 overflow-hidden">

      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-6"
          >
            Contact <span className="text-red-600">Us</span>
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
          >
            Have a question or looking to invest? Our premium property consultants are ready to assist you every step of the way.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 lg:mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Left Column: Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white p-8 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-3">Head Office</h3>
              <p className="text-gray-600">123 Premium Real Estate Blvd,<br/>Colombo 00700, Sri Lanka</p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <PhoneCall size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-3">Hotlines</h3>
              <p className="text-gray-600">+94 11 234 5678<br/>+94 77 123 4567</p>
            </motion.div>

            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-8 rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.06)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                <Mail size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-widest mb-3">Email</h3>
              <p className="text-gray-600">inquiries@premiumrealestate.lk<br/>sales@premiumrealestate.lk</p>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
              className="bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 p-8 md:p-12 h-full flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 uppercase tracking-tight mb-2">Send us a Message</h2>
              <p className="text-gray-500 mb-8">We'll get back to you as soon as possible.</p>

              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center text-center py-12 bg-green-50 rounded-lg border border-green-100">
                  <CheckCircle2 size={48} className="text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-700">Thank you for reaching out. Our team will contact you shortly.</p>
                  <button onClick={() => setStatus('idle')} className="mt-6 text-sm font-bold text-green-700 uppercase tracking-wider hover:text-green-900 transition-colors">
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Full Name</label>
                      <input
                        type="text" required
                        value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 px-5 py-4 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Phone Number</label>
                      <input
                        type="tel" required
                        value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 px-5 py-4 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        placeholder="+94 77 000 0000"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email Address</label>
                      <input
                        type="email" required
                        value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 px-5 py-4 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Subject</label>
                      <input
                        type="text"
                        value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 px-5 py-4 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all"
                        placeholder="Property Inquiry"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Your Message</label>
                    <textarea
                      required rows={5}
                      value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-200 px-5 py-4 text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none transition-all resize-none"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  {status === 'error' && (
                    <p className="text-red-600 text-sm font-medium">Failed to send message. Please try again.</p>
                  )}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full md:w-auto px-10 py-4 bg-red-600 text-white font-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {status === 'submitting' ? 'Sending...' : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <motion.div
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 md:px-8 mt-24"
      >
        <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden shadow-sm relative">
           <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
              <MapPin size={48} className="mb-4 opacity-50" />
              <p className="font-bold uppercase tracking-widest text-sm">Interactive Map Location</p>
              <p className="text-xs mt-2 opacity-70">Embed Google Maps iframe here</p>
           </div>
        </div>
      </motion.div>

    </div>
  );
};

export default ContactUs;
