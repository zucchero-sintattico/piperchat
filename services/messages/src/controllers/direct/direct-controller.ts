import { DirectRepository } from "../../repositories/direct/direct-repository";
import { Direct, Message } from "../../models/chat-model";

export interface DirectController {

    /**
     * Get all direct messages between two users
     * @param username1
     * @param username2
     * @returns {Message<Direct[]>}
     */
    getDirectMessages(username1: string, username2: string): Promise<Message[]>;

    /**
     * Send a direct message from one user to another
     * @param username1
     * @param username2
     * @param message
    */
    sendDirectMessage(username1: string, username2: string, message: string): Promise<void>;

}