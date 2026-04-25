import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Calendar as CalendarIcon,
    Lock, CheckCircle2, AlertCircle, Clock, Info
} from 'lucide-react';
import { AvailabilitySlot } from '../types';

interface AvailabilityCalendarProps {
    slots: AvailabilitySlot[];
    onDateSelect?: (date: Date) => void;
    isEditable?: boolean;
}

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({ slots, onDateSelect, isEditable = false }) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const renderHeader = () => {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        return (
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h3 className="text-2xl font-serif italic font-bold text-ffn-black">
                        {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                    </h3>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center">
                        <CalendarIcon className="w-3 h-3 mr-2" />
                        Professional Availability Schedule
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        title="Previous Month"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        title="Next Month"
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-3 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    const renderDays = () => {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return (
            <div className="grid grid-cols-7 mb-4 px-2">
                {days.map(day => (
                    <div key={day} className="text-center text-[8px] font-black uppercase tracking-widest text-gray-300">
                        {day}
                    </div>
                ))}
            </div>
        );
    };

    const renderCells = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const numDays = daysInMonth(year, month);
        const startDay = firstDayOfMonth(year, month);
        const cells = [];

        // Padding for previous month
        for (let i = 0; i < startDay; i++) {
            cells.push(<div key={`empty-${i}`} className="h-24" />);
        }

        for (let d = 1; d <= numDays; d++) {
            const date = new Date(year, month, d);
            const isToday = date.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            const slot = slots.find(s => {
                const start = new Date(s.startDate);
                const end = new Date(s.endDate);
                return date >= start && date <= end;
            });

            let statusColor = 'bg-transparent';
            let textColor = 'text-ffn-black';
            if (slot?.status === 'booked') {
                statusColor = 'bg-ffn-black text-white';
                textColor = 'text-white';
            } else if (slot?.status === 'unavailable') {
                statusColor = 'bg-gray-100/50';
                textColor = 'text-gray-300 line-through';
            } else if (slot?.status === 'tentative') {
                statusColor = 'bg-ffn-primary/10 border border-ffn-primary/20';
                textColor = 'text-ffn-primary';
            }

            cells.push(
                <m.button
                    key={d}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        setSelectedDate(date);
                        onDateSelect?.(date);
                    }}
                    className={`h-24 rounded-2xl p-4 transition-all relative group flex flex-col justify-between ${statusColor} ${isSelected ? 'ring-2 ring-ffn-primary ring-offset-2' : ''}`}
                >
                    <span className={`text-[10px] font-black tracking-widest ${isToday ? 'bg-ffn-primary text-white w-6 h-6 flex items-center justify-center rounded-full' : textColor}`}>
                        {d}
                    </span>

                    {slot && (
                        <div className="space-y-1 text-left">
                            <p className="text-[7px] font-black uppercase tracking-tighter opacity-60 leading-tight truncate">
                                {slot.title || slot.status}
                            </p>
                            {slot.status === 'booked' && <Lock className="w-2.5 h-2.5 opacity-40" />}
                        </div>
                    )}

                    {isToday && !slot && (
                        <div className="absolute top-4 right-4 w-1 h-1 rounded-full bg-ffn-primary" />
                    )}
                </m.button>
            );
        }

        return <div className="grid grid-cols-7 gap-2">{cells}</div>;
    };

    return (
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl overflow-hidden">
            {renderHeader()}
            {renderDays()}
            {renderCells()}

            {/* Legend */}
            <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between">
                <div className="flex space-x-6">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-md bg-ffn-black" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Booked Shoot</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-md bg-ffn-primary/20 border border-ffn-primary/30" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Tentative Hold</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-md bg-gray-100" />
                        <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">Unavailable</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-ffn-primary">
                    <Info className="w-3 h-3" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Click to view day details</span>
                </div>
            </div>

            {/* Selected Date Detail (Mini Drawer) */}
            <AnimatePresence>
                {selectedDate && (
                    <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mt-8 pt-8 border-t border-ffn-primary/10 overflow-hidden"
                    >
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <p className="text-[8px] font-black uppercase tracking-widest text-ffn-primary">Selected Identity Schedule</p>
                                <h4 className="text-xl font-serif italic text-ffn-black">
                                    {selectedDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h4>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button
                                    className="px-6 py-3 bg-ffn-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all"
                                >
                                    Request Day Hold
                                </button>
                                <button
                                    title="Close Date Details"
                                    onClick={() => setSelectedDate(null)}
                                    className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-100"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const X = ({ className, ...props }: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M18 6 6 18" />
        <path d="m6 6 12 12" />
    </svg>
);
