
import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, Grid, Sparkles } from 'lucide-react';

export const SavedHub: React.FC = () => {
  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      <header className="space-y-6">
        <div className="inline-flex items-center space-x-3 text-ffn-primary">
          <Bookmark className="w-5 h-5 fill-current" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Private Archive Protocol</span>
        </div>
        <h1 className="text-7xl font-serif italic tracking-tighter text-ffn-black">Saved Nodes</h1>
        <p className="text-gray-400 font-light italic max-w-xl">Curated collections of talent, moodboards, and professional opportunities.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {[1, 2, 3].map((i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="group bg-white rounded-[3rem] overflow-hidden shadow-xl border border-gray-50 cursor-pointer"
          >
            <div className="aspect-[4/3] relative">
              <img src={`https://picsum.photos/id/${140+i}/600/450`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
              <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 text-white">
                <Grid className="w-4 h-4" />
              </div>
            </div>
            <div className="p-10 space-y-2">
              <h3 className="text-2xl font-serif italic text-ffn-black">Editorial Moods {i}</h3>
              <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">24 Items &bull; Milan Project</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="py-24 text-center opacity-30">
        <Sparkles className="w-12 h-12 mx-auto mb-4" />
        <p className="text-[10px] uppercase tracking-[0.6em] font-black">End of Archive</p>
      </div>
    </div>
  );
};
