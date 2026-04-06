const crypto = require('crypto');
const supabase = require('../utils/supabaseClient');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Verify PayU reverse hash on callback.
 * PayU reverse hash format:
 * sha512(salt|status|||||||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
function verifyReverseHash(params) {
    const salt = process.env.PAYU_MERCHANT_SALT;
    if (!salt) throw new Error('PAYU_MERCHANT_SALT not configured');

    const {
        key, txnid, amount, productinfo, firstname, email,
        udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '',
        status, hash: receivedHash
    } = params;

    const hashString = `${salt}|${status}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    const expectedHash = crypto.createHash('sha512').update(hashString).digest('hex');
    return expectedHash === receivedHash;
}

const payuController = {
    /**
     * PayU POSTs here on successful payment (surl).
     * Verifies hash, updates transaction, upgrades profile if it's a subscription.
     */
    async handleSuccess(req, res) {
        const params = req.body;
        const { txnid, mihpayid, status, amount, productinfo, firstname, email } = params;

        try {
            // 1. Verify reverse hash to ensure the callback is genuinely from PayU
            const isValid = verifyReverseHash(params);
            if (!isValid) {
                console.error('PayU hash verification failed for txnid:', txnid);
                return res.redirect(`${FRONTEND_URL}/payment-failure?txnid=${txnid}&reason=hash_mismatch`);
            }

            // 2. Update transaction status to successful
            const { data: txn, error: txnError } = await supabase
                .from('transactions')
                .update({
                    status: 'successful',
                    payu_mihpayid: mihpayid,
                    updated_at: new Date().toISOString()
                })
                .eq('txnid', txnid)
                .select('user_id')
                .single();

            if (txnError) {
                console.error('Transaction update error:', txnError);
                // Still redirect to success — payment went through, we just had a DB issue
            }

            // 3. If this is a subscription payment, upgrade the user's profile
            const userId = txn?.user_id;
            if (userId && productinfo) {
                const isPremiumAnnual = productinfo.toLowerCase().includes('premium') && productinfo.toLowerCase().includes('annual');
                const isPremiumMonthly = productinfo.toLowerCase().includes('professional') || productinfo.toLowerCase().includes('monthly');

                if (isPremiumAnnual || isPremiumMonthly) {
                    const expiresAt = new Date();
                    if (isPremiumAnnual) {
                        expiresAt.setFullYear(expiresAt.getFullYear() + 1);
                    } else {
                        expiresAt.setMonth(expiresAt.getMonth() + 1);
                    }

                    const { error: profileError } = await supabase
                        .from('profiles')
                        .update({
                            is_premium: true,
                            subscription_tier: isPremiumAnnual ? 'PREMIUM' : 'PROFESSIONAL',
                            subscription_status: 'active',
                            subscription_expires_at: expiresAt.toISOString(),
                            premium_badge_color: 'reddish-pink',
                            search_rank_score: 9999
                        })
                        .eq('user_id', userId);

                    if (profileError) {
                        console.error('Profile upgrade error:', profileError);
                    }
                }
            }

            return res.redirect(`${FRONTEND_URL}/payment-success?txnid=${txnid}&mihpayid=${mihpayid}&amount=${amount}`);

        } catch (err) {
            console.error('PayU success handler error:', err);
            return res.redirect(`${FRONTEND_URL}/payment-failure?txnid=${txnid}&reason=server_error`);
        }
    },

    /**
     * PayU POSTs here on failed or cancelled payment (furl).
     */
    async handleFailure(req, res) {
        const { txnid, error_Message, status } = req.body;

        try {
            await supabase
                .from('transactions')
                .update({
                    status: status === 'userCancelled' ? 'cancelled' : 'failed',
                    error_message: error_Message || status,
                    updated_at: new Date().toISOString()
                })
                .eq('txnid', txnid);

        } catch (err) {
            console.error('PayU failure handler DB update error:', err);
        }

        return res.redirect(`${FRONTEND_URL}/payment-failure?txnid=${txnid}&reason=${status || 'failed'}`);
    }
};

module.exports = payuController;
