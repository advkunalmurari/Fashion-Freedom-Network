import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, UserRole, VerificationLevel, Post } from '../types';
import { postService } from '../services/postService';
import {
  MapPin, Instagram, Mail, Share2, Grid, CheckCircle, ArrowLeft, ShieldCheck,
  ExternalLink, Briefcase, FileText, Download, X, Star, Sparkles, Send, Loader2,
  UserPlus, UserCheck, UserMinus, MessageSquarePlus, Zap, Bookmark, Play, ScrollText, TrendingUp, FolderPlus,
  Activity, Users, Calendar, Lock, ShieldCheck as ShieldIcon, Wallet, Instagram as InstaIcon, Twitter, Linkedin, Globe
} from 'lucide-react';
import { m, AnimatePresence } from 'framer-motion';
import { networkService } from '../services/networkService';
import { messageService } from '../services/messageService';
import { supabase } from '../supabase';
import { SavedPosts } from './SavedPosts';
import { PayPalButton } from './PayPalButton';
import { MOCK_BRANDS, MOCK_CONTRACTS, MOCK_AR_MEASUREMENTS, MOCK_REELS, MOCK_MOOD_BOARDS, MOCK_CREATOR_INSIGHTS, MOCK_WAR_ROOMS, MOCK_TALENT_POOL } from '../constants';
import { MoodBoards } from './MoodBoards';
import { MoodBoardDetail } from './MoodBoardDetail';
import { ContractViewer } from './ContractViewer';
import { ARMeasurementBadge, ARMeasurementInlineBadge } from './ARMeasurementBadge';
import VerifiedMeasurementsCard from './VerifiedMeasurementsCard';
import { ReviewSystem } from './ReviewSystem';
import { VideoReelViewer } from './VideoReelViewer';
import { CreatorInsights } from './CreatorInsights';
import { ActivityFeed } from './ActivityFeed';
import { Link } from 'react-router-dom';
import { MediaKit } from './MediaKit';
import { AvailabilityCalendar } from './AvailabilityCalendar';
import { TeamNotes } from './TeamNotes';
import { MOCK_AVAILABILITY, MOCK_TEAM_COMMENTS, MOCK_EARNINGS } from '../constants';
import { PerformanceLedger } from './PerformanceLedger';
import { CreatorMicroSite } from './CreatorMicroSite';
import { AestheticPulse } from './AestheticPulse';
import { PortfolioLayoutEditor } from './PortfolioLayoutEditor';

export const ProfilePage: React.FC<{ user?: User; onBack: () => void }> = ({ user: initialUser, onBack }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(initialUser || null);
  const [isLoadingUser, setIsLoadingUser] = useState(!initialUser);
  const [showModelCard, setShowModelCard] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending_sent' | 'pending_received' | 'connected'>('none');
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [connectPitch, setConnectPitch] = useState('');
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedReelIndex, setSelectedReelIndex] = useState<number | null>(null);
  const [showMediaKit, setShowMediaKit] = useState(false);
  const [activeView, setActiveView] = useState<'portfolio' | 'reels' | 'saved' | 'reviews' | 'collaborations' | 'moodboards' | 'contracts' | 'measurements' | 'insights' | 'workspaces' | 'availability' | 'team_notes' | 'ledger'>('portfolio');
  const [showAddToBoardModal, setShowAddToBoardModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  const [portfolioPosts, setPortfolioPosts] = useState<Post[]>([]);
  const [isPortfolioLoading, setIsPortfolioLoading] = useState(true);
  const [viewingContractId, setViewingContractId] = useState<string | null>(null);
  const [selectedMoodBoardId, setSelectedMoodBoardId] = useState<string | null>(null);
  const [showMicroSite, setShowMicroSite] = useState(false);
  const [showLayoutEditor, setShowLayoutEditor] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (initialUser) {
        setUser(initialUser);
        setIsLoadingUser(false);
        return;
      }

      if (!id) {
        setIsLoadingUser(false);
        return;
      }

      setIsLoadingUser(true);
      // 1. Check Mock Pool
      const mockUser = MOCK_TALENT_POOL.find(u => u.id === id || u.username === id);
      if (mockUser) {
        setUser(mockUser);
        setIsLoadingUser(false);
        return;
      }

      // 2. Check Supabase
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) {
          const mappedUser: User = {
            id: data.id,
            username: data.username || data.full_name?.replace(/\s+/g, '').toLowerCase() || 'user',
            displayName: data.full_name || 'Anonymous User',
            avatarUrl: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name || 'User')}&background=random`,
            coverUrl: data.cover_url || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            role: (data.profile_type as UserRole) || UserRole.MODEL,
            verificationLevel: data.is_premium ? VerificationLevel.PREMIUM : (data.is_verified ? VerificationLevel.APPROVED : VerificationLevel.BASIC),
            isVerified: !!data.is_verified,
            isBoosted: !!data.is_premium,
            bio: data.bio || 'Rising talent on FFN.',
            followersCount: 0,
            followingCount: 0,
            location: data.location || 'Global',
            instagramUrl: data.instagram_url,
            completionScore: data.completion_score,
            isPremium: data.is_premium,
            brandCollaborationsCount: data.brand_collaborations_count || 0,
          };
          setUser(mappedUser);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setIsLoadingUser(false);
      }
    };

    fetchUser();
  }, [id, initialUser]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUserId(session.user.id);
        const fetchCurrentRole = async () => {
          const { data } = await supabase.from('profiles').select('role').eq('id', session.user.id).single();
          if (data) setCurrentUserRole(data.role as UserRole);
        };
        fetchCurrentRole();
      }
    });
    if (user?.id) {
      checkNetworkStatus();
    }
  }, [user?.id]);

  const isOwnProfile = currentUserId === user?.id;

  const checkNetworkStatus = async () => {
    if (!user?.id) return;
    const [following, connStatus] = await Promise.all([
      networkService.getFollowStatus(user.id),
      networkService.getConnectionStatus(user.id)
    ]);
    setIsFollowing(following);
    setConnectionStatus(connStatus);
  };

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user?.id) return;
      setIsPortfolioLoading(true);
      const res = await postService.getUserPosts(user.id);
      if (res.success && res.data) {
        setPortfolioPosts(res.data);
      }
      setIsPortfolioLoading(false);
    };
    fetchPortfolio();
  }, [user?.id]);

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

  if (isLoadingUser) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ffn-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-center px-8">
        <X className="w-16 h-16 text-gray-200" />
        <h2 className="text-2xl font-serif italic">Identity Not Found</h2>
        <p className="text-gray-400 text-sm max-w-md uppercase tracking-widest">The requested professional protocol is not active in our dataset.</p>
        <button
          className="px-8 py-3 bg-ffn-black text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-ffn-primary transition-all"
          onClick={onBack}
        >
          Return to Registry
        </button>
      </div>
    );
  }

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
          <div className="w-full lg:w-2/5 aspect-[4/5] bg-white rounded-[3rem] border border-gray-100 overflow-hidden relative shadow-2xl group">
            <img src={user.avatarUrl} className="w-full h-full object-cover" alt={user.displayName} />

            {/* Micro-SITE Entry Point */}
            <div className="absolute inset-0 bg-ffn-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-sm">
              <button
                onClick={() => setShowMicroSite(true)}
                className="px-10 py-5 bg-white text-ffn-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-2xl"
              >
                View Micro-SITE
              </button>
            </div>

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

            <div className="flex flex-wrap items-center gap-4">
              <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-600 max-w-2xl italic">"{user.bio}"</p>

              <div className="flex items-center space-x-3 bg-white/50 backdrop-blur-sm p-2 px-4 rounded-2xl border border-gray-100">
                {[
                  { icon: InstaIcon, url: user.instagramUrl, label: 'Instagram' },
                  { icon: Twitter, url: user.twitterUrl, label: 'Twitter' },
                  { icon: Linkedin, url: user.linkedinUrl, label: 'LinkedIn' },
                  { icon: Globe, url: user.websiteUrl, label: 'Website' }
                ].map((social, idx) => (
                  <m.a
                    key={idx}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2, scale: 1.1 }}
                    className={`p-2 rounded-xl transition-all ${social.url ? 'text-ffn-black hover:bg-white hover:shadow-sm' : 'text-gray-300 pointer-events-none'}`}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </m.a>
                ))}
              </div>
            </div>

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

            {/* AR Measurement inline badge — only for models */}
            {(user.role === 'MODEL' || (user.role as string) === 'MAKEUP_ARTIST') && (
              <ARMeasurementInlineBadge talentId={user.id} measurements={MOCK_AR_MEASUREMENTS} />
            )}

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
              <button
                onClick={() => setShowModelCard(true)}
                className="bg-white border border-gray-100 text-ffn-black flex-1 py-7 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 hover:bg-gray-50 transition-all shadow-sm group"
              >
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-ffn-primary" /> <span>Composite</span>
              </button>
              <button
                onClick={() => setShowMediaKit(true)}
                className="bg-white border border-ffn-primary/20 text-ffn-primary flex-1 py-7 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 hover:bg-ffn-primary hover:text-white transition-all shadow-lg group"
              >
                <Share2 className="w-5 h-5" /> <span>Media Kit</span>
              </button>
              {!isOwnProfile && (
                <button
                  onClick={() => setShowAddToBoardModal(true)}
                  className="bg-white border border-ffn-primary/20 text-ffn-primary p-7 rounded-[2rem] hover:bg-ffn-primary hover:text-white transition-all shadow-lg group"
                  title="Add to Mood Board"
                >
                  <FolderPlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Portfolio Showcase... */}
        <section className="space-y-12">
          <div className="flex items-center justify-between border-b border-gray-100 pb-10 overflow-x-auto no-scrollbar">
            <h3 className="text-3xl font-serif italic text-ffn-black shrink-0 mr-12">
              {activeView === 'portfolio' ? 'Professional Showcase' : 'Curated Collections'}
            </h3>
            <div className="flex items-center space-x-8 text-[10px] uppercase tracking-widest font-bold text-gray-400 shrink-0">
              <button
                onClick={() => setActiveView('portfolio')}
                className={`transition-all pb-10 -mb-[41px] ${activeView === 'portfolio' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveView('reels')}
                className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'reels' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Video Reels</span>
              </button>
              {isOwnProfile && (
                <button
                  onClick={() => setActiveView('workspaces')}
                  className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'workspaces' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                >
                  <Activity className="w-3.5 h-3.5 text-ffn-primary" />
                  <span>Workspaces</span>
                </button>
              )}
              {isOwnProfile && (
                <>
                  <button
                    onClick={() => setActiveView('saved')}
                    className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'saved' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Saved</span>
                  </button>
                  <button
                    onClick={() => { setActiveView('moodboards'); setSelectedMoodBoardId(null); }}
                    className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'moodboards' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Mood Boards</span>
                  </button>
                  <button
                    onClick={() => setActiveView('contracts')}
                    className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'contracts' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                  >
                    <ScrollText className="w-3.5 h-3.5" />
                    <span>Contracts</span>
                  </button>
                  <button
                    onClick={() => setActiveView('measurements')}
                    className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'measurements' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Measurements</span>
                  </button>
                  <button
                    onClick={() => setActiveView('insights')}
                    className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'insights' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Insights</span>
                  </button>
                  <button
                    onClick={() => setActiveView('ledger')}
                    className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'ledger' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                  >
                    <Wallet className="w-3.5 h-3.5" />
                    <span>Ledger</span>
                  </button>
                </>
              )}
              <button
                onClick={() => setActiveView('availability')}
                className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'availability' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule</span>
              </button>
              {!isOwnProfile && (currentUserRole === UserRole.BRAND || currentUserRole === UserRole.AGENCY) && (
                <button
                  onClick={() => setActiveView('team_notes')}
                  className={`transition-all pb-10 -mb-[41px] flex items-center space-x-2 ${activeView === 'team_notes' ? 'text-ffn-black border-b-2 border-ffn-black' : 'hover:text-ffn-black'}`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Team Notes</span>
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
              <m.div
                key="portfolio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {isPortfolioLoading ? (
                  <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-ffn-primary" /></div>
                ) : (
                  <div className="space-y-12">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-3xl font-serif italic text-ffn-black">Visual Narrative</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-ffn-primary mt-2">Curated Professional Works</p>
                      </div>
                      {isOwnProfile && (
                        <button
                          onClick={() => setShowLayoutEditor(true)}
                          className="flex items-center gap-2 px-6 py-2 bg-ffn-primary/10 border border-ffn-primary/20 rounded-full text-ffn-primary text-[10px] font-black tracking-widest hover:bg-ffn-primary hover:text-white transition-all"
                        >
                          <Grid className="w-4 h-4" />
                          LAYOUT EDIT
                        </button>
                      )}
                    </div>
                    {portfolioPosts.length > 0 ? (
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
                  </div>
                )}
              </m.div>
            ) : activeView === 'reels' ? (
              <m.div
                key="reels"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {MOCK_REELS.filter(r => r.authorId === user.id).length > 0 ? (
                    MOCK_REELS.filter(r => r.authorId === user.id).map((reel, idx) => (
                      <div
                        key={reel.id}
                        onClick={() => setSelectedReelIndex(idx)}
                        className="aspect-[9/16] overflow-hidden group rounded-[2.5rem] border border-gray-100 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 relative"
                      >
                        <img src={reel.thumbnailUrl} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt="" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-all duration-500" />
                        <div className="absolute bottom-6 left-6 flex items-center space-x-3 text-white">
                          <Play className="w-5 h-5 fill-current" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{reel.likes}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full bg-gray-50 rounded-[4rem] p-32 text-center space-y-8 border-2 border-dashed border-gray-200">
                      <div className="flex justify-center">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-xl">
                          <Play className="w-10 h-10" />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-3xl font-serif italic text-gray-400">No Reels Yet</h3>
                        <p className="text-xs text-gray-400 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">This talent hasn't uploaded any high-fashion motion content yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              </m.div>
            ) : activeView === 'saved' ? (
              <m.div
                key="saved"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <SavedPosts onBack={() => setActiveView('portfolio')} />
              </m.div>
            ) : activeView === 'contracts' && isOwnProfile ? (
              <m.div
                key="contracts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {MOCK_CONTRACTS.filter(c => c.talentId === user.id).length > 0 ? MOCK_CONTRACTS.filter(c => c.talentId === user.id).map(contract => (
                  <div key={contract.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-md flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:border-ffn-primary/20 transition-all">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center shrink-0">
                          <ScrollText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xl font-serif italic text-ffn-black font-bold group-hover:text-ffn-primary transition-colors cursor-pointer" onClick={() => setViewingContractId(contract.id)}>{contract.type} Agreement</h4>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Ref: {contract.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      {contract.status === 'completed' && <span className="text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Fully Executed</span>}
                      {contract.status === 'pending_brand' && <span className="text-[9px] bg-gray-50 text-gray-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Pending Brand</span>}
                      {contract.status === 'pending_talent' && <span className="text-[9px] bg-red-50 text-red-500 px-3 py-1 rounded-full uppercase tracking-widest font-black">Needs Your Sign</span>}
                      <button onClick={() => setViewingContractId(contract.id)} className="px-6 py-3 bg-gray-50 text-ffn-black rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-gray-100 transition-all ml-4">
                        View Document
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
                    <ScrollText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-serif italic text-xl">No active contracts</p>
                  </div>
                )}
              </m.div>
            ) : activeView === 'measurements' ? (
              <m.div
                key="measurements"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-lg"
              >
                {(() => {
                  const arData = MOCK_AR_MEASUREMENTS.find(ar => ar.talentId === user.id);
                  return arData ? (
                    <VerifiedMeasurementsCard measurements={arData} />
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 space-y-4">
                      <ShieldCheck className="w-14 h-14 text-gray-200 mx-auto" />
                      <p className="text-gray-400 font-serif italic text-xl">No AR measurements on record</p>
                      <p className="text-sm text-gray-400">Use the FFN mobile app to scan and verify your measurements via AR.</p>
                    </div>
                  );
                })()}
              </m.div>
            ) : activeView === 'moodboards' ? (

              <m.div
                key="moodboards"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {selectedMoodBoardId ? (
                  <MoodBoardDetail
                    boardId={selectedMoodBoardId}
                    currentUser={user}
                    onBack={() => setSelectedMoodBoardId(null)}
                  />
                ) : (
                  <MoodBoards
                    currentUser={user}
                    onSelectBoard={(id) => setSelectedMoodBoardId(id)}
                  />
                )}
              </m.div>
            ) : activeView === 'collaborations' ? (
              <m.div
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
              </m.div>
            ) : activeView === 'workspaces' && isOwnProfile ? (
              <m.div
                key="workspaces"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-2xl font-serif italic font-bold">Project War Rooms</h3>
                      <div className="px-4 py-2 bg-ffn-primary/10 rounded-full">
                        <p className="text-[10px] font-black uppercase tracking-widest text-ffn-primary">
                          {MOCK_WAR_ROOMS.filter(wr => wr.talent.id === user.id).length} Active
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                      {MOCK_WAR_ROOMS.filter(wr => wr.talent.id === user.id).length > 0 ? (
                        MOCK_WAR_ROOMS.filter(wr => wr.talent.id === user.id).map(wr => (
                          <Link
                            key={wr.id}
                            to={`/war-room/${wr.projectId}`}
                            className="group bg-ffn-black p-10 rounded-[3rem] shadow-2xl relative overflow-hidden transition-all hover:scale-[1.01]"
                          >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/10 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                            <div className="relative z-10 space-y-8">
                              <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                  <h4 className="text-2xl font-serif italic text-white font-bold">{wr.title}</h4>
                                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Brand: {wr.brand.name}</p>
                                </div>
                                <Activity className="w-6 h-6 text-ffn-primary animate-pulse" />
                              </div>

                              <div className="grid grid-cols-2 gap-6">
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Milestones</p>
                                  <p className="text-xl font-serif italic text-white mt-1">
                                    {wr.milestones.filter(m => m.status === 'COMPLETED').length}/{wr.milestones.length}
                                  </p>
                                </div>
                                <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                                  <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Deliverables</p>
                                  <p className="text-xl font-serif italic text-white mt-1">{wr.files.length} Assets</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden">
                                    <img src={wr.brand.logoUrl} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Last active 2h ago</p>
                                </div>
                                <button className="px-6 py-3 bg-ffn-primary text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white hover:text-ffn-black transition-all">
                                  Enter War Room
                                </button>
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-32 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-100 space-y-6">
                          <div className="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                            <Activity className="w-10 h-10 text-gray-200" />
                          </div>
                          <div className="space-y-2">
                            <h4 className="text-2xl font-serif italic text-gray-400">Collaborative HQ</h4>
                            <p className="text-sm text-gray-400 max-w-md mx-auto">Active projects will appear here once a contract is signed and the workspace is activated.</p>
                          </div>
                          <button className="px-10 py-5 bg-ffn-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all">
                            Explore Marketplace
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl sticky top-8">
                      <ActivityFeed limit={8} />
                    </div>
                  </div>
                </div>
              </m.div>
            ) : activeView === 'insights' && isOwnProfile ? (
              <m.div
                key="insights"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  <CreatorInsights insights={MOCK_CREATOR_INSIGHTS} />
                  <AestheticPulse />
                </div>
              </m.div>
            ) : activeView === 'availability' ? (
              <m.div
                key="availability"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <AvailabilityCalendar
                      slots={MOCK_AVAILABILITY.filter(s => s.userId === user.id)}
                      isEditable={isOwnProfile}
                    />
                  </div>
                  <div className="space-y-8">
                    <div className="bg-ffn-black p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-primary/20 blur-[60px] rounded-full translate-x-1/2 -translate-y-1/2" />
                      <h4 className="text-xl font-serif italic">Booking Insight</h4>
                      <p className="text-sm text-gray-400 leading-relaxed font-light">
                        March is peak season for {user.displayName}. We recommend requesting holds at least 14 days in advance for editorial shoots.
                      </p>
                      <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                        <div className="text-center">
                          <p className="text-2xl font-serif italic text-emerald-400">92%</p>
                          <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Reliability</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-serif italic text-white">4.9</p>
                          <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold">Avg Rating</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </m.div>
            ) : activeView === 'team_notes' ? (
              <m.div
                key="team_notes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                  <TeamNotes
                    comments={MOCK_TEAM_COMMENTS.filter(c => c.targetId === user.id)}
                    onAddComment={(content, tags) => {
                      console.log('Adding internal comment:', content, tags);
                      alert('Confidential note added to brand team ledger.');
                    }}
                    targetName={user.displayName}
                  />
                  <div className="space-y-8">
                    <div className="p-10 bg-gray-50 rounded-[3rem] border border-gray-100">
                      <h4 className="text-xl font-serif italic text-ffn-black mb-6">Brand Protocol</h4>
                      <ul className="space-y-6">
                        {[
                          { label: 'Confidentiality', text: 'All notes are strictly visible to your organization members only.' },
                          { label: 'Decision Support', text: 'Use tags to categorize talent during high-volume casting calls.' },
                          { label: 'Audit Trail', text: 'Comments are timestamped and attributed for clear recruitment pipelines.' }
                        ].map((item, i) => (
                          <li key={i} className="flex items-start space-x-4">
                            <div className="w-5 h-5 bg-white rounded-md border border-gray-100 flex items-center justify-center shrink-0 mt-1">
                              <ShieldIcon className="w-3 h-3 text-ffn-primary" />
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed"><span className="font-bold text-ffn-black">{item.label}:</span> {item.text}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </m.div>
            ) : activeView === 'ledger' && isOwnProfile ? (
              <m.div
                key="ledger"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <PerformanceLedger talentId={user.id} />
              </m.div>
            ) : (
              <m.div
                key="reviews"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <ReviewSystem talentId={user.id || 't1'} canLeaveReview={currentUserId !== user.id} />
              </m.div>
            )}
          </AnimatePresence>
        </section>
      </div>

      {/* Creator Micro-SITE Overlay */}
      <AnimatePresence>
        {showMicroSite && (
          <CreatorMicroSite
            creator={user}
            onClose={() => setShowMicroSite(false)}
          />
        )}
      </AnimatePresence>

      {/* Modals & Media Kit Overlay */}
      <AnimatePresence>
        {showModelCard && (
          <div className="fixed inset-0 z-[1200] flex items-center justify-center p-6 bg-ffn-black/90 backdrop-blur-xl">
            <m.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-4xl h-[90vh] rounded-[4rem] overflow-hidden relative flex flex-col md:flex-row shadow-2xl">
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
            </m.div>
          </div>
        )}

        {showConnectModal && (
          <div className="fixed inset-0 z-[1300] flex items-center justify-center p-6 bg-ffn-black/60 backdrop-blur-md">
            <m.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-lg rounded-[3.5rem] p-12 space-y-8 shadow-2xl">
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
            </m.div>
          </div>
        )}

        {showHireModal && (
          <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6 bg-ffn-black/60 backdrop-blur-md">
            <m.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white w-full max-w-xl rounded-[3.5rem] p-12 md:p-16 space-y-12 shadow-2xl">
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
            </m.div>
          </div>
        )}

        {viewingContractId && (
          <ContractViewer
            contract={MOCK_CONTRACTS.find(c => c.id === viewingContractId)!}
            currentUser={user}
            onClose={() => setViewingContractId(null)}
            onSign={(sig) => {
              console.log('Contract signed by Talent:', sig);
              setViewingContractId(null);
            }}
          />
        )}

        {showAddToBoardModal && (
          <div className="fixed inset-0 z-[1400] flex items-center justify-center p-6 bg-ffn-black/60 backdrop-blur-md">
            <m.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-[3rem] w-full max-w-md p-12 space-y-8 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-serif italic text-ffn-black">Save to Project</h3>
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Select a mood board for {user.displayName}</p>
                </div>
                <button title="Close Save to Project" onClick={() => setShowAddToBoardModal(false)} className="p-4 bg-gray-50 rounded-2xl hover:bg-rose-50 hover:text-red-500 transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar">
                {MOCK_MOOD_BOARDS.map(board => (
                  <button
                    key={board.id}
                    onClick={() => {
                      alert(`Successfully added ${user.displayName} to "${board.title}"`);
                      setShowAddToBoardModal(false);
                    }}
                    className="w-full flex items-center space-x-4 p-4 rounded-2xl border border-gray-100 hover:border-ffn-primary/30 hover:bg-gray-50 group transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 shrink-0">
                      {board.coverImage ? (
                        <img src={board.coverImage} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <Grid className="w-full h-full p-3 text-gray-300" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-black text-ffn-black truncate">{board.title}</p>
                      <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold mt-0.5">{board.items?.length || 0} Items</p>
                    </div>
                  </button>
                ))}
              </div>

              <button className="w-full py-5 border-2 border-dashed border-gray-200 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-400 hover:border-ffn-primary hover:text-ffn-primary transition-all">
                + Create New Board
              </button>
            </m.div>
          </div>
        )}

        {selectedReelIndex !== null && (
          <VideoReelViewer
            reels={MOCK_REELS.filter(r => r.authorId === user.id)}
            initialIndex={selectedReelIndex}
            onClose={() => setSelectedReelIndex(null)}
            onHireClick={() => setShowHireModal(true)}
          />
        )}
      </AnimatePresence>

      <MediaKit
        talent={user}
        isOpen={showMediaKit}
        onClose={() => setShowMediaKit(false)}
      />
    </div>
  );
};
