import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { TrendSignal, TrendMomentum } from '../types';
import { MOCK_TREND_SIGNALS } from '../constants';
import {
    TrendingUp, TrendingDown, Minus, Zap, X, Tag,
    ChevronRight, ArrowUpRight, ArrowDownRight, BarChart2,
    Flame, Activity, Eye, Bookmark
} from 'lucide-react';

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORIES = ['All', 'Aesthetic', 'Colour', 'Silhouette', 'Fabric', 'Occasion'];

const MOMENTUM_CONFIG: Record<TrendMomentum, {
    label: string; gradient: string; textColor: string;
    badgeBg: string; badgeText: string; icon: React.FC<any>
}> = {
    Exploding: {
        label: 'Exploding 🔥', gradient: 'from-orange-500 to-rose-600',
        textColor: 'text-orange-600', badgeBg: 'bg-orange-50 border-orange-200',
        badgeText: 'text-orange-700', icon: Flame,
    },
    Rising: {
        label: 'Rising ↑', gradient: 'from-violet-500 to-ffn-primary',
        textColor: 'text-violet-600', badgeBg: 'bg-violet-50 border-violet-200',
        badgeText: 'text-violet-700', icon: TrendingUp,
    },
    Stable: {
        label: 'Stable →', gradient: 'from-gray-400 to-gray-600',
        textColor: 'text-gray-500', badgeBg: 'bg-gray-50 border-gray-200',
        badgeText: 'text-gray-600', icon: Minus,
    },
    Declining: {
        label: 'Declining ↓', gradient: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-600', badgeBg: 'bg-amber-50 border-amber-200',
        badgeText: 'text-amber-700', icon: TrendingDown,
    },
    Dead: {
        label: 'Dead ✕', gradient: 'from-slate-400 to-slate-600',
        textColor: 'text-slate-500', badgeBg: 'bg-slate-50 border-slate-200',
        badgeText: 'text-slate-600', icon: X,
    },
};

// ─── Mini Sparkline SVG ───────────────────────────────────────────────────────
const Sparkline: React.FC<{ data: TrendSignal['sparkline']; rising: boolean }> = ({ data, rising }) => {
    const W = 96, H = 32, pad = 2;
    const min = Math.min(...data.map(d => d.score));
    const max = Math.max(...data.map(d => d.score));
    const range = max - min || 1;
    const xs = data.map((_, i) => pad + (i / (data.length - 1)) * (W - 2 * pad));
    const ys = data.map(d => H - pad - ((d.score - min) / range) * (H - 2 * pad));
    const polyPoints = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
    const areaPoints = `${xs[0]},${H} ${polyPoints} ${xs[xs.length - 1]},${H}`;
    const stroke = rising ? '#8b5cf6' : '#f59e0b';
    const fill = rising ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)';

    return (
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
            <polygon points={areaPoints} fill={fill} />
            <polyline points={polyPoints} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            {/* Dot on last point */}
            <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3" fill={stroke} />
        </svg>
    );
};

// ─── Score Gauge (horizontal) ─────────────────────────────────────────────────
const ScoreGauge: React.FC<{ score: number }> = ({ score }) => {
    const color = score >= 80 ? '#8b5cf6' : score >= 60 ? '#06b6d4' : score >= 40 ? '#f59e0b' : '#ef4444';
    return (
        <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${score >= 80 ? 'bg-violet-500' :
                            score >= 60 ? 'bg-cyan-500' :
                                score >= 40 ? 'bg-amber-500' : 'bg-red-500'
                        }`}
                />
            </div>
            <span className={`text-sm font-black font-mono ${score >= 80 ? 'text-violet-500' :
                    score >= 60 ? 'text-cyan-500' :
                        score >= 40 ? 'text-amber-500' : 'text-red-500'
                }`}>{score}</span>
        </div>
    );
};

// ─── Trend Card ───────────────────────────────────────────────────────────────
const TrendCard: React.FC<{ trend: TrendSignal; onClick: () => void }> = ({ trend, onClick }) => {
    const cfg = MOMENTUM_CONFIG[trend.momentum];
    const isRising = trend.momentum === 'Exploding' || trend.momentum === 'Rising';
    const isDown = trend.weeklyChange < 0;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            onClick={onClick}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
        >
            {/* Cover image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={trend.coverImage}
                    alt={trend.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${cfg.gradient} opacity-40`} />
                {/* Momentum badge */}
                <div className={`absolute top-4 left-4 flex items-center space-x-1.5 border rounded-full px-3 py-1.5 backdrop-blur-sm ${cfg.badgeBg}`}>
                    <cfg.icon className={`w-3 h-3 ${cfg.badgeText}`} />
                    <span className={`text-[8px] uppercase tracking-widest font-black ${cfg.badgeText}`}>{trend.momentum}</span>
                </div>
                {/* Category pill */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <span className="text-[8px] uppercase tracking-widest font-black text-gray-600">{trend.category}</span>
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-serif italic font-bold text-ffn-black leading-tight">{trend.name}</h3>
                    <div className={`flex items-center space-x-0.5 shrink-0 ${isDown ? 'text-red-500' : 'text-emerald-500'}`}>
                        {isDown ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        <span className="text-sm font-black">{isDown ? '' : '+'}{trend.weeklyChange}%</span>
                    </div>
                </div>

                {/* Score gauge */}
                <ScoreGauge score={trend.currentScore} />

                {/* Sparkline */}
                <div className="flex items-center justify-between">
                    <Sparkline data={trend.sparkline} rising={isRising} />
                    <div className="text-right">
                        <p className="text-[8px] uppercase tracking-widest font-bold text-gray-400">Volume Index</p>
                        <p className="text-3xl font-serif font-bold text-ffn-black">{trend.currentScore}</p>
                    </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                    {trend.tags.slice(0, 3).map(t => (
                        <span key={t} className="text-[8px] bg-gray-50 border border-gray-100 text-gray-500 px-2 py-1 rounded-full uppercase tracking-widest font-bold">
                            {t}
                        </span>
                    ))}
                    {trend.tags.length > 3 && (
                        <span className="text-[8px] bg-gray-50 text-gray-400 px-2 py-1 rounded-full font-bold">+{trend.tags.length - 3}</span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

// ─── Trend Detail Drawer ──────────────────────────────────────────────────────
const TrendDrawer: React.FC<{ trend: TrendSignal; onClose: () => void }> = ({ trend, onClose }) => {
    const cfg = MOMENTUM_CONFIG[trend.momentum];
    const isRising = trend.momentum === 'Exploding' || trend.momentum === 'Rising';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-end"
                onClick={onClose}
            >
                <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                    onClick={e => e.stopPropagation()}
                    className="w-full max-w-xl bg-white h-full overflow-y-auto shadow-2xl"
                >
                    {/* Hero */}
                    <div className="relative h-72 overflow-hidden">
                        <img src={trend.coverImage} alt={trend.name} className="w-full h-full object-cover" />
                        <div className={`absolute inset-0 bg-gradient-to-t ${cfg.gradient} opacity-60`} />
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-all"
                            title="Close"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-6 left-6 right-6">
                            <div className={`inline-flex items-center space-x-1.5 border rounded-full px-3 py-1.5 mb-3 ${cfg.badgeBg}`}>
                                <cfg.icon className={`w-3 h-3 ${cfg.badgeText}`} />
                                <span className={`text-[8px] uppercase tracking-widest font-black ${cfg.badgeText}`}>{cfg.label}</span>
                            </div>
                            <h2 className="text-3xl font-serif italic font-bold text-white">{trend.name}</h2>
                            <p className="text-white/70 text-sm mt-1">{trend.category}</p>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-8 space-y-8">
                        {/* Volume index + weekly change */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Volume Index', value: String(trend.currentScore), color: 'text-ffn-black' },
                                { label: 'Weekly Δ', value: `${trend.weeklyChange > 0 ? '+' : ''}${trend.weeklyChange}%`, color: trend.weeklyChange >= 0 ? 'text-emerald-600' : 'text-red-500' },
                                { label: 'Category', value: trend.category, color: 'text-ffn-black' },
                            ].map(stat => (
                                <div key={stat.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                                    <p className="text-[8px] uppercase tracking-widest font-black text-gray-400 mb-1">{stat.label}</p>
                                    <p className={`text-2xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Score gauge */}
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">Signal Strength</p>
                            <ScoreGauge score={trend.currentScore} />
                        </div>

                        {/* 6-week sparkline expanded */}
                        <div className="bg-gray-50 rounded-3xl p-6">
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-4">6-Week Volume Trend</p>
                            <div className="flex items-end gap-2 h-24">
                                {trend.sparkline.map((pt, i) => {
                                    const maxS = Math.max(...trend.sparkline.map(s => s.score));
                                    const pct = Math.round((pt.score / maxS) * 100);
                                    const isLast = i === trend.sparkline.length - 1;
                                    return (
                                        <div key={pt.week} className="flex-1 flex flex-col items-center gap-1">
                                            <span className="text-[8px] font-bold text-gray-400">{pt.score}</span>
                                            <div className="w-full h-[72px] flex flex-col justify-end">
                                                <motion.div
                                                    initial={{ height: 0 }}
                                                    animate={{ height: `${pct}%` }}
                                                    transition={{ duration: 0.6, delay: i * 0.08 }}
                                                    className={`w-full rounded-t-xl ${isLast ? 'bg-ffn-primary' : isRising ? 'bg-violet-200' : 'bg-amber-200'}`}
                                                />
                                            </div>
                                            <span className="text-[7px] uppercase tracking-widest font-bold text-gray-400">{pt.week}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Analysis */}
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">FFN Trend Analysis</p>
                            <p className="text-sm text-gray-600 leading-relaxed">{trend.description}</p>
                        </div>

                        {/* Tags */}
                        <div>
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3 flex items-center space-x-2">
                                <Tag className="w-3 h-3" /><span>Associated Tags</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {trend.tags.map(t => (
                                    <span key={t} className="text-[9px] bg-gray-50 border border-gray-100 text-gray-500 px-3 py-1.5 rounded-full uppercase tracking-widest font-bold">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Related brands */}
                        {trend.relatedBrands && (
                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">Brands Capitalising On This</p>
                                <div className="space-y-2">
                                    {trend.relatedBrands.map(b => (
                                        <div key={b} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group">
                                            <span className="text-sm font-bold text-ffn-black">{b}</span>
                                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-ffn-primary transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex gap-3 pt-2">
                            <button className="flex-1 flex items-center justify-center space-x-2 py-4 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all shadow-xl">
                                <Eye className="w-4 h-4" />
                                <span>Find Talent for This Trend</span>
                            </button>
                            <button className="w-14 flex items-center justify-center bg-gray-50 border border-gray-100 rounded-2xl hover:bg-gray-100 transition-all" title="Save trend">
                                <Bookmark className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const TrendForecaster: React.FC = () => {
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [momentumFilter, setMomentumFilter] = useState<TrendMomentum | 'All'>('All');
    const [selectedTrend, setSelectedTrend] = useState<TrendSignal | null>(null);
    const [sort, setSort] = useState<'score' | 'change'>('score');

    const filtered = useMemo(() => {
        return MOCK_TREND_SIGNALS
            .filter(t => categoryFilter === 'All' || t.category === categoryFilter)
            .filter(t => momentumFilter === 'All' || t.momentum === momentumFilter)
            .sort((a, b) => sort === 'score' ? b.currentScore - a.currentScore : b.weeklyChange - a.weeklyChange);
    }, [categoryFilter, momentumFilter, sort]);

    const topExploding = MOCK_TREND_SIGNALS.filter(t => t.momentum === 'Exploding');
    const topRising = MOCK_TREND_SIGNALS.filter(t => t.momentum === 'Rising');

    return (
        <div className="min-h-screen bg-[#f9f7f4]">
            {/* Header */}
            <div className="bg-ffn-black text-white px-8 py-16">
                <p className="text-[9px] uppercase tracking-[0.5em] font-bold text-white/40 mb-3 flex items-center space-x-2">
                    <Activity className="w-3.5 h-3.5" />
                    <span>FFN Intelligence</span>
                </p>
                <h1 className="text-5xl md:text-7xl font-serif italic font-bold leading-none mb-4">
                    Trend Forecaster
                </h1>
                <p className="text-white/60 text-lg max-w-xl">
                    Real-time signal tracking across aesthetics, colours, silhouettes, and occasions. Know what's rising before your competitors do.
                </p>

                {/* Live stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
                    {[
                        { label: 'Signals Tracked', value: `${MOCK_TREND_SIGNALS.length}`, icon: BarChart2 },
                        { label: 'Exploding Now', value: String(topExploding.length), icon: Flame },
                        { label: 'Rising', value: String(topRising.length), icon: TrendingUp },
                        { label: 'Data Updated', value: 'Live', icon: Zap },
                    ].map(s => (
                        <div key={s.label} className="bg-white/5 rounded-2xl p-5 border border-white/10">
                            <s.icon className="w-4 h-4 text-white/40 mb-3" />
                            <p className="text-2xl font-serif font-bold text-white">{s.value}</p>
                            <p className="text-[9px] uppercase tracking-widest font-bold text-white/40 mt-1">{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Filters */}
            <div className="px-8 py-6 bg-white border-b border-gray-100 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                {/* Category pills */}
                <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map(c => (
                        <button
                            key={c}
                            onClick={() => setCategoryFilter(c)}
                            className={`px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-black transition-all ${categoryFilter === c
                                ? 'bg-ffn-black text-white shadow-md'
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                                }`}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Sort + momentum filter */}
                <div className="flex items-center gap-3">
                    {(['Exploding', 'Rising', 'Declining'] as TrendMomentum[]).map(m => {
                        const cfg = MOMENTUM_CONFIG[m];
                        return (
                            <button
                                key={m}
                                onClick={() => setMomentumFilter(prev => prev === m ? 'All' : m)}
                                className={`flex items-center space-x-1.5 px-3 py-2 rounded-full border text-[8px] uppercase tracking-widest font-black transition-all ${momentumFilter === m ? cfg.badgeBg : 'bg-white border-gray-100 text-gray-400'}`}
                            >
                                <cfg.icon className={`w-3 h-3 ${momentumFilter === m ? cfg.badgeText : 'text-gray-400'}`} />
                                <span className={momentumFilter === m ? cfg.badgeText : ''}>{m}</span>
                            </button>
                        );
                    })}
                    <select
                        title="Sort by"
                        value={sort}
                        onChange={e => setSort(e.target.value as 'score' | 'change')}
                        className="text-[9px] uppercase tracking-widest font-black border border-gray-100 rounded-xl px-3 py-2 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-ffn-primary"
                    >
                        <option value="score">Sort: Volume</option>
                        <option value="change">Sort: Weekly Δ</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="px-8 py-10">
                {filtered.length === 0 ? (
                    <div className="text-center py-24 text-gray-400">
                        <Activity className="w-14 h-14 mx-auto mb-4 text-gray-200" />
                        <p className="font-serif italic text-xl">No signals match your filters</p>
                    </div>
                ) : (
                    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtered.map(trend => (
                            <TrendCard key={trend.id} trend={trend} onClick={() => setSelectedTrend(trend)} />
                        ))}
                    </motion.div>
                )}
            </div>

            {/* Drawer */}
            {selectedTrend && (
                <TrendDrawer trend={selectedTrend} onClose={() => setSelectedTrend(null)} />
            )}
        </div>
    );
};
