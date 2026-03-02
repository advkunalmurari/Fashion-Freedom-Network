import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, PhoneOff, UserCheck, UserX, Clock, Users, Play } from 'lucide-react';
import { MOCK_LIVE_CASTINGS, MOCK_TALENT_POOL } from '../constants';
import { LiveCasting, CastingParticipant, User } from '../types';

interface LiveCastingRoomProps {
    castingId: string;
    currentUser: User;
    isHost: boolean;
    onLeave: () => void;
}

export const LiveCastingRoom: React.FC<LiveCastingRoomProps> = ({ castingId, currentUser, isHost, onLeave }) => {
    const [casting, setCasting] = useState<LiveCasting | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        // In production, this would subscribe to Supabase Realtime for the casting session
        const mockCasting = MOCK_LIVE_CASTINGS.find(c => c.castingId === castingId || c.id === castingId);
        setCasting(mockCasting || null);
    }, [castingId]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (casting && casting.status === 'live' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [casting, timer]);

    if (!casting) return <div className="p-20 text-center animate-pulse">Loading Room...</div>;

    const currentParticipant = casting.participants.find(p => p.id === casting.currentParticipantId);
    const waitingParticipants = casting.participants.filter(p => p.status === 'waiting');

    // Helper for participant logic
    const handleAction = (action: 'shortlist' | 'pass') => {
        // Prod: Call API. Dev: Just clear the timer for visual feedback.
        setTimer(60);
        // Real implementation would shift currentParticipant to next in `waiting` queue
        alert(`Participant ${action}ed. Next participant called.`);
    };

    const RenderHostView = () => (
        <div className="flex h-[85vh] bg-ffn-black rounded-[3rem] overflow-hidden text-white border border-gray-800 animate-in fade-in duration-500 shadow-2xl">
            {/* Sidebar: Queue */}
            <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Live Queue</h3>
                    <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-bold">{waitingParticipants.length} Waiting</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {waitingParticipants.map(participant => (
                        <div key={participant.id} className="flex items-center space-x-4 p-4 rounded-2xl bg-gray-800/50">
                            <img src={participant.user?.avatarUrl} className="w-10 h-10 rounded-full object-cover" alt="" />
                            <div>
                                <p className="text-xs font-bold">{participant.user?.displayName}</p>
                                <p className="text-[9px] uppercase tracking-widest text-gray-400 mt-1">{participant.user?.role}</p>
                            </div>
                        </div>
                    ))}
                    {waitingParticipants.length === 0 && (
                        <div className="text-center p-8 text-gray-500 text-xs">Waiting room is empty.</div>
                    )}
                </div>
            </div>

            {/* Main Video Area */}
            <div className="flex-1 flex flex-col">
                <div className="p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent absolute w-full z-10">
                    <div>
                        <span className="bg-red-500 text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full animate-pulse">Live</span>
                        <h2 className="text-xl font-serif italic mt-2 ml-1">{casting.title}</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className={`text-3xl font-bold ${timer <= 15 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
                            00:{timer.toString().padStart(2, '0')}
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative bg-gray-950 flex items-center justify-center">
                    {currentParticipant ? (
                        <>
                            {/* Main Feed: Model */}
                            <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center">
                                <img src={currentParticipant.user?.avatarUrl} className="w-full h-full object-cover opacity-60" alt="" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <UserCheck className="w-20 h-20 text-white/20 mb-4" />
                                    <p className="text-2xl font-serif italic">{currentParticipant.user?.displayName}</p>
                                    <p className="text-sm text-gray-400 mt-2">In Audition</p>
                                </div>
                            </div>

                            {/* Picture-in-Picture: Host camera */}
                            <div className="absolute bottom-32 right-8 w-48 aspect-video bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl flex items-center justify-center">
                                {isVideoOff ? <VideoOff className="text-gray-500" /> : <img src={currentUser.avatarUrl} className="w-full h-full object-cover opacity-80" alt="Host" />}
                            </div>
                        </>
                    ) : (
                        <div className="text-center space-y-4">
                            <Users className="w-12 h-12 text-gray-700 mx-auto" />
                            <p className="text-gray-500 font-serif italic text-xl">Waiting for talent to join...</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="h-28 bg-gray-900 border-t border-gray-800 flex items-center justify-between px-10 relative z-20">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsMuted(!isMuted)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isMuted ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>
                        <button onClick={() => setIsVideoOff(!isVideoOff)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isVideoOff ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30' : 'bg-gray-800 text-white hover:bg-gray-700'}`}>
                            {isVideoOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                        </button>
                    </div>

                    {currentParticipant && (
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => handleAction('pass')}
                                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-8 py-4 rounded-full text-[10px] uppercase font-bold tracking-widest transition-all"
                            >
                                <UserX className="w-4 h-4" /> <span>Pass / Next</span>
                            </button>
                            <button
                                onClick={() => handleAction('shortlist')}
                                className="flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-4 rounded-full text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
                            >
                                <UserCheck className="w-4 h-4" /> <span>Shortlist</span>
                            </button>
                        </div>
                    )}

                    <button onClick={onLeave} className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105" title="End Session">
                        <PhoneOff className="w-6 h-6 text-white" />
                    </button>
                </div>
            </div>
        </div>
    );

    const myParticipantRecord = casting.participants.find(p => p.userId === currentUser.id);

    const RenderParticipantView = () => {
        if (!myParticipantRecord || myParticipantRecord.status === 'waiting') {
            return (
                <div className="flex items-center justify-center h-[70vh] animate-in fade-in">
                    <div className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100 max-w-lg w-full space-y-8">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-ffn-primary relative">
                            <Clock className="w-10 h-10 animate-bounce" />
                            <div className="absolute inset-0 rounded-full border-4 border-ffn-primary/20 border-t-ffn-primary animate-spin" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-serif italic text-ffn-black">Waiting Room</h2>
                            <p className="text-gray-500 mt-4 leading-relaxed">The casting director is currently seeing another talent. You will be pulled in automatically when it's your turn. Please keep your camera on.</p>
                        </div>
                        <div className="bg-ffn-primary/5 rounded-2xl p-6">
                            <p className="text-[10px] uppercase font-bold tracking-widest text-ffn-primary">Your position in queue: <span className="text-lg mx-2 text-ffn-black">2</span></p>
                        </div>
                        <button onClick={onLeave} className="text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-red-500 transition-colors">
                            Leave Queue
                        </button>
                    </div>
                </div>
            );
        }

        if (myParticipantRecord.status === 'in_call') {
            return (
                <div className="flex h-[85vh] bg-ffn-black rounded-[3rem] overflow-hidden text-white border border-gray-800 animate-in fade-in duration-500 shadow-2xl relative">
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
                        {/* Simulating Brand feed */}
                        <div className="text-center space-y-4">
                            <Building2 className="w-20 h-20 text-white/20 mx-auto" />
                            <p className="font-serif italic text-2xl">Condé Nast Casting Director</p>
                        </div>
                    </div>

                    {/* PIP model feed */}
                    <div className="absolute bottom-32 right-8 w-48 aspect-[3/4] bg-gray-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                        <img src={currentUser.avatarUrl} className="w-full h-full object-cover" alt="You" />
                    </div>

                    <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center space-x-6">
                        <button onClick={() => setIsMuted(!isMuted)} className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur transition-colors ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'}`}>
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>
                        <button onClick={onLeave} className="w-14 h-14 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105" title="Leave Audition">
                            <PhoneOff className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex items-center justify-center h-[70vh] animate-in zoom-in">
                <div className="bg-white rounded-[3rem] p-16 text-center shadow-2xl border border-gray-100 max-w-lg w-full space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-8">
                        <UserCheck className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-serif italic text-ffn-black">Audition Complete</h2>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-sm mx-auto">Thank you for attending the live casting room. The brand will contact you directly via FFN Messages if you are shortlisted.</p>
                    <button onClick={onLeave} className="mt-8 bg-ffn-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-ffn-primary transition-colors">
                        Return to Castings
                    </button>
                </div>
            </div>
        );
    };

    return isHost ? <RenderHostView /> : <RenderParticipantView />;
};
