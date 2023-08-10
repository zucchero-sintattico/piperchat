"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageMonitorEntity = void 0;
const mongoose_1 = require("mongoose");
const MessageMonitorSchema = new mongoose_1.Schema({
    messageID: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    },
});
const MessageMonitorEntity = (0, mongoose_1.model)("Entity", MessageMonitorSchema);
exports.MessageMonitorEntity = MessageMonitorEntity;
