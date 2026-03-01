
const profileService = require('./profileService');

const profileController = {
    async create(req, res) {
        const { full_name, category, bio, location, instagram_link, profile_photo_url, cover_photo_url, profile_type } = req.body;
        const profileData = {
            user_id: req.user.id,
            full_name,
            category,
            bio,
            location,
            instagram_link,
            profile_photo_url,
            cover_photo_url,
            profile_type
        };

        try {
            const profile = await profileService.create(profileData);
            await profileService.calculateProfileCompletion(profileData.user_id);
            res.status(201).json({ success: true, data: profile });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async get(req, res) {
        const { username } = req.params;
        try {
            const profile = await profileService.getByUsername(username);
            res.status(200).json({ success: true, data: profile });
        } catch (error) {
            res.status(404).json({ success: false, message: 'Profile not found' });
        }
    },

    async update(req, res) {
        const userId = req.user.id;
        const { full_name, category, bio, location, instagram_link, profile_photo_url, cover_photo_url, profile_type } = req.body;
        const updateData = { full_name, category, bio, location, instagram_link, profile_photo_url, cover_photo_url, profile_type };

        // Remove undefined fields
        Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

        try {
            const profile = await profileService.update(userId, updateData);
            await profileService.calculateProfileCompletion(userId);
            res.status(200).json({ success: true, data: profile });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async delete(req, res) {
        const userId = req.user.id;
        try {
            await profileService.delete(userId);
            res.status(200).json({ success: true, message: 'Profile deleted' });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = profileController;
