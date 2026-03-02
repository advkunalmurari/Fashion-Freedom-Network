
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings, Grid, Bookmark, Briefcase, Heart, MessageCircle,
  TrendingUp, ShieldCheck, DollarSign, Users, Award, Edit3, Camera, Plus, X, Upload, Globe, Zap, Sparkles,
  BarChart3, FileCheck, CreditCard, ChevronRight, PieChart, MousePointer2, Search, Loader2, CheckCircle,
  Lock, LogOut, Moon, Sun, Maximize2, Activity, Bell, Eye, EyeOff
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

  // Phase 35 States
  const [showSettings, setShowSettings] = useState(false);
  const [isLiveNode, setIsLiveNode] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

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
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 py-10">
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 text-ffn-primary">
              <Award className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em]">Identity Infrastructure HUB</span>
            </div>
            <motion.div
              onClick={() => setIsLiveNode(!isLiveNode)}
              className={`flex items-center space-x-3 px-6 py-2 rounded-full cursor-pointer border transition-all ${isLiveNode ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-ffn-black/5 border-ffn-black/10 text-gray-400'}`}
            >
              <div className={`w-2 h-2 rounded-full ${isLiveNode ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">{isLiveNode ? 'Live Node' : 'Ghost Mode'}</span>
            </motion.div>
          </div>
          <h1 className="text-7xl font-serif italic tracking-tighter text-ffn-black leading-none">Master Identity</h1>
        </div>
        <div className="flex items-center space-x-5">
          <button
            onClick={() => setActiveTab('analytics')}
            className="p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm text-gray-400 hover:text-ffn-black hover:border-ffn-black/20 hover:shadow-xl transition-all group"
            title="Analytics Protocol"
          >
            <BarChart3 className="w-6 h-6 transition-transform group-hover:scale-110" />
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-5 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm text-gray-400 hover:text-ffn-black hover:border-ffn-black/20 hover:shadow-xl transition-all group"
            title="Settings Protocol"
          >
            <Settings className="w-6 h-6 transition-transform group-hover:rotate-45" />
          </button>
          <button
            onClick={() => setShowExitConfirm(true)}
            className="px-10 py-5 bg-ffn-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-ffn-accent transition-all shadow-2xl flex items-center space-x-4"
          >
            <span>Protocol Exit</span>
            <LogOut className="w-4 h-4" />
          </button>
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

      <div className="flex space-x-12 border-b border-gray-100 pb-4 overflow-x-auto scrollbar-hide">
        {[
          { id: 'overview', label: 'Overview', icon: Grid },
          { id: 'business', label: 'Professional Profile', icon: Briefcase },
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

        {activeTab === 'business' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-ffn-primary/10 rounded-2xl flex items-center justify-center text-ffn-primary">
                    <Award className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-serif italic text-ffn-black">Skills & Specialties</h3>
                </div>
                <div className="flex flex-wrap gap-4">
                  {(user.skills && user.skills.length > 0) ? (
                    user.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-6 py-3 bg-gray-50 text-ffn-black rounded-full text-xs font-black uppercase tracking-widest border border-gray-200">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 italic font-light">No specialties configured yet.</p>
                  )}
                </div>
              </div>

              <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-serif italic text-ffn-black">Booking Rates</h3>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Daily Rate</span>
                    <span className="text-2xl font-serif italic font-bold text-emerald-600">{user.currency || 'INR'} {user.dailyRate || '15,000'}</span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Hourly Rate</span>
                    <span className="text-2xl font-serif italic font-bold text-emerald-600">{user.currency || 'INR'} {user.hourlyRate || '2,500'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-12">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-ffn-primary/10 rounded-2xl flex items-center justify-center text-ffn-primary">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-serif italic text-ffn-black">Portfolio Intelligence</h3>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Verified Professional Proof</p>
                  </div>
                </div>
                <button className="flex items-center space-x-3 px-6 py-3 bg-ffn-black text-white rounded-full text-[9px] uppercase font-black tracking-widest hover:bg-ffn-primary transition-all">
                  <Plus className="w-3 h-3" /> <span>Submit Credit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { title: "Vogue India Summer", span: "col-span-1 row-span-2", img: "/placeholder.svg?height=800&width=600", badge: "Verified" },
                  { title: "Lakmé Fashion Week", span: "col-span-1 row-span-1", img: "/placeholder.svg?height=400&width=600", badge: "Pending" },
                  { title: "Harper's Bazaar", span: "col-span-1 row-span-1", img: "/placeholder.svg?height=400&width=600", badge: "Verified" },
                  { title: "Dior Global Campaign", span: "col-span-2 row-span-1", img: "/placeholder.svg?height=400&width=1200", badge: "Elite" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className={`relative rounded-[2.5rem] overflow-hidden group border border-gray-100 bg-gray-50 ${item.span}`}
                  >
                    <img src={item.img} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ffn-primary mb-2">{item.badge}</p>
                      <h4 className="text-xl font-serif italic text-white">{item.title}</h4>
                    </div>
                    {item.badge === "Verified" && <div className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30"><CheckCircle className="w-4 h-4 text-white" /></div>}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
            <div className="bg-ffn-black text-white p-16 rounded-[4rem] shadow-3xl relative overflow-hidden">
              {/* Scanning Overlay Animation */}
              <motion.div
                animate={{ y: [0, 400, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-ffn-primary to-transparent opacity-20 z-20"
              />

              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ffn-primary/10 blur-[120px] rounded-full animate-float" />
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-20">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 mb-4">
                      <Activity className="w-5 h-5 text-ffn-primary animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/40">Identity Intelligence Scan</span>
                    </div>
                    <h3 className="text-5xl font-serif italic tracking-tight">Computational <span className="text-ffn-primary">Reach</span></h3>
                    <p className="text-white/40 font-light leading-relaxed max-w-sm">Your node is processing <span className="text-white font-bold">8.4M data points</span>. Efficiency is at tactical peak levels.</p>
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5">
                    <div className="space-y-2">
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Market Influence</p>
                      <p className="text-4xl font-serif italic">+24%</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-white/40 uppercase font-black tracking-widest">Trust Quotient</p>
                      <p className="text-4xl font-serif italic">9.8/10</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-3xl rounded-[3rem] p-12 border border-white/10 flex flex-col items-center justify-center space-y-8">
                  <div className="relative">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-48 h-48 border border-ffn-primary/20 rounded-full border-dashed"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-4 border border-white/10 rounded-full border-dashed"
                    />
                    <PieChart className="w-24 h-24 text-white absolute inset-0 m-auto opacity-20" />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 m-auto w-4 h-4 bg-ffn-primary rounded-full shadow-[0_0_20px_rgba(255,107,0,0.8)]"
                    />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-[10px] uppercase tracking-[0.4em] font-black text-white/60">Optimization Phase: 04</p>
                    <p className="text-[9px] text-ffn-primary uppercase font-bold">Strategic Calibration Active</p>
                  </div>
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

      {/* Settings Protocol Drawer */}
      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSettings(false)}
              className="fixed inset-0 bg-ffn-black/60 backdrop-blur-xl z-[200]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-xl bg-white shadow-[-50px_0_100px_rgba(0,0,0,0.3)] z-[201] overflow-y-auto"
            >
              <div className="p-16 space-y-16">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h2 className="text-5xl font-serif italic text-ffn-black">Settings <span className="text-ffn-primary">Protocol</span></h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Granular Identity Control v3.5</p>
                  </div>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-4 rounded-full hover:bg-gray-100 transition-colors"
                    title="Close Settings"
                  >
                    <X className="w-8 h-8 text-ffn-black" />
                  </button>
                </div>

                <div className="space-y-12">
                  <section className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-ffn-primary border-b border-gray-100 pb-4">Privacy & Visibility</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-ffn-black">Stealth Mode</p>
                          <p className="text-[10px] text-gray-400">Hide your profile from public search</p>
                        </div>
                        <button
                          onClick={() => setIsLiveNode(!isLiveNode)}
                          className={`w-14 h-8 rounded-full relative transition-all ${isLiveNode ? 'bg-ffn-primary' : 'bg-gray-200'}`}
                          title="Toggle Stealth Mode"
                        >
                          <motion.div
                            animate={{ x: isLiveNode ? 24 : 4 }}
                            className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                          />
                        </button>
                      </div>
                      <div className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-ffn-black">Secure Booking</p>
                          <p className="text-[10px] text-gray-400">Require manual approval for all inquiries</p>
                        </div>
                        <button
                          className="w-14 h-8 bg-ffn-primary rounded-full relative"
                          title="Approval Status Active"
                        >
                          <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow-lg" />
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-ffn-primary border-b border-gray-100 pb-4">Notifications Protocol</h3>
                    <div className="space-y-4">
                      {[
                        { label: 'Casting Alerts', icon: Bell },
                        { label: 'Direct Messages', icon: MessageCircle },
                        { label: 'Network Updates', icon: Activity }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 px-6">
                          <div className="flex items-center space-x-4">
                            <item.icon className="w-5 h-5 text-gray-400" />
                            <span className="text-sm font-medium text-ffn-black">{item.label}</span>
                          </div>
                          <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-8">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-ffn-primary border-b border-gray-100 pb-4">Account Security</h3>
                    <button className="w-full p-6 flex items-center justify-between bg-white border border-gray-100 rounded-3xl hover:border-ffn-primary transition-all group">
                      <div className="flex items-center space-x-4">
                        <Lock className="w-5 h-5 text-gray-400 group-hover:text-ffn-primary" />
                        <span className="text-sm font-bold text-ffn-black">Encryption Keys</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                  </section>
                </div>

                <div className="pt-12">
                  <button
                    onClick={() => { setShowSettings(false); setShowExitConfirm(true); }}
                    className="w-full py-8 rounded-[2rem] bg-ffn-black text-white text-xs font-black uppercase tracking-[0.6em] hover:bg-ffn-accent transition-all"
                  >
                    TERMINATE SESSION
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Protocol Exit Confirmation */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-8 bg-ffn-black/95 backdrop-blur-3xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="max-w-xl w-full text-center space-y-16"
            >
              <div className="space-y-8">
                <motion.div
                  animate={{
                    rotate: isExiting ? 360 : 0,
                    scale: isExiting ? 0 : 1
                  }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="w-32 h-32 bg-ffn-primary/20 rounded-[3rem] border border-ffn-primary/30 flex items-center justify-center mx-auto"
                >
                  <LogOut className="w-12 h-12 text-ffn-primary" />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="text-6xl font-serif italic text-white">System <span className="text-ffn-primary">Teardown</span></h2>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.6em]">Are you sure you want to decouple from the FFN Graph?</p>
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <button
                  disabled={isExiting}
                  onClick={() => {
                    setIsExiting(true);
                    setTimeout(() => onLogout(), 1500);
                  }}
                  className="w-full py-8 rounded-[2rem] bg-white text-ffn-black text-xs font-black uppercase tracking-[0.6em] hover:bg-ffn-primary hover:text-white transition-all shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">{isExiting ? 'TERMINATING...' : 'CONFIRM DECOUPLING'}</span>
                  {isExiting && (
                    <motion.div
                      initial={{ x: '-100%' }}
                      animate={{ x: '100%' }}
                      transition={{ duration: 1.5, ease: "linear" }}
                      className="absolute inset-0 bg-ffn-primary"
                    />
                  )}
                </button>
                <button
                  disabled={isExiting}
                  onClick={() => setShowExitConfirm(false)}
                  className="text-white/30 hover:text-white text-[10px] font-black uppercase tracking-[0.6em] transition-colors"
                >
                  ABORT EXIT
                </button>
              </div>
            </motion.div>
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
