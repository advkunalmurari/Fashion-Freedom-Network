import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { CastingCall, CastingRole, CastingCompensation, CastingStatus } from '../types';
import { MOCK_CASTING_CALLS } from '../constants';
import {
    Briefcase, MapPin, Calendar, Users, Clock, Shield,
    Zap, Star, ChevronRight, X, Check, CheckCircle2,
    ArrowUpRight, AlertCircle, Filter, Search, Bookmark,
    CreditCard, Gift, Camera
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

function daysUntil(iso: string): number {
    return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
}

function timeAgo(iso: string): string {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d}d ago`;
}

// ─── Config ───────────────────────────────────────────────────────────────────
const COMPENSATION_CONFIG: Record<CastingCompensation, { label: string; bg: string; text: string }> = {
    'Paid': { label: 'Paid', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700' },
    'TFP': { label: 'TFP', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700' },
    'Product Exchange': { label: 'Product', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700' },
};

const STATUS_CONFIG: Record<CastingStatus, { color: string; bg: string; icon: React.FC<any> }> = {
    'Open': { color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
    'Closing Soon': { color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100', icon: AlertCircle },
    'Closed': { color: 'text-gray-500', bg: 'bg-gray-50 border-gray-100', icon: X },
    'Filled': { color: 'text-violet-600', bg: 'bg-violet-50 border-violet-100', icon: CheckCircle2 },
};

const ROLES: (CastingRole | 'All')[] = ['All', 'Model', 'Photographer', 'Stylist', 'Makeup Artist', 'Videographer'];
const COMPS: (CastingCompensation | 'All')[] = ['All', 'Paid', 'TFP', 'Product Exchange'];
const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Pune'];

// ─── Application progress pill ────────────────────────────────────────────────
const ApplicantBar: React.FC<{ count: number; max: number }> = ({ count, max }) => {
    const pct = Math.min(100, Math.round((count / max) * 100));
    const color = pct >= 85 ? 'bg-red-400' : pct >= 60 ? 'bg-amber-400' : 'bg-emerald-400';
    return (
        <div className="space-y-1">
            <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <m.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`}
                />
            </div>
            <p className="text-[8px] text-gray-400 font-bold">{count} / {max} applicants</p>
        </div>
    );
};

// ─── Casting Card ─────────────────────────────────────────────────────────────
const CastingCard: React.FC<{ casting: CastingCall; onClick: () => void }> = ({ casting, onClick }) => {
    const status = STATUS_CONFIG[casting.status];
    const comp = COMPENSATION_CONFIG[casting.compensation];
    const deadline = daysUntil(casting.deadline);
    const StatusIcon = status.icon;

    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3 }}
            onClick={onClick}
            className={`bg-white rounded-[2.5rem] border shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group relative
                ${casting.isFeatured ? 'border-ffn-primary/30 shadow-ffn-primary/10' : 'border-gray-100'}
            `}
        >
            {/* Cover image */}
            <div className="relative h-44 overflow-hidden">
                <img src={casting.coverImage} alt={casting.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* Top badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {casting.isFeatured && (
                        <div className="flex items-center space-x-1 bg-ffn-primary text-white px-2.5 py-1.5 rounded-full">
                            <Star className="w-2.5 h-2.5" />
                            <span className="text-[7px] uppercase tracking-widest font-black">Featured</span>
                        </div>
                    )}
                    {casting.isUrgent && (
                        <div className="flex items-center space-x-1 bg-red-500 text-white px-2.5 py-1.5 rounded-full">
                            <Zap className="w-2.5 h-2.5" />
                            <span className="text-[7px] uppercase tracking-widest font-black">Urgent</span>
                        </div>
                    )}
                </div>

                {/* Status */}
                <div className="absolute top-4 right-4">
                    <div className={`flex items-center space-x-1 border px-2.5 py-1.5 rounded-full backdrop-blur-sm ${status.bg}`}>
                        <StatusIcon className={`w-2.5 h-2.5 ${status.color}`} />
                        <span className={`text-[7px] uppercase tracking-widest font-black ${status.color}`}>{casting.status}</span>
                    </div>
                </div>

                {/* Brand in bottom-left */}
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <img src={casting.brandLogo} alt={casting.brandName}
                        className="w-7 h-7 rounded-full object-cover border-2 border-white/30" />
                    <div>
                        <p className="text-white text-[9px] font-black uppercase tracking-widest">{casting.brandName}</p>
                        {casting.brandVerified && <p className="text-white/60 text-[7px]">✓ Verified Brand</p>}
                    </div>
                </div>
            </div>

            {/* Card body */}
            <div className="p-6 space-y-4">
                <div>
                    <h3 className="text-lg font-serif italic font-bold text-ffn-black leading-snug line-clamp-2">{casting.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center space-x-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="text-[9px] font-bold uppercase tracking-widest">{casting.city}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span className="text-[9px] font-bold">{new Date(casting.shootDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span className="text-[9px] font-bold text-orange-500">
                                {deadline <= 0 ? 'Closed' : deadline === 1 ? 'Last day!' : `${deadline}d left`}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Roles + Compensation */}
                <div className="flex flex-wrap gap-1.5">
                    {casting.roles.map(r => (
                        <span key={r} className="text-[8px] bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full uppercase tracking-widest font-bold">{r}</span>
                    ))}
                    <div className={`flex items-center space-x-1 border px-2.5 py-1 rounded-full text-[8px] uppercase tracking-widest font-black ${comp.bg} ${comp.text}`}>
                        {casting.compensation === 'Paid' && <CreditCard className="w-2.5 h-2.5" />}
                        {casting.compensation === 'TFP' && <Camera className="w-2.5 h-2.5" />}
                        {casting.compensation === 'Product Exchange' && <Gift className="w-2.5 h-2.5" />}
                        <span>{casting.compensation === 'Paid' && casting.fee ? fmtINR(casting.fee) : comp.label}</span>
                    </div>
                    {casting.escrowProtected && (
                        <div className="flex items-center space-x-1 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full">
                            <Shield className="w-2.5 h-2.5 text-teal-600" />
                            <span className="text-[8px] uppercase tracking-widest font-black text-teal-700">Escrow</span>
                        </div>
                    )}
                </div>

                {/* Applicant bar */}
                <ApplicantBar count={casting.applicantCount} max={casting.maxApplicants} />

                {/* Footer */}
                <div className="flex items-center justify-between">
                    <span className="text-[9px] text-gray-400 font-bold">Posted {timeAgo(casting.postedAt)}</span>
                    <div className="flex items-center space-x-1 text-ffn-primary">
                        <span className="text-[9px] font-black uppercase tracking-widest">Apply</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </m.div>
    );
};

// ─── Application Drawer ───────────────────────────────────────────────────────
const ApplicationDrawer: React.FC<{ casting: CastingCall; onClose: () => void }> = ({ casting, onClose }) => {
    const [applied, setApplied] = useState(false);
    const [portfolio, setPortfolio] = useState('');
    const [note, setNote] = useState('');
    const status = STATUS_CONFIG[casting.status];
    const StatusIcon = status.icon;
    const deadline = daysUntil(casting.deadline);

    return (
        <AnimatePresence>
            <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
                onClick={onClose}
            >
                <m.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl"
                >
                    {/* Hero */}
                    <div className="relative h-56 overflow-hidden">
                        <img src={casting.coverImage} alt={casting.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />
                        <button onClick={onClose} title="Close" className="absolute top-5 right-5 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-5 left-5 right-5">
                            <div className="flex items-center gap-2 mb-2">
                                <img src={casting.brandLogo} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-white/30" />
                                <div>
                                    <p className="text-white/80 text-[9px] font-black uppercase tracking-widest">{casting.brandName}</p>
                                    {casting.brandVerified && <p className="text-white/50 text-[7px]">✓ Verified</p>}
                                </div>
                            </div>
                            <h2 className="text-2xl font-serif italic font-bold text-white leading-snug">{casting.title}</h2>
                        </div>
                    </div>

                    <div className="p-7 space-y-7">
                        {/* Key info grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: 'Location', value: casting.city, icon: MapPin },
                                { label: 'Shoot Date', value: new Date(casting.shootDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), icon: Calendar },
                                { label: 'Deadline', value: deadline <= 0 ? 'Closed' : `${deadline} days left`, icon: Clock },
                                { label: 'Fee', value: casting.fee ? fmtINR(casting.fee) : casting.compensation, icon: CreditCard },
                            ].map(s => (
                                <div key={s.label} className="bg-gray-50 rounded-2xl p-4">
                                    <div className="flex items-center gap-1.5 mb-1">
                                        <s.icon className="w-3 h-3 text-gray-400" />
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-400">{s.label}</p>
                                    </div>
                                    <p className="text-sm font-bold text-ffn-black">{s.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Status + escrow */}
                        <div className="flex flex-wrap gap-2">
                            <div className={`flex items-center space-x-1.5 border px-3 py-2 rounded-full ${status.bg}`}>
                                <StatusIcon className={`w-3.5 h-3.5 ${status.color}`} />
                                <span className={`text-[8px] uppercase tracking-widest font-black ${status.color}`}>{casting.status}</span>
                            </div>
                            {casting.escrowProtected && (
                                <div className="flex items-center space-x-1.5 bg-teal-50 border border-teal-100 px-3 py-2 rounded-full">
                                    <Shield className="w-3.5 h-3.5 text-teal-600" />
                                    <span className="text-[8px] uppercase tracking-widest font-black text-teal-700">FFN Escrow Protected</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">About This Casting</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{casting.description}</p>
                        </div>

                        {/* Requirements */}
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">Requirements</p>
                            <div className="space-y-2">
                                {casting.requirements.map(r => (
                                    <div key={r} className="flex items-start gap-2.5">
                                        <Check className="w-3.5 h-3.5 text-ffn-primary mt-0.5 shrink-0" />
                                        <p className="text-sm text-gray-600">{r}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Deliverables */}
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">Deliverables</p>
                            <div className="space-y-2">
                                {casting.deliverables.map(d => (
                                    <div key={d} className="flex items-start gap-2.5">
                                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-sm text-gray-600">{d}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Applicant stats */}
                        <div className="bg-gray-50 rounded-3xl p-5">
                            <div className="flex items-center justify-between mb-3">
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Application competition</p>
                                <div className="flex items-center space-x-1 text-gray-500">
                                    <Users className="w-3 h-3" />
                                    <span className="text-[9px] font-bold">{casting.applicantCount} applied</span>
                                </div>
                            </div>
                            <ApplicantBar count={casting.applicantCount} max={casting.maxApplicants} />
                        </div>

                        {/* Application form */}
                        {!applied ? (
                            <div className="space-y-4">
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Quick Apply</p>
                                <div>
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 block" htmlFor="portfolio-url">
                                        Portfolio URL
                                    </label>
                                    <input
                                        id="portfolio-url"
                                        type="url"
                                        value={portfolio}
                                        onChange={e => setPortfolio(e.target.value)}
                                        placeholder="https://your-portfolio.com"
                                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 focus:border-ffn-primary transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-1.5 block" htmlFor="cover-note">
                                        Cover Note <span className="text-gray-300 normal-case">(optional)</span>
                                    </label>
                                    <textarea
                                        id="cover-note"
                                        value={note}
                                        onChange={e => setNote(e.target.value)}
                                        placeholder="Tell the brand why you're the right fit…"
                                        rows={3}
                                        className="w-full border border-gray-200 rounded-2xl px-4 py-3.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 focus:border-ffn-primary transition-all"
                                    />
                                </div>
                                <button
                                    onClick={() => setApplied(true)}
                                    disabled={casting.status === 'Closed' || casting.status === 'Filled'}
                                    className="w-full py-4 bg-ffn-black text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                                >
                                    <Briefcase className="w-4 h-4" />
                                    <span>{casting.status === 'Closed' || casting.status === 'Filled' ? 'Applications Closed' : 'Submit Application'}</span>
                                </button>
                                {casting.escrowProtected && (
                                    <p className="text-[9px] text-center text-gray-400">
                                        <Shield className="w-3 h-3 inline mb-0.5 mr-1" />
                                        Payment held in FFN Escrow — released only after shoot completion
                                    </p>
                                )}
                            </div>
                        ) : (
                            <m.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 text-center"
                            >
                                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-serif italic font-bold text-emerald-800 mb-2">Application Sent!</h3>
                                <p className="text-sm text-emerald-600">
                                    {casting.brandName} will review your application and reach out via FFN messages. You'll get a notification instantly.
                                </p>
                            </m.div>
                        )}
                    </div>
                </m.div>
            </m.div>
        </AnimatePresence>
    );
};

// ─── Main Board ───────────────────────────────────────────────────────────────
export const CastingBoard: React.FC = () => {
    const [selectedCasting, setSelectedCasting] = useState<CastingCall | null>(null);
    const [roleFilter, setRoleFilter] = useState<CastingRole | 'All'>('All');
    const [compFilter, setCompFilter] = useState<CastingCompensation | 'All'>('All');
    const [cityFilter, setCityFilter] = useState('All Cities');
    const [showUrgentOnly, setShowUrgentOnly] = useState(false);
    const [showEscrowOnly, setShowEscrowOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

    const filtered = useMemo(() => {
        return MOCK_CASTING_CALLS
            .filter(c => roleFilter === 'All' || c.roles.includes(roleFilter as CastingRole))
            .filter(c => compFilter === 'All' || c.compensation === compFilter)
            .filter(c => cityFilter === 'All Cities' || c.city === cityFilter)
            .filter(c => !showUrgentOnly || c.isUrgent)
            .filter(c => !showEscrowOnly || c.escrowProtected)
            .filter(c => !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.brandName.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [roleFilter, compFilter, cityFilter, showUrgentOnly, showEscrowOnly, searchQuery]);

    const featured = filtered.filter(c => c.isFeatured);
    const regular = filtered.filter(c => !c.isFeatured);
    const totalPaidValue = MOCK_CASTING_CALLS.filter(c => c.compensation === 'Paid' && c.fee).reduce((s, c) => s + (c.fee || 0), 0);

    const toggleSave = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSavedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    return (
        <div className="min-h-screen bg-[#f9f7f4]">
            {/* Header */}
            <div className="bg-ffn-black text-white px-8 py-14">
                <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-white/40 mb-3 flex items-center space-x-2">
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Open Opportunities</span>
                </p>
                <h1 className="text-5xl md:text-7xl font-serif italic font-bold leading-none mb-5">
                    Casting Board
                </h1>
                <p className="text-white/60 text-lg max-w-xl mb-10">
                    Real paid work. Verified brands. Every booking protected by FFN Escrow. Apply in one click.
                </p>

                {/* Live stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: 'Open Castings', value: MOCK_CASTING_CALLS.filter(c => c.status === 'Open').length.toString() },
                        { label: 'Total Fees Listed', value: `₹${Math.round(totalPaidValue / 1000)}K` },
                        { label: 'Verified Brands', value: MOCK_CASTING_CALLS.filter(c => c.brandVerified).length.toString() },
                        { label: 'Escrow Protected', value: `${MOCK_CASTING_CALLS.filter(c => c.escrowProtected).length} castings` },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                            <p className="text-2xl font-serif font-bold text-white">{s.value}</p>
                            <p className="text-[9px] uppercase tracking-widest font-bold text-white/40 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white border-b border-gray-100 px-8 py-5 space-y-4">
                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        id="casting-search"
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search castings or brands…"
                        aria-label="Search castings"
                        className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 focus:border-ffn-primary transition-all"
                    />
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                    {/* Role pills */}
                    <div className="flex flex-wrap gap-1.5">
                        {ROLES.map(r => (
                            <button key={r} onClick={() => setRoleFilter(r as any)}
                                className={`px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all
                                    ${roleFilter === r ? 'bg-ffn-black text-white shadow' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                {r}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-5 bg-gray-200" />

                    {/* Compensation */}
                    <div className="flex gap-1.5">
                        {COMPS.map(c => (
                            <button key={c} onClick={() => setCompFilter(c as any)}
                                className={`px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all
                                    ${compFilter === c ? 'bg-ffn-black text-white shadow' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="w-px h-5 bg-gray-200" />

                    {/* City */}
                    <select
                        title="Filter by city"
                        value={cityFilter}
                        onChange={e => setCityFilter(e.target.value)}
                        className="text-[9px] uppercase tracking-widest font-black border border-gray-100 rounded-xl px-3 py-2 bg-white text-gray-500 focus:outline-none"
                        aria-label="Filter by city"
                    >
                        {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>

                    {/* Toggles */}
                    {[
                        { label: '⚡ Urgent Only', active: showUrgentOnly, toggle: () => setShowUrgentOnly(p => !p) },
                        { label: '🛡️ Escrow Only', active: showEscrowOnly, toggle: () => setShowEscrowOnly(p => !p) },
                    ].map(t => (
                        <button key={t.label} onClick={t.toggle}
                            className={`px-3 py-1.5 rounded-full border text-[8px] uppercase tracking-widest font-black transition-all
                                ${t.active ? 'bg-ffn-primary text-white border-ffn-primary' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}>
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Board */}
            <div className="px-8 py-10 space-y-10">
                {/* Featured */}
                {featured.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Star className="w-4 h-4 text-ffn-primary" />
                            <h2 className="text-[10px] uppercase tracking-widest font-black text-gray-400">Featured Castings</h2>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featured.map(c => (
                                <div key={c.id} className="relative">
                                    <CastingCard casting={c} onClick={() => setSelectedCasting(c)} />
                                    <button
                                        onClick={e => toggleSave(c.id, e)}
                                        title={savedIds.has(c.id) ? 'Unsave' : 'Save'}
                                        className="absolute top-[196px] right-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-110 transition-transform"
                                    >
                                        <Bookmark className={`w-3.5 h-3.5 ${savedIds.has(c.id) ? 'fill-ffn-primary text-ffn-primary' : 'text-gray-400'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* All */}
                {regular.length > 0 && (
                    <section>
                        <div className="flex items-center gap-3 mb-6">
                            <Briefcase className="w-4 h-4 text-gray-400" />
                            <h2 className="text-[10px] uppercase tracking-widest font-black text-gray-400">All Castings ({regular.length})</h2>
                            <div className="flex-1 h-px bg-gray-100" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {regular.map(c => (
                                <div key={c.id} className="relative">
                                    <CastingCard casting={c} onClick={() => setSelectedCasting(c)} />
                                    <button
                                        onClick={e => toggleSave(c.id, e)}
                                        title={savedIds.has(c.id) ? 'Unsave' : 'Save'}
                                        className="absolute top-[196px] right-10 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center z-10 hover:scale-110 transition-transform"
                                    >
                                        <Bookmark className={`w-3.5 h-3.5 ${savedIds.has(c.id) ? 'fill-ffn-primary text-ffn-primary' : 'text-gray-400'}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {filtered.length === 0 && (
                    <div className="text-center py-24 text-gray-400">
                        <Briefcase className="w-14 h-14 mx-auto mb-4 text-gray-200" />
                        <p className="font-serif italic text-xl">No castings match your filters</p>
                        <p className="text-sm mt-2">Try removing some filters or check back soon</p>
                    </div>
                )}
            </div>

            {/* Application drawer */}
            {selectedCasting && (
                <ApplicationDrawer casting={selectedCasting} onClose={() => setSelectedCasting(null)} />
            )}
        </div>
    );
};
