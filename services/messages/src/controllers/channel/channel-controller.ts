import { Message, MessageChannel } from "../../models/messages-model";

export interface ChannelController {

    /**
     * Get all the channels in a server
     * @param serverId
     * @returns {Promise<MessageChannel[]>}
     */
    getChannels(serverId: string): Promise<MessageChannel[]>;


    /**
     * Create a new channel
     * @param serverId
     * @param channelId
     * @returns {Promise<void>}
     */
    createChannel(serverId: string, channelId: string): Promise<void>;


    /**
     * Delete a channel
     * @param channelId
     * @param serverId
     * @returns {Promise<void>}
     */
    deleteChannel(channelId: string, serverId: string): Promise<void>;

    /**
     * Get channel information
     * @param channelId
     * @param serverId
     * @returns {Promise<MessageChannel>}
     */
    getChannel(channelId: string, serverId: string): Promise<MessageChannel>;

    /**
     * Get all the messages in a channel
     * @param channelId
     * @param serverId
     * @returns {Promise<Message[]>}
     */
    getMessages(channelId: string, serverId: string): Promise<Message[]>;

    /**
     * Send a message in a channel
     * @param channelId
     * @param serverId
     * @param sender
     * @param content
     * @returns {Promise<void>}
     */
    sendMessage(channelId: string, serverId: string, sender: string, content: string): Promise<void>;


}

export class ChannelControllerExceptions {
    static ServerNotFound = class extends Error { };
    static UserNotAuthorized = class extends Error { };
    static ChannelAlreadyExists = class extends Error { };
    static ChannelNotFound = class extends Error { };
}