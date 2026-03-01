
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ShoppingBag, TrendingUp, Star, ArrowRight, X, CheckCircle, ShieldCheck, Zap, MessageCircle, DollarSign, Clock } from 'lucide-react';
import { UserRole } from '../types';

interface ServiceItem {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  author: string;
  role: string;
  description: string;
  deliverables: string[];
}

export const Marketplace: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  
  const categories = ['Models', 'Photographers', 'Stylists', 'Designers', 'MUAs'];
  const featuredGigs: ServiceItem[] = [
    { 
      id: 'm1', 
      title: 'Brand Campaign Shoot', 
      price: '500+', 
      rating: 4.9, 
      image: 'https://picsum.photos/id/1/600/400', 
      author: 'Vogue Studios',
      role: 'Production House',
      description: 'Full-service editorial production including studio rental, high-end lighting, and digital tech support for premium brand campaigns.',
      deliverables: ['12 Final Retouched Images', 'Raw Image Archive', 'Full Lighting Setup', 'Assistant On-set']
    },
    { 
      id: 'm2', 
      title: 'Fashion Week Runway', 
      price: '200+', 
      rating: 5.0, 
      image: 'https://picsum.photos/id/2/600/400', 
      author: 'Milan FW',
      role: 'Events Group',
      description: 'Exclusive runway spots for emerging designers during Milan Fashion Week. Includes model casting and backstage management.',
      deliverables: ['15 Minute Runway Slot', 'Model Casting (5 Models)', 'Digital Press Kit', 'Official Show Video']
    },
    { 
      id: 'm3', 
      title: 'High-Fashion MUA', 
      price: '150', 
      rating: 4.8, 
      image: 'https://picsum.photos/id/3/600/400', 
      author: 'Nadia Glaze',
      role: 'Master MUA',
      description: 'Specialized editorial makeup for high-contrast photography and avant-garde runway looks.',
      deliverables: ['On-set Makeup (3 Looks)', 'Skin Preparation', 'Touch-ups (4 Hours)', 'Reference Moodboard']
    },
    { 
      id: 'm4', 
      title: 'Portfolio Coaching', 
      price: '75', 
      rating: 4.7, 
      image: 'https://picsum.photos/id/4/600/400', 
      author: 'Scout Master',
      role: 'Identity Agent',
      description: 'One-on-one session to refine your professional hub, portfolio selection, and casting strategy.',
      deliverables: ['1 Hour Strategy Call', 'Portfolio Review', 'IG Hub Optimization', 'Agency Referral List']
    },
  ];

  return (
    <div className="space-y-16 pb-32 animate-in fade-in duration-700">
      <header className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-3 text-ffn-primary">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Professional Commerce Hub</span>
            </div>
            <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">The Market</h1>
          </div>
          <div className="flex items-center space-x-4">
             <button className="px-8 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl">List a Service</button>
             <button className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-gray-400 hover:text-ffn-black transition-colors"><ShieldCheck className="w-5 h-5" /></button>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ffn-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search for models, designers, or services..." 
              className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-8 text-xs font-bold uppercase tracking-widest shadow-xl shadow-gray-200/20 focus:shadow-2xl focus:border-ffn-primary transition-all"
            />
          </div>
          <div className="flex overflow-x-auto space-x-3 no-scrollbar lg:max-w-md">
            {categories.map(cat => (
              <button key={cat} className="flex-none bg-white border border-gray-100 px-8 py-4 rounded-2xl text-[9px] uppercase tracking-widest font-black text-gray-400 hover:text-ffn-black hover:border-ffn-black transition-all">
                {cat}
              </button>
            ))}
            <button className="flex-none bg-gray-50 p-4 rounded-2xl text-gray-400 hover:text-ffn-black">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <section className="space-y-10">
        <div className="flex items-center justify-between border-b border-gray-50 pb-8">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-6 h-6 text-ffn-primary" />
            <h2 className="text-3xl font-serif italic text-ffn-black">Trending Opportunities</h2>
          </div>
          <button className="text-[10px] uppercase tracking-widest text-gray-300 hover:text-ffn-black font-black transition-colors">See All Directory Listings</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {featuredGigs.map((gig) => (
            <motion.div 
              key={gig.id} 
              layoutId={`service-${gig.id}`}
              whileHover={{ y: -10 }}
              onClick={() => setSelectedService(gig)}
              className="bg-white rounded-[3rem] p-6 border border-gray-50 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
            >
              <div className="aspect-[4/3] rounded-[2.2rem] overflow-hidden relative mb-6">
                <img src={gig.image} alt={gig.title} className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" />
                <div className="absolute top-4 right-4 glass-card-vibrant px-3 py-1.5 rounded-full border border-white/30">
                  <div className="flex items-center text-ffn-black text-[9px] font-black">
                    <Star className="w-3 h-3 mr-1 fill-ffn-secondary text-ffn-secondary" /> {gig.rating}
                  </div>
                </div>
              </div>
              <div className="space-y-4 px-2 pb-2">
                <div>
                  <p className="text-[8px] text-ffn-primary uppercase tracking-[0.4em] font-black mb-1">{gig.author}</p>
                  <h3 className="font-serif italic text-xl leading-tight tracking-tight text-ffn-black">{gig.title}</h3>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <span className="text-lg font-serif italic font-bold text-ffn-black">${gig.price}</span>
                  <button className="p-3 bg-gray-50 rounded-xl group-hover:bg-ffn-black group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-ffn-black/80 backdrop-blur-xl">
            <motion.div 
              layoutId={`service-${selectedService.id}`}
              className="bg-white w-full max-w-5xl h-[85vh] rounded-[4rem] overflow-hidden relative shadow-2xl flex flex-col lg:flex-row border border-white/20"
            >
              <button 
                onClick={() => setSelectedService(null)} 
                className="absolute top-10 right-10 z-50 p-4 bg-ffn-black text-white rounded-2xl hover:scale-110 transition-transform"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="lg:w-1/2 bg-gray-50 relative h-1/2 lg:h-full">
                 <img src={selectedService.image} className="w-full h-full object-cover" alt="" />
                 <div className="absolute bottom-12 left-12">
                   <div className="glass-card-vibrant px-8 py-4 rounded-3xl border border-white/20">
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-black mb-2">Verified Professional Service</p>
                      <div className="flex items-center space-x-3">
                         <div className="w-10 h-10 rounded-xl bg-ffn-black flex items-center justify-center text-white"><ShoppingBag className="w-5 h-5" /></div>
                         <span className="text-xl font-serif italic text-ffn-black">ID: FFN-SRV-{selectedService.id}</span>
                      </div>
                   </div>
                 </div>
              </div>

              <div className="lg:w-1/2 p-12 lg:p-20 flex flex-col justify-between overflow-y-auto no-scrollbar">
                <div className="space-y-12">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                       <span className="text-[10px] bg-ffn-primary/10 text-ffn-primary px-6 py-2 rounded-full font-black uppercase tracking-widest">{selectedService.role}</span>
                       <div className="flex items-center text-ffn-secondary"><Star className="w-4 h-4 fill-current mr-2" /><span className="text-sm font-black">{selectedService.rating} Review Aggregate</span></div>
                    </div>
                    <h2 className="text-5xl font-serif italic text-ffn-black tracking-tight leading-none">{selectedService.title}</h2>
                    <p className="text-[11px] uppercase tracking-[0.4em] font-black text-gray-300">By {selectedService.author}</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-black border-b border-gray-50 pb-4">Mastery Narrative</h4>
                    <p className="text-sm text-gray-500 leading-relaxed font-light italic">"{selectedService.description}"</p>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-black border-b border-gray-50 pb-4">Service Deliverables</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedService.deliverables.map((item, i) => (
                        <div key={i} className="flex items-center space-x-4">
                          <CheckCircle className="w-4 h-4 text-emerald-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-16 space-y-8">
                  <div className="flex items-end justify-between px-2">
                     <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-300">Base Price</p>
                        <p className="text-5xl font-serif italic font-bold text-ffn-black">${selectedService.price}</p>
                     </div>
                     <div className="flex flex-col items-end space-y-1">
                        <div className="flex items-center text-emerald-500 font-black text-[9px] uppercase tracking-widest"><ShieldCheck className="w-3 h-3 mr-1" /> Escrow Secure</div>
                        <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Protocol Estimated 3-5 Days</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] shadow-xl hover:bg-ffn-primary transition-all flex items-center justify-center space-x-4">
                       <Zap className="w-5 h-5 text-ffn-accent" />
                       <span>Initiate Booking</span>
                    </button>
                    <button className="p-8 bg-gray-50 text-ffn-black rounded-[2rem] hover:bg-gray-100 transition-colors shadow-sm">
                       <MessageCircle className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <section className="bg-ffn-black rounded-[5rem] p-24 text-center space-y-12 relative overflow-hidden shadow-3xl border border-white/5">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-ffn-primary/10 blur-[150px] rounded-full animate-float"></div>
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white">
             <Zap className="w-4 h-4 text-ffn-accent" />
             <span className="text-[9px] font-black uppercase tracking-[0.5em]">Identity Premium</span>
          </div>
          <h2 className="text-6xl md:text-8xl font-serif italic text-white tracking-tighter leading-none">Elevate Your <br/> <span className="text-gradient-vibrant font-bold not-italic">Identity.</span></h2>
          <p className="text-white/40 max-w-xl mx-auto text-sm md:text-xl font-light italic leading-relaxed">Access elite studio rentals, high-fidelity retouching services, and agent-level portfolio coaching through the FFN Global Graph.</p>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
            <button className="w-full sm:w-auto bg-white text-ffn-black px-16 py-8 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl hover:bg-ffn-primary hover:text-white transition-all">FFN Pro Early Access</button>
            <button className="w-full sm:w-auto text-white/60 hover:text-white text-[10px] font-black uppercase tracking-[0.5em] border-b border-white/20 pb-1 transition-all">Identity Protocols</button>
          </div>
        </div>
      </section>
    </div>
  );
};
