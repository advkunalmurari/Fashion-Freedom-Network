import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabase';
import { LOGO_SVG } from '../constants';
import AnimatedBackground from '../components/AnimatedBackground';
import '../styles/login.css';

const ForgotPasswordPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });
            if (resetError) throw resetError;
            setSubmitted(true);
        } catch (err: any) {
            setError(err.message || 'An error occurred. Please try again.');
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
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="w-16 h-16 text-white mb-6 drop-shadow-2xl"
                            >
                                {LOGO_SVG}
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                                className="text-5xl lg:text-7xl font-bold tracking-tight text-white font-serif max-w-2xl leading-[1.1]"
                            >
                                Secure Your Narrative
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-xl lg:text-2xl text-white/60 font-light"
                            >
                                Recover your professional access to the FFN global graph.
                            </motion.p>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="right-panel">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-md p-10 lg:p-14 rounded-[3.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-3xl text-center space-y-10"
                    >
                        {!submitted ? (
                            <>
                                <div className="space-y-3">
                                    <h2 className="text-3xl font-serif italic text-white">Forgot Password?</h2>
                                    <p className="text-white/40 text-xs tracking-widest uppercase">Identity Recovery Protocol</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-8">
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
                                        {loading ? <Loader2 className="animate-spin" size={18} /> : 'Request Recovery'}
                                        <ArrowRight size={18} />
                                    </button>
                                </form>

                                <Link to="/login" className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                                    <ArrowLeft size={14} />
                                    <span>Return to Login</span>
                                </Link>
                            </>
                        ) : (
                            <div className="space-y-10 py-10">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto"
                                >
                                    <CheckCircle2 className="text-white" size={40} />
                                </motion.div>
                                <div className="space-y-4">
                                    <h2 className="text-3xl font-serif italic text-white">Recovery Link Sent</h2>
                                    <p className="text-white/40 text-sm leading-relaxed">
                                        We've sent an identity recovery link to <span className="text-white">{email}</span>. Please check your inbox and spam folder.
                                    </p>
                                </div>
                                <Link to="/login" className="login-btn-primary !bg-white !text-black flex items-center justify-center">
                                    Return to Login
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
