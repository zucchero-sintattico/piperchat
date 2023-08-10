import { Session, UserInSession } from "../../models/session-model";
import { SessionRepository } from "./session-repository";
export declare class SessionRepositoryImpl implements SessionRepository {
    removeUserFromSession(sessionId: string, username: string): Promise<void>;
    getSocketIdBySessionIdAndUsername(sessionId: string, username: string): Promise<string>;
    getSessionById(id: string): Promise<Session>;
    createNewSession(allowedUsers: string[]): Promise<Session>;
    addNewUserToSession(sessionId: string, username: string, socketId: string): Promise<void>;
    getUsersInSession(sessionId: string): Promise<UserInSession[]>;
    updateSessionAllowedUsers(sessionId: string, allowedUsers: string[]): Promise<void>;
}
