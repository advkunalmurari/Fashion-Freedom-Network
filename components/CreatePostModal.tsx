import React, { useState, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Camera, MapPin, ArrowRight, Loader2, Sparkles, Briefcase, Tag, Target, SwitchCamera, Film } from 'lucide-react';
import { UserRole } from '../types';

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: (post: any) => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onPostCreated }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [mediaPreviews, setMediaPreviews] = useState<{ url: string, type: 'IMAGE' | 'VIDEO' }[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Professional Additions
  const [isOpenForHire, setIsOpenForHire] = useState(false);
  const [shootType, setShootType] = useState('editorial');
  const [brandTag, setBrandTag] = useState('');
  const [photographerTag, setPhotographerTag] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length > 0) {
      const previews = files.map(file => ({
        url: URL.createObjectURL(file),
        type: file.type.startsWith('video/') ? 'VIDEO' as const : 'IMAGE' as const
      }));
      setMediaPreviews(previews);
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setIsUploading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onPostCreated({
      id: Date.now().toString(),
      type: mediaPreviews[0]?.type || 'IMAGE',
      mediaUrls: mediaPreviews.map(m => m.url),
      caption,
      location,
      tags: selectedTags,
      likes: 0,
      comments: 0,
      createdAt: 'Just now',
      // Pro features
      isOpenForHire,
      shootType,
      brandTag,
      photographerTag
    });
    setIsUploading(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="fixed inset-0 z-[800] flex items-center justify-center p-4 md:p-6 bg-ffn-black/80 backdrop-blur-xl">
      <m.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white w-full max-w-5xl h-[90vh] md:h-[80vh] rounded-[3rem] md:rounded-[4rem] overflow-hidden relative shadow-2xl flex flex-col md:flex-row border border-white/20"
      >
        <button title="Close modal" onClick={onClose} className="absolute top-6 right-6 z-50 p-3 bg-white/50 backdrop-blur rounded-2xl md:bg-gray-50 hover:bg-ffn-accent hover:text-white transition-all">
          <X className="w-5 h-5" />
        </button>

        {/* Media Preview Column */}
        <div className="md:w-1/2 bg-gray-50 relative flex items-center justify-center h-1/3 md:h-full border-r border-gray-100 flex-shrink-0">
          {mediaPreviews.length > 0 ? (
            <div className="w-full h-full relative group">
              {mediaPreviews[currentMediaIndex].type === 'VIDEO' ? (
                <video src={mediaPreviews[currentMediaIndex].url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
              ) : (
                <img src={mediaPreviews[currentMediaIndex].url} className="w-full h-full object-cover" alt="Preview" />
              )}

              {mediaPreviews.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {mediaPreviews.map((_, idx) => (
                    <div key={idx} className={`w-2.5 h-2.5 rounded-full ${idx === currentMediaIndex ? 'bg-ffn-primary' : 'bg-white/50 border border-white/20'}`} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 p-12">
              <div
                className="w-24 h-24 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mx-auto text-ffn-primary cursor-pointer hover:scale-110 transition-transform"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="relative">
                  <Camera className="w-10 h-10" />
                  <Film className="w-4 h-4 absolute -bottom-1 -right-1" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-serif italic text-ffn-black">Publish Mastery</h3>
                <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-black">Photos & Videos (Carousel supported)</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-10 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-xl"
              >
                Select Media
              </button>
            </div>
          )}
          <input
            title="Upload Media files"
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*,video/*"
            multiple
            onChange={handleFileSelect}
          />
        </div>

        {/* Details Column */}
        <div className="md:w-1/2 p-6 md:p-12 flex flex-col h-full overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <m.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8 md:space-y-12 my-auto">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-ffn-primary">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Identity Protocol</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif italic text-ffn-black tracking-tight">Content Studio</h2>
                </div>
                <p className="text-xs md:text-sm text-gray-400 font-light leading-relaxed">Select media to begin the publishing sequence. FFN automatically optimizes assets for editorial standards, enabling multi-image carousels and 4K video.</p>
              </m.div>
            ) : (
              <m.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8 pb-10">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-[0.4em] font-black text-gray-400">Editorial Narrative</label>
                  <textarea
                    title="Editorial Narrative"
                    aria-label="Editorial Narrative"
                    className="w-full bg-gray-50 border-none rounded-3xl p-5 text-sm h-28 resize-none focus:ring-1 focus:ring-ffn-primary transition-all shadow-inner"
                    placeholder="The synergy of light and structure..."
                    value={caption}
                    onChange={e => setCaption(e.target.value)}
                  />
                </div>

                {/* Professional Tagging Block */}
                <div className="p-5 bg-gray-50 rounded-[2rem] space-y-5 border border-gray-100">
                  <div className="flex items-center space-x-2 text-ffn-black border-b border-gray-200 pb-2 mb-2">
                    <Target className="w-4 h-4" />
                    <span className="text-[10px] uppercase tracking-[0.3em] font-black">Professional Credits</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Shoot Type</label>
                      <select
                        title="Shoot Type"
                        aria-label="Shoot Type"
                        className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs shadow-sm focus:ring-1 focus:ring-ffn-primary"
                        value={shootType}
                        onChange={e => setShootType(e.target.value)}
                      >
                        <option value="editorial">Editorial</option>
                        <option value="commercial">Commercial</option>
                        <option value="runway">Runway</option>
                        <option value="streetwear">Streetwear</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Location</label>
                      <input
                        title="Location"
                        aria-label="Location"
                        type="text"
                        className="w-full bg-white border-none rounded-xl py-3 px-4 text-xs shadow-sm focus:ring-1 focus:ring-ffn-primary"
                        placeholder="e.g. Milan, IT"
                        value={location}
                        onChange={e => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        title="Brand Tag"
                        aria-label="Brand Tag"
                        type="text"
                        className="w-full bg-white border-none rounded-xl py-3 pl-10 pr-4 text-xs shadow-sm focus:ring-1 focus:ring-ffn-primary"
                        placeholder="Brand Tag (e.g. @Gucci)"
                        value={brandTag}
                        onChange={e => setBrandTag(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <SwitchCamera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                      <input
                        title="Photographer Tag"
                        aria-label="Photographer Tag"
                        type="text"
                        className="w-full bg-white border-none rounded-xl py-3 pl-10 pr-4 text-xs shadow-sm focus:ring-1 focus:ring-ffn-primary"
                        placeholder="Photographer (e.g. @marcoroberti)"
                        value={photographerTag}
                        onChange={e => setPhotographerTag(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* FFN Differentiator: Open for Hire Toggle */}
                <div
                  className={`p-5 rounded-[2rem] border-2 cursor-pointer transition-all flex items-center justify-between ${isOpenForHire ? 'bg-ffn-accent/10 border-ffn-accent' : 'bg-gray-50 border-gray-100 hover:border-gray-300'}`}
                  onClick={() => setIsOpenForHire(!isOpenForHire)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isOpenForHire ? 'bg-ffn-accent text-white shadow-lg shadow-ffn-accent/50' : 'bg-gray-200 text-gray-400'}`}>
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isOpenForHire ? 'text-ffn-accent' : 'text-ffn-black'}`}>Open For Hire</h4>
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">Accept booking requests from this post</p>
                    </div>
                  </div>
                  <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isOpenForHire ? 'bg-ffn-accent' : 'bg-gray-300'}`}>
                    <m.div
                      className="w-4 h-4 bg-white rounded-full shadow-md"
                      animate={{ x: isOpenForHire ? 24 : 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    disabled={isUploading}
                    onClick={handleSubmit}
                    className="w-full bg-ffn-black text-white py-5 md:py-6 rounded-[2rem] text-[10px] font-bold uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-2xl hover:bg-ffn-primary transition-all disabled:opacity-50"
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
              </m.div>
            )}
          </AnimatePresence>
        </div>
      </m.div>
    </div>
  );
};
