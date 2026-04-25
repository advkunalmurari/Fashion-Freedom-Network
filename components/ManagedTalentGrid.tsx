
import React from 'react';
import { m } from 'framer-motion';
import { Users, MoreHorizontal, UserCheck, Calendar, Briefcase, ChevronRight } from 'lucide-react';
import { ManagedTalent } from '../types';

interface ManagedTalentGridProps {
    talents: ManagedTalent[];
}

export const ManagedTalentGrid: React.FC<ManagedTalentGridProps> = ({ talents }) => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-serif italic text-white">Managed Talent Roster</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ffn-primary">24 Represented Identities</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all">
                        Batch Actions
                    </button>
                    <button className="px-6 py-3 rounded-xl bg-ffn-primary text-[8px] font-black uppercase tracking-widest text-black hover:brightness-110 transition-all">
                        Add New Node
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {talents.map((talent, idx) => (
                    <m.div
                        key={talent.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative bg-white/5 border border-white/5 rounded-[2.5rem] overflow-hidden hover:bg-white/10 transition-all duration-500"
                    >
                        {/* Status Indicator */}
                        <div className="absolute top-6 left-6 z-10">
                            <div className={`px-3 py-1.5 rounded-full border flex items-center space-x-2 backdrop-blur-md
                ${talent.status === 'active' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                                    talent.status === 'on-set' ? 'bg-ffn-primary/10 border-ffn-primary/20 text-ffn-primary' :
                                        'bg-gray-500/10 border-gray-500/20 text-gray-400'}`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${talent.status === 'active' ? 'bg-green-500' : talent.status === 'on-set' ? 'bg-ffn-primary' : 'bg-gray-500'}`} />
                                <span className="text-[8px] font-black uppercase tracking-widest">{talent.status}</span>
                            </div>
                        </div>

                        <button
                            title="More Options"
                            className="absolute top-6 right-6 z-10 p-2 text-white/40 hover:text-white transition-colors"
                        >
                            <MoreHorizontal className="w-5 h-5" />
                        </button>

                        <div className="p-8 space-y-6">
                            <div className="flex items-center space-x-6">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 group-hover:scale-105 transition-transform duration-500 shadow-2xl">
                                    <img src={talent.user.avatarUrl} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-lg font-serif italic text-white group-hover:text-ffn-primary transition-colors">{talent.user.username}</h4>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-gray-500">Mastery Level 9.8</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Active Bookings</span>
                                    <div className="text-lg font-serif italic text-white">{talent.activeProjects}</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Commission Rate</span>
                                    <div className="text-lg font-serif italic text-ffn-primary">{talent.commissionRate * 100}%</div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 text-gray-400">
                                        <Calendar className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-tight">Next Node:</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-white">{talent.nextBooking || 'Open Protocol'}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 text-gray-400">
                                        <Briefcase className="w-3 h-3" />
                                        <span className="text-[9px] font-bold uppercase tracking-tight">Total Earnings:</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-widest text-ffn-primary">₹{talent.totalEarnings.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button className="w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-white flex items-center justify-center space-x-3 group-hover:bg-ffn-primary group-hover:text-black transition-all">
                                    <span>Enter Oversight Protocol</span>
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </m.div>
                ))}
            </div>
        </div>
    );
};
