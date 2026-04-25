import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Send, Video, Mic, CheckCircle, Sparkles, BrainCircuit, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { AntigravityMatchPulse } from './AntigravityMatchPulse';

interface InterviewApplicationFlowProps {
    isOpen: boolean;
    onClose: () => void;
    casting: any;
    user: any;
}

export const InterviewApplicationFlow: React.FC<InterviewApplicationFlowProps> = ({ isOpen, onClose, casting, user }) => {
    const [step, setStep] = useState(1);
    const [pitch, setPitch] = useState('');
    const [isDeploying, setIsDeploying] = useState(false);

    const handleNext = () => setStep(s => s + 1);

    const handleDeploy = () => {
        setIsDeploying(true);
        setTimeout(() => {
            setIsDeploying(false);
            setStep(4);
        }, 2500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-ffn-black/90 backdrop-blur-2xl">
                    <m.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-white w-full max-w-4xl rounded-[4rem] overflow-hidden relative shadow-3xl flex flex-col max-h-[90vh]"
                    >
                        <button
                            title="Abort Protocol"
                            onClick={onClose}
                            className="absolute top-10 right-10 z-50 p-4 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="flex-1 overflow-y-auto no-scrollbar p-16 lg:p-24">
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <m.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-4 text-ffn-primary">
                                                <BrainCircuit className="w-8 h-8 animate-pulse" />
                                                <span className="text-[12px] font-black uppercase tracking-[0.5em]">Antigravity Match Sync</span>
                                            </div>
                                            <h2 className="text-6xl font-serif italic text-ffn-black leading-none">Identity Verification</h2>
                                            <p className="text-xl text-gray-400 font-light italic leading-relaxed">
                                                Our intelligence engine has verified a <span className="text-ffn-black font-bold">98% Strategic Synergy</span> between your professional archive and this casting brief.
                                            </p>
                                        </div>

                                        <AntigravityMatchPulse user={user} requirements={{ role: casting.role, location: casting.location }} />

                                        <div className="pt-10">
                                            <button
                                                onClick={handleNext}
                                                className="w-full py-8 bg-ffn-black text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary transition-all flex items-center justify-center space-x-4"
                                            >
                                                <span>Initiate Application Protocol</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </m.div>
                                )}

                                {step === 2 && (
                                    <m.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-4 text-ffn-accent">
                                                <Video className="w-8 h-8" />
                                                <span className="text-[12px] font-black uppercase tracking-[0.5em]">Pitch Archive Deployment</span>
                                            </div>
                                            <h2 className="text-6xl font-serif italic text-ffn-black leading-none">Identity Pitch</h2>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Written Vision</label>
                                                <textarea
                                                    value={pitch}
                                                    onChange={(e) => setPitch(e.target.value)}
                                                    placeholder="How does your professional mastery align with this creative direction?"
                                                    className="w-full h-80 bg-gray-50 border-none rounded-[3rem] p-10 text-base focus:ring-2 focus:ring-ffn-primary/20 transition-all resize-none shadow-inner"
                                                />
                                            </div>
                                            <div className="space-y-6">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Oral Protocol (Voice / Video)</label>
                                                <div className="aspect-[3/4] bg-ffn-black rounded-[3rem] flex flex-col items-center justify-center p-12 text-center relative overflow-hidden group">
                                                    <div className="absolute inset-0 bg-gradient-to-t from-ffn-primary/20 to-transparent" />
                                                    <div className="relative z-10 space-y-4">
                                                        <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 group-hover:scale-110 transition-transform cursor-pointer">
                                                            <Mic className="w-8 h-8" />
                                                        </div>
                                                        <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-60">Deploy Voice Identity</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex space-x-6">
                                            <button onClick={() => setStep(1)} className="px-12 py-8 bg-gray-100 rounded-[2.5rem] text-[10px] font-black uppercase tracking-widest text-gray-400">Go Back</button>
                                            <button
                                                onClick={handleNext}
                                                className="flex-1 py-8 bg-ffn-black text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary transition-all flex items-center justify-center space-x-4"
                                            >
                                                <span>Final Review Protocol</span>
                                                <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </m.div>
                                )}

                                {step === 3 && (
                                    <m.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="space-y-12"
                                    >
                                        <div className="space-y-10 text-center">
                                            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/20 text-emerald-500">
                                                <ShieldCheck className="w-12 h-12" />
                                            </div>
                                            <h2 className="text-6xl font-serif italic text-ffn-black leading-none">Final Authorization</h2>
                                            <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto italic">
                                                Your application is locked and verified through the FFN Secure Protocol. By deploying, you authorize the immediate transfer of your professional identity to the Brand Node.
                                            </p>
                                        </div>

                                        <div className="bg-gray-50 rounded-[3rem] p-12 border border-gray-100 space-y-6">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-400">
                                                <span>Project Brief</span>
                                                <span className="text-ffn-black underline">#{casting.id.slice(0, 8)}</span>
                                            </div>
                                            <p className="text-3xl font-serif font-bold text-ffn-black">{casting.title}</p>
                                            <div className="h-px bg-gray-200" />
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Platform Escrow</span>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 active:text-emerald-500">Active protection</span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleDeploy}
                                            disabled={isDeploying}
                                            className="w-full py-10 bg-ffn-primary text-white rounded-[3rem] text-[12px] font-black uppercase tracking-[0.6em] shadow-3xl hover:bg-ffn-black transition-all flex items-center justify-center space-x-6 group"
                                        >
                                            {isDeploying ? (
                                                <>
                                                    <Loader2 className="w-6 h-6 animate-spin" />
                                                    <span>Synchronizing Nodes...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                                                    <span>Deploy Master Application</span>
                                                </>
                                            )}
                                        </button>
                                    </m.div>
                                )}

                                {step === 4 && (
                                    <m.div
                                        key="step4"
                                        initial={{ scale: 0.9, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="space-y-12 text-center py-10"
                                    >
                                        <div className="relative inline-block">
                                            <m.div
                                                animate={{ scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }}
                                                transition={{ duration: 4, repeat: Infinity }}
                                                className="w-40 h-40 bg-ffn-primary rounded-full flex items-center justify-center text-white shadow-3xl"
                                            >
                                                <CheckCircle className="w-20 h-20" />
                                            </m.div>
                                            <m.div
                                                animate={{ opacity: [0, 1, 0], scale: [1, 1.5, 2] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                                className="absolute inset-0 bg-ffn-primary rounded-full opacity-0"
                                            />
                                        </div>

                                        <div className="space-y-6">
                                            <h2 className="text-7xl font-serif italic text-ffn-black leading-none">Protocol Success</h2>
                                            <p className="text-2xl text-gray-400 font-light max-w-2xl mx-auto italic leading-relaxed">
                                                Your professional identity is now in the <span className="text-ffn-black font-bold">Brand's Strategic Feed</span>. You will be notified via the Hive Protocol upon approval.
                                            </p>
                                        </div>

                                        <button
                                            onClick={onClose}
                                            className="px-16 py-8 bg-ffn-black text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-xl hover:bg-ffn-primary transition-all flex items-center justify-center space-x-4 mx-auto"
                                        >
                                            <Sparkles className="w-4 h-4 text-ffn-accent" />
                                            <span>Return to Marketplace</span>
                                        </button>
                                    </m.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </m.div>
                </div>
            )}
        </AnimatePresence>
    );
};
