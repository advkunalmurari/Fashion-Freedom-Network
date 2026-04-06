
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, DollarSign, ArrowRight, ShieldCheck, Briefcase, X, CheckCircle, Award, Sparkles, FileText, Send, User, Loader2, Plus, Building2, Mail, Calendar, Zap, BrainCircuit, Video, SlidersHorizontal } from 'lucide-react';
import { UserRole } from '../types';
import { PRICING, MOCK_TALENT_POOL } from '../constants';
import { castingService } from '../services/castingService';
import { LiveCastingRoom } from './LiveCastingRoom';
import { CastingCardPremium } from './CastingCardPremium';
import { InterviewApplicationFlow } from './InterviewApplicationFlow';

interface CastingItem {
  id: string;
  title: string;
  brand: string;
  location: string;
  budget: string;
  deadline: string;
  type: string;
  description: string;
  requirements: string[];
}

export const Castings: React.FC = () => {
  const [selectedCasting, setSelectedCasting] = useState<CastingItem | null>(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [activeLiveCastingId, setActiveLiveCastingId] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [castings, setCastings] = useState<CastingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pitchType, setPitchType] = useState<'text' | 'video'>('text');
  const [pitchText, setPitchText] = useState('');
  const [videoPitchUrl, setVideoPitchUrl] = useState('');
  const [isInterviewOpen, setIsInterviewOpen] = useState(false);

  const currentUser = MOCK_TALENT_POOL.find(u => u.id === 't2') as any; // Kiara

  const [postData, setPostData] = useState({
    companyName: '',
    roleTitle: '',
    talentCategory: UserRole.MODEL,
    location: '',
    shootDate: '',
    budget: '',
    description: '',
    contactEmail: ''
  });

  useEffect(() => {
    fetchCastings();
  }, []);

  const fetchCastings = async () => {
    try {
      const data = await castingService.getCastings();
      if (data.success) {
        setCastings(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch castings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostCasting = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await castingService.postCasting(postData);
      if (data.success) {
        setShowPostModal(false);
        fetchCastings();
        alert(`Casting Call Published!`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCasting || !pitchText.trim()) return;
    setIsApplying(true);
    try {
      const data = await castingService.applyToCasting(
        selectedCasting.id,
        pitchType === 'text' ? pitchText : `Video Pitch: ${videoPitchUrl}`
      );
      if (data.success) {
        setSelectedCasting(null);
        setPitchText('');
        setVideoPitchUrl('');
        setPitchType('text');
        alert("Application Successfully Dispatched.");
      } else {
        alert(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsApplying(false);
    }
  };

  if (activeLiveCastingId) {
    // We pass a mock current user to represent the current talent viewing the page.
    const currentUserMockFromPool = MOCK_TALENT_POOL.find(u => u.id === 't4') as any; // Mock Kunal Murari

    return (
      <div className="animate-in fade-in duration-700">
        <LiveCastingRoom
          castingId={activeLiveCastingId}
          currentUser={currentUserMockFromPool}
          isHost={false}
          onLeave={() => setActiveLiveCastingId(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      {/* Cinematic Header Overlay */}
      <div className="relative h-[50vh] min-h-[400px] w-full rounded-[4rem] overflow-hidden group mb-12 shadow-3xl">
        <img
          src="/demo/castings_header_bg_1772537115562.png"
          className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-[3s] ease-out scale-105 group-hover:scale-100"
          alt="Casting Hub Background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/20 to-transparent" />

        <div className="absolute bottom-16 left-16 right-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-3 h-3 bg-ffn-accent rounded-full shadow-[0_0_15px_rgba(252,176,69,0.8)]"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60">Live Opportunity Protocol</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-serif italic tracking-tighter text-white leading-none drop-shadow-2xl">
              Casting <span className="text-ffn-primary">Marketplace</span>
            </h1>
            <p className="text-sm text-white/40 uppercase tracking-[0.4em] font-medium max-w-xl">
              Secure Talent Acquisition & Authority Discovery Infrastructure
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="group relative overflow-hidden px-14 py-7 bg-white text-ffn-black rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:scale-105 active:scale-95 shadow-2xl"
          >
            <div className="absolute inset-0 bg-ffn-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative z-10 flex items-center space-x-4 group-hover:text-white transition-colors">
              <Plus className="w-5 h-5" />
              <span>Deploy Open Call</span>
            </span>
          </button>
        </div>

        {/* Floating Metrics */}
        <div className="absolute top-16 right-16 flex space-x-8">
          {[
            { label: 'Active Calls', val: castings.length },
            { label: 'Avg Payout', val: '₹45K' },
            { label: 'Verified', val: '100%' }
          ].map((m, i) => (
            <div key={i} className="glass-card-vibrant p-5 px-8 rounded-3xl border border-white/10 backdrop-blur-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/40 mb-1">{m.label}</p>
              <p className="text-xl font-serif italic text-white">{m.val}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {loading ? (
          <div className="flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-ffn-primary" /></div>
        ) : castings.map((job, idx) => (
          <CastingCardPremium
            key={job.id}
            job={job}
            user={currentUser}
            index={idx}
            onClick={() => setSelectedCasting(job)}
            onApply={(e) => {
              e.stopPropagation();
              setSelectedCasting(job);
              setIsInterviewOpen(true);
            }}
          />
        ))}
        {!loading && castings.length === 0 && (
          <div className="bg-gray-50 rounded-[4rem] p-32 text-center space-y-8 border-2 border-dashed border-gray-200">
            <div className="flex justify-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-xl">
                <Briefcase className="w-10 h-10" />
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic text-gray-400">No Active Castings</h3>
              <p className="text-xs text-gray-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">There are currently no open calls. Check back soon for new opportunities or tap the button above to form your cast.</p>
            </div>
          </div>
        )}
      </div>

      {/* Post Casting Modal (SECTION 1) */}
      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-ffn-black/90 backdrop-blur-2xl">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-[#0A0A0A] w-full max-w-5xl h-[90vh] rounded-[4rem] overflow-hidden relative flex flex-col border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-ffn-primary/5 via-transparent to-ffn-accent/5 pointer-events-none" />

              <button
                title="Close modal"
                onClick={() => setShowPostModal(false)}
                className="absolute top-10 right-10 z-50 p-4 bg-white/5 text-white/40 rounded-2xl hover:bg-ffn-primary hover:text-white transition-all border border-white/10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex-1 overflow-y-auto no-scrollbar p-16 md:p-24">
                <div className="max-w-3xl mx-auto space-y-16">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 text-ffn-primary">
                      <div className="w-12 h-0.5 bg-ffn-primary" />
                      <span className="text-[10px] font-black uppercase tracking-[0.6em]">Node Deployment Protocol</span>
                    </div>
                    <h2 className="text-6xl font-serif italic text-white leading-none">Initialize <span className="text-ffn-primary">Open Call</span></h2>
                    <p className="text-sm text-gray-500 uppercase tracking-widest font-medium">Define your requirements within the global talent graph.</p>
                  </div>

                  <form onSubmit={handlePostCasting} className="space-y-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Issuing Authority</label>
                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-sm text-white focus:ring-2 focus:ring-ffn-primary/20 transition-all placeholder:text-white/10" placeholder="e.g. BALENCIAGA GLOBAL" value={postData.companyName} onChange={e => setPostData({ ...postData, companyName: e.target.value })} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Protocol Designation</label>
                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-sm text-white focus:ring-2 focus:ring-ffn-primary/20 transition-all placeholder:text-white/10" placeholder="e.g. Lead Editorial Discovery" value={postData.roleTitle} onChange={e => setPostData({ ...postData, roleTitle: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3 relative">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Talent Class</label>
                        <select title="Talent Class" className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-sm text-white appearance-none focus:ring-2 focus:ring-ffn-primary/20 transition-all" value={postData.talentCategory} onChange={e => setPostData({ ...postData, talentCategory: e.target.value as UserRole })}>
                          {Object.values(UserRole).map(role => <option key={role} value={role} className="bg-[#0A0A0A]">{role}</option>)}
                        </select>
                        <SlidersHorizontal className="absolute right-8 bottom-8 w-4 h-4 text-white/20 pointer-events-none" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Geographic Node</label>
                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-sm text-white focus:ring-2 focus:ring-ffn-primary/20 transition-all placeholder:text-white/10" placeholder="e.g. NEW DELHI // STUDIO 11" value={postData.location} onChange={e => setPostData({ ...postData, location: e.target.value })} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Execution Date</label>
                        <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-sm text-white focus:ring-2 focus:ring-ffn-primary/20 transition-all" value={postData.shootDate} onChange={e => setPostData({ ...postData, shootDate: e.target.value })} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Resource Allocation (INR)</label>
                        <input required className="w-full bg-white/5 border border-white/10 rounded-3xl p-7 text-sm text-white font-serif italic text-xl focus:ring-2 focus:ring-ffn-primary/20 transition-all placeholder:text-white/10 uppercase" placeholder="e.G. 1,50,000" value={postData.budget} onChange={e => setPostData({ ...postData, budget: e.target.value })} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/30 ml-2">Operational Brief</label>
                      <textarea required className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-sm text-white h-48 resize-none focus:ring-2 focus:ring-ffn-primary/20 transition-all placeholder:text-white/10 leading-relaxed" placeholder="Describe the creative vision and technical requirements..." value={postData.description} onChange={e => setPostData({ ...postData, description: e.target.value })} />
                    </div>

                    <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-12">
                      <div className="flex items-center space-x-8">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-white/20">Protocol Fee</p>
                          <p className="text-4xl font-serif italic font-bold text-white">{PRICING.CURRENCY}{PRICING.CASTING_POST}</p>
                        </div>
                        <div className="w-px h-12 bg-white/10 hidden md:block" />
                        <div className="hidden lg:block text-[9px] uppercase tracking-widest text-white/20 font-medium max-w-[140px] leading-relaxed">
                          Secure Escrow Included • Authority Verified
                        </div>
                      </div>

                      <button
                        disabled={isPaying}
                        type="submit"
                        className="group relative w-full md:w-auto overflow-hidden px-20 py-8 bg-ffn-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-[0_20px_40px_rgba(99,102,241,0.3)] transition-all hover:scale-105 active:scale-95"
                      >
                        <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
                        <span className="relative z-10 flex items-center justify-center space-x-4">
                          {isPaying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-ffn-accent shadow-glow" />}
                          <span>{isPaying ? 'Processing Protocol...' : 'Authorize & Deploy Call'}</span>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Casting Detail Modal */}
      <AnimatePresence>
        {selectedCasting && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-ffn-black/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl h-[90vh] rounded-[4rem] overflow-hidden relative shadow-2xl flex flex-col border border-white/20">
              <button title="Abort Casting Protocol" onClick={() => setSelectedCasting(null)} className="absolute top-10 right-10 z-50 p-4 bg-gray-100 rounded-2xl hover:bg-ffn-black hover:text-white transition-all"><X className="w-6 h-6" /></button>
              <div className="p-16 lg:p-20 overflow-y-auto no-scrollbar flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                  <div className="lg:col-span-7 space-y-16">
                    <div className="space-y-8">
                      <div className="flex items-center space-x-4 text-ffn-primary">
                        <Sparkles className="w-6 h-6" />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Required Casting</span>
                      </div>
                      <h2 className="text-6xl font-serif italic text-ffn-black leading-none tracking-tight">{selectedCasting.title}</h2>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 text-ffn-black font-black uppercase tracking-widest text-[10px]"><Award className="w-4 h-4 text-ffn-secondary" /> <span>{selectedCasting.brand}</span></div>
                        <span className="text-gray-200">|</span>
                        <div className="flex items-center space-x-3 text-gray-400 font-bold uppercase tracking-widest text-[10px]"><MapPin className="w-4 h-4" /> <span>{selectedCasting.location}</span></div>
                      </div>
                    </div>
                    <p className="text-lg text-gray-500 font-light leading-relaxed italic">"{selectedCasting.description}"</p>

                    {/* AI Match Engine UI snippet */}
                    <div className="pt-8 border-t border-gray-100 space-y-6">
                      <div className="flex items-center space-x-3 text-ffn-primary">
                        <BrainCircuit className="w-5 h-5 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Antigravity Match Engine</span>
                      </div>
                      <h3 className="text-2xl font-serif italic text-ffn-black">Recommended Talent</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {MOCK_TALENT_POOL.slice(0, 2).map(talent => (
                          <div key={talent.id} className="p-6 rounded-3xl border border-ffn-primary/20 bg-ffn-primary/5 flex items-center space-x-6">
                            <img src={talent.avatarUrl} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                            <div className="space-y-1 flex-1">
                              <p className="text-sm font-bold font-serif italic">{talent.displayName}</p>
                              <p className="text-[9px] uppercase tracking-widest text-gray-500">{talent.role} • 98% Match</p>
                            </div>
                            <button className="p-3 bg-white rounded-xl text-ffn-primary hover:bg-ffn-black hover:text-white transition-all shadow-sm">
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-12">
                    <div className="bg-gray-50 p-12 rounded-[3.5rem] space-y-12 shadow-inner border border-gray-100">
                      <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300">Application Protocol</p>
                        <div className="flex bg-white p-1 rounded-2xl border border-gray-100">
                          <button
                            type="button"
                            onClick={() => setPitchType('text')}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${pitchType === 'text' ? 'bg-ffn-black text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                          >
                            Text Pitch
                          </button>
                          <button
                            type="button"
                            onClick={() => setPitchType('video')}
                            className={`flex-1 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${pitchType === 'video' ? 'bg-ffn-primary text-white shadow-lg' : 'text-gray-400 hover:bg-gray-50'}`}
                          >
                            Video Audition
                          </button>
                        </div>
                      </div>

                      <form onSubmit={handleApply} className="space-y-6">
                        {pitchType === 'text' ? (
                          <textarea
                            required
                            value={pitchText}
                            onChange={(e) => setPitchText(e.target.value)}
                            className="w-full bg-white border border-gray-100 rounded-3xl p-6 text-xs h-32 resize-none focus:ring-1 focus:ring-ffn-primary transition-all shadow-sm"
                            placeholder="Pitch your mastery & relevance to this project..."
                          />
                        ) : (
                          <div className="space-y-4">
                            <div className="aspect-[9/16] bg-ffn-black rounded-3xl overflow-hidden relative group">
                              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 text-white p-8 text-center">
                                <Video className="w-12 h-12 text-ffn-primary animate-pulse" />
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-relaxed">Immersive Audition Recording Infrastructure</p>
                                <button type="button" className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Enable Camera</button>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={videoPitchUrl}
                              onChange={(e) => setVideoPitchUrl(e.target.value)}
                              placeholder="Or paste reel/video URL..."
                              className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-[10px] focus:ring-1 focus:ring-ffn-primary transition-all"
                            />
                          </div>
                        )}

                        <button
                          disabled={isApplying || (pitchType === 'text' ? !pitchText.trim() : !videoPitchUrl.trim())}
                          className={`w-full py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-xl transition-all disabled:opacity-50 ${pitchType === 'video' ? 'bg-ffn-primary text-white hover:bg-ffn-black' : 'bg-ffn-black text-white hover:bg-ffn-primary'}`}
                        >
                          {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : pitchType === 'video' ? <Zap className="w-5 h-5" /> : <Send className="w-5 h-5" />}
                          <span>{pitchType === 'video' ? 'Dispatch Audition' : 'Dispatch Application'}</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interview Application Flow Integration */}
      {selectedCasting && (
        <InterviewApplicationFlow
          isOpen={isInterviewOpen}
          onClose={() => setIsInterviewOpen(false)}
          casting={selectedCasting}
          user={currentUser}
        />
      )}
    </div>
  );
};
