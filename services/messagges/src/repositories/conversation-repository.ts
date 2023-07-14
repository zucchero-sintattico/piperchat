import { Conversations } from "../models/message-model";
import { Messages } from "../models/message-model";
/**
 * The repository of a generic entity.
 * It is responsible for handling the database operations.
 */
export class ConversationsRepository {

	async getConversation(id: String, user: String) {
		const conversation = await Conversations.findOne({ id: id, participants: user });

		if (conversation != null) {
			return await Messages.find({ conversationID: id });
		}
		return null;
	}

	async createConversation(participants: String[], isAGroup: Boolean = false, groupName: String = "") {
		if (isAGroup) {
			if (groupName == "") {
				throw new Error("Group name is required");
			}
			const conversation = new Conversations({ participants: participants, isAGroup: true, groupName: groupName });
			return await conversation.save();
		} else {
			const conversation = new Conversations({ participants: participants });
			return await conversation.save();
		}
	}

}
