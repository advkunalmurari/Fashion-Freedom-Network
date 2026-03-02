import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';

interface AntigravityMatchPulseProps {
    user: User;
    requirements: {
        role: UserRole;
        skills?: string[];
        location?: string;
    };
    compact?: boolean;
}

export const AntigravityMatchPulse: React.FC<AntigravityMatchPulseProps> = ({ user, requirements, compact = false }) => {
    // Simple heuristic matching logic for the demo
    const calculateMatch = () => {
        let score = 70; // Base score

        // Role match
        if (user.role === requirements.role) score += 15;

        // Skill overlap
        if (requirements.skills && user.skills) {
            const overlap = requirements.skills.filter(s => user.skills?.includes(s));
            score += (overlap.length / requirements.skills.length) * 10;
        }

        // Location match
        if (requirements.location && user.location && user.location.toLowerCase().includes(requirements.location.toLowerCase())) {
            score += 5;
        }

        return Math.min(99, score);
    };

    const matchScore = calculateMatch();

    if (compact) {
        return (
            <div className="flex items-center space-x-2 px-3 py-1.5 bg-ffn-primary/10 rounded-full border border-ffn-primary/20">
                <BrainCircuit className="w-3 h-3 text-ffn-primary animate-pulse" />
                <span className="text-[8px] font-black text-ffn-primary uppercase tracking-widest">{matchScore}% Match</span>
            </div>
        );
    }

    return (
        <div className="bg-ffn-black rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-primary/20 blur-[60px] pointer-events-none" />
            <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <BrainCircuit className="w-5 h-5 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Antigravity Intelligence</span>
                    </div>
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center space-x-2 text-emerald-400"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Optimized Fit</span>
                    </motion.div>
                </div>

                <div className="flex items-end justify-between">
                    <div className="space-y-1">
                        <h4 className="text-[9px] font-black uppercase tracking-widest text-gray-500">Compatibility Index</h4>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-5xl font-serif font-bold text-white tracking-tighter">{matchScore}%</span>
                            <span className="text-[10px] font-black text-ffn-primary uppercase tracking-widest">Protocol Sync</span>
                        </div>
                    </div>
                    <div className="flex space-x-1 items-end h-12">
                        {[40, 70, 55, 90, 100].map((h, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                animate={{ height: `${h}%` }}
                                transition={{ delay: i * 0.1, duration: 1 }}
                                className="w-1.5 bg-ffn-primary rounded-full opacity-40"
                            />
                        ))}
                    </div>
                </div>

                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${matchScore}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-ffn-primary to-white rounded-full shadow-[0_0_20px_rgba(var(--ffn-primary-rgb),0.5)]"
                    />
                </div>

                <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    Proprietary matching engine analyzing skill depth, role history, and brand synergy.
                </p>
            </div>
        </div>
    );
};
