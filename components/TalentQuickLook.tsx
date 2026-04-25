import React from 'react';
import { m } from 'framer-motion';
import { X, MapPin, CheckCircle, ArrowRight, Star, ShieldCheck, Zap, Award } from 'lucide-react';
import { User } from '../types';

interface TalentQuickLookProps {
    talent: User;
    onClose: () => void;
    onViewFullProfile: (id: string) => void;
}

export const TalentQuickLook: React.FC<TalentQuickLookProps> = ({ talent, onClose, onViewFullProfile }) => {
    return (
        <m.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-full md:w-[450px] h-full bg-ffn-black/90 backdrop-blur-3xl z-[200] shadow-[-20px_0_100px_rgba(0,0,0,0.8)] overflow-hidden border-l border-white/10 text-white"
        >
            {/* Header / Cover */}
            <div className="h-64 relative">
                <img
                    className="w-full h-full object-cover grayscale opacity-50 contrast-125"
                    alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/20 to-transparent" />

                <button
                    title="Close Preview"
                    onClick={onClose}
                    className="absolute top-8 left-8 p-3 bg-white/20 backdrop-blur-xl border border-white/30 rounded-full text-white hover:bg-white hover:text-ffn-black transition-all"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content Container */}
            <div className="px-10 -mt-20 relative z-10 pb-12 overflow-y-auto h-[calc(100%-16rem)] no-scrollbar">
                <div className="space-y-8">
                    {/* Avatar & Basic Info */}
                    <div className="flex items-end space-x-6">
                        <div className="w-32 h-32 rounded-[2.5rem] border-4 border-ffn-black shadow-2xl overflow-hidden bg-white/5 relative group/avatar">
                            <img src={talent.avatarUrl} className="w-full h-full object-cover" alt={talent.displayName} />
                            <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/20 to-transparent opacity-0 group-hover/avatar:opacity-100 transition-opacity" />
                        </div>
                        <div className="pb-2">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-3xl font-serif italic text-white leading-none">{talent.displayName}</h3>
                                {talent.isVerified && <CheckCircle className="w-5 h-5 text-ffn-primary fill-ffn-primary/10" />}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mt-1">{talent.role} • {talent.location}</p>
                        </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-white/50 leading-relaxed font-light italic">
                        "{talent.bio}"
                    </p>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                            <div className="flex items-center space-x-2 text-ffn-primary mb-2">
                                <Award className="w-4 h-4" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Reliability</span>
                            </div>
                            <p className="text-2xl font-serif italic text-white">{talent.stats?.reliability || 98}%</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10">
                            <div className="flex items-center space-x-2 text-ffn-accent mb-2">
                                <Zap className="w-4 h-4" />
                                <span className="text-[8px] font-black uppercase tracking-widest">Global Rank</span>
                            </div>
                            <p className="text-2xl font-serif italic text-white">Top 1%</p>
                        </div>
                    </div>

                    {/* Capabilities */}
                    <div className="space-y-4">
                        <h4 className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300">Verified Capabilities</h4>
                        <div className="flex flex-wrap gap-2">
                            {['Editorial', 'Runway', 'High-Fashion', 'Commercial'].map(tag => (
                                <span key={tag} className="px-5 py-2 bg-ffn-primary/5 text-ffn-primary text-[8px] font-bold uppercase tracking-widest rounded-full border border-ffn-primary/10">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Collaboration Graph Preview */}
                    <div className="bg-ffn-black p-8 rounded-[3rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-primary/20 blur-3xl rounded-full" />
                        <div className="relative z-10 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-bold uppercase tracking-widest text-white/50">Marketplace Credibility</span>
                                <ShieldCheck className="w-4 h-4 text-ffn-accent" />
                            </div>
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-ffn-black overflow-hidden bg-gray-800">
                                        <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="" className="w-full h-full object-cover grayscale" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-ffn-black bg-white/10 backdrop-blur-md flex items-center justify-center text-[8px] font-bold">
                                    +12
                                </div>
                            </div>
                            <p className="text-[10px] text-white/70 italic">Recent collaborations with **Vogue**, **Gucci**, and **FFN Nodes**.</p>
                        </div>
                    </div>

                    {/* Full Action */}
                    <button
                        onClick={() => onViewFullProfile(talent.id)}
                        className="w-full py-6 bg-white text-ffn-black rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all flex items-center justify-center space-x-4"
                    >
                        <span>Examine Full Identity</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>

                    <p className="text-center text-[8px] text-gray-400 uppercase tracking-widest">Encrypted Identity • Verified via FFN Protocol v2.4</p>
                </div>
            </div>
        </m.div>
    );
};
