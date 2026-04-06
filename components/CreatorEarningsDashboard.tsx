import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EarningsStream } from '../types';
import { MOCK_EARNINGS_TRANSACTIONS, MOCK_EARNINGS_MONTHLY } from '../constants';
import { paypalService } from '../services/paypalService';
import { analyticsService } from '../services/analyticsService';
import {
    TrendingUp, TrendingDown, Download, ArrowUpRight,
    Wallet, Star, Camera, Package, Users, Gift,
    Clock, CheckCircle2, AlertCircle, ChevronRight, BarChart2, Filter, Eye
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const STREAM_CONFIG: Record<EarningsStream, { color: string; bg: string; icon: React.FC<any> }> = {
    'Brand Deal': { color: 'text-violet-400', bg: 'bg-violet-500/10', icon: Star },
    'Masterclass': { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Camera },
    'Rental Income': { color: 'text-amber-400', bg: 'bg-amber-500/10', icon: Package },
    'Casting Booking': { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: Users },
    'Referral Bonus': { color: 'text-rose-400', bg: 'bg-rose-500/10', icon: Gift },
    'Subscription Share': { color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: BarChart2 },
};

const STATUS_CONFIG = {
    paid: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
    processing: { label: 'Processing', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', icon: Clock },
    pending: { label: 'Pending', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: AlertCircle },
    COMPLETED: { label: 'Paid', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
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
                            <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: `${pct}%` }}>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: '100%' }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                                    className={`w-full h-full ${isLatest ? 'bg-ffn-primary' : 'bg-white/5'} rounded-2xl flex flex-col-reverse`}
                                />
                            </div>
                            <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-ffn-black text-white text-[9px] font-bold px-3 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10 pointer-events-none shadow-xl border border-white/10">
                                {fmtINR(m.totalEarned)}
                            </div>
                        </div>
                        <span className={`text-[9px] uppercase tracking-widest font-black ${isLatest ? 'text-ffn-primary' : 'text-white/20'}`}>
                            {m.month}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Stream Breakdown Donut ───────────────────────────────────────────────────
const StreamBreakdown: React.FC<{ transactions: any[] }> = ({ transactions }) => {
    const paidOnly = transactions.filter(t => t.status === 'paid' || t.status === 'COMPLETED');
    const totalPaid = paidOnly.reduce((s, t) => s + (t.amount || 0), 0);

    const streams = Object.keys(STREAM_CONFIG) as EarningsStream[];
    const breakdown = streams.map(stream => {
        const sum = paidOnly.filter(t => t.stream === stream || (!t.stream && stream === 'Brand Deal')).reduce((s, t) => s + (t.amount || 0), 0);
        const pct = totalPaid > 0 ? Math.round((sum / totalPaid) * 100) : 0;
        return { stream, sum, pct };
    }).filter(s => s.sum > 0).sort((a, b) => b.sum - a.sum);

    return (
        <div className="space-y-4">
            {breakdown.length > 0 ? breakdown.map(({ stream, sum, pct }) => {
                const cfg = STREAM_CONFIG[stream];
                const Icon = cfg.icon;
                return (
                    <div key={stream} className="flex items-center gap-4">
                        <div className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg} border border-white/5`}>
                            <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 space-y-1.5">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] uppercase tracking-widest font-black text-white/40">{stream}</span>
                                <span className="text-sm font-black text-white">{fmtINR(sum)}</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.9, ease: 'easeOut' }}
                                    className="h-full rounded-full bg-ffn-primary"
                                />

                            </div>
                        </div>
                    </div>
                );
            }) : (
                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest text-center py-8">No real-time revenue detected</p>
            )}
        </div>
    );
};

// ─── Transaction Row ──────────────────────────────────────────────────────────
const TxnRow: React.FC<{ txn: any }> = ({ txn }) => {
    const stream = (txn.stream || 'Brand Deal') as EarningsStream;
    const cfg = STREAM_CONFIG[stream];
    const Icon = cfg.icon;
    const statusKey = (txn.status === 'COMPLETED' ? 'COMPLETED' : txn.status) as keyof typeof STATUS_CONFIG;
    const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.pending;
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start justify-between gap-4 py-6 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] rounded-3xl px-4 -mx-4 transition-all"
        >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${cfg.bg} border border-white/5`}>
                <Icon className={`w-5 h-5 ${cfg.color}`} />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-white truncate uppercase tracking-tight">{txn.description || 'Professional Engagement'}</p>
                <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[9px] uppercase tracking-widest font-black ${cfg.color}`}>{stream}</span>
                    <span className="text-white/10">·</span>
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{new Date(txn.date || txn.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                </div>
            </div>

            <div className="text-right shrink-0">
                <p className={`text-xl font-serif font-bold ${statusKey === 'pending' ? 'text-white/20' : 'text-white'}`}>
                    {statusKey === 'pending' ? '' : '+'}{fmtINR(txn.amount)}
                </p>
                <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full border text-[9px] uppercase tracking-widest font-black mt-2 ${status.color}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    <span>{status.label}</span>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export const CreatorEarningsDashboard: React.FC<{ talentId?: string }> = ({ talentId = 't1' }) => {
    const [streamFilter, setStreamFilter] = useState<EarningsStream | 'All' | 'ALL'>('ALL');
    const [transactions, setTransactions] = useState<any[]>([]);
    const [stats, setStats] = useState({ views: 0 });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [txData, stData] = await Promise.all([
                    paypalService.getTransactions(),
                    analyticsService.getMyStats()
                ]);

                if (txData && txData.success) {
                    // Merge mock for visual richness if real list is empty, but prioritize real
                    setTransactions(txData.data.length > 0 ? txData.data : []);
                }
                if (stData && stData.success) {
                    setStats(stData.data);
                }
            } catch (err) {
                console.error('Dashboard Load Error:', err);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Display list: Prioritize real if available, else show mock for the demo/UI audit
    const listToUse = transactions.length > 0 ? transactions : MOCK_EARNINGS_TRANSACTIONS.filter(t => t.talentId === talentId);
    const filteredTxns = streamFilter === 'ALL' ? listToUse : listToUse.filter(t => t.stream === streamFilter);

    const totalPaid = listToUse.filter(t => t.status === 'paid' || t.status === 'COMPLETED').reduce((s, t) => s + (t.amount || 0), 0);
    const totalPending = listToUse.filter(t => t.status !== 'paid' && t.status !== 'COMPLETED').reduce((s, t) => s + (t.amount || 0), 0);

    const latestMonth = MOCK_EARNINGS_MONTHLY[MOCK_EARNINGS_MONTHLY.length - 1];
    const prevMonth = MOCK_EARNINGS_MONTHLY[MOCK_EARNINGS_MONTHLY.length - 3];
    const momGrowth = prevMonth?.totalEarned > 0
        ? Math.round(((latestMonth.totalEarned - prevMonth.totalEarned) / prevMonth.totalEarned) * 100)
        : 0;

    const STREAMS: (EarningsStream | 'ALL')[] = ['ALL', 'Brand Deal', 'Masterclass', 'Rental Income', 'Casting Booking', 'Referral Bonus'];

    return (
        <div className="space-y-10 p-4 bg-ffn-black min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary mb-3 flex items-center space-x-3">
                        <Wallet className="w-4 h-4" />
                        <span>Identity Revenue Protocol v4.2</span>
                    </p>
                    <h2 className="text-5xl font-serif italic font-bold text-white tracking-tighter">Financial Pulse</h2>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-3xl flex items-center space-x-4">
                        <Eye className="w-4 h-4 text-ffn-primary" />
                        <div className="text-left">
                            <p className="text-[8px] uppercase tracking-widest font-black text-white/30">Profile Views</p>
                            <p className="text-xl font-serif font-bold text-white leading-none">{stats.views.toLocaleString()}</p>
                        </div>
                    </div>
                    <button className="p-4 bg-white text-ffn-black rounded-full hover:bg-ffn-primary hover:text-white transition-all shadow-2xl" title="Download Earnings Report">
                        <Download className="w-5 h-5" />
                    </button>

                </div>
            </div>

            {/* KPI cards - Neo-Noir Style */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        label: 'Gross Settlement',
                        value: fmtINR(totalPaid),
                        sub: 'Locked & Disbursed',
                        trend: `+${momGrowth}% Velocity`,
                        up: momGrowth >= 0,
                        accent: 'border-ffn-primary/50 bg-gradient-to-br from-ffn-primary/20 to-transparent',
                    },
                    {
                        label: 'Pending Resolution',
                        value: fmtINR(totalPending),
                        sub: 'Awaiting Blockchain Clear',
                        trend: `${listToUse.filter(t => t.status !== 'paid' && t.status !== 'COMPLETED').length} Handshakes`,
                        up: true,
                        accent: 'border-white/10 bg-white/[0.03]',
                    },
                    {
                        label: 'Cycle Yield',
                        value: fmtINR(latestMonth.totalEarned),
                        sub: 'Monthly Productivity',
                        trend: 'Optimization: HIGH',
                        up: true,
                        accent: 'border-white/10 bg-white/[0.03]',
                    },
                    {
                        label: 'Protocol Tax',
                        value: '15.0%',
                        sub: 'Infrastructure Fee',
                        trend: 'VIP Tier: ACTIVE',
                        up: true,
                        accent: 'border-white/10 bg-white/[0.03]',
                    },
                ].map((kpi, i) => (
                    <motion.div
                        key={kpi.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-[3rem] p-8 border backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] ${kpi.accent}`}
                    >
                        <p className="text-[10px] uppercase tracking-[0.4em] font-black mb-4 text-white/40">{kpi.label}</p>
                        <p className="text-4xl font-serif font-bold leading-none text-white tracking-tighter">{kpi.value}</p>
                        <p className="text-[11px] mt-3 text-white/20 font-medium uppercase tracking-widest">{kpi.sub}</p>
                        <div className={`flex items-center space-x-2 mt-5 ${kpi.up ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {kpi.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                            <span className="text-[10px] font-black uppercase tracking-widest">{kpi.trend}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Chart row - Advanced Projections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 bg-white/[0.03] rounded-[4rem] border border-white/10 p-10 backdrop-blur-xl">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-white/30">Historical Liquidity</h3>
                            <p className="text-2xl font-serif italic font-bold text-white mt-2">Projection Node</p>
                        </div>
                        <div className="px-5 py-3 bg-ffn-primary/10 border border-ffn-primary/30 rounded-2xl text-ffn-primary">
                            <span className="text-[11px] font-black uppercase tracking-widest">Protocol Sync: LIVE</span>
                        </div>
                    </div>
                    <EarningsBarChart />
                </div>

                <div className="bg-white/[0.03] rounded-[4rem] border border-white/10 p-10 backdrop-blur-xl">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-white/30 mb-2">Category Logic</h3>
                    <p className="text-2xl font-serif italic font-bold text-white mb-10">Allocation</p>
                    <StreamBreakdown transactions={listToUse} />
                </div>
            </div>

            {/* Transaction ledger - Immersive Feed */}
            <div className="bg-white/[0.03] rounded-[4rem] border border-white/10 p-10 backdrop-blur-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8 mb-10">
                    <div>
                        <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-white/30">Ledger Index</h3>
                        <p className="text-2xl font-serif italic font-bold text-white mt-2">{filteredTxns.length} Encrypted Logs</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {STREAMS.map(s => (
                            <button
                                key={s}
                                onClick={() => setStreamFilter(s)}
                                className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border ${streamFilter === s
                                    ? 'bg-white text-ffn-black border-white shadow-[0_10px_30px_rgba(255,255,255,0.2)]'
                                    : 'bg-white/5 text-white/30 border-white/10 hover:border-white/30 hover:text-white'
                                    }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div key={streamFilter as string} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                        {filteredTxns.length > 0 ? (
                            filteredTxns.sort((a, b) => new Date(b.date || b.created_at).getTime() - new Date(a.date || a.created_at).getTime()).map(txn => (
                                <TxnRow key={txn.id} txn={txn} />
                            ))
                        ) : (
                            <div className="text-center py-24 text-white/10">
                                <BarChart2 className="w-16 h-16 mx-auto mb-6 opacity-20" />
                                <p className="italic font-serif text-2xl">No data nodes available</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Premium Payout - Identity Withdrawal */}
            <div className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-ffn-primary blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between bg-white/[0.05] border border-ffn-primary/30 rounded-[4rem] p-12 backdrop-blur-3xl">
                    <div className="text-center md:text-left space-y-3 mb-8 md:mb-0">
                        <p className="text-[10px] uppercase tracking-[0.5em] font-black text-ffn-primary">Withdrawal Terminal</p>
                        <h3 className="text-4xl font-serif italic font-bold text-white tracking-tighter">Liquidize Identity Value</h3>
                        <p className="text-white/40 text-sm max-w-lg font-medium leading-relaxed">
                            Transfer your accumulated mastery rewards to Global Currencies (USD, INR, EUR) via PayPal or Direct SWIFT Protocol.
                        </p>
                    </div>
                    <button className="flex items-center space-x-5 px-12 py-6 bg-ffn-primary text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:scale-105 transition-all shadow-[0_20px_50px_rgba(99,102,241,0.4)] group/btn">
                        <Wallet className="w-5 h-5" />
                        <span>Initialize Payout</span>
                        <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};
