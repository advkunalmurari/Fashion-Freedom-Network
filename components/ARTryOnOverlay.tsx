import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Camera, X, Zap, ShieldCheck,
    RotateCcw, Sparkles, Smartphone,
    Info, CheckCircle2, AlertCircle
} from 'lucide-react';

interface ARTryOnOverlayProps {
    item: {
        id: string;
        title: string;
        imageUrl: string;
    };
    onClose: () => void;
}

export const ARTryOnOverlay: React.FC<ARTryOnOverlayProps> = ({ item, onClose }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isCalibrating, setIsCalibrating] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);
    const [confidence, setConfidence] = useState(0);

    useEffect(() => {
        // Simulate camera initialization
        const timer = setTimeout(() => {
            setIsInitialized(true);
            const calibrationTimer = setTimeout(() => {
                setIsCalibrating(false);
            }, 3000);
            return () => clearTimeout(calibrationTimer);
        }, 1500);

        // Simulate confidence score fluctuation
        const interval = setInterval(() => {
            setConfidence(Math.floor(Math.random() * 5) + 95);
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden">
            {/* AR Viewport */}
            <div className="relative flex-1 bg-gray-900 overflow-hidden">
                {/* Mock Camera Feed */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-10" />
                    {/* Simulation: A darkened, grainy placeholder for camera */}
                    <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center mix-blend-overlay opacity-80" />
                    <div className="absolute inset-0 backdrop-grayscale-[40%] backdrop-blur-[2px]" />
                </div>

                {/* Garment Overlay Simulation */}
                <AnimatePresence>
                    {!isCalibrating && isInitialized && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 z-20 flex items-center justify-center p-24"
                        >
                            <div className="relative w-full max-w-sm aspect-[3/4]">
                                {/* Visual Anchor Points */}
                                <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-ffn-primary" />
                                <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-ffn-primary" />
                                <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-ffn-primary" />
                                <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-ffn-primary" />

                                <img
                                    src={item.imageUrl}
                                    className="w-full h-full object-contain mix-blend-screen drop-shadow-[0_0_30px_rgba(139,92,246,0.3)]"
                                    alt="AR Overlay"
                                />

                                {/* Surface Analysis Grid */}
                                <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 opacity-10">
                                    {Array.from({ length: 24 }).map((_, i) => (
                                        <div key={i} className="border border-white/20" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* UI Controls */}
                <div className="absolute inset-0 z-30 pointer-events-none p-8 flex flex-col justify-between">
                    <div className="flex items-center justify-between pointer-events-auto">
                        <div className="flex items-center space-x-4">
                            <div className="p-3 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10">
                                <Smartphone className="w-5 h-5 text-white" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black uppercase tracking-widest text-white">AR Try-On Protocol</p>
                                <p className="text-[9px] font-bold text-ffn-primary uppercase tracking-widest">Active Session v1.0.4</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-4 bg-white/10 backdrop-blur-xl rounded-full text-white hover:bg-white/20 transition-all pointer-events-auto"
                            title="Close AR Preview"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col items-center space-y-8">
                        <AnimatePresence>
                            {isCalibrating ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="px-8 py-4 bg-ffn-black/80 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center space-x-4"
                                >
                                    <RotateCcw className="w-5 h-5 text-ffn-primary animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Calibrating Wardrobe Surface...</span>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center space-x-6"
                                >
                                    <div className="px-6 py-3 bg-ffn-primary rounded-xl flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-ffn-black" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-ffn-black">Tracking Optimized</span>
                                    </div>
                                    <div className="px-6 py-3 bg-white/10 backdrop-blur-xl rounded-xl border border-white/10">
                                        <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">Confidence: {confidence}%</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="w-full flex items-center justify-center space-x-8 pointer-events-auto pb-12">
                            <button className="p-6 bg-white/10 backdrop-blur-xl rounded-full text-white hover:scale-110 transition-all" title="Reset Camera">
                                <RotateCcw className="w-6 h-6" />
                            </button>
                            <button className="p-10 bg-white rounded-full text-ffn-black hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(255,255,255,0.3)]" title="Capture Frame">
                                <Camera className="w-8 h-8" />
                            </button>
                            <button className="p-6 bg-white/10 backdrop-blur-xl rounded-full text-white hover:scale-110 transition-all" title="Advanced Filter">
                                <Sparkles className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Information Panel */}
            <div className="bg-ffn-black p-8 pointer-events-auto">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="space-y-1">
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <div className="flex items-center space-x-2">
                            <ShieldCheck className="w-3 h-3 text-ffn-primary" />
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">AR-Verified Asset</span>
                        </div>
                    </div>
                    <button className="px-8 py-3 bg-ffn-primary text-ffn-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                        Confirm Selection
                    </button>
                </div>
            </div>
        </div>
    );
};
