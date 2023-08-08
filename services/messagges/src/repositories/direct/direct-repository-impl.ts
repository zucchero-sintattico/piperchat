import { DirectRepository } from "./direct-repository";

export class DirectRepositoryImpl implements DirectRepository {

    getDirectMessages(username: string): Promise<DirectMessage[]> {
        throw new Error("Method not implemented.");
    }
    sendDirectMessage(username: string, message: string): Promise<DirectMessage> {
        throw new Error("Method not implemented.");
    }

}