
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Bookmark, Share2, Clock, Sparkles } from 'lucide-react';

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
    <div className="space-y-32 animate-in fade-in duration-1000">
      {/* Featured Insight */}
      <section className="relative h-[80vh] w-full rounded-[4rem] overflow-hidden group">
         <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="" />
         <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/20 to-transparent" />
         
         <div className="absolute bottom-20 left-20 right-20 space-y-10">
            <div className="flex items-center space-x-4">
               <span className="px-6 py-2 bg-ffn-primary text-white rounded-full text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl">Cover Story</span>
               <div className="flex items-center text-white/60 text-[10px] font-bold uppercase tracking-widest">
                  <Clock className="w-4 h-4 mr-2" /> 15 MIN READ
               </div>
            </div>
            <h2 className="text-7xl md:text-9xl font-serif italic text-white tracking-tighter leading-none max-w-4xl">Sustainable <br/> Sovereignty.</h2>
            <p className="text-white/60 text-xl max-w-2xl font-light italic leading-relaxed">"The fashion industry is no longer just about aesthetics; it's about the moral weight of every single thread."</p>
            <button className="group flex items-center space-x-6 text-white">
               <span className="text-[12px] font-bold uppercase tracking-[0.6em] border-b-2 border-white pb-2 group-hover:text-ffn-primary group-hover:border-ffn-primary transition-all">Read Editorial</span>
               <ArrowRight className="w-6 h-6 group-hover:translate-x-4 transition-transform" />
            </button>
         </div>
      </section>

      {/* Article Grid */}
      <section className="space-y-20">
         <div className="flex items-center justify-between border-b border-gray-100 pb-12">
            <h3 className="text-4xl font-serif italic text-ffn-black">Monthly Digest</h3>
            <div className="flex space-x-12 text-[10px] font-bold uppercase tracking-widest text-gray-400">
               <button className="text-ffn-black border-b border-ffn-black pb-12 -mb-[49px]">All Journal</button>
               <button className="hover:text-ffn-black transition-colors">Trends</button>
               <button className="hover:text-ffn-black transition-colors">Interviews</button>
               <button className="hover:text-ffn-black transition-colors">Legacy</button>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
            {articles.map((article, idx) => (
               <motion.article
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="space-y-10 group cursor-pointer"
               >
                  <div className="aspect-[16/10] rounded-[3rem] overflow-hidden shadow-xl">
                     <img src={article.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                  </div>
                  <div className="space-y-6">
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-ffn-primary uppercase tracking-[0.4em]">{article.category}</span>
                        <div className="flex items-center space-x-6 text-gray-300">
                           <Bookmark className="w-5 h-5 hover:text-ffn-black transition-colors" />
                           <Share2 className="w-5 h-5 hover:text-ffn-black transition-colors" />
                        </div>
                     </div>
                     <h4 className="text-5xl font-serif italic text-ffn-black tracking-tight leading-none group-hover:text-ffn-primary transition-colors">{article.title}</h4>
                     <p className="text-gray-500 font-light leading-relaxed max-w-xl">{article.excerpt}</p>
                     <div className="flex items-center space-x-8 pt-4">
                        <div className="flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                           <span className="text-[10px] font-bold uppercase tracking-widest text-ffn-black">{article.author}</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300">{article.date}</span>
                     </div>
                  </div>
               </motion.article>
            ))}
         </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="bg-ffn-gray rounded-[4rem] p-24 text-center space-y-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-80 h-80 bg-ffn-primary/5 blur-[100px] rounded-full"></div>
         <div className="absolute bottom-0 left-0 w-80 h-80 bg-ffn-accent/5 blur-[100px] rounded-full"></div>
         <Sparkles className="w-12 h-12 text-ffn-primary mx-auto" />
         <div className="space-y-6">
            <h2 className="text-6xl font-serif italic text-ffn-black tracking-tighter">The Weekly Insight</h2>
            <p className="text-gray-400 max-w-lg mx-auto leading-relaxed">Curated fashion journalism, global trend reports, and exclusive network interviews delivered every Sunday.</p>
         </div>
         <div className="max-w-md mx-auto relative flex items-center">
            <input type="email" placeholder="Your professional email" className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 px-10 text-[10px] font-bold uppercase tracking-widest shadow-xl focus:outline-none focus:border-ffn-primary transition-all" />
            <button className="absolute right-4 p-4 bg-ffn-black text-white rounded-[1.5rem] hover:bg-ffn-primary transition-all">
               <ArrowRight className="w-5 h-5" />
            </button>
         </div>
      </section>
    </div>
  );
};
