"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceEvents = void 0;
const session_repository_impl_1 = require("../repositories/session/session-repository-impl");
const rabbit_mq_1 = require("@piperchat/commons/src/rabbit-mq");
/**
 * Service events
 * It is responsible for listening to events from the message broker.
 * It is also responsible for handling the events.
 * It is also responsible for updating the database.
 */
class ServiceEvents {
    static broker;
    static sessionRepository = new session_repository_impl_1.SessionRepositoryImpl();
    static async initialize() {
        this.broker = rabbit_mq_1.RabbitMQ.getInstance();
        await this.declareQueue();
        await this.setupListeners();
    }
    static async declareQueue() {
        // Declare queue
        /*
        this.broker.getChannel()?.assertQueue("entity.entity.created", {
            durable: true,
        });
        */
    }
    static async setupListeners() {
        // Setup listeners
        /*
        this.broker.getChannel()?.consume("entity.entity.created", (msg) => {
            if (msg) {
                console.log("Entity created", msg.content.toString());
                this.broker.getChannel()?.ack(msg);
                this.entityRepository.createEntity(JSON.parse(msg.content.toString()));
            }
        });
        */
    }
}
exports.ServiceEvents = ServiceEvents;
