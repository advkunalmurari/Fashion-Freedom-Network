import React, { useState } from 'react';
import { Contract, ContractSignature, User } from '../types';
import { MOCK_TALENT_POOL } from '../constants';
import { ScrollText, PenTool, CheckCircle, Clock, AlertTriangle, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface ContractViewerProps {
    contract: Contract;
    currentUser: User;
    onSign: (signature: ContractSignature) => void;
    onClose: () => void;
}

export const ContractViewer: React.FC<ContractViewerProps> = ({ contract, currentUser, onSign, onClose }) => {
    const [signatureName, setSignatureName] = useState('');
    const [hasAgreed, setHasAgreed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const isBrand = currentUser.id === contract.brandId;
    const isTalent = currentUser.id === contract.talentId;

    const needsMySignature =
        (isBrand && !contract.brandSignature) ||
        (isTalent && !contract.talentSignature && contract.brandSignature); // Talent signs after brand

    const handleSign = async () => {
        if (!signatureName.trim() || !hasAgreed) return;

        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            onSign({
                name: signatureName,
                date: new Date().toISOString(),
                ipAddress: '192.168.1.1' // Mock IP 
            });
            setIsSubmitting(false);
        }, 1500);
    };

    const StatusBadge = () => {
        if (contract.status === 'completed') {
            return <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Fully Executed</span>;
        }
        if (needsMySignature) {
            return <span className="bg-red-50 text-red-500 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center"><PenTool className="w-3 h-3 mr-1" /> Action Required</span>;
        }
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[9px] uppercase tracking-widest font-black flex items-center"><Clock className="w-3 h-3 mr-1" /> Pending Other Party</span>;
    };

    const getPartyInfo = (id: string, signature?: ContractSignature) => {
        const user = MOCK_TALENT_POOL.find(u => u.id === id); // Mocking lookup 
        return (
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex-1">
                <p className="text-[9px] uppercase tracking-widest text-gray-400 font-bold mb-4">{id === contract.brandId ? 'Hiring Brand' : 'Talent'}</p>
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden">
                        {user?.avatarUrl ? <img src={user.avatarUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-300" />}
                    </div>
                    <div>
                        <p className="font-serif italic font-bold">{user?.displayName || 'Unknown Party'}</p>
                        {/* Depending on scope this could be user's legal name, company name */}
                    </div>
                </div>

                {signature ? (
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-[10px] text-gray-500 mb-1">Digitally Signed By</p>
                        <p className="font-serif text-xl text-ffn-primary italic signature-font">{signature.name}</p>
                        <p className="text-[9px] font-mono text-gray-400 mt-2">
                            IP: {signature.ipAddress || 'Verified'}<br />
                            {new Date(signature.date).toLocaleString()}
                        </p>
                    </div>
                ) : (
                    <div className="border-t border-gray-200 pt-4 flex items-center space-x-2 text-amber-500">
                        <Clock className="w-4 h-4" />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Pending Signature</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full max-w-4xl bg-white h-full shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white z-10 sticky top-0">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-ffn-primary/5 rounded-full flex items-center justify-center text-ffn-primary">
                            <ScrollText className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-serif italic text-ffn-black">{contract.type} Agreement</h2>
                            <div className="flex items-center space-x-3 mt-1">
                                <p className="text-[10px] uppercase tracking-widest text-gray-400">Ref: {contract.id}</p>
                                <StatusBadge />
                            </div>
                        </div>
                    </div>
                    <button
                        title="Close Contract"
                        onClick={onClose}
                        className="p-3 bg-gray-50 text-gray-400 rounded-full hover:bg-gray-100 hover:text-ffn-black transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-12 bg-gray-50/50">
                    <div className="max-w-3xl mx-auto space-y-12">

                        {/* Signatories Info */}
                        <div className="flex flex-col md:flex-row gap-6">
                            {getPartyInfo(contract.brandId, contract.brandSignature)}
                            {getPartyInfo(contract.talentId, contract.talentSignature)}
                        </div>

                        {/* Legal Terms Document */}
                        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
                            <div className="prose prose-sm max-w-none prose-p:leading-relaxed prose-headings:font-serif prose-headings:italic text-gray-600">
                                {contract.terms.split('\\n').map((paragraph, i) => (
                                    <p key={i} className={paragraph.trim() === '' ? 'h-4' : 'mb-4'}>
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Action Panel (Signature Box) */}
                {needsMySignature && (
                    <div className="border-t border-gray-200 bg-white p-8 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex items-start space-x-4 mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100">
                                <AlertTriangle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    By typing your name and clicking "Sign Agreement", you are signing this document electronically. You agree your electronic signature is the legal equivalent of your manual signature on this Agreement.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-4">
                                    <label className="block text-[10px] uppercase tracking-widest font-bold text-gray-500">
                                        Type your full legal name
                                    </label>
                                    <input
                                        type="text"
                                        value={signatureName}
                                        onChange={(e) => setSignatureName(e.target.value)}
                                        placeholder="E.g., Jane Doe"
                                        className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:border-ffn-primary focus:ring-1 focus:ring-ffn-primary outline-none transition-all font-serif text-lg"
                                    />

                                    <label className="flex items-start space-x-3 cursor-pointer group mt-4">
                                        <div className="relative flex items-center justify-center pt-1">
                                            <input
                                                type="checkbox"
                                                checked={hasAgreed}
                                                onChange={(e) => setHasAgreed(e.target.checked)}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded flex items-center justify-center transition-all ${hasAgreed ? 'bg-ffn-primary' : 'bg-white border-2 border-gray-300 group-hover:border-ffn-primary'}`}>
                                                {hasAgreed && <CheckCircle className="w-3 h-3 text-white" />}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 leading-relaxed">I have read, understand, and agree to be bound by the terms of this Agreement.</span>
                                    </label>
                                </div>

                                <div>
                                    <button
                                        onClick={handleSign}
                                        disabled={!signatureName.trim() || !hasAgreed || isSubmitting}
                                        className={`w-full py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold transition-all shadow-xl flex items-center justify-center space-x-2
                                    ${(!signatureName.trim() || !hasAgreed || isSubmitting)
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-ffn-black text-white hover:bg-ffn-primary hover:-translate-y-1 hover:shadow-2xl'
                                            }`}
                                    >
                                        {isSubmitting ? <span className="animate-pulse">Signing...</span> : <><PenTool className="w-4 h-4" /> <span>Sign Agreement</span></>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </motion.div>
        </div>
    );
};
