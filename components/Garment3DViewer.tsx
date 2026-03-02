import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Maximize2, RotateCcw, ZoomIn, ZoomOut, ShoppingBag, X, Info } from 'lucide-react';

interface Garment3DViewerProps {
    imageUrl: string; // Using a spritesheet or interactive sequence if no true 3D model
    fallbackImage?: string;
    productName: string;
    designerName: string;
    price: string;
    onClose?: () => void;
}

export const Garment3DViewer: React.FC<Garment3DViewerProps> = ({
    imageUrl,
    fallbackImage,
    productName,
    designerName,
    price,
    onClose
}) => {
    // We simulate 3D rotation using Framer Motion 3D transforms on a high-fidelity image
    // In a production environment, this would integrate @react-three/fiber and load a .glb/.gltf model.
    // Given the constraints, we will simulate the premium interactive feel using advanced CSS transforms.

    const containerRef = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);

    const [isHovered, setIsHovered] = useState(false);
    const [showInfo, setShowInfo] = useState(false);

    // Subtle automatic rotation when not interacting
    useEffect(() => {
        let controls: any;
        if (!isHovered) {
            controls = animate(x, [0, 10, -10, 0], {
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
            });
            animate(y, [0, 5, -5, 0], {
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
            });
        }
        return () => controls && controls.stop();
    }, [isHovered, x, y]);

    // Derived transform values to create a parallax/faux-3D effect based on drag/mouse position
    const rotateX = useTransform(y, [-200, 200], [25, -25]);
    const rotateY = useTransform(x, [-200, 200], [-35, 35]);
    const zIndex = useTransform(scale, [1, 2], [10, 50]);

    const handleReset = () => {
        animate(x, 0, { type: "spring", stiffness: 100, damping: 20 });
        animate(y, 0, { type: "spring", stiffness: 100, damping: 20 });
        animate(scale, 1, { type: "spring", stiffness: 100, damping: 20 });
    };

    const handleZoomIn = () => {
        animate(scale, Math.min(scale.get() + 0.5, 3), { type: "spring", stiffness: 200, damping: 25 });
    };

    const handleZoomOut = () => {
        animate(scale, Math.max(scale.get() - 0.5, 0.5), { type: "spring", stiffness: 200, damping: 25 });
    };

    return (
        <div className="fixed inset-0 z-[2000] bg-ffn-black/95 backdrop-blur-3xl flex items-center justify-center overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full h-full relative" ref={containerRef}>
                {/* Header Controls */}
                <header className="absolute top-0 left-0 right-0 p-8 flex justify-between items-start z-50">
                    <div>
                        <h2 className="text-3xl font-serif italic text-white mb-2 tracking-wide">{productName}</h2>
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 border border-white/10 inline-block px-4 py-2 rounded-full backdrop-blur-md">
                            {designerName}
                        </p>
                    </div>
                    <div className="flex space-x-4">
                        <button onClick={() => setShowInfo(!showInfo)} className="p-4 bg-white/10 hover:bg-white/20 transition-all rounded-full text-white backdrop-blur-md border border-white/5" title="Details">
                            <Info className="w-5 h-5" />
                        </button>
                        {onClose && (
                            <button onClick={onClose} className="p-4 bg-white/10 hover:bg-white/20 transition-all rounded-full text-white backdrop-blur-md border border-white/5" title="Close Viewer">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </header>

                {/* 3D Simulation Container */}
                <div
                    className="absolute inset-0 flex items-center justify-center perspective-[2000px] cursor-grab active:cursor-grabbing"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => {
                        setIsHovered(false);
                        handleReset();
                    }}
                >
                    <motion.div
                        style={{
                            rotateX,
                            rotateY,
                            scale,
                            x,
                            y,
                            zIndex
                        }}
                        drag
                        dragConstraints={containerRef}
                        dragElastic={0.2}
                        whileTap={{ cursor: "grabbing" }}
                        className="relative w-full max-w-[60vh] aspect-[3/4] preserve-3d"
                    >
                        {/* Shadow plane for depth */}
                        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[80%] h-12 bg-black/50 blur-[30px] rounded-[100%] pointer-events-none transform rotateX-75" />

                        {/* Main Garment representation */}
                        <div className="w-full h-full relative overflow-visible flex items-center justify-center">
                            {/* Inner framing to simulate a glass display case */}
                            <div className="absolute inset-[-10%] border border-white/5 rounded-[4rem] pointer-events-none opacity-50 transform translateZ(-100px)" />

                            <img
                                src={imageUrl || fallbackImage || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787&auto=format&fit=crop"}
                                alt={productName}
                                className="w-full h-full object-contain filter drop-shadow-2xl"
                                draggable={false}
                                style={{ transform: 'translateZ(50px)' }} // Pop out effect
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Controls & Interaction Hints */}
                <div className="absolute bottom-12 left-0 right-0 px-12 flex items-end justify-between z-50 pointer-events-none">
                    <div className="space-y-4 pointer-events-auto">
                        <div className="flex bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/5">
                            <button onClick={handleZoomOut} className="p-3 text-white hover:bg-white/20 rounded-xl transition-all" title="Zoom Out"><ZoomOut className="w-5 h-5" /></button>
                            <button onClick={handleReset} className="p-3 text-white hover:bg-white/20 rounded-xl transition-all" title="Reset View"><RotateCcw className="w-5 h-5" /></button>
                            <button onClick={handleZoomIn} className="p-3 text-white hover:bg-white/20 rounded-xl transition-all" title="Zoom In"><ZoomIn className="w-5 h-5" /></button>
                        </div>
                        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest text-center">Drag to Inspect</p>
                    </div>

                    <div className="flex items-center space-x-6 pointer-events-auto bg-black/40 p-4 pl-8 rounded-[2rem] border border-white/10 backdrop-blur-xl">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Price</p>
                            <p className="text-2xl font-serif italic text-white">{price}</p>
                        </div>
                        <button className="flex items-center space-x-3 bg-white text-ffn-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-gray-200 transition-all shadow-xl hover:scale-105 active:scale-95">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Acquire Asset</span>
                        </button>
                    </div>
                </div>

                {/* Details Side Panel overlay */}
                <AnimatePresence>
                    {showInfo && (
                        <motion.div
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            className="absolute top-0 right-0 bottom-0 w-96 bg-ffn-black/80 backdrop-blur-3xl border-l border-white/10 p-10 z-40 flex flex-col pt-32"
                        >
                            <h3 className="text-2xl font-serif italic text-white mb-8 border-b border-white/10 pb-4">Asset Properties</h3>

                            <div className="space-y-8 flex-1">
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Material Composition</p>
                                    <p className="text-sm text-gray-300 font-light leading-relaxed">100% Regenerated Silk Organza with structural bio-resin boning.</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Digital Provenance</p>
                                    <p className="text-sm border border-white/10 p-4 bg-white/5 rounded-xl text-emerald-400 font-mono text-[10px] break-all">
                                        0x71C...3A9B verified on Ethereum Mainnet
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-2">Physical Counterpart</p>
                                    <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs text-white uppercase tracking-widest font-bold">1 of 1 Available</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </div>
    );
};
