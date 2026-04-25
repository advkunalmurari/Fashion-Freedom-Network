import React, { useEffect, useState } from 'react';
import { motion as m, useAnimation } from 'framer-motion';
import { 
  Zap, 
  Target, 
  Cpu, 
  Layers, 
  Sparkles,
  Link2
} from 'lucide-react';

interface MatchPulseProps {
  percentage?: number;
  matchType?: string;
  onInitiate?: () => void;
}

export const AntigravityMatchPulse: React.FC<MatchPulseProps> = ({ 
  percentage = 98.4, 
  matchType = "Editorial Synergy",
  onInitiate 
}) => {
  const controls = useAnimation();
  const [pulseScale, setPulseScale] = useState(1);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseScale(1.05);
      setTimeout(() => setPulseScale(1), 200);
    }, 1500);
    return () => clearInterval(pulseInterval);
  }, []);

  return (
    <div className="relative w-full aspect-square md:aspect-auto md:h-[700px] bg-[#050505] rounded-[4rem] overflow-hidden border border-white/5 flex items-center justify-center group shadow-2xl">
      {/* Studio Backdrop Glow */}
      <div className="absolute inset-0 studio-lighting opacity-40" />

      {/* Neural Particles Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <m.div
            key={i}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1.2, 0]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 10
            }}
            className="absolute rounded-full bg-ffn-primary w-1 h-1"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`
            }}
          />
        ))}
      </div>

      {/* Main Core Node */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-80 h-80 md:w-[450px] md:h-[450px]">
          
          {/* Orbital Ring 1: High Frequency */}
          <m.div 
            animate={{ rotate: 360, scale: pulseScale }}
            transition={{ rotate: { duration: 25, repeat: Infinity, ease: 'linear' } }}
            className="absolute inset-0 border-[1.5px] border-dashed border-ffn-primary/20 rounded-full" 
          />

          {/* Orbital Ring 2: Medium Frequency */}
          <m.div 
            animate={{ rotate: -360, scale: pulseScale }}
            transition={{ rotate: { duration: 40, repeat: Infinity, ease: 'linear' } }}
            className="absolute inset-8 border-[1.5px] border-white/5 rounded-full" 
          />

          {/* Orbital Ring 3: Glitch Ring */}
          <m.div 
            animate={{ 
              rotate: [0, 90, 180, 270, 360],
              opacity: [0.1, 0.4, 0.1, 0.4, 0.1]
            }}
            transition={{ duration: 15, repeat: Infinity }}
            className="absolute inset-16 border-[4px] border-double border-ffn-accent/10 rounded-full blur-[2px]" 
          />

          {/* Core Sphere */}
          <m.div 
            animate={{ 
              scale: pulseScale,
              boxShadow: [
                '0 0 40px rgba(255,51,102,0.2)',
                '0 0 80px rgba(255,51,102,0.4)',
                '0 0 40px rgba(255,51,102,0.2)'
              ]
            }}
            className="absolute inset-24 rounded-full bg-black border border-white/10 flex items-center justify-center overflow-hidden group/core"
          >
            {/* Inner Iridescent Flow */}
            <m.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 premium-iridescent opacity-10 group-hover/core:opacity-30 transition-opacity" 
            />

            <div className="relative flex flex-col items-center space-y-4">
              <m.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center space-x-3"
              >
                <Cpu className="w-4 h-4 text-ffn-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">Neural Match</span>
              </m.div>
              <div className="text-8xl md:text-[9rem] editorial-masthead text-white tracking-tighter italic">
                {percentage}%
              </div>
              <div className="px-6 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">{matchType}</span>
              </div>
            </div>
          </m.div>

          {/* Exterior Meta Nodes */}
          <div className="absolute top-0 right-0 p-8">
            <m.div 
              whileHover={{ scale: 1.1 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex items-center space-x-6"
            >
              <div className="p-3 bg-cyan-400/10 rounded-xl">
                <Target className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Precision</p>
                <p className="text-sm font-bold text-white tracking-widest uppercase">High Affinity</p>
              </div>
            </m.div>
          </div>
        </div>

        {/* Action Deck */}
        <div className="mt-20 flex flex-col items-center space-y-8">
           <m.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-12"
          >
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Layers className="w-4 h-4 text-white/40" />
              </div>
              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">Aesthetic</span>
            </div>
            <div className="w-16 h-px bg-white/10" />
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Sparkles className="w-4 h-4 text-white/40" />
              </div>
              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">Vision</span>
            </div>
            <div className="w-16 h-px bg-white/10" />
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                <Link2 className="w-4 h-4 text-white/40" />
              </div>
              <span className="text-[8px] font-black tracking-widest text-white/20 uppercase">Synergy</span>
            </div>
          </m.div>

          <m.button 
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={onInitiate}
            className="relative overflow-hidden bg-white text-black px-16 py-8 rounded-[3rem] group"
          >
            <div className="absolute inset-0 bg-ffn-primary -translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
            <div className="relative z-10 flex items-center space-x-6 group-hover:text-white transition-colors">
              <Zap className="w-5 h-5 fill-current" />
              <span className="text-[12px] font-black uppercase tracking-[0.6em]">Initiate Contract</span>
            </div>
          </m.button>

          <p className="text-[9px] font-bold tracking-[0.4em] text-white/20 uppercase">Neural match verified through Antigravity Protocol v4.2</p>
        </div>
      </div>
    </div>
  );
};
