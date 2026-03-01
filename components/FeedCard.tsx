
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  CheckCircle, Sparkles, X, Link, Twitter, Facebook, Copy,
  Check, Send, Play, Pause, Volume2, VolumeX, Maximize, PlayCircle,
  ExternalLink, MessageSquare
} from 'lucide-react';
import { Post } from '../types';
import { postService } from '../services/postService';

interface FeedCardProps {
  post: Post;
  index?: number;
  onSelectPost?: (id: string) => void;
}

export const FeedCard: React.FC<FeedCardProps> = ({ post, index = 0, onSelectPost }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likes, setLikes] = useState(post.likes);
  const [showHeart, setShowHeart] = useState(false);
  const [isMediaLoading, setIsMediaLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Video State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    // Optimistic Update
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);

    if (newLikedState) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }

    // Background API Sync
    const res = await postService.toggleLike(post.id);
    if (!res.success) {
      // Revert if failed
      setIsLiked(!newLikedState);
      setLikes(prev => newLikedState ? prev - 1 : prev + 1);
      console.error('Failed to sync like:', res.error);
    }
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    const res = await postService.toggleSave(post.id);
    if (!res.success) {
      setIsSaved(!newSavedState);
      console.error('Failed to sync save:', res.error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const togglePlay = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
        triggerAutoHide();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const triggerAutoHide = () => {
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    if (!showControls) setShowControls(true);
    triggerAutoHide();
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const p = (current / videoRef.current.duration) * 100;
      setCurrentTime(current);
      setProgress(p);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const time = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
      videoRef.current.currentTime = time;
      setProgress(parseFloat(e.target.value));
    }
  };

  // SHARE HANDLERS
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/post/${post.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    const text = encodeURIComponent(`Mastery by @${post.author.username} on FFN:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const handleFacebookShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleWhatsAppShare = () => {
    const url = `${window.location.origin}/post/${post.id}`;
    const text = encodeURIComponent(`Check out this fashion mastery on FFN: ${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fashion Mastery by ${post.author.username}`,
          text: post.caption,
          url: `${window.location.origin}/post/${post.id}`,
        });
      } catch (err) {
        console.debug("Native share cancelled", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const isVideoPost = post.type === 'VIDEO' || post.type === 'REEL';
  const focusRing = "focus:outline-none focus-visible:ring-2 focus-visible:ring-ffn-primary focus-visible:ring-offset-2 transition-shadow";

  // Refined hover styles as per user request
  const hoverBtnStyles = {
    scale: 1.05,
    borderColor: '#f0f5f9',
    backgroundColor: 'rgba(240, 245, 249, 0.4)'
  };

  return (
    <>
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <linearGradient id="heart-pride-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E40303" />
            <stop offset="20%" stopColor="#FF8C00" />
            <stop offset="40%" stopColor="#FFED00" />
            <stop offset="60%" stopColor="#008026" />
            <stop offset="80%" stopColor="#24408E" />
            <stop offset="100%" stopColor="#732982" />
          </linearGradient>
        </defs>
      </svg>

      <motion.article
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-xl group border border-gray-100 transition-all hover:shadow-2xl mb-12 md:mb-24"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 md:p-7">
          <div className="flex items-center space-x-4 md:space-x-5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onSelectPost?.(post.id)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white p-[2px] bg-gradient-to-tr from-ffn-ig-purple via-ffn-ig-red to-ffn-ig-orange ${focusRing}`}
              aria-label={`View ${post.author.username}'s profile`}
            >
              <img src={post.author.avatarUrl} className="w-full h-full object-cover rounded-[0.8rem]" alt="" />
            </motion.button>
            <button
              className={`text-left rounded-lg p-1 -m-1 ${focusRing}`}
              onClick={() => onSelectPost?.(post.id)}
              aria-label={`View ${post.author.username}'s post`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-ffn-black">{post.author.username}</span>
                {post.author.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
              </div>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black mt-0.5">{post.author.role} &bull; {post.author.location}</p>
            </button>
          </div>
          <motion.button
            whileHover={hoverBtnStyles}
            className={`p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-ffn-black border border-transparent transition-all ${focusRing}`}
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5 md:w-6 md:h-6" />
          </motion.button>
        </div>

        {/* Visual Content Container */}
        <div
          className="aspect-[4/5] bg-gray-100 relative overflow-hidden cursor-pointer group/media"
          onMouseEnter={() => isVideoPost && setShowControls(true)}
          onMouseMove={isVideoPost ? handleMouseMove : undefined}
          onMouseLeave={() => isVideoPost && setShowControls(false)}
          onDoubleClick={handleLike}
          onClick={(e) => isVideoPost ? (window.matchMedia("(pointer: coarse)").matches ? setShowControls(!showControls) : togglePlay(e)) : onSelectPost?.(post.id)}
        >
          <AnimatePresence>
            {isMediaLoading && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-gray-200 animate-pulse" />}
          </AnimatePresence>

          {!isVideoPost ? (
            <motion.img
              src={post.mediaUrls[0]}
              onLoad={() => setIsMediaLoading(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: isMediaLoading ? 0 : 1 }}
              className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
              alt="Editorial content"
            />
          ) : (
            <div className="relative w-full h-full">
              <video ref={videoRef} src={post.mediaUrls[0]} onLoadedData={() => setIsMediaLoading(false)} onLoadedMetadata={handleLoadedMetadata} onTimeUpdate={handleTimeUpdate} loop muted={isMuted} playsInline className="w-full h-full object-cover" />

              <AnimatePresence>
                {(showControls || !isPlaying) && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/30 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
                    <div className="flex-1 flex items-center justify-center">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className={`p-8 md:p-12 rounded-full bg-white/10 backdrop-blur-3xl border border-white/20 text-white pointer-events-auto shadow-2xl ${focusRing}`}
                        onClick={togglePlay}
                        aria-label={isPlaying ? "Pause video" : "Play video"}
                      >
                        {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white ml-2" />}
                      </motion.button>
                    </div>
                    <motion.div className="glass-card-vibrant p-4 md:p-6 rounded-[2rem] border border-white/30 pointer-events-auto shadow-2xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <button onClick={togglePlay} className={`text-ffn-black hover:text-ffn-primary transition-all rounded p-1 ${focusRing}`} aria-label={isPlaying ? "Pause" : "Play"}>{isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}</button>
                          <span className="text-[10px] font-black tracking-tighter text-ffn-black uppercase">{formatTime(currentTime)} / {formatTime(duration)}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button onClick={toggleMute} className={`text-ffn-black hover:text-ffn-primary transition-all p-1 rounded ${focusRing}`} aria-label={isMuted ? "Unmute" : "Mute"}>{isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}</button>
                          <button className={`text-ffn-black hover:text-ffn-primary transition-all p-1 rounded ${focusRing}`} aria-label="Fullscreen"><Maximize className="w-5 h-5" /></button>
                        </div>
                      </div>
                      <div className="relative group/scrub h-4 flex items-center mt-4">
                        <div className="absolute inset-0 bg-ffn-black/5 rounded-full h-1.5 my-auto overflow-hidden">
                          <motion.div className="h-full bg-ffn-primary" style={{ width: `${progress}%` }} />
                        </div>
                        <input type="range" min="0" max="100" step="0.1" value={progress} onChange={handleScrub} className={`absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer opacity-0 z-10 ${focusRing}`} aria-label="Video progress" />
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          <AnimatePresence>
            {showHeart && (
              <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: [0.5, 1.2, 0.9, 1], opacity: [0, 1, 1, 0] }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Interaction Bar */}
        <div className="p-6 md:p-8 pt-5 md:pt-6 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 md:space-x-8">
              <motion.button
                whileHover={hoverBtnStyles}
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className={`group relative p-1.5 md:p-2 rounded-full transition-all border border-transparent ${focusRing}`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart style={{ fill: isLiked ? 'url(#heart-pride-grad)' : 'transparent', stroke: isLiked ? 'none' : 'currentColor' }} className={`w-7 h-7 md:w-8 md:h-8 transition-all ${isLiked ? '' : 'text-ffn-black group-hover:text-ffn-accent'}`} />
              </motion.button>

              <motion.button
                whileHover={hoverBtnStyles}
                onClick={() => onSelectPost?.(post.id)}
                className={`rounded-full p-1.5 md:p-2 border border-transparent transition-all ${focusRing}`}
                aria-label="Comment on post"
              >
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-ffn-black hover:text-ffn-primary transition-colors" />
              </motion.button>

              <motion.button
                whileHover={{ ...hoverBtnStyles, rotate: -15 }}
                onClick={() => setIsShareModalOpen(true)}
                className={`rounded-full p-1.5 md:p-2 border border-transparent transition-all ${focusRing}`}
                aria-label="Share post"
              >
                <Share2 className="w-7 h-7 md:w-8 md:h-8 text-ffn-black hover:text-ffn-primary transition-all" />
              </motion.button>
            </div>

            <motion.button
              whileHover={hoverBtnStyles}
              onClick={handleSave}
              className={`rounded-full p-1.5 md:p-2 border border-transparent transition-all ${focusRing}`}
              aria-label={isSaved ? "Unsave post" : "Save post"}
            >
              <Bookmark className={`w-7 h-7 md:w-8 md:h-8 transition-all ${isSaved ? 'text-ffn-primary fill-ffn-primary' : 'text-ffn-black hover:text-ffn-primary'}`} />
            </motion.button>
          </div>

          <div className="space-y-2 md:space-y-3">
            <p className="text-[10px] md:text-sm font-black uppercase tracking-widest text-ffn-black">{likes.toLocaleString()} Professionals</p>
            <div className="text-xs md:text-md text-gray-600 font-light leading-relaxed">
              <button
                className={`font-black text-ffn-black mr-3 uppercase text-[10px] md:text-xs tracking-widest cursor-pointer hover:text-ffn-primary transition-colors rounded p-0.5 -ml-0.5 ${focusRing}`}
                onClick={() => onSelectPost?.(post.id)}
                aria-label={`View profile of ${post.author.username}`}
              >
                {post.author.username}
              </button>
              {post.caption}
            </div>
            <div className="flex flex-wrap gap-2">
              {post.shootType && (
                <span className="bg-ffn-primary/5 text-ffn-primary text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-ffn-primary/10">
                  📸 {post.shootType}
                </span>
              )}
              {post.brandTag && (
                <span className="bg-ffn-black/5 text-ffn-black text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-black/5">
                  🏷️ {post.brandTag}
                </span>
              )}
              {post.photographerTag && (
                <span className="bg-gray-50 text-gray-400 text-[8px] md:text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-gray-100">
                  👁️ {post.photographerTag}
                </span>
              )}
              {post.tags.map(tag => (
                <button
                  key={tag}
                  className={`text-[9px] md:text-[10px] font-black uppercase tracking-widest text-ffn-primary/50 hover:text-ffn-primary transition-colors rounded px-1 -mx-1 ${focusRing}`}
                  aria-label={`View posts tagged with ${tag}`}
                >
                  #{tag}
                </button>
              ))}
            </div>
            <p className="text-[8px] md:text-[10px] uppercase tracking-widest text-gray-300 font-black pt-2 md:pt-4">{post.createdAt} &bull; Editorial Hub</p>
          </div>
        </div>
      </motion.article>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShareModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-white rounded-[3rem] md:rounded-[3.5rem] w-full max-w-md overflow-hidden relative shadow-2xl z-10 border border-white/20">
              <div className="p-8 md:p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif italic text-ffn-black">Share Content</h3>
                    <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 font-black">Professional Discovery Protocol</p>
                  </div>
                  <button
                    onClick={() => setIsShareModalOpen(false)}
                    className={`p-3 bg-gray-50 rounded-2xl transition-transform hover:rotate-90 ${focusRing}`}
                    aria-label="Close share modal"
                  >
                    <X className="w-5 h-5 text-ffn-black" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  {[
                    { icon: Link, label: 'Link', action: handleCopyLink, highlight: copied },
                    { icon: MessageSquare, label: 'WhatsApp', action: handleWhatsAppShare },
                    { icon: Twitter, label: 'X', action: handleTwitterShare },
                    { icon: Facebook, label: 'FB', action: handleFacebookShare },
                  ].map((option, i) => (
                    <button
                      key={i}
                      onClick={option.action}
                      className={`flex flex-col items-center space-y-2 group rounded-xl p-2 ${focusRing}`}
                      aria-label={`Share via ${option.label}`}
                    >
                      <div className={`w-14 h-14 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[1.8rem] flex items-center justify-center transition-all ${option.highlight ? 'bg-ffn-primary text-white shadow-xl' : 'bg-gray-50 text-gray-400 group-hover:bg-ffn-black group-hover:text-white'}`}>
                        {option.highlight ? <Check className="w-5 h-5" /> : <option.icon className="w-5 h-5 md:w-6 md:h-6" />}
                      </div>
                      <span className="text-[8px] uppercase tracking-widest font-black text-gray-400 group-hover:text-ffn-black transition-colors">{option.highlight ? 'Indexed' : option.label}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-center">
                  <button
                    onClick={handleNativeShare}
                    className={`text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary flex items-center space-x-2 rounded-lg p-2 ${focusRing}`}
                  >
                    <Send className="w-3 h-3" />
                    <span>More Options</span>
                  </button>
                </div>

                <AnimatePresence>
                  {copied && (
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-ffn-black text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Protocol Link Copied</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
