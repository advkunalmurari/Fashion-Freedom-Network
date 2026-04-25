import React from 'react';
import { m } from 'framer-motion';

export const PostSkeleton = () => (
    <div className="bg-white rounded-[3rem] p-6 space-y-6 shadow-xl border border-gray-50 opacity-80 mb-10 w-full animate-pulse">
        <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gray-200 rounded-full" />
            <div className="space-y-2 flex-1">
                <div className="w-32 h-4 bg-gray-200 rounded-full" />
                <div className="w-20 h-3 bg-gray-100 rounded-full" />
            </div>
        </div>
        <div className="w-full h-[400px] bg-gray-200 rounded-[2rem]" />
        <div className="space-y-3">
            <div className="w-full h-4 bg-gray-100 rounded-full" />
            <div className="w-4/5 h-4 bg-gray-100 rounded-full" />
        </div>
    </div>
);

export const ProfileSkeleton = () => (
    <div className="bg-white rounded-[3rem] p-6 space-y-6 shadow-xl border border-gray-50 opacity-80 w-full animate-pulse aspect-[3/4]">
        <div className="w-full h-full bg-gray-200 rounded-[2rem]" />
    </div>
);

export const PageTransition = ({ children }: { children: React.ReactNode }) => (
    <m.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full h-full"
    >
        {children}
    </m.div>
);
