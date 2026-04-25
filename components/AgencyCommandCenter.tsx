
import React from 'react';
import { m } from 'framer-motion';
import {
    Briefcase, Users, TrendingUp, ShieldCheck,
    Search, Bell, MoreVertical, LayoutGrid,
    List, Zap, Globe, Activity
} from 'lucide-react';
import { ManagedTalentGrid } from './ManagedTalentGrid';
import { CommissionLedger } from './CommissionLedger';
import { MOCK_AGENCY, MOCK_MANAGED_TALENT, MOCK_AGENCY_COMMISSIONS } from '../constants';

export const AgencyCommandCenter: React.FC = () => {
    return (
        <div className="min-h-screen pb-32">
            {/* Editorial Header */}
            <div className="relative mb-16 md:mb-24 rounded-[3.5rem] md:rounded-[4.5rem] overflow-hidden aspect-[21/9] md:aspect-[21/6]">
                <img
                    src={MOCK_AGENCY.coverImage}
                    className="absolute inset-0 w-full h-full object-cover"
                    alt=""
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/60 to-transparent" />

                <div className="absolute inset-0 p-8 md:p-16 flex flex-col justify-end">
                    <div className="relative flex flex-col md:flex-row items-center md:items-end justify-between gap-8">
                        <div className="flex flex-col md:flex-row items-center md:items-end gap-8">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-2xl backdrop-blur-3xl">
                                <img src={MOCK_AGENCY.logoUrl} className="w-full h-full object-contain p-4" alt="" />
                            </div>
                            <div className="text-center md:text-left space-y-2">
                                <div className="flex items-center justify-center md:justify-start space-x-4">
                                    <h1 className="text-4xl md:text-6xl font-serif italic text-white">{MOCK_AGENCY.name}</h1>
                                    {MOCK_AGENCY.verified && <ShieldCheck className="w-8 h-8 text-ffn-primary" />}
                                </div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                                    <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-ffn-primary">Agency Command Center</p>
                                    <div className="flex items-center space-x-2 text-white/40">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{MOCK_AGENCY.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="px-10 py-4 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-ffn-primary hover:text-white transition-all shadow-2xl">
                                Export Analytics
                            </button>
                            <button
                                title="More Options"
                                className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white hover:bg-white/10 transition-all font-inter"
                            >
                                <MoreVertical className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Node Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                {[
                    { label: 'Managed Nodes', value: MOCK_AGENCY.rosterCount, icon: Users, color: 'text-ffn-primary' },
                    { label: 'Active Protocols', value: MOCK_AGENCY.activeBookings, icon: Activity, color: 'text-ffn-accent' },
                    { label: 'Agency Revenue', value: `₹${(MOCK_AGENCY.totalRevenue / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Network Growth', value: `${MOCK_AGENCY.monthlyGrowth}%`, icon: Zap, color: 'text-blue-500' },
                ].map((stat, i) => (
                    <m.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 backdrop-blur-3xl group hover:bg-white/10 transition-all duration-500"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className={`p-4 rounded-2xl bg-black/40 ${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col text-right">
                                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-500">Mastery Index</span>
                                <span className="text-sm font-serif italic text-white">99.2%</span>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
                            <div className="text-3xl font-serif italic text-white">{stat.value}</div>
                        </div>
                    </m.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-16">
                    <ManagedTalentGrid talents={MOCK_MANAGED_TALENT} />
                    <CommissionLedger commissions={MOCK_AGENCY_COMMISSIONS} />
                </div>

                <div className="lg:col-span-4 space-y-8">
                    <div className="p-10 rounded-[3rem] bg-ffn-secondary border border-white/5 space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-serif italic text-white">System Alerts</h3>
                            <Bell className="w-5 h-5 text-ffn-primary animate-bounce" />
                        </div>
                        <div className="space-y-6">
                            {[
                                { title: 'New Casting Match: Kiara M', time: '2 mins ago', type: 'MATCH' },
                                { title: 'Commission Received: Vogue Project', time: '1 hour ago', type: 'PAYMENT' },
                                { title: 'Kabir V: Mastery History Expiring', time: '3 hours ago', type: 'ALERT' }
                            ].map((alert, i) => (
                                <div key={i} className="flex items-start space-x-4 group cursor-pointer">
                                    <div className="w-1.5 h-12 bg-ffn-primary rounded-full group-hover:h-16 transition-all" />
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-white group-hover:text-ffn-primary transition-colors">{alert.title}</p>
                                        <div className="flex items-center space-x-3 text-[8px] font-black uppercase tracking-widest text-gray-500">
                                            <span>{alert.time}</span>
                                            <span>•</span>
                                            <span>{alert.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors border-t border-white/5 pt-6">
                            View All Activity Protocol
                        </button>
                    </div>

                    <div className="p-10 rounded-[3rem] bg-white text-black space-y-8">
                        <div className="space-y-2">
                            <h3 className="text-xl font-serif italic text-black">Mastery Audit</h3>
                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Roster optimization engine</p>
                        </div>
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Profile Completion</span>
                                    <span className="text-lg font-serif italic">94.2%</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-black w-[94%]" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-baseline">
                                    <span className="text-[10px] font-bold uppercase tracking-tight">Identity Verification</span>
                                    <span className="text-lg font-serif italic">100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-black/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-ffn-primary w-full" />
                                </div>
                            </div>
                        </div>
                        <button className="w-full py-5 bg-black text-white rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-ffn-primary transition-all">
                            Run Roster Simulation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
