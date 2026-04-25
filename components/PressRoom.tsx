import React, { useState } from 'react';
import { m } from 'framer-motion';
import {
    Newspaper, Download, ExternalLink, ArrowRight,
    Image as ImageIcon, FileText, Share2, Globe, Sparkles, Users
} from 'lucide-react';
import { MOCK_PRESS_RELEASES } from '../constants';

export const PressRoom: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'RELEASES' | 'ASSETS' | 'MEDIA'>('RELEASES');

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-24">
            {/* Hero Header */}
            <header className="relative py-20 overflow-hidden rounded-[4rem] bg-ffn-black text-white p-12 md:p-24 shadow-3xl">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-ffn-primary/20 blur-[150px] rounded-full animate-float -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10 space-y-8 max-w-3xl">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Globe className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global Press Office</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-serif italic leading-[0.9] tracking-tighter">
                        Official <br /> <span className="text-gradient-vibrant not-italic font-bold">Newsroom.</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl font-light leading-relaxed max-w-xl">
                        Official announcements, high-resolution brand assets, and media resources from the Fashion Freedom Network.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <button className="bg-white text-ffn-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center space-x-3 hover:bg-ffn-primary hover:text-white transition-all shadow-xl">
                            <Download className="w-4 h-4" />
                            <span>Download Media Kit</span>
                        </button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center space-x-3 hover:bg-white hover:text-ffn-black transition-all">
                            <span>Contact PR Team</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="flex items-center justify-center space-x-12 border-b border-gray-100">
                {['RELEASES', 'ASSETS', 'MEDIA'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`pb-8 text-[11px] font-black uppercase tracking-[0.4em] transition-all relative ${activeTab === tab ? 'text-ffn-black' : 'text-gray-300 hover:text-ffn-black'}`}
                    >
                        {tab}
                        {activeTab === tab && (
                            <m.div
                                layoutId="nav-underline"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-ffn-black rounded-full"
                            />
                        )}
                    </button>
                ))}
            </nav>

            {/* Content Area */}
            <div className="space-y-16">
                {activeTab === 'RELEASES' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {MOCK_PRESS_RELEASES.map((release, idx) => (
                            <m.article
                                key={release.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1 }}
                                className="group space-y-8 cursor-pointer"
                            >
                                <div className="aspect-[16/9] rounded-[3rem] overflow-hidden shadow-xl border border-gray-100 bg-gray-50 relative">
                                    <img
                                        src={release.imageUrl}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[1.5s] group-hover:scale-110"
                                        alt=""
                                    />
                                    <div className="absolute top-8 left-8">
                                        <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-xl text-[8px] font-black uppercase tracking-widest shadow-lg text-ffn-black">
                                            {release.category}
                                        </span>
                                    </div>
                                </div>
                                <div className="space-y-4 px-4">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(release.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <h3 className="text-3xl font-serif italic text-ffn-black leading-tight group-hover:text-ffn-primary transition-colors">
                                        {release.title}
                                    </h3>
                                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                                        {release.excerpt}
                                    </p>
                                    <button className="flex items-center space-x-3 text-ffn-black group-hover:text-ffn-primary transition-colors text-[10px] font-black uppercase tracking-widest pt-4">
                                        <span>Read Full Release</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </m.article>
                        ))}
                    </div>
                )}

                {activeTab === 'ASSETS' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { name: 'Primary Logo Pack', type: 'SVG/EPS', size: '2.4 MB', icon: ImageIcon },
                            { name: 'Brand Guide 2025', type: 'PDF', size: '15.8 MB', icon: FileText },
                            { name: 'Executive Headshots', type: 'JPG/RAW', size: '142 MB', icon: Users },
                            { name: 'Office Lifestyle', type: 'JPG/RAW', size: '84 MB', icon: ImageIcon },
                        ].map((asset, idx) => (
                            <m.div
                                key={asset.name}
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-ffn-primary/20 transition-all text-center space-y-6 group"
                            >
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-ffn-primary/10 group-hover:scale-110 transition-all">
                                    <asset.icon className="w-6 h-6 text-gray-400 group-hover:text-ffn-primary" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[11px] font-black text-ffn-black uppercase tracking-tight">{asset.name}</h4>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{asset.type} &bull; {asset.size}</p>
                                </div>
                                <button title="Download Asset" className="p-3 bg-gray-50 rounded-xl hover:bg-ffn-primary hover:text-white transition-all mx-auto shadow-sm">
                                    <Download className="w-4 h-4" />
                                </button>
                            </m.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Media Inquiry Card */}
            <div className="bg-white border-2 border-ffn-black p-12 md:p-20 rounded-[4rem] text-center space-y-12 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-64 h-64 bg-ffn-primary/5 blur-[80px] rounded-full -translate-x-1/2 -translate-y-1/2" />
                <div className="space-y-6 relative z-10">
                    <Sparkles className="w-8 h-8 text-ffn-primary mx-auto animate-spin-slow" />
                    <h2 className="text-4xl md:text-6xl font-serif italic text-ffn-black">For Media Inquiries</h2>
                    <p className="text-gray-500 max-w-xl mx-auto text-lg font-light leading-relaxed">
                        Need exclusive commentary, high-res runway footage, or executive interviews? Our PR team is here to assist global media partners.
                    </p>
                    <div className="pt-8 flex flex-col items-center space-y-6">
                        <a href="mailto:press@ffn.world" className="text-2xl font-serif italic border-b-2 border-ffn-primary hover:text-ffn-primary transition-all">
                            press@ffn.world
                        </a>
                        <div className="flex items-center space-x-6">
                            <button title="Share Press Room" className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-primary/10 hover:text-ffn-primary transition-all">
                                <Share2 className="w-5 h-5" />
                            </button>
                            <button title="More Options" className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-primary/10 hover:text-ffn-primary transition-all">
                                <ExternalLink className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
