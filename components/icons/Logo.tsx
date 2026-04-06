import React from 'react';

export const Logo: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logo-grad-vibrant" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#833ab4" />
                <stop offset="50%" stopColor="#fd1d1d" />
                <stop offset="100%" stopColor="#fcb045" />
            </linearGradient>
            <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <rect x="10" y="10" width="80" height="80" rx="28" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.1" />
        <g transform="translate(18, 58)" fill="currentColor">
            <path d="M4 0C4 -8 6 -12 12 -12V-10C9 -10 8 -8 8 -4V0H12V2H8V14H4V2H0V0H4Z" />
            <path d="M22 0C22 -8 24 -12 30 -12V-10C27 -10 26 -8 26 -4V0H30V2H26V14H22V2H18V0H22Z" />
            <path d="M40 0V14H44V6C44 2 46 1 49 1C52 1 54 3 54 7V14H58V6C58 -1 54 -4 49 -4C46 -4 44 -2 42 -1V-3H40V0Z" />
        </g>
        <circle cx="78" cy="35" r="5" fill="url(#logo-grad-vibrant)" filter="url(#logo-glow)" />
    </svg>
);
