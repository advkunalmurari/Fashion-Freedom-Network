import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Users, Briefcase, Bookmark, Settings, Plus,
    Filter, MapPin, Star, ShieldCheck, CheckCircle, Zap,
    Loader2, Building2, TrendingUp, UserPlus, CreditCard, Layers, Video, ScrollText, X,
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
import { TalentCollectionModal } from './TalentCollectionModal';
import { CampaignCommandCenter } from './CampaignCommandCenter';
import { AdvancedAnalytics } from './AdvancedAnalytics';

interface BrandDashboardProps {
    user: any;
    onLogout: () => void;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'castings' | 'subscription' | 'moodboards' | 'contracts' | 'collections' | 'campaigns' | 'analytics'>('overview');
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
        { label: 'Active Castings', value: '3', icon: Briefcase, color: 'text-ffn-primary' },
        { label: 'Saved Talent', value: '42', icon: Bookmark, color: 'text-blue-500' },
        { label: 'Profile Views', value: '1.2k', icon: Users, color: 'text-emerald-500' },
        { label: 'Network Rank', value: 'Top 5%', icon: TrendingUp, color: 'text-ffn-accent' },
    ];

    const handlePayPalSuccess = async (planId: string, orderId: string) => {
        setIsSubscribing(planId);
        try {
            // Simulate backend verification
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
        <div className="space-y-16 animate-in fade-in duration-700 pb-32">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Building2 className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Brand Operations HUB</span>
                    </div>
                    <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Brand Terminal.</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={onLogout} className="px-8 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-ffn-accent transition-all shadow-xl">Protocol Exit</button>
                </div>
            </header>

            {/* Analytics Snapshot */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-lg group hover:shadow-2xl transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                        <p className="text-4xl font-serif italic text-ffn-black leading-none">{stat.value}</p>
                    </div>
                ))}
            </section>

            <div className="flex space-x-12 border-b border-gray-100 pb-4 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'overview', label: 'Company Profile', icon: Building2 },
                    { id: 'analytics', label: 'Intelligence', icon: Activity },
                    { id: 'search', label: 'Talent Discovery', icon: Search },
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
                        className={`flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-ffn-black' : 'text-gray-400'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && <motion.div layoutId="brandTabLine" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-ffn-black" />}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                        <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl space-y-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-4xl font-serif italic text-ffn-black">Condé Nast India</h2>
                                    <p className="text-sm text-gray-400 mt-2">Verified Enterprise Partner</p>
                                </div>
                                <button className="px-6 py-3 bg-gray-50 text-ffn-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100">Edit Profile</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                                <div className="space-y-2"><p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Industry</p><p className="font-serif italic text-xl">Media & Publishing</p></div>
                                <div className="space-y-2"><p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Headquarters</p><p className="font-serif italic text-xl">Mumbai, India</p></div>
                                <div className="space-y-2"><p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Website</p><p className="font-serif italic text-xl text-ffn-primary hover:underline cursor-pointer">condenast.in</p></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-lg">
                                <ActivityFeed limit={5} />
                            </div>

                            {/* Active War Rooms Integration */}
                            <div className="bg-ffn-black p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-serif italic font-bold text-white">Active Collaborative Workspaces</h3>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Real-time Project War Rooms</p>
                                        </div>
                                        <Activity className="w-5 h-5 text-ffn-primary animate-pulse" />
                                    </div>
                                    <div className="space-y-4">
                                        {MOCK_WAR_ROOMS.slice(0, 2).map((wr) => (
                                            <Link
                                                key={wr.id}
                                                to={`/war-room/${wr.projectId}`}
                                                className="block p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:border-ffn-primary/30 group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10">
                                                            <img src={wr.talent.avatarUrl} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                        <div>
                                                            <h4 className="text-white font-serif italic text-lg">{wr.title}</h4>
                                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">With {wr.talent.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] text-ffn-primary font-black uppercase tracking-widest">{wr.milestones.filter(m => m.status === 'COMPLETED').length}/{wr.milestones.length} Tasks</p>
                                                        <p className="text-[8px] text-gray-500 font-bold uppercase tracking-widest mt-1">Last active 2h ago</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                    <button className="w-full mt-6 py-4 border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/50 hover:text-ffn-primary hover:border-ffn-primary/30 transition-all">
                                        View All Workspaces
                                    </button>
                                </div>
                            </div>

                            {/* Active Campaigns */}
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-lg space-y-8">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-serif italic font-bold">Active Campaigns</h3>
                                    <Zap className="w-4 h-4 text-ffn-primary" />
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { title: "Summer Editorial '25", status: 'Live', applicants: 12, matchRate: 85 },
                                        { title: 'Streetwear Launch', status: 'Shortlisting', applicants: 4, matchRate: 92 },
                                    ].map((camp, i) => (
                                        <div key={i} className="p-6 bg-gray-50 rounded-2xl space-y-4 hover:bg-gray-100 transition-colors cursor-pointer">
                                            <div className="flex justify-between items-start">
                                                <h4 className="font-serif italic font-bold text-lg">{camp.title}</h4>
                                                <span className={`text-[8px] px-2 py-1 rounded-full uppercase tracking-widest font-black ${camp.status === 'Live' ? 'bg-emerald-100 text-emerald-600' : 'bg-ffn-primary/10 text-ffn-primary'}`}>
                                                    {camp.status}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex -space-x-2">
                                                    {[1, 2, 3].map(j => (
                                                        <img key={j} src={`https://i.pravatar.cc/100?img=${j + 20}`} className="w-6 h-6 rounded-full border-2 border-white shadow-sm" alt="" />
                                                    ))}
                                                    <div className="w-6 h-6 rounded-full bg-white border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-gray-400">+{camp.applicants}</div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black uppercase tracking-widest text-ffn-primary">{camp.matchRate}% Match Rate</p>
                                                    <p className="text-[8px] text-gray-400">AI Recommendation Strength</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <button className="w-full py-5 border-2 border-dashed border-gray-100 rounded-2xl text-[9px] font-bold uppercase tracking-[0.3em] text-gray-300 hover:border-ffn-primary hover:text-ffn-primary transition-all">Launch New Campaign</button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {
                    activeTab === 'search' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="relative flex-1">
                                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search models, photographers, stylists..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-ffn-primary/20 transition-all outline-none"
                                    />
                                </div>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className={`px-8 py-6 rounded-[2rem] flex items-center space-x-3 shadow-sm transition-all ${showFilters ? 'bg-ffn-black text-white' : 'bg-white border border-gray-100 text-ffn-black hover:bg-gray-50'}`}
                                >
                                    <Filter className="w-5 h-5" />
                                    <span className="text-[10px] uppercase tracking-widest font-black">Filters</span>
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
                                        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Collaborations (Min)</label>
                                                <input
                                                    title="Min Brand Credits"
                                                    type="range"
                                                    min="0" max="50"
                                                    value={filters.brandCredits}
                                                    onChange={(e) => setFilters({ ...filters, brandCredits: parseInt(e.target.value) })}
                                                    className="w-full accent-ffn-primary"
                                                />
                                                <p className="text-[9px] font-bold text-ffn-primary uppercase tracking-widest">{filters.brandCredits}+ Credits</p>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Experience</label>
                                                <select
                                                    title="Experience Level"
                                                    value={filters.experience}
                                                    onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                                                    className="w-full bg-gray-50 border-none rounded-2xl py-4 px-6 text-[10px] font-bold uppercase tracking-widest"
                                                >
                                                    <option value="ALL">All Levels</option>
                                                    <option value="beginner">Beginner</option>
                                                    <option value="intermediate">Intermediate</option>
                                                    <option value="pro">Professional</option>
                                                </select>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Verification</label>
                                                <button
                                                    onClick={() => setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })}
                                                    className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${filters.verifiedOnly ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-400'}`}
                                                >
                                                    {filters.verifiedOnly ? 'Verified Only' : 'All Talent'}
                                                </button>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-[10px] uppercase font-black tracking-widest text-gray-400">Identity Status</label>
                                                <div className="flex gap-2">
                                                    {['MODEL', 'PHOTOGRAPHER', 'STYLIST'].map(r => (
                                                        <button
                                                            key={r}
                                                            onClick={() => setFilters({ ...filters, role: filters.role === r ? 'ALL' : r })}
                                                            className={`flex-1 py-4 rounded-2xl text-[8px] font-bold uppercase tracking-widest transition-all ${filters.role === r ? 'bg-ffn-primary text-white' : 'bg-gray-50 text-gray-400'}`}
                                                        >
                                                            {r[0]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredTalent.map((talent) => (
                                    <motion.div
                                        key={talent.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl group hover:shadow-2xl transition-all"
                                    >
                                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                                            <img src={talent.avatarUrl} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt={talent.displayName} />
                                            <button title="Save Talent" className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-ffn-black transition-all">
                                                <Bookmark className={`w-4 h-4 ${talent.isFeatured ? 'fill-current' : ''}`} />
                                            </button>
                                        </div>
                                        <div className="p-8 space-y-4">
                                            <div>
                                                <h4 className="text-xl font-serif italic font-bold">{talent.displayName}</h4>
                                                <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">{talent.role} • {talent.location}</p>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <span className="flex items-center text-[9px] uppercase tracking-widest font-black text-ffn-primary bg-ffn-primary/10 px-3 py-1.5 rounded-full"><Star className="w-3 h-3 mr-1 fill-current" /> {talent.avgRating || '4.8'}</span>
                                                {talent.isVerified && (
                                                    <span className="flex items-center text-[9px] uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</span>
                                                )}
                                                {talent.brandCollaborationsCount && (
                                                    <span className="flex items-center text-[9px] uppercase tracking-widest font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full"><Plus className="w-3 h-3 mr-1" /> {talent.brandCollaborationsCount} Credits</span>
                                                )}
                                            </div>
                                            <button className="w-full py-4 mt-4 bg-gray-50 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-ffn-black hover:text-white transition-all">View Profile</button>
                                        </div>
                                    </motion.div>
                                ))}

                                {filteredTalent.length === 0 && (
                                    <div className="col-span-full py-20 text-center">
                                        <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                        <p className="text-xl font-serif italic text-gray-400">No matching talent found</p>
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
                                <MoodBoards
                                    currentUser={user as unknown as User}
                                    onSelectBoard={(id) => setSelectedMoodBoardId(id)}
                                />
                            )}
                        </motion.div>
                    )
                }

                {
                    activeTab === 'castings' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                            {activeLiveCastingId ? (
                                <LiveCastingRoom
                                    castingId={activeLiveCastingId}
                                    currentUser={user as unknown as User}
                                    isHost={true}
                                    onLeave={() => setActiveLiveCastingId(null)}
                                />
                            ) : (
                                <>
                                    <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                        <h3 className="text-2xl font-serif italic px-4">Manage Castings</h3>
                                        <button className="px-8 py-4 bg-ffn-primary text-white rounded-full flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-ffn-primary/20 hover:scale-105 transition-all">
                                            <Plus className="w-4 h-4" /> <span>New Casting</span>
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {[1, 2].map(i => (
                                            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-md flex flex-col md:flex-row justify-between md:items-center gap-6">
                                                <div className="space-y-2">
                                                    <div className="flex items-center space-x-4">
                                                        <h4 className="text-xl font-serif italic text-ffn-black font-bold">Summer Editorial Campaign</h4>
                                                        <span className="text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Active</span>
                                                    </div>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-2" /> Mumbai • 12 Applicants</p>
                                                </div>
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setActiveLiveCastingId('lc1')}
                                                        className="px-6 py-3 bg-red-50 text-red-500 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-red-500 hover:text-white transition-all flex items-center space-x-2"
                                                    >
                                                        <Video className="w-3 h-3" /> <span>Live Room</span>
                                                    </button>
                                                    <button className="px-6 py-3 bg-gray-50 text-ffn-black rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-gray-100 transition-all">Applicants</button>
                                                    <button className="px-6 py-3 bg-ffn-black text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-ffn-primary transition-all">Edit</button>
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
                            <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                <div>
                                    <h3 className="text-2xl font-serif italic px-4">Automated Contracts</h3>
                                    <p className="text-sm text-gray-500 px-4 mt-1">Manage ESIGN-compliant releases and NDAs.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {MOCK_CONTRACTS.map(contract => (
                                    <div key={contract.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-md flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:border-ffn-primary/20 transition-all">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                                                    <ScrollText className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="text-xl font-serif italic text-ffn-black font-bold group-hover:text-ffn-primary transition-colors cursor-pointer" onClick={() => setViewingContractId(contract.id)}>{contract.type} Agreement</h4>
                                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Drafted with Kunal Murari</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex space-x-4 items-center">
                                            {contract.status === 'completed' && <span className="text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Fully Executed</span>}
                                            {contract.status === 'pending_brand' && <span className="text-[9px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Needs Your Sign</span>}
                                            {contract.status === 'pending_talent' && <span className="text-[9px] bg-gray-50 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Pending Talent</span>}
                                            <button onClick={() => setViewingContractId(contract.id)} className="px-6 py-3 bg-gray-50 text-ffn-black rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-gray-100 transition-all ml-4">
                                                View Document
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
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                            <div className="text-center space-y-4 mb-12">
                                <h2 className="text-4xl font-serif italic text-ffn-black">Brand Pro Plans</h2>
                                <p className="text-gray-400 text-sm max-w-lg mx-auto">Scale your talent discovery and casting operations with our elite enterprise tools.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {[
                                    { id: 'BRAND_PRO', label: 'Agency Pro', price: 4999, features: ['Unlimited Casting Posts', 'Advanced AI Talent Matching', 'Direct Escrow Booking', 'Priority Support'] },
                                    { id: 'BRAND_ENTERPRISE', label: 'Enterprise Network', price: 14999, features: ['Everything in Pro', 'Custom API Access', 'Dedicated Account Manager', 'White-label Casting Portal'] },
                                ].map((plan, i) => (
                                    <div key={i} className={`p-12 rounded-[3.5rem] border shadow-2xl flex flex-col justify-between space-y-10 group transition-all ${plan.id === 'BRAND_ENTERPRISE' ? 'bg-ffn-black text-white border-ffn-black' : 'bg-white border-gray-100'}`}>
                                        <div className="space-y-6">
                                            <h3 className="text-3xl font-serif italic">{plan.label}</h3>
                                            <div className="flex items-end space-x-2">
                                                <p className="text-6xl font-serif font-bold tracking-tighter">{PRICING.CURRENCY}{plan.price}</p>
                                                <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">/ month</p>
                                            </div>
                                            <ul className="space-y-4 pt-4 border-t border-gray-100/20">
                                                {plan.features.map((f, j) => (
                                                    <li key={j} className="flex items-center space-x-3 text-[10px] uppercase font-black tracking-widest opacity-80">
                                                        <CheckCircle className={`w-4 h-4 ${plan.id === 'BRAND_ENTERPRISE' ? 'text-ffn-primary' : 'text-emerald-500'}`} />
                                                        <span>{f}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {activePlanBox === plan.id ? (
                                            <div className="mt-4 animate-in fade-in zoom-in duration-300">
                                                <PayPalButton
                                                    amount={(plan.price / 80).toFixed(2)} // Approximate INR to USD
                                                    currency="USD"
                                                    type="capture"
                                                    onSuccess={(data) => handlePayPalSuccess(plan.id, data.id)}
                                                />
                                                <button
                                                    onClick={() => setActivePlanBox(null)}
                                                    className="w-full mt-4 py-3 text-[10px] uppercase font-bold text-gray-400 hover:text-ffn-primary transition-colors"
                                                >
                                                    Cancel Checkout
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setActivePlanBox(plan.id)}
                                                disabled={!!isSubscribing}
                                                className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 ${plan.id === 'BRAND_ENTERPRISE' ? 'bg-white text-ffn-black hover:bg-ffn-primary hover:text-white' : 'bg-ffn-black text-white hover:bg-ffn-primary'}`}
                                            >
                                                {isSubscribing === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                                <span>{isSubscribing === plan.id ? 'Syncing...' : 'Upgrade Now'}</span>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )
                }
                {
                    activeTab === 'campaigns' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                            <CampaignCommandCenter />
                        </motion.div>
                    )
                }
                {
                    activeTab === 'collections' && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                            <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                                <div>
                                    <h3 className="text-2xl font-serif italic px-4">Talent Collections</h3>
                                    <p className="text-sm text-gray-500 px-4 mt-1">Organize and curate talent for your upcoming campaigns.</p>
                                </div>
                                <button className="px-8 py-4 bg-ffn-black text-white rounded-full flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest shadow-xl hover:bg-ffn-primary transition-all">
                                    <Plus className="w-4 h-4" /> <span>Create New Collection</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {MOCK_TALENT_COLLECTIONS.map((col) => (
                                    <motion.div
                                        key={col.id}
                                        whileHover={{ y: -10 }}
                                        className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl group cursor-pointer"
                                    >
                                        <div className="h-56 relative">
                                            <img src={col.coverImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]" alt="" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                            <div className="absolute bottom-6 left-8 right-8">
                                                <h4 className="text-2xl font-serif italic text-white font-bold">{col.title}</h4>
                                                <div className="flex items-center justify-between mt-2">
                                                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-bold">{col.talentIds.length} Talent Nodes</p>
                                                    <span className={`text-[8px] px-2 py-1 rounded-full uppercase tracking-widest font-black ${col.isPublic ? 'bg-emerald-500/20 text-emerald-400' : 'bg-ffn-primary/20 text-ffn-primary'}`}>
                                                        {col.isPublic ? 'Public' : 'Private'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <p className="text-xs text-gray-400 font-serif italic line-clamp-2 mb-6">{col.description}</p>
                                            <div className="flex -space-x-3">
                                                {col.talentIds.slice(0, 4).map((tid, i) => {
                                                    const talent = MOCK_TALENT_POOL.find(t => t.id === tid);
                                                    return (
                                                        <img key={i} src={talent?.avatarUrl} className="w-10 h-10 rounded-full border-2 border-white shadow-lg" alt="" />
                                                    );
                                                })}
                                                {col.talentIds.length > 4 && (
                                                    <div className="w-10 h-10 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-gray-400">
                                                        +{col.talentIds.length - 4}
                                                    </div>
                                                )}
                                            </div>
                                            <button className="w-full mt-8 py-4 border border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-ffn-primary group-hover:border-ffn-primary/30 transition-all">
                                                View Collection Details
                                            </button>
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
                            <AdvancedAnalytics />
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
                        <LiveCastingRoom
                            castingId={activeLiveCastingId}
                            currentUser={user}
                            isHost={true}
                            onClose={() => setActiveLiveCastingId(null)}
                        />
                    )
                }
            </AnimatePresence >
        </div >
    );
};
