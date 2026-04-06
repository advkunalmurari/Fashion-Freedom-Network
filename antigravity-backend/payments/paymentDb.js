const supabase = require('../utils/supabaseClient');

/**
 * Database Access Layer for Payments
 */
const paymentDb = {
    async logTransaction(transactionData) {
        const { data, error } = await supabase
            .from('transactions')
            .insert([transactionData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async updateSubscription(subscriptionData) {
        const { data, error } = await supabase
            .from('subscriptions')
            .upsert([subscriptionData])
            .select()
            .single();
        if (error) throw error;
        return data;
    },

    async getUserSubscriptions(userId) {
        const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId);
        if (error) throw error;
        return data;
    },

    async getUserTransactions(userId) {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    }
};

module.exports = paymentDb;
