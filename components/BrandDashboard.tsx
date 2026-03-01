import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Users, Briefcase, Bookmark, Settings, Plus,
    Filter, MapPin, Star, ShieldCheck, CheckCircle, Zap,
    Loader2, Building2, TrendingUp, UserPlus, CreditCard
} from 'lucide-react';
import { User } from '../types';
import { supabase } from '../supabase';
import { PRICING } from '../constants';
import { PayPalButton } from './PayPalButton';

interface BrandDashboardProps {
    user: any;
    onLogout: () => void;
}

export const BrandDashboard: React.FC<BrandDashboardProps> = ({ user, onLogout }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'search' | 'castings' | 'subscription'>('overview');
    const [activePlanBox, setActivePlanBox] = useState<string | null>(null);
    const [isSubscribing, setIsSubscribing] = useState<string | null>(null);

    const stats = [
        { label: 'Active Castings', value: '3', icon: Briefcase, color: 'text-ffn-primary' },
        { label: 'Saved Talent', value: '42', icon: Bookmark, color: 'text-blue-500' },
        { label: 'Profile Views', value: '1.2k', icon: Users, color: 'text-emerald-500' },
        { label: 'Network Rank', value: 'Top 5%', icon: TrendingUp, color: 'text-ffn-accent' },
    ];

    const handlePayPalSuccess = async (planId: string, orderId: string) => {
        setIsSubscribing(planId);
        try {
            // Simulate backend verification
            await new Promise(resolve => setTimeout(resolve, 2000));
            alert(`Success! Your Brand Profile is now seamlessly upgraded to ${planId}.`);
            setActivePlanBox(null);
        } catch (err: any) {
            alert('Subscription verification failed. Please contact support.');
        } finally {
            setIsSubscribing(null);
        }
    };

    return (
        <div className="space-y-16 animate-in fade-in duration-700 pb-32">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-ffn-primary">
                        <Building2 className="w-5 h-5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Brand Operations HUB</span>
                    </div>
                    <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Brand Terminal.</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={onLogout} className="px-8 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-ffn-accent transition-all shadow-xl">Protocol Exit</button>
                </div>
            </header>

            {/* Analytics Snapshot */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-10 rounded-[3rem] border border-gray-50 shadow-lg group hover:shadow-2xl transition-all">
                        <div className={`w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color} mb-8 group-hover:scale-110 transition-transform shadow-inner`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
                        <p className="text-4xl font-serif italic text-ffn-black leading-none">{stat.value}</p>
                    </div>
                ))}
            </section>

            <div className="flex space-x-12 border-b border-gray-100 pb-4 overflow-x-auto scrollbar-hide">
                {[
                    { id: 'overview', label: 'Company Profile', icon: Building2 },
                    { id: 'search', label: 'Talent Discovery', icon: Search },
                    { id: 'castings', label: 'Casting Calls', icon: Briefcase },
                    { id: 'subscription', label: 'Brand Subscription', icon: CreditCard },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab.id ? 'text-ffn-black' : 'text-gray-400'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                        {activeTab === tab.id && <motion.div layoutId="brandTabLine" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-ffn-black" />}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-xl space-y-8">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-4xl font-serif italic text-ffn-black">Condé Nast India</h2>
                                <p className="text-sm text-gray-400 mt-2">Verified Enterprise Partner</p>
                            </div>
                            <button className="px-6 py-3 bg-gray-50 text-ffn-black rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-gray-100">Edit Profile</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                            <div className="space-y-2"><p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Industry</p><p className="font-serif italic text-xl">Media & Publishing</p></div>
                            <div className="space-y-2"><p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Headquarters</p><p className="font-serif italic text-xl">Mumbai, India</p></div>
                            <div className="space-y-2"><p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Website</p><p className="font-serif italic text-xl text-ffn-primary">condenast.in</p></div>
                        </div>
                    </motion.div>
                )}

                {activeTab === 'search' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input type="text" placeholder="Search models, photographers, stylists..." className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-6 text-sm shadow-sm focus:ring-2 focus:ring-ffn-primary/20 transition-all outline-none" />
                            </div>
                            <button className="px-8 py-6 bg-white border border-gray-100 rounded-[2rem] text-ffn-black flex items-center space-x-3 shadow-sm hover:bg-gray-50 transition-all">
                                <Filter className="w-5 h-5" /> <span className="text-[10px] uppercase tracking-widest font-black">Filters</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-xl group">
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        <img src={`https://i.pravatar.cc/300?img=${i + 10}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" alt="" />
                                        <button title="Save Talent" className="absolute top-4 right-4 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-ffn-black transition-all">
                                            <Bookmark className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <div className="p-8 space-y-4">
                                        <div>
                                            <h4 className="text-xl font-serif italic font-bold">Talent Name {i}</h4>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">Fashion Model • Mumbai</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="flex items-center text-[9px] uppercase tracking-widest font-black text-ffn-primary bg-ffn-primary/10 px-3 py-1.5 rounded-full"><Star className="w-3 h-3 mr-1 fill-current" /> 4.9</span>
                                            <span className="flex items-center text-[9px] uppercase tracking-widest font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full"><ShieldCheck className="w-3 h-3 mr-1" /> Verified</span>
                                        </div>
                                        <button className="w-full py-4 mt-4 bg-gray-50 rounded-2xl text-[10px] uppercase font-bold tracking-widest hover:bg-ffn-black hover:text-white transition-all">View Profile</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'castings' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                        <div className="flex justify-between items-center bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                            <h3 className="text-2xl font-serif italic px-4">Manage Castings</h3>
                            <button className="px-8 py-4 bg-ffn-primary text-white rounded-full flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest shadow-lg shadow-ffn-primary/20 hover:scale-105 transition-all">
                                <Plus className="w-4 h-4" /> <span>New Casting</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {[1, 2].map(i => (
                                <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-md flex flex-col md:flex-row justify-between md:items-center gap-6">
                                    <div className="space-y-2">
                                        <div className="flex items-center space-x-4">
                                            <h4 className="text-xl font-serif italic text-ffn-black font-bold">Summer Editorial Campaign</h4>
                                            <span className="text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-widest font-black">Active</span>
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 flex items-center"><MapPin className="w-3 h-3 mr-2" /> Mumbai • 12 Applicants</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-6 py-3 bg-gray-50 text-ffn-black rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-gray-100 transition-all">View Applicants</button>
                                        <button className="px-6 py-3 bg-ffn-black text-white rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-ffn-primary transition-all">Edit</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'subscription' && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-4xl font-serif italic text-ffn-black">Brand Pro Plans</h2>
                            <p className="text-gray-400 text-sm max-w-lg mx-auto">Scale your talent discovery and casting operations with our elite enterprise tools.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {[
                                { id: 'BRAND_PRO', label: 'Agency Pro', price: 4999, features: ['Unlimited Casting Posts', 'Advanced AI Talent Matching', 'Direct Escrow Booking', 'Priority Support'] },
                                { id: 'BRAND_ENTERPRISE', label: 'Enterprise Network', price: 14999, features: ['Everything in Pro', 'Custom API Access', 'Dedicated Account Manager', 'White-label Casting Portal'] },
                            ].map((plan, i) => (
                                <div key={i} className={`p-12 rounded-[3.5rem] border shadow-2xl flex flex-col justify-between space-y-10 group transition-all ${plan.id === 'BRAND_ENTERPRISE' ? 'bg-ffn-black text-white border-ffn-black' : 'bg-white border-gray-100'}`}>
                                    <div className="space-y-6">
                                        <h3 className="text-3xl font-serif italic">{plan.label}</h3>
                                        <div className="flex items-end space-x-2">
                                            <p className="text-6xl font-serif font-bold tracking-tighter">{PRICING.CURRENCY}{plan.price}</p>
                                            <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">/ month</p>
                                        </div>
                                        <ul className="space-y-4 pt-4 border-t border-gray-100/20">
                                            {plan.features.map((f, j) => (
                                                <li key={j} className="flex items-center space-x-3 text-[10px] uppercase font-black tracking-widest opacity-80">
                                                    <CheckCircle className={`w-4 h-4 ${plan.id === 'BRAND_ENTERPRISE' ? 'text-ffn-primary' : 'text-emerald-500'}`} />
                                                    <span>{f}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {activePlanBox === plan.id ? (
                                        <div className="mt-4 animate-in fade-in zoom-in duration-300">
                                            <PayPalButton
                                                amount={(plan.price / 80).toFixed(2)} // Approximate INR to USD
                                                currency="USD"
                                                type="capture"
                                                onSuccess={(data) => handlePayPalSuccess(plan.id, data.id)}
                                            />
                                            <button
                                                onClick={() => setActivePlanBox(null)}
                                                className="w-full mt-4 py-3 text-[10px] uppercase font-bold text-gray-400 hover:text-ffn-primary transition-colors"
                                            >
                                                Cancel Checkout
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setActivePlanBox(plan.id)}
                                            disabled={!!isSubscribing}
                                            className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all flex items-center justify-center space-x-3 ${plan.id === 'BRAND_ENTERPRISE' ? 'bg-white text-ffn-black hover:bg-ffn-primary hover:text-white' : 'bg-ffn-black text-white hover:bg-ffn-primary'}`}
                                        >
                                            {isSubscribing === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                            <span>{isSubscribing === plan.id ? 'Syncing...' : 'Upgrade Now'}</span>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
