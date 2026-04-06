import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass, PlusSquare, MessageCircle, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileBottomNavProps {
    activeTab: string;
    isDarkMode: boolean;
    onCreatePost: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ activeTab, isDarkMode, onCreatePost }) => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Hide navigation when keyboard is open (detecting window resize on mobile)
        const initialHeight = window.innerHeight;

        const handleResize = () => {
            const currentHeight = window.innerHeight;
            // If height shrinks by more than 20%, likely a keyboard
            if (initialHeight - currentHeight > 150) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const navItems = [
        { id: 'home', icon: Home, label: 'Nodes', action: () => navigate('/') },
        { id: 'explore', icon: Compass, label: 'Discover', action: () => navigate('/explore') },
        { id: 'create', icon: PlusSquare, label: 'Initialize', action: onCreatePost },
        { id: 'inbox', icon: MessageCircle, label: 'Signal', action: () => navigate('/inbox') },
        { id: 'my-profile', icon: User, label: 'Identity', action: () => navigate('/my-profile') }
    ];


    return (
        <AnimatePresence>
            {isVisible && (
                <motion.nav
                    initial={{ y: 100 }}
                    animate={{ y: 0 }}
                    exit={{ y: 100 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className={`lg:hidden fixed bottom-0 left-0 right-0 h-[76px] pb-safe border-t backdrop-blur-[40px] z-[140] flex items-center justify-around px-2 transition-colors duration-500 bg-[#050505]/80 border-white/5 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]`}
                    style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                >

                    {navItems.map((item) => {
                        const isActive = activeTab === item.id || (activeTab === '' && item.id === 'home');
                        return (
                            <button
                                key={item.id}
                                onClick={item.action}
                                title={item.label}
                                className={`flex flex-col items-center justify-center space-y-1.5 w-16 h-full transition-all duration-500 relative ${isActive ? 'text-ffn-primary' : 'text-white/20 hover:text-white'
                                    }`}
                            >

                                {isActive && item.id !== 'create' && (
                                    <motion.div
                                        layoutId="mobileNavActiveBase"
                                        className="absolute top-1 w-8 h-1 bg-ffn-primary rounded-full"
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    />
                                )}

                                <item.icon
                                    className={`transition-all duration-300 ${item.id === 'create'
                                        ? 'w-7 h-7 text-white'
                                        : isActive ? 'w-6 h-6 scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : 'w-5 h-5'
                                        }`}
                                />

                                {item.id !== 'create' && (
                                    <span className={`text-[9px] font-bold tracking-wider ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </motion.nav>
            )}
        </AnimatePresence>
    );
};
