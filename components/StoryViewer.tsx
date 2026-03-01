
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Share2 to the lucide-react imports
import { X, ChevronLeft, ChevronRight, MoreHorizontal, Send, Heart, MessageCircle, Share2 } from 'lucide-react';
import { User } from '../types';

interface StoryViewerProps {
  user: User;
  onClose: () => void;
}

export const StoryViewer: React.FC<StoryViewerProps> = ({ user, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Mock story items for the selected user
  const stories = [
    { url: `https://picsum.photos/id/10/1080/1920`, type: 'IMAGE' },
    { url: `https://picsum.photos/id/20/1080/1920`, type: 'IMAGE' },
    { url: `https://picsum.photos/id/30/1080/1920`, type: 'IMAGE' },
  ];

  useEffect(() => {
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
  }, [currentIndex, onClose, stories.length]);

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

  return (
    <div className="fixed inset-0 z-[1000] bg-ffn-black flex items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 1.1, opacity: 0 }}
        className="relative h-full w-full max-w-[500px] md:h-[90vh] md:rounded-[3rem] overflow-hidden shadow-2xl bg-gray-900"
      >
        {/* Background Image with blur for ambient effect */}
        <div className="absolute inset-0 z-0">
          <img src={stories[currentIndex].url} className="w-full h-full object-cover blur-3xl opacity-30 scale-110" alt="" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Main Content */}
        <AnimatePresence mode="wait">
          <motion.img 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            src={stories[currentIndex].url} 
            className="relative z-10 w-full h-full object-cover" 
            alt="Fashion Story" 
          />
        </AnimatePresence>

        {/* Overlay Navigation Bars */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 space-y-6">
          <div className="flex space-x-2">
            {stories.map((_, i) => (
              <div key={i} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ 
                    width: i < currentIndex ? '100%' : (i === currentIndex ? `${progress}%` : '0%') 
                  }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl border-2 border-white overflow-hidden shadow-lg">
                <img src={user.avatarUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <p className="text-white text-[10px] font-black uppercase tracking-widest">{user.username}</p>
                <p className="text-white/60 text-[8px] uppercase tracking-widest font-bold">2h Ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white/60 hover:text-white"><MoreHorizontal className="w-5 h-5" /></button>
              <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-6 h-6" /></button>
            </div>
          </div>
        </div>

        {/* Interaction Areas */}
        <div className="absolute inset-0 z-15 flex">
          <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
          <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
        </div>

        {/* Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8 pt-20 bg-gradient-to-t from-black via-black/20 to-transparent">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Reply to story..." 
                className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-full py-4 px-6 text-white text-xs focus:ring-1 focus:ring-white transition-all placeholder:text-white/40"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
            <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-ffn-accent transition-all">
              <Heart className="w-5 h-5" />
            </button>
            <button className="p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Side Nav Arrows (Desktop Only) */}
        <button onClick={handlePrev} className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={handleNext} className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity">
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
