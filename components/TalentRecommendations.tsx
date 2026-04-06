import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Zap, Star, ShieldCheck, MapPin,
    ArrowRight, Brain, Sparkles, Loader2,
    Users, Info, CheckCircle
} from 'lucide-react';
import { BookingProtocolDrawer } from './BookingProtocolDrawer';

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
    match_breakdown?: {
        aesthetic: number;
        reliability: number;
        engagement: number;
    };
}

export const TalentRecommendations: React.FC = () => {
    const [recommendations, setRecommendations] = useState<RecommendedTalent[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTalentForBooking, setSelectedTalentForBooking] = useState<RecommendedTalent | null>(null);
    const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/ai/recommend-talent');
                const result = await response.json();

                if (result.success) {
                    setRecommendations(result.data);
                } else {
                    setError('Unable to fetch recommendations');
                }
            } catch (err) {
                setError('Network error syncing with AI gateway');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleOpenBooking = (talent: RecommendedTalent) => {
        setSelectedTalentForBooking(talent);
        setIsBookingDrawerOpen(true);
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 min-h-[300px]">
                <Loader2 className="w-8 h-8 text-ffn-primary animate-spin mb-4" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Syncing with FFN Intelligence Engine...</p>
            </div>
        );
    }

    if (error || recommendations.length === 0) {
        return (
            <div className="p-12 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 text-center">
                <Brain className="w-8 h-8 text-white/20 mx-auto mb-4" />
                <p className="text-white/60 font-serif italic text-xl">No active matches found.</p>
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 mt-2">Check availability protocols</p>
            </div>
        );
    }

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Brain className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em]">AI Match Spotlight</span>
                    </div>
                    <h3 className="text-3xl font-serif italic text-white font-bold">Top Verified Talent</h3>
                </div>
                <button className="flex items-center space-x-2 text-[9px] font-black uppercase tracking-[0.3em] text-ffn-primary hover:text-ffn-accent transition-colors">
                    <span>Initialize Full Scan</span>
                    <ArrowRight className="w-3 h-3" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.slice(0, 4).map((talent, idx) => (
                    <motion.div
                        key={talent.user_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 p-6 group hover:bg-white/10 hover:border-ffn-primary/30 transition-all cursor-pointer relative overflow-hidden flex flex-col"
                    >
                        {/* Match Index Badge with Tooltip Trigger */}
                        <div className="absolute top-4 right-4 z-20 group/match">
                            <div className="bg-ffn-black/60 backdrop-blur-md border border-ffn-primary/30 px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-xl hover:bg-ffn-primary transition-colors">
                                <Zap className="w-3 h-3 text-ffn-primary group-hover/match:text-white fill-current" />
                                <span className="text-[9px] font-black text-white">{talent.match_index}%</span>
                            </div>

                            {/* Breakdown Tooltip */}
                            {talent.match_breakdown && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-ffn-black/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl opacity-0 group-hover/match:opacity-100 pointer-events-none transition-opacity z-50 shadow-2xl">
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-3">AI Match Breakdown</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'Aesthetic', val: talent.match_breakdown.aesthetic },
                                            { label: 'Reliability', val: talent.match_breakdown.reliability },
                                            { label: 'Engagement', val: talent.match_breakdown.engagement }
                                        ].map(m => (
                                            <div key={m.label} className="space-y-1">
                                                <div className="flex justify-between text-[7px] font-bold uppercase text-white/60">
                                                    <span>{m.label}</span>
                                                    <span>{m.val}%</span>
                                                </div>
                                                <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${m.val}%` }}
                                                        className="h-full bg-ffn-primary"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Avatar */}
                        <div className="relative mb-6">
                            <div className="w-full aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 relative">
                                <img
                                    src={talent.avatar_url || `https://i.pravatar.cc/300?u=${talent.user_id}`}
                                    alt={talent.full_name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/80 to-transparent opacity-60"></div>
                            </div>

                            {talent.is_verified && (
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-ffn-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.5)] border-2 border-ffn-black">
                                    <ShieldCheck className="w-4 h-4 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="space-y-3 flex-1 flex flex-col">
                            <div className="flex-1 space-y-2">
                                <h4 className="text-xl font-serif italic text-white font-bold truncate group-hover:text-ffn-primary transition-colors">
                                    {talent.full_name || `@${talent.username}`}
                                </h4>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{talent.category}</p>

                                {/* Aesthetic Tags */}
                                <div className="flex flex-wrap gap-1.5 py-2">
                                    {talent.aesthetic_tags?.map(tag => (
                                        <span key={tag} className="text-[7px] font-black uppercase tracking-tighter bg-white/5 border border-white/5 px-2 py-1 rounded-md text-white/30 group-hover:text-white/60 group-hover:border-white/10 transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-start space-x-2 bg-ffn-primary/10 border border-ffn-primary/20 px-3 py-2 rounded-xl">
                                    <Sparkles className="w-3 h-3 text-ffn-primary mt-0.5 shrink-0" />
                                    <p className="text-[8px] font-bold text-ffn-primary/80 uppercase tracking-widest leading-tight">
                                        {talent.ai_recommendation_reason}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4">
                                <button className="flex-1 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-[8px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all">
                                    Profile
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleOpenBooking(talent); }}
                                    className="flex-[2] py-3 bg-white text-ffn-black rounded-xl text-[8px] font-black uppercase tracking-[0.3em] hover:bg-ffn-primary hover:text-white transition-all shadow-lg group-hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center space-x-2"
                                >
                                    <Zap className="w-3 h-3" />
                                    <span>Execute Booking</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Booking Protocol Drawer */}
            <BookingProtocolDrawer
                isOpen={isBookingDrawerOpen}
                onClose={() => setIsBookingDrawerOpen(false)}
                user={selectedTalentForBooking ? {
                    id: selectedTalentForBooking.user_id,
                    displayName: selectedTalentForBooking.full_name || selectedTalentForBooking.username,
                    avatarUrl: selectedTalentForBooking.avatar_url,
                    role: selectedTalentForBooking.category
                } as any : {} as any}
            />
        </section>
    );
};
