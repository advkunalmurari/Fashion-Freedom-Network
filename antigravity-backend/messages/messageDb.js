const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Messaging
 */
const messageDb = {
    async sendMessage(messageData) {
        const { data, error } = await supabase
            .from('messages')
            .insert([messageData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getConversation(userId, otherUserId) {
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${userId},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${userId})`)
            .order('created_at', { ascending: true });
        if (error) throw error;
        return data;
    }
};

module.exports = messageDb;
