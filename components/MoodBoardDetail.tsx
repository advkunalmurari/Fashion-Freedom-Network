import React, { useState } from 'react';
import { ArrowLeft, MessageCircle, Link, Plus, MoreHorizontal, ImageIcon, Share2, Users } from 'lucide-react';
import { MOCK_MOOD_BOARDS } from '../constants';
import { User } from '../types';

interface MoodBoardDetailProps {
    boardId: string;
    currentUser: User;
    onBack: () => void;
}

export const MoodBoardDetail: React.FC<MoodBoardDetailProps> = ({ boardId, currentUser, onBack }) => {
    const [newComment, setNewComment] = useState('');

    const board = MOCK_MOOD_BOARDS.find(b => b.id === boardId);

    if (!board) {
        return (
            <div className="p-10 text-center space-y-6 animate-in fade-in">
                <h2 className="text-2xl font-serif italic text-ffn-black">Mood Board Not Found</h2>
                <button onClick={onBack} className="text-[10px] uppercase font-bold text-gray-500 hover:text-ffn-primary">Return to Boards</button>
            </div>
        );
    }

    const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        // In production, this would trigger an API call. For now, we just clear the input.
        setNewComment('');
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header */}
            <div className="mb-10 space-y-6">
                <button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-ffn-black transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Grid</span>
                </button>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <h1 className="text-5xl font-serif italic text-ffn-black">{board.title}</h1>
                        {board.description && (
                            <p className="text-sm text-gray-500 leading-relaxed border-l-2 border-ffn-primary pl-4">{board.description}</p>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="flex -space-x-3 mr-4">
                            {board.collaborators.map(collab => (
                                <img
                                    key={collab.user_id}
                                    src={collab.user.avatarUrl}
                                    alt={collab.user.displayName}
                                    title={`${collab.user.displayName} (${collab.role})`}
                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                />
                            ))}
                        </div>

                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-ffn-primary hover:border-ffn-primary transition-colors shadow-sm" title="Invite Collaborators">
                            <Users className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-ffn-primary hover:border-ffn-primary transition-colors shadow-sm" title="Share Board">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Main Workspace (Masonry Grid) */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Creative Workspace</h3>
                        <button className="text-[10px] bg-ffn-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-ffn-primary transition-all flex items-center space-x-2">
                            <Plus className="w-3 h-3" />
                            <span>Add Reference</span>
                        </button>
                    </div>

                    {board.items && board.items.length > 0 ? (
                        <div className="columns-1 md:columns-2 gap-6 space-y-6">
                            {board.items.map(item => (
                                <div key={item.id} className="relative group break-inside-avoid rounded-3xl overflow-hidden bg-white border border-gray-50 shadow-sm">
                                    <img src={item.media_url} alt="Reference" className="w-full h-auto object-cover" />

                                    {item.note && (
                                        <div className="p-4 bg-white border-t border-gray-50">
                                            <p className="text-xs font-bold text-gray-700">{item.note}</p>
                                        </div>
                                    )}

                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-2">
                                        <button title="Item Options" className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-600 hover:text-ffn-primary transition-colors">
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border-2 border-dashed border-gray-200 rounded-[3rem] p-24 text-center space-y-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                                <ImageIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif italic text-ffn-black">Empty Canvas</h3>
                                <p className="text-sm text-gray-400 mt-2">Add images, videos, or save posts from the feed to start building your vision.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar: Comments & Activity */}
                <div className="space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400">Team Discussion</h3>

                    <div className="bg-white rounded-[2.5rem] border border-gray-100 flex flex-col h-[600px] shadow-xl">
                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            {board.comments && board.comments.length > 0 ? (
                                board.comments.map(comment => (
                                    <div key={comment.id} className="flex space-x-4">
                                        <img
                                            src={comment.user?.avatarUrl}
                                            alt=""
                                            className="w-8 h-8 rounded-full bg-gray-100 object-cover mt-1"
                                        />
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] uppercase font-bold text-ffn-black tracking-widest">{comment.user?.displayName}</span>
                                                <span className="text-[8px] text-gray-400 uppercase tracking-widest">
                                                    {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 w-fit max-w-[90%]">
                                                <p className="text-xs leading-relaxed text-gray-600">{comment.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 px-6">
                                    <MessageCircle className="w-12 h-12 text-gray-200" />
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose">No comments yet.<br />Start the creative dialogue.</p>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-gray-100">
                            <form onSubmit={handlePostComment} className="flex items-end space-x-2">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Share a thought..."
                                    className="flex-1 bg-gray-50 border-none rounded-2xl py-4 px-5 text-xs focus:ring-0"
                                />
                                <button
                                    type="submit"
                                    disabled={!newComment.trim()}
                                    className="w-12 h-12 rounded-2xl bg-ffn-primary text-white flex items-center justify-center hover:bg-ffn-primary/90 transition-colors disabled:opacity-50"
                                    title="Send Comment"
                                >
                                    <ArrowLeft className="w-4 h-4 rotate-135" style={{ transform: 'rotate(135deg)' }} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
