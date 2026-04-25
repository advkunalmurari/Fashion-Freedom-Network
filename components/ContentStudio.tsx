import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
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

export const ContentStudio: React.FC<ContentStudioProps> = ({ onClose, onPublished }) => {    // Selection State
    const [format, setFormat] = useState<ContentFormat>('POST');
    const [step, setStep] = useState(1);
    const [isPublishing, setIsPublishing] = useState(false);

    // Mouse Tracking for Studio Lighting
    const studioRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!studioRef.current) return;
            const { left, top, width, height } = studioRef.current.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            studioRef.current.style.setProperty('--mouse-x', `${x}%`);
            studioRef.current.style.setProperty('--mouse-y', `${y}%`);
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

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

    const formats: { id: ContentFormat, label: string, icon: any, desc: string, color: string }[] = [
        { id: 'POST', label: 'Editorial Post', icon: ImageIcon, desc: 'High-fidelity static or carousel narratives.', color: 'from-blue-500 to-cyan-400' },
        { id: 'STORY', label: 'Identity Story', icon: Plus, desc: '24-hour transient professional pulses.', color: 'from-ffn-primary to-rose-400' },
        { id: 'REEL', label: 'Motion Reel', icon: PlayCircle, desc: 'Immersive vertical video portfolios.', color: 'from-ffn-accent to-amber-400' },
        { id: 'DROP', label: 'Market Drop', icon: Briefcase, desc: 'Direct-to-network service or asset release.', color: 'from-emerald-500 to-teal-400' },
    ];

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-[#050505]/95 backdrop-blur-[40px]">
            <m.div
                ref={studioRef}
                initial={{ scale: 0.95, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="bg-[#111111] w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-[3rem] overflow-hidden relative shadow-[0_0_100px_rgba(0,0,0,1)] border border-white/5 flex flex-col md:flex-row premium-card-depth"
            >
                {/* Studio Lighting Layer */}
                <div className="studio-lighting opacity-60" />

                {/* Header/Close */}
                <button
                    title="Exit Studio"
                    onClick={onClose}
                    className="absolute top-8 right-8 z-[60] p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-white/40 hover:text-white transition-all backdrop-blur-xl border border-white/10 group active:scale-95"
                >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
                </button>

                {/* Left: Media & Stage */}
                <div className="md:w-1/2 bg-[#0A0A0A] relative flex items-center justify-center p-8 border-r border-white/5 overflow-hidden premium-card-content">
                    {/* Background Ambient Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-ffn-primary/5 blur-[120px] rounded-full" />

                    <AnimatePresence mode="wait">
                        {mediaPreviews.length > 0 ? (
                            <m.div
                                key="preview"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="relative z-10 w-full h-full max-h-[700px] flex flex-col items-center justify-center"
                            >
                                <div className={`relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.8)] border border-white/10 transition-all duration-700 ${format === 'STORY' || format === 'REEL' ? 'aspect-[9/16] scale-95' : 'aspect-square'}`}>
                                    {mediaPreviews[currentMediaIndex].type === 'VIDEO' ? (
                                        <video src={mediaPreviews[currentMediaIndex].url} className="w-full h-full object-cover" autoPlay loop muted playsInline />
                                    ) : (
                                        <img src={mediaPreviews[currentMediaIndex].url} className="w-full h-full object-cover" alt="Identity Preview" />
                                    )}

                                    {/* Format Badge Overlay */}
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-xl rounded-full border border-white/10 flex items-center space-x-2">
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

                                    {/* Glass Overlay for depth */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                </div>

                                {mediaPreviews.length > 1 && (
                                    <div className="mt-8 flex space-x-3">
                                        {mediaPreviews.map((_, idx) => (
                                            <button
                                                key={idx}
                                                title={`Switch to slide ${idx + 1}`}
                                                onClick={() => setCurrentMediaIndex(idx)}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentMediaIndex ? 'bg-ffn-primary w-12' : 'bg-white/10 w-3 hover:bg-white/30'}`}
                                            />
                                        ))}
                                    </div>
                                )}

                                <m.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => { setMediaPreviews([]); setStep(1); }}
                                    className="mt-10 px-8 py-3 bg-white/5 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-ffn-accent hover:border-ffn-accent/20 transition-all"
                                >
                                    Reset Sequence
                                </m.button>
                            </m.div>
                        ) : (
                            <m.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center space-y-12 relative z-10"
                            >
                                <div className="relative inline-block">
                                    <m.div 
                                        animate={{ 
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 90, 180, 270, 360]
                                        }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="w-40 h-40 bg-gradient-to-tr from-ffn-primary/30 to-ffn-accent/30 rounded-[3.5rem] blur-3xl absolute inset-0 -translate-x-4 -translate-y-4" 
                                    />
                                    <m.div
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => fileInputRef.current?.click()}
                                        className="relative w-36 h-36 bg-white/5 border border-white/10 rounded-[3.5rem] flex items-center justify-center text-ffn-primary cursor-pointer shadow-2xl backdrop-blur-md hover:border-ffn-primary/50 transition-all group"
                                    >
                                        <Plus className="w-12 h-12 group-hover:rotate-180 transition-transform duration-700 ease-out" />
                                    </m.div>
                                </div>
                                <div className="space-y-4 px-10">
                                    <h3 className="text-5xl editorial-masthead italic text-white leading-none">Content Studio</h3>
                                    <p className="text-[10px] uppercase tracking-[0.8em] text-white/30 font-black">Identity Input Stage</p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-4 max-w-sm mx-auto">
                                    {['4:5 Editorial', '9:16 Motion', 'Global Asset'].map((spec) => (
                                        <div key={spec} className="px-6 py-3 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-white/20 uppercase tracking-widest">
                                            {spec}
                                        </div>
                                    ))}
                                </div>
                            </m.div>
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
                <div className="md:w-1/2 p-8 md:p-16 flex flex-col h-full overflow-y-auto no-scrollbar bg-[#111111]/80 backdrop-blur-md relative z-10">
                    <div className="mb-12 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-ffn-primary shadow-[0_0_10px_#ff3366] animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Creation Protocol Active</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 ? (
                            <m.div 
                                key="format" 
                                initial={{ opacity: 0, x: 40 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -40 }} 
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="space-y-12"
                            >
                                <div className="space-y-6">
                                    <h2 className="text-4xl editorial-masthead text-white">Select Format</h2>
                                    <p className="text-sm text-white/30 font-light leading-relaxed max-w-md">Distribute your identity update across the network. High-fidelity encoding is applied to all entries.</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {formats.map((f) => (
                                        <button
                                            key={f.id}
                                            onClick={() => setFormat(f.id)}
                                            className={`group p-6 rounded-[2.5rem] border transition-all duration-500 text-left flex items-center space-x-6 relative overflow-hidden ${format === f.id ? 'bg-ffn-primary/10 border-ffn-primary/50 shadow-[0_20px_40px_rgba(0,0,0,0.3)]' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                                        >
                                            {format === f.id && (
                                                <m.div layoutId="activeFormatGlow" className="absolute inset-0 bg-gradient-to-r from-ffn-primary/20 to-transparent pointer-events-none" />
                                            )}
                                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${format === f.id ? 'bg-ffn-primary text-white scale-110 shadow-lg' : 'bg-white/5 text-white/20 group-hover:text-white/60'}`}>
                                                <f.icon className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1 relative z-10">
                                                <h4 className={`text-sm font-black uppercase tracking-[0.2em] transition-colors ${format === f.id ? 'text-white' : 'text-white/60'}`}>{f.label}</h4>
                                                <p className={`text-[10px] mt-1 font-medium transition-colors ${format === f.id ? 'text-white/50' : 'text-white/20'}`}>{f.desc}</p>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 transition-all duration-500 ${format === f.id ? 'text-ffn-primary translate-x-2' : 'text-white/10 group-hover:text-white/40'}`} />
                                        </button>
                                    ))}
                                </div>

                                <m.button
                                    whileHover={{ scale: 1.02, backgroundColor: '#ff3366' }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-7 rounded-[2.5rem] bg-white text-black text-[11px] font-black uppercase tracking-[0.4em] flex items-center justify-center space-x-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all group"
                                >
                                    <span>Initialize Asset</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform duration-500 ease-out" />
                                </m.button>
                            </m.div>
                        ) : (
                            <m.div 
                                key="meta" 
                                initial={{ opacity: 0, x: 40 }} 
                                animate={{ opacity: 1, x: 0 }} 
                                exit={{ opacity: 0, x: -40 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center space-x-4 mb-2">
                                    <m.button 
                                        whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setStep(1)} 
                                        className="p-4 bg-white/5 rounded-2xl text-white/40 hover:text-white transition-colors"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </m.button>
                                    <h2 className="text-3xl editorial-masthead text-white">Narrative Deck</h2>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] uppercase tracking-[0.5em] font-black text-white/20 ml-2">Editorial Pulse</label>
                                    <textarea
                                        title="Editorial Narrative"
                                        className="w-full bg-white/5 border border-white/5 rounded-[2.5rem] p-8 text-sm h-40 resize-none focus:ring-1 focus:ring-ffn-primary/50 focus:border-ffn-primary/50 transition-all text-white placeholder:text-white/10 no-scrollbar shadow-inner"
                                        placeholder="Articulate your narrative..."
                                        value={caption}
                                        onChange={e => setCaption(e.target.value)}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/20 ml-2">Node Entry</label>
                                        <div className="relative group">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-ffn-primary transition-colors" />
                                            <input
                                                title="Location"
                                                type="text"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs text-white focus:bg-white/10 transition-all outline-none"
                                                placeholder="Global..."
                                                value={location}
                                                onChange={e => setLocation(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] uppercase tracking-[0.5em] font-black text-white/20 ml-2">Format Type</label>
                                        <div className="relative group">
                                            <Target className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10 group-focus-within:text-ffn-primary transition-colors" />
                                            <select
                                                title="Shoot Type"
                                                className="w-full bg-white/5 border border-white/5 rounded-2xl py-5 pl-14 pr-6 text-xs text-white appearance-none focus:bg-white/10 transition-all outline-none"
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

                                <div className="space-y-8 p-10 bg-white/5 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Sparkles className="w-8 h-8 text-ffn-primary" />
                                    </div>
                                    
                                    <div className="flex items-center space-x-4 mb-4">
                                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-white">Professional Credits</span>
                                    </div>

                                    <div className="space-y-5">
                                        <div className="relative">
                                            <Tag className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                                            <input
                                                title="Brand Integrity"
                                                className="w-full bg-transparent border-b border-white/5 focus:border-ffn-primary rounded-none py-4 px-8 text-xs text-white transition-all outline-none"
                                                placeholder="Brand Identity (@labels)"
                                                value={brandTag}
                                                onChange={e => setBrandTag(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Camera className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-white/10" />
                                            <input
                                                title="Agency/Creator Credit"
                                                className="w-full bg-transparent border-b border-white/5 focus:border-ffn-primary rounded-none py-4 px-8 text-xs text-white transition-all outline-none"
                                                placeholder="Lens Master (@creatives)"
                                                value={photographerTag}
                                                onChange={e => setPhotographerTag(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    <m.div
                                        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                                        onClick={() => setIsOpenForHire(!isOpenForHire)}
                                        className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all cursor-pointer mt-4 ${isOpenForHire ? 'bg-ffn-primary/10 border-ffn-primary/30' : 'bg-black/20 border-white/5 hover:border-white/20'}`}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className={`p-2 rounded-lg ${isOpenForHire ? 'bg-ffn-primary text-white' : 'bg-white/5 text-white/20'}`}>
                                                <Briefcase className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-white/80">Open to Identity Inquiries</span>
                                        </div>
                                        <div className={`w-12 h-6 rounded-full p-1.5 transition-all duration-500 ${isOpenForHire ? 'bg-ffn-primary shadow-[0_0_15px_#ff3366]' : 'bg-white/10'}`}>
                                            <m.div
                                                className="w-3 h-3 bg-white rounded-full shadow-lg"
                                                animate={{ x: isOpenForHire ? 24 : 0 }}
                                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                            />
                                        </div>
                                    </m.div>
                                </div>

                                <div className="pt-10">
                                    <m.button
                                        disabled={isPublishing}
                                        whileHover={!isPublishing ? { scale: 1.02, y: -5 } : {}}
                                        whileTap={!isPublishing ? { scale: 0.98 } : {}}
                                        onClick={handlePublish}
                                        className="w-full bg-gradient-to-r from-ffn-primary to-ffn-accent text-white py-7 rounded-[3rem] text-[11px] font-black uppercase tracking-[0.6em] flex items-center justify-center space-x-6 shadow-[0_30px_60px_rgba(255,51,102,0.3)] transition-all disabled:opacity-50 relative overflow-hidden group"
                                    >
                                        {isPublishing ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                                <span>Synchronizing Node...</span>
                                            </>
                                        ) : (
                                            <>
                                                <m.div 
                                                    className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 skew-x-12" 
                                                />
                                                <Globe className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                                                <span className="relative z-10">Broadcast Protocol</span>
                                            </>
                                        )}
                                    </m.button>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </m.div>
        </div>
    );
};
