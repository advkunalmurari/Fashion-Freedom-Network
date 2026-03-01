const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Casting Calls
 */
const castingDb = {
    async createCall(callData) {
        const { data, error } = await supabase
            .from('casting_calls')
            .insert([callData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getAllCalls() {
        const { data, error } = await supabase
            .from('casting_calls')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async applyToCall(applicationData) {
        const { data, error } = await supabase
            .from('casting_call_applications')
            .insert([applicationData])
            .select()
            .single();
        if (error) throw error;
        return data;
    }
};

module.exports = castingDb;
