
import React from 'react';
import { motion } from 'framer-motion';
import { Camera, ArrowRight, Sparkles, Award, Globe, ExternalLink, Play } from 'lucide-react';
import { MOCK_EDITORIALS } from '../constants';

export const Editorial: React.FC = () => {
   return (
      <div className="space-y-32 py-12 animate-in fade-in duration-1000 pb-48">
         <header className="max-w-5xl mx-auto text-center space-y-12">
            <div className="flex justify-center">
               <div className="inline-flex items-center space-x-4 px-8 py-3 bg-ffn-black text-white rounded-full text-[10px] font-black uppercase tracking-[0.6em] shadow-3xl">
                  <Sparkles className="w-5 h-5 text-ffn-accent animate-pulse" />
                  <span>THE EDITORIAL HUB</span>
               </div>
            </div>
            <h1 className="text-7xl md:text-[10rem] font-serif italic text-ffn-black tracking-tighter leading-none">Curated <br /> Mastery.</h1>
            <p className="text-xl md:text-3xl text-gray-400 font-light italic max-w-3xl mx-auto leading-relaxed">"Where global fashion visionaries document the intersection of identity and art."</p>
         </header>

         <div className="editorial-grid gap-y-32">
            {MOCK_EDITORIALS.map((item, idx) => (
               <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-24 items-center`}
               >
                  <div className="lg:w-[60%] relative group">
                     <div className="aspect-[16/10] bg-gray-100 rounded-[5rem] overflow-hidden shadow-3xl border border-gray-100">
                        <img src={item.media_url} className="w-full h-full object-cover transition-all duration-[3s] group-hover:scale-105" alt={item.title} loading="lazy" width="1600" height="1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                           <button title="Play Editorial Video" className="w-24 h-24 bg-white/10 backdrop-blur-3xl rounded-full border border-white/20 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-all">
                              <Play className="w-8 h-8 fill-white ml-2" />
                           </button>
                        </div>
                     </div>
                     <div className={`absolute -bottom-10 ${idx % 2 === 0 ? '-right-10' : '-left-10'} glass-card-vibrant p-10 rounded-[3rem] border border-white/30 shadow-3xl hidden md:block`}>
                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary mb-2">Project Identity</p>
                        <p className="text-2xl font-serif italic text-ffn-black">ID: {item.id}</p>
                     </div>
                  </div>

                  <div className="lg:w-[40%] space-y-12">
                     <div className="space-y-6">
                        <div className="flex items-center space-x-4">
                           <span className="text-[10px] bg-ffn-primary/10 text-ffn-primary px-6 py-2 rounded-full font-black uppercase tracking-widest">{item.category}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">2025 ARCHIVE</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-serif italic text-ffn-black leading-[1.1] tracking-tight">{item.title}</h2>
                        <div className="space-y-2">
                           <p className="text-[11px] font-black uppercase tracking-[0.4em] text-gray-400">Master Photographer</p>
                           <p className="text-3xl font-serif italic text-ffn-black">{item.photographer_name}</p>
                        </div>
                     </div>

                     <p className="text-lg text-gray-500 font-light leading-relaxed italic max-w-sm">"A cinematic exploration of architectural silhouettes set against the brutalist backdrop of Mumbai’s emerging skyline."</p>

                     <div className="pt-6">
                        <button className="flex items-center space-x-6 group">
                           <span className="text-sm font-black uppercase tracking-[0.6em] border-b-2 border-ffn-black pb-2 group-hover:text-ffn-primary group-hover:border-ffn-primary transition-all">Full Editorial</span>
                           <div className="p-4 bg-gray-50 rounded-2xl group-hover:bg-ffn-black group-hover:text-white transition-all"><ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" /></div>
                        </button>
                     </div>
                  </div>
               </motion.article>
            ))}
         </div>

         <section className="bg-ffn-black rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden shadow-3xl border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/10 via-transparent to-ffn-accent/10 blur-[120px] animate-pulse-slow" />
            <div className="relative z-10 space-y-10">
               <h2 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">The Magazine <br /> <span className="text-gradient-vibrant font-bold not-italic">Identity.</span></h2>
               <p className="text-white/40 max-w-2xl mx-auto text-xl font-light italic leading-relaxed">"Submit your professional collaborations to the FFN editorial board for global digital syndication."</p>
               <div className="pt-8">
                  <button className="px-20 py-10 bg-white text-ffn-black rounded-[3rem] text-xs font-black uppercase tracking-[0.6em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all flex items-center space-x-6 mx-auto">
                     <Camera className="w-6 h-6" />
                     <span>Submission Protocol</span>
                  </button>
               </div>
            </div>
         </section>
      </div>
   );
};
