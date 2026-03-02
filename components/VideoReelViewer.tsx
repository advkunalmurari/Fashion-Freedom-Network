import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Play, Pause, Volume2, VolumeX, X, Heart, MessageCircle,
    Share2, Bookmark, UserPlus, Zap, MoreHorizontal, ShoppingBag
} from 'lucide-react';
import { Post } from '../types';

interface VideoReelViewerProps {
    reels: Post[];
    initialIndex?: number;
    onClose: () => void;
    onHireClick?: (talentId: string) => void;
}

export const VideoReelViewer: React.FC<VideoReelViewerProps> = ({
    reels,
    initialIndex = 0,
    onClose,
    onHireClick
}) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [showInteractionFeedback, setShowInteractionFeedback] = useState<'like' | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const currentReel = reels[currentIndex];

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(err => {
                console.log("Autoplay blocked:", err);
                setIsPlaying(false);
            });
        }
    }, [currentIndex]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) videoRef.current.pause();
            else videoRef.current.play();
            setIsPlaying(!isPlaying);
        }
    };

    const handleDoubleTap = () => {
        setShowInteractionFeedback('like');
        setTimeout(() => setShowInteractionFeedback(null), 1000);
    };

    const handleNext = () => {
        if (currentIndex < reels.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-black flex items-center justify-center overflow-hidden">
            {/* Background Blur */}
            <div className="absolute inset-0 opacity-20 blur-3xl scale-150">
                <img src={currentReel.thumbnailUrl || currentReel.author.avatarUrl} className="w-full h-full object-cover" alt="" />
            </div>

            <div className="relative w-full max-w-[450px] aspect-[9/16] bg-ffn-black shadow-2xl overflow-hidden md:rounded-[3rem] border border-white/10 group">
                <video
                    ref={videoRef}
                    src={currentReel.mediaUrls[0]}
                    className="w-full h-full object-cover"
                    loop
                    muted={isMuted}
                    playsInline
                    onClick={togglePlay}
                    onDoubleClick={handleDoubleTap}
                />

                {/* Overlays */}
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/40" />

                {/* Header Controls */}
                <div className="absolute top-8 left-8 right-8 flex justify-between items-center z-20">
                    <button
                        title="Close"
                        onClick={onClose}
                        className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all pointer-events-auto"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex space-x-3 pointer-events-auto">
                        <button
                            title={isMuted ? "Unmute" : "Mute"}
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button title="More options" className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Play/Pause Large Indicator */}
                <AnimatePresence>
                    {!isPlaying && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                        >
                            <div className="p-8 bg-black/20 backdrop-blur-3xl rounded-full border border-white/20">
                                <Play className="w-12 h-12 text-white fill-current" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Interaction Feedback (Like Heart) */}
                <AnimatePresence>
                    {showInteractionFeedback === 'like' && (
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1.5, opacity: 1 }}
                            exit={{ scale: 2, opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-30"
                        >
                            <Heart className="w-24 h-24 text-ffn-primary fill-current" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sidebar Actions */}
                <div className="absolute right-6 bottom-32 flex flex-col space-y-8 z-20 pointer-events-auto">
                    <div className="flex flex-col items-center space-y-2">
                        <button title="Like" className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:scale-110 active:scale-90 transition-all">
                            <Heart className={`w-6 h-6 ${currentReel.isLiked ? 'text-ffn-primary fill-current' : ''}`} />
                        </button>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{currentReel.likes}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <button title="Comment" className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:scale-110 transition-all">
                            <MessageCircle className="w-6 h-6" />
                        </button>
                        <span className="text-[9px] font-black text-white uppercase tracking-widest">{currentReel.comments}</span>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                        <button title="Save" className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:scale-110 transition-all">
                            <Bookmark className="w-6 h-6" />
                        </button>
                    </div>
                    <button title="Share" className="p-4 bg-white/10 backdrop-blur-md rounded-full text-white hover:scale-110 transition-all">
                        <Share2 className="w-6 h-6" />
                    </button>
                </div>

                {/* Bottom Info & Hiring */}
                <div className="absolute bottom-8 left-8 right-8 space-y-6 z-20 pointer-events-auto">
                    {/* Progress Bar */}
                    <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: isPlaying ? '100%' : '0%' }}
                            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                            className="h-full bg-ffn-primary"
                        />
                    </div>

                    <div className="flex items-end justify-between gap-6">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
                                    <img src={currentReel.author.avatarUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div>
                                    <p className="text-sm font-serif italic font-bold text-white flex items-center">
                                        {currentReel.author.displayName}
                                        {currentReel.author.isVerified && <Zap className="w-3 h-3 ml-2 text-ffn-primary fill-current" />}
                                    </p>
                                    <p className="text-[9px] text-white/60 font-black uppercase tracking-widest">{currentReel.author.role}</p>
                                </div>
                                <button className="px-4 py-1.5 bg-ffn-primary text-white text-[8px] font-black uppercase tracking-widest rounded-full hover:scale-105 transition-all">Follow</button>
                            </div>
                            <p className="text-[11px] text-white/90 leading-relaxed font-medium line-clamp-2">
                                {currentReel.caption}
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {currentReel.tags.map(tag => (
                                    <span key={tag} className="text-[8px] px-2 py-1 bg-white/10 border border-white/10 text-white font-black uppercase tracking-widest rounded-md">#{tag}</span>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => onHireClick?.(currentReel.authorId)}
                            className="flex flex-col items-center justify-center space-y-2 p-5 bg-ffn-primary text-white rounded-[2rem] shadow-[0_20px_40px_rgba(255,51,102,0.4)] hover:scale-110 active:scale-95 transition-all"
                        >
                            <ShoppingBag className="w-6 h-6" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Hire</span>
                        </button>
                    </div>
                </div>

                {/* Navigation Hotspots */}
                <div className="absolute inset-y-0 left-0 w-16 z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); handlePrev(); }} />
                <div className="absolute inset-y-0 right-0 w-16 z-10 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleNext(); }} />
            </div>
        </div>
    );
};
