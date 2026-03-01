
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Search, Loader2, Award, Zap, Globe, BrainCircuit } from 'lucide-react';
import { geminiService } from '../services/geminiService';

export const TrendLab: React.FC = () => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runAnalysis = async () => {
    setIsLoading(true);
    try {
      const result = await geminiService.analyzeStyle("");
      setAnalysis(result || "Unable to sync with trend nodes.");
    } catch (e) {
      console.error(e);
      setAnalysis("Error connecting to intelligence protocol.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-20 py-12 animate-in fade-in duration-700">
      <header className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center space-x-3 px-6 py-2 bg-ffn-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.5em] shadow-2xl">
          <BrainCircuit className="w-4 h-4 text-ffn-accent animate-pulse" />
          <span>Gemini Intelligence Protocol</span>
        </div>
        <h1 className="text-7xl md:text-9xl font-serif italic text-ffn-black tracking-tighter leading-none">Trend <br/> Forensic Lab.</h1>
        <p className="text-xl text-gray-400 font-light italic max-w-2xl mx-auto">Leverage advanced computational modeling to forecast the next evolution of global fashion cycles.</p>
        <div className="pt-6">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={runAnalysis}
            disabled={isLoading}
            className="px-16 py-8 bg-ffn-black text-white rounded-[2.5rem] text-xs font-black uppercase tracking-[0.5em] shadow-3xl hover:bg-ffn-primary transition-all flex items-center justify-center space-x-4 mx-auto disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            <span>{isLoading ? 'Processing Signal...' : 'Initiate Trend Forecast'}</span>
          </motion.button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {analysis ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-2xl space-y-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/5 blur-[100px]" />
                <div className="flex items-center justify-between border-b border-gray-50 pb-8">
                   <h3 className="text-3xl font-serif italic text-ffn-black">Intelligence Report</h3>
                   <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Live Forecast 2025</span>
                </div>
                <div className="prose prose-ffn max-w-none">
                  <p className="text-lg text-gray-600 leading-relaxed font-light whitespace-pre-wrap">{analysis}</p>
                </div>
                <div className="pt-12 flex gap-4">
                  <button className="flex-1 py-6 bg-ffn-black text-white rounded-3xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Export Narrative</button>
                  <button onClick={() => setAnalysis(null)} className="px-8 py-6 bg-gray-50 text-gray-400 rounded-3xl hover:text-ffn-accent transition-colors"><TrendingUp className="w-5 h-5" /></button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-[600px] bg-gray-50/50 rounded-[4rem] border border-dashed border-gray-200 flex flex-center items-center justify-center"
              >
                <div className="text-center space-y-6 opacity-30">
                   <Search className="w-16 h-16 mx-auto mb-4" />
                   <p className="text-[10px] uppercase tracking-[0.5em] font-black">Awaiting Intelligence Sync</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-ffn-black text-white p-12 rounded-[3.5rem] shadow-2xl space-y-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-ffn-accent/20 blur-[50px] animate-pulse" />
              <div className="flex items-center space-x-3 text-ffn-primary">
                 <Award className="w-5 h-5" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Mastery Tool</span>
              </div>
              <h3 className="text-3xl font-serif italic leading-none">Forecast Accuracy</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">Our models are trained on 15 years of editorial data from Milan, Paris, and London archives.</p>
              <div className="pt-4">
                <div className="flex items-end justify-between mb-2">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Reliability Index</span>
                   <span className="text-2xl font-serif italic text-ffn-primary">94.2%</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: '94.2%' }} className="h-full bg-ffn-primary shadow-[0_0_10px_rgba(99,102,241,1)]" />
                </div>
              </div>
           </div>

           <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-xl space-y-10">
              <h4 className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary">Active Signals</h4>
              <div className="space-y-6">
                {[
                  { label: 'Neo-Ruralism', strength: 'Strong', color: 'text-emerald-500' },
                  { label: 'Digital Brutalism', strength: 'Emerging', color: 'text-blue-500' },
                  { label: 'Hyper-Minimal', strength: 'Stable', color: 'text-gray-400' }
                ].map((signal, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-ffn-black">{signal.label}</span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${signal.color}`}>{signal.strength}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-5 bg-gray-50 text-gray-400 rounded-2xl text-[9px] font-bold uppercase tracking-widest hover:bg-ffn-black hover:text-white transition-all">View All Nodes</button>
           </div>
        </div>
      </div>
    </div>
  );
};
