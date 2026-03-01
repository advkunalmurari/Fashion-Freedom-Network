const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Admin
 */
const adminDb = {
    async verifyUser(userId, level) {
        const { data, error } = await supabase
            .from('users')
            .update({ verification_level: level })
            .eq('id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getDashboardStats() {
        const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
        const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: bookingsCount } = await supabase.from('photoshoot_bookings').select('*', { count: 'exact', head: true });

        return {
            totalUsers: usersCount,
            totalProfiles: profilesCount,
            totalBookings: bookingsCount
        };
    }
};

module.exports = adminDb;
