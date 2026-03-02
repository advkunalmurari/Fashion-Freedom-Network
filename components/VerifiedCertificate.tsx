import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Download, Share2, Award, QrCode, Calendar, User as UserIcon, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface VerifiedCertificateProps {
    user: User;
    verificationDate: string;
    trustScore: number;
}

export const VerifiedCertificate: React.FC<VerifiedCertificateProps> = ({ user, verificationDate, trustScore }) => {
    const certificateRef = useRef<HTMLDivElement>(null);

    const handleDownload = () => {
        // In a real app, this would trigger a PDF/PNG generation
        console.log("Downloading certificate...");
    };

    return (
        <div className="flex flex-col items-center space-y-10 p-8">
            <motion.div
                ref={certificateRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-2xl aspect-[1.414/1] bg-white border-[12px] border-double border-ffn-black/5 rounded-[2rem] overflow-hidden shadow-2xl p-16 flex flex-col items-center justify-between text-center select-none"
            >
                {/* Background Watermark/Aesthetic */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center overflow-hidden">
                    <h1 className="text-[20rem] font-black uppercase tracking-tighter -rotate-12 translate-y-20">FFN</h1>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-ffn-primary/20" />
                <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-ffn-primary/20" />
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-ffn-primary/20" />
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-ffn-primary/20" />

                {/* Header */}
                <div className="space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-ffn-black rounded-3xl flex items-center justify-center text-ffn-primary">
                            <ShieldCheck className="w-10 h-10" />
                        </div>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-ffn-primary">Universal Identity Protocol</p>
                    <h2 className="text-4xl font-serif italic tracking-tighter text-ffn-black">Certificate of Professionalism.</h2>
                </div>

                {/* Content */}
                <div className="space-y-6 w-full max-w-md">
                    <div className="space-y-1">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">This document verifies that</p>
                        <h3 className="text-3xl font-bold text-ffn-black tracking-tight flex items-center justify-center space-x-3">
                            <span>{user.displayName || user.username}</span>
                            <CheckCircle className="w-6 h-6 text-ffn-primary" />
                        </h3>
                    </div>

                    <p className="text-[11px] text-gray-500 font-light leading-relaxed max-w-xs mx-auto">
                        Has successfully synchronized their professional identity with the Fashion Freedom Network global graph, passing the Neural Verification protocol for
                        <span className="font-bold text-ffn-black"> {user.role}</span>.
                    </p>
                </div>

                {/* Footer / Meta Data */}
                <div className="w-full grid grid-cols-3 gap-8 items-end border-t border-gray-100 pt-10">
                    <div className="space-y-2 text-left">
                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 flex items-center space-x-2">
                            <Calendar className="w-3 h-3 text-ffn-primary" />
                            <span>Verified At</span>
                        </p>
                        <p className="text-[9px] font-bold text-ffn-black uppercase tracking-widest">{verificationDate}</p>
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 p-2">
                            <QrCode className="w-full h-full text-ffn-black opacity-80" />
                        </div>
                        <p className="text-[6px] font-black uppercase tracking-[0.3em] text-gray-300">Scan to Verify Node</p>
                    </div>

                    <div className="space-y-2 text-right">
                        <p className="text-[7px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-end space-x-2">
                            <span>Trust Score</span>
                            <Award className="w-3 h-3 text-ffn-primary" />
                        </p>
                        <p className="text-xl font-serif italic text-ffn-primary">{trustScore}/1000</p>
                    </div>
                </div>

                {/* Seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] border border-ffn-primary/5 rounded-full pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[25rem] h-[25rem] border border-ffn-primary/5 rounded-full pointer-events-none" />
            </motion.div>

            {/* Actions */}
            <div className="flex items-center space-x-6">
                <button
                    onClick={handleDownload}
                    className="flex items-center space-x-3 px-8 py-4 bg-ffn-black text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-ffn-primary transition-all shadow-xl"
                >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                </button>
                <button className="flex items-center space-x-3 px-8 py-4 bg-white border border-gray-100 text-ffn-black rounded-full text-[10px] font-black uppercase tracking-widest hover:border-ffn-primary transition-all shadow-lg">
                    <Share2 className="w-4 h-4" />
                    <span>Share Node</span>
                </button>
            </div>
        </div>
    );
};
