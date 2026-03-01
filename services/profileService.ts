
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const profileService = {
    async getProfile(username: string) {
        const response = await fetch(`${API_URL}/profiles/${username}`);
        return response.json();
    },

    async updateProfile(profileData: any) {
        const response = await fetch(`${API_URL}/profiles/update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ffn_session')}`
            },
            body: JSON.stringify(profileData)
        });
        return response.json();
    },

    async trackView(profileUserId: string, viewerId?: string) {
        const response = await fetch(`${API_URL}/analytics/track-view`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ profileUserId, viewerId })
        });
        return response.json();
    }
};
