# FFN Backend Orchestration Layer

This directory contains the Antigravity orchestration layer for the Fashion Freedom Network (FFN). It connects the React frontend with Supabase (Auth/DB), PayPal (Payments), and Stitch (Media).

## Architecture

- **Auth**: Supabase Auth + `public.users` synchronization.
- **Profiles**: Portfolio and attribute management.
- **Castings**: Marketplace for professional hiring.
- **Payments**: PayPal REST API integration for subscriptions and casting fees.
- **Messaging**: direct messaging between professionals.

## Setup

1. `npm install`
2. Configure `.env` with:
   - `PORT=5001`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `PAYPAL_CLIENT_ID`
   - `PAYPAL_CLIENT_SECRET`
3. `node index.js`

## API Endpoints

- `POST /api/auth/register` - Unified registration
- `POST /api/auth/login` - Session creation
- `GET /api/profiles/:username` - Public profile retrieval
- `POST /api/payments/create-order` - Create PayPal order
- `GET /api/messages/threads` - Retrieve conversation history

## Port Configuration

The backend runs on **Port 5001** to avoid conflicts with macOS AirPlay (Port 5000).
