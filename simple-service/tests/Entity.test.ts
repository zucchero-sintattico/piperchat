import { describe } from "node:test";
import supertest from "supertest";
import { SimpleServiceServer } from "../src/server";
import { EntityApi } from "./api/entity-api";

const server = new SimpleServiceServer(3000);

let entityApi: EntityApi;

beforeAll(async () => {
	await server.start();
	entityApi = new EntityApi(supertest(server.server));
});

afterAll(async () => {
	server.stop();
});

describe("/entities", () => {
	it("should return 200", async () => {
		const response = await entityApi.getAllEntities();
		expect(response.status).toBe(200);
	});
});
