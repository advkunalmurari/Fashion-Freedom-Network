import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { User } from '../types';
import { MOCK_TALENT_POOL } from '../constants';
import {
    Zap, SlidersHorizontal, MapPin, Star, ShieldCheck,
    Search, TrendingUp, ChevronDown, X, CheckCircle,
    Briefcase, Users, Award, Sparkles, ArrowRight,
    BarChart2, Brain, Target, MessageSquare, LineChart, Sparkles as SparklesIcon
} from 'lucide-react';
import { PredictiveCasting } from './PredictiveCasting';

// ─── Types ─────────────────────────────────────────────────────────────────────
interface MatchProfile {
    user: User;
    score: number; // 0–100
    breakdown: {
        skillFit: number;
        locationFit: number;
        reputationScore: number;
        availabilityScore: number;
        aiFitScore: number;
    };
    whyMatch: string[];
    matchTag: 'Perfect Fit' | 'Strong Match' | 'Good Match';
    roiIndex: number; // 0-10.0
    collaborationHistory: number; // 0-100
}

interface BriefFilters {
    role: string;
    location: string;
    budgetMin: number;
    budgetMax: number;
    lookType: string;
    experience: string;
    minReliability: number;
    minROI: number;
    collaborationFocus: boolean;
}

// ─── AI Score Simulator ───────────────────────────────────────────────────────
function computeMatch(user: User, filters: BriefFilters): MatchProfile {
    const skillFit = Math.min(100, 55 + Math.floor(Math.random() * 45));
    const locationFit = !filters.location || filters.location === 'All India'
        ? 80 + Math.floor(Math.random() * 20)
        : (user.location?.toLowerCase().includes(filters.location.toLowerCase()) ? 85 + Math.floor(Math.random() * 15) : 30 + Math.floor(Math.random() * 30));
    const reputationScore = Math.min(100, Math.round(((user.stats?.reliability || 80) / 100) * 100));
    const availabilityScore = user.availability?.isAvailable ? 90 + Math.floor(Math.random() * 10) : 20 + Math.floor(Math.random() * 20);
    const aiFitScore = Math.min(100, 60 + Math.floor(Math.random() * 40));

    const score = Math.round(
        skillFit * 0.3 +
        locationFit * 0.2 +
        reputationScore * 0.2 +
        availabilityScore * 0.15 +
        aiFitScore * 0.15
    );

    const matchTag: MatchProfile['matchTag'] = score >= 85 ? 'Perfect Fit' : score >= 70 ? 'Strong Match' : 'Good Match';

    const whyReasons: string[] = [];
    if (skillFit > 80) whyReasons.push('Skills align with your campaign brief');
    if (locationFit > 85) whyReasons.push('Based in your target market');
    if (reputationScore > 85) whyReasons.push('Exceptional reliability score');
    if (availabilityScore > 80) whyReasons.push('Available for your campaign window');
    if (aiFitScore > 85) whyReasons.push('AI aesthetic fit is very high');
    if (whyReasons.length < 2) whyReasons.push('Relevant verified work credits', 'Brand aesthetic alignment');

    return {
        user,
        score,
        breakdown: { skillFit, locationFit, reputationScore, availabilityScore, aiFitScore },
        whyMatch: whyReasons.slice(0, 3),
        matchTag,
        roiIndex: Number((2.5 + Math.random() * 7).toFixed(1)),
        collaborationHistory: Math.floor(60 + Math.random() * 40)
    };
}

// ─── Score Bar ─────────────────────────────────────────────────────────────────
const ScoreBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
    <div className="space-y-1.5">
        <div className="flex justify-between items-center">
            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">{label}</span>
            <span className="text-[9px] font-black text-gray-600">{value}%</span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <m.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${color}`}
            />
        </div>
    </div>
);

// ─── Overall Score Ring ────────────────────────────────────────────────────────
const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
    const r = 28;
    const circ = 2 * Math.PI * r;
    const dash = (score / 100) * circ;
    const color = score >= 85 ? '#10b981' : score >= 70 ? '#3b82f6' : '#f59e0b';

    return (
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
            <svg width="80" height="80" className="-rotate-90">
                <circle cx="40" cy="40" r={r} fill="none" stroke="#f3f4f6" strokeWidth="5" />
                <m.circle
                    cx="40" cy="40" r={r} fill="none"
                    stroke={color} strokeWidth="5"
                    strokeDasharray={`${circ}`}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - dash }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-ffn-black leading-none">{score}</span>
                <span className="text-[7px] uppercase tracking-widest text-gray-400 font-bold">fit</span>
            </div>
        </div>
    );
};

// ─── Match Card ────────────────────────────────────────────────────────────────
const MatchCard: React.FC<{ match: MatchProfile; rank: number; onClick: () => void }> = ({ match, rank, onClick }) => {
    const { user, score, matchTag, whyMatch } = match;
    const tagColor = matchTag === 'Perfect Fit'
        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
        : matchTag === 'Strong Match'
            ? 'bg-blue-50 text-blue-600 border-blue-100'
            : 'bg-amber-50 text-amber-600 border-amber-100';

    return (
        <m.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ y: -3 }}
            onClick={onClick}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-md hover:shadow-xl hover:border-ffn-primary/20 cursor-pointer transition-all duration-400 overflow-hidden"
        >
            <div className="p-7 flex items-start gap-5">
                {/* Rank */}
                <div className="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-[10px] font-black text-gray-400 shrink-0 mt-1">
                    {rank}
                </div>

                {/* Avatar */}
                <div className="relative shrink-0">
                    <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                        {user.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" loading="lazy" width="64" height="64" />}
                    </div>
                    {user.verificationLevel && user.verificationLevel !== 'NONE' && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-ffn-primary rounded-full flex items-center justify-center">
                            <ShieldCheck className="w-3 h-3 text-white" />
                        </div>
                    )}
                </div>

                {/*  Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <h3 className="font-serif italic font-bold text-ffn-black text-lg leading-tight truncate group-hover:text-ffn-primary">
                                {user.displayName}
                            </h3>
                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-0.5">{user.role}</p>
                        </div>
                        <span className={`text-[8px] uppercase tracking-widest font-black px-2.5 py-1.5 rounded-full border shrink-0 ${tagColor}`}>
                            {matchTag}
                        </span>
                    </div>

                    <div className="flex items-center space-x-3 mt-2 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                        {user.location && (
                            <span className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3 text-ffn-primary" />
                                <span>{user.location}</span>
                            </span>
                        )}
                        <span className="flex items-center space-x-1">
                            <Star className="w-3 h-3 fill-ffn-primary text-ffn-primary" />
                            <span>{user.stats?.avgRating?.toFixed(1) || '4.8'}</span>
                        </span>
                    </div>

                    {/* Why match pills */}
                    <div className="flex flex-wrap gap-2 mt-3">
                        {whyMatch.slice(0, 2).map((r, i) => (
                            <span key={i} className="flex items-center space-x-1 bg-gray-50 text-gray-500 text-[8px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full">
                                <CheckCircle className="w-2.5 h-2.5 text-emerald-500 shrink-0" />
                                <span>{r}</span>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Score Ring */}
                <ScoreRing score={score} />
            </div>

            {/* Rate strip if available */}
            {user.availability?.ratePerDay && (
                <div className="px-7 py-3 bg-gray-50/60 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">ROI Index</span>
                            <span className="text-sm font-bold text-ffn-primary">{match.roiIndex}x</span>
                        </div>
                        <div className="w-px h-6 bg-gray-200" />
                        <div className="flex flex-col">
                            <span className="text-[8px] uppercase tracking-widest font-black text-gray-400">Day Rate</span>
                            <span className="text-sm font-bold text-ffn-black">₹{user.availability.ratePerDay.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        {match.roiIndex > 8 && <SparklesIcon className="w-4 h-4 text-ffn-primary animate-pulse" />}
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                    </div>
                </div>
            )}
        </m.div>
    );
};

// ─── Profile Detail Drawer ─────────────────────────────────────────────────────
const MatchDetail: React.FC<{ match: MatchProfile; onClose: () => void }> = ({ match, onClose }) => {
    const { user, score, breakdown, whyMatch, matchTag } = match;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <m.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col overflow-y-auto"
            >
                {/* Header */}
                <div className="p-8 border-b border-gray-100 flex items-start gap-5">
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100">
                            {user.avatarUrl && <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" loading="lazy" width="80" height="80" />}
                        </div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-serif italic font-bold text-ffn-black">{user.displayName}</h2>
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mt-1">{user.role}</p>
                        {user.location && (
                            <p className="flex items-center space-x-1 text-sm text-gray-500 mt-2">
                                <MapPin className="w-3.5 h-3.5 text-ffn-primary" />
                                <span>{user.location}</span>
                            </p>
                        )}
                    </div>
                    <button
                        title="Close"
                        onClick={onClose}
                        className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-ffn-black transition-colors shrink-0"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 p-8 space-y-8">
                    {/* AI Match Score */}
                    <div className="bg-gradient-to-br from-ffn-black to-gray-800 rounded-3xl p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1">AI Match Score</p>
                                <p className="text-5xl font-serif font-bold">{score}<span className="text-2xl text-gray-400">/100</span></p>
                            </div>
                            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
                                <Brain className="w-8 h-8 text-ffn-primary" />
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Sparkles className="w-3.5 h-3.5 text-ffn-primary" />
                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-300">{matchTag} for your brief</span>
                        </div>
                    </div>

                    {/* Compatibility breakdown */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-5">Compatibility Breakdown</h3>
                        <div className="space-y-4">
                            <ScoreBar label="Skill Fit" value={breakdown.skillFit} color="bg-violet-400" />
                            <ScoreBar label="Location Fit" value={breakdown.locationFit} color="bg-blue-400" />
                            <ScoreBar label="Reputation Score" value={breakdown.reputationScore} color="bg-emerald-400" />
                            <ScoreBar label="Availability" value={breakdown.availabilityScore} color="bg-amber-400" />
                            <ScoreBar label="AI Aesthetic Fit" value={breakdown.aiFitScore} color="bg-ffn-primary" />
                        </div>
                    </div>

                    {/* Why this match */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">Why FFN AI recommends this talent</h3>
                        <div className="space-y-3">
                            {whyMatch.map((r, i) => (
                                <div key={i} className="flex items-start space-x-3 bg-gray-50 rounded-2xl p-4">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-sm text-gray-700">{r}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <div>
                            <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">About</h3>
                            <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                        </div>
                    )}

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: 'Portfolio', value: `${user.stats?.postCount || 0}`, icon: Briefcase },
                            { label: 'Network', value: `${user.stats?.followersCount || 0}`, icon: Users },
                            { label: 'Rating', value: `${user.stats?.avgRating?.toFixed(1) || 'N/A'}`, icon: Star },
                        ].map(s => {
                            const Icon = s.icon;
                            return (
                                <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                                    <Icon className="w-4 h-4 mx-auto text-gray-400 mb-2" />
                                    <p className="text-xl font-serif font-bold text-ffn-black">{s.value}</p>
                                    <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">{s.label}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* CTA Footer */}
                <div className="p-8 border-t border-gray-100 bg-white grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center space-x-2 py-4 bg-gray-100 text-ffn-black rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-gray-200 transition-all">
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                    </button>
                    <button className="flex items-center justify-center space-x-2 py-4 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all shadow-xl">
                        <Briefcase className="w-4 h-4" />
                        <span>Hire Now</span>
                    </button>
                </div>
            </m.div>
        </div>
    );
};

// ─── Brief Builder Panel ───────────────────────────────────────────────────────
const BriefBuilder: React.FC<{
    filters: BriefFilters;
    onChange: (f: BriefFilters) => void;
    onMatch: () => void;
    isLoading: boolean;
}> = ({ filters, onChange, onMatch, isLoading }) => {
    const update = (key: keyof BriefFilters, val: any) => onChange({ ...filters, [key]: val });

    return (
        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-lg p-8 space-y-7 sticky top-6">
            {/* Header */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-ffn-primary/10 rounded-xl flex items-center justify-center">
                    <Target className="w-5 h-5 text-ffn-primary" />
                </div>
                <div>
                    <h3 className="font-serif italic font-bold text-ffn-black text-lg">Campaign Brief</h3>
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Tell the AI what you need</p>
                </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Talent Role</label>
                <select
                    title="Select Talent Role"
                    value={filters.role}
                    onChange={e => update('role', e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3.5 px-4 text-sm bg-gray-50 focus:ring-2 focus:ring-ffn-primary/20 outline-none"
                >
                    {['Any', 'MODEL', 'PHOTOGRAPHER', 'STYLIST', 'MAKEUP_ARTIST'].map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
                </select>
            </div>

            {/* Location */}
            <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">City / Market</label>
                <select
                    title="Select City / Market"
                    value={filters.location}
                    onChange={e => update('location', e.target.value)}
                    className="w-full rounded-2xl border border-gray-200 py-3.5 px-4 text-sm bg-gray-50 focus:ring-2 focus:ring-ffn-primary/20 outline-none"
                >
                    {['All India', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Kolkata', 'Chennai'].map(l => <option key={l}>{l}</option>)}
                </select>
            </div>

            {/* Experience */}
            <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Experience Level</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Any', 'Emerging', 'Senior'].map(e => (
                        <button
                            key={e}
                            title={`Set Experience Level to ${e}`}
                            onClick={() => update('experience', e)}
                            className={`py-3 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all ${filters.experience === e ? 'bg-ffn-black text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                        >
                            {e}
                        </button>
                    ))}
                </div>
            </div>

            {/* Day Rate Budget */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-[9px] uppercase tracking-widest font-black text-gray-400">Day Rate Budget</label>
                    <span className="text-sm font-bold text-ffn-black">₹{filters.budgetMin.toLocaleString()} – ₹{filters.budgetMax.toLocaleString()}</span>
                </div>
                <input
                    title="Budget Range Filter"
                    type="range"
                    min={5000}
                    max={200000}
                    step={5000}
                    value={filters.budgetMax}
                    onChange={e => update('budgetMax', Number(e.target.value))}
                    className="w-full accent-ffn-primary"
                />
            </div>

            {/* Smart AI Filters */}
            <div className="pt-4 border-t border-gray-100">
                <p className="text-[9px] uppercase tracking-widest font-black text-ffn-primary mb-5 flex items-center space-x-2">
                    <SparklesIcon className="w-3 h-3" />
                    <span>Smart AI Filters</span>
                </p>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Min Reliability</span>
                        <select
                            title="Minimum Reliability"
                            value={filters.minReliability}
                            onChange={e => update('minReliability', Number(e.target.value))}
                            className="text-[10px] font-black uppercase tracking-widest bg-gray-50 py-1 px-2 rounded-lg outline-none"
                        >
                            {[80, 85, 90, 95].map(v => <option key={v} value={v}>{v}%+</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Min ROI Index</span>
                        <select
                            title="Minimum ROI Index"
                            value={filters.minROI}
                            onChange={e => update('minROI', Number(e.target.value))}
                            className="text-[10px] font-black uppercase tracking-widest bg-gray-50 py-1 px-2 rounded-lg outline-none"
                        >
                            {[3, 5, 7, 8].map(v => <option key={v} value={v}>{v}x+</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Collab History</span>
                        <button
                            title="Toggle Collaboration History Focus"
                            onClick={() => update('collaborationFocus', !filters.collaborationFocus)}
                            className={`w-10 h-6 rounded-full relative transition-colors ${filters.collaborationFocus ? 'bg-ffn-primary' : 'bg-gray-200'}`}
                        >
                            <m.div
                                animate={{ x: filters.collaborationFocus ? 18 : 2 }}
                                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Run AI Match */}
            <button
                title="Find My Perfect Match"
                onClick={onMatch}
                disabled={isLoading}
                className="w-full py-5 bg-gradient-to-r from-ffn-black to-gray-800 text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:from-ffn-primary hover:to-ffn-primary transition-all hover:-translate-y-0.5 shadow-xl flex items-center justify-center space-x-3 disabled:opacity-60"
            >
                {isLoading ? (
                    <>
                        <Brain className="w-4 h-4 animate-pulse" />
                        <span>Running AI Analysis…</span>
                    </>
                ) : (
                    <>
                        <Zap className="w-4 h-4 fill-current" />
                        <span>Find My Perfect Match</span>
                    </>
                )}
            </button>
            <p className="text-center text-[8px] text-gray-400 uppercase tracking-widest">Powered by FFN Intelligence Engine</p>
        </div>
    );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
export const TalentMatchEngine: React.FC = () => {
    const [filters, setFilters] = useState<BriefFilters>({
        role: 'Any',
        location: 'All India',
        budgetMin: 5000,
        budgetMax: 100000,
        lookType: 'Any',
        experience: 'Any',
        minReliability: 85,
        minROI: 5,
        collaborationFocus: false,
    });

    const [matches, setMatches] = useState<MatchProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasRun, setHasRun] = useState(false);
    const [selectedMatch, setSelectedMatch] = useState<MatchProfile | null>(null);
    const [isSimulationMode, setIsSimulationMode] = useState(false);

    const runMatch = async () => {
        setIsLoading(true);
        setHasRun(false);
        // simulate AI processing delay
        await new Promise(r => setTimeout(r, 1800));

        const talentPool = MOCK_TALENT_POOL.filter(u => {
            if (filters.role !== 'Any' && u.role !== filters.role) return false;
            if (u.stats && (u.stats.reliability || 0) < filters.minReliability) return false;
            return true;
        });

        const scored = talentPool
            .map(u => computeMatch(u, filters))
            .filter(m => m.roiIndex >= filters.minROI)
            .filter(m => !filters.collaborationFocus || m.collaborationHistory > 80)
            .sort((a, b) => b.score - a.score)
            .slice(0, 8);

        setMatches(scored);
        setIsLoading(false);
        setHasRun(true);
    };

    // Auto-run on mount
    useEffect(() => { runMatch(); }, []);

    return (
        <div className="min-h-screen bg-gray-50/40">
            {/* Page header */}
            <div className="bg-white border-b border-gray-100 px-8 py-14">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ffn-primary mb-3 flex items-center space-x-2">
                                <Brain className="w-3.5 h-3.5" />
                                <span>FFN Intelligence Engine</span>
                            </p>
                            <h1 className="text-5xl font-serif italic font-bold text-ffn-black leading-none">
                                AI Talent<br />Match Engine
                            </h1>
                            <p className="text-gray-500 mt-4 max-w-lg leading-relaxed">
                                Describe your campaign brief and our AI scores every verified talent on FFN across 5 compatibility dimensions — surfacing your perfect match in seconds.
                            </p>
                        </div>
                        {hasRun && (
                            <div className="flex items-center space-x-6 bg-gray-50 rounded-2xl px-6 py-4 shrink-0">
                                <div className="text-center">
                                    <p className="text-3xl font-serif font-bold text-ffn-black">{matches.length}</p>
                                    <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Matches Found</p>
                                </div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div className="text-center">
                                    <p className="text-3xl font-serif font-bold text-emerald-500">{matches.filter(m => m.score >= 85).length}</p>
                                    <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Perfect Fits</p>
                                </div>
                                <div className="w-px h-8 bg-gray-200" />
                                <div className="text-center">
                                    <p className="text-3xl font-serif font-bold text-blue-500">{matches[0]?.score || 0}</p>
                                    <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">Top Score</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setIsSimulationMode(!isSimulationMode)}
                                className={`px-6 py-3 rounded-2xl flex items-center space-x-2 text-[10px] uppercase font-black tracking-widest transition-all ${isSimulationMode ? 'bg-ffn-primary text-white' : 'bg-white border border-gray-100 text-gray-400 hover:text-ffn-black'}`}
                            >
                                <LineChart className="w-4 h-4" />
                                <span>{isSimulationMode ? 'Live View' : 'Simulation Mode'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main layout */}
            <div className="max-w-7xl mx-auto px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Brief builder sidebar */}
                    <div className="lg:col-span-1">
                        <BriefBuilder
                            filters={filters}
                            onChange={setFilters}
                            onMatch={runMatch}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Results */}
                    <div className="lg:col-span-2">
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3, 4].map(i => (
                                    <m.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: [0.4, 1, 0.4] }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
                                        className="bg-white rounded-[2.5rem] border border-gray-100 p-7 h-36"
                                    >
                                        <div className="flex items-center space-x-5">
                                            <div className="w-7 h-7 bg-gray-100 rounded-full" />
                                            <div className="w-16 h-16 bg-gray-100 rounded-2xl" />
                                            <div className="flex-1 space-y-3">
                                                <div className="h-4 bg-gray-100 rounded-full w-2/3" />
                                                <div className="h-3 bg-gray-100 rounded-full w-1/3" />
                                                <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                                            </div>
                                            <div className="w-20 h-20 rounded-full bg-gray-100" />
                                        </div>
                                    </m.div>
                                ))}
                                <div className="text-center py-6">
                                    <div className="flex items-center justify-center space-x-2 text-gray-400">
                                        <Brain className="w-5 h-5 animate-pulse text-ffn-primary" />
                                        <p className="text-sm font-bold">AI analysing {MOCK_TALENT_POOL.length} verified profiles…</p>
                                    </div>
                                </div>
                            </div>
                        ) : hasRun ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                                        {isSimulationMode ? 'Predictive Analysis Workspace' : 'Ranked by AI match score'}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-3.5 h-3.5 text-ffn-primary" />
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-ffn-primary">Live Intelligence</span>
                                    </div>
                                </div>
                                <AnimatePresence mode="popLayout">
                                    {isSimulationMode ? (
                                        <m.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="space-y-8"
                                        >
                                            <PredictiveCasting
                                                selectedTalentIds={matches.slice(0, 3).map(m => m.user.id)}
                                                onClose={() => setIsSimulationMode(false)}
                                            />
                                            <div className="bg-ffn-primary/5 rounded-[3rem] p-10 border border-ffn-primary/10">
                                                <h4 className="text-xl font-serif italic font-bold text-ffn-black mb-4">Ensemble Analysis</h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {matches.slice(0, 3).map((m, i) => (
                                                        <div key={m.user.id} className="flex items-center space-x-3 bg-white p-4 rounded-2xl shadow-sm">
                                                            <div className="w-10 h-10 rounded-full border-2 border-ffn-primary overflow-hidden">
                                                                <img src={m.user.avatarUrl} alt="" className="w-full h-full object-cover" loading="lazy" width="40" height="40" />
                                                            </div>
                                                            <div>
                                                                <p className="text-[10px] font-black uppercase tracking-widest text-ffn-black">{m.user.displayName}</p>
                                                                <p className="text-[8px] text-ffn-primary font-bold">{m.score}% Fit</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </m.div>
                                    ) : (
                                        matches.map((match, i) => (
                                            <MatchCard
                                                key={match.user.id}
                                                match={match}
                                                rank={i + 1}
                                                onClick={() => setSelectedMatch(match)}
                                            />
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-[3rem] border border-gray-100 text-center space-y-6">
                                <div className="w-20 h-20 bg-ffn-primary/10 rounded-full flex items-center justify-center">
                                    <Brain className="w-10 h-10 text-ffn-primary" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif italic text-ffn-black">Set Your Brief</h3>
                                    <p className="text-gray-400 text-sm mt-2">Configure your campaign requirements and run the AI match engine.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {selectedMatch && (
                    <MatchDetail match={selectedMatch} onClose={() => setSelectedMatch(null)} />
                )}
            </AnimatePresence>
        </div>
    );
};
