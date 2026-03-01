import React, { useRef, useState } from 'react';
import { User, UserRole } from '../types';
import { 
  MapPin, DollarSign, Settings, Grid, Bookmark, Briefcase, Heart, 
  MessageCircle, Camera, Loader2, Check, CheckCircle, UploadCloud, 
  RefreshCcw, Sparkles 
} from 'lucide-react';
import { uploadService } from '../services/uploadService';
import { motion, AnimatePresence } from 'framer-motion';

export const ProfileHero: React.FC<{ user: User }> = ({ user }) => {
  const [avatarPreview, setAvatarPreview] = useState(user.avatarUrl);
  const [coverPreview, setCoverPreview] = useState(user.coverUrl);
  
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  
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
        <img 
          src={coverPreview} 
          alt="Profile Cover" 
          className={`w-full h-full object-cover transition-all duration-1000 ${isUploadingCover ? 'blur-xl scale-110 opacity-50' : 'group-hover:scale-105'}`}
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors" />
        
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
              {user.isVerified && <CheckCircle className="w-8 h-8 text-blue-500 fill-blue-500 drop-shadow-xl" />}
            </div>
            <div className="flex items-center justify-center space-x-4">
              <button className="bg-ffn-black text-white px-12 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-2xl active:scale-95">Follow</button>
              <button className="bg-white border border-gray-100 text-ffn-black px-12 py-5 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm active:scale-95">Message</button>
              <button className="p-5 bg-gray-50 rounded-[1.5rem] hover:bg-gray-100 transition-colors text-gray-400 hover:text-ffn-black"><Settings className="w-6 h-6" /></button>
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
            <div className="flex items-center justify-center md:justify-start space-x-6">
               <p className="font-serif italic text-3xl text-ffn-black">{user.displayName}</p>
               <span className="text-[10px] bg-ffn-primary text-white px-6 py-2 rounded-full shadow-lg shadow-ffn-primary/20 uppercase font-black tracking-widest">{user.role}</span>
            </div>
            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto md:mx-0 leading-relaxed font-light italic">
              "{user.bio}"
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-5">
            <div className="flex items-center text-[10px] text-gray-500 font-black uppercase tracking-widest bg-white px-6 py-3 rounded-full border border-gray-100 shadow-sm">
              <MapPin className="w-4 h-4 mr-3 text-ffn-primary" /> {user.location}
            </div>
            {user.hourlyRate && (
              <div className="flex items-center text-[10px] text-emerald-600 font-black uppercase tracking-widest bg-emerald-50 px-6 py-3 rounded-full border border-emerald-100 shadow-sm">
                <DollarSign className="w-4 h-4 mr-1.5" /> From ${user.hourlyRate}/hr
              </div>
            )}
            <div className="flex items-center text-[10px] text-ffn-primary font-black uppercase tracking-widest bg-ffn-primary/5 px-6 py-3 rounded-full border border-ffn-primary/10 shadow-sm">
              <Sparkles className="w-4 h-4 mr-3" /> Identity Score: {user.completionScore || 85}%
            </div>
          </div>
        </div>

        <input 
          type="file" 
          ref={avatarInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={(e) => handleImageUpload(e, 'avatar')}
        />
      </div>

      {/* Internal Identity Tabs */}
      <div className="border-t border-gray-100 flex justify-center space-x-16 pt-10 mt-16">
        <button className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black text-ffn-black border-t-2 border-ffn-black pt-10 -mt-[42px] transition-all">
          <Grid className="w-5 h-5" /> <span>Portfolio Hub</span>
        </button>
        <button className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black text-gray-300 hover:text-ffn-black pt-10 transition-colors">
          <Briefcase className="w-5 h-5" /> <span>Mastery History</span>
        </button>
        <button className="flex items-center space-x-4 text-[10px] uppercase tracking-[0.5em] font-black text-gray-300 hover:text-ffn-black pt-10 transition-colors">
          <Bookmark className="w-5 h-5" /> <span>Identity Archive</span>
        </button>
      </div>

      {/* Portfolio Display */}
      <div className="editorial-grid pt-16">
        {[1,2,3,4,5,6,7,8,9].map(i => (
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
      </div>
    </div>
  );
};