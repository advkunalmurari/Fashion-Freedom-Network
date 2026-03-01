
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Grid, Bookmark, Briefcase, Heart, MessageCircle,
  TrendingUp, ShieldCheck, DollarSign, Users, Award, Edit3, Camera, Plus, X, Upload, Globe, Zap, Sparkles,
  BarChart3, FileCheck, CreditCard, ChevronRight, PieChart, MousePointer2, Search, Loader2, CheckCircle
} from 'lucide-react';
import { ProfileHero } from './ProfileHero';
import { PRICING } from '../constants';
import { SubscriptionType } from '../types';
import { supabase } from '../supabase';
import { PayPalButton } from './PayPalButton';

export const MyProfile: React.FC<{ user: any; onLogout: () => void }> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'marketing' | 'analytics'>('overview');
  const [isSubscribing, setIsSubscribing] = useState<SubscriptionType | null>(null);
  const [activePlanBox, setActivePlanBox] = useState<SubscriptionType | null>(null);
  const [activeBoostBox, setActiveBoostBox] = useState(false);
  const [activeSpotBox, setActiveSpotBox] = useState(false);

  const stats = [
    { label: 'Profile Views', value: '4,820', icon: EyeIcon, color: 'text-ffn-primary' },
    { label: 'Search Indexing', value: '842', icon: Search, color: 'text-blue-500' },
    { label: 'Network Reach', value: '12.4k', icon: Users, color: 'text-emerald-500' },
    { label: 'Direct Inquiries', value: '28', icon: MessageCircle, color: 'text-ffn-accent' },
  ];

  const handlePayPalSuccess = async (type: SubscriptionType, orderId: string) => {
    setIsSubscribing(type);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please login to finalize subscription.');
        return;
      }

      const res = await fetch('http://localhost:5001/api/payments/verify-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          planId: type,
          paymentId: orderId
        })
      });

      const data = await res.json();
      if (data.success) {
        alert(`Success! Your profile is now seamlessly upgraded to ${type}. Please refresh the page to load your new Trust Badge and Dashboard.`);
        setActivePlanBox(null);
      } else {
        alert(`Payment verified but profile upgrade failed: ${data.message}. Please contact FFN Support.`);
      }
    } catch (err: any) {
      console.error('Subscription verification failed:', err);
      alert('Network error verifying your subscription.');
    } finally {
      setIsSubscribing(null);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-ffn-primary">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Identity Infrastructure HUB</span>
          </div>
          <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Master Identity</h1>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setActiveTab('analytics')} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-ffn-black transition-colors"><BarChart3 className="w-6 h-6" /></button>
          <button onClick={onLogout} className="px-8 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-ffn-accent transition-all shadow-xl">Protocol Exit</button>
        </div>
      </header>

      {/* Analytics Snapshot (SECTION 8) */}
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

      <div className="flex space-x-12 border-b border-gray-100 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: Grid },
          { id: 'analytics', label: 'Analytics Dashboard', icon: BarChart3 },
          { id: 'marketing', label: 'Monetization & Subs', icon: Zap },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center space-x-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-ffn-black' : 'text-gray-400'}`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {activeTab === tab.id && <motion.div layoutId="profileTabLine" className="absolute bottom-[-17px] left-0 right-0 h-0.5 bg-ffn-black" />}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
            <div className="bg-white rounded-[4rem] p-12 border border-gray-100 shadow-xl relative overflow-hidden"><ProfileHero user={user} /></div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <div className="bg-ffn-black text-white p-16 rounded-[4rem] shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ffn-primary/10 blur-[120px] rounded-full animate-float" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <h3 className="text-4xl font-serif italic tracking-tight">Identity Intelligence</h3>
                    <p className="text-white/40 font-light leading-relaxed">Your professional node rank is currently <span className="text-white font-bold">#42</span> in Mumbai.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2"><p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Click-through Rate</p><p className="text-3xl font-serif italic">12.4%</p></div>
                    <div className="space-y-2"><p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Booking Score</p><p className="text-3xl font-serif italic">94.2</p></div>
                  </div>
                </div>
                <div className="bg-white/5 backdrop-blur-md rounded-[3rem] p-12 border border-white/10 flex items-center justify-center">
                  <PieChart className="w-32 h-32 text-ffn-primary opacity-50" />
                  <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60 absolute bottom-10">Advanced Data Protocol Activated</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'marketing' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-16">
            {/* Subscriptions Grid (SECTION 4) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { type: SubscriptionType.BASIC, label: 'Basic Hub', price: PRICING.SUBSCRIPTION[SubscriptionType.BASIC], features: ['Standard Profile', 'Community Access'] },
                { type: SubscriptionType.PROFESSIONAL, label: 'Professional Pro', price: PRICING.SUBSCRIPTION[SubscriptionType.PROFESSIONAL], features: ['Higher Ranking', 'Detailed Analytics', 'Verified Badge Eligibility'] },
                { type: SubscriptionType.PREMIUM, label: 'Premium Executive', price: PRICING.SUBSCRIPTION[SubscriptionType.PREMIUM], features: ['Priority Casting Visibility', 'Agent Access', 'Unlimited Portfolios'] }
              ].map((plan, i) => (
                <div key={i} className={`p-12 rounded-[3.5rem] border shadow-xl flex flex-col justify-between space-y-10 group transition-all ${plan.type === SubscriptionType.PREMIUM ? 'bg-ffn-black text-white border-ffn-black' : 'bg-white border-gray-100'}`}>
                  <div className="space-y-6">
                    <h3 className="text-2xl font-serif italic">{plan.label}</h3>
                    <div className="flex items-end space-x-2">
                      <p className="text-6xl font-serif font-bold tracking-tighter">{PRICING.CURRENCY}{plan.price}</p>
                      <p className="text-[10px] font-black opacity-40 uppercase tracking-widest mb-2">/ month</p>
                    </div>
                    <ul className="space-y-4">
                      {plan.features.map((f, j) => (
                        <li key={j} className="flex items-center space-x-3 text-[10px] uppercase font-black tracking-widest opacity-60">
                          <CheckCircle className={`w-4 h-4 ${plan.type === SubscriptionType.PREMIUM ? 'text-ffn-primary' : 'text-ffn-primary'}`} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {activePlanBox === plan.type && plan.price > 0 ? (
                    <div className="mt-4 animate-in fade-in zoom-in duration-300">
                      <PayPalButton
                        amount={(plan.price / 80).toFixed(2)} // Approximate INR to USD for Sandbox testing
                        currency="USD"
                        type="capture"
                        onSuccess={(data) => handlePayPalSuccess(plan.type, data.id)}
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
                      onClick={() => plan.price === 0 ? handlePayPalSuccess(plan.type, 'FREE_TIER_UPDATE') : setActivePlanBox(plan.type)}
                      disabled={!!isSubscribing}
                      className={`w-full py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] transition-all shadow-lg flex items-center justify-center space-x-3 ${plan.type === SubscriptionType.PREMIUM ? 'bg-white text-ffn-black hover:bg-ffn-primary hover:text-white' : 'bg-ffn-black text-white hover:bg-ffn-primary'}`}
                    >
                      {isSubscribing === plan.type ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 text-ffn-accent" />}
                      <span>{isSubscribing === plan.type ? 'Syncing...' : 'Activate Plan'}</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
              <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl flex flex-col justify-between space-y-10 transition-all">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-ffn-primary"><Plus className="w-8 h-8" /><span className="text-xs uppercase tracking-[0.5em] font-black">Visibility Boost</span></div>
                  <h3 className="text-4xl font-serif italic text-ffn-black">Global <br /> Profile Boost.</h3>
                  <p className="text-gray-400 font-light">Appear top of search results for 30 days.</p>
                </div>
                {activeBoostBox ? (
                  <div className="mt-4 animate-in fade-in zoom-in duration-300">
                    <PayPalButton
                      amount={(PRICING.PROFILE_BOOST / 80).toFixed(2)}
                      currency="USD"
                      type="capture"
                      onSuccess={(data) => {
                        alert(`Success! Profile Boost secured via Order ${data.id}.`);
                        setActiveBoostBox(false);
                      }}
                    />
                    <button onClick={() => setActiveBoostBox(false)} className="w-full mt-4 py-3 text-[10px] uppercase font-bold text-gray-400 hover:text-ffn-primary transition-colors">Cancel Checkout</button>
                  </div>
                ) : (
                  <button onClick={() => setActiveBoostBox(true)} className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-xs font-black uppercase tracking-[0.5em] shadow-xl hover:bg-ffn-primary transition-all">Activate Boost — {PRICING.CURRENCY}{PRICING.PROFILE_BOOST}</button>
                )}
              </div>

              <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl flex flex-col justify-between space-y-10 transition-all">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-ffn-accent"><Sparkles className="w-8 h-8" /><span className="text-xs uppercase tracking-[0.5em] font-black">Home Feature</span></div>
                  <h3 className="text-4xl font-serif italic text-ffn-black">Editorial <br /> Homepage Spot.</h3>
                  <p className="text-gray-400 font-light">Claim a headliner spot on the FFN Homepage.</p>
                </div>
                {activeSpotBox ? (
                  <div className="mt-4 animate-in fade-in zoom-in duration-300">
                    <PayPalButton
                      amount={(PRICING.FEATURED_HOME / 80).toFixed(2)}
                      currency="USD"
                      type="capture"
                      onSuccess={(data) => {
                        alert(`Success! Editorial Spot claimed via Order ${data.id}.`);
                        setActiveSpotBox(false);
                      }}
                    />
                    <button onClick={() => setActiveSpotBox(false)} className="w-full mt-4 py-3 text-[10px] uppercase font-bold text-gray-400 hover:text-ffn-primary transition-colors">Cancel Checkout</button>
                  </div>
                ) : (
                  <button onClick={() => setActiveSpotBox(true)} className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-xs font-black uppercase tracking-[0.5em] shadow-xl hover:bg-ffn-primary transition-all">Claim Spot — {PRICING.CURRENCY}{PRICING.FEATURED_HOME}</button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const EyeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
