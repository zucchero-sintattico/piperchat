import express from "express";
import { serviceRouter } from "./routes/router";
import { config } from "dotenv";
import { RabbitMQ } from "./utils/rabbit-mq";
import { MongooseUtils } from "./utils/mongoose";
import { ServiceEvents } from "./events/events";

// Load environment variables
config();

// Express app
const app = express();

// Middleware
app.use(express.json());

// Service router
app.use("/", serviceRouter);

// Connections info
const port = process.env.PORT || 3000;
const amqpUri = process.env.AMQP_URI || "amqp://localhost";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";

// Start function
const start = async () => {
	// Initialize mongoose
	await MongooseUtils.initialize(mongoUri);

	// Initialize RabbitMQ
	await RabbitMQ.initialize(amqpUri);

	// Initialize service events listeners
	await ServiceEvents.initialize();

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

// Start the service
start();
