import { RabbitMQ } from "./utils/rabbit-mq";
import { MongooseUtils } from "./utils/mongoose";
import { ServiceEvents } from "./events/events";
import { UsersServer } from "./server";

const start = async (configuration: any) => {
	// Initialize mongoose
	await MongooseUtils.initialize(configuration.mongoUri);

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
	port: Number.parseInt(process.env.PORT!) || 3000,
	amqpUri: process.env.AMQP_URI || "amqp://localhost:5672/",
	mongoUri:
		process.env.MONGO_URI ||
		"mongodb://db-users-service-username:db-users-service-password@localhost:27017/db-users-service-database?authSource=admin",
};

// Start the service
start(configuration);
