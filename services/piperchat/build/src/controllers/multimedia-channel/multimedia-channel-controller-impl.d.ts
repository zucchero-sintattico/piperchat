import { MessageChannel } from "../../models/message-channel-model";
import { MessageChannelController } from "../message-channel/message-channel-controller";
export declare class MessageChannelControllerImpl implements MessageChannelController {
    createMessageChannel(serverId: number, name: string): Promise<MessageChannel>;
    updateMessageChannel(id: number, name?: string | undefined): Promise<MessageChannel>;
    deleteMessageChannel(id: number): Promise<MessageChannel>;
}
