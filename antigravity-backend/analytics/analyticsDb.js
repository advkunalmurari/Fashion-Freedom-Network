const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Analytics
 */
const analyticsDb = {
    async trackView(profileUserId, viewerUserId) {
        const { data, error } = await supabase
            .from('profile_views')
            .insert([{ profile_user_id: profileUserId, viewer_user_id: viewerUserId }])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getProfileStats(userId) {
        // Basic count of views
        const { count, error } = await supabase
            .from('profile_views')
            .select('*', { count: 'exact', head: true })
            .eq('profile_user_id', userId);

        if (error) throw error;
        return { views: count };
    }
};

module.exports = analyticsDb;
