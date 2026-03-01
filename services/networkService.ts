
import { supabase } from '../supabase';
const API_URL = ;

export const networkService = {
    // --- FOLLOWS ---
    async getFollowStatus(targetUserId: string) {
        // We still use small read-only supabase check for speed, 
        // but we should eventually move this to profile resolving if needed.
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return false;

        const { count, error } = await supabase
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

            const response = await fetch(`${API_URL}/social/follow`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ following_id: targetUserId })
            });

            const res = await response.json();
            if (!res.success) throw new Error(res.message);

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

            const response = await fetch(`${API_URL}/social/unfollow`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({ following_id: targetUserId })
            });

            const res = await response.json();
            if (!res.success) throw new Error(res.message);

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
                pitch,
                created_at,
                sender:profiles!sender_id (id, full_name, avatar_url, role, location)
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
                pitch,
                status: 'pending'
            }]);

        if (error) return { success: false, error: error.message };
        return { success: true };
    },

    async respondToConnectionRequest(requestId: string, status: 'accepted' | 'declined') {
        const { error } = await supabase
            .from('connection_requests')
            .update({ status })
            .eq('id', requestId);

        if (error) return { success: false, error: error.message };
        return { success: true };
    },

    async getConnectionStatus(targetUserId: string) {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return 'none';

        const myId = session.user.id;

        // Check if already connected
        const { data: connected } = await supabase
            .from('connections')
            .select('*')
            .or(`and(user_id_1.eq.${myId},user_id_2.eq.${targetUserId}),and(user_id_1.eq.${targetUserId},user_id_2.eq.${myId})`)
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
