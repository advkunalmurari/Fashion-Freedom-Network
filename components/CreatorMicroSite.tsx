import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ExternalLink, ArrowRight, Instagram, Twitter,
    Globe, ShieldCheck, Star, Calendar,
    ChevronRight, Play, Maximize2, Share2,
    Lock, Zap, Heart
} from 'lucide-react';
import { User } from '../types';

interface CreatorMicroSiteProps {
    creator: User;
    onClose?: () => void;
}

export const CreatorMicroSite: React.FC<CreatorMicroSiteProps> = ({ creator, onClose }) => {
    const [activeTab, setActiveTab] = useState<'works' | 'services' | 'about'>('works');

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto selection:bg-ffn-primary selection:text-black">
            {/* Navigation Layer */}
            <nav className="fixed top-0 inset-x-0 h-24 flex items-center justify-between px-12 z-50 bg-white/80 backdrop-blur-2xl border-b border-gray-100">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-ffn-black rounded-xl flex items-center justify-center">
                        <span className="text-white font-black text-xs">FFN</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Identity.Site</span>
                </div>

                <div className="flex items-center space-x-8">
                    {creator.instagramUrl && (
                        <a
                            href={creator.instagramUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-400 hover:text-ffn-black transition-colors"
                            title="Instagram Profile"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                    )}
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-ffn-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-gray-200"
                        title="Exit Creator Site"
                    >
                        Exit Site
                    </button>
                </div>
            </nav>

            {/* Hero Section - Maximum Impact */}
            <section className="relative h-[90vh] flex items-end p-12 overflow-hidden">
                {/* Cinematic Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent z-10" />
                    <img
                        src={creator.coverUrl || creator.avatarUrl}
                        className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-1000"
                        alt={creator.displayName}
                    />
                </div>

                <div className="relative z-20 max-w-5xl space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-3 px-4 py-2 bg-ffn-black/5 backdrop-blur-xl rounded-full border border-white/20"
                    >
                        <div className="w-2 h-2 rounded-full bg-ffn-primary animate-pulse" />
                        <span className="text-[10px] font-bold text-ffn-black uppercase tracking-widest">Verified Creator Protocol</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-8xl md:text-[10rem] font-serif italic text-ffn-black leading-[0.8] tracking-tighter"
                    >
                        {(creator.displayName || 'Creator').split(' ')[0]} <br />
                        <span className="ml-24">{(creator.displayName || '').split(' ')[1] || ''}</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center space-x-12 pt-8"
                    >
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Professional Node</p>
                            <p className="text-xl font-medium text-ffn-black">{creator.role}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Global Ranking</p>
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-ffn-primary fill-current" />
                                <p className="text-xl font-medium text-ffn-black">{creator.avgRating || 0}</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Content Layers */}
            <section className="bg-white min-h-[100vh] p-12 space-y-24">
                {/* Navigation Tabs */}
                <div className="flex items-center space-x-16 border-b border-gray-100 pb-8">
                    {[
                        { id: 'works', label: 'Curated Works' },
                        { id: 'services', label: 'Protocols & Rates' },
                        { id: 'about', label: 'Identity Brief' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab.id ? 'text-ffn-black' : 'text-gray-300 hover:text-gray-500'
                                }`}
                            title={`View ${tab.label}`}
                        >
                            {tab.label}
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-8 left-0 right-0 h-1 bg-ffn-black"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'works' && (
                        <motion.div
                            key="works"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="group relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100">
                                    <img
                                        src={`https://images.unsplash.com/photo-${1500000000 + i}?auto=format&fit=crop&q=80&w=800`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                        alt="Portfolio Work"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="text-center space-y-4">
                                            <p className="text-white text-[10px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-transform">Inspiration. Archive. 0{i}</p>
                                            <button className="p-4 bg-white rounded-full" title="Maximize View">
                                                <Maximize2 className="w-5 h-5 text-ffn-black" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'services' && (
                        <motion.div
                            key="services"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-4xl space-y-8"
                        >
                            {[
                                { title: 'Commercial Editorial', rate: '₹45,000/day', desc: 'Full-day high-fashion session including basic post-processing and digital delivery.' },
                                { title: 'Brand Ambassadorship', rate: 'Custom Quote', desc: 'Monthly content creation, social amplification, and long-term verified representation.' },
                                { title: 'Runway Protocol', rate: '₹25,000/show', desc: 'Pre-show rehearsal + main event runway walk with professional direction.' }
                            ].map((service, i) => (
                                <div key={i} className="p-12 bg-gray-50 rounded-[3rem] group hover:bg-ffn-black hover:text-white transition-all duration-500 flex items-center justify-between">
                                    <div className="space-y-4 max-w-lg">
                                        <h4 className="text-3xl font-serif italic">{service.title}</h4>
                                        <p className="text-sm opacity-60 leading-relaxed">{service.desc}</p>
                                    </div>
                                    <div className="text-right space-y-4">
                                        <p className="text-2xl font-black">{service.rate}</p>
                                        <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-ffn-primary group-hover:text-white">
                                            <span>Inquire Protocol</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-24"
                        >
                            <div className="space-y-12">
                                <div className="space-y-6">
                                    <h3 className="text-4xl font-serif italic text-ffn-black">The Vision</h3>
                                    <p className="text-xl text-gray-500 leading-relaxed font-medium capitalize">
                                        {creator.bio || "Crafting high-fidelity visual worlds through the lens of modern professionalism. Bridging the gap between creative intent and commercial excellence."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-12 pt-12">
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Total Deployments</p>
                                        <p className="text-3xl font-black text-ffn-black">124+</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Node Trust Score</p>
                                        <p className="text-3xl font-black text-ffn-black">942</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 bg-ffn-black text-white rounded-[4rem] relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                <div className="relative z-10 space-y-12">
                                    <div className="flex items-center space-x-4">
                                        <ShieldCheck className="w-10 h-10 text-ffn-primary" />
                                        <h3 className="text-2xl font-serif italic">Secure Booking</h3>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        All bookings initiated through this site are protected by the Fashion Freedom Network Escrow Protocol. Payments are only released upon verified asset delivery or milestone completion.
                                    </p>
                                    <button className="w-full py-6 bg-ffn-primary text-ffn-black rounded-3xl text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-2xl">
                                        Initialize Deployment
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            {/* Footer Nodes */}
            <footer className="p-12 border-t border-gray-100 flex items-center justify-between bg-white text-gray-400">
                <p className="text-[10px] font-black uppercase tracking-widest">© 2024 FFN IDENTITY ARCHIVE • {creator.displayName}</p>
                <div className="flex items-center space-x-8">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]">Built with Fashion Freedom Network</p>
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4" />
                    </div>
                </div>
            </footer>
        </div>
    );
};
