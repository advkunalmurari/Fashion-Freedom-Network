import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EarningsStream } from '../types';
import { MOCK_EARNINGS_TRANSACTIONS, MOCK_EARNINGS_MONTHLY } from '../constants';
import {
    TrendingUp, TrendingDown, Download, ArrowUpRight,
    Wallet, Star, Camera, Package, Users, Gift,
    Clock, CheckCircle2, AlertCircle, ChevronRight, BarChart2, Filter
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const STREAM_CONFIG: Record<EarningsStream, { color: string; bg: string; icon: React.FC<any> }> = {
    'Brand Deal': { color: 'text-violet-600', bg: 'bg-violet-50', icon: Star },
    'Masterclass': { color: 'text-blue-600', bg: 'bg-blue-50', icon: Camera },
    'Rental Income': { color: 'text-amber-600', bg: 'bg-amber-50', icon: Package },
    'Casting Booking': { color: 'text-emerald-600', bg: 'bg-emerald-50', icon: Users },
    'Referral Bonus': { color: 'text-rose-600', bg: 'bg-rose-50', icon: Gift },
    'Subscription Share': { color: 'text-cyan-600', bg: 'bg-cyan-50', icon: BarChart2 },
};

const STATUS_CONFIG = {
    paid: { label: 'Paid', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'text-blue-600 bg-blue-50 border-blue-100', icon: Clock },
    pending: { label: 'Pending', color: 'text-amber-600 bg-amber-50 border-amber-100', icon: AlertCircle },
};

// ─── Bar Chart ────────────────────────────────────────────────────────────────
const EarningsBarChart: React.FC = () => {
    const validMonths = MOCK_EARNINGS_MONTHLY.filter(m => m.totalEarned > 1);
    const maxVal = Math.max(...validMonths.map(m => m.totalEarned));

    return (
        <div className="flex items-end justify-between gap-3 h-40 px-2">
            {validMonths.map((m, i) => {
                const pct = Math.round((m.totalEarned / maxVal) * 100);
                const isLatest = i === validMonths.length - 1;
                return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div className="relative w-full h-32 flex flex-col justify-end">
                            {/* Stacked bar segments */}
                            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: `${pct}%` }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                    className={`w-full h-full ${isLatest ? 'bg-ffn-primary' : 'bg-ffn-black/10'} rounded-2xl flex flex-col-reverse`}
                                />
                            </div>
                            {/* Tooltip on hover */}
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-ffn-black text-white text-[9px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 pointer-events-none shadow-xl">
                                {fmtINR(m.totalEarned)}
                            </div>
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-bold ${isLatest ? 'text-ffn-primary' : 'text-gray-400'}`}>
                            {m.month}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Stream Breakdown Donut ───────────────────────────────────────────────────
const StreamBreakdown: React.FC<{ transactions: typeof MOCK_EARNINGS_TRANSACTIONS }> = ({ transactions }) => {
    const paidOnly = transactions.filter(t => t.status === 'paid');
    const totalPaid = paidOnly.reduce((s, t) => s + t.amount, 0);

    const streams = Object.keys(STREAM_CONFIG) as EarningsStream[];
    const breakdown = streams.map(stream => {
        const sum = paidOnly.filter(t => t.stream === stream).reduce((s, t) => s + t.amount, 0);
        const pct = totalPaid > 0 ? Math.round((sum / totalPaid) * 100) : 0;
        return { stream, sum, pct };
    }).filter(s => s.sum > 0).sort((a, b) => b.sum - a.sum);

    return (
        <div className="space-y-3">
            {breakdown.map(({ stream, sum, pct }) => {
                const cfg = STREAM_CONFIG[stream];
                const Icon = cfg.icon;
                return (
                    <div key={stream} className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-bold text-gray-600">{stream}</span>
                                <span className="text-sm font-bold font-mono text-ffn-black">{fmtINR(sum)}</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.9, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-ffn-primary"
                                    style={{ opacity: pct / 100 + 0.3 }}
                                />
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 w-8 text-right shrink-0">{pct}%</span>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Transaction Row ──────────────────────────────────────────────────────────
const TxnRow: React.FC<{ txn: typeof MOCK_EARNINGS_TRANSACTIONS[0] }> = ({ txn }) => {
    const cfg = STREAM_CONFIG[txn.stream];
    const Icon = cfg.icon;
    const status = STATUS_CONFIG[txn.status];
    const StatusIcon = status.icon;
    const commission = txn.grossAmount - txn.amount;
    const commissionPct = Math.round((commission / txn.grossAmount) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start justify-between gap-4 py-5 border-b border-gray-50 last:border-0 group hover:bg-gray-50/50 rounded-2xl px-3 -mx-3 transition-colors"
        >
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg}`}>
                <Icon className={`w-5 h-5 ${cfg.color}`} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-ffn-black truncate">{txn.description}</p>
                <div className="flex items-center gap-3 mt-1">
                    <span className={`text-[8px] uppercase tracking-widest font-black ${cfg.color}`}>{txn.stream}</span>
                    {txn.brandOrClient && (
                        <>
                            <span className="text-gray-300">·</span>
                            <span className="text-[9px] text-gray-400">{txn.brandOrClient}</span>
                        </>
                    )}
                    <span className="text-gray-300">·</span>
                    <span className="text-[9px] text-gray-400">{new Date(txn.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
                {txn.status === 'paid' && commission > 0 && (
                    <p className="text-[8px] text-gray-400 mt-1">Gross {fmtINR(txn.grossAmount)} — {commissionPct}% FFN commission</p>
                )}
            </div>

            <div className="text-right shrink-0">
                <p className={`text-lg font-serif font-bold ${txn.status === 'pending' ? 'text-gray-400' : 'text-ffn-black'}`}>
                    {txn.status === 'pending' ? '' : '+'}{fmtINR(txn.amount)}
                </p>
                <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full border text-[8px] uppercase tracking-widest font-black mt-1 ${status.color}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    <span>{status.label}</span>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const CreatorEarningsDashboard: React.FC<{ talentId?: string }> = ({ talentId = 't1' }) => {
    const [streamFilter, setStreamFilter] = useState<EarningsStream | 'All'>('All');

    const txns = MOCK_EARNINGS_TRANSACTIONS.filter(t => t.talentId === talentId);
    const filteredTxns = streamFilter === 'All' ? txns : txns.filter(t => t.stream === streamFilter);

    const totalPaid = txns.filter(t => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
    const totalPending = txns.filter(t => t.status !== 'paid').reduce((s, t) => s + t.amount, 0);
    const latestMonth = MOCK_EARNINGS_MONTHLY[MOCK_EARNINGS_MONTHLY.length - 1];
    const prevMonth = MOCK_EARNINGS_MONTHLY[MOCK_EARNINGS_MONTHLY.length - 3];
    const momGrowth = prevMonth?.totalEarned > 0
        ? Math.round(((latestMonth.totalEarned - prevMonth.totalEarned) / prevMonth.totalEarned) * 100)
        : 0;

    const STREAMS: (EarningsStream | 'All')[] = ['All', 'Brand Deal', 'Masterclass', 'Rental Income', 'Casting Booking', 'Referral Bonus'];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ffn-primary mb-2 flex items-center space-x-2">
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Creator Earnings</span>
                    </p>
                    <h2 className="text-4xl font-serif italic font-bold text-ffn-black">Revenue Dashboard</h2>
                </div>
                <button className="flex items-center space-x-2 px-5 py-3 bg-white border border-gray-200 rounded-2xl text-[9px] uppercase tracking-widest font-black text-gray-500 hover:bg-gray-50 transition-all shadow-sm">
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                </button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    {
                        label: 'Total Earned (Paid)',
                        value: fmtINR(totalPaid),
                        sub: 'All time after commission',
                        trend: `+${momGrowth}% MoM`,
                        up: momGrowth >= 0,
                        color: 'bg-ffn-black text-white',
                    },
                    {
                        label: 'Pending Payout',
                        value: fmtINR(totalPending),
                        sub: 'Processing + upcoming',
                        trend: `${txns.filter(t => t.status !== 'paid').length} transactions`,
                        up: true,
                        color: 'bg-white border border-gray-100',
                    },
                    {
                        label: 'This Month',
                        value: fmtINR(latestMonth.totalEarned),
                        sub: latestMonth.month + ' earnings',
                        trend: `${momGrowth >= 0 ? '+' : ''}${momGrowth}% vs Jan`,
                        up: momGrowth >= 0,
                        color: 'bg-white border border-gray-100',
                    },
                    {
                        label: 'Platform Commission',
                        value: '15%',
                        sub: 'FFN standard rate',
                        trend: 'Lowered at ₹5L/yr',
                        up: true,
                        color: 'bg-white border border-gray-100',
                    },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-[2.5rem] p-7 shadow-sm ${kpi.color}`}
                    >
                        <p className={`text-[9px] uppercase tracking-widest font-black mb-3 ${i === 0 ? 'text-white/60' : 'text-gray-400'}`}>{kpi.label}</p>
                        <p className={`text-3xl font-serif font-bold leading-none ${i === 0 ? 'text-white' : 'text-ffn-black'}`}>{kpi.value}</p>
                        <p className={`text-[10px] mt-2 ${i === 0 ? 'text-white/50' : 'text-gray-400'}`}>{kpi.sub}</p>
                        <div className={`flex items-center space-x-1 mt-3 ${kpi.up ? 'text-emerald-400' : 'text-red-400'}`}>
                            {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                            <span className="text-[9px] font-bold">{kpi.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Chart + Breakdown row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Bar chart */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400">Monthly Revenue</h3>
                            <p className="text-xl font-serif italic font-bold text-ffn-black mt-1">6-Month Overview</p>
                        </div>
                        <div className="flex items-center space-x-1.5 text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                            <ArrowUpRight className="w-4 h-4" />
                            <span className="text-[10px] font-black">+{momGrowth}% growth</span>
                        </div>
                    </div>
                    <EarningsBarChart />
                </div>

                {/* Stream breakdown */}
                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                    <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-2">Revenue Streams</h3>
                    <p className="text-xl font-serif italic font-bold text-ffn-black mb-7">Breakdown</p>
                    <StreamBreakdown transactions={txns} />
                </div>
            </div>

            {/* Transaction ledger */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400">Transaction Ledger</h3>
                        <p className="text-xl font-serif italic font-bold text-ffn-black mt-1">{filteredTxns.length} entries</p>
                    </div>
                    {/* Stream filter pills */}
                    <div className="flex flex-wrap gap-2">
                        {STREAMS.map(s => {
                            const cfg = s !== 'All' ? STREAM_CONFIG[s] : null;
                            return (
                                <button
                                    key={s}
                                    onClick={() => setStreamFilter(s)}
                                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-full text-[8px] uppercase tracking-widest font-black transition-all ${streamFilter === s
                                        ? 'bg-ffn-black text-white shadow-md'
                                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {cfg && (() => { const Icon = cfg.icon; return <Icon className="w-3 h-3" />; })()}
                                    <span>{s}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={streamFilter} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        {filteredTxns.length > 0 ? (
                            filteredTxns.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(txn => (
                                <TxnRow key={txn.id} txn={txn} />
                            ))
                        ) : (
                            <div className="text-center py-16 text-gray-400">
                                <BarChart2 className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                                <p className="italic font-serif text-lg">No transactions in this stream</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Payout settings nudge */}
            <div className="flex items-center justify-between bg-gradient-to-r from-ffn-black to-gray-800 text-white rounded-[2.5rem] p-8 shadow-2xl">
                <div>
                    <p className="text-[9px] uppercase tracking-widest font-bold text-white/50 mb-2">Payout Settings</p>
                    <h3 className="text-2xl font-serif italic font-bold">Ready to withdraw?</h3>
                    <p className="text-white/60 text-sm mt-2">
                        {fmtINR(totalPaid)} is available. UPI, NEFT, or PayPal transfer — typically within 3 business days.
                    </p>
                </div>
                <button className="flex items-center space-x-3 px-8 py-4 bg-ffn-primary text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:opacity-90 transition-all shadow-xl shrink-0">
                    <Wallet className="w-4 h-4" />
                    <span>Withdraw Funds</span>
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
