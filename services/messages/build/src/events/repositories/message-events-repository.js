"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageEventsRepository = void 0;
const basic_events_repository_1 = require("@piperchat/commons/src/basic-events-repository");
/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
class MessageEventsRepository extends basic_events_repository_1.BasicEventsRepository {
    async publishNewMessage(user) {
        const channel = this.getChannel();
        channel?.publish("message", "user.new", Buffer.from(JSON.stringify(user)));
    }
}
exports.MessageEventsRepository = MessageEventsRepository;
