import React from 'react';
import { m } from 'framer-motion';
import { ShoppingBag, Star, ArrowRight, Zap, Target } from 'lucide-react';

interface MarketplaceCardProps {
    type: 'casting' | 'rental' | 'masterclass';
    title: string;
    subtitle: string;
    price?: string;
    matchScore?: number;
    imageUrl: string;
    onClick?: () => void;
}

export const MarketplaceCard: React.FC<MarketplaceCardProps> = ({
    type,
    title,
    subtitle,
    price,
    matchScore,
    imageUrl,
    onClick
}) => {
    const getBadge = () => {
        switch (type) {
            case 'casting': return { icon: Target, text: 'Active Casting', color: 'text-ffn-primary', bg: 'bg-ffn-primary/10' };
            case 'rental': return { icon: ShoppingBag, text: 'Rare Rental', color: 'text-ffn-accent', bg: 'bg-ffn-accent/10' };
            case 'masterclass': return { icon: Zap, text: 'Elite Mastery', color: 'text-amber-500', bg: 'bg-amber-500/10' };
        }
    };

    const badge = getBadge();

    return (
        <m.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative break-inside-avoid rounded-[2.5rem] overflow-hidden bg-white border border-gray-100 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
            onClick={onClick}
        >
            <div className="aspect-[4/5] overflow-hidden relative">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className={`absolute top-6 left-6 flex items-center space-x-2 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/10 ${badge.bg}`}>
                    <badge.icon className={`w-3 h-3 ${badge.color}`} />
                    <span className={`text-[7px] font-black uppercase tracking-widest ${badge.color}`}>{badge.text}</span>
                </div>

                {matchScore && (
                    <div className="absolute top-6 right-6">
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                            <span className="text-[8px] font-black text-white">{matchScore}%</span>
                        </div>
                    </div>
                )}

                <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-serif italic text-white leading-none">{title}</h3>
                            <p className="text-[8px] font-bold text-white/60 uppercase tracking-widest">{subtitle}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            {price && <span className="text-[10px] font-black text-ffn-primary uppercase tracking-[0.2em]">{price}</span>}
                            <button className="flex items-center space-x-2 text-white">
                                <span className="text-[8px] font-black uppercase tracking-widest border-b border-white pb-0.5">Initialize</span>
                                <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </m.div>
    );
};
