
import React, { useState } from 'react';
import { UserRole, VerificationLevel } from '../types';
import {
  ShieldCheck, CreditCard, ArrowRight, Loader2, Camera, CheckCircle,
  Zap, Globe, Mail, User as UserIcon, Lock, Sparkles, MapPin, Instagram, Plus, Users
} from 'lucide-react';
import { PRICING, LOGO_SVG } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';
import { PayPalButton } from './PayPalButton';
import { paypalService } from '../services/paypalService';
import { supabase } from '../supabase';

interface RegisterProfessionalProps {
  onSuccess: (userData: any) => void;
}

export const RegisterProfessional: React.FC<RegisterProfessionalProps> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    category: UserRole.MODEL,
    location: '',
    bio: '',
    instagram: '',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  });

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const handlePaymentSuccess = async (details: any) => {
    setIsProcessing(true);
    try {
      // 1. Register via Supabase directly 
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { username: formData.username.replace('@', ''), full_name: formData.fullName, avatar_url: formData.avatarUrl }
        }
      });
      if (signUpError) throw new Error(signUpError.message);
      if (!signUpData.user) throw new Error("Registration failed.");

      // Insert profile on Supabase
      const { error: profileError } = await supabase.from('profiles').upsert({
        user_id: signUpData.user.id,
        username: formData.username.replace('@', ''),
        full_name: formData.fullName,
        email: formData.email,
        avatar_url: formData.avatarUrl,
        category: formData.category,
        is_professional: true,
        is_premium: true, // Auto-upgraded due to payment
        bio: formData.bio,
        location: formData.location
      }, { onConflict: 'user_id' });
      if (profileError) console.error("Profile error:", profileError);

      // 2. Verify payment (Capture)
      await paypalService.verifyPayment(details.id || details.subscriptionID);

      onSuccess({
        id: signUpData.user.id,
        username: formData.username.replace('@', ''),
        displayName: formData.fullName,
        avatarUrl: formData.avatarUrl,
        role: formData.category,
        verificationLevel: VerificationLevel.VERIFIED,
        isVerified: true,
        isProfessional: true,
        bio: formData.bio,
        location: formData.location,
        instagramUrl: `https://instagram.com/${formData.instagram.replace('@', '')}`,
        followersCount: 0,
        followingCount: 0,
        completionScore: 75
      });
    } catch (error: any) {
      console.error("Registration or Verification failed:", error);
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    // This is now handled by the PayPalButton component internally
    // but we can keep it as a fallback or for other logic
  };

  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-24 space-y-8">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-16 h-16">{LOGO_SVG}</div>
          <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black">Register as a Professional</h1>
        </div>

        <div className="flex items-center justify-center space-x-6 md:space-x-12 pt-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex flex-col items-center space-y-4">
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-[10px] font-black transition-all duration-500 shadow-sm
                 ${step >= i ? 'bg-ffn-black text-white border-ffn-black shadow-xl' : 'bg-white border-gray-200 text-gray-400'}`}>
                {step > i ? <CheckCircle className="w-5 h-5" /> : i}
              </div>
              <span className={`text-[8px] uppercase tracking-[0.3em] font-black hidden md:block ${step >= i ? 'text-ffn-black' : 'text-gray-400'}`}>
                {i === 1 ? 'Account' : i === 2 ? 'Mastery' : i === 3 ? 'Identity' : 'Activation'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
        {/* Form Column */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={nextStep}
                className="space-y-10"
              >
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Full Legal Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      required
                      type="text"
                      className="w-full py-6 px-16 text-sm bg-white rounded-3xl border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all"
                      placeholder="e.g. Elena Rossi"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Professional Username</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 font-bold">@</span>
                      <input
                        required
                        type="text"
                        className="w-full py-6 px-12 text-sm bg-white rounded-3xl border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all"
                        placeholder="username"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        required
                        type="email"
                        className="w-full py-6 px-16 text-sm bg-white rounded-3xl border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all"
                        placeholder="pro@fashion.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Secure Password</label>
                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                    <input
                      required
                      type="password"
                      className="w-full py-6 px-16 text-sm bg-white rounded-3xl border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 group shadow-3xl hover:bg-ffn-primary transition-all">
                  <span>Continue Identity Creation</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={nextStep}
                className="space-y-10"
              >
                <div className="space-y-6">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Select Your Professional Mastery</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {Object.values(UserRole).map(role => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: role })}
                        className={`py-8 rounded-[2rem] border text-[10px] font-bold uppercase tracking-widest transition-all ${formData.category === role ? 'bg-ffn-black text-white border-ffn-black shadow-2xl scale-105' : 'bg-white border-gray-100 text-gray-400 hover:border-ffn-primary/30'}`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-6">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-8 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Back</button>
                  <button type="submit" className="flex-[2] bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-3xl">
                    <span>Validate Selection</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={nextStep}
                className="space-y-10"
              >
                <div className="flex flex-col md:flex-row gap-10 items-center">
                  <div className="w-40 h-40 rounded-[3rem] bg-gray-50 border border-gray-100 overflow-hidden relative group cursor-pointer flex-none">
                    <img src={formData.avatarUrl} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Hero Portrait</h3>
                    <p className="text-xs text-gray-400 font-light italic">"A high-fidelity editorial portrait increases discovery by 300%."</p>
                    <button type="button" className="px-8 py-3 bg-ffn-black text-white text-[8px] font-bold uppercase tracking-widest rounded-full">Upload New Identity</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Base Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        required
                        type="text"
                        className="w-full py-6 px-16 text-sm bg-white rounded-3xl border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all"
                        placeholder="e.g. Mumbai, India"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Instagram Handle</label>
                    <div className="relative">
                      <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        required
                        type="text"
                        className="w-full py-6 px-16 text-sm bg-white rounded-3xl border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all"
                        placeholder="@handle"
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Professional Bio Architecture</label>
                  <textarea
                    required
                    className="w-full py-6 px-8 text-sm h-40 bg-white rounded-[2rem] border border-gray-100 focus:border-ffn-primary focus:shadow-xl transition-all resize-none"
                    placeholder="Establish your narrative, influences, and expertise..."
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>

                <div className="flex gap-6">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-8 bg-white border border-gray-100 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">Back</button>
                  <button type="submit" className="flex-[2] bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-3xl">
                    <span>Construct Identity</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </motion.form>
            )}

            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-12"
              >
                <div className="bg-white rounded-[4rem] border border-gray-100 p-12 md:p-20 space-y-12 shadow-3xl">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-50 pb-12 gap-10">
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400">Selected Product</p>
                      <h3 className="text-4xl font-serif italic text-ffn-black">Professional Identity Hub Activation</h3>
                      <div className="flex items-center space-x-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                        <span className="text-[9px] font-black uppercase tracking-[0.4em] text-emerald-600">Lifetime Credibility Protocol</span>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400 mb-4">Network Investment</p>
                      <p className="text-7xl font-serif font-bold text-ffn-primary tracking-tighter leading-none">{PRICING.CURRENCY}{PRICING.PROFILE_LISTING}</p>
                      <p className="text-[8px] uppercase tracking-widest text-gray-300 mt-4 font-black">Lifecycle Fee &bull; No Recurring Cost</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {[
                      { icon: Globe, label: 'Public Professional Profile', desc: 'A globally indexed SEO-ready identity page.' },
                      // Added Users to the icon list to fix the undefined name error
                      { icon: Users, label: 'Directory Integration', desc: 'Immediate indexing in the global talent directory.' },
                      { icon: Zap, label: 'Casting Eligibility', desc: 'Direct application rights to premium casting calls.' },
                      { icon: Sparkles, label: 'Verified Badge', desc: 'Establish immediate professional authority.' }
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-start space-x-6">
                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-ffn-primary flex-none"><benefit.icon className="w-6 h-6" /></div>
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-black uppercase tracking-widest text-ffn-black">{benefit.label}</h4>
                          <p className="text-[10px] text-gray-400 font-light leading-relaxed">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-8">
                  {isProcessing ? (
                    <div className="w-full bg-ffn-black/10 text-ffn-black py-10 rounded-[3rem] text-xs font-black uppercase tracking-[0.5em] flex items-center justify-center space-x-6">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Activating Your Identity Hub...</span>
                    </div>
                  ) : (
                    <PayPalButton
                      amount={PRICING.PROFILE_LISTING.toString()}
                      currency={PRICING.SYMBOL === 'INR' ? 'INR' : 'USD'} // Adjusting based on PayPal support
                      onSuccess={handlePaymentSuccess}
                      onError={() => setIsProcessing(false)}
                    />
                  )}
                  <p className="text-[9px] uppercase tracking-[0.4em] text-gray-300 text-center font-black flex items-center justify-center space-x-3">
                    <ShieldCheck className="w-4 h-4" />
                    <span>PayPal Secured Network Protocol</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info Column */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-white p-12 rounded-[4rem] border border-gray-100 shadow-2xl space-y-12">
            <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary border-b border-gray-50 pb-6">Professional Edge</h4>
            <div className="space-y-12">
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-ffn-black"><Plus className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Authority</span></div>
                <p className="text-[10px] leading-relaxed text-gray-400 font-light italic">"Verified profiles receive 12x more interaction from global casting directors than standard accounts."</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-ffn-black"><Plus className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Direct Hire</span></div>
                <p className="text-[10px] leading-relaxed text-gray-400 font-light italic">"Enable the Direct Inquire protocol to receive bookings straight to your professional dashboard."</p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-ffn-black"><Plus className="w-4 h-4" /><span className="text-[10px] font-black uppercase tracking-widest">Networking</span></div>
                <p className="text-[10px] leading-relaxed text-gray-400 font-light italic">"Gain access to restricted professional-only channels in the FFN global graph."</p>
              </div>
            </div>
          </div>

          <div className="p-12 text-center space-y-8 opacity-40">
            <p className="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-400">Industry Credibility Standards</p>
            <div className="flex flex-wrap justify-center gap-8">
              <span className="text-[10px] font-serif italic text-ffn-black">Vogue</span>
              <span className="text-[10px] font-serif italic text-ffn-black">Harper's</span>
              <span className="text-[10px] font-serif italic text-ffn-black">Milan FW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
