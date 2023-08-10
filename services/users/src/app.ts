import { MongooseUtils } from "@commons/mongoose-utils";
import { RabbitMQ } from "@commons/rabbit-mq";
import { ServiceEvents } from "@events/events";
import { UsersServer } from "@/server";
import mongoose from "mongoose";

const start = async (configuration: any) => {
	// Initialize mongoose
	await MongooseUtils.initialize(mongoose, configuration.mongoUri);

	// Initialize RabbitMQ
	await RabbitMQ.initialize(configuration.amqpUri);

	// Initialize service events listeners
	await ServiceEvents.initialize();

	// Express app
	const app: UsersServer = new UsersServer(configuration.port);

	app.start(() => {
		console.log(`Started on port: ${configuration.port}`);
	});
};

// Connections info
const configuration = {
	port: Number.parseInt(process.env["PORT"]!) || 3000,
	amqpUri: process.env["AMQP_URI"] || "amqp://localhost:5672",
	mongoUri: process.env["MONGO_URI"] || "mongodb://localhost:27017",
};

// Start the service
start(configuration);
