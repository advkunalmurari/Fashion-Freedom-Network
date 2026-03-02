import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

export const AvailabilityPulse: React.FC<{
    status: 'available' | 'busy' | 'on-set' | 'traveling',
    calendar?: { date: string; status: 'available' | 'busy' }[]
}> = ({ status, calendar }) => {
    const statusColors = {
        available: 'bg-emerald-500',
        busy: 'bg-rose-500',
        'on-set': 'bg-ffn-primary',
        traveling: 'bg-blue-500'
    };

    const statusLabels = {
        available: 'Available Now',
        busy: 'Booked',
        'on-set': 'Active On Set',
        traveling: 'Traveling'
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-3">
                <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${statusColors[status]}`} />
                    <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className={`absolute inset-0 rounded-full ${statusColors[status]}`}
                    />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-ffn-black">{statusLabels[status]}</span>
            </div>

            {calendar && (
                <div className="flex space-x-2">
                    {calendar.map((slot, idx) => {
                        const date = new Date(slot.date);
                        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' })[0];
                        return (
                            <div key={idx} className="flex flex-col items-center space-y-1">
                                <span className="text-[8px] font-bold text-gray-400">{dayName}</span>
                                <div
                                    className={`w-6 h-6 rounded-lg flex items-center justify-center border ${slot.status === 'available'
                                            ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-500'
                                            : 'bg-gray-50 border-gray-100 text-gray-300'
                                        }`}
                                    title={`${slot.date}: ${slot.status}`}
                                >
                                    <Calendar className="w-3 h-3" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
