import React from 'react';
import { m } from 'framer-motion';

interface DiscoveryNodeProps {
    id: string;
    username: string;
    avatarUrl: string;
    isPulse?: boolean;
    label?: string;
    onClick?: () => void;
}

export const DiscoveryNode: React.FC<DiscoveryNodeProps> = ({
    username,
    avatarUrl,
    isPulse = false,
    label,
    onClick
}) => {
    return (
        <m.button
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="flex flex-col items-center space-y-3 group flex-none"
        >
            <div className="relative">
                {isPulse && (
                    <m.div
                        className="absolute inset-0 rounded-full border-2 border-ffn-primary"
                        animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                )}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-1 border border-white/10 bg-white shadow-xl group-hover:border-ffn-primary transition-colors overflow-hidden">
                    <img
                        src={avatarUrl}
                        alt={username}
                        className="w-full h-full object-cover rounded-full"
                    />
                </div>
                {label && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-ffn-black text-white text-[6px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap shadow-lg">
                        {label}
                    </div>
                )}
            </div>
            <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-ffn-black transition-colors">
                @{username}
            </span>
        </m.button>
    );
};
