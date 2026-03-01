import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Send, Heart, Share2 } from 'lucide-react';
import { Story } from './StoriesRail';

interface StoryViewerProps {
  initialIndex: number;
  stories: Story[];
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ initialIndex, stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const duration = 5000; // 5 seconds per story
    const interval = 50; // Update every 50ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, onClose, stories.length]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-[1000] bg-ffn-black flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="relative h-full w-full max-w-[500px] md:h-[90vh] md:rounded-[3rem] overflow-hidden shadow-2xl bg-[#0A0A0A]"
      >
        {/* Background Blur */}
        <div className="absolute inset-0 z-0">
          <img src={currentStory.media_url} className="w-full h-full object-cover blur-3xl opacity-30 scale-110" alt="" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={currentStory.media_url}
            className="relative z-10 w-full h-full object-contain"
            alt="Story"
          />
        </AnimatePresence>

        {/* Overlay Navigation Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4 pt-10 md:pt-6 space-y-4 bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex space-x-1 px-1">
            {stories.map((_, i) => (
              <div key={i} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: i < currentIndex ? '100%' : (i === currentIndex ? `${progress}%` : '0%') }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden shadow-lg">
                <img src={currentStory.user.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-white text-xs font-bold truncate">{currentStory.user.name.split(' ')[0]}</span>
                  <span className="text-white/60 text-[10px]">2h</span>
                </div>
                {/* Professional Tags (FFN Differntiator) */}
                {currentStory.story_tag && currentStory.story_tag !== 'None' && (
                  <span className="text-[8px] bg-ffn-primary/80 backdrop-blur border border-ffn-primary px-2 py-0.5 rounded-sm text-white uppercase tracking-widest mt-0.5 inline-block w-max">
                    {currentStory.story_tag}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-white/80 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
              <button onClick={onClose} className="p-2 text-white/80 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
          </div>
        </div>

        {/* Interaction Areas (Tap left/right, Hold to pause) */}
        <div
          className="absolute inset-x-0 top-24 bottom-24 z-15 flex"
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          <div className="w-1/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
          <div className="w-2/3 h-full cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 pb-safe pb-6 pt-12 px-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Send message..."
                className="w-full bg-black/40 backdrop-blur-xl border border-white/20 rounded-full py-3.5 px-5 text-white text-sm focus:outline-none focus:border-white/50 transition-all placeholder:text-white/60"
              />
            </div>
            <button className="p-3.5 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white hover:bg-white/10 transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-3.5 bg-black/40 backdrop-blur-xl border border-white/20 rounded-full text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Desktop Side Nav Arrows */}
        <button onClick={handlePrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={handleNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
