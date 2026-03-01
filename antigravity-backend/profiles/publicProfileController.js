
const supabase = require('../utils/supabaseClient');

const publicProfileController = {
    /**
     * Specialized resolver for GET /api/public-profile/:username
     * Returns profile info, portfolio media, and verification status.
     */
    async getPublicProfile(req, res) {
        const { username } = req.params;

        try {
            // 1. Fetch user by username
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('id, username, verification_level, profile_completion_score')
                .eq('username', username)
                .single();

            if (userError || !user) {
                return res.status(404).json({ success: false, message: 'Profile not found' });
            }

            // 2. Fetch profile details
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            // 3. Fetch portfolio media
            const { data: media } = await supabase
                .from('profile_media')
                .select('*')
                .eq('user_id', user.id);

            res.status(200).json({
                success: true,
                data: {
                    user,
                    profile,
                    portfolio: media || []
                }
            });
        } catch (error) {
            console.error('Public Profile Resolver Error:', error.message);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
};

module.exports = publicProfileController;
