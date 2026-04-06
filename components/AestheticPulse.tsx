import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Activity, Palette, Zap, Globe, Cpu } from 'lucide-react';
import { AestheticPulse as AestheticPulseType } from '../types';

interface AestheticPulseProps {
    data?: AestheticPulseType;
}

export const AestheticPulse: React.FC<AestheticPulseProps> = ({ data }) => {
    const pulseData: AestheticPulseType = data || {
        primaryAesthetic: 'NEO-NOIR',
        secondaryAesthetics: ['EDITORIAL', 'AVANT-GARDE', 'CYBER-PUNK'],
        colorPalette: ['#6366F1', '#EC4899', '#000000', '#FFFFFF'],
        visualSignature: 'High-contrast lighting with deep shadows and vibrant holographic accents. Strong symmetry and futuristic architectural influences.',
        compatibilityIndex: 94
    };

    return (
        <div className="bg-ffn-black/40 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 space-y-8 h-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-ffn-primary/10 rounded-2xl flex items-center justify-center border border-ffn-primary/20">
                        <Cpu className="w-6 h-6 text-ffn-primary" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic text-white leading-none">Aesthetic Pulse</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ffn-primary mt-1">Neural Identity Scan</p>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-serif italic text-white">{pulseData.compatibilityIndex}%</span>
                    <span className="text-[9px] font-black uppercase tracking-widest text-ffn-accent">Aesthetic Match</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Aesthetic Spectrum */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-4 h-4 text-ffn-primary" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Visual DNA</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-4 py-2 bg-ffn-primary text-[10px] font-black tracking-widest text-ffn-black rounded-lg">
                                {pulseData.primaryAesthetic}
                            </span>
                            {pulseData.secondaryAesthetics.map(tag => (
                                <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-black tracking-widest text-white/60 rounded-lg">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Palette className="w-4 h-4 text-ffn-accent" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Color Profile</span>
                        </div>
                        <div className="flex gap-3">
                            {pulseData.colorPalette.map((color, i) => (
                                <div
                                    key={i}
                                    className="w-10 h-10 rounded-full border border-white/20 shadow-xl"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: AI Analysis */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-4">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-ffn-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40">AI Visionary Summary</span>
                    </div>
                    <p className="text-sm text-white/80 leading-relaxed font-serif italic">
                        "{pulseData.visualSignature}"
                    </p>
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-green-400" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-green-400">Trend Alignment: High</span>
                        </div>
                        <Zap className="w-4 h-4 text-ffn-accent animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Probability Chart (Mock) */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-white/40">Market Relevance Index</span>
                    <span className="text-ffn-primary">Growth Momentum +12%</span>
                </div>
                <div className="h-4 bg-white/5 rounded-full overflow-hidden flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '65%' }}
                        className="h-full bg-gradient-to-r from-ffn-primary to-ffn-accent shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                    />
                    <div className="h-full bg-white/10 flex-1" />
                </div>
            </div>
        </div>
    );
};
