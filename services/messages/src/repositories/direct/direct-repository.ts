import { Direct, Message } from "../../models/chat-model";

export interface DirectRepository {

    /**
     * Get direct messages between two users using as pagination the "from" and "limit" query params
     * @param username1
     * @param username2
     * @param from
     * @param limit
     * @returns {Promise<Direct[]>}
     */
    getDirectMessagesPaginated(username1: string, username2: string, from: number, limit: number): Promise<Message[]>;

    /**
     * create a new direct berween two users
     * @param username1
     * @param username2
     * @returns {Promise<void>}
     */
    createDirect(username1: string, username2: string): Promise<void>;

    /**
     * Send a direct message from one user to another
     * @param username1
     * @param username2
     * @param message
     * @throws {Error} if the message is empty
     */
    sendDirectMessage(username1: string, username2: string, message: string): Promise<void>;




}
