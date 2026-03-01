
const postsService = require('./postsService');
const profileDb = require('../profiles/profileDb');

const postsController = {
    async create(req, res) {
        const { caption, media_url, type, shoot_type, brand_tag, photographer_tag, visibility } = req.body;
        const userId = req.user.id;

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found');

            const post = await postsService.create({
                author_id: myProfile.id,
                caption,
                media_url,
                type,
                shoot_type,
                brand_tag,
                photographer_tag,
                visibility
            });

            res.status(201).json({ success: true, data: post });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async delete(req, res) {
        const { postId } = req.params;
        const userId = req.user.id;

        try {
            const myProfile = await profileDb.getProfileByUserId(userId);
            if (!myProfile) throw new Error('Profile not found');

            await postsService.delete(postId, myProfile.id);
            res.status(200).json({ success: true, message: 'Post deleted' });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

module.exports = postsController;
