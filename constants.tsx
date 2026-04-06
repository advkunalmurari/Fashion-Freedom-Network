import { SubscriptionType } from './types';

// Core Business Constants
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

// Re-export modular data
export * from './data/talentPool';
export * from './data/marketplace';
export * from './data/social';
export * from './data/projects';
export * from './data/trends';
export * from './data/earnings';
export * from './data/agency';
export * from './data/system';

// Note: LOGO_SVG has been moved to components/icons/Logo.tsx
// Usage: import { Logo } from './components/icons/Logo';
