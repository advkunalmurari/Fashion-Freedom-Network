
const profileDb = require('./profileDb');

/**
 * Profile Service for FFN
 */
const profileService = {
    async create(profileData) {
        return await profileDb.createProfile(profileData);
    },

    async getByUsername(username) {
        return await profileDb.getProfileByUsername(username);
    },

    async update(userId, updateData) {
        return await profileDb.updateProfile(userId, updateData);
    },

    async delete(userId) {
        return await profileDb.deleteProfile(userId);
    },

    /**
     * Calculate profile completion score based on bio, photo, media, and category.
     */
    async calculateProfileCompletion(userId) {
        const profile = await profileDb.getProfileByUserId(userId);
        const { data: media } = await require('../utils/supabaseClient')
            .from('profile_media')
            .select('id')
            .eq('user_id', userId);

        let score = 0;
        if (profile) {
            if (profile.bio) score += 25;
            if (profile.profile_photo_url) score += 25;
            if (profile.category) score += 25;
        }
        if (media && media.length > 0) score += 25;

        // Update score in users table
        await require('../utils/supabaseClient')
            .from('users')
            .update({ profile_completion_score: score })
            .eq('id', userId);

        return score;
    }
};

module.exports = profileService;
