import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight, Receipt } from 'lucide-react';

const PaymentSuccess: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const txnid = params.get('txnid');
    const mihpayid = params.get('mihpayid');
    const amount = params.get('amount');

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-black/60 backdrop-blur-3xl border border-white/10 p-10 rounded-[3rem] text-center space-y-8"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="flex justify-center"
                >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-light text-white tracking-tight">Payment Successful</h1>
                    <p className="text-white/40 text-sm">Your account has been upgraded</p>
                </div>

                {(txnid || mihpayid || amount) && (
                    <div className="bg-white/5 rounded-2xl p-5 space-y-3 text-left">
                        <div className="flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-widest mb-3">
                            <Receipt className="w-3 h-3" />
                            <span>Transaction Details</span>
                        </div>
                        {txnid && (
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Transaction ID</span>
                                <span className="text-white font-mono">{txnid}</span>
                            </div>
                        )}
                        {mihpayid && (
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">PayU Reference</span>
                                <span className="text-white font-mono">{mihpayid}</span>
                            </div>
                        )}
                        {amount && (
                            <div className="flex justify-between text-xs">
                                <span className="text-white/40">Amount Paid</span>
                                <span className="text-white">₹{parseFloat(amount).toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate('/my-profile')}
                        className="w-full bg-white text-black px-6 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                    >
                        View My Profile <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full border border-white/10 text-white/50 px-6 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all"
                    >
                        Go to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
