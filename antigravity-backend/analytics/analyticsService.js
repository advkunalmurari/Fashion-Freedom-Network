
const analyticsDb = require('./analyticsDb');

/**
 * Analytics Service for FFN
 */
const analyticsService = {
    async logView(profileUserId, viewerUserId) {
        return await analyticsDb.trackView(profileUserId, viewerUserId);
    },

    async getStats(userId) {
        return await analyticsDb.getProfileStats(userId);
    }
};

module.exports = analyticsService;
