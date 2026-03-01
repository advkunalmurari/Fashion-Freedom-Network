
const feedService = require('./feedService');
const profileDb = require('../profiles/profileDb');

const feedController = {
    async getHomeFeed(req, res) {
        const { limit, offset } = req.query;
        try {
            const feed = await feedService.getHomeFeed(Number(limit) || 20, Number(offset) || 0);
            res.status(200).json({ success: true, data: feed });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getExploreFeed(req, res) {
        const { limit, offset } = req.query;
        try {
            const feed = await feedService.getExploreFeed(Number(limit) || 20, Number(offset) || 0);
            res.status(200).json({ success: true, data: feed });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getUserFeed(req, res) {
        const { username } = req.params;
        const { limit, offset } = req.query;
        try {
            const profile = await profileDb.getProfileByUsername(username);
            if (!profile) throw new Error('Profile not found');

            const posts = await feedService.getUserPosts(profile.id, Number(limit) || 20, Number(offset) || 0);
            res.status(200).json({ success: true, data: posts });
        } catch (error) {
            res.status(404).json({ success: false, message: error.message });
        }
    }
};

module.exports = feedController;
