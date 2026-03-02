import React, { useRef, useState } from 'react';
import { User, UserRole } from '../types';
import {
  MapPin, DollarSign, Settings, Grid, Bookmark, Briefcase, Heart,
  MessageCircle, Camera, Loader2, Check, CheckCircle, UploadCloud,
  RefreshCcw, Sparkles, Plus, Zap, Twitter, Linkedin, Instagram, Globe, Edit3, Save, X as CloseIcon, Folder
} from 'lucide-react';
import { uploadService } from '../services/uploadService';
import { motion, AnimatePresence } from 'framer-motion';
import { ARMeasurementInlineBadge } from './ARMeasurementBadge';
import { MOCK_AR_MEASUREMENTS } from '../constants';
import { EndorsementCloud } from './EndorsementCloud';
import { LookbookGrid } from './LookbookGrid';
import { CollaboratorNetwork } from './CollaboratorNetwork';
import { ReputationVault } from './ReputationVault';
import { AvailabilityPulse } from './AvailabilityPulse';
import { BookingProtocolDrawer } from './BookingProtocolDrawer';
import { IdentityAnalytics } from './IdentityAnalytics';



export const ProfileHero: React.FC<{ user: User }> = ({ user }) => {
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const [coverPreview, setCoverPreview] = useState(user.coverUrl);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(user.bio);
  const [activeTab, setActiveTab] = useState<'portfolio' | 'lookbooks' | 'mastery' | 'archive'>('portfolio');
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (type === 'avatar') setIsUploadingAvatar(true);
    else setIsUploadingCover(true);

    try {
      const response = await uploadService.uploadImage(file, type);

      if (type === 'avatar') {
        setAvatarPreview(response.url);
      } else {
        setCoverPreview(response.url);
      }

      setUploadSuccess(type);
      setTimeout(() => setUploadSuccess(null), 3000);

    } catch (error) {
      console.error("Upload failed:", error);
      alert("Failed to upload identity media. Protocol interrupted.");
    } finally {
      if (type === 'avatar') setIsUploadingAvatar(false);
      else setIsUploadingCover(false);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      {/* Cover Image Section */}
      <div className="relative h-64 md:h-96 w-full rounded-[3.5rem] overflow-hidden group bg-gray-50 border border-gray-100 shadow-inner">
        {user.coverVideoUrl ? (
          <video
            src={user.coverVideoUrl}
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-full object-cover transition-all duration-1000 ${isUploadingCover ? 'blur-xl scale-110 opacity-50' : 'group-hover:scale-105'}`}
          />
        ) : (
          <img
            src={coverPreview}
            alt="Profile Cover"
            className={`w-full h-full object-cover transition-all duration-1000 ${isUploadingCover ? 'blur-xl scale-110 opacity-50' : 'group-hover:scale-105'}`}
          />
        )}
        <div className="absolute inset-0 bg-black/10 backdrop-brightness-75 group-hover:bg-black/20 transition-colors" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploadingCover ? (
            <div className="bg-white/90 backdrop-blur-3xl p-8 rounded-3xl flex items-center space-x-5 text-ffn-black border border-white shadow-2xl">
              <RefreshCcw className="w-6 h-6 animate-spin text-ffn-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Syncing Cover Protocol...</span>
            </div>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              className="bg-white text-ffn-black px-12 py-6 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] flex items-center space-x-4 transition-all hover:scale-105 shadow-2xl border border-gray-100"
            >
              <Camera className="w-5 h-5" />
              <span>Update Cover Art</span>
            </button>
          )}
        </div>

        {uploadSuccess === 'cover' && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.4em] flex items-center space-x-4 shadow-2xl z-30"
          >
            <Check className="w-5 h-5" />
            <span>Identity Cover Activated</span>
          </motion.div>
        )}

        <input
          title="Upload Cover Image"
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'cover')}
        />
      </div>

      {/* Visual Identity Section */}
      <div className="flex flex-col md:flex-row items-center md:items-end space-y-10 md:space-y-0 md:space-x-16 px-6 -mt-24 md:-mt-36 relative z-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-6 sm:space-y-0 sm:space-x-10">
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-[3.5rem] md:rounded-[4rem] p-2 bg-white shadow-[0_40px_80px_-12px_rgba(0,0,0,0.3)] transition-all ${isUploadingAvatar ? 'opacity-50' : ''}`}
            >
              <div className="w-full h-full rounded-[3rem] md:rounded-[3.5rem] overflow-hidden border-4 border-gray-50 bg-gray-100">
                <img
                  src={avatarPreview}
                  alt={user.username}
                  className="w-full h-full object-cover transition-all duration-700"
                />
              </div>
            </motion.div>

            <AnimatePresence>
              {isUploadingAvatar && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-md rounded-[3.5rem] md:rounded-[4rem] z-20"
                >
                  <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="w-10 h-10 text-ffn-primary animate-spin" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-ffn-black">Syncing...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {uploadSuccess === 'avatar' && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm rounded-[3.5rem] md:rounded-[4rem] z-20"
              >
                <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-2xl">
                  <Check className="w-6 h-6" />
                </div>
              </motion.div>
            )}

            <button
              title="Update Avatar"
              disabled={isUploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 p-4 bg-ffn-black text-white rounded-2xl shadow-2xl hover:bg-ffn-primary transition-all disabled:opacity-50 hover:scale-110 z-30 group"
            >
              <Camera className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </button>
          </div>

          {/* NEXT to profile picture button */}
          <div className="pb-4 md:pb-6">
            <motion.button
              whileHover={{ scale: 1.05, x: 5 }}
              whileTap={{ scale: 0.95 }}
              disabled={isUploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="px-8 py-5 md:px-10 md:py-6 bg-white border border-gray-100 rounded-[1.8rem] md:rounded-[2rem] text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-ffn-black shadow-2xl hover:shadow-ffn-primary/10 transition-all flex items-center space-x-4 md:space-x-5 disabled:opacity-50 group"
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-ffn-primary" />
              ) : (
                <UploadCloud className="w-4 h-4 md:w-5 md:h-5 text-gray-300 group-hover:text-ffn-primary transition-colors" />
              )}
              <span className="whitespace-nowrap">{isUploadingAvatar ? 'Syncing...' : 'Update Avatar'}</span>
            </motion.button>
          </div>
        </div>

        <div className="flex-1 space-y-8 text-center md:text-left pt-6 md:pb-6">
          <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-10">
            <div className="flex items-center space-x-5 justify-center md:justify-start">
              <h1 className="text-5xl md:text-6xl font-serif font-bold tracking-tighter text-ffn-black leading-none">{user.username}</h1>
              {user.isVerified && (
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-ffn-primary ml-4 fill-ffn-primary bg-white rounded-full p-0.5 border-4 border-white shadow-xl animate-pulse" />
              )}
              {user.isPremium && (
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 bg-rose-500 blur-md opacity-40 group-hover:opacity-70 transition-opacity rounded-full"></div>
                  <CheckCircle className="w-8 h-8 text-rose-500 fill-rose-500 relative z-10" />
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <button className="bg-ffn-black text-white px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-2xl active:scale-95">Follow</button>
              <button className="bg-white border border-gray-100 text-ffn-black px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-center">Message</button>
              <AvailabilityPulse
                status={user.availabilityStatus || 'available'}
                calendar={user.availabilityCalendar}
              />

              <div className="flex items-center space-x-6 pt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsBookingOpen(true)}
                  className="bg-ffn-black text-white px-10 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-2xl active:scale-95 flex items-center space-x-3 group"
                >
                  <Zap className="w-4 h-4 fill-white group-hover:text-white transition-colors" />
                  <span>Initiate Protocol</span>
                </motion.button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  title="Add to Mood Board"
                  className="p-5 bg-ffn-primary/5 rounded-[1.5rem] hover:bg-ffn-primary/20 transition-colors text-ffn-primary"
                >
                  <Plus className="w-6 h-6" />
                </button>
                <button aria-label="Settings" className="p-5 bg-gray-50 rounded-[1.5rem] hover:bg-gray-100 transition-colors text-gray-400 hover:text-ffn-black"><Settings className="w-6 h-6" /></button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start space-x-12 text-[11px] uppercase tracking-[0.4em] font-black text-gray-400">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <span className="text-ffn-black text-2xl group-hover:text-ffn-primary transition-colors">128</span>
              <span className="opacity-60">Posts</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <span className="text-ffn-black text-2xl group-hover:text-ffn-primary transition-colors">{user.followersCount.toLocaleString()}</span>
              <span className="opacity-60">Followers</span>
            </div>
            <div className="flex items-center space-x-3 group cursor-pointer">
              <span className="text-ffn-black text-2xl group-hover:text-ffn-primary transition-colors">{user.followingCount}</span>
              <span className="opacity-60">Following</span>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex flex-col md:flex-row md:items-center space-y-6 md:space-y-0 md:space-x-10">
              <div className="flex items-center space-x-6">
                <p className="font-serif italic text-3xl text-ffn-black">{user.displayName}</p>
                <span className="text-[10px] bg-ffn-primary text-white px-6 py-2 rounded-full shadow-lg shadow-ffn-primary/20 uppercase font-black tracking-widest">{user.role}</span>
              </div>

              {/* Social Protocol Bar */}
              <div className="flex items-center space-x-4 bg-gray-50/50 p-2 px-4 rounded-2xl border border-gray-100">
                {[
                  { icon: Instagram, url: user.instagramUrl, label: 'Instagram' },
                  { icon: Twitter, url: user.twitterUrl, label: 'Twitter' },
                  { icon: Linkedin, url: user.linkedinUrl, label: 'LinkedIn' },
                  { icon: Globe, url: user.websiteUrl, label: 'Website' }
                ].map((social, idx) => (
                  <motion.a
                    key={idx}
                    href={social.url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.1 }}
                    className={`p-2 rounded-xl transition-all ${social.url ? 'text-ffn-black hover:bg-white hover:shadow-md' : 'text-gray-300 pointer-events-none'}`}
                    title={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </motion.a>
                ))}
              </div>
            </div>

            <div className="relative group max-w-2xl mx-auto md:mx-0">
              <AnimatePresence mode="wait">
                {isEditingBio ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4 pt-2"
                  >
                    <textarea
                      autoFocus
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="w-full bg-white border border-ffn-primary/30 rounded-3xl p-6 text-base md:text-lg focus:ring-4 focus:ring-ffn-primary/10 transition-all font-light italic text-gray-600 h-32 resize-none shadow-2xl"
                      placeholder="Craft your professional narrative..."
                    />
                    <div className="flex space-x-4">
                      <button
                        onClick={() => { setIsEditingBio(false); /* Simulating save */ }}
                        className="flex items-center space-x-3 bg-ffn-black text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all"
                      >
                        <Save className="w-3 h-3" /> <span>Deploy Pitch</span>
                      </button>
                      <button
                        onClick={() => { setIsEditingBio(false); setEditedBio(user.bio); }}
                        className="flex items-center space-x-3 bg-gray-100 text-gray-500 px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                      >
                        <CloseIcon className="w-3 h-3" /> <span>Abort</span>
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group cursor-pointer pt-2"
                    onClick={() => setIsEditingBio(true)}
                  >
                    <p className="text-base md:text-lg text-gray-400 leading-relaxed font-light italic group-hover:text-ffn-black transition-colors">
                      "{editedBio || user.bio || 'Your professional pitch goes here...'}"
                    </p>
                    <div className="absolute -right-12 top-0 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hidden md:block">
                      <div className="bg-ffn-primary/10 p-3 rounded-xl text-ffn-primary">
                        <Edit3 className="w-4 h-4" />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Career Pulse Nodes */}
            {user.achievements && user.achievements.length > 0 && (
              <div className="flex items-center space-x-4 py-4 overflow-x-auto no-scrollbar mask-fade-right">
                {user.achievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5, backgroundColor: '#000', color: '#fff' }}
                    className="flex-shrink-0 px-6 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center space-x-3 cursor-default transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-ffn-primary animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{achievement.title}</span>
                    <span className="text-[8px] text-gray-400 font-bold">{achievement.date}</span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
            <div className="flex items-center text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm">
              <MapPin className="w-4 h-4 mr-3 text-ffn-primary" /> {user.location}
            </div>
            {user.hourlyRate && (
              <div className="flex items-center text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                <DollarSign className="w-4 h-4 mr-1.5" /> From ${user.hourlyRate}/hr
              </div>
            )}
            {user.experienceLevel && (
              <div className="flex items-center text-[10px] text-purple-600 font-black uppercase tracking-widest bg-purple-50 px-6 py-3 rounded-full border border-purple-100 shadow-sm">
                <Briefcase className="w-4 h-4 mr-2" /> {user.experienceLevel}
              </div>
            )}
            {user.agencyAffiliation && (
              <div className="flex items-center text-[10px] text-blue-600 font-black uppercase tracking-widest bg-blue-50 px-6 py-3 rounded-full border border-blue-100 shadow-sm">
                <Grid className="w-4 h-4 mr-2" /> {user.agencyAffiliation}
              </div>
            )}
            <div className="flex items-center text-[10px] text-ffn-primary font-black uppercase tracking-widest bg-ffn-primary/5 px-6 py-3 rounded-full border border-ffn-primary/10 shadow-sm">
              <Sparkles className="w-4 h-4 mr-3" /> Identity Score: {user.completionScore || 85}%
            </div>
          </div>

          <div className="bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-8 mt-8 max-w-2xl grid grid-cols-2 lg:grid-cols-4 gap-8 shadow-2xl shadow-ffn-black/5">
            <div className="relative group">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 group-hover:text-ffn-primary transition-colors">Rating</p>
              <p className="text-xl font-serif italic text-emerald-500 font-bold flex items-center justify-center md:justify-start space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>{user.avgRating ? user.avgRating.toFixed(1) : '5.0'}</span>
              </p>
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 group-hover:w-full transition-all duration-500 hidden md:block" />
            </div>
            <div className="relative group">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 group-hover:text-ffn-primary transition-colors">Credits</p>
              <p className="text-xl font-bold text-ffn-black">{user.workHistoryCount || 24}</p>
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ffn-black group-hover:w-full transition-all duration-500 hidden md:block" />
            </div>
            <div className="relative group">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 group-hover:text-ffn-primary transition-colors">Reliability</p>
              <p className="text-xl font-bold text-ffn-black">{user.reliabilityScore ? user.reliabilityScore + '%' : '100%'}</p>
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-ffn-black group-hover:w-full transition-all duration-500 hidden md:block" />
            </div>
            <div className="relative group">
              <p className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-400 mb-2 group-hover:text-ffn-primary transition-colors">Node Status</p>
              <div className="flex items-center justify-center md:justify-start space-x-2.5">
                <div className={`w-2 h-2 rounded-full ${user.availabilityStatus === 'busy' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse'}`}></div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${user.availabilityStatus === 'busy' ? 'text-rose-500' : 'text-emerald-500'}`}>
                  {user.availabilityStatus === 'busy' ? 'Busy' : 'Active'}
                </p>
              </div>
              <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-emerald-500 group-hover:w-full transition-all duration-500 hidden md:block" />
            </div>
          </div>

          {/* Endorsement Cloud Integration */}
          {user.endorsements && user.endorsements.length > 0 && (
            <div className="mt-8 -mx-6 md:mx-0">
              <EndorsementCloud endorsements={user.endorsements} />
            </div>
          )}
        </div>


        <input
          title="Upload Avatar Image"
          type="file"
          ref={avatarInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'avatar')}
        />
      </div>

      {/* Internal Identity Tabs */}
      <div className="border-t border-gray-100 flex justify-center space-x-8 md:space-x-16 pt-10 mt-16 px-4">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black transition-all ${activeTab === 'portfolio' ? 'text-ffn-black border-t-2 border-ffn-black pt-10 -mt-[42px]' : 'text-gray-300 hover:text-ffn-black pt-10'}`}
        >
          <Grid className="w-5 h-5" /> <span className="hidden sm:inline">Portfolio Hub</span>
        </button>
        <button
          onClick={() => setActiveTab('lookbooks')}
          className={`flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black transition-all ${activeTab === 'lookbooks' ? 'text-ffn-black border-t-2 border-ffn-black pt-10 -mt-[42px]' : 'text-gray-300 hover:text-ffn-black pt-10'}`}
        >
          <Folder className="w-5 h-5" /> <span className="hidden sm:inline">Curated Lookbooks</span>
        </button>
        <button
          onClick={() => setActiveTab('mastery')}
          className={`flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black transition-all ${activeTab === 'mastery' ? 'text-ffn-black border-t-2 border-ffn-black pt-10 -mt-[42px]' : 'text-gray-300 hover:text-ffn-black pt-10'}`}
        >
          <Briefcase className="w-5 h-5" /> <span className="hidden sm:inline">Mastery History</span>
        </button>
        <button
          onClick={() => setActiveTab('archive')}
          className={`flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black transition-all ${activeTab === 'archive' ? 'text-ffn-black border-t-2 border-ffn-black pt-10 -mt-[42px]' : 'text-gray-300 hover:text-ffn-black pt-10'}`}
        >
          <Bookmark className="w-5 h-5" /> <span className="hidden sm:inline">Identity Archive</span>
        </button>
      </div>

      {/* Dynamic Content Display */}
      <div className="pt-16">
        <AnimatePresence mode="wait">
          {activeTab === 'portfolio' && (
            <motion.div
              key="portfolio"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="editorial-grid"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -15, scale: 1.02 }}
                  className="aspect-[3/4] bg-white rounded-[3.5rem] overflow-hidden relative group cursor-pointer border border-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={`https://picsum.photos/id/${100 + i}/600/800`}
                    alt="Work Item"
                    className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-ffn-black/40 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center space-x-12 backdrop-blur-[2px]">
                    <div className="flex flex-col items-center text-white"><Heart className="w-8 h-8 mb-3 fill-white" /> <span className="text-[11px] font-black uppercase tracking-widest">245</span></div>
                    <div className="flex flex-col items-center text-white"><MessageCircle className="w-8 h-8 mb-3 fill-white" /> <span className="text-[11px] font-black uppercase tracking-widest">18</span></div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'lookbooks' && (
            <motion.div
              key="lookbooks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <LookbookGrid lookbooks={user.lookbooks || []} />
            </motion.div>
          )}

          {activeTab === 'mastery' && (
            <motion.div
              key="mastery"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-16 max-w-7xl mx-auto px-6"
            >
              <CollaboratorNetwork collaborators={user.collaborators || []} />
              <div className="pt-8 border-t border-gray-100">
                <ReputationVault reviews={user.reviews || []} />
              </div>
            </motion.div>
          )}

          {activeTab === 'archive' && (
            <motion.div
              key="archive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <IdentityAnalytics analytics={user.analytics} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <BookingProtocolDrawer
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        user={user}
      />
    </div>
  );
};