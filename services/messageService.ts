
const API_URL = ;

import { supabase } from '../supabase';

export const messageService = {
    // Fetch conversations the user is part of
    async getThreads() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, data: [] };
            const myId = session.user.id;

            // 1. Get all chats I am a participant of
            const { data: myParticipations, error: partError } = await supabase
                .from('chat_participants')
                .select('chat_id')
                .eq('user_id', myId);

            if (partError) throw partError;
            if (!myParticipations || myParticipations.length === 0) return { success: true, data: [] };

            const chatIds = myParticipations.map(p => p.chat_id);

            // 2. Fetch the latest messages for these chats to sort them
            const { data: messages, error: msgError } = await supabase
                .from('messages')
                .select('chat_id, text, created_at')
                .in('chat_id', chatIds)
                .order('created_at', { ascending: false });

            if (msgError) throw msgError;

            // Group latest message per chat
            const latestMessages: Record<string, any> = {};
            messages?.forEach(msg => {
                if (!latestMessages[msg.chat_id]) {
                    latestMessages[msg.chat_id] = msg;
                }
            });

            // 3. Fetch the OTHER users in these chats
            const { data: otherParticipants, error: otherError } = await supabase
                .from('chat_participants')
                .select('chat_id, user_id, profiles!inner(id, full_name, avatar_url, role)')
                .in('chat_id', chatIds)
                .neq('user_id', myId);

            if (otherError) throw otherError;

            // 4. Assemble the threads for the UI
            const threads = otherParticipants?.map(p => {
                const latestMsg = latestMessages[p.chat_id];
                const profileInfo = Array.isArray(p.profiles) ? (p.profiles as any)[0] : p.profiles;
                return {
                    id: p.chat_id,
                    participants: [profileInfo],
                    name: (profileInfo as any)?.full_name,
                    avatar: (profileInfo as any)?.avatar_url,
                    role: (profileInfo as any)?.role,
                    lastMsg: latestMsg ? latestMsg.text : 'No messages yet',
                    timestamp: latestMsg ? new Date(latestMsg.created_at).getTime() : 0,
                    time: latestMsg ? new Date(latestMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
                    status: 'Offline' // Would need presence tracking for real status
                };
            }) || [];

            // Sort heavily by newest messages
            threads.sort((a, b) => b.timestamp - a.timestamp);

            return { success: true, data: threads };
        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.message };
        }
    },

    // Fetch older messages for a conversation
    async getMessages(chatId: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, data: [] };
            const myId = session.user.id;

            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .eq('chat_id', chatId)
                .order('created_at', { ascending: true });

            if (error) throw error;

            const formatted = data.map(msg => ({
                id: msg.id,
                sender: msg.sender_id === myId ? 'me' : 'them',
                text: msg.text,
                time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }));

            return { success: true, data: formatted };
        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.message };
        }
    },

    // Ensure a chat exists between two users, then send the message
    async sendMessage(receiverId: string, content: string, chatId?: string) {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return { success: false, error: 'Unauthorized' };
            const myId = session.user.id;

            let activeChatId = chatId;

            // If we don't know the chatId yet, check if one exists between the two users
            if (!activeChatId) {
                // Query chat_participants where I am in
                const { data: myParticipations } = await supabase
                    .from('chat_participants')
                    .select('chat_id')
                    .eq('user_id', myId);

                if (myParticipations && myParticipations.length > 0) {
                    const myChatIds = myParticipations.map(p => p.chat_id);
                    // Query if the receiver is in any of these chats
                    const { data: commonChats } = await supabase
                        .from('chat_participants')
                        .select('chat_id')
                        .in('chat_id', myChatIds)
                        .eq('user_id', receiverId)
                        .limit(1);

                    if (commonChats && commonChats.length > 0) {
                        activeChatId = commonChats[0].chat_id;
                    }
                }

                // Create new chat if it doesn't exist
                if (!activeChatId) {
                    const { data: newChat, error: chatErr } = await supabase
                        .from('chats')
                        .insert([{}])
                        .select()
                        .single();

                    if (chatErr) throw chatErr;
                    activeChatId = newChat.id;

                    // Add both participants
                    const participants = [
                        { chat_id: activeChatId, user_id: myId },
                        { chat_id: activeChatId, user_id: receiverId }
                    ];
                    const { error: partErr } = await supabase
                        .from('chat_participants')
                        .insert(participants);

                    if (partErr) throw partErr;
                }
            }

            // Insert the actual message
            const { data: newMsg, error: msgErr } = await supabase
                .from('messages')
                .insert([{
                    chat_id: activeChatId,
                    sender_id: myId,
                    text: content
                }])
                .select()
                .single();

            if (msgErr) throw msgErr;

            // Update the chat updated_at
            await supabase.from('chats').update({ updated_at: new Date().toISOString() }).eq('id', activeChatId);

            return {
                success: true,
                data: {
                    id: newMsg.id,
                    sender: 'me',
                    text: newMsg.text,
                    time: new Date(newMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                },
                chatId: activeChatId
            };

        } catch (error: any) {
            console.error(error);
            return { success: false, error: error.message };
        }
    }
};
