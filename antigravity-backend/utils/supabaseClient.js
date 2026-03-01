const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("⚠️ Missing SUPABASE_SERVICE_ROLE_KEY Configuration in .env. RLS bypass for auth creation will fail.");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});

function getScopedClient(accessToken) {
    return createClient(supabaseUrl, supabaseAnonKey, {
        global: {
            headers: { Authorization: `Bearer ${accessToken}` }
        },
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}

// Attach scoped client method to the admin client for default export backward compatibility
supabaseAdmin.getScopedClient = getScopedClient;

module.exports = supabaseAdmin;
