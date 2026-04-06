
export enum UserRole {
  MODEL = 'MODEL',
  DESIGNER = 'DESIGNER',
  STYLIST = 'STYLIST',
  MUA = 'MUA',
  SINGER = 'SINGER',
  DANCER = 'DANCER',
  ARTIST = 'ARTIST',
  BRAND = 'BRAND',
  AGENCY = 'AGENCY',
  PHOTOGRAPHER = 'PHOTOGRAPHER'
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
  twitterUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  coverVideoUrl?: string;
  achievements?: {
    id: string;
    title: string;
    date: string;
    type: 'EVENT' | 'PUBLICATION' | 'COLLAB';
    icon?: string;
  }[];
  tiktokUrl?: string;
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
  dailyRate?: number;
  currency?: string;
  reliabilityScore?: number;
  avgRating?: number;
  completedJobs?: number;
  subscription?: {
    type: SubscriptionType;
    endDate: string;
  };
  arMeasurements?: ARBodyMeasurements;
  stats?: {
    reliability?: number;
    avgRating?: number;
    postCount?: number;
    followersCount?: number;
    completedBookings?: number;
  };
  availability?: {
    isAvailable: boolean;
    ratePerDay?: number;
    nextAvailableDate?: string;
  };
  lookbooks?: Lookbook[];
  endorsements?: Endorsement[];
  collaborators?: User[];
  reviews?: Review[];
  availabilityStatus?: 'available' | 'busy' | 'on-set' | 'traveling';
  availabilityCalendar?: { date: string; status: 'available' | 'busy' }[];
  analytics?: {
    reach: number;
    engagement: number;
    growth: number;
    topMarkets: string[];
    monthlyViews: { month: string; value: number }[];
  };
  workCredits?: WorkCredit[];
  isDemoContent?: boolean;
  verificationStatus?: 'unverified' | 'pending' | 'verified' | 'rejected';
  trustScore?: number;
  aestheticTags?: string[];
  aestheticMatchScore?: number;
}

export interface Story {
  id: string;
  user_id: string;
  user: User;
  media_url: string;
  media_type: 'image' | 'video';
  story_tag?: string;
  createdAt?: string;
}

// Added missing Post interface
export interface Post {
  id: string;
  authorId: string;
  author: User;
  type: 'IMAGE' | 'VIDEO' | 'REEL';
  mediaUrls: string[];
  thumbnailUrl?: string; // Explicit thumbnail for videos
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
  brand_id?: string;      // Legacy / DB field
  company_name?: string;  // Legacy
  brandName?: string;    // New
  brandLogo?: string;
  brandVerified?: boolean;
  role_title?: string;    // Legacy
  title?: string;        // New
  category?: UserRole;
  location?: string;
  city?: string;
  shoot_date?: string;    // Legacy
  shootDate?: string;    // New
  budget?: string;        // Legacy
  fee?: number;          // New
  description: string;
  contact_email?: string;
  created_at?: string;
  requirements?: string[];
  deliverables?: string[];
  status?: CastingStatus;
  applicantCount?: number;
  maxApplicants?: number;
  tags?: string[];
  coverImage?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
  postedAt?: string;
  escrowProtected?: boolean;
  deadline?: string;
  roles?: CastingRole[];
  compensation?: CastingCompensation;
  isDemoContent?: boolean;
}

export interface CastingCallApplication {
  id: string;
  casting_call_id: string;
  user_id: string;
  application_status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  created_at: string;
  pitchText?: string;
  videoPitchUrl?: string;
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

export interface Lookbook {
  id: string;
  creatorId: string;
  title: string;
  subtitle?: string;
  coverImage: string;
  images: string[];
  tags: string[];
  createdAt: string;
}

export interface Endorsement {
  id: string;
  talentId: string;
  brandName: string;
  brandLogo: string;
  content: string;
  date: string;
  verified: boolean;
}

export interface MoodBoardItem {
  id: string;
  board_id: string;
  media_url: string;
  note?: string;
  added_by: string;
  added_at: string;
  original_post_id?: string;
}

export interface MoodBoardComment {
  id: string;
  board_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
}

export interface MoodBoardCollaborator {
  user_id: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  user: User;
}

export interface MoodBoard {
  id: string;
  title: string;
  description?: string;
  created_by: string;
  created_at: string;
  coverImage?: string;
  collaborators: MoodBoardCollaborator[];
  items?: MoodBoardItem[];
  comments?: MoodBoardComment[];
  isDemoContent?: boolean;
}

export interface CastingParticipant {
  id: string;
  castingId: string;
  userId: string;
  user?: User;
  status: 'waiting' | 'in_call' | 'completed' | 'passed' | 'shortlisted';
  joinedAt: string;
}

export interface LiveCasting {
  id: string;
  castingId: string;
  brandId: string;
  title: string;
  status: 'waiting' | 'live' | 'completed';
  currentParticipantId?: string;
  participants: CastingParticipant[];
}

export interface ContractSignature {
  name: string;
  date: string;
  ipAddress?: string;
}

export interface Contract {
  id: string;
  castingId: string; // The job they are hired for
  brandId: string;
  talentId: string;
  type: 'Model Release' | 'NDA' | 'Custom';
  status: 'draft' | 'pending_brand' | 'pending_talent' | 'completed';
  terms: string;
  brandSignature?: ContractSignature;
  talentSignature?: ContractSignature;
  createdAt: string;
  updatedAt: string;
}

export type RentalCategory = 'Studio Space' | 'Lighting' | 'Camera & Lenses' | 'Wardrobe Archive' | 'Props & Sets' | 'Other';

export interface RentalListing {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: RentalCategory;
  pricePerDay: number;
  pricePerHour?: number;
  location: string;
  images: string[];
  amenities?: string[];
  isAvailable: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface RentalBooking {
  id: string;
  listingId: string;
  renterId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
}

// ─── Masterclasses & Mentorship ───────────────────────────────────────────────
export type MasterclassFormat = 'Live Webinar' | '1-on-1 Session' | 'Course' | 'Portfolio Review';
export type MasterclassLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface MasterclassLesson {
  id: string;
  title: string;
  durationMins: number;
  isPreview?: boolean;
}

export interface Masterclass {
  id: string;
  instructorId: string;
  title: string;
  subtitle: string;
  format: MasterclassFormat;
  level: MasterclassLevel;
  category: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  durationMins?: number;
  lessons?: MasterclassLesson[];
  enrolledCount: number;
  rating: number;
  reviewCount: number;
  skills: string[];
  nextSessionDate?: string;
  isLive: boolean;
  createdAt: string;
}

// ─── AR Body Measurements ─────────────────────────────────────────────────────
export type MeasurementUnit = 'cm' | 'in';

export interface ARBodyMeasurements {
  talentId: string;
  verifiedAt: string; // ISO timestamp — locked at verification moment
  expiresAt: string;  // Valid for 90 days
  verificationMethod: 'AR Scan' | 'Manual (Unverified)';
  unit: MeasurementUnit;
  // Core measurements in cm
  height: number;
  bust: number;
  waist: number;
  hips: number;
  inseam: number;
  shoulder: number;
  shoeSize: string; // e.g. "UK 7 / EU 41"
  // Derived fit sizes
  topSize: string; // XS/S/M/L/XL
  bottomSize: string;
  dressSize: string;
  // Optional extended measurements
  neck?: number;
  chest?: number;
  sleeve?: number;
  thigh?: number;
  // AR confidence score 0–100
  arConfidence: number;
}

// ─── Creator Earnings Dashboard ───────────────────────────────────────────────
export type EarningsStream =
  | 'Brand Deal'
  | 'Masterclass'
  | 'Rental Income'
  | 'Casting Booking'
  | 'Referral Bonus'
  | 'Subscription Share';

export interface EarningsTransaction {
  id: string;
  talentId: string;
  date: string; // ISO
  amount: number; // INR, after FFN commission
  grossAmount: number; // before commission
  stream: EarningsStream;
  description: string;
  brandOrClient?: string;
  status: 'paid' | 'pending' | 'processing';
  payoutDate?: string;
}

export interface EarningsMonthlySummary {
  month: string; // 'Jan', 'Feb', …
  totalEarned: number;
  brandDeals: number;
  masterclasses: number;
  rentals: number;
  bookings: number;
  referrals: number;
}

// ─── Fashion Trend Forecaster ─────────────────────────────────────────────────
export type TrendMomentum = 'Exploding' | 'Rising' | 'Stable' | 'Declining' | 'Dead';

export interface TrendSignalPoint {
  week: string;   // 'W1', 'W2', …
  score: number;  // 0–100 volume index
}

export interface TrendSignal {
  id: string;
  name: string;               // e.g. "Quiet Luxury"
  category: string;           // 'Aesthetic', 'Colour', 'Silhouette', 'Fabric', 'Occasion'
  momentum: TrendMomentum;
  currentScore: number;       // 0–100
  weeklyChange: number;       // +/- percent
  description: string;
  tags: string[];
  relatedTalent?: string[];   // talent ids
  relatedBrands?: string[];
  coverImage: string;
  sparkline: TrendSignalPoint[];
}

export interface SentimentSignal {
  id: string;
  keyword: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  volume: number;
  velocity: number;
}

export interface AestheticSpotlight {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  demandGrowth: number;
  topNodes: string[];
}

// --- Marketplace & Professional Hub ---
export interface MarketMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
}

export interface MarketplaceItem {
  id: string;
  title: string;
  price: string;
  rating: number;
  image: string;
  author: string;
  role: string;
  description: string;
  deliverables: string[];
  type: 'digital' | 'physical' | 'service';
  velocity: number; // 0-100 demand score
  trustScore: number; // 0-100
  recentActivity?: string;
  metrics: MarketMetric[];
}

export interface BoutiqueSpotlight {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  specialization: string[];
  capacity: string;
  location: string;
}

export interface LiveDrop {
  id: string;
  title: string;
  brand: string;
  timeRemaining: string; // ISO or countdown string
  slotsTotal: number;
  slotsRemaining: number;
  price: string;
  type: 'service' | 'limited-edition';
}






// ─── Notifications ─────────────────────────────────────────────────────────────
export type NotificationType =
  | 'hire'
  | 'message'
  | 'contract'
  | 'casting_match'
  | 'payment'
  | 'follow'
  | 'casting_shortlist'
  | 'review'
  | 'ar_verified'
  | 'trend_alert'
  | 'milestone'
  | 'system';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: string; // ISO
  isRead: boolean;
  avatarUrl?: string;
  actionLabel?: string;
  actionRoute?: string;
  metadata?: Record<string, string>;
}

// ─── Open Casting Calls Board ─────────────────────────────────────────────────
export type CastingRole = 'Model' | 'Photographer' | 'Stylist' | 'Makeup Artist' | 'Art Director' | 'Videographer';
export type CastingStatus = 'Open' | 'Closing Soon' | 'Closed' | 'Filled';
export type CastingCompensation = 'Paid' | 'TFP' | 'Product Exchange';

// Consolidated into main CastingCall interface above

// ─── Reviews & Ratings ─────────────────────────────────────────────────────────
export type ReviewerRole = 'brand' | 'talent';

export interface ReviewTag {
  label: string;
  positive: boolean;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerName: string;
  reviewerRole: ReviewerRole;
  reviewerAvatarUrl?: string;
  reviewerBrandName?: string;    // if brand reviewer
  subjectId: string;             // talent or brand id being reviewed
  rating: number;                // 1–5
  headline: string;
  body: string;
  tags: ReviewTag[];
  categories: {
    professionalism: number;     // 1–5
    communication: number;
    creativity: number;
    punctuality: number;
    valueForMoney?: number;      // brands only
  };
  campaignTitle: string;
  date: string;                  // ISO
  isVerifiedBooking: boolean;
  helpfulCount: number;
  brandResponse?: string;        // brand's reply to talent's review
}

export interface RatingSummary {
  subjectId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: Record<1 | 2 | 3 | 4 | 5, number>;
  categoryAverages: {
    professionalism: number;
    communication: number;
    creativity: number;
    punctuality: number;
  };
  topPositiveTags: string[];
}

// ─── Brand Reviews (talent rates brands) ──────────────────────────────────────
export interface BrandReview {
  id: string;
  brandId: string;
  reviewerName: string;
  reviewerRole: string;          // e.g. "Model", "Photographer"
  reviewerAvatarUrl?: string;
  rating: number;                // 1–5
  headline: string;
  body: string;
  categories: {
    paymentSpeed: number;        // 1–5
    communication: number;
    setEnvironment: number;
    briefClarity: number;
    wouldWorkAgain: boolean;
  };
  campaignTitle: string;
  date: string;
  isVerifiedBooking: boolean;
  helpfulCount: number;
}

export interface BrandProfile {
  id: string;
  name: string;
  logoUrl: string;
  coverImage: string;
  industry: string;
  location: string;
  description: string;
  website?: string;
  founded?: string;
  teamSize?: string;
  isVerified: boolean;
  totalHires: number;
  totalSpend: number;         // INR
  avgRating: number;
  totalReviews: number;
  paymentSpeedScore: number;
  communicationScore: number;
  wouldWorkAgainPct: number;  // %
  activeCastings: number;
  badges: string[];
  socialLinks?: { instagram?: string; linkedin?: string };
}

// ─── Escrow Payment Tracker ───────────────────────────────────────────────────
export type EscrowStatus =
  | 'pending_deposit'     // brand hasn't funded yet
  | 'funded'              // money held in escrow
  | 'shoot_complete'      // talent confirmed delivery
  | 'release_pending'     // 72h auto-release window
  | 'released'            // money sent to talent
  | 'disputed'            // either party raised a dispute
  | 'refunded'            // money returned to brand
  | 'cancelled';

export interface EscrowMilestone {
  id: string;
  label: string;
  completedAt?: string;   // ISO — if done
  dueAt?: string;         // ISO — if upcoming
  status: 'done' | 'active' | 'upcoming';
}

export interface EscrowTransaction {
  id: string;
  bookingRef: string;
  brandName: string;
  brandLogoUrl: string;
  talentName: string;
  talentAvatarUrl: string;
  campaignTitle: string;
  shootDate: string;             // ISO
  amount: number;                // INR
  ffnFee: number;                // INR
  talentReceives: number;        // INR
  currency: 'INR';
  status: EscrowStatus;
  fundedAt?: string;
  deliveryDeadline?: string;
  autoReleaseAt?: string;        // ISO — 72h after shoot_complete
  releasedAt?: string;
  disputeRaisedAt?: string;
  disputeReason?: string;
  milestones: EscrowMilestone[];
  contractSigned: boolean;
  paymentMethod: 'UPI' | 'NEFT' | 'PayPal' | 'Stripe';
  isUserBrand: boolean;          // perspective — true = viewing as brand, false = talent
  ledger?: PerformanceLedgerEntry[];
}

export interface PerformanceLedgerEntry {
  id: string;
  label: string;
  amount: number;
  type: 'MILESTONE' | 'TAX' | 'FEE' | 'REIMBURSEMENT';
  status: 'PENDING' | 'PAID';
  date?: string;
}

export interface ProjectFinancials {
  totalBudget: number;
  grossSpent: number;
  escrowCurrent: number;
  status: EscrowStatus;
  ledger: PerformanceLedgerEntry[];
}

// ─── Profile Analytics & Insights ─────────────────────────────────────────────
export interface ProfileVisitor {
  id: string;
  visitor: User;
  visitedAt: string; // ISO
  actionTaken?: 'VIEW' | 'SAVE' | 'HIRE_CLICK' | 'FOLLOW' | 'REEL_PLAY';
}

export interface AnalyticsMetric {
  date: string; // 'YYYY-MM-DD'
  views: number;
  saves: number;
  hires: number;
  engagement: number; // e.g. clicks on reels/posts
}

export interface CreatorInsights {
  talentId: string;
  totalViews: number;
  totalSaves: number;
  totalHires: number;
  avgEngagementRate: number;
  recentVisitors: ProfileVisitor[];
  dailyMetrics: AnalyticsMetric[];
}

export interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  creator: {
    id: string;
    displayName: string;
    avatarUrl: string;
    role: string;
  };
  requirements: string[];
  tags: string[];
  createdAt: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  type: 'TFP' | 'PAID' | 'SPEC';
  location?: string;
}

export interface PressRelease {
  id: string;
  title: string;
  date: string;
  category: 'PRODUCT' | 'PARTNERSHIP' | 'EVENT' | 'MILESTONE';
  excerpt: string;
  content: string;
  imageUrl: string;
  pdfUrl?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: string;
}

// ─── Portfolio Infrastructure ────────────────────────────────────────────────
export type PortfolioTemplate = 'MASONRY' | 'GRID' | 'NARRATIVE_STACK' | 'FULL_BLEED';

export interface PortfolioLayout {
  id: string;
  userId: string;
  template: PortfolioTemplate;
  items: PortfolioItem[];
  createdAt: string;
  isActive: boolean;
}

export interface PortfolioItem {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  size: 'small' | 'medium' | 'large' | 'wide' | 'tall';
  order: number;
  caption?: string;
}

// ─── AI Aesthetic Intelligence ───────────────────────────────────────────────
export interface AestheticPulse {
  primaryAesthetic: string;
  secondaryAesthetics: string[];
  colorPalette: string[];
  visualSignature: string; // Brief AI summary
  compatibilityIndex: number; // 0-100
}

export interface ProjectMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
}

export interface ProjectFile {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface WarRoom {
  id: string;
  projectId: string;
  title: string;
  brand: {
    id: string;
    name: string;
    logoUrl: string;
  };
  talent: {
    id: string;
    name: string;
    avatarUrl: string;
  };
  status: 'ACTIVE' | 'ARCHIVED';
  milestones: ProjectMilestone[];
  messages: ProjectMessage[];
  files: ProjectFile[];
  financials?: ProjectFinancials;
  lastActivity: string;
}


export interface SystemActivity {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  action: string;
  targetName: string;
  timestamp: string;
  category: 'PROJECT' | 'NETWORK' | 'MARKETPLACE';
}

export interface TalentCollection {
  id: string;
  brandId: string;
  title: string;
  description?: string;
  coverImage?: string;
  talentIds: string[];
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  startDate: string; // ISO
  endDate: string;   // ISO
  status: 'booked' | 'tentative' | 'unavailable';
  title?: string;
}

export interface TeamComment {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  tags?: string[];
  targetId: string; // talent user id
}

// ─── Universal Professional Protocol ─────────────────────────────────────────
export type ProtocolCategory = 'DIRECT' | 'PROJECT' | 'CASTING' | 'SYSTEM';

export interface ProtocolMessage {
  id: string;
  category: ProtocolCategory;
  sender: {
    id: string;
    name: string;
    avatar: string;
    role: UserRole;
  };
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  status: 'online' | 'offline' | 'busy';
  contextId?: string; // Links to Casting ID or Project ID
  urgency: 'high' | 'medium' | 'low';
}

export interface ActivityNode {
  id: string;
  type: 'MILESTONE' | 'APPLICATION' | 'CONTRACT' | 'PAYMENT';
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'action-required';
  link?: string;
}// ─── Agency Command Center ───────────────────────────────────────────────────
export interface ManagedTalent {
  id: string;
  user: User;
  status: 'active' | 'idle' | 'on-set' | 'traveling';
  activeProjects: number;
  totalEarnings: number;
  commissionRate: number; // e.g., 0.2 for 20%
  nextBooking?: string;
}

export interface AgencyCommission {
  id: string;
  talentId: string;
  talentName: string;
  projectName: string;
  date: string;
  totalAmount: number;
  commissionAmount: number;
  status: 'pending' | 'received' | 'disputed';
}

export interface AgencyProfile {
  id: string;
  name: string;
  logoUrl: string;
  coverImage: string;
  location: string;
  description: string;
  rosterCount: number;
  activeBookings: number;
  totalRevenue: number;
  monthlyGrowth: number;
  verified: boolean;
}

// ─── Phase 45: Trend Lab & Global Search ───────────────────────────────────────
export interface SearchResult {
  id: string;
  type: 'talent' | 'brand' | 'casting' | 'project';
  title: string;
  subtitle: string;
  avatarUrl?: string;
  link: string;
  isVerified?: boolean;
  trustScore?: number;
}

export interface TrendMetric {
  id: string;
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface SentimentSignal {
  id: string;
  keyword: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  volume: number;
  velocity: number;
}

export interface AestheticSpotlight {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  description: string;
  demandGrowth: number;
  topNodes: string[];
}

export interface StyleNode {
  id: string;
  city: string;
  styleName: string;
  demandScore: number; // 0-100
  activeTalent: number;
  growth: number;
}

// ─── Phase 78: Recruitment & Brand CRM ───────────────────────────────────────
export type RecruitmentStatus = 'SCOUTED' | 'INTERVIEWING' | 'NEGOTIATING' | 'BOOKED' | 'ARCHIVED';

export interface PrivateBrandNote {
  id: string;
  brandId: string;
  talentId: string;
  content: string;
  createdAt: string;
  authorName: string;
}

export interface RecruitmentLead {
  id: string;
  brandId: string;
  talentId: string;
  status: RecruitmentStatus;
  updatedAt: string;
  notes?: PrivateBrandNote[];
  matchScore: number;
}
