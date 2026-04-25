import React from 'react';
import { m } from 'framer-motion';
import { Eye, Bookmark, Briefcase, Zap, TrendingUp, Clock, User as UserIcon, ArrowUpRight, ArrowLeft } from 'lucide-react';
import { CreatorInsights as CreatorInsightsType, ProfileVisitor } from '../types';
import { AdvancedAnalytics } from './AdvancedAnalytics';

interface CreatorInsightsProps {
    insights: CreatorInsightsType;
}

export const CreatorInsights: React.FC<CreatorInsightsProps> = ({ insights }) => {
    const [showAdvanced, setShowAdvanced] = React.useState(false);

    const maxDailyViews = Math.max(...insights.dailyMetrics.map(m => m.views));

    if (showAdvanced) {
        return (
            <div className="space-y-6">
                <button
                    onClick={() => setShowAdvanced(false)}
                    className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-ffn-primary transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> <span>Back to Summary</span>
                </button>
                <AdvancedAnalytics />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header / Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Views', value: insights.totalViews.toLocaleString(), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: 'Profile Saves', value: insights.totalSaves, icon: Bookmark, color: 'text-ffn-primary', bg: 'bg-ffn-primary/10' },
                    { label: 'Direct Hires', value: insights.totalHires, icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                    { label: 'Engagement Rate', value: `${insights.avgEngagementRate}%`, icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
                ].map((stat, i) => (
                    <m.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
                    >
                        <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-1">{stat.label}</p>
                        <h4 className="text-3xl font-serif italic text-ffn-black">{stat.value}</h4>
                    </m.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Engagement Graph (Simple SVG/Div implementation) */}
                <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-serif italic text-ffn-black">Reach & Visibility</h3>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Daily profile views over the last 7 days</p>
                        </div>
                        <div className="flex items-center space-x-2 text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-full">
                            <TrendingUp className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">+12.5%</span>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between items-stretch gap-4 pt-10">
                        {insights.dailyMetrics.map((metric, i) => {
                            const height = (metric.views / maxDailyViews) * 100;
                            const dayName = new Date(metric.date).toLocaleDateString('en-US', { weekday: 'short' });
                            return (
                                <div key={metric.date} className="flex-1 flex flex-col items-center group">
                                    <div className="relative w-full flex-1 flex flex-col justify-end">
                                        <m.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 1, delay: i * 0.1 }}
                                            className="w-full bg-gray-50 group-hover:bg-ffn-primary transition-colors rounded-t-xl relative border-x border-t border-transparent group-hover:border-ffn-primary/20"
                                        >
                                            {/* Tooltip on hover */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-ffn-black text-white text-[9px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 shadow-xl">
                                                {metric.views} Views
                                            </div>
                                        </m.div>
                                    </div>
                                    <p className="text-[9px] font-black tracking-widest text-gray-400 uppercase mt-4">
                                        {dayName}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Visitors */}
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm space-y-8">
                    <div>
                        <h3 className="text-xl font-serif italic text-ffn-black">Recent Activity</h3>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Brands reviewing your profile</p>
                    </div>

                    <div className="space-y-6">
                        {insights.recentVisitors.map((visit, i) => (
                            <m.div
                                key={visit.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (i * 0.1) }}
                                className="flex items-center justify-between group cursor-pointer"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <img
                                            src={visit.visitor.avatarUrl}
                                            alt={visit.visitor.displayName}
                                            className="w-12 h-12 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all shadow-sm"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-gray-100">
                                            {visit.actionTaken === 'HIRE_CLICK' ? (
                                                <Zap className="w-2.5 h-2.5 text-amber-500" />
                                            ) : visit.actionTaken === 'SAVE' ? (
                                                <Bookmark className="w-2.5 h-2.5 text-ffn-primary" />
                                            ) : (
                                                <Eye className="w-2.5 h-2.5 text-blue-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[11px] font-black text-ffn-black group-hover:text-ffn-primary transition-colors">{visit.visitor.displayName}</h4>
                                        <div className="flex items-center space-x-2 mt-0.5">
                                            <Clock className="w-3 h-3 text-gray-300" />
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                {new Date(visit.visitedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {visit.actionTaken === 'HIRE_CLICK' ? 'Clicked Hire' : visit.actionTaken === 'SAVE' ? 'Saved Profile' : 'Viewed Profile'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-gray-200 group-hover:text-ffn-primary transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </m.div>
                        ))}
                    </div>

                    <button
                        onClick={() => setShowAdvanced(true)}
                        className="w-full py-4 border border-gray-100 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:bg-ffn-black hover:text-white transition-all"
                    >
                        View Advanced Analytics
                    </button>
                </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-ffn-black text-white p-12 rounded-[3.5rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-ffn-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />

                <div className="relative flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-xl space-y-4">
                        <div className="flex items-center space-x-3">
                            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-ffn-primary">AI Insight</span>
                            <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest tracking-[0.2em]">Profile Optimization</span>
                        </div>
                        <h3 className="text-3xl font-serif italic">Your engagement is in the top 5% of designers this month.</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Brands are responding positively to your new masterclass listings. Adding a video portfolio could increase your direct hire inquiries by up to <span className="text-ffn-primary font-bold">40%</span>.
                        </p>
                    </div>

                    <button className="whitespace-nowrap bg-ffn-primary text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.35em] hover:bg-white hover:text-ffn-black transition-all shadow-xl shadow-ffn-primary/20">
                        Update Portfolio
                    </button>
                </div>
            </div>
        </div>
    );
};
