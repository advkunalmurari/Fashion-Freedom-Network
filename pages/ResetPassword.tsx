import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { LOGO_SVG } from '../constants';
import AnimatedBackground from '../components/AnimatedBackground';
import '../styles/login.css';

const ResetPasswordPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sessionReady, setSessionReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Supabase puts the session tokens in the URL hash (#access_token=...&type=recovery)
        // The Supabase client automatically parses this and fires onAuthStateChange
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'PASSWORD_RECOVERY') {
                // Session is valid — allow the form to show
                setSessionReady(true);
            } else if (event === 'SIGNED_IN' && session) {
                setSessionReady(true);
            }
        });

        // Also check for existing session (in case of page reload)
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) setSessionReady(true);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const { error: updateError } = await supabase.auth.updateUser({ password });
            if (updateError) throw updateError;
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setError(err.message || 'Failed to reset password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] w-full relative z-[100] flex overflow-x-hidden overflow-y-auto font-sans">
            <AnimatedBackground />

            <div className="login-split-layout">
                {/* Left Panel */}
                <div className="left-panel">
                    <div className="max-w-xl space-y-12 w-full text-left pl-12 lg:pl-24">
                        <div className="space-y-6">
                            <m.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="w-16 h-16 text-white mb-6 drop-shadow-2xl"
                            >
                                {LOGO_SVG}
                            </m.div>
                            <m.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-5xl lg:text-7xl font-bold tracking-tight text-white font-serif max-w-2xl leading-[1.1]"
                            >
                                New Password
                            </m.h1>
                            <m.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-xl lg:text-2xl text-white/60 font-light"
                            >
                                Secure your Fashion Freedom Network identity.
                            </m.p>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="right-panel">
                    <m.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md p-10 lg:p-14 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-3xl text-center space-y-10"
                    >
                        {success ? (
                            <div className="space-y-8 py-10">
                                <m.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <CheckCircle2 className="text-emerald-400" size={40} />
                                </m.div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-serif italic text-white">Password Updated!</h2>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        Your password has been reset successfully. Redirecting you to login...
                                    </p>
                                </div>
                            </div>
                        ) : !sessionReady ? (
                            <div className="space-y-8 py-10">
                                <div className="w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto">
                                    <AlertCircle className="text-yellow-400" size={40} />
                                </div>
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-serif italic text-white">Verifying Link...</h2>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        Please wait while we verify your reset link. If this takes too long, the link may have expired — please request a new one.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/forgot-password')}
                                    className="login-btn-primary"
                                >
                                    Request New Link <ArrowRight size={18} />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-serif italic text-white">Set New Password</h2>
                                    <p className="text-white/40 text-xs tracking-widest uppercase">Identity Encryption Update</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 ml-1">New Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
                                            <input
                                                type="password"
                                                placeholder="••••••••••••"
                                                className="input-field pl-12"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                minLength={6}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/50 ml-1">Confirm Password</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={18} />
                                            <input
                                                type="password"
                                                placeholder="••••••••••••"
                                                className="input-field pl-12"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                required
                                            />
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
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
                                        <ArrowRight size={18} />
                                    </button>
                                </form>
                            </>
                        )}
                    </m.div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
