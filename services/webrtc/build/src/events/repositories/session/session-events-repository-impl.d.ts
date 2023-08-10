import { BasicEventsRepository } from "@piperchat/commons/src/basic-events-repository";
import { SessionEventsRepository } from "./session-events-repository";
export declare class SessionEventsRepositoryImpl extends BasicEventsRepository implements SessionEventsRepository {
    constructor();
    publishUserJoinedSessionEvent(sessionId: string, username: string): Promise<void>;
    publishUserLeftSessionEvent(sessionId: string, username: string): Promise<void>;
    publishSessionEndedEvent(sessionId: string): Promise<void>;
    publishSessionCreatedEvent(sessionId: string, allowedUsers: string[]): Promise<void>;
}
