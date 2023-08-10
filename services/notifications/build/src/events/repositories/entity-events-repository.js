"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityEventsRepository = void 0;
const rabbit_mq_1 = require("@piperchat/commons/src/rabbit-mq");
/**
 * Entity events repository
 * It is responsible for publishing events to the message broker.
 */
class EntityEventsRepository {
    broker;
    getChannel() {
        if (!this.broker) {
            this.broker = rabbit_mq_1.RabbitMQ.getInstance();
        }
        return this.broker.getChannel();
    }
    async publishEntityCreated(entity) {
        const channel = this.getChannel();
        if (channel) {
            channel.publish("entity", "entity.created", Buffer.from(JSON.stringify(entity)));
        }
    }
    async publishEntityUpdated(entity) {
        const channel = this.getChannel();
        if (channel) {
            channel.publish("entity", "entity.updated", Buffer.from(JSON.stringify(entity)));
        }
    }
    async publishEntityDeleted(entity) {
        const channel = this.getChannel();
        if (channel) {
            channel.publish("entity", "entity.deleted", Buffer.from(JSON.stringify(entity)));
        }
    }
}
exports.EntityEventsRepository = EntityEventsRepository;
