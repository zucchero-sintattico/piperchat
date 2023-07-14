import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
	id: String,
	participants: [String],
});

const MessageSchema = new Schema({
	sender: String,
	content: String,
	visualizedFrom: [String],
	timecreated: { type: Date, default: Date.now },
	conversationID: String,
});

const ConversationEntity = model("ConversationEntity", ConversationSchema);
const MessageEntity = model("MessageEntity", MessageSchema);

export { ConversationEntity, MessageEntity };
