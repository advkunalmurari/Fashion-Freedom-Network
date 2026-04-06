import { BrandProfile } from '../types';

export const MOCK_BRAND_PROFILES: BrandProfile[] = [
    {
        id: 'b1',
        name: 'Nykaa Fashion',
        logoUrl: 'https://logo.clearbit.com/nykaa.com',
        coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format,compress&fm=webp&q=80',
        industry: 'Luxury Retail',
        location: 'Mumbai, India',
        description: 'India\'s premier luxury fashion destination. Representing curated global and local brands.',
        isVerified: true,
        totalHires: 142,
        totalSpend: 8500000,
        avgRating: 4.8,
        totalReviews: 86,
        paymentSpeedScore: 4.9,
        communicationScore: 4.7,
        wouldWorkAgainPct: 98,
        activeCastings: 4,
        badges: ['Top Employer', 'Fast Payer', 'Elite Brand']
    },
    {
        id: 'b2',
        name: 'Sabyasachi',
        logoUrl: 'https://logo.clearbit.com/sabyasachi.com',
        coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&auto=format,compress&fm=webp&q=80',
        industry: 'High Fashion',
        location: 'Kolkata, India',
        description: 'A global luxury brand from India with a deep rooted heritage in craft. Defining Indian luxury for the modern world.',
        isVerified: true,
        totalHires: 64,
        totalSpend: 12000000,
        avgRating: 4.9,
        totalReviews: 42,
        paymentSpeedScore: 4.8,
        communicationScore: 4.9,
        wouldWorkAgainPct: 100,
        activeCastings: 2,
        badges: ['Iconic Partner', 'Masterclass Mentor']
    }
];
