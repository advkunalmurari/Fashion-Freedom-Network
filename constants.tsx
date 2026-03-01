
import React from 'react';
import { UserRole, User, VerificationLevel, Post, Brand, CastingCall, Editorial, SubscriptionType } from './types';

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
        <stop offset="0%" style={{ stopColor: '#833ab4' }} />
        <stop offset="50%" style={{ stopColor: '#fd1d1d' }} />
        <stop offset="100%" style={{ stopColor: '#fcb045' }} />
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
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1200',
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
    subscription: { type: SubscriptionType.PREMIUM, endDate: '2025-12-31' }
  },
  {
    id: 't2',
    username: 'kiara_m',
    displayName: 'Kiara Malhotra',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    coverUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80&w=1200',
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
    subscription: { type: SubscriptionType.PROFESSIONAL, endDate: '2025-11-15' }
  },
  {
    id: 't3',
    username: 'neil_strokes',
    displayName: 'Neil D-Souza',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
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
    subscription: { type: SubscriptionType.BASIC, endDate: '2025-12-31' }
  }
];

export const MOCK_BRANDS: Brand[] = [
  { id: 'b1', brand_name: 'ZARA India', logo_url: 'https://logo.clearbit.com/zara.com', description: 'Global fast-fashion leader with deep roots in creative excellence.', location: 'Mumbai', created_at: '2024-01-01' },
  { id: 'b2', brand_name: 'Sabyasachi', logo_url: 'https://logo.clearbit.com/sabyasachi.com', description: 'Luxury Indian heritage wear redefining global couture.', location: 'Kolkata', created_at: '2024-02-15' }
];

export const MOCK_CASTINGS: CastingCall[] = [
  { id: 'c1', brand_id: 'b1', company_name: 'ZARA India', role_title: 'Summer Lead Model', category: UserRole.MODEL, location: 'Mumbai', shoot_date: '2025-05-10', budget: '₹50,000', description: 'Seeking fresh faces for Summer campaign.', contact_email: 'casting@zara.in', created_at: '2025-03-01', requirements: ['Min height 5\'8"', 'Availability in May'] },
  { id: 'c2', brand_id: 'b2', company_name: 'Sabyasachi', role_title: 'Heritage Bridal MUA', category: UserRole.MUA, location: 'Kolkata', shoot_date: '2025-06-15', budget: '₹75,000', description: 'Editorial bridal campaign.', contact_email: 'studio@sabyasachi.com', created_at: '2025-03-05', requirements: ['Portfolio with bridal work'] }
];

export const MOCK_EDITORIALS: Editorial[] = [
  { id: 'e1', title: 'Neo-Tradition Editorial', media_url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80&w=1000', photographer_name: 'Rohan Shrestha', category: 'High Fashion', created_at: '2025-03-01' },
  { id: 'e2', title: 'Minimalist Future', media_url: 'https://images.unsplash.com/photo-1529139513065-07b3b1bfde91?auto=format&fit=crop&q=80&w=1000', photographer_name: 'Sashikanth', category: 'Lookbook', created_at: '2025-02-15' }
];

// Added MOCK_SHOOTS alias for MOCK_EDITORIALS
export const MOCK_SHOOTS = MOCK_EDITORIALS;

export const MOCK_POSTS: Post[] = [
  {
    id: 'p1', authorId: 't1', author: MOCK_TALENT_POOL[0], type: 'IMAGE', mediaUrls: ['https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=800'], caption: 'Process notes: Raw silk meets recycled metals. #FFN #Sustainability', likes: 1240, comments: 45, createdAt: '2h', tags: ['DESIGNER', 'SUSTAINABLE']
  },
  {
    id: 'p2', authorId: 't2', author: MOCK_TALENT_POOL[1], type: 'IMAGE', mediaUrls: ['https://images.unsplash.com/photo-1539109132382-381bb3f1c2b3?auto=format&fit=crop&q=80&w=800'], caption: 'Golden hour in Milan. Editorial shoot for the summer issue.', likes: 5600, comments: 128, createdAt: '5h', tags: ['MODEL', 'MILAN']
  }
];
