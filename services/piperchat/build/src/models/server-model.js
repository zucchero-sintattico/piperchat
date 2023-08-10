"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Servers = exports.ServerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ServerSchema = new mongoose_1.Schema({
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
    description: {
        type: String,
    },
    owner: {
        type: String,
        required: true,
    },
    participants: {
        type: [String],
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
exports.Servers = (0, mongoose_1.model)("Server", exports.ServerSchema);
