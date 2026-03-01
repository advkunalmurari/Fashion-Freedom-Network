import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { supabase } from '../supabase';
import { LOGO_SVG } from '../constants';
import AnimatedBackground from '../components/AnimatedBackground';
import LoginCard from '../components/LoginCard';
import '../styles/login.css';

interface LoginProps {
    onLogin: (userData: any) => void;
}

const characteristics = [
    "Discover fashion talent",
    "Build professional portfolios",
    "Book premium photoshoots",
    "Connect with brands and creators",
    "Build your fashion identity"
];

const LoginPage: React.FC<LoginProps> = ({ onLogin }) => {
    useEffect(() => {
        // Session Guard
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                onLogin(session.user);
            }
        };
        checkSession();
    }, [onLogin]);

    return (
        <div className="min-h-[100dvh] w-full relative z-[100] flex overflow-x-hidden overflow-y-auto font-sans">
            <AnimatedBackground />

            <div className="login-split-layout">
                {/* Left Panel: Brand & Messaging (60%) */}
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
                                Fashion Freedom Network
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="text-xl lg:text-2xl text-white/60 font-light"
                            >
                                India’s Emerging Fashion Talent Discovery Platform
                            </motion.p>
                        </div>

                        <div className="space-y-4 text-left inline-block">
                            {characteristics.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -15 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.4 + (idx * 0.1) }}
                                    className="flex items-center gap-4 text-white/50 text-sm lg:text-base font-light"
                                >
                                    <CheckCircle2 size={18} className="text-white/20" />
                                    <span>{item}</span>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.2 }}
                            transition={{ delay: 1.5 }}
                            className="pt-12"
                        >
                            <p className="text-[10px] uppercase tracking-[0.5em] font-medium">Professional Portfolios. Verified Talent. Real Opportunities.</p>
                        </motion.div>
                    </div>
                </div>

                {/* Right Panel: Auth (40%) */}
                <div className="right-panel">
                    <LoginCard onSuccess={onLogin} />
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
