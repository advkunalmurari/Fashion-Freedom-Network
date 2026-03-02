
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Play, Image as ImageIcon, Search, SlidersHorizontal, Grid, Camera, Zap, ArrowRight, Loader2, Target, Eye, Star, Map, MapPin } from 'lucide-react';
import { Post } from '../types';
import { postService } from '../services/postService';
import { MOCK_EXPLORE_LABS, MOCK_TALENT_POOL } from '../constants';
import { DiscoveryNode } from './DiscoveryNode';
import { MarketplaceCard } from './MarketplaceCard';
import { GrowthLeaderboard } from './GrowthLeaderboard';
import { ExploreVideoTile } from './ExploreVideoTile';

export const Explore: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'visual' | 'curated' | 'motion'>('visual');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isNearbyOnly, setIsNearbyOnly] = useState(false);
  const [showMapOverlay, setShowMapOverlay] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const topics = ['For You', 'Runway', 'Editorial', 'BTS', 'Castings', 'Masterclasses', 'Streetwear', 'Avant-Garde'];

  const fetchExplore = async (pageNum: number = 1) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    const res = await postService.getExploreFeed(pageNum);
    if (res.success && res.data) {
      if (res.data.length < 20) setHasMore(false);
      else setHasMore(true);

      if (pageNum === 1) {
        setPosts(res.data);
      } else {
        setPosts(prev => {
          const newPosts = res.data!.filter(newP => !prev.some(p => p.id === newP.id));
          return [...prev, ...newPosts];
        });
      }
    } else if (pageNum === 1) {
      setPosts([]);
      setHasMore(false);
    }
    setIsLoading(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    fetchExplore(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          setPage(prev => {
            const next = prev + 1;
            fetchExplore(next);
            return next;
          });
        }
      },
      { rootMargin: '200px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isLoading]);

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'motion') return post.type === 'VIDEO';
    if (activeTab === 'curated') return post.author.isBoosted;
    if (isNearbyOnly) return post.author.location.includes('Milan') || post.author.location.includes('Paris'); // Local simulation
    return true;
  });

  // Intersperse posts with marketplace cards for the "dense" Explore look
  const combinedContent = [];
  const labItems = [...MOCK_EXPLORE_LABS];

  filteredPosts.forEach((post, index) => {
    combinedContent.push({ type: 'post', data: post });
    // Inject a lab item every 3 posts
    if ((index + 1) % 4 === 0 && labItems.length > 0) {
      combinedContent.push({ type: 'lab', data: labItems.shift() });
    }
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-32">
      {/* Holographic Header */}
      <header className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-3 text-ffn-primary bg-ffn-primary/5 px-4 py-2 rounded-full border border-ffn-primary/10">
              <Sparkles className="w-4 h-4 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.4em]">Visual Discovery Protocol</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black leading-none">Perspective.</h1>
          </div>

          <div className="flex bg-gray-50/50 backdrop-blur-xl p-1.5 rounded-[2rem] space-x-1 border border-gray-100 shadow-inner">
            {[
              { id: 'visual', label: 'Identity', icon: Grid },
              { id: 'curated', label: 'Editorial', icon: Star },
              { id: 'motion', label: 'Motion', icon: Play }
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

        {/* Ribbon: Discovery Nodes */}
        <div className="relative pt-4 pb-2">
          <div className="flex overflow-x-auto no-scrollbar space-x-8 px-2">
            {MOCK_TALENT_POOL.slice(0, 8).map((talent, i) => (
              <DiscoveryNode
                key={talent.id}
                id={talent.id}
                username={talent.username}
                avatarUrl={talent.avatarUrl}
                isPulse={i === 0 || i === 3}
                label={i === 0 ? 'Trending' : i === 3 ? 'Active' : undefined}
              />
            ))}
          </div>
        </div>

        {/* Holographic Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ffn-primary transition-all" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Discover verified identities..."
              className="w-full bg-white/40 backdrop-blur-md border border-gray-100 rounded-[2.5rem] py-6 pl-16 pr-24 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200/20 focus:shadow-2xl focus:border-ffn-primary focus:bg-white transition-all outline-none"
            />
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-3">
              <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest hidden md:block">Press / for quick scan</span>
              <button className="p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-ffn-primary transition-colors hover:bg-white shadow-sm">
                <Camera className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex overflow-x-auto no-scrollbar space-x-3 items-center">
            {topics.map((topic) => (
              <motion.button
                key={topic}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-7 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-ffn-primary hover:text-ffn-black hover:shadow-lg transition-all whitespace-nowrap"
              >
                {topic}
              </motion.button>
            ))}
            <button
              onClick={() => setShowMapOverlay(!showMapOverlay)}
              className={`p-4 rounded-2xl shadow-xl transition-all flex-none flex items-center space-x-2 ${showMapOverlay ? 'bg-ffn-primary text-black' : 'bg-ffn-black text-white hover:bg-ffn-primary'}`}
            >
              <Map className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">Map</span>
            </button>
            <button className="p-4 bg-gray-50 text-gray-400 rounded-2xl shadow-sm hover:bg-white hover:text-ffn-black hover:shadow-md transition-all flex-none">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Phase 48: Growth Leaderboard Injection */}
        <div className="pt-4">
          <GrowthLeaderboard />
        </div>
      </header>

      {/* Dynamic Masonry Grid */}
      {isLoading ? (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4 py-10">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={`animate-pulse bg-gray-100 rounded-[2rem] w-full ${i % 3 === 0 ? 'aspect-[4/5]' : 'aspect-square'} break-inside-avoid`} />
          ))}
        </div>
      ) : (
        <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {combinedContent.map((item, idx) => {
              if (item.type === 'lab') {
                return (
                  <MarketplaceCard
                    key={item.data.id}
                    type={item.data.type}
                    title={item.data.title}
                    subtitle={item.data.subtitle}
                    matchScore={item.data.matchScore}
                    price={item.data.price}
                    imageUrl={item.data.imageUrl}
                  />
                );
              }

              const post = item.data as Post;
              // Determine size classes for dynamic layout: every 5th or 7th item is large to create a mixed grid
              const isLarge = idx % 5 === 0 || idx % 7 === 0;

              return (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={`relative group cursor-pointer break-inside-avoid rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-700 border border-gray-100/50 ${isLarge ? 'aspect-[3/4]' : post.type === 'VIDEO' ? 'aspect-[9/16]' : 'aspect-square'}`}
                >
                  <div className="w-full h-full">
                    {post.type === 'VIDEO' ? (
                      <ExploreVideoTile src={post.mediaUrls[0]} />
                    ) : (
                      <img
                        src={post.mediaUrls[0]}
                        className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-105"
                        alt={post.caption}
                      />
                    )}
                  </div>

                  {/* Glass Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl border-2 border-white/20 overflow-hidden">
                            <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-white">@{post.author.username}</p>
                            <p className="text-[7px] font-bold text-white/60 uppercase tracking-widest">{post.author.location}</p>
                          </div>
                        </div>
                        {post.author.isVerified && <Target className="w-4 h-4 text-ffn-primary" />}
                      </div>
                      <button className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all">
                        View Narrative
                      </button>
                    </div>
                  </div>

                  {/* Action Badges */}
                  <div className="absolute top-6 left-6 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0">
                    <div className="bg-ffn-primary text-black px-3 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-xl">
                      Trending
                    </div>
                    {post.author.isFeatured && (
                      <div className="bg-ffn-black text-white px-3 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest border border-white/10 shadow-xl">
                        Elite Node
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Infinite Scroll Trigger */}
      <div ref={observerTarget} className="py-20 flex flex-col items-center space-y-6">
        {isLoadingMore && (
          <>
            <Loader2 className="w-10 h-10 animate-spin text-ffn-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 animate-pulse">Syncing Visual Streams...</span>
          </>
        )}
        {!hasMore && posts.length > 0 && (
          <div className="flex flex-col items-center space-y-4 opacity-30">
            <div className="w-px h-20 bg-gradient-to-b from-transparent via-ffn-primary to-transparent" />
            <span className="text-[8px] font-black uppercase tracking-[0.6em]">End of Perspective</span>
          </div>
        )}
      </div>

      {/* Bottom Call to Action */}
      <section className="bg-ffn-black rounded-[5rem] p-20 text-center space-y-12 relative overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000')] bg-cover bg-center opacity-10 grayscale group-hover:scale-105 transition-transform duration-[10s]" />
        <div className="absolute inset-0 bg-ffn-primary/20 mix-blend-overlay opacity-30" />

        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 border border-ffn-primary/30 rounded-full flex items-center justify-center p-2"
            >
              <div className="w-full h-full bg-ffn-primary/10 backdrop-blur-3xl rounded-full flex items-center justify-center text-ffn-primary">
                <Eye className="w-8 h-8" />
              </div>
            </motion.div>
          </div>

          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Enter the Graph.</h2>
            <p className="text-white/40 max-w-xl mx-auto text-xs md:text-sm font-light italic leading-relaxed uppercase tracking-widest">
              Join the global network of professional fashion explorers. <br /> Your visual identity, verified and sovereign.
            </p>
          </div>

          <button className="group relative px-12 py-6 bg-white rounded-full overflow-hidden transition-all hover:pr-16">
            <div className="absolute inset-0 bg-ffn-primary translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <span className="relative text-[10px] font-black uppercase tracking-[0.4em] text-ffn-black group-hover:text-white transition-colors">Apply for Verification</span>
            <ArrowRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all text-white" />
          </button>
        </div>
      </section>
    </div>
  );
};