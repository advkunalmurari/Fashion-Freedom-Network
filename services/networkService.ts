import { supabase } from '../supabase';

export const networkService = {
    // --- FOLLOWS ---
    async getFollowStatus(targetUserId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { count } = await supabase
            .from('follows')
            .select('*', { count: 'exact', head: true })
            .eq('follower_id', session.user.id)
            .eq('following_id', targetUserId);

        return count ? count > 0 : false;
    },

    async followUser(targetUserId: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const { error } = await supabase
                .from('follows')
                .insert({
                    follower_id: session.user.id,
                    following_id: targetUserId
                });

            if (error) {
                // If it's a unique constraint violation, they already follow
                if (error.code !== '23505') throw error;
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error following user:', error);
            return { success: false, error: error.message };
        }
    },

    async unfollowUser(targetUserId: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            const { error } = await supabase
                .from('follows')
                .delete()
                .eq('follower_id', session.user.id)
                .eq('following_id', targetUserId);

            if (error) throw error;

            return { success: true };
        } catch (error: any) {
            console.error('Error unfollowing user:', error);
            return { success: false, error: error.message };
        }
    },

    // --- CONNECTION REQUESTS ---
    async getConnectionRequests() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { success: false, data: [] };

        const { data, error } = await supabase
            .from('connection_requests')
            .select(`
                id,
                status,
                created_at,
                sender:profiles!sender_id (id, full_name, avatar_url, category, location)
            `)
            .eq('receiver_id', session.user.id)
            .eq('status', 'pending');

        if (error) return { success: false, error: error.message };
        return { success: true, data };
    },

    async sendConnectionRequest(targetUserId: string, pitch?: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return { success: false, error: 'Unauthorized' };

        const { error } = await supabase
            .from('connection_requests')
            .insert([{
                sender_id: session.user.id,
                receiver_id: targetUserId,
                status: 'pending'
            }]);

        if (error) {
            if (error.code !== '23505') return { success: false, error: error.message };
        }
        return { success: true };
    },

    async respondToConnectionRequest(requestId: string, status: 'accepted' | 'declined') {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };

            // Start by getting the request to know who sent it
            const { data: request, error: fetchError } = await supabase
                .from('connection_requests')
                .select('sender_id, receiver_id')
                .eq('id', requestId)
                .single();

            if (fetchError) throw fetchError;

            // Only the receiver can accept/decline
            if (request.receiver_id !== session.user.id) {
                throw new Error("Unauthorized to respond to this request");
            }

            const { error: updateError } = await supabase
                .from('connection_requests')
                .update({ status })
                .eq('id', requestId);

            if (updateError) throw updateError;

            // If accepted, add to connections table
            if (status === 'accepted') {
                const { error: insertError } = await supabase
                    .from('connections')
                    .insert({
                        user1_id: request.sender_id,
                        user2_id: request.receiver_id
                    });
                
                // Ignore unique constraint errors
                if (insertError && insertError.code !== '23505') {
                    throw insertError;
                }
            }

            return { success: true };
        } catch (error: any) {
            console.error('Error responding to request:', error);
            return { success: false, error: error.message };
        }
    },

    async getConnectionStatus(targetUserId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return 'none';

        const myId = session.user.id;

        // Check if already connected
        const { data: connected } = await supabase
            .from('connections')
            .select('*')
            .or(`and(user1_id.eq.${myId},user2_id.eq.${targetUserId}),and(user1_id.eq.${targetUserId},user2_id.eq.${myId})`)
            .maybeSingle();

        if (connected) return 'connected';

        // Check for pending request
        const { data: request } = await supabase
            .from('connection_requests')
            .select('status, sender_id')
            .or(`and(sender_id.eq.${myId},receiver_id.eq.${targetUserId}),and(sender_id.eq.${targetUserId},receiver_id.eq.${myId})`)
            .eq('status', 'pending')
            .maybeSingle();

        if (request) {
            return request.sender_id === myId ? 'pending_sent' : 'pending_received';
        }

        return 'none';
    }
};
