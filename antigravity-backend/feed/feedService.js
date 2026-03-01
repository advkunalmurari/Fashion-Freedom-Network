
const supabase = require('../utils/supabaseClient');

const feedService = {
    async getHomeFeed(limit = 20, offset = 0) {
        const { data, error } = await supabase.rpc('get_advanced_feed', {
            p_limit: limit,
            p_offset: offset
        });
        if (error) throw error;
        return data || [];
    },

    async getExploreFeed(limit = 20, offset = 0) {
        // Explore currently uses the same logic but could be differentiated with more discovery-based ranking
        const { data, error } = await supabase.rpc('get_advanced_feed', {
            p_limit: limit,
            p_offset: offset
        });
        if (error) throw error;
        return data || [];
    },

    async getUserPosts(profileId, limit = 20, offset = 0) {
        const { data, error } = await supabase
            .from('posts')
            .select(`
                *,
                profiles:author_id(id, full_name, avatar_url, role, is_premium),
                likes_count:likes(count),
                comments_count:comments(count)
            `)
            .eq('author_id', profileId)
            .order('created_at', { ascending: false })
            .range(offset, offset + limit - 1);

        if (error) throw error;
        return data;
    }
};

module.exports = feedService;
