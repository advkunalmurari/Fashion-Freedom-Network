import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lookbook } from '../types';
import { X, Folder, Calendar, Tag, ChevronRight } from 'lucide-react';

export const LookbookGrid: React.FC<{ lookbooks: Lookbook[] }> = ({ lookbooks }) => {
    const [selectedLookbook, setSelectedLookbook] = useState<Lookbook | null>(null);

    if (!lookbooks || lookbooks.length === 0) {
        return (
            <div className="py-20 text-center text-gray-400">
                <Folder className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black">No Curated Lookbooks Yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {lookbooks.map((lb) => (
                    <motion.div
                        key={lb.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        whileHover={{ y: -10 }}
                        onClick={() => setSelectedLookbook(lb)}
                        className="group cursor-pointer"
                    >
                        <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative shadow-xl group-hover:shadow-2xl transition-all duration-500 border border-gray-100">
                            <img
                                src={lb.coverImage}
                                alt={lb.title}
                                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/80 via-ffn-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                            <div className="absolute bottom-8 left-8 right-8">
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[8px] font-black text-white uppercase tracking-widest border border-white/20">
                                        {lb.images.length} Shots
                                    </span>
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white leading-tight">{lb.title}</h3>
                                <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] mt-2 group-hover:text-white transition-colors">{lb.subtitle}</p>
                            </div>

                            <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                <div className="bg-white p-4 rounded-2xl shadow-2xl">
                                    <ChevronRight className="w-5 h-5 text-ffn-black" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {selectedLookbook && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 backdrop-blur-3xl bg-white/80"
                    >
                        <button
                            onClick={() => setSelectedLookbook(null)}
                            title="Close Lookbook"
                            className="absolute top-10 right-10 p-5 bg-ffn-black text-white rounded-2xl hover:bg-ffn-primary transition-all z-[110]"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="w-full max-w-7xl h-full flex flex-col pt-20">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-6 md:space-y-0">
                                <div>
                                    <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter text-ffn-black">{selectedLookbook.title}</h2>
                                    <p className="text-lg text-gray-400 italic mt-4">"{selectedLookbook.subtitle}"</p>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                    {selectedLookbook.tags.map(tag => (
                                        <span key={tag} className="flex items-center space-x-2 px-6 py-2 bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 border border-gray-100">
                                            <Tag className="w-3 h-3" /> <span>{tag}</span>
                                        </span>
                                    ))}
                                    <span className="flex items-center space-x-2 px-6 py-2 bg-ffn-primary/5 rounded-full text-[10px] font-black uppercase tracking-widest text-ffn-primary border border-ffn-primary/10">
                                        <Calendar className="w-3 h-3" /> <span>{selectedLookbook.createdAt}</span>
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto pr-4 no-scrollbar">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {selectedLookbook.images.map((img, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100"
                                        >
                                            <img src={img} alt="" className="w-full h-auto" />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
