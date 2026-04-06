
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Zap, Globe, Sparkles, CheckCircle,
  Instagram, Tag, Star, Award, Heart, MessageCircle, Play, Camera, ExternalLink, Users
} from 'lucide-react';
import { PRICING, MOCK_TALENT_POOL, MOCK_POSTS, BRAND_SOCIALS, MOCK_SHOOTS } from '../constants';
import { VerificationLevel } from '../types';

import { StoriesRail, Story } from './StoriesRail';
import { StoryViewer } from './StoryViewer';
import { PublicStats } from './PublicStats';
import { MagneticButton } from './MagneticButton';

const HubGraphic: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'Mumbai':
      return (
        <motion.svg viewBox="0 0 40 40" className="w-8 h-8 opacity-40 group-hover:opacity-100 group-hover:text-ffn-primary transition-all duration-700">
          <motion.circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} />
          <motion.circle cx="20" cy="20" r="8" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="0.5" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3, repeat: Infinity }} />
          <circle cx="20" cy="20" r="2" fill="currentColor" />
        </motion.svg>
      );
    default: return null;
  }
};

export const Home: React.FC<{ onApply: () => void; onDirectory: () => void; onRegisterProfessional: () => void }> = ({ onApply, onDirectory, onRegisterProfessional }) => {
  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } } };
  const featuredTalent = MOCK_TALENT_POOL.filter(t => t.isFeatured);

  const [activeStoryViewer, setActiveStoryViewer] = React.useState<{ index: number, stories: Story[] } | null>(null);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-32 md:space-y-48 pb-32 md:pb-64 bg-ffn-black min-h-screen text-white selection:bg-ffn-primary/30">
      {/* Mobile-Only Stories Rail */}
      <div className="lg:hidden block pt-4">
        <StoriesRail onStoryClick={(story, index, allStories) => setActiveStoryViewer({ index, stories: allStories })} />
      </div>

      <AnimatePresence>
        {activeStoryViewer && (
          <StoryViewer
            initialIndex={activeStoryViewer.index}
            stories={activeStoryViewer.stories}
            onClose={() => setActiveStoryViewer(null)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden -mt-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120%] h-[120%] -z-10 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ffn-primary blur-[120px] rounded-full animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-ffn-accent blur-[160px] rounded-full animate-pulse-slow"></div>
        </div>
        <div className="max-w-7xl space-y-12">
          <motion.div variants={itemVariants} className="inline-flex items-center space-x-3 px-6 py-2.5 rounded-full bg-white/50 backdrop-blur-xl border border-ffn-primary/10 shadow-2xl mb-8">
            <Sparkles className="w-4 h-4 text-ffn-accent animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-ffn-primary">The Identity Protocol for Fashion</span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-[10rem] lg:text-[11rem] font-serif italic leading-[0.9] tracking-tighter text-white relative"
          >
            <motion.span
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block"
            >
              India’s Emerging
            </motion.span> <br />
            <span className="text-gradient-vibrant not-italic font-bold">Fashion Talent</span> <br />
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="inline-block"
            >
              Discovery Platform.
            </motion.span>
          </motion.h1>
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-12">
            <MagneticButton strength={0.3}>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 30px 60px rgba(99, 102, 241, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onRegisterProfessional}
                className="w-80 bg-white text-ffn-black py-8 rounded-[2.5rem] text-xs font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-4 group shadow-[0_20px_40px_rgba(255,255,255,0.1)] transition-all hover:bg-ffn-primary hover:text-white"
              >
                <span>Register Identity</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </MagneticButton>

            <MagneticButton strength={0.3}>
              <motion.button
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
                onClick={onDirectory}
                className="w-80 bg-white/5 backdrop-blur-md border border-white/10 text-white py-8 rounded-[2.5rem] text-xs font-bold uppercase tracking-[0.4em] shadow-sm hover:shadow-xl transition-all"
              >
                Hire Mastery
              </motion.button>
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      {/* Platform Liquidity Metrics */}
      <section className="px-4">
        <PublicStats />
      </section>

      {/* NEW Section: Featured Talent Homepage Placement (SECTION 2) */}
      <section className="space-y-16 px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-100 pb-12">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-ffn-accent">
              <Zap className="w-5 h-5 fill-ffn-accent" />
              <span className="text-[10px] font-bold uppercase tracking-[0.6em]">Premium Featured Talent</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-serif italic text-white leading-none">Global <br /> <span className="text-gradient-vibrant font-bold not-italic">Headliners.</span></h2>
          </div>
          <button onClick={onDirectory} className="flex items-center space-x-4 group">
            <span className="text-[10px] font-black uppercase tracking-widest text-white border-b border-white/20 pb-1 group-hover:border-ffn-primary transition-all">View Talent Graph</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {featuredTalent.map((talent, idx) => (
            <motion.div
              key={talent.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group cursor-pointer relative aspect-[4/5] rounded-[3.5rem] overflow-hidden shadow-2xl bg-white/5 border border-white/10"
              onClick={() => onDirectory()}
            >
              <img src={talent.avatarUrl} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" alt={talent.displayName} loading="lazy" width="600" height="750" />
              <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/20 to-transparent p-12 flex flex-col justify-end">
                <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform">
                  <div className="flex items-center space-x-3">
                    <span className="px-4 py-1.5 bg-ffn-accent text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg">FEATURED NODE</span>
                    {talent.verificationLevel >= VerificationLevel.PREMIUM && (
                      <div className="flex items-center space-x-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                        <Award className="w-3 h-3 text-ffn-secondary" />
                        <span className="text-[7px] text-white font-bold uppercase tracking-widest">TIER {talent.verificationLevel}</span>
                      </div>
                    )}
                  </div>
                  <h4 className="text-4xl text-white font-serif italic drop-shadow-xl">{talent.displayName}</h4>
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] uppercase tracking-widest text-white/60 font-black">{talent.role} &bull; {talent.location}</p>
                    <Users className="w-5 h-5 text-white/40" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Standard Sections... */}
      <section className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-16 md:p-32 text-center space-y-12 relative overflow-hidden mx-4 border border-white/10 shadow-3xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ffn-primary/20 blur-[120px] rounded-full animate-float"></div>
        <div className="relative z-10 space-y-8">
          <h2 className="text-4xl md:text-7xl font-serif italic text-white leading-tight tracking-tighter">Identity Meets <br /> Opportunity.</h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm md:text-xl font-light italic">Join the platform redefining talent acquisition and monetization in India.</p>
          <div className="pt-6">
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={onRegisterProfessional} className="bg-white text-ffn-black px-12 py-6 md:px-20 md:py-10 rounded-[2.5rem] text-[10px] md:text-xs font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all">Register as a Professional</motion.button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};
