import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Masterclass, MasterclassFormat } from '../types';
import { MOCK_MASTERCLASSES, MOCK_TALENT_POOL } from '../constants';
import { PayPalButton } from './PayPalButton';
import {
    Star, Users, Clock, Play, BookOpen, Video, Calendar, CheckCircle,
    X, Lock, ChevronDown, ChevronUp, Sparkles, Award, ArrowRight, Search
} from 'lucide-react';

// ─── Format badge config ───────────────────────────────────────────────────────
const FORMAT_CONFIG: Record<MasterclassFormat, { color: string; icon: React.FC<any> }> = {
    'Course': { color: 'bg-violet-50 text-violet-600', icon: BookOpen },
    'Live Webinar': { color: 'bg-blue-50 text-blue-600', icon: Video },
    '1-on-1 Session': { color: 'bg-rose-50 text-rose-600', icon: Users },
    'Portfolio Review': { color: 'bg-amber-50 text-amber-600', icon: Sparkles },
};

const LEVEL_COLOR = {
    'Beginner': 'bg-emerald-50 text-emerald-600',
    'Intermediate': 'bg-blue-50 text-blue-600',
    'Advanced': 'bg-purple-50 text-purple-600',
};

const CATEGORIES = ['All', 'Photography', 'Modelling', 'Styling', 'Business'];

// ─── Masterclass Card ─────────────────────────────────────────────────────────
const MasterclassCard: React.FC<{ mc: Masterclass; onClick: () => void }> = ({ mc, onClick }) => {
    const instructor = MOCK_TALENT_POOL.find(u => u.id === mc.instructorId);
    const FormatIcon = FORMAT_CONFIG[mc.format]?.icon || BookOpen;
    const discount = mc.originalPrice ? Math.round((1 - mc.price / mc.originalPrice) * 100) : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            whileHover={{ y: -6 }}
            onClick={onClick}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg group cursor-pointer hover:shadow-2xl hover:border-ffn-primary/20 transition-all duration-500"
        >
            {/* Cover Image */}
            <div className="relative h-52 overflow-hidden">
                <img src={mc.coverImage} alt={mc.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

                {/* Format badge */}
                <div className={`absolute top-4 left-4 flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${FORMAT_CONFIG[mc.format]?.color} backdrop-blur-sm`}>
                    <FormatIcon className="w-3 h-3" />
                    <span>{mc.format}</span>
                </div>

                {/* Discount badge */}
                {discount && (
                    <div className="absolute top-4 right-4 bg-ffn-primary text-white px-3 py-1 rounded-full text-[9px] font-black">
                        {discount}% OFF
                    </div>
                )}

                {/* Instructor avatar */}
                <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-200">
                        {instructor?.avatarUrl && <img src={instructor.avatarUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <p className="text-white text-[9px] uppercase tracking-widest font-bold opacity-70">Instructor</p>
                        <p className="text-white text-xs font-bold">{instructor?.displayName}</p>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-7 space-y-4">
                <div className="flex items-center space-x-2">
                    <span className={`text-[8px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full ${LEVEL_COLOR[mc.level]}`}>{mc.level}</span>
                    <span className="text-[8px] uppercase tracking-widest font-black px-2.5 py-1 rounded-full bg-gray-50 text-gray-500">{mc.category}</span>
                </div>

                <div>
                    <h3 className="text-lg font-serif italic font-bold text-ffn-black leading-tight group-hover:text-ffn-primary transition-colors line-clamp-2">
                        {mc.title}
                    </h3>
                </div>

                {/* Stats row */}
                <div className="flex items-center space-x-4 text-[9px] uppercase tracking-widest font-bold text-gray-400">
                    <span className="flex items-center space-x-1 text-ffn-primary">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{mc.rating}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                        <Users className="w-3 h-3" />
                        <span>{mc.enrolledCount.toLocaleString()}</span>
                    </span>
                    {mc.lessons && (
                        <span className="flex items-center space-x-1">
                            <Play className="w-3 h-3" />
                            <span>{mc.lessons.length} lessons</span>
                        </span>
                    )}
                    {mc.durationMins && !mc.lessons && (
                        <span className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>{mc.durationMins} min</span>
                        </span>
                    )}
                </div>

                {/* Next session date */}
                {mc.nextSessionDate && (
                    <div className="flex items-center space-x-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-xl">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-semibold">
                            Next: {new Date(mc.nextSessionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                    </div>
                )}

                {/* Price */}
                <div className="flex items-end justify-between pt-2 border-t border-gray-50">
                    <div>
                        <p className="text-2xl font-serif font-bold text-ffn-black">₹{mc.price.toLocaleString()}</p>
                        {mc.originalPrice && (
                            <p className="text-xs text-gray-400 line-through">₹{mc.originalPrice.toLocaleString()}</p>
                        )}
                    </div>
                    <button className="flex items-center space-x-2 px-5 py-2.5 bg-ffn-black text-white rounded-xl text-[9px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all">
                        <span>Enroll</span>
                        <ArrowRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// ─── Masterclass Detail Drawer ─────────────────────────────────────────────────
const MasterclassDetail: React.FC<{ mc: Masterclass; onClose: () => void }> = ({ mc, onClose }) => {
    const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
    const [showEnrollment, setShowEnrollment] = useState(false);
    const instructor = MOCK_TALENT_POOL.find(u => u.id === mc.instructorId);
    const FormatIcon = FORMAT_CONFIG[mc.format]?.icon || BookOpen;

    const totalCourseMins = mc.lessons?.reduce((sum, l) => sum + l.durationMins, 0) || mc.durationMins || 0;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
                {/* Hero */}
                <div className="relative h-64 shrink-0 overflow-hidden">
                    <img src={mc.coverImage} alt={mc.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30" />
                    <button
                        title="Close"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white hover:text-ffn-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="flex items-center space-x-2 mb-3">
                            <span className={`flex items-center space-x-1 px-3 py-1.5 rounded-full text-[8px] uppercase tracking-widest font-black ${FORMAT_CONFIG[mc.format]?.color}`}>
                                <FormatIcon className="w-3 h-3" />
                                <span>{mc.format}</span>
                            </span>
                            <span className={`text-[8px] uppercase tracking-widest font-black px-3 py-1.5 rounded-full ${LEVEL_COLOR[mc.level]}`}>{mc.level}</span>
                        </div>
                        <h2 className="text-2xl font-serif italic font-bold text-white leading-tight">{mc.title}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 space-y-8">

                        {/* Quick stats */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { label: 'Rating', value: `${mc.rating} ★`, sub: `${mc.reviewCount} reviews` },
                                { label: 'Enrolled', value: mc.enrolledCount.toLocaleString(), sub: 'students' },
                                { label: mc.lessons ? 'Duration' : 'Session', value: `${totalCourseMins}m`, sub: mc.lessons ? `${mc.lessons.length} lessons` : 'one-on-one' },
                            ].map(s => (
                                <div key={s.label} className="bg-gray-50 rounded-2xl p-4 text-center">
                                    <p className="text-[8px] uppercase tracking-widest font-bold text-gray-400">{s.label}</p>
                                    <p className="text-xl font-serif font-bold text-ffn-black mt-1">{s.value}</p>
                                    <p className="text-[9px] text-gray-400">{s.sub}</p>
                                </div>
                            ))}
                        </div>

                        {/* Instructor card */}
                        <div className="flex items-start space-x-5 bg-gray-50 rounded-3xl p-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-md bg-gray-200">
                                {instructor?.avatarUrl && <img src={instructor.avatarUrl} alt="" className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[9px] uppercase tracking-widest font-bold text-gray-400 mb-1">Your Instructor</p>
                                <h4 className="text-lg font-serif italic font-bold text-ffn-black">{instructor?.displayName}</h4>
                                <p className="text-sm text-gray-500 mt-1 leading-relaxed line-clamp-2">{instructor?.bio || 'Verified Enterprise professional on FFN.'}</p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <Award className="w-3.5 h-3.5 text-ffn-primary" />
                                    <span className="text-[9px] uppercase tracking-widest font-bold text-ffn-primary">Verified Enterprise</span>
                                </div>
                            </div>
                        </div>

                        {/* Description / Subtitle */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">About this {mc.format}</h3>
                            <p className="text-gray-600 leading-relaxed">{mc.subtitle}</p>
                        </div>

                        {/* Next session */}
                        {mc.nextSessionDate && (
                            <div className="flex items-center space-x-3 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                <Calendar className="w-5 h-5 text-blue-500 shrink-0" />
                                <div>
                                    <p className="text-[9px] uppercase tracking-widest font-bold text-blue-500">Next Available Session</p>
                                    <p className="font-bold text-blue-700 mt-0.5">
                                        {new Date(mc.nextSessionDate).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Skills you'll learn */}
                        <div>
                            <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">What You'll Learn</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {mc.skills.map((skill, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-sm text-gray-700">{skill}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Lesson curriculum (for courses) */}
                        {mc.lessons && mc.lessons.length > 0 && (
                            <div>
                                <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">
                                    Course Curriculum — {mc.lessons.length} Lessons
                                </h3>
                                <div className="space-y-2 border border-gray-100 rounded-3xl overflow-hidden">
                                    {mc.lessons.map((lesson, i) => (
                                        <div key={lesson.id}>
                                            <button
                                                onClick={() => setExpandedLesson(expandedLesson === lesson.id ? null : lesson.id)}
                                                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors text-left"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${lesson.isPreview ? 'bg-ffn-primary text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                        {lesson.isPreview ? <Play className="w-3 h-3 fill-current" /> : <Lock className="w-3 h-3" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-ffn-black">{lesson.title}</p>
                                                        {lesson.isPreview && <span className="text-[8px] uppercase tracking-widest font-black text-ffn-primary">Free Preview</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-3 shrink-0 ml-4">
                                                    <span className="text-[9px] text-gray-400 font-mono">{lesson.durationMins}m</span>
                                                    {expandedLesson === lesson.id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </div>
                                            </button>
                                            <AnimatePresence>
                                                {expandedLesson === lesson.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-gray-50 px-5 pb-4 text-sm text-gray-500 border-t border-gray-100"
                                                    >
                                                        <p className="pt-4">
                                                            {lesson.isPreview
                                                                ? 'This lesson is available as a free preview. Click to watch without enrollment.'
                                                                : 'Enroll to unlock this lesson and the full course curriculum.'}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Enrollment CTA */}
                <div className="border-t border-gray-100 bg-white p-6 space-y-4 shrink-0">
                    {showEnrollment ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Enrolling in</p>
                                    <p className="font-serif italic font-bold text-ffn-black">{mc.title}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-serif font-bold text-ffn-black">₹{mc.price.toLocaleString()}</p>
                                    {mc.originalPrice && <p className="text-xs text-gray-400 line-through">₹{mc.originalPrice.toLocaleString()}</p>}
                                </div>
                            </div>
                            <PayPalButton
                                amount={mc.price}
                                description={`FFN Masterclass: ${mc.title}`}
                                onSuccess={() => {
                                    setShowEnrollment(false);
                                    alert(`🎓 Enrolled! You now have access to "${mc.title}".`);
                                }}
                            />
                            <button onClick={() => setShowEnrollment(false)} className="w-full text-[9px] uppercase text-center tracking-widest text-gray-400 hover:text-ffn-black transition-colors">
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <div>
                                <p className="text-3xl font-serif font-bold text-ffn-black">₹{mc.price.toLocaleString()}</p>
                                {mc.originalPrice && <p className="text-xs text-gray-400 line-through">₹{mc.originalPrice.toLocaleString()}</p>}
                            </div>
                            <button
                                onClick={() => setShowEnrollment(true)}
                                className="flex-1 py-4 bg-ffn-black text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all hover:-translate-y-0.5 shadow-xl flex items-center justify-center space-x-2"
                            >
                                <span>Enroll Now</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <p className="text-center text-[9px] text-gray-400">
                        Secure checkout via PayPal · 7-day money-back guarantee
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

// ─── Main Hub Page ─────────────────────────────────────────────────────────────
export const MasterclassHub: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeFormat, setActiveFormat] = useState<MasterclassFormat | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const FORMATS: (MasterclassFormat | 'All')[] = ['All', 'Course', 'Live Webinar', '1-on-1 Session', 'Portfolio Review'];

    const filtered = MOCK_MASTERCLASSES.filter(mc => {
        const catMatch = activeCategory === 'All' || mc.category === activeCategory;
        const fmtMatch = activeFormat === 'All' || mc.format === activeFormat;
        const searchMatch = !searchQuery || mc.title.toLowerCase().includes(searchQuery.toLowerCase()) || mc.category.toLowerCase().includes(searchQuery.toLowerCase());
        return catMatch && fmtMatch && searchMatch;
    });

    const selectedMc = MOCK_MASTERCLASSES.find(m => m.id === selectedId);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-8 py-16">
                    {/* Title */}
                    <div className="max-w-2xl">
                        <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ffn-primary mb-4">FFN Academy — Exclusive</p>
                        <h1 className="text-5xl font-serif italic font-bold text-ffn-black leading-none">
                            Expert-Led Masterclasses<br />& Mentorship
                        </h1>
                        <p className="text-gray-500 mt-4 leading-relaxed max-w-lg">
                            Learn directly from India's top fashion photographers, veteran runway coaches, and editorial stylists. On-demand courses, live webinars, and 1-on-1 sessions — all in one place.
                        </p>
                    </div>

                    {/* Search */}
                    <div className="mt-10 relative max-w-2xl">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search masterclasses — photography, modelling, styling..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] py-5 pl-16 pr-6 text-sm focus:ring-2 focus:ring-ffn-primary/20 focus:border-ffn-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Category pills */}
                    <div className="flex space-x-3 mt-8 overflow-x-auto pb-2">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-full text-[9px] uppercase tracking-widest font-black whitespace-nowrap transition-all shrink-0 ${activeCategory === cat ? 'bg-ffn-black text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:border-ffn-primary hover:text-ffn-black'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Format pills */}
                    <div className="flex space-x-3 mt-4 overflow-x-auto pb-2">
                        {FORMATS.map(fmt => (
                            <button
                                key={fmt}
                                onClick={() => setActiveFormat(fmt)}
                                className={`flex items-center space-x-2 px-5 py-2.5 rounded-full text-[9px] uppercase tracking-widest font-black whitespace-nowrap transition-all shrink-0 ${activeFormat === fmt ? 'bg-ffn-primary/10 text-ffn-primary border border-ffn-primary/30' : 'bg-white border border-gray-100 text-gray-400 hover:border-gray-300'}`}
                            >
                                {fmt !== 'All' && (() => { const Icon = FORMAT_CONFIG[fmt as MasterclassFormat]?.icon; return Icon ? <Icon className="w-3 h-3" /> : null; })()}
                                <span>{fmt}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Featured banner */}
            <div className="max-w-7xl mx-auto px-8 pt-12">
                <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-r from-ffn-black via-gray-900 to-gray-800 p-10 md:p-14 mb-12 shadow-2xl">
                    <div
                        className="absolute inset-0 opacity-20 bg-cover bg-center"
                        style={{ backgroundImage: `url(${MOCK_MASTERCLASSES[0].coverImage})` }}
                    />
                    <div className="relative z-10 max-w-xl">
                        <p className="text-ffn-primary text-[9px] uppercase tracking-[0.4em] font-black mb-3">Featured Masterclass</p>
                        <h2 className="text-3xl md:text-4xl font-serif italic font-bold text-white leading-tight mb-4">
                            {MOCK_MASTERCLASSES[0].title}
                        </h2>
                        <p className="text-gray-300 text-sm leading-relaxed mb-8 line-clamp-2">{MOCK_MASTERCLASSES[0].subtitle}</p>
                        <div className="flex items-center space-x-6">
                            <button
                                onClick={() => setSelectedId(MOCK_MASTERCLASSES[0].id)}
                                className="flex items-center space-x-3 px-8 py-4 bg-white text-ffn-black rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-ffn-primary hover:text-white transition-all"
                            >
                                <Play className="w-4 h-4 fill-current" />
                                <span>View Masterclass</span>
                            </button>
                            <div className="text-white">
                                <p className="text-2xl font-serif font-bold">₹{MOCK_MASTERCLASSES[0].price.toLocaleString()}</p>
                                <p className="text-xs text-gray-400 line-through">₹{MOCK_MASTERCLASSES[0].originalPrice?.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto px-8 pb-16">
                <div className="flex items-center justify-between mb-8">
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                        {filtered.length} masterclass{filtered.length !== 1 ? 'es' : ''} found
                    </p>
                </div>

                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(mc => (
                                <MasterclassCard
                                    key={mc.id}
                                    mc={mc as Masterclass}
                                    onClick={() => setSelectedId(mc.id)}
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 bg-white rounded-[3rem] border border-gray-100">
                            <BookOpen className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif italic text-gray-400">No classes found</h3>
                            <p className="text-sm text-gray-400 mt-2">Try a different category or search term.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {selectedMc && (
                    <MasterclassDetail
                        mc={selectedMc as Masterclass}
                        onClose={() => setSelectedId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
