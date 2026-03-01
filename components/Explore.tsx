
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Play, Image as ImageIcon, Search, SlidersHorizontal, Grid, Camera, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { Post } from '../types';
import { postService } from '../services/postService';

export const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'curated' | 'motion'>('visual');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const topics = ['Streetwear', 'Avant-Garde', 'Minimalism', 'Sustainable', 'Couture', 'Vintage', 'Digital'];

  useEffect(() => {
    const fetchExplore = async () => {
      setIsLoading(true);
      const res = await postService.getExploreFeed();
      if (res.success && res.data) {
        setPosts(res.data);
      }
      setIsLoading(false);
    };
    fetchExplore();
  }, []);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'motion') return post.type === 'VIDEO';
    if (activeTab === 'curated') return post.author.isBoosted;
    return true; // identity graph = all
  });

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      <header className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-3 text-ffn-primary">
              <Grid className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Discovery Lab</span>
            </div>
            <h1 className="text-7xl font-serif italic tracking-tighter text-ffn-black">Visual Explore</h1>
          </div>

          <div className="flex bg-gray-50 p-1.5 rounded-[2rem] space-x-1 border border-gray-100 shadow-inner">
            {[
              { id: 'visual', label: 'Identity Graph', icon: Grid },
              { id: 'curated', label: 'Editorial', icon: Sparkles },
              { id: 'motion', label: 'Cinematic', icon: Play }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-3 px-8 py-3.5 rounded-[1.5rem] text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-ffn-black text-white shadow-xl' : 'text-gray-400 hover:text-ffn-black'}`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ffn-primary transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Visual identity search..."
              className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-24 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200/20 focus:shadow-2xl focus:border-ffn-primary transition-all"
            />
            <button className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-ffn-primary transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>
          <div className="flex overflow-x-auto no-scrollbar space-x-4 items-center">
            {topics.map((topic, idx) => (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-2xl bg-white border border-gray-50 shadow-sm text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-ffn-primary hover:text-ffn-black transition-all whitespace-nowrap"
              >
                {topic}
              </motion.button>
            ))}
            <button className="p-4 bg-ffn-black text-white rounded-2xl shadow-xl hover:bg-ffn-primary transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6">
          <Loader2 className="w-12 h-12 animate-spin text-ffn-primary" />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Scanning Identity Nodes...</p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-10 space-y-10">
          <AnimatePresence mode="popLayout">
            {filteredPosts.map((post, idx) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative group cursor-pointer break-inside-avoid rounded-[3.5rem] overflow-hidden shadow-xl hover:shadow-[0_40px_80px_rgba(0,0,0,0.15)] transition-all border border-gray-100"
              >
                <img
                  src={post.mediaUrls[0]}
                  className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                  alt={post.caption}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-700"></div>

                <div className="absolute top-8 right-8 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  {post.type === 'VIDEO' ? <Play className="w-5 h-5 fill-white" /> : <ImageIcon className="w-5 h-5" />}
                </div>

                <div className="absolute bottom-10 left-10 opacity-0 group-hover:opacity-100 transition-all translate-y-6 group-hover:translate-y-0 duration-500 w-full pr-20">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden shadow-lg flex-none">
                        <img src={post.author.avatarUrl} alt="" />
                      </div>
                      <div className="truncate">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white truncate">@{post.author.username}</p>
                        <p className="text-[7px] uppercase tracking-widest text-white/60 font-bold">{post.author.location}</p>
                      </div>
                    </div>
                    <button className="flex items-center space-x-3 text-white">
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] border-b border-white pb-1">Enter Narrative</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="absolute top-8 left-8 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {post.shootType && (
                    <span className="bg-white/20 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/20">
                      📸 {post.shootType}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {posts.length === 0 && !isLoading && (
        <div className="bg-gray-50 rounded-[4rem] p-32 text-center space-y-8 border-2 border-dashed border-gray-200 mt-10">
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-xl">
              <Grid className="w-10 h-10" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-serif italic text-gray-400">No content found</h3>
            <p className="text-xs text-gray-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">The Discovery Engine hasn't indexed any media matching this query yet.</p>
          </div>
          <button
            onClick={() => { setSearchQuery(''); setActiveTab('visual'); }}
            className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary border-b border-ffn-primary pb-1 mx-auto block"
          >
            Reset Discovery Protocol
          </button>
        </div>
      )}

      <section className="bg-ffn-black rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden shadow-3xl border border-white/5">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-tr from-ffn-primary/10 via-transparent to-ffn-accent/10 blur-[120px] rounded-full animate-float"></div>
        <div className="relative z-10 space-y-10">
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 flex items-center justify-center text-ffn-accent shadow-2xl">
              <TrendingUp className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">Computational <br /> <span className="text-gradient-vibrant font-bold not-italic">Scouting.</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-xl font-light italic leading-relaxed">"FFN’s discovery protocol uses multi-modal intelligence to match talent with global production requirements in real-time."</p>
          </div>
          <div className="pt-8"><button className="px-16 py-8 bg-white text-ffn-black rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all flex items-center space-x-4 mx-auto"><Zap className="w-5 h-5 text-ffn-accent" /><span>Launch Visual Search Engine</span></button></div>
        </div>
      </section>
    </div>
  );
};