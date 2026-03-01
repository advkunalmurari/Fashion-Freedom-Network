
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Send, CheckCircle, Loader2, X } from 'lucide-react';

export const ReportProblem: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setIsSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-16 animate-in fade-in duration-700 py-10">
      <header className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-ffn-accent/10 rounded-[2.5rem] flex items-center justify-center text-ffn-accent">
            <AlertCircle className="w-10 h-10" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Report a Problem</h1>
          <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400">Technical & Community Support Hub</p>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.form 
            key="report-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onSubmit={handleSubmit}
            className="bg-white p-12 md:p-20 rounded-[4rem] border border-gray-100 shadow-2xl space-y-10"
          >
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Issue Category</label>
              <select className="w-full py-6 px-8 text-sm bg-gray-50 border-none rounded-3xl focus:ring-2 focus:ring-ffn-primary appearance-none transition-all">
                <option>Technical Bug</option>
                <option>Account Identity Issue</option>
                <option>Community Misconduct</option>
                <option>Payment Inconsistency</option>
                <option>Feature Request</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-gray-400">Narrative Detail</label>
              <textarea 
                required
                className="w-full py-6 px-8 text-sm h-48 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-ffn-primary transition-all resize-none" 
                placeholder="Please describe the anomaly in detail..."
              />
            </div>

            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-ffn-black text-white py-8 rounded-[2rem] text-[11px] font-bold uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-xl hover:bg-ffn-primary transition-all disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              <span>{isSubmitting ? 'Syncing...' : 'Dispatch Report'}</span>
            </button>
          </motion.form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-emerald-500 text-white p-20 rounded-[4rem] text-center space-y-8 shadow-2xl"
          >
            <CheckCircle className="w-24 h-24 mx-auto" />
            <h3 className="text-4xl font-serif italic">Report Indexed.</h3>
            <p className="text-white/80 font-light italic">Our engineering hub has received your report. Thank you for maintaining platform integrity.</p>
            <button 
              onClick={() => setIsSuccess(false)}
              className="px-12 py-5 bg-white text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl"
            >
              Back to Hub
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
