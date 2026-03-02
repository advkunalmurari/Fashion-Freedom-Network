import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EscrowTransaction, EscrowStatus } from '../types';
import { MOCK_ESCROW_TRANSACTIONS } from '../constants';
import {
    ShieldCheck, Clock, CheckCircle2, AlertTriangle, XCircle, Zap,
    ChevronRight, CreditCard, Building2, User, FileText, ArrowRight,
    RefreshCw, MessageSquare, Star, Send, X, BadgeCheck, Banknote,
    Timer, HelpCircle, TrendingUp, Lock
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function useCountdown(targetIso?: string) {
    const [remaining, setRemaining] = useState('');
    useEffect(() => {
        if (!targetIso) { setRemaining(''); return; }
        const tick = () => {
            const ms = new Date(targetIso).getTime() - Date.now();
            if (ms <= 0) { setRemaining('Released'); return; }
            const h = Math.floor(ms / 3600000);
            const m = Math.floor((ms % 3600000) / 60000);
            const s = Math.floor((ms % 60000) / 1000);
            const d = Math.floor(h / 24);
            if (d > 0) setRemaining(`${d}d ${h % 24}h`);
            else setRemaining(`${h}h ${m}m ${s}s`);
        };
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetIso]);
    return remaining;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<EscrowStatus, { label: string; color: string; bg: string; border: string; icon: React.FC<any> }> = {
    pending_deposit: { label: 'Awaiting Deposit', color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', icon: Clock },
    funded: { label: 'Funds in Escrow', color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', icon: Lock },
    shoot_complete: { label: 'Asset Review', color: 'text-violet-700', bg: 'bg-violet-50', border: 'border-violet-200', icon: FileText },
    release_pending: { label: 'Auto-Release Pending', color: 'text-orange-700', bg: 'bg-orange-50', border: 'border-orange-200', icon: Timer },
    released: { label: 'Payment Released ✓', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', icon: CheckCircle2 },
    disputed: { label: 'Board Mediation', color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200', icon: AlertTriangle },
    refunded: { label: 'Refunded to Brand', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', icon: RefreshCw },
    cancelled: { label: 'Cancelled', color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200', icon: XCircle },
};

// ─── Milestone Step ───────────────────────────────────────────────────────────
const MilestoneStep: React.FC<{ milestone: { id: string; label: string; completedAt?: string; dueAt?: string; status: string }; isLast: boolean }> = ({ milestone, isLast }) => {
    const done = milestone.status === 'done';
    const active = milestone.status === 'active';
    const inProgress = milestone.status === 'in_progress';
    const warning = milestone.status === 'warning' || milestone.status === 'delayed';

    return (
        <div className="flex gap-4">
            <div className="flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-all
                        ${done ? 'bg-emerald-50 border-emerald-400'
                            : active ? 'bg-ffn-primary/10 border-ffn-primary ring-4 ring-ffn-primary/10'
                                : inProgress ? 'bg-blue-50 border-blue-400 animate-pulse'
                                    : warning ? 'bg-amber-50 border-amber-400'
                                        : 'bg-gray-50 border-gray-100'}`}>
                    {done
                        ? <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        : active
                            ? <Zap className="w-5 h-5 text-ffn-primary" />
                            : inProgress
                                ? <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
                                : warning
                                    ? <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    : <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                    }
                </motion.div>
                {!isLast && <div className={`w-0.5 flex-1 mt-1 min-h-[2.5rem] ${done ? 'bg-emerald-200' : 'bg-gray-100'}`} />}
            </div>
            <div className="pb-8 pt-1">
                <div className="flex items-center space-x-2">
                    <p className={`font-black text-[11px] uppercase tracking-widest ${done ? 'text-ffn-black' : active ? 'text-ffn-primary' : 'text-gray-400'}`}>{milestone.label}</p>
                    {inProgress && <span className="text-[7px] px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded-full font-black uppercase">Syncing</span>}
                </div>
                {milestone.completedAt && (
                    <p className="text-[9px] text-gray-400 font-bold mt-1">Finalized on {new Date(milestone.completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                )}
                {!milestone.completedAt && milestone.dueAt && (
                    <p className={`text-[9px] font-bold mt-1 ${warning ? 'text-red-500' : 'text-gray-400'}`}>Expected: {new Date(milestone.dueAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                )}
            </div>
        </div>
    );
};

// ─── Dispute Modal ────────────────────────────────────────────────────────────
const DisputeModal: React.FC<{ onClose: () => void; txn: EscrowTransaction }> = ({ onClose, txn }) => {
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
                className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-7 pt-7 pb-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-black text-red-500">Raise a Dispute</p>
                        <h3 className="text-xl font-serif italic font-bold text-ffn-black mt-0.5">{txn.campaignTitle}</h3>
                    </div>
                    <button onClick={onClose} title="Close" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="px-7 pb-7 space-y-5">
                    {submitted ? (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                                <AlertTriangle className="w-8 h-8 text-red-500" />
                            </div>
                            <p className="text-lg font-serif italic font-bold">Dispute Raised</p>
                            <p className="text-sm text-gray-500">Our mediation team will review your case within 48 hours. Payment is on hold until resolution.</p>
                            <button onClick={onClose} className="px-8 py-3 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black">
                                Understood
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="bg-red-50 border border-red-100 rounded-2xl p-4 space-y-1">
                                <p className="text-[8px] uppercase tracking-widest font-black text-red-700">⚠ Important</p>
                                <p className="text-sm text-red-700">Raising a dispute places payment on hold and triggers an FFN mediation review. Only use this if there is a genuine unresolved issue.</p>
                            </div>
                            <div>
                                <label htmlFor="dispute-reason" className="text-[9px] uppercase tracking-widest font-bold text-gray-500 block mb-1.5">Describe the issue in detail</label>
                                <textarea id="dispute-reason" value={reason} onChange={e => setReason(e.target.value)} rows={5}
                                    placeholder="What went wrong? What was agreed and what was delivered?…"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-300 transition-all" />
                            </div>
                            <button onClick={() => setSubmitted(true)} disabled={reason.length < 30}
                                className="w-full py-4 bg-red-600 text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-red-700 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                Submit Dispute
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Escrow Card ──────────────────────────────────────────────────────────────
const EscrowCard: React.FC<{ txn: EscrowTransaction; onSelect: (id: string) => void; isSelected: boolean }> = ({ txn, onSelect, isSelected }) => {
    const cfg = STATUS_CONFIG[txn.status];
    const Icon = cfg.icon;
    return (
        <motion.button
            onClick={() => onSelect(txn.id)}
            whileHover={{ y: -2 }}
            className={`w-full text-left bg-white rounded-[2rem] border shadow-sm p-6 transition-all
                ${isSelected ? 'border-ffn-primary shadow-md shadow-ffn-primary/10' : 'border-gray-100 hover:shadow-lg'}`}>
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center shrink-0">
                    <img src={txn.brandLogoUrl} alt={txn.brandName} className="w-8 h-8 object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-ffn-black truncate">{txn.campaignTitle}</p>
                    <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mt-0.5">{txn.brandName}</p>
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full border text-[7px] uppercase tracking-widest font-black ${cfg.color} ${cfg.bg} ${cfg.border}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                    </div>
                </div>
                <div className="text-right shrink-0">
                    <p className="font-serif font-bold text-lg text-ffn-black">{fmtINR(txn.talentReceives)}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">net payout</p>
                </div>
            </div>
        </motion.button>
    );
};

// ─── Transaction Detail ───────────────────────────────────────────────────────
const TransactionDetail: React.FC<{ txn: EscrowTransaction }> = ({ txn }) => {
    const cfg = STATUS_CONFIG[txn.status];
    const Icon = cfg.icon;
    const countdown = useCountdown(txn.autoReleaseAt);
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);

    const shootPassed = new Date(txn.shootDate).getTime() < Date.now();

    return (
        <div className="space-y-6">
            {/* Status banner */}
            <div className={`rounded-[2rem] border p-6 ${cfg.bg} ${cfg.border}`}>
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
                            <Icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        <div>
                            <p className={`font-black text-sm ${cfg.color}`}>{cfg.label}</p>
                            <p className="text-[8px] uppercase tracking-widest text-gray-500 font-bold mt-0.5">Booking Ref: {txn.bookingRef}</p>
                        </div>
                    </div>
                    {txn.status === 'release_pending' && countdown && (
                        <div className="bg-white/60 backdrop-blur-sm border border-orange-200 rounded-2xl px-4 py-2 text-center">
                            <p className="text-[7px] uppercase tracking-widest font-black text-orange-600">Auto-release in</p>
                            <p className="font-mono font-bold text-orange-700 text-lg">{countdown}</p>
                        </div>
                    )}
                </div>

                {txn.status === 'disputed' && txn.disputeReason && (
                    <div className="mt-4 bg-white/60 rounded-xl p-4 border border-red-200">
                        <p className="text-[8px] uppercase tracking-widest font-black text-red-600 mb-1">Dispute Reason</p>
                        <p className="text-sm text-gray-700">{txn.disputeReason}</p>
                    </div>
                )}
            </div>

            {/* Payment breakdown */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 space-y-4">
                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Payment Breakdown</p>
                <div className="space-y-3">
                    {[
                        { label: 'Gross Campaign Fee', value: fmtINR(txn.amount), sub: '' },
                        { label: 'FFN Platform Fee (10%)', value: `−${fmtINR(txn.ffnFee)}`, sub: 'Covers escrow, dispute protection, verification', muted: true },
                    ].map(r => (
                        <div key={r.label} className="flex items-start justify-between gap-4">
                            <div>
                                <p className={`text-sm font-bold ${r.muted ? 'text-gray-400' : 'text-ffn-black'}`}>{r.label}</p>
                                {r.sub && <p className="text-[8px] text-gray-400 mt-0.5">{r.sub}</p>}
                            </div>
                            <p className={`font-bold shrink-0 ${r.muted ? 'text-gray-400' : 'text-ffn-black'}`}>{r.value}</p>
                        </div>
                    ))}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-base font-black text-ffn-black">You Receive</p>
                            <p className="text-[8px] text-gray-400 mt-0.5">via {txn.paymentMethod}</p>
                        </div>
                        <p className="text-2xl font-serif font-bold text-ffn-black">{fmtINR(txn.talentReceives)}</p>
                    </div>
                </div>

                {txn.status === 'released' && txn.releasedAt && (
                    <div className="flex items-center gap-2 pt-3 border-t border-emerald-100">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <p className="text-[9px] uppercase tracking-widest font-black text-emerald-600">
                            Released on {new Date(txn.releasedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                )}
            </div>

            {/* Parties */}
            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: 'Brand', name: txn.brandName, img: txn.brandLogoUrl, isAvatar: false },
                    { label: 'Talent', name: txn.talentName, img: txn.talentAvatarUrl, isAvatar: true },
                ].map(p => (
                    <div key={p.label} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 flex items-center gap-4">
                        <div className={`w-12 h-12 shrink-0 bg-gray-50 flex items-center justify-center overflow-hidden ${p.isAvatar ? 'rounded-full' : 'rounded-xl'}`}>
                            <img src={p.img} alt={p.name} className={`${p.isAvatar ? 'w-full h-full object-cover' : 'w-8 h-8 object-contain'}`} />
                        </div>
                        <div>
                            <p className="text-[8px] uppercase tracking-widest font-black text-gray-400">{p.label}</p>
                            <p className="text-sm font-bold text-ffn-black">{p.name}</p>
                            {txn.contractSigned && (
                                <div className="flex items-center gap-1 mt-0.5">
                                    <BadgeCheck className="w-3 h-3 text-teal-500" />
                                    <span className="text-[7px] uppercase tracking-widest font-black text-teal-600">Contract Signed</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Milestone timeline */}
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6">
                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-6">Payment Timeline</p>
                {txn.milestones.map((m, i) => (
                    <MilestoneStep key={m.id} milestone={m} isLast={i === txn.milestones.length - 1} />
                ))}
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
                {txn.status === 'funded' && shootPassed && !deliveryConfirmed && (
                    <button onClick={() => setDeliveryConfirmed(true)}
                        className="w-full flex items-center justify-center gap-2 py-4 bg-emerald-600 text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20">
                        <CheckCircle2 className="w-4 h-4" />Confirm Shoot Delivery
                    </button>
                )}
                {deliveryConfirmed && (
                    <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-6 py-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        <p className="text-sm font-bold text-emerald-700">Delivery confirmed! 72h review window started.</p>
                    </div>
                )}
                {txn.status === 'release_pending' && (
                    <button className="w-full flex items-center justify-center gap-2 py-4 bg-ffn-primary text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:opacity-90 transition-all shadow-xl shadow-ffn-primary/20">
                        <Zap className="w-4 h-4" />Request Early Release
                    </button>
                )}
                {txn.status === 'pending_deposit' && (
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                        <p className="text-sm text-amber-700">Waiting for <strong>{txn.brandName}</strong> to fund the escrow. You'll receive a notification once the funds are secured.</p>
                    </div>
                )}
                {['funded', 'shoot_complete', 'release_pending'].includes(txn.status) && (
                    <button onClick={() => setShowDisputeModal(true)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-white text-red-600 border border-red-200 rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-red-50 transition-all">
                        <AlertTriangle className="w-3.5 h-3.5" />Raise a Dispute
                    </button>
                )}
                {txn.status === 'released' && (
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-white text-gray-600 border border-gray-200 rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-gray-50 transition-all">
                        <Star className="w-3.5 h-3.5" />Leave a Review for {txn.brandName}
                    </button>
                )}
            </div>

            {/* Shield info */}
            <div className="bg-ffn-black text-white rounded-[2rem] p-6 flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
                <div>
                    <p className="font-black text-sm text-white">FFN Escrow Protection</p>
                    <p className="text-[10px] text-white/60 leading-relaxed mt-1">Your payment is held securely and only released when you confirm delivery. In the event of a dispute, FFN mediates and holds funds until resolution. You are always protected.</p>
                </div>
            </div>

            <AnimatePresence>
                {showDisputeModal && <DisputeModal txn={txn} onClose={() => setShowDisputeModal(false)} />}
            </AnimatePresence>
        </div>
    );
};

// ─── FILTER TABS ──────────────────────────────────────────────────────────────
const FILTERS: { key: string; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'disputed', label: 'Disputed' },
];

function matchesFilter(txn: EscrowTransaction, f: string) {
    if (f === 'all') return true;
    if (f === 'active') return ['funded', 'shoot_complete', 'release_pending'].includes(txn.status);
    if (f === 'pending') return txn.status === 'pending_deposit';
    if (f === 'completed') return ['released', 'refunded', 'cancelled'].includes(txn.status);
    if (f === 'disputed') return txn.status === 'disputed';
    return true;
}

// ─── Main Escrow Tracker ──────────────────────────────────────────────────────
export const EscrowTracker: React.FC = () => {
    const [filter, setFilter] = useState('all');
    const [selectedId, setSelectedId] = useState<string>(MOCK_ESCROW_TRANSACTIONS[0].id);

    const transactions = MOCK_ESCROW_TRANSACTIONS;
    const filtered = transactions.filter(t => matchesFilter(t, filter));
    const selected = transactions.find(t => t.id === selectedId) || filtered[0];

    const totalProtected = transactions.filter(t => ['funded', 'shoot_complete', 'release_pending'].includes(t.status)).reduce((s, t) => s + t.amount, 0);
    const totalEarned = transactions.filter(t => t.status === 'released').reduce((s, t) => s + t.talentReceives, 0);
    const activeCount = transactions.filter(t => ['funded', 'shoot_complete', 'release_pending', 'pending_deposit'].includes(t.status)).length;
    const disputeCount = transactions.filter(t => t.status === 'disputed').length;

    return (
        <div className="space-y-10 pb-20 animate-in fade-in duration-500">
            {/* Header */}
            <header className="space-y-6">
                <div className="flex items-center gap-3 text-ffn-primary">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.5em]">FFN Escrow</span>
                </div>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <h1 className="text-6xl md:text-8xl font-serif italic tracking-tighter text-ffn-black leading-none">Payment<br />Tracker</h1>
                    <p className="text-sm text-gray-500 max-w-xs">Every booking. Every payment. Protected and tracked in real time.</p>
                </div>
            </header>

            {/* KPI row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'In Escrow Now', value: fmtINR(totalProtected), icon: Lock, color: 'text-blue-600', sub: `${activeCount} active bookings` },
                    { label: 'Total Earned', value: fmtINR(totalEarned), icon: Banknote, color: 'text-emerald-600', sub: 'All time via FFN' },
                    { label: 'Open Disputes', value: String(disputeCount), icon: AlertTriangle, color: 'text-red-600', sub: 'Mediation in progress' },
                    { label: 'FFN Protection', value: '100%', icon: ShieldCheck, color: 'text-teal-600', sub: 'Every booking covered' },
                ].map(k => (
                    <div key={k.label} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 space-y-2">
                        <k.icon className={`w-5 h-5 ${k.color}`} />
                        <p className="text-2xl font-serif font-bold text-ffn-black">{k.value}</p>
                        <p className="text-[8px] uppercase tracking-widest font-bold text-gray-400">{k.label}</p>
                        <p className="text-[8px] text-gray-400">{k.sub}</p>
                    </div>
                ))}
            </div>

            {/* Main 2-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[380px,1fr] gap-8 items-start">
                {/* Left: list */}
                <div className="space-y-4">
                    {/* Filter tabs */}
                    <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl overflow-x-auto">
                        {FILTERS.map(f => (
                            <button key={f.key} onClick={() => setFilter(f.key)}
                                className={`flex-1 py-2 px-3 rounded-xl text-[8px] uppercase tracking-widest font-black whitespace-nowrap transition-all
                                    ${filter === f.key ? 'bg-white text-ffn-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                {f.label}
                                {f.key === 'disputed' && disputeCount > 0 && (
                                    <span className="ml-1 bg-red-500 text-white text-[6px] px-1.5 py-0.5 rounded-full">{disputeCount}</span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Transaction list */}
                    <div className="space-y-3">
                        <AnimatePresence mode="popLayout">
                            {filtered.map(txn => (
                                <motion.div key={txn.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
                                    <EscrowCard txn={txn} onSelect={setSelectedId} isSelected={selectedId === txn.id} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                        {filtered.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                                <ShieldCheck className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                                <p className="font-serif italic">No transactions here</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: detail */}
                {selected && (
                    <div className="sticky top-6">
                        <AnimatePresence mode="wait">
                            <motion.div key={selected.id}
                                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                                <TransactionDetail txn={selected} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};
