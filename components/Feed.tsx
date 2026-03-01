
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusSquare, Loader2, Sparkles } from 'lucide-react';
import { Post, User } from '../types';
import { MOCK_POSTS, MOCK_TALENT_POOL } from '../constants';
import { FeedCard } from './FeedCard';
import { StoryViewer } from './StoryViewer';
import { postService } from '../services/postService';
import { CreatePost } from './CreatePost';

interface FeedProps {
  onSelectPost?: (id: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onSelectPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeStoryUser, setActiveStoryUser] = useState<User | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchFeed = async () => {
    setIsRefreshing(true);
    const res = await postService.getFeed();
    if (res.success && res.data) {
      setPosts(res.data);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const handlePostCreated = () => {
    fetchFeed(); // Refresh the feed when a new post is published
  };

  return (
    <div className="max-w-xl mx-auto space-y-20 animate-in fade-in duration-700">
      {/* Stories Tray */}
      <div className="flex space-x-10 overflow-x-auto pb-10 no-scrollbar border-b border-gray-100 px-2">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex flex-col items-center space-y-4 flex-none cursor-pointer group"
        >
          <div className="w-24 h-24 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center group-hover:border-ffn-primary transition-all bg-white shadow-sm">
            <PlusSquare className="w-8 h-8 text-gray-300 group-hover:text-ffn-primary" />
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold group-hover:text-ffn-black">Your Story</span>
        </motion.div>
        {MOCK_TALENT_POOL.map((talent, idx) => (
          <motion.div
            key={talent.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveStoryUser(talent)}
            className="flex flex-col items-center space-y-4 flex-none cursor-pointer group"
          >
            <div className={`w-24 h-24 rounded-[2.5rem] p-[4px] transition-all duration-500 shadow-xl ${talent.isBoosted ? 'bg-gradient-to-tr from-ffn-primary via-ffn-accent to-ffn-secondary animate-gradient-xy' : 'bg-gray-200'}`}>
              <div className="w-full h-full rounded-[2.2rem] overflow-hidden border-4 border-white">
                <img src={talent.avatarUrl} className="w-full h-full object-cover transition-all group-hover:scale-110" alt="" />
              </div>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold group-hover:text-ffn-black truncate max-w-[80px]">{talent.username}</span>
          </motion.div>
        ))}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStoryUser && (
          <StoryViewer
            user={activeStoryUser}
            onClose={() => setActiveStoryUser(null)}
          />
        )}
      </AnimatePresence>

      {/* Scrolling Feed */}
      <div className="space-y-8">
        <CreatePost onPostCreated={handlePostCreated} />

        <AnimatePresence>
          {!isRefreshing && posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-24 text-center flex flex-col items-center justify-center space-y-4 rounded-[2.5rem] border border-dashed border-gray-200"
            >
              <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                <Sparkles className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-serif text-2xl text-ffn-black">Your Feed is Empty</h3>
              <p className="text-gray-400 text-sm max-w-sm">
                No posts yet — start building your professional portfolio or follow other fashion industry talents to discover their latest work.
              </p>
            </motion.div>
          ) : (
            posts.map((post, idx) => (
              <FeedCard key={post.id} post={post} index={idx} onSelectPost={onSelectPost} />
            ))
          )}
        </AnimatePresence>

        {/* Infinite Scroll Trigger & Loading State */}
        <div ref={observerTarget} className="py-20 flex flex-col items-center justify-center space-y-6">
          {isRefreshing || isLoadingMore ? (
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-ffn-primary rounded-full"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-steel animate-pulse">Syncing Network Nodes...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3 opacity-20">
              <Sparkles className="w-5 h-5 text-ffn-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">Identity Feed End Sequence</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
