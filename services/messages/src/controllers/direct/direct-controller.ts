import { Message } from "@models/messages-model";

export interface DirectController {

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
     * Send a direct message from one user to another
     * @param username1
     * @param username2
     * @param message
    */
    sendDirectMessage(username1: string, username2: string, message: string): Promise<void>;

}