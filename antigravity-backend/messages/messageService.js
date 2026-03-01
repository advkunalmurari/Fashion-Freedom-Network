
const messageDb = require('./messageDb');

/**
 * Messaging Service for FFN
 */
const messageService = {
    async send(messageData) {
        return await messageDb.sendMessage(messageData);
    },

    async getHistory(userId, otherUserId) {
        return await messageDb.getConversation(userId, otherUserId);
    }
};

module.exports = messageService;
