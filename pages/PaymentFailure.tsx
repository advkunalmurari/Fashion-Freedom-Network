import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const REASON_MESSAGES: Record<string, string> = {
    hash_mismatch: 'Payment verification failed. Please contact support if you were charged.',
    server_error: 'A server error occurred while confirming your payment.',
    userCancelled: 'You cancelled the payment.',
    failed: 'The payment was declined by your bank.',
};

const PaymentFailure: React.FC = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const txnid = params.get('txnid');
    const reason = params.get('reason') || 'failed';
    const message = REASON_MESSAGES[reason] || 'The payment could not be completed. Please try again.';

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
                    <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <XCircle className="w-10 h-10 text-red-400" />
                    </div>
                </motion.div>

                <div className="space-y-2">
                    <h1 className="text-3xl font-light text-white tracking-tight">Payment Failed</h1>
                    <p className="text-white/40 text-sm">{message}</p>
                </div>

                {txnid && (
                    <div className="bg-white/5 rounded-2xl p-4 text-left">
                        <div className="flex justify-between text-xs">
                            <span className="text-white/40">Transaction ID</span>
                            <span className="text-white font-mono">{txnid}</span>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-white text-black px-6 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white/90 transition-colors"
                    >
                        <RefreshCw className="w-3 h-3" /> Try Again
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="w-full border border-white/10 text-white/50 px-6 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="w-3 h-3" /> Back to Home
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default PaymentFailure;
