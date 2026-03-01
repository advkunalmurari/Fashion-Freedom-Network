import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, CheckCircle, ArrowRight, User as UserIcon, Sparkles, SlidersHorizontal, MapPin, DollarSign, ShieldCheck } from 'lucide-react';
import { MOCK_TALENT_POOL } from '../constants';
import { UserRole, User } from '../types';
import { supabase } from '../supabase';

export const Directory: React.FC<{ onSelectTalent: (id: string) => void; onRegisterProfessional: () => void }> = ({ onSelectTalent, onRegisterProfessional }) => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<UserRole | 'ALL'>('ALL');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [liveProfiles, setLiveProfiles] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
            premiumBadgeColor: p.premium_badge_color
          }));
          setLiveProfiles([...mappedLiveUsers, ...MOCK_TALENT_POOL]); // Combine live with mock pool for rich UI while data seeds
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
    return matchesSearch && matchesFilter && matchesVerified;
  });

  return (
    <div className="space-y-20 pb-32">
      <header className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center space-x-3 px-4 py-1.5 rounded-full bg-ffn-primary/10 text-ffn-primary text-[10px] font-bold uppercase tracking-[0.5em]"
            >
              <Sparkles className="w-3 h-3" />
              <span>Identity Discovery Protocol</span>
            </motion.div>
            <h2 className="text-7xl font-serif italic text-ffn-black tracking-tighter">Talent Hub</h2>
          </div>
          <div className="flex flex-col items-end space-y-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRegisterProfessional}
              className="bg-ffn-black text-white px-10 py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest shadow-xl flex items-center space-x-3 group"
            >
              <Sparkles className="w-4 h-4 text-ffn-accent" />
              <span>Join as Professional</span>
            </motion.button>
            <div className="flex items-center space-x-3 text-xs text-gray-400 font-bold uppercase tracking-widest">
              <span className="text-2xl font-serif italic text-ffn-primary mr-2">{filteredTalent.length}</span> Professionals Indexed
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
              <input
                type="text"
                placeholder="Search by name, mastery, or location..."
                className="w-full bg-white border border-gray-100 rounded-[2rem] py-7 pl-16 pr-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200/20 focus:shadow-2xl transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`px-10 py-5 rounded-[2rem] text-[10px] font-bold uppercase tracking-widest border transition-all flex items-center space-x-3 ${showAdvancedFilters ? 'bg-ffn-black text-white border-ffn-black' : 'bg-white border-gray-100 text-gray-400 hover:border-ffn-primary/30'}`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Advanced Intelligence</span>
            </button>
          </div>

          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gray-50/50 p-10 rounded-[3rem] border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-10 overflow-hidden"
              >
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Mastery Category</label>
                  <div className="flex flex-wrap gap-2">
                    {(['ALL', ...Object.values(UserRole)] as const).map(role => (
                      <button
                        key={role}
                        onClick={() => setActiveFilter(role)}
                        className={`px-6 py-3 rounded-xl text-[8px] font-bold uppercase tracking-widest transition-all ${activeFilter === role ? 'bg-ffn-primary text-white' : 'bg-white border border-gray-200 text-gray-400 hover:border-ffn-primary'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Identity Verification</label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setOnlyVerified(!onlyVerified)}
                      className={`flex-1 py-4 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center space-x-2 ${onlyVerified ? 'bg-emerald-500 text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-400'}`}
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verified Only</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Operating Base</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                    <input type="text" className="w-full bg-white border border-gray-200 rounded-xl py-4 pl-10 pr-4 text-[9px] uppercase font-bold tracking-widest" placeholder="Global Radius Search" />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <motion.div layout className="editorial-grid">
        <AnimatePresence>
          {filteredTalent.map((talent, idx) => (
            <motion.div
              key={talent.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ y: -10 }}
              onClick={() => onSelectTalent(talent.id)}
              className="group cursor-pointer bg-white rounded-[4rem] border border-gray-50 hover:border-ffn-primary/10 transition-all overflow-hidden shadow-xl hover:shadow-[0_40px_80px_rgba(99,102,241,0.08)]"
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img src={talent.avatarUrl} className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110" alt={talent.displayName} />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <div className="absolute bottom-10 left-10 right-10">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-white">
                      <h4 className="text-3xl font-serif italic leading-none">{talent.displayName}</h4>
                      {talent.isVerified && !talent.isPremium && <CheckCircle className="w-5 h-5 text-blue-400 fill-blue-400 shadow-xl" />}
                      {talent.isPremium && <CheckCircle className="w-5 h-5 text-rose-500 fill-rose-500 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]" />}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] uppercase tracking-[0.4em] text-white/70 font-bold">{talent.location}</p>
                      <div className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20">
                        <span className="text-[8px] uppercase tracking-widest font-black text-white">{talent.role}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-10 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-ffn-primary">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-[9px] uppercase tracking-widest font-black">Hire Hub Ready</span>
                </div>
                <button className="p-3 bg-gray-50 rounded-2xl group-hover:bg-ffn-black group-hover:text-white transition-all shadow-sm">
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTalent.length === 0 && (
          <div className="col-span-full py-48 text-center space-y-8">
            <div className="w-32 h-32 bg-gray-50 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-inner relative overflow-hidden">
              <UserIcon className="w-12 h-12 text-gray-200 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-tr from-ffn-primary/5 to-ffn-accent/5 animate-pulse"></div>
            </div>
            <h3 className="text-4xl font-serif italic text-gray-300 tracking-tight">Zero Mastery Matches</h3>
            <p className="text-[10px] uppercase tracking-[0.5em] text-gray-400 max-w-sm mx-auto leading-loose">The creative graph is vast. Try adjusting your filters to discover new brilliance.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
