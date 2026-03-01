
const castingService = require('./castingService');

const castingController = {
    async create(req, res) {
        const callData = {
            ...req.body,
            creator_id: req.user.id
        };
        console.log('Creating Casting Call with ID:', req.user.id);
        try {
            const call = await castingService.create(callData);
            res.status(201).json({ success: true, data: call });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    },

    async getAll(req, res) {
        try {
            const calls = await castingService.list();
            res.status(200).json({ success: true, data: calls });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    },

    async apply(req, res) {
        const applicationData = {
            casting_call_id: req.body.casting_call_id,
            user_id: req.user.id,
            status: 'PENDING'
        };
        try {
            const application = await castingService.apply(applicationData);
            res.status(201).json({ success: true, data: application });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
};

module.exports = castingController;
