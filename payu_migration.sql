-- PayU Transactions Schema Migration

CREATE TYPE payment_gateway AS ENUM ('payu', 'stripe', 'paypal');
CREATE TYPE payment_status AS ENUM ('pending', 'successful', 'failed', 'cancelled');

CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    txnid VARCHAR(255) UNIQUE NOT NULL, -- PayU specific transaction ID
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    productinfo TEXT NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    status payment_status DEFAULT 'pending',
    gateway payment_gateway DEFAULT 'payu',
    payu_mihpayid VARCHAR(255), -- PayU's internal ID generated upon successful payment
    hash TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own transactions"
    ON transactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions (pending status only)"
    ON transactions FOR INSERT
    WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Only admins or Edge Functions should be able to update transaction status
-- Assuming we use service role key for Edge Functions
