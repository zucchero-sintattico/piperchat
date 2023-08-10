"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const rabbit_mq_1 = require("@piperchat/commons/src/rabbit-mq");
const mongoose_1 = require("@piperchat/commons/src/mongoose");
const events_1 = require("./events/events");
const server_1 = require("./server");
const mongoose_2 = __importDefault(require("mongoose"));
const MongooseUtils = (0, mongoose_1.MongooseUtilsSetup)(mongoose_2.default);
// Load environment variables
(0, dotenv_1.config)();
// Connections info
const port = Number.parseInt(process.env.PORT) || 3000;
const amqpUri = process.env.AMQP_URI || "amqp://localhost";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
// Express app
const app = new server_1.MonitoringServer(port);
// Start function
const start = async () => {
    // Initialize mongoose
    await MongooseUtils.initialize(mongoUri);
    // Initialize RabbitMQ
    await rabbit_mq_1.RabbitMQ.initialize(amqpUri);
    // Initialize service events listeners
    await events_1.ServiceEvents.initialize();
    app.start(() => {
        console.log(`Started on port: ${port}`);
    });
};
// Start the service
start();
