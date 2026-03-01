
const bookingDb = require('./bookingDb');

/**
 * Photoshoot Booking Service for FFN
 */
const bookingService = {
    async book(bookingData) {
        return await bookingDb.createBooking(bookingData);
    },

    async getUserHistory(userId) {
        return await bookingDb.getUserBookings(userId);
    }
};

module.exports = bookingService;
