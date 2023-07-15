import { Conversations } from "../models/server-model";
import { Messages } from "../models/server-model";

/**
 * The repository of the conversation entity.
 */
export class ConversationsRepository {
  async getConversationByIdAndUserName(id: String, user: String) {
    return await Conversations.findOne({ id: id, participants: user });
  }

  async getMessagesFromConversation(conversationId: String) {
    return await Conversations.find({ id: conversationId }).select("messages");
  }

  async getConversationsByUserName(user: String) {
    return await Conversations.find({ participants: user });
  }

  async createConversation(name: String, participants: String[]) {
    const conversation = new Conversations({
      name: name,
      participants: participants,
    });
    return await conversation.save();
  }
}
