import { CastingCall, CollaborationProject, WarRoom, CastingParticipant, LiveCasting, Contract, Editorial, UserRole } from '../types';

export const MOCK_CASTING_CALLS: CastingCall[] = [
    {
        id: 'cc1',
        brand_id: 'b1',
        brandName: 'Nykaa Fashion',
        title: 'SS26 Lead Campaign Model',
        description: 'Seeking a versatile lead model for our upcoming Spring/Summer 2026 global campaign. Must have strong editorial range.',
        location: 'Mumbai / International',
        budget: '₹1.5L - ₹3L',
        deadline: '2025-03-25',
        requirements: ['Height: 5\'8"+', 'Diverse Look', 'Strong Portfolio'],
        category: UserRole.MODEL,
        applicantCount: 142,
        status: 'Open'
    },
    {
        id: 'cc2',
        brand_id: 'b2',
        brandName: 'Sabyasachi',
        title: 'Heritage Bridal Editorial',
        description: 'Looking for a model with a classic, elegant look for a heritage bridal collection. Shoot location: Jodhpur.',
        location: 'Jodhpur, India',
        budget: '₹75k - ₹1.2L',
        deadline: '2025-03-15',
        requirements: ['Classical Features', 'Graceful Movement'],
        category: UserRole.MODEL,
        applicantCount: 58,
        status: 'Open'
    },
    {
        id: 'cc3',
        brand_id: 'b3',
        brandName: 'Vogue India',
        title: 'High-Fashion MUA for Cover',
        description: 'Searching for an avant-garde makeup artist for the June cover shoot. Focus on skin texture and bold colors.',
        location: 'Mumbai',
        budget: '₹50k',
        deadline: '2025-03-10',
        requirements: ['Avant-Garde Portfolio', 'SFX Experience Preferred'],
        category: UserRole.MUA,
        applicantCount: 24,
        status: 'Open'
    }
];

export const MOCK_COLLABORATION_PROJECTS: CollaborationProject[] = [
    {
        id: 'cp1',
        title: 'Neo-Traditional Editorial',
        description: 'A fusion of Indian heritage and cyber-punk aesthetics. Seeking a complete team for a high-concept digital and print series.',
        creator: {
            id: 't4',
            displayName: 'Elena Rossi',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format,compress&fm=webp&q=80',
            role: 'PHOTOGRAPHER'
        },
        status: 'OPEN',
        requirements: ['High-Fashion Experience', 'Heritage Styling'],
        tags: ['Conceptual', 'High-Fashion', 'Noir'],
        createdAt: new Date().toISOString(),
        type: 'TFP'
    },
    {
        id: 'cp2',
        title: 'Sustainable Streetwear Drop',
        description: 'Developing a zero-waste streetwear collection using upcycled materials. Looking for designers and 3D artists.',
        creator: {
            id: 't1',
            displayName: 'Aarav Sharma',
            avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format,compress&fm=webp&q=80',
            role: 'DESIGNER'
        },
        status: 'IN_PROGRESS',
        requirements: ['Upcycling Knowledge', '3D Pattern Making'],
        tags: ['Sustainable', 'Streetwear', 'Digital'],
        createdAt: new Date().toISOString(),
        type: 'PAID'
    }
];

export const MOCK_WAR_ROOMS: WarRoom[] = [
    {
        id: 'wr1',
        projectId: 'cp1',
        title: 'Neo-Traditional Editorial Campaign',
        brand: {
            id: 'b1',
            name: 'Nykaa Fashion',
            logoUrl: 'https://logo.clearbit.com/nykaa.com'
        },
        talent: {
            id: 't2',
            name: 'Priya Singh',
            avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format,compress&fm=webp&q=80',
        },
        messages: [
            { id: 'm1', senderId: 't4', senderName: 'Elena Rossi', content: 'Lighting tests are looking good for the evening sequence.', timestamp: new Date(Date.now() - 3600000).toISOString() },
            { id: 'm2', senderId: 'b1', senderName: 'Nykaa Team', content: 'Great. Can we push the contrast more in the neon sections?', timestamp: new Date(Date.now() - 3000000).toISOString() }
        ],
        milestones: [
            { id: 'ms1', title: 'Conceptual Design', description: 'Initial concept approval', status: 'COMPLETED' },
            { id: 'ms2', title: 'Casting Finalized', description: 'Talent selection and contracting', status: 'COMPLETED' },
            { id: 'ms3', title: 'Shoot Prep', description: 'Location and gear setup', status: 'IN_PROGRESS' },
            { id: 'ms4', title: 'Post Production', description: 'Retouching and delivery', status: 'PENDING' }
        ],
        files: [
            { id: 'f1', name: 'Moodboard_v1.pdf', size: '2.4MB', type: 'application/pdf', url: '#', uploadedBy: 't4', uploadedAt: new Date().toISOString() }
        ],
        status: 'ACTIVE',
        lastActivity: new Date().toISOString()
    }
];

export const MOCK_CAMPAIGNS = [
    {
        id: 'camp_1',
        title: 'SS26 Summer Solstice',
        brand: 'Nykaa Fashion',
        status: 'ACTIVE',
        daysLeft: 12,
        completion: 65,
        teamSize: 14,
        budget: '₹25.4L'
    }
];

export const MOCK_CASTINGS: CastingCall[] = MOCK_CASTING_CALLS;

export const MOCK_EDITORIALS: Editorial[] = [
    {
        id: 'ed1',
        title: 'The Silent Silk',
        media_url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=800&auto=format,compress&fm=webp&q=80',
        photographer_name: 'Vikram Seth',
        category: 'Haute Couture',
        created_at: '2024-12-01'
    },
    {
        id: 'ed2',
        title: 'Cyber-Kolkata',
        media_url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800&auto=format,compress&fm=webp&q=80',
        photographer_name: 'Elena Rossi',
        category: 'Experimental',
        created_at: '2025-01-15'
    }
];

export const MOCK_SHOOTS = MOCK_EDITORIALS;

export const MOCK_PARTICIPANTS: CastingParticipant[] = [
    {
        id: 'cp_001', userId: 't2', status: 'waiting', joinedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        castingId: 'cc1'
    },
    {
        id: 'cp_002', userId: 't5', status: 'shortlisted', joinedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        castingId: 'cc1'
    }
];

export const MOCK_LIVE_CASTINGS: LiveCasting[] = [
    {
        id: 'lc1',
        castingId: 'cc1',
        brandId: 'b1',
        title: 'SS26 Lead Model Live Selection',
        status: 'live',
        participants: MOCK_PARTICIPANTS
    }
];

export const MOCK_CONTRACTS: Contract[] = [
    {
        id: 'con_001',
        castingId: 'cc1',
        talentId: 't2',
        brandId: 'b1',
        type: 'Model Release',
        status: 'completed',
        terms: 'Standard High-Fashion Campaign Terms',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
];
