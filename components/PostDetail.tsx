
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Heart, MessageCircle, Share2, Bookmark, Send, Smile, MoreHorizontal, CheckCircle, MapPin, Loader2 } from 'lucide-react';
import { Post } from '../types';
import { postService } from '../services/postService';

interface PostDetailProps {
  post: Post;
  onBack: () => void;
}

export const PostDetail: React.FC<PostDetailProps> = ({ post, onBack }) => {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const res = await postService.getComments(post.id);
      if (res.success && res.data) {
        setComments(res.data);
      }
      setIsLoading(false);
    };
    fetchComments();
  }, [post.id]);

  const handleLike = async () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);

    const res = await postService.toggleLike(post.id);
    if (!res.success) {
      setIsLiked(!newLikedState);
      setLikesCount(prev => newLikedState ? prev - 1 : prev + 1);
    }
  };

  const handleSave = async () => {
    const newSavedState = !isSaved;
    setIsSaved(newSavedState);

    const res = await postService.toggleSave(post.id);
    if (!res.success) {
      setIsSaved(!newSavedState);
    }
  };

  const submitComment = async () => {
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    const res = await postService.addComment(post.id, commentText);
    if (res.success) {
      setCommentText('');
      // Refresh comments
      const refresh = await postService.getComments(post.id);
      if (refresh.success && refresh.data) setComments(refresh.data);
    }
    setIsSubmitting(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto pb-32"
    >
      <button
        onClick={onBack}
        className="mb-12 flex items-center space-x-3 text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 hover:text-ffn-primary transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-2 transition-transform" />
        <span>Back to Discovery Feed</span>
      </button>

      <div className="flex flex-col lg:flex-row bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 min-h-[800px]">
        {/* Media Column */}
        <div className="lg:w-3/5 bg-gray-50 relative group">
          <img
            src={post.mediaUrls[0]}
            fetchpriority="high"
            decoding="async"
            className="w-full h-full object-cover"
            alt="Editorial Work"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          <div className="absolute bottom-12 left-12 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
            <div className="glass-card-vibrant px-8 py-4 rounded-3xl border border-white/20">
              <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-white mb-1">Visual Protocol</p>
              <p className="text-white text-xs font-light italic">
                {post.shootType ? `${post.shootType.toUpperCase()} hub` : 'Fashion Master'} &bull; {post.author.location}
              </p>
            </div>
          </div>
        </div>

        {/* Content Column */}
        <div className="lg:w-2/5 flex flex-col h-[800px]">
          {/* Header */}
          <div className="p-8 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-md">
                <img src={post.author.avatarUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-bold uppercase tracking-widest text-ffn-black">{post.author.username}</span>
                  {post.author.isVerified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                </div>
                <div className="flex items-center text-[9px] uppercase tracking-widest text-gray-400 font-bold mt-1">
                  <MapPin className="w-2.5 h-2.5 mr-1" /> {post.author.location}
                </div>
              </div>
            </div>
            <button className="p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Caption & Comments */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-10 bg-gray-50/20">
            {/* Caption */}
            <div className="flex space-x-4">
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-none shadow-sm">
                <img src={post.author.avatarUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="space-y-3">
                <p className="text-sm leading-relaxed text-gray-600">
                  <span className="font-bold text-ffn-black mr-2 uppercase text-xs tracking-widest">{post.author.username}</span>
                  {post.caption}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.shootType && (
                    <span className="bg-ffn-primary/5 text-ffn-primary text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-ffn-primary/10">
                      📸 {post.shootType}
                    </span>
                  )}
                  {post.brandTag && (
                    <span className="bg-ffn-black/5 text-ffn-black text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-black/5">
                      🏷️ {post.brandTag}
                    </span>
                  )}
                  {post.photographerTag && (
                    <span className="bg-gray-50 text-gray-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-gray-100">
                      👁️ {post.photographerTag}
                    </span>
                  )}
                  {post.tags.map(tag => (
                    <span key={tag} className="text-[9px] font-bold uppercase tracking-widest text-ffn-primary/60 cursor-pointer hover:text-ffn-primary transition-colors">#{tag}</span>
                  ))}
                </div>
                <p className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">{post.createdAt} &bull; Editorial Hub</p>
              </div>
            </div>

            {/* Comment Section */}
            <div className="space-y-8">
              <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 font-black">Engagement Feed</p>
              {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
              ) : comments.map(c => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={c.id}
                  className="flex space-x-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-200 overflow-hidden shadow-sm flex-none">
                    <img src={c.author?.avatar_url || `https://i.pravatar.cc/100?u=${c.id}`} alt="" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm leading-relaxed text-gray-600">
                      <span className="font-bold text-ffn-black mr-2 uppercase text-xs tracking-widest">{c.author?.full_name?.split(' ')[0] || 'User'}</span>
                      {c.text}
                    </p>
                    <div className="flex items-center space-x-6">
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">Recent</span>
                      <button className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-ffn-black transition-colors">Reply</button>
                      <button className="text-[9px] font-bold text-gray-400 uppercase tracking-widest hover:text-ffn-black transition-colors"><Heart className="w-3 h-3" /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {comments.length === 0 && !isLoading && (
                <p className="text-xs text-gray-400 italic font-serif">Be the first to share your aesthetic perspective.</p>
              )}
            </div>
          </div>

          {/* Interactions */}
          <div className="p-8 border-t border-gray-50 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <button
                  onClick={handleLike}
                  className={`transition-all ${isLiked ? 'text-red-500 scale-110' : 'text-ffn-black hover:text-red-500'}`}
                >
                  <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button className="text-ffn-black hover:text-ffn-primary transition-all"><MessageCircle className="w-7 h-7" /></button>
                <button className="text-ffn-black hover:text-ffn-primary transition-all"><Share2 className="w-7 h-7" /></button>
              </div>
              <button
                onClick={handleSave}
                className={`transition-all ${isSaved ? 'text-ffn-primary scale-110' : 'text-ffn-black hover:text-ffn-primary'}`}
              >
                <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-widest text-ffn-black">{likesCount.toLocaleString()} Mastery Endorsements</p>
              <p className="text-[9px] uppercase tracking-widest text-gray-300 font-bold">{post.createdAt} Ago</p>
            </div>
          </div>

          {/* Add Comment Input */}
          <div className="p-8 border-t border-gray-50 bg-white">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-300 hover:text-ffn-black transition-colors"><Smile className="w-5 h-5" /></button>
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitComment()}
                placeholder="Share your insight..."
                className="flex-1 bg-transparent border-none text-sm focus:ring-0 placeholder-gray-300 py-3"
              />
              <button
                disabled={!commentText.trim() || isSubmitting}
                onClick={submitComment}
                className="text-[10px] font-black uppercase tracking-widest text-ffn-primary disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 hover:bg-ffn-primary/5 rounded-xl transition-all"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Content (Optional detail enhancement) */}
      <div className="mt-24 space-y-12">
        <h3 className="text-3xl font-serif italic text-ffn-black border-b border-gray-50 pb-8">Visual Synergy</h3>
        <div className="editorial-grid">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              whileHover={{ y: -5 }}
              className="aspect-[4/5] bg-gray-50 rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl group cursor-pointer"
            >
              <img src={`https://picsum.photos/id/${150 + i}/600/800`} loading="lazy" decoding="async" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
