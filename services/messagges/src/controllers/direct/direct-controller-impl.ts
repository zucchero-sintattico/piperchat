import { DirectController } from "./direct-controller";
import { DirectMessage } from "../../../../commons/models/direct/direct-message";

export class DirectControllerImpl implements DirectController {
    getDirectMessages(username: string): Promise<DirectMessage[]> {
        throw new Error("Method not implemented.");
    }
    sendDirectMessage(username: string, message: string): Promise<DirectMessage> {
        throw new Error("Method not implemented.");
    }

}