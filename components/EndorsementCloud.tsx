import React from 'react';
import { motion } from 'framer-motion';
import { Endorsement } from '../types';
import { CheckCircle } from 'lucide-react';

export const EndorsementCloud: React.FC<{ endorsements: Endorsement[] }> = ({ endorsements }) => {
    if (!endorsements || endorsements.length === 0) return null;

    return (
        <div className="py-8 border-y border-gray-100/50 bg-gray-50/30 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50/30 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50/30 to-transparent z-10" />

            <div className="flex items-center space-x-12 animate-marquee whitespace-nowrap px-10">
                {/* Duplicate for infinite effect */}
                {[...endorsements, ...endorsements].map((endorsement, idx) => (
                    <motion.div
                        key={`${endorsement.id}-${idx}`}
                        className="flex items-center space-x-4 group cursor-default"
                        whileHover={{ scale: 1.05 }}
                    >
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-white border border-gray-100 flex-shrink-0 flex items-center justify-center p-2 shadow-sm group-hover:shadow-md transition-shadow">
                            <img
                                src={endorsement.brandLogo}
                                alt={endorsement.brandName}
                                className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                            />
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-ffn-black">{endorsement.brandName}</span>
                                {endorsement.verified && <CheckCircle className="w-3 h-3 text-ffn-primary fill-ffn-primary/10" />}
                            </div>
                            <span className="text-[9px] text-gray-400 font-medium italic">"{endorsement.content}"</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
};
