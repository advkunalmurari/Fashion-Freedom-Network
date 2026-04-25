import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Globe, Users, Hash, MessageCircle, ArrowRight, Zap, UserPlus, Check, X, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { networkService } from '../services/networkService';
import { MagneticButton } from './MagneticButton';

export const Network: React.FC = () => {
  const [activeNetworkTab, setActiveNetworkTab] = useState<'channels' | 'requests'>('channels');
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (activeNetworkTab === 'requests') {
      loadRequests();
    }
  }, [activeNetworkTab]);

  const loadRequests = async () => {
    setIsLoading(true);
    const res = await networkService.getConnectionRequests();
    if (res.success) {
      setRequests(res.data || []);
    }
    setIsLoading(false);
  };

  const handleRespond = async (requestId: string, status: 'accepted' | 'declined') => {
    setRequests(prev => prev.filter(r => r.id !== requestId));
    const res = await networkService.respondToConnectionRequest(requestId, status);
    if (!res.success) {
      loadRequests();
      console.error("Failed to respond to request:", res.error);
    }
  };

  const channels = [
    { name: 'LUX-MINIMAL', members: '1.2k', active: true, desc: 'High-end minimalist aesthetic discussion.', badge: 'CURATED' },
    { name: 'SUSTAINABLE-LAB', members: '840', active: false, desc: 'Eco-friendly textiles and production.', badge: 'TECH' },
    { name: 'REEL-CREATIVES', members: '3.4k', active: true, desc: 'Tips for high-impact fashion video.', badge: 'MOMENTUM' },
    { name: 'MILAN-TALENT', members: '450', active: true, desc: 'Local coordination for Milan FW.', badge: 'LOCAL' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      {/* Neo-Noir Background Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-ffn-black">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ffn-primary/10 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ffn-accent/10 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
      </div>

      <header className="space-y-8 relative z-10 px-4 md:px-0 pt-8">
        <div className="flex items-center space-x-3 text-ffn-primary">
          <Globe className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Global Creative Graph</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-white leading-none">
              Identity <br className="hidden md:block" /> <span className="text-ffn-primary not-italic font-bold">Protocol.</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-xl font-light">Securely manage your professional relationships and access encrypted collaborative spaces across the FFN network.</p>
          </div>

          {/* Glassmorphic Tab Switcher */}
          <div className="flex bg-white/5 backdrop-blur-md p-1.5 rounded-full border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
            <button
              onClick={() => setActiveNetworkTab('channels')}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeNetworkTab === 'channels' ? 'bg-white text-ffn-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/40 hover:text-white'}`}
            >
              Channels
            </button>
            <button
              onClick={() => setActiveNetworkTab('requests')}
              className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeNetworkTab === 'requests' ? 'bg-white text-ffn-black shadow-[0_0_20px_rgba(255,255,255,0.3)]' : 'text-white/40 hover:text-white'}`}
            >
              Requests
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-ffn-accent text-white text-[10px] flex items-center justify-center rounded-full border border-ffn-black shadow-[0_0_10px_rgba(255,42,85,0.8)] font-black">{requests.length}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {activeNetworkTab === 'channels' ? (
          <m.div
            key="channels"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4 md:px-0 relative z-10"
          >
            {channels.map((channel, idx) => (
              <div key={idx} className="bg-[#111] backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/5 hover:border-ffn-primary/30 group cursor-pointer hover:shadow-[0_0_40px_rgba(99,102,241,0.1)] transition-all duration-500 overflow-hidden relative">

                <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-primary/10 blur-[50px] rounded-full group-hover:bg-ffn-primary/20 transition-all"></div>

                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-white/80 group-hover:bg-ffn-primary group-hover:text-white transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                    <Hash className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[8px] font-bold text-ffn-primary uppercase tracking-widest">{channel.badge}</span>
                    <div className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <Users className="w-3 h-3" />
                      <span>{channel.members} Nodes</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="flex items-center space-x-4">
                    <h3 className="text-3xl font-sans font-black tracking-tighter uppercase text-white leading-none">{channel.name}</h3>
                    {channel.active && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.8)] animate-pulse"></span>
                    )}
                  </div>
                  <p className="text-sm text-white/50 font-light leading-relaxed">{channel.desc}</p>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#111] overflow-hidden shadow-lg"><img src={`https://i.pravatar.cc/100?img=${i * 10}`} className="w-full h-full object-cover" alt="" /></div>
                    ))}
                  </div>
                  <button className="flex items-center space-x-3 w-10 h-10 rounded-full bg-white/5 justify-center group-hover:bg-ffn-primary text-white transition-all" title="Enter Channel">

                    <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </m.div>
        ) : (
          <m.div
            key="requests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 px-4 md:px-0 relative z-10"
          >
            {isLoading && (
              <div className="flex flex-col items-center justify-center py-32 text-ffn-primary">
                <div className="relative">
                  <Loader2 className="w-12 h-12 animate-spin mb-6 relative z-10" />
                  <div className="absolute inset-0 bg-ffn-primary blur-[20px] opacity-30 animate-pulse"></div>
                </div>
                <p className="text-[12px] uppercase tracking-[0.5em] font-black tracking-widest text-white">Decrypting Network Graph...</p>
              </div>
            )}

            {!isLoading && requests.length === 0 && (
              <div className="p-20 text-center bg-white/5 backdrop-blur-sm rounded-[3rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8 border border-white/10">
                  <UserPlus className="w-10 h-10 text-white/40" />
                </div>
                <h3 className="text-3xl font-serif italic text-white mb-2">Zero Pending Operations</h3>
                <p className="text-[10px] uppercase tracking-widest font-bold text-white/40">Explore the directory to construct new neural pathways.</p>
              </div>
            )}

            {!isLoading && requests.map((request, idx) => (
              <m.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-[#111] p-8 rounded-[2.5rem] border border-white/5 hover:border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between group gap-6"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                    <img src={request.sender.avatar_url} className="w-full h-full object-cover" alt="" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <h4 className="text-2xl font-serif italic text-white leading-none">{request.sender.full_name}</h4>
                      <span className="text-[8px] px-3 py-1 bg-ffn-primary/20 text-ffn-primary rounded-full font-black uppercase tracking-widest border border-ffn-primary/30">{request.sender.role}</span>
                    </div>
                    <p className="text-[9px] uppercase tracking-widest text-white/40 font-bold mb-3">{request.sender.location} &bull; Security Level 2</p>
                    {request.pitch && (
                      <p className="text-[12px] italic text-white/60 bg-white/5 px-4 py-2 rounded-xl border-l-[3px] border-ffn-primary">"{request.pitch}"</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3 w-full md:w-auto mt-4 md:mt-0">
                  <button onClick={() => handleRespond(request.id, 'accepted')} className="flex-1 md:flex-none py-4 px-8 bg-white text-ffn-black rounded-xl hover:bg-ffn-primary hover:text-white transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]">
                    <Check className="w-4 h-4" /> <span>Accept</span>
                  </button>
                  <button onClick={() => handleRespond(request.id, 'declined')} className="flex-1 md:flex-none p-4 bg-white/5 text-white/40 rounded-xl hover:bg-ffn-accent hover:text-white transition-all flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-transparent hover:border-ffn-accent/50" title="Decline Connection">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </m.div>
            ))}
          </m.div>
        )}
      </AnimatePresence>

      <section className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-[4rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 text-white relative overflow-hidden mx-4 md:mx-0 shadow-2xl border border-white/5">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-ffn-accent/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-ffn-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

        <div className="space-y-6 text-center md:text-left relative z-10 flex-1">
          <div className="flex items-center justify-center md:justify-start space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/50">Enterprise Protocol</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-serif italic tracking-tighter leading-none text-white drop-shadow-lg">Elevate your <br className="hidden md:block" /> <span className="text-ffn-primary not-italic font-black">Influence.</span></h2>
          <p className="text-sm md:text-base text-white/60 font-light leading-relaxed max-w-lg mx-auto md:mx-0">Upgrade to a verified identity node to unlock encrypted channels, priority connection routing, and algorithm boosts.</p>
        </div>

        <div className="relative z-10 w-full md:w-auto flex justify-center">
          <MagneticButton strength={0.4}>
            <button className="w-full md:w-auto px-12 py-8 bg-white text-ffn-black rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center gap-4 group">
              <span>Initiate Upgrade</span>
              <Sparkles className="w-4 h-4 text-ffn-accent group-hover:scale-125 transition-transform" />
            </button>
          </MagneticButton>
        </div>
      </section>
    </div>
  );
};

