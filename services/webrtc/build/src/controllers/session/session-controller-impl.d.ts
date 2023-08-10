import { Session } from "../../models/session-model";
import { SessionController } from "./session-controller";
export declare class SessionControllerImpl implements SessionController {
    private sessionRepository;
    createSession(allowedUsers: string[]): Promise<Session>;
    updateSession(id: string, allowedUsers: string[]): Promise<void>;
}
