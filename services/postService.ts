import { supabase } from '../supabase';
import { Post, UserRole, VerificationLevel } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const postService = {
    // Fetch a feed of posts
    async getFeed(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: any = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch(`${API_URL}/feed/home`, { headers });
            const res = await response.json();

            if (!res.success) throw new Error(res.message);

            const formattedPosts: Post[] = res.data.map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author_id,
                    username: post.author_full_name?.split(' ')[0]?.toLowerCase() || 'user',
                    displayName: post.author_full_name || 'Unknown User',
                    avatarUrl: post.author_avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    role: (post.author_role as UserRole) || UserRole.MODEL,
                    isBoosted: post.author_is_premium || false,
                    location: post.author_city || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: post.type === 'video' ? 'VIDEO' : 'IMAGE',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: Number(post.likes_count) || 0,
                comments: Number(post.comments_count) || 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: ['ffn'],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
                isLiked: post.is_liked,
                isSaved: post.is_saved
            }));

            return { success: true, data: formattedPosts };
        } catch (error: any) {
            console.error('Error fetching feed:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch reels (video-only feed)
    async getReels(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: any = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch(`${API_URL}/feed/explore?type=video`, { headers });
            const res = await response.json();

            if (!res.success) throw new Error(res.message);

            const formattedPosts: Post[] = res.data.map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author_id,
                    username: post.author_full_name?.split(' ')[0]?.toLowerCase() || 'user',
                    displayName: post.author_full_name || 'Unknown User',
                    avatarUrl: post.author_avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    role: (post.author_role as UserRole) || UserRole.MODEL,
                    isBoosted: post.author_is_premium || false,
                    location: post.author_city || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: 'VIDEO',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: Number(post.likes_count) || 0,
                comments: Number(post.comments_count) || 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: ['reel'],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
                isLiked: post.is_liked,
                isSaved: post.is_saved
            }));

            return { success: true, data: formattedPosts };
        } catch (error: any) {
            console.error('Error fetching reels:', error);
            return { success: false, error: error.message };
        }
    },

    // Create a new post
    async createPost(postData: Partial<Post>) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const response = await fetch(`${API_URL}/posts/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    caption: postData.caption,
                    media_url: postData.mediaUrls?.[0],
                    type: postData.type?.toLowerCase(),
                    shoot_type: postData.shootType,
                    brand_tag: postData.brandTag,
                    photographer_tag: postData.photographerTag,
                    visibility: postData.visibility
                })
            });

            const res = await response.json();
            if (!res.success) throw new Error(res.message);

            return { success: true, data: res.data };
        } catch (error: any) {
            console.error('Error creating post:', error);
            return { success: false, error: error.message };
        }
    },

    // Toggle Like status
    async toggleLike(postId: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const response = await fetch(`${API_URL}/posts/${postId}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            const res = await response.json();
            if (!res.success) throw new Error(res.message);

            return { success: true, liked: res.liked };
        } catch (error: any) {
            console.error('Error toggling like:', error);
            return { success: false, error: error.message };
        }
    },

    // Add a comment
    async addComment(postId: string, text: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ text })
            });

            const res = await response.json();
            if (!res.success) throw new Error(res.message);

            return { success: true, data: res.data };
        } catch (error: any) {
            console.error('Error adding comment:', error);
            return { success: false, error: error.message };
        }
    },

    // Get comments for a post
    async getComments(postId: string) {
        try {
            const response = await fetch(`${API_URL}/posts/${postId}/comments`);
            const res = await response.json();
            if (!res.success) throw new Error(res.message);

            return { success: true, data: res.data };
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch explore feed (ranked discovery)
    async getExploreFeed(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const headers: any = { 'Content-Type': 'application/json' };
            if (session?.access_token) {
                headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const response = await fetch(`${API_URL}/feed/explore`, { headers });
            const res = await response.json();

            if (!res.success) throw new Error(res.message);

            const formattedPosts: Post[] = res.data.map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author_id,
                    username: post.author_full_name?.split(' ')[0]?.toLowerCase() || 'user',
                    displayName: post.author_full_name || 'Unknown User',
                    avatarUrl: post.author_avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    role: (post.author_role as UserRole) || UserRole.MODEL,
                    isBoosted: post.author_is_premium || false,
                    location: post.author_city || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: post.type === 'video' ? 'VIDEO' : 'IMAGE',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: Number(post.likes_count) || 0,
                comments: Number(post.comments_count) || 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: ['explore'],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
                isLiked: post.is_liked,
                isSaved: post.is_saved
            }));

            return { success: true, data: formattedPosts };
        } catch (error: any) {
            console.error('Error fetching explore feed:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch saved posts
    async getSavedPosts(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const response = await fetch(`${API_URL}/social/saved`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });
            const res = await response.json();

            if (!res.success) throw new Error(res.message);

            const formattedPosts: Post[] = res.data.map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author_id,
                    username: post.author_full_name?.split(' ')[0]?.toLowerCase() || 'user',
                    displayName: post.author_full_name || 'Unknown User',
                    avatarUrl: post.author_avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    role: (post.author_role as UserRole) || UserRole.MODEL,
                    isBoosted: post.author_is_premium || false,
                    location: post.author_city || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: post.type === 'video' ? 'VIDEO' : 'IMAGE',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: Number(post.likes_count) || 0,
                comments: Number(post.comments_count) || 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: ['saved'],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
                isLiked: post.is_liked,
                isSaved: true
            }));

            return { success: true, data: formattedPosts };
        } catch (error: any) {
            console.error('Error fetching saved posts:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch user specific posts for Profile Portfolio
    async getUserPosts(userId: string): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*, author:profiles(*)')
                .eq('author_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedPosts: Post[] = data.map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author.id,
                    username: post.author.username || 'user',
                    displayName: post.author.full_name || 'Unknown User',
                    avatarUrl: post.author.profile_photo_url || post.author.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    coverUrl: post.author.cover_photo_url || 'https://images.unsplash.com/photo-1541334865516-41fbbd09b68a?auto=format&fit=crop&q=80',
                    role: (post.author.category || 'MODEL') as UserRole, isBoosted: post.author.is_premium || false,
                    location: post.author.location || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: post.author.bio || '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: post.type === 'video' || post.type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: 0,
                comments: 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: post.tags || [],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
            }));

            return { success: true, data: formattedPosts };
        } catch (error: any) {
            console.error('Error fetching user posts:', error);
            return { success: false, error: error.message };
        }
    },

    // Toggle Save status
    async toggleSave(postId: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const response = await fetch(`${API_URL}/posts/${postId}/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

            const res = await response.json();
            if (!res.success) throw new Error(res.message);

            return { success: true, saved: res.saved };
        } catch (error: any) {
            console.error('Error toggling save:', error);
            return { success: false, error: error.message };
        }
    }
};
