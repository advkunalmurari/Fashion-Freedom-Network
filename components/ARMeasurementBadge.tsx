import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ARBodyMeasurements } from '../types';
import {
    ShieldCheck, Scan, Clock, X, Lock, ChevronDown, ChevronUp,
    AlertTriangle, RefreshCw, Ruler, CheckCircle2, Fingerprint, Info
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function daysUntil(isoDate: string): number {
    return Math.round((new Date(isoDate).getTime() - Date.now()) / 86400000);
}

function formatDate(isoDate: string): string {
    return new Date(isoDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ─── Confidence arc ring (SVG) ────────────────────────────────────────────────
const ConfidenceRing: React.FC<{ confidence: number }> = ({ confidence }) => {
    const r = 22;
    const circ = 2 * Math.PI * r;
    const dash = (confidence / 100) * circ;

    return (
        <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
            <svg width="56" height="56" className="-rotate-90">
                <circle cx="28" cy="28" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <motion.circle
                    cx="28" cy="28" r={r} fill="none"
                    stroke="#10b981" strokeWidth="4"
                    strokeDasharray={`${circ}`}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - dash }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[11px] font-black text-emerald-600 leading-none">{confidence}%</span>
            </div>
        </div>
    );
};

// ─── Measurement Row ──────────────────────────────────────────────────────────
const MeasRow: React.FC<{ label: string; value: string; locked?: boolean }> = ({ label, value, locked = true }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
        <div className="flex items-center space-x-2">
            {locked
                ? <Lock className="w-3 h-3 text-emerald-400 shrink-0" />
                : <Info className="w-3 h-3 text-gray-300 shrink-0" />
            }
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-500">{label}</span>
        </div>
        <span className="font-mono font-bold text-sm text-ffn-black">{value}</span>
    </div>
);

// ─── Main Badge Component ─────────────────────────────────────────────────────
interface ARMeasurementBadgeProps {
    measurements: ARBodyMeasurements;
    /** If true, shows the full expandable panel (used on profile page) */
    expanded?: boolean;
}

export const ARMeasurementBadge: React.FC<ARMeasurementBadgeProps> = ({
    measurements: m,
    expanded = false,
}) => {
    const [showDetail, setShowDetail] = useState(false);
    const daysLeft = daysUntil(m.expiresAt);
    const isExpired = daysLeft < 0;
    const isExpiringSoon = daysLeft >= 0 && daysLeft <= 14;
    const isARVerified = m.verificationMethod === 'AR Scan' && m.arConfidence > 0;

    const statusColor = isExpired
        ? 'border-red-100 bg-red-50'
        : isARVerified
            ? 'border-emerald-100 bg-emerald-50'
            : 'border-amber-100 bg-amber-50';

    const badgeIcon = isExpired
        ? <AlertTriangle className="w-4 h-4 text-red-500" />
        : isARVerified
            ? <ShieldCheck className="w-4 h-4 text-emerald-500" />
            : <AlertTriangle className="w-4 h-4 text-amber-500" />;

    const badgeLabel = isExpired
        ? 'Expired — Re-scan Required'
        : isARVerified
            ? 'AR Verified Measurements'
            : 'Self-Reported (Unverified)';

    const badgeLabelColor = isExpired
        ? 'text-red-600'
        : isARVerified
            ? 'text-emerald-600'
            : 'text-amber-600';

    // ── Compact badge (for profile cards, directory listing) ──────────────────
    if (!expanded) {
        return (
            <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full border ${statusColor}`}>
                {badgeIcon}
                <span className={`text-[9px] uppercase tracking-widest font-black ${badgeLabelColor}`}>{badgeLabel}</span>
                {isARVerified && (
                    <span className="text-[8px] font-bold text-emerald-500 bg-emerald-100 px-1.5 py-0.5 rounded-full">
                        {m.arConfidence}% conf.
                    </span>
                )}
            </div>
        );
    }

    // ── Full expanded card (for profile page) ─────────────────────────────────
    return (
        <div className="space-y-4">
            {/* Header card */}
            <div className={`rounded-[2rem] border p-6 ${statusColor}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        {/* Animated scan icon */}
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 relative overflow-hidden ${isARVerified ? 'bg-emerald-100' : isExpired ? 'bg-red-100' : 'bg-amber-100'}`}>
                            <Scan className={`w-6 h-6 ${isARVerified ? 'text-emerald-600' : isExpired ? 'text-red-500' : 'text-amber-500'}`} />
                            {isARVerified && (
                                <motion.div
                                    animate={{ y: ['-100%', '100%'] }}
                                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-x-0 h-0.5 bg-emerald-400/60 top-0"
                                />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center space-x-2">
                                {badgeIcon}
                                <span className={`text-[10px] uppercase tracking-widest font-black ${badgeLabelColor}`}>
                                    {badgeLabel}
                                </span>
                            </div>
                            {isARVerified ? (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Scanned {formatDate(m.verifiedAt)} · {isExpired ? 'Expired' : `${daysLeft}d remaining`}
                                </p>
                            ) : (
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Submitted {formatDate(m.verifiedAt)} — not AR verified
                                </p>
                            )}
                        </div>
                    </div>
                    {isARVerified && <ConfidenceRing confidence={m.arConfidence} />}
                </div>

                {/* Expiry warning */}
                {isExpired && (
                    <div className="mt-4 flex items-center space-x-2 bg-red-100 text-red-600 rounded-xl px-4 py-2.5">
                        <RefreshCw className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">
                            Measurements expired {Math.abs(daysLeft)} days ago. Brands will not see verified data.
                        </span>
                    </div>
                )}
                {isExpiringSoon && !isExpired && (
                    <div className="mt-4 flex items-center space-x-2 bg-amber-100 text-amber-600 rounded-xl px-4 py-2.5">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[9px] uppercase tracking-widest font-bold">
                            Expires in {daysLeft} days. Re-scan soon to maintain your verified badge.
                        </span>
                    </div>
                )}

                {/* Key stats row */}
                {!isExpired && (
                    <div className="grid grid-cols-4 gap-3 mt-5">
                        {[
                            { label: 'Height', value: `${m.height} cm` },
                            { label: 'Bust', value: `${m.bust} cm` },
                            { label: 'Waist', value: `${m.waist} cm` },
                            { label: 'Hips', value: `${m.hips} cm` },
                        ].map(s => (
                            <div key={s.label} className={`rounded-2xl p-3 text-center ${isARVerified ? 'bg-white/70' : 'bg-white/60'}`}>
                                <div className="flex items-center justify-center mb-1">
                                    <Lock className="w-2.5 h-2.5 text-emerald-400" />
                                </div>
                                <p className="text-base font-black font-mono text-ffn-black">{s.value}</p>
                                <p className="text-[8px] uppercase tracking-widest text-gray-400 font-bold">{s.label}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Expand to see all measurements */}
            {!isExpired && (
                <>
                    <button
                        onClick={() => setShowDetail(!showDetail)}
                        className="w-full flex items-center justify-between px-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center space-x-2">
                            <Ruler className="w-4 h-4 text-gray-400" />
                            <span className="text-[10px] uppercase tracking-widest font-black text-gray-500">
                                Full Measurement Sheet
                            </span>
                        </div>
                        {showDetail ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                    </button>

                    <AnimatePresence>
                        {showDetail && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm space-y-2">
                                    {/* Verification fingerprint strip */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-50">
                                        <div className="flex items-center space-x-2">
                                            <Fingerprint className="w-4 h-4 text-ffn-primary" />
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-400">
                                                Cryptographic Lock — {formatDate(m.verifiedAt)}
                                            </span>
                                        </div>
                                        {isARVerified && (
                                            <div className="flex items-center space-x-1 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span className="text-[8px] uppercase tracking-widest font-black">{m.arConfidence}% Confidence</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Core body */}
                                    <div className="mb-2">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-300 mb-2 px-1">Core Body</p>
                                        <MeasRow label="Height" value={`${m.height} cm`} />
                                        <MeasRow label="Bust / Chest" value={`${m.bust} cm`} />
                                        <MeasRow label="Waist" value={`${m.waist} cm`} />
                                        <MeasRow label="Hips" value={`${m.hips} cm`} />
                                        <MeasRow label="Shoulder Width" value={`${m.shoulder} cm`} />
                                        <MeasRow label="Inseam" value={`${m.inseam} cm`} />
                                        {m.neck && <MeasRow label="Neck" value={`${m.neck} cm`} />}
                                        {m.sleeve && <MeasRow label="Sleeve" value={`${m.sleeve} cm`} />}
                                        {m.thigh && <MeasRow label="Thigh" value={`${m.thigh} cm`} />}
                                    </div>

                                    {/* Fit sizes */}
                                    <div className="pt-4 border-t border-gray-50">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-300 mb-2 px-1">Garment Sizes</p>
                                        <MeasRow label="Top Size" value={m.topSize} />
                                        <MeasRow label="Bottom Size" value={m.bottomSize} />
                                        <MeasRow label="Dress Size" value={m.dressSize} />
                                        <MeasRow label="Shoe Size" value={m.shoeSize} />
                                    </div>

                                    {/* Verification metadata */}
                                    <div className="pt-4 border-t border-gray-50">
                                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-300 mb-2 px-1">Verification Record</p>
                                        <MeasRow label="Method" value={m.verificationMethod} locked={false} />
                                        <MeasRow label="Verified On" value={formatDate(m.verifiedAt)} locked={false} />
                                        <MeasRow label="Valid Until" value={formatDate(m.expiresAt)} locked={false} />
                                        <MeasRow label="Unit" value={m.unit.toUpperCase()} locked={false} />
                                    </div>

                                    {/* Legal lock notice */}
                                    <div className="mt-4 bg-gray-50 rounded-2xl p-4 flex items-start space-x-3">
                                        <Lock className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                        <p className="text-[9px] text-gray-500 leading-relaxed">
                                            These measurements were cryptographically locked at the time of AR scan and cannot be edited by the talent. Any discrepancy on set is covered under the FFN Casting Guarantee.
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            )}

            {/* CTA to re-verify if expired or unverified */}
            {(isExpired || !isARVerified) && (
                <button className="w-full flex items-center justify-center space-x-3 py-4 bg-ffn-black text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all hover:-translate-y-0.5 shadow-xl">
                    <Scan className="w-4 h-4" />
                    <span>{isExpired ? 'Re-scan Measurements via AR' : 'Verify via AR Scan'}</span>
                </button>
            )}
        </div>
    );
};

// ─── Compact inline badge (for talent cards in directory/brand search) ─────────
export const ARMeasurementInlineBadge: React.FC<{ talentId: string; measurements: ARBodyMeasurements[] }> = ({
    talentId,
    measurements,
}) => {
    const m = measurements.find(m => m.talentId === talentId);
    if (!m) return null;

    const isExpired = daysUntil(m.expiresAt) < 0;
    const isARVerified = m.verificationMethod === 'AR Scan' && m.arConfidence > 0 && !isExpired;

    if (!isARVerified) return null;

    return (
        <div className="flex items-center space-x-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span className="text-[8px] uppercase tracking-widest font-black">AR Verified · {m.height}cm · {m.bust}/{m.waist}/{m.hips}</span>
        </div>
    );
};
