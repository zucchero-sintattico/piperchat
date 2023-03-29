import express from "express";
import mongoose, { Mongoose } from "mongoose";
import amqp from "amqplib";
import { serviceRouter } from "./routes/router";
import { config } from "dotenv";
import { RabbitMQ } from "./utils/rabbit-mq";
import { MongooseUtils } from "./utils/mongoose";

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
	await MongooseUtils.initialize(mongoUri);
	await RabbitMQ.initialize(amqpUri);

	app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});
};

// Start the service
start();
