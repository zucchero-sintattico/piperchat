"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEntity = void 0;
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    from: String,
    to: {
        type: String,
        required: true,
    },
    messageId: {
        type: String,
        required: true,
    },
    notitificationType: {
        type: String,
        required: true,
    },
});
const NotificationEntity = (0, mongoose_1.model)("Entity", NotificationSchema);
exports.NotificationEntity = NotificationEntity;
