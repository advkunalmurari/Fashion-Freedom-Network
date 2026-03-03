
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Play, Search, Camera, ArrowRight, Eye,
  Heart, MessageCircle, ShieldCheck, TrendingUp, Zap, Star,
  Bookmark, Share2, MoreHorizontal, MapPin
} from 'lucide-react';
import { DiscoveryNode } from './DiscoveryNode';
import { GrowthLeaderboard } from './GrowthLeaderboard';

// ─── Rich Content Data ────────────────────────────────────────────────────────

const EXPLORE_ARTISTS = [
  { id: 'a1', username: 'aarav.lens', name: 'Aarav Sharma', location: 'Mumbai', category: 'Photographer', verified: true, boosted: true, followers: '92.4K', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop' },
  { id: 'a2', username: 'kiara.haute', name: 'Kiara Mehta', location: 'Delhi', category: 'Model', verified: true, boosted: false, followers: '148K', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop' },
  { id: 'a3', username: 'neil.wardrobe', name: 'Neil Kapoor', location: 'Bangalore', category: 'Stylist', verified: true, boosted: true, followers: '67.3K', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop' },
  { id: 'a4', username: 'priya.visual', name: 'Priya Bose', location: 'Chennai', category: 'Creative Director', verified: false, boosted: false, followers: '34.1K', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop' },
  { id: 'a5', username: 'aryan.couture', name: 'Aryan Nanda', location: 'Hyderabad', category: 'Designer', verified: true, boosted: false, followers: '55.8K', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop' },
  { id: 'a6', username: 'sara.edit', name: 'Sara Joshi', location: 'Pune', category: 'Art Director', verified: true, boosted: true, followers: '203K', avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop' },
  { id: 'a7', username: 'ravi.motion', name: 'Ravi Gupta', location: 'Mumbai', category: 'Videographer', verified: false, boosted: false, followers: '28.9K', avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop' },
  { id: 'a8', username: 'meena.luxe', name: 'Meena Pillai', location: 'Kochi', category: 'Model', verified: true, boosted: false, followers: '87.2K', avatar: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop' },
];

type GridItem = {
  id: string;
  type: 'photo' | 'video' | 'editorial' | 'casting' | 'reel';
  imageUrl: string;
  artist: typeof EXPLORE_ARTISTS[0];
  caption: string;
  likes: number;
  comments: number;
  tags: string[];
  isLarge?: boolean;
  category: string;
};

const EXPLORE_GRID: GridItem[] = [
  {
    id: 'g1', type: 'editorial', isLarge: true,
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[0],
    caption: 'Monochrome Manifesto — Studio Series 01',
    likes: 4821, comments: 132, tags: ['#Editorial', '#StudioWork', '#Fashion'],
    category: 'Editorial',
  },
  {
    id: 'g2', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[1],
    caption: 'Street Architecture, Autumn Collection',
    likes: 2347, comments: 89, tags: ['#Streetwear', '#Fashion', '#Mumbai'],
    category: 'Street',
  },
  {
    id: 'g3', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[2],
    caption: 'Dusk Studio — Minimalist Identity',
    likes: 1893, comments: 54, tags: ['#Minimal', '#Studio', '#Lookbook'],
    category: 'Editorial',
  },
  {
    id: 'g4', type: 'photo', isLarge: true,
    imageUrl: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[3],
    caption: 'Avant-garde Silhouette — Sao Paulo Week',
    likes: 7102, comments: 204, tags: ['#AvantGarde', '#Runway', '#Couture'],
    category: 'Runway',
  },
  {
    id: 'g5', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[4],
    caption: 'Couture Fragment — Silk & Wire',
    likes: 3456, comments: 76, tags: ['#Couture', '#Design', '#India'],
    category: 'Couture',
  },
  {
    id: 'g6', type: 'editorial',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[5],
    caption: 'Golden Hour Editorial — Mumbai Skyline',
    likes: 9871, comments: 312, tags: ['#Editorial', '#GoldenHour', '#Fashion'],
    category: 'Editorial',
  },
  {
    id: 'g7', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[6],
    caption: 'White Noise — Architectural Wearables',
    likes: 1234, comments: 41, tags: ['#Architecture', '#Wearable', '#Concept'],
    category: 'Concept',
  },
  {
    id: 'g8', type: 'editorial', isLarge: true,
    imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[7],
    caption: 'Neo-Traditional — Kerala Craft Series',
    likes: 5443, comments: 187, tags: ['#NeoTraditional', '#Kerala', '#India'],
    category: 'Cultural',
  },
  {
    id: 'g9', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[0],
    caption: 'Texture Studies — Raw Fabric Objects',
    likes: 2109, comments: 63, tags: ['#Texture', '#Fabric', '#BTS'],
    category: 'BTS',
  },
  {
    id: 'g10', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1536766820879-059fec98ec0a?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[1],
    caption: 'Bold Presence — Resort Capsule',
    likes: 6731, comments: 221, tags: ['#Resort', '#Capsule', '#Lookbook'],
    category: 'Lookbook',
  },
  {
    id: 'g11', type: 'editorial',
    imageUrl: 'https://images.unsplash.com/photo-1544441892-794166f1e3be?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[2],
    caption: 'Draping Gods — Spring Collection',
    likes: 4012, comments: 98, tags: ['#Spring', '#Draping', '#Fashion'],
    category: 'Editorial',
  },
  {
    id: 'g12', type: 'photo', isLarge: true,
    imageUrl: 'https://images.unsplash.com/photo-1550614000-4895a10e1bfd?w=800&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[3],
    caption: 'Interior Gaze — The Statement Coat',
    likes: 8223, comments: 267, tags: ['#Statement', '#Coat', '#Fashion'],
    category: 'Runway',
  },
  {
    id: 'g13', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[4],
    caption: 'Desert Identity — Sand + Silk',
    likes: 3341, comments: 82, tags: ['#Desert', '#Travel', '#Editorial'],
    category: 'Travel',
  },
  {
    id: 'g14', type: 'editorial',
    imageUrl: 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[5],
    caption: 'Neon Heritage — Night Shift Capsule',
    likes: 7892, comments: 243, tags: ['#Neon', '#Night', '#Streetwear'],
    category: 'Street',
  },
  {
    id: 'g15', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[6],
    caption: 'Chrome Mirror — Futurist Wearables',
    likes: 2787, comments: 71, tags: ['#Future', '#Chrome', '#Wearable'],
    category: 'Concept',
  },
  {
    id: 'g16', type: 'editorial',
    imageUrl: 'https://images.unsplash.com/photo-1588117472013-59bb13edafec?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[7],
    caption: 'Fluid Architecture — Water Edition',
    likes: 5119, comments: 156, tags: ['#Architecture', '#Water', '#Art'],
    category: 'Art',
  },
  {
    id: 'g17', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[0],
    caption: 'Indian Summer — Handloom Series',
    likes: 6034, comments: 191, tags: ['#Handloom', '#India', '#Cultural'],
    category: 'Cultural',
  },
  {
    id: 'g18', type: 'photo',
    imageUrl: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=600&auto=format&fit=crop',
    artist: EXPLORE_ARTISTS[1],
    caption: 'Precision Lines — Structured Intelligence',
    likes: 4453, comments: 128, tags: ['#Structure', '#Minimalism', '#Fashion'],
    category: 'Editorial',
  },
];

const TRENDING_HASHTAGS = [
  { tag: '#RunwayMastery', count: '14.2K' },
  { tag: '#EditorialIndia', count: '8.7K' },
  { tag: '#CyberCouture', count: '6.3K' },
  { tag: '#SustainableLux', count: '11.1K' },
  { tag: '#NeoTraditional', count: '9.5K' },
  { tag: '#MumbaiEdit', count: '7.2K' },
  { tag: '#MinimalistMode', count: '5.9K' },
  { tag: '#AvantGarde', count: '13.4K' },
];

const CATEGORIES = ['All', 'Runway', 'Editorial', 'Street', 'Couture', 'BTS', 'Cultural', 'Concept'];

// ─── Component ────────────────────────────────────────────────────────────────

export const Explore: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [savedItems, setSavedItems] = useState<Set<string>>(new Set());
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'visual' | 'editorial' | 'motion'>('visual');

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const filtered = EXPLORE_GRID.filter(item => {
    const matchCat = activeCategory === 'All' || item.category === activeCategory;
    const matchSearch = !searchQuery ||
      item.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchTab = activeTab === 'motion' ? item.type === 'video' || item.type === 'reel' :
      activeTab === 'editorial' ? item.type === 'editorial' : true;
    return matchCat && matchSearch && matchTab;
  });

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">

      {/* ─── Header ─── */}
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
              { id: 'visual', label: 'Identity' },
              { id: 'editorial', label: 'Editorial' },
              { id: 'motion', label: 'Motion' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-8 py-3.5 rounded-[1.5rem] text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-ffn-black text-white shadow-xl' : 'text-gray-400 hover:text-ffn-black'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discovery Nodes (Artist Ribbon) */}
        <div className="relative pt-2 pb-2">
          <div className="flex overflow-x-auto no-scrollbar space-x-6 px-2">
            {EXPLORE_ARTISTS.map((artist, i) => (
              <DiscoveryNode
                key={artist.id}
                id={artist.id}
                username={artist.username}
                avatarUrl={artist.avatar}
                isPulse={i === 0 || i === 2 || i === 5}
                label={i === 0 ? 'Trending' : i === 2 ? 'Rising' : i === 5 ? 'Featured' : undefined}
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
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Discover verified identities, editorials, styles..."
              className="w-full bg-white/40 backdrop-blur-md border border-gray-100 rounded-[2.5rem] py-6 pl-16 pr-16 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200/20 focus:shadow-2xl focus:border-ffn-primary focus:bg-white transition-all outline-none"
            />
            <button className="absolute right-6 top-1/2 -translate-y-1/2 p-2 bg-gray-50 rounded-2xl text-gray-400 hover:text-ffn-primary transition-colors hover:bg-white shadow-sm">
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Category Pills */}
          <div className="flex overflow-x-auto no-scrollbar space-x-3 items-center">
            {CATEGORIES.map(cat => (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-3.5 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat
                  ? 'bg-ffn-black text-white shadow-xl'
                  : 'bg-white border border-gray-100 shadow-sm text-gray-400 hover:border-ffn-primary hover:text-ffn-black'
                  }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Growth Leaderboard */}
        <div className="pt-2">
          <GrowthLeaderboard />
        </div>
      </header>

      {/* ─── Trending Hashtags Ribbon ─── */}
      <section className="space-y-4">
        <div className="flex items-center space-x-3">
          <TrendingUp className="w-4 h-4 text-ffn-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Trending Now</span>
        </div>
        <div className="flex overflow-x-auto no-scrollbar space-x-4 pb-2">
          {TRENDING_HASHTAGS.map(({ tag, count }) => (
            <motion.button
              key={tag}
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSearchQuery(tag.slice(1))}
              className="flex-none px-6 py-3 rounded-2xl bg-gradient-to-br from-ffn-primary/5 to-ffn-accent/5 border border-ffn-primary/10 hover:border-ffn-primary/40 hover:shadow-lg transition-all group"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-ffn-primary">{tag}</span>
              <span className="ml-2 text-[8px] font-bold text-gray-400">{count}</span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* ─── Main Masonry Grid ─── */}
      <section>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center space-y-6"
            >
              <p className="text-4xl font-serif italic text-gray-200">No Results Found</p>
              <p className="text-xs uppercase tracking-widest text-gray-400">Try a different category or search term</p>
            </motion.div>
          ) : (
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
              {filtered.map((item, idx) => {
                const isLiked = likedItems.has(item.id);
                const isSaved = savedItems.has(item.id);
                const isHovered = hoveredId === item.id;
                const sizeClass = item.isLarge
                  ? 'aspect-[3/4]'
                  : idx % 7 === 3 ? 'aspect-[4/5]'
                    : idx % 5 === 2 ? 'aspect-[9/16]'
                      : 'aspect-square';

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: idx * 0.03 }}
                    className={`relative group cursor-pointer break-inside-avoid rounded-[2rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-700 border border-gray-100/50 ${sizeClass} mb-4`}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Image */}
                    <img
                      src={item.imageUrl}
                      className="w-full h-full object-cover transition-transform duration-[4s] group-hover:scale-110"
                      alt={item.caption}
                      loading="lazy"
                    />

                    {/* Category Chip */}
                    <div className="absolute top-4 left-4 flex space-x-2">
                      <span className="px-3 py-1 rounded-full bg-ffn-primary/80 backdrop-blur-md text-white text-[7px] font-black uppercase tracking-widest shadow-lg">
                        {item.category}
                      </span>
                      {item.artist.verified && (
                        <span className="p-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                          <ShieldCheck className="w-3 h-3 text-white" />
                        </span>
                      )}
                    </div>

                    {/* Save button (top right) */}
                    <motion.button
                      className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md border transition-all ${isSaved ? 'bg-ffn-primary border-ffn-primary text-white shadow-xl' : 'bg-white/20 border-white/30 text-white hover:bg-white/40'}`}
                      onClick={e => toggleSave(item.id, e)}
                      whileTap={{ scale: 0.85 }}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
                    </motion.button>

                    {/* Bottom Glass Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                      {/* Artist Row */}
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={item.artist.avatar}
                          className="w-9 h-9 rounded-xl border border-white/30 object-cover"
                          alt={item.artist.name}
                        />
                        <div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-white">{item.artist.username}</p>
                          <div className="flex items-center space-x-1 text-white/60">
                            <MapPin className="w-2.5 h-2.5" />
                            <p className="text-[7px] font-bold uppercase tracking-wider">{item.artist.location}</p>
                          </div>
                        </div>
                        {item.artist.boosted && (
                          <div className="ml-auto">
                            <Zap className="w-4 h-4 text-ffn-accent" />
                          </div>
                        )}
                      </div>

                      {/* Caption */}
                      <p className="text-[9px] font-medium text-white/80 leading-relaxed mb-4 line-clamp-2">{item.caption}</p>

                      {/* Engagement Row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <motion.button
                            onClick={e => toggleLike(item.id, e)}
                            className="flex items-center space-x-1.5 group/like"
                            whileTap={{ scale: 0.8 }}
                          >
                            <Heart
                              className={`w-4 h-4 transition-colors ${isLiked ? 'text-red-400 fill-red-400' : 'text-white/70 group-hover/like:text-red-400'}`}
                              fill={isLiked ? 'currentColor' : 'none'}
                            />
                            <span className="text-[8px] font-black text-white/80">
                              {(item.likes + (isLiked ? 1 : 0)).toLocaleString()}
                            </span>
                          </motion.button>
                          <button className="flex items-center space-x-1.5">
                            <MessageCircle className="w-4 h-4 text-white/70" />
                            <span className="text-[8px] font-black text-white/80">{item.comments}</span>
                          </button>
                        </div>
                        <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all">
                          <Share2 className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ─── Featured Artists Section ─── */}
      <section className="space-y-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-ffn-accent">
              <Star className="w-4 h-4 fill-ffn-accent" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Featured Identities</span>
            </div>
            <h2 className="text-4xl font-serif italic tracking-tighter text-ffn-black">Rising Talent</h2>
          </div>
          <button className="flex items-center space-x-3 group text-ffn-black hover:text-ffn-primary transition-colors">
            <span className="text-[10px] font-black uppercase tracking-widest border-b border-current pb-0.5">View All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex overflow-x-auto no-scrollbar space-x-6 pb-4">
          {EXPLORE_ARTISTS.map((artist, i) => (
            <motion.div
              key={artist.id}
              whileHover={{ y: -8 }}
              className="flex-none w-52 bg-white rounded-[3rem] border border-gray-100 shadow-lg hover:shadow-2xl transition-all overflow-hidden group cursor-pointer"
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={EXPLORE_GRID[i % EXPLORE_GRID.length].imageUrl}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  alt={artist.name}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {artist.boosted && (
                  <div className="absolute top-4 left-4 flex items-center space-x-1.5 bg-ffn-accent/90 backdrop-blur-md px-3 py-1 rounded-full">
                    <Zap className="w-3 h-3 text-black" />
                    <span className="text-[7px] font-black uppercase tracking-widest text-black">Boosted</span>
                  </div>
                )}
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <img src={artist.avatar} className="w-9 h-9 rounded-xl object-cover border border-gray-100" alt={artist.name} />
                  <div>
                    <div className="flex items-center space-x-1.5">
                      <p className="text-[10px] font-black uppercase tracking-wide text-ffn-black truncate max-w-[80px]">{artist.name}</p>
                      {artist.verified && <ShieldCheck className="w-3 h-3 text-ffn-primary flex-none" />}
                    </div>
                    <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{artist.category}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="text-center">
                    <p className="text-[10px] font-black text-ffn-black">{artist.followers}</p>
                    <p className="text-[7px] font-bold text-gray-400 uppercase tracking-widest">Followers</p>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-300">
                    <MapPin className="w-3 h-3" />
                    <span className="text-[8px] font-bold text-gray-400">{artist.location}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Trending Editorial Preview ─── */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {EXPLORE_GRID.filter(g => g.isLarge).map((item, i) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -10 }}
            className={`relative rounded-[4rem] overflow-hidden shadow-2xl cursor-pointer ${i === 0 ? 'md:col-span-2' : ''}`}
            style={{ aspectRatio: i === 0 ? '16/9' : '4/5' }}
          >
            <img
              src={item.imageUrl}
              className="w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
              alt={item.caption}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 space-y-4">
              <span className="inline-block px-4 py-1.5 bg-ffn-primary/80 backdrop-blur-md rounded-full text-white text-[8px] font-black uppercase tracking-widest">
                {item.category}
              </span>
              <h3 className="text-3xl font-serif italic text-white leading-tight">{item.caption}</h3>
              <div className="flex items-center space-x-3">
                <img src={item.artist.avatar} className="w-8 h-8 rounded-xl object-cover border border-white/30" alt="" />
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-white">{item.artist.name}</p>
                  <p className="text-[7px] font-bold text-white/60 uppercase tracking-widest">{item.artist.category}</p>
                </div>
                <div className="ml-auto flex items-center space-x-4">
                  <span className="flex items-center space-x-1 text-white/70">
                    <Heart className="w-4 h-4" />
                    <span className="text-[9px] font-black">{item.likes.toLocaleString()}</span>
                  </span>
                  <span className="flex items-center space-x-1 text-white/70">
                    <Eye className="w-4 h-4" />
                    <span className="text-[9px] font-black">{(item.likes * 3.2).toFixed(0)}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="bg-ffn-black rounded-[5rem] p-20 text-center space-y-12 relative overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10 grayscale group-hover:scale-105 transition-transform duration-[10s]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=2000')" }}
        />
        <div className="absolute inset-0 bg-ffn-primary/20 mix-blend-overlay opacity-30" />
        <div className="relative z-10 space-y-8">
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 border border-ffn-primary/30 rounded-full flex items-center justify-center"
            >
              <div className="w-16 h-16 bg-ffn-primary/10 backdrop-blur-3xl rounded-full flex items-center justify-center text-ffn-primary">
                <Eye className="w-8 h-8" />
              </div>
            </motion.div>
          </div>
          <div className="space-y-4">
            <h2 className="text-5xl md:text-7xl font-serif italic text-white tracking-tighter">Enter the Graph.</h2>
            <p className="text-white/40 max-w-xl mx-auto text-xs md:text-sm font-light italic leading-relaxed uppercase tracking-widest">
              Join India's global fashion discovery network. <br />Your visual identity, verified and sovereign.
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