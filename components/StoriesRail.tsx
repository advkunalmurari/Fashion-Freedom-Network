import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_TALENT_POOL, MOCK_POSTS } from '../constants'; // For demo data

export interface Story {
    id: string;
    user_id: string;
    user: any; // using any for rapid prototyping, ideally ProfileType
    media_url: string;
    media_type: 'image' | 'video';
    story_tag?: string;
}

interface StoriesRailProps {
    onStoryClick: (story: Story, index: number, allStories: Story[]) => void;
}

export const StoriesRail: React.FC<StoriesRailProps> = ({ onStoryClick }) => {
    const [stories, setStories] = useState<Story[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Generate mock stories based on MOCK_TALENT_POOL and MOCK_POSTS
        const generateMockStories = () => {
            const mockStories: Story[] = MOCK_TALENT_POOL.slice(0, 8).map((talent, index) => {
                // Find a post image or use a default
                const post = MOCK_POSTS.find(p => p.authorId === talent.id);
                return {
                    id: `story_mock_${index}`,
                    user_id: talent.id,
                    user: talent,
                    media_url: post?.mediaUrls?.[0] || talent.avatarUrl,
                    media_type: 'image',
                    story_tag: index % 3 === 0 ? 'Behind the Shoot' : index % 4 === 0 ? 'Casting Alert' : 'None',
                };
            });
            setStories(mockStories);
            setIsLoading(false);
        };

        // Simulate API delay
        setTimeout(generateMockStories, 800);
    }, []);

    if (isLoading) {
        return (
            <div className="w-full overflow-hidden py-4 border-b border-white/5 bg-transparent mb-2">
                <div className="flex space-x-4 px-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex flex-col items-center space-y-2 flex-shrink-0 animate-pulse">
                            <div className="w-16 h-16 rounded-full bg-white/10" />
                            <div className="w-12 h-2 rounded-full bg-white/10" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="w-full relative py-4 border-b border-black/5 dark:border-white/5 mb-2 overflow-hidden">
            <div className="flex space-x-4 px-4 overflow-x-auto no-scrollbar pb-2 items-center">
                {/* Current User Add Story Button */}
                <div className="flex flex-col items-center space-y-1 flex-shrink-0 relative group cursor-pointer mr-2">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-dashed border-gray-400 dark:border-white/30 flex items-center justify-center bg-gray-100 dark:bg-white/5 relative z-10 transition-transform hover:scale-105">
                        <span className="text-2xl font-light text-gray-500 dark:text-gray-300">+</span>
                    </div>
                    <span className="text-[10px] font-bold text-ffn-black dark:text-white uppercase tracking-wider">Your Story</span>
                </div>

                {/* Story Rings */}
                {stories.map((story, index) => (
                    <motion.div
                        key={story.id}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onStoryClick(story, index, stories)}
                        className="flex flex-col items-center space-y-1 flex-shrink-0 cursor-pointer group"
                    >
                        <div className="relative w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-ffn-primary via-purple-500 to-orange-400 group-hover:from-purple-500 group-hover:to-ffn-primary transition-all duration-300">
                            <div className="w-full h-full rounded-full border-2 border-white dark:border-[#0A0A0A] overflow-hidden bg-gray-200">
                                <img src={story.user.avatarUrl} alt={story.user.displayName} className="w-full h-full object-cover" loading="lazy" width="64" height="64" />
                            </div>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-ffn-black truncate max-w-[50px]">
                            {(story.user?.displayName || 'User').split(' ')[0]}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
