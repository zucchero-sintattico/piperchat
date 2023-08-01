import { MessageChannelController } from "./message-channel-controller";
import { MessageChannel } from "../../models/message-channel-model";

export class MessageChannelControllerImpl implements MessageChannelController {
	createMessageChannel(
		serverId: number,
		name: string
	): Promise<MessageChannel> {
		throw new Error("Method not implemented.");
	}
	updateMessageChannel(
		id: number,
		name?: string | undefined
	): Promise<MessageChannel> {
		throw new Error("Method not implemented.");
	}
	deleteMessageChannel(id: number): Promise<MessageChannel> {
		throw new Error("Method not implemented.");
	}
}
