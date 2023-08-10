"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultimediaChannels = exports.MultimediaChannelSchema = void 0;
const mongoose_1 = require("mongoose");
exports.MultimediaChannelSchema = new mongoose_1.Schema({
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
    activeSession: {
        type: String,
        required: false,
    },
});
exports.MultimediaChannels = (0, mongoose_1.model)("MultimediaChannel", exports.MultimediaChannelSchema);
