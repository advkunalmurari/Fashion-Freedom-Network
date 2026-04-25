import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Shield, FileCheck, Search, CheckCircle, Upload, ArrowRight, Camera, Globe, Award, Sparkles, Building, AlertCircle } from 'lucide-react';

type VerificationStage = 'identity' | 'professional' | 'audit' | 'status';

export const VerificationNode: React.FC = () => {
    const [stage, setStage] = useState<VerificationStage>('identity');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const stages = [
        { id: 'identity', label: 'Identity', icon: Shield },
        { id: 'professional', label: 'Professional', icon: Building },
        { id: 'audit', label: 'Portfolio Audit', icon: Search },
        { id: 'status', label: 'Sync Status', icon: CheckCircle },
    ];

    const nextStage = () => {
        if (stage === 'identity') setStage('professional');
        else if (stage === 'professional') setStage('audit');
        else if (stage === 'audit') setStage('status');
    };

    const handleUpload = () => {
        setUploading(true);
        let p = 0;
        const interval = setInterval(() => {
            p += 10;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setUploading(false);
                nextStage();
            }
        }, 300);
    };

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Information */}
                <div className="mb-12 space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-0.5 bg-ffn-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">Professional Verification Protocol</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight">Identity & Authority<br />Synchronization</h1>
                    <p className="text-gray-500 max-w-xl text-sm leading-relaxed">
                        Secure your professional status within the FFN Neural Core. Our identity verification uses biometric cross-referencing and AI-driven portfolio audits.
                    </p>
                </div>

                {/* Progress Schematic */}
                <div className="mb-16 grid grid-cols-4 gap-4">
                    {stages.map((s, idx) => {
                        const Icon = s.icon;
                        const isActive = s.id === stage;
                        const isCompleted = stages.findIndex(val => val.id === stage) > idx;

                        return (
                            <div key={s.id} className="relative">
                                <div className={`p-6 rounded-2xl border transition-all duration-500 ${isActive ? 'bg-ffn-primary/10 border-ffn-primary shadow-[0_0_20px_rgba(255,215,0,0.1)]' : isCompleted ? 'bg-green-500/5 border-green-500/30' : 'bg-white/5 border-white/5'}`}>
                                    <Icon className={`w-5 h-5 mb-4 ${isActive ? 'text-ffn-primary' : isCompleted ? 'text-green-500' : 'text-gray-600'}`} />
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-gray-600'}`}>{s.label}</span>
                                </div>
                                {idx < stages.length - 1 && (
                                    <div className="absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                                        <ArrowRight className="w-4 h-4 text-white/10" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Interaction Node */}
                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-ffn-primary/20 to-purple-500/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                    <div className="relative bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-12 overflow-hidden">

                        <AnimatePresence mode="wait">
                            {stage === 'identity' && (
                                <m.div
                                    key="identity"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-serif italic text-white">Identity Node Binding</h2>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Upload an official government ID (Passport, Aadhaar, or Driver's License) to synchronize your legal identity with your FFN node.
                                            </p>
                                            <div className="space-y-4">
                                                <div className="flex items-start space-x-3">
                                                    <CheckCircle className="w-4 h-4 text-ffn-primary mt-1" />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Encrypted Storage (AES-256)</span>
                                                </div>
                                                <div className="flex items-start space-x-3">
                                                    <CheckCircle className="w-4 h-4 text-ffn-primary mt-1" />
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider text-left">Auto-deletion after verification</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-12 hover:border-ffn-primary/30 transition-colors bg-white/5 group/upload cursor-pointer" onClick={handleUpload}>
                                            {uploading ? (
                                                <div className="w-full space-y-4">
                                                    <div className="flex justify-between text-[10px] font-black text-ffn-primary uppercase tracking-[0.2em]">
                                                        <span>Processing Node...</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                                        <m.div
                                                            className="h-full bg-ffn-primary"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="p-4 rounded-full bg-ffn-primary/10 mb-4 group-hover/upload:scale-110 transition-transform">
                                                        <Upload className="w-8 h-8 text-ffn-primary" />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Upload Document</span>
                                                    <span className="text-[9px] font-bold text-gray-500 mt-2">JPG, PNG or PDF (Max 10MB)</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </m.div>
                            )}

                            {stage === 'professional' && (
                                <m.div
                                    key="professional"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-8"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-6">
                                            <h2 className="text-3xl font-serif italic text-white">Authority Verification</h2>
                                            <p className="text-gray-400 text-sm leading-relaxed">
                                                Prove your industry standing by providing links to published work, agency contracts, or official website nodes.
                                            </p>
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    placeholder="AGENCY WEBSITE OR INSTAGRAM"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:border-ffn-primary focus:outline-none"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="PUBLICATION LINK (VOGUE, BAZAAR, ETC)"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white focus:border-ffn-primary focus:outline-none"
                                                />
                                            </div>
                                        </div>

                                        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6">
                                            <div className="flex items-center space-x-3">
                                                <Award className="w-5 h-5 text-ffn-primary" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Verification Status</span>
                                            </div>
                                            <p className="text-[11px] text-gray-400 leading-relaxed font-serif">
                                                Our team will manually audit these links within 24-48 hours. Providing high-authority publications increases your trust score significantly.
                                            </p>
                                            <button
                                                className="w-full py-4 bg-ffn-primary text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:scale-[1.02] transition-transform"
                                                onClick={nextStage}
                                            >
                                                Submit for Audit
                                            </button>
                                        </div>
                                    </div>
                                </m.div>
                            )}

                            {stage === 'audit' && (
                                <m.div
                                    key="audit"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="text-center space-y-8 py-12"
                                >
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-ffn-primary/20 blur-3xl animate-pulse rounded-full" />
                                        <Search className="w-20 h-20 text-ffn-primary relative animate-bounce" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-serif italic text-white mb-4">Neural Portfolio Audit</h2>
                                        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                                            Our AI engine is currently analyzing your visual portfolio for consistency, aesthetic quality, and authenticity.
                                        </p>
                                    </div>
                                    <div className="max-w-xs mx-auto space-y-4">
                                        {[
                                            { label: 'Aesthetic Consistency', val: 88 },
                                            { label: 'Asset Originality', val: 94 },
                                            { label: 'Industry Relevance', val: 76 }
                                        ].map(stat => (
                                            <div key={stat.label} className="space-y-2">
                                                <div className="flex justify-between text-[8px] font-black uppercase tracking-wider text-gray-500">
                                                    <span>{stat.label}</span>
                                                    <span className="text-ffn-primary">{stat.val}%</span>
                                                </div>
                                                <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                    <m.div
                                                        className="h-full bg-ffn-primary"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${stat.val}%` }}
                                                        transition={{ duration: 2, delay: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="py-4 px-12 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:border-ffn-primary/30 transition-all"
                                        onClick={nextStage}
                                    >
                                        Complete Audit
                                    </button>
                                </m.div>
                            )}

                            {stage === 'status' && (
                                <m.div
                                    key="status"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-8 py-12"
                                >
                                    <div className="relative inline-block">
                                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full" />
                                        <CheckCircle className="w-20 h-20 text-green-500 relative" />
                                    </div>
                                    <div>
                                        <h2 className="text-4xl font-serif italic text-white mb-4">Verification Pending</h2>
                                        <p className="text-gray-400 text-sm max-w-md mx-auto leading-relaxed">
                                            Your Identity & Professional Authority nodes have been submitted. Final verification will be completed shortly.
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-4">
                                        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                                            <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Expected Time</span>
                                            <span className="text-xl font-serif italic text-white">24 Hours</span>
                                        </div>
                                        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                                            <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Trust Score</span>
                                            <span className="text-xl font-serif italic text-ffn-primary">82/100</span>
                                        </div>
                                    </div>
                                    <div className="bg-ffn-primary/5 border border-ffn-primary/20 rounded-2xl p-6 max-w-md mx-auto flex items-start space-x-4">
                                        <AlertCircle className="w-5 h-5 text-ffn-primary mt-1 shrink-0" />
                                        <p className="text-[11px] text-gray-400 text-left leading-relaxed">
                                            While pending, you can still apply for castings, but verified nodes receive priority placement in the discovery graph.
                                        </p>
                                    </div>
                                </m.div>
                            )}
                        </AnimatePresence>

                    </div>
                </div>

                {/* Footer Intelligence */}
                <div className="mt-12 flex items-center justify-between px-6">
                    <div className="flex items-center space-x-8">
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-3 h-3 text-ffn-primary" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Premium Verification active</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Globe className="w-3 h-3 text-blue-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Global Node Presence</span>
                        </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-[0.4em] text-ffn-primary/20">FFN Neural Protocol v4.6</span>
                </div>
            </div>
        </div>
    );
};
