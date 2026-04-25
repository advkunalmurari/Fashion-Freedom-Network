import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Camera, MapPin, Sparkles, CheckCircle, ArrowRight, Zap, Loader2, DollarSign } from 'lucide-react';
import { MOCK_SHOOTS, PRICING } from '../constants';
import { PayPalButton } from './PayPalButton';

export const Photoshoots: React.FC = () => {
  const [bookingStep, setBookingStep] = useState<number>(0); // 0: Browse, 1: Package Selection
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const packages = [
    { id: 'STUDIO_BASIC', name: 'Studio Essential', price: 25000, desc: '4-hour studio shoot. 2 Looks. 10 Retouched Images.', photographer: 'FFN Curated' },
    { id: 'EDITORIAL_PRO', name: 'Editorial Pro', price: 65000, desc: 'Full day location shoot. 5 Looks. 25 Retouched Images + Reel.', photographer: 'Top Tier Partner' },
    { id: 'CAMPAIGN_SUPER', name: 'Campaign Master', price: 150000, desc: '2-day multi-location. Creative direction included. Full rights.', photographer: 'Elite Agency' }
  ];

  const handleBookingSuccess = async (data: any) => {
    setIsProcessing(true);
    await new Promise(res => setTimeout(res, 2000));
    setIsProcessing(false);
    alert(`Shoot Booked! Deposit secured via Order ${data.id}. Our production team will contact you shortly.`);
    setBookingStep(0);
  };

  return (
    <div className="space-y-24 animate-in fade-in duration-1000 pb-32">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-6">
          <div className="inline-flex items-center space-x-3 text-ffn-primary">
            <Camera className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">FFN Production</span>
          </div>
          <h1 className="text-6xl md:text-[8rem] font-serif italic tracking-tighter text-ffn-black leading-none">Managed <br /> Editorials.</h1>
        </div>
        <button
          onClick={() => setBookingStep(1)}
          className="px-12 py-6 bg-ffn-black text-white rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] shadow-2xl hover:bg-ffn-primary transition-all"
        >
          Book a Shoot
        </button>
      </header>

      <AnimatePresence mode="wait">
        {bookingStep === 1 && (
          <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-white p-12 md:p-16 rounded-[4rem] border border-gray-100 shadow-2xl space-y-12 overflow-hidden">
            <div className="flex justify-between items-center pb-8 border-b border-gray-100">
              <h2 className="text-4xl font-serif italic text-ffn-black">Configure Production</h2>
              <button onClick={() => setBookingStep(0)} className="text-[10px] uppercase font-bold tracking-widest text-gray-400 hover:text-ffn-primary">Cancel</button>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">1. Select Region</p>
              <div className="flex gap-4">
                {['Mumbai', 'Delhi', 'Bengaluru', 'Goa'].map(city => (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all ${selectedCity === city ? 'bg-ffn-black text-white shadow-xl' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    <MapPin className="w-4 h-4 inline-block mr-2" /> {city}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">2. Production Package</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {packages.map(pkg => (
                  <div key={pkg.id} className={`p-10 rounded-[3rem] border shadow-xl flex flex-col justify-between space-y-8 cursor-pointer transition-all ${selectedPackage === pkg.id ? 'bg-ffn-black text-white border-ffn-black scale-105' : 'bg-white border-gray-100 hover:border-ffn-primary'}`} onClick={() => setSelectedPackage(pkg.id)}>
                    <div className="space-y-4">
                      <h3 className="text-3xl font-serif italic">{pkg.name}</h3>
                      <p className={`text-sm font-light ${selectedPackage === pkg.id ? 'text-gray-300' : 'text-gray-500'}`}>{pkg.desc}</p>
                      <p className="text-[9px] uppercase font-black tracking-widest text-ffn-primary">By {pkg.photographer}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-4xl font-serif font-bold italic">{PRICING.CURRENCY}{pkg.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {selectedPackage && (
              <m.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pt-8 border-t border-gray-100 space-y-8">
                <div className="bg-gray-50 p-8 rounded-[3rem] text-center space-y-6">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Secure Your Production Date</p>
                  <p className="text-sm text-gray-500 max-w-md mx-auto">A 50% deposit is required to secure the production crew. The remainder is released upon delivery.</p>
                  <div className="max-w-xs mx-auto">
                    <PayPalButton
                      amount={((packages.find(p => p.id === selectedPackage)?.price || 0) / 2 / 80).toFixed(2)} // Approximate INR to USD
                      currency="USD"
                      type="capture"
                      onSuccess={handleBookingSuccess}
                    />
                  </div>
                </div>
              </m.div>
            )}
          </m.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        <h2 className="text-5xl font-serif italic text-ffn-black">Recent Editorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          {MOCK_SHOOTS.map((shoot, idx) => (
            <m.div
              key={shoot.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer space-y-10"
            >
              <div className="aspect-[16/10] bg-gray-100 rounded-[4rem] overflow-hidden relative shadow-2xl border border-gray-100">
                <img src={shoot.media_url} className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-16">
                  <div className="space-y-4">
                    <span className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-white border border-white/20">{shoot.category}</span>
                    <h3 className="text-4xl text-white font-serif italic">View Editorial Depth</h3>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between px-6">
                <div className="space-y-2">
                  <h4 className="text-3xl font-serif italic text-ffn-black">{shoot.title}</h4>
                  <div className="flex items-center space-x-6">
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Captured by <span className="text-ffn-black">{shoot.photographer_name}</span></p>
                    <span className="text-gray-200">|</span>
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">{shoot.created_at}</p>
                  </div>
                </div>
                <div className="p-5 rounded-3xl bg-gray-50 group-hover:bg-ffn-black group-hover:text-white transition-all">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </div>
  );
};
