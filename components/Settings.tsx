
import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    User, Camera, Mail, FileText, LogOut, Save, Shield, Globe,
    Lock, Bell, Eye, Database, Terminal, Loader2, Instagram,
    Twitter, Linkedin, Music, Link as LinkIcon, ChevronRight,
    Search, Zap, Activity
} from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

const DASHBOARD_BG = '/demo/settings_dashboard_bg_1772533770599.png';

interface SettingsProps {
    user: any;
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
    const { profile, loading, saving, updateProfile, uploadAvatar } = useProfile();

    // Form States
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');
    const [instagram, setInstagram] = useState('');
    const [twitter, setTwitter] = useState('');
    const [tiktok, setTiktok] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [website, setWebsite] = useState('');

    const [activeSection, setActiveSection] = useState('identity');
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Sync local state when profile loads
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || '');
            setBio(profile.bio || '');
            setLocation(profile.location || '');
            setInstagram(profile.instagram || '');
            setTwitter(profile.twitter || '');
            setTiktok(profile.tiktok || '');
            setLinkedin(profile.linkedin || '');
            setWebsite(profile.website || '');
        }
    }, [profile]);

    const handleSave = async () => {
        setSaveStatus('saving');
        const { error } = await updateProfile({
            full_name: fullName,
            bio,
            location,
            instagram,
            twitter,
            tiktok,
            linkedin,
            website
        });

        if (error) {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            await uploadAvatar(e.target.files[0]);
        }
    };

    const sections = [
        { id: 'identity', icon: User, label: 'Identity Protocol' },
        { id: 'social', icon: Globe, label: 'Social Graph' },
        { id: 'security', icon: Lock, label: 'Security Layer' },
        { id: 'notifications', icon: Bell, label: 'Signal Range' },
    ];

    if (loading && !profile) {
        return (
            <div className="fixed inset-0 bg-ffn-black flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-ffn-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-40 bg-ffn-black overflow-hidden flex flex-col">
            {/* Background Narrative */}
            <div className="absolute inset-0 z-0">
                <img src={DASHBOARD_BG} className="w-full h-full object-cover opacity-30" alt="" />
                <div className="absolute inset-0 bg-gradient-to-b from-ffn-black via-ffn-black/80 to-ffn-black" />
                <div className="absolute inset-0 backdrop-blur-3xl" />
                <div className="scan-line opacity-10" />
            </div>

            {/* Header Infrastructure */}
            <div className="relative z-10 p-8 lg:p-12 flex justify-between items-center border-b border-white/5">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-ffn-primary uppercase tracking-[0.5em]">System Configuration</p>
                    <h1 className="text-4xl font-serif italic text-white tracking-tighter">Core Infrastructure</h1>
                </div>
                <div className="flex items-center space-x-6">
                    <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        className={`group px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center space-x-3 transition-all
                            ${saveStatus === 'success' ? 'bg-emerald-500 text-white' : 'bg-ffn-primary text-white shadow-[0_0_30px_rgba(255,51,102,0.2)] hover:scale-105'}`}
                    >
                        {saveStatus === 'saving' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span>{saveStatus === 'saving' ? 'Syncing...' : saveStatus === 'success' ? 'Synchronized' : 'Commit Changes'}</span>
                    </button>
                    <button
                        onClick={onLogout}
                        className="p-4 bg-white/5 hover:bg-red-500/10 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all text-red-500 group"
                        title="Terminate Session"
                    >
                        <LogOut className="w-5 h-5 group-hover:animate-pulse" />
                    </button>
                </div>
            </div>

            {/* Main Control Interface */}
            <div className="relative z-10 flex-1 flex overflow-hidden">
                {/* Protocol Selector */}
                <div className="w-[320px] border-r border-white/5 p-8 space-y-3 overflow-y-auto">
                    {sections.map(section => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full flex items-center justify-between p-6 rounded-2xl border transition-all
                                ${activeSection === section.id
                                    ? 'bg-ffn-primary/10 border-ffn-primary text-ffn-primary shadow-[0_0_20px_rgba(255,51,102,0.1)]'
                                    : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                        >
                            <div className="flex items-center space-x-4">
                                <section.icon className="w-4 h-4" />
                                <span className="text-[9px] font-black uppercase tracking-widest">{section.label}</span>
                            </div>
                            {activeSection === section.id && <ChevronRightIcon className="w-3 h-3" />}
                        </button>
                    ))}

                    <div className="pt-8 mt-8 border-t border-white/5 space-y-6 opacity-40">
                        <div className="flex flex-col items-center space-y-3 text-center">
                            <Database className="w-6 h-6 text-ffn-primary" />
                            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-white">Vault Status: SECURE</p>
                        </div>
                    </div>
                </div>

                {/* Data Injection Node */}
                <div className="flex-1 p-8 lg:p-16 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeSection === 'identity' && (
                            <m.div
                                key="identity"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-3xl space-y-12"
                            >
                                <div className="flex items-center space-x-10">
                                    <div className="relative group w-40 h-40">
                                        <div className="w-full h-full rounded-[3rem] bg-white/5 border border-white/10 overflow-hidden relative">
                                            {profile?.avatar_url ? (
                                                <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-12 h-12 text-white/10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                            )}
                                        </div>
                                        <input type="file" onChange={handleAvatarChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" title="Change Profile Avatar" />
                                        <div className="absolute -bottom-2 -right-2 p-4 bg-ffn-primary text-white rounded-2xl shadow-2xl group-hover:scale-110 transition-transform pointer-events-none">
                                            <Camera className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="text-3xl font-serif italic text-white leading-none">{fullName || 'Anonymous Node'}</h3>
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center space-x-2 px-3 py-1 bg-ffn-primary/10 rounded-full border border-ffn-primary/20">
                                                <Shield className="w-2.5 h-2.5 text-ffn-primary" />
                                                <span className="text-[7px] font-black uppercase tracking-widest text-ffn-primary">Level 02 Auth</span>
                                            </div>
                                            <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{profile?.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Public Handle Configuration</label>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white focus:border-ffn-primary outline-none transition-all placeholder:text-white/10"
                                            placeholder="Professional Name"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Operational Base</label>
                                        <input
                                            type="text"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white focus:border-ffn-primary outline-none transition-all placeholder:text-white/10"
                                            placeholder="Location (e.g. Milan, IT)"
                                        />
                                    </div>

                                    <div className="space-y-3 md:col-span-2">
                                        <label className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">Editorial Narrative Architecture</label>
                                        <textarea
                                            rows={4}
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 text-white text-base focus:border-ffn-primary outline-none transition-all resize-none placeholder:text-white/10"
                                            placeholder="Construct your professional narrative..."
                                        />
                                    </div>
                                </div>
                            </m.div>
                        )}

                        {activeSection === 'social' && (
                            <m.div
                                key="social"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-3xl space-y-12"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif italic text-white italic leading-none">Social Graph Integration</h3>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Expand your digital footprint across the network</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { label: 'Instagram Protocol', icon: Instagram, value: instagram, setter: setInstagram, placeholder: '@handle' },
                                        { label: 'Twitter / X Engine', icon: Twitter, value: twitter, setter: setTwitter, placeholder: '@handle' },
                                        { label: 'TikTok Signal', icon: Music, value: tiktok, setter: setTiktok, placeholder: '@handle' },
                                        { label: 'LinkedIn Ledger', icon: Linkedin, value: linkedin, setter: setLinkedin, placeholder: 'Professional Profile' },
                                        { label: 'Global Portal (Website)', icon: Globe, value: website, setter: setWebsite, placeholder: 'https://' },
                                    ].map((social, idx) => (
                                        <div key={idx} className="bg-white/5 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-all">
                                            <div className="flex items-center space-x-3">
                                                <social.icon className="w-4 h-4 text-ffn-primary" />
                                                <label className="text-[8px] font-black text-white/40 uppercase tracking-[0.4em]">{social.label}</label>
                                            </div>
                                            <input
                                                type="text"
                                                value={social.value}
                                                onChange={(e) => social.setter(e.target.value)}
                                                className="w-full bg-ffn-black/40 border border-white/5 rounded-xl p-4 text-white text-sm focus:border-ffn-primary outline-none transition-all placeholder:text-white/5"
                                                placeholder={social.placeholder}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </m.div>
                        )}

                        {activeSection === 'security' && (
                            <m.div
                                key="security"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="max-w-3xl space-y-8"
                            >
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-serif italic text-white italic leading-none">Security Encryption Layer</h3>
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Manage your credentials and access nodes</p>
                                </div>

                                <div className="space-y-4">
                                    <button className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-ffn-primary transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <Lock className="w-5 h-5 text-white/20 group-hover:text-ffn-primary" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Rotate Encryption Key</p>
                                                <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Change Account Password</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 text-white/10" />
                                    </button>
                                    <button className="w-full p-6 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between hover:border-ffn-primary transition-all group">
                                        <div className="flex items-center space-x-4">
                                            <Shield className="w-5 h-5 text-white/20 group-hover:text-ffn-primary" />
                                            <div className="text-left">
                                                <p className="text-[10px] font-black text-white uppercase tracking-widest">Verify Secondary Node</p>
                                                <p className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Two-Factor Authentication</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-4 h-4 text-white/10" />
                                    </button>
                                </div>
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

