-- FFN Phase 1: Real-Time Inbox & Chat Infrastructure

-- 1. Create the Chats table
CREATE TABLE IF NOT EXISTS public.chats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Chat Participants table (Many-to-Many relationship between User and Chat)
CREATE TABLE IF NOT EXISTS public.chat_participants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    last_read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(chat_id, user_id)
);

-- 3. Create the Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE NOT NULL,
    sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Set up RLS Policies for Chats
-- Users can only see chats they participate in
CREATE POLICY "Users can view chats they participate in" ON public.chats
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = chats.id
            AND chat_participants.user_id = auth.uid()
        )
    );

-- Any authenticated user can create a chat
CREATE POLICY "Users can create chats" ON public.chats
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Set up RLS Policies for Chat Participants
-- Users can see participants of chats they are in
CREATE POLICY "Users can view participants of their chats" ON public.chat_participants
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants cp
            WHERE cp.chat_id = chat_participants.chat_id
            AND cp.user_id = auth.uid()
        )
    );

-- Users can insert participants (themselves and the other person)
CREATE POLICY "Users can add participants to chats" ON public.chat_participants
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Users can update their own participant record (e.g. last_read_at)
CREATE POLICY "Users can update their participation record" ON public.chat_participants
    FOR UPDATE
    USING (user_id = auth.uid());

-- Set up RLS Policies for Messages
-- Users can view messages in their chats
CREATE POLICY "Users can view messages in their chats" ON public.messages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = messages.chat_id
            AND chat_participants.user_id = auth.uid()
        )
    );

-- Users can insert messages in their chats
CREATE POLICY "Users can send messages to their chats" ON public.messages
    FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM public.chat_participants
            WHERE chat_participants.chat_id = messages.chat_id
            AND chat_participants.user_id = auth.uid()
        )
    );

-- Realtime Setup: Enable realtime for the messages table to allow websockets
alter publication supabase_realtime add table public.messages;
