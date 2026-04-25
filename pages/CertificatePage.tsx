
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { Loader2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { VerifiedCertificate } from '../components/VerifiedCertificate';
import { supabase } from '../supabase';
import { User, UserRole, VerificationLevel } from '../types';


export const CertificatePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [profile, setProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const { data, error: fetchError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('user_id', id)
                    .single();

                if (fetchError) throw fetchError;

                if (data) {
                    // Map Supabase data to User type
                    const mappedUser: User = {
                        id: data.user_id,
                        username: data.username || 'user',
                        displayName: data.full_name || data.username,
                        role: (data.category as any) || UserRole.ARTIST,
                        avatarUrl: data.avatar_url,
                        coverUrl: data.cover_url || '',
                        location: data.location || 'India',
                        verificationLevel: data.is_verified ? VerificationLevel.VERIFIED : VerificationLevel.BASIC,
                        isVerified: data.is_verified || false,
                        isBoosted: false,
                        bio: data.bio || '',
                        followersCount: 0,
                        followingCount: 0,
                        trustScore: data.trust_score || 850
                    };
                    setProfile(mappedUser);
                } else {
                    setError("Identity node not found.");
                }
            } catch (err: any) {
                console.error("Error fetching certificate profile:", err);
                setError("Failed to fetch professional record.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-6">
                <Loader2 className="w-12 h-12 text-ffn-primary animate-spin" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Synchronizing Identity Node...</p>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-8 p-8 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                    <ShieldAlert className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-3xl font-serif italic text-ffn-black">Protocol Error.</h1>
                    <p className="text-gray-500 text-sm max-w-md">{error || "The requested professional record does not exist or has been decoupled from the graph."}</p>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="px-8 py-4 bg-ffn-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-xl"
                >
                    Return to Graph
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-20 px-4">
            <div className="max-w-4xl mx-auto space-y-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-3 text-gray-400 hover:text-ffn-black transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Back to Protocol</span>
                </button>

                <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <VerifiedCertificate
                        user={profile}
                        verificationDate={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        trustScore={profile.trustScore || 942}
                    />
                </div>

                <div className="text-center pt-8">
                    <p className="text-[9px] font-black uppercase tracking-[0.5em] text-gray-300">Verified by FFN Decentralized Identity Authority v4.5</p>
                </div>
            </div>
        </div>
    );
};
