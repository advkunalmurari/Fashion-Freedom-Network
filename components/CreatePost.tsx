import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Image as ImageIcon, Video, Send, Loader2 } from 'lucide-react';
import { postService } from '../services/postService';

interface CreatePostProps {
    onPostCreated?: () => void;
    currentUser?: { avatarUrl?: string, displayName?: string };
}

export const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated, currentUser }) => {
    const [caption, setCaption] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [postType, setPostType] = useState<'image' | 'video'>('image');
    const [shootType, setShootType] = useState<'editorial' | 'commercial' | 'runway' | 'streetwear' | 'other'>('other');
    const [brandTag, setBrandTag] = useState('');
    const [photographerTag, setPhotographerTag] = useState('');
    const [visibility, setVisibility] = useState<'public' | 'private'>('public');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!caption.trim() && !mediaUrl.trim()) return;

        setIsSubmitting(true);
        const res = await postService.createPost({
            caption: caption.trim(),
            mediaUrls: mediaUrl ? [mediaUrl] : [],
            type: postType === 'video' ? 'VIDEO' : 'IMAGE',
            shootType,
            brandTag,
            photographerTag,
            visibility
        });
        setIsSubmitting(false);

        if (res.success) {
            setCaption('');
            setMediaUrl('');
            setPostType('image');
            setShootType('other');
            setBrandTag('');
            setPhotographerTag('');
            setVisibility('public');
            setIsFocused(false);
            onPostCreated?.();
        } else {
            alert(res.error || 'Failed to create post');
        }
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-gray-100 flex flex-col space-y-4 mb-8"
        >
            <div className="flex space-x-4">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-none hidden sm:block">
                    <img
                        src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80'}
                        className="w-full h-full object-cover"
                        alt="User avatar"
                    />
                </div>
                <textarea
                    placeholder="Share your fashion perspective..."
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full bg-transparent border-none focus:ring-0 resize-none text-ffn-black placeholder:text-gray-400 font-serif min-h-[50px]"
                    rows={isFocused ? 3 : 1}
                />
            </div>

            <AnimatePresence>
                {isFocused && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-col space-y-4 overflow-hidden"
                    >
                        <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder={postType === 'image' ? "Image URL (e.g. .jpg, .png)" : "Video URL (e.g. .mp4, .mov)"}
                                value={mediaUrl}
                                onChange={(e) => setMediaUrl(e.target.value)}
                                className="w-full text-xs text-ffn-black placeholder:text-gray-300 border-none bg-gray-50 rounded-xl px-4 py-2 focus:ring-1 focus:ring-ffn-primary"
                            />
                            <select
                                value={shootType}
                                onChange={(e: any) => setShootType(e.target.value)}
                                className="w-full text-xs text-ffn-black border-none bg-gray-50 rounded-xl px-4 py-2 focus:ring-1 focus:ring-ffn-primary"
                            >
                                <option value="other">Shoot Type (Optional)</option>
                                <option value="editorial">Editorial</option>
                                <option value="commercial">Commercial</option>
                                <option value="runway">Runway</option>
                                <option value="streetwear">Streetwear</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Brand Tag (e.g. Gucci)"
                                value={brandTag}
                                onChange={(e) => setBrandTag(e.target.value)}
                                className="w-full text-xs text-ffn-black placeholder:text-gray-300 border-none bg-gray-50 rounded-xl px-4 py-2 focus:ring-1 focus:ring-ffn-primary"
                            />
                            <input
                                type="text"
                                placeholder="Photographer Tag"
                                value={photographerTag}
                                onChange={(e) => setPhotographerTag(e.target.value)}
                                className="w-full text-xs text-ffn-black placeholder:text-gray-300 border-none bg-gray-50 rounded-xl px-4 py-2 focus:ring-1 focus:ring-ffn-primary"
                            />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setPostType('image')}
                                        className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 flex items-center space-x-2 ${postType === 'image' ? 'bg-ffn-primary/10 text-ffn-primary' : 'hover:bg-gray-50 text-gray-400'}`}
                                        title="Add Image"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPostType('video')}
                                        className={`p-2 rounded-full transition-all hover:scale-110 active:scale-95 flex items-center space-x-2 ${postType === 'video' ? 'bg-ffn-secondary/10 text-ffn-secondary' : 'hover:bg-gray-50 text-gray-400'}`}
                                        title="Add Video"
                                    >
                                        <Video className="w-5 h-5" />
                                    </button>
                                </div>

                                <select
                                    value={visibility}
                                    onChange={(e: any) => setVisibility(e.target.value)}
                                    className="text-[10px] font-bold uppercase tracking-widest bg-transparent border-none text-gray-400 focus:ring-0 cursor-pointer"
                                >
                                    <option value="public">🌐 Public</option>
                                    <option value="private">🔒 Private</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || (!caption.trim() && !mediaUrl.trim())}
                                className="bg-ffn-black text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-ffn-primary transition-colors flex items-center space-x-2"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <span>Post</span>
                                        <Send className="w-3 h-3" />
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.form>
    );
};
