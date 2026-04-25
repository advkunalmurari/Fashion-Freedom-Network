import React, { useState } from 'react';
import { m, AnimatePresence, Reorder } from 'framer-motion';
import {
    Users,
    Search,
    MoreHorizontal,
    Star,
    MessageSquare,
    Calendar,
    CheckCircle2,
    Clock,
    ArrowRight,
    Filter,
    FilterX,
    TrendingUp,
    Target
} from 'lucide-react';
import { RecruitmentLead, RecruitmentStatus, User } from '../types';
import { MOCK_TALENT_POOL } from '../constants';

const STATUS_CONFIG: Record<RecruitmentStatus, { label: string; color: string; icon: any }> = {
    SCOUTED: { label: 'Scouted', color: 'bg-blue-500', icon: Target },
    INTERVIEWING: { label: 'Interviewing', color: 'bg-ffn-primary', icon: MessageSquare },
    NEGOTIATING: { label: 'Negotiating', color: 'bg-purple-500', icon: TrendingUp },
    BOOKED: { label: 'Booked', color: 'bg-green-500', icon: CheckCircle2 },
    ARCHIVED: { label: 'Archived', color: 'bg-ffn-gray', icon: Clock },
};

export const BrandRecruitingCRM: React.FC = () => {
    const [leads, setLeads] = useState<RecruitmentLead[]>([
        { id: 'l1', brandId: 'b1', talentId: '1', status: 'SCOUTED', updatedAt: new Date().toISOString(), matchScore: 94 },
        { id: 'l2', brandId: 'b1', talentId: '2', status: 'INTERVIEWING', updatedAt: new Date().toISOString(), matchScore: 88 },
        { id: 'l3', brandId: 'b1', talentId: '3', status: 'NEGOTIATING', updatedAt: new Date().toISOString(), matchScore: 91 },
        { id: 'l4', brandId: 'b1', talentId: '4', status: 'SCOUTED', updatedAt: new Date().toISOString(), matchScore: 85 },
        { id: 'l5', brandId: 'b1', talentId: '5', status: 'BOOKED', updatedAt: new Date().toISOString(), matchScore: 96 },
    ]);

    const [filter, setFilter] = useState<RecruitmentStatus | 'ALL'>('ALL');

    const getTalent = (id: string) => MOCK_TALENT_POOL.find(t => t.id === id);

    const updateLeadStatus = (leadId: string, status: RecruitmentStatus) => {
        setLeads(leads.map(l => l.id === leadId ? { ...l, status, updatedAt: new Date().toISOString() } : l));
    };

    return (
        <div className="space-y-8 p-6 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-serif italic text-white flex items-center gap-3">
                        <Users className="w-8 h-8 text-ffn-primary" />
                        Recruitment Pipeline
                    </h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-ffn-gray mt-2">Manage your professional talent funnel</p>
                </div>

                <div className="flex items-center gap-3 bg-ffn-black/50 border border-white/5 p-1 rounded-xl">
                    {(['ALL', ...Object.keys(STATUS_CONFIG)] as const).map(s => (
                        <button
                            key={s}
                            onClick={() => setFilter(s)}
                            className={`px-4 py-2 text-[9px] font-black tracking-widest rounded-lg transition-all ${filter === s ? 'bg-ffn-primary text-ffn-black' : 'text-ffn-gray hover:text-white'
                                }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {(Object.keys(STATUS_CONFIG) as RecruitmentStatus[]).map(status => {
                    const columnLeads = leads.filter(l => l.status === status);
                    const config = STATUS_CONFIG[status];

                    if (filter !== 'ALL' && filter !== status) return null;

                    return (
                        <div key={status} className="flex flex-col gap-4">
                            <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                    <h3 className="text-[10px] font-black uppercase tracking-widest text-white">{config.label}</h3>
                                    <span className="text-[10px] font-bold text-ffn-gray ml-2">{columnLeads.length}</span>
                                </div>
                                <config.icon className="w-4 h-4 text-ffn-gray" />
                            </div>

                            <div className="flex flex-col gap-4 min-h-[500px]">
                                <AnimatePresence mode="popLayout">
                                    {columnLeads.map(lead => {
                                        const talent = getTalent(lead.talentId);
                                        if (!talent) return null;

                                        return (
                                            <m.div
                                                layout
                                                key={lead.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="bg-ffn-black/40 border border-white/5 p-4 rounded-2xl group hover:border-ffn-primary/30 transition-all cursor-pointer relative"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="relative">
                                                        <img src={talent.avatarUrl} alt={talent.displayName} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                                                        <div className="absolute -bottom-1 -right-1 bg-ffn-primary text-ffn-black text-[8px] font-black px-1 rounded-sm">
                                                            {lead.matchScore}%
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-sm font-bold text-white group-hover:text-ffn-primary transition-colors">{talent.displayName}</h4>
                                                        <p className="text-[9px] text-ffn-gray uppercase tracking-tighter">{talent.role}</p>
                                                    </div>
                                                    <button className="p-1 text-ffn-gray hover:text-white transition-colors" title="More Options">
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="mt-4 flex items-center justify-between">
                                                    <div className="flex -space-x-2">
                                                        {[1, 2].map(i => (
                                                            <div key={i} className="w-5 h-5 rounded-full border border-ffn-black bg-gray-800 flex items-center justify-center overflow-hidden">
                                                                <Users className="w-2 h-2 text-ffn-gray" />
                                                            </div>
                                                        ))}
                                                        <div className="w-5 h-5 rounded-full border border-ffn-black bg-ffn-primary/10 flex items-center justify-center text-[7px] font-black text-ffn-primary">+2</div>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        {(Object.keys(STATUS_CONFIG) as RecruitmentStatus[]).filter(s => s !== status).slice(0, 2).map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    updateLeadStatus(lead.id, s);
                                                                }}
                                                                className="px-2 py-1 bg-ffn-primary/5 border border-ffn-primary/10 rounded-md text-[7px] font-black text-ffn-primary hover:bg-ffn-primary hover:text-ffn-black transition-all uppercase"
                                                                title={`Move to ${s}`}
                                                            >
                                                                {s === 'SCOUTED' ? 'SCOUT' : s === 'INTERVIEWING' ? 'INTV' : s === 'NEGOTIATING' ? 'NEGO' : s === 'BOOKED' ? 'BOOK' : 'ARCH'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {lead.notes && lead.notes.length > 0 && (
                                                    <div className="mt-4 pt-3 border-t border-white/5">
                                                        <div className="flex items-center gap-2 text-ffn-gray">
                                                            <MessageSquare className="w-3 h-3" />
                                                            <span className="text-[8px] italic truncate">{lead.notes[0].content}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </m.div>
                                        );
                                    })}
                                </AnimatePresence>
                                {columnLeads.length === 0 && (
                                    <div className="flex-1 border border-dashed border-white/5 rounded-2xl flex items-center justify-center p-8">
                                        <p className="text-[10px] font-bold text-ffn-gray uppercase tracking-widest opacity-20">Empty Stage</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
