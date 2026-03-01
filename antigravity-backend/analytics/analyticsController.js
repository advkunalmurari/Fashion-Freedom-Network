
const analyticsService = require('./analyticsService');

const analyticsController = {
    async trackView(req, res) {
        const profileUserId = req.body.profileUserId || req.body.profile_user_id;
        const viewerUserId = req.user?.id || null; // Support anonymous views if needed
        try {
            await analyticsService.logView(profileUserId, viewerUserId);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getProfileStats(req, res) {
        const { userId } = req.params;
        try {
            const stats = await analyticsService.getStats(userId);
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = analyticsController;
