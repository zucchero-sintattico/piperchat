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
     * @param name
     * @param channelType
     * @param descripition
     * @returns {Promise<MessageChannel>}
     */
    createChannel(serverId: string, name: string, channelType: string, description: string): Promise<MessageChannel>;


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
     * Modify channel information
     * @param channelId
     * @param serverId
     * @param name
     * @param description
     */
    modifyChannel(channelId: string, serverId: string, name: string, description: string): Promise<void>;

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