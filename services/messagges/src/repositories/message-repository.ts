import { Conversations, Messages } from "../models/server-model";
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class MessageRepository {
  async getMessagesFromConversation(conversationId: String) {
    return await Conversations.find({ id: conversationId }).select("messages");
  }

  async createMessage(sender: String, content: String) {
    const message = new Messages({
      sender: sender,
      content: content,
    });
    return await message.save();
  }

  async addMessageToConversation(conversationId: String, message: any) {
    return await Conversations.updateOne(
      { id: conversationId },
      { $push: { messages: message } }
    );
  }
}
