import React, { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  CheckCircle, Sparkles, X, Link, Twitter, Facebook, Copy,
  Check, Send, Volume2, VolumeX, Zap, MessageSquare, ShieldCheck
} from 'lucide-react';
import { Post } from '../types';
import { postService } from '../services/postService';
import { NarrativeStack } from './NarrativeStack';
import { optimizeUnsplashUrl } from '../utils/mediaUtils';

const HELLO_GRADIENT = (
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
);

const HEART_SVG = (
  <Heart className="w-32 h-32 text-white fill-white drop-shadow-[0_0_30px_rgba(255,255,255,0.6)]" />
);

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const controlsTimeoutRef = useRef<number | null>(null);

  const handleLike = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikes(prev => newLikedState ? prev + 1 : prev - 1);
    if (newLikedState) {
      setShowHeart(true);
      setTimeout(() => setShowHeart(false), 800);
    }
    const res = await postService.toggleLike(post.id);
    if (!res.success) {
      setIsLiked(!newLikedState);
      setLikes(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);
    const res = await postService.toggleSave(post.id);
    if (!res.success) {
      setIsSaved(!newSavedState);
    }
  };

  const togglePlay = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    }
  };

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

  const hoverBtnStyles = {
    scale: 1.05,
    borderColor: '#f0f5f9',
    backgroundColor: 'rgba(240, 245, 249, 0.4)'
  };

  return (
    <>
      {HELLO_GRADIENT}

      <m.article
        initial={{ opacity: 0, y: 100, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8,
          delay: index * 0.05
        }}
        className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-xl group border border-gray-100 transition-all hover:shadow-2xl hover:-translate-y-2 mb-12 md:mb-24"
      >
        <div className="flex items-center justify-between p-5 md:p-7">
          <div className="flex items-center space-x-4 md:space-x-5">
            <m.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onSelectPost?.(post.id)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white p-[2px] bg-gradient-to-tr from-ffn-ig-purple via-ffn-ig-red to-ffn-ig-orange ${focusRing}`}
              aria-label={`View ${post.author.username}'s profile`}
            >
              <img
                src={optimizeUnsplashUrl(post.author.avatarUrl, 112)}
                className="w-full h-full object-cover rounded-[0.8rem]"
                alt=""
                loading="lazy"
                width="56"
                height="56"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/demo/ffn_logo_placeholder.png';
                }}
              />
            </m.button>
            <button
              className={`text-left rounded-lg p-1 -m-1 ${focusRing}`}
              onClick={() => onSelectPost?.(post.id)}
              aria-label={`View ${post.author.username}'s post`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.2em] text-ffn-black">{post.author.username}</span>
                {post.author.isVerified && (
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                    {post.author.trustScore && (
                      <span className="text-[8px] font-black text-blue-500/60">{post.author.trustScore}</span>
                    )}
                  </div>
                )}
                {post.likes > 1000 && (
                  <m.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center space-x-1 px-2 py-0.5 bg-ffn-primary/10 rounded-full border border-ffn-primary/20"
                  >
                    <Zap className="w-2.5 h-2.5 text-ffn-primary" />
                    <span className="text-[7px] font-black text-ffn-primary uppercase tracking-tighter">Gravity</span>
                  </m.div>
                )}
              </div>
              <p className="text-[8px] md:text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black mt-0.5">{post.author.role} &bull; {post.author.location}</p>
            </button>
          </div>
          <m.button
            whileHover={hoverBtnStyles}
            className={`p-3 bg-gray-50 rounded-2xl text-gray-400 hover:text-ffn-black border border-transparent transition-all ${focusRing}`}
            aria-label="Post options"
          >
            <MoreHorizontal className="w-5 h-5 md:w-6 md:h-6" />
          </m.button>
        </div>

        <div
          className="aspect-[4/5] bg-gray-100 relative overflow-hidden cursor-pointer group/media"
          onDoubleClick={handleLike}
          onClick={(e) => isVideoPost ? (window.matchMedia("(pointer: coarse)").matches ? setShowControls(!showControls) : togglePlay(e)) : onSelectPost?.(post.id)}
        >
          <AnimatePresence>
            {isMediaLoading && <m.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-10 bg-gray-200 animate-pulse" />}
          </AnimatePresence>

          {!isVideoPost ? (
            post.mediaUrls.length > 1 ? (
              <NarrativeStack
                mediaUrls={post.mediaUrls}
                type="IMAGE"
                onLoad={() => setIsMediaLoading(false)}
              />
            ) : (
              <m.img
                src={optimizeUnsplashUrl(post.mediaUrls[0], 800)}
                onLoad={() => setIsMediaLoading(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: isMediaLoading ? 0 : 1 }}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
                width="800"
                height="1000"
                className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-105"
                alt="Editorial content"
              />
            )
          ) : (
            post.mediaUrls.length > 1 ? (
              <NarrativeStack
                mediaUrls={post.mediaUrls}
                type={post.type}
                onLoad={() => setIsMediaLoading(false)}
              />
            ) : (
              <div className="relative w-full h-full">
                <video ref={videoRef} src={post.mediaUrls[0]} onLoadedData={() => setIsMediaLoading(false)} loop muted={isMuted} playsInline preload="metadata" className="w-full h-full object-cover" />
              </div>
            )
          )}

          <AnimatePresence>
            {showHeart && (
              <m.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: [0.5, 1.4, 0.9, 1.1, 1], opacity: [0, 1, 1, 1, 0] }} className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
                <div className="relative">
                  {HEART_SVG}
                  <m.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                    className="absolute inset-0 bg-white rounded-full blur-2xl"
                  />
                </div>
              </m.div>
            )}
          </AnimatePresence>

          <div className="absolute top-6 left-6 flex flex-col space-y-3 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <m.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2 bg-black/60 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10"
            >
              <Sparkles className="w-3 h-3 text-ffn-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white">Identity Match 94%</span>
            </m.div>
            <m.div
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="flex items-center space-x-2 bg-ffn-primary/80 backdrop-blur-xl px-4 py-2 rounded-xl border border-white/10"
            >
              <ShieldCheck className="w-3 h-3 text-black" />
              <span className="text-[8px] font-black uppercase tracking-widest text-black">Verified Media Kit Internal</span>
            </m.div>
          </div>
        </div>

        <div className="p-6 md:p-8 pt-5 md:pt-6 space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 md:space-x-8">
              <m.button
                whileHover={hoverBtnStyles}
                whileTap={{ scale: 0.8 }}
                onClick={handleLike}
                className={`group relative p-1.5 md:p-2 rounded-full transition-all border border-transparent ${focusRing}`}
                aria-label={isLiked ? "Unlike post" : "Like post"}
              >
                <Heart style={{ fill: isLiked ? 'url(#heart-pride-grad)' : 'transparent', stroke: isLiked ? 'none' : 'currentColor' }} className={`w-7 h-7 md:w-8 md:h-8 transition-all ${isLiked ? '' : 'text-ffn-black group-hover:text-ffn-accent'}`} />
              </m.button>

              <m.button
                whileHover={hoverBtnStyles}
                onClick={() => onSelectPost?.(post.id)}
                className={`rounded-full p-1.5 md:p-2 border border-transparent transition-all ${focusRing}`}
                aria-label="Comment on post"
              >
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8 text-ffn-black hover:text-ffn-primary transition-colors" />
              </m.button>

              <m.button
                whileHover={{ ...hoverBtnStyles, rotate: -15 }}
                onClick={() => setIsShareModalOpen(true)}
                className={`rounded-full p-1.5 md:p-2 border border-transparent transition-all ${focusRing}`}
                aria-label="Share post"
              >
                <Share2 className="w-7 h-7 md:w-8 md:h-8 text-ffn-black hover:text-ffn-primary transition-all" />
              </m.button>
            </div>

            <m.button
              whileHover={hoverBtnStyles}
              onClick={handleSave}
              className={`rounded-full p-1.5 md:p-2 border border-transparent transition-all ${focusRing}`}
              aria-label={isSaved ? "Unsave post" : "Save post"}
            >
              <Bookmark className={`w-7 h-7 md:w-8 md:h-8 transition-all ${isSaved ? 'text-ffn-primary fill-ffn-primary' : 'text-ffn-black hover:text-ffn-primary'}`} />
            </m.button>
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

        <AnimatePresence>
          {showHeart && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <m.div
                  key={i}
                  initial={{ opacity: 1, scale: 0, x: '50%', y: '50%' }}
                  animate={{
                    opacity: 0,
                    scale: [0, 1.5, 2],
                    x: `${50 + (Math.cos(i * 60 * Math.PI / 180) * 40)}%`,
                    y: `${50 + (Math.sin(i * 60 * Math.PI / 180) * 40)}%`
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="absolute w-4 h-4 text-ffn-primary"
                >
                  <Sparkles className="w-full h-full fill-current" />
                </m.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </m.article>

      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsShareModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
            <m.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="bg-white rounded-[3rem] md:rounded-[3.5rem] w-full max-w-md overflow-hidden relative shadow-2xl z-10 border border-white/20">
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
                    <m.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-ffn-black text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-2xl flex items-center space-x-3">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                      <span>Protocol Link Copied</span>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
