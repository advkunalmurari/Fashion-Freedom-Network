import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, Inbox, Send, Briefcase,
    Target, ShieldCheck, Clock, CheckCircle2,
    MoreVertical, MessageSquare, ArrowUpRight,
    Zap, Loader2, X, ChevronRight, Bell
} from 'lucide-react';
import { MOCK_PROTOCOL_MESSAGES, MOCK_ACTIVITY_NODES } from '../constants';
import { ProtocolMessage, ProtocolCategory, ActivityNode } from '../types';
import { ProtocolDetailView } from './ProtocolDetailView';

export const UnifiedProtocolFeed: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState<ProtocolCategory | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProtocol, setSelectedProtocol] = useState<ProtocolMessage | null>(null);

    const categories: { id: ProtocolCategory | 'ALL', label: string, icon: any }[] = [
        { id: 'ALL', label: 'All Protocols', icon: Inbox },
        { id: 'DIRECT', label: 'Direct', icon: Send },
        { id: 'PROJECT', label: 'War Rooms', icon: Briefcase },
        { id: 'CASTING', label: 'Castings', icon: Target },
        { id: 'SYSTEM', label: 'System', icon: ShieldCheck },
    ];

    const filteredMessages = MOCK_PROTOCOL_MESSAGES.filter(msg => {
        const matchesCategory = activeCategory === 'ALL' || msg.category === activeCategory;
        const matchesSearch = msg.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            msg.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getUrgencyColor = (urgency: ProtocolMessage['urgency']) => {
        switch (urgency) {
            case 'high': return 'text-ffn-primary bg-ffn-primary/5 border-ffn-primary/10';
            case 'medium': return 'text-amber-500 bg-amber-500/5 border-amber-500/10';
            default: return 'text-gray-400 bg-gray-50 border-gray-100';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 min-h-screen bg-ffn-bg">
            {/* Header Area */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/5 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />

                <div className="relative z-10">
                    <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary mb-2">
                        <Zap className="w-3 h-3" />
                        <span>High-Fidelity Protocol</span>
                    </div>
                    <h1 className="text-4xl font-serif italic text-ffn-black">Universal Inbox</h1>
                    <p className="text-gray-400 text-xs font-medium mt-2 max-w-sm leading-relaxed">
                        Consolidated professional communication. Every node, every update, in one protocol.
                    </p>
                </div>

                <div className="relative w-full md:w-96 z-10">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                        type="text"
                        placeholder="Search threads or context..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-14 pr-6 text-sm font-serif italic focus:ring-2 focus:ring-ffn-primary/20 transition-all"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Category Selection Sidebar */}
                <aside className="lg:col-span-3 space-y-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center w-full p-6 rounded-[2rem] transition-all space-x-4 border-2 ${activeCategory === cat.id
                                ? 'bg-ffn-black text-white border-ffn-black shadow-2xl'
                                : 'bg-white text-gray-400 border-transparent hover:border-gray-100'
                                }`}
                        >
                            <cat.icon className={`w-5 h-5 ${activeCategory === cat.id ? 'text-ffn-primary' : ''}`} />
                            <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                        </button>
                    ))}

                    <div className="p-8 bg-ffn-black text-white rounded-[2.5rem] mt-12 space-y-6 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-accent/20 blur-3xl rounded-full" />
                        <Bell className="w-8 h-8 opacity-50 group-hover:scale-110 transition-transform" />
                        <div className="space-y-1">
                            <h4 className="text-lg font-serif italic">Alert Mastery</h4>
                            <p className="text-[8px] uppercase tracking-widest opacity-60">Focus protocol active</p>
                        </div>
                        <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all">
                            Configure Filters
                        </button>
                    </div>
                </aside>

                {/* Main Feed */}
                <div className="lg:col-span-6 space-y-6">
                    <AnimatePresence mode="popLayout">
                        {filteredMessages.map((msg) => (
                            <m.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => setSelectedProtocol(msg)}
                                className={`group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:border-ffn-primary/20 transition-all cursor-pointer relative ${msg.unread ? 'border-l-4 border-l-ffn-primary' : ''}`}
                            >
                                <div className="flex items-start gap-6">
                                    <div className="relative flex-none">
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden border border-gray-100 shadow-md">
                                            <img src={msg.sender.avatar} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${msg.status === 'online' ? 'bg-emerald-500' : msg.status === 'busy' ? 'bg-ffn-primary' : 'bg-gray-300'
                                            }`} />
                                    </div>

                                    <div className="flex-1 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-serif italic text-ffn-black leading-none group-hover:text-ffn-primary transition-colors">{msg.sender.name}</h3>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1 inline-block">{msg.sender.role}</span>
                                            </div>
                                            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>

                                        <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed">
                                            {msg.lastMessage}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${getUrgencyColor(msg.urgency)}`}>
                                                {msg.urgency} Urgency
                                            </span>
                                            {msg.category === 'CASTING' && (
                                                <span className="px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/10 text-emerald-500">
                                                    Shortlisted
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </AnimatePresence>

                    {filteredMessages.length === 0 && (
                        <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border-2 border-dashed border-gray-100">
                            <h3 className="text-2xl font-serif italic text-gray-300">Clean Protocol</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-300">No active threads in this category</p>
                        </div>
                    )}
                </div>

                {/* Activity Feed Sidebar */}
                <aside className="lg:col-span-3 space-y-10">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-serif italic text-ffn-black">System Pulse</h3>
                            <ActivityNodeIcon type="APPLICATION" />
                        </div>

                        <div className="space-y-6">
                            {MOCK_ACTIVITY_NODES.map((node) => (
                                <div key={node.id} className="relative pl-8 pb-8 last:pb-0 border-l border-gray-100 last:border-0">
                                    <div className="absolute top-0 -left-1.5 w-3 h-3 rounded-full bg-white border-2 border-ffn-primary" />
                                    <div className="space-y-2">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-ffn-black leading-tight">
                                            {node.title}
                                        </p>
                                        <p className="text-[10px] font-medium text-gray-400 leading-relaxed">
                                            {node.description}
                                        </p>
                                        <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest block">
                                            {new Date(node.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {node.status === 'action-required' && (
                                            <button
                                                title="Resolve Activity"
                                                className="mt-2 text-[8px] font-black uppercase tracking-[0.2em] text-ffn-primary hover:underline"
                                            >
                                                Resolve Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 bg-gradient-to-br from-indigo-500 to-ffn-primary rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                        <h4 className="text-xl font-serif italic relative z-10">Escrow Security</h4>
                        <p className="text-xs opacity-80 mt-2 font-medium leading-relaxed relative z-10">
                            All financial nodes are encrypted. Payments automatically release 72h after proof of work delivery.
                        </p>
                        <ArrowUpRight className="w-12 h-12 absolute -bottom-2 -right-2 opacity-10 group-hover:scale-150 transition-transform" />
                    </div>
                </aside>
            </div>

            {/* Protocol Detail Modal Overlay */}
            <AnimatePresence>
                {selectedProtocol && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-ffn-black/80 backdrop-blur-xl">
                        <m.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-5xl h-[85vh] bg-white rounded-[4rem] overflow-hidden relative shadow-2xl flex flex-col"
                        >
                            <button
                                onClick={() => setSelectedProtocol(null)}
                                className="absolute top-8 right-8 z-50 p-4 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all shadow-sm"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <ProtocolDetailView protocol={selectedProtocol} onClose={() => setSelectedProtocol(null)} />
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ActivityNodeIcon: React.FC<{ type: ActivityNode['type'] }> = ({ type }) => {
    switch (type) {
        case 'APPLICATION': return <Target className="w-4 h-4 text-ffn-primary" />;
        case 'MILESTONE': return <Clock className="w-4 h-4 text-amber-500" />;
        case 'PAYMENT': return <Zap className="w-4 h-4 text-emerald-500" />;
        default: return <MessageSquare className="w-4 h-4 text-blue-500" />;
    }
};
