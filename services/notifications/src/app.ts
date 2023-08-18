import { RabbitMQ, MongooseUtils } from "@piperchat/commons";
import mongoose from "mongoose";
import { ServiceEvents } from "@events/events";
import { NotificationsServer } from "./server";

// Connections info
const port = Number.parseInt(process.env.PORT!) || 3000;
const amqpUri = process.env.AMQP_URI || "amqp://localhost";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";

// Express app
const app: NotificationsServer = new NotificationsServer(port);

// Start function
const start = async () => {
	// Initialize mongoose
	await MongooseUtils.initialize(mongoose, mongoUri);

	// Initialize RabbitMQ
	await RabbitMQ.initialize(amqpUri);

	// Initialize service events listeners
	await ServiceEvents.initialize();

	app.start(() => {
		console.log(`Started on port: ${port}`);
	});
};

// Start the service
start();
