"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEvents = void 0;
const message_repository_1 = require("../repositories/message-repository");
const rabbit_mq_1 = require("@piperchat/commons/src/rabbit-mq");
/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
class ServiceEvents {
    static broker;
    static userRepository = new message_repository_1.MessageRepository();
    static async initialize() {
        this.broker = rabbit_mq_1.RabbitMQ.getInstance();
        await this.declareQueue();
        await this.setupListeners();
    }
    static async declareQueue() {
        const channel = this.broker.getChannel();
        // Declare the exchange
        await channel?.assertExchange("message", "fanout", {
            durable: true,
        });
    }
    static async setupListeners() {
        this.subscribeToExchange("message", async (event, data) => {
            switch (event
            // all messages cases
            ) {
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
