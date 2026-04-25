import { supabase } from '../supabase';
import { Post, UserRole, VerificationLevel } from '../types';

export const postService = {
    // Fetch a feed of posts
    async getFeed(page: number = 1, limit: number = 20): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const offset = (page - 1) * limit;
            const { data, error } = await supabase
                .from('posts')
                .select('*, author:profiles(*)')
                .order('created_at', { ascending: false })
                .range(offset, offset + limit - 1);

            if (error) throw error;

            const formattedPosts: Post[] = (data || []).map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author?.id,
                    username: post.author?.username || 'user',
                    displayName: post.author?.full_name || 'Unknown User',
                    avatarUrl: post.author?.profile_photo_url || post.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    role: (post.author?.category || 'MODEL') as UserRole,
                    isBoosted: post.author?.is_premium || false,
                    location: post.author?.location || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: post.author?.bio || '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: post.type === 'video' || post.type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: post.likes_count || 0,
                comments: post.comments_count || 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: post.tags || ['ffn'],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
                isLiked: false, // Would require joining a likes table
                isSaved: false
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
            const { data, error } = await supabase
                .from('posts')
                .select('*, author:profiles(*)')
                .eq('type', 'video')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;

            const formattedPosts: Post[] = (data || []).map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author?.id,
                    username: post.author?.username || 'user',
                    displayName: post.author?.full_name || 'Unknown User',
                    avatarUrl: post.author?.profile_photo_url || post.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    role: (post.author?.category || 'MODEL') as UserRole,
                    isBoosted: post.author?.is_premium || false,
                    location: post.author?.location || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: post.author?.bio || '',
                    followersCount: 0,
                    followingCount: 0,
                },
                type: 'VIDEO',
                mediaUrls: [post.media_url || ''],
                caption: post.caption || '',
                likes: post.likes_count || 0,
                comments: post.comments_count || 0,
                createdAt: new Date(post.created_at).toLocaleDateString(),
                tags: post.tags || ['reel'],
                shootType: post.shoot_type,
                brandTag: post.brand_tag,
                photographerTag: post.photographer_tag,
                isLiked: false,
                isSaved: false
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

            const { data, error } = await supabase
                .from('posts')
                .insert({
                    author_id: session.user.id,
                    caption: postData.caption,
                    media_url: postData.mediaUrls?.[0],
                    type: postData.type?.toLowerCase() || 'image',
                    shoot_type: postData.shootType,
                    brand_tag: postData.brandTag,
                    photographer_tag: postData.photographerTag
                })
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error: any) {
            console.error('Error creating post:', error);
            return { success: false, error: error.message };
        }
    },

    // Toggle Like status
    async toggleLike(postId: string) {
        try {
            // Simplified for frontend-only: we would normally insert/delete from 'likes' table
            return { success: true, liked: true };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    },

    // Add a comment
    async addComment(postId: string, text: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            // Assuming a 'comments' table exists
            const { data, error } = await supabase
                .from('comments')
                .insert({
                    post_id: postId,
                    author_id: session.user.id,
                    content: text
                })
                .select()
                .single();
                
            if (error) {
                console.warn('Comments table might not exist yet', error);
                return { success: true, data: { text, authorId: session.user.id } }; // Mock fallback
            }

            return { success: true, data };
        } catch (error: any) {
            console.error('Error adding comment:', error);
            return { success: false, error: error.message };
        }
    },

    // Get comments for a post
    async getComments(postId: string) {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*, author:profiles(*)')
                .eq('post_id', postId)
                .order('created_at', { ascending: true });

            if (error) {
                return { success: true, data: [] }; // Mock fallback if table missing
            }

            return { success: true, data };
        } catch (error: any) {
            console.error('Error fetching comments:', error);
            return { success: false, error: error.message };
        }
    },

    // Fetch explore feed (ranked discovery)
    async getExploreFeed(page: number = 1, limit: number = 20): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        return this.getFeed(page, limit); // Fallback to getFeed
    },

    // Fetch saved posts
    async getSavedPosts(): Promise<{ success: boolean; data?: Post[]; error?: string }> {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const { data, error } = await supabase
                .from('saved_posts')
                .select('post_id, post:posts(*, author:profiles(*))')
                .eq('user_id', session.user.id);

            if (error) throw error;

            const formattedPosts: Post[] = (data || []).map((item: any) => {
                const post = item.post;
                if (!post) return null;
                return {
                    id: post.id,
                    authorId: post.author_id,
                    author: {
                        id: post.author?.id,
                        username: post.author?.username || 'user',
                        displayName: post.author?.full_name || 'Unknown User',
                        avatarUrl: post.author?.profile_photo_url || post.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                        role: (post.author?.category || 'MODEL') as UserRole,
                        isBoosted: post.author?.is_premium || false,
                        location: post.author?.location || 'Global',
                        verificationLevel: VerificationLevel.BASIC,
                        isVerified: false,
                        bio: post.author?.bio || '',
                        followersCount: 0,
                        followingCount: 0,
                    },
                    type: post.type === 'video' || post.type === 'VIDEO' ? 'VIDEO' : 'IMAGE',
                    mediaUrls: [post.media_url || ''],
                    caption: post.caption || '',
                    likes: post.likes_count || 0,
                    comments: post.comments_count || 0,
                    createdAt: new Date(post.created_at).toLocaleDateString(),
                    tags: post.tags || ['saved'],
                    shootType: post.shoot_type,
                    brandTag: post.brand_tag,
                    photographerTag: post.photographer_tag,
                    isLiked: false,
                    isSaved: true
                };
            }).filter(Boolean) as Post[];

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

            const formattedPosts: Post[] = (data || []).map((post: any) => ({
                id: post.id,
                authorId: post.author_id,
                author: {
                    id: post.author?.id,
                    username: post.author?.username || 'user',
                    displayName: post.author?.full_name || 'Unknown User',
                    avatarUrl: post.author?.profile_photo_url || post.author?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                    coverUrl: post.author?.cover_photo_url || 'https://images.unsplash.com/photo-1541334865516-41fbbd09b68a?auto=format&fit=crop&q=80',
                    role: (post.author?.category || 'MODEL') as UserRole,
                    isBoosted: post.author?.is_premium || false,
                    location: post.author?.location || 'Global',
                    verificationLevel: VerificationLevel.BASIC,
                    isVerified: false,
                    bio: post.author?.bio || '',
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

            // Check if saved
            const { data: existing } = await supabase
                .from('saved_posts')
                .select('id')
                .eq('user_id', session.user.id)
                .eq('post_id', postId)
                .single();

            if (existing) {
                await supabase.from('saved_posts').delete().eq('id', existing.id);
                return { success: true, saved: false };
            } else {
                await supabase.from('saved_posts').insert({
                    user_id: session.user.id,
                    post_id: postId
                });
                return { success: true, saved: true };
            }
        } catch (error: any) {
            console.error('Error toggling save:', error);
            return { success: false, error: error.message };
        }
    }
};
