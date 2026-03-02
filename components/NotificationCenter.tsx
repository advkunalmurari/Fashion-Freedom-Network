import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppNotification, NotificationType } from '../types';
import {
    Bell, X, Check, CheckCheck, Briefcase, MessageCircle,
    FileText, Flame, CreditCard, UserPlus, Star, ShieldCheck,
    TrendingUp, Info, Filter, ChevronRight, Clock
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../constants';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
    const diffMs = Date.now() - new Date(iso).getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h ago`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d ago`;
}

const TYPE_CONFIG: Record<NotificationType, { icon: React.FC<any>; bg: string; iconColor: string }> = {
    hire: { icon: Briefcase, bg: 'bg-violet-50', iconColor: 'text-violet-600' },
    message: { icon: MessageCircle, bg: 'bg-blue-50', iconColor: 'text-blue-600' },
    contract: { icon: FileText, bg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
    casting_match: { icon: Flame, bg: 'bg-orange-50', iconColor: 'text-orange-600' },
    payment: { icon: CreditCard, bg: 'bg-green-50', iconColor: 'text-green-600' },
    follow: { icon: UserPlus, bg: 'bg-pink-50', iconColor: 'text-pink-600' },
    casting_shortlist: { icon: Star, bg: 'bg-amber-50', iconColor: 'text-amber-600' },
    review: { icon: Star, bg: 'bg-yellow-50', iconColor: 'text-yellow-600' },
    ar_verified: { icon: ShieldCheck, bg: 'bg-teal-50', iconColor: 'text-teal-600' },
    trend_alert: { icon: TrendingUp, bg: 'bg-rose-50', iconColor: 'text-rose-600' },
    milestone: { icon: Clock, bg: 'bg-ffn-primary/5', iconColor: 'text-ffn-primary' },
    system: { icon: Info, bg: 'bg-gray-50', iconColor: 'text-gray-500' },
};

const CATEGORIES = ['All', 'Hiring', 'Messages', 'Payments', 'Alerts'] as const;
type Category = typeof CATEGORIES[number];

function categoryFilter(type: NotificationType, cat: Category): boolean {
    if (cat === 'All') return true;
    if (cat === 'Hiring') return ['hire', 'casting_match', 'casting_shortlist'].includes(type);
    if (cat === 'Messages') return ['message', 'follow', 'review'].includes(type);
    if (cat === 'Payments') return ['payment', 'contract'].includes(type);
    if (cat === 'Alerts') return ['ar_verified', 'trend_alert', 'milestone', 'system'].includes(type);
    return true;
}

// ─── Notification Row ─────────────────────────────────────────────────────────
const NotifRow: React.FC<{
    notif: AppNotification;
    onRead: (id: string) => void;
    onClick: (notif: AppNotification) => void;
}> = ({ notif, onRead, onClick }) => {
    const cfg = TYPE_CONFIG[notif.type];
    const Icon = cfg.icon;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            onClick={() => { onRead(notif.id); onClick(notif); }}
            className={`relative flex items-start gap-4 p-4 rounded-2xl cursor-pointer transition-all group hover:bg-gray-50 ${!notif.isRead ? 'bg-ffn-primary/3' : ''}`}
        >
            {/* Unread dot */}
            {!notif.isRead && (
                <div className="absolute top-4 right-4 w-2 h-2 bg-ffn-primary rounded-full shrink-0" />
            )}

            {/* Icon or avatar */}
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                {notif.avatarUrl ? (
                    <img src={notif.avatarUrl} alt="" className="w-full h-full rounded-2xl object-cover" />
                ) : (
                    <Icon className={`w-5 h-5 ${cfg.iconColor}`} />
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pr-4">
                <p className={`text-sm leading-snug ${!notif.isRead ? 'font-bold text-ffn-black' : 'font-medium text-gray-700'}`}>
                    {notif.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{notif.body}</p>
                <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">{timeAgo(notif.timestamp)}</span>
                    {notif.actionLabel && (
                        <>
                            <span className="text-gray-300">·</span>
                            <span className="text-[9px] uppercase tracking-widest font-black text-ffn-primary">{notif.actionLabel}</span>
                        </>
                    )}
                </div>
            </div>

            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 shrink-0 mt-1 transition-colors" />
        </motion.div>
    );
};

// ─── Main NotificationCenter ──────────────────────────────────────────────────
interface NotificationCenterProps {
    isDarkMode?: boolean;
    isSidebarCollapsed?: boolean;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
    isDarkMode = false,
    isSidebarCollapsed = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);
    const [category, setCategory] = useState<Category>('All');

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const filtered = notifications.filter(n => categoryFilter(n.type, category));

    const markRead = useCallback((id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    }, []);

    const markAllRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    }, []);

    const handleNotifClick = (notif: AppNotification) => {
        // In a real app, navigate to notif.actionRoute
        console.log('Navigate to:', notif.actionRoute);
    };

    // Simulate a new notification arriving after 8 seconds (demo effect)
    useEffect(() => {
        const t = setTimeout(() => {
            setNotifications(prev => [{
                id: 'live_' + Date.now(),
                type: 'casting_match',
                title: '🔥 New Casting Match',
                body: 'Nykaa Fashion just posted a campaign that matches your profile. Apply before 50 other models do.',
                timestamp: new Date().toISOString(),
                isRead: false,
                actionLabel: 'View Casting',
                actionRoute: '/castings',
            }, ...prev]);
        }, 8000);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            {/* Bell trigger button — designed to fit both expanded + collapsed sidebar */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Notifications"
                className={`relative flex items-center w-full text-left p-3 rounded-2xl transition-all group focus:outline-none
                    ${isOpen
                        ? (isDarkMode ? 'bg-white text-black' : 'bg-ffn-black text-white')
                        : (isDarkMode ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-ffn-black')
                    }
                    ${isSidebarCollapsed ? 'justify-center' : 'space-x-4'}
                `}
            >
                <div className="relative shrink-0">
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ffn-primary rounded-full flex items-center justify-center"
                        >
                            <span className="text-[8px] font-black text-white leading-none">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        </motion.div>
                    )}
                </div>
                {!isSidebarCollapsed && (
                    <span className="text-[8px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">Notifications</span>
                )}
            </button>

            {/* Notification Panel */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[190] bg-black/20 backdrop-blur-[2px] lg:hidden"
                        />

                        {/* Panel — appears to the right of the sidebar on desktop, bottom sheet on mobile */}
                        <motion.div
                            initial={{ opacity: 0, x: -20, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -20, scale: 0.96 }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className={`fixed z-[200] shadow-2xl border overflow-hidden flex flex-col
                                left-[20px] lg:left-[280px] top-4 bottom-4
                                w-[calc(100vw-40px)] max-w-sm
                                rounded-[2rem]
                                ${isDarkMode ? 'bg-[#151515] border-white/10 text-white' : 'bg-white border-gray-100 text-ffn-black'}
                            `}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
                                <div>
                                    <h2 className="text-xl font-serif italic font-bold">Notifications</h2>
                                    <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mt-0.5">
                                        {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {unreadCount > 0 && (
                                        <button
                                            onClick={markAllRead}
                                            title="Mark all as read"
                                            className="flex items-center space-x-1.5 text-[9px] uppercase tracking-widest font-black text-ffn-primary bg-ffn-primary/10 px-3 py-2 rounded-xl hover:bg-ffn-primary/20 transition-colors"
                                        >
                                            <CheckCheck className="w-3 h-3" />
                                            <span>All read</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        title="Close notifications"
                                        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-ffn-black hover:bg-gray-100 rounded-xl transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Category tabs */}
                            <div className="flex gap-1.5 px-4 py-3 border-b border-gray-50 shrink-0 overflow-x-auto no-scrollbar">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        className={`shrink-0 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all ${category === cat
                                            ? 'bg-ffn-black text-white shadow-md'
                                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {cat}
                                        {cat !== 'All' && (() => {
                                            const count = notifications.filter(n => !n.isRead && categoryFilter(n.type, cat)).length;
                                            return count > 0 ? (
                                                <span className="ml-1.5 bg-ffn-primary text-white rounded-full px-1 py-0.5 text-[7px]">{count}</span>
                                            ) : null;
                                        })()}
                                    </button>
                                ))}
                            </div>

                            {/* Notification list */}
                            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
                                <AnimatePresence mode="popLayout">
                                    {filtered.length > 0 ? (
                                        filtered.map(n => (
                                            <NotifRow
                                                key={n.id}
                                                notif={n}
                                                onRead={markRead}
                                                onClick={handleNotifClick}
                                            />
                                        ))
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="flex flex-col items-center justify-center py-16 text-center"
                                        >
                                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                                <Bell className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <p className="font-serif italic text-gray-400 text-lg">All quiet here</p>
                                            <p className="text-xs text-gray-300 mt-1">New activity will appear here instantly</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Footer */}
                            <div className="border-t border-gray-50 px-6 py-4 shrink-0">
                                <p className="text-[9px] text-center text-gray-400 uppercase tracking-widest font-bold">
                                    Real-time · Updating automatically
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};

// ─── Compact pulsing bell badge (for mobile nav) ──────────────────────────────
export const NotificationBellBadge: React.FC<{ count: number; onClick: () => void }> = ({ count, onClick }) => (
    <button onClick={onClick} className="relative" title="Notifications">
        <Bell className="w-5 h-5 text-gray-400" />
        {count > 0 && (
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-ffn-primary rounded-full flex items-center justify-center"
            >
                <span className="text-[7px] font-black text-white">{count > 9 ? '9+' : count}</span>
            </motion.div>
        )}
    </button>
);
