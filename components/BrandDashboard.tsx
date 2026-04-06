import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Users, Briefcase, Bookmark, Settings, Plus,
    Filter, MapPin, Star, ShieldCheck, CheckCircle, Zap,
    Loader2, Building2, TrendingUp, CreditCard, Layers, Video, ScrollText, X,
    ArrowRight, Activity, Globe, ArrowUpRight, Clock, Target
} from 'lucide-react';
import { ActivityFeed } from './ActivityFeed';
import { User, UserRole } from '../types';
import { supabase } from '../supabase';
import { PRICING, MOCK_CONTRACTS, MOCK_TALENT_POOL, MOCK_WAR_ROOMS, MOCK_TALENT_COLLECTIONS } from '../constants';
import { Link } from 'react-router-dom';
import { PayPalButton } from './PayPalButton';
import { MoodBoards } from './MoodBoards';
import { MoodBoardDetail } from './MoodBoardDetail';
import { LiveCastingRoom } from './LiveCastingRoom';
import { ContractViewer } from './ContractViewer';
import { CampaignCommandCenter } from './CampaignCommandCenter';
import { AdvancedAnalytics } from './AdvancedAnalytics';
import { BrandRecruitingCRM } from './BrandRecruitingCRM';
import { TalentRecommendations } from './TalentRecommendations';

interface BrandDashboardProps {
    user: any;
    onLogout: () => void;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'crm' | 'castings' | 'subscription' | 'moodboards' | 'contracts' | 'collections' | 'campaigns' | 'analytics'>('overview');
    const [selectedMoodBoardId, setSelectedMoodBoardId] = useState<string | null>(null);
    const [activeLiveCastingId, setActiveLiveCastingId] = useState<string | null>(null);
    const [viewingContractId, setViewingContractId] = useState<string | null>(null);
    const [activePlanBox, setActivePlanBox] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        role: 'ALL',
        experience: 'ALL',
        verifiedOnly: false,
        brandCredits: 0
    });

    const filteredTalent = useMemo(() => {
        return MOCK_TALENT_POOL.filter(talent => {
            const matchesSearch = talent.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                talent.bio?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesRole = filters.role === 'ALL' || talent.role === filters.role;
            const matchesExp = filters.experience === 'ALL' || talent.experienceLevel === filters.experience;
            const matchesVerified = !filters.verifiedOnly || talent.isVerified;
            const matchesCredits = (talent.brandCollaborationsCount || 0) >= filters.brandCredits;

            return matchesSearch && matchesRole && matchesExp && matchesVerified && matchesCredits;
        });
    }, [searchQuery, filters]);

    const stats = [
        { label: 'Active Castings', value: '3', icon: Briefcase, color: 'text-ffn-primary', bgGlow: 'shadow-[0_0_20px_rgba(99,102,241,0.2)]' },
        { label: 'Saved Talent', value: '42', icon: Bookmark, color: 'text-blue-400', bgGlow: 'shadow-[0_0_20px_rgba(96,165,250,0.2)]' },
        { label: 'Profile Views', value: '1.2k', icon: Users, color: 'text-emerald-400', bgGlow: 'shadow-[0_0_20px_rgba(52,211,153,0.2)]' },
        { label: 'Network Rank', value: 'Top 5%', icon: TrendingUp, color: 'text-ffn-accent', bgGlow: 'shadow-[0_0_20px_rgba(252,176,69,0.2)]' },
    ];

    const handlePayPalSuccess = async (planId: string, orderId: string) => {
        setIsSubscribing(planId);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Success! Your Brand Profile is now seamlessly upgraded to ${planId}.`);
            setActivePlanBox(null);
        } catch (err: any) {
            alert('Subscription verification failed. Please contact support.');
        } finally {
            setIsSubscribing(null);
        }
    };

    return (
        <div className="space-y-16 animate-in fade-in duration-700 pb-32 min-h-screen text-white bg-ffn-black relative">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-ffn-primary/20 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-ffn-accent/10 blur-[150px] rounded-full mix-blend-screen opacity-50"></div>
            </div>

            <div className="relative z-10 space-y-16 px-4 md:px-8 max-w-[100rem] mx-auto pt-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 text-ffn-primary">
                            <Building2 className="w-5 h-5 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Brand Operations HUB</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-white drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">Brand Terminal.</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={onLogout} className="px-8 py-4 bg-white/5 border border-white/10 text-white/60 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white/10 hover:text-white transition-all shadow-xl">Protocol Exit</button>
                    </div>
                </header>

                {/* Analytics Snapshot */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, idx) => (
                        <div key={idx} className={`bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 group hover:bg-white/10 transition-all cursor-default relative overflow-hidden ${stat.bgGlow}`}>
                            <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-inner relative z-10`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 mb-2 relative z-10">{stat.label}</p>
                            <p className="text-4xl md:text-5xl font-serif italic text-white leading-none relative z-10">{stat.value}</p>

                            {/* Hover accent pulse */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    ))}
                </section>

                <div className="flex space-x-12 border-b border-white/10 pb-4 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'overview', label: 'Company Profile', icon: Building2 },
                        { id: 'analytics', label: 'Intelligence', icon: Activity },
                        { id: 'search', label: 'Talent Discovery', icon: Search },
                        { id: 'crm', label: 'Recruitment CRM', icon: Users },
                        { id: 'castings', label: 'Casting Calls', icon: Briefcase },
                        { id: 'campaigns', label: 'Campaigns', icon: Target },
                        { id: 'moodboards', label: 'Mood Boards', icon: Layers },
                        { id: 'collections', label: 'Talent Collections', icon: Bookmark },
                        { id: 'contracts', label: 'Legal & Escrow', icon: ScrollText },
                        { id: 'subscription', label: 'Brand Subscription', icon: CreditCard },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative whitespace-nowrap px-2 py-4 ${activeTab === tab.id ? 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'text-white/40 hover:text-white/80'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                            {activeTab === tab.id && <motion.div layoutId="brandTabLine" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-ffn-primary shadow-[0_0_15px_rgba(99,102,241,1)]" />}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10 flex justify-between items-start">
                                    <div>
                                        <h2 className="text-4xl md:text-5xl font-serif italic text-white drop-shadow-md">Condé Nast India</h2>
                                        <div className="flex items-center space-x-2 mt-4">
                                            <ShieldCheck className="w-4 h-4 text-ffn-primary" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Verified Enterprise Partner</p>
                                        </div>
                                    </div>
                                    <button className="px-6 py-3 bg-white/10 text-white rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-ffn-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">Edit Profile</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-white/10 relative z-10">
                                    <div className="space-y-3"><p className="text-[9px] uppercase font-black tracking-[0.4em] text-white/30">Industry</p><p className="font-serif italic text-xl text-white/80">Media & Publishing</p></div>
                                    <div className="space-y-3"><p className="text-[9px] uppercase font-black tracking-[0.4em] text-white/30">Headquarters</p><p className="font-serif italic text-xl text-white/80">Mumbai, India</p></div>
                                    <div className="space-y-3"><p className="text-[9px] uppercase font-black tracking-[0.4em] text-white/30">Website</p><p className="font-serif italic text-xl text-ffn-primary hover:text-ffn-accent transition-colors cursor-pointer">condenast.in</p></div>
                                </div>
                            </div>

                            {/* AI Talent Recommendations Spotlight */}
                            <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
                                <TalentRecommendations />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                                    <ActivityFeed limit={5} />
                                </div>

                                {/* Active War Rooms Integration */}
                                <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 mix-blend-screen pointer-events-none" />
                                    <div className="relative z-10">
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="space-y-2">
                                                <h3 className="text-xl md:text-2xl font-serif italic font-bold text-white">Collaborative Workspaces</h3>
                                                <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.4em]">Real-time Project War Rooms</p>
                                            </div>
                                            <Activity className="w-5 h-5 text-ffn-primary animate-pulse" />
                                        </div>
                                        <div className="space-y-4">
                                            {MOCK_WAR_ROOMS.slice(0, 2).map((wr) => (
                                                <Link
                                                    key={wr.id}
                                                    to={`/war-room/${wr.projectId}`}
                                                    className="block p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:border-ffn-primary/40 group overflow-hidden relative"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none"></div>
                                                    <div className="flex items-center justify-between relative z-10">
                                                        <div className="flex items-center space-x-5">
                                                            <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden bg-white/5 shadow-inner">
                                                                <img src={wr.talent.avatarUrl} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700" alt="" />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <h4 className="text-white/90 font-serif italic text-lg">{wr.title}</h4>
                                                                <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.3em]">With {wr.talent.name}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right space-y-2">
                                                            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-ffn-primary animate-pulse"></div>
                                                                <p className="text-[9px] text-ffn-primary font-black uppercase tracking-[0.3em]">{wr.milestones.filter(m => m.status === 'COMPLETED').length}/{wr.milestones.length} Tasks</p>
                                                            </div>
                                                            <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest block">Last active 2h ago</p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <button className="w-full mt-8 py-5 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] transition-all">
                                            View All Workspaces
                                        </button>
                                    </div>
                                </div>

                                {/* Active Campaigns */}
                                <div className="bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
                                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-ffn-accent/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2 mix-blend-screen pointer-events-none" />
                                    <div className="relative z-10 h-full flex flex-col justify-between">
                                        <div className="space-y-8">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-xl md:text-2xl font-serif italic font-bold">Active Campaigns</h3>
                                                <Zap className="w-5 h-5 text-ffn-accent shadow-[0_0_15px_rgba(252,176,69,0.5)] rounded-full" />
                                            </div>
                                            <div className="space-y-4">
                                                {[
                                                    { title: "Summer Editorial '25", status: 'Live', applicants: 12, matchRate: 85 },
                                                    { title: 'Streetwear Launch', status: 'Shortlisting', applicants: 4, matchRate: 92 },
                                                ].map((camp, i) => (
                                                    <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer group/camp relative overflow-hidden">
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="font-serif italic font-bold text-lg text-white/90">{camp.title}</h4>
                                                            <span className={`text-[8px] px-3 py-1.5 rounded-full uppercase tracking-[0.3em] font-black border ${camp.status === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(52,211,153,0.2)]' : 'bg-ffn-primary/10 text-ffn-primary border-ffn-primary/30 shadow-[0_0_10px_rgba(99,102,241,0.2)]'}`}>
                                                                {camp.status}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                                            <div className="flex -space-x-3">
                                                                {[1, 2, 3].map(j => (
                                                                    <img key={j} src={`https://i.pravatar.cc/100?img=${j + 20}`} className="w-8 h-8 rounded-full border border-black shadow-sm group-hover/camp:-translate-y-1 transition-transform" alt="" />

                                                                ))}
                                                                <div className="w-8 h-8 rounded-full bg-ffn-black border border-white/20 shadow-sm flex items-center justify-center text-[8px] font-black text-white/70">+{camp.applicants}</div>
                                                            </div>
                                                            <div className="text-right space-y-1">
                                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white flex items-center justify-end"><ArrowUpRight className="w-3 h-3 mr-1 text-emerald-400" /> {camp.matchRate}% Match</p>
                                                                <p className="text-[8px] text-white/30 uppercase tracking-widest font-bold">AI Recommendation</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <button className="w-full mt-8 py-5 border border-white/10 border-dashed rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-white/30 hover:border-ffn-primary/50 hover:bg-ffn-primary/10 hover:text-white transition-all">Launch New Campaign</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {
                        activeTab === 'search' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-ffn-primary transition-colors duration-500" />
                                        <input
                                            type="text"
                                            placeholder="SEARCH MODELS, PHOTOGRAPHERS, STYLISTS..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] py-6 pl-20 pr-8 text-[11px] font-black tracking-[0.3em] uppercase text-white shadow-2xl focus:border-ffn-primary/50 focus:bg-white/10 transition-all outline-none placeholder:text-white/20"
                                        />
                                        <div className="absolute right-3 top-3 bottom-3 bg-white/5 rounded-full px-6 flex items-center justify-center pointer-events-none border border-white/5">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-white/30">Enter to scan</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`px-10 py-6 rounded-[3rem] flex items-center space-x-4 shadow-xl transition-all border ${showFilters ? 'bg-white text-ffn-black border-white hover:bg-gray-100' : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'}`}
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">Filters</span>
                                    </button>
                                </div>

                                <AnimatePresence>
                                    {showFilters && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="bg-ffn-black/80 backdrop-blur-[80px] p-12 rounded-[3.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.6)] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mt-4">
                                                <div className="space-y-6">
                                                    <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-[0.4em]">
                                                        <span className="text-white/40">Collaborations</span>
                                                        <span className="text-ffn-primary">{filters.brandCredits}+ Credits</span>
                                                    </div>
                                                    <input
                                                        title="Min Brand Credits"
                                                        type="range"
                                                        min="0" max="50"
                                                        value={filters.brandCredits}
                                                        onChange={(e) => setFilters({ ...filters, brandCredits: parseInt(e.target.value) })}
                                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-ffn-primary cursor-pointer"
                                                    />
                                                </div>

                                                <div className="space-y-6">
                                                    <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40 block">Experience</label>
                                                    <div className="relative">
                                                        <select
                                                            title="Experience Level"
                                                            value={filters.experience}
                                                            onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-[10px] font-black uppercase tracking-[0.3em] text-white appearance-none focus:outline-none focus:border-ffn-primary/50 transition-colors cursor-pointer"
                                                        >
                                                            <option value="ALL" className="bg-ffn-black">All Levels</option>
                                                            <option value="beginner" className="bg-ffn-black">Beginner</option>
                                                            <option value="intermediate" className="bg-ffn-black">Intermediate</option>
                                                            <option value="pro" className="bg-ffn-black">Professional</option>
                                                        </select>
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                            <ArrowRight className="w-3 h-3 text-white/40 rotate-90" />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40 block">Identity Status</label>
                                                    <div className="flex gap-3">
                                                        {['MODEL', 'PHOTOGRAPHER', 'STYLIST'].map(r => (
                                                            <button
                                                                key={r}
                                                                onClick={() => setFilters({ ...filters, role: filters.role === r ? 'ALL' : r })}
                                                                className={`flex-1 py-4 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] transition-all border ${filters.role === r ? 'bg-ffn-primary border-ffn-primary text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                            >
                                                                {r[0]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <label className="text-[10px] uppercase font-black tracking-[0.4em] text-white/40 block border-b border-transparent">Protocol Verification</label>
                                                    <button
                                                        onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                                                        className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all flex justify-center items-center space-x-3 border ${filters.verifiedOnly ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.1)]' : 'bg-white/5 border-white/5 text-white/40 hover:bg-white/10 hover:text-white'}`}
                                                    >
                                                        <ShieldCheck className="w-4 h-4" />
                                                        <span>{filters.verifiedOnly ? 'Verified Only' : 'Include All'}</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
                                    {filteredTalent.map((talent) => (
                                        <motion.div
                                            key={talent.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] hover:border-white/30 transition-all duration-500 flex flex-col"
                                        >
                                            <div className="h-64 relative overflow-hidden bg-white/5 m-4 rounded-[2.5rem] mb-0 border border-white/5">
                                                <img src={talent.avatarUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" alt={talent.displayName} />

                                                {/* Dark gradient overlay for improved text contrast */}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60"></div>

                                                <button title="Save Talent" className="absolute top-4 right-4 p-4 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-colors border border-white/10 group/btn">
                                                    <Bookmark className={`w-4 h-4 transition-transform group-hover/btn:scale-110 ${talent.isFeatured ? 'fill-current' : ''}`} />
                                                </button>

                                                {/* Mini Stats reveal on hover */}
                                                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                                                    <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-xl flex items-center space-x-2">
                                                        <Activity className="w-3 h-3 text-ffn-primary" />
                                                        <span className="text-[9px] font-black uppercase text-white tracking-widest">{talent.completionScore || 100}% Fit</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                                                <div className="space-y-2">
                                                    <h4 className="text-2xl font-serif italic font-bold text-white group-hover:text-ffn-primary transition-colors">{talent.displayName}</h4>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40 flex items-center"><MapPin className="w-3 h-3 mr-2" /> {talent.role} • {talent.location}</p>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    <span className="flex items-center text-[8px] uppercase tracking-[0.3em] font-black text-white bg-ffn-primary/20 border border-ffn-primary/30 px-3 py-1.5 rounded-full"><Star className="w-3 h-3 mr-1 fill-ffn-primary text-ffn-primary" /> {talent.avgRating || '4.8'} Avg</span>
                                                    {talent.isVerified && (
                                                        <span className="flex items-center text-[8px] uppercase tracking-[0.3em] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full"><ShieldCheck className="w-3 h-3 mr-1" /> Verified Target</span>
                                                    )}
                                                    {talent.brandCollaborationsCount && (
                                                        <span className="flex items-center text-[8px] uppercase tracking-[0.3em] font-black text-ffn-accent bg-ffn-accent/10 border border-ffn-accent/30 px-3 py-1.5 rounded-full"><Plus className="w-3 h-3 mr-1" /> {talent.brandCollaborationsCount} Collaborations</span>
                                                    )}
                                                </div>
                                                <button className="w-full py-4 bg-white/10 rounded-2xl text-[9px] uppercase font-black tracking-[0.4em] text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">View Full Node</button>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {filteredTalent.length === 0 && (
                                        <div className="col-span-full py-32 text-center bg-white/5 backdrop-blur-3xl rounded-[4rem] border border-white/10 mt-8">
                                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner">
                                                <Search className="w-8 h-8 text-white/20" />
                                            </div>
                                            <p className="text-3xl font-serif italic text-white/60 mb-3">Zero Matches Acquired</p>
                                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Adjust search parameters to widen the scan scope</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === 'moodboards' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                {selectedMoodBoardId ? (
                                    <MoodBoardDetail
                                        boardId={selectedMoodBoardId}
                                        currentUser={user as unknown as User}
                                        onBack={() => setSelectedMoodBoardId(null)}
                                    />
                                ) : (
                                    <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-[3.5rem] border border-white/10 min-h-[50vh]">
                                        <MoodBoards
                                            currentUser={user as unknown as User}
                                            onSelectBoard={(id) => setSelectedMoodBoardId(id)}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        )
                    }

                    {
                        activeTab === 'castings' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                {activeLiveCastingId ? (
                                    <div className="bg-ffn-black rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                                        <LiveCastingRoom
                                            castingId={activeLiveCastingId}
                                            currentUser={user as unknown as User}
                                            isHost={true}
                                            onLeave={() => setActiveLiveCastingId(null)}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-xl relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none group-hover:bg-ffn-primary/20 transition-colors duration-1000"></div>
                                            <div className="relative z-10 space-y-2">
                                                <h3 className="text-3xl font-serif italic text-white font-bold drop-shadow-md">Active Casting Nodes</h3>
                                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Manage and monitor talent acquisition pipelines</p>
                                            </div>
                                            <button className="relative z-10 px-8 py-5 bg-white text-ffn-black rounded-full flex items-center justify-center space-x-3 text-[10px] uppercase font-black tracking-[0.3em] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-ffn-primary hover:text-white hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all">
                                                <Plus className="w-4 h-4" /> <span>Deploy New Casting</span>
                                            </button>
                                        </div>

                                        <div className="space-y-6">
                                            {[1, 2].map(i => (
                                                <div key={i} className="bg-white/5 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-lg flex flex-col lg:flex-row justify-between lg:items-center gap-8 group hover:bg-white/10 hover:border-white/20 transition-all cursor-default relative overflow-hidden">
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-ffn-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                    <div className="space-y-4 pl-4">
                                                        <div className="flex flex-wrap items-center gap-4">
                                                            <h4 className="text-2xl font-serif italic text-white font-bold">Summer Editorial Campaign</h4>
                                                            <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-full uppercase tracking-[0.3em] font-black flex items-center shadow-[0_0_10px_rgba(52,211,153,0.1)]">
                                                                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse"></div>
                                                                Live Stream
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center space-x-6">
                                                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-white/40 flex items-center"><MapPin className="w-3 h-3 mr-2" /> Mumbai Location</p>
                                                            <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                                                            <p className="text-[9px] uppercase font-black tracking-[0.3em] text-white/40 flex items-center"><Users className="w-3 h-3 mr-2" /> 12 Targets Matched</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        <button
                                                            onClick={() => setActiveLiveCastingId('lc1')}
                                                            className="px-6 py-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl text-[9px] uppercase tracking-[0.3em] font-black hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all flex items-center space-x-2"
                                                        >
                                                            <Video className="w-4 h-4" /> <span>Enter Live Room</span>
                                                        </button>
                                                        <button className="px-6 py-4 bg-white/5 border border-white/10 text-white rounded-2xl text-[9px] uppercase tracking-[0.3em] font-black hover:bg-white/10 hover:border-white/30 transition-all flex items-center space-x-2">
                                                            <Users className="w-4 h-4" /> <span>Target List</span>
                                                        </button>
                                                        <button className="px-6 py-4 bg-white text-ffn-black rounded-2xl text-[9px] uppercase tracking-[0.3em] font-black hover:bg-ffn-primary hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all flex items-center justify-center w-12" title="Casting Settings">

                                                            <Settings className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </motion.div>
                        )
                    }

                    {
                        activeTab === 'contracts' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                                <div className="flex justify-between items-center bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full mix-blend-screen pointer-events-none"></div>
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="text-3xl font-serif italic text-white font-bold drop-shadow-md">Escrow & Legal Terminal</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Secure, encrypted, ESIGN-compliant documentation tracking</p>
                                    </div>
                                    <div className="relative z-10 w-12 h-12 bg-blue-500/20 rounded-full border border-blue-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                                        <ShieldCheck className="w-5 h-5 text-blue-400" />
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    {MOCK_CONTRACTS.map(contract => (
                                        <div key={contract.id} className="bg-white/5 backdrop-blur-3xl p-8 flex flex-col lg:flex-row justify-between lg:items-center rounded-[2.5rem] border border-white/10 shadow-lg gap-6 group hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer" onClick={() => setViewingContractId(contract.id)}>
                                            <div className="space-y-3">
                                                <div className="flex items-center space-x-5">
                                                    <div className="w-12 h-12 bg-white/5 text-white/60 rounded-xl border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-ffn-primary/20 group-hover:text-ffn-primary group-hover:border-ffn-primary/30 transition-colors shadow-inner">
                                                        <ScrollText className="w-5 h-5" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-serif italic text-white font-bold group-hover:text-ffn-primary transition-colors">{contract.type} Agreement</h4>
                                                        <p className="text-[9px] uppercase font-black tracking-[0.3em] text-white/40">Drafted with Kunal Murari • Hash: {(contract.id.substring(0, 8).toUpperCase())}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap lg:flex-nowrap space-x-0 gap-4 items-center">
                                                {contract.status === 'completed' && <span className="text-[8px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-full uppercase tracking-[0.3em] font-black shadow-[0_0_10px_rgba(52,211,153,0.1)] flex items-center"><CheckCircle className="w-3 h-3 mr-2" /> Fully Executed</span>}
                                                {contract.status === 'pending_brand' && <span className="text-[8px] bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-2 rounded-full uppercase tracking-[0.3em] font-black shadow-[0_0_10px_rgba(245,158,11,0.1)] flex items-center"><Zap className="w-3 h-3 mr-2 animate-pulse" /> Action Required</span>}
                                                {contract.status === 'pending_talent' && <span className="text-[8px] bg-white/5 text-white/50 border border-white/10 px-4 py-2 rounded-full uppercase tracking-[0.3em] font-black flex items-center"><Clock className="w-3 h-3 mr-2 text-white/30" /> Pending Talent</span>}

                                                <button onClick={(e) => { e.stopPropagation(); setViewingContractId(contract.id); }} className="px-6 py-4 bg-white/10 text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all lg:ml-6 flex items-center space-x-2">
                                                    <span>Inspect Source</span> <ArrowRight className="w-3 h-3" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    }

                    {
                        activeTab === 'subscription' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
                                <div className="text-center space-y-6 mb-16 relative">
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-ffn-primary/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>
                                    <h2 className="text-5xl md:text-6xl font-serif italic text-white drop-shadow-xl relative z-10">Brand Enterprise Protocols</h2>
                                    <p className="text-white/40 text-xs md:text-sm font-medium tracking-wide max-w-xl mx-auto relative z-10">Elevate your operational capabilities. Access advanced autonomous nodes and global escrow infrastructure.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                                    {[
                                        { id: 'BRAND_PRO', label: 'Pro Tier', price: 4999, features: ['Unlimited Casting Posts', 'Advanced AI Talent Matching', 'Direct Escrow Booking', 'Priority Support'], accent: 'white' },
                                        { id: 'BRAND_ENTERPRISE', label: 'Enterprise Master', price: 14999, features: ['Everything in Pro', 'Custom API Access', 'Dedicated Account Manager', 'White-label Casting Portal'], accent: 'primary' },
                                    ].map((plan, i) => (
                                        <div key={i} className={`p-12 md:p-14 rounded-[4rem] border shadow-2xl flex flex-col justify-between space-y-12 transition-all relative overflow-hidden group ${plan.accent === 'primary' ? 'bg-white/5 border-ffn-primary/40 backdrop-blur-3xl shadow-[0_0_50px_rgba(99,102,241,0.15)]' : 'bg-white/5 border-white/10 backdrop-blur-3xl'}`}>
                                            {plan.accent === 'primary' && (
                                                <div className="absolute top-0 right-0 p-8 w-64 h-64 bg-ffn-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                                            )}

                                            <div className="space-y-8 relative z-10">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-3xl md:text-4xl font-serif italic text-white">{plan.label}</h3>
                                                    {plan.accent === 'primary' && <span className="bg-ffn-primary/20 text-ffn-primary border border-ffn-primary/40 px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-full">Recommended</span>}
                                                </div>
                                                <div className="flex items-end space-x-3">
                                                    <p className="text-6xl md:text-7xl font-serif italic text-white tracking-tighter drop-shadow-lg">{PRICING.CURRENCY}{plan.price}</p>
                                                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-3">/ Cycle</p>
                                                </div>
                                                <ul className="space-y-5 pt-8 border-t border-white/10">
                                                    {plan.features.map((f, j) => (
                                                        <li key={j} className="flex items-center space-x-4 text-[10px] uppercase font-black tracking-[0.3em] text-white/70">
                                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${plan.accent === 'primary' ? 'bg-ffn-primary/20 text-ffn-primary' : 'bg-white/10 text-white'}`}>
                                                                <CheckCircle className="w-3 h-3" />
                                                            </div>
                                                            <span>{f}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="relative z-10">
                                                {activePlanBox === plan.id ? (
                                                    <div className="animate-in fade-in zoom-in duration-300 bg-white/5 p-6 rounded-3xl border border-white/10">
                                                        <PayPalButton
                                                            amount={(plan.price / 80).toFixed(2)}
                                                            currency="USD"
                                                            type="capture"
                                                            onSuccess={(data) => handlePayPalSuccess(plan.id, data.id)}
                                                        />
                                                        <button
                                                            onClick={() => setActivePlanBox(null)}
                                                            className="w-full mt-5 py-4 text-[9px] uppercase font-black tracking-[0.3em] text-ffn-primary hover:text-white transition-colors bg-ffn-primary/10 rounded-2xl"
                                                        >
                                                            Terminate Authorization
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setActivePlanBox(plan.id)}
                                                        disabled={!!isSubscribing}
                                                        className={`w-full py-6 rounded-2xl text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 shadow-xl ${plan.accent === 'primary' ? 'bg-white text-ffn-black hover:bg-ffn-primary hover:text-white hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]' : 'bg-white/10 border border-white/20 text-white hover:bg-white hover:text-black hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]'}`}
                                                    >
                                                        {isSubscribing === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className={`w-5 h-5 ${plan.accent !== 'primary' ? 'text-white/60' : ''}`} />}
                                                        <span>{isSubscribing === plan.id ? 'Syncing Handshake...' : 'Authenticate Upgrade'}</span>
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeTab === 'campaigns' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 relative overflow-hidden">
                                    {/* Just wrap external component in dark mode container hints if needed */}
                                    <CampaignCommandCenter />
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeTab === 'collections' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 bg-white/5 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/10 shadow-xl relative overflow-hidden">
                                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none -translate-x-1/2 translate-y-1/2" />
                                    <div className="relative z-10 space-y-2">
                                        <h3 className="text-3xl font-serif italic text-white drop-shadow-md">Verified Compilations</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Stored network nodes and curated aesthetic sets</p>
                                    </div>
                                    <button className="relative z-10 px-8 py-5 bg-white text-ffn-black rounded-full flex items-center justify-center space-x-3 text-[10px] uppercase font-black tracking-[0.4em] shadow-xl hover:bg-ffn-primary hover:text-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]">
                                        <Plus className="w-4 h-4" /> <span>Initialize Array</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                    {MOCK_TALENT_COLLECTIONS.map((col) => (
                                        <motion.div
                                            key={col.id}
                                            whileHover={{ y: -10 }}
                                            className="bg-white/5 backdrop-blur-3xl rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group cursor-pointer hover:border-white/20 transition-all duration-500"
                                        >
                                            <div className="h-64 relative m-4 rounded-[2.5rem] overflow-hidden border border-white/5">
                                                <img src={col.coverImage} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-[2s] ease-out mix-blend-luminosity hover:mix-blend-normal" alt="" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/40 to-transparent" />
                                                <div className="absolute bottom-6 left-6 right-6 z-10">
                                                    <h4 className="text-2xl font-serif italic text-white font-bold drop-shadow-md">{col.title}</h4>
                                                    <div className="flex items-center justify-between mt-3">
                                                        <p className="text-[9px] text-white/70 uppercase font-black tracking-[0.4em] flex items-center"><Layers className="w-3 h-3 mr-2 text-ffn-primary" /> {col.talentIds.length} Nodes</p>
                                                        <span className={`text-[8px] px-3 py-1.5 rounded-full uppercase font-black tracking-[0.3em] border shadow-sm ${col.isPublic ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20' : 'bg-white/10 text-white/80 border-white/20 shadow-white/10'}`}>
                                                            {col.isPublic ? 'Public' : 'Protected'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="p-8 flex flex-col justify-between min-h-[220px]">

                                                <p className="text-xs text-white/50 font-serif italic leading-relaxed line-clamp-2">{col.description}</p>

                                                <div className="space-y-8 mt-6">
                                                    <div className="flex -space-x-4 pl-2">
                                                        {col.talentIds.slice(0, 4).map((tid, i) => {
                                                            const talent = MOCK_TALENT_POOL.find(t => t.id === tid);
                                                            return (
                                                                <div key={i} className="w-12 h-12 rounded-full border-2 border-ffn-black overflow-hidden relative group-hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-shadow">
                                                                    <img src={talent?.avatarUrl} className="w-full h-full object-cover" alt="" />
                                                                </div>
                                                            );
                                                        })}
                                                        {col.talentIds.length > 4 && (
                                                            <div className="w-12 h-12 rounded-full bg-white/10 border-2 border-ffn-black backdrop-blur-md flex items-center justify-center text-[10px] font-black text-white group-hover:bg-white group-hover:text-black transition-colors relative z-10">
                                                                +{col.talentIds.length - 4}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <button className="w-full py-5 border border-white/10 bg-white/5 rounded-2xl text-[9px] font-black uppercase tracking-[0.4em] text-white/40 group-hover:text-white group-hover:border-white/30 group-hover:bg-white/10 transition-all">
                                                        Extract Data
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeTab === 'analytics' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-[4rem] border border-white/10 relative overflow-hidden">
                                    <AdvancedAnalytics />
                                </div>
                            </motion.div>
                        )
                    }
                    {
                        activeTab === 'crm' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                                <div className="bg-white/5 backdrop-blur-xl rounded-[4rem] border border-white/10 relative overflow-hidden">
                                    <BrandRecruitingCRM />
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence >

                {/* Contract Viewer Modal */}
                <AnimatePresence>
                    {
                        viewingContractId && (
                            <ContractViewer
                                contract={MOCK_CONTRACTS.find(c => c.id === viewingContractId)!}
                                currentUser={user}
                                onClose={() => setViewingContractId(null)}
                                onSign={(sig) => {
                                    console.log('Contract signed by Brand:', sig);
                                    setViewingContractId(null);
                                }}
                            />
                        )
                    }
                </AnimatePresence >

                {/* Live Casting Overlay */}
                <AnimatePresence>
                    {
                        activeLiveCastingId && (
                            <div className="fixed inset-0 z-[100] bg-ffn-black/90 backdrop-blur-xl p-4 md:p-12 overflow-y-auto">
                                <div className="relative max-w-7xl mx-auto border border-white/10 rounded-[4rem] overflow-hidden bg-ffn-black shadow-[0_40px_100px_rgba(0,0,0,0.8)]">
                                    <button title="Terminate Connection" onClick={() => setActiveLiveCastingId(null)} className="absolute top-8 right-8 z-[110] w-12 h-12 bg-white/10 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all backdrop-blur-md border border-white/20">
                                        <X className="w-5 h-5" />
                                    </button>
                                    <LiveCastingRoom
                                        castingId={activeLiveCastingId}
                                        currentUser={user}
                                        isHost={true}
                                        onClose={() => setActiveLiveCastingId(null)}
                                    />
                                </div>
                            </div>
                        )
                    }
                </AnimatePresence >
            </div >
        </div >
    );
};
