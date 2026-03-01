-- network_migration.sql
-- Subsystem: Professional Networking & Social Graph (Social Pivot Phase 6)

-- 1. Create Follows Table (One-way Social)
CREATE TABLE IF NOT EXISTS public.follows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    follower_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    following_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(follower_id, following_id)
);

-- 2. Create Connection Requests Table (Two-way Professional Invitation)
CREATE TABLE IF NOT EXISTS public.connection_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    status TEXT DEFAULT 'pending' NOT NULL, -- 'pending', 'accepted', 'declined'
    pitch TEXT, -- Optional short message for the request
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(sender_id, receiver_id)
);

-- 3. Create Connections Table (Mutual Professional Bond)
CREATE TABLE IF NOT EXISTS public.connections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id_1 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    user_id_2 UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id_1, user_id_2),
    CONSTRAINT different_users CHECK (user_id_1 != user_id_2)
);

-- Enable RLS
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;

-- 4. Follows Policies
-- Anyone can see who follows whom
CREATE POLICY "Anyone can view follows" ON public.follows FOR SELECT USING (true);

-- Authenticated users can follow others
CREATE POLICY "Users can follow others" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- Users can unfollow
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (auth.uid() = follower_id);


-- 5. Connection Requests Policies
-- Users can see requests they sent or received
CREATE POLICY "Users can view their own connection requests" ON public.connection_requests
    FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Authenticated users can send requests
CREATE POLICY "Users can send connection requests" ON public.connection_requests
    FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- Receivers can update status (accept/decline)
CREATE POLICY "Receivers can respond to requests" ON public.connection_requests
    FOR UPDATE USING (auth.uid() = receiver_id);


-- 6. Connections Policies
-- Users can see their own connections
CREATE POLICY "Users can view their own connections" ON public.connections
    FOR SELECT USING (auth.uid() = user_id_1 OR auth.uid() = user_id_2);


-- 7. Realtime
alter publication supabase_realtime add table public.connection_requests;
alter publication supabase_realtime add table public.connections;
alter publication supabase_realtime add table public.follows;

-- 8. Functions/Triggers (Optional: Auto-delete request on connection)
CREATE OR REPLACE FUNCTION public.handle_connection_accepted()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'accepted' THEN
        -- Insert into mutual connections (ensure smaller UUID is user_id_1 for uniqueness)
        INSERT INTO public.connections (user_id_1, user_id_2)
        VALUES (
            LEAST(NEW.sender_id, NEW.receiver_id),
            GREATEST(NEW.sender_id, NEW.receiver_id)
        )
        ON CONFLICT DO NOTHING;
        
        -- Optionally delete the request record or keep it as history
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_connection_accepted
    AFTER UPDATE ON public.connection_requests
    FOR EACH ROW
    WHEN (OLD.status = 'pending' AND NEW.status = 'accepted')
    EXECUTE FUNCTION public.handle_connection_accepted();
