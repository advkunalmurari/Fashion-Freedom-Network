
const messageService = require('./messageService');

const messageController = {
    async send(req, res) {
        const messageData = {
            ...req.body,
            sender_id: req.user.id
        };
        try {
            const message = await messageService.send(messageData);
            res.status(201).json({ success: true, data: message });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getConversation(req, res) {
        const userId = req.user.id;
        const { otherUserId } = req.query;
        try {
            const messages = await messageService.getHistory(userId, otherUserId);
            res.status(200).json({ success: true, data: messages });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
};

module.exports = messageController;
