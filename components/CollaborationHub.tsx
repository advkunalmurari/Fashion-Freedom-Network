import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users, Plus, Search, Filter, MapPin, Calendar,
    ArrowRight, MessageSquarePlus, Share2, Sparkles
} from 'lucide-react';
import { MOCK_COLLABORATION_PROJECTS } from '../constants';
import { CollaborationProject } from '../types';

export const CollaborationHub: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'ALL' | 'TFP' | 'PAID' | 'SPEC'>('ALL');

    const filteredProjects = MOCK_COLLABORATION_PROJECTS.filter(project => {
        const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'ALL' || project.type === filter;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-16">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Users className="w-5 h-5" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Creative Synergy</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif italic text-ffn-black leading-none">
                        Collaboration <br /> <span className="text-gradient-vibrant not-italic font-bold">Hub.</span>
                    </h1>
                    <p className="text-gray-400 text-sm max-w-md font-medium leading-relaxed">
                        Discover peer-to-peer projects, TFP opportunities, and professional spec-work within the FFN network.
                    </p>
                </div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-ffn-black text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center space-x-3 shadow-xl hover:shadow-ffn-primary/20 transition-all"
                >
                    <Plus className="w-4 h-4" />
                    <span>Post Project</span>
                </motion.button>
            </header>

            {/* toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/50 backdrop-blur-md p-6 rounded-[2.5rem] border border-gray-100 shadow-sm sticky top-24 z-40">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search projects, roles, or aesthetic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm focus:ring-2 focus:ring-ffn-primary/20 transition-all"
                    />
                </div>
                <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar w-full md:w-auto">
                    {['ALL', 'TFP', 'PAID', 'SPEC'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type as any)}
                            className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === type ? 'bg-ffn-black text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-400 hover:border-ffn-primary/30 hover:text-ffn-primary'}`}
                        >
                            {type}
                        </button>
                    ))}
                    <div className="h-10 w-[1px] bg-gray-100 mx-2" />
                    <button title="Advanced Filters" className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-ffn-black hover:border-ffn-black transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group bg-white rounded-[3.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-ffn-primary/10 transition-all space-y-8"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white shadow-md grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <img src={project.creator.avatarUrl} className="w-full h-full object-cover" alt="" />
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-ffn-black uppercase tracking-tight">{project.creator.displayName}</h4>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{project.creator.role}</p>
                                    </div>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${project.type === 'PAID' ? 'bg-emerald-50 text-emerald-500' : 'bg-ffn-primary/5 text-ffn-primary'} border border-current/10`}>
                                    {project.type}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-serif italic text-ffn-black group-hover:text-ffn-primary transition-colors">{project.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">{project.description}</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {project.requirements.map(req => (
                                        <span key={req} className="px-4 py-2 bg-gray-50 rounded-xl text-[9px] font-bold text-gray-500 uppercase tracking-widest">
                                            Need: {req}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-1 text-gray-400">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">{project.location}</span>
                                        </div>
                                        <div className="flex items-center space-x-1 text-gray-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span className="text-[9px] font-black uppercase tracking-widest">Starts Oct 25</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <button title="Share Project" className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-ffn-primary/5 hover:text-ffn-primary transition-all">
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button className="flex items-center space-x-3 bg-white border border-gray-100 text-ffn-black px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-ffn-black hover:text-white transition-all shadow-sm">
                                            <span>Apply</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Pro Tip Card */}
            <div className="bg-ffn-black text-white p-16 rounded-[4rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ffn-primary/30 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-6">
                        <div className="flex items-center space-x-3">
                            <Sparkles className="w-5 h-5 text-ffn-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">AI Matching Engine</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-serif italic max-w-xl">Boost your collaboration visibility.</h2>
                        <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg">
                            Verified professionals get prioritized in collaboration search results and receive instant notifications when projects matching their role are posted.
                        </p>
                    </div>
                    <button className="bg-white text-ffn-black px-12 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ffn-primary hover:text-white transition-all shadow-2xl">
                        Verify Identity
                    </button>
                </div>
            </div>
        </div>
    );
};
