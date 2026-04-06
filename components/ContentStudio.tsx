import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X, Camera, MapPin, ArrowRight, Loader2, Sparkles,
    Briefcase, Tag, Target, SwitchCamera, Film,
    Image as ImageIcon, PlayCircle, Send, Plus,
    ChevronRight, ChevronLeft, Globe, Eye,
    LayoutGrid, Layers, Hexagon
} from 'lucide-react';
import { UserRole } from '../types';

interface ContentStudioProps {
    onClose: () => void;
    onPublished: (content: any) => void;
}

type ContentFormat = 'POST' | 'STORY' | 'REEL' | 'DROP';

export const ContentStudio: React.FC<ContentStudioProps> = ({ onClose, onPublished }) => {
    const [format, setFormat] = useState<ContentFormat>('POST');
    const [step, setStep] = useState(1);
    const [isPublishing, setIsPublishing] = useState(false);

    // Media State
    const [mediaPreviews, setMediaPreviews] = useState<{ url: string, type: 'IMAGE' | 'VIDEO' }[]>([]);
    const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Metadata State
    const [caption, setCaption] = useState('');
    const [location, setLocation] = useState('');
    const [shootType, setShootType] = useState('editorial');
    const [brandTag, setBrandTag] = useState('');
    const [photographerTag, setPhotographerTag] = useState('');
    const [isOpenForHire, setIsOpenForHire] = useState(false);

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

    const handlePublish = async () => {
        setIsPublishing(true);
        // Simulated delay for network sync
        await new Promise(resolve => setTimeout(resolve, 2000));

        onPublished({
            id: Date.now().toString(),
            format,
            media: mediaPreviews,
            caption,
            location,
            metadata: {
                shootType,
                brandTag,
                photographerTag,
                isOpenForHire
            },
            createdAt: new Date().toISOString()
        });

        setIsPublishing(false);
    };

    const formats: { id: ContentFormat, label: string, icon: any, desc: string }[] = [
        { id: 'POST', label: 'Editorial Post', icon: ImageIcon, desc: 'High-fidelity static or carousel narratives.' },
        { id: 'STORY', label: 'Identity Story', icon: Plus, desc: '24-hour transient professional pulses.' },
        { id: 'REEL', label: 'Motion Reel', icon: PlayCircle, desc: 'Immersive vertical video portfolios.' },
        { id: 'DROP', label: 'Market Drop', icon: Briefcase, desc: 'Direct-to-network service or asset release.' },
    ];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-[#050505]/95 backdrop-blur-[40px]">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                className="bg-[#111111] w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-[3rem] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col md:flex-row"
            >
                {/* Header/Close */}
                <button
                    title="Exit Studio"
                    onClick={onClose}
                    className="absolute top-8 right-8 z-[60] p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all backdrop-blur-xl border border-white/10"
                >
                    <X className="w-6 h-6" />
                </button>

                {/* Left: Media & Stage */}
                <div className="md:w-1/2 bg-[#0A0A0A] relative flex items-center justify-center p-8 border-r border-white/5 overflow-hidden">
                    {/* Background Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-ffn-primary/5 blur-[120px] rounded-full" />

                    <AnimatePresence mode="wait">
                        {mediaPreviews.length > 0 ? (
                            <motion.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative z-10 w-full h-full max-h-[700px] flex flex-col items-center justify-center"
                            >
                                <div className={`relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 ${format === 'STORY' || format === 'REEL' ? 'aspect-[9/16]' : 'aspect-square'}`}>
                                    {mediaPreviews[currentMediaIndex].type === 'VIDEO' ? (
                                        <video src={mediaPreviews[currentMediaIndex].url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={mediaPreviews[currentMediaIndex].url} className="w-full h-full object-cover" alt="Identity Preview" />
                                    )}

                                    {/* Format Badge Overlay */}
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center space-x-2">
                                        {(() => {
                                            const F = formats.find(f => f.id === format);
                                            const Icon = F?.icon;
                                            return (
                                                <>
                                                    <Icon className="w-3 h-3 text-ffn-primary" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{F?.label}</span>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>

                                {mediaPreviews.length > 1 && (
                                    <div className="mt-6 flex space-x-2">
                                        {mediaPreviews.map((_, idx) => (
                                            <button
                                                key={idx}
                                                title={`Switch to slide ${idx + 1}`}
                                                onClick={() => setCurrentMediaIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentMediaIndex ? 'bg-ffn-primary w-6' : 'bg-white/20'}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                <button
                                    onClick={() => { setMediaPreviews([]); setStep(1); }}
                                    className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-ffn-accent transition-colors"
                                >
                                    Reset Sequence
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-10 relative z-10"
                            >
                                <div className="relative inline-block">
                                    <div className="w-32 h-32 bg-gradient-to-tr from-ffn-primary/20 to-ffn-accent/20 rounded-[3rem] animate-pulse blur-xl absolute inset-0" />
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-32 h-32 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center text-ffn-primary cursor-pointer hover:scale-110 hover:border-ffn-primary/50 transition-all group"
                                    >
                                        <Plus className="w-10 h-10 group-hover:rotate-90 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-serif italic text-white">Content Studio</h3>
                                    <p className="text-[10px] uppercase tracking-[0.5em] text-white/40 font-black">Identity Asset Input Stage</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                                    {['Editorial (4:5)', 'Motion (9:16)', 'Portfolio (1:1)', 'Asset Cloud'].map((spec) => (
                                        <div key={spec} className="px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-[9px] font-bold text-white/30 uppercase tracking-widest">
                                            {spec}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <input
                        title="Upload Content Sequence"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleFileSelect}
                    />
                </div>

                {/* Right: Meta & Controls */}
                <div className="md:w-1/2 p-8 md:p-16 flex flex-col h-full overflow-y-auto no-scrollbar bg-[#111111]">
                    <div className="mb-12 flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 rounded-full bg-ffn-primary animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/60">Node Pulse</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <motion.div key="format" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                                <div className="space-y-6">
                                    <h2 className="text-4xl font-serif italic text-white">Select Protocol</h2>
                                    <p className="text-sm text-white/40 font-light leading-relaxed max-w-md">Choose the distribution format for your next identity update. FFN handles cinematic encoding and professional indexing for each node.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {formats.map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id)}
                                            className={`group p-6 rounded-[2.5rem] border transition-all text-left flex items-center space-x-6 ${format === f.id ? 'bg-ffn-primary border-ffn-primary shadow-[0_0_40px_rgba(var(--ffn-primary-rgb),0.3)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                        >
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${format === f.id ? 'bg-white text-ffn-primary' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                                                <f.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-bold uppercase tracking-widest ${format === f.id ? 'text-white' : 'text-white/90'}`}>{f.label}</h4>
                                                <p className={`text-[10px] mt-1 font-medium ${format === f.id ? 'text-white/70' : 'text-white/30'}`}>{f.desc}</p>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 transition-transform ${format === f.id ? 'text-white translate-x-1' : 'text-white/10 group-hover:text-white/40'}`} />
                                        </button>
                                    ))}
                                </div>

                                <button
                                    title="Begin Asset Sequence"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-6 rounded-[2rem] bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center space-x-3 shadow-2xl hover:bg-ffn-primary transition-all group"
                                >
                                    <span>Begin Asset Sequence</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="meta" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                <div className="flex items-center space-x-4 mb-2">
                                    <button onClick={() => setStep(1)} className="p-3 bg-white/5 rounded-xl text-white/40 hover:text-white transition-colors">
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <h2 className="text-2xl font-serif italic text-white italic">Publish Details</h2>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40">Editorial Narrative</label>
                                    <textarea
                                        title="Editorial Narrative"
                                        className="w-full bg-white/5 border-white/5 rounded-[2rem] p-6 text-sm h-32 resize-none focus:ring-1 focus:ring-ffn-primary transition-all text-white placeholder:text-white/20"
                                        placeholder="Describe your professional pulse..."
                                        value={caption}
                                        onChange={e => setCaption(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40">Location Node</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                title="Location"
                                                type="text"
                                                className="w-full bg-white/5 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs text-white"
                                                placeholder="Global Entry..."
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-[0.4em] font-black text-white/40">Shoot Type</label>
                                        <div className="relative">
                                            <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <select
                                                title="Shoot Type"
                                                className="w-full bg-white/5 border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs text-white appearance-none"
                                                value={shootType}
                                                onChange={e => setShootType(e.target.value)}
                                            >
                                                <option value="editorial">Editorial</option>
                                                <option value="campaign">Campaign</option>
                                                <option value="runway">Runway</option>
                                                <option value="digital">Digital Only</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6 p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <Sparkles className="w-4 h-4 text-ffn-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80">Professional Credits</span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative">
                                            <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                title="Brand Integrity"
                                                className="w-full bg-black/20 border-white/5 rounded-xl py-4 pl-12 text-xs text-white"
                                                placeholder="Brand Identity (@gucci)"
                                                value={brandTag}
                                                onChange={e => setBrandTag(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Camera className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                                            <input
                                                title="Agency/Creator Credit"
                                                className="w-full bg-black/20 border-white/5 rounded-xl py-4 pl-12 text-xs text-white"
                                                placeholder="Lens Master (@vogue)"
                                                value={photographerTag}
                                                onChange={e => setPhotographerTag(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setIsOpenForHire(!isOpenForHire)}
                                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${isOpenForHire ? 'bg-ffn-primary/10 border-ffn-primary' : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <Briefcase className={`w-4 h-4 ${isOpenForHire ? 'text-ffn-primary' : 'text-white/20'}`} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Market Available</span>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full p-1 transition-colors ${isOpenForHire ? 'bg-ffn-primary' : 'bg-white/10'}`}>
                                            <motion.div
                                                className="w-3 h-3 bg-white rounded-full"
                                                animate={{ x: isOpenForHire ? 20 : 0 }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <button
                                        disabled={isPublishing}
                                        onClick={handlePublish}
                                        className="w-full bg-ffn-primary text-white py-6 rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.5em] flex items-center justify-center space-x-4 shadow-[0_20px_40px_rgba(var(--ffn-primary-rgb),0.3)] hover:scale-[1.02] transition-all disabled:opacity-50"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Syncing Identity...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Globe className="w-4 h-4" />
                                                <span>Publish protocol</span>
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
