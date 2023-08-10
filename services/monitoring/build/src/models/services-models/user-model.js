"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMonitorEntity = void 0;
const mongoose_1 = require("mongoose");
const UserMonitorSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    event: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
        default: Date.now,
    },
});
const UserMonitorEntity = (0, mongoose_1.model)("UserMonitorSchema", UserMonitorSchema);
exports.UserMonitorEntity = UserMonitorEntity;
