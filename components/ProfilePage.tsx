
import React, { useState, useEffect } from 'react';
import { User, UserRole, VerificationLevel, Post } from '../types';
import { postService } from '../services/postService';
import {
  MapPin, Instagram, Mail, Share2, Grid, CheckCircle, ArrowLeft, ShieldCheck,
  ExternalLink, Briefcase, FileText, Download, X, Star, Sparkles, Send, Loader2,
  UserPlus, UserCheck, UserMinus, MessageSquarePlus, Zap, Bookmark, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { networkService } from '../services/networkService';
import { messageService } from '../services/messageService';
import { supabase } from '../supabase';
import { SavedPosts } from './SavedPosts';
import { PayPalButton } from './PayPalButton';
import { MOCK_BRANDS } from '../constants';

export const ProfilePage: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
  const [showModelCard, setShowModelCard] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'connected'>('none');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [connectPitch, setConnectPitch] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [activeView, setActiveView] = useState<'portfolio' | 'saved' | 'reviews' | 'collaborations'>('portfolio');
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [portfolioPosts, setPortfolioPosts] = useState<Post[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUserId(session?.user.id || null);
    });
    checkNetworkStatus();
  }, [user.id]);

  const isOwnProfile = currentUserId === user.id;

  const checkNetworkStatus = async () => {
    const [following, connStatus] = await Promise.all([
      networkService.getFollowStatus(user.id),
      networkService.getConnectionStatus(user.id)
    ]);
    setIsFollowing(following);
    setConnectionStatus(connStatus);
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      setIsPortfolioLoading(true);
      const res = await postService.getUserPosts(user.id);
      if (res.success && res.data) {
        setPortfolioPosts(res.data);
      }
      setIsPortfolioLoading(false);
    };
    fetchPortfolio();
  }, [user.id]);

  const handleFollow = async () => {
    setIsActionLoading(true);
    if (isFollowing) {
      const res = await networkService.unfollowUser(user.id);
      if (res.success) setIsFollowing(false);
    } else {
      const res = await networkService.followUser(user.id);
      if (res.success) setIsFollowing(true);
    }
    setIsActionLoading(false);
  };

  const handleConnect = async () => {
    setIsActionLoading(true);
    const res = await networkService.sendConnectionRequest(user.id, connectPitch);
    if (res.success) {
      setConnectionStatus('pending_sent');
      setShowConnectModal(false);
    }
    setIsActionLoading(false);
  };

  const handleMessageTransition = async () => {
    setIsActionLoading(true);
    const res = await messageService.sendMessage(user.id, "Hi! I'd like to collaborate.", undefined);
    if (res.success) {
      window.location.href = `/messages?chatId=${res.chatId}`;
    }
    setIsActionLoading(false);
  };

  const handleDownloadCard = async () => {
    setIsGeneratingCard(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGeneratingCard(false);
    alert("Professional Composite Generated. Protocol download initiated.");
  };

  const VerificationBadge = ({ level }: { level: VerificationLevel }) => {
    const badges = [
      null,
      <CheckCircle className="w-6 h-6 text-blue-500 fill-blue-500" />,
      <div className="flex items-center space-x-1 bg-gradient-pride p-1.5 rounded-full shadow-lg"><Star className="w-4 h-4 text-white fill-white" /></div>,
      <div className="flex items-center space-x-1 bg-ffn-black p-1.5 rounded-full shadow-2xl border border-white/20"><Sparkles className="w-4 h-4 text-ffn-accent animate-pulse" /></div>
    ];
    return badges[level] || null;
  };

  return (
    <div className="animate-in fade-in duration-700 pb-32">
      <button
        onClick={onBack}
        className="mb-12 flex items-center space-x-3 text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 hover:text-ffn-primary transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" /> <span>Back to Directory</span>
      </button>

      <div className="space-y-20">
        <section className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="w-full lg:w-2/5 aspect-[4/5] bg-white rounded-[3rem] border border-gray-100 overflow-hidden relative shadow-2xl">
            <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.displayName} />
            <div className="absolute top-8 right-8 flex flex-col space-y-4">
              <button className="glass-card-vibrant p-4 rounded-2xl border border-white/20 shadow-xl hover:scale-110 transition-all" title="Share Profile"><Share2 className="w-5 h-5 text-ffn-black" /></button>
              <button
                onClick={() => setShowModelCard(true)}
                className="glass-card-vibrant p-4 rounded-2xl border border-white/20 shadow-xl hover:scale-110 transition-all text-ffn-primary"
                title="Professional Model Card"
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-12 pt-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black leading-none">{user.displayName}</h1>
                <VerificationBadge level={user.verificationLevel} />
              </div>
              <div className="flex items-center gap-6">
                <span className="text-[10px] uppercase tracking-[0.5em] font-bold bg-ffn-primary text-white px-6 py-2 rounded-full shadow-lg shadow-ffn-primary/20">{user.role}</span>
                <span className="text-[10px] uppercase tracking-[0.5em] text-gray-400 font-bold flex items-center">
                  <MapPin className="w-3 h-3 mr-2 text-ffn-primary" /> {user.location}
                </span>
              </div>
            </div>

            <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-600 max-w-2xl italic">"{user.bio}"</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-gray-100">
              {user.height && <div className="space-y-1"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Height</p><p className="text-2xl font-serif italic text-ffn-black">{user.height}</p></div>}
              {user.measurements && <div className="space-y-1"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Measurements</p><p className="text-2xl font-serif italic text-ffn-black">{user.measurements}</p></div>}
              <div className="space-y-1"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Daily Rate</p><p className="text-2xl font-serif italic text-emerald-600 font-bold">{user.currency || 'INR'} {user.dailyRate || '15,000'}</p></div>
              <div className="space-y-1"><p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">Availability</p>
                <div className="flex items-center space-x-2 mt-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${user.availabilityStatus === 'busy' ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'}`}></div>
                  <p className={`text-sm font-bold uppercase ${user.availabilityStatus === 'busy' ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {user.availabilityStatus === 'busy' ? 'Busy' : 'Available'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleFollow}
                disabled={isActionLoading}
                className={`flex-1 py-5 rounded-[1.5rem] text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all shadow-lg ${isFollowing ? 'bg-gray-100 text-gray-500 hover:bg-ffn-accent hover:text-white' : 'bg-ffn-primary text-white hover:bg-ffn-black shadow-ffn-primary/20'}`}
              >
                {isFollowing ? <><UserMinus className="w-4 h-4" /> <span>Unfollow</span></> : <><UserPlus className="w-4 h-4" /> <span>Follow Profile</span></>}
              </button>

              <button
                onClick={() => connectionStatus === 'none' && setShowConnectModal(true)}
                disabled={isActionLoading || connectionStatus !== 'none'}
                className={`flex-1 py-5 rounded-[1.5rem] text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all shadow-lg ${connectionStatus === 'connected' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : connectionStatus.startsWith('pending') ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-ffn-black text-white hover:bg-ffn-primary shadow-ffn-black/20'}`}
              >
                {connectionStatus === 'connected' ? <><UserCheck className="w-4 h-4" /> <span>Connected</span></> :
                  connectionStatus === 'pending_sent' ? <><Loader2 className="w-4 h-4 animate-spin" /> <span>Request Sent</span></> :
                    connectionStatus === 'pending_received' ? <><CheckCircle className="w-4 h-4" /> <span>Accept Request</span></> :
                      <><Zap className="w-4 h-4" /> <span>Send Connection</span></>}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setShowHireModal(true)}
                className="bg-emerald-50 text-emerald-600 border border-emerald-100 flex-1 py-7 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 group hover:bg-emerald-600 hover:text-white transition-all shadow-xl"
              >
                <Briefcase className="w-5 h-5" /> <span>Hire Now</span>
              </button>
              <button
                onClick={handleMessageTransition}
                disabled={isActionLoading}
                className="bg-ffn-black text-white flex-1 py-7 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 group hover:bg-ffn-primary transition-all shadow-xl"
              >
                <MessageSquarePlus className="w-5 h-5" /> <span>Message</span>
              </button>
              <button onClick={() => setShowModelCard(true)} className="bg-white border border-gray-100 text-ffn-black flex-1 py-7 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all shadow-sm">
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-ffn-primary" /> <span>Composite</span>
              </button>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase... */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-gray-100 pb-10">
            <h3 className="text-3xl font-serif italic text-ffn-black">
              {activeView === 'portfolio' ? 'Professional Showcase' : 'Curated Collections'}
            </h3>
            <div className="flex items-center space-x-8 text-[10px] uppercase tracking-widest font-bold text-gray-400">
              <button
                onClick={() => setActiveView('portfolio')}
                className={`transition-all pb-10 -mb-[41px] ${activeView === 'portfolio' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
              >
                Portfolio
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveView('saved')}
                  className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'saved' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Saved</span>
                </button>
              )}
              <button
                onClick={() => setActiveView('collaborations')}
                className={`transition-all pb-10 -mb-[41px] ${activeView === 'collaborations' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
              >
                Collaborators
              </button>
              <button
                onClick={() => setActiveView('reviews')}
                className={`transition-all pb-10 -mb-[41px] ${activeView === 'reviews' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
              >
                Reputation
              </button>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {activeView === 'portfolio' ? (
              <motion.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {isPortfolioLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-ffn-primary" /></div>
                ) : portfolioPosts.length > 0 ? (
                  <div className="editorial-grid pt-4">
                    {portfolioPosts.map(post => (
                      <div key={post.id} className="aspect-[3/4] overflow-hidden group rounded-[2.5rem] border border-gray-100 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 relative">
                        <img src={post.mediaUrls[0]} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt="" />
                        {post.type === 'VIDEO' && (
                          <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md p-2 rounded-full">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-[4rem] p-32 text-center space-y-8 border-2 border-dashed border-gray-200">
                    <div className="flex justify-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-xl">
                        <Grid className="w-10 h-10" />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-serif italic text-gray-400">Empty Portfolio</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">This talent hasn't published any work yet. Check back soon for their latest shoots and campaigns.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ) : activeView === 'saved' ? (
              <motion.div
                key="saved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SavedPosts onBack={() => setActiveView('portfolio')} />
              </motion.div>
            ) : activeView === 'collaborations' ? (
              <motion.div
                key="collaborations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {MOCK_BRANDS.slice(0, 4).map((brand, idx) => (
                    <div key={idx} className="bg-white rounded-[2rem] p-6 border border-gray-100 flex items-center space-x-6 shadow-sm hover:shadow-lg transition-all cursor-pointer">
                      <img src={brand.logo_url} alt={brand.brand_name} className="w-14 h-14 rounded-full object-cover bg-gray-50 border border-ffn-primary/10" />
                      <div>
                        <h4 className="font-serif italic text-lg text-ffn-black leading-tight">{brand.brand_name}</h4>
                        <p className="text-[8px] uppercase tracking-widest text-ffn-primary font-bold bg-ffn-primary/5 inline-block px-2 py-1 rounded-sm mt-1">{brand.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="flex gap-8 mb-12">
                  <div className="bg-gray-50 rounded-[3rem] p-10 flex-1 flex flex-col items-center justify-center text-center">
                    <p className="text-6xl font-serif italic text-ffn-black">{user.avgRating || '5.0'}</p>
                    <div className="flex space-x-1 my-4 text-ffn-primary">
                      <Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" /><Star className="w-5 h-5 fill-current" />
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Average Rating</p>
                  </div>
                  <div className="bg-emerald-50 rounded-[3rem] p-10 flex-1 flex flex-col items-center justify-center text-center border border-emerald-100">
                    <p className="text-6xl font-serif italic text-emerald-600">{user.reliabilityScore || '98'}%</p>
                    <div className="flex space-x-2 items-center my-4 text-emerald-600 font-bold uppercase tracking-widest text-[10px]">
                      <ShieldCheck className="w-4 h-4" /> <span>On-Time Arrival</span>
                    </div>
                    <p className="text-[10px] uppercase font-black tracking-widest text-emerald-500/60">Reliability Score</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {[1, 2, 3].map((_, i) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <img src={`https://i.pravatar.cc/150?img=${30 + i}`} className="w-12 h-12 rounded-full object-cover" alt="Reviewer" />
                          <div>
                            <p className="text-sm font-bold text-ffn-black">Verified Client {i + 1}</p>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400">Condé Nast • Fashion Editorial</p>
                          </div>
                        </div>
                        <div className="flex space-x-1 text-ffn-primary">
                          <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" />
                        </div>
                      </div>
                      <p className="text-gray-600 font-light text-sm px-16 italic">"Absolute professional to work with. Brought great energy to set, knew their angles, and needed very little direction. Highly recommend for high-fashion editorial work."</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Model Card Generator Modal */}
      <AnimatePresence>
        {showModelCard && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-ffn-black/90 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl h-[90vh] rounded-[4rem] overflow-hidden relative flex flex-col md:flex-row shadow-2xl">
              <button title="Close Model Card" onClick={() => setShowModelCard(false)} className="absolute top-10 right-10 z-50 p-4 bg-gray-100 rounded-2xl hover:bg-ffn-black hover:text-white transition-all"><X className="w-6 h-6" /></button>

              <div className="md:w-1/2 bg-gray-100 p-0 relative h-1/2 md:h-full group">
                <img src={user.avatarUrl} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" alt="" />
                <div className="absolute top-10 left-10 p-6 bg-white/20 backdrop-blur-3xl border border-white/40 rounded-3xl shadow-2xl">
                  <div className="text-white font-serif font-bold text-2xl tracking-tighter">FFN MASTER HUB</div>
                </div>
              </div>

              <div className="md:w-1/2 p-16 md:p-20 flex flex-col justify-between overflow-y-auto no-scrollbar">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary">Official Identity Record</p>
                    <h2 className="text-6xl font-serif italic text-ffn-black tracking-tight leading-none">{user.displayName}</h2>
                    <div className="flex items-center space-x-3"><span className="text-[10px] uppercase tracking-widest font-black text-gray-400">{user.role}</span><VerificationBadge level={user.verificationLevel} /></div>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-2"><p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Height</p><p className="text-xl font-serif italic text-ffn-black">{user.height || 'Standard'}</p></div>
                    <div className="space-y-2"><p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Measurements</p><p className="text-xl font-serif italic text-ffn-black">{user.measurements || 'Standard'}</p></div>
                    <div className="space-y-2"><p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Hub Identity</p><p className="text-xl font-serif italic text-ffn-black">ffn.world/{user.username}</p></div>
                    <div className="space-y-2"><p className="text-[8px] uppercase tracking-widest font-black text-gray-400">Operating Base</p><p className="text-xl font-serif italic text-ffn-black">{user.location}</p></div>
                  </div>
                </div>

                <div className="pt-20 space-y-10">
                  <div className="grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square rounded-2xl bg-gray-100 overflow-hidden"><img src={`https://picsum.photos/id/${150 + i}/200/200`} className="w-full h-full object-cover" alt="" /></div>)}
                  </div>
                  <button
                    onClick={handleDownloadCard}
                    disabled={isGeneratingCard}
                    className="w-full bg-ffn-black text-white py-8 rounded-[2.5rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-3xl hover:bg-ffn-primary transition-all"
                  >
                    {isGeneratingCard ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    <span>{isGeneratingCard ? 'Generating Composite...' : 'Download Model Card (PDF)'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Connection Pitch Modal */}
      <AnimatePresence>
        {showConnectModal && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-6 bg-ffn-black/60 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-lg rounded-[3.5rem] p-12 space-y-8 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-1"><h3 className="text-3xl font-serif italic text-ffn-black">Identity Pitch</h3><p className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-400">Networking Protocol</p></div>
                <button title="Close Connect Modal" onClick={() => setShowConnectModal(false)} className="p-4 bg-gray-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-6">
                <p className="text-sm text-gray-500 font-light leading-relaxed">Briefly introduce yourself and why you'd like to professionally connect with <span className="font-bold text-ffn-black">{user.displayName}</span>.</p>
                <textarea
                  value={connectPitch}
                  onChange={(e) => setConnectPitch(e.target.value)}
                  className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm h-40 resize-none focus:ring-2 focus:ring-ffn-primary/20 transition-all"
                  placeholder="e.g. I'm a photographer looking for models for a next-gen editorial shoot..."
                />
                <button
                  onClick={handleConnect}
                  disabled={isActionLoading}
                  className="w-full bg-ffn-black text-white py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 shadow-2xl hover:bg-ffn-primary transition-all disabled:opacity-50"
                >
                  {isActionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
                  <span>Activate Connection</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Hire Modal... */}
      <AnimatePresence>
        {showHireModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-ffn-black/60 backdrop-blur-md">
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-xl rounded-[3.5rem] p-12 md:p-16 space-y-12 shadow-2xl">
              <div className="flex items-center justify-between">
                <div className="space-y-1"><h3 className="text-3xl font-serif italic text-ffn-black">Secure Hiring Escrow</h3><p className="text-[9px] uppercase tracking-[0.3em] font-black text-gray-400">AUTHORITY DISCOVERY PROTOCOL</p></div>
                <button title="Close Hire Modal" onClick={() => setShowHireModal(false)} className="p-4 bg-gray-50 rounded-2xl"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-8">
                <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Project Title</label><input title="Project Title" required className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm" placeholder="e.g. Vogue Summer Editorial" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Start Date</label><input title="Start Date" type="date" required className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm" /></div>
                  <div className="space-y-2"><label className="text-[10px] uppercase tracking-widest font-black text-gray-400">Escrow Deposit</label><input title="Escrow Deposit" type="text" readOnly value={`$250.00`} className="w-full bg-gray-50 border-none rounded-2xl p-5 text-sm font-bold text-emerald-600" /></div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-[10px] uppercase tracking-widest font-black text-ffn-primary mb-6 text-center">Secure Talent Deposit</p>
                  <PayPalButton
                    amount="250.00"
                    currency="USD"
                    type="capture"
                    onSuccess={(data) => {
                      alert(`Talent Hired Successfully! Contract initiated via Order ${data.id}. Both parties will be notified.`);
                      setShowHireModal(false);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
