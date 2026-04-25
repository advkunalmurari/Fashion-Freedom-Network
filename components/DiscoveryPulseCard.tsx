
import React from 'react';
import { m } from 'framer-motion';
import { Activity, Globe, Zap, Users, ShieldCheck } from 'lucide-react';

export const DiscoveryPulseCard: React.FC = () => {
    const pulses = [
        { label: 'Active Recruitment Nodes', value: '4,821', trend: '+12%', icon: Users },
        { label: 'Global Identity Verification', value: '99.9%', trend: 'Secured', icon: ShieldCheck },
        { label: 'Market Liquidity Delta', value: '+$2.4M', trend: 'Flowing', icon: Zap },
    ];

    return (
        <m.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-black/90 rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-12 mb-12 md:mb-24 overflow-hidden relative border border-white/5 shadow-2xl"
        >
            {/* Decorative Pulse Ring */}
            <m.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full aspect-square bg-ffn-primary/20 rounded-full blur-[100px] pointer-events-none"
            />

            <div className="relative z-10 flex flex-col space-y-10">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-serif italic text-white">Discovery Pulse</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ffn-primary">Real-Time Platform Intelligence</p>
                    </div>
                    <div className="flex items-center space-x-3 px-4 py-2 bg-ffn-primary/10 rounded-full border border-ffn-primary/20">
                        <m.div
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                            className="w-2 h-2 bg-ffn-primary rounded-full shadow-[0_0_10px_#FFD700]"
                        />
                        <span className="text-[9px] font-black uppercase tracking-widest text-white">Live Node Analytics</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {pulses.map((pulse, i) => (
                        <m.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="space-y-4 group cursor-default"
                        >
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-ffn-primary group-hover:bg-ffn-primary group-hover:text-black transition-all">
                                    <pulse.icon className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-white transition-colors">{pulse.label}</span>
                            </div>
                            <div className="flex items-baseline space-x-4">
                                <span className="text-4xl font-serif italic text-white">{pulse.value}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-ffn-primary">{pulse.trend}</span>
                            </div>
                            <div className="w-full h-px bg-white/5 group-hover:bg-ffn-primary/20 transition-all" />
                        </m.div>
                    ))}
                </div>

                <div className="pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-4">
                        <Globe className="w-5 h-5 text-gray-500 animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">Synchronizing with Global Nodes: Milan, NYC, Tokyo, Paris</span>
                    </div>
                    <button className="text-[9px] font-black uppercase tracking-[0.3em] text-ffn-primary hover:underline underline-offset-8">
                        View Live Reputation Flow
                    </button>
                </div>
            </div>
        </m.div>
    );
};
