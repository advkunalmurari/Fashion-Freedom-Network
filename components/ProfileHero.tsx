import React, { useRef, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { analyticsService } from '../services/analyticsService';
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

  useEffect(() => {
    // Track profile view when the component mounts
    if (user && user.id) {
      analyticsService.trackView(user.id);
    }
  }, [user.id]);

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
      {/* Cover Image Section - Premium FFN Touch */}
      <div className="relative h-48 md:h-64 w-full rounded-[2.5rem] overflow-hidden group bg-gray-50 border border-gray-100 shadow-inner">
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
            src={coverPreview || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
            alt="Profile Cover"
            className={`w-full h-full object-cover transition-all duration-1000 ${isUploadingCover ? 'blur-xl scale-110 opacity-50' : 'group-hover:scale-105'}`}
          />
        )}
        <div className="absolute inset-0 bg-black/20 backdrop-brightness-75 group-hover:bg-black/30 transition-colors" />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          {isUploadingCover ? (
            <div className="bg-white/90 backdrop-blur-3xl p-6 rounded-2xl flex items-center space-x-4 text-ffn-black border border-white shadow-2xl">
              <RefreshCcw className="w-5 h-5 animate-spin text-ffn-primary" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Updating Canvas...</span>
            </div>
          ) : (
            <button
              onClick={() => coverInputRef.current?.click()}
              className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] flex items-center space-x-3 transition-all hover:bg-white hover:text-ffn-black shadow-2xl"
            >
              <Camera className="w-4 h-4" />
              <span>Change Cover</span>
            </button>
          )}
        </div>

        <input
          title="Upload Cover Image"
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'cover')}
        />
      </div>

      {/* Profile Info Section - Instagram Inspired Layout */}
      <div className="px-4 md:px-8 space-y-8">
        {/* Header: Avatar + Stats */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
          {/* Avatar Area */}
          <div className="relative flex-shrink-0 mx-auto md:mx-0">
            <div className="p-1.5 rounded-full bg-gradient-to-tr from-ffn-primary via-ffn-accent to-rose-500">
              <div className="p-1 bg-white rounded-full">
                <div className={`w-28 h-28 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-50 bg-gray-100 shadow-xl ${isUploadingAvatar ? 'opacity-50' : ''}`}>
                  <img
                    src={avatarPreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.username)}&background=random`}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <button
              title="Update Avatar"
              disabled={isUploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="absolute bottom-1 right-1 p-3 bg-white text-ffn-black rounded-full shadow-xl border border-gray-100 hover:bg-ffn-primary hover:text-white transition-all disabled:opacity-50 hover:scale-110 z-30 group"
            >
              <Plus className="w-4 h-4" />
            </button>

            <input
              title="Upload Avatar Image"
              type="file"
              ref={avatarInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, 'avatar')}
            />
          </div>

          {/* Stats Area */}
          <div className="flex-1 flex items-center justify-around md:justify-start md:space-x-16 text-center md:text-left py-4">
            <div className="space-y-1 group cursor-pointer transition-transform hover:scale-105">
              <p className="text-xl md:text-2xl font-bold text-ffn-black">{(user.stats?.postCount || 128).toLocaleString()}</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest">Posts</p>
            </div>
            <div className="space-y-1 group cursor-pointer transition-transform hover:scale-105">
              <p className="text-xl md:text-2xl font-bold text-ffn-black">{(user.followersCount || 0).toLocaleString()}</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest">Followers</p>
            </div>
            <div className="space-y-1 group cursor-pointer transition-transform hover:scale-105">
              <p className="text-xl md:text-2xl font-bold text-ffn-black">{(user.followingCount || 0).toLocaleString()}</p>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium uppercase tracking-widest">Following</p>
            </div>
          </div>
        </div>

        {/* Identity Specifics: Name + Bio */}
        <div className="space-y-4 text-center md:text-left">
          <div className="space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <h2 className="text-2xl font-bold text-ffn-black">{user.displayName || user.username}</h2>
              {user.isVerified && <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-500" />}
              {user.isPremium && <Sparkles className="w-5 h-5 text-rose-500 fill-rose-500" />}
            </div>
            <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">{user.role}</p>
          </div>

          {/* Bio Section with Inline Editing */}
          <div className="relative group max-w-xl mx-auto md:mx-0">
            <AnimatePresence mode="wait">
              {isEditingBio ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4"
                >
                  <textarea
                    autoFocus
                    value={editedBio}
                    onChange={(e) => setEditedBio(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-ffn-primary transition-all text-gray-600 h-24 resize-none shadow-lg"
                    placeholder="Update your profile bio..."
                  />
                  <div className="flex space-x-3 justify-center md:justify-start">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-6 py-2 bg-ffn-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all"
                    >
                      Save Bio
                    </button>
                    <button
                      onClick={() => { setIsEditingBio(false); setEditedBio(user.bio); }}
                      className="px-6 py-2 bg-gray-100 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div
                  className="group cursor-pointer space-y-2"
                  onClick={() => setIsEditingBio(true)}
                >
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed max-w-md mx-auto md:mx-0">
                    {editedBio || user.bio || 'Add a bio to your profile...'}
                  </p>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                    {user.websiteUrl && (
                      <a
                        href={user.websiteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-900 font-semibold text-sm flex items-center space-x-1"
                      >
                        <Globe className="w-3 h-3" />
                        <span>{user.websiteUrl.replace(/^https?:\/\//, '')}</span>
                      </a>
                    )}
                    {user.instagramUrl && (
                      <a
                        href={user.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 font-semibold text-sm flex items-center space-x-1"
                      >
                        <Instagram className="w-3 h-3" />
                        <span>Instagram</span>
                      </a>
                    )}
                    {user.twitterUrl && (
                      <a
                        href={user.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 font-semibold text-sm flex items-center space-x-1"
                      >
                        <Twitter className="w-3 h-3" />
                        <span>Twitter</span>
                      </a>
                    )}
                    {user.tiktokUrl && (
                      <a
                        href={user.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-black font-semibold text-sm flex items-center space-x-1"
                      >
                        <span className="w-3 h-3 bg-black text-white flex items-center justify-center rounded-full text-[6px]">T</span>
                        <span>TikTok</span>
                      </a>
                    )}
                    {user.linkedinUrl && (
                      <a
                        href={user.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 font-semibold text-sm flex items-center space-x-1"
                      >
                        <Linkedin className="w-3 h-3" />
                        <span>LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Professional Context Widgets */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center text-[9px] text-gray-500 font-bold uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <MapPin className="w-3 h-3 mr-2 text-ffn-primary" /> {user.location || 'Global'}
            </div>
            {user.hourlyRate && (
              <div className="flex items-center text-[9px] text-emerald-600 font-bold uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
                <DollarSign className="w-3 h-3 mr-1" /> From ${user.hourlyRate}/hr
              </div>
            )}
            <AvailabilityPulse
              status={user.availabilityStatus || 'available'}
              calendar={user.availabilityCalendar}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button className="flex-1 py-4 bg-ffn-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-lg active:scale-95">
            Edit Profile
          </button>
          <button className="flex-1 py-4 bg-gray-100 text-ffn-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all active:scale-95">
            Shared Settings
          </button>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="px-6 py-4 bg-ffn-primary/5 text-ffn-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary/10 transition-all border border-ffn-primary/10 flex items-center justify-center space-x-2"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Book Now</span>
          </button>
        </div>
      </div>
      <input
        title="Upload Avatar Image"
        type="file"
        ref={avatarInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleImageUpload(e, 'avatar')}
      />

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