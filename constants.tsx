
import React from 'react';
import { UserRole, User, VerificationLevel, Post, Brand, CastingCall, Editorial, SubscriptionType, MoodBoard, LiveCasting, CastingParticipant, Contract, RentalListing, CollaborationProject, PressRelease, WarRoom, ProjectMilestone, ProjectMessage, ProjectFile, TalentCollection, SystemActivity, AvailabilitySlot, TeamComment, ProtocolMessage, ActivityNode, ManagedTalent, AgencyCommission, AgencyProfile, SearchResult, TrendMetric, StyleNode } from './types';

export const PRICING = {
  PROFILE_LISTING: 399,
  PROFILE_BOOST: 999,
  VERIFICATION: 1499,
  CASTING_POST: 999,
  FEATURED_HOME: 2999,
  SUBSCRIPTION: {
    [SubscriptionType.BASIC]: 0,
    [SubscriptionType.PROFESSIONAL]: 399,
    [SubscriptionType.PREMIUM]: 3499,
  },
  CURRENCY: '₹',
  SYMBOL: 'INR'
};

export const BRAND_SOCIALS = {
  INSTAGRAM: 'fashionfreedomnetwork',
  INSTAGRAM_URL: 'https://instagram.com/fashionfreedomnetwork'
};

export const LOGO_SVG = (
  <svg viewBox="0 0 100 100" className="w-10 h-10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="logo-grad-vibrant" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#833ab4" />
        <stop offset="50%" stopColor="#fd1d1d" />
        <stop offset="100%" stopColor="#fcb045" />
      </linearGradient>
      <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <rect x="10" y="10" width="80" height="80" rx="28" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.1" />
    <g transform="translate(18, 58)" fill="currentColor">
      <path d="M4 0C4 -8 6 -12 12 -12V-10C9 -10 8 -8 8 -4V0H12V2H8V14H4V2H0V0H4Z" />
      <path d="M22 0C22 -8 24 -12 30 -12V-10C27 -10 26 -8 26 -4V0H30V2H26V14H22V2H18V0H22Z" />
      <path d="M40 0V14H44V6C44 2 46 1 49 1C52 1 54 3 54 7V14H58V6C58 -1 54 -4 49 -4C46 -4 44 -2 42 -1V-3H40V0Z" />
    </g>
    <circle cx="78" cy="35" r="5" fill="url(#logo-grad-vibrant)" filter="url(#logo-glow)" />
  </svg>
);

export const MOCK_TALENT_POOL: User[] = [
  {
    id: 't1',
    username: 'aarav_couture',
    displayName: 'Aarav Sharma',
    avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/aarav_avatar_1772387338276.png',
    coverUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/aarav_cover_1772387355897.png',
    role: UserRole.DESIGNER,
    verificationLevel: VerificationLevel.APPROVED,
    isVerified: true,
    isBoosted: true,
    isFeatured: true,
    bio: 'Minimalist sustainable designer based in New Delhi. Exploring the intersection of traditional craft and modern silhouettes.',
    followersCount: 15200,
    followingCount: 432,
    location: 'New Delhi, India',
    instagramUrl: 'https://instagram.com/aarav',
    completionScore: 95,
    rankingScore: 980,
    rankPosition: 1,
    brandCollaborationsCount: 12,
    subscription: { type: SubscriptionType.PREMIUM, endDate: '2025-12-31' }
  },
  {
    id: 't2',
    username: 'kiara_m',
    displayName: 'Kiara Malhotra',
    avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/kiara_avatar_retry_1772387397622.png',
    coverUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/kiara_cover_1772387415640.png',
    role: UserRole.MODEL,
    verificationLevel: VerificationLevel.PREMIUM,
    isVerified: true,
    isBoosted: false,
    isFeatured: true,
    bio: 'Editorial and commercial model. Featured in Vogue India & Harper Bazaar.',
    followersCount: 89000,
    followingCount: 120,
    location: 'Mumbai, India',
    height: "5'9\"",
    measurements: '32-24-34',
    completionScore: 100,
    rankingScore: 950,
    rankPosition: 2,
    brandCollaborationsCount: 28,
    subscription: { type: SubscriptionType.PROFESSIONAL, endDate: '2025-11-15' },
    coverVideoUrl: 'https://cdn.pixabay.com/video/2016/09/20/5267-183782782_large.mp4',
    achievements: [
      { id: 'a1', title: 'Vogue India Cover', date: '2024-12', type: 'PUBLICATION' },
      { id: 'a2', title: 'Lakmé Fashion Week', date: '2025-02', type: 'EVENT' },
      { id: 'a3', title: 'Zara SS25 Campaign', date: '2025-01', type: 'COLLAB' }
    ],
    lookbooks: [
      {
        id: 'lb1',
        creatorId: 't2',
        title: 'Editorial 2025',
        subtitle: 'The Neon Future Collection',
        coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800',
        images: [
          'https://images.unsplash.com/photo-1539109132384-3615557ef7c3?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800'
        ],
        tags: ['Editorial', 'High-Fashion', 'Noir'],
        createdAt: '2025-01-15'
      },
      {
        id: 'lb2',
        creatorId: 't2',
        title: 'Summer Heritage',
        subtitle: 'Crafting Tradition',
        coverImage: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800',
        images: [
          'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=800'
        ],
        tags: ['Traditional', 'Outdoor'],
        createdAt: '2024-12-20'
      }
    ],
    endorsements: [
      {
        id: 'e1',
        talentId: 't2',
        brandName: 'Vogue India',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Vogue_logo.svg/1200px-Vogue_logo.svg.png',
        content: 'Kiara is a generational talent with unparalleled range.',
        date: '2025-02',
        verified: true
      },
      {
        id: 'e2',
        talentId: 't2',
        brandName: 'Dior',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Christian_Dior_Logo.svg/1200px-Christian_Dior_Logo.svg.png',
        content: 'Professional, punctual, and highly creative approach.',
        date: '2025-01',
        verified: true
      }
    ],
    collaborators: [
      { id: 't1', displayName: 'Aarav Sharma', avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/aarav_avatar_1772387338276.png', role: UserRole.DESIGNER } as User,
      { id: 't4', displayName: 'Zoya Qureshi', avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800', role: UserRole.ARTIST } as User,
      { id: 't5', displayName: 'Kabir Vohra', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800', role: UserRole.MODEL } as User
    ],
    reviews: [
      {
        id: 'r1',
        bookingId: 'b1',
        reviewerName: 'Sabyasachi Mukherjee',
        reviewerRole: 'brand',
        reviewerBrandName: 'Sabyasachi',
        subjectId: 't2',
        rating: 5,
        headline: 'A True Professional',
        body: 'Kiara brought an incredible energy to the Heritage Bridal campaign. Her ability to interpret complex artistic directions is rare.',
        tags: [
          { label: 'Punctual', positive: true },
          { label: 'Creative', positive: true },
          { label: 'High Energy', positive: true }
        ],
        categories: { professionalism: 5, communication: 5, creativity: 5, punctuality: 5 },
        campaignTitle: 'Heritage Bridal 2025',
        date: '2025-01-20',
        isVerifiedBooking: true,
        helpfulCount: 42,
        brandResponse: 'Thank you for the kind words, Sabya! It was an honor to work with the team.'
      },
      {
        id: 'r2',
        bookingId: 'b2',
        reviewerName: 'Dior India',
        reviewerRole: 'brand',
        reviewerBrandName: 'Dior',
        subjectId: 't2',
        rating: 4.8,
        headline: 'Elegant and Adaptable',
        body: 'Excellent performance during the Spring Couture shoot. Kiara is highly adaptable to different lighting and set environments.',
        tags: [
          { label: 'Versatile', positive: true },
          { label: 'Professional', positive: true }
        ],
        categories: { professionalism: 5, communication: 4, creativity: 5, punctuality: 5 },
        campaignTitle: 'Spring Couture 25',
        date: '2024-12-15',
        isVerifiedBooking: true,
        helpfulCount: 28
      }
    ],
    availabilityStatus: 'available',
    availabilityCalendar: [
      { date: '2025-03-03', status: 'available' },
      { date: '2025-03-04', status: 'busy' },
      { date: '2025-03-05', status: 'available' },
      { date: '2025-03-06', status: 'available' },
      { date: '2025-03-07', status: 'busy' },
      { date: '2025-03-08', status: 'available' },
      { date: '2025-03-09', status: 'available' }
    ],
    analytics: {
      reach: 250000,
      engagement: 8.4,
      growth: 12.5,
      topMarkets: ['Mumbai', 'Delhi', 'New York', 'London'],
      monthlyViews: [
        { month: 'Oct', value: 120000 },
        { month: 'Nov', value: 145000 },
        { month: 'Dec', value: 190000 },
        { month: 'Jan', value: 210000 },
        { month: 'Feb', value: 250000 }
      ]
    },
    arMeasurements: {
      talentId: 't2',
      verifiedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 85).toISOString(),
      verificationMethod: 'AR Scan',
      unit: 'cm',
      height: 178,
      bust: 88,
      waist: 65,
      hips: 92,
      inseam: 80,
      shoulder: 40,
      neck: 35,
      shoeSize: 'UK 7 / EU 41',
      topSize: 'M',
      bottomSize: '30',
      dressSize: 'UK 10 / US 6',
      arConfidence: 96,
    }
  },
  {
    id: 't3',
    username: 'neil_strokes',
    displayName: 'Neil D-Souza',
    avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/neil_avatar_retry_1772387442552.png',
    coverUrl: 'https://images.unsplash.com/photo-1523381235312-3f113d27dea3?auto=format&fit=crop&q=80&w=1200',
    role: UserRole.STYLIST,
    verificationLevel: VerificationLevel.BASIC,
    isVerified: false,
    isBoosted: false,
    bio: 'Celebrity stylist focusing on non-binary fashion and streetwear.',
    followersCount: 5400,
    followingCount: 800,
    location: 'Bangalore, India',
    completionScore: 65,
    rankingScore: 420,
    rankPosition: 45,
    brandCollaborationsCount: 4,
    subscription: { type: SubscriptionType.BASIC, endDate: '2025-12-31' }
  },
  {
    id: 't4',
    username: 'zoya_vision',
    displayName: 'Zoya Qureshi',
    avatarUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=800',
    coverUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    role: UserRole.ARTIST,
    verificationLevel: VerificationLevel.APPROVED,
    isVerified: true,
    isBoosted: true,
    bio: 'Cinematic fashion photographer capturing the soul of Indian streets and high couture.',
    followersCount: 22000,
    followingCount: 500,
    location: 'Kolkata, India',
    completionScore: 98,
    rankingScore: 890,
    rankPosition: 5,
    brandCollaborationsCount: 15,
    subscription: { type: SubscriptionType.PROFESSIONAL, endDate: '2025-10-20' }
  },
  {
    id: 't5',
    username: 'kabir_runway',
    displayName: 'Kabir Vohra',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    coverUrl: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=1200',
    role: UserRole.MODEL,
    verificationLevel: VerificationLevel.PREMIUM,
    isVerified: true,
    isBoosted: true,
    bio: 'International runway model for LV, Dior, and Sabyasachi. Fitness enthusiast.',
    followersCount: 125000,
    followingCount: 300,
    location: 'London / Mumbai',
    height: "6'2\"",
    completionScore: 100,
    rankingScore: 995,
    rankPosition: 3,
    brandCollaborationsCount: 42,
    subscription: { type: SubscriptionType.PREMIUM, endDate: '2026-01-01' },
    coverVideoUrl: 'https://cdn.pixabay.com/video/2021/08/13/84951-587265888_large.mp4',
    achievements: [
      { id: 'a4', title: 'LV Paris Runway', date: '2024-10', type: 'EVENT' },
      { id: 'a5', title: 'Dior Global Amb.', date: '2025-01', type: 'COLLAB' },
      { id: 'a6', title: 'GQ Talent of Year', date: '2024-11', type: 'PUBLICATION' }
    ],
    lookbooks: [
      {
        id: 'lb3',
        creatorId: 't5',
        title: 'Milan Runway',
        subtitle: 'SS24 Highlights',
        coverImage: 'https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&q=80&w=800',
        images: [
          'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800'
        ],
        tags: ['Runway', 'Luxury', 'Elegance'],
        createdAt: '2024-11-01'
      }
    ],
    endorsements: [
      {
        id: 'e3',
        talentId: 't5',
        brandName: 'GQ Style',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/GQ_logo.svg/1200px-GQ_logo.svg.png',
        content: 'The definitive face of modern luxury menswear.',
        date: '2024-11',
        verified: true
      }
    ],
  },
  {
    id: 't6',
    username: 'isha_curve',
    displayName: 'Isha Deshmukh',
    avatarUrl: 'https://images.unsplash.com/photo-1589156191108-c762ff4b96ab?auto=format&fit=crop&q=80&w=800',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200',
    role: UserRole.MODEL,
    verificationLevel: VerificationLevel.APPROVED,
    isVerified: true,
    isBoosted: false,
    bio: 'Plus-size model breaking barriers in the Indian fashion industry. Body positivity advocate.',
    followersCount: 45000,
    followingCount: 900,
    location: 'Pune, India',
    completionScore: 92,
    rankingScore: 780,
    rankPosition: 12,
    brandCollaborationsCount: 18,
    subscription: { type: SubscriptionType.PROFESSIONAL, endDate: '2025-09-15' }
  },
  {
    id: 't7',
    username: 'rahul_mua',
    displayName: 'Rahul Verma',
    avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7ee504e3a?auto=format&fit=crop&q=80&w=800',
    coverUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
    role: UserRole.MUA,
    verificationLevel: VerificationLevel.APPROVED,
    isVerified: true,
    isBoosted: false,
    bio: 'Avant-garde makeup artist. Specializing in SFX and high-fashion editorial looks.',
    followersCount: 32000,
    followingCount: 1100,
    location: 'Mumbai, India',
    completionScore: 88,
    rankingScore: 720,
    rankPosition: 18,
    brandCollaborationsCount: 22,
    subscription: { type: SubscriptionType.PROFESSIONAL, endDate: '2025-08-30' }
  },
  {
    id: 't8',
    username: 'digital_drape',
    displayName: 'Elena Rodriguez',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800',
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200',
    role: UserRole.ARTIST,
    verificationLevel: VerificationLevel.PREMIUM,
    isVerified: true,
    isBoosted: true,
    bio: '3D Fashion Artist & Digital Weaver. Creating the future of virtual clothing.',
    followersCount: 67000,
    followingCount: 200,
    location: 'Madrid / Metaverse',
    completionScore: 99,
    rankingScore: 940,
    rankPosition: 4,
    brandCollaborationsCount: 10,
    subscription: { type: SubscriptionType.PREMIUM, endDate: '2026-02-14' }
  }
];

export const MOCK_BRANDS: Brand[] = [
  { id: 'b1', brand_name: 'ZARA India', logo_url: 'https://logo.clearbit.com/zara.com', description: 'Global fast-fashion leader with deep roots in creative excellence.', location: 'Mumbai', industry: 'Fast Fashion', created_at: '2024-01-01' },
  { id: 'b2', brand_name: 'Sabyasachi', logo_url: 'https://logo.clearbit.com/sabyasachi.com', description: 'Luxury Indian heritage wear redefining global couture.', location: 'Kolkata', industry: 'Couture', created_at: '2024-02-15' },
  { id: 'b3', brand_name: 'Vogue India', logo_url: 'https://logo.clearbit.com/vogue.in', description: 'The ultimate authority on fashion and lifestyle in India.', location: 'Mumbai', industry: 'Media', created_at: '2024-03-01' },
  { id: 'b4', brand_name: 'Raw Mango', logo_url: 'https://logo.clearbit.com/rawmango.com', description: 'Contemporary Indian handloom luxury brand.', location: 'Delhi', industry: 'Ethnic Wear', created_at: '2024-04-10' },
  { id: 'b5', brand_name: 'H&M India', logo_url: 'https://logo.clearbit.com/hm.com', description: 'Fashion and quality at the best price in a sustainable way.', location: 'Mumbai', industry: 'Fast Fashion', created_at: '2024-05-20' },
  { id: 'b6', brand_name: 'Anita Dongre', logo_url: 'https://logo.clearbit.com/anitadongre.com', description: 'Sustainable luxury fashion inspired by Indian heritage.', location: 'Mumbai', industry: 'Luxury', created_at: '2024-06-15' }
];

export const MOCK_CASTINGS: CastingCall[] = [
  { id: 'c1', brand_id: 'b1', company_name: 'ZARA India', role_title: 'Summer Lead Model', category: UserRole.MODEL, location: 'Mumbai', shoot_date: '2025-05-10', budget: '₹50,000', description: 'Seeking fresh faces for Summer campaign.', contact_email: 'casting@zara.in', created_at: '2025-03-01', requirements: ['Min height 5\'8"', 'Availability in May'] },
  { id: 'c2', brand_id: 'b2', company_name: 'Sabyasachi', role_title: 'Heritage Bridal MUA', category: UserRole.MUA, location: 'Kolkata', shoot_date: '2025-06-15', budget: '₹75,000', description: 'Editorial bridal campaign.', contact_email: 'studio@sabyasachi.com', created_at: '2025-03-05', requirements: ['Portfolio with bridal work'] }
];

export const MOCK_EDITORIALS: Editorial[] = [
  { id: 'e1', title: 'Neo-Tradition Editorial', media_url: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/editorial_neo_tradition_1772387458922.png', photographer_name: 'Antigravity AI', category: 'High Fashion', created_at: '2025-03-01' },
  { id: 'e2', title: 'Minimalist Future', media_url: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/editorial_minimalist_future_1772387475918.png', photographer_name: 'Antigravity AI', category: 'Lookbook', created_at: '2025-02-15' }
];

// Added MOCK_SHOOTS alias for MOCK_EDITORIALS
export const MOCK_SHOOTS = MOCK_EDITORIALS;

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1', authorId: 't1', author: MOCK_TALENT_POOL[0], type: 'IMAGE',
    mediaUrls: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1539109132384-3615557ef7c3?auto=format&fit=crop&q=80&w=800'
    ],
    caption: 'Narrative Stack: From raw concept to editorial finish. #FFN #Sustainability',
    likes: 1240, comments: 45, createdAt: '2h', tags: ['DESIGNER', 'SUSTAINABLE']
  },
  {
    id: 'p2', authorId: 't2', author: MOCK_TALENT_POOL[1], type: 'IMAGE',
    mediaUrls: ['https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=800'],
    caption: 'Golden hour in Milan. Editorial shoot for the summer issue.',
    likes: 5600, comments: 128, createdAt: '5h', tags: ['MODEL', 'MILAN']
  },
  {
    id: 'r1', authorId: 't2', author: MOCK_TALENT_POOL[1], type: 'REEL',
    mediaUrls: ['https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_08_GOPR5265_preview.mp4'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=800',
    caption: 'Walking for the Summer Heritage 2025. #Runway #HighFashion', likes: 8500, comments: 240, createdAt: '1d', tags: ['RUNWAY', 'MODEL']
  },
  {
    id: 'r2', authorId: 't4', author: MOCK_TALENT_POOL[3], type: 'REEL',
    mediaUrls: ['https://joy1.videvo.net/videvo_files/video/free/2019-01/large_watermarked/181212_04_Fashion_05_preview.mp4'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800',
    caption: 'Captured the movement of the velvet drape. Editorial motion.', likes: 3200, comments: 85, createdAt: '2d', tags: ['EDITORIAL', 'MOTION']
  }
];

export const MOCK_REELS: Post[] = [
  MOCK_POSTS[2],
  MOCK_POSTS[3],
  {
    id: 'r3', authorId: 't2', author: MOCK_TALENT_POOL[1], type: 'REEL',
    mediaUrls: ['https://joy1.videvo.net/videvo_files/video/free/2019-11/large_watermarked/190301_08_GOPR5261_preview.mp4'],
    thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800',
    caption: 'Ethereal vibes for the latest jewelry collection.', likes: 12400, comments: 512, createdAt: '3d', tags: ['JEWELRY', 'ETHIEREAL']
  }
];

export const MOCK_MOOD_BOARDS: MoodBoard[] = [
  {
    id: 'mb1',
    title: "Summer Heritage '25 - ZARA Collab",
    description: 'Reference images, lighting ideas, and model inspiration for the upcoming fusion campaign in Rajasthan.',
    created_by: 't1',
    created_at: '2025-03-01T10:00:00Z',
    coverImage: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/moodboard_cover_summer_heritage_1772387506476.png',
    collaborators: [
      { user_id: 't1', role: 'OWNER', user: MOCK_TALENT_POOL[0] },
      { user_id: 't2', role: 'EDITOR', user: MOCK_TALENT_POOL[1] },
      { user_id: 't3', role: 'VIEWER', user: MOCK_TALENT_POOL[2] }
    ],
    items: [
      { id: 'mbi1', board_id: 'mb1', media_url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=600', note: 'Love the stark contrast here. Let\'s try to replicate this lighting.', added_by: 't1', added_at: '2025-03-01T10:15:00Z' },
      { id: 'mbi2', board_id: 'mb1', media_url: 'https://images.unsplash.com/photo-1529139513065-07b3b1bfde91?auto=format&fit=crop&q=80&w=600', note: 'Minimalist approach for the secondary shots.', added_by: 't2', added_at: '2025-03-01T11:00:00Z' },
      { id: 'mbi3', board_id: 'mb1', media_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600', added_by: 't1', added_at: '2025-03-01T11:30:00Z' }
    ],
    comments: [
      { id: 'mbc1', board_id: 'mb1', user_id: 't2', content: 'Should we scout locations in Jaipur or Jodhpur?', created_at: '2025-03-01T12:00:00Z', user: MOCK_TALENT_POOL[1] },
      { id: 'mbc2', board_id: 'mb1', user_id: 't1', content: 'Jodhpur (Blue City) would provide a better contrast against the new collection\'s color palette.', created_at: '2025-03-01T12:05:00Z', user: MOCK_TALENT_POOL[0] }
    ],
    isDemoContent: true
  },
  {
    id: 'mb2',
    title: 'Neon Noir - Streetwear Drop',
    description: 'Cyberpunk inspired night shoot in Tokyo / Cyber Hub.',
    created_by: 't3',
    created_at: '2025-02-28T14:00:00Z',
    coverImage: 'https://images.unsplash.com/photo-1510006851064-e6056cd0e3a8?auto=format&fit=crop&q=80&w=800',
    collaborators: [
      { user_id: 't3', role: 'OWNER', user: MOCK_TALENT_POOL[2] }
    ],
    items: [],
    comments: [],
    isDemoContent: true
  }
];

export const MOCK_PARTICIPANTS: CastingParticipant[] = [
  {
    id: 'p1',
    castingId: 'lc1',
    userId: 't2', // Priya Sharma
    user: MOCK_TALENT_POOL.find(u => u.id === 't2'),
    status: 'in_call',
    joinedAt: new Date(Date.now() - 500000).toISOString() // 8 mins ago
  },
  {
    id: 'p2',
    castingId: 'lc1',
    userId: 't4', // Kunal Murari (Model)
    user: MOCK_TALENT_POOL.find(u => u.id === 't4'),
    status: 'waiting',
    joinedAt: new Date(Date.now() - 300000).toISOString() // 5 mins ago
  },
  {
    id: 'p3',
    castingId: 'lc1',
    userId: 't3', // Rahul Verma 
    user: MOCK_TALENT_POOL.find(u => u.id === 't3'),
    status: 'passed',
    joinedAt: new Date(Date.now() - 1200000).toISOString()
  }
];

export const MOCK_LIVE_CASTINGS: LiveCasting[] = [
  {
    id: 'lc1',
    castingId: 'c1',
    brandId: 'b1', // Condé Nast
    title: 'Vogue India - Summer Editorial Casting',
    status: 'live',
    currentParticipantId: 'p1',
    participants: MOCK_PARTICIPANTS
  }
];

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'ctr_001',
    castingId: 'c1',
    brandId: 'b1', // Condé Nast
    talentId: 't4', // Kunal Murari (Model context)
    type: 'Model Release',
    status: 'pending_talent',
    terms: `STANDARD MODEL RELEASE AGREEMENT\n\nFor valuable consideration received, I hereby grant to the Brand ("Photographer/Brand") the absolute and irrevocable right and unrestricted permission concerning any photographs that they have taken or may take of me or in which I may be included with others, to use, reuse, publish, and republish the same in whole or in part, individually or in connection with other material, in any and all media now or hereafter known, including the internet, and for any purpose whatsoever, specifically including illustration, promotion, art, editorial, advertising, and trade, without restriction as to alteration.\n\nI hereby release and discharge Photographer/Brand from any and all claims and demands that may arise out of or in connection with the use of the photographs, including without limitation any and all claims for libel or violation of any right of publicity or privacy.\n\nThis authorization and release shall also inure to the benefit of the heirs, legal representatives, licensees, and assigns of Photographer/Brand, as well as the person(s) for whom they took the photographs.\n\nI am a legally competent adult and have the right to contract in my own name. I have read this document and fully understand its contents. This release shall be binding upon me and my heirs, legal representatives, and assigns.`,
    brandSignature: {
      name: 'Priya Sharma (Condé Nast)',
      date: new Date().toISOString()
    },
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    updatedAt: new Date().toISOString()
  },
  {
    id: 'ctr_002',
    castingId: 'c2',
    brandId: 'b2', // Sabyasachi
    talentId: 't2', // Priya Sharma (MUA context)
    type: 'NDA',
    status: 'completed',
    terms: `NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement (the "Agreement") is entered into to protect confidential information related to the upcoming Heritage Bridal Campaign.\n\n1. Confidential Information: All designs, concepts, locations, and styling details shared are strictly confidential.\n2. Non-Disclosure: The receiving party agrees not to disclose, share, photograph, or distribute any confidential information to third parties or via social media until official release.\n3. Term: This agreement remains in effect indefinitely.`,
    brandSignature: {
      name: 'Aditi Verma (Sabyasachi)',
      date: new Date(Date.now() - 172800000).toISOString() // 2 days ago
    },
    talentSignature: {
      name: 'Priya Sharma',
      date: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_RENTAL_LISTINGS: RentalListing[] = [
  {
    id: 'rl_001',
    ownerId: 't1',
    title: 'Premium Photography Studio — Bandra West',
    description: 'A fully air-conditioned 1,500 sqft photography studio with 5m cyclorama wall, 4m ceiling height, and a dedicated makeup/styling area. Natural north-facing skylight. Professional grade power supply (20A sockets). Parking for 3 vehicles.',
    category: 'Studio Space',
    pricePerDay: 8500,
    pricePerHour: 1200,
    location: 'Bandra West, Mumbai',
    images: ['https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800', 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
    amenities: ['Cyclorama Wall', 'Natural Light', 'AC', 'Makeup Room', 'WiFi', 'Parking'],
    isAvailable: true,
    rating: 4.9,
    reviewCount: 34,
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString()
  },
  {
    id: 'rl_002',
    ownerId: 't2',
    title: 'Profoto B10 Plus Duo Kit — Professional Lighting',
    description: 'Two Profoto B10 Plus monolights (with batteries), 2x octaboxes (60cm & 120cm), 2x softboxes, stands, and reflectors. All packed in a custom Pelican case. A complete professional portrait lighting setup.',
    category: 'Lighting',
    pricePerDay: 2200,
    pricePerHour: 500,
    location: 'Andheri East, Mumbai',
    images: ['https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800'],
    amenities: ['Battery Powered', 'TTL Compatible', 'Air-Cushioned Stand'],
    isAvailable: true,
    rating: 5.0,
    reviewCount: 12,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: 'rl_003',
    ownerId: 't3',
    title: 'Sony FX3 Full-Frame Cinema Camera Kit',
    description: 'Sony FX3 cinema camera body with a full lens kit: 16-35mm f/2.8 GM, 50mm f/1.4 GM, 85mm f/1.4 GM. Includes V-mount battery system, cage, and SmallHD monitor. Ideal for high-fashion campaigns and films.',
    category: 'Camera & Lenses',
    pricePerDay: 5500,
    location: 'Juhu, Mumbai',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
    amenities: ['4K 120fps', 'Internal ND Filter', 'Full-Frame Sensor', 'Cage & Monitor Included'],
    isAvailable: false,
    rating: 4.8,
    reviewCount: 7,
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString()
  },
  {
    id: 'rl_004',
    ownerId: 't5',
    title: 'Vintage Sabyasachi Archive — 60 Pieces',
    description: 'A curated archive of 60 archive pieces from Sabyasachi Mukherjee including lehengas, sherwanis, and saris from 2018–2022 collections. Perfect for heritage shoots, editorial work, and bridal inspiration campaigns. All in excellent condition.',
    category: 'Wardrobe Archive',
    pricePerDay: 12000,
    location: 'South Delhi',
    images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'],
    amenities: ['Steamed & Ready', 'Personal Stylist Available', 'Insurance Required'],
    isAvailable: true,
    rating: 4.7,
    reviewCount: 19,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: 'rl_005',
    ownerId: 't1',
    title: 'Art Deco Prop Collection — 200+ Pieces',
    description: 'Curated Art Deco and vintage prop collection including ornate mirrors, vintage furniture, floral arrangements, and set dressing elements. Used on Vogue India and Harper\'s Bazaar shoots. Available for short-term on-location hire.',
    category: 'Props & Sets',
    pricePerDay: 3500,
    pricePerHour: 800,
    location: 'Connaught Place, New Delhi',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
    amenities: ['Delivery Available', 'Setup Assistance', '200+ Unique Pieces'],
    isAvailable: true,
    rating: 4.6,
    reviewCount: 8,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  },
];

export const MOCK_MASTERCLASSES = [
  {
    id: 'mc_001',
    instructorId: 't1',
    title: 'The Art of Editorial Portraiture',
    subtitle: 'Master the craft of high-fashion portraiture used in Vogue, Harper\'s Bazaar, and Elle India.',
    format: 'Course' as const,
    level: 'Advanced' as const,
    category: 'Photography',
    coverImage: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800',
    price: 3999,
    originalPrice: 6999,
    lessons: [
      { id: 'l1', title: 'Understanding Editorial Vision', durationMins: 28, isPreview: true },
      { id: 'l2', title: 'Lighting for High-Fashion', durationMins: 45 },
      { id: 'l3', title: 'Working with Models on Set', durationMins: 38 },
      { id: 'l4', title: 'Post-Processing the Editorial Look', durationMins: 52 },
      { id: 'l5', title: 'Building Your Magazine Portfolio', durationMins: 35 },
    ],
    enrolledCount: 1247,
    rating: 4.9,
    reviewCount: 312,
    skills: ['Lighting Techniques', 'Editorial Composition', 'Model Direction', 'Capture One Workflow', 'Agency Submission'],
    isLive: true,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString()
  },
  {
    id: 'mc_002',
    instructorId: 't3',
    title: 'Runway Confidence Masterclass',
    subtitle: 'A 1-on-1 coaching session with a veteran runway coach. Transform your walk, posture, and stage presence in 90 minutes.',
    format: '1-on-1 Session' as const,
    level: 'Intermediate' as const,
    category: 'Modelling',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    price: 2499,
    durationMins: 90,
    nextSessionDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    enrolledCount: 89,
    rating: 5.0,
    reviewCount: 67,
    skills: ['Catwalk Technique', 'Stage Presence', 'Posture & Poise', 'Turn & Pivot Mastery', 'Casting Preparation'],
    isLive: true,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString()
  },
  {
    id: 'mc_003',
    instructorId: 't2',
    title: 'Fashion Styling: From Brief to Shoot Day',
    subtitle: 'A live group webinar covering how professional stylists interpret brand briefs, source wardrobe, and manage shoot logistics.',
    format: 'Live Webinar' as const,
    level: 'Beginner' as const,
    category: 'Styling',
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    price: 1299,
    durationMins: 120,
    nextSessionDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    enrolledCount: 408,
    rating: 4.7,
    reviewCount: 128,
    skills: ['Brief Interpretation', 'Wardrobe Sourcing', 'Brand Aesthetics', 'Shoot Day Management', 'Client Communication'],
    isLive: true,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString()
  },
  {
    id: 'mc_004',
    instructorId: 't1',
    title: 'Portfolio Review & Agency Readiness',
    subtitle: 'A 60-minute 1-on-1 portfolio critique from a working agency photographer. Walk away with a clear action plan.',
    format: 'Portfolio Review' as const,
    level: 'Beginner' as const,
    category: 'Photography',
    coverImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
    price: 1799,
    durationMins: 60,
    nextSessionDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    enrolledCount: 156,
    rating: 4.8,
    reviewCount: 91,
    skills: ['Portfolio Curation', 'Agency Pitch', 'Image Sequencing', 'Commercial vs Editorial Balance'],
    isLive: true,
    createdAt: new Date(Date.now() - 86400000 * 45).toISOString()
  },
  {
    id: 'mc_005',
    instructorId: 't4',
    title: 'Brand Partnerships for Creative Talent',
    subtitle: 'How to pitch, negotiate, and close brand deals as a model, photographer, or stylist. From DMs to contracts.',
    format: 'Course' as const,
    level: 'Intermediate' as const,
    category: 'Business',
    coverImage: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
    price: 2799,
    originalPrice: 4499,
    lessons: [
      { id: 'l1', title: 'Finding the Right Brand Fit', durationMins: 22, isPreview: true },
      { id: 'l2', title: 'Crafting the Perfect Pitch Deck', durationMins: 35 },
      { id: 'l3', title: 'Rate Negotiation & Contracts', durationMins: 40 },
      { id: 'l4', title: 'Deliverables & Professional Conduct', durationMins: 28 },
    ],
    enrolledCount: 673,
    rating: 4.6,
    reviewCount: 189,
    skills: ['Brand Outreach', 'Pitch Decks', 'Negotiation', 'Contract Basics', 'Deliverables Management'],
    isLive: true,
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString()
  }
];

import { ARBodyMeasurements } from './types';

export const MOCK_AR_MEASUREMENTS: ARBodyMeasurements[] = [
  {
    talentId: 't1',
    verifiedAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 78).toISOString(),
    verificationMethod: 'AR Scan',
    unit: 'cm',
    height: 175,
    bust: 86,
    waist: 62,
    hips: 90,
    inseam: 82,
    shoulder: 38,
    neck: 34,
    sleeve: 60,
    thigh: 54,
    shoeSize: 'UK 6 / EU 39',
    topSize: 'S',
    bottomSize: '28',
    dressSize: 'UK 8 / US 4',
    arConfidence: 98,
  },
  {
    talentId: 't2',
    verifiedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 85).toISOString(),
    verificationMethod: 'AR Scan',
    unit: 'cm',
    height: 178,
    bust: 88,
    waist: 65,
    hips: 92,
    inseam: 80,
    shoulder: 40,
    neck: 35,
    thigh: 56,
    shoeSize: 'UK 7 / EU 41',
    topSize: 'M',
    bottomSize: '30',
    dressSize: 'UK 10 / US 6',
    arConfidence: 96,
  },
  {
    talentId: 't3',
    verifiedAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    expiresAt: new Date(Date.now() - 86400000 * 30).toISOString(), // expired
    verificationMethod: 'AR Scan',
    unit: 'cm',
    height: 180,
    bust: 90,
    waist: 68,
    hips: 95,
    inseam: 84,
    shoulder: 41,
    shoeSize: 'UK 8 / EU 42',
    topSize: 'M',
    bottomSize: '32',
    dressSize: 'UK 12 / US 8',
    arConfidence: 94,
  },
  {
    talentId: 't4',
    verifiedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 87).toISOString(),
    verificationMethod: 'Manual (Unverified)',
    unit: 'cm',
    height: 172,
    bust: 84,
    waist: 60,
    hips: 88,
    inseam: 78,
    shoulder: 37,
    shoeSize: 'UK 5 / EU 38',
    topSize: 'XS',
    bottomSize: '26',
    dressSize: 'UK 6 / US 2',
    arConfidence: 0,
  },
];

import { EarningsTransaction, EarningsMonthlySummary } from './types';

export const MOCK_EARNINGS_TRANSACTIONS: EarningsTransaction[] = [
  { id: 'txn_001', talentId: 't1', date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 42500, grossAmount: 50000, stream: 'Brand Deal', description: 'Summer Campaign — Lifestyle shoot, 2 days', brandOrClient: 'Mango India', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 1).toISOString() },
  { id: 'txn_002', talentId: 't1', date: new Date(Date.now() - 86400000 * 5).toISOString(), amount: 3194, grossAmount: 3999, stream: 'Masterclass', description: 'Enrollment — The Art of Editorial Portraiture', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'txn_003', talentId: 't1', date: new Date(Date.now() - 86400000 * 8).toISOString(), amount: 3400, grossAmount: 4000, stream: 'Rental Income', description: 'Profoto B10 kit — 2-day rental, @nikhil_shoots', brandOrClient: 'Nikhil Sharma', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'txn_004', talentId: 't1', date: new Date(Date.now() - 86400000 * 12).toISOString(), amount: 17000, grossAmount: 20000, stream: 'Casting Booking', description: 'Runway Walk — Lakme Fashion Week Pre-show', brandOrClient: 'FFN Casting', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 10).toISOString() },
  { id: 'txn_005', talentId: 't1', date: new Date(Date.now() - 86400000 * 15).toISOString(), amount: 500, grossAmount: 500, stream: 'Referral Bonus', description: 'Referral payout — @priya_model joined FFN Pro', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 13).toISOString() },
  { id: 'txn_006', talentId: 't1', date: new Date(Date.now() - 86400000 * 3).toISOString(), amount: 25500, grossAmount: 30000, stream: 'Brand Deal', description: 'Product shot series — 6 images, exclusivity 30d', brandOrClient: 'Nykaa Fashion', status: 'processing' },
  { id: 'txn_007', talentId: 't1', date: new Date(Date.now() - 86400000 * 1).toISOString(), amount: 1439, grossAmount: 1799, stream: 'Masterclass', description: 'Enrollment — Portfolio Review & Agency Readiness', status: 'paid', payoutDate: new Date().toISOString() },
  { id: 'txn_008', talentId: 't1', date: new Date(Date.now() + 86400000 * 5).toISOString(), amount: 63750, grossAmount: 75000, stream: 'Brand Deal', description: 'Annual contract — Brand Ambassador Q2', brandOrClient: 'W for Woman', status: 'pending' },
  { id: 'txn_009', talentId: 't1', date: new Date(Date.now() - 86400000 * 20).toISOString(), amount: 5950, grossAmount: 7000, stream: 'Casting Booking', description: 'E-commerce shoot — 48 looks over 3 days', brandOrClient: 'Myntra', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 18).toISOString() },
  { id: 'txn_010', talentId: 't1', date: new Date(Date.now() - 86400000 * 25).toISOString(), amount: 2394, grossAmount: 2799, stream: 'Masterclass', description: 'Enrollment — Brand Partnerships for Creative Talent', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 23).toISOString() },
  { id: 'txn_011', talentId: 't1', date: new Date(Date.now() - 86400000 * 28).toISOString(), amount: 1500, grossAmount: 1500, stream: 'Referral Bonus', description: '3 referral payouts — March cohort', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 26).toISOString() },
  { id: 'txn_012', talentId: 't1', date: new Date(Date.now() - 86400000 * 33).toISOString(), amount: 34000, grossAmount: 40000, stream: 'Brand Deal', description: 'Lookbook campaign — 12 hero images', brandOrClient: 'H&M India', status: 'paid', payoutDate: new Date(Date.now() - 86400000 * 30).toISOString() },
];

export const MOCK_EARNINGS_MONTHLY: EarningsMonthlySummary[] = [
  { month: 'Sep', totalEarned: 48000, brandDeals: 30000, masterclasses: 8000, rentals: 5000, bookings: 4000, referrals: 1000 },
  { month: 'Oct', totalEarned: 62500, brandDeals: 42000, masterclasses: 10000, rentals: 4500, bookings: 5000, referrals: 1000 },
  { month: 'Nov', totalEarned: 55000, brandDeals: 35000, masterclasses: 12000, rentals: 3000, bookings: 4000, referrals: 1000 },
  { month: 'Dec', totalEarned: 91000, brandDeals: 65000, masterclasses: 14000, rentals: 5000, bookings: 5000, referrals: 2000 },
  { month: 'Jan', totalEarned: 74500, brandDeals: 50000, masterclasses: 11000, rentals: 6000, bookings: 6000, referrals: 1500 },
  { month: 'Feb', totalEarned: 1, brandDeals: 0, masterclasses: 0, rentals: 0, bookings: 0, referrals: 0 }, // placeholder start
  { month: 'Mar', totalEarned: 98083, brandDeals: 67500, masterclasses: 9027, rentals: 3400, bookings: 16000, referrals: 2000, },
];




import { TrendSignal } from './types';

export const MOCK_TREND_SIGNALS: TrendSignal[] = [
  {
    id: 'tr_001', name: 'Quiet Luxury', category: 'Aesthetic', momentum: 'Exploding' as const,
    currentScore: 94, weeklyChange: +18,
    description: 'Understated, logo-free dressing rooted in quality fabrics, neutral palettes, and impeccable tailoring. The anti-streetwear.',
    tags: ['Minimalism', 'Tailoring', 'Neutral Palette', 'Premium Basics', 'Cashmere'],
    relatedBrands: ['Brunello Cucinelli India', 'Massimo Dutti', 'W for Woman'],
    coverImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    sparkline: [{ week: 'W8', score: 48 }, { week: 'W9', score: 55 }, { week: 'W10', score: 63 }, { week: 'W11', score: 71 }, { week: 'W12', score: 80 }, { week: 'W13', score: 94 }],
  },
  {
    id: 'tr_002', name: 'India Couture Revival', category: 'Occasion', momentum: 'Rising' as const,
    currentScore: 88, weeklyChange: +11,
    description: 'Post-pandemic resurgence of high-craft Indian bridal and occasion wear. Brands like Sabyasachi and Abu Jani are seeing 3x demand.',
    tags: ['Bridal', 'Sabyasachi', 'Embroidery', 'Handloom', 'Occasion Wear'],
    relatedBrands: ['Sabyasachi', 'Anita Dongre', 'Manish Malhotra'],
    coverImage: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800',
    sparkline: [{ week: 'W8', score: 60 }, { week: 'W9', score: 65 }, { week: 'W10', score: 71 }, { week: 'W11', score: 78 }, { week: 'W12', score: 82 }, { week: 'W13', score: 88 }],
  },
  {
    id: 'tr_003', name: 'Cobalt Blue Saturation', category: 'Colour', momentum: 'Exploding' as const,
    currentScore: 91, weeklyChange: +22,
    description: 'Cobalt blue has overtaken Gen Z yellow and Barbie pink as the hero colour of the season, appearing across runway and Instagram at exponential rates.',
    tags: ['Cobalt Blue', 'Bold Colour', 'Statement', 'SS26 Colour'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    sparkline: [{ week: 'W8', score: 30 }, { week: 'W9', score: 42 }, { week: 'W10', score: 60 }, { week: 'W11', score: 74 }, { week: 'W12', score: 84 }, { week: 'W13', score: 91 }],
  },
  {
    id: 'tr_004', name: 'Oversized Blazer', category: 'Silhouette', momentum: 'Stable' as const,
    currentScore: 72, weeklyChange: +2,
    description: 'The oversized power blazer remains a wardrobe staple — consistent search volume and a safe bet for brand campaigns targeting 25-40 professionals.',
    tags: ['Blazer', 'Workwear', 'Power Dressing', 'Oversized'],
    coverImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4b4dcd?w=800',
    sparkline: [{ week: 'W8', score: 68 }, { week: 'W9', score: 70 }, { week: 'W10', score: 71 }, { week: 'W11', score: 73 }, { week: 'W12', score: 71 }, { week: 'W13', score: 72 }],
  },
  {
    id: 'tr_005', name: 'Gorpcore Outdoors', category: 'Aesthetic', momentum: 'Rising' as const,
    currentScore: 79, weeklyChange: +8,
    description: 'Technical outdoor fabrics — fleece, ripstop nylons, trail runners — infiltrating luxury campaigns. Brands seek talent who can pull off "mountain editorial".',
    tags: ['Gorpcore', 'Outdoor', 'Performance Fabric', 'Technical Wear'],
    coverImage: 'https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800',
    sparkline: [{ week: 'W8', score: 52 }, { week: 'W9', score: 58 }, { week: 'W10', score: 63 }, { week: 'W11', score: 70 }, { week: 'W12', score: 74 }, { week: 'W13', score: 79 }],
  },
  {
    id: 'tr_006', name: 'Logo Maximalism', category: 'Aesthetic', momentum: 'Declining' as const,
    currentScore: 38, weeklyChange: -12,
    description: 'Head-to-toe logomania is cooling fast. Consumers fatigued by overt branding are shifting to quieter signals of taste.',
    tags: ['Logomania', 'Status Dressing', 'Streetwear', 'Hypebeast'],
    coverImage: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?w=800',
    sparkline: [{ week: 'W8', score: 71 }, { week: 'W9', score: 65 }, { week: 'W10', score: 57 }, { week: 'W11', score: 49 }, { week: 'W12', score: 43 }, { week: 'W13', score: 38 }],
  },
  {
    id: 'tr_007', name: 'Organic Raw Fabrics', category: 'Fabric', momentum: 'Rising' as const,
    currentScore: 82, weeklyChange: +9,
    description: 'Unfinished hems, raw linens, hand-dyed cotton, and bamboo-based textiles are surging as Gen Z pushes sustainability into mainstream buying decisions.',
    tags: ['Sustainable', 'Linen', 'Organic Cotton', 'Raw Edge', 'Slow Fashion'],
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    sparkline: [{ week: 'W8', score: 55 }, { week: 'W9', score: 62 }, { week: 'W10', score: 68 }, { week: 'W11', score: 74 }, { week: 'W12', score: 78 }, { week: 'W13', score: 82 }],
  },
  {
    id: 'tr_008', name: 'Y2K Denim Revival', category: 'Silhouette', momentum: 'Declining' as const,
    currentScore: 44, weeklyChange: -8,
    description: 'Low-rise denim, bedazzled belts, and velour co-ords peaked in 2023 and are now firmly in the "overdone" category.',
    tags: ['Y2K', 'Low Rise', 'Denim', 'Nostalgia'],
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    sparkline: [{ week: 'W8', score: 68 }, { week: 'W9', score: 60 }, { week: 'W10', score: 55 }, { week: 'W11', score: 51 }, { week: 'W12', score: 47 }, { week: 'W13', score: 44 }],
  },
];

import { AppNotification } from './types';

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  { id: 'n_001', userId: 't1', type: 'hire', title: 'You\'ve been hired!', body: 'Nykaa Fashion has confirmed your booking for the Summer 2026 campaign shoot on March 15th. Check your contract.', timestamp: new Date(Date.now() - 60000 * 5).toISOString(), isRead: false, actionLabel: 'View Contract', actionRoute: '/my-profile' },
  { id: 'n_002', userId: 't1', type: 'payment', title: 'Payment received — ₹42,500', body: 'Mango India has released the escrow for your Summer Campaign shoot. Funds will appear in your account within 3 business days.', timestamp: new Date(Date.now() - 60000 * 18).toISOString(), isRead: false, actionLabel: 'View Earnings', actionRoute: '/earnings' },
  { id: 'n_003', userId: 't1', type: 'casting_match', title: 'New casting match — 94% fit', body: 'H&M India posted a SS26 editorial campaign seeking a model matching your exact profile. 89 applications so far.', timestamp: new Date(Date.now() - 60000 * 45).toISOString(), isRead: false, actionLabel: 'Apply Now', actionRoute: '/castings' },
  { id: 'n_004', userId: 't1', type: 'message', title: 'Arjun Mehta sent you a message', body: '"Hi! I loved your work on the Vogue India shoot. I\'m a photographer and would love to discuss a potential collaboration."', timestamp: new Date(Date.now() - 60000 * 90).toISOString(), isRead: false, actionLabel: 'Reply', actionRoute: '/messages', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
  { id: 'n_005', userId: 't1', type: 'contract', title: 'Contract awaiting your signature', body: 'W for Woman has sent you a Brand Ambassador agreement for Q2 2026. Please review and sign within 48 hours to confirm.', timestamp: new Date(Date.now() - 60000 * 120).toISOString(), isRead: false, actionLabel: 'Sign Now', actionRoute: '/my-profile' },
  { id: 'n_006', userId: 't1', type: 'casting_shortlist', title: 'Shortlisted! 🎉', body: 'You\'ve been shortlisted for the Lakme Fashion Week Pre-show by the casting director. Final selection in 2 days.', timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), isRead: true, actionLabel: 'View Casting', actionRoute: '/castings' },
  { id: 'n_007', userId: 't1', type: 'follow', title: 'Sabyasachi Studios followed you', body: 'Sabyasachi Studios started following your profile. Your portfolio is visible to their casting team.', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), isRead: true, actionRoute: '/my-profile', avatarUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100' },
  { id: 'n_008', userId: 't1', type: 'ar_verified', title: 'AR Measurements verified ✓', body: 'Your body measurements have been AR-verified and locked. Your profile now shows the verified badge — brands can trust your data.', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), isRead: true, actionLabel: 'View Profile', actionRoute: '/my-profile' },
  { id: 'n_009', userId: 't1', type: 'trend_alert', title: 'Trend alert — Quiet Luxury exploding 🔥', body: '"Quiet Luxury" has jumped +22% this week. 3 brands in your match list are actively seeking talent for this aesthetic right now.', timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), isRead: true, actionLabel: 'See Trends', actionRoute: '/trends' },
  { id: 'n_010', userId: 't1', type: 'review', title: 'New 5-star review from Myntra', body: '"Absolutely professional. Delivered all 48 looks perfectly. Would book again without hesitation." — Casting Director, Myntra', timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), isRead: true, actionRoute: '/my-profile' },
  { id: 'n_011', userId: 't1', type: 'system', title: 'Your Pro membership renews in 7 days', body: 'Your FFN Professional subscription renews on March 8th. You\'ll be charged ₹999. Manage your plan in Settings.', timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), isRead: true, actionLabel: 'Manage Plan', actionRoute: '/settings' },
  { id: 'n_012', userId: 't1', type: 'milestone', title: 'Milestone Updated: "Shoot Day"', body: 'Vogue India has marked the "Shoot Day" milestone as IN_PROGRESS for the Neo-Traditional Editorial.', timestamp: new Date(Date.now() - 60000 * 2).toISOString(), isRead: false, actionLabel: 'View War Room', actionRoute: '/war-room/cp1' },
];



export const MOCK_SYSTEM_ACTIVITY: SystemActivity[] = [
  { id: 'act_1', userId: 't1', userName: 'Aarav Sharma', action: 'uploaded a new reel', targetName: 'Editorial Flow v2', timestamp: new Date(Date.now() - 60000 * 10).toISOString(), category: 'PROJECT' },
  { id: 'act_2', userId: 'b1', userName: 'Vogue Team', action: 'updated milestone', targetName: 'Neo-Traditional Editorial', timestamp: new Date(Date.now() - 60000 * 30).toISOString(), category: 'PROJECT' },
  { id: 'act_3', userId: 't2', userName: 'Kiara Advani', action: 'joined the network', targetName: 'Verified Talent', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), category: 'NETWORK' },
  { id: 'act_4', userId: 'b2', userName: 'Nykaa Fashion', action: 'posted a casting', targetName: 'SS26 Campaign', timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), category: 'MARKETPLACE' },
];

// Casting calls

export const MOCK_CASTING_CALLS: CastingCall[] = [
  {
    id: 'cc_001',
    title: 'SS26 Brand Campaign — Lead Female Model',
    brandName: 'Nykaa Fashion',
    brandLogo: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100',
    brandVerified: true,
    city: 'Mumbai',
    shootDate: '2026-03-20',
    deadline: '2026-03-10',
    roles: ['Model'],
    compensation: 'Paid',
    fee: 85000,
    description: 'We are casting for the lead model in our Spring-Summer 2026 brand campaign. Looking for a confident, editorial-trained model who can adapt naturally to both high-fashion and lifestyle aesthetics.',
    requirements: ['Female, 18–28 years', 'Height 5\'8" minimum', 'Must be available for 3-day shoot', 'Portfolio with editorial experience required'],
    deliverables: ['Full day shoot (8 hrs)', '48 campaign looks', 'Usage rights — digital + print, 6 months'],
    status: 'Open',
    applicantCount: 94,
    maxApplicants: 150,
    tags: ['Editorial', 'Campaign', 'SS26', 'Mumbai', 'Paid'],
    coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    isUrgent: false,
    isFeatured: true,
    postedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    escrowProtected: true,
  },
  {
    id: 'cc_002',
    title: 'Lakme Fashion Week — Runway Models (6 Open)',
    brandName: 'Lakme Fashion Week',
    brandLogo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100',
    brandVerified: true,
    city: 'Mumbai',
    shootDate: '2026-03-28',
    deadline: '2026-03-12',
    roles: ['Model'],
    compensation: 'Paid',
    fee: 45000,
    description: '6 runway model positions for the LFW Summer-Resort 2026 show. Designers: Anita Dongre, Rohit Bal, Papa Don\'t Preach. Full rehearsal day + show day.',
    requirements: ['Female, 18–30', 'Height 5\'9" minimum', 'Runway walk experience mandatory', 'Must attend 2 full rehearsals'],
    deliverables: ['2 rehearsal days', '1 show day', 'Runway for 3 designers'],
    status: 'Closing Soon',
    applicantCount: 211,
    maxApplicants: 250,
    tags: ['Runway', 'LFW', 'Anita Dongre', 'Rohit Bal', 'Premium'],
    coverImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    isUrgent: true,
    isFeatured: true,
    postedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    escrowProtected: true,
  },
  {
    id: 'cc_003',
    title: 'Concept Editorial — Photographer Wanted',
    brandName: 'Harper\'s Bazaar India',
    brandLogo: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=100',
    brandVerified: true,
    city: 'Delhi',
    shootDate: '2026-03-25',
    deadline: '2026-03-15',
    roles: ['Photographer'],
    compensation: 'Paid',
    fee: 120000,
    description: 'Seeking a visionary photographer for a 4-page editorial spread for the April 2026 print issue. Theme: "The New India." Looking for someone who can blend documentary realism with high-fashion aesthetics.',
    requirements: ['Minimum 5 years editorial experience', 'Print magazine portfolio essential', 'Must own full lighting kit', 'Available April 1–3'],
    deliverables: ['Full production day x3', '300+ selects for editorial team', 'Licensing: worldwide print + digital 12 months'],
    status: 'Open',
    applicantCount: 37,
    maxApplicants: 50,
    tags: ['Editorial', 'Print', 'Bazaar India', 'Delhi', 'Concept'],
    coverImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800',
    isUrgent: false,
    isFeatured: false,
    postedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    escrowProtected: true,
  },
  {
    id: 'cc_004',
    title: 'Jewellery Campaign — Hands & Closeup Model',
    brandName: 'Tanishq',
    brandLogo: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=100',
    brandVerified: true,
    city: 'Bangalore',
    shootDate: '2026-03-18',
    deadline: '2026-03-11',
    roles: ['Model'],
    compensation: 'Paid',
    fee: 35000,
    description: 'Looking for a hands parts model for Tanishq\'s Akshaya Tritiya 2026 digital campaign. The shoot is focused on jewellery close-ups, wrist shots, and hand poses. Well-maintained hands essential.',
    requirements: ['Hands / parts model experience preferred', 'No visible scars or marks on hands', 'Skin tone: medium to deep', 'Half day availability'],
    deliverables: ['4-hour studio shoot', '6 jewellery collections coverage', 'Usage: digital only, 6 months India'],
    status: 'Open',
    applicantCount: 58,
    maxApplicants: 80,
    tags: ['Parts Model', 'Jewellery', 'Tanishq', 'Commercial'],
    coverImage: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800',
    isUrgent: true,
    isFeatured: false,
    postedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    escrowProtected: true,
  },
  {
    id: 'cc_005',
    title: 'Sustainable Fashion Lookbook — TFP',
    brandName: 'Re:Source Label',
    brandLogo: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=100',
    brandVerified: false,
    city: 'Pune',
    shootDate: '2026-03-22',
    deadline: '2026-03-16',
    roles: ['Model', 'Photographer', 'Stylist'],
    compensation: 'TFP',
    description: 'Small sustainable Indian label seeking a creative team for a lookbook shoot. A great portfolio-builder — natural light outdoor shoot at a heritage location in Pune.',
    requirements: ['Model: Female or Male, flexible height/size', 'Photographer: Own camera + 85mm+ lens', 'Stylist: Experience with sustainable/organic garments'],
    deliverables: ['40 edited digital images per team member', 'Shared usage rights for portfolio'],
    status: 'Open',
    applicantCount: 12,
    maxApplicants: 30,
    tags: ['TFP', 'Sustainable', 'Lookbook', 'Portfolio', 'Outdoor'],
    coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    isUrgent: false,
    isFeatured: false,
    postedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    escrowProtected: false,
  },
  {
    id: 'cc_006',
    title: 'Vogue India Cover Shoot — MUA & Hair Lead',
    brandName: 'Vogue India',
    brandLogo: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=100',
    brandVerified: true,
    city: 'Mumbai',
    shootDate: '2026-04-02',
    deadline: '2026-03-20',
    roles: ['Makeup Artist', 'Stylist'],
    compensation: 'Paid',
    fee: 75000,
    description: 'Vogue India is casting a Lead MUA and a Hair Stylist for the April 2026 cover and 8-page editorial. Subject: A prominent Bollywood personality. High-pressure, high-visibility assignment.',
    requirements: ['Published cover or editorial credits', 'Luxury brand experience', 'Full kit ownership', 'Discretion / NDA required'],
    deliverables: ['Cover shoot day + 2 editorial days', 'Credits in print and digital'],
    status: 'Open',
    applicantCount: 42,
    maxApplicants: 60,
    tags: ['Vogue India', 'Cover Shoot', 'MUA', 'Celebrity', 'Premium'],
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    isUrgent: false,
    isFeatured: true,
    postedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    escrowProtected: true,
  },
  {
    id: 'cc_007',
    title: 'Menswear Brand Relaunch — Male Model (2 Open)',
    brandName: 'Raymond Couture',
    brandLogo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    brandVerified: true,
    city: 'Mumbai',
    shootDate: '2026-03-30',
    deadline: '2026-03-18',
    roles: ['Model'],
    compensation: 'Paid',
    fee: 65000,
    description: 'Raymond Couture is relaunching its premium menswear line and needs 2 male models for a 2-day campaign and e-commerce shoot. Suits, formal, and athleisure segments.',
    requirements: ['Male, 22–35 years', 'Height 5\'11"–6\'2"', 'Chest 38–40, Waist 30–32', 'Experience in menswear / fashion preferred'],
    deliverables: ['2 full shoot days', '3 segments: Suits, formal, athleisure', 'E-commerce + campaign imagery'],
    status: 'Open',
    applicantCount: 73,
    maxApplicants: 100,
    tags: ['Menswear', 'Raymond', 'Campaign', 'E-commerce', 'Male Model'],
    coverImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    isUrgent: false,
    isFeatured: false,
    postedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    escrowProtected: true,
  },
  {
    id: 'cc_008',
    title: 'Fitness Brand Campaign — Diverse Models (4 Open)',
    brandName: 'Cult.fit',
    brandLogo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=100',
    brandVerified: true,
    city: 'Bangalore',
    shootDate: '2026-03-29',
    deadline: '2026-03-19',
    roles: ['Model', 'Videographer'],
    compensation: 'Paid',
    fee: 40000,
    description: 'Cult.fit is seeking 4 diverse, athletic models who authentically represent fitness culture for a social media-first campaign. All ages 22–50, all body types welcome. 1 videographer also required.',
    requirements: ['Active fitness lifestyle (authentic)', 'Comfortable on camera, ad-lib style', 'Ages 22–50, all body types encouraged', 'Must clear content rights for 12 months'],
    deliverables: ['1 full shoot day', 'Social media content (reels, stills, stories)', 'Usage: India social + digital 12 months'],
    status: 'Open',
    applicantCount: 128,
    maxApplicants: 200,
    tags: ['Fitness', 'Cult.fit', 'Diversity', 'Social Media', 'Inclusive'],
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
    isUrgent: false,
    isFeatured: false,
    postedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    escrowProtected: true,
  },
];

import { Review, RatingSummary } from './types';

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rv_001', bookingId: 'bk_001',
    reviewerName: 'Sheetal Kapoor', reviewerRole: 'brand',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    reviewerBrandName: 'Nykaa Fashion',
    subjectId: 't1',
    rating: 5,
    headline: 'Absolutely exceptional — exactly what our campaign needed',
    body: 'Working with Priya was a dream. She arrived 30 minutes early, nailed every look on the first go, and brought ideas that genuinely elevated the work. Our creative director called it the best campaign shoot we have ever done. We will be booking again without a second thought.',
    tags: [
      { label: 'Punctual', positive: true }, { label: 'Creative', positive: true },
      { label: 'Professional', positive: true }, { label: 'Team Player', positive: true },
      { label: 'Delivers on Brief', positive: true },
    ],
    categories: { professionalism: 5, communication: 5, creativity: 5, punctuality: 5, valueForMoney: 5 },
    campaignTitle: 'SS26 Summer Campaign',
    date: new Date(Date.now() - 86400000 * 5).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 24,
  },
  {
    id: 'rv_002', bookingId: 'bk_002',
    reviewerName: 'Rohan Malhotra', reviewerRole: 'brand',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    reviewerBrandName: 'Mango India',
    subjectId: 't1',
    rating: 5,
    headline: 'World-class professionalism, zero drama',
    body: 'We have worked with many models through various platforms but Priya stands apart. Her understanding of garment and lighting is sophisticated — she moved through 40 looks in a single day without losing energy or intent. The images speak for themselves.',
    tags: [
      { label: 'High Energy', positive: true }, { label: 'Adaptable', positive: true },
      { label: 'Understands Garment', positive: true }, { label: 'Camera Ready', positive: true },
    ],
    categories: { professionalism: 5, communication: 5, creativity: 4, punctuality: 5, valueForMoney: 4 },
    campaignTitle: 'Autumn Collection Lookbook',
    date: new Date(Date.now() - 86400000 * 18).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 17,
  },
  {
    id: 'rv_003', bookingId: 'bk_003',
    reviewerName: 'Ananya Bose', reviewerRole: 'brand',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    reviewerBrandName: 'W for Woman',
    subjectId: 't1',
    rating: 4,
    headline: 'Very strong shoot — minor brief deviation on two looks',
    body: 'Overall an excellent shoot. Priya was professional and delivered stunning imagery for most of the brief. On two of our looks she went off-brief, which added some great energy but also created extra post-production work. Something to communicate more clearly upfront. Would still rebook.',
    tags: [
      { label: 'Creative', positive: true }, { label: 'Great Energy', positive: true },
      { label: 'Slightly Off-Brief', positive: false },
    ],
    categories: { professionalism: 4, communication: 4, creativity: 5, punctuality: 4, valueForMoney: 4 },
    campaignTitle: 'Brand Ambassador Q2',
    date: new Date(Date.now() - 86400000 * 31).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 9,
    brandResponse: 'Thank you for the feedback, Ananya! You are absolutely right — I should have flagged the creative variations before executing. Lesson noted and much appreciated.',
  },
  {
    id: 'rv_004', bookingId: 'bk_004',
    reviewerName: 'Vikram Agarwal', reviewerRole: 'brand',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100',
    reviewerBrandName: 'Tanishq',
    subjectId: 't1',
    rating: 5,
    headline: 'Best jewellery shoot we have had in years',
    body: 'Our jewellery campaigns require extreme detail orientation — every hand position matters. Priya was extraordinary. She studied the reference board overnight and came in with a full understanding of the aesthetic we needed. The precision was remarkable.',
    tags: [
      { label: 'Detail-Oriented', positive: true }, { label: 'Prepared', positive: true },
      { label: 'Exceptional Hands', positive: true }, { label: 'Calm Under Pressure', positive: true },
    ],
    categories: { professionalism: 5, communication: 5, creativity: 4, punctuality: 5, valueForMoney: 5 },
    campaignTitle: 'Akshaya Tritiya Collection',
    date: new Date(Date.now() - 86400000 * 47).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 31,
  },
];

export const MOCK_RATING_SUMMARY: RatingSummary = {
  subjectId: 't1',
  averageRating: 4.75,
  totalReviews: 4,
  ratingDistribution: { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 },
  categoryAverages: { professionalism: 4.75, communication: 4.75, creativity: 4.5, punctuality: 4.75 },
  topPositiveTags: ['Professional', 'Punctual', 'Creative', 'Detail-Oriented', 'Camera Ready'],
};

import { BrandReview, BrandProfile } from './types';

export const MOCK_BRAND_PROFILES: BrandProfile[] = [
  {
    id: 'b1',
    name: 'Nykaa Fashion',
    logoUrl: 'https://logo.clearbit.com/nykaa.com',
    coverImage: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200',
    industry: 'Beauty & Fashion Retail',
    location: 'Mumbai, Maharashtra',
    description: 'Nykaa Fashion is one of India\'s fastest-growing multi-brand fashion platforms. We partner with the very best talent in the country to bring curated campaigns to life — from editorial spreads to viral social content.',
    website: 'https://nykaafashion.com',
    founded: '2019',
    teamSize: '50–200',
    isVerified: true,
    totalHires: 312,
    totalSpend: 28500000,
    avgRating: 4.8,
    totalReviews: 87,
    paymentSpeedScore: 4.9,
    communicationScore: 4.7,
    wouldWorkAgainPct: 96,
    activeCastings: 3,
    badges: ['Top Payer', 'Fast Payments', 'Creative Brief Excellence', 'FFN Verified Brand'],
    socialLinks: { instagram: 'nykaafashion', linkedin: 'nykaa' },
  },
  {
    id: 'b2',
    name: 'H&M India',
    logoUrl: 'https://logo.clearbit.com/hm.com',
    coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
    industry: 'Apparel & Retail',
    location: 'Gurgaon, Haryana',
    description: 'H&M India blends Scandinavian design sensibility with India\'s vibrant fashion culture. Our campaigns are inclusive, globally-minded, and always seeking authentic Indian talent.',
    website: 'https://hm.com',
    founded: '2015',
    teamSize: '200+',
    isVerified: true,
    totalHires: 540,
    totalSpend: 62000000,
    avgRating: 4.5,
    totalReviews: 142,
    paymentSpeedScore: 4.4,
    communicationScore: 4.6,
    wouldWorkAgainPct: 89,
    activeCastings: 1,
    badges: ['FFN Verified Brand', 'Inclusive Casting', 'Global Scale'],
    socialLinks: { instagram: 'hmindia', linkedin: 'h-and-m' },
  },
  {
    id: 'b3',
    name: 'Vogue India',
    logoUrl: 'https://logo.clearbit.com/vogue.in',
    coverImage: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200',
    industry: 'Fashion Media',
    location: 'Mumbai, Maharashtra',
    description: 'Vogue India is the definitive voice of fashion and culture in South Asia. Shooting with Vogue is a career-defining moment for talent — we produce the most iconic imagery in Indian fashion.',
    website: 'https://vogue.in',
    founded: '2007',
    teamSize: '50–100',
    isVerified: true,
    totalHires: 218,
    totalSpend: 41000000,
    avgRating: 4.6,
    totalReviews: 63,
    paymentSpeedScore: 4.3,
    communicationScore: 4.5,
    wouldWorkAgainPct: 91,
    activeCastings: 2,
    badges: ['FFN Verified Brand', 'Iconic Editorial', 'Career Defining'],
    socialLinks: { instagram: 'vogueindia', linkedin: 'vogue-india' },
  },
];

export const MOCK_BRAND_REVIEWS: BrandReview[] = [
  {
    id: 'br_001', brandId: 'b1',
    reviewerName: 'Priya Sharma', reviewerRole: 'Model',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    rating: 5,
    headline: 'The gold standard of brand partnerships',
    body: 'Working with Nykaa Fashion was genuinely exceptional. Their brief was detailed and creative, the set was professionally managed, and they paid within 48 hours — unheard of in this industry. I felt respected as a creative professional throughout.',
    categories: { paymentSpeed: 5, communication: 5, setEnvironment: 5, briefClarity: 5, wouldWorkAgain: true },
    campaignTitle: 'SS26 Summer Campaign',
    date: new Date(Date.now() - 86400000 * 6).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 31,
  },
  {
    id: 'br_002', brandId: 'b1',
    reviewerName: 'Arjun Mehta', reviewerRole: 'Photographer',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    rating: 5,
    headline: 'Creative freedom + real budget = dream collab',
    body: 'Nykaa gave me genuine creative freedom and trusted my instincts on location and lighting. The budget was substantial and transparent from day one. The creative director was always reachable. Payment was in full the day after shoot completion. Would rebook immediately.',
    categories: { paymentSpeed: 5, communication: 5, setEnvironment: 5, briefClarity: 4, wouldWorkAgain: true },
    campaignTitle: 'Digital Content Series Q1',
    date: new Date(Date.now() - 86400000 * 21).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 22,
  },
  {
    id: 'br_003', brandId: 'b1',
    reviewerName: 'Neha Kapoor', reviewerRole: 'Makeup Artist',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100',
    rating: 4,
    headline: 'Excellent brand, minor brief shifts mid-shoot',
    body: 'The experience was overwhelmingly positive. Nykaa\'s team was warm, professional, and well-organised. One thing to note: the brief evolved slightly during the shoot, which meant we had to adapt quickly. Their communication during this was good, but heads-up would have been better.',
    categories: { paymentSpeed: 5, communication: 4, setEnvironment: 5, briefClarity: 3, wouldWorkAgain: true },
    campaignTitle: 'Beauty x Fashion Collab Series',
    date: new Date(Date.now() - 86400000 * 38).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 14,
  },
  {
    id: 'br_004', brandId: 'b1',
    reviewerName: 'Rahul Desai', reviewerRole: 'Videographer',
    reviewerAvatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
    headline: 'Best brand fee + fastest payment I\'ve ever received',
    body: 'I\'ve worked with 40+ brands on FFN. Nykaa is in a different league when it comes to respecting creative professionals. Competitive rates, on-time escrow release, and a team that is collaborative without being micromanaging. Set this as your benchmark.',
    categories: { paymentSpeed: 5, communication: 5, setEnvironment: 5, briefClarity: 5, wouldWorkAgain: true },
    campaignTitle: 'Reels Campaign — Q4 Collection',
    date: new Date(Date.now() - 86400000 * 55).toISOString(),
    isVerifiedBooking: true,
    helpfulCount: 45,
  },
];

import { EscrowTransaction } from './types';

export const MOCK_ESCROW_TRANSACTIONS: EscrowTransaction[] = [
  {
    id: 'esc_001', bookingRef: 'FFN-2025-03-001',
    brandName: 'Nykaa Fashion', brandLogoUrl: 'https://logo.clearbit.com/nykaa.com',
    talentName: 'Priya Sharma', talentAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    campaignTitle: 'SS26 Summer Campaign — Lead Model',
    shootDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    amount: 85000, ffnFee: 8500, talentReceives: 76500, currency: 'INR',
    status: 'release_pending',
    fundedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    deliveryDeadline: new Date(Date.now() - 86400000 * 4).toISOString(),
    autoReleaseAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    contractSigned: true, paymentMethod: 'NEFT', isUserBrand: false,
    milestones: [
      { id: 'm1', label: 'Contract Signed', completedAt: new Date(Date.now() - 86400000 * 10).toISOString(), status: 'done' },
      { id: 'm2', label: 'Escrow Funded by Brand', completedAt: new Date(Date.now() - 86400000 * 9).toISOString(), status: 'done' },
      { id: 'm3', label: 'Shoot Completed', completedAt: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'done' },
      { id: 'm4', label: 'Review Window (72h)', dueAt: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'active' },
      { id: 'm5', label: 'Payment Released to Talent', dueAt: new Date(Date.now() + 86400000 * 2).toISOString(), status: 'upcoming' },
    ],
  },
  {
    id: 'esc_002', bookingRef: 'FFN-2025-03-002',
    brandName: 'Vogue India', brandLogoUrl: 'https://logo.clearbit.com/vogue.in',
    talentName: 'Arjun Mehta', talentAvatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    campaignTitle: 'Cover Shoot — June Issue Photographer',
    shootDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    amount: 120000, ffnFee: 12000, talentReceives: 108000, currency: 'INR',
    status: 'funded',
    fundedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    deliveryDeadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    contractSigned: true, paymentMethod: 'UPI', isUserBrand: false,
    milestones: [
      { id: 'm1', label: 'Contract Signed', completedAt: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'done' },
      { id: 'm2', label: 'Escrow Funded by Brand', completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'done' },
      { id: 'm3', label: 'Shoot Date', dueAt: new Date(Date.now() + 86400000 * 7).toISOString(), status: 'active' },
      { id: 'm4', label: 'Review Window (72h)', status: 'upcoming' },
      { id: 'm5', label: 'Payment Released to Talent', status: 'upcoming' },
    ],
  },
  {
    id: 'esc_003', bookingRef: 'FFN-2025-02-015',
    brandName: 'Tanishq', brandLogoUrl: 'https://logo.clearbit.com/tanishq.co.in',
    talentName: 'Priya Sharma', talentAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    campaignTitle: 'Akshaya Tritiya Jewellery Campaign',
    shootDate: new Date(Date.now() - 86400000 * 18).toISOString(),
    amount: 35000, ffnFee: 3500, talentReceives: 31500, currency: 'INR',
    status: 'released',
    fundedAt: new Date(Date.now() - 86400000 * 23).toISOString(),
    releasedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    contractSigned: true, paymentMethod: 'NEFT', isUserBrand: false,
    milestones: [
      { id: 'm1', label: 'Contract Signed', completedAt: new Date(Date.now() - 86400000 * 25).toISOString(), status: 'done' },
      { id: 'm2', label: 'Escrow Funded by Brand', completedAt: new Date(Date.now() - 86400000 * 23).toISOString(), status: 'done' },
      { id: 'm3', label: 'Shoot Completed', completedAt: new Date(Date.now() - 86400000 * 18).toISOString(), status: 'done' },
      { id: 'm4', label: 'Review Window (72h)', completedAt: new Date(Date.now() - 86400000 * 15).toISOString(), status: 'done' },
      { id: 'm5', label: 'Payment Released to Talent', completedAt: new Date(Date.now() - 86400000 * 14).toISOString(), status: 'done' },
    ],
  },
  {
    id: 'esc_004', bookingRef: 'FFN-2025-02-028',
    brandName: 'Mango India', brandLogoUrl: 'https://logo.clearbit.com/mango.com',
    talentName: 'Priya Sharma', talentAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    campaignTitle: 'Autumn-Winter Lookbook',
    shootDate: new Date(Date.now() - 86400000 * 30).toISOString(),
    amount: 65000, ffnFee: 6500, talentReceives: 58500, currency: 'INR',
    status: 'disputed',
    fundedAt: new Date(Date.now() - 86400000 * 35).toISOString(),
    disputeRaisedAt: new Date(Date.now() - 86400000 * 26).toISOString(),
    disputeReason: 'Brand claims final deliverables did not match brief requirements. Talent disagrees and submitted all files.',
    contractSigned: true, paymentMethod: 'PayPal', isUserBrand: false,
    milestones: [
      { id: 'm1', label: 'Contract Signed', completedAt: new Date(Date.now() - 86400000 * 37).toISOString(), status: 'done' },
      { id: 'm2', label: 'Escrow Funded by Brand', completedAt: new Date(Date.now() - 86400000 * 35).toISOString(), status: 'done' },
      { id: 'm3', label: 'Shoot Completed', completedAt: new Date(Date.now() - 86400000 * 30).toISOString(), status: 'done' },
      { id: 'm4', label: 'Dispute Raised', completedAt: new Date(Date.now() - 86400000 * 26).toISOString(), status: 'active' },
      { id: 'm5', label: 'FFN Mediation in Progress', status: 'active' },
    ],
  },
  {
    id: 'esc_005', bookingRef: 'FFN-2025-03-008',
    brandName: 'Raymond Couture', brandLogoUrl: 'https://logo.clearbit.com/raymond.in',
    talentName: 'Priya Sharma', talentAvatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100',
    campaignTitle: 'Menswear Relaunch Campaign',
    shootDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    amount: 65000, ffnFee: 6500, talentReceives: 58500, currency: 'INR',
    status: 'pending_deposit',
    contractSigned: true, paymentMethod: 'NEFT', isUserBrand: false,
    milestones: [
      { id: 'm1', label: 'Contract Signed', completedAt: new Date(Date.now() - 86400000 * 1).toISOString(), status: 'done' },
      { id: 'm2', label: 'Awaiting Brand Deposit', dueAt: new Date(Date.now() + 86400000 * 3).toISOString(), status: 'active' },
      { id: 'm3', label: 'Shoot Date', dueAt: new Date(Date.now() + 86400000 * 14).toISOString(), status: 'upcoming' },
      { id: 'm4', label: 'Review Window (72h)', status: 'upcoming' },
      { id: 'm5', label: 'Payment Released to Talent', status: 'upcoming' },
    ],
  },
];
// ─── Creator Analytics & Insights ─────────────────────────────────────────────
export const MOCK_CREATOR_INSIGHTS = {
  talentId: 't1',
  totalViews: 12450,
  totalSaves: 842,
  totalHires: 12,
  avgEngagementRate: 6.8,
  recentVisitors: [
    { id: 'v1', visitor: MOCK_BRANDS[0] as any, visitedAt: new Date(Date.now() - 3600000).toISOString(), actionTaken: 'VIEW' },
    { id: 'v2', visitor: MOCK_BRANDS[1] as any, visitedAt: new Date(Date.now() - 14400000).toISOString(), actionTaken: 'SAVE' },
    { id: 'v3', visitor: MOCK_BRANDS[2] as any, visitedAt: new Date(Date.now() - 86400000).toISOString(), actionTaken: 'HIRE_CLICK' },
    { id: 'v4', visitor: MOCK_TALENT_POOL[1], visitedAt: new Date(Date.now() - 172800000).toISOString(), actionTaken: 'FOLLOW' },
  ],
  dailyMetrics: [
    { date: '2025-02-24', views: 420, saves: 12, hires: 1, engagement: 45 },
    { date: '2025-02-25', views: 550, saves: 18, hires: 0, engagement: 62 },
    { date: '2025-02-26', views: 380, saves: 8, hires: 2, engagement: 38 },
    { date: '2025-02-27', views: 610, saves: 24, hires: 1, engagement: 78 },
    { date: '2025-02-28', views: 490, saves: 15, hires: 0, engagement: 54 },
    { date: '2025-03-01', views: 720, saves: 32, hires: 3, engagement: 95 },
  ]
};

export const MOCK_COLLABORATION_PROJECTS: CollaborationProject[] = [
  {
    id: 'cp1',
    title: 'Neo-Traditional Editorial Shoot',
    description: 'Looking for a model and stylist to collaborate on a high-fashion editorial blending traditional Indian silhouettes with futuristic tech-wear.',
    creator: {
      id: 't1',
      displayName: 'Aarav Sharma',
      avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/aarav_avatar_1772387338276.png',
      role: 'Designer'
    },
    requirements: ['Experienced Model', 'Avant-garde Stylist'],
    tags: ['Editorial', 'TFP', 'Mumbai'],
    createdAt: new Date().toISOString(),
    status: 'OPEN',
    type: 'TFP',
    location: 'Mumbai'
  },
  {
    id: 'cp2',
    title: 'Sustainable Streetwear Lookbook',
    description: 'Need a photographer for a one-day shoot featuring our new upcycled denim collection.',
    creator: {
      id: 't3',
      displayName: 'Neil D-Souza',
      avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/neil_avatar_retry_1772387442552.png',
      role: 'Stylist'
    },
    requirements: ['Fashion Photographer', 'Studio Space'],
    tags: ['Lookbook', 'Sustainability', 'Paid'],
    createdAt: new Date().toISOString(),
    status: 'OPEN',
    type: 'PAID',
    location: 'Bangalore'
  }
];

export const MOCK_PRESS_RELEASES: PressRelease[] = [
  {
    id: 'pr1',
    title: 'FFN Raises $5M in Seed Funding to Scale Identity Protocol',
    date: '2025-10-15',
    category: 'MILESTONE',
    excerpt: 'Fashion Freedom Network (FFN) secures seed funding from top-tier VCs to expand its professional verification and analytics engine.',
    content: 'London, UK — Fashion Freedom Network (FFN), the decentralized identity protocol for the fashion industry, today announced it has raised $5,000,000 in seed funding...',
    imageUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/editorial_minimalist_future_1772387475918.png'
  },
  {
    id: 'pr2',
    title: 'FFN Partners with Lakme Fashion Week for Digital Verifications',
    date: '2025-11-20',
    category: 'PARTNERSHIP',
    excerpt: 'FFN becomes the official verification partner for India’s premier fashion event, ensuring talent credibility.',
    content: 'Mumbai, India — In a landmark partnership, FFN and Lakme Fashion Week announce a long-term collaboration to integrate digital identity verification...',
    imageUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/editorial_neo_tradition_1772387458922.png'
  }
];

export const MOCK_WAR_ROOMS: WarRoom[] = [
  {
    id: 'wr1',
    projectId: 'cp1',
    title: 'Neo-Traditional Editorial Shoot',
    brand: {
      id: 'b1',
      name: 'Vogue India',
      logoUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop'
    },
    talent: {
      id: 't1',
      name: 'Aarav Sharma',
      avatarUrl: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/aarav_avatar_1772387338276.png'
    },
    status: 'ACTIVE',
    milestones: [
      { id: 'm1', title: 'Moodboard Finalization', description: 'Align on visual direction and color palette.', status: 'COMPLETED', dueDate: '2025-10-20' },
      { id: 'm2', title: 'Location Scouting', description: 'Confirm studio or outdoor site.', status: 'IN_PROGRESS', dueDate: '2025-10-22' },
      { id: 'm3', title: 'Shoot Day', description: 'Main photography session.', status: 'PENDING', dueDate: '2025-10-25' },
      { id: 'm4', title: 'Final Delivery', description: 'Post-production and handoff.', status: 'PENDING', dueDate: '2025-11-01' }
    ],
    messages: [
      { id: 'msg1', senderId: 'b1', senderName: 'Vogue Team', content: 'Excited to start this! Have you checked the location options?', timestamp: '2025-10-18T10:00:00Z' },
      { id: 'msg2', senderId: 't1', senderName: 'Aarav Sharma', content: 'Yes, looking at two studios in South Mumbai. Will share photos soon.', timestamp: '2025-10-18T11:30:00Z' }
    ],
    files: [
      { id: 'f1', name: 'Moodboard_Draft_v1.pdf', size: '4.2 MB', type: 'PDF', url: '#', uploadedBy: 'Aarav Sharma', uploadedAt: '2025-10-19T09:00:00Z' }
    ],
    lastActivity: '2025-10-19T09:00:00Z'
  }
];

export const MOCK_TALENT_COLLECTIONS: TalentCollection[] = [
  {
    id: 'col_1',
    brandId: 'b1',
    title: 'SS26 Editorial Faces',
    description: 'Top picks for the upcoming Spring/Summer 2026 high-fashion editorial shoot.',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    talentIds: ['t1', 't2', 't3'],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isPublic: false
  },
  {
    id: 'col_2',
    brandId: 'b1',
    title: 'Commercial Diversity',
    description: 'Models for our upcoming digital-first campaigns focusing on inclusivity.',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    talentIds: ['t4', 't5'],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isPublic: true
  }
];

export const MOCK_AVAILABILITY: AvailabilitySlot[] = [
  { id: 'av_1', userId: 't2', startDate: new Date(Date.now() + 86400000 * 2).toISOString(), endDate: new Date(Date.now() + 86400000 * 3).toISOString(), status: 'booked', title: 'SS26 Editorial' },
  { id: 'av_2', userId: 't2', startDate: new Date(Date.now() + 86400000 * 7).toISOString(), endDate: new Date(Date.now() + 86400000 * 8).toISOString(), status: 'tentative', title: 'Lakme Fashion Week' },
  { id: 'av_3', userId: 't2', startDate: new Date(Date.now() + 86400000 * 14).toISOString(), endDate: new Date(Date.now() + 86400000 * 15).toISOString(), status: 'unavailable', title: 'Personal Travel' },
];

export const MOCK_TEAM_COMMENTS: TeamComment[] = [
  { id: 'rem_1', authorId: 'b1', authorName: 'Vogue HR', content: 'Incredible runway walk. High priority for the Milan feature.', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), targetId: 't2', tags: ['High-Fashion', 'Runway'] },
  { id: 'rem_2', authorId: 'b1', authorName: 'Creative Lead', content: 'Matches the brand aesthetic for the Heritage collection.', timestamp: new Date(Date.now() - 3600000 * 5).toISOString(), targetId: 't2', tags: ['Heritage', 'Face'] },
];

export const MOCK_CAMPAIGNS = [
  {
    id: 'camp1',
    title: "Summer Editorial '25",
    description: 'High-fashion editorial campaign for the upcoming summer collection.',
    status: 'Live',
    budget: 500000,
    spent: 120000,
    castings: ['c1', 'c2'],
    matchRate: 85,
    applicants: 12
  },
  {
    id: 'camp2',
    title: 'Streetwear Launch',
    description: 'Energetic launch campaign for our new sustainable streetwear line.',
    status: 'Shortlisting',
    budget: 250000,
    spent: 0,
    castings: ['c3'],
    matchRate: 92,
    applicants: 4
  }
];

export const MOCK_EARNINGS: EarningsTransaction[] = [
  {
    id: 'tx1',
    talentId: 't1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    amount: 15000,
    grossAmount: 18000,
    stream: 'Casting Booking',
    description: 'Vogue India Editorial',
    brandOrClient: 'Condé Nast',
    status: 'paid',
    payoutDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 'tx2',
    talentId: 't1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
    amount: 8000,
    grossAmount: 10000,
    stream: 'Brand Deal',
    description: 'Social Media Promotion',
    brandOrClient: 'Zara India',
    status: 'pending'
  },
  {
    id: 'tx3',
    talentId: 't1',
    date: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    amount: 5000,
    grossAmount: 6500,
    stream: 'Masterclass',
    description: 'Portfolio Review Session',
    status: 'processing'
  }
];

export const MOCK_PROTOCOL_MESSAGES: ProtocolMessage[] = [
  {
    id: 'pm1',
    category: 'CASTING',
    sender: {
      id: 'b1',
      name: 'Vogue India',
      avatar: 'https://logo.clearbit.com/vogue.in',
      role: UserRole.BRAND
    },
    lastMessage: 'Your application for the Heritage Revival campaign has been shortlisted. Please review the visual brief.',
    timestamp: new Date().toISOString(),
    unread: true,
    status: 'online',
    contextId: 'c1',
    urgency: 'high'
  },
  {
    id: 'pm2',
    category: 'PROJECT',
    sender: {
      id: 'b2',
      name: 'Zara India',
      avatar: 'https://logo.clearbit.com/zara.com',
      role: UserRole.BRAND
    },
    lastMessage: 'The location scouting for the "Urban Nomads" shoot is complete. Final assets uploaded to asset gallery.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    unread: false,
    status: 'busy',
    contextId: 'wr1',
    urgency: 'medium'
  },
  {
    id: 'pm3',
    category: 'DIRECT',
    sender: {
      id: 't2',
      name: 'Kiara Malhotra',
      avatar: '/Users/kunalmurari/.gemini/antigravity/brain/53b0d9e5-2627-423a-898e-758d20c110b2/kiara_avatar_retry_1772387397622.png',
      role: UserRole.MODEL
    },
    lastMessage: 'Hey! Would love to collaborate on the upcoming sustainable fashion series.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    unread: true,
    status: 'online',
    urgency: 'low'
  },
  {
    id: 'pm4',
    category: 'SYSTEM',
    sender: {
      id: 'system',
      name: 'FFN Protocol',
      avatar: 'https://ui-avatars.com/api/?name=FFN&background=000&color=fff',
      role: UserRole.AGENCY
    },
    lastMessage: 'Your Identity Security Scan is complete. No vulnerabilities detected in your public node.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    unread: false,
    status: 'online',
    urgency: 'low'
  }
];

export const MOCK_ACTIVITY_NODES: ActivityNode[] = [
  {
    id: 'an1',
    type: 'APPLICATION',
    title: 'Casting Shortlisted',
    description: 'Vogue India selected you for "Heritage Revival"',
    timestamp: new Date().toISOString(),
    status: 'action-required',
    link: '/castings'
  },
  {
    id: 'an2',
    type: 'MILESTONE',
    title: 'Milestone Completed',
    description: 'Location Selection for Zara Urban Nomads',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    status: 'completed',
    link: '/war-room/wr1'
  },
  {
    id: 'an3',
    type: 'PAYMENT',
    title: 'Payment Released',
    description: 'Escrow release for "Minimalist Future" Editorial',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'completed'
  }
];
// ─── Phase 44: Agency Mock Data ──────────────────────────────────────────────

export const MOCK_AGENCY: AgencyProfile = {
  id: 'agency_1',
  name: 'Elite Cyber Models',
  logoUrl: 'https://logo.clearbit.com/elitemodel.com',
  coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
  location: 'Milan / Mumbai',
  description: 'Techno-progressive modelling agency focused on high-fashion digital sovereignty.',
  rosterCount: 24,
  activeBookings: 12,
  totalRevenue: 8500000, // INR
  monthlyGrowth: 15.4,
  verified: true
};

export const MOCK_MANAGED_TALENT: ManagedTalent[] = [
  {
    id: 'mt1',
    user: MOCK_TALENT_POOL[1], // Kiara
    status: 'active',
    activeProjects: 3,
    totalEarnings: 2400000,
    commissionRate: 0.2,
    nextBooking: '2025-03-10'
  },
  {
    id: 'mt2',
    user: MOCK_TALENT_POOL[4], // Kabir
    status: 'on-set',
    activeProjects: 1,
    totalEarnings: 3200000,
    commissionRate: 0.15,
    nextBooking: '2025-03-05'
  },
  {
    id: 'mt3',
    user: MOCK_TALENT_POOL[5], // Isha
    status: 'idle',
    activeProjects: 0,
    totalEarnings: 1200000,
    commissionRate: 0.2,
  }
];

export const MOCK_AGENCY_COMMISSIONS: AgencyCommission[] = [
  {
    id: 'comm1',
    talentId: 't2',
    talentName: 'Kiara Malhotra',
    projectName: 'Vogue India Summer Cover',
    date: '2025-02-28',
    totalAmount: 500000,
    commissionAmount: 100000,
    status: 'received'
  },
  {
    id: 'comm2',
    talentId: 't5',
    talentName: 'Kabir Vohra',
    projectName: 'LV Paris Runway',
    date: '2025-02-25',
    totalAmount: 850000,
    commissionAmount: 127500,
    status: 'pending'
  }
];

// ─── Phase 45: Trend Lab Mock Data ───────────────────────────────────────────

export const MOCK_TRENDS: TrendMetric[] = [
  { id: 'tr1', label: 'Cyber-Tailoring Demand', value: '88%', change: 12.4, trend: 'up' },
  { id: 'tr2', label: 'Milan Casting Liquidity', value: 'High', change: 8.2, trend: 'up' },
  { id: 'tr3', label: 'Minimalist Content Reach', value: '4.2k/day', change: -2.1, trend: 'down' },
  { id: 'tr4', label: '3D Asset Integration', value: '156%', change: 44.5, trend: 'up' }
];

export const MOCK_STYLE_NODES: StyleNode[] = [
  { id: 'sn1', city: 'Mumbai', styleName: 'Global Fusion', demandScore: 92, activeTalent: 1450, growth: 12.4 },
  { id: 'sn2', city: 'Tokyo', styleName: 'Tech-Utility', demandScore: 88, activeTalent: 890, growth: 18.2 },
  { id: 'sn3', city: 'Paris', styleName: 'Neo-Classic', demandScore: 75, activeTalent: 2100, growth: 4.1 },
  { id: 'sn4', city: 'London', styleName: 'Digital Punk', demandScore: 94, activeTalent: 670, growth: 22.8 }
];

export const MOCK_SEARCH_RESULTS: SearchResult[] = [
  { id: 't1', type: 'talent', title: 'Kiara Malhotra', subtitle: 'Editorial Model', link: '/profile/kiara', isVerified: true, trustScore: 942 },
  { id: 'b1', type: 'brand', title: 'Vogue India', subtitle: 'Media Node', link: '/brand/vogue', isVerified: true, trustScore: 988 },
  { id: 'c1', type: 'casting', title: 'Paris Fashion Week 2025', subtitle: 'Runway Protocol', link: '/castings/pfw', trustScore: 890 }
];

// ─── Phase 47: Explore Labs & Discovery ───────────────────────────────────────

export const MOCK_EXPLORE_LABS = [
  {
    id: 'exp1',
    type: 'casting' as const,
    title: 'Vogue Milan Open Call',
    subtitle: 'High-Fashion Editorial',
    matchScore: 94,
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp2',
    type: 'masterclass' as const,
    title: 'Runway Mastery',
    subtitle: 'Kabir Vohra Elite',
    price: '₹2,499',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'exp3',
    type: 'rental' as const,
    title: 'Vintage Sabyasachi Archive',
    subtitle: 'South Delhi Collection',
    price: '₹12,000/day',
    imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800'
  }
];
