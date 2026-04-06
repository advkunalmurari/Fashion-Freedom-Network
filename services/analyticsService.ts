
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Analytics Service for FFN
 * Handles profile view tracking and metric retrieval.
 */
export const analyticsService = {
    /**
     * Track a profile view
     */
    async trackView(profileUserId: string) {
        try {
            const response = await fetch(`${API_URL}/analytics/track-view`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('ffn_session')}`
                },
                body: JSON.stringify({ profileUserId })
            });
            return await response.json();
        } catch (error) {
            console.error('Track View Error:', error);
            return { success: false };
        }
    },

    /**
     * Get statistics for the current authenticated user
     */
    async getMyStats() {
        try {
            const response = await fetch(`${API_URL}/analytics/my-stats`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('ffn_session')}`
                }
            });
            return await response.json();
        } catch (error) {
            console.error('Get My Stats Error:', error);
            return { success: false, data: { views: 0 } };
        }
    }
};
