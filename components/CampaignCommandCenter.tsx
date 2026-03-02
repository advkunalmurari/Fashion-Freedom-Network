import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus, Search, Filter, MoreHorizontal,
    Users, Target, BarChart3, Clock,
    CheckCircle2, AlertCircle, ArrowUpRight,
    TrendingUp, Wallet, LayoutGrid, List, Brain, X
} from 'lucide-react';
import { MOCK_CAMPAIGNS, MOCK_TALENT_POOL } from '../constants';
import { PredictiveCasting } from './PredictiveCasting';

export const CampaignCommandCenter: React.FC = () => {
    const [view, setView] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [simulatingCampaignId, setSimulatingCampaignId] = useState<string | null>(null);

    const campaigns = MOCK_CAMPAIGNS.filter(c =>
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = [
        { label: 'Active Campaigns', value: '4', icon: Target, color: 'text-ffn-primary' },
        { label: 'Talent Pool Reach', value: '1.2k', icon: Users, color: 'text-blue-500' },
        { label: 'Total Budget Managed', value: '₹12.5L', icon: Wallet, color: 'text-emerald-500' },
        { label: 'Avg. Match Rate', value: '88%', icon: TrendingUp, color: 'text-ffn-accent' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header & Actions */}
            <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div>
                    <h2 className="text-4xl font-serif italic text-ffn-black">Campaign Command</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-2">Scale your brand narrative with FFN Node technology</p>
                </div>

                <button className="flex items-center space-x-3 bg-ffn-black text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-2xl hover:shadow-ffn-primary/20">
                    <Plus className="w-5 h-5" />
                    <span>Launch New Campaign</span>
                </button>
            </section>

            {/* Global Stats */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl group hover:border-ffn-primary/20 transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-gray-200 group-hover:text-ffn-primary transition-colors" />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
                        <p className="text-3xl font-serif italic text-ffn-black">{stat.value}</p>
                    </div>
                ))}
            </section>

            {/* Controls */}
            <section className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gray-50/50 p-4 rounded-[2rem] border border-gray-100">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search campaigns..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border-none rounded-xl py-4 pl-14 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-ffn-primary/20 transition-all font-serif italic"
                    />
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2.5 rounded-lg transition-all ${view === 'grid' ? 'bg-ffn-black text-white' : 'text-gray-400 hover:text-ffn-black'}`}
                            title="Grid View"
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView('list')}
                            className={`p-2.5 rounded-lg transition-all ${view === 'list' ? 'bg-ffn-black text-white' : 'text-gray-400 hover:text-ffn-black'}`}
                            title="List View"
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <button className="flex items-center space-x-2 bg-white px-6 py-4 rounded-xl border border-gray-100 shadow-sm text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-ffn-black transition-all">
                        <Filter className="w-4 h-4" />
                        <span>Filters</span>
                    </button>
                </div>
            </section>

            {/* Campaign List */}
            <section className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-6"}>
                {campaigns.map((camp) => (
                    <motion.div
                        key={camp.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`group bg-white rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden hover:shadow-2xl transition-all ${view === 'list' ? 'flex items-center p-8' : ''}`}
                    >
                        {/* Visual Header (only for grid) */}
                        {view === 'grid' && (
                            <div className="aspect-[2/1] relative overflow-hidden bg-gray-100">
                                <img src={`https://picsum.photos/seed/${camp.id}/800/400`} className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100" alt="" />
                                <div className="absolute top-6 left-6">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border backdrop-blur-md ${camp.status === 'Live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-ffn-primary/10 text-ffn-primary border-ffn-primary/20'
                                        }`}>
                                        {camp.status}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className={`p-10 flex-1 space-y-8 ${view === 'list' ? 'p-0 flex items-center justify-between gap-12' : ''}`}>
                            <div className="space-y-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-2xl font-serif italic text-ffn-black">{camp.title}</h3>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ref: {camp.id.toUpperCase()}</p>
                                    </div>
                                    {view === 'grid' && <button title="Campaign Settings" className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-ffn-black transition-colors"><MoreHorizontal className="w-5 h-5" /></button>}
                                </div>
                                {view !== 'list' && <p className="text-sm text-gray-500 leading-relaxed font-light">{camp.description}</p>}
                            </div>

                            {/* Progress & Metrics */}
                            <div className={`space-y-6 ${view === 'list' ? 'flex items-center gap-12 space-y-0' : ''}`}>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-1">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-300">Applicants</p>
                                        <p className="text-xl font-serif italic text-ffn-black font-bold">{camp.applicants}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-300">Match Rate</p>
                                        <p className="text-xl font-serif italic text-emerald-500 font-bold">{camp.matchRate}%</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-300">Spent</p>
                                        <p className="text-xl font-serif italic text-ffn-black font-bold">₹{(camp.spent / 1000).toFixed(1)}k</p>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className={`space-y-3 ${view === 'list' ? 'hidden' : ''}`}>
                                    <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-widest">
                                        <span className="text-gray-400">Budget Consumption</span>
                                        <span className="text-ffn-black">{Math.round((camp.spent / camp.budget) * 100)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(camp.spent / camp.budget) * 100}%` }}
                                            className="h-full bg-gradient-to-r from-ffn-primary to-ffn-accent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setSimulatingCampaignId(camp.id)}
                                    className="py-5 bg-ffn-primary/5 text-ffn-primary rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-ffn-primary hover:text-white transition-all flex items-center justify-center space-x-3 shadow-sm border border-ffn-primary/10"
                                >
                                    <Brain className="w-4 h-4" />
                                    <span>Run ROI Simulation</span>
                                </button>
                                <button className="py-5 bg-gray-50 text-gray-400 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-ffn-black hover:text-white transition-all flex items-center justify-center space-x-3 group/btn shadow-inner border border-gray-100">
                                    <span>Access War Room</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* No Results */}
            {campaigns.length === 0 && (
                <div className="py-40 text-center bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100">
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl text-gray-200">
                        <Target className="w-10 h-10" />
                    </div>
                    <h4 className="text-3xl font-serif italic text-gray-400">No matching campaigns</h4>
                    <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Adjust your filters or launch a new initiative</p>
                </div>
            )}

            {/* Simulation Modal Overlay */}
            <AnimatePresence>
                {simulatingCampaignId && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-ffn-black/80 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-[4rem]"
                        >
                            <PredictiveCasting
                                selectedTalentIds={MOCK_TALENT_POOL.slice(0, 4).map(t => t.id)}
                                onClose={() => setSimulatingCampaignId(null)}
                            />
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
