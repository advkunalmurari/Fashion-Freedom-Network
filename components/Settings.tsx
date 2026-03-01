import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Camera, Mail, FileText, LogOut, Save, Shield } from 'lucide-react';

interface SettingsProps {
    user: any;
    onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ user, onLogout }) => {
    const [fullName, setFullName] = useState(user?.user_metadata?.full_name || '');
    const [bio, setBio] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call for now
        setTimeout(() => {
            setIsSaving(false);
            alert('Settings saved successfully');
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-serif tracking-tight mb-2">Settings</h1>
                    <p className="text-gray-500 font-light tracking-widest uppercase text-xs">Profile Architecture</p>
                </div>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors text-sm font-medium tracking-widest uppercase"
                >
                    <LogOut size={18} />
                    Terminate Session
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 space-y-8">
                    <div className="relative group w-32 h-32 mx-auto md:mx-0">
                        <div className="w-full h-full rounded-full bg-gray-100 dark:bg-white/5 border border-black/5 dark:border-white/5 overflow-hidden flex items-center justify-center">
                            {user?.user_metadata?.avatar_url ? (
                                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <User size={48} className="text-gray-300" />
                            )}
                        </div>
                        <button className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full transition-transform hover:scale-110">
                            <Camera size={16} />
                        </button>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-black/5 dark:border-white/5">
                        <div className="flex items-center gap-3 text-gray-500">
                            <Mail size={16} />
                            <span className="text-sm tracking-wide">{user?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400">
                            <Shield size={16} />
                            <span className="text-[10px] tracking-[0.2em] uppercase">Verified Identity</span>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-2 space-y-8">
                    <section className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Public Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-transparent border-b border-black/10 dark:border-white/10 py-3 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                                placeholder="Enter your professional name"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Editorial Bio</label>
                            <textarea
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-transparent border border-black/10 dark:border-white/10 rounded-xl p-4 focus:outline-none focus:border-black dark:focus:border-white transition-colors resize-none"
                                placeholder="Write a brief professional summary..."
                            />
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full md:w-auto px-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-full text-xs tracking-[0.2em] uppercase font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            <Save size={16} />
                            {isSaving ? 'Synchronizing...' : 'Update Infrastructure'}
                        </button>
                    </section>
                </div>
            </div>
        </div>
    );
};
