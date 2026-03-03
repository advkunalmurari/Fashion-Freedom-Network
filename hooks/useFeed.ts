/**
 * useFeed hook — loads real posts from Supabase `posts` table.
 * Falls back to mock data if table doesn't exist yet.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { MOCK_POSTS } from '../constants';

export interface FeedPost {
    id: string;
    user_id: string;
    content: string;
    image_url?: string;
    tags?: string[];
    likes_count: number;
    comments_count: number;
    created_at: string;
    // Joined from profiles
    profiles?: {
        username: string;
        full_name: string;
        avatar_url?: string;
        category?: string;
        is_professional?: boolean;
    };
}

export function useFeed(limit = 20) {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPosts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: dbError } = await supabase
                .from('posts')
                .select(`
          *,
          profiles:user_id (username, full_name, avatar_url, category, is_professional)
        `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (dbError) {
                // If table doesn't exist, use mock data
                console.warn('Posts table not found, using mock data:', dbError.message);
                setPosts(MOCK_POSTS);
            } else {
                // If real data exists, use it; otherwise fallback to mock
                setPosts(data && data.length > 0 ? data : MOCK_POSTS);
            }
        } catch (e: any) {
            console.warn('Feed load error, using mock data:', e.message);
            setPosts(MOCK_POSTS);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        loadPosts();

        // Subscribe to real-time new posts
        const channel = supabase
            .channel('posts_realtime')
            .on('postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'posts' },
                (payload) => {
                    setPosts(prev => [payload.new as FeedPost, ...prev]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [loadPosts]);

    const createPost = async (userId: string, content: string, imageUrl?: string, tags?: string[]) => {
        try {
            const { data, error: dbError } = await supabase
                .from('posts')
                .insert({
                    user_id: userId,
                    content,
                    image_url: imageUrl || null,
                    tags: tags || [],
                    likes_count: 0,
                    comments_count: 0,
                })
                .select(`*, profiles:user_id (username, full_name, avatar_url, category, is_professional)`)
                .single();

            if (!dbError && data) {
                setPosts(prev => [data, ...prev]);
                return { data, error: null };
            }
            return { data: null, error: dbError };
        } catch (e: any) {
            return { data: null, error: e };
        }
    };

    const likePost = async (postId: string) => {
        // Optimistic update
        setPosts(prev => prev.map(p =>
            p.id === postId ? { ...p, likes_count: (p.likes_count || 0) + 1 } : p
        ));
        // Update DB (best effort)
        await supabase.from('posts').update({ likes_count: supabase.rpc('increment', { x: 1 }) as any }).eq('id', postId);
    };

    return { posts, loading, error, refetch: loadPosts, createPost, likePost };
}
