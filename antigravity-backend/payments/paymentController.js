
const paymentService = require('./paymentService');
const paymentDb = require('./paymentDb');

const paymentController = {
    async getTransactions(req, res) {
        const userId = req.user.id;
        try {
            const data = await paymentDb.getUserTransactions(userId);
            res.status(200).json({ success: true, data });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async createOrder(req, res) {
        const { amount, currency } = req.body;
        try {
            const order = await paymentService.createOrder(amount, currency);
            res.status(201).json({ success: true, order });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async captureOrder(req, res) {
        const { orderId } = req.body;
        const userId = req.user.id;
        try {
            const result = await paymentService.captureOrder(orderId, userId);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async verifySubscription(req, res) {
        const { planId, paymentId } = req.body;
        const userId = req.user.id;
        try {
            const subscription = await paymentService.handleSubscription(userId, planId, paymentId);
            res.status(200).json({ success: true, data: subscription });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = paymentController;
