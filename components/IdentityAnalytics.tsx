import React from 'react';
import { m } from 'framer-motion';
import { TrendingUp, Globe, Eye, Zap, ShieldCheck } from 'lucide-react';

const MetricCard: React.FC<{ label: string; value: string; sub: string; icon: any; color: string }> = ({ label, value, sub, icon: Icon, color }) => (
    <div className="bg-white/40 backdrop-blur-3xl border border-white/50 rounded-[2.5rem] p-8 shadow-xl shadow-ffn-black/5 flex flex-col justify-between group hover:border-ffn-primary/20 transition-all duration-500">
        <div className="flex justify-between items-start">
            <div className={`p-4 rounded-2xl ${color} bg-opacity-10 text-opacity-100`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <TrendingUp className="w-3 h-3" />
                <span>+12%</span>
            </div>
        </div>
        <div className="mt-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">{label}</h4>
            <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-serif font-bold text-ffn-black">{value}</span>
                <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{sub}</span>
            </div>
        </div>
    </div>
);

export const IdentityAnalytics: React.FC<{ analytics: any }> = ({ analytics }) => {
    if (!analytics) return null;

    return (
        <div className="space-y-12 max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-ffn-primary/10 rounded-2xl text-ffn-primary font-black uppercase tracking-widest text-[10px]">
                        <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-black">Identity Archive Protocol</h3>
                </div>
                <div className="flex items-center space-x-2 px-6 py-2 bg-emerald-500/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-500 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Real-time Verified</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <MetricCard
                    label="Identity Reach"
                    value={(analytics.reach / 1000).toFixed(0)}
                    sub="K Impressions"
                    icon={Eye}
                    color="text-ffn-primary"
                />
                <MetricCard
                    label="Engagement Pulse"
                    value={analytics.engagement.toFixed(1)}
                    sub="% Dynamic"
                    icon={Zap}
                    color="text-orange-500"
                />
                <MetricCard
                    label="Global Markets"
                    value={analytics.topMarkets.length.toString()}
                    sub="Strategic"
                    icon={Globe}
                    color="text-blue-500"
                />
            </div>

            {/* Market Distribution */}
            <div className="bg-ffn-black text-white rounded-[3.5rem] p-12 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-ffn-primary/20 blur-[100px] pointer-events-none" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-end space-y-12 md:space-y-0">
                    <div className="space-y-8">
                        <h4 className="text-4xl font-serif font-bold leading-tight">Identity Dominance<br /><span className="text-ffn-primary">Market Protocol</span></h4>
                        <div className="flex flex-wrap gap-4">
                            {analytics.topMarkets.map((market: string) => (
                                <span key={market} className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                                    {market}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-end space-x-4 h-48">
                        {analytics.monthlyViews.map((point: any, idx: number) => (
                            <div key={idx} className="flex flex-col items-center space-y-4">
                                <m.div
                                    initial={{ height: 0 }}
                                    whileInView={{ height: `${(point.value / 250000) * 100}%` }}
                                    transition={{ duration: 2, ease: "easeOut" }}
                                    className="w-12 bg-gradient-to-t from-ffn-primary to-white/20 rounded-full"
                                />
                                <span className="text-[8px] font-black uppercase tracking-widest text-white/40">{point.month}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
