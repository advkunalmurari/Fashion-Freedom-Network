
const paypal = require('@paypal/checkout-server-sdk');
const paymentDb = require('./paymentDb');
require('dotenv').config();

// Configure PayPal Environment
const environment = process.env.PAYPAL_MODE === 'live' || process.env.NODE_ENV === 'production'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
const client = new paypal.core.PayPalHttpClient(environment);

/**
 * Payment Service for FFN
 */
const paymentService = {
    /**
     * Create a PayPal Order
     */
    async createOrder(amount, currency = 'USD') {
        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: currency,
                    value: amount
                }
            }]
        });

        const order = await client.execute(request);
        return order.result;
    },

    /**
     * Capture a PayPal Order and log transaction
     */
    async captureOrder(orderId, userId) {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const capture = await client.execute(request);
        const result = capture.result;

        if (result.status === 'COMPLETED') {
            await paymentDb.logTransaction({
                user_id: userId,
                amount: result.purchase_units[0].payments.captures[0].amount.value,
                payment_provider: 'PAYPAL',
                payment_status: 'PAID'
            });
        }

        return result;
    },

    /**
     * Handle Subscription Success and Upgrade Profile
     */
    async handleSubscription(userId, planId, paymentId) {
        // 1. Capture the PayPal Order to confirm payment
        const request = new paypal.orders.OrdersCaptureRequest(paymentId);
        request.requestBody({});

        let capture;
        try {
            capture = await client.execute(request);
        } catch (e) {
            console.error('PayPal Capture Error in Subscriptions:', e);
            throw new Error('Payment capture failed. Transaction invalid.');
        }

        const result = capture.result;
        if (result.status !== 'COMPLETED') {
            throw new Error('Payment not completed.');
        }

        const supabase = require('../utils/supabaseClient');

        // 2. Determine Scope
        const isPremium = planId === 'PREMIUM' || planId === 'PROFESSIONAL';
        const expiresAt = new Date();
        if (planId === 'PREMIUM') {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 Year
        } else {
            expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 Month
        }

        // 3. Upgrade the Profile
        const { error: updateError } = await supabase
            .from('profiles')
            .update({
                is_premium: isPremium,
                subscription_tier: planId,
                subscription_status: 'active',
                subscription_expires_at: expiresAt.toISOString(),
                premium_badge_color: 'reddish-pink',
                search_rank_score: 9999 // Massive boost
            })
            .eq('user_id', userId);

        if (updateError) {
            console.error('Profile Upgrade Error:', updateError);
            throw new Error('Payment successful but profile upgrade failed.');
        }

        // 4. Log the transaction
        await supabase.from('transactions').insert([{
            user_id: userId,
            amount: result.purchase_units[0].payments.captures[0].amount.value,
            currency: result.purchase_units[0].payments.captures[0].amount.currency_code,
            status: 'COMPLETED',
            payment_gateway: 'PAYPAL',
            provider_payment_id: result.purchase_units[0].payments.captures[0].id,
            reference_id: paymentId,
            metadata: { type: planId }
        }]);

        return { success: true, message: 'Profile Upgraded to Premium!' };
    }
};

module.exports = paymentService;
