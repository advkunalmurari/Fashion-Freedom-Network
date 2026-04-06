import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { crypto } from "https://deno.land/std@0.177.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { txnid, amount, productinfo, firstname, email } = body;

    if (!txnid || !amount || !productinfo || !firstname || !email) {
       return new Response(
         JSON.stringify({ error: 'Missing required parameters' }),
         { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
       );
    }

    // You should set these securely in Supabase dashboard under Edge Functions secrets
    const PAYU_MERCHANT_KEY = Deno.env.get('PAYU_MERCHANT_KEY') || 'Ti9upR';
    const PAYU_MERCHANT_SALT = Deno.env.get('PAYU_MERCHANT_SALT') || 'DcmyOWQcTXApY8aOT0RBKJgLxJvOQ6DJ';

    // The mandatory PayU hash string format:
    // sha512(key|txnid|amount|productinfo|firstname|email|||||||||||salt)
    const hashString = `${PAYU_MERCHANT_KEY}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${PAYU_MERCHANT_SALT}`;

    // Generate SHA-512 Hash natively using Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(hashString);
    const hashBuffer = await crypto.subtle.digest('SHA-512', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Convert to hex string
    const hash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return new Response(
      JSON.stringify({ hash, key: PAYU_MERCHANT_KEY }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
