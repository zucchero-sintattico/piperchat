"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = require("./routes/router");
const dotenv_1 = require("dotenv");
const rabbit_mq_1 = require("./utils/rabbit-mq");
const events_1 = require("./events/events");
// Load environment variables
(0, dotenv_1.config)();
// Express app
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
// Service router
app.use("/", router_1.serviceRouter);
// Connections info
const port = process.env.PORT || 3000;
const amqpUri = process.env.AMQP_URI || "amqp://localhost";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
// Start function
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    // Initialize mongoose
    // await MongooseUtils.initialize(mongoUri);
    // Initialize RabbitMQ
    yield rabbit_mq_1.RabbitMQ.initialize(amqpUri);
    // Initialize service events listeners
    yield events_1.ServiceEvents.initialize();
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
// Start the service
start();
