import { Schema, model } from "mongoose";

const ConversationSchema = new Schema({
	id: String,
	participants: { type: [String], required: true },
	groupName: String,
});

const MessageSchema = new Schema({
	sender: String,
	content: { type: String, required: true },
	visualizedFrom: [String],
	timecreated: { type: Date, default: Date.now },
	conversationID: { type: String, required: true },
});


ConversationSchema.pre("save", async function (next) {
	const conversation = this;
	const conversationModel = model("Conversations", ConversationSchema);
	const lastConversation = await conversationModel.findOne().sort({ id: -1 });
	if (lastConversation != null) {
		conversation.id = (parseInt(lastConversation.id) + 1).toString();
	} else {
		conversation.id = "1";
	}
	next();
});

const Conversations = model("Conversations", ConversationSchema);
const Messages = model("Messages", MessageSchema);

export { Conversations, Messages };
