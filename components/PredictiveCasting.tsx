import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    TrendingUp, Target, Users, Zap, Brain, ArrowRight,
    BarChart3, PieChart, Activity, Info, X, CheckCircle2,
    AlertCircle, Sparkles
} from 'lucide-react';
import { User } from '../types';
import { MOCK_TALENT_POOL } from '../constants';

interface PredictiveCastingProps {
    selectedTalentIds?: string[];
    onClose?: () => void;
}

interface SimulationMetrics {
    successProbability: number;
    predictedROI: number;
    audienceReach: number;
    brandAlignment: number;
    engagementForecast: number;
}

export const PredictiveCasting: React.FC<PredictiveCastingProps> = ({ selectedTalentIds = [], onClose }) => {
    const [isSimulating, setIsSimulating] = useState(true);
    const [metrics, setMetrics] = useState<SimulationMetrics | null>(null);

    useEffect(() => {
        // Stimulate simulation delay
        const timer = setTimeout(() => {
            const selectedTalent = MOCK_TALENT_POOL.filter(t => selectedTalentIds.includes(t.id));
            const avgReliability = selectedTalent.length > 0
                ? selectedTalent.reduce((acc, t) => acc + (t.stats?.reliability || 85), 0) / selectedTalent.length
                : 85;

            setMetrics({
                successProbability: Math.min(98, 75 + Math.random() * 20),
                predictedROI: 2.5 + Math.random() * 4.5,
                audienceReach: 125000 + Math.floor(Math.random() * 500000),
                brandAlignment: 88 + Math.random() * 10,
                engagementForecast: 4.2 + Math.random() * 3.8
            });
            setIsSimulating(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [selectedTalentIds]);

    const MetricCard = ({ label, value, icon: Icon, unit = '' }: { label: string; value: string | number; icon: any; unit?: string }) => (
        <div className="bg-white/50 backdrop-blur-md border border-white/20 p-6 rounded-3xl hover:shadow-lg transition-all border-b-4 border-b-ffn-primary/20">
            <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-gray-50 rounded-xl">
                    <Icon className="w-5 h-5 text-gray-400" />
                </div>
            </div>
            <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-1">{label}</p>
            <h4 className="text-2xl font-serif font-bold text-ffn-black">{value}{unit}</h4>
        </div>
    );

    return (
        <div className="bg-white rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-10 border-b border-gray-50 bg-gradient-to-r from-gray-50/50 to-white flex justify-between items-center">
                <div>
                    <div className="flex items-center space-x-2 text-ffn-primary mb-2">
                        <Brain className="w-5 h-5" />
                        <span className="text-[10px] uppercase tracking-[0.3em] font-black">AI Predictive Suite</span>
                    </div>
                    <h2 className="text-4xl font-serif italic font-bold text-ffn-black">Campaign Simulation</h2>
                    <p className="text-sm text-gray-500 mt-2">Forecasting performance data for your selected talent ensemble.</p>
                </div>
                {onClose && (
                    <button
                        title="Close Simulation"
                        onClick={onClose}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-ffn-black transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                )}
            </div>

            <div className="p-10">
                <AnimatePresence mode="wait">
                    {isSimulating ? (
                        <m.div
                            key="simulating"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-20 flex flex-col items-center justify-center space-y-8"
                        >
                            <div className="relative">
                                <m.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    className="w-32 h-32 border-t-4 border-l-4 border-ffn-primary rounded-full"
                                />
                                <m.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-4 border-b-4 border-r-4 border-gray-200 rounded-full"
                                />
                                <Brain className="absolute inset-0 m-auto w-10 h-10 text-ffn-black animate-pulse" />
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-serif italic font-bold">Analysing Market Intersections</h3>
                                <p className="text-sm text-gray-400">Processing reach across {selectedTalentIds.length || 12} content nodes...</p>
                            </div>
                        </m.div>
                    ) : metrics && (
                        <m.div
                            key="results"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-12"
                        >
                            {/* Main Probability Hero */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                <div className="lg:col-span-1 flex flex-col items-center justify-center p-10 bg-ffn-black rounded-[3rem] text-white overflow-hidden relative group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-ffn-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <div className="relative z-10 text-center">
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-ffn-primary font-black mb-4">Probability of Success</p>
                                        <h3 className="text-7xl font-serif font-bold mb-4">{metrics.successProbability}%</h3>
                                        <div className="flex items-center justify-center space-x-2 px-6 py-2 bg-ffn-primary/20 rounded-full">
                                            <Sparkles className="w-4 h-4 text-ffn-primary" />
                                            <span className="text-[10px] uppercase font-black tracking-widest">Optimized Ensemble</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <MetricCard label="Predicted ROI" value={metrics.predictedROI} unit="x" icon={TrendingUp} />
                                    <MetricCard label="Est. Reach" value={(metrics.audienceReach / 1000).toFixed(0)} unit="k" icon={Users} />
                                    <MetricCard label="Brand Alignment" value={metrics.brandAlignment.toFixed(0)} unit="%" icon={Target} />
                                    <MetricCard label="Engagement" value={metrics.engagementForecast.toFixed(1)} unit="%" icon={Activity} />
                                </div>
                            </div>

                            {/* Secondary Analysis */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-8 bg-gray-50 rounded-[3rem]">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Activity className="w-5 h-5 text-ffn-black" />
                                        <h4 className="font-bold font-serif italic">Performance Narrative</h4>
                                    </div>
                                    <ul className="space-y-4">
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <p className="text-sm text-gray-600">High visual consistency across selected talent nodes (+{metrics.brandAlignment.toFixed(0)}%).</p>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                            <p className="text-sm text-gray-600">Reach expansion into Tier-1 luxury demographics via collaborative overlap.</p>
                                        </li>
                                        <li className="flex items-start space-x-3">
                                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
                                            <p className="text-sm text-gray-600">Peak saturation predicted for week 3. Recommend staggered delivery.</p>
                                        </li>
                                    </ul>
                                </div>

                                <div className="p-8 bg-gray-50 rounded-[3rem] overflow-hidden relative">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <BarChart3 className="w-5 h-5 text-ffn-black" />
                                        <h4 className="font-bold font-serif italic">ROI Multiplier Forecast</h4>
                                    </div>
                                    <div className="h-32 flex items-end justify-between gap-1">
                                        {[40, 65, 45, 80, 55, 90, 70, 85, 95].map((h, i) => (
                                            <m.div
                                                key={i}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${h}%` }}
                                                transition={{ delay: i * 0.1, duration: 1 }}
                                                className="w-full bg-ffn-primary/20 rounded-t-lg relative group"
                                            >
                                                <div className="absolute inset-0 bg-ffn-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-bottom" />
                                            </m.div>
                                        ))}
                                    </div>
                                    <div className="flex justify-between mt-4">
                                        <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Week 1</span>
                                        <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Week 12</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="flex items-center justify-between p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm">
                                <div className="flex items-center space-x-4">
                                    <Info className="w-5 h-5 text-gray-400" />
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 max-w-xs">Values are based on real-time market data and historical performance indices.</p>
                                </div>
                                <div className="flex space-x-4">
                                    <button className="px-8 py-4 border border-gray-200 rounded-full text-[10px] uppercase font-black tracking-widest hover:bg-gray-50 transition-all">
                                        Download Report
                                    </button>
                                    <button className="px-8 py-4 bg-ffn-black text-white rounded-full flex items-center space-x-3 text-[10px] uppercase font-black tracking-widest hover:bg-ffn-primary transition-all shadow-xl group">
                                        <span>Confirm Ensemble</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
