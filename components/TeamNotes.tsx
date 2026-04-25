import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    MessageSquare, Send, Tag, Clock, User as UserIcon,
    MoreHorizontal, Trash2, Edit3, Lock, Shield
} from 'lucide-react';
import { TeamComment } from '../types';

interface TeamNotesProps {
    comments: TeamComment[];
    onAddComment: (content: string, tags?: string[]) => void;
    targetName: string;
}

export const TeamNotes: React.FC<TeamNotesProps> = ({ comments, onAddComment, targetName }) => {
    const [newComment, setNewComment] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const availableTags = ['High-Fashion', 'Commercial', 'Editorial', 'Top-Priority', 'Callback-Needed', 'Milan', 'Paris'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment(newComment, selectedTags);
            setNewComment('');
            setSelectedTags([]);
        }
    };

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    return (
        <div className="bg-white border border-gray-100 rounded-[2.5rem] shadow-xl overflow-hidden flex flex-col h-full max-h-[700px]">
            {/* Header */}
            <div className="p-8 bg-ffn-black text-white flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-ffn-primary rounded-xl flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-serif italic text-white">Internal Discovery Notes</h3>
                        <p className="text-[8px] font-black uppercase tracking-widest text-white/40 flex items-center">
                            <Lock className="w-2.5 h-2.5 mr-1.5" />
                            Confidential to Brand Team
                        </p>
                    </div>
                </div>
                <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-ffn-black bg-gray-600 flex items-center justify-center text-[8px] font-black uppercase">
                            BT
                        </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-ffn-black bg-white/10 flex items-center justify-center text-[10px] font-bold">
                        +
                    </div>
                </div>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
                {comments.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
                        <MessageSquare className="w-12 h-12 text-gray-300" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No internal notes yet.<br />Start the conversation about {targetName}.</p>
                    </div>
                ) : (
                    comments.map((comment, i) => (
                        <div key={comment.id} className={`group ${i !== 0 ? 'border-t border-gray-50 pt-8' : ''}`}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                        {comment.authorAvatar ? (
                                            <img src={comment.authorAvatar} className="w-full h-full object-cover" alt="" />
                                        ) : (
                                            <UserIcon className="w-4 h-4 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-ffn-black">{comment.authorName}</p>
                                        <p className="text-[8px] text-gray-400 font-bold uppercase flex items-center">
                                            <Clock className="w-2.5 h-2.5 mr-1" />
                                            {new Date(comment.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <button title="More Options" className="p-2 opacity-0 group-hover:opacity-100 hover:bg-gray-50 rounded-lg transition-all">
                                    <MoreHorizontal className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>

                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                {comment.content}
                            </p>

                            {comment.tags && comment.tags.length > 0 && (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {comment.tags.map(tag => (
                                        <span key={tag} className="px-2.5 py-1 bg-gray-50 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-md">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-8 border-t border-gray-50 space-y-6 bg-gray-50/30">
                <div className="flex flex-wrap gap-2">
                    {availableTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedTags.includes(tag)
                                ? 'bg-ffn-primary text-white shadow-lg shadow-ffn-primary/20'
                                : 'bg-white text-gray-400 border border-gray-100'
                                }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                    <div className="flex-1 relative">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={`Leave an internal note about ${targetName}...`}
                            className="w-full p-5 bg-white border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-ffn-primary/20 transition-shadow resize-none min-h-[100px]"
                        />
                        <Tag className="absolute bottom-5 left-5 w-4 h-4 text-gray-300 pointer-events-none" />
                    </div>
                    <button
                        type="submit"
                        title="Send Note"
                        disabled={!newComment.trim()}
                        className="p-5 bg-ffn-black text-white rounded-2xl hover:bg-ffn-primary transition-all disabled:opacity-50 shadow-xl shadow-ffn-black/10"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
};
