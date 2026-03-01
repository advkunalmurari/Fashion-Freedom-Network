
import React from 'react';
import { ShieldCheck, Lock, FileText, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const LegalContainer: React.FC<{ title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, subtitle, icon, children }) => (
  <div className="max-w-4xl mx-auto py-20 space-y-16 animate-in fade-in duration-700">
    <header className="space-y-6 text-center">
      <div className="flex justify-center mb-8">
        <div className="w-20 h-20 bg-ffn-black rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl">
          {icon}
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-6xl font-serif italic text-ffn-black tracking-tighter">{title}</h1>
        <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-300">{subtitle}</p>
      </div>
    </header>
    <div className="bg-white rounded-[4rem] border border-gray-100 p-12 md:p-20 shadow-xl space-y-12 prose prose-ffn max-w-none">
      {children}
    </div>
  </div>
);

export const PrivacyPolicy: React.FC = () => (
  <LegalContainer 
    title="Privacy Protocol" 
    subtitle="User Data Protection Policy" 
    icon={<Lock className="w-8 h-8" />}
  >
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">1. Information Collection</h3>
      <p className="text-sm text-gray-500 leading-relaxed">At Fashion Freedom Network (FFN), we collect information that establishes your professional identity. This includes your name, professional email, high-fidelity portfolio media, and professional category mastery. When you register, we also process payment identifiers strictly for verification and accounting purposes.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">2. How We Use Data</h3>
      <p className="text-sm text-gray-500 leading-relaxed">Your data is utilized to construct your global identity hub, facilitate direct inquiries from casting directors, and provide AI-driven trend forecasting. We never sell your personal narrative to third-party data brokers. Your privacy is part of your sovereignty.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">3. Data Protection Protocol</h3>
      <p className="text-sm text-gray-500 leading-relaxed">We employ enterprise-grade encryption for all stored assets. Payment data is never stored on our local servers and is handled exclusively by encrypted providers like Razorpay and Stripe.</p>
    </section>
    <section className="space-y-4 border-t border-gray-50 pt-8">
      <p className="text-[10px] uppercase tracking-widest font-black text-gray-300 text-center">Last Updated: May 2025 &bull; FFN Compliance Hub</p>
    </section>
  </LegalContainer>
);

export const TermsAndConditions: React.FC = () => (
  <LegalContainer 
    title="Master Agreement" 
    subtitle="Platform Terms and Conditions" 
    icon={<FileText className="w-8 h-8" />}
  >
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">1. Professional Eligibility</h3>
      <p className="text-sm text-gray-500 leading-relaxed">By establishing an account on FFN, you affirm that you are a professional operating within the creative fashion industry. You are responsible for maintaining the authenticity of your mastery claims and portfolio media.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">2. Identity Hub Sovereignty</h3>
      <p className="text-sm text-gray-500 leading-relaxed">You retain full ownership of the creative content uploaded to your hub. By posting, you grant FFN a non-exclusive license to showcase your work within the network's ecosystem for scouting and discovery purposes.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">3. Transactional Integrity</h3>
      <p className="text-sm text-gray-500 leading-relaxed">Fees for profile activation and boosts are non-recurring. Any misuse of the platform's professional inquiry system for harassment or non-professional solicitation will result in immediate identity termination without refund.</p>
    </section>
  </LegalContainer>
);

export const RefundPolicy: React.FC = () => (
  <LegalContainer 
    title="Refund Policy" 
    subtitle="Financial Transaction Protocols" 
    icon={<ShieldCheck className="w-8 h-8" />}
  >
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">1. Profile Activation Fees</h3>
      <p className="text-sm text-gray-500 leading-relaxed">Registration fees cover the one-time indexing and verification of your professional hub. Once the identity is established and published to the directory, the fee is considered earned and non-refundable.</p>
    </section>
    <section className="space-y-4">
      <h3 className="text-2xl font-serif italic text-ffn-black">2. Exceptional Circumstances</h3>
      <p className="text-sm text-gray-500 leading-relaxed">If a technical failure prevents your hub from being established after payment, FFN will issue a full refund within 7-10 business days of the reported incident.</p>
    </section>
  </LegalContainer>
);

export const CookiePolicy: React.FC = () => (
  <LegalContainer 
    title="Cookie Protocol" 
    subtitle="Tracking and Analytics Transparency" 
    icon={<Info className="w-8 h-8" />}
  >
    <p className="text-sm text-gray-500 leading-relaxed">FFN uses minimal, essential cookies to maintain your session security and remember your professional preferences. We utilize anonymized analytics to improve the global creative graph's efficiency.</p>
  </LegalContainer>
);
