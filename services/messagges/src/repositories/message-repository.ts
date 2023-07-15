import { Conversations, Messages } from "../models/server-model";
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class MessageRepository {
  async createMessage(sender: String, content: String) {
    const message = new Messages({
      sender: sender,
      content: content,
    });
    return await message.save();
  }

  async getMessagesFromSender(sender: String) {
    return await Messages.find({ sender: sender });
  }

  async getAllMessages() {
    const QUERY_LIMIT = 1000;
    return await Messages.find().limit(QUERY_LIMIT);
  }
}
