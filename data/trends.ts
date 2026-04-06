import { TrendSignal, SentimentSignal, AestheticSpotlight, TrendMetric, StyleNode, TrendMomentum } from '../types';

export const MOCK_TREND_SIGNALS: TrendSignal[] = [
    {
        id: 'ts1',
        name: 'Quiet Luxury',
        category: 'Aesthetic',
        momentum: 'Rising',
        currentScore: 84,
        weeklyChange: 12.5,
        description: 'Focus on quality materials, minimal branding, and timeless silhouettes. Exploding in Tier-1 metros.',
        tags: ['Minimalism', 'Premium', 'Timeless'],
        coverImage: 'https://images.unsplash.com/photo-1549497538-30122aaadecc?auto=format%2Ccompress&fit=crop&q=80&w=800%27%2C&fm=webp
        sparkline: [
            { week: 'W1', score: 45 },
            { week: 'W2', score: 55 },
            { week: 'W3', score: 72 },
            { week: 'W4', score: 84 }
        ]
    },
    {
        id: 'ts2',
        name: 'Gen-Z Heritage',
        category: 'Fabric',
        momentum: 'Exploding',
        currentScore: 92,
        weeklyChange: 24.8,
        description: 'Traditional Indian weaves reimagined for street style. High engagement on Reels.',
        tags: ['Heritage', 'Streetwear', 'Z-Gen'],
        coverImage: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format%2Ccompress&fit=crop&q=80&w=800%27%2C&fm=webp
        sparkline: [
            { week: 'W1', score: 30 },
            { week: 'W2', score: 60 },
            { week: 'W3', score: 85 },
            { week: 'W4', score: 92 }
        ]
    }
];

export const MOCK_SENTIMENT_PULSE: SentimentSignal[] = [
    { id: 's1', keyword: 'Elegance', sentiment: 'positive', volume: 8500, velocity: 1.2 },
    { id: 's2', keyword: 'Sustainable', sentiment: 'positive', volume: 12000, velocity: 1.5 },
    { id: 's3', keyword: 'Fast Fashion', sentiment: 'negative', volume: 4500, velocity: -0.8 }
];

export const MOCK_EMERGING_AESTHETICS: AestheticSpotlight[] = [
    {
        id: 'ea1',
        title: 'Raw Concrete',
        subtitle: 'Post-Industrial Minimalism',
        imageUrl: 'https://images.unsplash.com/photo-1549497538-30122aaadecc?auto=format%2Ccompress&fit=crop&q=80&w=800%27%2C&fm=webp
        description: 'Structural focus with neutral tones and heavy textures.',
        demandGrowth: 94,
        topNodes: ['London', 'Mumbai', 'Berlin']
    },
    {
        id: 'ea2',
        title: 'Solar Punk',
        subtitle: 'Bright Sustainability',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format%2Ccompress&fit=crop&q=80&w=800%27%2C&fm=webp
        description: 'Optimistic sustainability with bright, organic textures.',
        demandGrowth: 82,
        topNodes: ['Portland', 'Bangalore', 'Melbourne']
    }
];

export const MOCK_TRENDS: TrendMetric[] = [
    { id: 'tr1', label: 'Eco-Silk', value: 92, change: 15, trend: 'up' },
    { id: 'tr2', label: 'Digital-Only', value: 45, change: -5, trend: 'down' }
];

export const MOCK_STYLE_NODES: StyleNode[] = [
    { id: 'sn1', city: 'Mumbai', styleName: 'Indo-Western', demandScore: 92, activeTalent: 450, growth: 15 },
    { id: 'sn2', city: 'Delhi', styleName: 'High-Luxe', demandScore: 88, activeTalent: 320, growth: 12 }
];
