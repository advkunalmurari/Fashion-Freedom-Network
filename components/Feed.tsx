
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusSquare, Loader2, Sparkles } from 'lucide-react';
import { Post, User } from '../types';
import { MOCK_POSTS, MOCK_TALENT_POOL } from '../constants';
import { FeedCard } from './FeedCard';
import { StoryViewer } from './StoryViewer';
import { postService } from '../services/postService';
import { CreatePost } from './CreatePost';
import { EditorialFeedFeature } from './EditorialFeedFeature';
import { DiscoveryPulseCard } from './DiscoveryPulseCard';
import { TalentInjectionCard } from './TalentInjectionCard';

interface FeedProps {
  onSelectPost?: (id: string) => void;
}

export const Feed: React.FC<FeedProps> = ({ onSelectPost }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeStoryUser, setActiveStoryUser] = useState<User | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observerTarget = useRef<HTMLDivElement>(null);

  const fetchFeed = async (pageNum: number = 1) => {
    if (pageNum === 1) setIsRefreshing(true);
    else setIsLoadingMore(true);

    const res = await postService.getFeed(pageNum);
    if (res.success && res.data) {
      if (res.data.length < 20) setHasMore(false);
      else setHasMore(true);

      if (pageNum === 1) {
        setPosts(res.data);
      } else {
        setPosts(prev => {
          const newPosts = res.data!.filter(newP => !prev.some(p => p.id === newP.id));
          return [...prev, ...newPosts];
        });
      }
    } else if (pageNum === 1) {
      setPosts([]);
      setHasMore(false);
    }
    setIsRefreshing(false);
    setIsLoadingMore(false);
  };

  useEffect(() => {
    setPage(1);
    fetchFeed(1);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isRefreshing) {
          setPage(prev => {
            const next = prev + 1;
            fetchFeed(next);
            return next;
          });
        }
      },
      { rootMargin: '200px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoadingMore, isRefreshing]);

  const handlePostCreated = () => {
    setPage(1);
    fetchFeed(1); // Refresh the feed when a new post is published
  };

  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
      setPulling(true);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pulling) {
      const currentY = e.touches[0].clientY;
      const distance = currentY - touchStartY.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.4, 80)); // Add resistance and cap at 80px
      }
    }
  };

  const handleTouchEnd = () => {
    if (pulling) {
      if (pullDistance >= 60) {
        setPage(1);
        fetchFeed(1);
      }
      setPulling(false);
      setPullDistance(0);
    }
  };

  return (
    <div
      className="max-w-xl mx-auto space-y-20 animate-in fade-in duration-700 relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull To Refresh Indicator */}
      <div
        className="absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden transition-all duration-300"
        style={{ height: pullDistance, opacity: pullDistance / 60 } as React.CSSProperties}
      >
        <Loader2
          className={`w-6 h-6 text-ffn-primary ${isRefreshing ? 'animate-spin' : ''}`}
          style={{ transform: `rotate(${pullDistance * 3}deg)` } as React.CSSProperties}
        />
      </div>

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
          {isRefreshing ? (
            <div className="space-y-8 mt-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-[3rem] p-6 lg:p-8 space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <div className="w-32 h-4 bg-gray-200 rounded-full" />
                      <div className="w-24 h-3 bg-gray-100 rounded-full" />
                    </div>
                  </div>
                  <div className="w-full aspect-[4/5] bg-gray-100 rounded-[2rem]" />
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
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
              <React.Fragment key={post.id}>
                <FeedCard post={post} index={idx} onSelectPost={onSelectPost} />

                {/* Injection Logic */}
                {(idx + 1) % 4 === 0 && (idx + 1) / 4 === 1 && (
                  <EditorialFeedFeature
                    title="The Cyber Couture Protocol"
                    subtitle="Identity Deep Dive"
                    description="Exploring the intersection of digital identity and physical high-fashion. How 2025's leading creators are redefining the global graph."
                  />
                )}

                {(idx + 1) % 4 === 0 && (idx + 1) / 4 === 2 && (
                  <DiscoveryPulseCard />
                )}

                {(idx + 1) % 4 === 0 && (idx + 1) / 4 === 3 && posts.length > 0 && (
                  <TalentInjectionCard talent={MOCK_TALENT_POOL[0]} />
                )}
              </React.Fragment>
            ))
          )}
        </AnimatePresence>

        {/* Infinite Scroll Trigger & Loading State */}
        <div ref={observerTarget} className="py-20 flex flex-col items-center justify-center space-y-6">
          {isRefreshing ? null : isLoadingMore ? (
            <div className="flex flex-col items-center space-y-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-t-2 border-ffn-primary rounded-full"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-steel animate-pulse">Syncing Network Nodes...</span>
            </div>
          ) : hasMore ? (
            <div className="w-full flex justify-center py-10 opacity-0">Scroll trigger line</div>
          ) : (
            <div className="flex items-center space-x-3 opacity-20 py-10">
              <Sparkles className="w-5 h-5 text-ffn-primary" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em]">Identity Feed End Sequence</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
