import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, Eye, Sparkles, CheckCircle, BarChart3, Scan, Shield, AlertTriangle, Layers, Maximize2 } from 'lucide-react';

export const PortfolioAuditEngine: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [auditComplete, setAuditComplete] = useState(false);

    const metrics = [
        { label: 'Aesthetic Cohesion', score: 92, status: 'Elite' },
        { label: 'Visual Consistency', score: 88, status: 'Strong' },
        { label: 'Commercial Viability', score: 76, status: 'Optimal' },
        { label: 'Asset Composition', score: 95, status: 'Elite' },
    ];

    const startScan = () => {
        setIsScanning(true);
        setAuditComplete(false);
        setScanProgress(0);
    };

    useEffect(() => {
        if (isScanning) {
            const interval = setInterval(() => {
                setScanProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setIsScanning(false);
                        setAuditComplete(true);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 50);
            return () => clearInterval(interval);
        }
    }, [isScanning]);

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Information */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-0.5 bg-ffn-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">AI Portfolio Audit Engine</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight">Aesthetic <br /> Analysis Hub</h1>
                    </div>
                    <div className="max-w-xs text-right hidden md:block">
                        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Analyzing visual data streams for professional consistency and global market readiness.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Panel: Metrics & Score */}
                    <div className="space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6">
                                <Shield className="w-6 h-6 text-ffn-primary/20" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">Overall Trust Score</h3>
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <svg className="w-48 h-48 transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            className="text-white/5"
                                        />
                                        <m.circle
                                            cx="96"
                                            cy="96"
                                            r="88"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="transparent"
                                            strokeDasharray={552.92}
                                            initial={{ strokeDashoffset: 552.92 }}
                                            animate={{ strokeDashoffset: auditComplete ? 552.92 * (1 - 0.82) : 552.92 }}
                                            transition={{ duration: 2, ease: "easeOut" }}
                                            className="text-ffn-primary"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="text-6xl font-serif italic text-white">{auditComplete ? '82' : '--'}</span>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-ffn-primary">Rank: A+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Neural Signatures</h3>
                            <div className="space-y-4">
                                {metrics.map((metric, i) => (
                                    <div key={i} className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-white/60 tracking-wider uppercase">{metric.label}</span>
                                            <span className="text-[10px] font-black text-ffn-primary uppercase tracking-widest">{metric.status}</span>
                                        </div>
                                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                            <m.div
                                                className="h-full bg-ffn-primary"
                                                initial={{ width: 0 }}
                                                animate={{ width: auditComplete ? `${metric.score}%` : 0 }}
                                                transition={{ duration: 1.5, delay: i * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Scanner Simulation */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-4 relative overflow-hidden aspect-video group">
                            {/* Scanning Grid Overlay */}
                            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none opacity-20">
                                {Array.from({ length: 72 }).map((_, i) => (
                                    <div key={i} className="border-[0.5px] border-white/10" />
                                ))}
                            </div>

                            {/* Scanning Beam */}
                            {isScanning && (
                                <m.div
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ffn-primary to-transparent z-20 shadow-[0_0_20px_rgba(255,215,0,0.5)]"
                                    animate={{ top: ['0%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                />
                            )}

                            {/* Media content simulation */}
                            <div className="w-full h-full rounded-2xl overflow-hidden bg-white/2 bg-[url('https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000')] bg-cover bg-center grayscale group-hover:grayscale-0 transition-all duration-1000">
                                <div className="w-full h-full bg-black/60 flex items-center justify-center flex-col space-y-6 relative overflow-hidden">
                                    <AnimatePresence mode="wait">
                                        {!isScanning && !auditComplete && (
                                            <m.button
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                onClick={startScan}
                                                className="group/btn relative px-8 py-4 bg-ffn-primary rounded-full overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-white group-hover/btn:translate-x-full transition-transform duration-500" />
                                                <span className="relative text-[11px] font-black uppercase tracking-[0.4em] text-black">Initiate High-Res Scan</span>
                                            </m.button>
                                        )}

                                        {isScanning && (
                                            <m.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center space-y-4"
                                            >
                                                <Scan className="w-12 h-12 text-ffn-primary mx-auto animate-pulse" />
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Neural Synchronization</p>
                                                    <p className="text-gray-500 text-[8px] font-bold tracking-widest uppercase">Depth Analysis: Frame {Math.floor(scanProgress * 2.4)}</p>
                                                </div>
                                            </m.div>
                                        )}

                                        {auditComplete && (
                                            <m.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-center space-y-6"
                                            >
                                                <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20">
                                                    <CheckCircle className="w-12 h-12 text-green-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className="text-2xl font-serif italic text-white">Visual Authenticity Verified</h4>
                                                    <p className="text-gray-500 text-[9px] font-black uppercase tracking-widest">Global Protocol Standards Met</p>
                                                </div>
                                            </m.div>
                                        )}
                                    </AnimatePresence>

                                    {/* HUD Elements */}
                                    <div className="absolute top-8 left-8 space-y-2">
                                        <div className="flex items-center space-x-2 text-white/40">
                                            <Layers className="w-3 h-3" />
                                            <span className="text-[7px] font-black uppercase tracking-[0.3em]">Latent Space Analysis</span>
                                        </div>
                                        <div className="w-24 h-0.5 bg-white/5 overflow-hidden">
                                            <m.div className="h-full bg-white/20" animate={{ x: ['-100%', '100%'] }} transition={{ duration: 1, repeat: Infinity }} />
                                        </div>
                                    </div>
                                    <div className="absolute bottom-8 right-8 text-right underline underline-offset-8 decoration-ffn-primary/30">
                                        <span className="text-[7px] font-black uppercase tracking-[0.6em] text-white/20 italic">FFN DeepScan v2.1</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Info / Action */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4">
                                <div className="flex items-center space-x-3 text-ffn-primary">
                                    <Sparkles className="w-4 h-4" />
                                    <h4 className="text-[10px] font-black uppercase tracking-widest">AI Suggested Enhancements</h4>
                                </div>
                                <p className="text-[11px] text-gray-500 leading-relaxed font-serif italic">
                                    "Your palette consistency is elite, but increasing high-key editorial content could boost your discoverability by 12.4%."
                                </p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center space-y-4">
                                <button className="w-full py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center space-x-3">
                                    <Maximize2 className="w-4 h-4" />
                                    <span>Expand Detailed Report</span>
                                </button>
                                <button className="w-full py-4 bg-ffn-primary text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:scale-[1.02] transition-transform">
                                    Sync Metadata to Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
