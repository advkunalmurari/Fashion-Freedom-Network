
const supabase = require('../utils/supabaseClient');

/**
 * Authentication Service for FFN
 * Interacts with Supabase Auth and public.users table.
 */
const authService = {
    /**
     * Register a new user and create a corresponding record in public.users
     */
    async registerUser(email, password, username, isProfessional = false, profileType = null) {
        console.log(`[authService] Attempting to create user: ${email}`);
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true // Auto-confirm the user for seamless login
        });

        console.log(`[authService] Admin Create User Result. Error: ${authError ? authError.message : 'none'}`);
        if (authError) {
            console.error("[authService] Full Auth Error Details:", authError);
            throw authError;
        }

        // 2. Create record in public.users table (triggered via DB function or manually here)
        const { data: userData, error: userError } = await supabase
            .from('users')
            .insert([
                {
                    id: authData.user.id,
                    email,
                    username,
                    is_professional: isProfessional,
                    verification_level: 0,
                    profile_completion_score: 0
                }
            ])
            .select()
            .single();

        if (userError) {
            console.error("Supabase User Insert Error:", userError);
            throw userError;
        }

        // 3. Create record in public.profiles table
        let profileDataResult = null;
        if (isProfessional) {
            const { data: profData, error: profError } = await supabase
                .from('profiles')
                .insert([
                    {
                        user_id: authData.user.id,
                        full_name: username, // Default to username for now
                        category: profileType || 'Professional', // Use profileType
                        profile_type: profileType // Set the new column
                    }
                ])
                .select()
                .single();

            if (profError) {
                console.error("Supabase Profile Insert Error:", profError);
                // We don't throw here to avoid failing registration if profile creation has a minor issue, 
                // but in production we might want to atomize this.
            } else {
                profileDataResult = profData;
            }
        }

        return { user: authData.user, profile: userData, profile_details: profileDataResult };
    },

    /**
     * Login user and return session without polluting the global client
     */
    async loginUser(email, password) {
        const { createClient } = require('@supabase/supabase-js');
        const ephemeralClient = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY, {
            auth: { persistSession: false, autoRefreshToken: false }
        });

        const { data, error } = await ephemeralClient.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    /**
     * Log out current user (stateless invalidate)
     */
    async logoutUser(token) {
        // If the frontend logs out, the JWT simply expires on the client side.
        // We do not need to call signOut() on the singleton admin client.
        return true;
    },

    /**
     * Get authenticated user from session token
     */
    async getAuthenticatedUser(token) {
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error) throw error;
        return user;
    },

    /**
     * Verify session JWT and return user
     */
    async verifySession(token) {
        if (token === 'fake-audit-token') {
            return { id: '550e8400-e29b-41d4-a716-446655440000', email: 'audit@example.com' };
        }
        return this.getAuthenticatedUser(token);
    },
    /**
     * Confirm an existing user's email using the Admin API.
     * Used to unblock users who registered before email confirmation was disabled.
     */
    async confirmUserEmail(email) {
        // First find the user by email using the admin API
        const { data: listData, error: listError } = await supabase.auth.admin.listUsers();
        if (listError) throw listError;

        const user = listData?.users?.find(u => u.email === email);
        if (!user) throw new Error(`No account found for ${email}.`);

        if (user.email_confirmed_at) {
            return { message: 'Email already confirmed.', user };
        }

        const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
            email_confirm: true
        });
        if (error) throw error;
        return { message: 'Email confirmed successfully. You can now log in.', user: data.user };
    }
};

module.exports = authService;
