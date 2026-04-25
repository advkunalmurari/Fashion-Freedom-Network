import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Search, X, User, Briefcase, Camera, ArrowRight, Sparkles, TrendingUp, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_TALENT_POOL, MOCK_CASTING_CALLS, MOCK_EDITORIALS } from '../constants';

interface GlobalSearchProps {
    isDarkMode?: boolean;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isDarkMode }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{
        talent: any[];
        castings: any[];
        editorials: any[];
    }>({ talent: [], castings: [], editorials: [] });
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    useEffect(() => {
        if (!query) {
            setResults({ talent: [], castings: [], editorials: [] });
            return;
        }

        const lowerQuery = query.toLowerCase();
        setResults({
            talent: MOCK_TALENT_POOL.filter(t => t.displayName.toLowerCase().includes(lowerQuery)).slice(0, 3),
            castings: MOCK_CASTING_CALLS.filter(c => c.title.toLowerCase().includes(lowerQuery)).slice(0, 3),
            editorials: MOCK_EDITORIALS.filter(e => e.title.toLowerCase().includes(lowerQuery)).slice(0, 3),
        });
    }, [query]);

    const handleSelect = (route: string) => {
        navigate(route);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className={`flex items-center space-x-3 px-4 py-2 rounded-2xl transition-all group border ${isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10' : 'bg-gray-50 border-gray-100 text-gray-400 hover:text-ffn-black hover:bg-gray-100'}`}
            >
                <Search className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] pr-8">Search Protocol</span>
                <kbd className={`text-[8px] font-black px-2 py-1 rounded-lg border ${isDarkMode ? 'border-white/10 text-white/20' : 'border-gray-200 text-gray-300'}`}>⌘K</kbd>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-6 bg-black/60 backdrop-blur-xl"
                        onClick={() => setIsOpen(false)}
                    >
                        <m.div
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border ${isDarkMode ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-gray-200'}`}
                        >
                            <div className="relative border-b dark:border-white/10">
                                <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-ffn-primary" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Find talent, brands, or castings..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    className="w-full h-20 pl-20 pr-8 bg-transparent border-none text-lg focus:ring-0 dark:text-white"
                                />
                            </div>

                            <div className="max-h-[60vh] overflow-y-auto no-scrollbar p-6">
                                {!query ? (
                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-4 px-2">Trending Searches</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {['Summer Resort 26', 'Runway Models', 'Sustainable Brands', 'Mumbai Talent'].map(tag => (
                                                    <button
                                                        key={tag}
                                                        onClick={() => setQuery(tag)}
                                                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${isDarkMode ? 'bg-white/5 text-white/60 hover:bg-ffn-primary hover:text-white' : 'bg-gray-50 text-gray-500 hover:bg-ffn-primary hover:text-white'}`}
                                                    >
                                                        <TrendingUp className="w-3 h-3 inline-block mr-2" />
                                                        {tag}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            {['Recent Castings', 'Verified Professionals', 'Masterclasses', 'Editorial Archives'].map(item => (
                                                <div key={item} className={`p-4 rounded-2xl border flex items-center justify-between cursor-pointer group transition-all ${isDarkMode ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-gray-50 border-gray-100 hover:bg-white hover:shadow-xl'}`}>
                                                    <span className="text-[10px] font-bold uppercase tracking-widest dark:text-white/80">{item}</span>
                                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-ffn-primary group-hover:translate-x-1 transition-all" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        {results.talent.length > 0 && (
                                            <section>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary mb-4 px-2">Talent Nodes</h4>
                                                <div className="space-y-2">
                                                    {results.talent.map(t => (
                                                        <div
                                                            key={t.id}
                                                            onClick={() => handleSelect(`/profile-view/${t.id}`)}
                                                            className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer group transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <img src={t.avatarUrl} className="w-12 h-12 rounded-xl object-cover" alt="" />
                                                                <div>
                                                                    <p className="text-sm font-bold dark:text-white">{t.displayName}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{t.role} • {t.location}</p>
                                                                </div>
                                                            </div>
                                                            <Sparkles className="w-4 h-4 text-gray-200 group-hover:text-ffn-primary opacity-0 group-hover:opacity-100 transition-all" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {results.castings.length > 0 && (
                                            <section>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary mb-4 px-2">Opportunities</h4>
                                                <div className="space-y-2">
                                                    {results.castings.map(c => (
                                                        <div
                                                            key={c.id}
                                                            onClick={() => handleSelect('/castings')}
                                                            className={`flex items-center justify-between p-4 rounded-2xl cursor-pointer group transition-all ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                                                        >
                                                            <div className="flex items-center space-x-4">
                                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-white/10' : 'bg-ffn-black'}`}>
                                                                    <Briefcase className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-bold dark:text-white">{c.title}</p>
                                                                    <p className="text-[10px] text-gray-400 uppercase tracking-widest">{c.brandName} • {c.budget || `₹${c.fee?.toLocaleString()}`}</p>
                                                                </div>
                                                            </div>
                                                            <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-ffn-primary group-hover:translate-x-1 transition-all" />
                                                        </div>
                                                    ))}
                                                </div>
                                            </section>
                                        )}

                                        {results.talent.length === 0 && results.castings.length === 0 && (
                                            <div className="py-20 text-center">
                                                <p className="text-gray-400 font-serif italic">No signals found matching your query...</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'border-white/10 bg-white/5' : 'border-gray-50 bg-gray-50'}`}>
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-1">
                                        <kbd className={`px-2 py-1 rounded text-[8px] font-black border ${isDarkMode ? 'border-white/10 text-white/40' : 'border-gray-200 text-gray-400'}`}>ESC</kbd>
                                        <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Close</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <kbd className={`px-2 py-1 rounded text-[8px] font-black border ${isDarkMode ? 'border-white/10 text-white/40' : 'border-gray-200 text-gray-400'}`}>↵</kbd>
                                        <span className="text-[9px] uppercase font-black text-gray-400 tracking-wider">Select</span>
                                    </div>
                                </div>
                                <div className="text-[9px] uppercase font-black text-ffn-primary tracking-[0.2em] animate-pulse">
                                    System Protocol Active
                                </div>
                            </div>
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </>
    );
};
