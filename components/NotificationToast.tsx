import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    X,
    Bell,
    Info,
    AlertCircle,
    MessageSquare,
    Clock,
    ExternalLink
} from 'lucide-react';

export interface Toast {
    id: string;
    title: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error' | 'message' | 'milestone';
    duration?: number;
}

interface NotificationToastProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

const TYPE_CONFIG = {
    success: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    info: { icon: Info, color: 'text-blue-500', bg: 'bg-blue-50' },
    warning: { icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
    error: { icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' },
    message: { icon: MessageSquare, color: 'text-violet-500', bg: 'bg-violet-50' },
    milestone: { icon: Clock, color: 'text-ffn-primary', bg: 'bg-ffn-primary/5' },
};

export const NotificationToast: React.FC<NotificationToastProps> = ({ toasts, onRemove }) => {
    return (
        <div className="fixed bottom-8 right-8 z-[2000] flex flex-col gap-4 max-w-sm w-full pointer-events-none">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => {
                    const Config = TYPE_CONFIG[toast.type];
                    const Icon = Config.icon;

                    return (
                        <m.div
                            key={toast.id}
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.9, x: 20 }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 50 }}
                            className="pointer-events-auto bg-white/95 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-5 flex items-start gap-4"
                        >
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${Config.bg}`}>
                                <Icon className={`w-5 h-5 ${Config.color}`} />
                            </div>

                            <div className="flex-1 pt-0.5">
                                <h4 className="text-[11px] font-black uppercase tracking-widest text-ffn-black mb-1">
                                    {toast.title}
                                </h4>
                                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                    {toast.message}
                                </p>
                                <div className="flex items-center gap-3 mt-3">
                                    <button className="text-[9px] font-black uppercase tracking-widest text-ffn-primary hover:underline flex items-center gap-1">
                                        Details <ExternalLink className="w-2.5 h-2.5" />
                                    </button>
                                    <span className="text-gray-300">|</span>
                                    <button
                                        onClick={() => onRemove(toast.id)}
                                        className="text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-ffn-black"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={() => onRemove(toast.id)}
                                className="w-6 h-6 flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-50 rounded-lg transition-colors"
                                title="Dismiss"
                            >
                                <X className="w-3.5 h-3.5" />
                            </button>

                            {/* Progress bar (optional) */}
                            <m.div
                                initial={{ width: '100%' }}
                                animate={{ width: 0 }}
                                transition={{ duration: (toast.duration || 5000) / 1000, ease: 'linear' }}
                                onAnimationComplete={() => onRemove(toast.id)}
                                className={`absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-30 ${Config.color.replace('text', 'bg')}`}
                            />
                        </m.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};
