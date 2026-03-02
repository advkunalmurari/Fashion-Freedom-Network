import React from 'react';
import { motion } from 'framer-motion';
import { Review } from '../types';
import { Star, ShieldCheck, Quote, BarChart3 } from 'lucide-react';

const CategoryBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-end">
            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">{label}</span>
            <span className="text-[10px] font-bold text-ffn-black">{value}/5</span>
        </div>
        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(value / 5) * 100}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className={`h-full ${color} rounded-full`}
            />
        </div>
    </div>
);

export const ReputationVault: React.FC<{ reviews: Review[] }> = ({ reviews }) => {
    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                        <BarChart3 className="w-5 h-5" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-black">Verified Reputation Protocol</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {reviews.map((review, idx) => (
                    <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-8 shadow-xl shadow-ffn-black/5 flex flex-col space-y-6 group hover:shadow-2xl hover:border-ffn-primary/20 transition-all duration-500"
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center p-2">
                                    {review.reviewerAvatarUrl ? (
                                        <img src={review.reviewerAvatarUrl} alt={review.reviewerName} className="w-full h-full object-contain" />
                                    ) : (
                                        <span className="font-serif font-bold text-lg text-gray-400">{review.reviewerName[0]}</span>
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-ffn-black">{review.reviewerName}</span>
                                        {review.isVerifiedBooking && <ShieldCheck className="w-3 h-3 text-emerald-500" />}
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{review.campaignTitle} • {review.date}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1 bg-emerald-500/10 text-emerald-500 px-3 py-1.5 rounded-xl text-[10px] font-black">
                                <Star className="w-3 h-3 fill-current" />
                                <span>{review.rating.toFixed(1)}</span>
                            </div>
                        </div>

                        <div className="relative pb-6">
                            <Quote className="absolute -left-2 -top-2 w-8 h-8 text-ffn-primary/5 -z-10" />
                            <h4 className="text-lg font-serif italic text-ffn-black font-bold mb-3">{review.headline}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed italic line-clamp-3 group-hover:line-clamp-none transition-all duration-500">
                                "{review.body}"
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-x-8 gap-y-6 pt-6 border-t border-gray-100/50">
                            <CategoryBar label="Professionalism" value={review.categories.professionalism} color="bg-emerald-500" />
                            <CategoryBar label="Communication" value={review.categories.communication} color="bg-blue-500" />
                            <CategoryBar label="Creativity" value={review.categories.creativity} color="bg-purple-500" />
                            <CategoryBar label="Punctuality" value={review.categories.punctuality} color="bg-rose-500" />
                        </div>

                        {review.brandResponse && (
                            <div className="mt-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 italic">
                                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-2">Creator Response</p>
                                <p className="text-xs text-gray-500">"{review.brandResponse}"</p>
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
