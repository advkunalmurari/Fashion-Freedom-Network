
const socialService = require('./socialService');
const profileDb = require('../profiles/profileDb');

const socialController = {
    async follow(req, res) {
        const { targetUserId } = req.body; // Expecting target profile ID
        const userId = req.user.id; // auth.uid()

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found for current user');

            await socialService.follow(myProfile.id, targetUserId);
            res.status(200).json({ success: true, message: 'Followed successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async unfollow(req, res) {
        const { targetUserId } = req.body;
        const userId = req.user.id;

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found for current user');

            await socialService.unfollow(myProfile.id, targetUserId);
            res.status(200).json({ success: true, message: 'Unfollowed successfully' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getFollowers(req, res) {
        const { profileId } = req.params;
        try {
            const followers = await socialService.getFollowers(profileId);
            res.status(200).json({ success: true, data: followers });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getFollowing(req, res) {
        const { profileId } = req.params;
        try {
            const following = await socialService.getFollowing(profileId);
            res.status(200).json({ success: true, data: following });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async toggleLike(req, res) {
        const { postId } = req.params;
        const userId = req.user.id;

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found');

            const result = await socialService.toggleLike(postId, myProfile.id);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async addComment(req, res) {
        const { postId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found');

            const comment = await socialService.addComment(postId, myProfile.id, text);
            res.status(201).json({ success: true, data: comment });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async toggleSave(req, res) {
        const { postId } = req.params;
        const userId = req.user.id;

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found');

            const result = await socialService.toggleSave(postId, myProfile.id);
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

module.exports = socialController;
