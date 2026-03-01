const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Profiles
 */
const profileDb = {
    async createProfile(profileData) {
        const { data, error } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getProfileByUsername(username) {
        // Need to join with users table to find by username
        const { data, error } = await supabase
            .from('profiles')
            .select('*, users!inner(username)')
            .eq('users.username', username)
            .single();
        if (error) throw error;
        return data;
    },

    async updateProfile(userId, updateData) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updateData)
            .eq('user_id', userId)
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async deleteProfile(userId) {
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('user_id', userId);
        if (error) throw error;
    },

    async getProfileByUserId(userId) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single();
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};

module.exports = profileDb;
