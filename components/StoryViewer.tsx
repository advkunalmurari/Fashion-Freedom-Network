import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Send, Heart, Share2, Sparkles } from 'lucide-react';
import { User, Story } from '../types';

interface StoryViewerProps {
  initialUserIndex: number;
  users: (User & { stories: Story[] })[];
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ initialUserIndex, users, onClose }) => {
  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentUser = users[userIndex];
  const stories = currentUser.stories || [];
  const currentStory = stories[storyIndex] || { media_url: currentUser.avatarUrl, story_tag: 'Identity Pulse' };

  // Swipe Gestures
  const dragX = useMotionValue(0);
  const backgroundX = useTransform(dragX, [-500, 500], ['-20%', '20%']);

  useEffect(() => {
    if (isPaused) return;

    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [userIndex, storyIndex, isPaused]);

  const handleNext = () => {
    if (storyIndex < stories.length - 1) {
      setStoryIndex(storyIndex + 1);
      setProgress(0);
    } else if (userIndex < users.length - 1) {
      setUserIndex(userIndex + 1);
      setStoryIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (storyIndex > 0) {
      setStoryIndex(storyIndex - 1);
      setProgress(0);
    } else if (userIndex > 0) {
      setUserIndex(userIndex - 1);
      setStoryIndex(users[userIndex - 1].stories.length - 1);
      setProgress(0);
    }
  };

  const handleDragEnd = (_: any, info: any) => {
    const threshold = 100;
    if (info.offset.x < -threshold) {
      // Swipe Left -> Next User
      if (userIndex < users.length - 1) {
        setUserIndex(userIndex + 1);
        setStoryIndex(0);
        setProgress(0);
      } else {
        onClose();
      }
    } else if (info.offset.x > threshold) {
      // Swipe Right -> Prev User
      if (userIndex > 0) {
        setUserIndex(userIndex - 1);
        setStoryIndex(0);
        setProgress(0);
      }
    }
    dragX.set(0);
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-[#050505] flex items-center justify-center overflow-hidden">
      {/* Background Ambient Glow */}
      <motion.div
        style={{ x: backgroundX }}
        className="absolute inset-0 z-0 opacity-20 blur-[100px]"
      >
        <img src={currentStory.media_url} className="w-full h-full object-cover scale-150" alt="" />
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        style={{ x: dragX }}
        onDragEnd={handleDragEnd}
        initial={{ y: 50, opacity: 0, scale: 0.9 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 100, opacity: 0, scale: 0.8 }}
        className="relative h-full w-full max-w-[500px] md:h-[90vh] md:rounded-[3.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] bg-black"
      >
        {/* Story Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${userIndex}-${storyIndex}`}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0 z-10"
          >
            <img
              src={currentStory.media_url}
              className="w-full h-full object-cover"
              alt="Story"
            />
            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />
          </motion.div>
        </AnimatePresence>

        {/* Top Progress Bars & User Info */}
        <div className="absolute top-0 left-0 right-0 z-30 p-6 md:p-8 pt-12 md:pt-10 space-y-6">
          <div className="flex space-x-1.5">
            {stories.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-md">
                <motion.div
                  className="h-full bg-ffn-primary transition-all duration-75 shadow-[0_0_10px_rgba(var(--ffn-primary-rgb),0.5)]"
                  style={{ width: i < storyIndex ? '100%' : (i === storyIndex ? `${progress}%` : '0%') }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-[1.2rem] p-[2px] bg-gradient-to-tr from-ffn-primary to-ffn-accent shadow-lg">
                <div className="w-full h-full rounded-[1.1rem] overflow-hidden border-2 border-black">
                  <img src={currentUser.avatarUrl} className="w-full h-full object-cover" alt="" />
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-sm font-black uppercase tracking-widest">{currentUser.username}</span>
                  <div className="w-1 h-1 rounded-full bg-white/40" />
                  <span className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">Verified Node</span>
                </div>
                {currentStory.story_tag && (
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Sparkles className="w-3 h-3 text-ffn-primary" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ffn-primary">{currentStory.story_tag}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button title="Options" className="p-3 text-white/40 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
              <button title="Close" onClick={onClose} className="p-3 text-white/40 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
            </div>
          </div>
        </div>

        {/* Tap Interaction Zones */}
        <div
          className="absolute inset-x-0 top-32 bottom-32 z-20 flex"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="w-1/3 h-full" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
          <div className="w-2/3 h-full" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
        </div>

        {/* Swipe Hint */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none flex items-center justify-between w-full px-12 opacity-0 hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-10 h-10 text-white/10" />
          <ChevronRight className="w-10 h-10 text-white/10" />
        </div>

        {/* Bottom Interaction Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pb-12 pt-16 px-6 md:px-8 bg-gradient-to-t from-black via-black/40 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative group">
              <input
                type="text"
                title="Direct Response"
                placeholder="Direct Response Protocol..."
                className="w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl py-5 px-6 text-white text-xs font-medium focus:outline-none focus:border-ffn-primary/50 transition-all placeholder:text-white/20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-3">
                <button title="Emoji Protocol" className="text-white/20 hover:text-ffn-primary transition-colors hover:scale-110">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                </button>
                <Send className="w-4 h-4 text-white/20 group-focus-within:text-ffn-primary transition-colors cursor-pointer" />
              </div>
            </div>
            <button title="Heart Protocol" className="p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white/20 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all group">
              <Heart className="w-5 h-5 group-hover:scale-110 group-active:scale-95" />
            </button>
            <button title="Broadcast Identity" className="p-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl text-white/20 hover:text-ffn-primary hover:border-ffn-primary/50 transition-all group">
              <Share2 className="w-5 h-5 group-hover:scale-110" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
