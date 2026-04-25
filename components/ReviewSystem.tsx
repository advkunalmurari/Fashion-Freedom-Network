import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Review, RatingSummary } from '../types';
import { MOCK_REVIEWS, MOCK_RATING_SUMMARY } from '../constants';
import {
    Star, ThumbsUp, ShieldCheck, MessageCircle, ChevronDown,
    ChevronUp, Award, TrendingUp, CheckCircle2, Send, X
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(iso: string): string {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (d === 0) return 'Today';
    if (d === 1) return 'Yesterday';
    if (d < 30) return `${d} days ago`;
    if (d < 365) return `${Math.floor(d / 30)} months ago`;
    return `${Math.floor(d / 365)} years ago`;
}

// ─── Star Row ─────────────────────────────────────────────────────────────────
const StarRow: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean; onChange?: (r: number) => void }> = ({
    rating, size = 'md', interactive = false, onChange
}) => {
    const [hover, setHover] = useState(0);
    const sizes = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-6 h-6' };
    const cls = sizes[size];
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => {
                const filled = (hover || rating) >= i;
                return (
                    <Star
                        key={i}
                        className={`${cls} transition-all ${filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'}
                            ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
                        onMouseEnter={() => interactive && setHover(i)}
                        onMouseLeave={() => interactive && setHover(0)}
                        onClick={() => interactive && onChange?.(i)}
                    />
                );
            })}
        </div>
    );
};

// ─── Category Score Bar ───────────────────────────────────────────────────────
const CategoryBar: React.FC<{ label: string; score: number }> = ({ label, score }) => {
    const pct = (score / 5) * 100;
    const color = score >= 4.5 ? 'bg-emerald-400' : score >= 3.5 ? 'bg-violet-400' : 'bg-amber-400';
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <span className="text-[9px] uppercase tracking-widest font-black text-gray-500">{label}</span>
                <span className="text-sm font-black font-mono text-ffn-black">{score.toFixed(1)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <m.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`} />
            </div>
        </div>
    );
};

// ─── Rating Distribution ──────────────────────────────────────────────────────
const RatingDistribution: React.FC<{ summary: RatingSummary }> = ({ summary }) => {
    const maxCount = Math.max(...(Object.values(summary.ratingDistribution) as number[]));
    return (
        <div className="space-y-2">
            {([5, 4, 3, 2, 1] as const).map(star => {
                const count = summary.ratingDistribution[star];
                const pct = maxCount > 0 ? (count / maxCount) * 100 : 0;
                return (
                    <div key={star} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-6 shrink-0">
                            <span className="text-[9px] font-black text-gray-500">{star}</span>
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        </div>
                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <m.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8, delay: (5 - star) * 0.05 }}
                                className="h-full bg-amber-400 rounded-full" />
                        </div>
                        <span className="text-[9px] font-bold text-gray-400 w-4 text-right shrink-0">{count}</span>
                    </div>
                );
            })}
        </div>
    );
};

// ─── Review Card ──────────────────────────────────────────────────────────────
const ReviewCard: React.FC<{ review: Review; onHelpful: (id: string) => void; helpfulClicked: Set<string> }> = ({
    review, onHelpful, helpfulClicked
}) => {
    const [expanded, setExpanded] = useState(false);
    const SHORT_LEN = 200;
    const isLong = review.body.length > SHORT_LEN;

    return (
        <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-7 space-y-5">
            {/* Reviewer header */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0">
                        {review.reviewerAvatarUrl ? (
                            <img src={review.reviewerAvatarUrl} alt={review.reviewerName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-ffn-primary flex items-center justify-center text-white font-bold text-sm">
                                {review.reviewerName[0]}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-sm text-ffn-black">{review.reviewerName}</p>
                        {review.reviewerBrandName && (
                            <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">{review.reviewerBrandName}</p>
                        )}
                        <p className="text-[9px] text-gray-400">{timeAgo(review.date)}</p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                    <StarRow rating={review.rating} size="sm" />
                    {review.isVerifiedBooking && (
                        <div className="flex items-center gap-1 text-teal-600">
                            <ShieldCheck className="w-3 h-3" />
                            <span className="text-[7px] uppercase tracking-widest font-black">Verified Booking</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Campaign tag */}
            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                <Award className="w-3 h-3 text-gray-400" />
                <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">{review.campaignTitle}</span>
            </div>

            {/* Headline + body */}
            <div>
                <h4 className="font-serif italic font-bold text-lg text-ffn-black leading-snug mb-2">"{review.headline}"</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {expanded || !isLong ? review.body : `${review.body.slice(0, SHORT_LEN)}…`}
                </p>
                {isLong && (
                    <button onClick={() => setExpanded(p => !p)}
                        className="flex items-center gap-1 mt-2 text-[9px] uppercase tracking-widest font-black text-ffn-primary hover:opacity-70 transition-opacity">
                        {expanded ? <><ChevronUp className="w-3 h-3" />Show less</> : <><ChevronDown className="w-3 h-3" />Read more</>}
                    </button>
                )}
            </div>

            {/* Category scores */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
                <CategoryBar label="Professionalism" score={review.categories.professionalism} />
                <CategoryBar label="Communication" score={review.categories.communication} />
                <CategoryBar label="Creativity" score={review.categories.creativity} />
                <CategoryBar label="Punctuality" score={review.categories.punctuality} />
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
                {review.tags.map(t => (
                    <span key={t.label} className={`text-[8px] px-2.5 py-1 rounded-full uppercase tracking-widest font-black border
                        ${t.positive ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                        {t.positive ? '✓ ' : '✗ '}{t.label}
                    </span>
                ))}
            </div>

            {/* Brand response */}
            {review.brandResponse && (
                <div className="bg-ffn-primary/5 border border-ffn-primary/10 rounded-2xl p-4">
                    <div className="flex items-center gap-1.5 mb-2">
                        <MessageCircle className="w-3.5 h-3.5 text-ffn-primary" />
                        <span className="text-[8px] uppercase tracking-widest font-black text-ffn-primary">Response from talent</span>
                    </div>
                    <p className="text-sm text-gray-600 italic leading-relaxed">"{review.brandResponse}"</p>
                </div>
            )}

            {/* Helpful */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                <span className="text-[9px] text-gray-400">Was this review helpful?</span>
                <button
                    onClick={() => onHelpful(review.id)}
                    disabled={helpfulClicked.has(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all
                        ${helpfulClicked.has(review.id)
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}
                >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{helpfulClicked.has(review.id) ? 'Helpful ✓' : `Helpful (${review.helpfulCount})`}</span>
                </button>
            </div>
        </m.div>
    );
};

// ─── Leave a Review Modal ─────────────────────────────────────────────────────
const LeaveReviewModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [step, setStep] = useState<'rate' | 'write' | 'done'>('rate');
    const [rating, setRating] = useState(0);
    const [categories, setCategories] = useState({ professionalism: 0, communication: 0, creativity: 0, punctuality: 0 });
    const [headline, setHeadline] = useState('');
    const [body, setBody] = useState('');

    const allCategoriesSet = (Object.values(categories) as number[]).every(v => v > 0);

    const setCat = (key: keyof typeof categories, val: number) =>
        setCategories(prev => ({ ...prev, [key]: val }));

    return (
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4">
            <m.div initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 80, opacity: 0 }}
                className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">
                            {step === 'rate' ? 'Step 1 of 2' : step === 'write' ? 'Step 2 of 2' : 'All done'}
                        </p>
                        <h3 className="text-xl font-serif italic font-bold text-ffn-black mt-0.5">
                            {step === 'rate' ? 'Rate your experience' : step === 'write' ? 'Write your review' : 'Review submitted!'}
                        </h3>
                    </div>
                    <button onClick={onClose} title="Close" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-7 pb-7">
                    {step === 'done' ? (
                        <m.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                            </div>
                            <p className="text-lg font-serif italic font-bold text-ffn-black">Thank you for your review!</p>
                            <p className="text-sm text-gray-500">Your review helps build trust in the FFN community. It'll appear on their profile after verification.</p>
                            <button onClick={onClose} className="mt-4 px-8 py-3 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all">
                                Close
                            </button>
                        </m.div>
                    ) : step === 'rate' ? (
                        <div className="space-y-6">
                            {/* Overall star rating */}
                            <div className="text-center py-4 space-y-3">
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Overall Rating</p>
                                <div className="flex justify-center">
                                    <StarRow rating={rating} size="lg" interactive onChange={setRating} />
                                </div>
                                {rating > 0 && (
                                    <p className="text-sm font-bold text-gray-500">
                                        {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Exceptional'][rating]}
                                    </p>
                                )}
                            </div>

                            {/* Category scores */}
                            <div className="space-y-4">
                                {[
                                    { key: 'professionalism' as const, label: 'Professionalism' },
                                    { key: 'communication' as const, label: 'Communication' },
                                    { key: 'creativity' as const, label: 'Creativity' },
                                    { key: 'punctuality' as const, label: 'Punctuality' },
                                ].map(c => (
                                    <div key={c.key} className="flex items-center justify-between">
                                        <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500 w-32">{c.label}</span>
                                        <StarRow rating={categories[c.key]} size="sm" interactive onChange={v => setCat(c.key, v)} />
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => setStep('write')}
                                disabled={rating === 0 || !allCategoriesSet}
                                className="w-full py-4 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                Next — Write Review →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 block mb-1.5" htmlFor="review-headline">
                                    Headline
                                </label>
                                <input id="review-headline" type="text" value={headline} onChange={e => setHeadline(e.target.value)}
                                    placeholder="Summarise your experience in one line…"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 focus:border-ffn-primary transition-all" />
                            </div>
                            <div>
                                <label className="text-[9px] uppercase tracking-widest font-bold text-gray-500 block mb-1.5" htmlFor="review-body">
                                    Detailed Review
                                </label>
                                <textarea id="review-body" value={body} onChange={e => setBody(e.target.value)}
                                    placeholder="Describe the collaboration in detail — what worked, what to improve…"
                                    rows={5}
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 focus:border-ffn-primary transition-all" />
                                <p className="text-[9px] text-gray-400 mt-1 text-right">{body.length}/500</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('rate')} className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-gray-100 transition-all">
                                    ← Back
                                </button>
                                <button
                                    onClick={() => setStep('done')}
                                    disabled={!headline || body.length < 30}
                                    className="flex-1 flex items-center justify-center space-x-2 py-3 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                    <Send className="w-3.5 h-3.5" />
                                    <span>Submit Review</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </m.div>
        </m.div>
    );
};

// ─── Main Review System ───────────────────────────────────────────────────────
interface ReviewSystemProps {
    talentId?: string;
    canLeaveReview?: boolean;
}

export const ReviewSystem: React.FC<ReviewSystemProps> = ({ talentId = 't1', canLeaveReview = true }) => {
    const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
    const [showModal, setShowModal] = useState(false);

    const reviews = MOCK_REVIEWS.filter(r => r.subjectId === talentId);
    const summary = MOCK_RATING_SUMMARY;

    const sorted = [...reviews].sort((a, b) => {
        if (sortBy === 'recent') return new Date(b.date).getTime() - new Date(a.date).getTime();
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        return b.helpfulCount - a.helpfulCount;
    });

    const onHelpful = (id: string) =>
        setHelpfulClicked(prev => { const next = new Set(prev); next.add(id); return next; });

    return (
        <div className="space-y-8">
            {/* Summary card */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Big average */}
                    <div className="flex flex-col items-center justify-center text-center border-r border-gray-50 pr-8">
                        <p className="text-7xl font-serif font-bold text-ffn-black">{summary.averageRating.toFixed(1)}</p>
                        <StarRow rating={Math.round(summary.averageRating)} size="md" />
                        <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mt-2">{summary.totalReviews} verified reviews</p>

                        {/* Top tags */}
                        <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                            {summary.topPositiveTags.map(t => (
                                <span key={t} className="text-[7px] bg-emerald-50 border border-emerald-100 text-emerald-700 px-2 py-1 rounded-full uppercase tracking-widest font-black">
                                    ✓ {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Distribution */}
                    <div className="flex flex-col justify-center">
                        <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-4">Rating Distribution</p>
                        <RatingDistribution summary={summary} />
                    </div>

                    {/* Category averages */}
                    <div className="flex flex-col justify-center space-y-4 lg:border-l lg:border-gray-50 lg:pl-8">
                        <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Category Averages</p>
                        <CategoryBar label="Professionalism" score={summary.categoryAverages.professionalism} />
                        <CategoryBar label="Communication" score={summary.categoryAverages.communication} />
                        <CategoryBar label="Creativity" score={summary.categoryAverages.creativity} />
                        <CategoryBar label="Punctuality" score={summary.categoryAverages.punctuality} />
                    </div>
                </div>

                {/* Trust badge */}
                <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-50">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <p className="text-[9px] uppercase tracking-widest font-bold text-teal-600">All reviews are verified bookings through FFN Escrow. No fake reviews.</p>
                </div>
            </div>

            {/* Controls row */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key: 'recent', label: 'Most Recent' },
                        { key: 'highest', label: 'Highest' },
                        { key: 'helpful', label: 'Most Helpful' },
                        { key: 'lowest', label: 'Lowest First' },
                    ].map(s => (
                        <button key={s.key} onClick={() => setSortBy(s.key as any)}
                            className={`px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all
                                ${sortBy === s.key ? 'bg-ffn-black text-white shadow' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                            {s.label}
                        </button>
                    ))}
                </div>

                {canLeaveReview && (
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 px-5 py-3 bg-ffn-primary text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:opacity-90 transition-all shadow-xl shadow-ffn-primary/20">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Leave a Review</span>
                    </button>
                )}
            </div>

            {/* Review cards */}
            <div className="space-y-5">
                <AnimatePresence mode="popLayout">
                    {sorted.map(r => (
                        <ReviewCard key={r.id} review={r} onHelpful={onHelpful} helpfulClicked={helpfulClicked} />
                    ))}
                </AnimatePresence>
            </div>

            {/* Leave review modal */}
            <AnimatePresence>
                {showModal && <LeaveReviewModal onClose={() => setShowModal(false)} />}
            </AnimatePresence>
        </div>
    );
};
