import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Image, Smile, Phone, Video, Info, MoreVertical, Paperclip, Mic, Loader2, CheckCircle, Check, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageService } from '../services/messageService';
import { supabase } from '../supabase';
import { PayPalButton } from './PayPalButton';

const MESSAGING_BG = '/demo/messaging_protocol_bg_1772537507576.png';

export const Messaging: React.FC = () => {
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [showHirePayment, setShowHirePayment] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (threads.length > 0 && threads[activeThreadIndex]) {
      const activeThreadId = threads[activeThreadIndex].id;
      fetchMessages(activeThreadId);

      const channel = supabase
        .channel(`chat_${activeThreadId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `chat_id=eq.${activeThreadId}`,
          },
          (payload) => {
            const newMsg = payload.new as any;
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session && newMsg.sender_id !== session.user.id) {
                setMessages(prev => [...prev, {
                  id: newMsg.id,
                  sender: 'them',
                  text: newMsg.text,
                  time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  status: 'delivered'
                }]);
              }
            });
          }
        )
        .subscribe();

      if (activeThreadIndex === 0) {
        setIsTyping(true);
        const timer = setTimeout(() => setIsTyping(false), 5000);
        return () => {
          clearTimeout(timer);
          supabase.removeChannel(channel);
        };
      }

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeThreadIndex, threads]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const fetchThreads = async () => {
    try {
      const data = await messageService.getThreads();
      if (data.success) {
        setThreads(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch threads:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (threadId: string) => {
    try {
      const data = await messageService.getMessages(threadId);
      if (data.success) {
        const hydrated = data.data.map((m: any, i: number) => ({
          ...m,
          status: m.sender === 'me' ? (i === data.data.length - 1 ? 'delivered' : 'read') : null
        }));
        setMessages(hydrated);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim() || threads.length === 0) return;
    const activeThread = threads[activeThreadIndex];
    if (!activeThread?.participants?.[0]?.id) return;

    try {
      const currentInput = inputValue;
      setInputValue('');

      const optMsg = {
        id: Date.now().toString(),
        sender: 'me',
        text: currentInput,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sending'
      };
      setMessages(prev => [...prev, optMsg]);

      const data = await messageService.sendMessage(activeThread.participants[0].id, currentInput, activeThread.id);

      if (data.success) {
        setMessages(prev => prev.map(m => m.id === optMsg.id ? { ...data.data, status: 'delivered' } : m));
      } else {
        setInputValue(currentInput);
        setMessages(prev => prev.filter(m => m.id !== optMsg.id));
        alert("Failed to send message: " + data.error);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-ffn-black rounded-[4rem] overflow-hidden border border-white/10 shadow-3xl relative">
      {/* Cinematic Background Infrastructure */}
      <div className="absolute inset-0 z-0">
        <img src={MESSAGING_BG} className="w-full h-full object-cover opacity-50" alt="" />
        <div className="absolute inset-0 bg-gradient-to-r from-ffn-black via-ffn-black/40 to-ffn-black" />
        <div className="absolute inset-0 backdrop-blur-2xl" />
      </div>

      {/* Sidebar: Message Nodes */}
      <div className="relative z-10 w-1/3 border-r border-white/5 flex flex-col bg-white/5 backdrop-blur-3xl">
        <div className="p-10 space-y-10">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[9px] font-black text-ffn-primary uppercase tracking-[0.4em]">Protocol</span>
              <h2 className="text-4xl font-serif italic text-white leading-none">Transmission</h2>
            </div>
            <button className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center hover:bg-ffn-primary transition-all group" title="Locate Transmission Node">
              <Search className="w-4 h-4 text-white/40 group-hover:text-white" />
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Locate Identity Node..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 text-[10px] font-bold uppercase tracking-widest text-white placeholder:text-white/20 focus:outline-none focus:border-ffn-primary transition-all"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-6 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-ffn-primary" /></div>
          ) : threads.map((t, idx) => (
            <motion.div
              key={t.id}
              whileHover={{ x: 8 }}
              onClick={() => setActiveThreadIndex(idx)}
              className={`p-6 rounded-[2.5rem] flex items-center space-x-5 cursor-pointer transition-all border
                ${activeThreadIndex === idx
                  ? 'bg-ffn-primary/10 border-ffn-primary shadow-[0_0_30px_rgba(255,51,102,0.1)]'
                  : 'bg-white/5 border-transparent hover:border-white/10 opacity-60 hover:opacity-100'}`}
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl border-2 border-white/10 overflow-hidden shadow-2xl">
                  <img src={t.avatar || 'https://picsum.photos/id/65/100/100'} className="w-full h-full object-cover" alt={t.name} />
                </div>
                {t.status === 'Online' && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-ffn-primary rounded-full border-2 border-ffn-black shadow-[0_0_10px_rgba(255,51,102,0.8)]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm truncate tracking-tight text-white">{t.name || 'Anonymous Node'}</h4>
                  <span className="text-[8px] text-white/30 font-black uppercase tracking-widest">{t.time || 'now'}</span>
                </div>
                <p className="text-[10px] text-white/40 truncate font-medium tracking-tight">
                  {idx === 0 && isTyping ? <span className="text-ffn-primary animate-pulse tracking-widest">TRANSMITTING...</span> : (t.lastMsg || 'Pulse detected')}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Communication Hub */}
      <div className="flex-1 flex flex-col bg-ffn-black/20 backdrop-blur-xl">
        {/* Hub Header */}
        <header className="px-12 py-8 border-b border-white/5 flex items-center justify-between bg-white/5 z-10">
          <div className="flex items-center space-x-5">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border border-white/10 shadow-3xl">
              <img src={threads[activeThreadIndex]?.avatar || 'https://picsum.photos/id/65/100/100'} className="w-full h-full object-cover" alt="" />
            </div>
            <div>
              <span className="block font-serif italic text-2xl text-white leading-none">{threads[activeThreadIndex]?.name || 'Syncing Node...'}</span>
              <span className={`text-[8px] uppercase tracking-[0.3em] font-black mt-2 block ${threads[activeThreadIndex]?.status === 'Online' ? 'text-ffn-primary' : 'text-white/20'}`}>
                {threads[activeThreadIndex]?.status === 'Online' ? 'Active Link Detected' : 'Identity in Stasis'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              {!showHirePayment ? (
                <button
                  onClick={() => setShowHirePayment(true)}
                  className="hidden md:flex items-center space-x-3 bg-ffn-primary text-white px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.4em] shadow-[0_10px_30px_rgba(255,51,102,0.3)] hover:scale-105 transition-all">
                  <Briefcase className="w-4 h-4" />
                  <span>Execute Hiring Protocol</span>
                </button>
              ) : (
                <div className="absolute top-16 right-0 bg-ffn-black/95 backdrop-blur-3xl p-10 rounded-[3rem] w-[400px] shadow-3xl border border-white/10 z-50 space-y-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">Secure Escrow Node</p>
                    <h3 className="text-2xl font-serif italic text-white">Deposit Activation</h3>
                  </div>
                  <PayPalButton
                    amount="250.00"
                    currency="USD"
                    type="capture"
                    onSuccess={(data) => {
                      alert(`Protocol Activated. Order ${data.id} secured.`);
                      setShowHirePayment(false);
                    }}
                  />
                  <button onClick={() => setShowHirePayment(false)} className="text-[9px] uppercase font-black tracking-widest text-white/20 hover:text-white w-full text-center transition-all">Abort Protocol</button>
                </div>
              )}
            </div>
            <div className="h-8 w-px bg-white/5 mx-2 hidden md:block" />
            <button className="p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Initialize Audio Link"><Phone className="w-5 h-5" /></button>
            <button className="p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Initialize Visual Link"><Video className="w-5 h-5" /></button>
            <button className="p-4 text-white/20 hover:text-white hover:bg-white/5 rounded-xl transition-all" title="Protocol Options"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Transmission Feed */}
        <div className="flex-1 p-10 md:p-16 space-y-10 overflow-y-auto no-scrollbar relative">
          <div className="flex flex-col items-center py-10 opacity-20">
            <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white">Encrypted Transmission Stream</span>
          </div>

          <AnimatePresence>
            {messages.map((m, index) => (
              <motion.div
                key={m.id || index}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xl p-8 rounded-[2.5rem] text-sm leading-relaxed shadow-3xl relative
                  ${m.sender === 'me'
                    ? 'bg-ffn-primary text-white rounded-tr-none shadow-[0_10px_30px_rgba(255,51,102,0.2)]'
                    : 'bg-white/10 border border-white/10 text-white rounded-tl-none backdrop-blur-2xl'}`}>
                  {m.text}

                  {/* Metadata line (Time + Status) */}
                  <div className={`flex items-center space-x-3 text-[8px] mt-4 font-black uppercase tracking-[0.2em] ${m.sender === 'me' ? 'text-white/60' : 'text-white/30'}`}>
                    <span>{m.time}</span>
                    {m.sender === 'me' && (
                      <span className="flex items-center">
                        {m.status === 'sending' && <Loader2 className="w-3 h-3 animate-spin" />}
                        {m.status === 'delivered' && <Check className="w-3 h-3 text-white" />}
                        {m.status === 'read' && (
                          <div className="flex -space-x-1 text-ffn-primary">
                            <Check className="w-3 h-3" />
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing Relay */}
            {isTyping && activeThreadIndex === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start"
              >
                <div className="bg-white/5 border border-white/10 rounded-[2rem] rounded-tl-none px-8 py-5 backdrop-blur-xl flex items-center space-x-3">
                  <div className="w-2 h-2 bg-ffn-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-ffn-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-ffn-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Data Injection Node */}
        <div className="p-10 md:p-12 border-t border-white/5 bg-white/5 backdrop-blur-3xl">
          <div className="flex items-center space-x-6">
            <button className="p-5 text-white/20 hover:text-ffn-primary hover:bg-white/5 rounded-2xl transition-all" title="Attach Proposal">
              <FileText className="w-6 h-6" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Compose secure transmission..."
                className="w-full bg-white/5 border border-white/10 rounded-[2.5rem] py-6 px-10 text-white placeholder:text-white/20 focus:ring-2 focus:ring-ffn-primary outline-none transition-all pr-24"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center space-x-4 text-white/20">
                <button className="hover:text-white transition-colors"><Smile className="w-6 h-6" /></button>
                <button className="hover:text-white transition-colors"><Mic className="w-6 h-6" /></button>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="p-6 bg-ffn-primary text-white rounded-[2rem] shadow-3xl hover:scale-105 transition-all disabled:opacity-50"
              disabled={!inputValue.trim()}
            >
              <Send className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Identity Profile Panel */}
      <div className="hidden lg:block w-[400px] border-l border-white/5 p-12 space-y-12 bg-white/5 backdrop-blur-3xl">
        <div className="text-center space-y-8">
          <div className="w-48 h-48 rounded-[3.5rem] mx-auto overflow-hidden border-4 border-white/10 shadow-3xl">
            <img src={threads[activeThreadIndex]?.avatar || 'https://picsum.photos/id/65/100/100'} className="w-full h-full object-cover" alt="" />
          </div>
          <div className="space-y-3">
            <h3 className="font-serif italic text-4xl text-white leading-none tracking-tight">{threads[activeThreadIndex]?.name || 'Anonymous Node'}</h3>
            <p className="text-[10px] uppercase tracking-[0.6em] font-black text-ffn-primary">{threads[activeThreadIndex]?.role || 'Professional Master'}</p>
          </div>
        </div>

        <div className="space-y-6">
          <button className="w-full bg-white/5 border border-white/10 py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] text-white hover:bg-white/10 transition-all shadow-xl">View Mastery Hub</button>
          <button className="w-full bg-ffn-primary text-white py-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-3xl hover:scale-105 transition-all">Send Job Proposal</button>

          <div className="space-y-6 pt-10 border-t border-white/5">
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Shared Identity Layers</span>
            <div className="flex -space-x-4 overflow-hidden">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-2 border-ffn-black bg-white/5 overflow-hidden shadow-2xl">
                  <img src={`https://picsum.photos/id/${220 + i}/100/100`} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
