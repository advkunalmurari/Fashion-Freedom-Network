import React, { useState, useRef } from 'react';
import { motion as m } from 'framer-motion';
import { Loader2, ShieldCheck, Zap } from 'lucide-react';
import { supabase } from '../supabase';

interface PayUPaymentProps {
    amount: number;
    productInfo: string;
    firstName: string;
    email: string;
    phone?: string;
    onCancel?: () => void;
    // Default success and failure URLs
    surl?: string;
    furl?: string;
}

export const PayUPayment: React.FC<PayUPaymentProps> = ({
    amount,
    productInfo,
    firstName,
    email,
    phone = '9999999999',
    onCancel,
    surl = `${window.location.origin}/api/payu/success`,
    furl = `${window.location.origin}/api/payu/failure`
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [hashParams, setHashParams] = useState<any>(null);

    // PayU Test Environment URL
    const actionUrl = 'https://secure.payu.in/_payment';

    const handleInitiatePayment = async () => {
        setIsProcessing(true);
        setError(null);

        const txnid = `txnid_${new Date().getTime()}`;

        try {
            // Get current user id to associate the transaction
            const { data: { user: currentUser } } = await supabase.auth.getUser();

            // Log local transaction as 'pending'
            await supabase.from('transactions').insert([{
                txnid,
                amount,
                productinfo: productInfo,
                firstname: firstName,
                email,
                phone,
                status: 'pending',
                gateway: 'payu',
                ...(currentUser ? { user_id: currentUser.id } : {})
            }]);

            // Call Edge Function to safely generate hash
            const { data, error: functionError } = await supabase.functions.invoke('payu-hash', {
                body: { txnid, amount, productinfo: productInfo, firstname: firstName, email }
            });

            if (functionError || data?.error) {
                console.error("Hashing failed:", functionError || data?.error);
                setError(data?.error || "Failed to initiate secure payment. Please try again.");
                setIsProcessing(false);
                return;
            }

            // Set parameters needed for the form
            setHashParams({
                key: data.key,
                txnid,
                hash: data.hash
            });

            // Automatically submit the form to PayU after state updates
            setTimeout(() => {
                if (formRef.current) {
                    formRef.current.submit();
                }
            }, 100);

        } catch (err: any) {
            console.error("Payment initiation error:", err);
            setError(err.message || "An unexpected error occurred.");
            setIsProcessing(false);
        }
    };

    return (
        <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-3xl border border-white/10 p-8 rounded-[3rem] premium-card-depth overflow-hidden relative group"
        >
            {/* Studio Lighting Glow */}
            <div className="absolute inset-0 bg-ffn-primary/5 blur-[80px] pointer-events-none group-hover:bg-ffn-primary/10 transition-colors duration-700" />
            
            {/* Form needed for PayU Post Redirection */}
            {hashParams && (
                 <form ref={formRef} action={actionUrl} method="post" className="hidden">
                    <input type="hidden" name="key" value={hashParams.key} />
                    <input type="hidden" name="txnid" value={hashParams.txnid} />
                    <input type="hidden" name="amount" value={amount} />
                    <input type="hidden" name="productinfo" value={productInfo} />
                    <input type="hidden" name="firstname" value={firstName} />
                    <input type="hidden" name="email" value={email} />
                    <input type="hidden" name="phone" value={phone} />
                    <input type="hidden" name="surl" value={surl} />
                    <input type="hidden" name="furl" value={furl} />
                    <input type="hidden" name="hash" value={hashParams.hash} />
                </form>
            )}

            <div className="relative z-10 space-y-8">
                <div className="flex items-center space-x-3 text-ffn-primary mb-2">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em]">Secure Checkout</span>
                </div>

                <div className="space-y-4">
                    <h3 className="text-3xl editorial-masthead text-white italic">
                        {productInfo}
                    </h3>
                    <div className="text-5xl font-light text-white tracking-tighter">
                        ₹{amount.toLocaleString()}
                    </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                <div className="space-y-3">
                     <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex justify-between">
                         <span>Gateway</span>
                         <span className="text-white">PayU India</span>
                     </p>
                     <p className="text-white/40 text-xs font-bold uppercase tracking-widest flex justify-between">
                         <span>User</span>
                         <span className="text-white">{email}</span>
                     </p>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-xs font-medium text-center">
                        {error}
                    </div>
                )}

                <div className="flex gap-4 pt-4">
                     {onCancel && (
                        <button 
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="flex-1 px-6 py-4 rounded-[2rem] border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                     )}
                     <button
                        onClick={handleInitiatePayment}
                        disabled={isProcessing}
                        className="flex-[2] relative overflow-hidden bg-white text-black px-6 py-4 rounded-[2rem] group/btn flex items-center justify-center space-x-3 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
                     >
                        <div className="absolute inset-0 bg-ffn-primary -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-700" />
                        <div className="relative z-10 flex items-center space-x-2 group-hover/btn:text-white transition-colors">
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Processing</span>
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 fill-current" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Pay Securely</span>
                                </>
                            )}
                        </div>
                     </button>
                </div>
                <div className="text-center">
                    <span className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em]">
                        Your connection is encrypted and secured by Antigravity Protocols.
                    </span>
                </div>
            </div>
        </m.div>
    );
};
