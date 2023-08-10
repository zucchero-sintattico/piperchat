import { DirectController } from "./direct-controller";

import { DirectRepository } from "../../repositories/direct/direct-repository";
import { Direct, Message } from "../../models/chat-model";
import { DirectRepositoryImpl } from "../../repositories/direct/direct-repository-impl";

export class DirectControllerImpl implements DirectController {


    private directRepository: DirectRepository = new DirectRepositoryImpl();

    async getDirectMessagesPaginated(username1: string, username2: string, from: number, limit: number): Promise<Message[]> {
        return this.directRepository.getDirectMessagesPaginated(username1, username2, from, limit);
    }


    sendDirectMessage(username1: string, username2: string, message: string): Promise<void> {
        return this.directRepository.sendDirectMessage(username1, username2, message);
    }

}