
const API_URL = 'http://localhost:5001/api';

/**
 * PayPal Service for FFN
 * Handles communication with the backend for order verification and payment status.
 */
export const paypalService = {
    /**
     * Create an order on the backend
     */
    async createOrder(amount: string, currency: string = "USD") {
        const response = await fetch(`${API_URL}/payments/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ffn_session')}`
            },
            body: JSON.stringify({ amount, currency })
        });
        const data = await response.json();
        return data.order.id;
    },

    /**
     * Capture payment on the backend
     */
    async verifyPayment(orderId: string) {
        const response = await fetch(`${API_URL}/payments/capture-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ffn_session')}`
            },
            body: JSON.stringify({ orderId })
        });
        return response.json();
    },

    /**
     * Verify subscription on the backend
     */
    async verifySubscription(planId: string, paymentId: string) {
        const response = await fetch(`${API_URL}/payments/verify-subscription`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('ffn_session')}`
            },
            body: JSON.stringify({ planId, paymentId })
        });
        return response.json();
    }
};
