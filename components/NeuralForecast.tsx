
import React from 'react';
import { m } from 'framer-motion';
import { Activity, Zap, TrendingUp, Target } from 'lucide-react';

export const NeuralForecast: React.FC = () => {
    const points = [20, 45, 30, 65, 55, 85, 95];
    const path = points.map((p, i) => `${(i / (points.length - 1)) * 100},${100 - p}`).join(' L ');

    return (
        <div className="p-10 rounded-[3rem] bg-black/40 border border-white/5 space-y-12 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('/demo/neural_fashion_forecast_bg_1772532209875.png')] opacity-5 grayscale bg-cover" />
            <div className="absolute inset-0 bg-gradient-to-br from-ffn-primary/10 via-transparent to-transparent" />

            <div className="relative z-10 flex items-end justify-between">
                <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Intelligence Forecast</span>
                    <h2 className="text-4xl font-serif italic text-white leading-none">Neural Trend <br />Projection</h2>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-serif italic text-ffn-primary">+42.8%</div>
                    <div className="text-[8px] font-black uppercase tracking-widest text-gray-500">Projected Liquidity Shift</div>
                </div>
            </div>

            <div className="relative h-64 w-full">
                {/* SVG Chart Overlay */}
                <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Grid lines */}
                    {[25, 50, 75].map(y => (
                        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="white" strokeWidth="0.1" strokeOpacity="0.1" />
                    ))}

                    {/* Main Forecast Path */}
                    <m.path
                        d={`M ${path}`}
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="2"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                    />

                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="100%" stopColor="#EC4899" />
                        </linearGradient>
                    </defs>

                    {/* Glowing Points */}
                    {points.map((p, i) => (
                        <m.circle
                            key={i}
                            cx={(i / (points.length - 1)) * 100}
                            cy={100 - p}
                            r="1.5"
                            fill={i === points.length - 1 ? '#EC4899' : 'white'}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + i * 0.1 }}
                        >
                            {i === points.length - 1 && (
                                <animate attributeName="r" values="1.5;3;1.5" dur="2s" repeatCount="indefinite" />
                            )}
                        </m.circle>
                    ))}
                </svg>

                {/* Data Nodes */}
                <div className="absolute inset-0 flex justify-between items-end pb-4 px-2">
                    {['MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV'].map((month, i) => (
                        <span key={month} className="text-[7px] font-black text-gray-600 tracking-tighter">{month}</span>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                            <Activity className="w-4 h-4 text-ffn-primary" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Confidence Node: 94.2%</span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                        Neural model suggests a massive shift towards organic-brutalism aesthetics in Milan and Tokyo by late Q4.
                    </p>
                </div>
                <div className="space-y-4 text-right">
                    <div className="flex items-center justify-end space-x-3">
                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Risk threshold: Low</span>
                        <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                        Infrastructure liquidity remains stable with high talent availability in core nodes.
                    </p>
                </div>
            </div>
        </div>
    );
};
