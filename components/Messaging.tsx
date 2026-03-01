import React, { useState, useEffect, useRef } from 'react';
import { Search, Send, Image, Smile, Phone, Video, Info, MoreVertical, Paperclip, Mic, Loader2, CheckCircle, Check, Briefcase, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { messageService } from '../services/messageService';
import { supabase } from '../supabase';

export const Messaging: React.FC = () => {
  const [activeThreadIndex, setActiveThreadIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThreads();
  }, []);

  useEffect(() => {
    if (threads.length > 0 && threads[activeThreadIndex]) {
      const activeThreadId = threads[activeThreadIndex].id;
      fetchMessages(activeThreadId);

      // Establish Supabase Realtime WebSockets for this specific chat
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

      // Mock typing indicator for the first thread to feel "alive"
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
    // Scroll to bottom when messages change
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
        // Hydrate with mock statuses for demo
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
      setInputValue(''); // Optimistic clear

      // Add optimistic message
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
        setInputValue(currentInput); // Restore on failure
        setMessages(prev => prev.filter(m => m.id !== optMsg.id));
        alert("Failed to send message: " + data.error);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-2xl relative">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/30">
        <div className="p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-serif italic text-ffn-black tracking-tight">Direct</h2>
            <button className="p-2 bg-white rounded-xl shadow-sm" title="Search"><Search className="w-4 h-4 text-gray-400" /></button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-white border border-gray-100 rounded-2xl py-4 px-6 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-ffn-primary transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-4">
          {loading ? (
            <div className="flex items-center justify-center p-10"><Loader2 className="w-6 h-6 animate-spin text-ffn-primary" /></div>
          ) : threads.map((t, idx) => (
            <motion.div
              key={t.id}
              whileHover={{ x: 5 }}
              onClick={() => setActiveThreadIndex(idx)}
              className={`p-6 rounded-[2rem] flex items-center space-x-4 cursor-pointer transition-all mb-2 ${activeThreadIndex === idx ? 'bg-white shadow-xl border border-gray-50' : 'hover:bg-white/50 opacity-60'}`}
            >
              <div className="relative">
                <img src={t.avatar || 'https://picsum.photos/id/65/100/100'} className="w-14 h-14 rounded-2xl border-2 border-white shadow-md object-cover" alt={t.name || 'User'} />
                {t.status === 'Online' && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white"></div>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="font-bold text-sm truncate tracking-tight text-ffn-black">{t.name || 'Unknown'}</h4>
                  <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{t.time || 'now'}</span>
                </div>
                <p className="text-xs text-gray-400 truncate font-light">{idx === 0 && isTyping ? <span className="text-ffn-primary animate-pulse tracking-widest">typing...</span> : (t.lastMsg || 'No messages yet')}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="px-10 py-6 border-b border-gray-50 flex items-center justify-between bg-white z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100"><img src={threads[activeThreadIndex]?.avatar || 'https://picsum.photos/id/65/100/100'} className="w-full h-full object-cover" alt="" /></div>
            <div>
              <span className="block font-bold text-sm tracking-tight text-ffn-black">{threads[activeThreadIndex]?.name || 'Select a thread'}</span>
              <span className="text-[8px] uppercase tracking-widest text-emerald-500 font-bold">{threads[activeThreadIndex]?.status || 'Offline'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Professional CTA */}
            <button className="hidden md:flex items-center space-x-2 bg-ffn-black text-white px-5 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-lg hover:bg-ffn-primary transition-colors">
              <Briefcase className="w-3 h-3" />
              <span>Hire Talent</span>
            </button>
            <div className="h-6 w-px bg-gray-100 mx-2 hidden md:block"></div>
            <button className="p-3 text-gray-400 hover:text-ffn-black hover:bg-gray-50 rounded-xl transition-all" title="Call"><Phone className="w-5 h-5" /></button>
            <button className="p-3 text-gray-400 hover:text-ffn-black hover:bg-gray-50 rounded-xl transition-all" title="Video Call"><Video className="w-5 h-5" /></button>
            <button className="p-3 text-gray-400 hover:text-ffn-black hover:bg-gray-50 rounded-xl transition-all" title="More Options"><MoreVertical className="w-5 h-5" /></button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto no-scrollbar bg-gray-50/20 relative">
          <div className="flex flex-col items-center py-10 opacity-40">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-300">Identity Encrypted Feed</span>
          </div>

          <AnimatePresence>
            {messages.map((m, index) => (
              <motion.div
                key={m.id || index}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-md p-5 md:p-6 rounded-[1.8rem] text-sm leading-relaxed shadow-sm relative group ${m.sender === 'me' ? 'bg-ffn-black text-white rounded-tr-none' : 'bg-white border border-gray-100 text-ffn-black rounded-tl-none'}`}>
                  {m.text}

                  {/* Metadata line (Time + Status) */}
                  <div className={`flex items-center space-x-2 text-[8px] mt-3 font-bold uppercase tracking-widest ${m.sender === 'me' ? 'text-white/50' : 'text-gray-400'}`}>
                    <span>{m.time}</span>
                    {m.sender === 'me' && (
                      <span className="flex items-center">
                        {m.status === 'sending' && <Loader2 className="w-3 h-3 animate-spin" />}
                        {m.status === 'delivered' && <Check className="w-3 h-3" />}
                        {m.status === 'read' && (
                          <div className="flex -space-x-1 text-ffn-accent">
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

            {/* Typing Indicator */}
            {isTyping && activeThreadIndex === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex justify-start"
              >
                <div className="bg-white border border-gray-100 rounded-[1.8rem] rounded-tl-none px-6 py-4 shadow-sm flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 md:p-8 border-t border-gray-50 bg-white">
          <div className="flex items-center space-x-2 md:space-x-4">
            <button className="p-3 md:p-4 text-gray-400 hover:text-ffn-black hover:bg-gray-50 rounded-2xl transition-all" title="Attach Proposal">
              <FileText className="w-5 h-5" />
            </button>
            <button className="p-3 md:p-4 hidden sm:block text-gray-400 hover:text-ffn-black hover:bg-gray-50 rounded-2xl transition-all" title="Attach File">
              <Paperclip className="w-5 h-5" />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Compose message..."
                className="w-full bg-gray-50 border-none rounded-[2rem] py-4 md:py-5 px-6 md:px-8 text-sm focus:ring-2 focus:ring-ffn-primary transition-all pr-20"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2 text-gray-400">
                <button className="hover:text-ffn-black transition-colors"><Smile className="w-5 h-5" /></button>
                <button className="hover:text-ffn-black transition-colors"><Mic className="w-5 h-5" /></button>
              </div>
            </div>

            <button
              onClick={handleSend}
              className="p-4 md:p-5 bg-ffn-black text-white rounded-[1.8rem] shadow-xl hover:bg-ffn-primary transition-all disabled:opacity-50"
              disabled={!inputValue.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Profile Detail Panel */}
      <div className="hidden lg:block w-72 border-l border-gray-100 p-8 space-y-10 bg-gray-50/10">
        <div className="text-center space-y-6">
          <div className="w-32 h-32 rounded-[2.5rem] mx-auto overflow-hidden border-4 border-white shadow-2xl"><img src={threads[activeThreadIndex]?.avatar || 'https://picsum.photos/id/65/100/100'} className="w-full h-full object-cover" alt="" /></div>
          <div>
            <h3 className="font-serif italic text-2xl text-ffn-black leading-none">{threads[activeThreadIndex]?.name || 'N/A'}</h3>
            <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mt-2">{threads[activeThreadIndex]?.role || 'Professional'}</p>
          </div>
        </div>
        <div className="space-y-6">
          <button className="w-full bg-white border border-gray-100 py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest shadow-sm hover:border-ffn-primary transition-all">View Mastery Hub</button>
          <button className="w-full bg-ffn-black text-white py-4 rounded-2xl text-[9px] font-bold uppercase tracking-widest shadow-lg hover:bg-ffn-primary transition-all">Send Job Offer</button>

          <div className="space-y-4 pt-4 border-t border-gray-100">
            <span className="text-[8px] uppercase tracking-[0.4em] font-bold text-gray-300">Shared Identity Layers</span>
            <div className="flex -space-x-3 overflow-hidden">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden"><img src={`https://picsum.photos/id/${200 + i}/100/100`} alt="" /></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
