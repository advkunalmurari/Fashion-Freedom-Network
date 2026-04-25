
import React from 'react';
import { m } from 'framer-motion';
import { Wallet, Landmark, Receipt, Clock, CheckCircle2, AlertCircle, TrendingUp, ShieldCheck } from 'lucide-react';
import { ProjectFinancials, PerformanceLedgerEntry } from '../types';

interface PerformanceLedgerProps {
    financials: ProjectFinancials;
}

export const PerformanceLedger: React.FC<PerformanceLedgerProps> = ({ financials }) => {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const getStatusColor = (status: PerformanceLedgerEntry['status']) => {
        return status === 'PAID' ? 'text-green-500 bg-green-500/10' : 'text-amber-500 bg-amber-500/10';
    };

    const getTypeIcon = (type: PerformanceLedgerEntry['type']) => {
        switch (type) {
            case 'MILESTONE': return Wallet;
            case 'TAX': return Receipt;
            case 'FEE': return Landmark;
            default: return Clock;
        }
    };

    return (
        <div className="space-y-8">
            {/* Financial Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/40 backdrop-blur-xl border border-gray-100 p-8 rounded-[2.5rem] space-y-4 shadow-xl shadow-gray-200/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-ffn-black rounded-2xl text-white">
                            <Landmark className="w-5 h-5" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Total Protocol Budget</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-serif italic text-ffn-black">{formatCurrency(financials.totalBudget)}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Defined Strategy</span>
                        </div>
                    </div>
                </m.div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/40 backdrop-blur-xl border border-gray-100 p-8 rounded-[2.5rem] space-y-4 shadow-xl shadow-gray-200/20"
                >
                    <div className="flex items-center justify-between">
                        <div className="p-3 bg-ffn-primary rounded-2xl text-black">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Active Escrow Pulse</span>
                    </div>
                    <div>
                        <h3 className="text-3xl font-serif italic text-ffn-black">{formatCurrency(financials.escrowCurrent)}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <div className="w-2 h-2 rounded-full bg-ffn-primary animate-pulse" />
                            <span className="text-[9px] font-bold text-ffn-primary uppercase tracking-widest">{financials.status.replace('_', ' ')}</span>
                        </div>
                    </div>
                </m.div>

                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-ffn-black p-8 rounded-[2.5rem] space-y-4 shadow-2xl shadow-ffn-black/20 text-white relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Wallet className="w-32 h-32" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-white/10 rounded-2xl text-white">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Gross Deployment</span>
                        </div>
                        <h3 className="text-3xl font-serif italic text-white">{formatCurrency(financials.grossSpent)}</h3>
                        <div className="flex items-center space-x-2 mt-2">
                            <CheckCircle2 className="w-3 h-3 text-ffn-primary" />
                            <span className="text-[9px] font-bold text-white/60 uppercase tracking-widest">Settle in Progress</span>
                        </div>
                    </div>
                </m.div>
            </div>

            {/* Detailed Ledger Table */}
            <div className="bg-white/60 backdrop-blur-2xl border border-gray-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200/20">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-serif italic text-ffn-black">Performance Ledger</h2>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Audit-ready financial protocol</p>
                    </div>
                    <button className="px-6 py-3 bg-gray-50 rounded-2xl text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-ffn-black hover:text-white transition-all">
                        Download PDF Report
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Transaction ID</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Description / Label</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Protocol Type</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Deployment Amount</th>
                                <th className="px-8 py-5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400">Verification Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {financials.ledger.map((entry, idx) => {
                                const Icon = getTypeIcon(entry.type);
                                return (
                                    <m.tr
                                        key={entry.id}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group hover:bg-gray-50/30 transition-colors"
                                    >
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-mono text-gray-400">#{entry.id.slice(0, 8)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-3">
                                                <div className={`p-2 rounded-xl ${getStatusColor(entry.status)} group-hover:scale-110 transition-transform`}>
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <span className="text-[11px] font-bold text-ffn-black uppercase tracking-wider">{entry.label}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="px-3 py-1 bg-gray-100 rounded-full text-[8px] font-black uppercase tracking-widest text-gray-500">
                                                {entry.type}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[12px] font-serif italic text-ffn-black">{formatCurrency(entry.amount)}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center space-x-2">
                                                {entry.status === 'PAID' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : (
                                                    <Clock className="w-4 h-4 text-amber-500" />
                                                )}
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${entry.status === 'PAID' ? 'text-green-600' : 'text-amber-600'}`}>
                                                    {entry.status}
                                                </span>
                                            </div>
                                        </td>
                                    </m.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Escrow Disclaimer */}
            <div className="flex items-start space-x-4 p-6 bg-ffn-primary/5 border border-ffn-primary/10 rounded-2xl">
                <AlertCircle className="w-5 h-5 text-ffn-primary shrink-0" />
                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                    <strong className="text-ffn-black uppercase tracking-widest block mb-1">Escrow Protocol Active</strong>
                    Funds are held securely by FFN Global Nodes. Payments are released upon shoot completion or milestone verification. FFN Protection applies to all transactions within this War Room.
                </p>
            </div>
        </div>
    );
};
