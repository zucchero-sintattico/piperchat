import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
	id: String,
	participants: [String],
});

const MessageSchema = new Schema({
	sender: String,
	content: { type: String, required: true },
	visualizedFrom: [String],
	timecreated: { type: Date, default: Date.now },
	conversationID: { type: String, required: true },
});

const Conversations = model("Conversations", ConversationSchema);
const Messages = model("Messages", MessageSchema);

export { Conversations, Messages };
