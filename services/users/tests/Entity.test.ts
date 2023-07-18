import { describe } from "node:test";
import supertest from "supertest";
import { UsersServer } from "../src/server";
import { UserApi } from "./api/entity-api";
import { MongooseUtils } from "../src/utils/mongoose";
import { RabbitMQ } from "../src/utils/rabbit-mq";
import { ServiceEvents } from "../src/events/events";

const server = new UsersServer(3000);

let entityApi: UserApi;

beforeAll(async () => {
	const port = Number.parseInt(process.env.PORT!) || 3000;
	const amqpUri = process.env.AMQP_URI || "amqp://localhost:5672/";
	const mongoUri =
		process.env.MONGO_URI ||
		"mongodb://db-users-service-username:db-users-service-password@localhost:27017/db-users-service-database?authSource=admin";
	// Initialize mongoose
	await MongooseUtils.initialize(mongoUri);

	// Initialize RabbitMQ
	await RabbitMQ.initialize(amqpUri);

	// Initialize service events listeners
	await ServiceEvents.initialize();
	await server.start();
	entityApi = new UserApi(supertest(server.server));
});

afterAll(async () => {
	server.stop();
	await MongooseUtils.close();
	await RabbitMQ.close();
});

describe("/users", () => {
	it("should return 200", async () => {
		const response = await entityApi.getAllEntities();
		expect(response.status).toBe(200);
	});
});
