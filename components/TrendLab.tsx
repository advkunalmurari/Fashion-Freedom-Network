
import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Globe, Zap, Users,
  ArrowUpRight, ArrowDownRight,
  MapPin, Activity, Flame, Target
} from 'lucide-react';
import { MarketDemandHeatmap } from './MarketDemandHeatmap';
import { MOCK_TRENDS, MOCK_STYLE_NODES } from '../constants';

export const TrendLab: React.FC = () => {
  return (
    <div className="min-h-screen pb-32 space-y-16">
      {/* Editorial Header */}
      <div className="relative py-20 px-8 rounded-[4rem] bg-ffn-secondary border border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-ffn-primary/10 via-transparent to-transparent opacity-50" />
        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center space-x-3 px-6 py-2 rounded-full border border-ffn-primary/20 bg-ffn-primary/5 backdrop-blur-3xl">
            <Zap className="w-4 h-4 text-ffn-primary animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary">Market Intelligence Protocol</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif italic text-white leading-tight">
            Predictive Style <br />
            <span className="text-ffn-primary">Liquidity Intelligence</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Real-time analysis of fashion capital demand nodes, professional movement, and the emergence of hyper-curated professional trends.
          </p>
        </div>
      </div>

      {/* Primary Market Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-12">
          <MarketDemandHeatmap />
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
        <div className="p-10 rounded-[3rem] bg-ffn-primary text-black space-y-10">
          <div className="space-y-3">
            <h3 className="text-2xl font-serif italic leading-tight">Regional Opportunity Thresholds</h3>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Strategic Deployment Data</p>
          </div>

          <div className="space-y-8">
            {[
              { label: 'Runway Talent Liquidity', value: 88, city: 'Milan' },
              { label: 'CGI Identity Demand', value: 74, city: 'Tokyo' },
              { label: 'Editorial Visualists', value: 95, city: 'Paris' },
            ].map((item, i) => (
              <div key={i} className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-tight">{item.label}</span>
                    <div className="text-[8px] font-black uppercase tracking-widest opacity-40">{item.city} Protocol</div>
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

          <button className="w-full py-6 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.4em] hover:brightness-110 transition-all flex items-center justify-center space-x-4 shadow-2xl">
            <span>Generate Predictive Brief</span>
            <Target className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
