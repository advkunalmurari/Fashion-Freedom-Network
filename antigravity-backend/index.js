
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Utils
const supabase = require('./utils/supabaseClient');
const authService = require('./auth/authService');

// Controllers
const authController = require('./auth/authController');
const profileController = require('./profiles/profileController');
const mediaController = require('./media/mediaController');
const paymentController = require('./payments/paymentController');
const razorpayController = require('./payments/razorpayController');
const payuController = require('./payments/payuController');
const castingController = require('./casting-calls/castingController');
const bookingController = require('./photoshoots/bookingController');
const messageController = require('./messages/messageController');
const analyticsController = require('./analytics/analyticsController');
const adminController = require('./admin/adminController');
const publicProfileController = require('./profiles/publicProfileController');
const socialController = require('./social/socialController');
const postsController = require('./posts/postsController');
const feedController = require('./feed/feedController');
const aiController = require('./ai/aiController');

const app = express();
app.use(cors());
app.use(express.json());

// Middleware: Robust Supabase Auth Verification
const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Authorization token required' });

    try {
        const user = await authService.verifySession(token);
        if (!user) throw new Error('User not found');
        req.user = user;
        req.token = token; // Store the raw JWT for instantiating scoped Supabase clients
        next();
    } catch (error) {
        console.error('Auth Middleware Error:', error.message);
        res.status(401).json({ success: false, message: 'Invalid or expired session' });
    }
};

// --- API ROUTES ---

// Auth
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);
app.post('/api/auth/logout', authController.logout);
app.post('/api/auth/confirm-email', authController.confirmEmail); // Unblocks stuck unconfirmed accounts

// Profiles
app.post('/api/profiles/create', authMiddleware, profileController.create);
app.get('/api/profiles/:username', profileController.get);
app.put('/api/profiles/update', authMiddleware, profileController.update);
app.delete('/api/profiles/delete', authMiddleware, profileController.delete);
app.get('/api/public-profile/:username', publicProfileController.getPublicProfile);

// Media
app.post('/api/media/upload', authMiddleware, mediaController.upload);
app.delete('/api/media/:mediaId', authMiddleware, mediaController.delete);

// Payments (PayPal)
app.get('/api/payments/transactions', authMiddleware, paymentController.getTransactions);
app.post('/api/payments/create-order', authMiddleware, paymentController.createOrder);
app.post('/api/payments/capture-order', authMiddleware, paymentController.captureOrder);
app.post('/api/payments/verify-subscription', authMiddleware, paymentController.verifySubscription);

// Payments (Razorpay Subscriptions)
app.post('/api/razorpay/create-subscription', authMiddleware, razorpayController.createSubscription);
app.post('/api/razorpay/verify-subscription', authMiddleware, razorpayController.verifySubscription);

// Payments (PayU - callbacks from PayU, no auth middleware as PayU posts directly)
app.post('/api/payu/success', express.urlencoded({ extended: true }), payuController.handleSuccess);
app.post('/api/payu/failure', express.urlencoded({ extended: true }), payuController.handleFailure);

// Casting Calls
app.post('/api/casting-calls/create', authMiddleware, castingController.create);
app.get('/api/casting-calls', castingController.getAll);
app.post('/api/casting-calls/apply', authMiddleware, castingController.apply);

// Photoshoots
app.post('/api/photoshoots/book', authMiddleware, bookingController.book);
app.get('/api/photoshoots/user-bookings', authMiddleware, bookingController.getUserBookings);

// Messaging
app.post('/api/messages/send', authMiddleware, messageController.send);
app.get('/api/messages/conversation', authMiddleware, messageController.getConversation);

// --- SOCIAL INFRASTRUCTURE V2 ---

// Following
app.post('/api/follow', authMiddleware, socialController.follow);
app.post('/api/unfollow', authMiddleware, socialController.unfollow); // Body: targetUserId
app.get('/api/users/:profileId/followers', socialController.getFollowers);
app.get('/api/users/:profileId/following', socialController.getFollowing);

// Posts
app.post('/api/posts/create', authMiddleware, postsController.create);
app.delete('/api/posts/:postId', authMiddleware, postsController.delete);

// Feed & Explore
app.get('/api/feed/home', authMiddleware, feedController.getHomeFeed);
app.get('/api/explore', feedController.getExploreFeed);
app.get('/api/posts/user/:username', feedController.getUserFeed);

// Engagement (Likes, Comments, Saves)
app.post('/api/posts/:postId/like', authMiddleware, socialController.toggleLike);
app.post('/api/posts/:postId/comment', authMiddleware, socialController.addComment);
app.post('/api/posts/:postId/save', authMiddleware, socialController.toggleSave);

// Analytics
app.post('/api/analytics/track-view', analyticsController.trackView);
app.get('/api/analytics/my-stats', authMiddleware, analyticsController.getMyStats);
app.get('/api/analytics/profile/:userId/stats', analyticsController.getProfileStats);
app.get('/api/analytics/platform-stats', analyticsController.getPlatformStats);
app.post('/api/admin/compute-metrics', authMiddleware, analyticsController.computeDailyMetrics);

// Admin (Restricted)
app.post('/api/admin/verify-user', authMiddleware, adminController.verifyUser);
app.get('/api/admin/dashboard-stats', authMiddleware, adminController.getStats);

// AI Talent Match Engine
app.post('/api/ai/match-talent', authMiddleware, aiController.matchTalent);
app.get('/api/ai/recommend-talent', aiController.recommendTalent);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`FFN Backend Orchestrated by Antigravity running on port ${PORT}`);
});
