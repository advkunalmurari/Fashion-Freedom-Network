
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Ticket, Share2, ExternalLink, ArrowRight, Star } from 'lucide-react';

export const Events: React.FC = () => {
  const events = [
    { title: 'Paris Fashion Week AW25', city: 'Paris', date: 'Sept 25 - Oct 03', type: 'Runway', image: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=800' },
    { title: 'Sustainable Textile Expo', city: 'London', date: 'Oct 12 - Oct 15', type: 'Conference', image: 'https://images.unsplash.com/photo-1445205170230-053b830c6050?auto=format&fit=crop&q=80&w=800' },
    { title: 'Milan Digital Fashion Gala', city: 'Milan', date: 'Nov 02', type: 'Networking', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800' },
    { title: 'Neo-Tokyo Streetwear Summit', city: 'Tokyo', date: 'Nov 18 - Nov 20', type: 'Festival', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="space-y-24 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-10">
        <div className="space-y-4">
          <div className="inline-flex items-center space-x-3 text-ffn-primary">
            <Calendar className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.5em]">Global Industry Calendar</span>
          </div>
          <h1 className="text-7xl font-serif italic tracking-tighter text-ffn-black leading-none">Industry Events</h1>
        </div>
        <div className="flex items-center space-x-6">
           <button className="px-10 py-5 bg-white border border-gray-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:border-ffn-primary transition-all shadow-sm">Your Schedule</button>
           <button className="px-10 py-5 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-ffn-primary transition-all">Submit Event</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="group bg-white rounded-[4rem] overflow-hidden shadow-xl border border-gray-50 flex flex-col h-[600px] transition-all"
          >
            <div className="h-2/3 relative overflow-hidden">
               <img src={event.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
               <div className="absolute top-8 left-8">
                  <span className="px-6 py-2 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold uppercase tracking-widest text-ffn-black shadow-lg">{event.type}</span>
               </div>
               <div className="absolute top-8 right-8">
                  <motion.button whileHover={{ rotate: 15 }} className="p-4 bg-ffn-primary text-white rounded-2xl shadow-xl">
                    <Star className="w-5 h-5 fill-white" />
                  </motion.button>
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               <div className="absolute bottom-10 left-10">
                  <div className="flex items-center space-x-3 text-white/70 mb-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{event.city}</span>
                  </div>
                  <h3 className="text-4xl font-serif italic text-white tracking-tight">{event.title}</h3>
               </div>
            </div>

            <div className="flex-1 p-12 flex flex-col justify-between">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Scheduled Date</p>
                    <p className="text-lg font-bold text-ffn-black tracking-tight">{event.date}</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                        <img src={`https://i.pravatar.cc/100?img=${i+40}`} alt="" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-white bg-ffn-gray flex items-center justify-center text-[10px] font-bold text-gray-500">+12</div>
                  </div>
               </div>

               <div className="flex gap-4 pt-8">
                 <button className="flex-1 px-8 py-5 bg-ffn-primary text-white rounded-[1.5rem] text-[9px] font-bold uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-lg shadow-ffn-primary/20">
                   <Ticket className="w-4 h-4" />
                   <span>Request Access</span>
                 </button>
                 <button className="px-8 py-5 bg-gray-50 text-gray-400 rounded-[1.5rem] hover:text-ffn-black transition-colors">
                   <Share2 className="w-5 h-5" />
                 </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
