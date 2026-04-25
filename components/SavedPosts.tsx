
import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Bookmark, Grid, Layout, List, Search, SlidersHorizontal, ArrowLeft, Loader2, Sparkles } from 'lucide-react';
import { Post } from '../types';
import { postService } from '../services/postService';
import { FeedCard } from './FeedCard';

interface SavedPostsProps {
    onBack?: () => void;
}

export const SavedPosts: React.FC<SavedPostsProps> = ({ onBack }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'feed'>('grid');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchSaved = async () => {
            setIsLoading(true);
            const res = await postService.getSavedPosts();
            if (res.success && res.data) {
                setPosts(res.data);
            }
            setIsLoading(false);
        };
        fetchSaved();
    }, []);

    const filteredPosts = posts.filter(post =>
        post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-32">
            <header className="space-y-8">
                <div className="flex items-center justify-between">
                    <div className="space-y-4">
                        <button
                            onClick={onBack}
                            className="group flex items-center space-x-3 text-[10px] uppercase tracking-[0.4em] font-black text-gray-400 hover:text-ffn-primary transition-all"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
                            <span>Identity Hub</span>
                        </button>
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-ffn-primary/10 rounded-3xl flex items-center justify-center text-ffn-primary shadow-inner">
                                <Bookmark className="w-8 h-8 fill-current" />
                            </div>
                            <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Saved Collections</h1>
                        </div>
                    </div>

                    <div className="flex bg-gray-50 p-1.5 rounded-[1.8rem] space-x-1 border border-gray-100 shadow-inner">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-white text-ffn-black shadow-lg border border-gray-100' : 'text-gray-400 hover:text-ffn-black'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('feed')}
                            className={`p-4 rounded-2xl transition-all ${viewMode === 'feed' ? 'bg-white text-ffn-black shadow-lg border border-gray-100' : 'text-gray-400 hover:text-ffn-black'}`}
                        >
                            <Layout className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300 group-focus-within:text-ffn-primary transition-all" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search saved aesthetic..."
                            className="w-full bg-white border border-gray-100 rounded-[2rem] py-5 pl-16 pr-24 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200/10 focus:shadow-2xl focus:border-ffn-primary transition-all"
                        />
                    </div>
                    <button className="p-5 bg-white border border-gray-50 rounded-[1.8rem] text-gray-400 hover:text-ffn-primary shadow-xl hover:shadow-2xl transition-all">
                        <SlidersHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <Loader2 className="w-12 h-12 animate-spin text-ffn-primary" />
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400">Retrieving Collection Nodes...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="bg-gray-50 rounded-[4rem] p-32 text-center space-y-8 border-2 border-dashed border-gray-200">
                    <div className="flex justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-xl">
                            <Bookmark className="w-10 h-10" />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-3xl font-serif italic text-gray-400">Your archive is currently empty.</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">Save editorial content to build your personal moodboard and visual identity reference.</p>
                    </div>
                    <button
                        onClick={onBack}
                        className="px-10 py-5 bg-ffn-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-ffn-primary transition-all flex items-center space-x-3 mx-auto"
                    >
                        <Sparkles className="w-4 h-4 text-ffn-accent" />
                        <span>Explore Discovery Feed</span>
                    </button>
                </div>
            ) : viewMode === 'feed' ? (
                <div className="max-w-2xl mx-auto space-y-12">
                    <AnimatePresence>
                        {filteredPosts.map((post, idx) => (
                            <FeedCard key={post.id} post={post} index={idx} />
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {filteredPosts.map((post, idx) => (
                            <m.div
                                key={post.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="aspect-square bg-gray-100 rounded-[2.5rem] overflow-hidden group relative cursor-pointer shadow-lg hover:shadow-2xl transition-all border border-gray-50"
                            >
                                <img src={post.mediaUrls[0]} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt="" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Bookmark className="text-white fill-white w-8 h-8 opacity-60" />
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
