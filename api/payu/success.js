import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

const FRONTEND_URL = 'https://fashion-freedom-network-ffn.vercel.app';
const PAYU_MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || 'Ti9upR';
const PAYU_MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || 'DcmyOWQcTXApY8aOT0RBKJgLxJvOQ6DJ';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

function verifyReverseHash(params) {
    const {
        key, txnid, amount, productinfo, firstname, email,
        udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '',
        status, hash: receivedHash
    } = params;
    const hashString = `${PAYU_MERCHANT_SALT}|${status}|${udf5}|${udf4}|${udf3}|${udf2}|${udf1}|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${key}`;
    return createHash('sha512').update(hashString).digest('hex') === receivedHash;
}

function parseFormBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            const params = {};
            new URLSearchParams(body).forEach((v, k) => { params[k] = v; });
            resolve(params);
        });
    });
}

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

    const params = await parseFormBody(req);
    const { txnid, mihpayid, amount, productinfo } = params;

    try {
        if (!verifyReverseHash(params)) {
            console.error('PayU hash mismatch for txnid:', txnid);
            return res.redirect(302, `${FRONTEND_URL}/payment-failure?txnid=${txnid}&reason=hash_mismatch`);
        }

        const { data: txn } = await supabase
            .from('transactions')
            .update({ status: 'successful', payu_mihpayid: mihpayid, updated_at: new Date().toISOString() })
            .eq('txnid', txnid)
            .select('user_id')
            .single();

        const userId = txn?.user_id;
        if (userId && productinfo) {
            const info = productinfo.toLowerCase();
            const isAnnual = info.includes('premium') && (info.includes('annual') || info.includes('yearly'));
            const isMonthly = info.includes('professional') || info.includes('monthly');

            if (isAnnual || isMonthly) {
                const expiresAt = new Date();
                isAnnual ? expiresAt.setFullYear(expiresAt.getFullYear() + 1) : expiresAt.setMonth(expiresAt.getMonth() + 1);
                await supabase.from('profiles').update({
                    is_premium: true,
                    subscription_tier: isAnnual ? 'PREMIUM' : 'PROFESSIONAL',
                    subscription_status: 'active',
                    subscription_expires_at: expiresAt.toISOString(),
                    premium_badge_color: 'reddish-pink',
                    search_rank_score: 9999
                }).eq('user_id', userId);
            }
        }

        return res.redirect(302, `${FRONTEND_URL}/payment-success?txnid=${txnid}&mihpayid=${mihpayid}&amount=${amount}`);

    } catch (err) {
        console.error('PayU success handler error:', err);
        return res.redirect(302, `${FRONTEND_URL}/payment-failure?txnid=${txnid}&reason=server_error`);
    }
}
