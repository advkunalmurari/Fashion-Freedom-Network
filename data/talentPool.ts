import { User, Brand, UserRole, VerificationLevel, SubscriptionType } from '../types';

export const MOCK_TALENT_POOL: User[] = [
    {
        id: 't1',
        username: 'aarav_sharma',
        displayName: 'Aarav Sharma',
        role: UserRole.DESIGNER,
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?bg=black&auto=format%2Ccompress&fit=crop&q=80&w=400%27%2C&fm=webp
        coverUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?bg=black&auto=format%2Ccompress&fit=crop&q=80&w=1200%27%2C&fm=webp
        verificationLevel: VerificationLevel.PREMIUM,
        isVerified: true,
        isBoosted: true,
        isPremium: true,
        premiumBadgeColor: '#FF3366',
        bio: "Pioneering sustainable couture between Mumbai and Milan. Founder of SHARMA ECO-LAB. Focused on upcycling heritage textiles with cyber-minimalist silhouettes.",
        followersCount: 12400,
        followingCount: 842,
        location: 'Mumbai / Milan',
        instagramUrl: 'https://instagram.com/aarav_eco',
        tiktokUrl: 'https://tiktok.com/@aarav_ecolab',
        websiteUrl: 'https://sharma-ecolab.com',
        hourlyRate: 4500,
        skills: ['Sustainable Design', 'Tailoring', 'Creative Direction'],
        experienceLevel: 'pro',
        completionScore: 94,
        subscription: {
            type: SubscriptionType.PREMIUM,
            endDate: '2026-01-01'
        }
    },
    {
        id: 't2',
        username: 'priya_singh',
        displayName: 'Priya Singh',
        role: UserRole.MODEL,
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?bg=black&auto=format%2Ccompress&fit=crop&q=80&w=400%27%2C&fm=webp
        coverUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?bg=black&auto=format%2Ccompress&fit=crop&q=80&w=1200%27%2C&fm=webp
        verificationLevel: VerificationLevel.VERIFIED,
        isVerified: true,
        isBoosted: false,
        bio: "Representing modern Indian elegance. Walked for Lakme Fashion Week and featured in Vogue India SS24.",
        followersCount: 45800,
        followingCount: 1205,
        location: 'Delhi, India',
        instagramUrl: 'https://instagram.com/priya_walks',
        experienceLevel: 'intermediate',
        completionScore: 88
    }
];

export const MOCK_BRANDS: Brand[] = [
    {
        id: 'b1',
        brand_name: 'Nykaa Fashion',
        logo_url: 'https://logo.clearbit.com/nykaa.com',
        description: 'India\'s premier luxury fashion destination.',
        location: 'Mumbai, India',
        website: 'https://nykaafashion.com',
        industry: 'Luxury Retail',
        created_at: new Date().toISOString()
    },
    {
        id: 'b2',
        brand_name: 'Sabyasachi',
        logo_url: 'https://logo.clearbit.com/sabyasachi.com',
        description: 'A global luxury brand from India with a deep rooted heritage in craft.',
        location: 'Kolkata, India',
        industry: 'High Fashion',
        created_at: new Date().toISOString()
    }
];
