import express from "express";
import { config } from "dotenv";
import { RabbitMQ } from "./utils/rabbit-mq";
import { MongooseUtils } from "./utils/mongoose";
import { ServiceEvents } from "./events/events";
import { WebRTCServer } from "./server";

// Load environment variables
config();

// Connections info
const port = Number.parseInt(process.env.PORT!) || 3000;
const amqpUri = process.env.AMQP_URI || "amqp://localhost:5672/";
const mongoUri =
	process.env.MONGO_URI ||
	"mongodb://db-users-service-username:db-users-service-password@localhost:27017/db-users-service-database?authSource=admin";

// Start function
const start = async () => {
	// Initialize mongoose
	await MongooseUtils.initialize(mongoUri);

	// Initialize RabbitMQ
	await RabbitMQ.initialize(amqpUri);

	// Initialize service events listeners
	await ServiceEvents.initialize();

	// Express app
	const app: WebRTCServer = new WebRTCServer(port);

	app.start(() => {
		console.log(`Started on port: ${port}`);
	});
};

// Start the service
start();
