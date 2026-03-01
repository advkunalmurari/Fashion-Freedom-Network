
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Frontend Auth Service for FFN
 * Interacts with the Antigravity backend.
 */
export const authService = {
    async register(email, password, username, isProfessional = false, profileType = null) {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, username, isProfessional, profileType })
        });
        return response.json();
    },

    async login(email, password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('ffn_session', data.data.session.access_token);
        }
        return data;
    },

    async getSession() {
        return localStorage.getItem('ffn_session');
    },

    async logout() {
        localStorage.removeItem('ffn_session');
        const response = await fetch(`${API_URL}/auth/logout`, { method: 'POST' });
        return response.json();
    }
};
