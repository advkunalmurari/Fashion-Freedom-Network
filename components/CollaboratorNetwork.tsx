import React from 'react';
import { motion } from 'framer-motion';
import { User } from '../types';
import { Users, ExternalLink } from 'lucide-react';

export const CollaboratorNetwork: React.FC<{ collaborators: User[] }> = ({ collaborators }) => {
    if (!collaborators || collaborators.length === 0) return null;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-ffn-primary/10 rounded-2xl text-ffn-primary">
                        <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-black">Verified Network</h3>
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{collaborators.length} Peers</span>
            </div>

            <div className="flex flex-wrap gap-6">
                {collaborators.map((peer, idx) => (
                    <motion.div
                        key={peer.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group relative"
                    >
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-white border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:border-ffn-primary/30 transition-all duration-500 overflow-hidden cursor-pointer">
                            <img
                                src={peer.avatarUrl}
                                alt={peer.displayName}
                                className="w-full h-full object-cover rounded-full grayscale group-hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute inset-0 bg-ffn-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                                <ExternalLink className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-bottom-12 transition-all duration-300 whitespace-nowrap z-20">
                            <div className="bg-ffn-black text-white px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest shadow-2xl">
                                {peer.displayName} • {peer.role}
                            </div>
                        </div>
                    </motion.div>
                ))}

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="w-20 h-20 md:w-24 md:h-24 rounded-full border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-300 hover:border-ffn-primary/30 hover:text-ffn-primary transition-all group"
                >
                    <span className="text-xl font-bold">+</span>
                    <span className="text-[8px] font-black uppercase tracking-widest">Connect</span>
                </motion.button>
            </div>
        </div>
    );
};
