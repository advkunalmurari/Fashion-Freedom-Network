
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Star, MapPin, Briefcase, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface TalentInjectionCardProps {
    talent: User;
}

export const TalentInjectionCard: React.FC<TalentInjectionCardProps> = ({ talent }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 mb-12 md:mb-24 shadow-xl border border-gray-100 group relative overflow-hidden"
        >
            {/* Subtle Background Pattern */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/5 rounded-full blur-[60px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="flex flex-col md:flex-row items-center md:items-stretch gap-10">
                <div className="relative flex-none">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <img src={talent.avatarUrl} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-ffn-black rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
                        <Star className="w-6 h-6 text-ffn-primary fill-ffn-primary" />
                    </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-1">
                        <div className="flex items-center justify-center md:justify-start space-x-3">
                            <h3 className="text-2xl md:text-3xl font-serif italic text-ffn-black">{talent.username}</h3>
                            <span className="px-2 py-0.5 bg-ffn-primary/10 text-ffn-primary text-[8px] font-black uppercase tracking-widest rounded-full border border-ffn-primary/20">Verified Identity</span>
                        </div>
                        <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-gray-400">Trending Professional discovery</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Category</span>
                            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                                <Briefcase className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">{talent.role}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Location</span>
                            <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-600">
                                <MapPin className="w-3 h-3" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">{talent.location}</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Identity Reach</span>
                            <span className="text-[10px] block font-bold uppercase tracking-tight text-ffn-primary">124k Global Nodes</span>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-300">Reliability</span>
                            <span className="text-[10px] block font-bold uppercase tracking-tight text-ffn-black">9.8 Mastery</span>
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col md:flex-row items-center gap-4">
                        <button className="w-full md:w-auto px-10 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-4 hover:bg-ffn-primary transition-all group/btn shadow-xl shadow-black/10">
                            <UserPlus className="w-4 h-4" />
                            <span>Network with Identity</span>
                            <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                        <button className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-ffn-black transition-colors px-6">
                            View Professional Protocol
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
