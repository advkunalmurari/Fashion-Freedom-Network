
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ShieldCheck, CreditCard, ArrowRight, Loader2, Camera, CheckCircle, Zap, Globe } from 'lucide-react';
import { PRICING as PRICE_VAL } from '../constants';

export const ApplyNow: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    category: UserRole.MODEL,
    location: '',
    bio: ''
  });

  const nextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulating Razorpay Integration delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    setIsProcessing(false);
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="text-center mb-24 space-y-8">
        <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black">Apply for Identity</h1>
        <div className="flex items-center justify-center space-x-12 pt-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex flex-col items-center space-y-4">
               <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center text-xs font-bold transition-all duration-500 shadow-sm
                 ${step >= i ? 'bg-ffn-primary text-white border-ffn-primary shadow-lg shadow-ffn-primary/20' : 'bg-white border-gray-200 text-gray-400'}`}>
                 {step > i ? <CheckCircle className="w-5 h-5" /> : i}
               </div>
               <span className={`text-[8px] uppercase tracking-[0.3em] font-bold ${step >= i ? 'text-ffn-primary' : 'text-gray-400'}`}>
                 {i === 1 ? 'Personal' : i === 2 ? 'Portfolio' : 'Verification'}
               </span>
             </div>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
        <div className="lg:col-span-2">
          {step === 1 && (
            <form onSubmit={nextStep} className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Full Legal Name</label>
                <input required type="text" className="w-full py-6 px-8 text-sm focus:border-ffn-primary transition-all bg-white" placeholder="e.g. John Doe" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Professional Username</label>
                <input required type="text" className="w-full py-6 px-8 text-sm focus:border-ffn-primary transition-all bg-white" placeholder="@username" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Email Address</label>
                <input required type="email" className="w-full py-6 px-8 text-sm focus:border-ffn-primary transition-all bg-white" placeholder="professional@fashion.com" />
              </div>
              <button type="submit" className="w-full bg-ffn-primary text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 group shadow-xl shadow-ffn-primary/30">
                <span>Continue Application</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={nextStep} className="space-y-10 animate-in slide-in-from-right-4 duration-500">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Category Selection</label>
                  <select required className="w-full py-6 px-8 text-sm focus:border-ffn-primary transition-all bg-white appearance-none">
                    {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                  </select>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Primary Location</label>
                  <input required type="text" className="w-full py-6 px-8 text-sm focus:border-ffn-primary transition-all bg-white" placeholder="e.g. Mumbai, India" />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Professional Bio</label>
                <textarea required className="w-full py-6 px-8 text-sm h-40 focus:border-ffn-primary transition-all bg-white resize-none" placeholder="Describe your journey, influences, and professional vision..."></textarea>
              </div>
              <div className="bg-white border-2 border-dashed border-gray-200 rounded-[2rem] p-16 text-center space-y-6 hover:border-ffn-primary transition-all cursor-pointer group">
                 <Camera className="w-12 h-12 mx-auto text-gray-300 group-hover:text-ffn-primary transition-all" />
                 <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 group-hover:text-ffn-black">Upload Hero Portrait</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 bg-white border border-gray-200 py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 hover:bg-gray-50 transition-colors">Back</button>
                <button type="submit" className="flex-[2] bg-ffn-primary text-white py-6 rounded-2xl text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-3 shadow-xl shadow-ffn-primary/30">
                  <span>Portfolio Sync</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="space-y-12 animate-in slide-in-from-right-4 duration-500">
              <div className="bg-white rounded-[3rem] border border-gray-100 p-12 space-y-10 shadow-xl">
                <div className="flex justify-between items-end border-b border-gray-50 pb-10">
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">Product</h4>
                    <p className="text-2xl font-serif italic text-ffn-black">Verified Talent Infrastructure</p>
                  </div>
                  <div className="text-right space-y-3">
                    <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400">One-time Fee</h4>
                    <p className="text-5xl font-serif font-bold text-ffn-primary">{PRICE_VAL.CURRENCY}{PRICE_VAL.PROFILE_LISTING}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 block leading-tight">Lifetime Verified Identity Badge</span>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                        <Zap className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 block leading-tight">Priority Directory Listing Indexing</span>
                   </div>
                   <div className="space-y-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                        <Globe className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-600 block leading-tight">Global Accessibility Suite</span>
                   </div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-[8px] uppercase tracking-[0.4em] text-gray-400 text-center font-bold">Secured by Razorpay Encryption</p>
                <button 
                  disabled={isProcessing}
                  onClick={handlePayment}
                  className="w-full bg-ffn-primary text-white py-8 rounded-[2.5rem] text-[12px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-6 hover:bg-ffn-primary/90 transition-all shadow-2xl shadow-ffn-primary/40"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>Initiating Payment...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-6 h-6" />
                      <span>Activate Professional Identity</span>
                    </>
                  )}
                </button>
                <button onClick={() => setStep(2)} className="w-full text-center text-[8px] uppercase tracking-[0.4em] text-gray-400 hover:text-ffn-primary py-4 transition-colors font-bold">Review Application Details</button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-16">
           <div className="p-10 bg-white rounded-[2.5rem] shadow-lg border border-gray-100 space-y-10">
              <h4 className="text-[10px] uppercase tracking-[0.5em] font-bold text-ffn-primary border-b border-gray-50 pb-6">Premium Benefits</h4>
              <div className="space-y-12">
                 <div className="space-y-3 group">
                    <p className="text-[10px] font-bold text-ffn-black uppercase tracking-[0.2em] group-hover:text-ffn-primary transition-colors">Authority Building</p>
                    <p className="text-[10px] leading-relaxed text-gray-500 font-light">Verified profiles carry 8x more trust with global agencies and brands.</p>
                 </div>
                 <div className="space-y-3 group">
                    <p className="text-[10px] font-bold text-ffn-black uppercase tracking-[0.2em] group-hover:text-ffn-primary transition-colors">Monetization Ready</p>
                    <p className="text-[10px] leading-relaxed text-gray-500 font-light">Direct contact and hiring buttons allow you to generate revenue immediately.</p>
                 </div>
                 <div className="space-y-3 group">
                    <p className="text-[10px] font-bold text-ffn-black uppercase tracking-[0.2em] group-hover:text-ffn-primary transition-colors">Editorial Layout</p>
                    <p className="text-[10px] leading-relaxed text-gray-500 font-light">Your portfolio is displayed in a world-class high-fashion aesthetic.</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-white rounded-3xl p-10 space-y-8 opacity-40 hover:opacity-100 transition-opacity">
              <p className="text-[8px] uppercase tracking-[0.3em] font-bold text-center text-gray-400">Trusted Partner Ecosystem</p>
              <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/9/94/Vogue_logo.svg" className="h-4" alt="" />
                 <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Elite_Model_Management_logo.svg/1200px-Elite_Model_Management_logo.svg.png" className="h-5" alt="" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
