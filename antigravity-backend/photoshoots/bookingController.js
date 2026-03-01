
const bookingService = require('./bookingService');

const bookingController = {
    async book(req, res) {
        const bookingData = {
            ...req.body,
            user_id: req.user.id,
            payment_status: 'PENDING'
        };
        try {
            const booking = await bookingService.book(bookingData);
            res.status(201).json({ success: true, data: booking });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getUserBookings(req, res) {
        const userId = req.user.id;
        try {
            const bookings = await bookingService.getUserHistory(userId);
            res.status(200).json({ success: true, data: bookings });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = bookingController;
