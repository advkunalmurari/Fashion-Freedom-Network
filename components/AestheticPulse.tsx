import React, { useState } from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  TrendingUp, 
  Eye, 
  Share2, 
  Activity, 
  BarChart3, 
  Target,
  Waveform
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: '00:00', val: 400, sentiment: 240, saturation: 2400 },
  { name: '04:00', val: 300, sentiment: 139, saturation: 2210 },
  { name: '08:00', val: 200, sentiment: 980, saturation: 2290 },
  { name: '12:00', val: 278, sentiment: 390, saturation: 2000 },
  { name: '16:00', val: 189, sentiment: 480, saturation: 2181 },
  { name: '20:00', val: 239, sentiment: 380, saturation: 2500 },
  { name: '23:59', val: 349, sentiment: 430, saturation: 2100 },
];

export const AestheticPulse = () => {
  const [activeMetric, setActiveMetric] = useState('sentiment');

  return (
    <div className="relative w-full min-h-[600px] bg-[#050505] rounded-[4rem] overflow-hidden border border-white/5 shadow-2xl">
      {/* Neural Mesh Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          <pattern id="neural-grid" width="100" height="100" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.5" fill="rgba(255,51,102,0.3)" />
            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#neural-grid)" />
        </svg>
        <m.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,51,102,0.1)_0%,transparent_70%)]" 
        />
      </div>

      {/* Header Deck */}
      <div className="relative z-10 p-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
        <div className="space-y-4">
          <m.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-4 mb-6"
          >
            <div className="p-3 bg-ffn-primary/10 rounded-2xl border border-ffn-primary/20">
              <Activity className="w-5 h-5 text-ffn-primary" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">Neural Trend Forecaster</span>
          </m.div>
          <h2 className="text-6xl md:text-8xl editorial-masthead text-white leading-none italic">
            Aesthetic Pulse.
          </h2>
          <p className="text-white/40 text-sm font-medium tracking-wide uppercase max-w-md">
            Real-time visual consensus mapped through our proprietary neural affinity engine. 
            Detecting micro-shifts in cultural momentum.
          </p>
        </div>

        <div className="flex bg-white/5 backdrop-blur-3xl border border-white/10 p-2 rounded-[2rem]">
          {['sentiment', 'saturation', 'motion'].map((metric) => (
            <button
              key={metric}
              onClick={() => setActiveMetric(metric)}
              className={`px-8 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                activeMetric === metric 
                ? 'bg-white text-black shadow-xl' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              {metric}
            </button>
          ))}
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="relative z-10 px-8 pb-12">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-12 h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="primaryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff3366" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ff3366" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="accentGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#833ab4" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#833ab4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10, fontWeight: 900 }}
              />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  background: 'rgba(5,5,5,0.9)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '1.5rem',
                  backdropFilter: 'blur(20px)',
                  padding: '1.5rem'
                }}
                itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Area 
                type="monotone" 
                dataKey={activeMetric === 'sentiment' ? 'sentiment' : 'saturation'} 
                stroke={activeMetric === 'sentiment' ? '#ff3366' : '#833ab4'} 
                strokeWidth={4} 
                fillOpacity={1} 
                fill={`url(#${activeMetric === 'sentiment' ? 'primaryGradient' : 'accentGradient'})`} 
                animationDuration={2000}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Intelligence Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <m.div 
            whileHover={{ y: -10 }}
            className="premium-card-depth bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 group"
          >
            <div className="flex justify-between items-start mb-10">
              <TrendingUp className="w-6 h-6 text-ffn-primary" />
              <span className="text-[10px] font-black text-ffn-primary">+12.4% Neural Gain</span>
            </div>
            <h4 className="text-xl editorial-masthead text-white group-hover:text-ffn-primary transition-colors">Trajectory</h4>
            <p className="text-white/30 text-xs mt-4 font-medium uppercase tracking-widest leading-relaxed">
              Consensus moving toward avant-garde industrial silhouettes.
            </p>
          </m.div>

          <m.div 
            whileHover={{ y: -10 }}
            className="premium-card-depth bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 group"
          >
            <div className="flex justify-between items-start mb-10">
              <Share2 className="w-6 h-6 text-ffn-accent" />
              <span className="text-[10px] font-black text-ffn-accent">Viral Decay: Low</span>
            </div>
            <h4 className="text-xl editorial-masthead text-white group-hover:text-ffn-accent transition-colors">Resonance</h4>
            <p className="text-white/30 text-xs mt-4 font-medium uppercase tracking-widest leading-relaxed">
              High multi-node secondary engagement detected in Paris sector.
            </p>
          </m.div>

          <m.div 
            whileHover={{ y: -10 }}
            className="premium-card-depth bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 group"
          >
            <div className="flex justify-between items-start mb-10">
              <Target className="w-6 h-6 text-cyan-400" />
              <span className="text-[10px] font-black text-cyan-400">Optimum reached</span>
            </div>
            <h4 className="text-xl editorial-masthead text-white group-hover:text-cyan-400 transition-colors">Core Affinity</h4>
            <p className="text-white/30 text-xs mt-4 font-medium uppercase tracking-widest leading-relaxed">
              Matching protocol suggests immediate deployment for GenZ nodes.
            </p>
          </m.div>
        </div>
      </div>
    </div>
  );
};
