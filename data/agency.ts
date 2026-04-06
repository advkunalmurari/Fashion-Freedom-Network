import { AgencyProfile, ManagedTalent, AgencyCommission } from '../types';
import { MOCK_TALENT_POOL } from './talentPool';

export const MOCK_AGENCY: AgencyProfile = {
    id: 'agency_1',
    name: 'Elite Talent Management India',
    logoUrl: 'https://images.unsplash.com/photo-1549421263-54948a3e0b2a?w=100&auto=format,compress&fm=webp&q=80',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format,compress&fm=webp&q=80',
    description: 'Premier talent agency representing the top 1% of creative professionals in South Asia. Specializing in high-fashion, commercial, and runway.',
    location: 'Mumbai, HQ',
    website: 'www.elite-india.com',
    memberSince: '2023',
    verificationStatus: 'premium',
    talentCount: 42,
    activeBookings: 12
};

export const MOCK_MANAGED_TALENT: ManagedTalent[] = [
    { id: 'mt1', talentId: 't2', agencyId: 'agency_1', contractStart: '2024-01-01', contractEnd: '2025-12-31', commissionRate: 15, status: 'active', talent: MOCK_TALENT_POOL[1] },
    { id: 'mt2', talentId: 't5', agencyId: 'agency_1', contractStart: '2023-06-15', contractEnd: '2025-06-14', commissionRate: 20, status: 'active', talent: MOCK_TALENT_POOL[4] }
];

export const MOCK_AGENCY_COMMISSIONS: AgencyCommission[] = [
    { id: 'ac1', talentId: 't2', amount: 12750, date: '2025-02-17', status: 'paid', bookingRef: 'FFN-BK-9021' },
    { id: 'ac2', talentId: 't5', amount: 24000, date: '2025-02-12', status: 'pending', bookingRef: 'FFN-BK-8842' }
];
