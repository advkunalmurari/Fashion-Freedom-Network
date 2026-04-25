import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Heart, Share2, ShoppingBag, Eye, Star, ChevronRight, Zap, PlayCircle, Maximize2 } from 'lucide-react';
import { MOCK_TALENT_POOL, MOCK_BRANDS } from '../constants';

interface LiveRunwayProps {
    eventId: string;
    onClose: () => void;
}

interface ChatMessage {
    id: string;
    user: typeof MOCK_TALENT_POOL[0];
    text: string;
    timestamp: string;
}

export const LiveRunway: React.FC<LiveRunwayProps> = ({ eventId, onClose }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const [showShop, setShowShop] = useState(false);
    const [viewerCount, setViewerCount] = useState(12435);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const currentUser = MOCK_TALENT_POOL[1]; // Kiara

    // Simulated Chat Stream
    useEffect(() => {
        const interval = setInterval(() => {
            const randomUser = MOCK_TALENT_POOL[Math.floor(Math.random() * MOCK_TALENT_POOL.length)];
            setMessages(prev => [
                ...prev.slice(-49), // Keep last 50 messages
                {
                    id: Math.random().toString(36).substr(2, 9),
                    user: randomUser,
                    text: ['Incredible silhouette!', 'Need that jacket ASAP 🔥', 'The staging is breathtaking.', 'Sabya never misses.', 'Wait till the finale...'][Math.floor(Math.random() * 5)],
                    timestamp: new Date().toISOString()
                }
            ]);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Simulated Viewer Count Fluctuation
    useEffect(() => {
        const interval = setInterval(() => {
            setViewerCount(prev => prev + Math.floor(Math.random() * 50) - 20);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            user: currentUser,
            text: inputText,
            timestamp: new Date().toISOString()
        }]);
        setInputText('');
    };

    const handleReaction = () => {
        // Fire floating hearts (handled visually via CSS or a separate effect component if complex)
        // For now, it's a simple interaction trigger.
    };

    return (
        <AnimatePresence>
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black text-white font-sans flex"
            >
                {/* Main Video Area */}
                <div className="flex-1 relative bg-zinc-900 overflow-hidden">
                    {/* Simulated Video Feed */}
                    <video
                        src="https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_08_GOPR5261_preview.mp4"
                        autoPlay
                        loop
                        muted
                        className="w-full h-full object-cover opacity-80"
                    />

                    {/* Header Overlay */}
                    <div className="absolute top-0 inset-x-0 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
                        <div className="flex items-center space-x-6">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-ffn-primary">
                                <img src={MOCK_BRANDS[1].logo_url} alt="Brand" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="flex items-center space-x-3">
                                    <h2 className="text-xl font-black uppercase tracking-widest">{MOCK_BRANDS[1].brand_name}</h2>
                                    <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase tracking-widest animate-pulse rounded-full">Live</span>
                                </div>
                                <p className="text-xs text-white/60 uppercase tracking-widest mt-1">Heritage Bridal 2025 • Runway Debut</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-2 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                                <Eye className="w-4 h-4 text-ffn-primary" />
                                <span className="text-xs font-bold font-mono">{viewerCount.toLocaleString()}</span>
                            </div>
                            <button onClick={onClose} className="p-4 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors" title="Leave Live Stream">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Interactive Toggle for Shop Drawer */}
                    <div className="absolute left-8 bottom-8 flex flex-col space-y-4">
                        <button
                            onClick={() => setShowShop(true)}
                            className="group flex items-center space-x-4 bg-white/10 backdrop-blur-xl border border-white/20 p-2 pr-6 rounded-full hover:bg-white/20 transition-all shadow-2xl"
                        >
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/50 group-hover:border-ffn-primary transition-colors">
                                <img src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=400" alt="Current Look" className="w-full h-full object-cover" />
                            </div>
                            <div className="text-left">
                                <p className="text-[9px] font-black uppercase tracking-widest text-ffn-primary">On Runway Now</p>
                                <p className="text-sm font-bold mt-0.5">Look 24: Crimson Lehnegga</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors ml-4" />
                        </button>
                    </div>
                </div>

                {/* Right Sidebar: Chat & Interactions */}
                <div className="w-[450px] bg-zinc-950 border-l border-zinc-800 flex flex-col relative z-20">

                    {/* Chat Stream */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                        <div className="text-center pb-4 border-b border-zinc-800/50 mb-6">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Welcome to the Front Row</p>
                        </div>
                        {messages.map((msg) => (
                            <m.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-start space-x-4"
                            >
                                <img src={msg.user.avatarUrl} alt={msg.user.username} className="w-8 h-8 rounded-full border border-zinc-800 flex-none object-cover" />
                                <div>
                                    <div className="flex items-baseline space-x-2">
                                        <span className="text-xs font-bold text-white/80">{msg.user.username}</span>
                                        {msg.user.isVerified && <Star className="w-3 h-3 text-ffn-primary" />}
                                    </div>
                                    <p className="text-sm text-zinc-300 mt-1 leading-snug">{msg.text}</p>
                                </div>
                            </m.div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Chat Input & Global Actions */}
                    <div className="p-6 bg-zinc-950 border-t border-zinc-800 space-y-6">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Join the conversation..."
                                className="w-full bg-zinc-900 border border-zinc-800 rounded-full py-4 pl-6 pr-14 text-sm focus:outline-none focus:border-zinc-600 transition-colors"
                            />
                            <button
                                type="submit"
                                disabled={!inputText.trim()}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-ffn-black text-white rounded-full disabled:opacity-50 disabled:bg-zinc-800 hover:scale-105 transition-all"
                                title="Send Message"
                            >
                                <Zap className="w-4 h-4" />
                            </button>
                        </form>

                        <div className="flex items-center justify-between">
                            <div className="flex space-x-4">
                                <button onClick={handleReaction} className="p-4 bg-zinc-900 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors" title="React">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <button className="p-4 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors" title="Share Stream">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                            <button
                                onClick={() => setShowShop(true)}
                                className="flex items-center justify-center space-x-3 flex-1 ml-4 bg-white text-black py-4 rounded-full hover:bg-gray-200 transition-colors font-bold text-xs uppercase tracking-widest"
                            >
                                <ShoppingBag className="w-4 h-4" />
                                <span>Shop the Runway</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Overlay Drawer: Shop The Look */}
                <AnimatePresence>
                    {showShop && (
                        <>
                            <m.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm z-30"
                                onClick={() => setShowShop(false)}
                            />
                            <m.div
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="absolute right-0 top-0 bottom-0 w-[500px] bg-zinc-950 border-l border-zinc-800 z-40 flex flex-col"
                            >
                                <div className="p-8 border-b border-zinc-800 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-serif italic">Shop the Collection</h3>
                                        <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1">Live Sync Active</p>
                                    </div>
                                    <button onClick={() => setShowShop(false)} className="p-3 bg-zinc-900 rounded-full hover:bg-zinc-800 transition-colors">
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                    {/* Featured Item (Current Live) */}
                                    <div className="bg-zinc-900 rounded-3xl p-6 border border-ffn-primary/30 relative overflow-hidden group">
                                        <div className="absolute top-4 right-4 bg-ffn-primary text-black px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full z-10">
                                            On Runway Now
                                        </div>
                                        <div className="aspect-[4/5] rounded-2xl overflow-hidden mb-6 relative">
                                            <img src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=800" alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Maximize2 className="w-8 h-8 text-white" />
                                            </button>
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Look 24: Crimson Lehengga</h4>
                                        <p className="text-sm text-zinc-400 mb-6">Hand-embroidered silk with zardozi detailing. Custom fitted to order.</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-serif italic text-ffn-primary">₹3,45,000</span>
                                            <button className="px-8 py-4 bg-white text-black rounded-full text-xs font-bold hover:scale-105 transition-transform shadow-xl" title="Reserve Look">
                                                Reserve Look
                                            </button>
                                        </div>
                                    </div>

                                    {/* Previous Items */}
                                    <div className="space-y-4">
                                        <h5 className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-6">Previously Shown</h5>
                                        {[1, 2].map((i) => (
                                            <div key={i} className="flex gap-6 p-4 bg-zinc-900/50 rounded-2xl hover:bg-zinc-900 transition-colors border border-zinc-800">
                                                <div className="w-24 h-24 rounded-xl overflow-hidden flex-none">
                                                    <img src={`https://images.unsplash.com/photo-${i === 1 ? '1617137968427-85924c800a22' : '1552374196-1ab2a1c593e8'}?auto=format&fit=crop&q=80&w=400`} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col justify-center flex-1">
                                                    <h6 className="font-bold text-sm mb-1">Look {24 - i}: Essential {i === 1 ? 'Blazer' : 'Gown'}</h6>
                                                    <div className="flex items-center justify-between mt-auto">
                                                        <span className="text-sm font-serif italic text-zinc-400">₹{85000 + (i * 12000)}</span>
                                                        <button className="text-[10px] font-black text-white hover:text-ffn-primary uppercase tracking-wider transition-colors" title="View Details">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                </div>
                            </m.div>
                        </>
                    )}
                </AnimatePresence>

            </m.div>
        </AnimatePresence>
    );
};
