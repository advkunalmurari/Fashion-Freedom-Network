
const supabase = require('../utils/supabaseClient');

const socialService = {
    // --- FOLLOWS ---
    async follow(followerId, followingId) {
        const { error } = await supabase
            .from('follows')
            .insert([{ follower_id: followerId, following_id: followingId }]);
        if (error) throw error;
        return true;
    },

    async unfollow(followerId, followingId) {
        const { error } = await supabase
            .from('follows')
            .delete()
            .match({ follower_id: followerId, following_id: followingId });
        if (error) throw error;
        return true;
    },

    async getFollowers(userId) {
        const { data, error } = await supabase
            .from('follows')
            .select('follower:profiles!follower_id(id, full_name, avatar_url, role)')
            .eq('following_id', userId);
        if (error) throw error;
        return data.map(f => f.follower);
    },

    async getFollowing(userId) {
        const { data, error } = await supabase
            .from('follows')
            .select('following:profiles!following_id(id, full_name, avatar_url, role)')
            .eq('follower_id', userId);
        if (error) throw error;
        return data.map(f => f.following);
    },

    // --- LIKES ---
    async toggleLike(postId, userId) {
        // Check if already liked
        const { data: existing } = await supabase
            .from('likes')
            .select('id')
            .match({ post_id: postId, user_id: userId })
            .maybeSingle();

        if (existing) {
            const { error } = await supabase.from('likes').delete().eq('id', existing.id);
            if (error) throw error;
            return { liked: false };
        } else {
            const { error } = await supabase.from('likes').insert([{ post_id: postId, user_id: userId }]);
            if (error) throw error;
            return { liked: true };
        }
    },

    // --- COMMENTS ---
    async addComment(postId, userId, text) {
        const { data, error } = await supabase
            .from('comments')
            .insert([{ post_id: postId, user_id: userId, text: text }])
            .select('*, profiles:user_id(id, full_name, avatar_url)')
            .single();
        if (error) throw error;
        return data;
    },

    async deleteComment(commentId, userId) {
        const { error } = await supabase
            .from('comments')
            .delete()
            .match({ id: commentId, user_id: userId });
        if (error) throw error;
        return true;
    },

    // --- BOOKMARKS (SAVED POSTS) ---
    async toggleSave(postId, userId) {
        const { data: existing } = await supabase
            .from('saved_posts')
            .select('id')
            .match({ post_id: postId, user_id: userId })
            .maybeSingle();

        if (existing) {
            const { error } = await supabase.from('saved_posts').delete().eq('id', existing.id);
            if (error) throw error;
            return { saved: false };
        } else {
            const { error } = await supabase.from('saved_posts').insert([{ post_id: postId, user_id: userId }]);
            if (error) throw error;
            return { saved: true };
        }
    }
};

module.exports = socialService;
