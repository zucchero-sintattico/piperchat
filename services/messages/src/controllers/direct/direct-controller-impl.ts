import { DirectController } from "./direct-controller";

import { DirectRepository } from "../../repositories/direct/direct-repository";
import { Direct, Message } from "../../models/chat-model";
import { DirectRepositoryImpl } from "../../repositories/direct/direct-repository-impl";

export class DirectControllerImpl implements DirectController {


    private directRepository: DirectRepository = new DirectRepositoryImpl();


    getDirectMessages(username1: string, username2: string): Promise<Message[]> {
        return this.directRepository.getDirectMessages(username1, username2);
    }

    sendDirectMessage(username1: string, username2: string, message: string): Promise<void> {
        return this.directRepository.sendDirectMessage(username1, username2, message);
    }

}