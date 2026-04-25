
import React from 'react';
import { m } from 'framer-motion';
import { DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AgencyCommission } from '../types';

interface CommissionLedgerProps {
    commissions: AgencyCommission[];
}

export const CommissionLedger: React.FC<CommissionLedgerProps> = ({ commissions }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-serif italic text-white">Commission Ledger</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-ffn-primary">Professional Revenue Stream</p>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Total Pending</span>
                        <div className="text-lg font-serif italic text-white">₹1,27,500</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-right">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Total Received</span>
                        <div className="text-lg font-serif italic text-ffn-primary">₹8,45,000</div>
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5 backdrop-blur-3xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-gray-500">Talent Identity</th>
                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-gray-500">Project / Node</th>
                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-gray-500">Total Amount</th>
                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-gray-500">Commission</th>
                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-gray-500">Status</th>
                            <th className="px-6 py-4 text-[8px] font-black uppercase tracking-widest text-gray-500">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {commissions.map((comm, idx) => (
                            <m.tr
                                key={comm.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="hover:bg-white/5 transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    <span className="text-xs font-bold text-white group-hover:text-ffn-primary transition-colors">{comm.talentName}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[10px] text-gray-400 font-medium">{comm.projectName}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-serif text-white">₹{comm.totalAmount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-xs font-serif text-ffn-primary font-bold">₹{comm.commissionAmount.toLocaleString()}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        {comm.status === 'received' ? (
                                            <>
                                                <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-green-500">Received</span>
                                            </>
                                        ) : comm.status === 'pending' ? (
                                            <>
                                                <Clock className="w-3 h-3 text-ffn-primary" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-ffn-primary">Pending</span>
                                            </>
                                        ) : (
                                            <>
                                                <AlertCircle className="w-3 h-3 text-red-500" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-red-500">Disputed</span>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 font-mono italic">{comm.date}</span>
                                </td>
                            </m.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">Growth Delta</span>
                        <div className="flex items-center space-x-1 text-green-500">
                            <ArrowUpRight className="w-3 h-3" />
                            <span className="text-[10px] font-black">+14.2%</span>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <m.div
                            initial={{ width: 0 }}
                            animate={{ width: '75%' }}
                            className="h-full bg-ffn-primary shadow-[0_0_10px_#FFD700]"
                        />
                    </div>
                    <p className="text-[9px] text-gray-500 uppercase tracking-widest leading-relaxed">Commission efficiency is reaching peak liquidity across Milan nodes.</p>
                </div>
                <button className="p-6 rounded-3xl bg-ffn-primary flex items-center justify-center space-x-4 hover:brightness-110 transition-all group shadow-xl shadow-ffn-primary/20">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">Initiate Batch Payout</span>
                    <ArrowUpRight className="w-5 h-5 text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
