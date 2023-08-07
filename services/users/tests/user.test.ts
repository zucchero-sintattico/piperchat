import { describe } from "node:test";
import supertest from "supertest";
import { UsersServer } from "../src/server";
import { UserApi } from "./api/user-api";
import { MongooseUtils } from "../src/utils/mongoose";
import { RabbitMQ } from "../src/utils/rabbit-mq";
import { ServiceEvents } from "../src/events/events";
import e from "express";

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

describe("/friends", () => {
	it("should return 200", async () => {
		await entityApi.register("test0", "test0", "test0");
		await entityApi.login("test0", "test0");
		const response = await entityApi.getAllFriends();
		expect(response.status).toBe(200);
		await entityApi.deleteUser("test0");
	});
});

//sent friend request 
describe("/friends/requests", () => {
	it("send frends requests", async () => {
		await entityApi.register("test0", "test0", "test0");
		await entityApi.register("test1", "test1", "test1");
		await entityApi.login("test0", "test0");
		const response = await entityApi.sendFriendRequest("test1");
		expect(response.status).toBe(200);
		await entityApi.deleteUser("test0");
		await entityApi.login("test1", "test1");
		await entityApi.deleteUser("test1");
	});
}
);




//check if the user is in the friends list
describe("/friends", () => {
	it("should return 200", async () => {
		await entityApi.register("test0", "test0", "test0");
		await entityApi.register("test1", "test1", "test1");
		await entityApi.login("test0", "test0");
		await entityApi.sendFriendRequest("test1");
		await entityApi.login("test1", "test1");
		await entityApi.acceptFriendRequest("test0");
		const response = await entityApi.getAllFriends();
		expect(response.body.friends).toContain("test0");
		await entityApi.deleteUser("test1");
		await entityApi.login("test0", "test0");
		await entityApi.deleteUser("test0");
	});
}


);

