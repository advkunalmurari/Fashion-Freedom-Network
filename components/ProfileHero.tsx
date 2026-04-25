import React from 'react';
import { motion as m, useScroll, useTransform } from 'framer-motion';
import { 
  MapPin, 
  Globe, 
  Sparkles, 
  Zap, 
  CheckCircle, 
  Camera, 
  Tag, 
  Briefcase 
} from 'lucide-react';

interface ProfileHeroProps {
  user: any;
  isOwnProfile?: boolean;
}

export const ProfileHero: React.FC<ProfileHeroProps> = ({ user, isOwnProfile }) => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="relative w-full overflow-hidden bg-[#050505]">
      {/* Global Studio Lighting */}
      <div className="studio-lighting opacity-30" />

      {/* Parallax Background Stage */}
      <div className="relative h-[65vh] md:h-[80vh] w-full overflow-hidden">
        <m.div 
          style={{ y: y1, opacity }}
          className="absolute inset-0 select-none"
        >
          <img 
            src={user.coverImage || 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80'} 
            className="w-full h-full object-cover filter brightness-[0.5] contrast-[1.2] scale-105"
            alt="Cover Narrative"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-[#050505]" />
        </m.div>

        {/* Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <m.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-ffn-primary/10 blur-[120px] rounded-full" 
          />
        </div>
      </div>

      {/* Masthead Container */}
      <div className="relative z-20 max-w-screen-2xl mx-auto px-6 md:px-12 -mt-[30vh] md:-mt-[40vh] pb-24">
        <div className="flex flex-col md:flex-row items-end md:items-center space-y-12 md:space-y-0 md:space-x-20">
          
          {/* Primary Identity Node */}
          <m.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="relative group shrink-0"
          >
            {/* Iridescent Border Ring */}
            <div className="absolute inset-0 -m-4 premium-iridescent rounded-full opacity-40 blur-xl group-hover:opacity-100 transition-opacity duration-700" />
            
            <div className="relative w-48 h-48 md:w-72 md:h-72 rounded-full border border-white/10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.9)]">
              <img 
                src={user.profileImage || user.avatarUrl} 
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt={user.displayName}
              />
              {/* Glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Status Pulse */}
            <m.div 
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute bottom-8 right-8 w-10 h-10 bg-ffn-primary rounded-full border-4 border-[#050505] flex items-center justify-center shadow-[0_0_30px_#ff3366]"
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </m.div>
          </m.div>

          {/* Masthead Text Core - The "Editorial" Name */}
          <div className="flex-1 space-y-10">
            <div className="space-y-4">
              <m.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-wrap items-center gap-4 mb-6"
              >
                <div className="px-6 py-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-full flex items-center space-x-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Node Pulse: Active</span>
                </div>
                {user.isVerified && (
                  <div className="holographic-badge px-6 py-2 rounded-full flex items-center space-x-2">
                    <CheckCircle className="w-3 h-3 text-white" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Identity Confirmed</span>
                  </div>
                )}
              </m.div>

              <m.h1 
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="text-[14vw] md:text-[9vw] editorial-masthead text-white drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] italic leading-[0.65] relative z-10"
              >
                {user.displayName || user.name}
              </m.h1>
            </div>

            <m.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-10 md:gap-16 text-white/40"
            >
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-ffn-primary group-hover:text-white transition-all">
                  <MapPin className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">{user.location || 'Global Node'}</span>
              </div>
              <div className="flex items-center space-x-4 group cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-ffn-accent group-hover:text-white transition-all">
                  <Globe className="w-4 h-4" />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.3em] group-hover:text-white transition-colors">{user.role || 'FFN Creator'}</span>
              </div>
            </m.div>
          </div>
        </div>

        {/* Mastery Scroll Section - High Velocity Marquee */}
        <div className="mt-24 md:mt-32 relative group">
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent z-10" />
          
          <div className="w-full h-px bg-white/5 mb-14" />
          
          <div className="mastery-scroll-container overflow-hidden py-6">
            <m.div 
              animate={{ x: [0, -1500] }}
              transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
              className="flex whitespace-nowrap space-x-32 items-center"
            >
              {[...Array(8)].map((_, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center space-x-8">
                    <span className="text-5xl md:text-6xl editorial-masthead text-white/5 group-hover:text-ffn-primary transition-all duration-700 cursor-default hover:scale-110">VOGUE FEATURED</span>
                    <Sparkles className="w-6 h-6 text-ffn-primary/20" />
                  </div>
                  <div className="flex items-center space-x-8">
                    <span className="text-5xl md:text-6xl editorial-masthead text-white/5 group-hover:text-ffn-accent transition-all duration-700 cursor-default hover:scale-110">GUCCI CAMPAIGN '26</span>
                    <Zap className="w-6 h-6 text-ffn-accent/20" />
                  </div>
                  <div className="flex items-center space-x-8">
                    <span className="text-5xl md:text-6xl editorial-masthead text-white/5 group-hover:text-white/40 transition-all duration-700 cursor-default hover:scale-110">PRADA FW COLLECTION</span>
                    <Tag className="w-6 h-6 text-white/10" />
                  </div>
                </React.Fragment>
              ))}
            </m.div>
          </div>

          <div className="w-full h-px bg-white/5 mt-14" />
        </div>

        {/* Impact Nodes (Stats Grid) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24">
          {[
            { label: 'Total Impact', val: user.followersCount || 12400, color: 'ffn-primary' },
            { label: 'Connected Nodes', val: user.followingCount || 842, color: 'ffn-accent' },
            { label: 'Editorial Assets', val: user.postsCount || 156, color: 'white' },
            { label: 'Mastery Rank', val: 'TOP 1%', color: 'cyan-400' }
          ].map((stat, idx) => (
            <m.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="premium-card-depth bg-white/5 backdrop-blur-[50px] border border-white/5 rounded-[3rem] p-12 group"
            >
              <div className="space-y-6">
                <span className="block text-[10px] font-black uppercase tracking-[0.5em] text-white/20 group-hover:text-white/40 transition-colors uppercase">{stat.label}</span>
                <div className={`text-5xl editorial-masthead text-white group-hover:text-${stat.color} transition-all duration-500`}>
                  {typeof stat.val === 'number' ? (stat.val > 1000 ? (stat.val / 1000).toFixed(1) + 'K' : stat.val) : stat.val}
                </div>
              </div>
              <div className={`mt-8 w-12 h-1 bg-${stat.color} opacity-20 group-hover:opacity-100 transition-all rounded-full`} />
            </m.div>
          ))}
        </div>

        {/* Interaction Deck */}
        <div className="mt-20 flex flex-col md:flex-row gap-8">
          <m.button 
            whileHover={{ scale: 1.03, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="flex-[2] bg-white text-black py-8 rounded-[3rem] text-[12px] font-black uppercase tracking-[0.7em] shadow-[0_30px_60px_rgba(255,255,255,0.1)] relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-ffn-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-1000" />
            <span className="relative z-10 group-hover:text-white transition-colors">Initiate Inquiry Protocol</span>
          </m.button>

          <m.button 
            whileHover={{ scale: 1.03, y: -5, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 text-white py-8 rounded-[3rem] text-[12px] font-black uppercase tracking-[0.7em] hover:border-white/30 transition-all shadow-2xl"
          >
            Book Session
          </m.button>

          <m.button 
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,51,102,0.15)', rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="p-8 bg-white/5 border border-white/10 rounded-[3rem] text-ffn-primary flex items-center justify-center shadow-xl group"
          >
            <Zap className="w-7 h-7 fill-current group-hover:animate-pulse" />
          </m.button>
        </div>
      </div>
    </div>
  );
};
