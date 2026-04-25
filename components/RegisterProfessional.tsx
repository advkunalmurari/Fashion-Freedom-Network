
import React, { useState, useRef, useEffect } from 'react';
import { UserRole, VerificationLevel } from '../types';
import {
  ShieldCheck, CreditCard, ArrowRight, Loader2, Camera, CheckCircle,
  Zap, Globe, Mail, User as UserIcon, Lock, Sparkles, MapPin, Instagram, Twitter, Plus, Users, PlayCircle, X, ArrowLeft
} from 'lucide-react';
import { PRICING } from '../constants';
import { Logo } from './icons/Logo';
import { m, AnimatePresence } from 'framer-motion';
import { PayPalButton } from './PayPalButton';
import { paypalService } from '../services/paypalService';
import { supabase } from '../supabase';

interface RegisterProfessionalProps {
  onSuccess: (userData: any) => void;
}

const STEP_BACKGROUNDS = [
  '/demo/onboarding_account_bg_1772533638360.png',
  '/demo/onboarding_mastery_bg_1772533657277.png',
  '/demo/onboarding_identity_bg_1772533676239.png',
  '/demo/onboarding_activation_bg_1772533693952.png'
];

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
    twitter: '',
    tiktok: '',
    linkedin: '',
    website: '',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400'
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setFormData({ ...formData, avatarUrl: URL.createObjectURL(file) });
    }
  };

  const handlePaymentSuccess = async (details: any) => {
    setIsProcessing(true);
    try {
      let finalAvatarUrl = formData.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80';

      if (avatarFile) {
        try {
          const fileExt = avatarFile.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `avatars/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(filePath, avatarFile);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(filePath);
            finalAvatarUrl = publicUrl;
          }
        } catch (uploadErr) {
          console.warn('Avatar upload error:', uploadErr);
        }
      }

      const cleanUsername = formData.username.replace('@', '');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { username: cleanUsername, full_name: formData.fullName, avatar_url: finalAvatarUrl }
        }
      });

      if (signUpError) throw new Error(signUpError.message);
      if (!signUpData.user) throw new Error('Registration failed.');

      const userId = signUpData.user.id;

      await supabase.from('profiles').upsert({
        user_id: userId,
        username: cleanUsername,
        full_name: formData.fullName,
        email: formData.email,
        avatar_url: finalAvatarUrl,
        category: formData.category,
        profile_type: formData.category,
        is_professional: true,
        is_premium: true,
        bio: formData.bio,
        location: formData.location,
        instagram: formData.instagram,
        twitter: formData.twitter,
        tiktok: formData.tiktok,
        linkedin: formData.linkedin,
        website: formData.website
      }, { onConflict: 'user_id' });

      await paypalService.verifyPayment(details.id || details.subscriptionID);

      const { data: signInData } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      const activeUser = signInData?.user || signUpData.user;

      onSuccess({
        id: activeUser.id,
        username: cleanUsername,
        displayName: formData.fullName,
        avatarUrl: finalAvatarUrl,
        role: formData.category,
        verificationLevel: VerificationLevel.VERIFIED,
        isVerified: true,
        isProfessional: true,
        bio: formData.bio,
        location: formData.location,
        instagramUrl: formData.instagram ? `https://instagram.com/${formData.instagram.replace('@', '')}` : '',
        twitterUrl: formData.twitter,
        tiktokUrl: formData.tiktok,
        linkedinUrl: formData.linkedin,
        websiteUrl: formData.website,
        followersCount: 0,
        followingCount: 0,
        completionScore: 75
      });
    } catch (error: any) {
      alert(`Registration failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-ffn-black overflow-hidden flex flex-col lg:flex-row">
      {/* Dynamic Background Layer */}
      <AnimatePresence mode="wait">
        <m.div
          key={step}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          <img src={STEP_BACKGROUNDS[step - 1]} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-r from-ffn-black via-ffn-black/80 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </m.div>
      </AnimatePresence>

      {/* Sidebar Navigation & Progress */}
      <div className="relative z-10 w-full lg:w-[400px] p-12 lg:p-16 flex flex-col justify-between border-r border-white/5 bg-ffn-black/20 backdrop-blur-3xl">
        <div className="space-y-12">
          <div className="w-12 h-12 text-white fill-current"><Logo /></div>

          <div className="space-y-4">
            <h2 className="text-sm font-black uppercase tracking-[0.5em] text-ffn-primary">Protocol Onboarding</h2>
            <h1 className="text-5xl font-serif italic text-white leading-none">Identity Mastery</h1>
          </div>

          <div className="space-y-8 py-12">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center space-x-6">
                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[10px] font-black transition-all duration-500
                   ${step >= i ? 'bg-ffn-primary border-ffn-primary text-white shadow-[0_0_20px_rgba(255,51,102,0.4)]' : 'border-white/20 text-white/30'}`}>
                  {step > i ? <CheckCircle className="w-4 h-4" /> : i}
                </div>
                <div>
                  <p className={`text-[9px] uppercase tracking-[0.3em] font-black ${step >= i ? 'text-white' : 'text-white/20'}`}>
                    {i === 1 ? 'Account Construction' : i === 2 ? 'Mastery Selection' : i === 3 ? 'Identity Enrichment' : 'Protocol Activation'}
                  </p>
                  {step === i && <m.div layoutId="active-step-bar" className="h-[1px] bg-ffn-primary mt-2 w-12" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6 pt-12 border-t border-white/10">
          <p className="text-[10px] leading-relaxed text-white/40 font-light italic">
            "Your professional identity is the core of your influence in the FFN global graph."
          </p>
          <div className="flex items-center space-x-4">
            <ShieldCheck className="w-5 h-5 text-ffn-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Secured Identity Layer</span>
          </div>
        </div>
      </div>

      {/* Form Content Area */}
      <div className="relative z-10 flex-1 h-full flex items-center justify-center p-8 lg:p-24 overflow-y-auto custom-scrollbar">
        <div className="w-full max-w-2xl bg-black/60 backdrop-blur-3xl rounded-[4rem] p-12 lg:p-20 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.8)]">

          <AnimatePresence mode="wait">
            {step === 1 && (
              <m.form
                key="step1"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                onSubmit={nextStep}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-ffn-primary uppercase tracking-[0.4em]">Step 01 / Infrastructure</span>
                  <h3 className="text-4xl font-serif italic text-white">Create Your Access Node</h3>
                </div>

                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">FullName</label>
                    <div className="relative">
                      <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ffn-primary" />
                      <input
                        required
                        type="text"
                        className="w-full py-7 px-16 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/50 transition-all outline-none text-sm font-light tracking-wide focus:bg-white/[0.04]"
                        placeholder="e.g. Elena Rossi"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      />

                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">Username</label>
                      <input
                        required
                        type="text"
                        className="w-full py-7 px-8 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/40 transition-all outline-none text-sm"
                        placeholder="@handle"
                        value={formData.username}
                        onChange={e => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">Email</label>
                      <input
                        required
                        type="email"
                        className="w-full py-7 px-8 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/40 transition-all outline-none text-sm"
                        placeholder="pro@ffn.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                      />

                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30">Secret Key</label>
                    <div className="relative">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        required
                        type="password"
                        className="w-full py-7 px-16 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/50 transition-all outline-none text-sm tracking-[0.2em]"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                      />

                    </div>
                  </div>
                </div>

                <button type="submit" className="w-full bg-ffn-primary text-white py-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-[0_10px_30px_rgba(255,51,102,0.3)] hover:scale-[1.02] transition-all">
                  <span>Initialize Account Configuration</span>
                  <ArrowRight className="w-6 h-6" />
                </button>
              </m.form>
            )}

            {step === 2 && (
              <m.form
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                onSubmit={nextStep}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-ffn-primary uppercase tracking-[0.4em]">Step 02 / Professional Mastery</span>
                  <h3 className="text-4xl font-serif italic text-white">Select Your Dominant Node</h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.values(UserRole).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, category: role })}
                      className={`group relative py-10 rounded-3xl border text-[9px] font-black uppercase tracking-[0.3em] transition-all duration-700 overflow-hidden
                         ${formData.category === role ? 'bg-white text-ffn-black border-white shadow-[0_20px_50px_rgba(255,255,255,0.15)] scale-105' : 'bg-white/[0.02] border-white/5 text-white/30 hover:border-white/20 hover:bg-white/[0.04]'}`}
                    >
                      <div className="relative z-10">{role}</div>
                      {formData.category === role && (
                        <m.div
                          layoutId="role-glow"
                          className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"
                        />
                      )}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                    </button>
                  ))}
                </div>


                <div className="flex gap-6">
                  <button type="button" onClick={prevStep} className="flex-1 py-8 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:bg-white/5 transition-all">Previous</button>
                  <button type="submit" className="flex-[2] bg-ffn-primary text-white py-8 rounded-2xl text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-3xl">
                    <span>Validate Mastery</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </m.form>
            )}

            {step === 3 && (
              <m.form
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                onSubmit={nextStep}
                className="space-y-10"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-ffn-primary uppercase tracking-[0.4em]">Step 03 / Identity Enrichment</span>
                  <h3 className="text-4xl font-serif italic text-white">Editorial Profile Construction</h3>
                </div>

                <div className="flex flex-col md:flex-row gap-12 items-center bg-white/[0.02] p-12 rounded-[3rem] border border-white/5 shadow-2xl">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-48 h-48 rounded-full border border-white/10 overflow-hidden relative group cursor-pointer flex-none p-1 bg-white/5 shadow-inner">
                    <div className="w-full h-full rounded-full overflow-hidden relative">
                      <img src={formData.avatarUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt="" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center backdrop-blur-sm">
                        <Camera className="w-6 h-6 text-white mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest">Update</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-6 text-center md:text-left">
                    <div className="space-y-2">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Vector Authorization</h4>
                      <p className="text-2xl font-serif italic text-white/90">Master Projection</p>
                    </div>
                    <p className="text-[11px] text-white/30 font-light italic leading-relaxed max-w-sm">"A high-fidelity editorial capture optimizes network discovery velocity by a factor of 4.2x."</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-10 py-4 bg-white text-ffn-black text-[9px] font-black uppercase tracking-[0.3em] rounded-2xl hover:bg-neutral-200 transition-all shadow-xl"
                    >
                      Initialize Capture
                    </button>
                  </div>
                </div>


                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 italic">Operational Base</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ffn-primary" />
                      <input
                        required
                        type="text"
                        className="w-full py-7 px-16 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/50 transition-all outline-none text-sm font-light focus:bg-white/[0.04]"
                        placeholder="e.g. London, UK"
                        value={formData.location}
                        onChange={e => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 italic">Instagram</label>
                    <div className="relative">
                      <Instagram className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ffn-primary" />
                      <input
                        type="text"
                        className="w-full py-7 px-16 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/50 transition-all outline-none text-sm font-light focus:bg-white/[0.04]"
                        placeholder="@handle"
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 italic">Twitter / X</label>
                    <div className="relative">
                      <Twitter className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ffn-primary" />
                      <input
                        type="text"
                        className="w-full py-7 px-16 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/50 transition-all outline-none text-sm font-light focus:bg-white/[0.04]"
                        placeholder="@handle"
                        value={formData.twitter}
                        onChange={e => setFormData({ ...formData, twitter: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 italic">Website</label>
                    <div className="relative">
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ffn-primary" />
                      <input
                        type="text"
                        className="w-full py-7 px-16 bg-white/[0.02] border border-white/5 rounded-[22px] text-white focus:border-ffn-primary/50 transition-all outline-none text-sm font-light focus:bg-white/[0.04]"
                        placeholder="https://"
                        value={formData.website}
                        onChange={e => setFormData({ ...formData, website: e.target.value })}
                      />
                    </div>
                  </div>

                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.4em] font-black text-white/30 italic">Identity Narrative / Protocol</label>
                  <textarea
                    required
                    className="w-full py-8 px-10 text-base h-48 bg-white/[0.02] border border-white/5 rounded-[2.5rem] text-white focus:border-ffn-primary/40 transition-all outline-none resize-none font-light leading-relaxed focus:bg-white/[0.04]"
                    placeholder="Establish your narrative, influences, and professional mastery..."
                    value={formData.bio}
                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  />
                </div>


                <div className="flex gap-6">
                  <button type="button" onClick={prevStep} className="flex-1 py-8 border border-white/10 rounded-[22px] text-[10px] font-black uppercase tracking-[0.4em] text-white/40 hover:bg-white/5 hover:text-white transition-all duration-500">Previous</button>
                  <button type="submit" className="flex-[2] bg-ffn-primary text-white py-8 rounded-[22px] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:scale-105 transition-all duration-500">
                    <span>Construct Identity</span>
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>

              </m.form>
            )}

            {step === 4 && (
              <m.div
                key="step4"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-12"
              >
                <div className="space-y-2">
                  <span className="text-[9px] font-black text-ffn-primary uppercase tracking-[0.4em]">Step 04 / Protocol Activation</span>
                  <h3 className="text-4xl font-serif italic text-white">Full Identity Deployment</h3>
                </div>

                <div className="bg-white/[0.02] rounded-[3.5rem] border border-white/5 p-16 space-y-12 shadow-inner">
                  <div className="flex justify-between items-end border-b border-white/5 pb-12">
                    <div className="space-y-4">
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary">Protocol Activation Product</p>
                      <h3 className="text-3xl font-serif italic text-white/90">Elite Pro Identity Stream</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-6xl font-serif font-black text-white">{PRICING.CURRENCY}{PRICING.PROFILE_LISTING}</p>
                      <p className="text-[8px] uppercase tracking-[0.5em] text-white/20 mt-3 italic">Autonomous Lifetime Access</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-10">
                    {[
                      { icon: Globe, label: 'Global Node Discovery', desc: 'Ranked indexing in the FFN neural graph.' },
                      { icon: Users, label: 'Professional Ledger', desc: 'Secure escrow-ready contracting toolset.' },
                      { icon: Zap, label: 'Vector Certification', desc: 'Immediate trust scoring and badge injection.' },
                      { icon: Sparkles, label: 'Elite Stream Entry', desc: 'Direct accessibility for global brands.' }
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-start space-x-5 group/benefit">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-ffn-primary flex-none group-hover/benefit:bg-ffn-primary/20 transition-all duration-700">
                          <benefit.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1.5">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-white/80 group-hover/benefit:text-white transition-colors">{benefit.label}</h4>
                          <p className="text-[9px] text-white/30 font-light leading-relaxed group-hover/benefit:text-white/40 transition-colors italic">{benefit.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {isProcessing ? (
                  <div className="w-full bg-white text-ffn-black py-10 rounded-[22px] text-xs font-black uppercase tracking-[0.6em] flex items-center justify-center space-x-6 shadow-2xl">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Synchronizing Protocol...</span>
                  </div>
                ) : (

                  <div className="space-y-6">
                    <PayPalButton
                      amount={PRICING.PROFILE_LISTING.toString()}
                      currency={PRICING.SYMBOL === 'INR' ? 'INR' : 'USD'}
                      onSuccess={handlePaymentSuccess}
                      onError={() => setIsProcessing(false)}
                    />
                    <button
                      onClick={() => handlePaymentSuccess({ id: 'offline_' + Date.now() })}
                      className="w-full py-6 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] transition-all"
                    >
                      Bypass Activation Protocol (Demo)
                    </button>
                    <p className="text-[8px] text-center text-white/20 uppercase tracking-[0.3em] font-black">
                      <ShieldCheck className="inline-block w-4 h-4 mr-2" />
                      Encrypted Financial Exchange
                    </p>
                  </div>
                )}
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
