
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, User as UserIcon, Calendar, Sparkles } from 'lucide-react';
import { MOCK_SHOOTS } from '../constants';

export const Photoshoots: React.FC = () => {
  return (
    <div className="space-y-24 animate-in fade-in duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-3 text-ffn-primary">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Editorial Authority Showcase</span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-serif italic tracking-tighter text-ffn-black leading-none">Professional <br/> Photoshoots</h1>
        </div>
        <button className="px-12 py-6 bg-ffn-black text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-ffn-primary transition-all">Feature Your Shoot</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {MOCK_SHOOTS.map((shoot, idx) => (
          <motion.div 
            key={shoot.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group cursor-pointer space-y-10"
          >
            <div className="aspect-[16/10] bg-gray-100 rounded-[4rem] overflow-hidden relative shadow-2xl border border-gray-100">
               <img src={shoot.mediaUrl} className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110" alt="" />
               <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-16">
                  <div className="space-y-4">
                     <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white border border-white/20">{shoot.category}</span>
                     <h3 className="text-4xl text-white font-serif italic">View Editorial Depth</h3>
                  </div>
               </div>
            </div>
            <div className="flex items-center justify-between px-6">
               <div className="space-y-2">
                 <h4 className="text-3xl font-serif italic text-ffn-black">{shoot.title}</h4>
                 <div className="flex items-center space-x-6">
                   <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Captured by <span className="text-ffn-black">{shoot.photographer}</span></p>
                   <span className="text-gray-200">|</span>
                   <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{shoot.createdAt}</p>
                 </div>
               </div>
               <div className="p-5 rounded-3xl bg-gray-50 group-hover:bg-ffn-black group-hover:text-white transition-all">
                  <ArrowRight className="w-6 h-6" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <section className="bg-ffn-gray rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden border border-gray-100">
         <div className="absolute top-0 right-0 w-96 h-96 bg-ffn-primary/5 blur-[120px] rounded-full"></div>
         <div className="space-y-8 relative z-10">
            <h2 className="text-6xl font-serif italic text-ffn-black tracking-tighter">Artistic Sovereignty</h2>
            <p className="max-w-2xl mx-auto text-gray-500 font-light text-xl leading-relaxed">"Great fashion isn't just worn; it's documented. Our showcase highlights the synergy between talent, vision, and execution."</p>
            <div className="pt-8"><button className="px-16 py-8 bg-ffn-black text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary transition-all">Explore the Archive</button></div>
         </div>
      </section>
    </div>
  );
};
