import { Direct, Message } from "../../models/chat-model";

export interface DirectRepository {

    /**
     * Get all direct messages between two users
     * @param username1
     * @param username2
     * @returns {Promise<Direct[]>}
     */
    getDirectMessages(username1: string, username2: string): Promise<Message[]>;

    /**
     * Send a direct message from one user to another
     * @param username1
     * @param username2
     * @param message
     * @throws {Error} if the message is empty
     */
    sendDirectMessage(username1: string, username2: string, message: string): Promise<void>;



}
