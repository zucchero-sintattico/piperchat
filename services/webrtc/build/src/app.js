"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const rabbit_mq_1 = require("@piperchat/commons/src/rabbit-mq");
const mongoose_1 = require("@piperchat/commons/src/mongoose");
const events_1 = require("./events/events");
const server_1 = require("./server");
const mongoose_2 = __importDefault(require("mongoose"));
const MongooseUtils = (0, mongoose_1.MongooseUtilsSetup)(mongoose_2.default);
// Start function
const start = async (configuration) => {
    // Initialize mongoose
    await MongooseUtils.initialize(configuration.mongoUri);
    // Initialize RabbitMQ
    await rabbit_mq_1.RabbitMQ.initialize(configuration.amqpUri);
    // Initialize service events listeners
    await events_1.ServiceEvents.initialize();
    // Express app
    const app = new server_1.WebRTCServer(configuration.port);
    app.start(() => {
        console.log(`Started on port: ${configuration.port}`);
    });
};
// Connections info
const configuration = {
    port: Number.parseInt(process.env.PORT) || 3000,
    amqpUri: process.env.AMQP_URI || "amqp://localhost:5672",
    mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017",
};
// Start the service
start(configuration);
