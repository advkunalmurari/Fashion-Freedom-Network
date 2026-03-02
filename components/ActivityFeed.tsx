import React from 'react';
import { motion } from 'framer-motion';
import {
    Zap,
    Circle,
    ArrowUpRight,
    Users,
    ShoppingBag,
    Layers
} from 'lucide-react';
import { SystemActivity } from '../types';
import { MOCK_SYSTEM_ACTIVITY } from '../constants';

interface ActivityFeedProps {
    limit?: number;
    className?: string;
    isDarkMode?: boolean;
}

const CATEGORY_CONFIG = {
    PROJECT: { icon: Layers, color: 'text-violet-500', bg: 'bg-violet-500/10' },
    NETWORK: { icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    MARKETPLACE: { icon: ShoppingBag, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
};

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
    limit = 5,
    className = '',
    isDarkMode = false
}) => {
    const activities = MOCK_SYSTEM_ACTIVITY.slice(0, limit);

    return (
        <div className={`space-y-4 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-white/70' : 'text-gray-500'}`}>
                        System Pulse
                    </h3>
                </div>
                <Zap className="w-3 h-3 text-ffn-primary fill-ffn-primary" />
            </div>

            <div className="relative space-y-6 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100 dark:before:bg-white/5">
                {activities.map((activity, index) => {
                    const Config = CATEGORY_CONFIG[activity.category];
                    const Icon = Config.icon;

                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4 group"
                        >
                            {/* Timeline Dot/Icon */}
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-4 ${isDarkMode ? 'border-[#0a0a0a] bg-[#151515]' : 'border-white bg-white shadow-sm'}`}>
                                <div className={`w-full h-full rounded-full flex items-center justify-center ${Config.bg}`}>
                                    <Icon className={`w-3 h-3 ${Config.color}`} />
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className={`text-[11px] leading-tight font-medium ${isDarkMode ? 'text-white/90' : 'text-gray-900'}`}>
                                            <span className="font-bold">{activity.userName}</span> {activity.action}
                                        </p>
                                        <p className={`text-[10px] mt-0.5 font-bold uppercase tracking-wider ${isDarkMode ? 'text-ffn-primary/80' : 'text-ffn-primary'}`}>
                                            {activity.targetName}
                                        </p>
                                    </div>
                                    <span className={`text-[9px] font-medium ${isDarkMode ? 'text-white/30' : 'text-gray-400'}`}>
                                        {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>

                            {/* Hover effect indicator */}
                            <div className="absolute -inset-x-2 -inset-y-2 rounded-xl bg-gray-50 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </motion.div>
                    );
                })}
            </div>

            <button className={`w-full py-3 mt-4 text-[9px] font-black uppercase tracking-widest border border-dashed rounded-xl transition-all ${isDarkMode ? 'border-white/10 text-white/40 hover:border-white/20 hover:text-white' : 'border-gray-200 text-gray-400 hover:border-ffn-primary hover:text-ffn-primary'}`}>
                View Network Pulse
            </button>
        </div>
    );
};
