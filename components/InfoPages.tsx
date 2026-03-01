
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Sparkles, Zap, Award, Target, Eye, Heart, HelpCircle, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';
import { PRICING } from '../constants';
import { PayPalButton } from './PayPalButton';
import { paypalService } from '../services/paypalService';

export const AboutPage: React.FC = () => (
  <div className="space-y-32 py-20 animate-in fade-in duration-1000">
    <section className="max-w-5xl mx-auto text-center space-y-12">
      <div className="flex justify-center mb-8">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="w-24 h-24 border-2 border-ffn-primary rounded-full p-2">
          <div className="w-full h-full bg-ffn-black rounded-full flex items-center justify-center text-white"><Star className="w-8 h-8" /></div>
        </motion.div>
      </div>
      <h1 className="text-7xl md:text-9xl font-serif italic text-ffn-black tracking-tighter leading-none">The Future <br /> Faces of Fashion.</h1>
      <p className="text-xl md:text-3xl text-gray-400 font-light italic max-w-4xl mx-auto leading-relaxed">"FFN is more than a network; it is the global operating system for fashion's most ambitious emerging icons."</p>
    </section>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {[
        { title: 'The Mission', icon: Target, text: 'To democratize global scouting by providing every creative with a verified, sovereign professional identity.' },
        { title: 'The Vision', icon: Eye, text: 'A borderless fashion ecosystem where merit and mastery are the only currencies that matter.' },
        { title: 'The Values', icon: Heart, text: 'Integrity in identity, excellence in aesthetics, and freedom in creative expression.' }
      ].map((box, i) => (
        <div key={i} className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-8 group hover:shadow-2xl transition-all">
          <div className="w-16 h-16 bg-ffn-primary/5 rounded-2xl flex items-center justify-center text-ffn-primary group-hover:bg-ffn-primary group-hover:text-white transition-all"><box.icon className="w-8 h-8" /></div>
          <h3 className="text-3xl font-serif italic text-ffn-black">{box.title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-light">{box.text}</p>
        </div>
      ))}
    </div>

    <section className="bg-ffn-black rounded-[4rem] p-20 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-ffn-primary/20 blur-[100px] animate-pulse"></div>
      <div className="max-w-3xl space-y-8 relative z-10">
        <h2 className="text-5xl font-serif italic tracking-tighter">Established in 2025.</h2>
        <p className="text-white/60 text-lg leading-relaxed font-light">Born from the need to protect creative talent from fragmented booking platforms and opaque scouting processes, FFN leverages advanced AI and identity protocols to bridge the gap between local mastery and global prestige.</p>
      </div>
    </section>
  </div>
);

export const FAQPage: React.FC = () => {
  const faqs = [
    { q: "How do I become a 'Verified' professional?", a: "Verification requires a one-time identity activation fee and a manual review of your professional credentials and portfolio by our editorial hub." },
    { q: "Is FFN a talent agency?", a: "No, FFN is an infrastructure provider. We provide the tools for discovery and identity management, allowing you to represent yourself or sync with your existing agency." },
    { q: "Can I use FFN if I am just starting out?", a: "Absolutely. FFN is designed to build authority for emerging talent. Our 'Identity Strength' system guides you through professional standards." },
    { q: "What is the 'Mastery Hub'?", a: "The Mastery Hub is your premium profile page, optimized for speed and high-fashion aesthetics to ensure scouts see your work in its best light." }
  ];

  return (
    <div className="max-w-4xl mx-auto py-20 space-y-20 animate-in fade-in duration-700">
      <header className="text-center space-y-6">
        <HelpCircle className="w-16 h-16 text-ffn-primary mx-auto opacity-20" />
        <h1 className="text-6xl font-serif italic text-ffn-black tracking-tighter">Help & FAQ</h1>
        <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-300">FFN Knowledge Protocol</p>
      </header>
      <div className="space-y-8">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white p-10 rounded-[2.5rem] border border-gray-100 shadow-lg space-y-4 group">
            <h3 className="text-xl font-serif italic text-ffn-black group-hover:text-ffn-primary transition-colors">{faq.q}</h3>
            <p className="text-sm text-gray-500 leading-relaxed font-light">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const CommunityGuidelines: React.FC = () => (
  <div className="max-w-4xl mx-auto py-20 space-y-16 animate-in fade-in duration-700">
    <header className="text-center space-y-6">
      <ShieldAlert className="w-16 h-16 text-ffn-accent mx-auto opacity-20" />
      <h1 className="text-6xl font-serif italic text-ffn-black tracking-tighter">Community Protocol</h1>
      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-300">Rules of Professional Conduct</p>
    </header>
    <div className="bg-white rounded-[4rem] border border-gray-100 p-12 md:p-20 shadow-xl space-y-12">
      <section className="space-y-4">
        <h3 className="text-2xl font-serif italic text-ffn-black">Identity Integrity</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Impersonation of agencies, brands, or other talent is strictly prohibited. All professional hub details must be accurate and owned by the account holder.</p>
      </section>
      <section className="space-y-4">
        <h3 className="text-2xl font-serif italic text-ffn-black">Professional Discourse</h3>
        <p className="text-sm text-gray-500 leading-relaxed">The network is for professional discovery. Harassment, non-consensual solicitation, or unprofessional conduct in direct messaging will result in immediate protocol suspension.</p>
      </section>
      <section className="space-y-4">
        <h3 className="text-2xl font-serif italic text-ffn-black">Copyright Sovereignty</h3>
        <p className="text-sm text-gray-500 leading-relaxed">Ensure you have the rights to all media uploaded. If showcasing work from a collaboration, proper attribution to photographers, stylists, and MUAs is required.</p>
      </section>
    </div>
  </div>
);

export const PricingPage: React.FC<{ onRegister: () => void }> = ({ onRegister }) => {
  const [activePayment, setActivePayment] = React.useState<'listing' | 'boost' | 'pro_sub' | 'pre_sub' | null>(null);

  const handleSuccess = async (details: any) => {
    try {
      const orderId = details.id || details.subscriptionID;
      if (activePayment === 'pro_sub' || activePayment === 'pre_sub') {
        const planId = activePayment === 'pro_sub' ? 'PROFESSIONAL' : 'PREMIUM';
        await paypalService.verifySubscription(planId, orderId);
      } else {
        await paypalService.verifyPayment(orderId);
      }
      alert("Payment Successful! Your protocol status has been updated.");
    } catch (error: any) {
      console.error("Payment verification failed:", error);
      alert(`Payment verification failed: ${error.message}`);
    } finally {
      setActivePayment(null);
    }
  };

  return (
    <div className="py-20 space-y-24 animate-in fade-in duration-1000">
      <header className="max-w-4xl mx-auto text-center space-y-8">
        <Sparkles className="w-16 h-16 text-ffn-primary mx-auto mb-4" />
        <h1 className="text-7xl font-serif italic text-ffn-black tracking-tighter leading-none">Invest in Your <br /> Identity.</h1>
        <p className="text-xl text-gray-400 font-light italic">Lifecycle fees and elite membership tiers for global professional sovereignty.</p>
      </header>

      {/* One-time Fees */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Identity Activation */}
        <div className="bg-white p-16 rounded-[4rem] border border-gray-100 shadow-2xl space-y-10 relative overflow-hidden group">
          <div className="flex items-center space-x-4 text-ffn-primary"><CheckCircle className="w-8 h-8" /><span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Activation</span></div>
          <div className="space-y-4">
            <h3 className="text-4xl font-serif italic text-ffn-black leading-none">Professional <br /> Listing.</h3>
            <p className="text-6xl font-serif font-bold tracking-tighter text-ffn-black">{PRICING.CURRENCY}{PRICING.PROFILE_LISTING}</p>
          </div>
          <ul className="space-y-6">
            {["Lifetime Indexed Hub", "Verified Authority Badge", "Direct Inquiry Access", "Global Directory Entry"].map((f, i) => (
              <li key={i} className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-gray-400"><div className="w-1.5 h-1.5 bg-ffn-primary rounded-full" /> {f}</li>
            ))}
          </ul>
          {activePayment === 'listing' ? (
            <PayPalButton
              amount={PRICING.PROFILE_LISTING.toString()}
              currency={PRICING.SYMBOL === 'INR' ? 'INR' : 'USD'}
              onSuccess={handleSuccess}
            />
          ) : (
            <button onClick={() => setActivePayment('listing')} className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-ffn-primary transition-all">Activate Hub</button>
          )}
        </div>

        {/* Network Boost */}
        <div className="bg-ffn-black text-white p-16 rounded-[4rem] shadow-2xl space-y-10 relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-ffn-primary/20 blur-[100px] animate-pulse"></div>
          <div className="flex items-center space-x-4 text-ffn-accent"><Zap className="w-8 h-8" /><span className="text-[10px] font-black uppercase tracking-[0.5em]">Network Boost</span></div>
          <div className="space-y-4">
            <h3 className="text-4xl font-serif italic leading-none">Discovery <br /> Acceleration.</h3>
            <p className="text-6xl font-serif font-bold tracking-tighter text-gradient-vibrant">{PRICING.CURRENCY}{PRICING.PROFILE_BOOST}</p>
          </div>
          <ul className="space-y-6">
            {["Top Directory Placement", "Featured Content Priority", "Advanced Scouter Analytics", "30-Day Boost Duration"].map((f, i) => (
              <li key={i} className="flex items-center space-x-4 text-[10px] font-bold uppercase tracking-widest text-white/40"><div className="w-1.5 h-1.5 bg-ffn-accent rounded-full" /> {f}</li>
            ))}
          </ul>
          {activePayment === 'boost' ? (
            <PayPalButton
              amount={PRICING.PROFILE_BOOST.toString()}
              currency={PRICING.SYMBOL === 'INR' ? 'INR' : 'USD'}
              onSuccess={handleSuccess}
            />
          ) : (
            <button onClick={() => setActivePayment('boost')} className="w-full bg-white text-ffn-black py-8 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-ffn-primary hover:text-white transition-all">Boost Identity</button>
          )}
        </div>
      </div>

      {/* Subscriptions */}
      <div className="max-w-6xl mx-auto space-y-12">
        <h2 className="text-4xl font-serif italic text-center text-ffn-black">Membership Protocols</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Professional Subscription */}
          <div className="bg-white p-12 rounded-[3rem] border border-gray-100 shadow-xl space-y-8">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">Protocol: Professional</h4>
            <div className="space-y-2">
              <p className="text-5xl font-serif font-bold text-ffn-black">{PRICING.CURRENCY}{PRICING.SUBSCRIPTION.PROFESSIONAL}<span className="text-sm font-light text-gray-400">/mo</span></p>
            </div>
            <ul className="space-y-4">
              {["Unlimited Portfolio Slots", "Priority Casting Access", "Enhanced Scouter Visibility"].map((f, i) => (
                <li key={i} className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest"><div className="w-1 h-1 bg-ffn-primary rounded-full" /> {f}</li>
              ))}
            </ul>
            {activePayment === 'pro_sub' ? (
              <PayPalButton
                amount={PRICING.SUBSCRIPTION.PROFESSIONAL.toString()}
                type="subscription"
                planId="P-5ML4271244454362MC4S4YCA" // Mock Plan ID
                onSuccess={handleSuccess}
              />
            ) : (
              <button onClick={() => setActivePayment('pro_sub')} className="w-full py-6 bg-ffn-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">Subscribe Professional</button>
            )}
          </div>

          {/* Premium Subscription */}
          <div className="bg-ffn-primary text-white p-12 rounded-[3rem] shadow-xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl"></div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Protocol: Premium Elite</h4>
            <div className="space-y-2">
              <p className="text-5xl font-serif font-bold">{PRICING.CURRENCY}{PRICING.SUBSCRIPTION.PREMIUM}<span className="text-sm font-light text-white/40">/mo</span></p>
            </div>
            <ul className="space-y-4">
              {["Direct Scout Concierge", "Global Featured Status", "Editorial Priority", "FFN Private Events"].map((f, i) => (
                <li key={i} className="flex items-center space-x-3 text-[10px] text-white/60 font-bold uppercase tracking-widest"><div className="w-1 h-1 bg-white rounded-full" /> {f}</li>
              ))}
            </ul>
            {activePayment === 'pre_sub' ? (
              <PayPalButton
                amount={PRICING.SUBSCRIPTION.PREMIUM.toString()}
                type="subscription"
                planId="P-5ML4271244454362MC4S4YCA" // Mock Plan ID
                onSuccess={handleSuccess}
              />
            ) : (
              <button onClick={() => setActivePayment('pre_sub')} className="w-full py-6 bg-white text-ffn-primary rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]">Subscribe Premium</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const VerificationPage: React.FC = () => (
  <div className="max-w-4xl mx-auto py-20 space-y-20 animate-in fade-in duration-700">
    <header className="text-center space-y-8">
      <Award className="w-16 h-16 text-ffn-primary mx-auto mb-4" />
      <h1 className="text-7xl font-serif italic text-ffn-black tracking-tighter leading-none">Identity <br /> Verification.</h1>
      <p className="text-xl text-gray-400 font-light italic">The FFN badge is more than an icon; it is a seal of professional excellence.</p>
    </header>

    <div className="space-y-12">
      <div className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-2xl space-y-12">
        <div className="space-y-6">
          <h3 className="text-3xl font-serif italic text-ffn-black">How it Works</h3>
          <p className="text-sm text-gray-500 leading-relaxed font-light">Verification involves a multi-layered check of your industry activity. We analyze your digital footprint across Instagram, editorial publications, and professional collaborations to ensure you are a master of your craft.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-ffn-black">Benefits</h4>
            <ul className="space-y-4">
              {["High-Level Scout Visibility", "Trusted Partner Status", "Access to Pro-Only Channels", "Increased Inquiry Conversion"].map((b, i) => (
                <li key={i} className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest"><CheckCircle className="w-4 h-4 text-emerald-500" /> {b}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-ffn-black">Requirements</h4>
            <ul className="space-y-4">
              {["Minimum 3 Portfolio Items", "Linked Social Identity", "Verified Professional Category", "One-Time Activation Fee"].map((r, i) => (
                <li key={i} className="flex items-center space-x-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest"><ArrowRight className="w-4 h-4 text-ffn-primary" /> {r}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
);
