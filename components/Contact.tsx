
import React, { useState } from 'react';
import { Mail, Send, MapPin, Globe, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API POST /api/contact
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="max-w-6xl mx-auto py-20 space-y-24 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-3 text-ffn-primary">
            <Mail className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Direct Network Access</span>
          </div>
          <h1 className="text-7xl font-serif italic tracking-tighter text-ffn-black leading-none">Contact FFN</h1>
        </div>
        <div className="flex flex-col items-end space-y-2 opacity-30">
          <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Response Protocol</p>
          <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">24-48 Hours Hub Sync</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onSubmit={handleSubmit} 
                className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-2xl space-y-10"
              >
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Your Identity</label>
                  <input 
                    required 
                    type="text" 
                    className="w-full py-6 px-10 text-sm bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-ffn-primary transition-all" 
                    placeholder="Full Legal Name" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Professional Email</label>
                  <input 
                    required 
                    type="email" 
                    className="w-full py-6 px-10 text-sm bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-ffn-primary transition-all" 
                    placeholder="you@mastery.com" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Inquiry Narrative</label>
                  <textarea 
                    required 
                    className="w-full py-6 px-10 text-sm h-48 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-ffn-primary transition-all resize-none" 
                    placeholder="Describe your inquiry or support requirement..." 
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  />
                </div>
                <button 
                  disabled={isSubmitting}
                  type="submit" 
                  className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-xl hover:bg-ffn-primary transition-all disabled:opacity-50 group"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Dispatching Narrative...</span>
                    </>
                  ) : (
                    <>
                      <span>Dispatch Message</span>
                      <Send className="w-5 h-5 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500 text-white p-20 rounded-[4rem] text-center space-y-8 shadow-2xl"
              >
                <CheckCircle className="w-24 h-24 mx-auto drop-shadow-lg" />
                <h3 className="text-5xl font-serif italic leading-tight">Inquiry Sync Successful.</h3>
                <p className="text-white/80 text-lg font-light leading-relaxed max-w-sm mx-auto">Your message has been received by the FFN Hub. We will respond within 24-48 protocol cycles.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-12 py-5 bg-white text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all"
                >
                  New Message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-5 space-y-12">
          <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-12">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary border-b border-gray-50 pb-6">Global Nodes</h4>
            <div className="space-y-12">
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-ffn-black"><MapPin className="w-6 h-6" /></div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-ffn-black">Headquarters Hub</p>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">BKC Knowledge City, Mumbai, India &bull; Innovation Zone</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="p-4 bg-gray-50 rounded-2xl text-ffn-black"><Globe className="w-6 h-6" /></div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-ffn-black">Digital Presence</p>
                  <p className="text-xs text-gray-400 font-light leading-relaxed">@fashionfreedomnetwork &bull; Instagram Hub</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-ffn-black rounded-[3rem] p-12 text-white overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/20 via-transparent to-ffn-accent/20"></div>
            <div className="relative z-10 space-y-6">
               <h3 className="text-3xl font-serif italic leading-tight">Identity Vetting?</h3>
               <p className="text-xs text-white/40 font-light leading-relaxed italic">For urgent verification inquiries, please include your FFN Protocol ID in the subject narrative.</p>
               <button className="flex items-center space-x-4 group">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-white pb-1 group-hover:text-ffn-primary group-hover:border-ffn-primary transition-all">Vetting Protocol</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
