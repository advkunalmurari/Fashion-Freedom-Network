
import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Plus, CheckCircle, ShieldCheck } from 'lucide-react';

export const AccountSwitcher: React.FC = () => {
  const accounts = [
    { id: 'acc1', name: 'Alex Sterling', role: 'Designer', avatar: 'https://i.pravatar.cc/150?u=alex', active: true },
    { id: 'acc2', name: 'Sterling Studios', role: 'Brand Hub', avatar: 'https://i.pravatar.cc/150?u=studio', active: false },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-16 animate-in fade-in duration-700 py-10">
      <header className="space-y-6 text-center">
        <div className="flex justify-center">
          <UserCircle className="w-16 h-16 text-ffn-primary opacity-20" />
        </div>
        <h1 className="text-6xl font-serif italic tracking-tighter text-ffn-black">Identity Switcher</h1>
        <p className="text-[10px] uppercase tracking-[0.5em] font-black text-gray-400">Manage Multiple Professional Layers</p>
      </header>

      <div className="space-y-6">
        {accounts.map((acc) => (
          <motion.div 
            key={acc.id}
            whileHover={{ scale: 1.02 }}
            className={`p-8 rounded-[3rem] border transition-all cursor-pointer flex items-center justify-between ${acc.active ? 'bg-ffn-black text-white border-ffn-black shadow-2xl' : 'bg-white text-ffn-black border-gray-100 hover:border-ffn-primary/20'}`}
          >
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-[1.5rem] overflow-hidden border-2 border-white shadow-sm">
                <img src={acc.avatar} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-serif italic leading-none">{acc.name}</h3>
                  {acc.active && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                </div>
                <p className={`text-[9px] uppercase tracking-widest font-black ${acc.active ? 'text-white/40' : 'text-gray-400'}`}>{acc.role}</p>
              </div>
            </div>
            {acc.active ? (
              <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full">Current Node</span>
            ) : (
              <button className="text-[8px] font-black uppercase tracking-widest text-ffn-primary hover:text-ffn-accent transition-colors">Select Identity</button>
            )}
          </motion.div>
        ))}

        <button className="w-full p-8 border-2 border-dashed border-gray-200 rounded-[3rem] text-gray-400 hover:text-ffn-black hover:border-ffn-black transition-all flex items-center justify-center space-x-4 group">
          <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em]">Establish New Identity</span>
        </button>
      </div>
    </div>
  );
};
