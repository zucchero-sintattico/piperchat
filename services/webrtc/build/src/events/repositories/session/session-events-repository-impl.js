"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionEventsRepositoryImpl = void 0;
const basic_events_repository_1 = require("@piperchat/commons/src/basic-events-repository");
class SessionEventsRepositoryImpl extends basic_events_repository_1.BasicEventsRepository {
    constructor() {
        super();
        this.getChannel()?.assertExchange("session", "fanout", {
            durable: false,
        });
    }
    async publishUserJoinedSessionEvent(sessionId, username) {
        this.getChannel()?.publish("session", "user_joined_session", Buffer.from(JSON.stringify({ sessionId, username })));
    }
    async publishUserLeftSessionEvent(sessionId, username) {
        this.getChannel()?.publish("session", "user_left_session", Buffer.from(JSON.stringify({ sessionId, username })));
    }
    async publishSessionEndedEvent(sessionId) {
        this.getChannel()?.publish("session", "session_ended", Buffer.from(JSON.stringify({ sessionId })));
    }
    async publishSessionCreatedEvent(sessionId, allowedUsers) {
        this.getChannel()?.publish("session", "session_created", Buffer.from(JSON.stringify({ sessionId, allowedUsers })));
    }
}
exports.SessionEventsRepositoryImpl = SessionEventsRepositoryImpl;
