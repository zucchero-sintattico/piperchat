import { Conversations } from "@models/chat-model";
import { Messages } from "@models/chat-model";

/**
 * The repository of the conversation entity.
 */
export class ConversationsRepository {
  async getMessagesFromConversation(conversationId: String) {
    return await Conversations.find({ name: conversationId }).select(
      "messages"
    );
  }

  async getConversationsByUsername(username: String) {
    return await Conversations.find({ participants: username });
  }

  async createConversation(participants: String[]) {
    const conversation = new Conversations({
      participants: participants,
    });
    return await conversation.save();
  }

  async deleteConversation(name: String) {
    await Conversations.deleteOne({ name: name });
  }

  async getAllConversations() {
    const QUERY_LIMIT = 1000;
    return await Conversations.find().limit(QUERY_LIMIT);
  }

  async addMessageToConversation(name: String, message: String) {
    const conversation = await Conversations.findOne({ name: name });
    if (!conversation) {
      return null;
    }
    conversation.messages.push(message);
    return await conversation.save();
  }
}
