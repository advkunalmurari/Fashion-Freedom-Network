
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, Image as ImageIcon, MapPin, Tag, ArrowRight, Loader2, Sparkles, CheckCircle } from 'lucide-react';
import { UserRole } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaPreview(URL.createObjectURL(file));
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onPostCreated({
      id: Date.now().toString(),
      type: 'IMAGE',
      mediaUrls: [mediaPreview],
      caption,
      location,
      tags: selectedTags,
      likes: 0,
      comments: 0,
      createdAt: 'Just now'
    });
    setIsUploading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-6 bg-ffn-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl h-[80vh] rounded-[4rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row border border-white/20"
      >
        <button onClick={onClose} className="absolute top-8 right-8 z-50 p-3 bg-gray-50 rounded-2xl hover:bg-ffn-accent hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Column */}
        <div className="md:w-3/5 bg-gray-50 relative flex items-center justify-center h-1/2 md:h-full border-r border-gray-100">
          {mediaPreview ? (
            <img src={mediaPreview} className="w-full h-full object-cover" alt="Preview" />
          ) : (
            <div className="text-center space-y-6 p-12">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto text-ffn-primary group cursor-pointer hover:scale-110 transition-transform" onClick={() => fileInputRef.current?.click()}>
                <Camera className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-ffn-black">Publish Mastery</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">Upload editorial high-fidelity content</p>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="px-10 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl">Select Files</button>
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileSelect} />
        </div>

        {/* Details Column */}
        <div className="md:w-2/5 p-10 md:p-16 flex flex-col h-full overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-12">
                 <div className="space-y-4">
                   <div className="flex items-center space-x-3 text-ffn-primary">
                     <Sparkles className="w-5 h-5" />
                     <span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Protocol</span>
                   </div>
                   <h2 className="text-4xl font-serif italic text-ffn-black tracking-tight">Content Studio</h2>
                 </div>
                 <p className="text-sm text-gray-400 font-light leading-relaxed">Select media to begin the publishing sequence. FFN automatically optimizes assets for editorial standards.</p>
              </motion.div>
            ) : (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                <div className="space-y-2">
                   <label className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400">Editorial Narrative</label>
                   <textarea 
                     className="w-full bg-gray-50 border-none rounded-3xl p-6 text-sm h-32 resize-none focus:ring-1 focus:ring-ffn-primary transition-all" 
                     placeholder="The synergy of light and structure..."
                     value={caption}
                     onChange={e => setCaption(e.target.value)}
                   />
                </div>

                <div className="space-y-4">
                   <label className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400">Context Tags</label>
                   <div className="flex flex-wrap gap-2">
                     {Object.values(UserRole).map(role => (
                       <button 
                        key={role} 
                        onClick={() => toggleTag(role)}
                        className={`px-4 py-2 rounded-xl text-[8px] font-bold uppercase tracking-widest border transition-all ${selectedTags.includes(role) ? 'bg-ffn-black text-white border-ffn-black shadow-lg' : 'bg-white text-gray-400 border-gray-100 hover:border-ffn-primary'}`}
                       >
                         {role}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-4">
                   <label className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400">Location Protocol</label>
                   <div className="relative">
                     <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                     <input 
                       type="text" 
                       className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-xs focus:ring-1 focus:ring-ffn-primary transition-all" 
                       placeholder="e.g. Milan, IT" 
                       value={location}
                       onChange={e => setLocation(e.target.value)}
                     />
                   </div>
                </div>

                <div className="pt-10">
                   <button 
                    disabled={isUploading}
                    onClick={handleSubmit}
                    className="w-full bg-ffn-black text-white py-6 rounded-3xl text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-xl hover:bg-ffn-primary transition-all disabled:opacity-50"
                   >
                     {isUploading ? (
                       <>
                         <Loader2 className="w-5 h-5 animate-spin" />
                         <span>Syncing to Network...</span>
                       </>
                     ) : (
                       <>
                         <span>Publish Narrative</span>
                         <ArrowRight className="w-5 h-5" />
                       </>
                     )}
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
