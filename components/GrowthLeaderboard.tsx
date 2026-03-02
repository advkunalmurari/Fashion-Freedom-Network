import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, User, ArrowUpRight, Zap } from 'lucide-react';
import { MOCK_TALENT_POOL } from '../constants';

export const GrowthLeaderboard: React.FC = () => {
    // Mock growth velocity data
    const risingTalent = MOCK_TALENT_POOL.slice(0, 5).map(t => ({
        ...t,
        velocity: Math.floor(Math.random() * 40) + 60, // 60-100%
        trending: Math.random() > 0.3
    })).sort((a, b) => b.velocity - a.velocity);

    return (
        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-8 backdrop-blur-xl">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-xl font-serif italic text-white">Rising Nodes.</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Highest Growth Velocity (24h)</p>
                </div>
                <div className="p-3 bg-ffn-primary/10 rounded-2xl">
                    <TrendingUp className="w-6 h-6 text-ffn-primary" />
                </div>
            </div>

            <div className="space-y-4">
                {risingTalent.map((talent, idx) => (
                    <motion.div
                        key={talent.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-ffn-primary/20 hover:bg-white/10 transition-all group cursor-pointer"
                    >
                        <div className="flex items-center space-x-4">
                            <span className="text-xs font-serif italic text-white/20 w-4">0{idx + 1}</span>
                            <div className="relative">
                                <img
                                    src={talent.avatarUrl}
                                    alt={talent.username}
                                    className="w-10 h-10 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all"
                                />
                                {talent.trending && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-ffn-primary rounded-full flex items-center justify-center border-2 border-black">
                                        <Zap className="w-2 h-2 text-black" />
                                    </div>
                                )}
                            </div>
                            <div className="text-left">
                                <h4 className="text-sm font-bold text-white group-hover:text-ffn-primary transition-colors">{talent.username}</h4>
                                <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">{talent.role}</p>
                            </div>
                        </div>

                        <div className="text-right flex items-center space-x-4">
                            <div className="space-y-1">
                                <div className="flex items-center space-x-1 justify-end">
                                    <ArrowUpRight className="w-3 h-3 text-ffn-primary" />
                                    <span className="text-xs font-bold text-ffn-primary">+{talent.velocity}%</span>
                                </div>
                                <p className="text-[6px] font-black uppercase tracking-widest text-gray-600">Sync Rate</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <button className="w-full py-4 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:border-white/20 transition-all">
                View Global Leaderboard
            </button>
        </div>
    );
};
