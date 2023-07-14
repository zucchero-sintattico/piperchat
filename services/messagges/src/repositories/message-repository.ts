import { Messages } from "../models/message-model";
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class MessageRepository {
	async sendMessage(conversationID: String, content: String, sender: String) {
		const newMessage = new Messages({
			sender: sender,
			conversationID: conversationID,
			content: content,
		});
		await newMessage.save();
	}
}
