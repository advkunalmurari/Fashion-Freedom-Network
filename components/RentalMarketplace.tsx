import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { RentalListing, RentalCategory } from '../types';
import { MOCK_RENTAL_LISTINGS, MOCK_TALENT_POOL } from '../constants';
import {
    MapPin, Star, Search, SlidersHorizontal, Camera, Lightbulb,
    Building2, ShirtIcon, Package, X, CheckCircle, ChevronLeft,
    ChevronRight, CalendarDays, Clock, Plus, ArrowRight
} from 'lucide-react';
import { PayPalButton } from './PayPalButton';
import { PRICING } from '../constants';

// ─── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES: { label: RentalCategory | 'All'; icon: React.FC<any> }[] = [
    { label: 'All', icon: ({ className }: any) => <span className={className}>✦</span> },
    { label: 'Studio Space', icon: Building2 },
    { label: 'Lighting', icon: Lightbulb },
    { label: 'Camera & Lenses', icon: Camera },
    { label: 'Wardrobe Archive', icon: ShirtIcon },
    { label: 'Props & Sets', icon: Package },
];

// ─── Listing Card ─────────────────────────────────────────────────────────────
const ListingCard: React.FC<{ listing: RentalListing; onClick: () => void }> = ({ listing, onClick }) => {
    const owner = MOCK_TALENT_POOL.find(u => u.id === listing.ownerId);

    return (
        <m.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ y: -6 }}
            onClick={onClick}
            className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-lg group cursor-pointer hover:shadow-2xl hover:border-ffn-primary/20 transition-all duration-500"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden">
                <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                />
                {/* Unavailable overlay */}
                {!listing.isAvailable && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <span className="bg-white/90 text-gray-700 px-4 py-2 rounded-full text-[9px] uppercase tracking-widest font-black">Currently Booked</span>
                    </div>
                )}
                {/* Category badge */}
                <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-ffn-black px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black shadow-sm">
                        {listing.category}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-8 space-y-4">
                <div>
                    <h3 className="text-xl font-serif italic font-bold text-ffn-black leading-tight group-hover:text-ffn-primary transition-colors line-clamp-2">
                        {listing.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-400 mt-2">
                        <MapPin className="w-3.5 h-3.5 text-ffn-primary" />
                        <span className="text-[10px] uppercase tracking-widest font-bold">{listing.location}</span>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-ffn-primary/5 text-ffn-primary px-3 py-1.5 rounded-full">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-[9px] font-black">{listing.rating}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">
                        {listing.reviewCount} reviews
                    </span>
                </div>

                {/* Owner */}
                <div className="flex items-center space-x-3 pt-2 border-t border-gray-50">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                        {owner?.avatarUrl && <img src={owner.avatarUrl} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Listed by</p>
                        <p className="text-xs font-bold text-ffn-black">{owner?.displayName || 'FFN Member'}</p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-[9px] uppercase tracking-widest text-gray-400">From</p>
                        <p className="text-lg font-serif font-bold text-ffn-black">
                            ₹{(listing.pricePerHour || listing.pricePerDay).toLocaleString()}
                            <span className="text-[9px] text-gray-400 ml-1 font-normal not-italic">/{listing.pricePerHour ? 'hr' : 'day'}</span>
                        </p>
                    </div>
                </div>
            </div>
        </m.div>
    );
};

// ─── Listing Detail Drawer ────────────────────────────────────────────────────
const ListingDetail: React.FC<{ listing: RentalListing; onClose: () => void }> = ({ listing, onClose }) => {
    const [currentImage, setCurrentImage] = useState(0);
    const [rentalType, setRentalType] = useState<'hourly' | 'daily'>('daily');
    const [hours, setHours] = useState(4);
    const [days, setDays] = useState(1);
    const [showBooking, setShowBooking] = useState(false);
    const owner = MOCK_TALENT_POOL.find(u => u.id === listing.ownerId);

    const totalPrice = rentalType === 'hourly'
        ? (listing.pricePerHour || 0) * hours
        : listing.pricePerDay * days;

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <m.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col"
            >
                {/* Image Gallery */}
                <div className="relative h-72 bg-gray-100 shrink-0">
                    <img
                        src={listing.images[currentImage]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                    {/* Close button */}
                    <button
                        title="Close detail"
                        onClick={onClose}
                        className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-ffn-black hover:bg-white transition-colors shadow-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    {/* Image navigation */}
                    {listing.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                            {listing.images.map((_, i) => (
                                <button
                                    key={i}
                                    title={`View slide ${i + 1}`}
                                    onClick={() => setCurrentImage(i)}
                                    className={`w-2 h-2 rounded-full transition-all ${i === currentImage ? 'bg-white w-6' : 'bg-white/50'}`}
                                />
                            ))}
                        </div>
                    )}
                    {/* Availability badge */}
                    <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-black ${listing.isAvailable ? 'bg-emerald-500 text-white' : 'bg-gray-700 text-white'}`}>
                            {listing.isAvailable ? 'Available' : 'Booked'}
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* Title */}
                    <div>
                        <span className="text-[9px] uppercase tracking-widest font-black text-ffn-primary bg-ffn-primary/5 px-3 py-1.5 rounded-full">
                            {listing.category}
                        </span>
                        <h2 className="text-2xl font-serif italic font-bold text-ffn-black mt-4 leading-tight">{listing.title}</h2>
                        <div className="flex items-center space-x-4 mt-3">
                            <div className="flex items-center space-x-1 text-ffn-primary">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="font-bold">{listing.rating}</span>
                                <span className="text-gray-400 text-sm">({listing.reviewCount} reviews)</span>
                            </div>
                            <div className="flex items-center text-gray-400 text-sm space-x-1">
                                <MapPin className="w-3.5 h-3.5" />
                                <span>{listing.location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Owner */}
                    <div className="flex items-center space-x-4 bg-gray-50 rounded-2xl p-5">
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                            {owner?.avatarUrl && <img src={owner.avatarUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Listed by</p>
                            <p className="font-bold text-ffn-black">{owner?.displayName || 'FFN Member'}</p>
                        </div>
                        <button
                            title="View Owner Profile"
                            className="ml-auto text-[9px] uppercase tracking-widest font-black text-ffn-primary"
                        >
                            View Profile
                        </button>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-3">About this listing</h3>
                        <p className="text-gray-600 leading-relaxed">{listing.description}</p>
                    </div>

                    {/* Amenities */}
                    {listing.amenities && listing.amenities.length > 0 && (
                        <div>
                            <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400 mb-4">Features & Amenities</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {listing.amenities.map((a, i) => (
                                    <div key={i} className="flex items-center space-x-3">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                                        <span className="text-sm text-gray-700">{a}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Pricing selector */}
                    {listing.isAvailable && (
                        <div className="bg-gray-50 rounded-3xl p-6 space-y-6">
                            <h3 className="text-[10px] uppercase tracking-widest font-black text-gray-400">Configure Your Rental</h3>

                            {/* Hourly / Daily toggle */}
                            <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-gray-100">
                                <button
                                    title="Switch to Daily Booking"
                                    onClick={() => setRentalType('daily')}
                                    className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${rentalType === 'daily' ? 'bg-ffn-black text-white shadow-lg' : 'text-gray-400'}`}
                                >
                                    <CalendarDays className="w-3.5 h-3.5" />
                                    <span>Daily Rate</span>
                                </button>
                                {listing.pricePerHour && (
                                    <button
                                        title="Switch to Hourly Booking"
                                        onClick={() => setRentalType('hourly')}
                                        className={`flex-1 flex items-center justify-center space-x-2 py-3 rounded-xl text-[10px] uppercase tracking-widest font-black transition-all ${rentalType === 'hourly' ? 'bg-ffn-black text-white shadow-lg' : 'text-gray-400'}`}
                                    >
                                        <Clock className="w-3.5 h-3.5" />
                                        <span>Hourly Rate</span>
                                    </button>
                                )}
                            </div>

                            {/* Quantity selector */}
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-500">
                                        {rentalType === 'hourly' ? 'Hours' : 'Days'}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-1">
                                        ₹{rentalType === 'hourly' ? listing.pricePerHour?.toLocaleString() : listing.pricePerDay.toLocaleString()} per {rentalType === 'hourly' ? 'hour' : 'day'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <button
                                        title="Decrease"
                                        onClick={() => rentalType === 'hourly' ? setHours(h => Math.max(1, h - 1)) : setDays(d => Math.max(1, d - 1))}
                                        className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-ffn-black hover:bg-gray-50 shadow-sm transition-all"
                                    >
                                        <span className="text-lg font-bold">−</span>
                                    </button>
                                    <span className="text-2xl font-serif font-bold w-8 text-center">{rentalType === 'hourly' ? hours : days}</span>
                                    <button
                                        title="Increase"
                                        onClick={() => rentalType === 'hourly' ? setHours(h => h + 1) : setDays(d => d + 1)}
                                        className="w-10 h-10 rounded-full bg-ffn-black text-white flex items-center justify-center hover:bg-ffn-primary shadow-sm transition-all"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">Total Estimate</span>
                                <span className="text-3xl font-serif font-bold text-ffn-black">₹{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* CTA Footer */}
                {listing.isAvailable && (
                    <div className="border-t border-gray-100 p-8 bg-white space-y-4">
                        {showBooking ? (
                            <div className="space-y-3">
                                <p className="text-[10px] uppercase tracking-widest font-black text-gray-400 text-center">Pay Securely via PayPal</p>
                                <PayPalButton
                                    amount={totalPrice}
                                    description={`FFN Rental: ${listing.title} (${rentalType === 'hourly' ? `${hours} hrs` : `${days} days`})`}
                                    onSuccess={() => {
                                        setShowBooking(false);
                                        alert('🎉 Rental Booked! The owner will confirm shortly.');
                                    }}
                                />
                                <button onClick={() => setShowBooking(false)} className="w-full text-[9px] uppercase tracking-widest text-gray-400 hover:text-ffn-black transition-colors">
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowBooking(true)}
                                className="w-full py-5 bg-ffn-black text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-ffn-primary transition-all hover:-translate-y-1 shadow-xl flex items-center justify-center space-x-3"
                            >
                                <span>Book Now — ₹{totalPrice.toLocaleString()}</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                )}
            </m.div>
        </div>
    );
};

// ─── Main Rental Marketplace Page ─────────────────────────────────────────────
interface RentalMarketplaceProps {
    onListItem?: () => void;
}

export const RentalMarketplace: React.FC<RentalMarketplaceProps> = ({ onListItem }) => {
    const [activeCategory, setActiveCategory] = useState<RentalCategory | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedListingId, setSelectedListingId] = useState<string | null>(null);

    const filtered = MOCK_RENTAL_LISTINGS.filter(listing => {
        const matchesCategory = activeCategory === 'All' || listing.category === activeCategory;
        const matchesSearch = !searchQuery || listing.title.toLowerCase().includes(searchQuery.toLowerCase()) || listing.location.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const selectedListing = MOCK_RENTAL_LISTINGS.find(l => l.id === selectedListingId);

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Hero Header */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-8 py-16">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                        <div>
                            <p className="text-[9px] uppercase tracking-[0.4em] font-black text-ffn-primary mb-4">FFN Rentals — New</p>
                            <h1 className="text-5xl font-serif italic font-bold text-ffn-black leading-none">
                                Studio & Equipment<br />Marketplace
                            </h1>
                            <p className="text-gray-500 mt-4 max-w-md leading-relaxed">
                                Access world-class studios, professional lighting rigs, cinema cameras, and designer wardrobe archives from India's top creatives — booked in minutes.
                            </p>
                        </div>
                        <button
                            onClick={onListItem}
                            className="flex items-center space-x-3 px-8 py-5 bg-ffn-black text-white rounded-2xl text-[10px] uppercase tracking-widest font-black hover:bg-ffn-primary hover:-translate-y-1 transition-all shadow-xl shrink-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span>List Your Equipment</span>
                        </button>
                    </div>

                    {/* Search */}
                    <div className="mt-10 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search studios, cameras, lighting, wardrobe..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 rounded-[2rem] py-5 pl-16 pr-6 text-sm focus:ring-2 focus:ring-ffn-primary/20 focus:border-ffn-primary outline-none transition-all shadow-sm"
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className="flex space-x-3 mt-8 overflow-x-auto pb-2">
                        {CATEGORIES.map(cat => {
                            const Icon = cat.icon;
                            const isActive = activeCategory === cat.label;
                            return (
                                <button
                                    key={cat.label}
                                    title={`Filter by ${cat.label}`}
                                    onClick={() => setActiveCategory(cat.label as any)}
                                    className={`flex items-center space-x-2 px-5 py-3 rounded-full text-[9px] uppercase tracking-widest font-black whitespace-nowrap transition-all shrink-0 ${isActive ? 'bg-ffn-black text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:border-ffn-primary hover:text-ffn-black'}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    <span>{cat.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                <div className="flex items-center justify-between mb-10">
                    <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                        {filtered.length} listing{filtered.length !== 1 ? 's' : ''} found
                    </p>
                    <button
                        title="Sort & Filter Results"
                        className="flex items-center space-x-2 text-[10px] uppercase tracking-widest font-black text-gray-400 hover:text-ffn-black transition-colors"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Sort & Filter</span>
                    </button>
                </div>

                <AnimatePresence mode="popLayout">
                    {filtered.length > 0 ? (
                        <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filtered.map(listing => (
                                <ListingCard
                                    key={listing.id}
                                    listing={listing}
                                    onClick={() => setSelectedListingId(listing.id)}
                                />
                            ))}
                        </m.div>
                    ) : (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-32 bg-white rounded-[3rem] border border-gray-100"
                        >
                            <Camera className="w-16 h-16 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-serif italic text-gray-400">No listings found</h3>
                            <p className="text-sm text-gray-400 mt-2">Try a different category or search term.</p>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Detail Drawer */}
            <AnimatePresence>
                {selectedListing && (
                    <ListingDetail
                        listing={selectedListing}
                        onClose={() => setSelectedListingId(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
