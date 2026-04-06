import { EarningsTransaction, EarningsMonthlySummary, EarningsStream } from '../types';

export const MOCK_EARNINGS_TRANSACTIONS: EarningsTransaction[] = [
    {
        id: 'et1',
        talentId: 't1',
        date: '2025-02-15',
        amount: 45000,
        grossAmount: 50000,
        stream: 'Brand Deal',
        description: 'SS26 Summer Campaign - Nykaa',
        status: 'paid'
    },
    {
        id: 'et2',
        talentId: 't1',
        date: '2025-02-20',
        amount: 20000,
        grossAmount: 22000,
        stream: 'Casting Booking',
        description: 'Bank Transfer',
        status: 'pending'
    }
];

export const MOCK_EARNINGS_MONTHLY: EarningsMonthlySummary[] = [
    {
        month: 'Jan',
        totalEarned: 65000,
        brandDeals: 50000,
        masterclasses: 5000,
        rentals: 5000,
        bookings: 5000,
        referrals: 0
    },
    {
        month: 'Feb',
        totalEarned: 85000,
        brandDeals: 60000,
        masterclasses: 10000,
        rentals: 5000,
        bookings: 10000,
        referrals: 0
    }
];

export const MOCK_EARNINGS: EarningsTransaction[] = MOCK_EARNINGS_TRANSACTIONS;
