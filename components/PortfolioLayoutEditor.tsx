import React, { useState } from 'react';
import { m, Reorder } from 'framer-motion';
import {
    Type,
    Layout,
    Grid,
    Layers,
    Maximize,
    Plus,
    Trash2,
    Save,
    Eye,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    X
} from 'lucide-react';
import { PortfolioTemplate, PortfolioItem, PortfolioLayout } from '../types';
import { MagneticButton } from './MagneticButton';

interface PortfolioLayoutEditorProps {
    onSave: (layout: Partial<PortfolioLayout>) => void;
    onClose: () => void;
    existingItems?: PortfolioItem[];
}

export const PortfolioLayoutEditor: React.FC<PortfolioLayoutEditorProps> = ({
    onSave,
    onClose,
    existingItems = []
}) => {
    const [template, setTemplate] = useState<PortfolioTemplate>('MASONRY');
    const [items, setItems] = useState<PortfolioItem[]>(existingItems.length > 0 ? existingItems : [
        { id: '1', mediaUrl: 'https://images.unsplash.com/photo-1539109132382-381bb3f1cff6?auto=format&fit=crop&q=80&w=800', type: 'image', size: 'large', order: 0 },
        { id: '2', mediaUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', type: 'image', size: 'medium', order: 1 },
        { id: '3', mediaUrl: 'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&q=80&w=800', type: 'image', size: 'medium', order: 2 },
        { id: '4', mediaUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800', type: 'image', size: 'tall', order: 3 },
    ]);

    const [activeTab, setActiveTab] = useState<'LAYOUT' | 'CONTENT' | 'AI'>('LAYOUT');

    const templates: { id: PortfolioTemplate; label: string; icon: any; description: string }[] = [
        { id: 'MASONRY', label: 'Masonry Flow', icon: Layout, description: 'Organic, varying sizes for dynamic impact.' },
        { id: 'GRID', label: 'Precision Grid', icon: Grid, description: 'Uniform, clean, and highly professional.' },
        { id: 'NARRATIVE_STACK', label: 'Narrative Stack', icon: Layers, description: 'Story-driven, large vertical scrolling.' },
        { id: 'FULL_BLEED', label: 'Full Bleed', icon: Maximize, description: 'Maximum visual immersion, edge-to-edge.' },
    ];

    const updateItemSize = (id: string, size: PortfolioItem['size']) => {
        setItems(items.map(item => item.id === id ? { ...item, size } : item));
    };

    const removeItem = (id: string) => {
        setItems(items.filter(item => item.id !== id));
    };

    const handleSave = () => {
        onSave({
            template,
            items: items.map((item, idx) => ({ ...item, order: idx })),
        });
        onClose();
    };

    return (
        <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ffn-black/95 backdrop-blur-xl flex flex-col md:flex-row"
        >
            {/* Sidebar Controls */}
            <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-ffn-primary/20 p-6 flex flex-col gap-8">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-serif italic text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-ffn-primary" />
                        Portfolio Designer
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-ffn-primary/10 rounded-full transition-colors text-ffn-gray"
                        title="Close Editor"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-ffn-black/50 border border-ffn-primary/10 p-1 rounded-lg">
                    {(['LAYOUT', 'CONTENT', 'AI'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-2 text-[10px] font-black tracking-widest rounded-md transition-all ${activeTab === tab ? 'bg-ffn-primary text-ffn-black' : 'text-ffn-gray hover:text-white'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    {activeTab === 'LAYOUT' && (
                        <div className="flex flex-col gap-4">
                            <p className="text-[10px] font-black text-ffn-primary tracking-widest uppercase mb-2">Structure Protocol</p>
                            {templates.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTemplate(t.id)}
                                    className={`w-full p-4 rounded-xl border flex items-center gap-4 transition-all text-left ${template === t.id
                                        ? 'bg-ffn-primary/10 border-ffn-primary text-white'
                                        : 'bg-ffn-black border-ffn-primary/10 text-ffn-gray hover:border-ffn-primary/30'
                                        }`}
                                >
                                    <div className={`p-2 rounded-lg ${template === t.id ? 'bg-ffn-primary text-ffn-black' : 'bg-ffn-primary/5'}`}>
                                        <t.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white mb-0.5">{t.label}</p>
                                        <p className="text-[10px] text-ffn-gray leading-tight">{t.description}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {activeTab === 'CONTENT' && (
                        <div className="flex flex-col gap-4">
                            <p className="text-[10px] font-black text-ffn-primary tracking-widest uppercase mb-2">Visual Units</p>
                            <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
                                {items.map(item => (
                                    <Reorder.Item
                                        key={item.id}
                                        value={item}
                                        className="bg-ffn-black border border-ffn-primary/10 p-3 rounded-xl flex items-center gap-3 group cursor-grab active:cursor-grabbing"
                                    >
                                        <div className="w-12 h-12 rounded-lg bg-center bg-cover overflow-hidden"
                                            style={{ backgroundImage: `url(${item.mediaUrl})` }}
                                            role="img"
                                            aria-label="Portfolio item thumbnail"
                                        />
                                        <div className="flex-1">
                                            <select
                                                title="Select Item Size"
                                                value={item.size}
                                                onChange={(e) => updateItemSize(item.id, e.target.value as any)}
                                                className="bg-transparent text-[10px] font-bold text-white border-0 p-0 focus:ring-0 cursor-pointer"
                                            >
                                                <option value="small">Small (1x1)</option>
                                                <option value="medium">Medium (1x2)</option>
                                                <option value="large">Large (2x2)</option>
                                                <option value="wide">Wide (2x1)</option>
                                                <option value="tall">Tall (1x3)</option>
                                            </select>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 opacity-0 group-hover:opacity-100 text-ffn-gray hover:text-red-500 transition-all"
                                            title="Remove Item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    )}

                    {activeTab === 'AI' && (
                        <div className="flex flex-col gap-6 text-center py-8">
                            <div className="w-16 h-16 bg-ffn-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                                <Sparkles className="w-8 h-8 text-ffn-primary" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold mb-2">Aesthetic Pulse</h3>
                                <p className="text-xs text-ffn-gray leading-relaxed">
                                    Our neural engine analyzes your visual language to generate specialized discovery tags.
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-ffn-black border border-ffn-primary/20 p-3 rounded-lg text-left">
                                    <p className="text-[10px] font-black text-ffn-primary tracking-widest uppercase mb-1">Current Detection</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['NEO-NOIR', 'AVANT-GARDE', 'EDITORIAL'].map(tag => (
                                            <span key={tag} className="px-2 py-1 bg-ffn-primary/5 text-[9px] font-bold text-white border border-ffn-primary/30 rounded italic">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-ffn-black border border-ffn-primary/20 p-3 rounded-lg text-left">
                                    <p className="text-[10px] font-black text-ffn-primary tracking-widest uppercase mb-1">Casting Affinity</p>
                                    <p className="text-xs text-white">94% match with High-Fashion Luxury Brands</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="pt-4 flex gap-3">
                    <MagneticButton
                        onClick={handleSave}
                        variant="primary"
                        className="flex-1 py-3 text-xs font-black tracking-widest"
                    >
                        PUBLISH DESIGN
                    </MagneticButton>
                </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 bg-ffn-black overflow-y-auto p-4 md:p-12 custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <p className="text-[10px] font-black text-ffn-primary tracking-widest uppercase mb-2">Preview Protocol</p>
                            <h1 className="text-4xl font-serif italic text-white">{template.replace('_', ' ')}</h1>
                        </div>
                    </div>

                    {/* Dynamic Layout Engine */}
                    <div
                        className={`
              ${template === 'GRID' ? 'grid grid-cols-3 gap-4' : ''}
              ${template === 'MASONRY' ? 'columns-1 sm:columns-2 md:columns-3 gap-4' : ''}
              ${template === 'NARRATIVE_STACK' ? 'flex flex-col gap-12' : ''}
              ${template === 'FULL_BLEED' ? 'flex flex-col gap-0 -mx-4 md:-mx-12' : ''}
            `}
                    >
                        {items.map((item) => (
                            <m.div
                                layout
                                key={item.id}
                                className={`
                  relative mb-4 group overflow-hidden rounded-xl bg-ffn-primary/5
                  ${template === 'GRID' ? 'aspect-square mb-0' : ''}
                  ${template === 'NARRATIVE_STACK' ? 'aspect-[4/5] rounded-3xl max-w-2xl mx-auto' : ''}
                  ${template === 'FULL_BLEED' ? 'aspect-video rounded-none mb-0' : ''}
                `}
                            >
                                <img
                                    src={item.mediaUrl}
                                    alt="Portfolio Piece"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                                    <div className="flex gap-4">
                                        <button
                                            title="Add to Moodboard"
                                            className="p-2 bg-ffn-black/80 rounded-lg text-white hover:bg-ffn-primary hover:text-ffn-black transition-all"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                        <button
                                            title="Quick View"
                                            className="p-2 bg-ffn-black/80 rounded-lg text-white hover:bg-ffn-primary hover:text-ffn-black transition-all"
                                        >
                                            <Eye className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </m.div>
                        ))}
                    </div>
                </div>
            </div>
        </m.div>
    );
};
