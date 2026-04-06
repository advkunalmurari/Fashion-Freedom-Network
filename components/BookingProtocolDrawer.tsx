import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Calendar, DollarSign, Briefcase, Zap } from 'lucide-react';
import { User } from '../types';

interface BookingProtocolDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
}

export const BookingProtocolDrawer: React.FC<BookingProtocolDrawerProps> = ({ isOpen, onClose, user }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-ffn-black/20 backdrop-blur-sm z-[150]"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-xl bg-white shadow-2xl z-[160] overflow-y-auto"
                    >
                        <div className="p-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-3xl font-serif font-bold text-ffn-black">Direct Protocol</h2>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mt-2">Initiate Booking for {user.displayName}</p>
                                </div>
                                <button
                                    onClick={onClose}
                                    title="Close Protocol"
                                    className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-8">
                                {/* Project Brief */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ffn-black flex items-center space-x-2">
                                        <Briefcase className="w-4 h-4 text-ffn-primary" />
                                        <span>Project Identity</span>
                                    </label>
                                    <select
                                        title="Select Project Type"
                                        className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-ffn-primary/20 appearance-none"
                                    >
                                        <option>Editorial Campaign</option>
                                        <option>Runway / Event</option>
                                        <option>Commercial Shoot</option>
                                        <option>Social Media Collaboration</option>
                                    </select>
                                </div>

                                {/* Date Selection */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ffn-black flex items-center space-x-2">
                                        <Calendar className="w-4 h-4 text-emerald-500" />
                                        <span>Deployment Window</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input title="Start Date" type="date" className="bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-ffn-primary/20" />
                                        <input title="End Date" type="date" className="bg-gray-50 border-none rounded-2xl p-6 text-sm font-medium focus:ring-2 focus:ring-ffn-primary/20" />
                                    </div>
                                </div>

                                {/* Financial Offer */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ffn-black flex items-center space-x-2">
                                        <DollarSign className="w-4 h-4 text-ffn-primary" />
                                        <span>Proposed Grant</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            placeholder="Enter amount (INR)"
                                            className="w-full bg-gray-50 border-none rounded-2xl p-6 pl-14 text-sm font-medium focus:ring-2 focus:ring-ffn-primary/20"
                                        />
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 font-bold">₹</span>
                                    </div>
                                </div>

                                {/* Project Milestones */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ffn-black flex items-center space-x-2">
                                        <Zap className="w-4 h-4 text-ffn-accent" />
                                        <span>Project Milestones</span>
                                    </label>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Initial Asset Delivery', days: '2-3 Nodes' },
                                            { label: 'Revision Protocol', days: '1 Node' },
                                            { label: 'Final Master Release', days: '1 Node' }
                                        ].map((m, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-ffn-primary/10 transition-all cursor-pointer group/ms">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-2 h-2 rounded-full bg-gray-200 group-hover/ms:bg-ffn-primary transition-colors" />
                                                    <span className="text-[10px] font-bold text-gray-400 group-hover/ms:text-ffn-black transition-colors">{m.label}</span>
                                                </div>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-ffn-primary/60">{m.days}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Additional Details */}
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-ffn-black">Briefing & Requirements</label>
                                    <textarea
                                        placeholder="Describe the creative vision and specific requirements..."
                                        className="w-full h-40 bg-gray-50 border-none rounded-3xl p-6 text-sm font-medium focus:ring-2 focus:ring-ffn-primary/20 resize-none"
                                    />
                                </div>
                            </div>

                            <div className="pt-10">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full bg-ffn-black text-white p-8 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] flex items-center justify-center space-x-4 shadow-2xl hover:bg-ffn-primary transition-all group"
                                >
                                    <Zap className="w-5 h-5 text-ffn-primary group-hover:text-white" />
                                    <span>Execute Protocol Request</span>
                                    <Send className="w-4 h-4" />
                                </motion.button>
                                <p className="text-center text-[8px] text-gray-400 font-black uppercase tracking-widest mt-6">
                                    Requests are verified through the FFN Secure Escrow Protocol
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
