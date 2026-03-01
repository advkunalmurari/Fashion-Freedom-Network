
const castingDb = require('./castingDb');

/**
 * Casting Call Service for FFN
 */
const castingService = {
    async create(callData) {
        return await castingDb.createCall(callData);
    },

    async list() {
        return await castingDb.getAllCalls();
    },

    async apply(applicationData) {
        return await castingDb.applyToCall(applicationData);
    }
};

module.exports = castingService;
