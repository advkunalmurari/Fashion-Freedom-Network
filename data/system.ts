import { PressRelease, ProtocolMessage, ActivityNode, SearchResult, AvailabilitySlot, CreatorInsights, UserRole, ProtocolCategory } from '../types';

export const MOCK_PRESS_RELEASES: PressRelease[] = [
    {
        id: 'pr1',
        title: "FFN Launches 'Identity Hub' - Phase 80 Complete",
        excerpt: 'Introducing the first-ever on-chain professional identity system for the fashion industry. Verified measurements, work-credits, and trust scores.',
        content: 'Long form content about the launch details and technology stack.',
        imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format%2Ccompress&fit=crop&q=80&w=800%27%2C&fm=webp
        date: '2025-02-15',
        category: 'PRODUCT'
    },
    {
        id: 'pr2',
        title: 'Sabyasachi Studios Joins FFN Elite',
        excerpt: 'Iconic luxury brand Sabyasachi officially integrates with our Casting Protocol for its SS26 international campaign.',
        content: 'Detailed deep dive into the Sabyasachi x FFN integration.',
        imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format%2Ccompress&fit=crop&q=80&w=800%27%2C&fm=webp
        date: '2025-02-10',
        category: 'PARTNERSHIP'
    }
];

export const MOCK_PROTOCOL_MESSAGES: ProtocolMessage[] = [
    {
        id: 'pm1',
        category: 'SYSTEM',
        sender: {
            id: 'SYSTEM',
            name: 'FFN Protocol',
            avatar: 'https://images.unsplash.com/photo-1549421263-54948a3e0b2a?w=100%27%2C&auto=format%2Ccompress&fm=webp&q=80
            role: UserRole.BRAND
        },
        lastMessage: 'Your Identity Hub profile is now 95% complete. Verify measurements to reach 100%.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        unread: true,
        status: 'online',
        urgency: 'medium'
    }
];

export const MOCK_ACTIVITY_NODES: ActivityNode[] = [
    { id: 'an1', type: 'APPLICATION', title: 'Casting Post', description: 'New application received', timestamp: '2h ago', status: 'pending' },
    { id: 'an2', type: 'PAYMENT', title: 'Escrow Funded', description: 'Milestone 1 funded', timestamp: '5h ago', status: 'completed' },
    { id: 'an3', type: 'MILESTONE', title: 'Shoot Day', description: 'Campaign shoot day', timestamp: '1d ago', status: 'completed' }
];

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
    {
        id: 'st1',
        type: 'talent',
        title: 'Aarav Sharma',
        subtitle: 'Designer',
        avatarUrl: '/demo/aarav_avatar_1772387338276.png',
        link: '/profile/aarav'
    },
    {
        id: 'st2',
        type: 'brand',
        title: 'ZARA India',
        subtitle: 'Luxury Retail',
        avatarUrl: 'https://logo.clearbit.com/zara.com',
        link: '/brand/zara'
    }
];

export const MOCK_EXPLORE_LABS = [
    { id: 'el1', title: 'Trend Lab', description: 'Real-time fashion sentiment analysis.', icon: 'BrainCircuit' },
    { id: 'el2', title: 'Casting Hub', description: 'The protocol for fair talent selection.', icon: 'Users' }
];

export const MOCK_CREATOR_INSIGHTS: CreatorInsights = {
    talentId: 't1',
    totalViews: 12500,
    totalSaves: 450,
    totalHires: 12,
    avgEngagementRate: 8.4,
    recentVisitors: [],
    dailyMetrics: []
};

export const MOCK_AVAILABILITY: AvailabilitySlot[] = [
    { id: 'as1', userId: 't1', startDate: '2025-03-01T09:00:00Z', endDate: '2025-03-01T18:00:00Z', status: 'unavailable' }
];
