import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Brain, Sparkles, Loader2,
    ChevronRight, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface RecommendedTalent {
    user_id: string;
    full_name: string;
    username: string;
    avatar_url: string;
    category: string;
    is_verified: boolean;
    ai_recommendation_reason: string;
    match_index: number;
    aesthetic_tags?: string[];
}

export const DiscoverySpotlight: React.FC = () => {
    const [recommendations, setRecommendations] = useState<RecommendedTalent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/ai/recommend-talent');
                const result = await response.json();
                if (result.success) {
                    setRecommendations(result.data.slice(0, 5));
                }
            } catch (err) {
                console.error('Spotlight Sync Error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center space-x-4 p-6 bg-white/5 rounded-3xl animate-pulse">
                <div className="w-12 h-12 bg-white/10 rounded-full" />
                <div className="flex-1 space-y-2">
                    <div className="h-2 w-24 bg-white/10 rounded" />
                    <div className="h-2 w-16 bg-white/5 rounded" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-ffn-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Live Match Nodes</span>
                </div>
                <button
                    onClick={() => navigate('/directory')}
                    className="flex items-center space-x-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 hover:bg-white/10 transition-all group"
                >
                    <span className="text-[8px] font-black text-ffn-primary uppercase tracking-widest">View All</span>
                    <ChevronRight className="w-3 h-3 text-ffn-primary group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="flex overflow-x-auto pb-4 gap-4 no-scrollbar -mx-2 px-2">
                {recommendations.map((talent, idx) => (
                    <motion.div
                        key={talent.user_id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-none w-[280px] md:w-64 bg-zinc-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-5 relative overflow-hidden group cursor-pointer"
                        onClick={() => navigate(`/profile/${talent.username}`)}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-ffn-primary/50 to-transparent" />

                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                                <img
                                    src={talent.avatar_url || `https://i.pravatar.cc/300?u=${talent.user_id}`}
                                    className="w-full h-full object-cover"
                                    alt={talent.full_name}
                                    loading="lazy"
                                    width="56"
                                    height="56"
                                />
                                {talent.is_verified && (
                                    <div className="absolute inset-0 border border-ffn-primary/30 rounded-2xl" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-white truncate">{talent.full_name || talent.username}</h4>
                                <p className="text-[9px] font-black text-ffn-primary uppercase tracking-widest">{talent.category}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-black text-white">{talent.match_index}%</p>
                                <Zap className="w-4 h-4 text-ffn-primary ml-auto" />
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                            {talent.aesthetic_tags?.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[8px] px-2.5 py-1 rounded-lg bg-white/5 text-white/50 border border-white/5 uppercase font-black tracking-tight">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between bg-white/[0.03] group-hover:bg-ffn-primary group-hover:text-white p-3 rounded-2xl transition-all duration-300">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-ffn-primary group-hover:text-white" />
                                <span className="text-[9px] font-black uppercase tracking-widest opacity-60">Identity Match</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
