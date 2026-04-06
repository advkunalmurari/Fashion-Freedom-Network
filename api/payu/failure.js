import { createClient } from '@supabase/supabase-js';

const FRONTEND_URL = 'https://fashion-freedom-network-ffn.vercel.app';

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

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
    const { txnid, error_Message, status } = params;

    try {
        await supabase.from('transactions').update({
            status: status === 'userCancelled' ? 'cancelled' : 'failed',
            error_message: error_Message || status,
            updated_at: new Date().toISOString()
        }).eq('txnid', txnid);
    } catch (err) {
        console.error('PayU failure handler DB update error:', err);
    }

    return res.redirect(302, `${FRONTEND_URL}/payment-failure?txnid=${txnid}&reason=${status || 'failed'}`);
}
