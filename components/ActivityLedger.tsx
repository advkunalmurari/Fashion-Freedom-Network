
import React from 'react';
import { motion } from 'framer-motion';
import { Activity, CheckCircle, Zap, MessageSquare, UserPlus, Award, Clock } from 'lucide-react';

export const ActivityLedger: React.FC = () => {
  const activities = [
    { id: 1, type: 'VERIFICATION', label: 'Identity Verified', desc: 'Editorial Hub has approved your Master Identity Protocol.', time: '2h ago', icon: Award, color: 'text-ffn-primary' },
    { id: 2, type: 'HIRE', label: 'Inquiry Received', desc: 'Milan Creative Lab sent a booking inquiry for Paris FW.', time: '5h ago', icon: Zap, color: 'text-ffn-accent' },
    { id: 3, type: 'FOLLOW', label: 'New Connection', desc: '@vogue_editorial added you to their professional graph.', time: '1d ago', icon: UserPlus, color: 'text-blue-500' },
    { id: 4, type: 'COMMENT', label: 'Mastery Feedback', desc: '3 professionals commented on your latest editorial post.', time: '2d ago', icon: MessageSquare, color: 'text-emerald-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-16 animate-in fade-in duration-700">
      <header className="space-y-6">
        <div className="inline-flex items-center space-x-3 text-ffn-primary">
          <Activity className="w-5 h-5" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Activity Ledger</span>
        </div>
        <h1 className="text-7xl font-serif italic tracking-tighter text-ffn-black">Your Activity</h1>
        <p className="text-gray-400 font-light italic max-w-xl">Tracking your professional growth and network sovereignty in real-time.</p>
      </header>

      <div className="space-y-4">
        {activities.map((item, idx) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 flex items-center justify-between hover:shadow-2xl transition-all hover:border-ffn-primary/20"
          >
            <div className="flex items-center space-x-8">
              <div className={`w-16 h-16 rounded-[1.5rem] bg-gray-50 flex items-center justify-center ${item.color} shadow-inner group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-serif italic text-ffn-black">{item.label}</h3>
                <p className="text-sm text-gray-500 font-light">{item.desc}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 flex items-center">
                <Clock className="w-3 h-3 mr-2" /> {item.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="py-20 text-center opacity-20">
         <p className="text-[9px] font-black uppercase tracking-[0.6em]">End of Ledger Record</p>
      </div>
    </div>
  );
};
