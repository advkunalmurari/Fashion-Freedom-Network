
import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NarrativeStackProps {
    mediaUrls: string[];
    type: 'IMAGE' | 'VIDEO' | 'REEL';
    onLoad?: () => void;
}

export const NarrativeStack: React.FC<NarrativeStackProps> = ({ mediaUrls, type, onLoad }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % mediaUrls.length);
    };

    const handlePrev = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + mediaUrls.length) % mediaUrls.length);
    };

    const isVideo = type === 'VIDEO' || type === 'REEL';

    return (
        <div className="relative w-full h-full group/narrative overflow-hidden">
            <AnimatePresence mode="wait">
                <m.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-full"
                >
                    {isVideo ? (
                        <video
                            src={mediaUrls[currentIndex]}
                            className="w-full h-full object-cover"
                            autoPlay
                            muted
                            loop
                            playsInline
                            onLoadedData={onLoad}
                        />
                    ) : (
                        <img
                            src={mediaUrls[currentIndex]}
                            className="w-full h-full object-cover transition-transform duration-[2s] hover:scale-105"
                            alt={`Narrative element ${currentIndex + 1}`}
                            onLoad={onLoad}
                        />
                    )}
                </m.div>
            </AnimatePresence>

            {/* Progress Bars */}
            <div className="absolute top-6 inset-x-6 flex space-x-2 z-20">
                {mediaUrls.map((_, idx) => (
                    <div key={idx} className="h-0.5 flex-1 bg-white/20 rounded-full overflow-hidden">
                        <m.div
                            initial={false}
                            animate={{ width: idx <= currentIndex ? '100%' : '0%' }}
                            className="h-full bg-ffn-primary"
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Controls */}
            <div className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-start pl-4 opacity-0 group-hover/narrative:opacity-100 transition-opacity z-30">
                <button
                    onClick={handlePrev}
                    title="Previous Media"
                    className="p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-ffn-primary hover:text-black transition-all"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>
            <div className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-end pr-4 opacity-0 group-hover/narrative:opacity-100 transition-opacity z-30">
                <button
                    onClick={handleNext}
                    title="Next Media"
                    className="p-3 rounded-full bg-black/20 backdrop-blur-xl border border-white/10 text-white hover:bg-ffn-primary hover:text-black transition-all"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
