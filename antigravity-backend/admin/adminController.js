
const adminService = require('./adminService');

const adminController = {
    async verifyUser(req, res) {
        const { userId, level } = req.body;
        // req.user.role check should be done in middleware
        try {
            const user = await adminService.verify(userId, level);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async getStats(req, res) {
        try {
            const stats = await adminService.getDashboard();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = adminController;
