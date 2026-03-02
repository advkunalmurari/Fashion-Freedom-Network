
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface EditorialFeedFeatureProps {
    title: string;
    subtitle: string;
    description: string;
    imageAlt?: string;
    ctaText?: string;
    onCtaClick?: () => void;
}

export const EditorialFeedFeature: React.FC<EditorialFeedFeatureProps> = ({
    title,
    subtitle,
    description,
    imageAlt = "Editorial Feature",
    ctaText = "Explore Protocol",
    onCtaClick
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="relative w-full aspect-[16/10] md:aspect-[16/7] rounded-[3rem] md:rounded-[4rem] overflow-hidden group shadow-2xl mb-12 md:mb-24 border border-white/10"
        >
            {/* Background with animated gradient and grain */}
            <div className="absolute inset-0 bg-[#0A0A0A]">
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-50 contrast-150" />
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full bg-ffn-primary/20 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        rotate: [0, -45, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: 2 }}
                    className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-ffn-accent/10 blur-[100px] rounded-full"
                />
            </div>

            {/* Decorative Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)]" />

            {/* Content */}
            <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
                <div className="max-w-2xl space-y-4 md:space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-black bg-gray-800 flex items-center justify-center overflow-hidden">
                                    <div className="w-full h-full bg-ffn-steel/20 flex items-center justify-center">
                                        <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-ffn-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary/80 drop-shadow-sm">
                            Global Identity Feature
                        </span>
                    </motion.div>

                    <div className="space-y-1 md:space-y-2">
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-[10px] md:text-xs font-black uppercase tracking-[0.5em] text-white/40"
                        >
                            {subtitle}
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-4xl md:text-6xl font-serif italic text-white drop-shadow-2xl"
                        >
                            {title}
                        </motion.h2>
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-sm md:text-lg text-white/60 font-light leading-relaxed max-w-lg"
                    >
                        {description}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="pt-4 flex items-center space-x-6"
                    >
                        <button
                            onClick={onCtaClick}
                            className="px-8 md:px-12 py-4 md:py-5 bg-white text-black rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.3em] flex items-center space-x-4 hover:bg-ffn-primary hover:text-white transition-all group/btn shadow-xl shadow-black/50"
                        >
                            <span>{ctaText}</span>
                            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                        </button>

                        <div className="hidden md:flex items-center space-x-8 opacity-40">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Match Level</span>
                                <span className="text-xl font-serif italic text-ffn-primary">98% Precise</span>
                            </div>
                            <div className="h-8 w-px bg-white/10" />
                            <ShieldCheck className="w-6 h-6 text-ffn-primary" />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Floating Elements */}
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-24 h-24 md:w-32 md:h-32 border border-white/5 rounded-full flex items-center justify-center backdrop-blur-3xl"
            >
                <Zap className="w-8 h-8 md:w-12 md:h-12 text-ffn-primary opacity-20" />
            </motion.div>
        </motion.div>
    );
};
