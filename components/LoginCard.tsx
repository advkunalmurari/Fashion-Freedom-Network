import React, { useState, useRef } from 'react';
import { Mail, Lock, ArrowRight, User, Camera, Loader2, Image as ImageIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { LOGO_SVG } from '../constants';
import { authService } from '../services/authService';
import '../styles/login.css';

interface LoginCardProps {
    onSuccess: (user: any) => void;
}

const LoginCard: React.FC<LoginCardProps> = ({ onSuccess }) => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                // Handle Registration
                if (!fullName || !username) {
                    throw new Error("Full Name and Username are required for sign up.");
                }

                // 1. Upload Avatar if selected (non-blocking — falls back to default if storage fails)
                let finalAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80';
                if (avatarFile) {
                    try {
                        const fileExt = avatarFile.name.split('.').pop();
                        const fileName = `${Math.random()}.${fileExt}`;
                        const filePath = `avatars/${fileName}`;

                        const { error: uploadError } = await supabase.storage
                            .from('avatars')
                            .upload(filePath, avatarFile);

                        if (!uploadError) {
                            const { data: { publicUrl } } = supabase.storage
                                .from('avatars')
                                .getPublicUrl(filePath);
                            finalAvatarUrl = publicUrl;
                        } else {
                            console.warn('Avatar upload failed, using default:', uploadError.message);
                        }
                    } catch (uploadErr) {
                        console.warn('Avatar upload error, using default avatar:', uploadErr);
                        // Continue with default avatar — don't block registration
                    }
                }

                // 2. Register via Supabase
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username, full_name: fullName, avatar_url: finalAvatarUrl }
                    }
                });
                if (signUpError) {
                    if (signUpError.message.toLowerCase().includes('already registered') || signUpError.message.toLowerCase().includes('user already')) {
                        throw new Error('An account with this email already exists. Please switch to Login instead.');
                    }
                    throw new Error(signUpError.message);
                }
                if (!signUpData.user) throw new Error('Registration failed. Please try again.');

                // Detect duplicate email (Supabase returns empty identities when email is already taken)
                if (signUpData.user.identities && signUpData.user.identities.length === 0) {
                    throw new Error('An account with this email already exists. Please switch to Login instead.');
                }

                // 3. Create profile
                await supabase.from('profiles').upsert({
                    user_id: signUpData.user.id,
                    username,
                    full_name: fullName,
                    email,
                    avatar_url: finalAvatarUrl,
                    category: 'Standard',
                    is_professional: false,
                    is_premium: false
                }, { onConflict: 'user_id' });

                // 4. Try to sign in immediately (works if email confirmation is disabled in Supabase)
                const { data: signInData } = await supabase.auth.signInWithPassword({ email, password });
                if (signInData?.user) {
                    onSuccess(signInData.user);
                } else {
                    // Email confirmation is enabled — show a clear message
                    setError(null);
                    setLoading(false);
                    alert(`✅ Account created! Please check your inbox (${email}) and verify your email before logging in.`);
                    return;
                }

            } else {
                // Handle Login
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) {
                    // Provide specific, user-friendly error messages
                    if (authError.message.toLowerCase().includes('email not confirmed')) {
                        throw new Error('Please verify your email address before logging in. Check your inbox for a confirmation link.');
                    }
                    if (authError.message.toLowerCase().includes('invalid login credentials')) {
                        throw new Error('Incorrect email or password. Please try again.');
                    }
                    throw new Error(authError.message);
                }

                if (data.user) {
                    // Use maybeSingle() to safely return null when no profile exists
                    // (single() throws an error if no row is found)
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('user_id', data.user.id)
                        .maybeSingle();

                    if (profileError) {
                        console.error('Profile fetch error:', profileError);
                    }

                    if (!profile) {
                        // Auto-create a basic profile so the user isn't locked out
                        // This handles users who registered via social login or where the profile row was not created
                        const { error: upsertError } = await supabase.from('profiles').upsert({
                            user_id: data.user.id,
                            username: data.user.user_metadata?.username || email.split('@')[0],
                            full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
                            email: data.user.email,
                            avatar_url: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80',
                            category: 'Standard',
                            is_professional: false,
                            is_premium: false
                        }, { onConflict: 'user_id' });

                        if (upsertError) {
                            console.error('Could not auto-create profile:', upsertError);
                        }
                    }

                    // Always proceed to app — profile will be created/loaded on next page
                    onSuccess(data.user);
                }
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-card fade-in stagger-3">
            <div className="text-center mb-8">
                <div className="w-16 h-16 mx-auto mb-6 text-white drop-shadow-xl flex items-center justify-center">
                    {LOGO_SVG}
                </div>
                <h2 className="text-white/40 text-[11px] uppercase tracking-[0.4em] font-semibold mb-2">Fashion Freedom Network</h2>
                <p className="text-white/20 text-xs font-light">
                    {isSignUp ? "Create your identity to access the hub" : "Enter your credentials to access the hub"}
                </p>
            </div>

            <div className="flex bg-white/5 rounded-2xl p-1 mb-6">
                <button
                    type="button"
                    onClick={() => setIsSignUp(false)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${!isSignUp ? 'bg-white text-ffn-black shadow-lg' : 'text-white/50 hover:text-white/80'}`}
                >
                    Login
                </button>
                <button
                    type="button"
                    onClick={() => setIsSignUp(true)}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isSignUp ? 'bg-white text-ffn-black shadow-lg' : 'text-white/50 hover:text-white/80'}`}
                >
                    Sign Up
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {isSignUp && (
                    <div className="flex flex-col items-center mb-6 space-y-3">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            accept="image/*"
                            className="hidden"
                        />
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="w-24 h-24 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer overflow-hidden group relative hover:border-white/50 transition-all bg-white/5"
                        >
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover group-hover:opacity-50 transition-opacity" />
                            ) : (
                                <Camera className="w-8 h-8 text-white/30 group-hover:text-white/60 transition-colors" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-5 h-5 text-white" />
                            </div>
                        </div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50">Profile Picture</span>
                    </div>
                )}

                <div className="space-y-4">
                    {isSignUp && (
                        <>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 ml-1">Full Legal Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
                                    <input
                                        type="text"
                                        placeholder="e.g. Elena Rossi"
                                        className="input-field pl-12"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2 text-left">
                                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 ml-1">Username</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors font-bold text-lg">@</span>
                                    <input
                                        type="text"
                                        placeholder="username"
                                        className="input-field pl-12"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required={isSignUp}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                className="input-field pl-12"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <div className="flex justify-between items-center ml-1">
                            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50">Password</label>
                            <Link
                                to="/forgot-password"
                                className="text-[10px] text-white/30 hover:text-white transition-colors cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    navigate('/forgot-password');
                                }}
                            >
                                Forgot?
                            </Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
                            <input
                                type="password"
                                placeholder="••••••••••••"
                                className="input-field pl-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </div>

                {error && (
                    <p className="text-red-400 text-[11px] text-center font-medium bg-red-400/10 py-2 rounded-lg">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="login-btn-primary"
                >
                    {loading ? 'Verifying...' : 'Log In'}
                    <ArrowRight size={18} />
                </button>
            </form>

            <div className="relative flex items-center gap-4 py-8">
                <div className="flex-1 h-[1px] bg-white/5" />
                <span className="text-white/10 text-[9px] uppercase tracking-[0.3em]">OR</span>
                <div className="flex-1 h-[1px] bg-white/5" />
            </div>

            <button
                onClick={() => navigate('/register-professional')}
                className="w-full h-[3.5rem] bg-white/5 hover:bg-white/10 text-white/60 rounded-12 border border-white/10 text-sm font-medium transition-all"
                style={{ borderRadius: '12px' }}
            >
                Create Professional Profile
            </button>
        </div>
    );
};

export default LoginCard;
