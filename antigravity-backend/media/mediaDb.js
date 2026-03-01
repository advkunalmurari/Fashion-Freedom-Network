const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Media
 */
const mediaDb = {
    async addMedia(mediaData) {
        const { data, error } = await supabase
            .from('profile_media')
            .insert([mediaData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteMedia(mediaId, userId) {
        const { error } = await supabase
            .from('profile_media')
            .delete()
            .eq('id', mediaId)
            .eq('user_id', userId);
        if (error) throw error;
    },

    async getMediaUrl(mediaId) {
        const { data, error } = await supabase
            .from('profile_media')
            .select('media_url')
            .eq('id', mediaId)
            .single();
        if (error) throw error;
        return data.media_url;
    }
};

module.exports = mediaDb;
