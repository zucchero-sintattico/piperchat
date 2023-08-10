"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sessions = void 0;
const mongoose_1 = require("mongoose");
const SessionSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        auto: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    participants: {
        type: [
            {
                username: {
                    type: String,
                    required: true,
                },
                socketId: {
                    type: String,
                    required: true,
                },
            },
        ],
        required: true,
        default: [],
    },
    allowedUsers: {
        type: [String],
        required: true,
    },
});
const Sessions = (0, mongoose_1.model)("Session", SessionSchema);
exports.Sessions = Sessions;
