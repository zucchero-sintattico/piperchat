import { Message, Server, MessageChannel } from "@models/messages-model";

export interface ChannelRepository {

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
     * Get paginated messages in a channel
     * @param channelId
     * @param serverId
     * @param from
     * @param limit
     * @returns {Promise<Message[]>}
     */
    getChannelMessagesPaginated(channelId: string, serverId: string, from: number, limit: number): Promise<Message[]>;

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