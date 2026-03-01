import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Heart, MessageCircle, Share2, Music, Sparkles, Loader2, Volume2, VolumeX, Briefcase, Plus } from 'lucide-react';
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

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex items-center justify-center bg-black rounded-[3rem]">
        <Loader2 className="w-10 h-10 animate-spin text-ffn-primary" />
      </div>
    );
  }

  if (!loading && reels.length === 0) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center bg-black rounded-[3rem] text-center p-12 space-y-4 shadow-2xl">
        <Sparkles className="w-12 h-12 text-ffn-primary opacity-50" />
        <p className="text-white text-sm font-bold uppercase tracking-[0.3em]">No Motion Signals Detected</p>
        <p className="text-white/40 text-xs max-w-xs">Be the first to upload a vertical fashion reel to this sector.</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[calc(100vh-140px)] overflow-y-scroll snap-y snap-mandatory no-scrollbar rounded-[3rem] bg-black shadow-2xl border border-gray-800"
    >
      {reels.map((reel) => (
        <ReelCard key={reel.id} reel={reel} muted={muted} setMuted={setMuted} />
      ))}
    </div>
  );
};

const ReelCard: React.FC<{ reel: Post, muted: boolean, setMuted: (muted: boolean) => void }> = ({ reel, muted, setMuted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(reel.isLiked);
  const [likesCount, setLikesCount] = useState(reel.likes);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.log('Autoplay prevented', e));
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = async () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    await postService.toggleLike(reel.id, !isLiked);
  };

  return (
    <section className="h-full w-full snap-start relative group flex flex-col justify-end p-8 md:p-12 overflow-hidden bg-black">
      {/* Background Video Media */}
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={togglePlay}>
        {reel.mediaUrls?.[0] ? (
          <video
            ref={videoRef}
            src={reel.mediaUrls[0]}
            className="w-full h-full object-cover"
            loop
            muted={muted}
            playsInline
            preload="metadata"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

        {/* Play State Overlay */}
        <AnimatePresence>
          {!isPlaying && reel.mediaUrls?.[0] && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="w-24 h-24 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20">
                <Play className="w-10 h-10 ml-2" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mute Toggle */}
      <div className="absolute top-10 w-full left-0 px-8 md:px-12 flex justify-between items-center z-50">
        <h2 className="text-white text-2xl font-serif italic tracking-tight drop-shadow-md">Motion</h2>
        <button
          onClick={(e) => { e.stopPropagation(); setMuted(!muted); }}
          className="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay Content */}
      <div className="relative z-10 flex justify-between items-end gap-6 md:gap-10 pb-4">
        <div className="space-y-6 max-w-[70%]">
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer">
              <div className="w-14 h-14 rounded-full border-2 border-white overflow-hidden shadow-2xl bg-gray-900 relative z-10">
                <img src={reel.author.avatarUrl} alt={reel.author.displayName} className="w-full h-full object-cover" />
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-ffn-primary text-white rounded-full flex items-center justify-center border-2 border-black z-20 shadow-lg" onClick={(e) => e.stopPropagation()}>
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <div className="space-y-1">
              <h3 className="text-white font-bold text-lg md:text-xl tracking-tight uppercase flex items-center gap-2 drop-shadow-md cursor-pointer">
                {reel.author.displayName}
                {reel.author.isVerified && <Sparkles className="w-3.5 h-3.5 text-ffn-primary fill-ffn-primary drop-shadow-lg" />}
              </h3>
              <p className="text-white/80 text-[10px] font-black uppercase tracking-widest drop-shadow-sm">{reel.author.role}</p>
            </div>
          </div>

          <p className="text-white text-sm font-light leading-relaxed drop-shadow-md line-clamp-3">
            {reel.caption}
          </p>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center space-x-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 w-fit cursor-pointer hover:bg-black/60 transition-colors">
              <Music className="w-4 h-4 text-ffn-accent animate-pulse" />
              <span className="text-white text-[9px] font-bold uppercase tracking-widest">Original Audio - FFN Motion</span>
            </div>

            {/* Professional CTA - Book Talent */}
            <div className="flex items-center space-x-3 bg-ffn-primary px-6 py-3 rounded-full border border-ffn-primary/50 w-fit cursor-pointer shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] transition-all">
              <Briefcase className="w-4 h-4 text-white" />
              <span className="text-white text-[9px] font-bold uppercase tracking-widest">Book Talent</span>
            </div>
          </div>
        </div>

        {/* Side Actions */}
        <div className="flex flex-col items-center space-y-6 md:space-y-8">
          <div className="flex flex-col items-center space-y-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); toggleLike(); }}
              className={`p-4 md:p-5 rounded-full backdrop-blur-xl border border-white/20 transition-all shadow-2xl ${isLiked ? 'bg-ffn-accent text-white border-ffn-accent shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'bg-black/40 text-white hover:bg-white/10'}`}
            >
              <Heart className={`w-6 h-6 md:w-7 md:h-7 ${isLiked ? 'fill-current' : ''}`} />
            </motion.button>
            <span className="text-white text-[11px] font-bold drop-shadow-md">{likesCount}</span>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="p-4 md:p-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all shadow-2xl"
            >
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
            </motion.button>
            <span className="text-white text-[11px] font-bold drop-shadow-md">{reel.comments}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="p-4 md:p-5 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 text-white hover:bg-white/10 transition-all shadow-2xl"
          >
            <Share2 className="w-6 h-6 md:w-7 md:h-7" />
          </motion.button>
        </div>
      </div>

      {/* Progress Bar Placeholder */}
      <div className="absolute bottom-0 left-0 h-1.5 bg-ffn-primary shadow-[0_0_20px_rgba(99,102,241,0.5)] w-full opacity-30 origin-left scale-x-100"></div>
    </section>
  );
};
