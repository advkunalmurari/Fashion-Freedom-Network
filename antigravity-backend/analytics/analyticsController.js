
const analyticsService = require('./analyticsService');
const supabase = require('../utils/supabaseClient');

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
    },

    async computeDailyMetrics(req, res) {
        try {
            // Mock computation of platform metrics
            const date = new Date().toISOString().split('T')[0];
            const metrics = {
                date,
                total_active_talent: Math.floor(Math.random() * 500) + 5000,
                total_active_brands: Math.floor(Math.random() * 50) + 150,
                total_open_castings: Math.floor(Math.random() * 20) + 100,
                total_casting_value_usd: (Math.random() * 500000 + 1000000).toFixed(2),
                successful_matches: Math.floor(Math.random() * 100) + 500
            };

            const { error } = await supabase
                .from('platform_metrics_daily')
                .upsert(metrics, { onConflict: 'date' });

            if (error) throw error;
            res.status(200).json({ success: true, message: 'Daily metrics computed and stored', data: metrics });
        } catch (error) {
            console.error('Compute Metrics Error:', error.message);
            res.status(500).json({ success: false, message: 'Failed to compute daily metrics' });
        }
    },

    async getPlatformStats(req, res) {
        try {
            const { data, error } = await supabase
                .from('platform_metrics_daily')
                .select('*')
                .order('date', { ascending: false })
                .limit(1)
                .single();

            if (error && error.code !== 'PGRST116') throw error; // Ignore no rows found

            res.status(200).json({ success: true, data: data || { total_active_talent: 0, total_active_brands: 0 } });
        } catch (error) {
            console.error('Get Platform Stats Error:', error.message);
            res.status(500).json({ success: false, message: 'Failed to retrieve stats' });
        }
    }
};

module.exports = analyticsController;
