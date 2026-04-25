import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Plus, Users, Image as ImageIcon, Search, CheckCircle, X } from 'lucide-react';
import { MOCK_MOOD_BOARDS, MOCK_TALENT_POOL } from '../constants';
import { MoodBoard, User } from '../types';

interface MoodBoardsProps {
    currentUser: User;
    onSelectBoard: (boardId: string) => void;
}

export const MoodBoards: React.FC<MoodBoardsProps> = ({ currentUser, onSelectBoard }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState<{ show: boolean; boardId: string | null }>({ show: false, boardId: null });
    const [inviteSearch, setInviteSearch] = useState('');
    const [newBoardData, setNewBoardData] = useState({ title: '', description: '', isPrivate: false });

    // Filter boards where the current user is a collaborator
    const userBoards = MOCK_MOOD_BOARDS.filter(board =>
        board.collaborators.some(collab => collab.user_id === currentUser.id)
    );

    const filteredBoards = userBoards.filter(board =>
        board.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        board.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-4xl font-serif italic text-ffn-black">Mood Boards</h2>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mt-2">Pre-production & Creative Vision</p>
                </div>

                <button
                    title="Create New Mood Board"
                    onClick={() => setShowCreateModal(true)}
                    className="bg-ffn-primary text-white px-8 py-4 rounded-2xl flex items-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-ffn-primary/90 transition-all shadow-xl shadow-ffn-primary/30"
                >
                    <Plus className="w-4 h-4" />
                    <span>Create Board</span>
                </button>
            </div>

            <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search by campaign name or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-[2rem] py-6 pl-16 pr-8 text-sm focus:border-ffn-primary transition-colors shadow-sm"
                />
            </div>

            {filteredBoards.length === 0 ? (
                <div className="bg-white rounded-[3rem] p-16 text-center border border-gray-100 space-y-6">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                        <ImageIcon className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic text-ffn-black">No Mood Boards Found</h3>
                        <p className="text-sm text-gray-500 mt-2">Create a new board to start organizing your creative vision.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredBoards.map(board => (
                        <div
                            key={board.id}
                            onClick={() => onSelectBoard(board.id)}
                            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 cursor-pointer group hover:shadow-2xl hover:border-ffn-primary/30 transition-all duration-500"
                        >
                            <div className="relative h-48 overflow-hidden bg-gray-100">
                                {board.coverImage ? (
                                    <img
                                        src={board.coverImage}
                                        alt={board.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <ImageIcon className="w-8 h-8" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-ffn-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>

                            <div className="p-8 space-y-6">
                                <div>
                                    <h3 className="text-lg font-bold text-ffn-black group-hover:text-ffn-primary transition-colors line-clamp-1" title={board.title}>
                                        {board.title}
                                    </h3>
                                    {board.description && (
                                        <p className="text-xs text-gray-500 mt-2 line-clamp-2">{board.description}</p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                    <div className="flex -space-x-3">
                                        {board.collaborators.slice(0, 3).map(collab => (
                                            <img
                                                key={collab.user_id}
                                                src={collab.user.avatarUrl}
                                                alt={collab.user.displayName}
                                                title={collab.user.displayName}
                                                className="w-8 h-8 rounded-full border-2 border-white object-cover"
                                            />
                                        ))}
                                        {board.collaborators.length > 3 && (
                                            <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[8px] font-black text-gray-500">
                                                +{board.collaborators.length - 3}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <button
                                            title="Invite Collaborators"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setShowInviteModal({ show: true, boardId: board.id });
                                            }}
                                            className="p-2 bg-gray-50 hover:bg-ffn-primary/10 text-gray-400 hover:text-ffn-primary rounded-xl transition-all"
                                        >
                                            <Users className="w-3.5 h-3.5" />
                                        </button>
                                        <div className="flex items-center space-x-1 text-gray-400 group-hover:text-ffn-primary transition-colors">
                                            <ImageIcon className="w-4 h-4" />
                                            <span className="text-xs font-bold">{board.items?.length || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <AnimatePresence>
                {showCreateModal && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <m.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-serif italic text-ffn-black">Create New Board</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Initialize your creative project</p>
                                    </div>
                                    <button
                                        title="Close Modal"
                                        onClick={() => setShowCreateModal(false)}
                                        className="text-gray-400 hover:text-ffn-black"
                                    >
                                        <Plus className="w-6 h-6 rotate-45" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Board Title</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Summer Editorial 2026"
                                            className="w-full bg-gray-50 border border-transparent focus:border-ffn-primary/30 rounded-2xl py-4 px-6 text-sm outline-none transition-all"
                                            value={newBoardData.title}
                                            onChange={e => setNewBoardData({ ...newBoardData, title: e.target.value })}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Description</label>
                                        <textarea
                                            placeholder="Briefly describe the vision..."
                                            rows={3}
                                            className="w-full bg-gray-50 border border-transparent focus:border-ffn-primary/30 rounded-2xl py-4 px-6 text-sm outline-none transition-all resize-none"
                                            value={newBoardData.description}
                                            onChange={e => setNewBoardData({ ...newBoardData, description: e.target.value })}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-gray-400 shadow-sm">
                                                <Users className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-ffn-black uppercase tracking-widest">Collaborative Mode</p>
                                                <p className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Public to invited talent</p>
                                            </div>
                                        </div>
                                        <button
                                            title="Toggle Privacy"
                                            onClick={() => setNewBoardData({ ...newBoardData, isPrivate: !newBoardData.isPrivate })}
                                            className={`w - 12 h - 6 rounded - full transition - colors relative ${newBoardData.isPrivate ? 'bg-ffn-black' : 'bg-ffn-primary'} `}
                                        >
                                            <div className={`absolute top - 1 w - 4 h - 4 bg - white rounded - full transition - all ${newBoardData.isPrivate ? 'left-1' : 'left-7'} `} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    disabled={!newBoardData.title}
                                    className="w-full py-5 bg-ffn-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-ffn-primary transition-all shadow-xl disabled:opacity-50"
                                    onClick={() => {
                                        // Logic to save board would go here
                                        setShowCreateModal(false);
                                        setNewBoardData({ title: '', description: '', isPrivate: false });
                                    }}
                                >
                                    Initialize Board
                                </button>
                            </div>
                        </m.div>
                    </div>
                )}
                {showInviteModal.show && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                        <m.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white rounded-[3rem] w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-10 space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-2xl font-serif italic text-ffn-black">Invite Collaborators</h3>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">Add verified professionals to this board</p>
                                    </div>
                                    <button
                                        title="Close Invite Modal"
                                        onClick={() => setShowInviteModal({ show: false, boardId: null })}
                                        className="text-gray-400 hover:text-ffn-black"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name or username..."
                                        className="w-full bg-gray-50 border border-transparent focus:border-ffn-primary/30 rounded-2xl py-4 pl-12 pr-6 text-sm outline-none transition-all"
                                        value={inviteSearch}
                                        onChange={e => setInviteSearch(e.target.value)}
                                    />
                                </div>

                                <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                                    {/* Mock search results */}
                                    {MOCK_TALENT_POOL.filter(u => u.displayName.toLowerCase().includes(inviteSearch.toLowerCase()) || u.username.toLowerCase().includes(inviteSearch.toLowerCase())).slice(0, 5).map(user => (
                                        <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-white border border-transparent hover:border-gray-100 rounded-2xl transition-all group">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200">
                                                    <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-ffn-black">{user.displayName}</p>
                                                    <p className="text-[9px] text-gray-400 uppercase tracking-widest font-bold">{user.role}</p>
                                                </div>
                                            </div>
                                            <button
                                                title={`Invite ${user.displayName} `}
                                                className="px-4 py-2 bg-ffn-black text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all opacity-0 group-hover:opacity-100"
                                                onClick={() => {
                                                    // Logic to invite collaborator
                                                    setShowInviteModal({ show: false, boardId: null });
                                                }}
                                            >
                                                Invite
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};
