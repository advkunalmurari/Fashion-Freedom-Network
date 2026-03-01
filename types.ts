
export enum UserRole {
  MODEL = 'MODEL',
  DESIGNER = 'DESIGNER',
  STYLIST = 'STYLIST',
  MUA = 'MUA',
  SINGER = 'SINGER',
  DANCER = 'DANCER',
  ARTIST = 'ARTIST',
  BRAND = 'BRAND'
}

export enum VerificationLevel {
  BASIC = 0,
  VERIFIED = 1,
  PREMIUM = 2,
  APPROVED = 3
}

export enum SubscriptionType {
  BASIC = 'BASIC',
  PROFESSIONAL = 'PROFESSIONAL',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  coverUrl: string;
  role: UserRole;
  verificationLevel: VerificationLevel;
  isVerified: boolean;
  isBoosted: boolean;
  isFeatured?: boolean;
  isPremium?: boolean;
  premiumBadgeColor?: string;
  bio: string;
  followersCount: number;
  followingCount: number;
  location: string;
  instagramUrl?: string;
  hourlyRate?: number;
  skills?: string[];
  height?: string;
  measurements?: string;
  completionScore?: number;
  rankingScore?: number;
  rankPosition?: number;
  // Professional & Booking Fields
  experienceLevel?: 'beginner' | 'intermediate' | 'pro';
  yearsExperience?: number;
  agencyAffiliation?: string;
  workHistoryCount?: number;
  brandCollaborationsCount?: number;
  portfolioQualityScore?: number;
  availabilityStatus?: 'available' | 'busy';
  dailyRate?: number;
  currency?: string;
  reliabilityScore?: number;
  avgRating?: number;
  completedJobs?: number;
  subscription?: {
    type: SubscriptionType;
    endDate: string;
  };
  isDemoContent?: boolean;
}

// Added missing Post interface
export interface Post {
  id: string;
  authorId: string;
  author: User;
  type: 'IMAGE' | 'VIDEO' | 'REEL';
  mediaUrls: string[];
  caption: string;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
  location?: string;
  shootType?: 'editorial' | 'commercial' | 'runway' | 'streetwear' | 'other';
  brandTag?: string;
  photographerTag?: string;
  visibility?: 'public' | 'private';
  isLiked?: boolean;
  isSaved?: boolean;
  isDemoContent?: boolean;
}

export interface Brand {
  id: string;
  brand_name: string;
  logo_url: string;
  description: string;
  location: string;
  website?: string;
  industry?: string;
  created_at: string;
}

export interface CastingCall {
  id: string;
  brand_id: string;
  company_name: string;
  role_title: string;
  category: UserRole;
  location: string;
  shoot_date: string;
  budget: string;
  description: string;
  contact_email: string;
  created_at: string;
  requirements?: string[];
  isDemoContent?: boolean;
}

export interface CastingCallApplication {
  id: string;
  casting_call_id: string;
  user_id: string;
  application_status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
}

export interface Editorial {
  id: string;
  title: string;
  media_url: string;
  photographer_name: string;
  category: string;
  created_at: string;
}

export interface ProfileView {
  id: string;
  user_id: string;
  viewer_id: string;
  created_at: string;
}

export interface WorkCredit {
  id: string;
  user_id: string;
  project_name: string;
  role: string;
  brand_name: string;
  year: number;
  is_verified: boolean;
  created_at: string;
}
