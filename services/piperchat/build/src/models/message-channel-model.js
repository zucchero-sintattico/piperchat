"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageChannels = exports.MessageChannelSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MessageChannelSchema = new mongoose_1.Schema({
    id: {
        type: Number,
        required: true,
        unique: true,
        auto: true,
    },
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
exports.MessageChannels = (0, mongoose_1.model)("MessageChannel", exports.MessageChannelSchema);
