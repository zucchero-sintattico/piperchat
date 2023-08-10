"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEvents = void 0;
const monitoring_repository_1 = require("../repositories/monitoring-repository");
const rabbit_mq_1 = require("@piperchat/commons/src/rabbit-mq");
/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
class ServiceEvents {
    static broker;
    static monitoringRepository = new monitoring_repository_1.MonitoringRepository();
    static async initialize() {
        this.broker = rabbit_mq_1.RabbitMQ.getInstance();
        await this.declareQueue();
        await this.setupListeners();
    }
    static async declareQueue() {
        const channel = this.broker.getChannel();
        // Declare the exchange
        await channel?.assertExchange("user", "fanout", {
            durable: true,
        });
    }
    static async setupListeners() {
        // One for every service exchanges
        this.subscribeToExchange("user", async (event, data) => {
            switch (event) {
                case "user.created":
                    await this.monitoringRepository.createUserEvent({
                        username: data.username,
                        event: "created",
                    });
                    break;
                case "user.updated":
                    await this.monitoringRepository.createUserEvent({
                        username: data.username,
                        event: "updated",
                    });
                    break;
                case "user.deleted":
                    await this.monitoringRepository.createUserEvent({
                        username: data.username,
                        event: "deleted",
                    });
                    break;
            }
        });
    }
    static async subscribeToExchange(exchange, callback) {
        const channel = this.broker.getChannel();
        const queue = await channel?.assertQueue("", {
            exclusive: true,
        });
        if (!queue) {
            return;
        }
        await channel?.bindQueue(queue.queue, exchange, "");
        channel?.consume(queue.queue, async (message) => {
            if (!message) {
                return;
            }
            const content = message.content.toString();
            const data = JSON.parse(content);
            callback(message.fields.routingKey, data);
        });
    }
}
exports.ServiceEvents = ServiceEvents;
