
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Bookmark, Share2, Clock, Sparkles } from 'lucide-react';
import { MagneticButton } from './MagneticButton';

export const Journal: React.FC = () => {
   const articles = [
      {
         title: "The Architecture of a Silhouette",
         author: "Elena Rossi",
         date: "October 2025",
         readTime: "12 min",
         category: "EDITORIAL",
         image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800",
         excerpt: "Deep into the structural mastery of minimalist designers who are reshaping the urban skyline through fabric."
      },
      {
         title: "Digital Couture: The Unreal Reality",
         author: "Marcus Chen",
         date: "September 2025",
         readTime: "8 min",
         category: "TECHNOLOGY",
         image: "https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=800",
         excerpt: "How AI-generated garments are moving from the metaverse to the physical runway."
      }
   ];

   return (
      <div className="space-y-32 animate-in fade-in duration-1000 pb-32">
         {/* Neo-Noir Ambient Background */}
         <div className="fixed inset-0 pointer-events-none -z-10 bg-ffn-black">
            <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-ffn-primary/5 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
            <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-white/5 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
         </div>

         {/* Featured Insight */}
         <section className="relative h-[80vh] w-full rounded-[4rem] overflow-hidden group border border-white/5 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/40 to-transparent" />

            <div className="absolute bottom-12 md:bottom-20 left-8 md:left-20 right-8 md:right-20 space-y-8 md:space-y-10 z-10">
               <div className="flex flex-wrap items-center gap-4">
                  <span className="px-6 py-2 bg-ffn-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-[0_0_20px_rgba(99,102,241,0.5)]">Cover Story</span>
                  <div className="flex items-center text-white/60 text-[10px] font-bold uppercase tracking-widest bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                     <Clock className="w-3 h-3 mr-2" /> 15 MIN READ
                  </div>
               </div>
               <h2 className="text-6xl md:text-9xl font-serif italic text-white tracking-tighter leading-none max-w-4xl drop-shadow-2xl">Sustainable <br /> Sovereignty.</h2>
               <p className="text-white/60 text-lg md:text-xl max-w-2xl font-light italic leading-relaxed">"The fashion industry is no longer just about aesthetics; it's about the moral weight of every single thread."</p>
               <button className="group flex items-center space-x-6 text-white pt-4">
                  <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-[0.6em] border-b-2 border-white/30 pb-2 group-hover:text-ffn-primary group-hover:border-ffn-primary transition-all">Read Editorial</span>
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-ffn-primary transition-all">
                     <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
               </button>
            </div>
         </section>

         {/* Article Grid */}
         <section className="space-y-16 md:space-y-20 relative z-10 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-8 md:pb-12 gap-8">
               <h3 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight">Monthly Digest</h3>
               <div className="flex flex-wrap gap-6 md:space-x-12 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40">
                  <button className="text-white border-b-2 border-white pb-2 md:pb-12 md:-mb-[50px]">All Journal</button>
                  <button className="hover:text-white transition-colors pb-2 md:pb-12  md:-mb-[50px] border-b-2 border-transparent hover:border-white/30">Trends</button>
                  <button className="hover:text-white transition-colors pb-2 md:pb-12  md:-mb-[50px] border-b-2 border-transparent hover:border-white/30">Interviews</button>
                  <button className="hover:text-white transition-colors pb-2 md:pb-12  md:-mb-[50px] border-b-2 border-transparent hover:border-white/30">Legacy</button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
               {articles.map((article, idx) => (
                  <motion.article
                     key={idx}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: idx * 0.2, duration: 0.8 }}
                     className="space-y-8 md:space-y-10 group cursor-pointer"
                  >
                     <div className="aspect-[16/10] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative border border-white/5">
                        <div className="absolute inset-0 bg-ffn-primary/20 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10"></div>
                        <img src={article.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="" />
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <span className="text-[10px] font-bold text-ffn-primary uppercase tracking-[0.4em] px-3 py-1 bg-ffn-primary/10 rounded-full border border-ffn-primary/20">{article.category}</span>
                           <div className="flex items-center space-x-6 text-white/40">
                              <Bookmark className="w-5 h-5 hover:text-white transition-colors" />
                              <Share2 className="w-5 h-5 hover:text-white transition-colors" />
                           </div>
                        </div>
                        <h4 className="text-4xl md:text-5xl font-serif italic text-white tracking-tight leading-none group-hover:text-ffn-primary transition-colors">{article.title}</h4>
                        <p className="text-white/50 font-light leading-relaxed max-w-xl text-sm md:text-base">{article.excerpt}</p>

                        <div className="flex items-center space-x-8 pt-6 border-t border-white/5">
                           <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20"></div>
                              <span className="text-[10px] font-bold uppercase tracking-widest text-white">{article.author}</span>
                           </div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{article.date}</span>
                        </div>
                     </div>
                  </motion.article>
               ))}
            </div>
         </section>

         {/* Newsletter / CTA */}
         <section className="bg-[#111] backdrop-blur-2xl rounded-[3rem] md:rounded-[4rem] p-12 md:p-24 text-center space-y-12 relative overflow-hidden mx-4 md:mx-0 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-ffn-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

            <div className="relative z-10">
               <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10 shadow-[inner_0_0_20px_rgba(255,255,255,0.05)]">
                  <Sparkles className="w-8 h-8 text-white" />
               </div>
               <div className="space-y-6 max-w-2xl mx-auto">
                  <h2 className="text-5xl md:text-6xl font-serif italic text-white tracking-tighter">The Weekly Insight</h2>
                  <p className="text-white/50 md:text-lg font-light leading-relaxed">Curated fashion journalism, global trend reports, and exclusive network interviews delivered securely to your node.</p>
               </div>

               <div className="max-w-md mx-auto relative flex items-center mt-12 group">
                  <input type="email" placeholder="ENTER ENCRYPTED ADDRESS" className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] py-6 px-10 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl focus:outline-none focus:border-ffn-primary focus:bg-white/10 transition-all text-white placeholder:text-white/30" />
                  <button className="absolute right-3 p-4 bg-white text-ffn-black rounded-[1.5rem] hover:bg-ffn-primary hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] group-focus-within:bg-ffn-primary group-focus-within:text-white" title="Subscribe to Newsletter">

                     <ArrowRight className="w-5 h-5" />
                  </button>
               </div>
            </div>
         </section>
      </div>
   );
};
