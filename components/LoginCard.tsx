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

                // 1. Upload Avatar if selected
                let finalAvatarUrl = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80';
                if (avatarFile) {
                    const fileExt = avatarFile.name.split('.').pop();
                    const fileName = `${Math.random()}.${fileExt}`;
                    const filePath = `avatars/${fileName}`;

                    const { error: uploadError } = await supabase.storage
                        .from('avatars')
                        .upload(filePath, avatarFile);

                    if (uploadError) throw new Error("Failed to upload profile picture: " + uploadError.message);

                    const { data: { publicUrl } } = supabase.storage
                        .from('avatars')
                        .getPublicUrl(filePath);

                    finalAvatarUrl = publicUrl;
                }

                // 2. Register via Supabase natively
                const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { username, full_name: fullName, avatar_url: finalAvatarUrl }
                    }
                });
                if (signUpError) throw new Error(signUpError.message);
                if (!signUpData.user) throw new Error("Registration failed.");

                // 3. Create or update profile directly on Supabase
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

                // 4. Hand off to success callback
                onSuccess(signUpData.user);

            } else {
                // Handle Login (existing logic)
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (authError) throw new Error('Invalid email or password');

                if (data.user) {
                    // Check for profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('id')
                        .eq('user_id', data.user.id)
                        .single();

                    if (!profile) {
                        navigate('/create-profile');
                    } else {
                        onSuccess(data.user);
                    }
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
