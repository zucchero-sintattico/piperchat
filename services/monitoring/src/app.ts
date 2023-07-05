import express from "express";
import { serviceRouter } from "./routes/router";
import { config } from "dotenv";
import { RabbitMQ } from "./utils/rabbit-mq";
import { MongooseUtils } from "./utils/mongoose";
import { ServiceEvents } from "./events/events";
import { MonitoringServer } from "./server";

// Load environment variables
config();

// Connections info
const port = Number.parseInt(process.env.PORT!) || 3000;
const amqpUri = process.env.AMQP_URI || "amqp://localhost";
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";

// Express app
const app: MonitoringServer = new MonitoringServer(port);

// Start function
const start = async () => {
	// Initialize mongoose
	await MongooseUtils.initialize(mongoUri);

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
