
const adminDb = require('./adminDb');

/**
 * Admin Service for FFN
 */
const adminService = {
    async verify(userId, level) {
        return await adminDb.verifyUser(userId, level);
    },

    async getDashboard() {
        return await adminDb.getDashboardStats();
    }
};

module.exports = adminService;
