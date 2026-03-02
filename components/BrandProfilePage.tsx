import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { BrandProfile, BrandReview } from '../types';
import { MOCK_BRAND_PROFILES, MOCK_BRAND_REVIEWS } from '../constants';
import {
    Star, ShieldCheck, CheckCircle2, ArrowLeft, Globe, Instagram, Linkedin,
    ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, Send, X, Award,
    Zap, CreditCard, MessageCircle, Users, TrendingUp, Briefcase,
    MapPin, Building2, BadgeCheck, Clock
} from 'lucide-react';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) =>
    n >= 10000000
        ? `₹${(n / 10000000).toFixed(1)}Cr`
        : n >= 100000
            ? `₹${(n / 100000).toFixed(0)}L`
            : `₹${n.toLocaleString('en-IN')}`;

function timeAgo(iso: string): string {
    const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
    if (d === 0) return 'Today';
    if (d < 30) return `${d}d ago`;
    if (d < 365) return `${Math.floor(d / 30)}mo ago`;
    return `${Math.floor(d / 365)}y ago`;
}

// ─── Star row ─────────────────────────────────────────────────────────────────
const StarRow: React.FC<{ rating: number; size?: 'sm' | 'md' | 'lg'; interactive?: boolean; onChange?: (r: number) => void }> = ({
    rating, size = 'md', interactive = false, onChange
}) => {
    const [hover, setHover] = useState(0);
    const cls = { sm: 'w-3 h-3', md: 'w-4 h-4', lg: 'w-6 h-6' }[size];
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => {
                const filled = (hover || rating) >= i;
                return <Star key={i}
                    className={`${cls} transition-all ${filled ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} ${interactive ? 'cursor-pointer hover:scale-110' : ''}`}
                    onMouseEnter={() => interactive && setHover(i)}
                    onMouseLeave={() => interactive && setHover(0)}
                    onClick={() => interactive && onChange?.(i)} />;
            })}
        </div>
    );
};

// ─── Score bar ────────────────────────────────────────────────────────────────
const ScoreBar: React.FC<{ label: string; score: number; icon: React.FC<any> }> = ({ label, score, icon: Icon }) => {
    const pct = (score / 5) * 100;
    const color = score >= 4.5 ? 'bg-emerald-400' : score >= 3.5 ? 'bg-violet-400' : 'bg-amber-400';
    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <Icon className="w-3 h-3 text-gray-400" />
                    <span className="text-[9px] uppercase tracking-widest font-black text-gray-500">{label}</span>
                </div>
                <span className="text-sm font-black font-mono text-ffn-black">{score.toFixed(1)}</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`h-full rounded-full ${color}`} />
            </div>
        </div>
    );
};

// ─── Brand Review Card ────────────────────────────────────────────────────────
const BrandReviewCard: React.FC<{
    review: BrandReview;
    onHelpful: (id: string) => void;
    helpfulSet: Set<string>;
}> = ({ review, onHelpful, helpfulSet }) => {
    const [expanded, setExpanded] = useState(false);
    const isLong = review.body.length > 220;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-7 space-y-5">
            {/* Header */}
            <div className="flex items-start gap-4 justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0">
                        {review.reviewerAvatarUrl
                            ? <img src={review.reviewerAvatarUrl} alt={review.reviewerName} className="w-full h-full object-cover" />
                            : <div className="w-full h-full bg-ffn-primary flex items-center justify-center text-white text-sm font-bold">{review.reviewerName[0]}</div>
                        }
                    </div>
                    <div>
                        <p className="text-sm font-bold text-ffn-black">{review.reviewerName}</p>
                        <p className="text-[8px] uppercase tracking-widest font-black text-gray-400">{review.reviewerRole}</p>
                        <p className="text-[9px] text-gray-400 mt-0.5">{timeAgo(review.date)}</p>
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

            {/* Campaign */}
            <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                <Award className="w-3 h-3 text-gray-400" />
                <span className="text-[8px] uppercase tracking-widest font-bold text-gray-500">{review.campaignTitle}</span>
            </div>

            {/* Review text */}
            <div>
                <h4 className="font-serif italic font-bold text-lg text-ffn-black leading-snug mb-2">"{review.headline}"</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                    {(expanded || !isLong) ? review.body : `${review.body.slice(0, 220)}…`}
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
                <ScoreBar label="Payment Speed" score={review.categories.paymentSpeed} icon={CreditCard} />
                <ScoreBar label="Communication" score={review.categories.communication} icon={MessageCircle} />
                <ScoreBar label="Set Environment" score={review.categories.setEnvironment} icon={Users} />
                <ScoreBar label="Brief Clarity" score={review.categories.briefClarity} icon={Briefcase} />
            </div>

            {/* Would work again */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[8px] uppercase tracking-widest font-black
                ${review.categories.wouldWorkAgain ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-600'}`}>
                {review.categories.wouldWorkAgain
                    ? <><ThumbsUp className="w-3 h-3" />Would work again</>
                    : <><ThumbsDown className="w-3 h-3" />Would not work again</>
                }
            </div>

            {/* Helpful */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className="text-[9px] text-gray-400">Was this review helpful?</span>
                <button onClick={() => onHelpful(review.id)}
                    disabled={helpfulSet.has(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all
                        ${helpfulSet.has(review.id) ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-transparent'}`}>
                    <ThumbsUp className="w-3 h-3" />
                    {helpfulSet.has(review.id) ? 'Helpful ✓' : `Helpful (${review.helpfulCount})`}
                </button>
            </div>
        </motion.div>
    );
};

// ─── Leave Brand Review Modal ─────────────────────────────────────────────────
const LeaveBrandReviewModal: React.FC<{ brandName: string; onClose: () => void }> = ({ brandName, onClose }) => {
    const [step, setStep] = useState<'rate' | 'write' | 'done'>('rate');
    const [overall, setOverall] = useState(0);
    const [categories, setCategories] = useState({ paymentSpeed: 0, communication: 0, setEnvironment: 0, briefClarity: 0 });
    const [wouldWorkAgain, setWouldWorkAgain] = useState<boolean | null>(null);
    const [headline, setHeadline] = useState('');
    const [body, setBody] = useState('');

    const setCat = (key: keyof typeof categories, v: number) =>
        setCategories(p => ({ ...p, [key]: v }));

    const canNext = overall > 0 && (Object.values(categories) as number[]).every(v => v > 0) && wouldWorkAgain !== null;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
            <motion.div initial={{ y: 80 }} animate={{ y: 0 }} exit={{ y: 80 }}
                className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-7 pt-7 pb-4">
                    <div>
                        <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">
                            {step === 'done' ? 'Submitted' : step === 'rate' ? 'Step 1 of 2' : 'Step 2 of 2'}
                        </p>
                        <h3 className="text-xl font-serif italic font-bold">
                            {step === 'done' ? 'Review submitted!' : `Rate ${brandName}`}
                        </h3>
                    </div>
                    <button onClick={onClose} title="Close" className="w-9 h-9 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-xl hover:bg-gray-100 transition-all">
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="px-7 pb-7">
                    {step === 'done' ? (
                        <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle2 className="w-9 h-9 text-emerald-500" />
                            </div>
                            <p className="text-lg font-serif italic font-bold">Your review is live!</p>
                            <p className="text-sm text-gray-500">Honest reviews make FFN trustworthy for every creative professional.</p>
                            <button onClick={onClose} className="mt-2 px-8 py-3 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all">
                                Done
                            </button>
                        </motion.div>
                    ) : step === 'rate' ? (
                        <div className="space-y-6">
                            <div className="text-center py-3 space-y-2">
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Overall Experience</p>
                                <div className="flex justify-center">
                                    <StarRow rating={overall} size="lg" interactive onChange={setOverall} />
                                </div>
                                {overall > 0 && <p className="text-sm font-bold text-gray-500">{['', 'Poor', 'Fair', 'Good', 'Very Good', 'Exceptional'][overall]}</p>}
                            </div>

                            <div className="space-y-4">
                                {([
                                    { key: 'paymentSpeed' as const, label: 'Payment Speed', icon: CreditCard },
                                    { key: 'communication' as const, label: 'Communication', icon: MessageCircle },
                                    { key: 'setEnvironment' as const, label: 'Set Environment', icon: Users },
                                    { key: 'briefClarity' as const, label: 'Brief Clarity', icon: Briefcase },
                                ]).map(c => (
                                    <div key={c.key} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 w-40">
                                            <c.icon className="w-3 h-3 text-gray-400" />
                                            <span className="text-[9px] uppercase tracking-widest font-bold text-gray-500">{c.label}</span>
                                        </div>
                                        <StarRow rating={categories[c.key]} size="sm" interactive onChange={v => setCat(c.key, v)} />
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400 mb-3">Would you work with them again?</p>
                                <div className="flex gap-3">
                                    {[true, false].map(v => (
                                        <button key={String(v)} onClick={() => setWouldWorkAgain(v)}
                                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border text-[9px] uppercase tracking-widest font-black transition-all
                                                ${wouldWorkAgain === v
                                                    ? (v ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-600')
                                                    : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'}`}>
                                            {v ? <><ThumbsUp className="w-3.5 h-3.5" />Yes</> : <><ThumbsDown className="w-3.5 h-3.5" />No</>}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button onClick={() => setStep('write')} disabled={!canNext}
                                className="w-full py-4 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                Next — Write Review →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="br-headline" className="text-[9px] uppercase tracking-widest font-bold text-gray-500 block mb-1.5">Headline</label>
                                <input id="br-headline" value={headline} onChange={e => setHeadline(e.target.value)}
                                    placeholder="Summarise your experience in one line…"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 transition-all" />
                            </div>
                            <div>
                                <label htmlFor="br-body" className="text-[9px] uppercase tracking-widest font-bold text-gray-500 block mb-1.5">Detailed Review</label>
                                <textarea id="br-body" value={body} onChange={e => setBody(e.target.value)} rows={4} placeholder="What was it like to work with this brand?"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ffn-primary/30 transition-all" />
                                <p className="text-[9px] text-gray-400 mt-1 text-right">{body.length}/500</p>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep('rate')} className="px-5 py-3 bg-gray-50 text-gray-500 rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-gray-100 transition-all">← Back</button>
                                <button onClick={() => setStep('done')} disabled={!headline || body.length < 20}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-ffn-black text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                                    <Send className="w-3.5 h-3.5" />Submit Review
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

// ─── Brand Profile Page ───────────────────────────────────────────────────────
export const BrandProfilePage: React.FC = () => {
    const { brandId } = useParams<{ brandId: string }>();
    const navigate = useNavigate();
    const [helpfulSet, setHelpfulSet] = useState<Set<string>>(new Set());
    const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest' | 'helpful'>('recent');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

    const profile: BrandProfile | undefined = MOCK_BRAND_PROFILES.find(b => b.id === brandId) || MOCK_BRAND_PROFILES[0];
    const reviews = MOCK_BRAND_REVIEWS.filter(r => r.brandId === (brandId || 'b1'));

    const sorted = [...reviews].sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating;
        if (sortBy === 'lowest') return a.rating - b.rating;
        if (sortBy === 'helpful') return b.helpfulCount - a.helpfulCount;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const onHelpful = useCallback((id: string) =>
        setHelpfulSet(prev => { const n = new Set(prev); n.add(id); return n; }), []);

    const wouldWorkAgainPct = profile.wouldWorkAgainPct;
    const avgRatingDisplay = reviews.length > 0
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : profile.avgRating.toFixed(1);

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
                <Building2 className="w-16 h-16 mb-4 text-gray-200" />
                <p className="font-serif italic text-xl">Brand not found</p>
                <button onClick={() => navigate('/brands')} className="mt-4 text-sm text-ffn-primary">← Back to Brands</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f9f7f4]">
            {/* Cover */}
            <div className="relative h-72 overflow-hidden">
                <img src={profile.coverImage} alt={profile.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <button onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-black transition-all">
                    <ArrowLeft className="w-3.5 h-3.5" />Back
                </button>
            </div>

            {/* Profile header card */}
            <div className="max-w-4xl mx-auto px-6 -mt-20 relative z-10">
                <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8">
                    <div className="flex flex-col sm:flex-row items-start gap-6">
                        {/* Logo */}
                        <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 shadow-md flex items-center justify-center p-3 shrink-0 -mt-20">
                            <img src={profile.logoUrl} alt={profile.name} className="w-full h-full object-contain" />
                        </div>

                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-serif italic font-bold text-ffn-black">{profile.name}</h1>
                                {profile.isVerified && (
                                    <div className="flex items-center gap-1 bg-teal-50 border border-teal-100 text-teal-700 px-2.5 py-1 rounded-full">
                                        <BadgeCheck className="w-3.5 h-3.5" />
                                        <span className="text-[7px] uppercase tracking-widest font-black">Verified Brand</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-4">
                                <div className="flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold">{profile.industry}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold">{profile.location}</span>
                                </div>
                                {profile.founded && (
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5" />
                                        <span className="text-[9px] uppercase tracking-widest font-bold">Est. {profile.founded}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profile.badges.map(b => (
                                    <span key={b} className="text-[7px] bg-ffn-primary/5 border border-ffn-primary/10 text-ffn-primary px-2.5 py-1 rounded-full uppercase tracking-widest font-black">
                                        {b}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3 shrink-0">
                            {profile.website && (
                                <a href={profile.website} target="_blank" rel="noreferrer" title="Website"
                                    className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-ffn-black hover:border-gray-300 transition-all">
                                    <Globe className="w-4 h-4" />
                                </a>
                            )}
                            {profile.socialLinks?.instagram && (
                                <a href={`https://instagram.com/${profile.socialLinks.instagram}`} target="_blank" rel="noreferrer" title="Instagram"
                                    className="w-10 h-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-ffn-black hover:border-gray-300 transition-all">
                                    <Instagram className="w-4 h-4" />
                                </a>
                            )}
                            <button onClick={() => setShowReviewModal(true)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-ffn-primary text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:opacity-90 transition-all shadow-xl shadow-ffn-primary/20">
                                <Star className="w-3.5 h-3.5" />
                                Rate Brand
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 pt-8 pb-16 space-y-8">
                {/* Trust Score KPIs */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: 'Avg Rating', value: avgRatingDisplay, sub: `${reviews.length || profile.totalReviews} reviews`, icon: Star, color: 'text-amber-500' },
                        { label: 'Payment Speed', value: profile.paymentSpeedScore.toFixed(1) + '/5', sub: 'Industry avg: 3.8', icon: Zap, color: 'text-emerald-600' },
                        { label: 'Work Again', value: `${wouldWorkAgainPct}%`, sub: 'of creatives', icon: ThumbsUp, color: 'text-violet-600' },
                        { label: 'Total Hired', value: profile.totalHires.toString(), sub: fmtINR(profile.totalSpend) + ' paid out', icon: Users, color: 'text-blue-600' },
                    ].map(k => (
                        <div key={k.label} className="bg-white rounded-[2rem] border border-gray-100 shadow-sm p-5 space-y-2">
                            <k.icon className={`w-5 h-5 ${k.color}`} />
                            <p className="text-2xl font-serif font-bold text-ffn-black">{k.value}</p>
                            <p className="text-[8px] uppercase tracking-widest font-bold text-gray-400">{k.label}</p>
                            <p className="text-[8px] text-gray-400">{k.sub}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl">
                    {(['overview', 'reviews'] as const).map(t => (
                        <button key={t} onClick={() => setActiveTab(t)}
                            className={`flex-1 py-2.5 rounded-xl text-[9px] uppercase tracking-widest font-black transition-all
                                ${activeTab === t ? 'bg-white text-ffn-black shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                            {t === 'reviews' ? `Reviews (${reviews.length})` : 'Overview'}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' ? (
                        <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="space-y-6">
                            {/* About */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-4">
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">About</p>
                                <p className="text-sm text-gray-600 leading-relaxed">{profile.description}</p>
                            </div>

                            {/* Category score breakdown */}
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 space-y-5">
                                <p className="text-[9px] uppercase tracking-widest font-black text-gray-400">Trust Score Breakdown</p>
                                <ScoreBar label="Payment Speed" score={profile.paymentSpeedScore} icon={CreditCard} />
                                <ScoreBar label="Communication" score={profile.communicationScore} icon={MessageCircle} />
                                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                                    <div className="flex items-center gap-2">
                                        <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                                        <span className="text-[9px] uppercase tracking-widest font-black text-teal-600">All scores based on verified FFN bookings only</span>
                                    </div>
                                </div>
                            </div>

                            {/* Active castings CTA */}
                            {profile.activeCastings > 0 && (
                                <div className="bg-ffn-black text-white rounded-[2.5rem] p-8 flex items-center justify-between">
                                    <div>
                                        <p className="text-[9px] uppercase tracking-widest font-black text-white/40">Now Casting</p>
                                        <p className="text-2xl font-serif italic font-bold mt-1">{profile.activeCastings} active casting{profile.activeCastings > 1 ? 's' : ''}</p>
                                    </div>
                                    <button onClick={() => navigate('/casting-board')}
                                        className="px-6 py-3 bg-white text-ffn-black rounded-2xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary hover:text-white transition-all">
                                        View Castings
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="space-y-6">
                            {/* Sort + leave review */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="flex gap-2 flex-wrap">
                                    {[
                                        { key: 'recent', label: 'Most Recent' },
                                        { key: 'highest', label: 'Highest' },
                                        { key: 'helpful', label: 'Most Helpful' },
                                        { key: 'lowest', label: 'Lowest' },
                                    ].map(s => (
                                        <button key={s.key} onClick={() => setSortBy(s.key as any)}
                                            className={`px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black transition-all
                                                ${sortBy === s.key ? 'bg-ffn-black text-white shadow' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                                            {s.label}
                                        </button>
                                    ))}
                                </div>
                                <button onClick={() => setShowReviewModal(true)}
                                    className="flex items-center gap-2 px-5 py-3 bg-ffn-primary text-white rounded-2xl text-[9px] uppercase tracking-widest font-black hover:opacity-90 transition-all">
                                    <TrendingUp className="w-3.5 h-3.5" />Leave a Review
                                </button>
                            </div>

                            <AnimatePresence mode="popLayout">
                                {sorted.map(r => (
                                    <BrandReviewCard key={r.id} review={r} onHelpful={onHelpful} helpfulSet={helpfulSet} />
                                ))}
                            </AnimatePresence>

                            {sorted.length === 0 && (
                                <div className="text-center py-16 text-gray-400">
                                    <Star className="w-12 h-12 mx-auto mb-4 text-gray-200" />
                                    <p className="font-serif italic text-xl">No reviews yet</p>
                                    <p className="text-sm mt-2">Be the first to review this brand after your booking.</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Leave review modal */}
            <AnimatePresence>
                {showReviewModal && <LeaveBrandReviewModal brandName={profile.name} onClose={() => setShowReviewModal(false)} />}
            </AnimatePresence>
        </div>
    );
};
