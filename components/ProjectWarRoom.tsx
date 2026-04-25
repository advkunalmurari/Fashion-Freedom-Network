import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft, Send, Paperclip, Download, CheckCircle2,
    Circle, Clock, FileText, ImageIcon,
    MoreVertical, Info, MessageSquare, Files,
    Activity, Layout, SendHorizonal, Loader2, ShieldCheck
} from 'lucide-react';
import { MOCK_WAR_ROOMS } from '../constants';
import { WarRoom, ProjectMilestone, ProjectMessage, ProjectFile, ProjectFinancials } from '../types';
import { NotificationToast, Toast } from './NotificationToast';
import { ProjectPipeline } from './ProjectPipeline';
import { PerformanceLedger } from './PerformanceLedger';

export const ProjectWarRoom: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const warRoom = MOCK_WAR_ROOMS.find(wr => wr.projectId === projectId) || MOCK_WAR_ROOMS[0];

    const [activeTab, setActiveTab] = useState<'overview' | 'messages' | 'files' | 'finance'>('overview');
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<ProjectMessage[]>(warRoom.messages);
    const [files, setFiles] = useState<ProjectFile[]>(warRoom.files);
    const [isUploading, setIsUploading] = useState(false);
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (toast: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { ...toast, id }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const msg: ProjectMessage = {
            id: `msg-${Date.now()}`,
            senderId: 't1', // Assuming current user is talent for demo
            senderName: warRoom.talent.name,
            senderAvatar: warRoom.talent.avatarUrl,
            content: newMessage,
            timestamp: new Date().toISOString()
        };
        setMessages([...messages, msg]);
        setNewMessage('');

        // Simulate a reply / notification
        setTimeout(() => {
            addToast({
                title: 'New Message',
                message: `${warRoom.brand.name} just replied to your message.`,
                type: 'message',
                duration: 5000
            });
        }, 2000);
    };

    const handleFileUpload = () => {
        setIsUploading(true);
        // Simulate upload delay
        setTimeout(() => {
            const newFile: ProjectFile = {
                id: 'f' + (files.length + 1),
                name: 'New Asset.jpg',
                size: '2.4 MB',
                type: 'image/jpeg',
                url: '#',
                uploadedBy: 'You',
                uploadedAt: new Date().toISOString()
            };
            setFiles([...files, newFile]);
            setIsUploading(false);
            addToast({
                title: 'Asset Delivered',
                message: 'Your file has been successfully uploaded to the project gallery.',
                type: 'success',
                duration: 4000
            });
        }, 1500);
    };

    const getStatusIcon = (status: ProjectMilestone['status']) => {
        switch (status) {
            case 'COMPLETED': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'IN_PROGRESS': return <Clock className="w-5 h-5 text-ffn-primary animate-pulse" />;
            default: return <Circle className="w-5 h-5 text-gray-300" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 min-h-screen bg-ffn-bg">
            {/* Header */}
            <header className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="flex items-center space-x-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-primary/5 hover:text-ffn-primary transition-all"
                        title="Go Back"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-[0.4em] text-ffn-primary mb-1">
                            <Activity className="w-3 h-3" />
                            <span>Active Workspace</span>
                        </div>
                        <h1 className="text-3xl font-serif italic text-ffn-black">{warRoom.title}</h1>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex -space-x-3">
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100" title={`Brand: ${warRoom.brand.name}`}>
                            <img src={warRoom.brand.logoUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="w-10 h-10 rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100" title={`Talent: ${warRoom.talent.name}`}>
                            <img src={warRoom.talent.avatarUrl} className="w-full h-full object-cover" alt="" />
                        </div>
                    </div>
                    <button className="p-4 bg-gray-50 rounded-2xl hover:bg-ffn-black hover:text-white transition-all" title="More Options">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Escrow Security</span>
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 rounded-full bg-ffn-primary animate-pulse" />
                                <span className="text-[9px] font-bold text-ffn-black uppercase tracking-widest">Funded</span>
                            </div>
                        </div>
                        <button className="px-8 py-4 bg-ffn-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-ffn-primary hover:text-black transition-all shadow-xl">
                            Settle Phase
                        </button>
                    </div>
                </div>
            </header>

            {/* Narrative Pipeline Header */}
            <div className="bg-white/40 backdrop-blur-xl border border-gray-100 rounded-[3rem] p-8 shadow-xl shadow-gray-200/20">
                <ProjectPipeline currentPhase="CAPTURE" completionPercentage={65} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-3 space-y-4">
                    {[
                        { id: 'overview', icon: Layout, label: 'Workboard' },
                        { id: 'messages', icon: MessageSquare, label: 'Protocol' },
                        { id: 'files', icon: FileText, label: 'Assets' },
                        { id: 'finance', icon: ShieldCheck, label: 'Finance' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center w-full p-6 rounded-[2rem] transition-all space-x-4 border-2 ${activeTab === tab.id
                                ? 'bg-ffn-black text-white border-ffn-black shadow-2xl'
                                : 'bg-white text-gray-400 border-transparent hover:border-gray-100'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                        </button>
                    ))}

                    <div className="bg-gradient-to-br from-ffn-primary to-ffn-accent p-8 rounded-[2.5rem] text-white shadow-xl mt-12">
                        <Clock className="w-8 h-8 mb-4 opacity-50" />
                        <h4 className="text-lg font-serif italic mb-2">Next Milestone</h4>
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Location Scouting</p>
                        <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl text-[9px] font-bold uppercase tracking-widest">
                            Due Oct 22
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-9 bg-white rounded-[3.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[700px]">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' && (
                            <m.div
                                key="overview"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-12 space-y-12"
                            >
                                <div className="space-y-6">
                                    <ProjectPipeline currentPhase="CAPTURE" completionPercentage={65} />
                                    <h2 className="text-3xl font-serif italic text-ffn-black">Milestone Tracker</h2>
                                    <div className="space-y-4">
                                        {warRoom.milestones.map((milestone) => (
                                            <div key={milestone.id} className="flex items-start space-x-6 p-6 rounded-[2rem] border border-gray-50 bg-gray-50/30 hover:bg-white hover:shadow-xl hover:border-ffn-primary/10 transition-all group">
                                                <div className="mt-1">{getStatusIcon(milestone.status)}</div>
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className={`text-sm font-black uppercase tracking-widest ${milestone.status === 'COMPLETED' ? 'text-gray-400 line-through' : 'text-ffn-black'}`}>
                                                            {milestone.title}
                                                        </h4>
                                                        {milestone.dueDate && (
                                                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{milestone.dueDate}</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-500 text-xs font-medium leading-relaxed">{milestone.description}</p>
                                                </div>
                                                <button className="p-2 bg-white rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-sm" title="Details">
                                                    <Info className="w-4 h-4 text-gray-400" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-12 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-2xl font-serif italic text-ffn-black">Workflow History</h3>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-ffn-primary hover:underline">Export Log</button>
                                    </div>
                                    <div className="space-y-6">
                                        {[1, 2].map(i => (
                                            <div key={i} className="flex items-center space-x-4">
                                                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[8px] font-black text-gray-400 uppercase">
                                                    {i === 1 ? 'V' : 'A'}
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-medium text-ffn-black">
                                                        {i === 1 ? 'Vogue Team marked "Moodboard Finalization" as completed.' : `${warRoom.talent.name} uploaded "Location_Options_v1.zip".`}
                                                    </p>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">2 hours ago</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {activeTab === 'messages' && (
                            <m.div
                                key="chat"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="flex flex-col h-full"
                            >
                                <div className="flex-1 p-8 space-y-8 overflow-y-auto no-scrollbar">
                                    {messages.map(msg => (
                                        <div
                                            key={msg.id}
                                            className={`flex items-start space-x-4 ${msg.senderId === 't1' ? 'flex-row-reverse space-x-reverse' : ''}`}
                                        >
                                            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-gray-100 flex-none">
                                                {msg.senderAvatar ? <img src={msg.senderAvatar} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center bg-ffn-primary text-white text-[10px] font-bold">{msg.senderName[0]}</div>}
                                            </div>
                                            <div className={`space-y-2 max-w-[70%] ${msg.senderId === 't1' ? 'items-end' : ''}`}>
                                                <div className={`flex items-center space-x-3 ${msg.senderId === 't1' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-ffn-black">{msg.senderName}</span>
                                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                                <div className={`p-5 rounded-[2rem] text-sm font-medium leading-relaxed ${msg.senderId === 't1' ? 'bg-ffn-black text-white rounded-tr-none' : 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100'}`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-10 border-t border-gray-100 bg-white sticky bottom-0">
                                    <div className="relative flex items-center bg-gray-50 border-2 border-transparent focus-within:border-ffn-primary/20 rounded-[2.5rem] px-8 py-4 transition-all shadow-sm">
                                        <button className="p-3 text-gray-400 hover:text-ffn-primary transition-all mr-4" title="Attach">
                                            <Paperclip className="w-5 h-5" />
                                        </button>
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                            placeholder="Message the team..."
                                            className="flex-1 bg-transparent border-none text-sm font-medium focus:ring-0 placeholder:text-gray-400"
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            className="ml-4 p-4 bg-ffn-black text-white rounded-2xl shadow-xl hover:bg-ffn-primary transition-all"
                                            title="Send"
                                        >
                                            <SendHorizonal className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {activeTab === 'files' && (
                            <m.div
                                key="files"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-12 space-y-12"
                            >
                                <div className="flex items-center justify-between">
                                    <h2 className="text-3xl font-serif italic text-ffn-black">Asset Gallery</h2>
                                    <button
                                        onClick={handleFileUpload}
                                        disabled={isUploading}
                                        className="bg-gray-50 text-ffn-black px-8 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-ffn-black hover:text-white transition-all shadow-sm flex items-center space-x-2"
                                    >
                                        {isUploading ? <Loader2 className="w-4 h-4 animate-spin text-ffn-primary" /> : <Paperclip className="w-4 h-4" />}
                                        <span>{isUploading ? 'Uploading Assets...' : 'Upload Final Assets'}</span>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {files.map(file => (
                                        <div key={file.id} className="group bg-white p-6 rounded-3xl border border-gray-50 shadow-sm hover:shadow-2xl hover:border-ffn-primary/20 transition-all text-center space-y-6">
                                            <div className="aspect-square bg-gray-50 rounded-2xl flex items-center justify-center mx-auto group-hover:bg-ffn-primary/5 transition-all">
                                                <FileText className="w-8 h-8 text-gray-300 group-hover:text-ffn-primary transition-all" />
                                            </div>
                                            <div className="space-y-1">
                                                <h4 className="text-[10px] font-black text-ffn-black uppercase tracking-tight truncate px-2">{file.name}</h4>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{file.type} &bull; {file.size}</p>
                                            </div>
                                            <button className="p-3 bg-gray-50 rounded-xl hover:bg-ffn-primary hover:text-white transition-all mx-auto shadow-sm" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Empty slots placeholders */}
                                    {!isUploading && [1, 2, 3].slice(0, 4 - (files.length % 4)).map(i => (
                                        <div key={i} className="aspect-square bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center">
                                            <div className="text-center space-y-2 opacity-30">
                                                <ImageIcon className="w-6 h-6 mx-auto" />
                                                <span className="text-[8px] font-black uppercase tracking-widest">Empty Slot</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="bg-ffn-black text-white p-12 rounded-[3.5rem] relative overflow-hidden group mt-12">
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-ffn-primary/20 blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2" />
                                    <div className="relative z-10 space-y-4">
                                        <h3 className="text-2xl font-serif italic text-white">Smart Delivery</h3>
                                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-lg">
                                            Final high-res assets delivered here are automatically watermarked and encrypted until the escrow payment is released.
                                        </p>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-ffn-primary hover:underline pt-4">Learn about Secure Handoff</button>
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {activeTab === 'finance' && warRoom.financials && (
                            <m.div
                                key="finance"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="p-12 space-y-12"
                            >
                                <PerformanceLedger financials={warRoom.financials} />
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <NotificationToast toasts={toasts} onRemove={removeToast} />
        </div>
    );
};
