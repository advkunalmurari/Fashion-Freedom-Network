import { AppNotification, SystemActivity, Review, RatingSummary, BrandReview, TeamComment, Post, MoodBoard, UserRole } from '../types';
import { MOCK_TALENT_POOL } from './talentPool';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
    {
        id: 'n1',
        userId: 't1',
        type: 'casting_match',
        title: 'New Casting Match',
        body: 'You have a 92% match for the ZARA SS26 campaign.',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        isRead: false,
        avatarUrl: 'https://logo.clearbit.com/zara.com',
        actionLabel: 'View Casting',
        actionRoute: '/castings/cc1'
    }
];

export const MOCK_SYSTEM_ACTIVITY: SystemActivity[] = [
    { id: 'sa1', userId: 't4', userName: 'Elena Rossi', action: 'posted a new', targetName: 'Editorial', timestamp: '2h ago', category: 'PROJECT' },
    { id: 'sa2', userId: 'b1', userName: 'Nykaa Team', action: 'funded', targetName: 'SS26 Campaign', timestamp: '5h ago', category: 'PROJECT' }
];

export const MOCK_REVIEWS: Review[] = [
    {
        id: 'r1',
        bookingId: 'bk1',
        reviewerName: 'Zara Team',
        reviewerRole: 'brand',
        subjectId: 't1',
        rating: 5,
        headline: 'Exceptional Professionalism',
        body: 'Aarav is a dream to work with. His attention to sustainable detail is unmatched.',
        tags: [{ label: 'Professional', positive: true }, { label: 'Creative', positive: true }],
        categories: {
            professionalism: 5,
            communication: 5,
            creativity: 5,
            punctuality: 4
        },
        campaignTitle: 'Eco-Luxe SS25',
        date: '2025-01-20',
        isVerifiedBooking: true,
        helpfulCount: 12
    }
];

export const MOCK_RATING_SUMMARY: RatingSummary = {
    subjectId: 't1',
    averageRating: 4.9,
    totalReviews: 24,
    ratingDistribution: { 5: 20, 4: 3, 3: 1, 2: 0, 1: 0 },
    categoryAverages: {
        professionalism: 4.9,
        communication: 4.8,
        creativity: 5.0,
        punctuality: 4.7
    },
    topPositiveTags: ['Professional', 'Creative', 'Reliable']
};

export const MOCK_BRAND_REVIEWS: BrandReview[] = [
    {
        id: 'br1',
        brandId: 'b1',
        reviewerName: 'Aarav Sharma',
        reviewerRole: 'Designer',
        rating: 5,
        headline: 'Great Creative Freedom',
        body: 'Nykaa provides an incredible platform for experimental designers.',
        categories: {
            paymentSpeed: 5,
            communication: 5,
            setEnvironment: 4,
            briefClarity: 5,
            wouldWorkAgain: true
        },
        campaignTitle: 'SS26 Launch',
        date: '2025-02-10',
        isVerifiedBooking: true,
        helpfulCount: 8
    }
];

export const MOCK_TEAM_COMMENTS: TeamComment[] = [
    { id: 'tc1', authorId: 't4', authorName: 'Elena Rossi', content: 'Strong portfolio in sustainable couture.', timestamp: '1d ago', targetId: 't1' }
];

export const MOCK_POSTS: Post[] = [
    {
        id: 'p1',
        authorId: 't1',
        author: MOCK_TALENT_POOL[0],
        type: 'IMAGE',
        mediaUrls: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800%27%5D%2C&auto=format%2Ccompress&fm=webp&q=80
        caption: 'Sustainability is not a trend, it is a protocol. #EcoFashion #FFN',
        likes: 1240,
        comments: 42,
        createdAt: '2025-02-18T10:00:00Z',
        tags: ['EcoFashion', 'FFN']
    }
];

export const MOCK_REELS: Post[] = [
    {
        id: 'rel1',
        authorId: 't1',
        author: MOCK_TALENT_POOL[0],
        type: 'REEL',
        mediaUrls: ['https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-neon-light-33314-large.mp4'],
        thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400%27%2C&auto=format%2Ccompress&fm=webp&q=80
        caption: 'Neon Protocol SS26 BTS',
        likes: 8500,
        comments: 156,
        createdAt: '2025-02-19T15:30:00Z',
        tags: ['BTS', 'Neon', 'FFN']
    }
];

export const MOCK_MOOD_BOARDS: MoodBoard[] = [
    {
        id: 'mb1',
        title: 'Cyber-Heritage SS26',
        description: 'Visual research for the upcoming editorial series.',
        created_by: 't4',
        created_at: '2025-01-10',
        collaborators: [
            { user_id: 't4', role: 'OWNER', user: MOCK_TALENT_POOL[0] }
        ]
    }
];
