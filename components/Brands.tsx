
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowRight, Globe, MapPin, Building2, ExternalLink } from 'lucide-react';
import { MOCK_BRANDS } from '../constants';

export const Brands: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="space-y-20 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-3 text-ffn-primary">
            <Building2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Industry Hiring Network</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black">The Brands</h1>
        </div>
        <div className="flex gap-4">
          <button onClick={() => navigate('/brand-dashboard')} className="px-12 py-5 bg-ffn-black text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-widest shadow-xl">Brand Portal Login</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {MOCK_BRANDS.map((brand, idx) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-gray-50 shadow-xl group hover:shadow-2xl transition-all"
          >
            <div className="flex flex-col md:flex-row items-start gap-10">
              <div className="w-24 h-24 rounded-[2rem] bg-gray-50 flex items-center justify-center p-4 shadow-inner">
                <img src={brand.logo_url} className="w-full grayscale group-hover:grayscale-0 transition-all" alt="" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-4xl font-serif italic text-ffn-black">{brand.brand_name}</h3>
                    <button title="Visit Website" className="text-ffn-primary"><ExternalLink className="w-5 h-5" /></button>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{brand.industry} &bull; {brand.location}</p>
                </div>
                <p className="text-sm text-gray-500 font-light leading-relaxed">{brand.description}</p>
                <div className="pt-6 flex gap-4">
                  <button className="flex-1 px-8 py-5 bg-ffn-black text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.4em] shadow-lg hover:bg-ffn-primary transition-all">View Active Castings</button>
                  <button title="View Global Presence" className="p-5 border border-gray-100 rounded-2xl text-gray-400 hover:text-ffn-black transition-all"><Globe className="w-5 h-5" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-ffn-black text-white rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)] border border-white/5">
        <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/10 via-transparent to-ffn-accent/10"></div>
        <h2 className="text-6xl md:text-8xl font-serif italic tracking-tighter relative z-10 leading-none">Global <br /> <span className="text-gradient-vibrant font-bold not-italic">Scouting Hub.</span></h2>
        <p className="max-w-xl mx-auto text-white/40 font-light text-xl italic relative z-10">Our ecosystem connects elite talent directly with casting directors from Paris to New York.</p>
        <div className="pt-10 relative z-10"><button className="px-16 py-8 bg-white text-ffn-black rounded-[2.5rem] text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all">Partnership Protocol</button></div>
      </section>
    </div>
  );
};
