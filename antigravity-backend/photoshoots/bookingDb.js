const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Photoshoot Bookings
 */
const bookingDb = {
    async createBooking(bookingData) {
        const { data, error } = await supabase
            .from('photoshoot_bookings')
            .insert([bookingData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getUserBookings(userId) {
        const { data, error } = await supabase
            .from('photoshoot_bookings')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }
};

module.exports = bookingDb;
