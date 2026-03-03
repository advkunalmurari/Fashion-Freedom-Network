/**
 * useProfile hook — loads the current user's profile from Supabase `profiles` table.
 * Also updates the profile and uploads avatar.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { profileDb } from '../services/dbService';

export interface ProfileData {
    id?: string;
    user_id: string;
    username: string;
    full_name: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    location?: string;
    category?: string;
    is_professional?: boolean;
    is_premium?: boolean;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    linkedin?: string;
    website?: string;
    rate?: number;
    rate_unit?: string;
    availability_status?: 'available' | 'busy' | 'on-set' | 'traveling';
    skills?: string[];
    created_at?: string;
}

export function useProfile() {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [authUser, setAuthUser] = useState<any>(null);

    const loadProfile = useCallback(async (user: any) => {
        if (!user) { setLoading(false); return; }
        setLoading(true);
        setError(null);

        const { data, error: dbError } = await profileDb.getMyProfile(user.id);

        if (dbError) {
            setError(dbError.message);
        } else if (data) {
            setProfile(data as ProfileData);
        } else {
            // Profile doesn't exist yet — create a minimal one
            const fallbackProfile: ProfileData = {
                user_id: user.id,
                username: user.user_metadata?.username || user.email?.split('@')[0] || 'user',
                full_name: user.user_metadata?.full_name || '',
                email: user.email || '',
                avatar_url: user.user_metadata?.avatar_url || '',
                category: 'Standard',
                is_professional: false,
                is_premium: false,
            };
            const { data: created } = await profileDb.upsertProfile(fallbackProfile);
            setProfile((created as ProfileData) || fallbackProfile);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setAuthUser(session.user);
                loadProfile(session.user);
            } else {
                setLoading(false);
            }
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            const user = session?.user || null;
            setAuthUser(user);
            if (user) loadProfile(user);
            else { setProfile(null); setLoading(false); }
        });

        return () => subscription.unsubscribe();
    }, [loadProfile]);

    const updateProfile = async (updates: Partial<ProfileData>) => {
        if (!authUser) return { error: 'Not authenticated' };
        setSaving(true);
        const { data, error: dbError } = await profileDb.updateProfile(authUser.id, updates);
        if (!dbError && data) {
            setProfile(prev => prev ? { ...prev, ...data } : (data as ProfileData));
        }
        setSaving(false);
        return { error: dbError?.message };
    };

    const uploadAvatar = async (file: File): Promise<string | null> => {
        if (!authUser) return null;
        setSaving(true);
        try {
            const ext = file.name.split('.').pop();
            const path = `avatars/${authUser.id}.${ext}`;
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(path, file, { upsert: true });

            if (uploadError) {
                console.warn('Avatar upload failed:', uploadError.message);
                return null;
            }

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
            await updateProfile({ avatar_url: publicUrl });
            return publicUrl;
        } catch (e) {
            console.warn('Avatar upload exception:', e);
            return null;
        } finally {
            setSaving(false);
        }
    };

    return { profile, authUser, loading, saving, error, updateProfile, uploadAvatar, refetch: () => authUser && loadProfile(authUser) };
}
