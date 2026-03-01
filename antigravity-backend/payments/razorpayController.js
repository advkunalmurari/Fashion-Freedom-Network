const Razorpay = require('razorpay');
const crypto = require('crypto');
const supabase = require('../utils/supabaseClient');

const razorpayController = {
    // Used to instantiate the Razorpay instance only when keys exist
    getInstance() {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Razorpay keys are not configured in .env');
        }
        return new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });
    },

    async createSubscription(req, res) {
        try {
            const { type } = req.body;
            const user = req.user; // From authMiddleware

            if (!user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            const rzp = razorpayController.getInstance();

            // 1. Map type to amount
            let amount = 0;
            if (type === 'PROFESSIONAL') amount = 39900; // 399 INR in paise
            else if (type === 'PREMIUM') amount = 349900; // 3499 INR in paise
            else return res.status(400).json({ success: false, message: 'Invalid subscription type' });

            // 2. Create Razorpay Order
            const options = {
                amount: amount,
                currency: 'INR',
                receipt: `receipt_${user.id}_${Date.now()}`,
                notes: {
                    userId: user.id,
                    subscriptionType: type
                }
            };

            const order = await rzp.orders.create(options);

            // 3. Return order details to client
            res.status(200).json({
                success: true,
                orderId: order.id,
                amount: order.amount,
                currency: order.currency
            });

        } catch (error) {
            console.error('Razorpay Create Order Error:', error);
            res.status(500).json({ success: false, message: error.message || 'Payment initiation failed' });
        }
    },

    async verifySubscription(req, res) {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, subscriptionType } = req.body;
            const user = req.user;

            if (!user) {
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }

            if (!process.env.RAZORPAY_KEY_SECRET) {
                throw new Error('Razorpay secret not configured');
            }

            // 1. Verify Signature
            const generated_signature = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(razorpay_order_id + '|' + razorpay_payment_id)
                .digest('hex');

            if (generated_signature !== razorpay_signature) {
                return res.status(400).json({ success: false, message: 'Invalid payment signature' });
            }

            // 2. Success! Update User's Profile to Premium in Database
            const isPremium = subscriptionType === 'PREMIUM' || subscriptionType === 'PROFESSIONAL';

            // Generate future date
            const expiresAt = new Date();
            if (subscriptionType === 'PREMIUM') {
                expiresAt.setFullYear(expiresAt.getFullYear() + 1); // 1 Year for 3499
            } else {
                expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 Month for 399
            }

            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    is_premium: isPremium,
                    subscription_tier: subscriptionType,
                    subscription_status: 'active',
                    subscription_expires_at: expiresAt.toISOString(),
                    premium_badge_color: 'reddish-pink',
                    search_rank_score: 9999 // Massive boost
                })
                .eq('user_id', user.id);

            if (updateError) {
                console.error('Profile Upgrade Error:', updateError);
                return res.status(500).json({ success: false, message: 'Payment verified but profile update failed.' });
            }

            // 3. Log transaction
            await supabase.from('transactions').insert([{
                user_id: user.id,
                amount: subscriptionType === 'PREMIUM' ? 3499.00 : 399.00,
                currency: 'INR',
                status: 'COMPLETED',
                payment_gateway: 'RAZORPAY',
                provider_payment_id: razorpay_payment_id,
                reference_id: razorpay_order_id,
                metadata: { type: subscriptionType }
            }]);

            res.status(200).json({ success: true, message: 'Premium Activation Successful!' });

        } catch (error) {
            console.error('Razorpay Verify Error:', error);
            res.status(500).json({ success: false, message: 'Payment verification failed' });
        }
    }
};

module.exports = razorpayController;
