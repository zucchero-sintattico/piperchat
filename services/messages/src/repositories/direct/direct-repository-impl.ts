import { DirectRepository } from "./direct-repository";
import { Directs, Message } from "../../models/chat-model";

export class DirectRepositoryImpl implements DirectRepository {

    async getDirectMessages(username1: string, username2: string): Promise<Message[]> {
        throw new Error("Method not implemented.");
    }

    async sendDirectMessage(username1: string, username2: string, message: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
}