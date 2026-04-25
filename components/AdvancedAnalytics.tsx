import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Target, Users, TrendingUp, Activity, BarChart2, PieChart, ArrowUpRight, ArrowDownRight, Share2, Download, Filter, MapPin } from 'lucide-react';

export const AdvancedAnalytics: React.FC = () => {
    const [timeRange, setTimeRange] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');
    const [activeTab, setActiveTab] = useState<'overview' | 'audience' | 'conversion'>('overview');

    // Simulated Data (In a real app, fetch based on timeRange)
    const stats = [
        { label: 'Total Profile Views', value: '45.2K', trend: '+12.4%', positive: true },
        { label: 'Unique Visitors', value: '28.5K', trend: '+8.1%', positive: true },
        { label: 'AR Try-On Initiations', value: '8.4K', trend: '+24.5%', positive: true },
        { label: 'Bounce Rate', value: '34.2%', trend: '-2.1%', positive: true }, // Lower is better
    ];

    const demographicData = [
        { city: 'Mumbai', percentage: 35 },
        { city: 'New Delhi', percentage: 28 },
        { city: 'Bengaluru', percentage: 15 },
        { city: 'London', percentage: 12 },
        { city: 'New York', percentage: 10 },
    ];

    const conversionFunnel = [
        { stage: 'Profile Views', count: 45200, color: 'bg-zinc-800' },
        { stage: 'Active Engagement', count: 22600, color: 'bg-zinc-700' },
        { stage: 'AR Try-On', count: 8400, color: 'bg-ffn-primary' },
        { stage: 'Booking / Inquiry', count: 1250, color: 'bg-emerald-500' },
    ];

    return (
        <div className="space-y-12 animate-in fade-in duration-700 pb-32">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Activity className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Identity Intelligence</span>
                    </div>
                    <h1 className="text-5xl font-serif italic tracking-tighter text-ffn-black">Advanced Analytics.</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="bg-white border border-gray-100 rounded-full flex overflow-hidden shadow-sm p-1">
                        {['7D', '30D', '90D', '1Y'].map(range => (
                            <button
                                key={range}
                                onClick={() => setTimeRange(range as any)}
                                className={`px-6 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${timeRange === range ? 'bg-ffn-black text-white shadow-md' : 'text-gray-400 hover:text-ffn-black'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-ffn-black transition-colors" title="Export Report"><Download className="w-5 h-5" /></button>
                </div>
            </header>

            {/* Primary KPI Cards */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <m.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl group hover:shadow-2xl hover:-translate-y-1 transition-all"
                    >
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6">{stat.label}</p>
                        <div className="flex items-end justify-between">
                            <h3 className="text-4xl font-serif italic text-ffn-black leading-none">{stat.value}</h3>
                            <div className={`flex items-center text-[10px] font-black p-2 rounded-xl ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.positive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                                {stat.trend}
                            </div>
                        </div>
                    </m.div>
                ))}
            </section>

            {/* Detailed Analysis Tabs */}
            <section className="bg-white rounded-[4rem] border border-gray-100 shadow-2xl overflow-hidden p-2">
                <div className="flex border-b border-gray-50 p-6 px-10">
                    {[
                        { id: 'overview', label: 'Performance Overview', icon: BarChart2 },
                        { id: 'audience', label: 'Audience Demographics', icon: Users },
                        { id: 'conversion', label: 'Conversion Funnel', icon: Target },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center space-x-3 px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gray-50 text-ffn-black' : 'text-gray-400 hover:text-ffn-black'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="p-10 min-h-[500px]">
                    <AnimatePresence mode="wait">

                        {/* Overview Widget (Placeholder for complex chart) */}
                        {activeTab === 'overview' && (
                            <m.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-full flex flex-col justify-center items-center text-center space-y-6 py-20">
                                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center">
                                    <TrendingUp className="w-12 h-12 text-gray-200" />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-2xl font-serif italic mb-2">Traffic Trajectory</h3>
                                    <p className="text-sm text-gray-400">Your profile views are up 12% compared to the previous period. The recent AR Try-On addition drove a significant spike in engagement.</p>
                                </div>
                                {/* Simulated Chart Bars */}
                                <div className="flex items-end justify-center space-x-2 h-48 w-full max-w-2xl mt-8">
                                    {[40, 60, 45, 80, 55, 90, 75, 100, 85, 120].map((h, i) => (
                                        <m.div
                                            key={i}
                                            className="w-12 bg-gray-100 rounded-t-xl relative group"
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                        >
                                            <div className="absolute inset-0 bg-ffn-primary opacity-0 group-hover:opacity-100 transition-opacity rounded-t-xl" />
                                        </m.div>
                                    ))}
                                </div>
                            </m.div>
                        )}

                        {/* Audience Demographics */}
                        {activeTab === 'audience' && (
                            <m.div key="audience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                                <div>
                                    <h3 className="text-2xl font-serif italic mb-8">Geographic Heatmap</h3>
                                    <div className="space-y-6">
                                        {demographicData.map((data, idx) => (
                                            <div key={idx} className="space-y-2">
                                                <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest text-ffn-black">
                                                    <span className="flex items-center"><MapPin className="w-3 h-3 mr-2 text-gray-400" /> {data.city}</span>
                                                    <span>{data.percentage}%</span>
                                                </div>
                                                <div className="h-3 w-full bg-gray-50 rounded-full overflow-hidden">
                                                    <m.div
                                                        className="h-full bg-gradient-to-r from-ffn-black to-ffn-primary"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${data.percentage}%` }}
                                                        transition={{ duration: 1, ease: 'easeOut' }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-[3rem] p-12 flex flex-col justify-center items-center text-center">
                                    <PieChart className="w-16 h-16 text-gray-200 mb-6" />
                                    <h4 className="text-xl font-serif italic mb-2">Audience Segmentation</h4>
                                    <p className="text-sm text-gray-400 max-w-xs">Detailed age and gender grouping data is currently compiling for the selected time range.</p>
                                </div>
                            </m.div>
                        )}

                        {/* Conversion Funnel */}
                        {activeTab === 'conversion' && (
                            <m.div key="conversion" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl mx-auto py-10">
                                <h3 className="text-2xl font-serif italic mb-12 text-center">Engagement to Booking Pathway</h3>
                                <div className="space-y-4">
                                    {conversionFunnel.map((step, idx) => {
                                        // Calculate width relative to the first (max) step
                                        const widthPercent = (step.count / conversionFunnel[0].count) * 100;
                                        const dropoff = idx > 0 ? ((conversionFunnel[idx - 1].count - step.count) / conversionFunnel[idx - 1].count * 100).toFixed(1) : null;

                                        return (
                                            <div key={idx} className="relative flex items-center justify-center">
                                                {/* Dropoff Indicator */}
                                                {dropoff && (
                                                    <div className="absolute right-0 translate-x-full ml-8 text-[10px] font-black text-red-400 flex items-center">
                                                        <ArrowDownRight className="w-3 h-3 mr-1" /> {dropoff}% Drop
                                                    </div>
                                                )}

                                                <m.div
                                                    className={`h-24 ${step.color} rounded-2xl flex items-center justify-between px-8 text-white shadow-xl relative z-10`}
                                                    initial={{ width: 0, opacity: 0 }}
                                                    animate={{ width: `${Math.max(widthPercent, 20)}%`, opacity: 1 }}
                                                    transition={{ duration: 0.8, delay: idx * 0.2 }}
                                                >
                                                    <span className="text-xs font-bold uppercase tracking-widest truncate max-w-[50%]">{step.stage}</span>
                                                    <span className="text-2xl font-serif italic">{step.count.toLocaleString()}</span>
                                                </m.div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </m.div>
                        )}

                    </AnimatePresence>
                </div>
            </section>

        </div>
    );
};
