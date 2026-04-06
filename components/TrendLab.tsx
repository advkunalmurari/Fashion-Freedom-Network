import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Globe, Zap, Users,
  ArrowUpRight, ArrowDownRight,
  MapPin, Activity, Flame, Target
} from 'lucide-react';
import { MarketDemandHeatmap } from './MarketDemandHeatmap';
import { NeuralForecast } from './NeuralForecast';
import {
  MOCK_TRENDS,
  MOCK_STYLE_NODES,
  MOCK_SENTIMENT_PULSE,
  MOCK_EMERGING_AESTHETICS
} from '../constants';

export const TrendLab: React.FC = () => {
  return (
    <div className="min-h-screen pb-32 space-y-24">
      {/* Sentiment Protocol Ticker */}
      <div className="relative py-4 bg-black/40 border-y border-white/5 overflow-hidden">
        <div className="flex space-x-12 animate-marquee whitespace-nowrap">
          {[...MOCK_SENTIMENT_PULSE, ...MOCK_SENTIMENT_PULSE].map((signal, i) => (
            <div key={`${signal.id}-${i}`} className="inline-flex items-center space-x-3">
              <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">
                {signal.keyword}
              </span>
              <span className={`text-[10px] font-black ${signal.sentiment === 'positive' ? 'text-green-500' : signal.sentiment === 'negative' ? 'text-red-500' : 'text-gray-400'}`}>
                {signal.sentiment === 'positive' ? '↑' : signal.sentiment === 'negative' ? '↓' : '•'}
              </span>
              <span className="text-[10px] font-medium text-white/40">{signal.volume}% Vol</span>
            </div>
          ))}
        </div>
      </div>

      {/* Editorial Header */}
      <div className="relative py-32 px-12 rounded-[5rem] bg-ffn-secondary border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80')] opacity-10 grayscale scale-110" />
        <div className="absolute inset-0 bg-gradient-to-br from-ffn-primary/20 via-transparent to-black/80" />
        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-3 px-6 py-2 rounded-full border border-ffn-primary/20 bg-ffn-primary/5 backdrop-blur-3xl"
          >
            <Activity className="w-4 h-4 text-ffn-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-ffn-primary">Protocol 045: Market Liquidity</span>
          </motion.div>
          <h1 className="text-7xl md:text-9xl font-serif italic text-white leading-[0.85] tracking-tighter">
            The Style <br />
            <span className="text-ffn-primary">Quant 2025</span>
          </h1>
          <p className="text-base md:text-xl text-gray-400 font-medium max-w-3xl mx-auto leading-relaxed italic">
            "The future of fashion isn't predicted; it's computed across thousands of decentralized style nodes."
          </p>
        </div>
      </div>

      {/* Aesthetic Spotlight Carousel */}
      <div className="space-y-12">
        <div className="flex items-end justify-between px-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Emerging DNA</span>
            <h2 className="text-4xl font-serif italic text-white">Aesthetic Spotlights</h2>
          </div>
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest max-w-xs text-right">
            Neural projections of dominant visual identities for Q3/Q4.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {MOCK_EMERGING_AESTHETICS.map((aesthetic, i) => (
            <motion.div
              key={aesthetic.id}
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative aspect-[3/4] rounded-[3rem] overflow-hidden group cursor-crosshair border border-white/5 shadow-2xl"
            >
              <img
                src={aesthetic.imageUrl}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110"
                alt={aesthetic.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90" />

              <div className="absolute inset-0 p-10 flex flex-col justify-end space-y-6">
                <div className="space-y-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">{aesthetic.subtitle}</span>
                  <h3 className="text-4xl font-serif italic text-white leading-none">{aesthetic.title}</h3>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100 space-y-6">
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">
                    {aesthetic.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aesthetic.topNodes.map(node => (
                      <span key={node} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white">
                        {node}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute top-8 right-8 w-14 h-14 rounded-full bg-ffn-primary flex flex-col items-center justify-center text-black shadow-2xl p-2">
                <span className="text-[8px] font-black uppercase leading-none">Growth</span>
                <span className="text-sm font-black text-black">+{aesthetic.demandGrowth}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Intelligence Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <MarketDemandHeatmap />
        </div>
        <div className="lg:col-span-4">
          <NeuralForecast />
        </div>
      </div>

      {/* Trend Nodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MOCK_TRENDS.map((trend, i) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 group hover:bg-white/10 transition-all duration-500"
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-xl bg-black/40 ${trend.trend === 'up' ? 'text-green-500' : trend.trend === 'down' ? 'text-red-500' : 'text-gray-500'}`}>
                {trend.trend === 'up' ? <ArrowUpRight className="w-5 h-5" /> : trend.trend === 'down' ? <ArrowDownRight className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${trend.trend === 'up' ? 'text-green-500' : 'text-red-400'}`}>
                {trend.change > 0 ? `+${trend.change}%` : `${trend.change}%`}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">{trend.label}</span>
              <div className="text-3xl font-serif italic text-white">{trend.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Style Nodes Table */}
        <div className="p-10 rounded-[3rem] bg-white/5 border border-white/5 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-serif italic text-white">Active Style Nodes</h3>
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ffn-primary">Geographic Competence Index</p>
            </div>
          </div>
          <div className="space-y-6">
            {MOCK_STYLE_NODES.map((node, i) => (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center space-x-6">
                  <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-gray-500 group-hover:text-ffn-primary transition-colors">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-base font-serif italic text-white">{node.city}: {node.styleName}</h4>
                    <div className="flex items-center space-x-3 text-[8px] font-black uppercase tracking-widest text-gray-500">
                      <span>{node.activeTalent} Identities</span>
                      <span>•</span>
                      <span className="text-green-500">+{node.growth}% Index</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-black text-white">{node.demandScore}%</div>
                  <div className="text-[7px] font-black uppercase tracking-widest text-gray-500">Node Demand</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Global Opportunity Index */}
        <div className="p-10 rounded-[3rem] bg-ffn-primary text-black space-y-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-black/20 overflow-hidden">
            <motion.div
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="w-1/3 h-full bg-black/40 shadow-[0_0_15px_rgba(0,0,0,0.5)]"
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-serif italic leading-tight">Regional Opportunity Thresholds</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Strategic Deployment Data • Live Feed</p>
          </div>

          <div className="space-y-8">
            {[
              { label: 'Runway Talent Liquidity', value: 88, city: 'Milan', trend: '+12.4%' },
              { label: 'CGI Identity Demand', value: 74, city: 'Tokyo', trend: '+18.2%' },
              { label: 'Editorial Visualists', value: 95, city: 'Paris', trend: '+4.1%' },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                    <div className="flex items-center space-x-2">
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40">{item.city} Protocol</div>
                      <span className="text-[8px] font-black text-black/60 bg-white/40 px-2 rounded-full">{item.trend}</span>
                    </div>
                  </div>
                  <span className="text-xl font-serif italic">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-black/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className="h-full bg-black"
                  />
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group w-full py-6 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <div className="flex items-center justify-center space-x-4 relative z-10">
              <span>Generate Predictive Brief</span>
              <Target className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" />
            </div>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
