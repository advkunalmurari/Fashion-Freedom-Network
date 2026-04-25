import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    Send, Paperclip, MoreVertical, X,
    ArrowUpRight, Info, CheckCircle2,
    ShieldCheck, Zap, Briefcase, Target,
    Mic, Smile, Loader2
} from 'lucide-react';
import { ProtocolMessage } from '../types';

interface ProtocolDetailViewProps {
    protocol: ProtocolMessage;
    onClose: () => void;
}

export const ProtocolDetailView: React.FC<ProtocolDetailViewProps> = ({ protocol, onClose }) => {
    const [inputValue, setInputValue] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Mock initial conversation context
        setMessages([
            { id: 1, sender: 'them', text: protocol.lastMessage, timestamp: protocol.timestamp },
        ]);
    }, [protocol]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg = {
            id: Date.now(),
            sender: 'me',
            text: inputValue,
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, newMsg]);
        setInputValue('');

        // Simulate reply if it's a casting call
        if (protocol.category === 'CASTING') {
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'them',
                    text: "Protocol acknowledged. Our team is reviewing your Identity Portfolio. We will secure a War Room booking once ready.",
                    timestamp: new Date().toISOString()
                }]);
            }, 2000);
        }
    };

    return (
        <div className="flex h-full overflow-hidden">
            {/* Thread Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white border-r border-gray-50">
                {/* Protocol Header */}
                <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-white relative">
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                                <img src={protocol.sender.avatar} className="w-full h-full object-cover" alt="" />
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${protocol.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300'
                                }`} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif italic text-ffn-black leading-tight">{protocol.sender.name}</h2>
                            <p className="text-[9px] font-black uppercase tracking-widest text-ffn-primary mt-1">
                                {protocol.category} Protocol Active
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all shadow-sm" title="Protocol Info">
                            <Info className="w-5 h-5" />
                        </button>
                        <button className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all shadow-sm" title="Options">
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </header>

                {/* Conversation Body */}
                <div className="flex-1 p-10 overflow-y-auto no-scrollbar space-y-8 bg-gray-50/20">
                    <div className="flex flex-col items-center py-10 opacity-40">
                        <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-sm mb-4">
                            <ShieldCheck className="w-6 h-6 text-ffn-primary" />
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300 px-6 py-2 border border-gray-100 rounded-full">
                            Identity-Encrypted Feed
                        </span>
                    </div>

                    {messages.map((m) => (
                        <m.div
                            key={m.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md p-6 rounded-[2rem] text-sm font-medium leading-relaxed relative ${m.sender === 'me'
                                ? 'bg-ffn-black text-white rounded-tr-none shadow-xl'
                                : 'bg-white border border-gray-100 shadow-sm rounded-tl-none'
                                }`}>
                                {m.text}
                                <div className={`text-[8px] font-bold uppercase tracking-widest mt-4 ${m.sender === 'me' ? 'text-white/40' : 'text-gray-300'
                                    }`}>
                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>
                        </m.div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Protocol Input */}
                <div className="p-8 border-t border-gray-50 bg-white">
                    <div className="flex items-center space-x-4 bg-gray-50 rounded-[2.5rem] px-8 py-4 focus-within:ring-2 focus-within:ring-ffn-primary/20 transition-all">
                        <button className="p-2 text-gray-400 hover:text-ffn-black transition-colors" title="Attach Node">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Message protocol..."
                            className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-gray-300"
                        />
                        <div className="flex items-center space-x-2 text-gray-300 pr-4">
                            <Smile className="w-5 h-5 cursor-pointer hover:text-ffn-black transition-colors" />
                            <Mic className="w-5 h-5 cursor-pointer hover:text-ffn-black transition-colors" />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className="p-4 bg-ffn-black text-white rounded-2xl shadow-xl hover:bg-ffn-primary transition-all disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Context Sidebar */}
            <div className="w-96 p-10 space-y-12 bg-gray-50/10 overflow-y-auto no-scrollbar">
                <div className="text-center space-y-6">
                    <div className="w-40 h-40 rounded-[3rem] mx-auto overflow-hidden border-8 border-white shadow-2xl relative">
                        <img src={protocol.sender.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif italic text-ffn-black">{protocol.sender.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-2">{protocol.sender.role}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-100 pb-2">Contextual Actions</h4>

                    {protocol.category === 'CASTING' && (
                        <div className="space-y-3">
                            <button className="w-full p-6 bg-ffn-black text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-between group">
                                <span>Review Casting Brief</span>
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                            <button className="w-full p-6 bg-emerald-500 text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-between group">
                                <span>Accept Shortlist</span>
                                <CheckCircle2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {protocol.category === 'PROJECT' && (
                        <div className="space-y-3">
                            <button className="w-full p-6 bg-ffn-black text-white rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-between group">
                                <span>Enter War Room</span>
                                <Briefcase className="w-4 h-4" />
                            </button>
                            <button className="w-full p-6 bg-gray-100 text-ffn-black rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest shadow-sm flex items-center justify-between group">
                                <span>Asset Gallery</span>
                                <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <button
                        title="View Sender Identity Profile"
                        className="w-full py-5 bg-white border border-gray-100 text-gray-400 hover:text-ffn-black hover:border-ffn-black rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all"
                    >
                        View Identity Profile
                    </button>
                </div>

                <div className="p-8 bg-ffn-primary/5 rounded-[2.5rem] border border-ffn-primary/10 space-y-4">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Zap className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Protocol Intel</span>
                    </div>
                    <p className="text-[10px] font-medium text-gray-500 leading-relaxed italic">
                        "Your match score with this brand is 94%. High collaboration probability."
                    </p>
                </div>
            </div>
        </div>
    );
};
