
import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, Command, User, Briefcase, Film, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_SEARCH_RESULTS } from '../constants';

export const GlobalSearchOverlay: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                onClose(); // In a real app this would toggle, but for this mock we handle open state externally
            }
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const filteredResults = MOCK_SEARCH_RESULTS.filter(res =>
        res.title.toLowerCase().includes(query.toLowerCase()) ||
        res.subtitle.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-start justify-center pt-10 md:pt-[15vh] px-4 backdrop-blur-2xl bg-black/80"

                    onClick={onClose}
                >
                    <m.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-ffn-primary/10"
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Search Input Protocol */}
                        <div className="p-8 border-b border-white/10 flex items-center space-x-6">
                            <Search className="w-8 h-8 text-ffn-primary" />
                            <input
                                autoFocus
                                type="text"
                                placeholder="Search Identities..."
                                className="flex-1 bg-transparent border-none text-lg md:text-2xl font-serif italic text-white placeholder:text-white/20 focus:ring-0 outline-none"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                            />

                            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                <Command className="w-4 h-4 text-gray-500" />
                                <span className="text-[10px] font-black text-gray-500">K</span>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Results Stream */}
                        <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-6">
                            {query === '' ? (
                                <div className="space-y-12 py-8">
                                    <div className="text-center space-y-4">
                                        <Globe className="w-12 h-12 text-white/10 mx-auto animate-pulse" />
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Universal Professional Graph</p>
                                    </div>

                                    {/* Smart Suggestions */}
                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-3">Trending Nodes</h5>
                                            <div className="space-y-2">
                                                {['#HighFashion', '#Editorial', '#CastingMumbai', '#ParisRunway'].map(tag => (
                                                    <button key={tag} className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-ffn-primary/30 group transition-all">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-ffn-primary">{tag}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h5 className="text-[9px] font-black uppercase tracking-[0.2em] text-white/30 px-3">Recent Inquiries</h5>
                                            <div className="space-y-2">
                                                {['Milan Open Calls', 'Sabyasachi Heritage', 'Casting Protocol 2025'].map(item => (
                                                    <button key={item} className="w-full text-left px-4 py-3 rounded-2xl bg-white/5 border border-white/5 hover:border-ffn-primary/30 group transition-all flex items-center justify-between">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover:text-ffn-primary">{item}</span>
                                                        <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-ffn-primary" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/* Categorized Results */}
                                    {['talent', 'brand', 'casting'].map(type => {
                                        const results = filteredResults.filter(r => r.type === type);
                                        if (results.length === 0) return null;

                                        return (
                                            <div key={type} className="space-y-3">
                                                <div className="flex items-center justify-between px-4 pb-1">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">
                                                        {type === 'talent' ? 'Identities' : type === 'brand' ? 'Nodes' : 'Opportunities'}
                                                    </span>
                                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-ffn-primary/50">{results.length}</span>
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {results.map((res, i) => (
                                                        <m.button
                                                            key={res.id}
                                                            initial={{ opacity: 0, y: 5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ delay: i * 0.05 }}
                                                            className="w-full p-4 flex items-center justify-between bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-ffn-primary/30 transition-all group"
                                                            onClick={() => {
                                                                navigate(res.link);
                                                                onClose();
                                                            }}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-black/40 group-hover:scale-110 transition-transform`}>
                                                                    {res.type === 'talent' ? <User className="w-5 h-5 text-ffn-primary" /> :
                                                                        res.type === 'brand' ? <Globe className="w-5 h-5 text-blue-500" /> :
                                                                            <Briefcase className="w-5 h-5 text-green-500" />}
                                                                </div>
                                                                <div className="text-left">
                                                                    <div className="flex items-center space-x-2">
                                                                        <h4 className="text-sm font-serif italic text-white group-hover:text-ffn-primary transition-colors">{res.title}</h4>
                                                                        {res.isVerified && (
                                                                            <div className="flex items-center space-x-1">
                                                                                <CheckCircle className="w-3 h-3 text-ffn-primary" />
                                                                                {res.trustScore && (
                                                                                    <span className="text-[7px] font-black text-ffn-primary opacity-60">{res.trustScore}</span>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <p className="text-[8px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-400 transition-colors">{res.subtitle}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-ffn-primary group-hover:translate-x-1 transition-all" />
                                                        </m.button>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {filteredResults.length === 0 && (
                                        <div className="py-20 text-center space-y-4">
                                            <X className="w-12 h-12 text-red-500/20 mx-auto" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">No nodes found in the current protocol.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Footer Intelligence */}
                        <div className="p-6 bg-black/40 border-t border-white/10 flex items-center justify-between">
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Command className="w-3 h-3 text-ffn-primary" />
                                    <span className="text-[8px] font-bold text-gray-500">to navigate</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-[8px] font-black text-ffn-primary uppercase tracking-[0.2em]">Esc</span>
                                    <span className="text-[8px] font-bold text-gray-500">to close</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-ffn-primary shadow-[0_0_15px_rgba(255,215,0,0.1)]">
                                <span className="text-[7px] font-black uppercase tracking-[0.4em] opacity-40">FFN Neural Core v4.5</span>
                            </div>
                        </div>
                    </m.div>
                </m.div>
            )}
        </AnimatePresence>
    );
};
