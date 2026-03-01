
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Clock, DollarSign, ArrowRight, ShieldCheck, Briefcase, X, CheckCircle, Award, Sparkles, FileText, Send, User, Loader2, Plus, Building2, Mail, Calendar, Zap } from 'lucide-react';
import { UserRole } from '../types';
import { PRICING } from '../constants';
import { castingService } from '../services/castingService';

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
  const [isApplying, setIsApplying] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [castings, setCastings] = useState<CastingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pitchText, setPitchText] = useState('');

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
      const data = await castingService.applyToCasting(selectedCasting.id, pitchText);
      if (data.success) {
        setSelectedCasting(null);
        setPitchText('');
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

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-gray-100 pb-12">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-ffn-accent">
            <Briefcase className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Professional Hiring Infrastructure</span>
          </div>
          <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Casting Marketplace</h1>
        </div>
        <button
          onClick={() => setShowPostModal(true)}
          className="px-10 py-5 bg-ffn-black text-white rounded-[1.5rem] text-[9px] font-bold uppercase tracking-widest shadow-xl hover:bg-ffn-primary transition-all flex items-center space-x-3"
        >
          <Plus className="w-4 h-4" />
          <span>Post Casting Call</span>
        </button>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex items-center justify-center p-20"><Loader2 className="w-10 h-10 animate-spin text-ffn-primary" /></div>
        ) : castings.map((job, idx) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedCasting(job)}
            className="group bg-white rounded-[3rem] p-10 flex flex-col lg:flex-row items-center justify-between gap-10 border border-gray-50 shadow-lg hover:shadow-2xl transition-all hover:border-ffn-primary/20 cursor-pointer"
          >
            <div className="flex items-center space-x-10 w-full lg:w-auto">
              <div className="w-20 h-20 bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 group-hover:bg-ffn-primary/5 group-hover:text-ffn-primary transition-colors">
                <Building2 className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <h3 className="text-2xl font-serif italic text-ffn-black leading-none">{job.title}</h3>
                  <span className={`text-[8px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${job.type === 'High Priority' ? 'bg-ffn-accent/10 text-ffn-accent' : 'bg-gray-100 text-gray-400'}`}>{job.type}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-ffn-primary">{job.brand}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-12 w-full lg:w-auto">
              <div className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{job.location}</span>
              </div>
              <div className="flex items-center space-x-3 text-ffn-black">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest">{job.budget}</span>
              </div>
            </div>

            <motion.button whileHover={{ x: 10 }} className="w-full lg:w-auto px-10 py-5 bg-ffn-black text-white rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center space-x-3 transition-all">
              <span>Enter Portal</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
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
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-ffn-black/80 backdrop-blur-xl">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl h-[90vh] rounded-[4rem] overflow-hidden relative flex flex-col border border-white/20 shadow-3xl">
              <button onClick={() => setShowPostModal(false)} className="absolute top-10 right-10 z-50 p-4 bg-gray-100 rounded-2xl hover:bg-ffn-accent hover:text-white transition-all"><X className="w-6 h-6" /></button>
              <div className="p-16 overflow-y-auto no-scrollbar">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                      <Building2 className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em]">Hiring Node Deployment</span>
                    </div>
                    <h2 className="text-5xl font-serif italic text-ffn-black leading-none">Post New Casting</h2>
                  </div>

                  <form onSubmit={handlePostCasting} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Company Name</label><input required className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm" placeholder="e.g. ZARA India" value={postData.companyName} onChange={e => setPostData({ ...postData, companyName: e.target.value })} /></div>
                      <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Role Title</label><input required className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm" placeholder="e.g. Lead Editorial Model" value={postData.roleTitle} onChange={e => setPostData({ ...postData, roleTitle: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Talent Category</label>
                        <select className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm appearance-none" value={postData.talentCategory} onChange={e => setPostData({ ...postData, talentCategory: e.target.value as UserRole })}>
                          {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Location</label><input required className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm" placeholder="e.g. Mumbai, Studio-22" value={postData.location} onChange={e => setPostData({ ...postData, location: e.target.value })} /></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Shoot Date</label><input required type="date" className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm" value={postData.shootDate} onChange={e => setPostData({ ...postData, shootDate: e.target.value })} /></div>
                      <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Budget (INR)</label><input required className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm" placeholder="e.g. 50,000" value={postData.budget} onChange={e => setPostData({ ...postData, budget: e.target.value })} /></div>
                    </div>
                    <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Description</label><textarea required className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm h-32 resize-none" placeholder="Describe the project requirements..." value={postData.description} onChange={e => setPostData({ ...postData, description: e.target.value })} /></div>
                    <div className="space-y-2"><label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Contact Email</label><input required type="email" className="w-full bg-gray-50 border-none rounded-2xl p-6 text-sm" placeholder="casting@company.com" value={postData.contactEmail} onChange={e => setPostData({ ...postData, contactEmail: e.target.value })} /></div>

                    <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-10">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Posting Fee</p>
                        <p className="text-4xl font-serif italic font-bold text-ffn-black">{PRICING.CURRENCY}{PRICING.CASTING_POST}</p>
                      </div>
                      <button disabled={isPaying} type="submit" className="w-full md:w-auto px-16 py-8 bg-ffn-black text-white rounded-[2rem] text-xs font-black uppercase tracking-[0.4em] shadow-3xl hover:bg-ffn-primary transition-all flex items-center justify-center space-x-4">
                        {isPaying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-ffn-accent" />}
                        <span>{isPaying ? 'Processing Protocol...' : 'Authorize & Publish'}</span>
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
              <button onClick={() => setSelectedCasting(null)} className="absolute top-10 right-10 z-50 p-4 bg-gray-100 rounded-2xl hover:bg-ffn-black hover:text-white transition-all"><X className="w-6 h-6" /></button>
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
                  </div>
                  <div className="lg:col-span-5 space-y-12">
                    <div className="bg-gray-50 p-12 rounded-[3.5rem] space-y-12 shadow-inner border border-gray-100">
                      <div className="space-y-4"><p className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-300">Financial Protocol</p><p className="text-6xl font-serif italic font-bold text-ffn-black leading-none">{selectedCasting.budget}</p></div>
                      <form onSubmit={handleApply} className="space-y-6">
                        <textarea
                          required
                          value={pitchText}
                          onChange={(e) => setPitchText(e.target.value)}
                          className="w-full bg-white border border-gray-100 rounded-3xl p-6 text-xs h-32 resize-none focus:ring-1 focus:ring-ffn-primary transition-all"
                          placeholder="Pitch your mastery & relevance to this project..."
                        />
                        <button disabled={isApplying || !pitchText.trim()} className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-xl hover:bg-ffn-primary transition-all disabled:opacity-50">
                          {isApplying ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                          <span>Dispatch Application</span>
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
    </div>
  );
};
