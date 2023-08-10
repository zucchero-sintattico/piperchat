import { MessageChannelController } from "./message-channel-controller";
import { MessageChannel } from "../../models/message-channel-model";
export declare class MessageChannelControllerImpl implements MessageChannelController {
    createMessageChannel(serverId: number, name: string): Promise<MessageChannel>;
    updateMessageChannel(id: number, name?: string | undefined): Promise<MessageChannel>;
    deleteMessageChannel(id: number): Promise<MessageChannel>;
}
