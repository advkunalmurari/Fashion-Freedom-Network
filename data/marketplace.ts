import { MarketplaceItem, BoutiqueSpotlight, LiveDrop, EscrowTransaction, TalentCollection, RentalListing, Masterclass } from '../types';

export const MOCK_MARKETPLACE_ITEMS: MarketplaceItem[] = [
    {
        id: 'mi1',
        title: 'Professional Lookbook Shoot',
        price: '₹25,000',
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800%27%2C&auto=format%2Ccompress&fm=webp&q=80
        author: 'Vikram Seth',
        role: 'PHOTOGRAPHER',
        description: 'Complete 8-hour session with 10 retouched editorials.',
        deliverables: ['10 Retouched Images', 'Raw Files', 'Set Styling'],
        type: 'service',
        velocity: 92,
        trustScore: 98,
        metrics: [
            { label: 'Views', value: 1200, trend: 'up' },
            { label: 'Booking Rate', value: '15%', trend: 'up' }
        ]
    }
];

export const MOCK_BOUTIQUE_SPOTLIGHTS: BoutiqueSpotlight[] = [
    {
        id: 'bs1',
        title: 'The Artisan Lab',
        subtitle: 'Heritage Craft Reconstruction',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800%27%2C&auto=format%2Ccompress&fm=webp&q=80
        description: 'A specialized unit for experimental textile manipulation.',
        specialization: ['Hand-Weaving', 'Natural Dyes'],
        capacity: 'Small Batch',
        location: 'Kolkata'
    }
];

export const MOCK_LIVE_DROPS: LiveDrop[] = [
    {
        id: 'ld1',
        title: 'SS26 Early Access Pass',
        brand: 'Nykaa Fashion',
        timeRemaining: '02h 15m 30s',
        slotsTotal: 100,
        slotsRemaining: 12,
        price: '₹5,000',
        type: 'limited-edition'
    }
];

export const MOCK_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
    {
        id: 'et1',
        bookingRef: 'FFN-BK-9021',
        brandName: 'Nykaa Fashion',
        brandLogoUrl: 'https://logo.clearbit.com/nykaa.com',
        talentName: 'Priya Singh',
        talentAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100%27%2C&auto=format%2Ccompress&fm=webp&q=80
        campaignTitle: 'Summer Solstice SS26',
        shootDate: '2025-03-20',
        amount: 125000,
        ffnFee: 12500,
        talentReceives: 112500,
        currency: 'INR',
        status: 'funded',
        contractSigned: true,
        paymentMethod: 'PayPal',
        isUserBrand: false,
        milestones: [
            { id: 'm1', label: 'Deposit', status: 'done', completedAt: '2025-02-15' },
            { id: 'm2', label: 'Shoot Day', status: 'active', dueAt: '2025-03-20' }
        ]
    }
];

export const MOCK_TALENT_COLLECTIONS: TalentCollection[] = [
    {
        id: 'tc1',
        brandId: 'b1',
        title: 'Top Runway Faces 2025',
        talentIds: ['t2', 't5'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: true
    }
];

export const MOCK_RENTAL_LISTINGS: RentalListing[] = [
    {
        id: 'rl1',
        ownerId: 't1',
        title: 'Cyber-Kolkata Studio Set',
        description: 'Neon-infused industrial backdrop with professional lighting.',
        category: 'Studio Space',
        pricePerDay: 15000,
        location: 'Salt Lake, Kolkata',
        images: ['https://images.unsplash.com/photo-1549497538-30122aaadecc?w=800%27%5D%2C&auto=format%2Ccompress&fm=webp&q=80
        isAvailable: true,
        rating: 4.8,
        reviewCount: 12,
        createdAt: new Date().toISOString()
    }
];

export const MOCK_MASTERCLASSES: Masterclass[] = [
    {
        id: 'mc1',
        instructorId: 't4',
        title: 'Conceptual Lighting for Editorial',
        subtitle: 'Master the shadows and neon highlights.',
        format: 'Live Webinar',
        level: 'Advanced',
        category: 'Photography',
        coverImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800%27%2C&auto=format%2Ccompress&fm=webp&q=80
        price: 4999,
        enrolledCount: 142,
        rating: 4.9,
        reviewCount: 38,
        skills: ['Lighting', 'Color Theory'],
        isLive: true,
        createdAt: new Date().toISOString()
    }
];
