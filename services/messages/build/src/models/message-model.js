"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Messages = exports.Conversations = void 0;
const mongoose_1 = require("mongoose");
const ConversationSchema = new mongoose_1.Schema({
    id: String,
    participants: { type: [String], required: true },
    isAGroup: { type: Boolean, default: false },
    groupName: String,
});
const MessageSchema = new mongoose_1.Schema({
    sender: String,
    content: { type: String, required: true },
    visualizedFrom: [String],
    timecreated: { type: Date, default: Date.now },
    conversationID: { type: String, required: true },
});
//auto random and univoque id of conversation
ConversationSchema.pre("save", async function (next) {
    const conversation = this;
    const conversationModel = (0, mongoose_1.model)("Conversations", ConversationSchema);
    const idLength = 4;
    if (conversation.id == null) {
        var newId = Math.random()
            .toString(36)
            .substring(2, idLength + 2);
        while ((await conversationModel.findOne({ id: newId })) != null) {
            newId = Math.random()
                .toString(36)
                .substring(2, idLength + 2);
            console.log(newId);
        }
        conversation.id = newId;
    }
    next();
});
ConversationSchema.pre("save", async function (next) {
    const conversation = this;
    if (conversation.isAGroup && conversation.groupName == null) {
        next(new Error("Group name is required"));
    }
    else {
        next();
    }
});
const Conversations = (0, mongoose_1.model)("Conversations", ConversationSchema);
exports.Conversations = Conversations;
const Messages = (0, mongoose_1.model)("Messages", MessageSchema);
exports.Messages = Messages;
