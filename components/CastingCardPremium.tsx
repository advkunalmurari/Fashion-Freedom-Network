import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, DollarSign, ArrowRight, Building2, Zap, BrainCircuit, Star, Play } from 'lucide-react';
import { UserRole } from '../types';
import { AntigravityMatchPulse } from './AntigravityMatchPulse';

interface CastingItem {
    id: string;
    title: string;
    brand: string;
    location: string;
    budget: string;
    deadline: string;
    type: string;
    description: string;
    requirements: string[];
}

interface CastingCardPremiumProps {
    job: CastingItem;
    user: any;
    onClick: () => void;
    onApply: (e: React.MouseEvent) => void;
    index: number;
}

export const CastingCardPremium: React.FC<CastingCardPremiumProps> = ({ job, user, onClick, onApply, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={onClick}
            className="group bg-white rounded-[3.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all hover:border-ffn-primary/20 cursor-pointer relative"
        >
            {/* Visual Overlay for High-Fashion Feel */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/5 blur-[100px] pointer-events-none group-hover:bg-ffn-primary/10 transition-all duration-500" />

            <div className="p-10 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
                <div className="flex items-center space-x-10 w-full lg:w-3/5">
                    <div className="relative flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-50 rounded-[2.5rem] flex items-center justify-center text-gray-300 group-hover:bg-ffn-black group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-2xl group-hover:-rotate-3">
                            <Building2 className="w-10 h-10" />
                        </div>
                        {job.type === 'High Priority' && (
                            <div className="absolute -top-3 -right-3 p-2 bg-ffn-accent rounded-xl shadow-lg animate-bounce">
                                <Star className="w-4 h-4 text-white fill-white" />
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-ffn-primary">{job.brand}</span>
                            <div className="w-1 h-1 rounded-full bg-gray-200" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-400">{job.type}</span>
                        </div>
                        <h3 className="text-3xl md:text-4xl font-serif italic text-ffn-black leading-tight tracking-tight group-hover:text-ffn-primary transition-colors">
                            {job.title}
                        </h3>
                        <div className="flex flex-wrap gap-4 pt-2">
                            <div className="flex items-center space-x-2 text-gray-400 px-4 py-2 bg-gray-50 rounded-full">
                                <MapPin className="w-3.5 h-3.5" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-ffn-black px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
                                <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{job.budget}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6 w-full lg:w-2/5 justify-end">
                    {/* Real-time Match Intelligence */}
                    <AntigravityMatchPulse
                        user={user}
                        requirements={{ role: UserRole.MODEL, location: job.location }}
                        compact
                    />

                    <div className="flex space-x-3 w-full md:w-auto">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onApply}
                            className="flex-1 md:flex-none px-10 py-5 bg-ffn-black text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-xl hover:bg-ffn-primary transition-all group/btn"
                        >
                            <Zap className="w-4 h-4 text-ffn-accent group-hover/btn:text-white transition-colors" />
                            <span>Express Apply</span>
                        </motion.button>
                        <button title="View Visual Brief" className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center text-ffn-black hover:bg-ffn-black hover:text-white transition-all">
                            <Play className="w-5 h-5 fill-current" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Hover Background Hint */}
            <div className="absolute inset-0 bg-gradient-to-r from-ffn-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        </motion.div>
    );
};
