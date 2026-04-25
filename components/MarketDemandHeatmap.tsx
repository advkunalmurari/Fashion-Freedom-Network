
import React from 'react';
import { m } from 'framer-motion';
import { MapPin, Users, Zap, TrendingUp } from 'lucide-react';

export const MarketDemandHeatmap: React.FC = () => {
    const cities = [
        { name: 'Mumbai', x: '70%', y: '65%', demand: 92, color: '#FFD700' },
        { name: 'Tokyo', x: '85%', y: '40%', demand: 88, color: '#3B82F6' },
        { name: 'Paris', x: '45%', y: '35%', demand: 75, color: '#EC4899' },
        { name: 'London', x: '42%', y: '32%', demand: 84, color: '#8B5CF6' },
        { name: 'NYC', x: '25%', y: '38%', demand: 95, color: '#10B981' },
        { name: 'Milan', x: '48%', y: '42%', demand: 98, color: '#F59E0B' },
    ];

    return (
        <div className="relative p-10 rounded-[3rem] bg-white/5 border border-white/5 overflow-hidden group">
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="space-y-1">
                    <h3 className="text-xl font-serif italic text-white font-inter">Global Demand Heatmap</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ffn-primary">Real-time Professional Liquidity</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-ffn-primary animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Live Simulation</span>
                    </div>
                </div>
            </div>

            <div className="relative aspect-[16/9] w-full bg-black/40 rounded-[2rem] border border-white/5 overflow-hidden">
                {/* Abstract World Grid */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-grid-pattern" />


                {/* City Pulsing Nodes */}
                {cities.map((city, i) => (
                    <m.div
                        key={city.name}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1, type: 'spring' }}
                        style={{ left: city.x, top: city.y }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group/node"
                    >
                        <div className="relative">
                            <m.div
                                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0.2, 0.6] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute inset-0 w-8 h-8 -translate-x-1/4 -translate-y-1/4 rounded-full"
                                style={{ backgroundColor: city.color }}
                            />
                            <div
                                className="w-4 h-4 rounded-full border-2 border-white/50 relative z-10 shadow-2xl"
                                style={{ backgroundColor: city.color }}
                            />

                            {/* City Label Protocol */}
                            <div className="absolute top-1/2 left-6 -translate-y-1/2 pointer-events-none translate-x-4 opacity-0 group-hover/node:translate-x-0 group-hover/node:opacity-100 transition-all duration-500 whitespace-nowrap">
                                <div className="p-3 rounded-xl bg-black/80 backdrop-blur-xl border border-white/10 space-y-1">
                                    <div className="text-[10px] font-serif italic text-white">{city.name}</div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-[7px] font-black uppercase tracking-widest text-gray-500">Demand:</span>
                                        <span className="text-[9px] font-black text-ffn-primary">{city.demand}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </m.div>
                ))}

                {/* Global Connection Lines (Decorative Migration Trails) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <defs>
                        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="transparent" />
                            <stop offset="50%" stopColor="#FFD700" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="transparent" />
                        </linearGradient>
                    </defs>

                    {/* Migration Trail 1: NYC -> Paris */}
                    <m.path
                        d="M 25% 38% Q 35% 30% 45% 35%"
                        stroke="url(#lineGrad)"
                        strokeWidth="1.5"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Migration Trail 2: Tokyo -> Mumbai */}
                    <m.path
                        d="M 85% 40% Q 78% 52% 70% 65%"
                        stroke="#FFD700"
                        strokeWidth="0.5"
                        strokeDasharray="4 4"
                        fill="none"
                        animate={{ strokeDashoffset: [0, -20] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Migration Trail 3: Milan -> NYC */}
                    <m.path
                        d="M 48% 42% Q 36% 45% 25% 38%"
                        stroke="#EC4899"
                        strokeWidth="0.5"
                        strokeOpacity="0.3"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 5, repeat: Infinity }}
                    />
                </svg>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-10">
                {[
                    { label: 'Highest Pulse', value: 'Milan', change: '+12.4%', icon: TrendingUp },
                    { label: 'Network Talent', value: '14.2k', change: '+2k', icon: Users },
                    { label: 'Avg Liquidity', value: '88.4', change: '+4.2', icon: Zap },
                ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                            <stat.icon className="w-4 h-4 text-gray-500" />
                            <span className="text-[8px] font-black uppercase tracking-widest text-green-500">{stat.change}</span>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[7px] font-black uppercase tracking-widest text-gray-500">{stat.label}</p>
                            <p className="text-xl font-serif italic text-white">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
