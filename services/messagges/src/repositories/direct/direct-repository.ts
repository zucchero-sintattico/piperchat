import { DirectController } from "../../controllers/direct/direct-controller";

export interface DirectRepository {
    /**
     * Get all direct messages from a user
     * @param username The username of the user
     * @returns A list of direct messages
     * @throws UserNotFound
     * @throws InternalServerError
     */
    getDirectMessages(username: string): Promise<DirectMessage[]>;

    /**
     * Send a direct message to a user
     * @param username The username of the user
     * @param message The message to send
     * @param timecreated The time of the message
     */
    sendDirectMessage(username: string, message: string): Promise<DirectMessage>;

    /**
     * Get all direct messages from a user
     * @param username The username of the user
     * @returns A list of direct messages
     * @throws UserNotFound
     * @throws InternalServerError
     */
    getDirectMessages(username: string): Promise<DirectMessage[]>;
}