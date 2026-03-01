import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, MessageCircle, Share2, Music, UserPlus, Sparkles, Loader2, Volume2, VolumeX } from 'lucide-react';
import { postService } from '../services/postService';
import { Post } from '../types';

export const Motion: React.FC = () => {
  const [reels, setReels] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchReels = async () => {
      const res = await postService.getReels();
      if (res.success && res.data) {
        setReels(res.data);
      }
      setLoading(false);
    };
    fetchReels();
  }, []);

  const handleToggleLike = async (id: string, currentlyLiked: boolean) => {
    // Logic for toggling like would go here, 
    // similar to FeedCard as per project patterns
    await postService.toggleLike(id, currentlyLiked);
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-120px)] flex items-center justify-center bg-black rounded-[3rem]">
        <Loader2 className="w-10 h-10 animate-spin text-ffn-primary" />
      </div>
    );
  }

  if (!loading && reels.length === 0) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col items-center justify-center bg-black rounded-[3rem] text-center p-12 space-y-4">
        <Sparkles className="w-12 h-12 text-ffn-primary opacity-50" />
        <p className="text-white/40 text-sm font-bold uppercase tracking-[0.3em]">No Motion Signals Detected</p>
        <p className="text-white/20 text-xs max-w-xs">Be the first to upload a vertical fashion reel to this sector.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-120px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar rounded-[3rem] bg-black"
    >
      {reels.map((reel) => (
        <section key={reel.id} className="h-full w-full snap-start relative group flex flex-col justify-end p-12 overflow-hidden">
          {/* Background Video Media */}
          <div className="absolute inset-0 z-0">
            {reel.mediaUrls?.[0] ? (
              <video
                src={reel.mediaUrls[0]}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={muted}
                playsInline
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-white/10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
          </div>

          {/* Mute Toggle */}
          <button
            onClick={() => setMuted(!muted)}
            className="absolute top-10 left-10 z-50 p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 text-white"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Overlay Content */}
          <div className="relative z-10 flex justify-between items-end gap-10">
            <div className="space-y-6 max-w-lg">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl border-2 border-white overflow-hidden shadow-2xl bg-gray-900">
                  <img src={reel.author.avatarUrl} alt={reel.author.displayName} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-lg tracking-tight uppercase flex items-center gap-2">
                    {reel.author.displayName}
                    {reel.author.isBoosted && <Sparkles className="w-3 h-3 text-ffn-primary fill-ffn-primary" />}
                  </h3>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{reel.author.role}</p>
                </div>
              </div>

              <p className="text-white/90 text-sm font-light leading-relaxed">
                {reel.caption}
              </p>

              <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl w-fit border border-white/10">
                <Music className="w-4 h-4 text-ffn-accent animate-pulse" />
                <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">Original Audio - FFN Motion</span>
              </div>
            </div>

            {/* Side Actions */}
            <div className="flex flex-col items-center space-y-8">
              <div className="flex flex-col items-center space-y-2">
                <motion.button
                  whileTap={{ scale: 0.8 }}
                  className="p-5 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-ffn-accent transition-all shadow-2xl"
                >
                  <Heart className="w-6 h-6" />
                </motion.button>
                <span className="text-white text-[10px] font-bold">{reel.likes}</span>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <motion.button whileTap={{ scale: 0.8 }} className="p-5 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-ffn-primary transition-all shadow-2xl">
                  <MessageCircle className="w-6 h-6" />
                </motion.button>
                <span className="text-white text-[10px] font-bold">{reel.comments}</span>
              </div>
              <motion.button whileTap={{ scale: 0.8 }} className="p-5 rounded-[1.5rem] bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white hover:text-black transition-all shadow-2xl">
                <Share2 className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Progress Bar Placeholder */}
          <div className="absolute bottom-0 left-0 h-1.5 bg-ffn-primary shadow-[0_0_20px_rgba(99,102,241,0.5)] w-full opacity-30"></div>
        </section>
      ))}
    </div>
  );
};
