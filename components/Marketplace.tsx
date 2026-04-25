
import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, ShoppingBag, TrendingUp, Star, ArrowRight, X,
  CheckCircle, ShieldCheck, Zap, MessageCircle, DollarSign, Clock,
  Camera, PlayCircle, Box, MapPin, Activity, Flame
} from 'lucide-react';
import { ARTryOnOverlay } from './ARTryOnOverlay';
import { LiveRunway } from './LiveRunway';
import { Garment3DViewer } from './Garment3DViewer';
import {
  MOCK_MARKETPLACE_ITEMS,
  MOCK_BOUTIQUE_SPOTLIGHTS,
  MOCK_LIVE_DROPS
} from '../constants';
import { MarketplaceItem, BoutiqueSpotlight, LiveDrop } from '../types';
import { TalentRecommendations } from './TalentRecommendations';

const LiveDropBar: React.FC<{ drops: LiveDrop[] }> = ({ drops }) => {
  return (
    <div className="bg-ffn-black py-3 relative overflow-hidden">
      <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
        {drops.map((drop) => (
          <div key={drop.id} className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ffn-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Drop Detected</span>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{drop.title}</span>
            <div className="flex items-center space-x-2 bg-ffn-primary/20 px-3 py-1 rounded-full border border-ffn-primary/30">
              <Clock className="w-3 h-3 text-ffn-primary" />
              <span className="text-[10px] font-black text-ffn-primary tabular-nums">{drop.timeRemaining}</span>
            </div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Slots: {drop.slotsRemaining}/{drop.slotsTotal}</span>
            <ArrowRight className="w-3 h-3 text-white/20" />
          </div>
        ))}
        {/* Duplicate for seamless scrolling */}
        {drops.map((drop) => (
          <div key={`dup-${drop.id}`} className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-ffn-primary animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">Drop Detected</span>
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-widest">{drop.title}</span>
            <div className="flex items-center space-x-2 bg-ffn-primary/20 px-3 py-1 rounded-full border border-ffn-primary/30">
              <Clock className="w-3 h-3 text-ffn-primary" />
              <span className="text-[10px] font-black text-ffn-primary tabular-nums">{drop.timeRemaining}</span>
            </div>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Slots: {drop.slotsRemaining}/{drop.slotsTotal}</span>
            <ArrowRight className="w-3 h-3 text-white/20" />
          </div>
        ))}
      </div>
    </div>
  );
};

const BoutiqueSpotlightCarousel: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % MOCK_BOUTIQUE_SPOTLIGHTS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const boutique = MOCK_BOUTIQUE_SPOTLIGHTS[index];

  return (
    <div className="relative h-[400px] md:h-[600px] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden group shadow-3xl">

      <AnimatePresence mode="wait">
        <m.div
          key={boutique.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img src={boutique.imageUrl} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-ffn-black/20 to-transparent" />
          <div className="scan-line" />
        </m.div>
      </AnimatePresence>

      <div className="absolute bottom-16 left-16 right-16 flex flex-col md:flex-row md:items-end justify-between gap-10">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6 max-w-2xl"
        >
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full bg-ffn-primary/20 backdrop-blur-md border border-ffn-primary/30 text-ffn-primary">
            <Zap className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Boutique Spotlight</span>
          </div>
          <div className="space-y-2">
            <p className="text-white/60 text-[9px] md:text-[11px] font-bold uppercase tracking-[0.5em]">{boutique.subtitle}</p>
            <h2 className="text-4xl md:text-7xl font-serif italic text-white tracking-tighter leading-none">{boutique.title}</h2>
          </div>

          <p className="text-white/40 text-sm font-light leading-relaxed italic max-w-xl">"{boutique.description}"</p>
          <div className="flex flex-wrap gap-3">
            {boutique.specialization.map(s => (
              <span key={s} className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/60 uppercase tracking-widest">{s}</span>
            ))}
          </div>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 }}
          className="flex flex-col space-y-4"
        >
          <div className="glass-card-holographic p-8 rounded-[2.5rem] space-y-4 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Inventory Status</span>
              <span className="text-[10px] font-black text-ffn-primary uppercase tracking-widest">{boutique.capacity}</span>
            </div>
            <div className="flex items-center space-x-4">
              <MapPin className="w-5 h-5 text-ffn-primary" />
              <span className="text-xl font-serif italic text-white">{boutique.location}</span>
            </div>
            <button className="w-full py-5 bg-white text-ffn-black rounded-2xl text-[10px] font-black uppercase tracking-[0.5em] hover:bg-ffn-primary hover:text-white transition-all" title="Secure Elite Appointment">Secure Appointment</button>
          </div>
          <div className="flex justify-center space-x-2">
            {MOCK_BOUTIQUE_SPOTLIGHTS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-12 h-1 rounded-full transition-all ${i === index ? 'bg-ffn-primary' : 'bg-white/20'}`}
                title={`Switch to Spotlight ${i + 1}`}
              />
            ))}
          </div>
        </m.div>
      </div>
    </div>
  );
};

export const Marketplace: React.FC = () => {
  const [selectedService, setSelectedService] = useState<MarketplaceItem | null>(null);
  const [showARTryOn, setShowARTryOn] = useState(false);
  const [showLiveRunway, setShowLiveRunway] = useState(false);
  const [active3DItem, setActive3DItem] = useState<MarketplaceItem | null>(null);

  const categories = ['Digital Couture', 'Elite Studios', 'Pro Services', 'Archives', 'Material Labs'];

  return (
    <div className="space-y-16 pb-32 animate-in fade-in duration-700">
      <LiveDropBar drops={MOCK_LIVE_DROPS} />

      <header className="space-y-12 px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center space-x-3 text-ffn-primary">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase tracking-[0.7em]">Professional Commerce Node</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif italic tracking-tighter text-ffn-black leading-none">The Market</h1>

          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={() => setShowLiveRunway(true)}
              className="group relative px-8 py-5 bg-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl hover:shadow-ffn-primary/20 transition-all w-full sm:w-auto text-left flex items-center justify-between min-w-[320px]"
              title="Enter Live Runway Protocol"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-ffn-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10 flex items-center space-x-5">
                <div className="w-12 h-12 rounded-full bg-ffn-primary flex items-center justify-center animate-pulse">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-ffn-primary animate-ping" />
                    <p className="text-[9px] text-ffn-primary font-black uppercase tracking-widest">Protocol Live</p>
                  </div>
                  <p className="text-white font-serif italic font-bold text-lg">Sabyasachi Heritage '26</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors ml-6 relative z-10" />
            </button>
            <button className="px-10 py-5 bg-ffn-primary text-white rounded-[2rem] text-[10px] font-black uppercase tracking-[0.5em] shadow-xl hover:bg-ffn-black transition-all">Register Service</button>
          </div>
        </div>

        <BoutiqueSpotlightCarousel />

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-ffn-primary transition-colors" />
            <input
              type="text"
              placeholder="Query the Global Commerce Graph..."
              className="w-full bg-white border border-gray-100 rounded-[2.5rem] py-8 pl-18 pr-8 text-xs font-bold uppercase tracking-widest shadow-2xl shadow-gray-200/20 focus:shadow-3xl focus:border-ffn-primary transition-all outline-none"
            />
          </div>
          <div className="flex overflow-x-auto space-x-3 no-scrollbar lg:max-w-xl pb-2">
            {categories.map(cat => (
              <button key={cat} className="flex-none bg-white border border-gray-50 px-10 py-5 rounded-[1.5rem] text-[9px] uppercase tracking-widest font-black text-gray-400 hover:text-ffn-black hover:border-ffn-black hover:shadow-xl transition-all">
                {cat}
              </button>
            ))}
            <button className="flex-none bg-gray-50 p-5 rounded-[1.5rem] text-gray-400 hover:text-ffn-black hover:shadow-lg transition-all" title="Filter Services">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* AI Talent Match Spotlight */}
      <section className="px-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-3xl p-12 rounded-[4rem] border border-gray-100/50 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-ffn-primary/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <TalentRecommendations />
        </div>
      </section>

      <section className="space-y-12 px-6">
        <div className="flex items-center justify-between border-b border-gray-50 pb-10">
          <div className="flex items-center space-x-6">
            <div className="w-12 h-12 rounded-2xl bg-ffn-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-ffn-primary" />
            </div>
            <h2 className="text-4xl font-serif italic text-ffn-black tracking-tight">Demand Velocity Hub</h2>
          </div>
          <button className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300 hover:text-ffn-primary transition-colors">See Market Analytics</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12">
          {MOCK_MARKETPLACE_ITEMS.map((item) => (
            <m.div
              key={item.id}
              layoutId={`service-${item.id}`}
              whileHover={{ y: -15 }}
              onClick={() => setSelectedService(item)}
              className="bg-white rounded-[4rem] p-7 border border-gray-50 shadow-2xl hover:shadow-3xl transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="aspect-[4/5] rounded-[3rem] overflow-hidden relative mb-8">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-6 right-6 flex flex-col space-y-3 z-20">
                  <div className="glass-card-vibrant px-4 py-2 rounded-full border border-white/40 shadow-xl">
                    <div className="flex items-center text-ffn-black text-[10px] font-black">
                      <Star className="w-3.5 h-3.5 mr-1.5 fill-ffn-secondary text-ffn-secondary" /> {item.rating}
                    </div>
                  </div>
                  {item.type === 'digital' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); setActive3DItem(item); }}
                      className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-full text-white hover:bg-ffn-primary hover:text-white transition-all shadow-2xl flex items-center justify-center group-hover:scale-110"
                      title="Immersive 3D Experience"
                    >
                      <Box className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="absolute bottom-6 left-6 right-6 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <div className="glass-card-holographic p-5 rounded-3xl border border-white/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[8px] font-black text-white/50 uppercase tracking-widest">Trust Score</span>
                      <span className="text-[10px] font-black text-emerald-400">{item.trustScore}%</span>
                    </div>
                    <div className="demand-bar">
                      <m.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.velocity}%` }}
                        className="demand-bar-fill"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] text-ffn-primary uppercase tracking-[0.4em] font-black">{item.role}</p>
                    <div className="flex items-center space-x-1.5">
                      <Activity className="w-3 h-3 text-ffn-primary" />
                      <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{item.recentActivity}</span>
                    </div>
                  </div>
                  <h3 className="font-serif italic text-2xl leading-tight tracking-tighter text-ffn-black">{item.title}</h3>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Base Protocol Fee</p>
                    <span className="text-2xl font-serif italic font-bold text-ffn-black">${item.price}</span>
                  </div>
                  <button className="w-14 h-14 bg-gray-50 rounded-[1.5rem] flex items-center justify-center group-hover:bg-ffn-black group-hover:text-white transition-all transform group-hover:rotate-[-45deg]" title="Access Protocol">
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </m.div>
          ))}
        </div>
      </section>

      {/* Redesigned Detail Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-ffn-black/95 backdrop-blur-3xl">
            <m.div
              layoutId={`service-${selectedService.id}`}
              className="bg-white w-full max-w-6xl h-[90vh] rounded-[5rem] overflow-hidden relative shadow-3xl flex flex-col lg:flex-row border border-white/10"
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-12 right-12 z-50 w-16 h-16 bg-ffn-black text-white rounded-[2rem] hover:scale-110 transition-transform flex items-center justify-center shadow-2xl"
                title="Close Service Protocol View"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="lg:w-5/12 bg-gray-100 relative h-1/2 lg:h-full">
                <img src={selectedService.image} className="w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-16 left-16 right-16">
                  <div className="glass-card-holographic p-10 rounded-[3rem] space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
                        <Flame className="w-7 h-7 text-ffn-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Market Intelligence</p>
                        <p className="text-2xl font-serif italic text-white">{selectedService.velocity}% High-Demand Rank</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                      {selectedService.metrics.map((m, i) => (
                        <div key={i} className="space-y-1">
                          <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">{m.label}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-serif italic text-white">{m.value}</span>
                            <TrendingUp className={`w-4 h-4 ${m.trend === 'up' ? 'text-emerald-400' : 'text-gray-400'}`} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:w-7/12 p-20 lg:p-24 flex flex-col justify-between overflow-y-auto no-scrollbar bg-white">
                <div className="space-y-16">
                  <div className="space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-[10px] bg-ffn-primary/10 text-ffn-primary px-8 py-3 rounded-full font-black uppercase tracking-[0.3em]">{selectedService.role}</span>
                        {selectedService.trustScore > 95 && (
                          <div className="flex items-center space-x-2 text-emerald-500 p-2">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Elite Tier</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-ffn-secondary bg-ffn-secondary/5 px-6 py-3 rounded-full">
                        <Star className="w-4 h-4 fill-current mr-3" />
                        <span className="text-[11px] font-black uppercase tracking-widest">{selectedService.rating} FFN Aggregate</span>
                      </div>
                    </div>
                    <h2 className="text-7xl font-serif italic text-ffn-black tracking-tighter leading-none">{selectedService.title}</h2>
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100" />
                      <p className="text-sm uppercase tracking-[0.5em] font-black text-gray-300">Authored by <span className="text-ffn-black">{selectedService.author}</span></p>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-[10px] uppercase tracking-[0.6em] font-black text-ffn-black border-b border-gray-100 pb-6 flex items-center">
                      <Activity className="w-4 h-4 mr-4 text-ffn-primary" />
                      Professional Mastery Narrative
                    </h4>
                    <p className="text-lg text-gray-500 leading-relaxed font-light italic bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100">
                      "{selectedService.description}"
                    </p>
                  </div>

                  <div className="space-y-8">
                    <h4 className="text-[10px] uppercase tracking-[0.6em] font-black text-ffn-black border-b border-gray-100 pb-6 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-4 text-ffn-primary" />
                      Contractual Deliverables
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedService.deliverables.map((item, i) => (
                        <div key={i} className="flex items-center space-x-5 p-4 rounded-2xl bg-white border border-gray-50 hover:border-ffn-primary/30 transition-colors shadow-sm">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-20 space-y-10">
                  <div className="flex items-end justify-between px-4 bg-ffn-black text-white p-12 rounded-[3.5rem] shadow-3xl">
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase tracking-[0.5em] font-black text-white/40">Secure Protocol Fee</p>
                      <p className="text-7xl font-serif italic font-bold text-white tracking-widest">${selectedService.price}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-3">
                      <div className="flex items-center text-emerald-400 font-black text-[10px] uppercase tracking-[0.4em] bg-white/5 py-3 px-6 rounded-full border border-white/10">
                        <ShieldCheck className="w-4 h-4 mr-3" /> FFN Escrow Secure
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-white/30 font-bold">Estimated Turnaround: 3-5 Nodes</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <button
                      onClick={() => setShowARTryOn(true)}
                      className="w-24 h-24 bg-gray-50 text-ffn-black rounded-[2rem] hover:bg-ffn-primary hover:text-white transition-all shadow-xl flex items-center justify-center flex-shrink-0"
                      title="Initiate AR Try-On Protocol"
                    >
                      <Camera className="w-8 h-8" />
                    </button>
                    <button className="flex-1 bg-ffn-primary text-white py-8 rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.6em] shadow-2xl hover:bg-ffn-black transition-all flex items-center justify-center space-x-5 group">
                      <Zap className="w-6 h-6 text-ffn-accent group-hover:animate-bounce" />
                      <span>Execute Booking Protocol</span>
                    </button>
                    <button className="w-24 h-24 bg-gray-50 text-ffn-black rounded-[2rem] hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center flex-shrink-0" title="Direct Communication Hub">
                      <MessageCircle className="w-8 h-8" />
                    </button>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showARTryOn && selectedService && (
          <ARTryOnOverlay
            item={{
              id: selectedService.id,
              title: selectedService.title,
              imageUrl: selectedService.image
            }}
            onClose={() => setShowARTryOn(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLiveRunway && (
          <LiveRunway
            eventId="live_001"
            onClose={() => setShowLiveRunway(false)}
          />
        )}

        {/* 3D Garment Viewer Overlay */}
        {active3DItem && (
          <Garment3DViewer
            imageUrl={active3DItem.image}
            productName={active3DItem.title}
            designerName={active3DItem.author}
            price={`$${active3DItem.price}`}
            onClose={() => setActive3DItem(null)}
          />
        )}
      </AnimatePresence>

      <section className="bg-ffn-black rounded-[3rem] md:rounded-[6rem] p-12 md:p-32 text-center space-y-16 relative overflow-hidden shadow-4xl border border-white/5 mx-6">

        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-ffn-primary/20 blur-[200px] rounded-full animate-float"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-ffn-accent/10 blur-[150px] rounded-full animate-float delay-1000"></div>

        <div className="relative z-10 space-y-10">
          <div className="inline-flex items-center space-x-4 px-8 py-3 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md">
            <Zap className="w-5 h-5 text-ffn-accent" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em]">Professional Identity Premium</span>
          </div>
          <h2 className="text-5xl md:text-9xl font-serif italic text-white tracking-tighter leading-none">Global <br /> <span className="text-gradient-vibrant font-bold not-italic">Liquidity.</span></h2>

          <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-2xl font-light italic leading-relaxed">Access elite studio infrastructures, high-fidelity generative archives, and agent-grade portfolio protocols through the FFN Professional Hub.</p>
          <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
            <button className="w-full sm:w-auto bg-white text-ffn-black px-20 py-10 rounded-[3rem] text-[11px] font-black uppercase tracking-[0.6em] shadow-4xl hover:bg-ffn-primary hover:text-white transition-all transform hover:scale-105 active:scale-95">FFN Pro Early Access</button>
            <button className="w-full sm:w-auto text-white/50 hover:text-white text-[11px] font-black uppercase tracking-[0.6em] border-b-2 border-white/20 pb-2 transition-all hover:border-ffn-primary">Commercial Protocols</button>
          </div>
        </div>
      </section>
    </div>
  );
};
