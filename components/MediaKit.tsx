import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    Download, Share2, Eye, Calendar, MapPin, Star,
    ShieldCheck, Instagram, Twitter, Globe, Phone,
    Mail, ExternalLink, X, Maximize2
} from 'lucide-react';
import { User } from '../types';

interface MediaKitProps {
    talent: User;
    isOpen: boolean;
    onClose: () => void;
}

export const MediaKit: React.FC<MediaKitProps> = ({ talent, isOpen, onClose }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-ffn-black/90 backdrop-blur-xl p-4 md:p-12"
                >
                    <m.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-[3rem] w-full max-w-5xl h-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
                    >
                        {/* Interactive Header / Actions */}
                        <div className="absolute top-8 right-8 z-50 flex items-center space-x-3">
                            <button title="Export Media Kit to PDF" className="p-3 bg-ffn-black/5 hover:bg-ffn-black hover:text-white rounded-2xl transition-all group flex items-center space-x-2">
                                <Download className="w-4 h-4" />
                                <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Export PDF</span>
                            </button>
                            <button title="Share Media Kit" className="p-3 bg-ffn-black/5 hover:bg-ffn-black hover:text-white rounded-2xl transition-all">
                                <Share2 className="w-4 h-4" />
                            </button>
                            <button
                                title="Close Media Kit"
                                onClick={onClose}
                                className="p-3 bg-ffn-black/5 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                            {/* Visual Hero Section */}
                            <div className="relative h-[60vh] group">
                                <img
                                    src={talent.coverUrl || talent.avatarUrl}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-[2s]"
                                    alt=""
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/20 to-transparent" />

                                <div className="absolute bottom-12 left-12 right-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-3">
                                            <span className="px-3 py-1 bg-ffn-primary text-white text-[9px] font-black uppercase tracking-[0.3em] rounded-full">Pro Member</span>
                                            {talent.isVerified && <ShieldCheck className="w-5 h-5 text-emerald-400" />}
                                        </div>
                                        <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter text-white leading-none">
                                            {talent.displayName}.
                                        </h1>
                                        <p className="text-white/60 text-[11px] font-bold uppercase tracking-[0.6em]">
                                            {talent.role} • {talent.location}
                                        </p>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 flex items-center space-x-12">
                                        <div className="text-center">
                                            <p className="text-white font-serif italic text-3xl">{talent.avgRating || '4.9'}</p>
                                            <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mt-1">Rating</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white font-serif italic text-3xl">{talent.brandCollaborationsCount || '24'}</p>
                                            <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mt-1">Hires</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-ffn-primary font-serif italic text-xl">Available</p>
                                            <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mt-1">Status</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Grid */}
                            <div className="p-16 grid grid-cols-1 lg:grid-cols-3 gap-16">
                                {/* Left: BIO & STATS */}
                                <div className="lg:col-span-2 space-y-16">
                                    <section className="space-y-6">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">The Narrative</h2>
                                        <p className="text-3xl font-serif italic text-ffn-black leading-relaxed">
                                            {talent.bio || 'Professional creator pushing the boundaries of identity and aesthetics.'}
                                        </p>
                                    </section>

                                    <section className="space-y-8">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Physical Identity</h2>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                                            {[
                                                { label: 'Height', value: talent.arMeasurements?.height || '182cm' },
                                                { label: 'Chest', value: talent.arMeasurements?.chest || '94cm' },
                                                { label: 'Waist', value: talent.arMeasurements?.waist || '76cm' },
                                                { label: 'Eyes', value: 'Deep Brown' },
                                            ].map((stat, i) => (
                                                <div key={i} className="p-6 bg-gray-50 rounded-2xl space-y-2">
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                                    <p className="font-serif italic text-xl text-ffn-black">{stat.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </section>

                                    <section className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Visual Portfolio</h2>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">LATEST 6 NODES</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div key={i} className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden group relative">
                                                    <img
                                                        src={`https://images.unsplash.com/photo-${1500000000000 + (i * 1000000)}?w=800`}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                                                        alt=""
                                                    />
                                                    <div className="absolute inset-0 bg-ffn-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Maximize2 className="w-8 h-8 text-white scale-50 group-hover:scale-100 transition-transform" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </section>
                                </div>

                                {/* Right: CONTACT & LINKS */}
                                <div className="space-y-12">
                                    <section className="p-10 bg-ffn-black rounded-[3rem] text-white space-y-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-primary/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />

                                        <div className="space-y-2">
                                            <h3 className="text-xl font-serif italic font-bold">Booking Portal</h3>
                                            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Secured by FFN Escrow</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-ffn-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Next Available</p>
                                                    <p className="text-sm font-bold">March 14, 2025</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                                                    <Globe className="w-5 h-5 text-ffn-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Network Score</p>
                                                    <p className="text-sm font-bold">Top 1% Global</p>
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full py-5 bg-white text-ffn-black rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ffn-primary hover:text-white transition-all shadow-xl shadow-white/5">
                                            Secure Booking
                                        </button>
                                    </section>

                                    <section className="space-y-6">
                                        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Social Nodes</h2>
                                        <div className="space-y-3">
                                            {[
                                                { icon: Instagram, label: 'Instagram', value: '@' + (talent.userName || 'ffn_creator'), link: '#' },
                                                { icon: Globe, label: 'Portfolio', value: (talent.userName || 'ffn') + '.identity.lab', link: '#' },
                                                { icon: Mail, label: 'Direct', value: (talent.email || 'bookings@ffn.com'), link: '#' },
                                            ].map((social, i) => (
                                                <a
                                                    key={i}
                                                    href={social.link}
                                                    className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all group"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <social.icon className="w-4 h-4 text-ffn-primary" />
                                                        <span className="text-[10px] font-bold uppercase tracking-widest">{social.label}</span>
                                                    </div>
                                                    <span className="text-[9px] text-gray-400 group-hover:text-white/60 transition-colors font-mono">{social.value}</span>
                                                </a>
                                            ))}
                                        </div>
                                    </section>

                                    <div className="pt-12 border-t border-gray-100 flex flex-col items-center">
                                        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-gray-300">Generated by</p>
                                        <span className="font-serif font-bold text-lg text-ffn-black mt-2 italic tracking-tighter">ffn Identity Lab.</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>
    );
};
