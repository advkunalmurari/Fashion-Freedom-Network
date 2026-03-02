import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, ArrowRight, User as UserIcon, Sparkles, SlidersHorizontal, MapPin, DollarSign, ShieldCheck, Instagram, Zap, Award, ExternalLink, Globe, Activity, Users } from 'lucide-react';
import { MOCK_TALENT_POOL } from '../constants';
import { UserRole, User } from '../types';
import { supabase } from '../supabase';
import { MagneticButton } from './MagneticButton';
import { TalentQuickLook } from './TalentQuickLook';

export const Directory: React.FC<{ onSelectTalent: (id: string) => void; onRegisterProfessional: () => void }> = ({ onSelectTalent, onRegisterProfessional }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<UserRole | 'ALL'>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [liveProfiles, setLiveProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    height: [140, 200],
    eyeColor: 'ALL',
    hairColor: 'ALL',
    experience: 'ALL',
    brandCredits: 0
  });
  const [selectedQuickLook, setSelectedQuickLook] = useState<User | null>(null);

  // Simulated Live Metrics
  const [metrics, setMetrics] = useState({
    activeSearches: 124,
    collaborationsToday: 18,
    newTalentHour: 3
  });

  const [castingPulse, setCastingPulse] = useState([
    { id: 1, text: "EDITORIAL CASTING: VOGUE INDIA // MUMBAI", time: "2M AGO" },
    { id: 2, text: "RUNWAY: MILAN FASHION WEEK // OPEN CALL", time: "5M AGO" },
    { id: 3, text: "COMMERCIAL: NIKE REVOLUTION // NYC", time: "12M AGO" }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        activeSearches: Math.max(100, prev.activeSearches + Math.floor(Math.random() * 11) - 5),
        collaborationsToday: prev.collaborationsToday + (Math.random() > 0.8 ? 1 : 0),
        newTalentHour: Math.max(1, prev.newTalentHour + (Math.random() > 0.9 ? 1 : (Math.random() > 0.9 ? -1 : 0)))
      }));

      // Rotate casting pulse
      setCastingPulse(prev => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('is_premium', { ascending: false })
          .order('search_rank_score', { ascending: false });

        if (!error && data) {
          const mappedLiveUsers: User[] = data.map(p => ({
            id: p.id,
            username: p.username || p.full_name?.replace(/\s+/g, '').toLowerCase() || 'user',
            displayName: p.full_name || 'Anonymous User',
            avatarUrl: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'User')}&background=random`,
            coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
            role: (p.profile_type as UserRole) || UserRole.MODEL,
            verificationLevel: p.is_premium ? 2 : (p.is_verified ? 1 : 0),
            isVerified: !!p.is_verified,
            isBoosted: !!p.is_premium,
            bio: p.bio || 'Rising talent on FFN.',
            followersCount: 0,
            followingCount: 0,
            location: p.location || 'Global',
            instagramUrl: p.instagram_url,
            completionScore: p.completion_score,
            pricing: p.pricing,
            isPremium: p.is_premium,
            premiumBadgeColor: p.premium_badge_color,
            brandCollaborationsCount: p.brand_collaborations_count || 0,
          }));
          setLiveProfiles([...mappedLiveUsers, ...MOCK_TALENT_POOL]);
        } else {
          setLiveProfiles(MOCK_TALENT_POOL);
        }
      } catch (e) {
        setLiveProfiles(MOCK_TALENT_POOL);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const filteredTalent = liveProfiles.filter(t => {
    const matchesSearch = t.displayName.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()) ||
      t.username.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'ALL' || t.role === activeFilter;
    const matchesVerified = !onlyVerified || t.isVerified;

    const talentHeight = t.arMeasurements?.height || 170;
    const matchesHeight = talentHeight >= filters.height[0] && talentHeight <= filters.height[1];
    const matchesExperience = filters.experience === 'ALL' || t.experienceLevel === filters.experience;
    const matchesBrandCredits = (t.brandCollaborationsCount || 0) >= filters.brandCredits;

    return matchesSearch && matchesFilter && matchesVerified && matchesHeight && matchesExperience && matchesBrandCredits;
  });

  return (
    <div className="space-y-24 pb-32 bg-[#fafafa]">
      <header className="relative py-32 px-12 rounded-[6rem] overflow-hidden bg-ffn-black shadow-[0_50px_100px_rgba(0,0,0,0.5)] mx-4 mt-4">
        {/* Background Visuals - Enhanced with Video-like Motion */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2564&auto=format&fit=crop"
            className="w-full h-full object-cover opacity-50 scale-105"
            alt=""
          />
          <div className="absolute inset-0 bg-gradient-to-br from-ffn-black via-ffn-black/40 to-ffn-black/90 mix-blend-multiply" />

          {/* Animated Light Orbs */}
          <motion.div
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.4, 1],
              x: [-100, 100, -100],
              y: [-50, 50, -50]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-[1200px] h-[1200px] bg-ffn-primary/20 blur-[250px] rounded-full"
          />
          <motion.div
            animate={{
              opacity: [0.1, 0.2, 0.1],
              scale: [1.2, 0.8, 1.2],
              x: [100, -100, 100],
              y: [50, -50, 50]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-ffn-accent/10 blur-[200px] rounded-full"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto space-y-24">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-16">
            <div className="space-y-8 max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center space-x-6 px-8 py-3 rounded-full bg-white/5 backdrop-blur-3xl border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.6em] shadow-2xl"
              >
                <div className="flex items-center space-x-2">
                  <Activity className="w-3 h-3 text-ffn-primary animate-pulse" />
                  <span>Live Graph Node: ACTIVE</span>
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1"><Users className="w-3 h-3 text-white/40" /> <b>{metrics.activeSearches}</b></span>
                  <span className="flex items-center space-x-1"><Globe className="w-3 h-3 text-white/40" /> <b>{metrics.collaborationsToday}</b></span>
                </div>
              </motion.div>

              <h1 className="text-8xl md:text-[11rem] font-serif italic text-white leading-[0.8] tracking-tighter drop-shadow-2xl">
                The Master <br />
                <span className="text-ffn-primary not-italic font-sans font-black uppercase tracking-tighter block mt-4 text-7xl md:text-9xl">Identity Graph</span>
              </h1>

              <p className="text-lg md:text-xl text-white/50 max-w-xl font-medium leading-relaxed tracking-wide">
                Examine the worldwide creative dataset. Filter through mastery metrics, AR-verified attributes, and verified collaboration history.
              </p>

              {/* Interactive Casting Pulse Ticker */}
              <div className="h-12 overflow-hidden relative border-l-2 border-ffn-primary pl-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={castingPulse[0].id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="flex items-center space-x-6 h-full"
                  >
                    <div className="w-2 h-2 bg-ffn-primary rounded-full animate-ping" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">{castingPulse[0].text}</span>
                    <span className="text-[9px] font-bold text-ffn-primary/60">{castingPulse[0].time}</span>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <div className="flex flex-col items-start lg:items-end space-y-10">
              <div className="p-8 rounded-[3.5rem] bg-white text-ffn-black shadow-2xl space-y-6 max-w-sm border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-ffn-primary rounded-2xl flex items-center justify-center shadow-lg shadow-ffn-primary/30">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-xl font-black uppercase tracking-tight">Showcase Yourself</h4>
                </div>
                <p className="text-xs font-bold text-gray-500 leading-normal uppercase tracking-widest">Register your professional identity to be featured in the global hero section.</p>
                <MagneticButton>
                  <button
                    onClick={onRegisterProfessional}
                    className="w-full bg-ffn-black text-white px-8 py-5 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-between group hover:bg-ffn-primary transition-all shadow-xl shadow-ffn-primary/10"
                  >
                    <span>Begin Registration</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </button>
                </MagneticButton>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 space-y-10">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="relative flex-1 group">
                <Search className="absolute left-10 top-1/2 -translate-y-1/2 w-8 h-8 text-white/20 group-focus-within:text-ffn-primary transition-all duration-500" />
                <input
                  type="text"
                  placeholder="EXAMINE BY NAME, MASTERY, OR LOCATION..."
                  className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] py-10 pl-24 pr-12 text-[12px] font-black text-white placeholder:text-white/20 uppercase tracking-[0.4em] shadow-2xl focus:border-ffn-primary/40 focus:bg-white/10 transition-all outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-16 py-10 rounded-[3rem] text-[11px] font-black uppercase tracking-[0.4em] border transition-all flex items-center space-x-6 ${showAdvancedFilters ? 'bg-white text-ffn-black border-white shadow-2xl' : 'bg-white/5 border-white/10 text-white/30 hover:border-ffn-primary/40 hover:text-white'}`}
              >
                <SlidersHorizontal className="w-6 h-6" />
                <span>Smart Parameters</span>
              </button>
            </div>

            {/* Trending Categories */}
            <div className="flex flex-wrap gap-5">
              {['#RunwayMastery', '#EditorialFuture', '#CyberAesthetics', '#SustainableLuxe', '#MinimalistVanguard', '#NeoTraditional', '#MetaverseCouture'].map(tag => (
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  key={tag}
                  className="px-8 py-4 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] text-white/30 hover:text-white hover:bg-white/10 hover:border-ffn-primary/60 transition-all shadow-lg shadow-black/20"
                >
                  {tag}
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {showAdvancedFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative z-10 bg-ffn-black/60 backdrop-blur-[80px] p-16 rounded-[5rem] border border-white/10 mt-12 grid grid-cols-1 md:grid-cols-3 gap-16 overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
            >
              <div className="space-y-8">
                <label className="text-[11px] uppercase tracking-[0.4em] font-black text-white/40">Mastery Category</label>
                <div className="grid grid-cols-2 gap-3">
                  {(['ALL', ...Object.values(UserRole)] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setActiveFilter(role)}
                      className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all ${activeFilter === role ? 'bg-ffn-primary text-white shadow-xl shadow-ffn-primary/30' : 'bg-white/5 border border-white/10 text-white/30 hover:text-white hover:bg-white/10'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-8">
                <label className="text-[11px] uppercase tracking-[0.4em] font-black text-white/40">Protocol Verification</label>
                <button
                  onClick={() => setOnlyVerified(!onlyVerified)}
                  className={`w-full py-6 rounded-3xl text-[11px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-4 ${onlyVerified ? 'bg-emerald-500 text-white shadow-2xl shadow-emerald-500/30' : 'bg-white/5 border border-white/10 text-white/30 hover:border-white/20'}`}
                >
                  <ShieldCheck className="w-6 h-6" />
                  <span>Verified Nodes Only</span>
                </button>

                <div className="p-8 rounded-[2.5rem] bg-ffn-primary/10 border border-ffn-primary/20 space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-[0.3em] text-ffn-primary">Live Data Stream</p>
                  <div className="flex items-center justify-between text-white/60 text-[10px] font-bold tracking-widest uppercase">
                    <span>New Nodes (1h)</span>
                    <span className="text-ffn-primary">+{metrics.newTalentHour}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-8">
                <label className="text-[11px] uppercase tracking-[0.4em] font-black text-white/40">Physical Attributes (AR-LOCKED)</label>
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
                      <span>Height Span</span>
                      <span className="text-ffn-primary">{filters.height[0]} - {filters.height[1]}cm</span>
                    </div>
                    <input
                      title="Height Range Filter"
                      type="range"
                      min="140"
                      max="200"
                      value={filters.height[1]}
                      onChange={(e) => setFilters({ ...filters, height: [filters.height[0], parseInt(e.target.value)] })}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none accent-ffn-primary cursor-pointer"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20">Eye Spectrum</p>
                      <div className="flex flex-wrap gap-3">
                        {['Brown', 'Blue', 'Green', 'Hazel', 'Grey'].map(c => (
                          <motion.button
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            key={c}
                            onClick={() => setFilters({ ...filters, eyeColor: filters.eyeColor === c ? 'ALL' : c })}
                            className={`w-10 h-10 rounded-full border-2 transition-all shadow-xl ${filters.eyeColor === c ? 'border-ffn-primary scale-125 shadow-ffn-primary/40' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-110'}`}
                            style={{ backgroundColor: c === 'Brown' ? '#78350f' : c === 'Blue' ? '#2563eb' : c === 'Green' ? '#059669' : c === 'Hazel' ? '#b45309' : '#9ca3af' }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <p className="text-[9px] uppercase tracking-[0.4em] font-black text-white/20">Hair Spectrum</p>
                      <div className="flex flex-wrap gap-3">
                        {['Black', 'Brown', 'Blonde', 'Auburn', 'Grey'].map(c => (
                          <motion.button
                            whileHover={{ scale: 1.2, y: -2 }}
                            whileTap={{ scale: 0.9 }}
                            key={c}
                            onClick={() => setFilters({ ...filters, hairColor: filters.hairColor === c ? 'ALL' : c })}
                            className={`w-10 h-10 rounded-full border-2 transition-all shadow-xl ${filters.hairColor === c ? 'border-ffn-primary scale-125 shadow-ffn-primary/40' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-110'}`}
                            style={{ backgroundColor: c === 'Black' ? '#000000' : c === 'Brown' ? '#451a03' : c === 'Blonde' ? '#fef08a' : c === 'Auburn' ? '#7f1d1d' : '#e5e7eb' }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <motion.div layout className="space-y-32">
        {!search && activeFilter === 'ALL' && !onlyVerified ? (
          <div className="space-y-48">
            {/* Vanguard Section - Horizontal Elite Scroll */}
            <div className="space-y-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 px-8">
                <div className="space-y-4">
                  <h3 className="text-6xl font-serif italic text-ffn-black tracking-tighter">Vanguard Talent</h3>
                  <p className="text-[11px] font-black uppercase tracking-[0.6em] text-gray-400">Master Entities Defining the Global Aesthetic Curve</p>
                </div>
                <button className="px-8 py-4 rounded-full border border-gray-200 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ffn-black hover:text-white transition-all">Scan Full Graph</button>
              </div>
              <div className="flex overflow-x-auto gap-16 pb-16 no-scrollbar px-8 snap-x">
                {liveProfiles.filter(p => p.role === UserRole.MODEL).slice(0, 6).map(talent => (
                  <TalentCard key={talent.id} talent={talent} onSelectTalent={() => setSelectedQuickLook(talent)} />
                ))}
              </div>
            </div>

            {/* Creative Collective - Dark Theme Immersive */}
            <div className="space-y-20 bg-ffn-black text-white py-32 px-12 md:px-24 rounded-[8rem] relative overflow-hidden mx-4 shadow-[0_80px_160px_rgba(0,0,0,0.8)]">
              <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-ffn-primary/10 blur-[200px] rounded-full pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-ffn-accent/5 blur-[150px] rounded-full pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-12 mb-16">
                <div className="space-y-6">
                  <h3 className="text-7xl font-serif italic tracking-tighter">Creative <span className="text-ffn-primary">Collective</span></h3>
                  <p className="text-[12px] font-black uppercase tracking-[0.5em] text-white/30 max-w-lg">Advanced nodes across photography, styling, and visual arts.</p>
                </div>
                <button className="px-12 py-5 rounded-3xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-ffn-black transition-all">Expand Dataset</button>
              </div>
              <div className="flex overflow-x-auto gap-16 pb-12 no-scrollbar relative z-10 snap-x">
                {liveProfiles.filter(p => [UserRole.ARTIST, UserRole.STYLIST, UserRole.BRAND, UserRole.DESIGNER].includes(p.role as any)).slice(0, 8).map(talent => (
                  <TalentCard key={talent.id} talent={talent} onSelectTalent={() => setSelectedQuickLook(talent)} darkTheme />
                ))}
              </div>
            </div>

            {/* Global Projections - Dynamic Grid */}
            <div className="space-y-24 max-w-[90rem] mx-auto px-8">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  className="inline-block px-8 py-3 rounded-full bg-ffn-primary/5 border border-ffn-primary/10 text-ffn-primary text-[10px] font-black uppercase tracking-[0.5em]"
                >
                  Trending Worldwide
                </motion.div>
                <h3 className="text-7xl md:text-8xl font-serif italic text-ffn-black tracking-tighter">Global Projections</h3>
                <p className="text-[12px] font-black uppercase tracking-[0.6em] text-gray-400 max-w-2xl mx-auto leading-relaxed">Discover the next wave of brilliance emerging from the digital fashion frontier.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 auto-rows-[450px]">
                {liveProfiles.slice(0, 3).map((talent, idx) => (
                  <div key={talent.id} className={`${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}>
                    <TalentCard talent={talent} onSelectTalent={() => setSelectedQuickLook(talent)} />
                  </div>
                ))}

                {/* Future Profile Widget - Interactive Registration Teaser */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="md:col-span-2 md:row-span-2 rounded-[5rem] bg-ffn-black relative overflow-hidden flex flex-col p-16 shadow-[0_60px_120px_rgba(0,0,0,0.4)] border border-white/10 group"
                >
                  <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-ffn-primary/20 via-transparent to-ffn-accent/20" />
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0],
                        opacity: [0.1, 0.2, 0.1]
                      }}
                      transition={{ duration: 10, repeat: Infinity }}
                      className="absolute -right-20 -top-20 w-96 h-96 bg-ffn-primary/20 blur-[100px] rounded-full"
                    />
                  </div>

                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="space-y-6">
                      <div className="inline-flex items-center space-x-4 px-6 py-2 rounded-full bg-ffn-primary/10 border border-ffn-primary/20 text-ffn-primary text-[9px] font-black uppercase tracking-[0.4em]">
                        <Sparkles className="w-3 h-3" />
                        <span>Identity Preview Engine</span>
                      </div>
                      <h4 className="text-5xl md:text-7xl font-serif italic text-white leading-none">
                        Preview Your <br />
                        <span className="text-ffn-primary not-italic font-sans font-black">Future Identity</span>
                      </h4>
                      <p className="text-white/40 text-[11px] font-medium uppercase tracking-[0.4em] max-w-sm">
                        Visualizing your professional trajectory on the global master graph.
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-10 border border-white/10 space-y-8">
                      <div className="flex items-center space-x-6">
                        <div className="w-20 h-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center relative overflow-hidden group-hover:border-ffn-primary/50 transition-colors">
                          <UserIcon className="w-10 h-10 text-white/20" />
                          <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-white/10 rounded-full animate-pulse" />
                          <div className="h-3 w-24 bg-white/5 rounded-full" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <div className="space-y-2">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Reliability Projection</p>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '85%' }}
                              className="h-full bg-ffn-primary shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">Marketability Pulse</p>
                          <div className="h-1.5 w-full bg-white/5 rounded-full">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: '92%' }}
                              className="h-full bg-ffn-accent shadow-[0_0_10px_rgba(252,176,69,0.5)]"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={onRegisterProfessional}
                        className="w-full py-6 rounded-2xl bg-white text-ffn-black text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ffn-primary hover:text-white transition-all shadow-2xl flex items-center justify-center space-x-4"
                      >
                        <span>Generate Full Identity</span>
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>

                {liveProfiles.slice(3, 10).map((talent, idx) => (
                  <div key={talent.id} className={`${idx % 5 === 0 ? 'md:row-span-2' : ''}`}>
                    <TalentCard talent={talent} onSelectTalent={() => setSelectedQuickLook(talent)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="editorial-grid gap-16 px-8 max-w-[90rem] mx-auto">
            <AnimatePresence mode="popLayout">
              {filteredTalent.map((talent) => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  onSelectTalent={() => setSelectedQuickLook(talent)}
                />
              ))}
            </AnimatePresence>

            {filteredTalent.length === 0 && (
              <div className="col-span-full py-72 text-center space-y-12">
                <div className="w-48 h-48 bg-gray-50 rounded-[5rem] flex items-center justify-center mx-auto mb-12 shadow-inner relative overflow-hidden border border-gray-100">
                  <UserIcon className="w-20 h-20 text-gray-200 relative z-10" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/10 to-ffn-accent/10 animate-pulse" />
                </div>
                <h3 className="text-6xl font-serif italic text-gray-300 tracking-tighter">Zero Projections Found</h3>
                <p className="text-[12px] uppercase tracking-[0.8em] text-gray-400 max-w-lg mx-auto leading-loose">Adjust your parameters to discover new nodes of artistic brilliance in our dataset.</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Talent QuickLook Overlay */}
      <AnimatePresence>
        {selectedQuickLook && (
          <div className="fixed inset-0 z-[150]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedQuickLook(null)}
              className="absolute inset-0 bg-ffn-black/60 backdrop-blur-2xl"
            />
            <TalentQuickLook
              talent={selectedQuickLook}
              onClose={() => setSelectedQuickLook(null)}
              onViewFullProfile={(id) => {
                setSelectedQuickLook(null);
                onSelectTalent(id);
              }}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface TalentCardProps {
  talent: User;
  onSelectTalent: (id: string) => void;
  darkTheme?: boolean;
}

const TalentCard: React.FC<TalentCardProps> = ({ talent, onSelectTalent, darkTheme = false }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ y: -20 }}
    onClick={() => onSelectTalent(talent.id)}
    className={`group cursor-pointer rounded-[5rem] border transition-all overflow-hidden shadow-2xl min-w-[340px] snap-center flex-1 ${darkTheme ? 'bg-white/5 border-white/10 hover:border-white/40 hover:shadow-[0_60px_120px_rgba(0,0,0,0.6)]' : 'bg-white border-gray-100 hover:border-ffn-primary/30 hover:shadow-[0_60px_120px_rgba(99,102,241,0.15)]'}`}
  >
    <div className="aspect-[4/5] relative overflow-hidden m-5 rounded-[4rem] group-hover:shadow-2xl transition-all duration-700">
      <img
        src={talent.avatarUrl}
        className="w-full h-full object-cover transition-all duration-[3s] ease-out group-hover:scale-110 group-hover:rotate-1"
        alt={talent.displayName}
      />

      {/* Holographic Projection on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/40 via-transparent to-ffn-accent/40 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none mix-blend-overlay" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(99,102,241,0.2),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Stats Deck - Revealed on Hover */}
      <div className="absolute inset-0 flex flex-col justify-end p-10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-12 group-hover:translate-y-0">
        <div className="bg-ffn-black/80 backdrop-blur-3xl p-10 rounded-[3.5rem] border border-white/10 space-y-8 shadow-2xl shadow-black/80">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Zap className="w-5 h-5 text-ffn-accent shadow-[0_0_10px_rgba(252,176,69,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Reliability Index</span>
            </div>
            <span className="text-2xl font-serif italic text-white">{talent.stats?.reliability || 98}%</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${talent.stats?.reliability || 98}%` }}
              className="h-full bg-ffn-primary shadow-[0_0_20px_rgba(99,102,241,1)]"
            />
          </div>
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em]">
            <span className="text-white/30">Completion</span>
            <span className="text-ffn-primary">{talent.completionScore || 100}%</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-10 right-10 z-20 group-hover:opacity-0 transition-all duration-700 ease-in-out">
        <div className="space-y-5">
          <div className="flex items-center space-x-5 text-white">
            <h4 className="text-5xl font-serif italic leading-none drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">{talent.displayName}</h4>
            {talent.isVerified && (
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-8 h-8 bg-ffn-primary/40 backdrop-blur-2xl rounded-full flex items-center justify-center border border-white/40 shadow-2xl shadow-ffn-primary/20"
              >
                <CheckCircle className="w-5 h-5 text-white" />
              </motion.div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-white/60" />
              <p className="text-[11px] uppercase tracking-[0.5em] text-white font-black max-w-[160px] truncate">{talent.location}</p>
            </div>
            <div className="bg-white/15 backdrop-blur-2xl px-6 py-2.5 rounded-full border border-white/30 border-t-white/50 shadow-xl">
              <span className="text-[10px] uppercase tracking-[0.4em] font-black text-white">{talent.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className={`p-12 flex items-center justify-between ${darkTheme ? 'text-white' : 'text-ffn-black'}`}>
      <div className="space-y-3">
        <div className="flex items-center space-x-4 opacity-80">
          <ShieldCheck className="w-5 h-5 text-ffn-primary" />
          <span className="text-[11px] uppercase tracking-[0.5em] font-black">Identity Secured</span>
        </div>
        <p className="text-[10px] text-gray-400 uppercase tracking-[0.5em] font-medium leading-none">FFN Protocol v3.0 // AR-LOCK</p>
      </div>
      <div className="flex items-center space-x-5">
        <button
          title="Quick Preview"
          onClick={(e) => {
            e.stopPropagation();
            onSelectTalent(talent.id);
          }}
          className="p-5 rounded-3xl bg-gray-50 border border-gray-100 hover:bg-ffn-primary hover:text-white hover:border-ffn-primary hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)] transition-all group/btn"
        >
          <ExternalLink className="w-6 h-6 transition-transform group-hover/btn:scale-110" />
        </button>
        <MagneticButton>
          <div
            className={`p-6 rounded-[2rem] transition-all shadow-[0_20px_40px_rgba(0,0,0,0.1)] ${darkTheme
              ? 'bg-white/10 text-white hover:bg-white hover:text-black'
              : 'bg-ffn-black text-white hover:bg-ffn-primary shadow-ffn-primary/30'
              }`}
          >
            <ArrowRight className="w-7 h-7" />
          </div>
        </MagneticButton>
      </div>
    </div>
  </motion.div>
);

