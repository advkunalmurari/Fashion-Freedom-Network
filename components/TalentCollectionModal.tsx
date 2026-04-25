import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, FolderPlus, Check, Search, Plus, Trash2 } from 'lucide-react';
import { User, TalentCollection } from '../types';
import { MOCK_TALENT_POOL } from '../constants';

interface TalentCollectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (collection: Partial<TalentCollection>) => void;
    existingCollections: TalentCollection[];
    targetTalent?: User;
}

export const TalentCollectionModal: React.FC<TalentCollectionModalProps> = ({
    isOpen,
    onClose,
    onSave,
    existingCollections,
    targetTalent
}) => {
    const [mode, setMode] = useState<'select' | 'create'>(targetTalent ? 'select' : 'create');
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCollections = existingCollections.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreate = () => {
        if (!newTitle.trim()) return;
        onSave({
            title: newTitle,
            description: newDescription,
            talentIds: targetTalent ? [targetTalent.id] : [],
            isPublic: false
        });
        setNewTitle('');
        setNewDescription('');
        onClose();
    };

    const handleAddToCollection = (colId: string) => {
        if (!targetTalent) return;
        // In a real app, logic to append talentId to the collection
        onSave({ id: colId, talentIds: [targetTalent.id] });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[600]"
                    />
                    <m.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-[#121212] rounded-3xl shadow-2xl z-[601] overflow-hidden border border-gray-100 dark:border-white/5"
                    >
                        <div className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-serif font-bold tracking-tight dark:text-white">
                                        {targetTalent ? 'Save to Collection' : 'Create Collection'}
                                    </h3>
                                    {targetTalent && (
                                        <p className="text-[10px] uppercase font-black tracking-widest text-ffn-primary mt-1">
                                            Curating: {targetTalent.displayName}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    title="Close Modal"
                                    aria-label="Close"
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {mode === 'select' ? (
                                <div className="space-y-6">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search collections..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-1 focus:ring-ffn-primary dark:text-white"
                                        />
                                    </div>

                                    <div className="max-h-[300px] overflow-y-auto no-scrollbar space-y-2">
                                        {filteredCollections.map(col => (
                                            <button
                                                key={col.id}
                                                onClick={() => handleAddToCollection(col.id)}
                                                className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-ffn-primary/5 dark:hover:bg-ffn-primary/10 border border-transparent hover:border-ffn-primary/20 transition-all group"
                                            >
                                                <div className="flex items-center space-x-4 text-left">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5">
                                                        {col.coverImage ? (
                                                            <img src={col.coverImage} alt="" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <FolderPlus className="w-5 h-5 text-gray-300" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold dark:text-white">{col.title}</p>
                                                        <p className="text-[10px] text-gray-400 uppercase tracking-wider">{col.talentIds.length} Talent</p>
                                                    </div>
                                                </div>
                                                <Plus className="w-4 h-4 text-gray-300 group-hover:text-ffn-primary transition-colors" />
                                            </button>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => setMode('create')}
                                        className="w-full py-4 border-2 border-dashed border-gray-100 dark:border-white/5 rounded-2xl flex items-center justify-center space-x-2 text-gray-400 hover:border-ffn-primary/30 hover:text-ffn-primary transition-all font-bold text-xs uppercase tracking-widest"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span>Create New Collection</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Collection Title</label>
                                            <input
                                                type="text"
                                                value={newTitle}
                                                onChange={(e) => setNewTitle(e.target.value)}
                                                placeholder="e.g. SS26 Castings"
                                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-ffn-primary dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Description (Optional)</label>
                                            <textarea
                                                value={newDescription}
                                                onChange={(e) => setNewDescription(e.target.value)}
                                                placeholder="What is this collection for?"
                                                rows={3}
                                                className="w-full bg-gray-50 dark:bg-white/5 border-none rounded-2xl py-4 px-6 text-sm focus:ring-1 focus:ring-ffn-primary dark:text-white resize-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 pt-4">
                                        {targetTalent && (
                                            <button
                                                onClick={() => setMode('select')}
                                                className="flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-ffn-black dark:hover:text-white transition-colors"
                                            >
                                                Back
                                            </button>
                                        )}
                                        <button
                                            onClick={handleCreate}
                                            disabled={!newTitle.trim()}
                                            className="flex-[2] bg-ffn-black dark:bg-white dark:text-ffn-black text-white py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all font-black uppercase tracking-[0.2em] text-[10px] disabled:opacity-50"
                                        >
                                            Initialize Collection
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </m.div>
                </>
            )}
        </AnimatePresence>
    );
};
