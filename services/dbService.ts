/**
 * FFN Database Service — Direct Supabase Integration
 * Replaces backend API calls with direct Supabase client calls
 * for all core data operations that work on the frontend.
 */

import { supabase } from '../supabase';

// ─── Profile Service ───────────────────────────────────────────────────────────

export const profileDb = {
    /** Get the current user's own profile */
    async getMyProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();
        return { data, error };
    },

    /** Get a profile by username */
    async getProfileByUsername(username: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('username', username)
            .maybeSingle();
        return { data, error };
    },

    /** Get all professional profiles for the Directory */
    async getProfessionalProfiles(filters?: {
        search?: string;
        category?: string;
        location?: string;
        isAvailable?: boolean;
        limit?: number;
    }) {
        let query = supabase
            .from('profiles')
            .select('*')
            .eq('is_professional', true)
            .order('created_at', { ascending: false })
            .limit(filters?.limit || 50);

        if (filters?.search) {
            query = query.or(`username.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`);
        }
        if (filters?.category) {
            query = query.eq('category', filters.category);
        }
        if (filters?.location) {
            query = query.ilike('location', `%${filters.location}%`);
        }

        const { data, error } = await query;
        return { data, error };
    },

    /** Get all profiles (for discovery/explore) */
    async getAllProfiles(limit = 30) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);
        return { data, error };
    },

    /** Update own profile */
    async updateProfile(userId: string, updates: Record<string, any>) {
        const { data, error } = await supabase
            .from('profiles')
            .update({ ...updates, updated_at: new Date().toISOString() })
            .eq('user_id', userId)
            .select()
            .single();
        return { data, error };
    },

    /** Upsert profile (create or update) */
    async upsertProfile(profile: Record<string, any>) {
        const { data, error } = await supabase
            .from('profiles')
            .upsert(profile, { onConflict: 'user_id' })
            .select()
            .single();
        return { data, error };
    },
};

// ─── Posts / Feed Service ─────────────────────────────────────────────────────

export const postsDb = {
    /** Get feed posts (most recent) */
    async getFeedPosts(limit = 20, page = 0) {
        const { data, error } = await supabase
            .from('posts')
            .select(`
        *,
        profiles:user_id (username, full_name, avatar_url, category, is_professional)
      `)
            .order('created_at', { ascending: false })
            .range(page * limit, (page + 1) * limit - 1);
        return { data, error };
    },

    /** Create a new post */
    async createPost(userId: string, content: string, imageUrl?: string, tags?: string[]) {
        const { data, error } = await supabase
            .from('posts')
            .insert({
                user_id: userId,
                content,
                image_url: imageUrl || null,
                tags: tags || [],
                likes_count: 0,
                comments_count: 0,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();
        return { data, error };
    },

    /** Like a post */
    async likePost(postId: string, userId: string) {
        // Try to insert like
        const { error: likeError } = await supabase
            .from('post_likes')
            .insert({ post_id: postId, user_id: userId });

        if (!likeError) {
            // Increment counter
            await supabase.rpc('increment_likes', { post_id: postId });
        }
        return { error: likeError };
    },

    /** Get posts by a specific user */
    async getUserPosts(userId: string) {
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    },
};

// ─── Castings Service ─────────────────────────────────────────────────────────

export const castingsDb = {
    /** Get all active castings */
    async getCastings(filters?: { category?: string; location?: string; limit?: number }) {
        let query = supabase
            .from('casting_calls')
            .select(`
        *,
        brands:brand_id (name, logo_url, verified)
      `)
            .eq('status', 'active')
            .order('created_at', { ascending: false })
            .limit(filters?.limit || 30);

        if (filters?.category) query = query.eq('category', filters.category);
        if (filters?.location) query = query.ilike('location', `%${filters.location}%`);

        const { data, error } = await query;
        return { data, error };
    },

    /** Apply to a casting */
    async applyToCasting(castingId: string, userId: string, coverLetter?: string) {
        const { data, error } = await supabase
            .from('casting_applications')
            .insert({
                casting_id: castingId,
                user_id: userId,
                cover_letter: coverLetter || '',
                status: 'pending',
                applied_at: new Date().toISOString(),
            })
            .select()
            .single();
        return { data, error };
    },
};

// ─── Hire Requests ────────────────────────────────────────────────────────────

export const hireDb = {
    /** Create a hire request */
    async createHireRequest(request: {
        from_user_id: string;
        to_user_id: string;
        project_type: string;
        message: string;
        budget?: number;
        start_date?: string;
    }) {
        const { data, error } = await supabase
            .from('hire_requests')
            .insert({ ...request, status: 'pending', created_at: new Date().toISOString() })
            .select()
            .single();
        return { data, error };
    },

    /** Get hire requests for a user (as recipient) */
    async getMyHireRequests(userId: string) {
        const { data, error } = await supabase
            .from('hire_requests')
            .select(`
        *,
        from_profile:from_user_id (username, full_name, avatar_url)
      `)
            .eq('to_user_id', userId)
            .order('created_at', { ascending: false });
        return { data, error };
    },
};

// ─── Analytics / Views ────────────────────────────────────────────────────────

export const analyticsDb = {
    /** Track a profile view */
    async trackProfileView(profileUserId: string, viewerId?: string) {
        try {
            await supabase.from('profile_views').insert({
                profile_user_id: profileUserId,
                viewer_id: viewerId || null,
                viewed_at: new Date().toISOString(),
            });
        } catch {
            // Non-critical — silently fail
        }
    },
};
